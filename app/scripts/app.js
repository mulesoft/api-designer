'use strict';

angular.module('ramlEditorApp', ['ramlConsoleApp', 'helpers', 'raml', 'ngResource', 'ngSanitize', 'codeMirror', 'fs', 'utils', 'stringFilters'])
      .run(function () {
        window.RAML.Settings.proxy = '/proxy/';
      });
