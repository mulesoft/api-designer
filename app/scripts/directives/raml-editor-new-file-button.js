(function() {
  'use strict';

  function ramlEditorNewFileButton(ramlEditorFilenamePrompt, fileList) {
    return {
      restrict: 'E',
      template: '<i class="icon icon-plus-sign" role="new-button" ng-click="newFile()"></i>',
      link: function(scope) {
        scope.newFile = function() {
          ramlEditorFilenamePrompt.open().then(function(filename) {
            fileList.newFile(filename);
          });
        };
      }
    };
  }

  angular.module('ramlEditorApp').directive('ramlEditorNewFileButton', ramlEditorNewFileButton);
})();
