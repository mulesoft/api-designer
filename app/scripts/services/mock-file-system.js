'use strict';

angular.module('raml')
  .constant('LOCAL_PERSISTENCE_KEY','mockFilePersistence')
  .factory('mockFileSystem', function (LOCAL_PERSISTENCE_KEY) {
    var service = {};
    var files = [];
    var delay = 500;

    if (localStorage[LOCAL_PERSISTENCE_KEY]) {
      try {
        files = JSON.parse(localStorage[LOCAL_PERSISTENCE_KEY]);
      } catch (e) {
        files = [];
      }
    }

    service.directory = function (path, callback, errorCallback) {
      var entries = files
        .filter(function (f) {
          return f.path === path;
        })
        .map(function (f) {
          return f.name;
        });

      setTimeout(function () {
        if (path === 'error') {
          errorCallback('Error reading files');
        } else {
          callback(entries);
        }
      }, delay);
    };

    service.load = function (path, name, callback, errorCallback) {
      var entries = files
        .filter(function (f) {
          return f.path === path && f.name === name;
        })
        .map(function (f) {
          return f.contents;
        });

      setTimeout(function () {
        if (name === 'error') {
          errorCallback('Error reading file');
        } else {
          callback(entries[0] || '');
        }
      }, delay);
    };

    service.remove = function (path, name, callback, errorCallback) {
      var entries = files
        .filter(function (f) {
          return f.path === path && f.name === name;
        });

      setTimeout(function () {
        var removed = entries[0];
        if (name === 'error') {
          errorCallback('Error reading file');
        } else {
          if (removed) {
            files.splice(files.indexOf(removed), 1);
            callback();
          }
        }
      }, delay);
    };

    service.save = function (path, name, contents, callback, errorCallback) {
      var entries = files
        .filter(function (f) {
          return f.path === path && f.name === name;
        });

      setTimeout(function () {
        var found = entries[0];
        if (name === 'error') {
          errorCallback('Error reading file');
        } else {
          if (found) {
            found.contents = contents;
          } else {
            files.push({
              path: path,
              name: name,
              contents: contents
            });
          }

          localStorage[LOCAL_PERSISTENCE_KEY] = JSON.stringify(files);
          callback();
        }
      }, delay);
    };

    return service;
  });
