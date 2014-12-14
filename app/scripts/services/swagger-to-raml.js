/* global swaggerToRamlObject, ramlObjectToRaml */
(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .service('swaggerToRAML', function swaggerToRAML($window, $q, $http) {
      var self  = this;
      var proxy = $window.RAML.Settings.proxy || '';

      function reader (filename, done) {
        return $http.get(filename, { transformResponse: false })
          .then(function (response) {
            return done(null, response.data);
          })
          .catch(function (err) {
            return done(new Error(err.data));
          });
      }

      self.convert = function convert(url) {
        var deferred = $q.defer();

        swaggerToRamlObject(proxy + url, reader, function (err, result) {
          if (err) {
            return deferred.reject(err);
          }

          try {
            return deferred.resolve(ramlObjectToRaml(result));
          } catch (e) {
            return deferred.reject(e);
          }
        });

        return deferred.promise;
      };

      return self;
    });
})();
