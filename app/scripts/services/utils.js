'use strict';

angular.module('utils', [])
  .value('indentUnit', 2)
  .factory('safeApply', function safeApplyFactory($rootScope, $exceptionHandler) {
    return function safeApply(scope, expr) {
      scope = scope || $rootScope;
      if (['$apply', '$digest'].indexOf(scope.$root.$$phase) !== -1) {
        try {
          return scope.$eval(expr);
        } catch (e) {
          $exceptionHandler(e);
        }
      } else {
        return scope.$apply(expr);
      }
    };
  })
  .factory('safeApplyWrapper', function safeApplyWrapperFactory(safeApply) {
    return function safeApplyWrapper(scope, expr) {
      return function safeApplyWrapperInner1() {
        var args = Array.prototype.slice.call(arguments, 0);
        return safeApply(scope, function safeApplyWrapperInner2() {
          return expr.apply(this, args);
        });
      };
    };
  })
  .factory('getTime', function () {
    return (Date.now || function() {
      return new Date().getTime();
    });
  })
  .factory('debounce', function debounceFactory($timeout) {
    return function debounce(fn, delay, invokeApply) {
      var timeout;
      return function debounceWrapper() {
        if (timeout) {
          $timeout.cancel(timeout);
        }

        timeout = $timeout(fn, delay, invokeApply);
      };
    };
  })
  .factory('throttle', function (getTime, $timeout) {
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
          $timeout.cancel(timeout);
          timeout = null;
          previous = now;
          result = func.apply(context, args);
        } else if (!timeout && options.trailing !== false) {
          timeout = $timeout(later, remaining);
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
  .factory('scroll', function(){
    var keys = { 37:true, 38:true, 39:true, 40:true };

    function preventDefault(e) {
      e = e || window.event;
      if (e.preventDefault){
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
    }

    function keyDown(e) {
      if (keys[e.keyCode]) {
        preventDefault(e);
        return;
      }
    }

    function wheel(e) {
      preventDefault(e);
    }

    return {
      enable: function(){
        if (window.removeEventListener) {
          window.removeEventListener('DOMMouseScroll', wheel, false);
        }
        window.onmousewheel = document.onmousewheel = document.onkeydown = null;
      },
      disable: function () {
        if (window.addEventListener) {
          window.addEventListener('DOMMouseScroll', wheel, false);
        }
        window.onmousewheel = document.onmousewheel = wheel;
        document.onkeydown = keyDown;
      }
    };
  });
