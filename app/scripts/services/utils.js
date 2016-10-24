(function () {
  'use strict';

  angular.module('utils', [])
    .value('indentUnit', 2)
    .factory('safeApply', function safeApplyFactory($rootScope, $exceptionHandler) {
      return function safeApply(scope, expr) {
        scope = scope || $rootScope;
        if (['$apply', '$digest'].indexOf(scope.$root && scope.$root.$$phase || scope.$$phase) !== -1) {
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
      return (Date.now || function () {
        return new Date().getTime();
      });
    })
    .factory('debounce', function debounceFactory($timeout, $q) {
      /**
      * Ensures that a function will be called just once
      * after a period of time expires.
      *
      * @param {Function} target the function to debounce
      * @param {number} wait the wait delay in miliseconds
      */
      return function (target, wait) {
        var timeout = null;
        var deferred = $q.defer();

        return function () {
          var context = this;
          var args = arguments;
          var invokeTarget = function invokeTarget() {
            // call the target function, resolve the promise and reset local state for following calls
            timeout = null;
            deferred.resolve(target.apply(context, args));
            deferred = $q.defer();
          };
          // if timeout exists means that the function is being called again before the delay has finished
          // so we cancel the delayed execution in order to re-schedule it
          timeout && $timeout.cancel(timeout);
          // schedule (or re-schedule) the delayed execution
          timeout = $timeout(invokeTarget, wait);
          // return a promise that will be resolved when the target function is called
          return deferred.promise;
        };
      };
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
    .factory('generateName', function () {
      // generateName(names, defaultName, extension)
      // Takes a list of names under the current directory, uses defaultName as a pattern,
      // and add enumeration to the end of the defaultName.
      //
      // For example:
      // name        = ["Untitled-1.raml", "Untitled-2.raml", "test.raml"]
      // defaultName = 'Untitled-'
      // extension   = 'raml'
      //
      // will return 'Untitled-3.raml'
      return function generateName(names, defaultName, extension) {
        extension = extension ? '.' + extension : '';
        var currentMax = Math.max.apply(undefined, names.map(function (name) {
          var re = new RegExp(defaultName + '(\\d+)');
          var match = name.match(re);
          return match ? match[1] : 0;
        }).concat(0));

        return defaultName + (currentMax + 1) + extension;
      };
    })
    .factory('scroll', function () {
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
        }
      }

      function wheel(e) {
        preventDefault(e);
      }

      return {
        enable: function () {
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
    })
    .factory('resolveUri', function resolveUri($window) {
      return function resolveUri(uri) {
        // starts with "http://" OR "https://" OR <scheme>://"
        if (/^\w+:\/\//.test(uri)) {
          return uri;
        }

        // starts with "/"
        if (uri[0] === '/') {
          return $window.location.origin + uri;
        }

        return $window.location.origin + $window.location.pathname.split('/').slice(0, -1).concat(uri).join('/');
      };
    })
  ;
})();
