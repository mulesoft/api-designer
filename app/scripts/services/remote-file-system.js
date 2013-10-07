'use strict';

angular.module('fs')
  .value('files', {})
  .service('remoteFileSystem', function (requestTokenBuilder, files) {
    var service = {};

    function removeInitialSlash (s) {
      return s.indexOf('/') === 0 ? s.slice(1) : s;
    }

    service.directory = function (path, callback, errorCallback) {
      requestTokenBuilder()
        .path('files')
        .success(function (data) {
          if(data.length) {
            data.forEach(function (e) {
              files[e.entry] = e;
            });
            callback(Object.keys(files));
          } else {
            errorCallback();
          }
        })
        .error(errorCallback)
        .call();

    };

    service.load = function (path, name, callback, errorCallback) {
      var fullPath = removeInitialSlash(path + name);

      requestTokenBuilder()
        .path('files', files[fullPath].id)
        .success(function (data) {
          callback(data.content);
        })
        .error(errorCallback)
        .call();
    };

    service.remove = function (path, name, callback, errorCallback) {
      var fullPath = removeInitialSlash(path + name);

      if (!files[fullPath]) {
        errorCallback();
        return;
      }

      requestTokenBuilder()
        .method('DELETE')
        .path('files', files[fullPath].id)
        .success(function () {
          files[fullPath] = undefined;
          callback();
        })
        .error(errorCallback)
        .call();
    };

    service.save = function (path, name, content, callback, errorCallback) {
      var fullPath = removeInitialSlash(path + name),
        fileId = files[fullPath] && files[fullPath].id;

      // Existing file
      if (fileId) {
        requestTokenBuilder()
          .method('PUT')
          .data({entry: fullPath, content: content})
          .path('files', fileId)
          .success(callback)
          .error(errorCallback)
          .call();

      // New File
      } else {
        requestTokenBuilder()
          .method('POST')
          .data({entry: fullPath, content: content})
          .path('files')
          .success(function (data) {
            var id = JSON.parse(data);
            files[fullPath] = {entry: fullPath, content: content, id: id};
            callback();
          })
          .error(errorCallback)
          .call();
      }
    };

    return service;
  });
