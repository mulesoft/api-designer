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
  .factory('getLineIndent', function (indentUnit) {
    return function (string, indentSize) {
      var result = /^(\s*)([\w\W]*)$/.exec(string);

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
    var match = /^([\w\W]+):( [\w\W]*$|$)/.exec(value);
    return match && match.length > 1 ? match[1] : '';
  });
