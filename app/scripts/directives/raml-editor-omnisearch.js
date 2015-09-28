(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorOmnisearch', function ramlEditorOmniSearch(
      safeApplyWrapper,
      eventEmitter
    ) {
      return {
        restrict:    'E',
        templateUrl: 'views/raml-editor-omnisearch.tmpl.html',
        controller:  function controller($scope, $element, $timeout) {
          var omnisearch = this;
          var length     = 0;
          var position   = 0;

          $scope.showOmnisearch = false;

          omnisearch.open = function open() {
            omnisearch.searchResults = null;
            omnisearch.searchText    = null;
            $scope.showOmnisearch    = true;

            $timeout(function() {
              $element.find('input').focus();
            });
          };

          omnisearch.close = function close() {
            omnisearch.searchResults = null;
            omnisearch.searchText    = null;
            $scope.showOmnisearch    = false;
          };

          eventEmitter.subscribe('event:open:omnisearch', function () {
            omnisearch.open();
          });

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

            if (keyCode === 27) {
              omnisearch.close();
            }

            // Up Arrow
            if (keyCode === 38) {
              if (position > 0) {
                position--;
              }

              omnisearch.selected = omnisearch.searchResults[position];
            }

            // Down Arrow
            if (keyCode === 40) {
              $timeout(function() {
                $element.focus();
              });

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
