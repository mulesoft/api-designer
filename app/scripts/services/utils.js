'use strict';

angular.module('utils', [])
  .value('indentUnit', 2)
  .factory('safeApply', function ($rootScope) {
    function safeApply(scope, fn) {
      var phase = scope.$root.$$phase;
      if(phase === '$apply' || phase === '$digest') {
        if(fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        scope.$apply(fn);
      }
    }

    return function (scope, fn) {
      safeApply(scope || $rootScope, fn);
    };
  })
  .factory('getTime', function () {
    return (Date.now || function() {
      return new Date().getTime();
    });
  })
  .factory('throttle', function (getTime) {
    function throttle(func, wait, options) {
      var context, args, result;
      var timeout = null;
      var previous = 0;
      options || (options = {});
      var later = function() {
        previous = options.leading === false ? 0 : getTime();
        timeout = null;
        result = func.apply(context, args);
      };
      return function() {
        var now = getTime();
        if (!previous && options.leading === false) {
          previous = now;
        }
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0) {
          clearTimeout(timeout);
          timeout = null;
          previous = now;
          result = func.apply(context, args);
        } else if (!timeout && options.trailing !== false) {
          timeout = setTimeout(later, remaining);
        }
        return result;
      };
    }

    return throttle;
  })
  .value('generateSpaces', function (spaceCount) {
    spaceCount = spaceCount || 0;
    return new Array(spaceCount + 1).join(' ');
  })
  .factory('generateTabs', function (generateSpaces, indentUnit) {
    return function (tabs, customIndentUnit) {
      customIndentUnit = customIndentUnit || indentUnit;
      tabs = tabs || 0;
      return new Array(tabs + 1).join(generateSpaces(indentUnit));
    };
  })
  .value('$prompt', function (message, value) {
    return window.prompt(message, value);
  })
  .value('$confirm', function (message) {
    return window.confirm(message);
  })
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
