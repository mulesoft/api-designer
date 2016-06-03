/* global apiSpecConverter, ramlObjectToRaml */
(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .service('specConverter', function specConverter($q, importService) {
      var self = this;

      self.swaggerToRAML = function swaggerToRAML(file) {
        var deferred = $q.defer();

        if (!importService.isJson(file)) {
          deferred.reject(new Error('Input file should have .json extension'));
        } else {
          var swaggerToRamlConverter = new apiSpecConverter.Converter(
            apiSpecConverter.Formats.SWAGGER, apiSpecConverter.Formats.RAML);

          importService.readFile(file).then(function (contents) {
            swaggerToRamlConverter.loadData(contents).then(function () {
              swaggerToRamlConverter.convert('yaml')
                .then(function (convertedData) {
                  convertedData = convertedData.replace(/^(\s+)\'(.+)\'/gm, '$1$2');

                  var i, lines = convertedData.split('\n');

                  // Display names are conflicting with the new parser at method level
                  for (i = lines.length - 1; i >= 0; i--) {
                    if (lines[i].indexOf('displayName') !== -1) {
                      lines.splice(i, 1);
                    }
                  }

                  convertedData = lines.join('\n');
                  deferred.resolve(convertedData);
                })
                .catch(function () {
                  deferred.reject(new Error('Swagger 2.0 to RAML 0.8 converter failed unexpectedly'));
                })
              ;
            })
            .catch(function (err) {
              /*jshint camelcase: false */
              var reason = (err && err.problem_mark && err.message) ? ': Line #' + err.problem_mark.line + ' ' + err.message : '';
              deferred.reject(new Error('Error parsing Swagger 2.0 data' + reason));
            });
          });
        }
        return deferred.promise;
      };

      self.RAMLToSwagger = function RAMLToSwagger(ramlObject) {
        var deferred = $q.defer();

        var ramlDefinition = ramlObjectToRaml(ramlObject);

        var ramlToSwaggerConverter = new apiSpecConverter.Converter(
          apiSpecConverter.Formats.RAML, apiSpecConverter.Formats.SWAGGER);

        ramlToSwaggerConverter.loadData(ramlDefinition).then(function () {
          ramlToSwaggerConverter.convert('json')
            .then(function (convertedData) {
              deferred.resolve(convertedData);
            })
            .catch(function () {
              deferred.reject(new Error('RAML 0.8 to Swagger 2.0 converter failed unexpectedly'));
            });
        })
        .catch(function (err) {
          /*jshint camelcase: false */
          var reason = (err && err.problem_mark && err.message) ? ': Line #' + err.problem_mark.line + ' ' + err.message : '';
          deferred.reject(new Error('Error parsing RAML 0.8 data' + reason));
        });

        return deferred.promise;
      };

      return self;
    });
})();
