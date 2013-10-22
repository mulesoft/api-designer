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

      safeApply(null, function () {
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
  });
