(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .factory('ramlEditorRemoveDirectoryPrompt', function ($window) {
      return {
        open: function open(parent, directory) {
          var confirmed = $window.confirm('Are you sure you want to delete "' + directory.path + '" and all of its contents?');

          if (confirmed) {
            parent.removeDirectory(directory);
          }
        }
      };
    })
  ;
})();
