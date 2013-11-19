'use strict';

angular.module('fs')
  /* Request Builder */
  .factory('host', function (config) {
    return config.get('host', '');
  })
  .value('method', 'GET')
  .value('path', 'files')
  .factory('requestBuilder', function (host, method, path, requestExecutor) {

    function RequestBuilder(shouldProcess) {
      this.values = {};
      this.values.host = host;
      this.values.method = method;
      this.values.path = path;

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
  });
