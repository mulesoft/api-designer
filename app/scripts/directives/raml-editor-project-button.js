(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorProjectButton', function ramlEditorProjectButton(
      $timeout,
      $window,
      subMenuService
    ) {
      return {
        restrict: 'E',
        templateUrl: 'views/menu/project-menu.tmpl.html',
        link:     function(scope) {
          scope.openProjectMenu = function () {
            subMenuService.open(scope, 'showProjectMenu');
          };

          scope.openFileMenu = function () {
            subMenuService.openSubMenu(scope, 'showFileMenu');
          };

          scope.closeFileMenu = function () {
            scope.showFileMenu = false;
          };
        }
      };
    });
})();
