(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .factory('oasRamlConverter', function oasRamlConverter(
      $window
    ) {
      return $window.oasRamlConverter;
    })
  ;
})();
