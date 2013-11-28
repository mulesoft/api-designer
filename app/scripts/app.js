'use strict';

angular.module('ramlEditorApp', ['ramlConsoleApp', 'helpers', 'raml', 'ngResource', 'ngSanitize', 'codeMirror', 'fs', 'utils', 'stringFilters'])
  .run(function ($window) {
    // Adding proxy settings for api console
    $window.RAML.Settings.proxy = '/proxy/';
  });
