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
      $q,
      $rootScope,
      importService,
      ramlRepository
    ) {
      $scope.importing = false;
      $scope.rootDirectory = ramlRepository.getByPath('/');

      $scope.options = [
        { name: '.zip file', type: 'file' },
        { name: 'Swagger spec', type: 'swagger' }
      ];

      $scope.mode = $scope.options[0];

      // Check whether file import is supported.
      $scope.fileSupported = !!(
        window.File && window.FileReader && window.FileList && window.Blob
      );

      // Handles <input type="file" onchange="angular.element(this).scope().handleFileSelect(this)">
      // this workaroud for binding the input file to a model won't work for 1.3.x since scope isn't available in onchange
      $scope.handleFileSelect = function (element) {
        $scope.mode.value = element.files;
      };

      /**
       * Import using either import modes.
       *
       * @param {Object} form
       */
      $scope.import = function (form) {
        form.$submitted      = true;
        $scope.submittedMode = $scope.mode;

        if (form.$invalid || $scope.importing) {
          return;
        }

        if ($scope.mode.type === 'swagger') {
          return importSwagger($scope.mode);
        }

        return importFile($scope.mode);
      };

      /**
       * Import files from the local filesystem.
       *
       * @param {Object} mode
       */
      function importFile (mode) {
        if (!$scope.fileSupported) {
          return $rootScope.$broadcast('event:notification', {
            message: 'File upload not supported. Try upgrading your browser.',
            expires: true,
            level: 'error'
          });
        }

        $scope.importing = true;
        return importService.mergeFileList($scope.rootDirectory, mode.value)
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
      }

      /**
       * Import a RAML file from a Swagger specification.
       */
      function importSwagger (mode) {
        $scope.importing = true;

        // Attempt to import from a Swagger definition.
        return swaggerToRAML.convert(mode.value)
          .then(function (contents) {
            var filename = extractFileName(mode.value, 'raml');

            return importService.createFile(
              $scope.rootDirectory, filename, contents
            );
          })
          .then(function () {
            return $modalInstance.close(true);
          })
          .catch(function (err) {
            $rootScope.$broadcast('event:notification', {
              message: 'Failed to import Swagger: ' + err.message,
              expires: true,
              level: 'error'
            });
          })
          .finally(function () {
            $scope.importing = false;
          });
      }

      /**
       * Extract a useable filename from a path.
       *
       * @param  {String} path
       * @param  {String} [ext]
       * @return {String}
       */
      function extractFileName (path, ext) {
        var name  = path.replace(/\/*$/, '');
        var index = name.lastIndexOf('/');

        if (index > -1) {
          name = name.substr(index);
        }

        if (ext) {
          name = name.replace(/\.[^\.]*$/, '') + '.' + ext;
        }

        return name;
      }
    });
})();
