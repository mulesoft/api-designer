(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorExportMenu', function ramlEditorExportMenu(
      ramlRepository,
      subMenuService,
      ramlToSwagger,
      $window,
      $location,
      $rootScope) {
      return {
        restrict: 'E',
        templateUrl: 'views/menu/export-menu.tmpl.html',
        link: function (scope) {
          scope.xOasExport = scope.xOasExport || $location.search().xOasExport === 'true';

          function saveFile(yaml, name) {
            var blob = new Blob([yaml], {type: 'application/json;charset=utf-8'});
            $window.saveAs(blob, name);
          }

          function broadcastError(msg) {
            return $rootScope.$broadcast('event:notification', {
              message: msg,
              expires: true,
              level: 'error'
            });
          }

          function replaceExtension (path, ext) {
            var index = path.lastIndexOf('.');
            if (index > -1) {
              path = path.substr(0, index);
            }
            return path + '.' + ext;
          }

          scope.openExportMenu = function () {
            subMenuService.openSubMenu(scope, 'showExportMenu');
          };

          scope.closeExportMenu = function () {
            scope.showExportMenu = false;
          };

          scope.exportZipFiles = function exportZipFiles() {
            ramlRepository.exportFiles();
          };

          scope.exportJsonFiles = function exportJsonFiles() {
            ramlToSwagger.json().then(function (convert) {
              var lines = JSON.stringify(convert.contents, null, 2);
              saveFile(lines, replaceExtension(convert.name, 'json'));
            }).catch(function (error) {
              broadcastError(error);
            });
          };

          scope.exportYamlFiles = function exportYamlFiles() {
            ramlToSwagger.yaml().then(function (convert) {
              saveFile(convert.contents, replaceExtension(convert.name, 'yaml'));
            }).catch(function (error) {
              broadcastError(error);
            });
          };
        }
      };
    });
})();
