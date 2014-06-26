(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorNewFileButton', function ramlEditorNewFileButton(ramlEditorFilenamePrompt, ramlRepository) {
      return {
        restrict: 'E',
        template: '<span role="new-button" ng-click="newFile()"><i class="fa fa-plus"></i>&nbsp;New File</span>',
        link:     function (scope) {
          scope.newFile = function newFile() {
            var selected = scope.fileBrowser.selected;
            var directory = selected.type === 'file' ? ramlRepository.getDirectory(selected.parentPath(), scope.homeDirectory) : selected;
            ramlEditorFilenamePrompt.open(directory).then(function (filename) {
              directory.createFile(filename);
            });
          };
        }
      };
    })
  ;
})();
