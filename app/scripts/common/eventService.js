'use strict';

(function() {
  var module;

  try {
    module = angular.module('helpers');
  } catch (e) {
    module = angular.module('helpers', []);
  }

  module.factory('eventService', function ($rootScope) {
    var service = {};

    service.broadcast = function (eventName, data) {
      $rootScope.$broadcast(eventName, data);
    };

    service.on = function (eventName, handler) {
      $rootScope.$on(eventName, handler);
    };

    return service;
  });
})();
