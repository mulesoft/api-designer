'use strict';

angular.module('ramlEditorApp')
  /**
   * Returns array of lines (including specified)
   * at the same level as line at <lineNumber>.
   *
   * If <lineNumber> is not specified, current line
   * under cursor will be used.
   */
  .factory('getNeighborLines', function (getLineIndent) {
    return function (editor, lineNumber) {
      if (typeof lineNumber !== 'number') {
        lineNumber = editor.getCursor().line;
      }

      var lineNumbers = [lineNumber];
      var lineIndent = getLineIndent(editor.getLine(lineNumber).slice(0, editor.getCursor().ch + 1));
      var linesCount = editor.lineCount();
      var i;
      var nextLine;
      var nextLineIndent;

      // lines above specified
      for (i = lineNumber - 1; i >= 0; i--) {
        nextLine = editor.getLine(i);
        nextLineIndent = getLineIndent(nextLine);

        if (nextLineIndent.tabCount !== lineIndent.tabCount) {
          // level is decreasing, no way we can get back
          if (nextLineIndent.tabCount < lineIndent.tabCount) {
            break;
          }

          // level is increasing, but we still can get back
          continue;
        }

        lineNumbers.push(i);
      }

      // lines below specified
      for (i = lineNumber + 1; i < linesCount; i++) {
        nextLine = editor.getLine(i);
        nextLineIndent = getLineIndent(nextLine);

        if (nextLineIndent.tabCount !== lineIndent.tabCount) {
          // level is decreasing, no way we can get back
          if (nextLineIndent.tabCount < lineIndent.tabCount) {
            break;
          }

          // level is increasing, but we still can get back
          continue;
        }

        lineNumbers.push(i);
      }

      return lineNumbers.sort().map(function (lineNumber) {
        return editor.getLine(lineNumber);
      });
    };
  })
  .factory('getKeysToErase', function (getNeighborLines, extractKey) {
    return function (editor) {
      return getNeighborLines(editor).map(function (line) {
        return extractKey(line.trim());
      });
    };
  })
  .factory('ramlHint', function (getLineIndent, generateTabs, getKeysToErase,
    getScopes, getEditorTextAsArrayOfLines) {
    var hinter = {};
    var WORD = /[^\s]|[$]/;
    var RAML_VERSION = '#%RAML 0.8';
    var RAML_VERSION_PATTERN = new RegExp('^\\s*' + RAML_VERSION + '\\s*$', 'i');

    hinter.suggestRAML = window.suggestRAML;

    hinter.computePath = function (editor) {
      var editorState = hinter.getEditorState(editor);
      var line = editorState.cur.line;
      var ch = editorState.cur.ch;
      var listsTraveled = 0;
      var lastTraveledListSpaceCount;
      var lines;
      var textAsList;
      var rootIsFound;

      if (line === 0) {
        return null;
      }

      textAsList = getEditorTextAsArrayOfLines(editor).slice(0, line + 1).reverse();
      if (textAsList[0].trim() === '') {
        textAsList[0] = textAsList[0].slice(0, ch);
      }

      // It should have at least one element
      if (!textAsList.length) {
        return [];
      }

      lastTraveledListSpaceCount = getLineIndent(textAsList[0]).spaceCount;
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

    hinter.getEditorState = function(editor, options) {
      var word = options && options.word || WORD;
      var cur = editor.getCursor(), curLine = editor.getLine(cur.line);
      var startPos = cur.ch, endPos = startPos;
      var currLineTabCount;

      currLineTabCount = getLineIndent(curLine).tabCount;

      // Handle RAML version, it should look at the entire line
      if (cur.line === 0) {
        word = /^|[\s]|[$]/;
      }
      while (endPos < curLine.length && word.test(curLine.charAt(endPos))) {
        ++endPos;
      }
      while (startPos && word.test(curLine.charAt(startPos - 1))) {
        --startPos;
      }

      var start = CodeMirror.Pos(cur.line, startPos),
      end = CodeMirror.Pos(cur.line, endPos);
      return {
        curWord: startPos !== endPos && curLine.slice(startPos, endPos),
        start: start,
        end: end,
        cur: cur,
        curLine: curLine,
        currLineTabCount: currLineTabCount
      };
    };

    hinter.getScopes = function (editor) {
      var arrayOfLines = getEditorTextAsArrayOfLines(editor);
      return getScopes(arrayOfLines);
    };

    hinter.selectiveCloneAlternatives = function (alternatives, keysToErase) {
      var newAlternatives = {};
      var newSuggestions  = {};

      Object.keys(alternatives.suggestions || {}).forEach(function (key) {
        var suggestion = alternatives.suggestions[key];
        var optional   = !!(suggestion && suggestion.metadata && suggestion.metadata.canBeOptional);

        if (keysToErase.indexOf(key) === -1 && (!optional || (optional && keysToErase.indexOf(key + '?') === -1))) {
          newSuggestions[key] = alternatives.suggestions[key];
        }
      });

      Object.keys(alternatives).forEach(function(key) {
        newAlternatives[key] = alternatives[key];
      });

      newAlternatives.suggestions      = newSuggestions;
      newAlternatives.isOpenSuggestion = alternatives.constructor.name === 'OpenSuggestion';

      return newAlternatives;
    };

    hinter.getAlternatives = function (editor) {
      var path = hinter.computePath(editor);
      var alternatives;
      var keysToErase;
      var alternativeKeys = [];

      // Invalid tabulation detected :)
      if (path === undefined) {
        return {
          path  : [],
          keys  : [],
          values: {}
        };
      }
      else if (path !== null) {
        path.pop();
      }

      alternatives = hinter.suggestRAML(path);
      keysToErase  = getKeysToErase(editor);
      alternatives = hinter.selectiveCloneAlternatives(alternatives, keysToErase);

      if (alternatives && alternatives.suggestions) {
        alternativeKeys = Object.keys(alternatives.suggestions);
      }

      if (!path) {
        path = [];
      }

      return {
        path  : path,
        keys  : alternativeKeys,
        values: alternatives
      };
    };

    hinter.shouldSuggestVersion = function(editor) {
      var lineNumber = editor.getCursor().line,
          line = editor.getLine(lineNumber);
      var lineIsVersion = RAML_VERSION_PATTERN.test(line);

      return (lineNumber === 0 && !lineIsVersion);
    };

    hinter.getSuggestions = function (editor) {
      var alternatives = hinter.getAlternatives(editor);

      var list = alternatives.keys.map(function (e) {
        var suggestion = alternatives.values.suggestions[e];
        return { name: e, category: suggestion.metadata.category, isText: suggestion.metadata.isText  };
      }).filter(function(e){
        if (!hinter.shouldSuggestVersion(editor) && e.name === RAML_VERSION) {
          return false;
        }
        return true;
      }) || [];

      if (alternatives.values.metadata && alternatives.values.metadata.id === 'resource') {
        list.push({name: 'New resource', category: alternatives.values.metadata.category});
      }

      list.path = alternatives.path;

      return list;
    };

    hinter.canAutocomplete = function (cm) {
      var editorState    = hinter.getEditorState(cm);
      var curLine        = editorState.curLine;
      var curLineTrimmed = curLine.trim();
      var offset         = curLine.indexOf(curLineTrimmed);
      var lineNumber     = editorState.start ? editorState.start.line : 0;

      // nothing to autocomplete within comments
      // -> "#..."
      if ((function () {
        var indexOf = curLineTrimmed.indexOf('#');
        return lineNumber > 0 &&
               indexOf !== -1 &&
               editorState.cur.ch > (indexOf + offset)
        ;
      })()) {
        return false;
      }

      // nothing to autocomplete within resources
      // -> "/..."
      if ((function () {
        var indexOf = curLineTrimmed.indexOf('/');
        return indexOf === 0 &&
               editorState.cur.ch >= (indexOf + offset)
        ;
      })()) {
        return false;
      }

      // nothing to autocomplete for key value
      // -> "key: ..."
      if ((function () {
        var indexOf = curLineTrimmed.indexOf(': ');
        return indexOf !== -1 &&
               editorState.cur.ch >= (indexOf + offset + 2)
        ;
      })()) {
        return false;
      }

      // nothing to autocomplete prior array
      // -> "...- "
      if ((function () {
        var indexOf = curLineTrimmed.indexOf('- ');
        return indexOf === 0 &&
               editorState.cur.ch < (indexOf + offset)
        ;
      })()) {
        return false;
      }

      return true;
    };

    hinter.autocompleteHelper = function(cm) {
      var editorState  = hinter.getEditorState(cm);
      var line         = editorState.curLine;
      var word         = line.trimLeft();
      var wordIsKey;
      var alternatives;
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
        alternatives = hinter.getAlternatives(cm);
      } else {
        return;
      }

      // handle comment (except RAML tag)
      (function () {
        var indexOf = word.indexOf('#');
        if (indexOf !== -1) {
          if (editorState.cur.line !== 0 || indexOf !== 0) {
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

      word = word.trim();
      list = alternatives.keys.map(function (e) {
        var suggestion = alternatives.values.suggestions[e];
        var text       = e;

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
        fromCh = editorState.cur.ch;
        toCh   = fromCh;
      }

      return {
        word: word,
        list: list,
        from: CodeMirror.Pos(editorState.cur.line, fromCh),
        to:   CodeMirror.Pos(editorState.cur.line, toCh)
      };
    };

    return hinter;
  });
