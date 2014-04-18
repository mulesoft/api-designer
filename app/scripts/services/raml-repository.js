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
        // add trailing slash to path if it doesn't exist
        if (path.slice(-1) !== '/') {
          path = path + '/';
        }

        contents = contents || [];

        var strippedPath = path.substring(0, path.length - 1);
        this.type = 'directory';
        this.path = path;
        this.name = strippedPath.slice(strippedPath.lastIndexOf('/') + 1);
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
      }

      RamlDirectory.prototype.createFile = function createFile(name) {
        var file = service.createFile(name);
        this.files.push(file);

        return file;
      };

      RamlDirectory.prototype.removeFile = function (file) {
        var index = this.files.indexOf(file);
        if (index !== -1) {
          this.files.splice(index, 1);
        }

        return service.removeFile(file);
      };

      function handleErrorFor(file) {
        return function markFileWithError(error) {
          file.error = error;
          throw error;
        };
      }

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

        return fileSystem.load(file.path).then(modifyFile, handleErrorFor(file));
      };

      service.removeFile = function removeFile(file) {
        function modifyFile() {
          file.dirty     = false;
          file.persisted = false;

          return Object.freeze(file);
        }

        $rootScope.$broadcast('event:raml-editor-file-removed', file);
        return fileSystem.remove(file.path).then(modifyFile, handleErrorFor(file));
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
        //var metaFile = new RamlFile(file.path);
        return service.loadFile(metaFile).then(
          //function success(file) {
          function success() {
            //return JSON.parse(file.contents);
            // pour le moment on ne traite pas les meta
            //return {};
            return { key: 'value' };
          },

          function failure() {
            return {};
          }
        );
      };

      return service;
    });
})();
