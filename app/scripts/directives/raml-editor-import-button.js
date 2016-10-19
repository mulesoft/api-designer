(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorImportButton', function ramlEditorImportButton(
      $injector,
      importModal
    ) {
      return {
        restrict: 'E',
        template: '<a role="import-button" ng-click="importFile()"><i class="fa fa-cloud-download"></i> Import</a>',
        link:     function (scope) {
          scope.importFile = function importFile() {
            return importModal.open();
          };
        }
      };
    })
  ;
})();
