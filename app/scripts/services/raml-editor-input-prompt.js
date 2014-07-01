(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .factory('ramlEditorInputPrompt', function ($window) {
      var service = {
        open: function open(message, placeholder, validations, confirmAction, cancelAction) {
          validations = validations || [];

          var result = $window.prompt(message, placeholder);
          if (result === null) {
            return cancelAction ? cancelAction() : null;
          }

          for (var i = 0; i < validations.length; i++) {
            if (!validations[i].validate(result)) {
              $window.alert(validations[i].message);
              result = service.open(message, placeholder, validations);

              if(result === null) {
                return cancelAction ? cancelAction() : null;
              }
            }
          }

          return confirmAction ? confirmAction(result) : result;
        }
      };

      return service;
    })
  ;
})();
