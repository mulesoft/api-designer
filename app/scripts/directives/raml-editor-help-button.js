(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorHelpButton', function ramlEditorHelpButton(
      $window,
      $timeout,
      $modal
    ) {
      return {
        restrict: 'E',
        templateUrl: 'views/menu/help-menu.tmpl.html',
        link:     function(scope) {
          scope.contextHelpMenuOpen = false;

          scope.openHelpContextMenu = function () {
            $timeout(function () {
              $window.addEventListener('click', function self () {
                scope.$apply(function () {
                  scope.contextHelpMenuOpen = false;
                });

                $window.removeEventListener('click', self);
              });
            });

            scope.contextHelpMenuOpen = true;
          };

          scope.openHelpModal = function openHelpModal() {
            $modal.open({
              templateUrl: 'views/modal/help.html'
            });
          };

          scope.openLink = function openLink(link) {
            $window.open(link, '_blank');
          };
        }
      };
    });
})();
