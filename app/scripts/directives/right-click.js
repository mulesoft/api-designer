(function () {
  'use strict';

  angular.module('rightClick', [])
    .directive('ngRightClick', function ($parse) {
      return function (scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);

        element.on('contextmenu', function (e) {
          scope.$apply(function () {
            e.preventDefault();
            fn(scope, { $event: e });
          });
        });
      };
    });
})();
