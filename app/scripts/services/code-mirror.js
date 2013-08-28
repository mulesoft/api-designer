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
          indentUnit = cm.getOption('indentUnit');
      
      /* Erase in tab chunks only if all things found in the current line are tabs */
      if ( line !== '' && service.isLineOnlyTabs(line, indentUnit) ) {
        cm.deleteH(-indentUnit, 'char');
        return;
      }
      cm.deleteH(-1, 'char');
    };

    service.initEditor = function () {

      CodeMirror.keyMap.tabSpace = {
        Tab: service.tabKey,
        Backspace: service.backspaceKey,
        enter: 'newline-and-indent',
        fallthrough: ['default']
      };

      CodeMirror.commands.autocomplete = function (cm) {
        CodeMirror.showHint(cm, CodeMirror.hint.javascript);
      };
      
      CodeMirror.registerHelper('hint', 'yaml', ramlHint.autocompleteHelper);

      editor = CodeMirror.fromTextArea(document.getElementById('code'), {
        mode: 'yaml',
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
