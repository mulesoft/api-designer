(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorNewFileButton', function ramlEditorNewFileButton(
      newFileService,
      subMenuService
    ) {
      return {
        restrict: 'E',
        templateUrl: 'views/menu/new-file-menu.tmpl.html',
        link:     function (scope) {
          scope.newFile = function newFile() {
            return newFileService.prompt(scope.homeDirectory);
          };

          scope.openFileMenu = function () {
            subMenuService.openSubMenu(scope, 'showFileMenu');
          };

          scope.closeFileMenu = function () {
            scope.showFileMenu = false;
          };

          scope.openVersionSubMenu = function () {
            subMenuService.openSubMenu(scope, 'showVersionSubMenu');
          };

          scope.closeVersionSubMenu = function () {
            scope.showVersionSubMenu = false;
          };

          scope.newFragmentFile = function newFragmentFile(fragmentType) {
            return newFileService.prompt(scope.homeDirectory, '1.0', fragmentType);
          };

          scope.newFile = function newFile(version) {
            return newFileService.prompt(scope.homeDirectory, version);
          };
        }
      };
    })
  ;
})();
