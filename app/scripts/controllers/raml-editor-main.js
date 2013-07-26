angular.module('ramlConsoleApp')
  .controller('ramlMain', function ($scope, $rootScope, ramlReader, eventService) {
    var ramlParser = RAML.Parser;
    var editor;

    $scope.sourceUpdated = function () {
      var source = editor.getValue();
      if (source === $scope.definition) {
        return;
      }

      $scope.definition = source;
      $rootScope.$emit('event:raml-source-updated', $scope.definition);
    };

    $rootScope.$on('event:raml-source-updated', function (e, args) {
      var definition = args;
      ramlParser.load(definition).then(function (result) {
        $rootScope.$emit('event:raml-parsed', ramlReader.read(result));
        a = ramlParser.compose(definition);
      }, function (error) {
        console.log(error);
        $scope.errorMessage = error;
        $scope.$apply();
      });
    });

    $rootScope.$on('event:raml-parsed', function (e, args) {
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

      editor = CodeMirror.fromTextArea(document.getElementById('code'), {
        lineNumbers: true,
        mode: 'yaml',
        lineWrapping: true,
        theme: 'solarized dark',
        autofocus: true,
        indentUnit: 2,
        indentWithTabs: false,
        tabSize: 2,
        extraKeys: {"Ctrl-Space": "autocomplete"}
      });

      CodeMirror.commands.autocomplete = function(cm) {
        CodeMirror.showHint(cm, CodeMirror.hint.javascript);
      };

      editor.setSize(null, '100%');
      editor.on('update', $scope.sourceUpdated.bind($scope));

      $scope.sourceUpdated();
    }

    $scope.init();
  });
