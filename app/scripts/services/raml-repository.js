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

  angular.module('fs', ['ngCookies', 'raml', 'utils'])
    .factory('ramlRepository', function ($q, $rootScope, ramlSnippets, fileSystem) {
      var service     = {};
      var defaultPath = '/';

      function notMetaFile(file) {
        return file.path.slice(-5) !== '.meta';
      }

      function RamlDirectory(path, meta, contents) {

        contents = contents || [];

        this.type = 'directory';
        this.path = path;
        this.name = path.slice(path.lastIndexOf('/') + 1);
        this.meta = meta;

        var separated = { folder: [], file: [] };
        contents.forEach(function (entry) {
          separated[entry.type || 'file'].push(entry);
        });

        this.files = separated.file.filter(notMetaFile).map(function (file) {
          return new RamlFile(file.path, file.contents, { dirty: false, persisted: true, root: file.root} );
        });

        this.files.sort(function (file1, file2) {
          return file1.name.localeCompare(file2.name);
        });

        this.directories = separated.folder.map(function (directory) {
          return new RamlDirectory(directory.path, directory.meta, directory.children);
        });

        this.children = this.directories.concat(this.files);
      }

      RamlDirectory.prototype.createDirectory = function createDirectory(name) {
        var directory = service.createDirectory(name);
        this.directories.push(directory);
        this.children.push(directory);
        fileSystem.createFolder(directory.path);
        return directory;
      };

      RamlDirectory.prototype.createFile = function createFile(name) {
        var file = service.createFile(name);
        this.files.push(file);
        this.children.push(file);
        return file;
      };

      RamlDirectory.prototype.removeFile = function removeFile(file) {
        var self = this;

        return service
          .removeFile(file)
          .then(function () {
            var index = self.files.indexOf(file);
            if (index !== -1) {
              self.files.splice(index, 1);
              self.children.splice(index,1);
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

      service.canExport = function canExport() {
        return fileSystem.hasOwnProperty('exportFiles');
      };

      service.exportFiles = function exportFiles() {
        return fileSystem.exportFiles();
      };

      service.createDirectory = function createDirectory(name) {
        var path = defaultPath + name;
        var directory = new RamlDirectory(path);

        $rootScope.$broadcast('event:raml-editor-folder-created', directory);
        return directory;
      };
      service.getDirectory = function getDirectory(path) {
        path = path || defaultPath;
        return fileSystem.directory(path).then(function (folder) {
          return new RamlDirectory(folder.path, folder.meta, folder.children);
        });
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
        var newPath = file.path.replace(file.name, newName);
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

      service.createFile = function createFile(name) {
        var path = defaultPath + name;
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
