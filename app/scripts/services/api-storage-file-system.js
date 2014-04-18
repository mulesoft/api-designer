'use strict';

angular.module('ramlEditorApp')
  .factory('MyFileSystem', function ($http, $q) {

//angular.module('fs')
//  .constant('API_PERSISTENCE_KEY','apiStorageFilePersistence')
//  .constant('FOLDER', 'folder')
//  .factory('apiStorageFileSystem', function ($http, $q, $timeout, localStorageHelper, FOLDER) {

    var files = {};

    /**
     *
     * Save in localStorage entries.
     *
     * File structure are objects that contain the following attributes:
     * * path: The full path (including the filename).
     * * contents: The contents of the file (only valid for files).
     * * isFolder: A flag that indicates whether is a folder or file.
     */
    var service = {};

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
        path = path.slice(0, path.length - 1);
      }

      return path.slice(path.lastIndexOf('/') + 1);
    }

    /**
     * List files found in a given path.
     */
    service.directory = function () {
      var deferred = $q.defer();

      $http({
          method: 'GET',
          data: '',
          url: 'http://localhost:3000/files',
          withCredentials: false
        }).success(function (data) {
                  var ramlFiles = [];
                  Object.keys(data).forEach(function (id) {
                      files[data[id].path] = id;
                      ramlFiles.push({path: data[id].path, contents: decodeURI(data[id].contents)});
                    });

                  deferred.resolve({path: '/', meta: {}, children: ramlFiles});
                })
              .error(deferred.reject.bind(deferred));

      return deferred.promise;
    };

    service.save = function (path, contents) {

      var deferred = $q.defer();
      var file = {};
      var fileId = files[path];

      file.path = path;
      file.contents = encodeURI(contents);
      file.name = extractNameFromPath(path);
      file.type = 'file';
      file.lastUpdated = new Date();

      // Existing file
      if (fileId) {
        $http({
          method: 'PUT',
          data: JSON.stringify(file),
          url: 'http://localhost:3000/files/' + fileId,
          withCredentials: false
        }).success(deferred.resolve.bind(deferred))
                  .error(deferred.reject.bind(deferred));
      }
      // New File
      else {
        var newName = extractNameFromPath(path);
        var dateCourante = new Date();

        file = {
            path: path,
            name: newName,
            contents: encodeURI(contents),
            type: 'file',
            lastUpdated: dateCourante
          };

        $http({
          method: 'POST',
          data: JSON.stringify(file),
          url: 'http://localhost:3000/files/',
          withCredentials: false
        }).success(function (data) {
                      files[path] = data._id;
                      deferred.resolve();
                    })
                  .error(deferred.reject.bind(deferred));
      }

      return deferred.promise;
    };
    

    /**
     * Create the folders contained in a path.
     */
    service.createFolder = function (path) {
      var deferred = $q.defer();
      var file = {};

      file.path = path;
      file.name = extractNameFromPath(path);
      file.type = 'folder';
      file.lastUpdated = new Date();

      //  We dont manage already existing folders
      $http({
        method: 'POST',
        data: JSON.stringify(file),
        url: 'http://localhost:3000/files/',
        withCredentials: false
      }).success(function (data) {
                    files[path] = data._id;
                    deferred.resolve();
                  })
                .error(deferred.reject.bind(deferred));

      return deferred.promise;
    };

    /**
     * Loads the contents of a file.
     */
    service.load = function (path) {
      var deferred = $q.defer();

      $http({
          method: 'GET',
          data: '',
          url: 'http://localhost:3000/files/' + files[path],
          withCredentials: false
        }).success(function (data) {
                  deferred.resolve(decodeURI(data.contents));
                })
              .error(deferred.reject.bind(deferred));
              //.error(deferred.reject(fileNotFoundInStoreMessage(path)));

      return deferred.promise;
    };

    /**
     * Removes a file or directory.
     */
    service.remove = function (path) {
      var deferred = $q.defer();

      if (!files[path]) {
        deferred.reject('file at path "' + path + '" does not exist');
        return deferred.promise;
      }

      $http({
          method: 'DELETE',
          data: '',
          url: 'http://localhost:3000/files/' + files[path],
          withCredentials: false
        }).success(function () {
                  delete files[path];
                  deferred.resolve();
                })
              .error(deferred.reject.bind(deferred));

      return deferred.promise;
    };

    /**
     * Ranames a file or directory
     */
    service.rename = function (source, destination) {

      var promise = service.load(source).then(function (retour) {
        // on enregistre le nouveau fichier
        var newType = 'file';
        var newName = extractNameFromPath(destination);
        return service.save(destination, retour, newName, newType);
      }, function (reason) {
        // Error in any request
        return $q.reject(reason);
      }).then(function () {
        // on supprime l'ancien fichier
        return service.remove(source);
      }, function(reason) {
        console.log('Failed: ' + reason);
      });

      return promise;
    };

    return service;
  })
      .run(function (MyFileSystem, config, eventService) {
        // Set MyFileSystem as the filesystem to use
        config.set('fsFactory', 'MyFileSystem');
        
        // In case you want to send notifications to the user
        // (for instance, that he must login to save).
        // The expires flags means whether
        // it should be hidden after a period of time or the
        // user should dismiss it manually.
        eventService.broadcast('event:notification',
          {message: 'File saved.', expires: true});

      });