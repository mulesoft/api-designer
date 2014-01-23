'use strict';

angular.module('fs', ['ngCookies', 'raml', 'utils'])
  .factory('ramlRepository', function ($q, ramlSnippets, fileSystem) {
    var service = {};
    var defaultPath = '/';
    var defaultName = 'untitled.raml';

    function RamlFile (name, path, contents) {
      this.path = path || defaultPath;
      this.name = name || defaultName;
      if (this.path.indexOf(this.name) === -1) {
        this.path = this.path + this.name;
      }

      this.contents = typeof contents === 'string' ? contents : null;
      this.dirty = false;
      this.persisted = true;
    }

    RamlFile.prototype = {
      save: function () {
        return service.saveFile(this);
      },

      reload: function () {
        return service.loadFile(this);
      },

      remove: function () {
        return service.removeFile(this);
      },

      hasContents: function () {
        return !!this.contents;
      }
    };

    service.getDirectory = function (path) {
      path = path || defaultPath;
      return fileSystem.directory(path).then(function (folder) {
        return folder.children.map(function (entry) {
          return new RamlFile(entry.name, entry.path, entry.content);
        });
      });
    };

    service.saveFile = function (file) {
      return fileSystem.save(file.path, file.contents).then(
        // success
        function () {
          file.dirty = false;
          file.persisted = true;

          return file;
        },

        // failure
        function (error) {
          file.error = error;

          throw error;
        }
      );
    };

    service.loadFile = function (file) {
      return fileSystem.load(file.path).then(
        // success
        function (data) {
          file.dirty = false;
          file.persisted = true;
          file.contents  = data;

          return file;
        },

        // failure
        function (error) {
          file.dirty = false;
          file.persisted = true;
          file.error     = error;

          throw error;
        }
      );
    };

    service.removeFile = function (file) {
      return fileSystem.remove(file.path).then(
        // success
        function () {
          file.dirty = false;

          return file;
        },

        // failure
        function (error) {
          file.error = error;

          throw error;
        }
      );
    };

    service.createFile = function (name) {
      var file = new RamlFile(name, defaultPath, ramlSnippets.getEmptyRaml());
      file.dirty = true;
      file.persisted = false;
      return file;
    };

    service.bootstrap = function () {
      return service.getDirectory(defaultPath).then(function (files) {
        if (files.length) {
          return service.loadFile(files[0]);
        } else {
          return service.createFile();
        }
      });
    };

    return service;
  });
