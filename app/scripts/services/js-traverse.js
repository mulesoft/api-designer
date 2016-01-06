(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .factory('jsTraverse', function jsTraverse(
      $window
    ) {
      return $window.jsTraverse;
    })
  ;
})();
