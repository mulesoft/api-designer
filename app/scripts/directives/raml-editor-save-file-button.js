(function() {
  'use strict';

  function ramlEditorSaveFileButton($rootScope, ramlRepository) {
    return {
      restrict: 'E',
      template: '<span role="save-button" ng-click="saveFile()"><i class="icon-save"></i>&nbsp;Save</span>',
      link: function(scope) {
        scope.saveFile = function() {
          var file = scope.fileBrowser.selectedFile;

          ramlRepository.saveFile(file).then(function success() {
            $rootScope.$broadcast('event:notification', {
              message: 'File saved.',
              expires: true
            });
          });
        };
      }
    };
  }

  angular.module('ramlEditorApp').directive('ramlEditorSaveFileButton', ramlEditorSaveFileButton);
})();
