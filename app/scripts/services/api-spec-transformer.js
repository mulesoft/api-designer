(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .factory('apiSpecTransformer', function apiSpecTransformer(
      $window
    ) {
      return $window.apiSpecTransformer;
    })
  ;
})();
