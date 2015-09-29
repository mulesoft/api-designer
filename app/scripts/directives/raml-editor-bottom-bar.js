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

          eventEmitter.subscribe('event:editor:current:tree', safeApplyWrapper($scope, function (data) {
            bottomBar.resources = [];

            data.map(function (el) {
              bottomBar.resources.push(el.replace(':', ''));
            });

            if (bottomBar.resources.length > 0) {
              bottomBar.active = data.pop().replace(':', '');
            }
          }));

          eventEmitter.subscribe('event:editor:cursor', safeApplyWrapper($scope, function (data) {
            bottomBar.cursor = {
              line:   data.line+1,
              column: data.ch+1
            };
          }));

          bottomBar.isActive = function isActive(current) {
            return current === bottomBar.active;
          };

          bottomBar.show = function show(current) {
            eventEmitter.publish('event:goToResource', {
              text:  current,
              focus: true
            });
          };

          $scope.bottomBar = bottomBar;
        }
      };
    });
})();
