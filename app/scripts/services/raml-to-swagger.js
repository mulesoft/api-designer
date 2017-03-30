(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .service('ramlToSwagger', function ramlToSwagger($q, $window, ramlRepository, ramlEditorMainHelpers, oasRamlConverter) {
      var self  = this;

      function findRootRaml (selectedFile) {
        if (selectedFile && ramlEditorMainHelpers.isApiDefinition(selectedFile.contents)) {
          return $q.when(selectedFile);
        }

        var defer = $q.defer();
        var rootDirectory = ramlRepository.getByPath('/');
        findRootRamlRecursive(rootDirectory, defer);
        return defer.promise;
      }

      function loadFile(file, defer) {
        (file.loaded ? $q.when(file) : ramlRepository.loadFile(file))
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

      function swaggerConverter (file) {
        var from = ramlEditorMainHelpers.isApiDefinitionV08(file.contents) ? oasRamlConverter.Formats.RAML08 : oasRamlConverter.Formats.RAML10;
        return new oasRamlConverter.Converter(from, oasRamlConverter.Formats.OAS);
      }

      function convertData(file, deferred, format) {
        var options = {
          format: format,
          fsResolver: {
            content: function content(path) {
              throw new Error('ramlParser: loadPath: loadApi: content: ' + path + ': no such path');
            },
            contentAsync: function contentAsync(path) {
              return ramlRepository.getContentByPath(path);
            }
          }
        };

        swaggerConverter(file).convertFile(file.path, options).then(function(result) {
          deferred.resolve({name: file.name, path: file.path, contents: result});
        }).catch(deferred.reject);
      }

      function toSwagger(format, selectedFile) {
        var deferred = $q.defer();

        findRootRaml(selectedFile).then(function (rootRaml) {
          convertData(rootRaml, deferred, format);
        }).catch(function (err) {
          deferred.reject(err);
        });

        return deferred.promise;
      }

      self.json = function json(selectedFile) {
        return toSwagger('json', selectedFile);
      };

      self.yaml = function yaml(selectedFile) {
        return toSwagger('yaml', selectedFile);
      };

      return self;
    });
})();
