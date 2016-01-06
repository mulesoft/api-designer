(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .factory('refParser', function refParser(
      $window
    ) {
      return $window.$RefParser;
    })
  ;
})();
