'use strict';

var CodeMirror = window.CodeMirror;

angular.module('codeMirror', ['raml'])
  .factory('codeMirror', function (ramlHint) {
    var editor = null,
      service = {
        CodeMirror: CodeMirror
      };

    service.removeTabs = function (line, indentUnit) {
      var tabRegExp = new RegExp('( ){' + indentUnit + '}', 'g');
      return line.replace(tabRegExp, '');
    };

    service.isLineOnlyTabs = function (line, indentUnit) {
      return service.removeTabs(line, indentUnit).length === 0;
    };

    service.tabKey = function (cm) {
      var cursor = cm.getCursor(), line = cm.getLine(cursor.line),
          indentUnit = cm.getOption('indentUnit'), spaces, result, unitsToIndent;

      result = service.removeTabs(line, indentUnit);
      result = result.length ? result : '';

        /* If I'm in half/part of a tab, add the necessary spaces to complete the tab */
      if (result !== '' && result.replace(/ /g, '') === '') {
        unitsToIndent = indentUnit - result.length;
        /* If not ident normally */
      } else {
        unitsToIndent = indentUnit;
      }
      spaces = new Array(unitsToIndent + 1).join(' ');
      cm.replaceSelection(spaces, 'end', '+input');
    };

    service.backspaceKey = function (cm) {
      var cursor = cm.getCursor(), line = cm.getLine(cursor.line),
          indentUnit = cm.getOption('indentUnit'), i;

      line = line.substring(0, cursor.ch + 1);

      /* Erase in tab chunks only if all things found in the current line are tabs */
      if ( line !== '' && service.isLineOnlyTabs(line, indentUnit) ) {
        for (i = 0; i < indentUnit; i++) {
          /* 
           * XXX deleteH should be used this way because if doing
           *
           *    cm.deleteH(-indentUnit,'char') 
           *
           * it provokes some weird line deletion cases:
           *
           * On an empty line (but with tabs after the cursor) it completely erases the
           * previous line.
           */
          cm.deleteH(-1, 'char');
        }
        return;
      }
      cm.deleteH(-1, 'char');
    };

    service.enterKey = function (cm) {
      var editorState = ramlHint.getEditorState(cm);
      var indentUnit = cm.getOption('indentUnit');
      var indent = editorState.curLine.split(new Array(indentUnit + 1).join(' ')).length - 1;

      var curLineWithoutTabs = service.removeTabs(editorState.curLine, indentUnit);

      //this overrides everything else, because the '|' explicitly declares the line as a scalar
      //with a continuation on other lines. This applies to the current line or the parent of the current line
      var potentialParents = ramlHint.getScopes(cm).scopeLevels[indent > 0 ? indent - 1 : 0];

      var parentLineNumber = potentialParents.filter(function (line) {
        return line < editorState.start.line;
      }).pop();

      var parentLine = cm.getLine(parentLineNumber);

      if(curLineWithoutTabs.match(/\|$/)) {
        _foo(cm, 1, "");
        return;
      }
      if(parentLine.match(/\|$/)) {
        _foo (cm, 0, "");
        return;
      }

      var offset = 0;
      if(curLineWithoutTabs.replace(' ', '').length > 0) {
        var path = ramlHint.computePath(cm);
        var suggestions = ramlHint.suggestRAML(path);

        offset = suggestions.isScalar ? 0 : 1;
      }

      var extraWhitespace = "";
      var leadingWhitespace = curLineWithoutTabs.match(/^\s+/);
      if(leadingWhitespace && leadingWhitespace[0] && !offset) {
        extraWhitespace = leadingWhitespace[0];
      }

      _foo (cm, offset, extraWhitespace);
    };

    function _foo(editor, offset, whitespace) {
      var indentUnit = editor.getOption('indentUnit');
      var editorState = ramlHint.getEditorState(editor);

      var spaces = "\n" + new Array(indentUnit * (editorState.currLineTabCount + offset) + 1).join(' ') + whitespace;
      editor.replaceSelection(spaces, "end", "+input");
    }


    service.getFoldRange = function (cm, start) {
      var indentUnit = cm.getOption('indentUnit');

      var line = cm.getLine(start.line);
      var nextLine = cm.getLine(start.line + 1);
      if (!nextLine) {
        return;
      }

      var indent = line.split(new Array(indentUnit + 1).join(' ')).length - 1;
      var nextLineIndent = nextLine.split(new Array(indentUnit + 1).join(' ')).length - 1;

      if(nextLineIndent > indent) {
        for(var i = start.line + 2, end = cm.lineCount(); i < end; ++i) {
          nextLine = cm.getLine(i);
          nextLineIndent = nextLine.split(new Array(indentUnit + 1).join(' ')).length - 1

          if(nextLineIndent <= indent) {
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

    service.initEditor = function () {

      CodeMirror.keyMap.tabSpace = {
        Tab: service.tabKey,
        Backspace: service.backspaceKey,
        Enter: service.enterKey,
        fallthrough: ['default']
      };

      CodeMirror.commands.autocomplete = function (cm) {
        CodeMirror.showHint(cm, CodeMirror.hint.javascript);
      };

      CodeMirror.registerHelper('hint', 'yaml', ramlHint.autocompleteHelper);
      CodeMirror.registerHelper("fold", "indent", service.getFoldRange);

      editor = CodeMirror.fromTextArea(document.getElementById('code'), {
        mode: "raml",
        theme: 'solarized dark',
        lineNumbers: true,
        lineWrapping: true,
        autofocus: true,
        indentWithTabs: false,
        indentUnit: 2,
        tabSize: 2,
        extraKeys: {'Ctrl-Space': 'autocomplete'},
        keyMap: 'tabSpace',
        foldGutter: {
          rangeFinder: CodeMirror.fold.indent
        },
        gutters: ['CodeMirror-lint-markers', 'CodeMirror-linenumbers', 'CodeMirror-foldgutter']
      });

      editor.setSize(null, '100%');

      editor.foldCode(0, {
        rangeFinder: CodeMirror.fold.indent
      });

      var charWidth = editor.defaultCharWidth(), basePadding = 4;
      editor.on("renderLine", function(cm, line, elt) {
        var off = CodeMirror.countColumn(line.text, null, cm.getOption("tabSize")) * charWidth;
        elt.style.textIndent = "-" + off + "px";
        elt.style.paddingLeft = (basePadding + off) + "px";
      });

      return editor;
    };

    service.getEditor = function () {
      return editor;
    };

    return service;
  });
