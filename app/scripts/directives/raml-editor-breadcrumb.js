(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorBreadcrumb', function ramlEditorBreadcrumb(
      safeApplyWrapper,
      eventEmitter
    ) {
      return {
        restrict:    'E',
        templateUrl: 'views/raml-editor-breadcrumb.tmpl.html',
        controller:  function controller($scope) {
          var breadcrumb = this;

          eventEmitter.subscribe('event:editor:include', safeApplyWrapper($scope, function () {
            breadcrumb.resources = [];
          }));

          eventEmitter.subscribe('event:editor:context:changed', safeApplyWrapper($scope, function (data) {
            var context = data.context;
            var cursor  = data.cursor;
            var scope   = context.scopes[cursor.line];

            breadcrumb.resources = [];

            if (scope.startsWith('/')) {
              scope.split('/').map(function (el) {
                breadcrumb.resources.push({
                  text:  el.replace(/:/g, ''),
                  value: el
                });
              });

              // breadcrumb.resources = scope.replace(/:/g, '').split('/');
              breadcrumb.resources = breadcrumb.resources.slice(1, breadcrumb.resources.length);
              breadcrumb.active    = {
                scope:    scope,
                resource: breadcrumb.resources[breadcrumb.resources.length-1]
              };
            }
          }));

          breadcrumb.isActive = function isActive(current) {
            return current.text === breadcrumb.active.resource.text;
          };

          breadcrumb.show = function show(current, index) {
            eventEmitter.publish('event:goToResource', {
              scope:    breadcrumb.active.scope,
              resource: breadcrumb.active.resource,
              text:     current.value,
              index:    index,
              focus:    true
            });
          };

          $scope.breadcrumb = breadcrumb;
        }
      };
    });
})();
