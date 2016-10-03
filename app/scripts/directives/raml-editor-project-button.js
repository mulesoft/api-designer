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
        templateUrl: 'views/menu/project-menu.tmlp.html',
        link:     function(scope) {
          scope.openProjectMenu = function () {
            subMenuService.open(scope, 'showProjectMenu');
          };
        }
      };
    });
})();
