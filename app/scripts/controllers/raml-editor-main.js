angular.module('ramlConsoleApp')
  .controller('ramlMain', function ($scope, ramlReader, ramlParser, ramlHelper, eventService, codeMirror, codeMirrorErrors) {
    var editor, currentUpdateTimer,
        UPDATE_RESPONSIVENESS_INTERVAL = 300;

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
      $scope.errorMessage = '';
      ramlParser.load(definition).then(function (result) {
        eventService.broadcast('event:raml-parsed', ramlReader.read(result));
      }, function (error) {
        eventService.broadcast('event:raml-parser-error', error);
      });
    });

    eventService.on('event:raml-parsed', function (e, args) {
      var definition = args;
      codeMirrorErrors.clearAnnotations();
      definition.baseUri = ramlHelper.processBaseUri(definition);
      eventService.broadcast('event:raml-sidebar-clicked', { isResource: true, data: definition });
    });

    eventService.on('event:raml-parser-error', function (e, args) {
      var error = args;
      var annotations = [];

      annotations.push({ message: error.message, line: error.problem_mark.line, column: error.problem_mark.column });
      codeMirrorErrors.displayAnnotations(annotations);
    });

    $scope.init = function () {
      $scope.raml = {};
      $scope.definition = '';
      $scope.errorMessage = '';
      $scope.resources = '';
      $scope.documentation = '';
      $scope.baseUri = '';

      editor = codeMirror.initEditor();

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

      setTimeout($scope.sourceUpdated, 0);
    }

    $scope.init();
  });
