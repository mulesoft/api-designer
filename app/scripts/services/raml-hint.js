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
        } else if (lineIsArray && isArrayStarter(nextLine)) {
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
  .factory('ramlHint', function (getLineIndent, generateTabs, getNeighborKeys,
    getScopes, getEditorTextAsArrayOfLines, isArrayStarter, extractKey) {
    var hinter = {};
    var RAML_VERSION = '#%RAML 0.8';
    var RAML_VERSION_PATTERN = new RegExp('^\\s*' + RAML_VERSION + '\\s*$', 'i');

    hinter.suggestRAML = window.suggestRAML;

    hinter.computePath = function computePath(editor) {
      function isWhitespaceOnly(line, indent) {
        return line.length === indent.spaceCount;
      }

      function isCommentStarter(line, indent) {
        return line[indent.spaceCount] === '#';
      }

      function hasParentIsh(lineNumber, lineIndent) {
        while ((lineNumber -= 1) >= 0) {
          var parentLine       = editor.getLine(lineNumber);
          var parentLineIndent = getLineIndent(parentLine);

          if (
            isWhitespaceOnly(parentLine, parentLineIndent) ||
            isCommentStarter(parentLine, parentLineIndent)
          ) {
            continue;
          }

          // that's why we called "-ish" because
          // we count on spaces, not tabs
          if (parentLineIndent.spaceCount < lineIndent.spaceCount) {
            return true;
          }
        }

        return false;
      }

      function indentIsInvalid(indent) {
        return (indent.spaceCount % editor.getOption('indentUnit')) !== 0;
      }

      var path           = [];
      var arraysTraveled = 0;
      var cursor         = editor.getCursor();
      var line           = editor.getLine(cursor.line);
      var lineIndent     = getLineIndent(line);
      var tabCount       = lineIndent.tabCount;
      var lastLine       = line;
      var lastTabCount   = tabCount;
      var tabCountDiff;

      if (
        isWhitespaceOnly(line, lineIndent) ||
        isCommentStarter(line, lineIndent) && (cursor.ch < line.indexOf('#'))
      ) {
        // in case current line has only whitespaces we want to know
        // its indentation up to cursor position
        line         = line.slice(0, cursor.ch);
        lineIndent   = getLineIndent(line);
        tabCount     = lineIndent.tabCount;
        lastLine     = line;
        lastTabCount = tabCount;
      }

      if (
        (!isCommentStarter(line, lineIndent) || hasParentIsh(cursor.line, lineIndent)) &&
        indentIsInvalid(lineIndent)
      ) {
        return;
      }

      for (var i = cursor.line - 1; i >= 0 && lastTabCount; i--) {
        line         = editor.getLine(i);
        lineIndent   = getLineIndent(line);
        tabCount     = lineIndent.tabCount;
        tabCountDiff = lastTabCount - tabCount;

        if (isCommentStarter(line, lineIndent)) {
          continue;
        }

        if (indentIsInvalid(lineIndent)) {
          return;
        }

        if (tabCountDiff <= 0) {
          // [line]     =   key1: value1
          // [lastLine] = key2: value2
          //
          // OR
          //
          // [line]     = key1: value1
          // [lastLine] = key2: value2
          continue;
        }

        if (isArrayStarter(line)) {
          if (tabCountDiff > 2) {
            // [line]     = - key1: value1
            // [lastLine] =       key2: value2
            return;
          }

          arraysTraveled += 1;

          if (tabCountDiff === 1 && !isArrayStarter(lastLine)) {
            // [line]     = - key1: value1
            // [lastLine] =   key2: value2
            lastLine     = line;
            lastTabCount = tabCount;
            continue;
          }
        } else {
          if (tabCountDiff > 1) {
            // [line]     = key1: value1
            // [lastLine] =     key2: value2
            return;
          }
        }

        path.unshift(extractKey(line));

        lastLine     = line;
        lastTabCount = tabCount;
      }

      path.arraysTraveled = arraysTraveled;
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

    hinter.getSuggestions = function (editor) {
      if (hinter.shouldSuggestVersion(editor)) {
        return [{
          key:     '#%RAML 0.8',
          metadata: {
            category: 'main',
            isText:   true
          }
        }];
      }

      var path         = hinter.computePath(editor);
      var suggestions  = path ? hinter.suggestRAML(path).suggestions : {};
      var neighborKeys = getNeighborKeys(editor);

      return Object.keys(suggestions)
        .filter(function (key) {
          return !hinter.isSuggestionInUse(key, suggestions[key], neighborKeys);
        })

        .sort()

        .map(function (key) {
          return {
            key:      key,
            metadata: suggestions[key].metadata
          };
        })
      ;
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
