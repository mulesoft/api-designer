(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorSaveFileButton', function ramlEditorSaveFileButton(
      $rootScope,
      ramlRepository
    ) {
      return {
        restrict: 'E',
        template: '<span role="save-button" ng-click="saveFile()"><i class="fa fa-save"></i>&nbsp;Save</span>',
        link:     function(scope) {
          scope.saveFile = function saveFile() {
            var file = scope.fileBrowser.selectedFile;

            return ramlRepository.saveFile(file)
              .then(function success() {
                $rootScope.$broadcast('event:notification', {
                  message: 'File saved.',
                  expires: true
                });
              });
          };
        }
      };
    })
  ;
})();
