(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorExportFilesButton', function ramlEditorExportFilesButton($rootScope, ramlRepository) {
      return {
        restrict: 'E',
        template: '<span role="export-button" ng-click="exportFiles()"><i class="fa fa-download"></i>&nbsp;Export files</span>',
        link:     function(scope) {
          scope.exportFiles = function exportFiles() {
            ramlRepository.exportFiles();
          };
        }
      };
    })
  ;
})();
