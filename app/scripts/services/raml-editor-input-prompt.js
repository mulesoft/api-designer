(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .factory('ramlEditorInputPrompt', function ($window, $q) {
      var service = {
        open: function open(message, placeholder, validations) {
          validations = validations || [];

          var deferred = $q.defer();
          var validated = true;

          var result = $window.prompt(message, placeholder);
          if (result === null) {
            deferred.reject();
            return deferred.promise;
          }

          for (var i = 0; i < validations.length; i++) {
            if (!validations[i].validate(result)) {
              $window.alert(validations[i].message);
              validated = false;
              return service.open(message, placeholder, validations);
            }
          }

          if(validated) {
            deferred.resolve(result);
          }

          return deferred.promise;
        }
      };

      return service;
    })
  ;
})();
