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
      service.directoryCache = {};

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
        this.isDirectory = true;
        this.path = path;
        this.name = path.slice(path.lastIndexOf('/') + 1);
        this.meta = meta;

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
        var queue = this.children;
        var current;
        var pos = 0;
        while(pos < queue.length) {
          current = queue[pos];
          action.apply(current, [current]);
          if(current.isDirectory) {
            queue = queue.concat(current.children);
          }
          pos++;
        }
      };

      service.getParent = function getParent(target) {
        var path = target.path.slice(0, target.path.lastIndexOf('/'));
        if (path.length === 0) {
          path = '/';
        }
        return service.getDirectory(path);
      };

      service.canExport = function canExport() {
        return fileSystem.hasOwnProperty('exportFiles');
      };

      service.exportFiles = function exportFiles() {
        return fileSystem.exportFiles();
      };

      service.createDirectory = function createDirectory(parent, name) {
        var path = generateName(parent, name);
        var directory = new RamlDirectory(path);

        parent.children.push(directory);

        return fileSystem.createFolder(directory.path)
          .then(function () {
            $rootScope.$broadcast('event:raml-editor-directory-created', directory);
            return directory;
          });
      };

      service.loadDirectory = function loadDirectory(path) {
        path = path || defaultPath;
        return fileSystem.directory(path).then(function (directory) {
          service.directoryCache[path] = new RamlDirectory(directory.path, directory.meta, directory.children);
          return service.directoryCache[path];
        });
      };

      service.getDirectory = function getDirectory(path) {
        // remove the trailing '/' in path
        if(path.slice(-1) === '/' && path !== '/') {
          path = path.slice(0, -1);
        }

        if (service.directoryCache.hasOwnProperty(path)) {
          return service.directoryCache[path];
        }

        // If the path we're looking for is not in directoryCache
        // we search for it in the tree using BFS
        var queue = service.directoryCache['/'].getDirectories();
        var pos = 0;
        while(pos < queue.length) {
          if (queue[pos].path === path) {
            service.directoryCache[path] = queue[pos];
            return queue[pos];
          }
          else {
            queue = queue.concat(queue[pos].getDirectories());
            pos++;
          }
        }

        return void(0);
      };

      service.removeDirectory = function removeDirectory(directory) {
        // recursively remove all the child directory and files
        directory.getDirectories().forEach(function(d) { service.removeDirectory(d); });
        directory.getFiles().forEach(function(f) { service.removeFile(f); });

        var parent = service.getParent(directory);
        var index = parent.children.indexOf(directory);
        if (index !== -1) {
          parent.children.splice(index, 1);
        }

        return fileSystem.remove(directory)
          .then(function (directory) {
            $rootScope.$broadcast('event:raml-editor-directory-removed', directory);
          });
      };

      service.renameDirectory = function renameDirectory(directory, newName) {
        var newPath = generateNewName(directory, newName);
        var promise = fileSystem.rename(directory.path, newPath);

        function modifyDirectory() {
          directory.name = newName;
          directory.path = newPath;

          return directory;
        }

        directory.forEachChildDo(function(c) {
          c.path = c.path.replace(directory.path, newPath);
        });

        return promise.then(modifyDirectory, handleErrorFor(directory));
      };

      service.saveFile = function saveFile(file) {
        function modifyFile() {
          file.dirty     = false;
          file.persisted = true;

          return file;
        }

        return fileSystem.save(file.path, file.contents).then(modifyFile, handleErrorFor(file));
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
            // update the parent object to remove file
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
