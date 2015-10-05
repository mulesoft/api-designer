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
    'cfp.hotkeys',
    'firebase'
  ])
    .run(function ($window, hotkeys) {
      // Adding proxy settings for api console
      $window.RAML.Settings.proxy = '/proxy/';

      hotkeys.add({
        combo: 'mod + /',
        description: 'Toggle Comment'
      });
      hotkeys.add({
        combo: 'mod + Ctrl + down',
        description: 'Swap line down'
      });
      hotkeys.add({
        combo: 'mod + Ctrl + up',
        description: 'Swap line up'
      });
      hotkeys.add({
        combo: 'mod + D',
        description: 'Select next occurrence'
      });
      hotkeys.add({
        combo: 'mod + E',
        description: 'Extract to'
      });
      hotkeys.add({
        combo: 'mod + K mod + K',
        description: 'Delete line right'
      });
      hotkeys.add({
        combo: 'mod + K mod + L',
        description: 'Down case at cursor'
      });
      hotkeys.add({
        combo: 'mod + K mod + U',
        description: 'Up case at cursor'
      });
      hotkeys.add({
        combo: 'mod + L',
        description: 'Select line'
      });
      hotkeys.add({
        combo: 'mod + P',
        description: 'Show global search'
      });
      hotkeys.add({
        combo: 'mod + S',
        description: 'Save current file'
      });
      hotkeys.add({
        combo: 'shift + mod + S',
        description: 'Save All'
      });
      hotkeys.add({
        combo: 'Ctrl + Space',
        description: 'Start autocomplete'
      });
      hotkeys.add({
        combo: 'shift + Alt + down',
        description: 'Select lines downward'
      });
      hotkeys.add({
        combo: 'shift + Alt + up',
        description: 'Select lines upward'
      });
      hotkeys.add({
        combo: 'shift + mod + D',
        description: 'Duplicate line'
      });
      // hotkeys.add({
      //   combo: 'shift + Ctrl + T',
      //   description: 'toggleTheme'
      // });
      hotkeys.add({
        combo: 'shift + Tab',
        description: 'Indent less'
      });

      // hotkeys.del('?');
    })
  ;
})();
