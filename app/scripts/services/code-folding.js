'use strict';

/* globals CodeMirror */

angular.module('codeFolding', ['lightweightParse'])
  .factory('getParentLineNumber', function (getScopes, getEditorTextAsArrayOfLines) {
    return function (cm, lineNumber, indentLevel) {
      var potentialParents = getScopes(getEditorTextAsArrayOfLines(cm)).scopeLevels[indentLevel > 0 ? (indentLevel - 1) : 0];
      var parent = null;

      if (potentialParents) {
        parent = potentialParents.filter(function (line) {
          return line < lineNumber;
        }).pop();
      }

      return parent;
    };
  })
  .factory('getParentLine', function (getParentLineNumber) {
    return function (cm, lineNumber, indentLevel) {
      return cm.getLine(getParentLineNumber(cm, lineNumber, indentLevel));
    };


  })
  .factory('getFoldRange', function (getParentLine, getParentLineNumber, getLineIndent) {
    function _hasParent(pattern, cm, lineNumber) {
      if(lineNumber === 0 || !lineNumber) {
        return false;
      }

      var line = cm.getLine(lineNumber);
      var indent = getLineIndent(line).tabCount;

      var parentLineNumber = getParentLineNumber(cm, lineNumber, indent);

      if (pattern.test(cm.getLine(parentLineNumber))) {
        return true;
      } else {
        return _hasParent (pattern, cm, parentLineNumber);
      }
    }

    return function (cm, start) {
      var line = cm.getLine(start.line);
      var lineIndentInfo = getLineIndent(line);
      var nextLineIndentInfo;

      if(lineIndentInfo.content.length === 0) {
        return;
      }

      var nextLine = cm.getLine(start.line + 1);
      if (!nextLine) {
        return;
      }
      var
        indent = lineIndentInfo.tabCount,
        nextLineIndent = getLineIndent(nextLine).tabCount;

      if(/(content|schema|example):(\s?)\|/.test(getParentLine(cm, start.line, indent))) {
        return;
      }

      if(_hasParent(/(content|schema|example):(\s?)\|/, cm, start.line)){
        return;
      }

      if(nextLineIndent > indent) {
        for(var i = start.line + 2, end = cm.lineCount(); i < end; ++i) {
          nextLine = cm.getLine(i);
          nextLineIndentInfo = getLineIndent(nextLine);
          nextLineIndent = nextLineIndentInfo.tabCount;

          if(nextLineIndent <= indent && nextLineIndentInfo.content.length > 0) {
            nextLine = cm.getLine(i-1);
            return {
              from: CodeMirror.Pos(start.line, line.length),
              to: CodeMirror.Pos(i - 1, nextLine.length)
            };
          }

          if (i === end - 1) {
            nextLine = cm.getLine(end - 1);
            return {
              from: CodeMirror.Pos(start.line, line.length),
              to: CodeMirror.Pos(end - 1, nextLine.length)
            };
          }
        }
      }
    };
  });
