'use strict';

angular.module('codeFolding', ['raml', 'lightweightParse'])
  .factory('getFoldRange', function getFoldRangeFactory(getLineIndent) {
    return function getFoldRange(cm, start) {
      var line           = cm.getLine(start.line);
      var lineIndentInfo = getLineIndent(line);
      var nextLineIndentInfo;

      if (!lineIndentInfo.content) {
        return;
      }

      var nextLine = cm.getLine(start.line + 1);
      if (!nextLine) {
        return;
      }

      var tabCount     = lineIndentInfo.tabCount;
      var nextTabCount = getLineIndent(nextLine).tabCount;

      if (nextTabCount > tabCount) {
        for (var i = start.line + 2, end = cm.lineCount(); i < end; i++) {
          nextLine           = cm.getLine(i);
          nextLineIndentInfo = getLineIndent(nextLine);
          nextTabCount       = nextLineIndentInfo.tabCount;

          if (nextTabCount <= tabCount && nextLineIndentInfo.content) {
            nextLine = cm.getLine(i - 1);
            return {
              from: CodeMirror.Pos(start.line, line.length    ),
              to:   CodeMirror.Pos(i - 1,      nextLine.length)
            };
          }

          if (i === end - 1) {
            nextLine = cm.getLine(end - 1);
            return {
              from: CodeMirror.Pos(start.line, line.length    ),
              to:   CodeMirror.Pos(end - 1,    nextLine.length)
            };
          }
        }
      }
    };
  });
