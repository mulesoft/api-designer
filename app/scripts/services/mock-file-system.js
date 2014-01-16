'use strict';

angular.module('fs')
  .constant('LOCAL_PERSISTENCE_KEY','mockFilePersistence')
  .factory('mockFileSystem', function ($q, $timeout, LOCAL_PERSISTENCE_KEY) {
    var service = {};
    var files   = [];
    var delay   = 500;

    if (localStorage[LOCAL_PERSISTENCE_KEY]) {
      try {
        files = JSON.parse(localStorage[LOCAL_PERSISTENCE_KEY]);
      } catch (e) {
        files = [];
      }
    }

    function findFile(path, name) {
      var matchingFiles = files.filter(function (f) {
        return f.path === path && f.name === name;
      });
      return matchingFiles.length > 0 ? matchingFiles[0] : null;
    }

    function fileNotFoundMessage(path,name) {
      return 'file with path="' + path + '" and name="' + name + '" does not exist';
    }

    function persist() {
      localStorage[LOCAL_PERSISTENCE_KEY] = JSON.stringify(files);
    }

    service.directory = function (path) {
      var deferred = $q.defer();
      var entries  = files
        .filter(function (f) {
          return f.path === path;
        })
        .map(function (f) {
          return f.name;
        })
      ;

      $timeout(function () {
        deferred.resolve(entries);
      }, delay);

      return deferred.promise;
    };

    service.save = function (path, name, content) {
      var deferred = $q.defer();
      var entry = findFile(path, name);

      $timeout(function () {
        if (entry) {
          entry.content = content;
        } else {
          files.push({
            path: path,
            name: name,
            content: content
          });
        }

        persist();
        deferred.resolve();
      }, delay);

      return deferred.promise;
    };

    service.move = function(currentPath, currentName, newPath, newName) {
      var deferred = $q.defer();

      var entry = findFile(currentPath, currentName);
      $timeout(function() {
        if (entry) {
          entry.path = newPath;
          entry.name = newName;
          persist();
          deferred.resolve(entry);
        } else {
          deferred.reject(fileNotFoundMessage(currentPath, currentName));
        }
      }, delay);

      return deferred.promise;
    };

    service.load = function (path, name) {
      var deferred = $q.defer();
      var entries  = files
        .filter(function (f) {
          return (f.path === path && f.name === name) || ( '/' + f.name === path + '/' + name) || ( f.name === path + '/' + name);
        })
        .map(function (f) {
          return f.content;
        })
      ;

      $timeout(function () {
        if (entries.length) {
          deferred.resolve(entries[0] || '');
        } else {
          deferred.reject(fileNotFoundMessage(path, name));
        }
      }, delay);

      return deferred.promise;
    };

    service.remove = function (path, name) {
      var deferred = $q.defer();
      var entry = findFile(path, name);

      $timeout(function () {
        if (entry) {
          files.splice(files.indexOf(entry), 1);
          persist();
          deferred.resolve();
        } else {
          deferred.reject(fileNotFoundMessage(path, name));
        }
      }, delay);

      return deferred.promise;
    };

    return service;
  });
