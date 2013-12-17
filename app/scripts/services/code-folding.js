'use strict';

/* globals CodeMirror */

angular.module('codeFolding', ['raml', 'lightweightParse'])
  .factory('isArrayElement', function (isArrayStarter, getParentLineNumber, getFirstChildLine){
    return function(cm, lineNumber){
      var line = cm.getLine(lineNumber);
      if(isArrayStarter(line)) {
        return true;
      }

      var parentLineNumber = getParentLineNumber(cm, lineNumber);
      var firstChild = getFirstChildLine(cm, parentLineNumber);

      return isArrayStarter(firstChild);
    };
  })
  .factory('getParentLineNumber', function (getScopes, getEditorTextAsArrayOfLines, getLineIndent, isArrayStarter) {
    var getParentLineNumber = function (cm, lineNumber) {
      var tabCount = getLineIndent(cm.getLine(lineNumber)).tabCount;

      var potentialParents = getScopes(getEditorTextAsArrayOfLines(cm)).scopeLevels[tabCount > 0 ? (tabCount - 1) : 0];
      var parent = null;

      if (potentialParents) {
        parent = potentialParents.filter(function (line) {
          return line < lineNumber;
        }).pop();
      }

      if(isArrayStarter(cm.getLine(parent))) {
        return getParentLineNumber(cm, parent);
      }

      return parent;
    };

    return getParentLineNumber;
  })
  .factory('getParentLine', function (getParentLineNumber) {
    return function (cm, lineNumber) {
      var parentLineNumber = getParentLineNumber(cm, lineNumber);
      return cm.getLine(parentLineNumber);
    };
  })
  .factory('getFirstChildLineNumber', function (getScopes, getLineIndent, getEditorTextAsArrayOfLines) {
    return function (cm, lineNumber){
      var scopes = getScopes(getEditorTextAsArrayOfLines(cm));

      var scopesByLine = scopes.scopesByLine[lineNumber];
      if(scopesByLine && scopesByLine.length >= 2) {
        var firstChild = scopes.scopesByLine[lineNumber][1];
        if(firstChild) {
          return firstChild.lineNumber;
        }
      }
    };
  })
  .factory('getFirstChildLine', function (getFirstChildLineNumber){
    return function(cm, lineNumber) {
      var firstChildLineNumber = getFirstChildLineNumber(cm, lineNumber);
      return cm.getLine(firstChildLineNumber);
    };
  })
  .factory('getFoldRange', function (getParentLine, getParentLineNumber, getLineIndent) {
//    function _hasParent(pattern, cm, lineNumber) {
//      if(lineNumber === 0 || !lineNumber) {
//        return false;
//      }
//
//      var parentLineNumber = getParentLineNumber(cm, lineNumber);
//
//      if (pattern.test(cm.getLine(parentLineNumber))) {
//        return true;
//      } else {
//        return _hasParent (pattern, cm, parentLineNumber);
//      }
//    }

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

      var indent = lineIndentInfo.tabCount;
      var nextLineIndent = getLineIndent(nextLine).tabCount;

//      if(/(content|schema|example):(\s?)\|/.test(getParentLine(cm, start.line))) {
//        return;
//      }
//
//      if(_hasParent(/(content|schema|example):(\s?)\|/, cm, start.line)){
//        return;
//      }

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
