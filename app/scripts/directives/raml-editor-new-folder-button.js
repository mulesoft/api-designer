(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorNewFolderButton', function ramlEditorNewFolderButton(
      newFolderService
    ) {
      return {
        restrict: 'E',
        template: '<span role="new-button" ng-click="newFolder()"><i class="fa fa-folder-open"></i>&nbsp;New Folder</span>',
        link:     function (scope) {
          scope.newFolder = function newFolder() {
            return newFolderService.prompt(scope.homeDirectory);
          };
        }
      };
    })
  ;
})();
