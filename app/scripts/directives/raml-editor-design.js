(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorDesign', function ramlEditorDesign(
      ramlEditorContext,
      eventEmitter,
      safeApplyWrapper
    ) {
      return {
        restrict:    'E',
        templateUrl: 'views/raml-editor-design.tmpl.html',
        controller:  function controller($scope) {
          var designer = this;

          eventEmitter.subscribe('event:editor:context', safeApplyWrapper($scope, function (data) {
            designer.resources = data.context.resources;
          }));

          $scope.designer = designer;
        }
      };
    });
})();
