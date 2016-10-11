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

      function dereferenceJsons(raml) {
        return $q.when().then(function () {
          var promises = [];

          jsTraverse.traverse(raml).forEach(function (value) {
            if (this.path.slice(-2).join('.') === 'body.application/json') {
              var jsonSchema;
              if (value.schema) {
                jsonSchema = value.schema;
              } else if (value.type) {
                jsonSchema = value.type;
              }

              if (Array.isArray(jsonSchema)) {
                jsonSchema = jsonSchema[0];
              }

              try {
                promises.push(refParser.dereference(JSON.parse(jsonSchema), {$refs: {read$Ref: read$Ref}})
                  .then(JSON.stringify)
                  .then(function (schema) {
                    value.schema = schema;
                  })
                );
              } catch (e) {
                // If jsonSchema can't be parser, it's not a JSON string. Ignore it.
              }
            }
          });

          return $q.all(promises);
        });
      }


      function retrieveType(raml, typeName) {
        if (!raml.types) { return; }

        var object = raml.types.filter(function (type) { return type[typeName]; })[0];
        return object ? object[typeName] : object;
      }


      function replaceTypeIfExists(raml, type, value) {
        var expandedTypeIsDefined = retrieveType(raml, type);
        if (expandedTypeIsDefined) {
          for (var key in expandedTypeIsDefined) {
            if (expandedTypeIsDefined.hasOwnProperty(key)) {
              if (['example', 'examples'].includes(key) && value[key]) { return; }
              value[key] = expandedTypeIsDefined[key];
            }
          }
        }
      }

      function dereferenceTypes(raml) {
        jsTraverse.traverse(raml).forEach(function (value) {
          if (this.path.slice(-2).join('.') === 'body.application/json' && value.type) {
            var type = value.type[0];
            replaceTypeIfExists(raml, type, value);
          }
        });

      }

      function extractArrayType(arrayNode) {
        if(arrayNode.items.type) { return arrayNode.items.type[0]; }
        return arrayNode.items;
      }

      function isNotObject(value) { return value === null || typeof value !== 'object'; }

      function dereferenceTypesInArrays(raml) {
        jsTraverse.traverse(raml).forEach(function (value) {
          if (this.path.slice(-2).join('.') === 'body.application/json' && value.type && value.type[0] === 'array') {
            var type = extractArrayType(value);
            if (isNotObject(value.items)) { value.items = {}; }
            replaceTypeIfExists(raml, type, value.items);

            if (!value.examples && !value.example) { generateArrayExampleIfPosible(value); }
          }
        });

      }

      function generateArrayExampleIfPosible(arrayNode) {
        var examples = getExampleList(arrayNode.items);
        if (examples.length === 0 ) { return; }

        arrayNode.example = examples;
      }

      function getExampleList(node) {
        if(node.examples) {
          return node.examples.map(function (example) {
            return example.structuredValue;
          });
        }
        if(node.example) { return [node.example]; }

        return [];
      }

      function dereference(raml) {
        dereferenceTypes(raml);
        dereferenceTypesInArrays(raml);
        return dereferenceJsons(raml);
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
