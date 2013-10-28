'use strict';

angular.module('utils')
  .directive('ngMouseenter', ['$parse', function($parse) {
    return function(scope, element, attr) {
      var fn = $parse(attr.ngBlur);
      element.bind('mouseenter', function (event) {
        scope.$apply(function() {
          fn(scope, {$event:event});
        });
      });
    };
  }])
  .directive('ngMouseleave', ['$parse', function ($parse) {
    return function(scope, element, attr) {
      var fn = $parse(attr.ngBlur);
      element.bind('mouseleave', function (event) {
        scope.$apply(function() {
          fn(scope, {$event:event});
        });
      });
    };
  }])
  .directive('ngPreventDefault', function () {
    return function (scope, element) {
      var preventDefaultHandler = function (event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
      };
      element[0].addEventListener('click', preventDefaultHandler, false);
    };
  });
