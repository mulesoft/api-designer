(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .factory('ramlEditorMainHelpers', function ramlEditorMainHelpers() {
      return {
        isRamlFile:          isRamlFile,
        isApiDefinition:     isApiDefinition,
        isApiDefinitionV08:  isApiDefinitionV08,
        isApiDefinitionLike: isApiDefinitionLike
      };

      // ---

      function isRamlFile(extension) {
        return extension === 'raml';
      }

      function isApiDefinitionLike(raml) {
        return isApiDefinition(raml) || isTypedFragment(raml);
      }

      // ---

      function isApiDefinition(raml) {
        return /^#%RAML\s(0\.8|1\.0)\s*$/.test(getFirstLine(raml));
      }

      function isApiDefinitionV08(raml) {
        return /^#%RAML\s(0\.8)\s*$/.test(getFirstLine(raml));
      }

      function isTypedFragment(raml) {
        return /^#%RAML\s1\.0\s(Trait|ResourceType|Library|Overlay|Extension|DataType|DocumentationItem|NamedExample|AnnotationTypeDeclaration|SecurityScheme)\s*$/.test(getFirstLine(raml));
      }

      function getFirstLine(raml) {
        return raml.split(/\r\n|\n/)[0];
      }
    })
  ;
})();
