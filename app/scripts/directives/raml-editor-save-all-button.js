(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorSaveAllButton', function ramlEditorSaveAllButton(
      $rootScope,
      ramlRepository,
      ramlRepositoryConfig
    ) {
      return {
        restrict: 'E',
        replace: true,
        template:
          '<li role="save-all-button" ng-click="saveAllFiles()">' +
            '<a><i class="fa fa-save"></i>&nbsp;Save All</a>' +
          '</li>',
        link: function(scope) {

          scope.saveAllFiles = function saveAllFiles() {
            var file = scope.fileBrowser.selectedFile;
            return ramlRepository.saveAllFiles(file)
              .then(function success(file) {
                $rootScope.$broadcast('event:notification', {
                  message: 'All files saved.',
                  expires: true
                });

                if (ramlRepositoryConfig.reloadFilesOnSave){
                  $rootScope.$broadcast('event:raml-editor-file-selected', file);
                  file.dirty = false;
                  file.persisted = true;
                }
              });
          };

          $rootScope.$on('event:save-all', function() {
            scope.saveAllFiles();
          });
        }
      };
    })
  ;
})();
