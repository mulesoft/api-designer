(function() {
  'use strict';

  function ramlEditorNewFileButton(ramlEditorFilenamePrompt, fileList) {
    return {
      restrict: 'E',
      template: '<span role="new-button" ng-click="newFile()"><i class="icon-plus-sign"></i>&nbsp;New File</span>',
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
