angular.module('ramlEditorApp')
  .constant('AUTOSAVE_INTERVAL', 60000)
  .constant('UPDATE_RESPONSIVENESS_INTERVAL', 300)
  .value('afterBootstrap', function () { })
  .controller('ramlMain', function (AUTOSAVE_INTERVAL, UPDATE_RESPONSIVENESS_INTERVAL,
    $scope, safeApply, ramlReader, ramlParser,
    ramlRepository, eventService, codeMirror, codeMirrorErrors, afterBootstrap) {
    var editor, currentUpdateTimer, saveTimer;


    $scope.consoleSettings = { displayTryIt: false };

    $scope.sourceUpdated = function () {
      var source = editor.getValue();
      var file = $scope.file;
      if (source === $scope.definition) {
        return;
      }

      if (file && !$scope.firstLoad) {
        file.dirty = true;
      }

      $scope.firstLoad = false;
      $scope.definition = source;
      eventService.broadcast('event:raml-source-updated', $scope.definition);
    };

    eventService.on('event:raml-source-updated', function (e, args) {
      var definition = args;
      $scope.errorMessage = '';
      ramlParser.load(definition).then(function (result) {
        codeMirrorErrors.clearAnnotations();
        eventService.broadcast('event:raml-parsed', result);
        $scope.hasErrors = false;
        safeApply();
      }, function (error) {
        eventService.broadcast('event:raml-parser-error', error);
      });
    });

    eventService.on('event:raml-parser-error', function (e, args) {
      var error = args, annotations = [],
        line = (error && error.problem_mark && error.problem_mark.line) || 0,
        column = (error && error.problem_mark && error.problem_mark.column) || 0;

      annotations.push({ message: error.message, line: line + 1, column: column + 1});
      codeMirrorErrors.displayAnnotations(annotations);
      $scope.hasErrors = true;
      safeApply();
    });

    $scope.bootstrap = function () {
      ramlRepository.bootstrap(function (file) {
        $scope.file = file;
        $scope.firstLoad = true;
        editor.replaceRange(file.contents, {line: 0, ch: 0}, {line: 0, ch: 0});
        editor.setCursor({line: 0, ch: 0});
      });
    };

    $scope.canSave = function () {
      return $scope.file && $scope.file.dirty;
    };


    $scope.save = function () {
      if ($scope.canSave()) {
        $scope.file.contents = editor.getValue();
        ramlRepository.saveFile($scope.file, function () {
          safeApply();
          if (saveTimer) {
            clearTimeout(saveTimer);
          }
          saveTimer = setTimeout($scope.save, AUTOSAVE_INTERVAL);
        });
      }
    };

    eventService.on('event:save', function (e, args) {
      $scope.save();
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
      setTimeout(function () {
        $scope.bootstrap();
        afterBootstrap();
      }, 0);

      //window.editor = editor;
    };

    $scope.init();
  });
