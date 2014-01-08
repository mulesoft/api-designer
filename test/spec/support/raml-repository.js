'use strict';

angular.module('testFs', [])
  .factory('ramlRepository', function($q) {
    var service = {};

    service.files = [];

    service.getDirectory = function () {
      return $q.when(this.files);
    };

    service.loadFile = function (file) {
      file.contents = file.name + ' content';

      return $q.when(file);
    };

    return service;
  });
