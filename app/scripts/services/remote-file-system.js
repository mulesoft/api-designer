'use strict';

angular.module('fs')
  .value('files', {})
  .service('remoteFileSystem', function ($q, requestTokenBuilder, files) {
    var service = {};

    function removeInitialSlash(s) {
      return s.indexOf('/') === 0 ? s.slice(1) : s;
    }

    service.directory = function () {
      var deferred = $q.defer();

      requestTokenBuilder()
        .method('GET')
        .path('files')
        .success(function (data) {
          Object.keys(files).forEach(function (key) {
            delete files[key];
          });

          data.forEach(function (d) {
            files[d.entry] = d;
          });

          deferred.resolve(Object.keys(files));
        })
        .error(deferred.reject.bind(deferred))
      .call();

      return deferred.promise;
    };

    service.save = function (path, name, content) {
      var deferred = $q.defer();
      var fullPath = removeInitialSlash(path + name);
      var fileId   = files[fullPath] && files[fullPath].id;

      // Existing file
      if (fileId) {
        requestTokenBuilder()
          .method('PUT')
          .path('files', fileId)
          .data({entry: fullPath, content: content})
          .success(deferred.resolve.bind(deferred))
          .error(deferred.reject.bind(deferred))
        .call();

      // New File
      } else {
        requestTokenBuilder()
          .method('POST')
          .path('files')
          .data({entry: fullPath, content: content})
          .success(function (data) {
            var id = JSON.parse(data);
            files[fullPath] = {entry: fullPath, content: content, id: id};
            deferred.resolve(files[fullPath]);
          })
          .error(deferred.reject.bind(deferred))
        .call();
      }

      return deferred.promise;
    };

    service.load = function (path, name) {
      var deferred = $q.defer();
      var fullPath = removeInitialSlash(path + name);

      if (!fullPath) {
        deferred.reject('file with path="' + path + '" and name="' + name + '" does not exist');
        return deferred.promise;
      }

      requestTokenBuilder()
        .method('GET')
        .path('files', files[fullPath].id)
        .success(function (data) {
          deferred.resolve(data.content);
        })
        .error(deferred.reject.bind(deferred))
      .call();

      return deferred.promise;
    };

    service.remove = function (path, name) {
      var deferred = $q.defer();
      var fullPath = removeInitialSlash(path + name);

      if (!files[fullPath]) {
        deferred.reject('file with path="' + path + '" and name="' + name + '" does not exist');
        return deferred.promise;
      }

      requestTokenBuilder()
        .method('DELETE')
        .path('files', files[fullPath].id)
        .success(function () {
          delete files[fullPath];
          deferred.resolve();
        })
        .error(deferred.reject.bind(deferred))
      .call();

      return deferred.promise;
    };

    return service;
  });
