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

    service.moveFile = function (file, newName, newPath) {
      file.name = newName || file.name;
      file.path = newPath || file.path;

      return $q.when(file);
    };

    service.saveFile = function (file) {
      return $q.when(file);
    };

    service.createFile = function (name) {
      return {
        name: name
      };
    };

    service.removeFile = function (file) {
      var index = this.files.indexOf(file);
      if (index !== -1) {
        this.files.splice(index, 1);
      }

      return $q.when(file);
    };

    return service;
  });
