'use strict';

angular.module('fs')
  .constant('LOCAL_PERSISTENCE_KEY','localStorageFilePersistence')
  .constant('FOLDER', 'folder')
  .factory('localStorageFileSystem', function ($q, $timeout, LOCAL_PERSISTENCE_KEY, FOLDER) {
    /**
     *
     * Save in localStorage entries.
     *
     * File structure are objects that contain the following attributes:
     * * path: The full path (including the filename).
     * * content: The content of the file (only valid for files).
     * * isFolder: A flag that indicates whether is a folder or file.
     */
    var service = {};
    var delay   = 500;
    var entries = [];

    function validatePath(path) {
      if (path.indexOf('/') !== 0) {
        return {valid: false, reason: 'Path should start with "/"'};
      }
      return {valid: true};
    }

    function isValidParent(path) {
      var parent = path.slice(0, path.lastIndexOf('/'));
      if(!localStorageHelper.has(parent)) {
        return false;
      }
      return true;
    }

    function hasChildrens(path) {
      var has = false;
      localStorageHelper.forEach(function (entry) {
        if (entry.path.toLowerCase() !== path.toLowerCase() &&
            entry.path.indexOf(path) === 0) {
          has = true;
        }
      });
      return has;
    }

    function extractNameFromPath(path) {
      var pathInfo = validatePath(path);

      if (!pathInfo.valid) {
        throw 'Invalid Path!';
      }

      // When the path is ended in '/'
      if (path.lastIndexOf('/') === path.length - 1) {
        path = path.slice(0, path.length - 1);
      }

      return path.slice(path.lastIndexOf('/') + 1);
    }

    function LocalStorageHelper(localStorage) {
      this.localStorage = localStorage;
    }

    LocalStorageHelper.prototype = {
      forEach: function(fn) {
        var i, key;

        for (i = 0; i < localStorage.length; i++) {
          key = this.localStorage.key(i);
          // A key is a local storage file system entry if it starts 
          //with LOCAL_PERSISTENCE_KEY + '.'
          if (key.indexOf(LOCAL_PERSISTENCE_KEY + '.') === 0) {
            fn(JSON.parse(this.localStorage.getItem(key)));
          }
        }
      },
      has: function(path) {
        var has = false;
        path = path || '/';
        this.forEach(function(entry) {
          if(entry.path.toLowerCase() === path.toLowerCase()){
            has = true;
          }
        });
        return has;
      },
      set: function(path, content) {
        this.localStorage.setItem(
          LOCAL_PERSISTENCE_KEY + '.' + path,
          JSON.stringify(content)
        );
      },
      get: function(path) {
        return JSON.parse(this.localStorage.getItem(LOCAL_PERSISTENCE_KEY + '.' + path));
      },
      remove: function(path) {
        this.localStorage.removeItem(LOCAL_PERSISTENCE_KEY + '.' + path);
      }
    };

    var localStorageHelper = new LocalStorageHelper(localStorage);

    /**
     * List files found in a given path.
     */
    service.list = function (path) {
      var deferred = $q.defer();
      var isValidPath = validatePath(path);

      if (!isValidPath.valid) {
        deferred.reject(isValidPath.reason);
        return deferred.promise;
      }

      if(path.lastIndexOf('/') !== path.length - 1) {
        path += '/';
      }

      entries = [];
      localStorageHelper.forEach(function (entry) {
        if (entry.path.toLowerCase() !== path.toLowerCase() &&
            entry.path.indexOf(path + entry.name) === 0) {
          entries.push(entry);
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
    service.save = function (file) {
      var deferred = $q.defer();

      $timeout(function () {
        var path = file.path + file.name;
        var entry = localStorageHelper.get(file.path);

        if(!isValidParent(file.path)){
          deferred.reject('Parent folder does not exists');
          return deferred.promise;
        }

        if (entry) {
          if (entry.type === 'folder') {
            deferred.reject('file has the same name as a folder');
            return deferred.promise;
          }
          entry.content = file.content;
          file = entry;
        } else {
          file = {
            path: path,
            name: file.name,
            content: file.contents,
            type: 'file'
          };
        }

        localStorageHelper.set(path, file);
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

      if(localStorageHelper.has(path)) {
        deferred.reject('Folder already exists');
        return deferred.promise;
      }

      var parent = path.slice(0, path.lastIndexOf('/'));
      if(!localStorageHelper.has(parent)) {
        deferred.reject('Parent folder does not exists');
        return deferred.promise;
      }

      $timeout(function () {

        localStorageHelper.set(path, {
            path: path,
            name: extractNameFromPath(path),
            type: 'folder'
          });

        deferred.resolve();
      }, delay);


      return deferred.promise;
    };

    /**
     * Loads the content of a file.
     */
    service.load = function (path) {
      var deferred = $q.defer();

      $timeout(function () {

        var entry = localStorageHelper.get(path);
        if(entry && entry.type === 'file') {
          deferred.resolve(localStorageHelper.get(path).content);
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

      $timeout(function () {
        var entry = localStorageHelper.get(path);

        if(entry &&
           entry.type === FOLDER &&
           hasChildrens(path)) {
          deferred.reject('folder not empty');
          return deferred.promise;
        }

        localStorageHelper.remove(path);
        deferred.resolve();
      }, delay);

      return deferred.promise;
    };

    return service;
  });
