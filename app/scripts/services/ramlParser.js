'use strict';

angular.module('raml', [])
    .factory('parser', function () {
        return RAML.Parser;
    });