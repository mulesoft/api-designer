(function () {
  'use strict';

  function generateFolderName(files) {
    var currentMax = Math.max.apply(undefined, files.map(function (file) {
      var match = file.name.match(/Untitled Folder(\d+)/);
      return match ? match[1] : 0;
    }).concat(0));

    return 'Untitled Folder' + (currentMax + 1);
  }

  angular.module('ramlEditorApp')
    .factory('ramlEditorDirectorynamePrompt', function ($window, $q) {
      var service = {
        open: function open(directory, suggestedFolderName) {
          var deferred = $q.defer();
          suggestedFolderName = suggestedFolderName || generateFolderName(directory.directories);
          var message = 'Choose a name:';

          var foldername = $window.prompt(message, suggestedFolderName);

          if (foldername) {
            var filenameAlreadyTaken = directory.directories.some(function (folder) {
              return folder.name.toLowerCase() === foldername.toLowerCase();
            });

            if (filenameAlreadyTaken) {
              $window.alert('That foldername is already taken.');
              return service.open(directory, suggestedFolderName);
            } else {
              deferred.resolve(foldername);
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
