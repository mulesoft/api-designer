'use strict';

angular.module('helpers')
  .factory('eventService', function ($rootScope, $timeout) {
    var service = {};
    var lastEvents = {};

    service.broadcast = function (eventName, data) {
      $rootScope.$broadcast(eventName, data);
      lastEvents[eventName] = { data: data };
    };

    service.on = function (eventName, handler) {
      $rootScope.$on(eventName, handler);
      if (lastEvents[eventName] && handler) {
        $timeout(function () {
          handler({}, lastEvents[eventName].data);
        });
      }
    };

    return service;
});