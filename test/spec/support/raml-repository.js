(function () {
  'use strict';

  angular.module('testFs', [])
    .factory('ramlRepository', function($q) {
      var service = {};

      service.children = [];

      service.rootDirectory = {
        path: '/',
        children: service.children,
        isDirectory: true,
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

      service.getByPath = function () {
        return service.rootDirectory;
      };

      service.loadDirectory = function () {
        service.rootDirectory.children = service.children;
        return $q.when(service.rootDirectory);
      };

      service.getParent = function () {
        return service.rootDirectory;
      };

      service.exportFiles = function () {
        return this;
      };

      service.loadFile = function (file) {
        file.contents = file.name + ' content';

        return $q.when(file);
      };

      service.rename = function (file, newName) {
        file.name = newName || file.name;
        file.path = file.path.replace(file.name, newName);

        return $q.when(file);
      };

      service.move = function (file, newName, newPath) {
        file.name = newName || file.name;
        file.path = newPath || file.path;

        return $q.when(file);
      };

      service.saveFile = function (file) {
        return $q.when(file);
      };

      service.createFile = function (parent, name) {
        return {
          name: name,
          path: parent.path + name
        };
      };

      service.remove = function (file) {
        var index = this.children.indexOf(file);
        if (index !== -1) {
          this.children.splice(index, 1);
        }

        return $q.when(file);
      };

      service.join = function () {
        return Array.prototype.reduce.call(arguments, function (path, segment) {
          if (segment == null) {
            return path;
          }

          if (segment.charAt(0) === '/') {
            return segment;
          }

          return path.replace(/\/$/, '') + '/' + segment;
        }, '/');
      };

      return service;
    })
  ;
})();
