(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .service('swaggerToRAML', function swaggerToRAML($window, $q, $http, importService, apiSpecTransformer) {
      var self  = this;

      function replaceExtension (path, ext) {
        var index = path.lastIndexOf('.');
        if (index > -1) {
          path = path.substr(0, index);
        }
        return path + '.' + ext;
      }

      function ramlConverter () {
        return new apiSpecTransformer.Converter(apiSpecTransformer.Formats.SWAGGER, apiSpecTransformer.Formats.RAML10);
      }

      function doConvert (error, converter, deferred) {
        if (error) {
          deferred.reject(error);
        }

        try {
          converter.convert('yaml', function (err, result) {
            if (err) {
              return deferred.reject(err);
            }
            return deferred.resolve(result);
          });
        } catch (err) {
          deferred.reject(err);
        }
      }

      function convertData (content, deferred, options) {
        var converter = ramlConverter();
        converter.loadData(content, options).then(function(error) {
          doConvert(error, converter, deferred);
        }).catch(deferred.reject);
        return deferred;
      }

      function convertZip(root, contents) {

        var decimalRegexp = /^\d+\.\d+$/;
        var swaggerYamlRegexp = /swagger\s*:\s*"{0,1}\d+\.\d+"{0,1}/;
        function isSwaggerSpec(text) {
          try {
            var parsedData = JSON.parse(text);
            return decimalRegexp.test(parsedData.swagger);
          } catch (err) {
            // Possibly YAML Data
            return swaggerYamlRegexp.test(text);
          }
        }

        var converter = function(files, name, deferred) {
          var content = files[name];

          // leave files that are not swagger unmodified
          if (!isSwaggerSpec(content)) {
            return deferred.resolve({name:name, content:content});
          }

          // custom fileResolver to take in memory files from the zip
          var fileResolver = {
            canRead: function (path) {
              return this.read(path) != null;
            },
            read: function (path) {
              var url = path.url.replace(window.location.origin + '/', '');
              for (var filename in files) {
                if (files.hasOwnProperty(filename) && filename.indexOf(url) > -1) {
                  return files[filename];
                }
              }
              return null;
            }
          };

          // convert main swagger spec
          convertData(content, $q.defer(), {
            resolve: {
              file: fileResolver,
              http: fileResolver
            }
          }).promise.then(function(convertedData) {
            deferred.resolve({name:replaceExtension(name, 'raml'), content:convertedData});
          });

          return deferred.promise;
        };

        return importService.importZip(root, contents, converter);
      }

      self.url = function convert(url) {
        // fetch and convert single file
        var deferred = $q.defer();
        var converter = ramlConverter();
        try {
          converter.loadFile(url, function(error) {
            doConvert(error, converter, deferred);
          });
        } catch (err) {
          deferred.reject(err);
        }

        return deferred.promise;
      };

      self.file = function zip(file) {
        var deferred = $q.defer();
        importService.readFile(file).then(function (contents) {
          convertData(contents, deferred);
        }).catch(deferred.reject);
        return deferred.promise;
      };

      self.zip = function zip(rootDirectory, file) {
        var deferred = $q.defer();
        importService.readFile(file).then(function (contents) {
          convertZip(rootDirectory, contents).then(deferred.resolve).catch(deferred.reject);
        }).catch(deferred.reject);
        return deferred.promise;
      };

      return self;
    });
})();
