(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorNewFolderButton', function ramlEditorNewFolderButton(
      newFolderService
    ) {
      return {
        restrict: 'E',
        replace: true,
        template:
        '<li ng-show="supportsFolders" role="new-folder-button" ng-click="newFolder()">' +
          '<a><i class="fa fa-folder-open"></i>&nbsp;New Folder</a>' +
        '</li>',
        link:     function (scope) {
          scope.newFolder = function newFolder() {
            return newFolderService.prompt(scope.homeDirectory);
          };
        }
      };
    })
  ;
})();
