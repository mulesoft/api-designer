(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorNewFolderButton', function ramlEditorNewFolderButton(ramlEditorFilenamePrompt) {
      return {
        restrict: 'E',
        template: '<span role="new-button" ng-click="newFolder()"><i class="fa fa-folder-open"></i>&nbsp;New Folder</span>',
        link:     function (scope) {
          scope.newFolder = function newFolder() {
            var homeDirectory = scope.homeDirectory;
            ramlEditorFilenamePrompt.open(homeDirectory).then(function (filename) {
              homeDirectory.createDirectory(filename);
            });
          };
        }
      };
    })
  ;
})();
