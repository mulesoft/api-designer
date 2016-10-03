(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .service('subMenuService', function subMenuService(
      $timeout,
      $window
    ) {
      this.open = function (scope, subMenuName) {
        $timeout(function () {
          $window.addEventListener('click', function self () {
            scope.$apply(function () {
              scope[subMenuName] = false;
            });

            $window.removeEventListener('click', self);
          });
        });

        scope[subMenuName] = true;
      };

      this.openSubMenu = function (scope, subMenuName) {
        scope[subMenuName] = true;
      };
    });
})();
