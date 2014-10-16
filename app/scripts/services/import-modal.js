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

        $scope.importing = true;

        var files = Array.prototype.map.call($scope.files.files, readFileAsText);

        $q.all(files)
          .then(function (files) {
            var createFiles = files.map(function (contents, index) {
              var name = $scope.files.files[index].name;

              if (isZip(name)) {
                return importZip(contents);
              }

              return createFile(name, contents);
            });

            return $q.all(createFiles)
              .then(function () {
                return $modalInstance.close(true);
              });
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
       * Check whether a file is a zip.
       *
       * @param  {String}  name
       * @return {Boolean}
       */
      function isZip (name) {
        return (/\.zip$/i).test(name);
      }

      /**
       * Import a ZIP file into the current file system.
       *
       * @param {String} contents
       */
      function importZip (contents) {
        var zip     = new JSZip(contents);
        var promise = $q.when(true);

        Object.keys(zip.files).filter(canImport).forEach(function (name) {
          promise = promise.then(function () {
            // Directories are also stored under the files object.
            if (/\/$/.test(name)) {
              return createDirectory(name);
            }

            return createFile(name, zip.files[name].asText());
          });
        });

        return promise;
      }

      /**
       * Check whether a certain file should be imported.
       *
       * @param  {String}  name
       * @return {Boolean}
       */
      function canImport (name) {
        return !/(?:^|[\/\\])\.|(?:^|[\/\\])__MACOSX(?:[\/\\]|$)/.test(name);
      }

      /**
       * Create a file in the filesystem.
       *
       * @param  {String}  name
       * @param  {String}  contents
       * @return {Promise}
       */
      function createFile (name, contents) {
        return ramlRepository.createFile($scope.homeDirectory, name)
          .then(function (file) {
            file.contents = contents;

            return file;
          });
      }

      /**
       * Create a directory in the file system.
       *
       * @param  {String}  name
       * @return {Promise}
       */
      function createDirectory (name) {
        return ramlRepository.createDirectory($scope.homeDirectory, name);
      }

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

        if (isZip(file.name)) {
          reader.readAsBinaryString(file);
        } else {
          reader.readAsText(file);
        }

        return deferred.promise;
      }
    });
})();
