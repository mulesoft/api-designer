'use strict';

angular.module('lightweightParse', ['utils'])
  .factory('getEditorTextAsArrayOfLines', function getEditorTextAsArrayOfLinesFactory() {
    var cachedValue = '';
    var cachedLines = [];

    return function getEditorTextAsArrayOfLines(editor) {
      if (cachedValue === editor.getValue()) {
        return cachedLines;
      }

      cachedValue = editor.getValue();
      cachedLines = [];

      for (var i = 0, lineCount = editor.lineCount(); i < lineCount; i++) {
        cachedLines.push(editor.getLine(i));
      }

      return cachedLines;
    };
  })
  .factory('getSpaceCount', function getSpaceCountFactory() {
    return function getSpaceCount(line) {
      for (var i = 0, length = line.length; i < length; i++) {
        if (line[i] !== ' ') {
          break;
        }
      }

      return i;
    };
  })
  .factory('getTabCount', function getTabCountFactory(indentUnit) {
    return function getTabCount(spaceCount, indentSize) {
      indentSize = indentSize || indentUnit;
      return Math.floor(spaceCount / indentSize);
    };
  })
  .factory('getLineIndent', function getLineIndentFactory(getSpaceCount, getTabCount) {
    return function getLineIndent(line, indentSize) {
      var spaceCount = getSpaceCount(line);

      return {
        spaceCount: spaceCount,
        tabCount:   getTabCount(spaceCount, indentSize),
        content:    spaceCount ? line.slice(spaceCount) : line
      };
    };
  })
  .factory('isArrayStarter', function isArrayStarterFactory(getSpaceCount) {
    return function isArrayStarter(line) {
      var spaceCount = getSpaceCount(line);
      return line[spaceCount] === '-' && line[spaceCount + 1] === ' ';
    };
  })
  .factory('isCommentStarter', function isCommentStarterFactory(getSpaceCount) {
    return function isCommentStarter(line) {
      var spaceCount = getSpaceCount(line);
      return line[spaceCount] === '#';
    };
  })
  .factory('extractKeyValue', function extractKeyValueFactory() {
    /**
     * Removes the whitespaces from the line between start and end indices.
     *
     * @param line The line that needs to be trimmed.
     * @param start The index of left border of the line where trimming should begin.
     * If value is negative, it'll be computed based on length of the line as [length + start].
     * @param end The index of the right border of the line where trimming should end.
     * If value is negative, it'll be computed based on length of the line as [length + end].
     *
     * @returns The trimmed line without whitespaces between start and end.
     */
    function trim(line, start, end) {
      start = start || 0;
      end   = end   || line.length;

      if (start < 0) {
        start = line.length + start;
      }

      if (end < 0) {
        end = line.length + end;
      }

      while (start < end && line[start] === ' ') {
        start += 1;
      }

      while (start < end && line[end - 1] === ' ') {
        end -= 1;
      }

      if (start === 0 && end === line.length) {
        return line;
      }

      return line.slice(start, end);
    }

    /**
     * Transforms a value which is a string into an object that provides additional
     * information such as whether value is an alias or a reference.
     *
     * @param value The value that needs to be transformed.
     *
     * @returns {{text, isAlias, isReference}}
     */
    function transformValue(value) {
      if (!value) {
        return null;
      }

      return {
        text:        value,
        isAlias:     value[0] === '&',
        isReference: value[0] === '*'
      };
    }

    return function extractKeyValue(line) {
      var start   = 0;
      var end     = line.length;
      var indexOf = line.indexOf('#');

      if (indexOf !== -1) {
        end = indexOf;
      }

      indexOf = line.indexOf('- ');
      if (indexOf !== -1 && indexOf < end) {
        start = indexOf + 2;
      }

      indexOf = line.indexOf(': ', start);
      if (indexOf !== -1 && indexOf < end) {
        return {
          key:   trim(line, start,       indexOf),
          value: transformValue(trim(line, indexOf + 2, end))
        };
      }

      indexOf = line.lastIndexOf(':', end);
      if (indexOf === (end - 1)) {
        return {
          key:   trim(line, start, end - 1),
          value: null
        };
      }

      return {
        key:   null,
        value: transformValue(trim(line, start, end))
      };
    };
  })
  .factory('getScopes', function getScopesFactory(getLineIndent) {
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

    return function getScopes(arrayOfLines) {
      if (lastArrayCache && areArraysEqual(lastArrayCache.key, arrayOfLines)) {
        return lastArrayCache.value;
      }

      var currentIndexes = {};
      var zipValues = arrayOfLines.map(function (line, index) {
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
