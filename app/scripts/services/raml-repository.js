(function() {
  'use strict';

  function RamlDirectory(path, meta, contents) {
    if (!/\/$/.exec(path)) { path = path + '/'; }
    contents = contents || [];

    var strippedPath = path.substring(0, path.length - 1);
    this.path = path;
    this.name = strippedPath.slice(strippedPath.lastIndexOf('/') + 1);
    this.meta = meta;

    var separated = { folder: [], file: [] };
    contents.forEach(function(entry) {
      separated[entry.type || 'file'].push(entry);
    });

    this.files = separated.file.map(function(file) {
      return new RamlFile(file.path, file.contents, { dirty: false, persisted: true} );
    });

    this.directories = separated.folder.map(function(directory) {
      return new RamlDirectory(directory.path, directory.meta, directory.children);
    });
  }

  function RamlFile (path, contents, options) {
    options = options || {};

    this.path = path;
    this.name = path.slice(path.lastIndexOf('/') + 1);
    this.contents = contents;
    this.persisted = options.persisted || false;
    this.dirty = options.dirty || !this.persisted;
  }

  angular.module('fs', ['ngCookies', 'raml', 'utils'])
    .factory('ramlRepository', function ($q, ramlSnippets, fileSystem) {
      var service = {};
      var defaultPath = '/';

      function handleErrorFor(file) {
        return function markFileWithError(error) {
          file.error = error;
          throw error;
        };
      }

      service.getDirectory = function (path) {
        path = path || defaultPath;
        return fileSystem.directory(path).then(function (folder) {
          return new RamlDirectory(folder.path, folder.meta, folder.children);
        });
      };

      service.saveFile = function (file) {
        function modifyFile() {
          file.dirty = false;
          file.persisted = true;

          return file;
        }

        return fileSystem.save(file.path, file.contents).then(modifyFile, handleErrorFor(file));
      };

      service.renameFile = function(file, newName) {
        newName = newName || file.name;
        var newPath = file.path.replace(file.name, newName);

        function modifyFile() {
          file.name = newName;
          file.path = newPath;

          return file;
        }

        return fileSystem.rename(file.path, newPath).then(modifyFile, handleErrorFor(file));
      };

      service.loadFile = function (file) {
        function modifyFile(data) {
          file.dirty = false;
          file.persisted = true;
          file.contents = data;

          return file;
        }

        return fileSystem.load(file.path).then(modifyFile, handleErrorFor(file));
      };

      service.removeFile = function (file) {
        function modifyFile() {
          file.dirty = false;
          file.persisted = false;

          return Object.freeze(file);
        }

        return fileSystem.remove(file.path).then(modifyFile, handleErrorFor(file));
      };

      service.createFile = function (name) {
        var path = defaultPath + name;
        return new RamlFile(path, ramlSnippets.getEmptyRaml());
      };

      return service;
    });
})();
