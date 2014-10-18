/* global JSZip */
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
      codeMirror,
      $q,
      ramlRepository,
      importService
    ) {
      $scope.files     = {};
      $scope.swagger   = {};
      $scope.importing = false;

      // Check whether file import is supported.
      $scope.files.supported = !!(
        window.File && window.FileReader && window.FileList && window.Blob
      );

      /**
       * Import files from the local filesystem.
       *
       * @param {Object} form
       */
      $scope.importFiles = function (form) {
        form.$submitted = true;

        if (form.$invalid || $scope.importing) {
          return;
        }

        $scope.importing = true;

        return importService.mergeFiles($scope.homeDirectory, $scope.files.files)
          .then(function () {
            return $modalInstance.close(true);
          })
          .catch(function (err) {
            $rootScope.$broadcast('event:notification', {
              message: err.message,
              expires: true,
              level: 'error'
            });
          })
          .finally(function () {
            $scope.importing = false;
          });
      };

      /**
       * Import a RAML file from a Swagger specification.
       *
       * @param {Object} form
       */
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
