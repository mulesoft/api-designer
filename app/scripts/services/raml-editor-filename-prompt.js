(function () {
  'use strict';

  function generateFileName(files) {
    var currentMax = Math.max.apply(undefined, files.map(function (file) {
      var match = file.name.match(/Untitled-(\d+)\.raml/);
      return match ? match[1] : 0;
    }).concat(0));

    return 'Untitled-' + (currentMax + 1) + '.raml';
  }

  angular.module('ramlEditorApp')
    .factory('ramlEditorFilenamePrompt', function ($window, $q) {
      var service = {
        open: function open(directory, suggestedFileName) {
          var deferred = $q.defer();
          suggestedFileName = suggestedFileName || generateFileName(directory.files);

          var filename = $window.prompt([
            'For a new RAML spec, be sure to name your file <something>.raml; ',
            'For files to be !included, feel free to use an extension or not.'
          ].join(''), suggestedFileName);

          if (directory.files.length === 0) {
            filename = filename || suggestedFileName;
          }

          if (filename) {
            var filenameAlreadyTaken = directory.files.some(function (file) {
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
    })
  ;
})();
