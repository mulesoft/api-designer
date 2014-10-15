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
      ramlRepository
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

        var files = Array.prototype.map.call($scope.files.files, readFileAsText);

        $q.all(files)
          .then(function (files) {
            files.forEach(function (contents, index) {
              var name = $scope.files.files[index].name;
              var file = ramlRepository.createFile($scope.homeDirectory, name);

              file.contents = contents;
            });

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

      /**
       * Read a file object as a text file.
       *
       * @param  {File}    file
       * @return {Promise}
       */
      function readFileAsText (file) {
        var deferred = $q.defer();
        var reader   = new FileReader();

        reader.onload = function () {
          return deferred.resolve(reader.result);
        };

        reader.onerror = function () {
          return deferred.reject(reader.error);
        };

        reader.readAsText(file);

        return deferred.promise;
      }
    });
})();
