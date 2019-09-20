(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .constant('UPDATE_RESPONSIVENESS_INTERVAL', 800)
    .controller('ramlEditorMain', function (UPDATE_RESPONSIVENESS_INTERVAL, $scope, $rootScope, $timeout, $window,
      safeApply, safeApplyWrapper, debounce, ramlWorker, ramlRepository, codeMirror,
      codeMirrorErrors, config, $prompt, $confirm, $modal, mockingServiceClient, $q, ramlEditorMainHelpers
    ) {
      var editor, lineOfCurrentError, currentFile;

      $rootScope.mockMigrated = false;
      $scope.mockingMigratedDismissed = false;

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

      $scope.$on('event:raml-editor-file-selected', function onFileSelected(event, file) {
        currentFile = file;

        if (ramlEditorMainHelpers.isApiDefinitionLike(file.contents)) {
          // Empty console so that we remove content from previous open RAML file
          $rootScope.$broadcast('event:raml-parsed', {});
        }

        // Every file must have a unique document for history and cursors.
        if (!file.doc) {
          file.doc = new CodeMirror.Doc(file.contents);
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
        $rootScope.$broadcast('event:file-updated');
      }, config.get('updateResponsivenessInterval', UPDATE_RESPONSIVENESS_INTERVAL));

      $scope.$on('event:raml-editor-file-created', updateFile);

      $scope.$on('event:raml-editor-file-removed', updateFile);

      $scope.$on('event:raml-editor-file-removed', function onFileSelected(event, file) {
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

        $scope.clearErrorMarks();
        selectedFile.contents = source;
        $scope.fileParsable   = $scope.getIsFileParsable(selectedFile);

        updateFile();
      };

      $scope.loadRaml = function loadRaml(definition, path) {
        return ramlWorker.ramlParse({path: path, contents: definition}).then(function (raml) {
          return ramlEditorMainHelpers.isApiDefinitionLike(definition) ? raml : null;
        });
      };

      $scope.clearErrorMarks = function clearErrorMarks() {
        codeMirrorErrors.clearAnnotations();
        $scope.hasErrors = false;
        $scope.currentErrorCount = 0;
        $scope.currentWarningCount = 0;

        if (!currentFile || !$scope.fileParsable || currentFile.doc.getValue().trim() === '') {
          $scope.currentError = undefined;
          lineOfCurrentError = undefined;
        }
      };

      var parseTimer;
      $scope.parsing = 0;
      $scope.$on('event:file-updated', function onFileUpdated() {
        $scope.clearErrorMarks();

        $timeout.cancel(parseTimer);
        parseTimer = $timeout(function defer() {
          $scope.clearErrorMarks();
          if (!currentFile || !$scope.fileParsable || currentFile.doc.getValue().trim() === '') { return; }
          $scope.parsing++;

          $scope.loadRaml(currentFile.doc.getValue(), currentFile.path).then(
            // parse completed
            safeApplyWrapper($scope, function completeParse(api) {
              $scope.parsing--;
              $scope.clearErrorMarks();
              if (api && api.path === currentFile.path && $scope.parsing === 0) {

                var issues = api.errors; // errors and warnings
                if (issues && issues.length > 0) {
                  $rootScope.$broadcast('event:raml-parser-error', issues);

                  $scope.currentWarningCount = issues.reduce(function (count, issue) {
                    return issue.isWarning ? count + 1 : count;
                  }, 0);

                  $scope.currentErrorCount = issues.reduce(function (count, issue) {
                    return !issue.isWarning ? count + 1 : count;
                  }, 0);
                }

                if ($scope.currentErrorCount === 0) {
                  var raml = api.specification;
                  $rootScope.$broadcast('event:raml-parsed', raml);
                }

                $('.CodeMirror').each(function(i, el){
                  el.CodeMirror.refresh();
                });
              }
            })).catch(
              // unexpected failure
              safeApplyWrapper($scope, function failureParse(error) {
                $scope.parsing--;
                if (error !== 'aborted' && error.path === currentFile.path && $scope.parsing === 0) {
                  $scope.currentErrorCount = 0;
                  $scope.currentWarningCount = 0;
                  $rootScope.$broadcast('event:raml-parser-error', error.parserErrors || error);
                }
              })
            );
        }, 700);
      });

      $scope.$on('event:raml-parsed', safeApplyWrapper($scope, function onRamlParser(event, raml) {
        $scope.fileBrowser.selectedFile.raml = raml;
        $scope.raml         = raml;
        $scope.title        = raml && raml.title;
        $scope.version      = raml && raml.version;
        $scope.ramlError    = undefined;
        $scope.currentError = undefined;
        lineOfCurrentError  = undefined;
      }));

      $scope.$on('event:raml-parser-error', safeApplyWrapper($scope, function onRamlParserError(event, errors) {
        var parserErrors = Array.isArray(errors) ? errors : [{line: 0, column: 1, message: errors.message, isWarning: errors.isWarning}];

        $scope.ramlError = errors;

        codeMirrorErrors.displayAnnotations(parserErrors.map(function mapErrorToAnnotation(error) {
          var errorInfo = error;
          var tracingInfo = { line : undefined, column : undefined, path : undefined };
          var needErrorPath = error.trace !== undefined;

          function findError(errors, selectedFile) {
            for (var i = 0; i < errors.length; i++) {
              var error = errors[i];
              if (error.path === selectedFile.name) {
                error.from = errorInfo;
                return error;
              }
              else if (error.trace) {
                var innerError = findError(error.trace, selectedFile);
                if (innerError) {
                  innerError.from = error;
                  return innerError;
                }
              }
            }
          }

          if (needErrorPath) {
            var selectedFile = event.currentScope.fileBrowser.selectedFile;
            var selectedFilePath = selectedFile.path;
            var lastDirectoryIndex = selectedFilePath.lastIndexOf('/') + 1;
            var folderPath = selectedFilePath.substring(selectedFilePath[0] === '/' ? 1 : 0, lastDirectoryIndex);

            errorInfo = findError(error.trace, selectedFile);
            if (errorInfo) {
              errorInfo.isWarning = error.isWarning;
              var rangeFrom = rangePoint(errorInfo.from.range);

              tracingInfo = {
                line: rangeFrom.line,
                column: rangeFrom.column,
                path: folderPath + errorInfo.from.path
              };
            } else {
              // should not happen... todo parser bug
              errorInfo = {
                message: error.message,
                isWarning: error.isWarning
              };
              var traceRange = rangePoint(error.range);
              tracingInfo = {
                line : traceRange.line,
                column : traceRange.column,
                path : folderPath + error.path
              };
            }
          }

          var range = rangePoint(errorInfo.range);
          return {
            line          : range.line,
            column        : range.column,
            message       : errorInfo.message,
            severity      : errorInfo.isWarning ? 'warning' : 'error',
            path          : tracingInfo.path,
            tracingLine   : tracingInfo.line,
            tracingColumn : tracingInfo.column
          };
        }));
      }));

      function rangePoint(range) {
        if (range && range.start) {
          return {line: 1 + range.start.line, column: range.start.column};
        }
        if (range && Array.isArray(range)) {
          return {line: 1 + range[0], column: range[1]};
        }
        return {line: 1, column: 1};
      }

      $scope.openHelp = function openHelp() {
        $modal.open({
          templateUrl: 'views/help.html'
        });
      };

      $scope.getIsFileParsable = function getIsFileParsable(file) {
        return ramlEditorMainHelpers.isRamlFile(file.extension) &&
          ramlEditorMainHelpers.isApiDefinitionLike(file.contents);
      };

      $scope.getIsMockingServiceVisible = function getIsMockingServiceVisible() {
        return !($scope.mockingServiceDisabled || !$scope.fileParsable);
      };

      $scope.getIsMockingService1 = function getIsMockingServiceVisible() {
        if (!$scope.raml || !$scope.raml.baseUri || $scope.mockingMigratedDismissed) {
          return false;
        }

        var mockingServiceDetector = /(?:mocksvc\.[a-z\.]*)mulesoft\.com(\/(.*))?/;
        var isBaseUriOfMocking1 = mockingServiceDetector.exec($scope.raml.baseUri);
        return isBaseUriOfMocking1 !== null;
      };

      $scope.getIsMigrationSuccessful = function getIsMigrationSuccessful() {
        return $rootScope.mockMigrated && !$scope.mockingMigratedDismissed;
      };

      $scope.closeMigrationHint = function closeMigrationHing() {
        $scope.mockingMigratedDismissed = true;
      };

      $scope.getIsShelfVisible = function getIsShelfVisible() {
        return $scope.fileParsable;
      };

      $scope.getIsConsoleVisible = function getIsConsoleVisible() {
        return $scope.fileParsable && $scope.raml;
      };

      $scope.toggleShelf = function toggleShelf() {
        $scope.shelf.collapsed = !$scope.shelf.collapsed;
        config.set('shelf.collapsed', $scope.shelf.collapsed);
      };

      $scope.getSelectedFileAbsolutePath = function getSelectedFileAbsolutePath() {
        if (!currentFile) {
          return '';
        }

        var status = '';
        if ($scope.fileParsable) {
          if ($scope.parsing > 0) {
            status = 'validating...';
          } else if ($scope.currentErrorCount || $scope.currentWarningCount) {
            if ($scope.currentErrorCount) {
              status += $scope.currentErrorCount + ' ' + ($scope.currentErrorCount > 1 ? 'errors' : 'error');
            }
            if ($scope.currentErrorCount && $scope.currentWarningCount) {
              status += ', ';
            }
            if ($scope.currentWarningCount) {
              status += $scope.currentWarningCount + ' ' + ($scope.currentWarningCount > 1 ? 'warnings' : 'warning');
            }
          }
        }

        return extractCurrentFileLabel(currentFile) + (!status ? '' : ' (' + status + ')');
      };

      $scope.$on('event:toggle-theme', function onToggleTheme() {
        $window.setTheme(($scope.theme === 'dark') ? 'light' : 'dark');
      });

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

        editor.on('change', function onChange() {
          $scope.sourceUpdated();
        });

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

        if ($scope.mockingServiceBaseUri) {
          mockingServiceClient.baseUri = $scope.mockingServiceBaseUri;
        }
      })();
    })
  ;
})();
