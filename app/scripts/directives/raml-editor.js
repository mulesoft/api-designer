(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditor', function () {
      return {
        restrict:    'E',
        templateUrl: 'views/raml-editor-main.tmpl.html',
        controller:  'ramlEditorMain'
      };
    })
  ;
})();
