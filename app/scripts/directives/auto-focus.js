(function () {
  'use strict';

  angular.module('autoFocus', [])
    .directive('ngAutoFocus', function ($timeout) {
      return {
        link: function (scope, element, attrs) {
          scope.$watch(attrs.ngAutoFocus, function (value) {
            if (!value) {
              return;
            }

            $timeout(function () {
              element[0].focus();
            }, 100);
          });
        }
      };
    });
})();
