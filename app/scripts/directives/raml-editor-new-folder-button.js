(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorNewFolderButton', function ramlEditorNewFolderButton(ramlEditorInputPrompt, ramlRepository, generateName) {
      return {
        restrict: 'E',
        template: '<span role="new-button" ng-click="newFolder()"><i class="fa fa-folder-open"></i>&nbsp;New Folder</span>',
        link:     function (scope) {
          scope.newFolder = function newFolder() {
            var directory = scope.fileBrowser.selectedTarget.isDirectory ?
              scope.fileBrowser.selectedTarget :
              ramlRepository.getDirectory(scope.fileBrowser.selectedTarget.parentPath(), scope.homeDirectory);
            var message = 'Input a name for your new folder:';
            var defaultName = generateName(directory.getDirectories().map(function (d){return d.name;}), 'Folder');
            var directoryName = ramlEditorInputPrompt.open(message,defaultName, [{
              message: 'That folder name is already taken.',
              validate: function(input) {
                return !directory.getDirectories().some(function (d) {
                  return d.name.toLowerCase() === input.toLowerCase();
                });
              }
            }]);

            if(directoryName.length > 0) {
              directory.createDirectory(directoryName);
            }
          };
        }
      };
    })
  ;
})();
