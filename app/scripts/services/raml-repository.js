(function () {
  'use strict';

  angular.module('fs', ['raml', 'utils'])
    .provider('ramlRepositoryConfig', function ramlRepositoryConfigProvider() {
      this.reloadFilesOnSave = false;
      this.$get = function ramlRepositoryConfig() {
        return {
          reloadFilesOnSave: this.reloadFilesOnSave
        };
      };

      return this;
    })
    .factory('ramlRepositoryElements', function () {

      function RamlFile(path, contents, options) {
        options = options || {};

        // remove the trailing slash to path if it exists
        if (path.slice(-1) === '/' && path.length > 1) {
          path = path.slice(0, -1);
        }

        this.type = 'file';
        this.path = path;
        this.name = path.slice(path.lastIndexOf('/') + 1);
        this.isDirectory = false;

        // extract extension
        if (this.name.lastIndexOf('.') > 0) {
          this.extension = this.name.slice(this.name.lastIndexOf('.') + 1);
        }

        this.contents = contents || '';
        this.persisted = options.persisted || false;
        this.dirty = options.dirty || !this.persisted;
        this.root = options.root;
      }

      RamlFile.prototype.copyTo = function copyTo(other) {
        other.contents = this.contents;
        other.persisted = this.persisted;
        other.loaded = this.loaded;
        other.dirty = this.dirty;
        other.doc = this.doc;

        return other;
      };

      RamlFile.prototype.clear = function clear() {
        this.dirty = false;
        this.persisted = true;
        this.loaded = false;

        return this;
      };

      function RamlDirectory(path, meta, children) {
        // remove the trailing slash to path if it exists
        if (path.slice(-1) === '/' && path.length > 1) {
          path = path.slice(0, -1);
        }

        children = children || [];

        this.type = 'directory';
        this.path = path;
        this.name = path.slice(path.lastIndexOf('/') + 1);
        this.meta = meta;
        this.collapsed = true;
        this.isDirectory = true;

        this.setChildren(children);
      }

      RamlDirectory.prototype.getDirectories = function getDirectories() {
        return this.children.filter(function (t) {
          return t.isDirectory;
        });
      };

      RamlDirectory.prototype.getFiles = function getFiles() {
        return this.children.filter(function (t) {
          return !t.isDirectory;
        });
      };

      RamlDirectory.prototype.forEachChildDo = function forEachChildDo(action) {
        this.listAllDescendants().forEach(action);
      };

      RamlDirectory.prototype.listAllDescendants = function listAllDescendants() {
        function listFor(directory, descendants) {
          if (!directory.isDirectory || !directory.children) {
            return descendants;
          }

          var newDescendants = descendants.concat(directory.children);
          return directory.children
            .filter(function (child) {
              return child && child.isDirectory;
            })
            .reduce(function (result, child) {
              return listFor(child, result);
            }, newDescendants);
        }

        return listFor(this, []);
      };

      RamlDirectory.prototype.sortChildren = function sortChildren() {
        this.children.sort(sortingFunction);
      };

      var entryType = function (entry) {
        return (entry.type || 'file').toLowerCase();
      };

      RamlDirectory.prototype.setChildren = function setChildren(children) {
        function notMetaFile(file) {
          return file.path.slice(-5) !== '.meta';
        }

        var separated = {folder: [], file: []};
        children.forEach(function (entry) {
          separated[entryType(entry)].push(entry);
        });

        var files = separated.file.filter(notMetaFile).map(function (file) {
          return new RamlFile(file.path, file.contents, {dirty: false, persisted: true, root: file.root});
        });

        var directories = separated.folder.map(function (directory) {
          return new RamlDirectory(directory.path, directory.meta, directory.children);
        });

        this.children = directories.concat(files).sort(sortingFunction);
      };

      /**
       * Function used to compare two ramlFile/ramlDirectory.
       * Sorting policy:
       * - Directories comes before files
       * - Sort file/directories alphabetically
       *
       * @returns {Integer} If the returned value is less than 0, sort a to a lower index than b, vice versa
       */
      function sortingFunction(a, b) {
        if (a.isDirectory === b.isDirectory) {
          return a.name.localeCompare(b.name);
        } else {
          return a.isDirectory ? -1 : 1;
        }
      }

      return {
        RamlDirectory: RamlDirectory,
        RamlFile: RamlFile,
        sortingFunction: sortingFunction
      };
    })
    .factory('ramlRepository',
      function ($q,
                $rootScope,
                ramlRepositoryConfig,
                ramlRepositoryElements,
                ramlSnippets,
                fileSystem) {

        var RamlDirectory = ramlRepositoryElements.RamlDirectory;
        var RamlFile = ramlRepositoryElements.RamlFile;
        var sortingFunction = ramlRepositoryElements.sortingFunction;

        var service = {};
        var BASE_PATH = '/';
        // service.rootFile

        service.supportsFolders = fileSystem.supportsFolders || false;

        function handleErrorFor(file) {
          return function markFileWithError(error) {
            file.error = error;
            throw error;
          };
        }

        function findInsertIndex(source, dest) {
          var low = 0, high = dest.children.length - 1, mid;
          while (high >= low) {
            mid = Math.floor((low + high) / 2);
            if (sortingFunction(dest.children[mid], source) > 0) {
              high = mid - 1;
            } else {
              low = mid + 1;
            }
          }
          return low;
        }

        function insertFileSystem(parent, child) {
          // This assumes the paths are correct.
          var before = parent.path === '/' ? [''] : parent.path.split('/');
          var parts = child.path.split('/').slice(0, -1);
          var promise = $q.when(parent);

          parts.slice(before.length).forEach(function (part) {
            promise = promise.then(function (parent) {
              var path = service.join(parent.path, part);
              var exists = service.getByPath(path);

              // If the current path already exists.
              if (exists) {
                if (!exists.isDirectory) {
                  return $q.reject(
                    new Error('Can not create directory, file already exists: ' + path)
                  );
                }

                return exists;
              }

              return service.createDirectory(parent, part);
            });
          });

          return promise.then(function (parent) {
            var exists = service.getByPath(child.path);

            if (exists) {
              if (exists.isDirectory && child.isDirectory) {
                return exists;
              }

              return $q.reject(new Error('Path already exists: ' + child.path));
            }

            parent.children.splice(findInsertIndex(child, parent), 0, child);

            return child;
          });
        }

        // this function takes a target(ramlFile/ramlDirectory) and a name(String) as input
        // and returns the new path(String) after renaming the target
        function generateNewName(target, newName) {
          var parentPath = target.path.slice(0, target.path.lastIndexOf('/'));

          return parentPath + '/' + newName;
        }

        // Expose the sorting function
        service.sortingFunction = sortingFunction;

        // Returns the parent directory object of a file or a directory
        service.getParent = function getParent(target) {
          var path = target.path.slice(0, target.path.lastIndexOf('/'));

          if (path.length === 0) {
            path = '/';
          }

          return service.getByPath(path);
        };

        service.canExport = function canExport() {
          return fileSystem.hasOwnProperty('exportFiles');
        };

        service.exportFiles = function exportFiles() {
          return fileSystem.exportFiles();
        };

        service.createDirectory = function createDirectory(parent, name) {
          var path = service.join(parent.path, name);
          var directory = new RamlDirectory(path);
          var exists = service.getByPath(path);

          // If the file already exists, return it.
          if (exists) {
            return $q.when(exists);
          }

          return insertFileSystem(parent, directory)
            .then(function () {
              return fileSystem.createFolder(directory.path);
            })
            .then(function () {
              return directory;
            });
        };

        service.generateDirectory = function createDirectory(parent, name) {
          return service.createDirectory(parent, name)
            .then(function (directory) {
              $rootScope.$broadcast('event:raml-editor-directory-created', directory);

              return directory;
            });
        };

        // Loads the directory from the fileSystem into memory
        service.loadDirectory = function loadDirectory() {
          var _this = this;

          return fileSystem.directory(BASE_PATH)
            .then(function (directory) {
              _this.rootFile = new RamlDirectory(directory.path, directory.meta, directory.children);

              return _this.rootFile;
            });
        };

        service.loadAndUpdateDirectory = function loadAndUpdateDirectory() {
          return fileSystem.directory(BASE_PATH)
            .then(this.updateDirectory.bind(this));
        };

        service.updateDirectory = function updateDirectory(rootChildren) {
          var dirtyFiles = new Map(
            this.rootFile.listAllDescendants()
              .filter(function (element) { return element && !element.isDirectory && element.dirty; })
              .map(function (element) { return [element.path, element]; })
          );

          this.rootFile.setChildren(rootChildren);

          this.rootFile.listAllDescendants()
            .forEach(function (element) {
              var path = element.path;
              if (dirtyFiles.has(path)) {
                dirtyFiles.get(path).copyTo(element);
              }
            });
        };

        service.removeDirectory = function removeDirectory(directory) {
          // recursively remove all the child directory and files
          // and collect all promises into an array
          var promises = [];
          directory.getDirectories().forEach(function (dir) {
            promises.push(service.removeDirectory(dir));
          });
          directory.getFiles().forEach(function (file) {
            promises.push(service.removeFile(file));
          });

          // remove this directory object from parent's children list
          var parent = service.getParent(directory);
          var index = parent.children.indexOf(directory);
          if (index !== -1) {
            parent.children.splice(index, 1);
          }

          // make sure all children is removed from FS before we remove ourselves
          return $q.all(promises)
            .then(function () {
              return fileSystem.remove(directory.path);
            })
            .then(function (directory) {
              $rootScope.$broadcast('event:raml-editor-directory-removed', directory);
            });
        };

        service.renameDirectory = function renameDirectory(directory, newName) {
          var newPath = generateNewName(directory, newName);
          var promise = fileSystem.rename(directory.path, newPath);

          // renames the path of each child under the current directory
          directory.forEachChildDo(function (c) {
            c.path = c.path.replace(directory.path, newPath);
          });

          return promise
            .then(
              function () {
                directory.name = newName;
                directory.path = newPath;
                $rootScope.$broadcast('event:raml-editor-filetree-modified', directory);
                return directory;
              },
              handleErrorFor(directory)
            );
        };

        service.saveFile = function saveFile(file) {
          return this.saveAndUpdate([file], file, ramlRepositoryConfig.reloadFilesOnSave);
        };

        service.saveAllFiles = function saveAllFiles(currentFile) {
          var filesToBeSaved = this.rootFile.listAllDescendants()
            .filter(function (element) { return !element.isDirectory && element.dirty; });

          return this.saveAndUpdate(filesToBeSaved, currentFile, ramlRepositoryConfig.reloadFilesOnSave);
        };

        /**
         *  Saves all the files and, id 'update' is true, updates the directory and the file.
         *  It returns the file, updated if it corresponds.
         */

        service.saveAndUpdate = function saveAndUpdate(files, file, update) {
          if (update) {
            return this.saveAndUpdateRoot(files)
              .then(this.getByPath.bind(this, file.path))
              .then(this.loadFile.bind(this));
          } else {
            return saveFiles(files)
              .then(function () {
                return file;
              });
          }
        };

        service.saveAndUpdateRoot = function (files) {
          var _this = this;
          function updateRootDirectory(directory) {
            return directory ? _this.updateDirectory(directory.children) : _this.loadAndUpdateDirectory();
          }

          return saveFiles(files)
            .then(updateRootDirectory);
        };

        /**
         *  Saves all the files and returns a Promise with the root directory or undefined,
         *  it depend on the version of the file system.
         */

        function saveFiles(files) {
          function clearFiles(directory) {
            files.forEach(function (file) { file.clear(); });
            return directory;
          }

          if (!files || files.length === 0) { return Promise.resolve(); }
          if (files.length === 1) { return saveSingleFile(files[0]); }

          function pathContentObject(file) { return {path: file.path, content: file.contents}; }
          var directory;
          if (fileSystem.saveAll) {
            directory = fileSystem.saveAll(files.map(pathContentObject));
          } else {
            directory = Promise.all(files.map(saveSingleFile))
              .then(function (results) { return results[0]; });
          }

          return directory.then(clearFiles);
        }

        /**
         *  Saves the file and returns the content of the directory or undefined,
         *  it depend on the version of the file system.
         */

        function saveSingleFile(file) {
          function clearFile(directory) {
            file.clear();
            return directory;
          }

          return fileSystem.save(file.path, file.contents)
            .then(clearFile);
        }

        service.renameFile = function renameFile(file, newName) {
          var newPath = generateNewName(file, newName);
          var promise = file.persisted ? fileSystem.rename(file.path, newPath) : $q.when(file);

          function modifyFile() {
            file.name = newName;
            file.path = newPath;
            $rootScope.$broadcast('event:raml-editor-filetree-modified', file);
            return file;
          }

          return promise.then(modifyFile, handleErrorFor(file));
        };

        service.loadFile = function loadFile(file, nativeTimeout) {
          function modifyFile(data) {
            file.dirty = false;
            file.persisted = true;
            file.loaded = true;
            file.contents = data;

            return file;
          }

          return fileSystem
            .load(file.path, nativeTimeout)
            .then(modifyFile, handleErrorFor(file));
        };

        service.removeFile = function removeFile(file) {
          var promise;
          var parent = service.getParent(file);

          function modifyFile() {
            file.dirty = false;
            file.persisted = false;

            return Object.freeze(file);
          }

          // call to file system only when file is persisted
          // otherwise it's unknown because it's never been saved
          if (file.persisted) {
            promise = fileSystem.remove(file.path);
          } else {
            promise = $q.when(file);
          }

          return promise
            .then(modifyFile, handleErrorFor(file))
            .then(function () {
              // remove the file object from the parent's children list
              var index = parent.children.indexOf(file);

              if (index !== -1) {
                parent.children.splice(index, 1);
              }

              $rootScope.$broadcast('event:raml-editor-file-removed', file);
            });
        };

        service.createFile = function createFile(parent, name) {
          var path = service.join(parent.path, name);
          var file = new RamlFile(path);

          return insertFileSystem(parent, file)
            .then(function () {
              $rootScope.$broadcast('event:raml-editor-file-created', file);

              return file;
            });
        };

        service.generateFile = function generateFile(parent, name, ramlVersion, fragmentLabel) {
          return service.createFile(parent, name)
            .then(function (file) {
              if (file.extension === 'raml') {
                file.contents = ramlSnippets.getEmptyRaml(ramlVersion, fragmentLabel);
              }

              $rootScope.$broadcast('event:raml-editor-file-generated', file);

              return file;
            });
        };

        // Gets a promise of the ramlDirectory/ramlFile object by path from the memory, loading the content if not loaded yet
        service.getContentByPath = function getByPath(path, nativeTimeout) {
          var file = service.getByPath(path);
          if (!file) {
            return $q.reject('getByPathLoaded: ' + path + ': no such path');
          }

          if (file.loaded) {
            return $q.when(file.contents);
          }

          return service.loadFile(file, nativeTimeout).then(function mapContent(file) {
            return file.contents;
          });
        };

        // Gets the ramlDirectory/ramlFile object by path from the memory
        service.getByPath = function getByPath(path) {
          // Nothing to do if no path
          if (!path) {
            return;
          }

          if (path === '/') {
            return this.rootFile;
          }

          path = path.replace(/\/$/, '');

          var queue = this.rootFile.children.slice();
          var current;

          while (queue.length) {
            current = queue.shift();

            if (current.path === path) {
              return current;
            }

            if (current.isDirectory) {
              queue = queue.concat(current.children);
            }
          }
        };

        service.rename = function rename(target, newName) {
          return target.isDirectory ? service.renameDirectory(target, newName) : service.renameFile(target, newName);
        };

        service.remove = function remove(target) {
          return target.isDirectory ? service.removeDirectory(target) : service.removeFile(target);
        };

        // move a file or directory to a specific destination
        // destination must be a ramlDirectory
        service.move = function move(target, destination) {
          if (!destination.isDirectory) {
            return;
          }

          var newPath = service.join(destination.path, target.name);
          var promise;

          if (target.isDirectory) {
            promise = fileSystem.rename(target.path, newPath);

            // renames the path of each child under the current directory
            target.forEachChildDo(function (c) {
              c.path = c.path.replace(target.path, newPath);
            });
          } else {
            promise = target.persisted ? fileSystem.rename(target.path, newPath) : $q.when(target);
          }

          return promise
            .then(function () {
                target.path = newPath;
                return target;
              },
              handleErrorFor(target)
            );
        };

        service.saveMeta = function saveMeta(file, meta) {
          var metaFile = new RamlFile(file.path + '.meta', JSON.stringify(meta));
          return service.saveFile(metaFile)
            .then(function () {
              return meta;
            })
            ;
        };

        service.loadMeta = function loadMeta(file) {
          var metaFile = new RamlFile(file.path + '.meta');
          return service.loadFile(metaFile).then(
            function success(file) {
              return JSON.parse(file.contents);
            },

            function failure() {
              return {};
            }
          );
        };

        service.join = function () {
          return Array.prototype.reduce.call(arguments, function (path, segment) {
            if (segment == null) {
              return path;
            }

            if (segment.charAt(0) === '/') {
              return segment;
            }

            return path.replace(/\/$/, '') + '/' + segment;
          }, '/');
        };

        return service;
      })
  ;
})();
