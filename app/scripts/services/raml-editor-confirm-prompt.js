(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .factory('ramlEditorConfirmPrompt', function ($window, $q) {
      return {
        open: function open(message) {
          var deferred = $q.defer();
          $window.confirm(message) ? deferred.resolve() : deferred.reject();

          return deferred.promise;
        }
      };
    })
  ;
})();
