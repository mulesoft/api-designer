(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorNewFolderButton', function ramlEditorNewFolderButton(ramlEditorFilenamePrompt, ramlRepository) {
      return {
        restrict: 'E',
        template: '<span role="new-button" ng-click="newFolder()"><i class="fa fa-folder-open"></i>&nbsp;New Folder</span>',
        link:     function (scope) {
          scope.newFolder = function newFolder() {
            var selected = scope.fileBrowser.selected;
            var directory = selected.type === 'file' ? ramlRepository.getDirectory(selected.parentPath(), scope.homeDirectory) : selected;
            ramlEditorFilenamePrompt.open(directory).then(function (filename) {
              directory.createDirectory(filename);
            });
          };
        }
      };
    })
  ;
})();
