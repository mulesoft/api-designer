'use strict';

angular.module('fs')
  /* Request Executor */
  .factory('requestExecutor', function (safeApply, $http) {
    var requestQueue = [], requestExecutor = {};

    requestExecutor.process = function proccessRequest() {
      var request;
      if (requestQueue.length === 0) {
        return;
      }

      request = requestQueue.pop();

      safeApply(function () {
        $http({
          method: request.method,
          data: request.data,
          url: [request.host, request.path].join('/'),
          withCredentials: true
        }).success(function (data, status, headers, config) {
          // TODO Check that the reference is not lost
          var result = request.success(data, status, headers, config);
          requestExecutor.process();
          return result;
        })
        .error(function () {
          // TODO Check that the reference is not lost
          var result = request.error();
          requestExecutor.process();
          return result;
        });
      });
    };

    requestExecutor.add = function add (request) {
      requestQueue.push(request);
    };

    return requestExecutor;

  })
  /* Request Builder */
  .factory('host', function ($injector, config) {
    var host = config.get('host', '');

    return host;
  })
  .value('method', 'GET')
  .value('path', 'files')
  .factory('requestBuilder', function (config, host, method, path,
    requestExecutor) {

    function RequestBuilder(shouldProcess) {
      this.values = {};
      this.values.host = host;
      this.values.method = method;
      this.values.path = path;
      this.values.withCredentials = true;

      this.call = function call() {
        requestExecutor.add(this.values);

        if (shouldProcess(this.values)) {
          requestExecutor.process();
        }
      };
    }

    RequestBuilder.prototype = {};

    RequestBuilder.prototype.host = function setHost(host) {
      this.values.host = host;
      return this;
    };

    RequestBuilder.prototype.method = function setMethod(method) {
      this.values.method = method;
      return this;
    };

    RequestBuilder.prototype.path = function setPath() {
      var i, pathArray = [];
      for (i = 0; i < arguments.length; i++) {
        pathArray.push(arguments[i]);
      }
      this.values.path = pathArray.join('/');
      return this;
    };

    RequestBuilder.prototype.data = function setData(data) {
      this.values.data = data;
      return this;
    };

    RequestBuilder.prototype.withCredentials =
      function setWithCredentials(withCredentials) {
      this.values.withCredentials = withCredentials;
      return this;
    };

    RequestBuilder.prototype.success = function setSuccess(success) {
      this.values.success = success;
      return this;
    };

    RequestBuilder.prototype.error = function setError(error) {
      this.values.error = error;
      return this;
    };

    return function (fn) {
      return new RequestBuilder(fn);
    };
  })
  .constant('TOKEN_COOKIE_KEY', 'raml_token')
  .value('shouldAutoRunInit', true)
  .factory('requestTokenBuilder', function (config, $cookies, requestBuilder,
    TOKEN_COOKIE_KEY, shouldAutoRunInit) {
    
    var token, tokenProcessed = false;

    function shouldExecute(request) {
      if (tokenProcessed) {
        return true;
      } else {
        if (request && request.path === 'token') {
          return true;
        } else {
          // Ignore this request and wait to be processed after the token
          return false;
        }
      }
    }

    function init() {
      // Retrieve the token
      token = config.get('token');

      if (!token) {
        $cookies[TOKEN_COOKIE_KEY] = undefined;
        requestBuilder(shouldExecute)
          .method('POST')
          .path('token')
          .success(function (data) {
            tokenProcessed = true;
            $cookies[TOKEN_COOKIE_KEY] = data;
            token = data;
            config.set('token', token);
            config.save();
          })
          .error(function () {
            throw 'Token could not be created';
          })
          .call();
      } else {
        $cookies[TOKEN_COOKIE_KEY] = token;
        tokenProcessed = true;
      }
    }

    if (shouldAutoRunInit) {
      init();
    }

    var result = function () {
      return requestBuilder(shouldExecute);
    };

    result.shouldExecute = shouldExecute;
    result.init = init;

    return result;
  })
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
