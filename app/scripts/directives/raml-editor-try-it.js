(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorTryIt', function ramlEditorTryIt(
      eventEmitter,
      safeApplyWrapper
    ) {
      return {
        restrict:    'E',
        templateUrl: 'views/raml-editor-try-it.tmpl.html',
        controller:  function controller($scope, $sce) {
          var tryIt = this;

          eventEmitter.subscribe('event:editor:context', safeApplyWrapper($scope, function (data) {
            var context    = data.context;
            var cursor     = data.cursor;
            var scopes     = context.scopes;
            var resource   = scopes[cursor.line];
            var ramlHeader = context.ramlHeader;
            var metadata;

            resource = '/'+resource.split('/').slice(1, 2);
            metadata = context.metadata[resource];

            if (metadata) {
              var raml = [ramlHeader];

              tryIt.current = $sce.trustAsHtml(context.metadata[resource].raml.join('\n').replace(/\n/g, '</br>').replace(/ /g, '&nbsp'));
              tryIt.raml = raml.concat(context.metadata[resource].raml).join('\n');
            }
          }));

          $scope.tryIt = tryIt;
        }
      };
    });
})();
