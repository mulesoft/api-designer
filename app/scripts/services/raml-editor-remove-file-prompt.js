(function() {
  'use strict';

  angular.module('ramlEditorApp').factory('ramlEditorRemoveFilePrompt', function($window) {
    return {
      open: function(directory, file) {
        var confirmed = $window.confirm('Are you sure you want to delete "' + file.name + '"?');

        if (confirmed) {
          directory.removeFile(file);
        }
      }
    };
  });
})();
