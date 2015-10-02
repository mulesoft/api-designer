(function () {
  'use strict';

  (function () {
    angular.module('raml', [])
      .factory('ramlParser', function () {
        return RAML.Parser;
      });

    RAML.Settings = RAML.Settings || {};
  })();

  angular.module('ramlEditorApp', [
    // angular-ui
    'ui.bootstrap.modal',
    'ui.bootstrap.tpls',
    'ui.tree',

    // console
    // 'ramlConsoleApp',

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
    'dragAndDrop',
    'cfp.hotkeys'
  ])
    .run(function ($window, hotkeys) {
      // Adding proxy settings for api console
      $window.RAML.Settings.proxy = '/proxy/';

      hotkeys.add({
        combo: 'mod + p',
        description: 'Open global search'
      });

      hotkeys.add({
        combo: 'mod + s',
        description: 'Save current file'
      });

      hotkeys.add({
        combo: 'ctrl + space',
        description: 'Start autocomplete'
      });

      hotkeys.del('?');
    })
  ;
})();
