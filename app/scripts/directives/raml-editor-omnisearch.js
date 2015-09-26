(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorOmnisearch', function ramlEditorOmniSearch(
      safeApplyWrapper
    ) {
      return {
        restrict:    'E',
        templateUrl: 'views/raml-editor-omnisearch.tmpl.html',
        controller:  function controller($scope, $element, $timeout) {
          var omnisearch = this;
          var length     = 0;
          var position   = 0;

          $scope.showOmnisearch = false;

          $scope.$on('event:show-omni-search', safeApplyWrapper($scope, function () {
            omnisearch.searchResults = null;
            omnisearch.searchText    = null;
            $scope.showOmnisearch    = true;

            $timeout(function() {
              $element.find('input').focus();
            });
          }));

          omnisearch.search = function search() {
            omnisearch.searchResults = [];
            $scope.homeDirectory.forEachChildDo(function (child) {
              if(!child.isDirectory) {
                var filename = child.name.replace(child.extension, '');

                if (filename.indexOf(omnisearch.searchText) !== -1) {
                  omnisearch.searchResults.push(child);
                }
              }
            });

            omnisearch.selected = omnisearch.searchResults[0];
            length              = omnisearch.searchResults.length;
          };

          omnisearch.openFile = function openFile(file) {
            file = file || omnisearch.selected;

            if (!file) {
              $scope.showOmnisearch = false;
            }

            $scope.fileBrowser.selectFile(file);
            $scope.showOmnisearch = false;
          };

          omnisearch.isSelected = function isSelected(current) {
            return current.name === omnisearch.selected.name;
          };

          omnisearch.keyUp = function move(keyCode) {
            if (keyCode === 13) {
              omnisearch.openFile(null);
            }

            if (keyCode === 38) {
              if (position > 0) {
                position--;
              }

              omnisearch.selected = omnisearch.searchResults[position];
            }

            if (keyCode === 40) {
              if (position < length-1) {
                position++;
              }
              omnisearch.selected = omnisearch.searchResults[position];
            }
          };

          $scope.omnisearch = omnisearch;
        }
      };
    })
  ;
})();
