(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorNewFileButton', function ramlEditorNewFileButton(ramlEditorInputPrompt, ramlRepository, generateName) {
      return {
        restrict: 'E',
        template: '<span role="new-button" ng-click="newFile()"><i class="fa fa-plus"></i>&nbsp;New File</span>',
        link:     function (scope) {
          scope.newFile = function newFile() {
            var directory = scope.fileBrowser.selectedTarget.isDirectory ?
              scope.fileBrowser.selectedTarget :
              ramlRepository.getDirectory(scope.fileBrowser.selectedTarget.parentPath(), scope.homeDirectory);
            var message = 'Input a name for your new file:';
            var defaultName = generateName(directory.getFiles().map(function (f){return f.name;}), 'Untitled-', 'raml');
            var filename = ramlEditorInputPrompt.open(message,defaultName, [{
              message: 'That file name is already taken.',
              validate: function(input) {
                return !directory.getFiles().some(function (file) {
                  return file.name.toLowerCase() === input.toLowerCase();
                });
              }
            }]);

            if (filename.length > 0) {
              directory.createFile(filename);
            }
          };
        }
      };
    })
  ;
})();
