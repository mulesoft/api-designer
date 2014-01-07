'use strict';

angular.module('testFs', [])
  .factory('ramlRepository', function($q) {
    var service = {};

    service.files = [];

    service.getDirectory = function () {
      return $q.when(this.files);
    };

    return service;
  });
