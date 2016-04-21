(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .factory('ramlEditorMainHelpers', function ramlEditorMainHelpers() {
      return {
        isRamlFile:      isRamlFile,
        isApiDefinition: isApiDefinition,
        isOverlay:       isOverlay
      };

      // ---

      function isRamlFile(extension) {
        return extension === 'raml';
      }

      function isApiDefinition(raml) {
        return /^#%RAML\s(0\.8|1\.0)(\s*|$)/.test(raml);
      }

      function isOverlay(raml) {
        return /^#%RAML\s1\.0\sOverlay(\s*|$)/.test(raml);
      }
    })
  ;
})();
