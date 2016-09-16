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

      // Handles <input type="file" onchange="angular.element(this).scope().handleFileSelect(this)">
      // this workaroud for binding the input file to a model won't work for 1.3.x since scope isn't available in onchange
      $scope.handleFileSelect = function (element) {
        $scope.mode.value = element.files[0];
      };

      function broadcastError(msg) {
        return $rootScope.$broadcast('event:notification', {
          message: msg,
          expires: true,
          level: 'error'
        });
      }

      /**
       * Import files from the local filesystem.
       *
       * @param {Object} mode
       */
      function importFile (mode) {
        if (!$scope.fileSupported) {
          return broadcastError('File upload not supported. Try upgrading your browser.');
        }

        $scope.importing = true;

        return importService.mergeFile($scope.rootDirectory, mode.value)
          .then(function () {
            return $modalInstance.close(true);
          })
          .catch(function (err) {
            broadcastError(err.message);
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
        return swaggerToRAML.url(mode.value)
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
            broadcastError('Failed to import Swagger: ' + err.message);
          })
          .finally(function () {
            $scope.importing = false;
          });
      }

      function importSwaggerZip (mode) {
        $scope.importing = true;

        if (importService.isZip(mode.value)) {
          return swaggerToRAML.zip($scope.rootDirectory, mode.value)
            .then(function () {
              return $modalInstance.close(true);
            })
            .catch(function (err) {
              broadcastError('Failed to parse Swagger: ' + err.message);
            })
            .finally(function () {
              $scope.importing = false;
            });
        } else {
          return swaggerToRAML.file(mode.value)
            .then(function (contents) {
              var filename = extractFileName(mode.value.name, 'raml');

              return importService.createFile(
                $scope.rootDirectory, filename, contents
              );
            })
            .then(function () {
              return $modalInstance.close(true);
            })
            .catch(function (err) {
              broadcastError('Failed to parse Swagger: ' + err.message);
            })
            .finally(function () {
              $scope.importing = false;
            });
        }
      }

      $scope.options = [
        {
          name: 'file',
          type: 'file',
          callback: importFile
        },
        {
          name: 'Swagger spec',
          type: 'swagger',
          callback: importSwagger
        },
        {
          name: 'Swagger file',
          type: 'zip',
          callback: importSwaggerZip
        }
      ];

      $scope.mode = $scope.options[0];

      // Check whether file import is supported.
      $scope.fileSupported = !!(
        window.File && window.FileReader && window.FileList && window.Blob
      );

      /**
       * Import using either import modes.
       *
       * @param {Object} form
       */
      $scope.import = function (form) {
        form.$submitted      = true;
        $scope.submittedType = $scope.mode.type;

        if (form.$invalid || $scope.importing) {
          return;
        }

        try {
          return $scope.mode.callback($scope.mode);
        } catch (err) {
          $scope.importing = false;
          broadcastError(err);
        }
      };

      /**
       * Extract a usable filename from a path.
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
