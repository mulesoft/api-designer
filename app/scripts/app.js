'use strict';

angular.module('ramlEditorApp',
  [
    // angular
    'ngResource',
    'ngSanitize',

    // angular-ui
    'ui.bootstrap.modal',
    'ui.bootstrap.tpls',

    // console
    'ramlConsoleApp',

    // project
    'codeMirror',
    'fs',
    'helpers',
    'raml',
    'stringFilters',
    'utils',
    'lightweightDOM',
    'splitter'
  ]
)
  .run(function ($window) {
    // Adding proxy settings for api console
    $window.RAML.Settings.proxy = '/proxy/';
  });
