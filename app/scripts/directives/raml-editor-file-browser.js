(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorFileBrowser', function (
      $q,
      $window,
      $rootScope,
      config,
      eventService,
      ramlRepository,
      ramlEditorInputPrompt
    ) {
      function Controller($scope) {
        var fileBrowser         = this;
        var unwatchSelectedFile = angular.noop;
        var contextMenu         = void(0);

        fileBrowser.select = function select(target) {
          var action = target.isDirectory ? fileBrowser.selectDirectory : fileBrowser.selectFile;
          action(target);
        };

        fileBrowser.selectFile = function selectFile(file) {
          if (fileBrowser.selectedFile === file) {
            fileBrowser.selectedTarget = file;
            return;
          }

          config.set('currentFile', JSON.stringify({path: file.path, name: file.name}));
          unwatchSelectedFile();

          var isLoaded     = file.loaded || !file.persisted;
          var afterLoading = isLoaded ? $q.when(file) : ramlRepository.loadFile(file);

          afterLoading
            .then(function (file) {
              fileBrowser.selectedTarget = file;
              fileBrowser.selectedFile = file;
              $scope.$emit('event:raml-editor-file-selected', file);
              unwatchSelectedFile = $scope.$watch('fileBrowser.selectedFile.contents', function (newContents, oldContents) {
                if (newContents !== oldContents) {
                  file.dirty = true;
                }
              });
            })
          ;
        };

        fileBrowser.selectDirectory = function selectDirectory(directory) {
          if (fileBrowser.selectedTarget === directory) {
            return;
          }

          fileBrowser.selectedTarget = directory;
          $scope.$emit('event:raml-editor-directory-selected', directory);
        };

        fileBrowser.saveFile = function saveFile(file) {
          ramlRepository.saveFile(file)
            .then(function () {
              eventService.broadcast('event:notification', {
                message: 'File saved.',
                expires: true
              });
            })
          ;
        };

        fileBrowser.showContextMenu = function showContextMenu(event, target) {
          contextMenu.open(event, target);
        };

        fileBrowser.contextMenuOpenedFor = function contextMenuOpenedFor(target) {
          return contextMenu && contextMenu.target === target;
        };

        function saveListener(e) {
          if (e.which === 83 && (e.metaKey || e.ctrlKey) && !(e.shiftKey || e.altKey)) {
            e.preventDefault();
            $scope.$apply(function () {
              fileBrowser.saveFile(fileBrowser.selectedFile);
            });
          }
        }

        $window.addEventListener('keydown', saveListener);

        $scope.fileBrowser = fileBrowser;

        $scope.registerContextMenu = function registerContextMenu(cm) {
          contextMenu = cm;
        };

        $scope.$on('event:raml-editor-file-created', function (event, file) {
          fileBrowser.selectFile(file);
        });

        $scope.$on('event:raml-editor-file-removed', function (event, file) {
          var allFiles = [];
          $scope.homeDirectory.forEachChildDo(function (child) {
            if (!child.isDirectory) {
              allFiles.push(child);
            }
          });

          if (file === fileBrowser.selectedFile && allFiles.length > 0) {
            fileBrowser.selectFile(allFiles[0]);
          }
          else if (allFiles.length === 0) {
            setTimeout(promptWhenFileListIsEmpty, 0);
          }
        });

        $scope.$on('$destroy', function () {
          $window.removeEventListener('keydown', saveListener);
        });

        function promptWhenFileListIsEmpty() {
          var defaultName = 'Untitled-1.raml';
          var message = 'File browser is empty, please input a name for the new file:';
          var validation = [{
            message: 'File name cannot be empty.',
            validate: function(input) {
              return input.length > 0;
            }
          }];
          ramlEditorInputPrompt.open(message, defaultName, validation).then(
            function(result) {
              ramlRepository.createFile($scope.homeDirectory, result);
            },
            function() {
              ramlRepository.createFile($scope.homeDirectory, defaultName);
            }
          );
        }

        /**
         * Finds a root file which should have `root` property set to `true`
         * starting at root directory and going down through hierarchy using DFS
         * and current position pointer instead of `shift` operation which is
         * expensive. If there are multiple root files, which should not happen,
         * it returns the very first one and stops the search.
         *
         * @param rootDirectory {RamlDirectory} A root directory to start search at
         *
         * @returns {RamlFile} A root file which is a file with `root` property set to `true`
         */
        function findRootFile(rootDirectory) {
          var queue = [rootDirectory];
          var pos   = 0;

          while (pos < queue.length) {
            var directory = queue[pos];
            var files     = directory.children;
            var entity    = void(0);

            for (var i = 0; i < files.length; i++) {
              entity = files[i];
              if (entity.type === 'file' && entity.root) {
                return entity;
              }

              if (entity.type === 'directory') {
                queue.push(entity);
              }
            }

            pos += 1;
          }
        }

        ramlRepository.loadDirectory()
          .then(function (directory) {
            $scope.homeDirectory = directory;
            fileBrowser.rootFile = findRootFile(directory);

            if (!directory.getFiles().length) {
              promptWhenFileListIsEmpty();
              return;
            }

            // select a file in the following order:
            //   - previously selected file
            //   - root file
            //   - first file
            var currentFile = JSON.parse(config.get('currentFile', '{}'));
            var fileToOpen  = directory.getFiles().filter(function (file) {
              return file.path === currentFile.path;
            })[0] || fileBrowser.rootFile || directory.getFiles()[0];

            fileBrowser.selectFile(fileToOpen);
          })
        ;
      }

      return {
        restrict:    'E',
        templateUrl: 'views/raml-editor-file-browser.tmpl.html',
        controller:  Controller
      };
    })
  ;
})();
