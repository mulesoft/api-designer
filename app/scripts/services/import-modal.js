(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .service('importModal', function importModal(
      $modal
    ) {
      var self = this;

      self.open = function open() {
        return $modal
          .open({
            templateUrl: 'views/import-modal.html',
            controller:  'ImportController'
          })
          .result
        ;
      };

      return self;
    })
    .controller('ImportController', function ConfirmController(
      $scope,
      $modalInstance,
      swaggerToRAML,
      $rootScope,
      codeMirror
    ) {
      $scope.swagger = {};
      $scope.importing = false;

      $scope.importSwagger = function (form) {
        form.$submitted = true;

        if (form.$invalid || $scope.importing) {
          return;
        }

        $scope.importing = true;

        // Attempt to import from a Swagger definition.
        return swaggerToRAML.convert($scope.swagger.url)
          .then(function (raml) {
            codeMirror.getEditor().setValue(raml);

            return $modalInstance.close(true);
          })
          .catch(function () {
            $rootScope.$broadcast('event:notification', {
              message: 'Failed to load and parse Swagger: ' + $scope.swagger.url,
              expires: true,
              level: 'error'
            });
          })
          .finally(function () {
            $scope.importing = false;
          });
      };
    });
})();
