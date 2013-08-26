'use strict';

var CodeMirror = window.CodeMirror, suggestRAML = window.suggestRAML;

angular.module('raml')
  .factory('ramlHint', function () {
    var hinter = {};
    var WORD = /[\w$]+/;

    function extractKey(value) {
      return value.replace(new RegExp(':(.*)$', 'g'), '');
    }

    function _computePath (editor, line, tabCount) {
      if (line <= 0) {
        return [];
      }
      var tabs = editor.getLine(line).split('  '),
          value = tabs.pop(), result = [];

      if (tabs.length === tabCount) {
        if (tabCount !== 0) {
          result = _computePath(editor, line - 1, tabs.length - 1);
        }
        // Removing spaces and :
        // TODO Unit tests for exceptions
        return result.concat([extractKey(value)]);
      } else {
        return _computePath(editor, line - 1, tabCount);
      }
    }

    hinter.computePath = function (editor, line) {
      var curLine = editor.getLine(line),
          currLineTabCount = curLine.split('  ').length - 1;

      return _computePath(editor, line, currLineTabCount);
    };

    hinter.createIndentation = function createIndentation (tabCount) {
      var s = '  ';
      var result = '';
      for (var i = 0; i < tabCount; i++) {
        result += s;
      }
      return result;
    };

    hinter.getPadding = function getPadding(node, tabCount) {
      if (!node || !node.constructor || !node.constructor.name) {
        throw new Error('Can\'t determine padding for node: ' + node);
      }

      if ('StringWildcard' === node.constructor.name) {
        return ' ';
      }

      return '\n' + hinter.createIndentation(tabCount);
    };

    hinter.getEditorState = function(editor, options) {
      var word = options && options.word || WORD;
      var cur = editor.getCursor(), curLine = editor.getLine(cur.line);
      var startPos = cur.ch, endPos = startPos;
      var currLineTabCount = curLine.split('  ').length - 1;
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
      var total = editor.lineCount(), i, line,
        zipValues = [], currentIndexes = {}, lineSplitted;
      for (i = 0; i < total; i++) {
        line = editor.getLine(i);
        lineSplitted = line.split('  ');
        zipValues.push([lineSplitted.length, lineSplitted.join(''), i]);
      }

      var levelTable = zipValues.reduce(function (x,y) {
        var currentArray = currentIndexes[y[0] - 2],
          lastArrayIndex, currentIndex;
        
        if (currentArray) {
          lastArrayIndex = currentArray.length - 1;
          currentIndex = currentIndexes[y[0] - 2][lastArrayIndex];
        } else {
          currentIndex = 0;
        }

        x[currentIndex] = x[currentIndex] || [];
        x[currentIndex].push([y[2], y[1]]);

        currentIndexes[y[0] - 1] = currentIndexes[y[0] - 1] || [];
        currentIndexes[y[0] - 1].push(y[2]);
        return x;
      }, {});

      return {scopeLevels: currentIndexes, scopesByLine: levelTable};
    };

    hinter.getAlternatives = function (editor) {
      var editorState = hinter.getEditorState(editor),
        currLineTabCount = editorState.currLineTabCount,
        cur = editorState.cur;
      var val = hinter.computePath(editor, cur.line);
      val.pop();

      var alternatives = suggestRAML(val);

      var scopes = hinter.getScopes(editor);
      var keysToErase;
      var currentScopeLevel = currLineTabCount;
      function extractKeyPartFromScopes(scopesInfo) {
        return scopesInfo.map(function (scopeInfo) {
          return extractKey(scopeInfo[1]);
        });
      }

      if (currentScopeLevel !== 0) {
        var scopesAtLevel = scopes.scopeLevels[currentScopeLevel - 1];
  
        // We get the maximal element of the set of less than number of line
        var numOfLinesOfParentScopes = scopesAtLevel.filter(function (numOfLine) {
          return numOfLine < cur.line;
        });
  
        var scopeLineInformation =
          scopes.scopesByLine[
          numOfLinesOfParentScopes[numOfLinesOfParentScopes.length - 1]];
      
      keysToErase = extractKeyPartFromScopes(scopeLineInformation);
    } else {
      keysToErase = extractKeyPartFromScopes(scopes.scopesByLine[0]);
    }

      var oldAlternatives = alternatives,
          newAlternatives = {}, newAlternativesSuggestions = {};

      // TODO Make sure this does not represent a Memory Leak
      Object.keys(oldAlternatives.suggestions).forEach(function (key) {
        if (keysToErase.indexOf(key) === -1) {
          newAlternativesSuggestions[key] = oldAlternatives.suggestions[key];
        }
      });

      Object.keys(oldAlternatives).forEach(function(key) {
        newAlternatives[key] = oldAlternatives[key];
      });

      newAlternatives.suggestions = newAlternativesSuggestions;

      alternatives = newAlternatives;

      var alternativeKeys = [];

      if (alternatives && alternatives.suggestions) {
        alternativeKeys = Object.keys(alternatives.suggestions);
      }

      return {values: alternatives, keys: alternativeKeys};
    };

    hinter.getSuggestions = function (editor) {
      var alternatives = hinter.getAlternatives(editor);

      var list = alternatives.keys.map(function (e) {
        var suggestion = alternatives.values.suggestions[e];
        return { name: suggestion.name, category: suggestion.category };
      }) || [];

      if (alternatives.constructor.name === 'OpenSuggestion' &&
          alternatives.category === 'snippets') {
        list.push({name: 'New resource', category: alternatives.category});
      }

      list.path = val;

      
      return list;
    };

    hinter.autocompleteHelper = function(editor) {
      var editorState = hinter.getEditorState(editor),
          curWord = editorState.curWord,
          currLineTabCount = editorState.currLineTabCount,
          start = editorState.start, end = editorState.end;
      var alternatives = hinter.getAlternatives(editor);

      var list = alternatives.keys.map(function (e) {
        var suggestion = alternatives.values.suggestions[e],
          node = suggestion.open && suggestion.open(),
          padding = hinter.getPadding(node, currLineTabCount);

        // FIXME Use editor.indentLine to handle the indentation!
        return {text: e + ':' + padding, displayText: e  + ' (' + suggestion.category + ')'};
      }).filter(function(e) {
        if (curWord) {
            if (e && e.text.indexOf(curWord) === 0) {
                return true;
            }
            return false;
        }
        return true;
      }) || [];

        return {list: list, from: start, to: end};
      };

    return hinter;
  });
