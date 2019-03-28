(function () {
  'use strict';

  angular.module('ramlEditorApp', [
    // angular-ui
    'ui.bootstrap.modal',
    'ui.bootstrap.tpls',
    'ui.tree',

    // console
    'ramlConsoleApp',

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
  ]);
})();
