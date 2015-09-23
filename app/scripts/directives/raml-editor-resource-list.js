(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorResourceList', function ramlEditorResourceList(
      safeApplyWrapper,
      eventEmitter,
      ramlEditorContext
    ) {
      return {
        restrict:    'E',
        templateUrl: 'views/raml-editor-resource-list.tmpl.html',
        controller:  function controller($scope, $rootScope) {
          var resourceList = this;

          resourceList.selectedResource = 'all';

          eventEmitter.subscribe('event:editor:context:changed', safeApplyWrapper($scope, function (data) {
            resourceList.resources = Object.keys(data.context.metadata);
          }));

          resourceList.show = function show(resource) {
            resourceList.selectedResource = resource;

            if (resource === 'all') {
              resource = null;
            }

            ramlEditorContext.compile(resource, safeApplyWrapper($scope, function (compiled) {
              if (compiled) {
                $rootScope.$broadcast('event:raml-parsed', compiled);
              }
            }));
          };

          resourceList.isActive = function isActive(resource) {
            return resourceList.selectedResource === resource;
          };

          $scope.resourceList = resourceList;
        }
      };
    });
})();
