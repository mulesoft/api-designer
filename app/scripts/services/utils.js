'use strict';

angular.module('utils', [])
  .value('indentUnit', 2)
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
  })
  .factory('getLineIndent', function (indentUnit) {
    return function (string, indentSize) {
      var result = /^(\s*)(.*)$/.exec(string);

      if (!string) {
        return {tabCount: 0, spaceCount: 0, content: ''};
      }

      indentSize = indentSize || indentUnit;

      return {
        tabCount: Math.floor((result[1] || '').length / indentSize),
        content: result[2] || '',
        spaceCount: (result[1] || '').length
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
  .value('extractKey', function (value) {
    value = value || '';
    var match = /^(.+):( .*$|$)/.exec(value);
    return match && match.length > 1 ? match[1] : '';
  })
  .value('$prompt', function (message, value) {
    return window.prompt(message, value);
  })
  .value('$confirm', function (message) {
    return window.confirm(message);
  });
