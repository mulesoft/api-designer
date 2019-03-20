(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorFileBrowser', function (
      $q,
      $window,
      $rootScope,
      $timeout,
      config,
      ramlRepository,
      newNameModal,
      importService
    ) {
      function Controller($scope) {
        var fileBrowser         = this;
        var unwatchSelectedFile = angular.noop;
        var contextMenu         = void(0);

        $scope.toggleFolderCollapse = function(node) {
          node.collapsed = !node.collapsed;
        };

        $scope.fileTreeOptions = (function () {
          var duplicateName = false;

          return {
            /**
              * This callback is used to check if the current dragging node
              * can be dropped in the ui-tree-nodes.
              *
              * @returns {boolean} Accept the drop or not
              */
            accept: function(sourceNodeScope, destNodesScope, destIndex) {
              var accept;
              var source = sourceNodeScope.$modelValue;
              var dest = destIndex < 0 ? $scope.homeDirectory : destNodesScope.$modelValue[destIndex];

              // if the destination is a file, select its parent directory as destination
              if (!dest.isDirectory) {
                dest = destNodesScope.$nodeScope ? destNodesScope.$nodeScope.$modelValue : $scope.homeDirectory;
              }

              // Check if the destination is a child of the source
              var destIsChild = ramlRepository.getParent(source).path === dest.path ||
                dest.path.slice(0, source.path.length) === source.path;

              duplicateName = dest.children.filter(function (c) { return c.name === source.name; }).length > 0;

              accept = !duplicateName && !destIsChild;
              if (accept) {
                fileBrowser.cursorState = 'ok';
              } else {
                fileBrowser.cursorState = 'no';
              }
              return accept;
            },
            /**
              * This callback is called when a node is dropped on to the tree
              */
            dropped: function(event) {
              var source = event.source.nodeScope.$modelValue;
              var dest = event.dest.nodesScope.$nodeScope ?
                event.dest.nodesScope.$nodeScope.$modelValue :
                $scope.homeDirectory;

              // do the actual moving
              ramlRepository.move(source, dest)
                .then(function () {
                  return fileBrowser.select(source);
                });
            },
            /**
              * This callback is called when the drag ends or gets canceled
              */
            dragStop: function(event) {
              // when drag is stopped or canceled, reset the cursor
              fileBrowser.cursorState = '';

              if (!event.canceled && duplicateName) {
                $rootScope.$broadcast('event:notification', {
                  message: 'Failed: duplicate file name found in the destination folder.',
                  expires: true,
                  level: 'error'
                });
              }
            }
          };
        })();

        fileBrowser.select = function select(target) {
          if (target.isDirectory) {
            return fileBrowser.selectDirectory(target);
          }

          return fileBrowser.selectFile(target);
        };

        $scope.$on('event:raml-editor-file-select', function (event, filePath) {
          var file = ramlRepository.getByPath(filePath);
          fileBrowser.selectFile(file);
        });

        $rootScope.$on('event:imported-file-selected', function () {
          var currentFile = JSON.parse(config.get('currentFile', '{}'));
          var file = ramlRepository.getByPath(currentFile.path);
          fileBrowser.selectFile(file);
        });

        fileBrowser.selectFile = function selectFile(file) {
          // If we select a file that is already active, just modify 'currentTarget', no load needed
          if (fileBrowser.selectedFile && fileBrowser.selectedFile.$$hashKey === file.$$hashKey) {
            fileBrowser.currentTarget = file;
            return;
          }

          unwatchSelectedFile();

          var isLoaded     = file.loaded || !file.persisted;
          var afterLoading = isLoaded ? $q.when(file) : ramlRepository.loadFile(file);

          afterLoading
            .then(function (file) {
              fileBrowser.selectedFile = fileBrowser.currentTarget = file;
              $scope.$emit('event:raml-editor-file-selected', file);
              unwatchSelectedFile = $scope.$watch('fileBrowser.selectedFile.contents', function (newContents, oldContents) {
                if (newContents !== oldContents) {
                  file.dirty = true;
                }
              });
            });
        };

        fileBrowser.selectDirectory = function selectDirectory(directory) {
          $scope.$emit('event:raml-editor-directory-selected', directory);
        };

        /**
         * This function is used for expanding all the ancestors of a target
         * node in the file tree.
         *
         * @param target {RamlDirectory/RamlFile}
         */
        function expandAncestors(target) {
          // stop at the top-level directory
          if (target.path === '/') {
            return;
          }

          var parent = ramlRepository.getParent(target);
          parent.collapsed = false;
          expandAncestors(parent);
        }

        fileBrowser.saveFile = function saveFile(file) {
          ramlRepository.saveFile(file)
            .then(function () {
              return $rootScope.$broadcast('event:notification', {
                message: 'File saved.',
                expires: true
              });
            })
          ;
        };

        fileBrowser.dropFile = function dropFile (event, directory) {
          return importService.importFromEvent(directory, event)
            .then(function () {
              directory.collapsed = false;
            })
            .catch(function (err) {
              $rootScope.$broadcast('event:notification', {
                message: err.message,
                expires: true,
                level: 'error'
              });
            });
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

        $scope.$on('event:raml-editor-file-generated', function (event, file) {
          fileBrowser.selectFile(file);
        });

        $scope.$on('event:raml-editor-directory-created', function (event, dir) {
          fileBrowser.selectDirectory(dir);
        });

        $scope.$on('event:raml-editor-file-selected', function (event, file) {
          expandAncestors(file);
        });

        $scope.$on('event:raml-editor-directory-selected', function (event, dir) {
          expandAncestors(dir);
        });

        $scope.$on('event:raml-editor-filetree-modified', function (event, target) {
          ramlRepository.getParent(target).sortChildren();
        });

        $scope.$on('event:raml-editor-file-removed', function (event, file) {
          $timeout(function () {
            var files = $scope.homeDirectory.getFiles();

            if (files.length === 0) {
              promptWhenFileListIsEmpty();
            } else if (file === fileBrowser.selectedFile) {
              fileBrowser.selectFile(files[0]);
            }
          });
        });

        $scope.$on('$destroy', function () {
          $window.removeEventListener('keydown', saveListener);
        });

        // watch for selected file path changes, update config if needed
        $scope.$watch('fileBrowser.selectedFile.path', function (newPath, oldPath) {
          if (newPath !== oldPath) {
            config.set('currentFile', JSON.stringify({path: newPath, name: newPath.slice(newPath.lastIndexOf('/') + 1)}));
          }
        });

        function promptWhenFileListIsEmpty() {
          var defaultName = 'Untitled-1.raml';
          var message     = 'File system has no files, please input a name for the new file:';
          var validation  = [];
          var title       = 'Add a new file';

          newNameModal.open(message, defaultName, validation, title)
            .then(
              function (result) {
                return ramlRepository.generateFile($scope.homeDirectory, result);
              },
              function () {
                return ramlRepository.generateFile($scope.homeDirectory, defaultName);
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

            var files = [];
            $scope.homeDirectory.forEachChildDo(function (child) {
              if (!child.isDirectory) {
                files.push(child);
              }
            });

            if (!files.length) {
              promptWhenFileListIsEmpty();
              return;
            }

            // select a file in the following order:
            //   - previously selected file
            //   - root file
            //   - first file
            var currentFile = JSON.parse(config.get('currentFile', '{}'));
            var fileToOpen  = ramlRepository.getByPath(currentFile.path) || fileBrowser.rootFile || files[0];

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
