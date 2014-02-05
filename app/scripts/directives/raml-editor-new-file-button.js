(function() {
  'use strict';

  function ramlEditorNewFileButton(ramlEditorFilenamePrompt) {
    return {
      restrict: 'E',
      template: '<span role="new-button" ng-click="newFile()"><i class="icon-plus"></i>&nbsp;New File</span>',
      link: function(scope) {
        scope.newFile = function() {
          var homeDirectory = scope.homeDirectory;
          ramlEditorFilenamePrompt.open(homeDirectory).then(function(filename) {
            homeDirectory.createFile(filename);
          });
        };
      }
    };
  }

  angular.module('ramlEditorApp').directive('ramlEditorNewFileButton', ramlEditorNewFileButton);
})();
