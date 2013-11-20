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
  .factory('isArrayStarter', function(getLineIndent) {
    return function(line) {
      if(!line) {
        return false;
      }

      var lineWithoutIndentation = getLineIndent(line).content;
      return lineWithoutIndentation.indexOf('-') === 0 && lineWithoutIndentation.indexOf('---') < 0;
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
  .factory('getLineIndent', function (indentUnit) {
    return function (string, indentSize) {
      var result = /^(\s*)(.*)$/.exec(string);

      if (!string) {
        return {tabCount: 0, spaceCount: 0, content: ''};
      }

      indentSize = indentSize || indentUnit;

      return {
        tabCount: Math.floor((result[1] || '').length / indentSize),
        content: result[2] || '',
        spaceCount: (result[1] || '').length
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
        return [lineIndentInfo.tabCount, lineIndentInfo.content, index];
      });

      var levelTable = zipValues.reduce(function (x,y) {
        var currentArray = currentIndexes[y[0] - 1],
          lastArrayIndex, currentIndex;

        if (currentArray) {
          lastArrayIndex = currentArray.length - 1;
          currentIndex = currentIndexes[y[0] - 1][lastArrayIndex];
        } else if (y[0] > 1) {
          // Case for lists, we fetch a level lower
          currentArray = currentIndexes[y[0] - 2];

          // Ignore this line if the tab level is invalid
          if (currentArray) {
            lastArrayIndex = currentArray.length - 1;
            currentIndex = currentIndexes[y[0] - 2][lastArrayIndex];

            x[currentIndex] = x[currentIndex] || [];
            x[currentIndex].push([y[2], y[1]]);

            currentIndexes[y[0] - 1] = currentIndexes[y[0] - 1] || [];
            currentIndexes[y[0] - 1].push(y[2]);
          }

          return x;
        } else {
          // Case of the first element of the first level
          currentIndex = 0;
        }

        x[currentIndex] = x[currentIndex] || [];
        x[currentIndex].push([y[2], y[1]]);

        currentIndexes[y[0]] = currentIndexes[y[0]] || [];
        currentIndexes[y[0]].push(y[2]);
        return x;
      }, {});

      lastArrayCache = {
        result: {scopeLevels: currentIndexes, scopesByLine: levelTable},
        lines: arrayOfLines
      };

      return {scopeLevels: currentIndexes, scopesByLine: levelTable};
    };
  });
