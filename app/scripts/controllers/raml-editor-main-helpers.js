(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .factory('ramlEditorMainHelpers', function ramlEditorMainHelpers() {
      return {
        isRamlFile:          isRamlFile,
        isApiDefinitionLike: isApiDefinitionLike
      };

      // ---

      function isRamlFile(extension) {
        return extension === 'raml';
      }

      function isApiDefinitionLike(raml) {
        return isApiDefinition(raml) || isOverlay(raml) || isExtension(raml);
      }

      // ---

      function isApiDefinition(raml) {
        return /^#%RAML\s(0\.8|1\.0)\s*$/.test(getFirstLine(raml));
      }

      function isOverlay(raml) {
        return /^#%RAML\s1\.0\sOverlay\s*$/.test(getFirstLine(raml));
      }

      function isExtension(raml) {
        return /^#%RAML\s1\.0\sExtension\s*$/.test(getFirstLine(raml));
      }

      function getFirstLine(raml) {
        return raml.split(/\r\n|\n/)[0];
      }
    })
  ;
})();
