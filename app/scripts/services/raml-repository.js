'use strict';

angular.module('fs', ['ngCookies', 'raml', 'utils'])
  .factory('ramlRepository', function ($q, ramlSnippets, fileSystem) {
    var service = {};
    var defaultPath = '/';
    var defaultName = 'untitled.raml';

    var FILE_EXTENSION_EXTRACTOR = /.*\.(.*)$/;
    function RamlFile (name, path, contents) {
      this.path = path || defaultPath;
      this.name = name || defaultName;
      this.contents = typeof contents === 'string' ? contents : null;

      this.dirty = false;
      this.persisted = false;
      var extensionMatch = FILE_EXTENSION_EXTRACTOR.exec(this.name);
      if (extensionMatch) {
        this.type = extensionMatch[1];
      }
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
      return fileSystem.directory(path).then(function (entries) {
        return entries.map(function (e) {
          return new RamlFile(e, path);
        });
      });
    };

    service.saveFile = function (file) {
      return fileSystem.save(file.path, file.name, file.contents).then(
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
      return fileSystem.load(file.path, file.name).then(
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
      return fileSystem.remove(file.path, file.name).then(
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
      var file = new RamlFile(name, defaultPath);
      file.dirty = true;
      if (file.type === 'raml') {
        file.contents  = ramlSnippets.getEmptyRaml();
      }
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
