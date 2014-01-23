'use strict';

angular.module('ramlEditorApp')
  .constant('UPDATE_RESPONSIVENESS_INTERVAL', 800)
  .service('ramlParserFileReader', function ($http, ramlParser, ramlRepository, safeApplyWrapper) {
    function readLocFile(file) {
      var split = file.split('/');
      var name  = split.pop();
      var path  = split.join('/') || '/';

      return ramlRepository.loadFile({path: path, name: name}).then(function (file) {
        return file.contents;
      });
    }

    function readExtFile(file) {
      return $http.get(file).then(
        // success
        function (response) {
          return response.data;
        },

        // failure
        function (response) {
          var error = 'cannot fetch ' + file + ', check that the server is up and that CORS is enabled';
          if (response.status) {
            error += '(HTTP ' + response.status + ')';
          }

          throw error;
        }
      );
    }

    this.readFileAsync = safeApplyWrapper(null, function readFileAsync(file) {
      var deferredSrc = /^https?:\/\//.test(file) ? readExtFile(file) : readLocFile(file);
      var deferredDst = new ramlParser.RamlParser({}).q.defer();

      deferredSrc.then(
        // success
        deferredDst.resolve.bind(deferredDst),

        // failure
        deferredDst. reject.bind(deferredDst)
      );

      return deferredDst.promise;
    });
  })
  .controller('ramlEditorMain', function (UPDATE_RESPONSIVENESS_INTERVAL, $scope, $rootScope, $timeout, $window,
    safeApply, throttle, ramlHint, ramlParser, ramlParserFileReader, ramlRepository, eventService, codeMirror,
    codeMirrorErrors, config, $prompt, $confirm, safeApplyWrapper, $modal, fileList
  ) {
    var editor;
    var currentUpdateTimer;
    var currentFile;
    var extractCurrentFileLabel = function(file) {
      var label = '';
      if (file) {
        label = file.path;
        if (file.dirty) {
          label = '* ' + label;
        }
      }

      return label;
    };

    $window.setTheme = function (theme) {
      config.set('theme', theme);
      $scope.theme = $rootScope.theme = theme;
      safeApply($scope);
    };

    $scope.$on('event:raml-editor-file-selected', function(event, file) {
      currentFile = file;

      if (file.contents) {
        editor.setValue(file.contents);
      }
    });

    $scope.sourceUpdated = function () {
      var source = editor.getValue();

      if (source === $scope.definition) {
        return;
      }

      if ($scope.fileBrowser && $scope.fileBrowser.selectedFile) {
        $scope.fileBrowser.selectedFile.contents = source;
      }
      $scope.definition = source;

      eventService.broadcast('event:raml-source-updated', $scope.definition);
    };

    function loadRamlDefinition(definition) {
      return ramlParser.load(definition, null, {
        validate : true,
        transform: true,
        compose  : true,
        reader   : ramlParserFileReader
      });
    }

    eventService.on('event:raml-source-updated', function (e, definition) {
      codeMirrorErrors.clearAnnotations();

      if (definition.trim() === '') {
        $scope.hasErrors = false;
        return;
      }

      loadRamlDefinition(definition).then(
        // success
        safeApplyWrapper($scope, function (value) {
          eventService.broadcast('event:raml-parsed', value);
        }),

        // failure
        safeApplyWrapper($scope, function (error) {
          eventService.broadcast('event:raml-parser-error', error);
        })
      );
    });

    eventService.on('event:raml-parsed', safeApplyWrapper($scope, function (e, definition) {
      $scope.title     = definition.title;
      $scope.version   = definition.version;
      $scope.hasErrors = false;
    }));

    eventService.on('event:raml-parser-error', safeApplyWrapper($scope, function (e, args) {
      var error        = args;
      var problemMark  = 'problem_mark';
      var line         = error[problemMark] ? error[problemMark].line   : 0;
      var column       = error[problemMark] ? error[problemMark].column : 0;
      $scope.hasErrors = true;

      codeMirrorErrors.displayAnnotations([{
        line:    line + 1,
        column:  column + 1,
        message: error.message
      }]);
    }));

    $scope.openHelp = function openHelp() {
      $modal.open({
        templateUrl: 'views/help.html'
      });
    };

    $scope.toggleShelf = function () {
      $scope.shelf.collapsed = !$scope.shelf.collapsed;
      config.set('shelf.collapsed', $scope.shelf.collapsed);
    };

    $scope.getSelectedFileAbsolutePath = function getSelectedFileAbsolutePath() {
      return extractCurrentFileLabel(currentFile);
    };

    eventService.on('event:toggle-theme', function () {
      $window.setTheme(($scope.theme === 'dark') ? 'light' : 'dark');
    });

    (function bootstrap() {
      $scope.hasErrors        = false;
      $scope.theme            = $rootScope.theme = config.get('theme', 'dark');
      $scope.shelf            = {};
      $scope.shelf.collapsed  = JSON.parse(config.get('shelf.collapsed', 'false'));
      $scope.editor           = editor = codeMirror.initEditor();

      editor.on('change', function () {
        var updateResponsivenessInterval = config.get('updateResponsivenessInterval', UPDATE_RESPONSIVENESS_INTERVAL);

        if (currentUpdateTimer) {
          $timeout.cancel(currentUpdateTimer);
        }

        currentUpdateTimer = $timeout(function () {
          $scope.sourceUpdated();
          currentUpdateTimer = undefined;
        }, updateResponsivenessInterval);
      });

      editor.on('change', function (cm) {
        if (cm.getLine(cm.getCursor().line).trim()) {
          cm.execCommand('autocomplete');
        }
      });

      $timeout(function () {
        eventService.broadcast('event:raml-editor-initialized', editor);
      });

      // Warn before leaving the page
      $window.onbeforeunload = function () {
        var anyUnsavedChanges = fileList.files.some(function(file) {
          return file.dirty;
        });
        if (anyUnsavedChanges) {
          return 'WARNING: You have unsaved changes. Those will be lost if you leave this page.';
        }
      };
    })();
  });
