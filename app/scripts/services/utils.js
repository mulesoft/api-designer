'use strict';

angular.module('utils', [])
  .factory('safeApply', function ($rootScope) {
    function safeApply($rootScope, fn) {
      var phase = $rootScope.$root.$$phase;
      if(phase === '$apply' || phase === '$digest') {
        if(fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        $rootScope.$apply(fn);
      }
    }

    return function (fn) {
      safeApply($rootScope, fn);
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
  });