(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .service('ramlToSwagger', function ramlToSwagger($q, ramlRepository, ramlEditorMainHelpers, apiSpecTransformer) {
      var self  = this;

      function findRootRaml () {
        var defer = $q.defer();
        var rootDirectory = ramlRepository.getByPath('/');
        findRootRamlRecursive(rootDirectory, defer);
        return defer.promise;
      }

      function loadFile(file, defer) {
        (file.loaded ? $q.when(file) : ramlRepository.loadFile({path: file.path}))
          .then(function (loadedFile) {
            if (ramlEditorMainHelpers.isApiDefinition(loadedFile.contents)) {
              defer.resolve(loadedFile);
            }
          });
      }

      function findRootRamlRecursive (directory, defer) {
        for (var i = 0; i < directory.children.length; i++) {
          var child = directory.children[i];
          if (child.isDirectory) {
            findRootRamlRecursive(child, defer);
          } else {
            loadFile(child, defer);
          }
        }
      }

      function swaggerConverter () {
        return new apiSpecTransformer.Converter(apiSpecTransformer.Formats.RAML10, apiSpecTransformer.Formats.SWAGGER);
      }

      function doConvert (converter, file, format, deferred) {
        try {
          converter.convert(format, function (err, result) {
            if (err) {
              return deferred.reject(err);
            }
            return deferred.resolve({name: file.name, contents: result});
          });
        } catch (err) {
          deferred.reject(err);
        }
      }

      function convertData (file, format, deferred, options) {
        var converter = swaggerConverter();
        converter.loadData(file.contents, options).then(function() {
          doConvert(converter, file, format, deferred);
        }).catch(deferred.reject);
        return deferred;
      }

      function toSwagger(format) {
        var deferred = $q.defer();

        findRootRaml().then(function (rootRaml) {
          convertData(rootRaml, format, deferred);
        }).catch(function (err) {
          deferred.reject(err);
        });

        return deferred.promise;
      }

      self.json = function json() {
        return toSwagger('json');
      };

      self.yaml = function yaml() {
        return toSwagger('yaml');
      };

      return self;
    });
})();
