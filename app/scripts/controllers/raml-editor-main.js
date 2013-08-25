angular.module('ramlConsoleApp')
  .controller('ramlMain', function ($scope, ramlReader, ramlParser, eventService) {
    var editor, currentUpdateTimer, UPDATE_RESPONSIVENESS_INTERVAL = 300;

    $scope.sourceUpdated = function () {
      var source = editor.getValue();
      if (source === $scope.definition) {
        return;
      }

      $scope.definition = source;
      eventService.broadcast('event:raml-source-updated', $scope.definition);
    };

    $scope.cursorMoved = function () {
      eventService.broadcast('event:raml-editor-has-changes', editor);
    };

    eventService.on('event:raml-source-updated', function (e, args) {
      var definition = args;
      ramlParser.load(definition).then(function (result) {
        eventService.broadcast('event:raml-parsed', ramlReader.read(result));
      }, function (error) {
        console.log(error);
        $scope.errorMessage = error;
        $scope.$apply();
      });
    });

    eventService.on('event:raml-parsed', function (e, args) {
        var baseUri = (args.baseUri || '').replace(/\/\/*$/g, '');
        var version = args.version || '';
        var model = {};

        baseUri = baseUri.replace(':0', '\\:0');
        baseUri = baseUri.replace(':1', '\\:1');
        baseUri = baseUri.replace(':2', '\\:2');
        baseUri = baseUri.replace(':3', '\\:3');
        baseUri = baseUri.replace(':4', '\\:4');
        baseUri = baseUri.replace(':5', '\\:5');
        baseUri = baseUri.replace(':6', '\\:6');
        baseUri = baseUri.replace(':7', '\\:7');
        baseUri = baseUri.replace(':8', '\\:8');
        baseUri = baseUri.replace(':9', '\\:9');

        args.baseUri = baseUri.replace('{version}', version);
        eventService.broadcast('event:raml-sidebar-clicked', { isResource: true, data: args });
    });

    $scope.init = function () {
      $scope.raml = {};
      $scope.definition = '';
      $scope.errorMessage = '';
      $scope.resources = '';
      $scope.documentation = '';
      $scope.baseUri = '';

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

      editor = CodeMirror.fromTextArea(document.getElementById('code'), {
        mode: 'yaml',
        theme: 'solarized dark',
        lineNumbers: true,
        lineWrapping: true,
        autofocus: true,
        indentWithTabs: false,
        indentUnit: 2,
        tabSize: 2,
        extraKeys: {"Ctrl-Space": "autocomplete"},
        keyMap: 'tabSpace',
        foldGutter: {
          rangeFinder: CodeMirror.fold.indent
        },
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
      });

      CodeMirror.commands.autocomplete = function(cm) {
        CodeMirror.showHint(cm, CodeMirror.hint.javascript);
      };

      editor.setSize(null, '100%');
      editor.foldCode(0, {
        rangeFinder: CodeMirror.fold.indent
      });

      editor.on('update', function (event) {
        if (currentUpdateTimer) {
          clearTimeout(currentUpdateTimer);
        }
        currentUpdateTimer = setTimeout(function () {
          $scope.sourceUpdated();
          currentUpdateTimer = undefined;
        }, UPDATE_RESPONSIVENESS_INTERVAL);
      });
      editor.on('cursorActivity', $scope.cursorMoved.bind($scope));

      $scope.sourceUpdated();
    }

    $scope.init();
  });
