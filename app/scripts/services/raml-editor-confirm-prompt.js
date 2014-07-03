(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .factory('ramlEditorConfirmPrompt', function ($window) {
      return {
        open: function open(message, confirmAction, cancelAction) {
          var confirmed = $window.confirm(message);
          var action = confirmed ? confirmAction : cancelAction;

          return action ? action() : confirmed;
        }
      };
    })
  ;
})();
