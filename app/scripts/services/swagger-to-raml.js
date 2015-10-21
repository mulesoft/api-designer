/* global swaggerToRamlObject, ramlObjectToRaml */
(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .service('swaggerToRAML', function swaggerToRAML($window, $q, $http, importService) {
      var self  = this;
      var proxy = $window.RAML.Settings.proxy || '';

      function reader (filename, done) {
        if (!/^https?\:\/\//.test(filename)) {
          return done(new Error('Invalid file location: ' + filename));
        }

        return $http.get(proxy + filename, { transformResponse: false })
          .then(function (response) {
            return done(null, response.data);
          })
          .catch(function (err) {
            return done(new Error(err.data));
          });
      }

      function parseResult (deferred) {
        return function (err, result) {
          if (err) {
            return deferred.reject(err);
          }

          try {
            return deferred.resolve(ramlObjectToRaml(result));
          } catch (e) {
            return deferred.reject(e);
          }
        };
      }

      self.convert = function convert(url) {
        var deferred = $q.defer();

        swaggerToRamlObject(url, reader, parseResult(deferred));

        return deferred.promise;
      };

      self.zip = function zip(file) {
        var deferred = $q.defer();

        if (!importService.isZip(file)) {
          deferred.reject(new Error('Invalid zip file'));
        } else {
          importService.readFile(file).then(function (contents) {
            var files = importService.parseZip(contents);

            swaggerToRamlObject.files(
              Object.keys(files),
              function (filename, done) {
                if (files.hasOwnProperty(filename)) {
                  return done(null, files[filename]);
                }

                return reader(filename, done);
              },
              parseResult(deferred)
            );
          });
        }

        return deferred.promise;
      };

      return self;
    });
})();
