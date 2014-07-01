(function () {
  'use strict';

  function RamlFile(path, contents, options) {
    options = options || {};

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

  RamlFile.prototype.parentPath = function parentPath() {
    var parent = this.path.slice(0, this.path.lastIndexOf('/') + 1);
    return parent.length === 0 ? '/' : parent;
  };

  angular.module('fs', ['ngCookies', 'raml', 'utils'])
    .factory('ramlRepository', function ($q, $rootScope, ramlSnippets, fileSystem) {
      var service     = {};
      var defaultPath = '/';

      service.supportsFolders = fileSystem.supportsFolders || false;

      function notMetaFile(file) {
        return file.path.slice(-5) !== '.meta';
      }

      function RamlDirectory(path, meta, contents) {
        // add trailing slash to path if it doesn't exist
        if (path.slice(-1) !== '/') {
          path = path + '/';
        }

        contents = contents || [];

        var strippedPath = path.substring(0, path.length - 1);
        this.type = 'directory';
        this.isDirectory = true;
        this.path = path;
        this.name = strippedPath.slice(strippedPath.lastIndexOf('/') + 1);
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

      RamlDirectory.prototype.parentPath = function parentPath() {
        var slicedPath = this.path.slice(0, -1);
        var parent = slicedPath.slice(0, slicedPath.lastIndexOf('/') + 1);
        return parent.length === 0 ? '/' : parent;
      };

      RamlDirectory.prototype.createDirectory = function createDirectory(name) {
        var directory = service.createDirectory(name, this.path);
        this.children.push(directory);
        fileSystem.createFolder(directory.path);
        return directory;
      };

      RamlDirectory.prototype.removeDirectory = function removeDirectory(directory) {
        directory.getDirectories().forEach(function(d) { directory.removeDirectory(d); });
        directory.getFiles().forEach(function(f) { directory.removeFile(f); });

        var index = this.children.indexOf(directory);
        if (index !== -1) {
          this.children.splice(index, 1);
        }
        service.removeDirectory(directory.path);
      };

      RamlDirectory.prototype.getDirectories = function getDirectories() {
        return this.children.filter(function(t) { return t.isDirectory; });
      };

      RamlDirectory.prototype.getFiles = function getFiles() {
        return this.children.filter(function(t) { return !t.isDirectory; });
      };

      RamlDirectory.prototype.createFile = function createFile(name) {
        var file = service.createFile(name, this.path);
        this.children.push(file);
        return file;
      };

      RamlDirectory.prototype.removeFile = function removeFile(file) {
        var self = this;

        return service
          .removeFile(file)
          .then(function () {
            var index = self.children.indexOf(file);
            if (index !== -1) {
              self.children.splice(index, 1);
            }
          })
        ;
      };

      function handleErrorFor(file) {
        return function markFileWithError(error) {
          file.error = error;
          throw error;
        };
      }

      RamlDirectory.prototype.forEachChild = function forEachChild(action) {
        // do a BFS search
        var queue = this.children;
        var current;
        var pos = 0;
        while(pos < queue.length) {
          current = queue[pos];
          action.apply(undefined, [current]);
          if(current.isDirectory) {
            queue = queue.concat(current.children);
          }
          pos++;
        }
      };

      service.canExport = function canExport() {
        return fileSystem.hasOwnProperty('exportFiles');
      };

      service.exportFiles = function exportFiles() {
        return fileSystem.exportFiles();
      };

      service.createDirectory = function createDirectory(name, parent) {
        parent = parent || defaultPath;
        var path = parent + name;
        var directory = new RamlDirectory(path);

        $rootScope.$broadcast('event:raml-editor-directory-created', directory);
        return directory;
      };

      service.loadDirectory = function loadDirectory(path) {
        path = path || defaultPath;
        return fileSystem.directory(path).then(function (directory) {
          return new RamlDirectory(directory.path, directory.meta, directory.children);
        });
      };

      service.getDirectory = function getDirectory(path, root) {
        if (root.path === path) {
          return root;
        }

        // do a BFS search
        var queue = root.getDirectories();
        var pos = 0;
        while(pos < queue.length) {
          if (queue[pos].path === path) {
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
        return fileSystem.remove(directory)
          .then(function (directory) {
            $rootScope.$broadcast('event:raml-editor-directory-removed', directory);
          })
        ;
      };

      service.renameDirectory = function renameDirectory(directory, newName) {
        var newPath = directory.parentPath() + newName + '/';
        var promise = fileSystem.rename(directory.path, newPath);

        function modifyDirectory() {
          directory.name = newName;
          directory.path = newPath;

          return directory;
        }

        directory.forEachChild(function(c) {
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
        var newPath = file.parentPath() + newName;
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
          .then(function (file) {
            $rootScope.$broadcast('event:raml-editor-file-removed', file);
          })
        ;
      };

      service.createFile = function createFile(name, parent) {
        var path = parent + name;
        var file = new RamlFile(path);

        if (file.extension === 'raml') {
          file.contents = ramlSnippets.getEmptyRaml();
        }

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
