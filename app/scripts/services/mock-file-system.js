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
            localStorage[LOCAL_PERSISTENCE_KEY] = JSON.stringify(files);
            callback();
          }
        }
      }, delay);
    };

    if (files.length === 0) {
      files.push({
        path: '/',
        name: 'traits.yaml',
        contents: '' +
          '#%RAML 0.2\n' +
          '---\n' +
          'title: Example API\n' +
          'baseUri: http://localhost:3000/api/{company}/\n' +
          'version: 1.0\n' +
          'traits:\n' +
          '  - secured:\n' +
          '      displayName: Secured\n' +
          '      queryParameters:\n' +
          '        q:\n' +
          '          displayName: q\n' +
          '          type: string\n' +
          '          required: true\n' +
          '          description: filters the users collection\n' +
          '          example: name=John Doe\n' +
          '  - collection:\n' +
          '      displayName: Collection\n' +
          '      description: Collection of <<item>>\n' +
          '/users:\n' +
          '  displayName: Users Collection\n' +
          '  is: [ secured, collection: { item: Users } ]\n' +
          '  get:\n' +
          '    responses:\n' +
          '      200:\n' +
          '        description: |\n' +
          '          This operation returns a collection of **users**\n' +
          '      403:\n' +
          '        description: |\n' +
          '          The user doesn\'t have enough permissions to invoke this operation\n' +
          '  /{userId}:\n' +
          '    displayName: Single User\n' +
          '    get:\n' +
          '      is: [ secured ]\n' +
          '      description: Returns a single user\n'
      });
    }

    return service;
  });
