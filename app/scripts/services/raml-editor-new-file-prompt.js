(function() {
  'use strict';

  function generateFileName(files) {
    var currentMax = Math.max.apply(undefined, files.map(function(file) {
      var match = file.name.match(/Untitled-(\d+)\.raml/);
      return match ? match[1] : 0;
    }).concat(0));

    return 'Untitled-' + (currentMax + 1) + '.raml';
  }

  angular.module('ramlEditorApp').factory('ramlEditorNewFilePrompt', function($window, fileList) {
    return {
      open: function() {
        var suggestedFileName = generateFileName(fileList.files);
        var filename = $window.prompt('Name your file:', suggestedFileName);

        if (filename) {
          var filenameAlreadyTaken = fileList.files.some(function(file) {
            return file.name.toLowerCase() === filename.toLowerCase();
          });

          if (filenameAlreadyTaken) {
            $window.alert('That filename is already taken.');
          } else {
            fileList.newFile(filename);
          }
        }
      }
    };
  });
})();
