(function () {
  'use strict';

  // Namespaces
  RAML.Settings = RAML.Settings || {
      proxy: false
  };

  angular.module('ramlEditorApp', [
    // angular-ui
    'ui.bootstrap.modal',
    'ui.bootstrap.tpls',
    'ui.tree',

    // project
    'codeMirror',
    'fs',
    'raml',
    'stringFilters',
    'utils',
    'lightweightDOM',
    'splitter',
    'validate',
    'autoFocus',
    'rightClick',
    'dragAndDrop'
  ])
    .run(function ($window, $location) {
      // Adding proxy settings for api console
      var disableProxy = $location.search().xDisableProxy === 'true';
      $window.RAML.Settings.proxy = disableProxy ? '' : '/proxy/';
    })
  ;
})();
