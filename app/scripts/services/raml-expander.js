(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .factory('ramlExpander', function mockingServiceUtils(
      $q,
      jsTraverse
    ) {
      return {
        expandRaml: expandRaml
      };

      // ---


      function retrieveType(raml, typeName) {
        if (!raml.types) { return; }

        var object = raml.types.filter(function (type) { return type[typeName]; })[0];
        return object ? object[typeName] : object;
      }


      function replaceTypeIfExists(raml, type, value) {
        var expandedType = retrieveType(raml, type);
        if (expandedType) {
          for (var key in expandedType) {
            if (expandedType.hasOwnProperty(key)) {
              if (['example', 'examples'].includes(key) && value[key]) { return; }
              value[key] = expandedType[key];
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

      function isNotObject(value) {
        return value === null || typeof value !== 'object';
      }

      function dereferenceTypesInArrays(raml) {
        jsTraverse.traverse(raml).forEach(function (value) {
          if (this.path.slice(-2).join('.') === 'body.application/json' && value.type && value.type[0] === 'array') {
            var type = extractArrayType(value);
            if (isNotObject(value.items)) { value.items = {}; }
            replaceTypeIfExists(raml, type, value.items);

            if (!value.examples && !value.example) { generateArrayExampleIfPossible(value); }
          }
        });

      }

      function generateArrayExampleIfPossible(arrayNode) {
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

      function expandRaml(raml) {
        dereferenceTypes(raml);
        dereferenceTypesInArrays(raml);
      }

    })
  ;
})();
