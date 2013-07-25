angular.module('helpers').factory('showdown', function ($rootScope) {
    var showdown = new Showdown.converter();

    return showdown;
});