(function () {
  'use strict';

  angular.module('testFs', [])
    .factory('ramlRepository', function($q) {
      var service = {};

      service.children = [];

      service.getDirectory = function () {
        return {
          children: this.children,
          createFile: function() {},
          getDirectories: function () {
            return this.children.filter(function(t) { return t.isDirectory; });
          },
          getFiles: function () {
            return this.children.filter(function(t) { return !t.isDirectory; });
          },
          forEachChildDo: function(action) {
            for (var i = 0; i < this.children.length; i++) {
              action.call(this.children[i], this.children[i]);
            }
          }
        };
      };

      service.loadDirectory = function () {
        return $q.when({
          children: this.children,
          createFile: function() {},
          getDirectories: function () {
            return this.children.filter(function(t) { return t.isDirectory; });
          },
          getFiles: function () {
            return this.children.filter(function(t) { return !t.isDirectory; });
          },
          forEachChildDo: function(action) {
            for (var i = 0; i < this.children.length; i++) {
              action.call(this.children[i], this.children[i]);
            }
          }
        });
      };

      service.parentPath = function parentPath(target) {
        var parent = target.path.slice(0, target.path.lastIndexOf('/'));
        return parent + '/';
      };

      service.loadFile = function (file) {
        file.contents = file.name + ' content';

        return $q.when(file);
      };

      service.renameFile = function (file, newName) {
        file.name = newName || file.name;
        file.path = file.path.replace(file.name, newName);

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
    })
  ;
})();
