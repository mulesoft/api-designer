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
  .factory('getNeighborKeys', function (getNeighborLines, extractKey) {
    return function (editor) {
      return getNeighborLines(editor).map(extractKey);
    };
  })
  .factory('ramlHint', function ramlHintFactory(getLineIndent, generateTabs, getNeighborKeys, getTabCount,
                                                getScopes, getEditorTextAsArrayOfLines, getNode) {
    var hinter = {};
    var RAML_VERSION = '#%RAML 0.8';
    var RAML_VERSION_PATTERN = new RegExp('^\\s*' + RAML_VERSION + '\\s*$', 'i');

    hinter.suggestRAML = window.suggestRAML;

    hinter.computePath = function (editor, line) {
      var cursor = editor.getCursor();
      line = line || cursor.line;
      var ch = cursor.ch;
      var listsTraveled = 0;
      var lastTraveledListSpaceCount;
      var lines;
      var textAsList;
      var rootIsFound;

      if (line === 0) {
        return null;
      }

      textAsList = getEditorTextAsArrayOfLines(editor).slice(0, line + 1).reverse();
      //If the line is all whitespace, remove anything to the right of the cursor
      if (textAsList[0].trim() === '') {
        textAsList[0] = textAsList[0].slice(0, ch);
      }

      // It should have at least one element
      if (!textAsList.length) {
        return [];
      }

      lastTraveledListSpaceCount = getLineIndent(textAsList[0]).spaceCount;
      //Provide no suggestions if we are not at a tab boundary
      if ((lastTraveledListSpaceCount % editor.getOption('indentUnit')) !== 0) {
        return;
      }

      lines = textAsList
        .filter(function (line, index) {
          var spaceCount;

          // current line is good
          if (index === 0) {
            return true;
          }

          // comments are good
          if (line.trimLeft().indexOf('#') === 0) {
            return true;
          }

          // lines with bigger indentation are not good
          spaceCount = getLineIndent(line).spaceCount;
          if (spaceCount > lastTraveledListSpaceCount) {
            return false;
          }

          // lines after root are not good
          if (rootIsFound) {
            return false;
          }

          // lines with indentation are good until we find the root
          if (spaceCount) {
            return true;
          }

          rootIsFound = true;

          return true;
        })
        .map(function (line, index) {
          var result         = {};
          var lineIndentInfo = getLineIndent(line);
          var listMatcher;

          result.tabCount = lineIndentInfo.tabCount;
          line = lineIndentInfo.content;

          listMatcher = /^(- )(.*)$/.exec(line) || {index: -1};

          // case is a list
          if (listMatcher.index === 0) {
            result.isList = true;
            line = listMatcher[2];

            if (index === 0 || lineIndentInfo.spaceCount < lastTraveledListSpaceCount) {
              listsTraveled++;
              lastTraveledListSpaceCount = lineIndentInfo.spaceCount;
            }
          }

          line = /^(.+)(: |:\s*$)/.exec(line);

          result.content = line ? line[1] : '';

          return result;
        })
      ;

      var result = lines.slice(1).reduce(function (state, lineData) {
        var prev = state[state.length - 1];

        // Ignore line if greater in tabs
        if (lineData.tabCount >= prev.tabCount) {
          return state;
        } else if (lineData.tabCount === prev.tabCount - 1) {
          if (lineData.isList) {
            prev.isList = true;
            return state;
          }
        }

        state.push(lineData);

        return state;
      }, [lines[0]]);

      result = result.slice(1).reduce(function (state, lineData) {
        if (state.path[0].tabCount > lineData.tabCount + 1) {
          if (!state.path[0].isList && !lineData.isList) {
            state.invalid = true;
          }
        }
        state.path.unshift(lineData);
        return state;
      }, {invalid: false, path: [result[0]]});

      if (result.invalid) {
        return;
      }

      var path = result.path.map(function (e) {
        return e.content;
      });
      path.listsTraveled = listsTraveled;

      return path;
    };

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

    hinter.isSuggestionInUse = function (suggestionKey, suggestion, neighborKeys) {
      return neighborKeys.indexOf(suggestionKey) !== -1 ||
             (suggestion.metadata.canBeOptional && neighborKeys.indexOf(suggestionKey + '?') !== -1)
      ;
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
      var refNode = node.selfOrParent(function(node) { return node.value && node.value.isReference; });
      if (refNode) {
        return [];
      }

      var raml = null;
      var suggestions = [];
      var neighborKeys = [];

      //Get the node at the cursor level. Note that if the node is at a smaller indent
      //than the node, we use its indent instead. That way, if the cursor is at the end
      //of the node, for example, we don't use too a high a tab.
      var ch = editor.getCursor().ch;
      var cursorTabCount = getTabCount(ch);
      if (cursorTabCount <= node.tabCount) {
        var atTabBoundary = ch % editor.getOption('indentUnit') === 0;
        if (!atTabBoundary) {
          return suggestions;
        }
      }

      cursorTabCount = Math.min(cursorTabCount, node.tabCount);
      node = node.selfOrParent(function(node) { return node.tabCount === cursorTabCount; });

      if (node) {
        var path = node.getPath().map(function(node) { return node.key; });
        raml         = hinter.suggestRAML(path.slice(0, -1)); //<- Slice off the last element of the path
        suggestions  = raml.suggestions;
        //Get all structural nodes' keys so we can filter them out
        neighborKeys = node.getSelfAndNeighbors()
                      .filter(function(node) { return node.getIsStructural() && node.key; })
                      .map(function (node) { return node.key; });
      }

      //Next, filter out the keys from the returned suggestions
      suggestions = Object.keys(suggestions)
        .filter(function (key) { return !hinter.isSuggestionInUse(key, suggestions[key], neighborKeys); })
        .sort()
        .map(function (key) {
          return {
            key:      key,
            metadata: suggestions[key].metadata
          };
        });
      //Pull out display-relevant metadata
      suggestions.isList = raml && raml.metadata ? raml.metadata.isList : false;
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
  })
;
