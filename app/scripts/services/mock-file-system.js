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
      var entries  = files
        .filter(function (f) {
          return f.path === path && f.name === name;
        })
      ;

      $timeout(function () {
        var entry = entries[0];
        if (entry) {
          entry.content = content;
        } else {
          files.push({
            path: path,
            name: name,
            content: content
          });
        }

        localStorage[LOCAL_PERSISTENCE_KEY] = JSON.stringify(files);
        deferred.resolve();
      }, delay);

      return deferred.promise;
    };

    service.load = function (path, name) {
      var deferred = $q.defer();
      var entries  = files
        .filter(function (f) {
          return f.path === path && f.name === name;
        })
        .map(function (f) {
          return f.content;
        })
      ;

      $timeout(function () {
        deferred.resolve(entries[0] || '');
      }, delay);

      return deferred.promise;
    };

    service.remove = function (path, name) {
      var deferred = $q.defer();
      var entries  = files
        .filter(function (f) {
          return f.path === path && f.name === name;
        })
      ;

      $timeout(function () {
        var removed = entries[0];
        if (removed) {
          files.splice(files.indexOf(removed), 1);
        }

        deferred.resolve();
      }, delay);

      return deferred.promise;
    };

    return service;
  });
