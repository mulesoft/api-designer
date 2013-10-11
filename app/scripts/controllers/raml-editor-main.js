'use strict';

angular.module('ramlEditorApp')
  .constant('AUTOSAVE_INTERVAL', 60000)
  .constant('UPDATE_RESPONSIVENESS_INTERVAL', 300)
  .value('afterBootstrap', function () { })
  .controller('ramlMain', function (AUTOSAVE_INTERVAL, UPDATE_RESPONSIVENESS_INTERVAL,
    $scope, safeApply, ramlHint, ramlParser,
    ramlRepository, eventService, codeMirror, codeMirrorErrors, afterBootstrap,
    config) {
    var CodeMirror = codeMirror.CodeMirror, editor, currentUpdateTimer, saveTimer;

    $scope.consoleSettings = { displayTryIt: false };

    $scope.setTheme = function (theme) {
      config.set('theme', theme);
      config.save();
      $scope.theme = theme;
      safeApply();
    };

    window.setTheme = $scope.setTheme;

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

    $scope.triggerAutocomplete = function (cm) {
      var editorState = ramlHint.getEditorState(cm) || {},
          curLine = editorState.curLine || '',
          trimmedCurLine = curLine.trim(),
          end = editorState.end ? editorState.end.ch : 0,
          isKey = curLine.indexOf(':') > -1,
          firstChar = trimmedCurLine[0],
          currentPosIsLastChar = curLine.length === end;

      if (curLine && currentPosIsLastChar && !isKey && ['/', '#', '-'].indexOf(firstChar) === -1 ) {
        CodeMirror.showHint(cm, CodeMirror.hint.javascript);
      }
    };

    eventService.on('event:raml-source-updated', function (e, args) {
      var definition = args;
      $scope.errorMessage = '';
      ramlParser.load(definition).then(function (result) {
        codeMirrorErrors.clearAnnotations();
        eventService.broadcast('event:raml-parsed', result);
        $scope.$digest();
      }, function (error) {
        eventService.broadcast('event:raml-parser-error', error);
      });
    });

    eventService.on('event:raml-parsed', function (e, args) {
      var definition = args;
      codeMirrorErrors.clearAnnotations();
      $scope.title = definition.title;
      $scope.version = definition.version;
      eventService.broadcast('event:raml-operation-list-published', definition);
      $scope.hasErrors = false;
      safeApply();
    });

    eventService.on('event:raml-parser-error', function (e, args) {
      var error = args, annotations = [], PROBLEM_MARK = 'problem_mark',
        line = (error && error[PROBLEM_MARK] && error[PROBLEM_MARK].line) || 0,
        column = (error && error[PROBLEM_MARK] && error[PROBLEM_MARK].column) || 0;

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

    $scope.isShelfCollapsed = function () {
      return $scope.shelf.collapsed;
    };

    $scope.toggleShelf = function () {
      $scope.shelf.collapsed = !$scope.shelf.collapsed;
      config.set('shelf.collapsed', $scope.shelf.collapsed);
      config.save();
    };

    eventService.on('event:save', function () {
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
      $scope.theme = config.get('theme', '');
      $scope.shelf = {};
      $scope.shelf.collapsed =
        JSON.parse(config.get('shelf.collapsed', false));


      editor = codeMirror.initEditor();

      editor.on('change', function () {

        if (currentUpdateTimer) {
          clearTimeout(currentUpdateTimer);
        }
        currentUpdateTimer = setTimeout(function () {
          $scope.sourceUpdated();
          currentUpdateTimer = undefined;
        }, UPDATE_RESPONSIVENESS_INTERVAL);
      });

      editor.on('change', function (cm) {
        $scope.triggerAutocomplete(cm);
      });

      setTimeout(function () { eventService.broadcast('event:raml-editor-initialized', editor); }, 0);
      setTimeout(function () {
        $scope.bootstrap();
        afterBootstrap();
      }, 0);
    };

    $scope.init();
  });
