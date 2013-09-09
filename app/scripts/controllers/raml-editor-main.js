angular.module('ramlEditorApp')
  .controller('ramlMain', function ($scope, ramlReader, ramlParser, eventService, codeMirror, codeMirrorErrors) {
    var editor, currentUpdateTimer,
        UPDATE_RESPONSIVENESS_INTERVAL = 300;

    $scope.consoleSettings = { displayTryIt: false };

    $scope.sourceUpdated = function () {
      var source = editor.getValue();
      if (source === $scope.definition) {
        return;
      }

      $scope.definition = source;
      eventService.broadcast('event:raml-source-updated', $scope.definition);
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
      definition.baseUri = ramlReader.processBaseUri(definition);
      $scope.baseUri = definition.baseUri;
      $scope.title = definition.title;
      $scope.version = definition.version;
      eventService.broadcast('event:raml-operation-list-published', definition.resources);
      $scope.hasErrors = false;
      $scope.$apply();
    });

    eventService.on('event:raml-parser-error', function (e, args) {
      var error = args, annotations = [],
        line = (error && error.problem_mark && error.problem_mark.line) || 1,
        column = (error && error.problem_mark && error.problem_mark.column) || 1;

      annotations.push({ message: error.message, line: line, column: column });
      codeMirrorErrors.displayAnnotations(annotations);
      $scope.hasErrors = true;
      $scope.$apply();
    });

    $scope.init = function () {
      $scope.raml = {};
      $scope.definition = '';
      $scope.errorMessage = '';
      $scope.resources = '';
      $scope.documentation = '';
      $scope.baseUri = '';
      $scope.hasErrors = false;

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

      setTimeout(function () { eventService.broadcast('event:raml-editor-initialized', editor); }, 0);
      setTimeout($scope.sourceUpdated, 250);
    };

    $scope.init();
  });
