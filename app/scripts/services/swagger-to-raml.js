(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .service('swaggerToRAML', function swaggerToRAML($window, $q, $http, importService, oasRamlConverter) {
      var self  = this;

      function replaceExtension (path, ext) {
        var index = path.lastIndexOf('.');
        if (index > -1) {
          path = path.substr(0, index);
        }
        return path + '.' + ext;
      }

      function ramlConverter () {
        return new oasRamlConverter.Converter(oasRamlConverter.Formats.OAS20, oasRamlConverter.Formats.RAML);
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

        function converte(files, name, deferred) {
          var content = files[name];

          // leave files that are not swagger unmodified
          if (!isSwaggerSpec(content)) {
            return deferred.resolve({name:name, content:content});
          }

          function toAbsolute(path) {
            return path.indexOf('http') !== 0 ? 'http://zip/' + path : path;
          }

          function toRelative(path) {
            return path.indexOf('http://zip/') === 0 ? path.substring('http://zip/'.length) : path;
          }

          // custom fileResolver to take in memory files from the zip
          var fsResolver = {
            canRead: function (url) {
              return this.read(url) != null;
            },
            read: function (url) {
              var path = toRelative(url.url);
              var content = files[path];
              if (!content) {
                throw new Error('Could not load content for file ' + path);
              }
              return content;
            }
          };

          // convert main swagger spec
          ramlConverter().convertFile(toAbsolute(name), {
            resolve: {
              file: fsResolver,
              http: fsResolver
            }
          }).then(function(convertedData) {
            deferred.resolve({name:replaceExtension(name, 'raml'), content:convertedData});
          }).catch(function(err) {
            deferred.reject(err);
          });
        }

        return importService.importZip(root, contents, converte);
      }

      self.url = function convert(url) {
        // fetch and convert single file
        var deferred = $q.defer();
        ramlConverter().convertFile(url).then(deferred.resolve).catch(deferred.reject);
        return deferred.promise;
      };

      self.file = function f(file) {
        var deferred = $q.defer();
        importService.readFile(file).then(function (content) {
          ramlConverter().convertData(content).then(deferred.resolve).catch(deferred.reject);
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
