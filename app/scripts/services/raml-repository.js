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

    // extract extension
    if (this.name.lastIndexOf('.') > 0) {
      this.extension = this.name.slice(this.name.lastIndexOf('.') + 1);
    }

    this.contents  = contents || '';
    this.persisted = options.persisted || false;
    this.dirty     = options.dirty || !this.persisted;
    this.root      = options.root;
  }

  angular.module('fs', ['ngCookies', 'raml', 'utils'])
    .factory('ramlRepository', function ($q, $rootScope, ramlSnippets, fileSystem) {
      var service     = {};
      var defaultPath = '/';

      service.supportsFolders = fileSystem.supportsFolders || false;
      service.pathToRamlObject = {};

      function notMetaFile(file) {
        return file.path.slice(-5) !== '.meta';
      }

      function handleErrorFor(file) {
        return function markFileWithError(error) {
          file.error = error;
          throw error;
        };
      }

      function generateName(parent, name) {
        if (parent.path === '/') {
          return '/' + name;
        }
        else {
          return parent.path + '/' + name;
        }
      }

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

        var files = separated.file.filter(notMetaFile).map(function (file) {
          return new RamlFile(file.path, file.contents, { dirty: false, persisted: true, root: file.root} );
        });

        files.sort(function (file1, file2) {
          return file1.name.localeCompare(file2.name);
        });

        var directories = separated.folder.map(function (directory) {
          return new RamlDirectory(directory.path, directory.meta, directory.children);
        });

        this.children = directories.concat(files);
      }

      RamlDirectory.prototype.getDirectories = function getDirectories() {
        return this.children.filter(function(t) { return t.isDirectory; });
      };

      RamlDirectory.prototype.getFiles = function getFiles() {
        return this.children.filter(function(t) { return !t.isDirectory; });
      };

      RamlDirectory.prototype.forEachChildDo = function forEachChildDo(action) {
        // BFS
        var queue = this.children.slice();
        var current;
        while(queue.length > 0) {
          current = queue.shift();
          if(current.isDirectory) {
            queue = queue.concat(current.children);
          }
          action.apply(current, [current]);
        }
      };

      RamlDirectory.prototype.hasChildren = function hasChildren(child) {
        var childParentPath = child.path.slice(0, child.path.lastIndexOf('/'));
        if (childParentPath.length === 0) {
          childParentPath = '/';
        }
        return childParentPath.length >= this.path.length &&
          this.path === childParentPath.slice(0, this.path.length);
      };

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
        var path      = generateName(parent, name);
        var directory = new RamlDirectory(path);

        parent.children.push(directory);

        return fileSystem.createFolder(directory.path)
          .then(function () {
            $rootScope.$broadcast('event:raml-editor-directory-created', directory);
            return directory;
          });
      };

      // Loads the directory from the fileSystem into memory
      service.loadDirectory = function loadDirectory(path) {
        path = path || defaultPath;
        return fileSystem.directory(path).then(function (directory) {
          service.pathToRamlObject[path] = new RamlDirectory(directory.path, directory.meta, directory.children);
          return service.pathToRamlObject[path];
        });
      };

      service.removeDirectory = function removeDirectory(directory) {
        // recursively remove all the child directory and files
        // and collect all promises into an array
        var promises = [];
        directory.getDirectories().forEach(function(dir) { promises.push(service.removeDirectory(dir)); });
        directory.getFiles().forEach(function(file) { promises.push(service.removeFile(file)); });

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
          .then(function () {
            directory.name = newName;
            directory.path = newPath;

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

          return file;
        }

        return promise.then(modifyFile, handleErrorFor(file));
      };

      service.loadFile = function loadFile(file) {
        function modifyFile(data) {
          file.dirty     = false;
          file.persisted = true;
          file.loaded    = true;
          file.contents  = data;

          return file;
        }

        return fileSystem
          .load(file.path)
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
            var index = parent.children.indexOf(file);
            if (index !== -1) {
              parent.children.splice(index, 1);
            }
            $rootScope.$broadcast('event:raml-editor-file-removed', file);
          });
      };

      service.createFile = function createFile(parent, name) {
        var path = generateName(parent, name);
        var file = new RamlFile(path);

        if (file.extension === 'raml') {
          file.contents = ramlSnippets.getEmptyRaml();
        }

        parent.children.push(file);

        $rootScope.$broadcast('event:raml-editor-file-created', file);
        return file;
      };

      // Gets the ramlDirectory/ramlFile object by path from the memory
      service.getByPath = function getByPath(path) {
        // remove the trailing '/' in path
        if(path.slice(-1) === '/' && path !== '/') {
          path = path.slice(0, -1);
        }

        // If the entry is already in the cache, return it directly
        if (service.pathToRamlObject.hasOwnProperty(path)) {
          return service.pathToRamlObject[path];
        }

        // If the path we're looking for is not in 'pathToRamlObject'
        // we search for it in the tree using BFS
        var queue = service.pathToRamlObject['/'].children.slice();
        var current;
        while(queue.length) {
          current = queue.shift();
          if (current.path === path) {
            service.pathToRamlObject[path] = current;
            return current;
          } else if (current.isDirectory) {
            queue = queue.concat(current.children);
          }
        }

        return void(0);
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

      return service;
    })
  ;
})();
