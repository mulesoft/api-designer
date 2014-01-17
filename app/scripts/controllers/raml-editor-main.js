'use strict';

angular.module('ramlEditorApp')
  .constant('UPDATE_RESPONSIVENESS_INTERVAL', 800)
  .service('ramlParserFileReader', function ($http, ramlParser, ramlRepository, safeApplyWrapper) {
    function readLocFile(file) {
      var split = file.split('/');
      var name  = split.pop();
      var path  = split.join('/') || '/';

      return ramlRepository.loadFile({path: path, name: name}).then(
        function success(file) {
          return file.contents;
        }
      );
    }

    function readExtFile(file) {
      return $http.get(file).then(
        // success
        function success(response) {
          return response.data;
        },

        // failure
        function failure(response) {
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
    safeApply, safeApplyWrapper, debounce, throttle, ramlHint, ramlParser, ramlParserFileReader, ramlRepository, eventService, codeMirror,
    codeMirrorErrors, config, $prompt, $confirm, $modal, fileList
  ) {
    var editor;
    var MODES = {
      xml: { name: 'xml' },
      xsd: { name: 'xml', alignCDATA: true },
      json: { name: 'javascript', json: true },
      md: { name: 'gfm' },
      raml: { name: 'raml' }
    };

    $window.setTheme = function setTheme(theme) {
      config.set('theme', theme);
      $scope.theme = $rootScope.theme = theme;
      safeApply($scope);
    };

    $scope.$on('event:raml-editor-file-selected', function onFileSelected(event, file) {
      editor.setValue(file.contents);
      $scope.fileParsable = $scope.getIsFileParsable(file);

      var mode = MODES[file.type] || MODES.raml;
      editor.setOption('mode', mode);
    });

    $scope.sourceUpdated = function sourceUpdated() {
      var source       = editor.getValue();
      var selectedFile = $scope.fileBrowser.selectedFile;

      if (source === selectedFile.contents) {
        return;
      }

      selectedFile.contents = source;
      $scope.fileParsable   = $scope.getIsFileParsable(selectedFile);

      eventService.broadcast('event:raml-source-updated', source);
    };

    $scope.loadRaml = function loadRaml(raml) {
      return ramlParser.load(raml, null, {
        validate : true,
        transform: true,
        compose:   true,
        reader:    ramlParserFileReader
      });
    };

    eventService.on('event:raml-source-updated', function onRamlSourceUpdated(event, source) {
      codeMirrorErrors.clearAnnotations();

      if (!$scope.fileParsable || source.trim() === '') {
        $scope.hasErrors = false;
        return;
      }

      $scope.loadRaml(source).then(
        // success
        safeApplyWrapper($scope, function success(value) {
          eventService.broadcast('event:raml-parsed', value);
        }),

        // failure
        safeApplyWrapper($scope, function failure(error) {
          eventService.broadcast('event:raml-parser-error', error);
        })
      );
    });

    eventService.on('event:raml-parsed', safeApplyWrapper($scope, function onRamlParser(event, raml) {
      $scope.title     = raml.title;
      $scope.version   = raml.version;
      $scope.hasErrors = false;
    }));

    eventService.on('event:raml-parser-error', safeApplyWrapper($scope, function onRamlParserError(event, error) {
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

    $scope.getIsFileParsable = function getIsFileParsable(file, contents) {
      if (file.name.slice(-5) !== '.raml') {
        return false;
      }

      contents = arguments.length > 1 ? contents : file.contents;
      if (contents.indexOf('#%RAML 0.8\n') !== 0) {
        return false;
      }

      return true;
    };

    $scope.getIsShelfVisible = function getIsShelfVisible() {
      if (!$scope.fileParsable) {
        return false;
      }

      return true;
    };

    $scope.getIsConsoleVisible = function getIsConsoleVisible() {
      if (!$scope.fileParsable) {
        return false;
      }

      return true;
    };

    $scope.toggleShelf = function toggleShelf() {
      $scope.shelf.collapsed = !$scope.shelf.collapsed;
      config.set('shelf.collapsed', $scope.shelf.collapsed);
    };

    eventService.on('event:toggle-theme', function onToggleTheme() {
      $window.setTheme(($scope.theme === 'dark') ? 'light' : 'dark');
    });

    (function bootstrap() {
      $scope.hasErrors       = false;
      $scope.theme           = $rootScope.theme = config.get('theme', 'dark');
      $scope.shelf           = {};
      $scope.shelf.collapsed = JSON.parse(config.get('shelf.collapsed', 'false'));
      $scope.editor          = editor = codeMirror.initEditor();

      editor.on('change', debounce(function onChange() {
        $scope.sourceUpdated();
      }, config.get('updateResponsivenessInterval', UPDATE_RESPONSIVENESS_INTERVAL)));

      editor.on('change', function onChange(cm) {
        if (cm.getLine(cm.getCursor().line).trim()) {
          cm.execCommand('autocomplete');
        }
      });

      // Warn before leaving the page
      $window.onbeforeunload = function () {
        var anyUnsavedChanges = fileList.files.some(function (file) {
          return file.dirty;
        });

        if (anyUnsavedChanges) {
          return 'WARNING: You have unsaved changes. Those will be lost if you leave this page.';
        }
      };
    })();
  })
;
