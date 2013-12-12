'use strict';

angular.module('fs')
  .constant('LOCAL_PERSISTENCE_KEY','mockFilePersistence')
  .factory('localStorageFileSystem', function ($q, $timeout, LOCAL_PERSISTENCE_KEY) {
    var service = {};

    /**
     *
     * Save in localStorage entries.
     *
     * File structure are objects that contain the following attributes:
     * * path: The full path (including the filename).
     * * content: The content of the file (only valid for files).
     * * isFolder: A flag that indicates whether is a folder or file.
     */
    var delay   = 500;

    function validatePath(path) {
      if (path.indexOf('/') !== 0) {
        return {valid: false, reason: 'Path should start with "/"'};
      }
      return {valid: true};
    }

    function extractNameFromPath(path) {
      var pathInfo = validatePath(path);

      if (!pathInfo.valid) {
        throw 'Invalid Path!';
      }

      // When the path is ended in '/'
      if (path.lastIndexOf('/') === path.length - 1) {
        
      }

      path.slice(path.lastIndexOf('/')).
    }

    function LocalStorageHelper(localStorage) {
      this.localStorage = localStorage;
    }

    LocalStorageHelper.prototype = {
      forEach: function(fn) {
        var i, key;

        for (i = 0; i < localStorage.length; i++) {
          key = this.localStorage.key(i);
          // A key is a local storage file system entry if it starts with LOCAL_PERSISTENCE_KEY + '.'
          if (key.indexOf(LOCAL_PERSISTENCE_KEY + '.') === 0) {
            fn(key);
          }
        }
      },
      set: function(path, content) {
        this.localStorage.setItem(LOCAL_PERSISTENCE_KEY + '.' + path, content);
      },
      get: function(path) {
        return this.localStorage.getItem(LOCAL_PERSISTENCE_KEY + '.' + path);
      }
    };

    var localStorageHelper = new LocalStorageHelper();

    /**
     * List files found in a given path.
     */
    service.list = function (path) {
      var deferred = $q.defer();
      var isValidPath = validatePath(path);
      var entries = [];

      if (!isValidPath.valid) {
        deferred.reject(isValidPath.reason);
        return deferred.promise;
      }

      localStorageHelper.forEach(function (fileEntry) {
        if (fileEntry.path.indexOf(path) === 0) {
          entries.push(fileEntry);
        }
      });

      $timeout(function () {
        deferred.resolve(entries);
      }, delay);

      return deferred.promise;
    };

    /**
     * Persist a file to an existing folder.
     */
    service.save = function (path, content) {
      var deferred = $q.defer();

      $timeout(function () {
        localStorageHelper.set(path, content);
        var entry = entries[0];

        if (entry) {
          if (entry.isFolder) {
            deferred.reject();
            return;
          }
          entry.content = content;
        } else {
          files.push({
            path: path,
            name: path.slice(path.lastIndexOf('/')+1),
            content: content
          });
        }

        localStorage[LOCAL_PERSISTENCE_KEY] = JSON.stringify(files);
        deferred.resolve();
      }, delay);

      return deferred.promise;
    };

    /**
     * Create the folders contained in a path.
     */
    service.createFolder = function (path) {
      var deferred = $q.defer();
      var isValidPath = validatePath(path);

      if (!isValidPath.valid) {
        deferred.reject(isValidPath.reason);
        return deferred.promise;
      }

      $timeout(function () {
        files.push({
          path: path,
          isFolder: true
        });

        localStorage[LOCAL_PERSISTENCE_KEY] = JSON.stringify(files);
        deferred.resolve();
      }, delay);


      return deferred.promise;
    };
    /**
     * Loads the content of a file.
     */
    service.load = function (path) {
      var deferred = $q.defer();
      var entries  = files
        .filter(function (f) {
          return f.path === path;
        })
        .map(function (f) {
          return f.content;
        })
      ;

      $timeout(function () {
        if (entries.length) {
          deferred.resolve(entries[0] || '');
        } else {
          deferred.reject('file with path="' + path + '" does not exist');
        }
      }, delay);

      return deferred.promise;
    };

    /**
     * Removes a file or directory.
     */
    service.remove = function (path) {
      var deferred = $q.defer();
      var entries  = files
        .filter(function (f) {
          return f.path === path;
        })
      ;

      $timeout(function () {
        if (entries.length) {
          files.splice(files.indexOf(entries[0]), 1);
          deferred.resolve();
        } else {
          deferred.reject('file with path="' + path + '" does not exist');
        }
      }, delay);

      return deferred.promise;
    };

    return service;
  });
