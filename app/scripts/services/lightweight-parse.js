'use strict';

angular.module('lightweightParse', ['utils'])
  .value('getEditorTextAsArrayOfLines', function (editor) {
    var textAsList = [], i;

    for (i = 0; i < editor.lineCount(); i++) {
      textAsList.push(editor.getLine(i));
    }

    return textAsList;
  })
  .value('extractKey', function (value) {
    value = value || '';
    var match = /^(.+):( .*$|$)/.exec(value);
    return match && match.length > 1 ? match[1] : '';
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
    return function (arrayOfLines) {
      var zipValues = [], currentIndexes = {};

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

      return {scopeLevels: currentIndexes, scopesByLine: levelTable};
    };
  });
