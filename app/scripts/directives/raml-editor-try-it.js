(function () {
  'use strict';

  // TODO: Extract to a different file
  String.prototype.titleize = function() {
    var words = this.split(' ');
    var array = [];

    for (var i = 0; i<words.length; ++i) {
      array.push(words[i].charAt(0).toUpperCase() + words[i].toLowerCase().slice(1));
    }

    return array.join(' ');
  };

  angular.module('ramlEditorApp')
    .directive('ramlEditorTryIt', function ramlEditorTryIt(
      eventEmitter,
      safeApplyWrapper
    ) {
      return {
        restrict:    'E',
        templateUrl: 'views/raml-editor-try-it.tmpl.html',
        controller:  function controller($scope) {
          var tryIt = this;

          function readSecuritySchemes(raml) {
            var schemes = {anonymous: {type: 'Anonymous', name: 'Anonymous'}};

            if (raml.securitySchemes) {
              raml.securitySchemes.forEach(function (scheme) {
                var key  = Object.keys(scheme)[0];
                var type = scheme[key].type;

                schemes[key]      = scheme[key];
                schemes[key].name = scheme[key].type;

                if(type.startsWith('x-')) {
                  schemes[key].name = key.replace(/_/g, ' ').titleize();
                }
              });
            }

            return schemes;
          }

          function readUriParameters(resource, uriParameters) {
            if (resource.uriParameters) {
              var parameters = angular.copy(resource.uriParameters);
              for(var key in parameters) {
                parameters.key = key;
              }
              uriParameters.push(parameters);
            }
          }

          function readResourceData(raml, path) {
            var relativePath = path.replace(/:/g, '').split('/');
            var resource, uriParameters = [];

            relativePath = relativePath.slice(1, relativePath.length);

            if (raml.resources) {
              var resources = raml.resources;

              for(var i=0; i < resources.length; i++) {
                if (resources[i].relativeUri === '/'+relativePath.shift()) {
                  resource = resources[i];
                  break;
                }
              }
            }

            readUriParameters(resource, uriParameters);

            relativePath.forEach(function (el) {
              var resources = resource.resources;

              if (resource && resource.resources) {
                for(var i=0; i < resources.length; i++) {
                  if (resources[i].relativeUri === '/'+el) {
                    resource = resources[i];
                    break;
                  }
                }

                readUriParameters(resource, uriParameters);
              }
            });

            resource = angular.copy(resource);
            resource.uriParameters = uriParameters;

            return resource;
          }

          eventEmitter.subscribe('event:editor:context', safeApplyWrapper($scope, function (data) {
            var context = data.context;
            var cursor  = data.cursor;
            var scopes  = context.scopes;
            var path    = scopes[cursor.line];
            var metadata, resource;

            resource = '/'+path.split('/').slice(1, 2);
            metadata = context.metadata[resource];

            if (metadata) {
              var raml = context.metadata[resource].raml.compiled;

              if (raml) {
                // Initializing values
                tryIt.securitySchemes = readSecuritySchemes(raml);
                tryIt.protocols       = raml.protocols;
                tryIt.resource        = readResourceData(raml, path);
                tryIt.enabled         = true;
                tryIt.protocol        = tryIt.protocols[0];
                tryIt.securityScheme  = 'Anonymous';
                tryIt.selectedMethod  = tryIt.resource.methods ? tryIt.resource.methods[0] : null;

              }
            } else {
              tryIt.current        = null;
              tryIt.raml           = null;
              tryIt.enabled        = false;
              tryIt.selectedMethod = null;
            }
          }));

          // Init
          tryIt.enabled        = false;
          tryIt.selectedMethod = null;

          // Events
          tryIt.selectMethod = function selectMethod(method) {
            tryIt.selectedMethod = method;
          };

          $scope.tryIt = tryIt;
        }
      };
    });
})();
