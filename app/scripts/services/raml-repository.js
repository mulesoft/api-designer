'use strict';

angular.module('fs', ['raml', 'utils', 'ngCookies'])
  .factory('fileSystem', function ($injector, config) {
    var fsFactory = config.get('fsFactory');

    if (!fsFactory) {
      fsFactory = 'mockFileSystem';

      if (window.location.origin === 'https://j0hn.mulesoft.org') {
        fsFactory = 'remoteFileSystem';
      }

      config.set('fsFactory', fsFactory);
    }


    config.save();

    return $injector.get(fsFactory);
  })
  .factory('ramlRepository', function (ramlSnippets, fileSystem) {
    var service = {};
    var defaultPath = '/';
    var defaultName = 'untitled';

    function RamlFile (name, path, contents) {
      this.path = path || defaultPath;
      this.name = name || defaultName;
      this.contents = typeof contents === 'string' ? contents : null;
      this.dirty = !name;
      this.removed = false;
      this.loading = false;
    }

    RamlFile.prototype = {
      reload: function () {
        service.loadFile(this);
      },
      remove: function () {
        service.removeFile(this);
      },
      save: function () {
        service.saveFile(this);
      },
      hasContents: function () {
        return this.contents !== null;
      }
    };

    service.loadFile = function (file, callback, errorCallback) {
      file.loading = true;

      fileSystem.load(file.path, file.name,
        function (data) {
          file.contents = data;
          file.loading = false;
          file.dirty = false;
          file.removed = false;
          if (callback) {
            callback(file);
          }
        },
        function (error) {
          file.error = error;
          file.loading = false;
          file.dirty = false;
          file.removed = false;
          if (errorCallback) {
            errorCallback(error);
          }
        });
    };

    service.getDirectory = function (path, callback, errorCallback) {
      var entries = [];

      path = path || defaultPath;
      entries.loading = true;

      fileSystem.directory(path,
        function (data) {
          data.forEach(function (f) {
            entries.push(new RamlFile(f, path));
          });
          entries.loading = false;
          if (callback) {
            callback(entries);
          }
        },
        function (error) {
          entries.error = error;
          entries.loading = false;
          if (errorCallback) {
            errorCallback(error);
          }
        });

      return entries;
    };

    service.removeFile = function (file, callback, errorCallback) {
      file.loading = true;

      fileSystem.remove(file.path, file.name,
        function () {
          file.loading = false;
          file.dirty = false;
          file.removed = true;
          if (callback) {
            callback(file);
          }
        },
        function (error) {
          file.error = error;
          file.loading = false;
          file.removed = false;
          if (errorCallback) {
            errorCallback(error);
          }
        });
    };

    service.saveFile = function (file, callback, errorCallback) {
      if (!file.dirty) {
        return;
      }

      file.loading = true;

      fileSystem.save(file.path, file.name, file.contents,
        function () {
          file.loading = false;
          file.dirty = false;
          file.removed = false;
          if (callback) {
            callback(file);
          }
        },
        function (error) {
          file.error = error;
          file.loading = false;
          if (errorCallback) {
            errorCallback(error);
          }
        });
    };

    service.createFile = function () {
      var file = new RamlFile(defaultName, defaultPath, ramlSnippets.getEmptyRaml());
      return file;
    };

    service.bootstrap = function (callback) {
      var path = defaultPath;

      service.getDirectory(path,
        function (entries) {
          if (entries && entries.length) {
            service.loadFile(entries[0], function () {
              callback(entries[0]);
            });
          } else {
            callback(service.createFile());
          }
        },
        function () {
          var file = service.createFile();
          callback(file);
        });
    };

    return service;
  });
