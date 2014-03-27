(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorFileBrowser', function ($rootScope, $q, $window, ramlEditorFilenamePrompt, ramlRepository, config, eventService) {
      function Controller($scope) {
        var fileBrowser         = this;
        var unwatchSelectedFile = angular.noop;
        var contextMenu         = void(0);

        fileBrowser.selectFile = function selectFile(file) {
          if (fileBrowser.selectedFile === file) {
            return;
          }

          config.set('currentFile', JSON.stringify({path: file.path, name: file.name}));
          unwatchSelectedFile();

          var isLoaded     = file.loaded || !file.persisted;
          var afterLoading = isLoaded ? $q.when(file) : ramlRepository.loadFile(file);

          afterLoading
            .then(function (file) {
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

        fileBrowser.showContextMenu = function showContextMenu(event, file) {
          contextMenu.open(event, file);
        };

        fileBrowser.contextMenuOpenedFor = function contextMenuOpenedFor(file) {
          return contextMenu && contextMenu.file === file;
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
          if (file === fileBrowser.selectedFile && $scope.homeDirectory.files.length > 0) {
            fileBrowser.selectFile($scope.homeDirectory.files[0]);
          }
        });

        $scope.$on('$destroy', function () {
          $window.removeEventListener('keydown', saveListener);
        });

        function promptWhenFileListIsEmpty() {
          ramlEditorFilenamePrompt.open($scope.homeDirectory)
            .then(function (filename) {
              $scope.homeDirectory.createFile(filename);
            })
          ;
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
            var files     = directory.files;
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

        ramlRepository.getDirectory()
          .then(function (directory) {
            $scope.homeDirectory = directory;
            fileBrowser.rootFile = findRootFile(directory);

            $scope.$watch('homeDirectory.files', function (files) {
              if (!files.length) {
                setTimeout(promptWhenFileListIsEmpty, 0);
              }
            }, true);

            if (!directory.files.length) {
              promptWhenFileListIsEmpty();
              return;
            }

            // select a file in the following order:
            //   - previously selected file
            //   - root file
            //   - first file
            var currentFile = JSON.parse(config.get('currentFile', '{}'));
            var fileToOpen  = directory.files.filter(function (file) {
              return file.path === currentFile.path;
            })[0] || fileBrowser.rootFile || directory.files[0];

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
