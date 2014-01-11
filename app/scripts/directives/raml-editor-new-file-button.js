(function() {
  'use strict';

  function ramlEditorNewFileButton(ramlEditorNewFilePrompt) {
    return {
      restrict: 'E',
      template: '<i class="icon icon-plus-sign" role="new-button" ng-click="newFile()"></i>',
      link: function(scope) {
        scope.newFile = function() {
          ramlEditorNewFilePrompt.open();
        };
      }
    };
  }

  angular.module('ramlEditorApp').directive('ramlEditorNewFileButton', ramlEditorNewFileButton);
})();
