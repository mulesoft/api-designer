(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .factory('apiSpecConverter', function apiSpecConverter(
      $window
    ) {
      return $window.apiSpecConverter;
    })
  ;
})();
