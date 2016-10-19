(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorNewFolderButton', function ramlEditorNewFolderButton(
      newFolderService
    ) {
      return {
        restrict: 'E',
        template: '<a role="new-folder-button" ng-click="newFolder()"><i class="fa fa-folder-open"></i>&nbsp;New Folder</a>',
        link:     function (scope) {
          scope.newFolder = function newFolder() {
            return newFolderService.prompt(scope.homeDirectory);
          };
        }
      };
    })
  ;
})();
