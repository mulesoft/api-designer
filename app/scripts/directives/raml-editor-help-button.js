(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorHelpButton', function ramlEditorHelpButton(
      $modal,
      $timeout,
      $window
    ) {
      return {
        restrict: 'E',
        templateUrl: 'views/menu/help-menu.tmpl.html',
        link:     function(scope) {
          scope.menuContextHelpOpen = false;

          scope.openHelpContextMenu = function () {
            $timeout(function () {
              $window.addEventListener('click', function self () {
                scope.$apply(function () {
                  scope.menuContextHelpOpen = false;
                });

                $window.removeEventListener('click', self);
              });
            });

            scope.menuContextHelpOpen = true;
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
