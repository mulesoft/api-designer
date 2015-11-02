(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .service('confirmModal', function confirmModal($rootScope, $modal) {
      var self = this;

      /**
       * @param {String} title
       * @param {String} message
       * @param {Object} [options = {canDiscard, closeButtonLabel, discardButtonLabel, dismissButtonLabel, closeButtonCssClass}]
       */
      self.open = function open(message, title, options) {
        options = angular.extend({
          canDiscard:           false,
          closeButtonLabel:     'OK',
          discardButtonLabel:   'Discard',
          dismissButtonLabel:   'Cancel',
          closeButtonCssClass:  'btn-primary'
        }, options);

        return $modal
          .open({
            templateUrl: 'views/confirm-modal.html',
            controller:  'ConfirmController',
            scope:       angular.extend($rootScope.$new(), {
                title:                title,
                message:              message,
                canDiscard:           options.canDiscard,
                closeButtonLabel:     options.closeButtonLabel,
                discardButtonLabel:   options.discardButtonLabel,
                dismissButtonLabel:   options.dismissButtonLabel,
                closeButtonCssClass:  options.closeButtonCssClass
              })
            })
          .result
        ;
      };

      return self;
    })
    .controller('ConfirmController', function ConfirmController($modalInstance, $scope) {
      $scope.discard = function discard() {
        $modalInstance.dismiss(angular.extend(new Error(), {discard: true}));
      };
    })
  ;
})();
