(function () {
  'use strict';

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

    this.contents  = contents || '';
    this.persisted = options.persisted || false;
    this.dirty     = options.dirty || !this.persisted;
    this.root      = options.root;
  }

  angular.module('fs', ['raml', 'utils'])
    .factory('ramlRepository', function ($q, $rootScope, ramlSnippets, fileSystem) {
      var service   = {};
      var BASE_PATH = '/';
      var rootFile;

      service.supportsFolders = fileSystem.supportsFolders || false;

      function notMetaFile(file) {
        return file.path.slice(-5) !== '.meta';
      }

      function metaFile(file) {
        return !notMetaFile(file);
      }

      function handleErrorFor(file) {
        return function markFileWithError(error) {
          file.error = error;
          throw error;
        };
      }

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
        var before  = parent.path === '/' ? [''] : parent.path.split('/');
        var parts   = child.path.split('/').slice(0, -1);
        var promise = $q.when(parent);

        parts.slice(before.length).forEach(function (part) {
          promise = promise.then(function (parent) {
            var path   = service.join(parent.path, part);
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

      function RamlDirectory(path, meta, contents) {
        // remove the trailing slash to path if it exists
        if (path.slice(-1) === '/' && path.length > 1) {
          path = path.slice(0, -1);
        }

        contents = contents || [];

        this.type = 'directory';
        this.path = path;
        this.name = path.slice(path.lastIndexOf('/') + 1);
        this.meta = meta;
        this.collapsed   = true;
        this.isDirectory = true;

        var separated = { folder: [], file: [] };
        contents.forEach(function (entry) {
          separated[entry.type || 'file'].push(entry);
        });

        var createRamlFile = function (file) {
          return new RamlFile(file.path, file.contents, { dirty: false, persisted: true, root: file.root} );
        };

        var files = separated.file.filter(notMetaFile).map(createRamlFile);

        var metaFiles = separated.file.filter(metaFile).map(createRamlFile);

        var directories = separated.folder.map(function (directory) {
          return new RamlDirectory(directory.path, directory.meta, directory.children);
        });

        this.children = directories.concat(files).sort(sortingFunction);
        this.metaChildren = directories.concat(metaFiles).sort(sortingFunction);
      }

      RamlDirectory.prototype.getDirectories = function getDirectories() {
        return this.children.filter(function(t) { return t.isDirectory; });
      };

      RamlDirectory.prototype.getFiles = function getFiles() {
        return this.children.filter(function(t) { return !t.isDirectory; });
      };

      RamlDirectory.prototype.getMetaFiles = function getMetaFiles() {
        return this.metaChildren.filter(function(t) { return !t.isDirectory; });
      };

      RamlDirectory.prototype.forEachItemDo = function forEachItemDo(action, isMetaChildren) {
        // BFS
        var queue = isMetaChildren ? this.metaChildren.slice() : this.children.slice();
        var current;

        while (queue.length > 0) {
          current = queue.shift();

          if (current.isDirectory) {
            queue = queue.concat((isMetaChildren) ? current.metaChildren : current.children);
          }

          action.call(current, current);
        }
      };

      RamlDirectory.prototype.forEachChildDo = function forEachChildDo(action) {
        this.forEachItemDo(action, false);
      };

      RamlDirectory.prototype.forEachMetaChildDo = function forEachChildDo(action) {
        this.forEachItemDo(action, true);
      };

      RamlDirectory.prototype.sortChildren = function sortChildren() {
        this.children.sort(sortingFunction);
      };

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
        var path      = service.join(parent.path, name);
        var directory = new RamlDirectory(path);
        var exists    = service.getByPath(path);

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
        return fileSystem.directory(BASE_PATH)
          .then(function (directory) {
            rootFile = new RamlDirectory(directory.path, directory.meta, directory.children);

            return rootFile;
          });
      };

      service.removeDirectory = function removeDirectory(directory) {
        // recursively remove all the child directory and files
        // and collect all promises into an array
        var promises = [];
        directory.getDirectories().forEach(function(dir) { promises.push(service.removeDirectory(dir)); });
        directory.getFiles().concat(directory.getMetaFiles())
          .forEach(function(file) { promises.push(service.removeFile(file)); });

        // remove this directory object from parent's children list
        var parent = service.getParent(directory);
        var index  = parent.children.indexOf(directory);
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
        directory.forEachChildDo(function(c) {
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
        function modifyFile() {
          file.dirty     = false;
          file.persisted = true;

          return file;
        }

        return fileSystem.save(file.path, file.contents)
          .then(modifyFile, handleErrorFor(file));
      };

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
          file.dirty     = false;
          file.persisted = true;
          file.loaded    = true;
          file.contents  = data;

          return file;
        }

        return fileSystem
          .load(file.path, nativeTimeout)
          .then(modifyFile, handleErrorFor(file))
        ;
      };

      service.removeFile = function removeFile(file) {
        var promise;
        var parent = service.getParent(file);

        function modifyFile() {
          file.dirty     = false;
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
            if (notMetaFile(file)) {
              var index = parent.children.indexOf(file);

              if (index !== -1) {
                parent.children.splice(index, 1);
              }
            } else {
              var metaIndex = parent.metaChildren.indexOf(file);

              if (metaIndex !== -1) {
                parent.metaChildren.splice(metaIndex, 1);
              }
            }

            $rootScope.$broadcast('event:raml-editor-file-removed', file);
          });
      };

      service.createFile = function createFile (parent, name) {
        var path  = service.join(parent.path, name);
        var file  = new RamlFile(path);

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
          return rootFile;
        }

        path = path.replace(/\/$/, '');

        var queue = rootFile.children.slice();
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
          target.forEachChildDo(function(c) {
            c.path = c.path.replace(target.path, newPath);
          });

          // renames the path of each meta child under the current directory
          target.forEachMetaChildDo(function(c) {
            c.path = c.path.replace(target.path, newPath);
          });
        } else {
          service.moveMeta(target, destination);
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
            var parent = service.getParent(metaFile);
            parent.metaChildren.push(metaFile);
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

      service.moveMeta = function moveMeta(file, destination) {
        var metaName = file.name + '.meta';
        var newMetaPath = service.join(destination.path, metaName);
        var metaPathName = file.path + '.meta';
        var oldParent = service.getParent(file);

        var metaFile = oldParent.metaChildren.find(function(meta) {
          return meta.path === metaPathName;
        });

        if (metaFile) {
          return fileSystem.rename(metaFile.path, newMetaPath).then(
            function success() {
              //Remove old parent meta data
              var index = oldParent.metaChildren.indexOf(metaFile);
              if (index !== -1) {
                oldParent.metaChildren.splice(index, 1);
              }
              metaFile.path = newMetaPath;
              destination.metaChildren.push(metaFile);
              return metaFile;
            },
            function failure() {
              return metaFile;
            }
          );
        }
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
