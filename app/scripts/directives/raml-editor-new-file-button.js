(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorNewFileButton', function ramlEditorNewFileButton(ramlEditorFilenamePrompt) {
      return {
        restrict: 'E',
        template: '<span role="new-button" ng-click="newFile()"><i class="fa fa-plus"></i>&nbsp;New File</span>',
        link:     function (scope) {
          scope.newFile = function newFile() {
            var homeDirectory = scope.homeDirectory;
            ramlEditorFilenamePrompt.open(homeDirectory).then(function (filename) {
              homeDirectory.createFile(filename);
            });
          };
        }
      };
    })
  ;
})();
