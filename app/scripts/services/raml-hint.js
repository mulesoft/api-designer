'use strict';

angular.module('ramlEditorApp')
  /**
   * Returns array of lines (including specified)
   * at the same level as line at <lineNumber>.
   *
   * If <lineNumber> is not specified, current line
   * under cursor will be used.
   */
  .factory('getNeighborLines', function (getLineIndent, isArrayStarter) {
    return function (editor, lineNumber) {
      if (typeof lineNumber !== 'number') {
        lineNumber = editor.getCursor().line;
      }

      var lineNumbers = [lineNumber];
      var line        = editor.getLine(lineNumber).slice(0, editor.getCursor().ch + 1);
      var lineIndent  = getLineIndent(line);
      var lineIsArray = isArrayStarter(line);
      var linesCount  = editor.lineCount();
      var i;
      var nextLine;
      var nextLineIndent;

      // lines above specified
      for (i = lineNumber - 1; i >= 0; i--) {
        nextLine       = editor.getLine(i);
        nextLineIndent = getLineIndent(nextLine);

        if (nextLineIndent.tabCount !== lineIndent.tabCount) {
          // level is decreasing, no way we can get back
          if (nextLineIndent.tabCount < lineIndent.tabCount) {
            if (!lineIsArray && isArrayStarter(nextLine) && ((nextLineIndent.tabCount + 1) === lineIndent.tabCount)) {
              lineNumbers.push(i);
            }

            break;
          }

          // level is increasing, but we still can get back
          continue;
        } else if (isArrayStarter(nextLine)) {
          break;
        }

        lineNumbers.push(i);
      }

      // lines below specified
      for (i = lineNumber + 1; i < linesCount; i++) {
        nextLine       = editor.getLine(i);
        nextLineIndent = getLineIndent(nextLine);

        if (nextLineIndent.tabCount !== lineIndent.tabCount) {
          // level is decreasing, no way we can get back
          if (nextLineIndent.tabCount < lineIndent.tabCount) {
            break;
          }

          if (!lineIsArray || (nextLineIndent.tabCount !== (lineIndent.tabCount + 1))) {
            // level is increasing, but we still can get back
            continue;
          }
        } else if (isArrayStarter(nextLine)) {
          break;
        }

        lineNumbers.push(i);
      }

      return lineNumbers.sort().map(function (lineNumber) {
        return editor.getLine(lineNumber);
      });
    };
  })
  .factory('getNeighborKeys', function (getNeighborLines, extractKeyValue) {
    return function (editor) {
      return getNeighborLines(editor).map(function (line) {
        return extractKeyValue(line).key;
      });
    };
  })
  .factory('ramlHint', function ramlHintFactory(generateTabs, getNeighborKeys, getTabCount,
                                                getScopes, getEditorTextAsArrayOfLines, getNode) {
    var hinter = {};
    var RAML_VERSION = '#%RAML 0.8';
    var RAML_VERSION_PATTERN = new RegExp('^\\s*' + RAML_VERSION + '\\s*$', 'i');

    hinter.suggestRAML = window.suggestRAML;

    hinter.getScopes = function (editor) {
      return getScopes(getEditorTextAsArrayOfLines(editor));
    };

    hinter.shouldSuggestVersion = function (editor) {
      var lineNumber    = editor.getCursor().line;
      var line          = editor.getLine(lineNumber);
      var lineIsVersion = RAML_VERSION_PATTERN.test(line);

      return lineNumber === 0 &&
            !lineIsVersion
      ;
    };

    /**
     * @param suggestionKey The key to consider suggestion to the user
     * @param suggestion The suggestion metadata for the key
     * @param nodes The nodes to check for the suggestion
     * @returns {boolean} Whether the suggestion is in use
     */
    hinter.isSuggestionInUse = function (suggestionKey, suggestion, nodes) {
      var values = suggestion.metadata.isText ?
        nodes.map(function (node) { return node.getValue() ? node.getValue().text : null; })
        : nodes.map(function (node) { return node.getKey(); });

      return values.indexOf(suggestionKey) !== -1 ||
        //For key suggestions, e.g. where isText is not true, we also check for the key + '?'
        //if the suggestion can be optional:
        (!suggestion.metadata.isText &&
          suggestion.metadata.canBeOptional &&
          values.indexOf(suggestionKey + '?') !== -1);
    };

    /**
     * @param editor The RAML editor
     * @returns {{key, metadata {category, isText}}} Where keys are the RAML node names, and metadata
     *          contains extra information about the node, such as its category
     */
    hinter.getSuggestions = function getSuggestions(editor) {
      if (hinter.shouldSuggestVersion(editor)) {
        return [{
          key:     '#%RAML 0.8',
          metadata: {
            category: 'main',
            isText:   true
          }
        }];
      }

      //Pivotal 61664576: We use the DOM API to check to see if the current node or any
      //of its parents contains a YAML reference. If it does, then we provide no suggestions.
      var node = getNode(editor);
      var refNode = node.selfOrParent(function(node) { return node.getValue() && node.getValue().isReference; });
      if (refNode) {
        return [];
      }

      //Designer policy: If the cursor is at an empty line, then we
      //provide shelf contents based on the node only. If the cursor is
      //on a non-structural line, such as an empty line, then we provide
      //shelf contents based on the tab level of the node.
      if (node.isEmpty) {
        var ch = editor.getCursor().ch;
        var cursorTabCount = getTabCount(ch);
        if (cursorTabCount <= node.lineIndent.tabCount) {
          var atTabBoundary = ch % editor.getOption('indentUnit') === 0;
          if (!atTabBoundary) {
            return [];
          }
        }
        cursorTabCount = Math.min(cursorTabCount, node.lineIndent.tabCount);
        node = node.selfOrParent(function(node) { return node.lineIndent.tabCount === cursorTabCount; });
      }

      var raml = null;
      var suggestions = [];
      var peerNodes = [];
      
      if (node) {
        var path = node.getPath().map(function(node) { return node.getKey(); });
        raml         = hinter.suggestRAML(path);
        suggestions  = raml.suggestions;
        var isText = Object.keys(suggestions).some(function(suggestion) { return suggestions[suggestion].metadata.isText; });
        //Get all structural nodes' keys/values so we can filter them out. This bit is tricky; if
        //we are in an array, and the elements of that array are text, then the peer group is
        //every array in the parent. Otherwise, the peer group is every key in the current array.
        var isTextNodeList = raml.metadata && raml.metadata.isList && isText;
        peerNodes = isTextNodeList ? node.getParent().getChildren() : node.getSelfAndNeighbors();
        peerNodes = peerNodes.filter(function(node) { return node.isStructural; });
      }

      //Next, filter out the keys from the returned suggestions
      suggestions = Object.keys(suggestions)
        .filter(function (key) { return !hinter.isSuggestionInUse(key, suggestions[key], peerNodes); })
        .sort()
        .map(function (key) {
          return {
            key:      key,
            metadata: suggestions[key].metadata
          };
        });
      //Pull out display-relevant metadata
      suggestions.isList = (raml && raml.metadata) ? raml.metadata.isList : false;
      return suggestions;
    };

    hinter.canAutocomplete = function (cm) {
      var cursor         = cm.getCursor();
      var curLine        = cm.getLine(cursor.line);
      var curLineTrimmed = curLine.trim();
      var offset         = curLine.indexOf(curLineTrimmed);
      var lineNumber     = cursor.line;

      // nothing to autocomplete within comments
      // -> "#..."
      if ((function () {
        var indexOf = curLineTrimmed.indexOf('#');
        return lineNumber > 0 &&
               indexOf !== -1 &&
               cursor.ch > (indexOf + offset)
        ;
      })()) {
        return false;
      }

      // nothing to autocomplete within resources
      // -> "/..."
      if ((function () {
        var indexOf = curLineTrimmed.indexOf('/');
        return indexOf === 0 &&
               cursor.ch >= (indexOf + offset)
        ;
      })()) {
        return false;
      }

      // nothing to autocomplete for key value
      // -> "key: ..."
      if ((function () {
        var indexOf = curLineTrimmed.indexOf(': ');
        return indexOf !== -1 &&
               cursor.ch >= (indexOf + offset + 2)
        ;
      })()) {
        return false;
      }

      // nothing to autocomplete prior array
      // -> "...- "
      if ((function () {
        var indexOf = curLineTrimmed.indexOf('- ');
        return indexOf === 0 &&
               cursor.ch < (indexOf + offset)
        ;
      })()) {
        return false;
      }

      return true;
    };

    hinter.autocompleteHelper = function(cm) {
      var cursor       = cm.getCursor();
      var line         = cm.getLine(cursor.line);
      var word         = line.trimLeft();
      var wordIsKey;
      var suggestions;
      var list;
      var fromCh;
      var toCh;
      var render       = function (element, self, data) {
        element.innerHTML = [
          '<div>',
          data.displayText,
          '</div>',
          '<div class="category">',
          data.category,
          '</div>'
        ].join('');
      };

      if (hinter.canAutocomplete(cm)) {
        suggestions = hinter.getSuggestions(cm);
      } else {
        return;
      }

      // handle comment (except RAML tag)
      (function () {
        var indexOf = word.indexOf('#');
        if (indexOf !== -1) {
          if (cursor.line !== 0 || indexOf !== 0) {
            word = word.slice(0, indexOf);
          }
        }
      })();

      // handle array
      if (word.indexOf('- ') === 0) {
        word = word.slice(2);
      }

      // handle map and extract key
      (function () {
        var match = word.match(/:(?:\s|$)/);
        if (match) {
          word      = word.slice(0, match.index);
          wordIsKey = true;
        }
      })();

      function notDynamic(suggestion) {
        return !suggestion.metadata.dynamic;
      }

      word = word.trim();
      list = suggestions.filter(notDynamic).map(function (suggestion) {
        var text = suggestion.key;

        if (!suggestion.metadata.isText && !wordIsKey) {
          text = text + ':';
        }

        return {
          displayText: text,
          text:        text,
          category:    suggestion.metadata.category,
          render:      render
        };
      });

      if (word) {
        list = list.filter(function (e) {
          return e.text.indexOf(word) === 0 &&
                 e.text.length !== word.length
          ;
        });
      }

      if (word) {
        fromCh = line.indexOf(word);
        toCh   = fromCh + word.length;
      } else {
        fromCh = cursor.ch;
        toCh   = fromCh;
      }

      return {
        word: word,
        list: list,
        from: CodeMirror.Pos(cursor.line, fromCh),
        to:   CodeMirror.Pos(cursor.line, toCh)
      };
    };

    return hinter;
  });
