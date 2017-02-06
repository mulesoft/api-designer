(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorSaveFileButton', function ramlEditorSaveFileButton() {
      return {
        restrict: 'E',
        replace: true,
        template:
        '<li role="save-button" ng-click="saveFile()">' +
          '<a><i class="fa fa-save"></i>&nbsp;Save</a>' +
        '</li>',
        link:     function(scope) {
          scope.saveFile = function saveFile() {
            scope.fileBrowser.saveFile(scope.fileBrowser.selectedFile);
          };
        }
      };
    })
  ;
})();
