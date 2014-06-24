(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .service('confirmModal', function confirmModal(
      $modal
    ) {
      var self = this;

      self.open = function open(message, title) {
        return $modal
          .open({
            templateUrl: 'views/confirm-modal.html',
            controller:  'ConfirmController',
            resolve: {
              message: function messageResolver () { return message; },
              title:   function titleResolver () { return title; }
            }
          })
          .result
        ;
      };

      return self;
    })
    .controller('ConfirmController', function ConfirmController(
      $modalInstance,
      $scope,
      message,
      title
    ) {
      $scope.data = {
        message: message,
        title:   title
      };
    })
  ;
})();
