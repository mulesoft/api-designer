(function() {
  'use strict';

  function generateFileName(files) {
    var currentMax = Math.max.apply(undefined, files.map(function(file) {
      var match = file.name.match(/Untitled-(\d+)\.raml/);
      return match ? match[1] : 0;
    }).concat(0));

    return 'Untitled-' + (currentMax + 1) + '.raml';
  }

  angular.module('ramlEditorApp').factory('ramlEditorFilenamePrompt', function($window, fileList, $q) {
    return {
      open: function(suggestedFileName) {
        var deferred = $q.defer();
        suggestedFileName = suggestedFileName || generateFileName(fileList.files);
        var message = 'Choose a name:';

        if (fileList.files.length === 0) {
          message = 'The file browser is empty. Please provide a name for the new file:';
        }

        var filename = $window.prompt(message, suggestedFileName);

        if (fileList.files.length === 0) {
          filename = filename || suggestedFileName;
        }

        if (filename) {
          var filenameAlreadyTaken = fileList.files.some(function(file) {
            return file.name.toLowerCase() === filename.toLowerCase();
          });

          if (filenameAlreadyTaken) {
            $window.alert('That filename is already taken.');
            deferred.reject();
          } else {
            deferred.resolve(filename);
          }
        } else {
          deferred.reject();
        }

        return deferred.promise;
      }
    };
  });
})();
