'use strict';

angular.module('ramlEditorApp', ['ramlConsoleApp', 'helpers', 'raml', 'ngResource', 'ngSanitize', 'codeMirror', 'fs', 'utils', 'stringFilters']);

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
  });
