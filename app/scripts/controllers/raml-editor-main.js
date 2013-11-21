'use strict';

angular.module('ramlEditorApp')
  .constant('AUTOSAVE_INTERVAL', 60000)
  .constant('UPDATE_RESPONSIVENESS_INTERVAL', 800)
  .constant('REFRESH_FILES_INTERVAL', 5000)
  .constant('DEFAULT_PATH', '/')
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
          var error = 'cannot fetch ' + file;
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
  .controller('ramlMain', function (AUTOSAVE_INTERVAL, UPDATE_RESPONSIVENESS_INTERVAL,
    REFRESH_FILES_INTERVAL, DEFAULT_PATH, $scope, $rootScope, $timeout, $window, safeApply, throttle, ramlHint,
    ramlParser, ramlParserFileReader, ramlRepository, eventService, codeMirror, codeMirrorErrors, config, $prompt, $confirm) {
    var CodeMirror = codeMirror.CodeMirror, editor, saveTimer, currentUpdateTimer;

    $scope.setTheme = function (theme) {
      config.set('theme', theme);
      $scope.theme = $rootScope.theme = theme;
      safeApply($scope);
    };
    $window.setTheme = $scope.setTheme;

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
      var editorState = ramlHint.getEditorState(cm);
      var curLine = editorState.curLine;
      var curLineTrimmed = curLine.trim();
      var offset = curLine.indexOf(curLineTrimmed);
      var lineNumber = editorState.start ? editorState.start.line : 0;

      if (!curLineTrimmed) {
        return;
      }

      // nothing to autocomplete within comments
      // -> "#..."
      if ((function () {
        var indexOf = curLineTrimmed.indexOf('#');
        return lineNumber > 0 &&
               indexOf !== -1 &&
               editorState.cur.ch > (indexOf + offset)
        ;
      })()) {
        return;
      }

      // nothing to autocomplete within resources
      // -> "/..."
      if ((function () {
        var indexOf = curLineTrimmed.indexOf('/');
        return indexOf === 0 &&
               editorState.cur.ch >= (indexOf + offset)
        ;
      })()) {
        return;
      }

      // nothing to autocomplete for key value
      // -> "key: ..."
      if ((function () {
        var indexOf = curLineTrimmed.indexOf(': ');
        return indexOf !== -1 &&
               editorState.cur.ch >= (indexOf + offset + 2)
        ;
      })()) {
        return;
      }

      // nothing to autocomplete prior array
      // -> "...- "
      if ((function () {
        var indexOf = curLineTrimmed.indexOf('- ');
        return indexOf === 0 &&
               editorState.cur.ch < (indexOf + offset)
        ;
      })()) {
        return;
      }

      CodeMirror.showHint(cm, CodeMirror.hint.javascript, {
        ghosting: true
      });
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

      loadRamlDefinition(definition).then(function (result) {
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
      safeApply($scope);
    });

    eventService.on('event:raml-parser-error', function (e, args) {
      var error = args, annotations = [], PROBLEM_MARK = 'problem_mark',
        line = (error && error[PROBLEM_MARK] && error[PROBLEM_MARK].line) || 0,
        column = (error && error[PROBLEM_MARK] && error[PROBLEM_MARK].column) || 0;

      annotations.push({ message: error.message, line: line + 1, column: column + 1});
      codeMirrorErrors.displayAnnotations(annotations);
      $scope.hasErrors = true;
      safeApply($scope);
    });

    $scope.bootstrap = function () {
      ramlRepository.bootstrap().then($scope.switchFile);
    };

    $scope.switchFile = function (file) {
      if (!$scope.canSave() || ($scope.canSave() && $scope._confirmLoseChanges())) {
        $scope.file = file;
        $scope.firstLoad = true;
        editor.setValue($scope.file.contents);
        editor.setCursor({line: 0, ch: 0});
        editor.focus();
      }
    };

    $scope.canSave = function () {
      return $scope.file && $scope.file.dirty;
    };

    $scope.canSaveAs = function () {
      return $scope.file && $scope.file.persisted;
    };

    $scope.save = function () {
      if (!$scope.canSave()) {
        return;
      }

      if (!$scope.file.persisted) {
        if (!$scope._promptForFileName()) {
          return;
        }
      }

      $scope.saveFile();
    };

    $scope.saveAs = function() {
      if (!$scope.file.persisted) {
        return;
      }

      if (!$scope._promptForFileName()) {
        return;
      }

      $scope.file.dirty = true;
      $scope.saveFile();
    };

    $scope.newFile = function () {
      if (!$scope.canSave() || ($scope.canSave() && $scope._confirmLoseChanges())) {
        $scope.file = ramlRepository.createFile();
        editor.setValue($scope.file.contents);
        editor.setCursor({line: 1, ch: 0});

        $timeout.cancel(saveTimer);
      }
    };

    $scope.toggleShelf = function () {
      $scope.shelf.collapsed = !$scope.shelf.collapsed;
      config.set('shelf.collapsed', $scope.shelf.collapsed);
    };

    $scope.collapseBrowser = function () {
      var browser = $scope.browser;
      if (browser.expanded) {
        $scope.toggleBrowser();
      }
    };

    $scope.toggleBrowser = function () {
      var browser = $scope.browser;
      browser.expanded = !browser.expanded;

      if (browser.expanded) {
        $scope.listFiles();
      }
    };

    $scope.listFiles = throttle(function () {
      $scope.files.loading = true;
      ramlRepository.getDirectory(DEFAULT_PATH)
        .then(function (files) {
          $scope.files = files;
          safeApply($scope);
        })
        .always(function () {
          delete $scope.files.loading;
        })
      ;
    }, REFRESH_FILES_INTERVAL);

    $scope.saveFile = function() {
      $scope.file.contents = editor.getValue();
      ramlRepository.saveFile($scope.file).then(function () {
        eventService.broadcast('event:notification',
          {message: 'File saved.', expires: true});
        safeApply($scope);

        if (saveTimer) {
          $timeout.cancel(saveTimer);
        }

        saveTimer = $timeout($scope.save, AUTOSAVE_INTERVAL);
      });
    };

    $scope.loadFile = function (fileEntry) {
      var browser = $scope.browser;
      browser.expanded = false;

      ramlRepository.loadFile(fileEntry).then($scope.switchFile);
    };

    $scope.deleteFile = function (file) {
      var currentFile = $scope.file;
      var fileIndex = $scope.files.indexOf(file);

      if (! $confirm('Are you sure you want to delete the file: "' + file.name + '" ?')) {
        return;
      }

      ramlRepository.removeFile(file).then(function () {
        $scope.files.splice(fileIndex, 1);

        if (currentFile.name !== file.name) {
          return;
        }

        if ($scope.files.length) {
          $scope.loadFile($scope.files[0]);
        } else {
          $scope.switchFile(ramlRepository.createFile());
        }
      });

      $scope.collapseBrowser();
    };

    eventService.on('event:save', function () {
      $scope.save();
    });

    $scope.init = function () {
      $scope.raml = {};
      $scope.definition = '';
      $scope.resources = '';
      $scope.documentation = '';
      $scope.baseUri = '';
      $scope.hasErrors = false;
      $scope.theme = $rootScope.theme = config.get('theme', 'dark');
      $scope.shelf = {};
      $scope.shelf.collapsed = JSON.parse(config.get('shelf.collapsed', false));
      $scope.files = [];
      $scope.browser = {};
      $scope.browser.expanded = false;

      editor = codeMirror.initEditor();

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
        $scope.triggerAutocomplete(cm);
      });

      $timeout(function () {
        eventService.broadcast('event:raml-editor-initialized', editor);
        $scope.bootstrap();
      });
    };

    $scope.init();

    $scope._promptForFileName = function () {
      var fileName = $prompt('File Name?', $scope.file.name);
      $scope.file.name = fileName || $scope.file.name;
      return !!fileName;
    };

    $scope._confirmLoseChanges = function () {
      return $confirm('Are you sure you want to lose your unsaved changes?');
    };
  });
