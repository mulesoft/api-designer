angular.module('helpers')
  .factory('eventService', function ($rootScope) {
    var service = {};

    service.broadcast = function (eventName, data) {
      $rootScope.$broadcast(eventName, data);
    };

    service.on = function (eventName, handler) {
      $rootScope.$on(eventName, handler);
    };

    return service;
});