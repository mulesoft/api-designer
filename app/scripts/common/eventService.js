angular.module('helpers').factory('eventService', function ($rootScope) {
    var sharedService = {};

    sharedService.broadcast = function (eventName, data) {
        $rootScope.$broadcast(eventName, data);
    };

    return sharedService;
});