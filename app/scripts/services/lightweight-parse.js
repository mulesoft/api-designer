'use strict';

angular.module('lightweightParse', ['utils'])
  .factory('getEditorTextAsArrayOfLines', function () {
    var lastStringCache;

    return function (editor) {
      var textAsList = [], i;

      if ( lastStringCache && lastStringCache.key === editor.getValue() ) {
        return lastStringCache.value;
      }

      for (i = 0; i < editor.lineCount(); i++) {
        textAsList.push(editor.getLine(i));
      }

      lastStringCache = {key: editor.getValue(), value: textAsList};

      return textAsList;
    };

  })
  .factory('isArrayStarter', function() {
    return function(line) {
      return (line || '').trimLeft().indexOf('- ') === 0;
    };
  })
  .factory('extractKey', function (isArrayStarter) {
    return function(value) {
      function endsWith(string, searchString) {
        var position = string.length - searchString.length;
        var lastIndex = string.lastIndexOf(searchString);
        return lastIndex !== -1 && lastIndex === position;
      }

      function clearSlashes(key) {
        if (isArrayStarter(key)) {
          return key.replace(/^-\s*/, '');
        }
        return key;
      }

      var trimmedValue = value ? value.trim() : '', match, key;
      if (!trimmedValue) {
        return '';
      }

      // Keys are the first thing in the line, that is separated by a ": " (colon space)
      match = trimmedValue.trim().split(/:\s+/, 2);
      key = match && match.length > 1 ? match[0] : '';
      if (key){
        return clearSlashes(key);
      }

      // There was no colon followed by a space, maybe it ends with a colon?
      if (endsWith(trimmedValue, ':')) {
        return clearSlashes(trimmedValue.substr(0, trimmedValue.length - 1));
      }

      // No key found
      return '';
    };
  })
  .factory('getSpaceCount', function getSpaceCountFactory() {
    return function getSpaceCount(string) {
      for (var i = 0; i < string.length; i++) {
        if (string[i] !== ' ') {
          break;
        }
      }

      return i;
    };
  })
  .factory('getLineIndent', function getLineIndentFactory(getSpaceCount, indentUnit) {
    return function getLineIndent(string, indentSize) {
      var spaceCount = getSpaceCount(string);
      var tabCount   = Math.floor(spaceCount / (indentSize || indentUnit));

      return {
        content:    spaceCount ? string.slice(spaceCount) : string,
        spaceCount: spaceCount,
        tabCount:   tabCount
      };
    };
  })
  .factory('getScopes', function (getLineIndent) {
    var lastArrayCache;

    function areArraysEqual(a, b) {
      if (a === undefined || b === undefined) {
        return false;
      }

      if (a.length !== b.length) {
        return false;
      }

      for (var i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
          return false;
        }
      }

      return true;

    }

    return function (arrayOfLines) {
      var zipValues = [], currentIndexes = {};

      if (lastArrayCache && areArraysEqual(lastArrayCache.key, arrayOfLines)) {
        return lastArrayCache.value;
      }

      zipValues = arrayOfLines.map(function (line, index) {
        var lineIndentInfo = getLineIndent(line);
        return {tabCount: lineIndentInfo.tabCount, content: lineIndentInfo.content, lineNumber: index};
      });

      var levelTable = zipValues.reduce(function (result, currentLine) {
        var currentArray = currentIndexes[currentLine.tabCount - 1],
          lastArrayIndex, currentIndex;

        if (currentArray) {
          lastArrayIndex = currentArray.length - 1;
          currentIndex = currentIndexes[currentLine.tabCount - 1][lastArrayIndex];
        } else if (currentLine.tabCount > 1) {
          // Case for lists, we fetch a level lower
          currentArray = currentIndexes[currentLine.tabCount - 2];

          // Ignore this line if the tab level is invalid
          if (currentArray) {
            lastArrayIndex = currentArray.length - 1;
            currentIndex = currentIndexes[currentLine.tabCount - 2][lastArrayIndex];

            result[currentIndex] = result[currentIndex] || [];
            result[currentIndex].push({lineNumber: currentLine.lineNumber, content: currentLine.content, tabCount: currentLine.tabCount});

            currentIndexes[currentLine.tabCount - 1] = currentIndexes[currentLine.tabCount - 1] || [];
            currentIndexes[currentLine.tabCount - 1].push(currentLine.lineNumber);
          }

          return result;
        } else {
          // Case of the first element of the first level
          currentIndex = 0;
        }

        result[currentIndex] = result[currentIndex] || [];
        result[currentIndex].push({lineNumber: currentLine.lineNumber, content: currentLine.content, tabCount: currentLine.tabCount});

        currentIndexes[currentLine.tabCount] = currentIndexes[currentLine.tabCount] || [];
        currentIndexes[currentLine.tabCount].push(currentLine.lineNumber);
        return result;
      }, {});

      lastArrayCache = {
        result: {scopeLevels: currentIndexes, scopesByLine: levelTable},
        lines: arrayOfLines
      };

      return {scopeLevels: currentIndexes, scopesByLine: levelTable};
    };
  });
