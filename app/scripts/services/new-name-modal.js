(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .service('newNameModal', function newNameModal(
      $modal
    ) {
      var self = this;

      self.open = function open(message, defaultName, validations, title) {
        return $modal
          .open({
            templateUrl: 'views/new-name-modal.html',
            controller:  'NewNameController',
            resolve: {
              message:     function messageResolver () { return message; },
              title:       function titleResolver () { return title; },
              defaultName: function defaultNameResolver () { return defaultName; },
              validations: function validationsResolver () { return validations; }
            }
          })
          .result
        ;
      };

      return self;
    })
    .controller('NewNameController', function NewNameController(
      $modalInstance,
      $scope,
      message,
      defaultName,
      validations,
      title
    ) {
      $scope.input = {
        newName: defaultName,
        message: message,
        title:   title
      };
      $scope.validationErrorMessage = '';

      $scope.isValid = function isValid(value) {
        if (value) {
          for (var i = 0; i < validations.length; i++) {
            if (!validations[i].validate(value)) {
              $scope.validationErrorMessage = validations[i].message;
              return false;
            }
          }
        }

        return true;
      };

      $scope.submit = function submit(form) {
        if (form.$invalid) {
          form.$submitted = true;
          return;
        }

        $modalInstance.close($scope.input.newName);
      };
    })
  ;
})();
