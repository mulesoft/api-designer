(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorExportMenu', function ramlEditorExportMenu(
      ramlRepository) {
        return {
          restrict: 'E',
          template:
          '<li role="export-zip" ng-click="exportZipFiles()">' +
            '<a><i class="fa fa-download"></i>&nbsp;Export files</a>' +
          '</li>',
          link: function (scope) {

            scope.exportZipFiles = function exportZipFiles() {
              ramlRepository.exportFiles();
            };

          }
        };

    });
})();
