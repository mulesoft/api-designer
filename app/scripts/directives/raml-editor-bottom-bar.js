(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorBottomBar', function ramlEditorBottomBar(
      safeApplyWrapper,
      eventEmitter
    ) {
      return {
        restrict:    'E',
        templateUrl: 'views/raml-editor-bottom-bar.tmpl.html',
        controller:  function controller($scope) {
          var bottomBar = this;

          bottomBar.cursor = {
            line:   1,
            column: 1
          };

          eventEmitter.subscribe('event:editor:include', safeApplyWrapper($scope, function () {
            bottomBar.resources = [];
          }));

          eventEmitter.subscribe('event:editor:context', safeApplyWrapper($scope, function (data) {
            var context = data.context;
            var cursor  = data.cursor;
            var scope   = context.scopes[cursor.line];

            bottomBar.cursor = {
              line:   cursor.line+1,
              column: cursor.ch+1
            };

            bottomBar.resources = [];

            if (scope.startsWith('/')) {
              scope.split('/').map(function (el) {
                bottomBar.resources.push({
                  text:  el.replace(/:/g, ''),
                  value: el
                });
              });

              // bottomBar.resources = scope.replace(/:/g, '').split('/');
              bottomBar.resources = bottomBar.resources.slice(1, bottomBar.resources.length);
              bottomBar.active    = {
                scope:    scope,
                resource: bottomBar.resources[bottomBar.resources.length-1]
              };
            }
          }));

          bottomBar.isActive = function isActive(current) {
            return current.text === bottomBar.active.resource.text;
          };

          bottomBar.show = function show(current, index) {
            eventEmitter.publish('event:goToResource', {
              scope:    bottomBar.active.scope,
              resource: bottomBar.active.resource,
              text:     current.value,
              index:    index,
              focus:    true
            });
          };

          $scope.bottomBar = bottomBar;
        }
      };
    });
})();
