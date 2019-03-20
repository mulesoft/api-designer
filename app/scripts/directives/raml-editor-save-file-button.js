(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorSaveFileButton', function ramlEditorSaveFileButton(
      $rootScope,
      ramlRepository
    ) {
      return {
        restrict: 'E',
        replace: true,
        template:
        '<li role="save-button" ng-click="saveFile()">' +
          '<a><i class="fa fa-save"></i>&nbsp;Save</a>' +
        '</li>',
        link:     function(scope) {
          scope.saveFile = function saveFile() {
            var file = scope.fileBrowser.selectedFile;

            $rootScope.$broadcast('event:evict-mocking', file);
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
