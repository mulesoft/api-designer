(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorHelpButton', function ramlEditorHelpButton(
      $modal,
      $timeout,
      $window,
      subMenuService
    ) {
      return {
        restrict: 'E',
        templateUrl: 'views/menu/help-menu.tmpl.html',
        link:     function(scope) {
          scope.openHelpContextMenu = function () {
            subMenuService.open(scope, 'menuContextHelpOpen');
          };

          scope.openHelpModal = function openHelpModal() {
            $modal.open({
              templateUrl: 'views/modal/help.html'
            });
          };
        }
      };
    });
})();
