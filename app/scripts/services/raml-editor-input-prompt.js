(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .factory('ramlEditorInputPrompt', function ($window) {
      var service = {
        open: function open(message, placeholder, validations) {
          validations = validations || [];

          var result = $window.prompt(message, placeholder);
          result = result || '';

          validations.forEach(function(v) {
            if (!v.validate(result)) {
              $window.alert(v.message);
              result = service.open(message, placeholder, validations);
            }
          });

          return result;
        }
      };

      return service;
    })
  ;
})();
