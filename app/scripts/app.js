angular.module('ramlEditorApp', ['ramlConsoleApp', 'helpers', 'raml', 'ngResource', 'ngSanitize', 'codeMirror', 'fs', 'utils']);

angular.module('utils', [])
  .factory('safeApply', function ($rootScope) {
    function safeApply(fn) {
      var phase = this.$root.$$phase;
      if(phase === '$apply' || phase === '$digest') {
        if(fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    }

    return function (fn) {
      safeApply.call($rootScope, fn);
    };
  });
