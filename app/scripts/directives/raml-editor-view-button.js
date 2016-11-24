(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorViewButton', function ramlEditorViewButton(
      $timeout,
      $window,
      subMenuService,
      $rootScope
    ) {
      return {
        restrict: 'E',
        templateUrl: 'views/menu/view-menu.tmpl.html',
        link:     function(scope) {
          scope.openViewMenu = function () {
            subMenuService.open(scope, 'showViewMenu');
          };

          scope.toogleBackgroundColor = function () {
            $rootScope.$broadcast('event:toggle-theme');
          };
        }
      };
    });
})();
