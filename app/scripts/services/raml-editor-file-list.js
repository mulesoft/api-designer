/* jshint newcap: false */
(function() {
  'use strict';

  function FileList(ramlRepository) {
    var files = [];

    ramlRepository.getDirectory().then(function(directory) {
      directory.files.forEach(function(file) {
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

        return file;
      },

      saveFile: function(file) {
        ramlRepository.saveFile(file);
      },

      removeFile: function(file) {
        function groomFileList() {
          var index = files.indexOf(file);
          if (index !== -1) {
            files.splice(index, 1);
          }
        }

        if (file.persisted) {
          ramlRepository.removeFile(file).then(groomFileList);
        } else {
          groomFileList();
        }
      }
    };
  }

  angular.module('ramlEditorApp')
    .factory('fileList', function (ramlRepository) {
      return FileList(ramlRepository);
    });
})();
