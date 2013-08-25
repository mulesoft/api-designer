angular.module('codeMirror', ['raml'])
  .factory('codeMirror', function (ramlHint) {
    var editor = null,
      service = {
        CodeMirror: CodeMirror,
      };

    service.initEditor = function () {
      CodeMirror.keyMap.tabSpace = {
        Tab: function(cm) {
          var spaces = Array(cm.getOption('indentUnit') + 1).join(' ');
          cm.replaceSelection(spaces, 'end', '+input');
        },
        Backspace: function (cm) {
          var endCursor = cm.getCursor();
          var startCursor = {line: endCursor.line, ch: endCursor.ch - 2};
          if ( '  ' === cm.getRange(startCursor, endCursor) ) {
            cm.deleteH(-2, "char");
            return;
          }
          cm.deleteH(-1, "char");
        },
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
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
      });

      editor.setSize(null, '100%');

      editor.foldCode(0, {
        rangeFinder: CodeMirror.fold.indent
      });

      return editor;
    };

    service.getEditor = function () {
      return editor;
    };

    return service;
  });
