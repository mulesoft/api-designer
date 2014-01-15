/* jshint newcap: false */
(function() {
  'use strict';

  function FileList(ramlRepository, $rootScope) {
    var files = [];

    ramlRepository.getDirectory().then(function(storedFiles) {
      storedFiles.forEach(function(file) {
        files.push(file);
      });

      files.sort(function(file1, file2) {
        return file1.name.localeCompare(file2.name);
      });
    });

    return {
      files: files,
      newFile: function(filename) {
        var file = ramlRepository.createFile(filename);
        this.files.push(file);
        $rootScope.$broadcast('event:raml-editor-new-file', file);

        return file;
      }
    };
  }

  angular.module('ramlEditorApp')
    .factory('fileList', function (ramlRepository, $rootScope) {
      return FileList(ramlRepository, $rootScope);
    });
})();
