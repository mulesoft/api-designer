(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorExportFilesButton', function ramlEditorExportFilesButton(
      $rootScope,
      $prompt,
      $window,
      ramlRepository,
      specConverter,
      subMenuService
    ) {
      return {
        restrict: 'E',
        template: [
          '<span role="export-button" ng-click="exportFiles()">',
          '  <i class="fa fa-download"></i>',
          '  &nbsp;Export files',
          '</span>',
          '<span class="menu-item-toggle" ng-click="openExportContextMenu($event)">',
          '  <i class="fa fa-caret-down"></i>',
          '</span>',
          '<ul role="context-menu" class="menu-item-context" ng-show="exportContextMenuOpen" style="min-width: 160px;">',
          '  <li role="context-menu-item" ng-click="exportSwaggerV2()">Export Swagger 2.0 spec</li>',
          '</ul>'
        ].join('\n'),
        link:     function(scope) {
          scope.openExportContextMenu = function () {
            subMenuService.open(scope, 'exportContextMenuOpen');
          };

          scope.exportFiles = function exportFiles() {
            ramlRepository.exportFiles();
          };

          scope.exportSwaggerV2 = function exportSwaggerV2() {
            return specConverter.RAMLToSwagger(this.raml)
              .then(function (contents) {
                var swagger = JSON.stringify(contents, null, 4);
                var blob = new Blob([swagger], {type: 'text/plain;charset=utf-8'});

                var fileName = $prompt('Please enter a name for your Swagger 2.0 JSON file:', 'api.json');
                fileName && $window.saveAs(blob, fileName);
              })
              .catch(function (err) {
                $rootScope.$broadcast('event:notification', {
                  message: err.message,
                  expires: true,
                  level: 'error'
                });
              })
            ;
          };
        }
      };
    })
  ;
})();
