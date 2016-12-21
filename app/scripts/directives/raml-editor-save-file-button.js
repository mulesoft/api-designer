(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorSaveFileButton', function ramlEditorSaveFileButton(
      $rootScope,
      ramlRepository,
      ramlRepositoryConfig
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

            return ramlRepository.saveFile(file)
              .then(function success(file) {
                $rootScope.$broadcast('event:notification', {
                  message: 'File saved.',
                  expires: true
                });
                if (ramlRepositoryConfig.reloadFilesOnSave){
                  $rootScope.$broadcast('event:raml-editor-file-selected', file);
                  file.dirty = false;
                  file.persisted = true;
                }
              });
          };
        }
      };
    })
  ;
})();
