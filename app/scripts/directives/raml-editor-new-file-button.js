(function() {
  'use strict';

  function ramlEditorNewFileButton(ramlEditorNewFilePrompt) {
    return {
      restrict: 'E',
      template: '<span role="new-button" ng-click="newFile()"><i class="icon-plus-sign"></i>&nbsp;New File</span>',
      link: function(scope) {
        scope.newFile = function() {
          ramlEditorNewFilePrompt.open();
        };
      }
    };
  }

  angular.module('ramlEditorApp').directive('ramlEditorNewFileButton', ramlEditorNewFileButton);
})();
