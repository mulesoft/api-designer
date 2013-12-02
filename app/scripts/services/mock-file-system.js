'use strict';

angular.module('fs')
  .constant('LOCAL_PERSISTENCE_KEY','mockFilePersistence')
  .value('filesForMockFileSystem', [])
  .factory('mockFileSystem', function ($q, $timeout, LOCAL_PERSISTENCE_KEY, filesForMockFileSystem) {
    var service = {};

    /**
     * File structure are objects that contain the following attributes:
     * * path: The full path (including the filename).
     * * content: The content of the file (only valid for files).
     * * isFolder: A flag that indicates whether is a folder or file.
     */
    var files   = filesForMockFileSystem;
    var delay   = 500;

    if (localStorage[LOCAL_PERSISTENCE_KEY]) {
      try {
        files = JSON.parse(localStorage[LOCAL_PERSISTENCE_KEY]);
      } catch (e) {
        files = [];
      }
    }

    service.list = function (path, includeFolders) {
      var deferred = $q.defer();
      var entries  = files
        .filter(function (f) {
          /* f path should begin with path */
          if (f.path.indexOf(path) !== 0) {
            return;
          }
          if (includeFolders) {
            return f.isFolder;
          } else {
            return !f.isFolder;
          }
        })
        .map(function (f) {
          return f.path;
        })
      ;

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
      var entries  = files
        .filter(function (f) {
          return f.path.indexOf(path) === 0;
        })
      ;

      $timeout(function () {
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
