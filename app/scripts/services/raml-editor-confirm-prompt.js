(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .factory('ramlEditorConfirmPrompt', function ($window) {
      return {
        open: function open(message, confirmAction, cancelAction) {
          var confirmed = $window.confirm(message);

          if (confirmed) {
            confirmAction();
          }
          else {
            cancelAction ? cancelAction() : void(0);
          }
        }
      };
    })
  ;
})();
