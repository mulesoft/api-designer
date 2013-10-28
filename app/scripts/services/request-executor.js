'use strict';

angular.module('fs')
  .value('requestQueue', [])
  /* Request Executor */
  .factory('requestExecutor', function (safeApply, requestQueue, $http) {
    var requestExecutor = {};

    requestExecutor.add = function add (request) {
      requestQueue.push(request);
    };

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
          var result = request.success(data, status, headers, config);
          requestExecutor.process();
          return result;
        })
        .error(function () {
          var result = request.error();
          requestExecutor.process();
          return result;
        });
      });
    };

    return requestExecutor;
  });
