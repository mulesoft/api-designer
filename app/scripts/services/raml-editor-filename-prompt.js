(function() {
  'use strict';

  function generateFileName(files) {
    var currentMax = Math.max.apply(undefined, files.map(function(file) {
      var match = file.name.match(/Untitled-(\d+)\.raml/);
      return match ? match[1] : 0;
    }).concat(0));

    return 'Untitled-' + (currentMax + 1) + '.raml';
  }

  angular.module('ramlEditorApp').factory('ramlEditorFilenamePrompt', function($window, $q) {
    var service = {
      open: function(directory, suggestedFileName) {
        var deferred = $q.defer();
        suggestedFileName = suggestedFileName || generateFileName(directory.files);
        var message = 'Choose a name:';
        if (directory.files.length === 0) {
          message = 'The file browser is empty. Please provide a name for the new file:';
        }

        var filename = $window.prompt(message, suggestedFileName);

        if (directory.files.length === 0) {
          filename = filename || suggestedFileName;
        }

        if (filename) {
          var filenameAlreadyTaken = directory.files.some(function(file) {
            return file.name.toLowerCase() === filename.toLowerCase();
          });

          if (filenameAlreadyTaken) {
            $window.alert('That filename is already taken.');
            return service.open(directory, suggestedFileName);
          } else {
            deferred.resolve(filename);
          }
        } else {
          deferred.reject();
        }

        return deferred.promise;
      }
    };

    return service;
  });
})();
