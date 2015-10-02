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

          eventEmitter.subscribe('event:editor:context', safeApplyWrapper($scope, function (data) {
            var context    = data.context;
            var cursor     = data.cursor;
            var scopes     = context.scopes;
            var resource   = scopes[cursor.line];
            var metadata;

            resource = '/'+resource.split('/').slice(1, 2);
            metadata = context.metadata[resource];

            if (metadata) {
              var raml = context.metadata[resource].raml.compiled;

              tryIt.securitySchemes = readSecuritySchemes(raml);
              tryIt.protocols       = raml.protocols;
              tryIt.enabled         = true;

              console.log(raml);

              // Initializing values
              tryIt.protocol       = tryIt.protocols[0];
              tryIt.securityScheme = 'Anonymous';
            } else {
              tryIt.current = null;
              tryIt.raml    = null;
            }
          }));

          // Init
          tryIt.enabled        = false;

          // Events

          $scope.tryIt = tryIt;
        }
      };
    });
})();
