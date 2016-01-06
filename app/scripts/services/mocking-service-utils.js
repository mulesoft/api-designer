(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .factory('mockingServiceUtils', function mockingServiceUtils(
      $q,
      jsTraverse,
      ramlRepository,
      refParser
    ) {
      return {
        dereference: dereference
      };

      // ---

      function dereference(raml) {
        return $q.when().then(function () {
          var promises = [];

          jsTraverse.traverse(raml).forEach(function (value) {
            if (this.path.slice(-2).join('.') === 'body.application/json' && value.schema) {
              promises.push(refParser.dereference(JSON.parse(value.schema), {$refs: {read$Ref: read$Ref}})
                .then(JSON.stringify)
                .then(function (schema) {
                  value.schema = schema;
                })
              );
            }
          });

          return $q.all(promises);
        });
      }

      // ---

      function read$Ref($ref) {
        var path = $ref.path[0] === '/' ? $ref.path : ('/' + $ref.path);
        var file = ramlRepository.getByPath(path);

        if (file) {
          return file.loaded ? $q.when(file) : ramlRepository.loadFile({path: path})
            .then(function (file) {
              return file.contents;
            })
          ;
        }

        return $q.reject('File with path "' + path + '" does not exist');
      }
    })
  ;
})();
