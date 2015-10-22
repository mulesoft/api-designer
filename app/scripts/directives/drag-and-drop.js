(function () {
  'use strict';

  angular.module('dragAndDrop', [])
    .directive('ngDragEnter', function ($parse) {
      return function (scope, element, attrs) {
        var fn      = $parse(attrs.ngDragEnter);
        var entered = 0;

        element.on('dragleave', function () {
          entered--;
        });

        element.on('dragenter', function (e) {
          entered++;

          if (entered !== 1) {
            return;
          }

          scope.$apply(function () {
            e.preventDefault();
            fn(scope, { $event: e });
          });
        });
      };
    })
    .directive('ngDragLeave', function ($parse) {
      return function (scope, element, attrs) {
        var fn      = $parse(attrs.ngDragLeave);
        var entered = 0;

        element.on('dragenter', function () {
          entered++;
        });

        element.on('dragleave', function (e) {
          entered--;

          if (entered !== 0) {
            return;
          }

          scope.$apply(function () {
            e.preventDefault();
            fn(scope, { $event: e });
          });
        });
      };
    })
    .directive('ngDrop', function ($parse) {
      return function (scope, element, attrs) {
        var fn = $parse(attrs.ngDrop);

        element.on('dragover', function (e) {
          e.preventDefault();
        });

        element.on('drop', function (e) {
          scope.$apply(function () {
            e.preventDefault();
            e.stopPropagation();

            fn(scope, { $event: e.originalEvent });
          });
        });
      };
    });
})();
