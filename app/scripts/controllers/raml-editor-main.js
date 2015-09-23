(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .constant('UPDATE_RESPONSIVENESS_INTERVAL', 800)
    .service('ramlParserFileReader', function (
      $http,
      $q,
      ramlParser,
      ramlRepository,
      safeApplyWrapper
    ) {
      function loadFile (path) {
        return ramlRepository.loadFile({path: path}).then(
          function success(file) {
            return file.contents;
          }
        );
      }

      function readLocFile(path) {
        var file = ramlRepository.getByPath(path);

        if (file) {
          return file.loaded ? $q.when(file.contents) : loadFile(path);
        }

        return $q.reject('File with path "' + path + '" does not exist');
      }

      function readExtFile(path) {
        return $http.get(path, {transformResponse: null}).then(
          // success
          function success(response) {
            return response.data;
          },

          // failure
          function failure(response) {
            var error = 'cannot fetch ' + path + ', check that the server is up and that CORS is enabled';
            if (response.status) {
              error += '(HTTP ' + response.status + ')';
            }

            throw error;
          }
        );
      }

      this.readFileAsync = safeApplyWrapper(null, function readFileAsync(file) {
        return (/^https?:\/\//).test(file) ? readExtFile(file) : readLocFile(file);
      });
    })
    .controller('ramlEditorMain', function (UPDATE_RESPONSIVENESS_INTERVAL, $scope, $rootScope, $timeout, $window,
      safeApply, safeApplyWrapper, debounce, throttle, ramlHint, ramlParser, ramlParserFileReader, ramlRepository, codeMirror,
      codeMirrorErrors, config, $prompt, $confirm, $modal, eventEmitter, ramlEditorContext, newFileService, hotkeys
    ) {
      $scope.rightBarCollapsed = true;

      $scope.toggleRightBar = function toggleRightBar() {
        $scope.rightBarCollapsed = !$scope.rightBarCollapsed;
      };

      $scope.activeMode = 'source';

      $scope.setMode = function setMode(mode) {
        if (mode === 'documentation') {
          loadDocumentation();
        }

        $scope.activeMode = mode;
      };

      $scope.isActive = function isActive(mode) {
        return $scope.activeMode === mode;
      };

      var editor, lineOfCurrentError, currentFile;

      function extractCurrentFileLabel(file) {
        var label = '';
        if (file) {
          label = file.path;
          if (file.dirty) {
            label = '* ' + label;
          }
        }

        return label;
      }

      function calculatePositionOfErrorMark(currentLine) {
        function onlyFolds(textMark) {
          return textMark.__isFold;
        }

        function toStartingLine(textMark) {
          return textMark.find().from.line;
        }

        function toMinimum(currentMin, val) {
          return Math.min(currentMin, val);
        }

        var position = { line: currentLine };
        return editor.findMarksAt(position).filter(onlyFolds).map(toStartingLine).reduce(toMinimum, lineOfCurrentError);
      }

      function formatErrorMessage(message, actualLine, displayLine) {
        if (displayLine === actualLine) {
          return message;
        }

        return 'Error on line ' + (actualLine + 1) + ': ' + message;
      }

      $window.setTheme = function setTheme(theme) {
        config.set('theme', theme);
        $scope.theme = $rootScope.theme = theme;
        safeApply($scope);
      };

      eventEmitter.subscribe('event:raml-editor-file-selected', function onFileSelected(file) {
        currentFile = file;

        // Empty console so that we remove content from previous open RAML file
        // eventEmitter.publish('event:raml-parsed', {});

        $scope.originalValue = file.contents;

        var dataContent = file.contents;

        $scope.currentFile = file;

        $scope.fileBrowser.selectedFile.raml = file.contents;

        // Every file must have a unique document for history and cursors.
        if (!file.doc) {
          file.doc = new CodeMirror.Doc(dataContent);
        }

        ramlEditorContext.read(dataContent.split('\n'));

        if (file.root) {
          ramlEditorContext.fullCompile();
        }

        editor.swapDoc(file.doc);
        editor.focus();

        // After swapping the doc, configure the editor for the current file
        // extension.
        codeMirror.configureEditor(editor, file.extension);

        $scope.fileParsable = $scope.getIsFileParsable(file);

        // Inform the editor source has changed. This is also called when the
        // editor triggers the change event, swapping the doc does not trigger
        // that event, so we must explicitly call the sourceUpdated function.
        $scope.sourceUpdated();
      });

      $scope.$watch('fileBrowser.selectedFile.contents', function (contents) {
        if (contents != null && contents !== editor.getValue()) {
          currentFile.doc = new CodeMirror.Doc(contents);
          editor.swapDoc(currentFile.doc);
        }
      });

      var updateFile = debounce(function updateFile () {
        eventEmitter.publish('event:file-updated');
      }, config.get('updateResponsivenessInterval', UPDATE_RESPONSIVENESS_INTERVAL));

      eventEmitter.subscribe('event:raml-editor-file-created', updateFile);

      eventEmitter.subscribe('event:raml-editor-file-removed', updateFile);

      eventEmitter.subscribe('event:raml-editor-file-removed', function onFileSelected(file) {
        if (currentFile === file) {
          currentFile = undefined;
          editor.swapDoc(new CodeMirror.Doc(''));
        }
      });

      $scope.canExportFiles = function canExportFiles() {
        return ramlRepository.canExport();
      };

      $scope.supportsFolders = ramlRepository.supportsFolders;

      $scope.sourceUpdated = function sourceUpdated() {
        var source       = editor.getValue();
        var selectedFile = $scope.fileBrowser.selectedFile;

        selectedFile.contents = source;

        $scope.clearErrorMarks();
        $scope.fileParsable   = $scope.getIsFileParsable(selectedFile);

        eventEmitter.publish('event:editor:include', {});

        updateFile();
      };

      function loadDocumentation() {
        var file = $scope.fileBrowser.selectedFile;

        $scope.loadRaml(file.contents, file.path).then(
          // success
          safeApplyWrapper($scope, function success(value) {
            $rootScope.$broadcast('event:raml-parsed', value);
          }),
          function error() {}
        );
      }

      $scope.loadRaml = function loadRaml(definition, location) {
        return ramlParser.load(definition, location, {
          validate : true,
          transform: true,
          compose:   true,
          reader:    ramlParserFileReader
        });
      };

      $scope.clearErrorMarks = function clearErrorMarks() {
        codeMirrorErrors.clearAnnotations();
        $scope.hasErrors = false;
      };

      eventEmitter.subscribe('event:raml-parser-sucess', function () {
        $scope.clearErrorMarks();
      });

      eventEmitter.subscribe('event:raml-parser-error', safeApplyWrapper($scope, function onRamlParserError(data) {
        var error      = data.error;
        var contextual = data.contextual;
        /*jshint sub: true */
        var problemMark = error['problem_mark'],
            displayLine = 0,
            displayColumn = 0,
            message = error.message;

        lineOfCurrentError = displayLine;
        $scope.currentError = error;

        if (problemMark) {
          lineOfCurrentError = problemMark.line;
          displayLine = calculatePositionOfErrorMark(lineOfCurrentError);
          displayColumn = problemMark.column;
        }

        var line = lineOfCurrentError;

        if (contextual) {
          var prop         = message.match(/'(.*)'/g);
          var content      = ramlEditorContext.context.content;
          var currentLine  = editor.getCursor().line;
          var currentScope = ramlEditorContext.context.scopes[currentLine];

          prop = prop !== null ? prop.pop() : '';
          prop = prop.replace(/\'/g, '');

          for (var i = currentLine; i < content.length; i++) {
            var scope = ramlEditorContext.context.scopes[i];

            if (currentScope === scope && content[i].indexOf(prop) !== -1) {
              line = i;
              break;
            }
          }
        }

        codeMirrorErrors.displayAnnotations([{
          line:    line + 1,
          column:  displayColumn + 1,
          message: formatErrorMessage(message, line, displayLine)
        }]);
      }));

      function getIndentation(str) {
        return str.match(/^\s*/)[0].length;
      }

      eventEmitter.subscribe('event:editor:extract-to', safeApplyWrapper($scope, function extractTo(cm) {
        var message  = 'Extract to';
        var contents = cm.getSelection();
        var key      = contents.split(':');
        var filename, last;

        if (key.length > 1) {
          key      = key[0];
          filename = (key + '.raml').replace(/\s/g, '');
          contents = contents.replace(key + ':', '');
          last     = cm.getCursor('to').line;

          if (cm.getCursor('to').xRel === 0) {
            last = cm.getCursor('to').line-1;
          }

          cm.setSelection(cm.getCursor('from'), {line: last, ch: cm.getLine(last).length});

          var elements = contents.split('\n');
          var indentation;

          elements = elements.slice(1, elements.length);
          indentation = getIndentation(elements[0]);
          elements.forEach(function (line, i) {
            elements[i] = line.substring(indentation, line.length);
          });

          return newFileService.prompt($scope.homeDirectory, 'Extract to', message, elements.join('\n'), filename, true)
            .then(function (result) {
              if (filename) {
                cm.replaceSelection(key + ': !include ' + result.path);
              }

              eventEmitter.publish('event:notification:save-all', {notify: false});
            });
        }
      }));

      $scope.openHelp = function openHelp() {
        $modal.open({
          templateUrl: 'views/help.html'
        });
      };

      $scope.getIsFileParsable = function getIsFileParsable(file, contents) {
        // check for file extension
        if (file.extension !== 'raml') {
          return false;
        }

        // check for raml version tag as a very first line of the file
        contents = arguments.length > 1 ? contents : file.contents;
        if (contents.search(/^\s*#%RAML( \d*\.\d*)?\s*(\n|$)/) !== 0) {
          return false;
        }

        // if there is root file only that file is marked as parsable
        if ((($scope.fileBrowser || {}).rootFile || file) !== file) {
          return false;
        }

        return true;
      };

      $scope.getIsMockingServiceVisible = function getIsMockingServiceVisible() {
        if ($scope.mockingServiceDisabled || !$scope.fileParsable) {
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
        if ($scope.tryIt && $scope.tryIt.enabled && $scope.tryIt.selectedMethod) {
          return true;
        }

        return false;
      };

      $scope.toggleShelf = function toggleShelf() {
        $scope.shelf.collapsed = !$scope.shelf.collapsed;
        config.set('shelf.collapsed', $scope.shelf.collapsed);
      };

      $scope.getSelectedFileAbsolutePath = function getSelectedFileAbsolutePath() {
        return extractCurrentFileLabel(currentFile);
      };

      eventEmitter.subscribe('event:toggle-theme', function onToggleTheme() {
        $window.setTheme(($scope.theme === 'dark') ? 'light' : 'dark');
      });

      $scope.mainClick = function mainClick($event) {
        if ($event.target.parentElement && $event.target.parentElement.className.indexOf('omnisearch') === -1) {
          $scope.omnisearch.close();
        }
      };

      $scope.openOmnisearch = function openOmnisearch(e) {
        e.preventDefault();
        $scope.omnisearch.open();
      };

      $scope.toggleCheatSheet = function toggleCheatSheet() {
        hotkeys.toggleCheatSheet();
      };

      (function bootstrap() {
        $scope.currentError    = undefined;
        $scope.theme           = $rootScope.theme = config.get('theme', 'dark');
        $scope.shelf           = {};
        $scope.shelf.collapsed = JSON.parse(config.get('shelf.collapsed', 'false'));
        $scope.editor          = editor = codeMirror.initEditor();

        editor.on('fold', function (cm, start, end) {
          if (start.line <= lineOfCurrentError && lineOfCurrentError <= end.line) {
            codeMirrorErrors.displayAnnotations([{
              line:    start.line + 1,
              message: formatErrorMessage($scope.currentError.message, lineOfCurrentError, start.line)
            }]);
          }
        });

        editor.on('unfold', function () {
          var displayLine = calculatePositionOfErrorMark(lineOfCurrentError);

          var message = formatErrorMessage($scope.currentError.message, lineOfCurrentError, displayLine);
          codeMirrorErrors.displayAnnotations([{
            line:    displayLine + 1,
            message: message
          }]);
        });

        editor.on('change', function onChange(cm) {
          safeApplyWrapper($scope, function () {
            var file    = $scope.fileBrowser.selectedFile;
            var orig    = $scope.originalValue;
            var current = cm.getValue();

            file.dirty = orig !== current;

            $scope.workingFiles[file.name] = file;
            $scope.sourceUpdated();
          })();
        });

        eventEmitter.subscribe('event:editor:new:file', safeApplyWrapper($scope, function (data) {
          var file = data.file;
          $scope.workingFiles[file.name] = file;
        }));

        eventEmitter.subscribe('event:editor:remove:file', safeApplyWrapper($scope, function (data) {
          var file = data.file;
          delete $scope.workingFiles[file.name];
        }));

        $window.alreadyNotifiedExit = false;

        $window.editorFilesystemIsDirty = function editorFilesystemIsDirty() {
          var dirtyFile = false;
          $scope.homeDirectory.forEachChildDo(function (t) {
            dirtyFile = t.dirty || dirtyFile;
          });

          return dirtyFile;
        };

        // Warn before leaving the page
        $window.onbeforeunload = function () {
          if (!$window.alreadyNotifiedExit && $window.editorFilesystemIsDirty()) {
            return 'WARNING: You have unsaved changes. Those will be lost if you leave this page.';
          }
        };
      })();
    })
  ;
})();
