(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorImportButton', function ramlEditorImportButton(
      $injector,
      importModal
    ) {
      return {
        restrict: 'E',
        template:
          '<li role="import-button" ng-click="importFile()">' +
            '<a><i class="fa fa-cloud-download"></i>&nbsp;Import</a>' +
          '</li>',
        link:     function (scope) {
          scope.importFile = function importFile() {
            return importModal.open();
          };
        }
      };
    })
  ;
})();
