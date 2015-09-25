(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorOmnisearch', function ramlEditorOmniSearch(
      safeApplyWrapper
    ) {
      return {
        restrict:    'E',
        templateUrl: 'views/raml-editor-omnisearch.tmpl.html',
        controller:  function ($scope) {
          var omnisearch = this;

          $scope.showOmnisearch = false;

          $scope.$on('event:show-omni-search', safeApplyWrapper($scope, function () {
            $scope.showOmnisearch = true;
          }));

          omnisearch.search = function () {
            omnisearch.searchResults = [];
            $scope.homeDirectory.forEachChildDo(function (child) {
              if(!child.isDirectory) {
                var filename = child.name.replace(child.extension, '');

                if (filename.indexOf(omnisearch.searchText) !== -1) {
                  omnisearch.searchResults.push(child.name);
                };
              }
            });
          };

          $scope.omnisearch = omnisearch;
        }
      };
    })
  ;
})();
