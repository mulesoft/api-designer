(function() {
  'use strict';

  angular.module('ramlEditorApp').factory('ramlEditorRemoveFilePrompt', function($window, fileList) {
    return {
      open: function(file) {
        var confirmed = $window.confirm('Are you sure you want to delete "' + file.name + '"?');

        if (confirmed) {
          fileList.removeFile(file);
        }
      }
    };
  });
})();
