describe('ramlEditorImportButton', function() {
  'use strict';

  var scope, el, sandbox, modal;

  function compileExportMenu() {
    el = compileTemplate('<raml-editor-import-button></raml-editor-import-button>', scope);
  }

  function clickImportFilesButton() {
    el.triggerHandler('click');
  }

  angular.module('importButtonTest', ['ramlEditorApp', 'testFs', 'utils']);
  beforeEach(module('importButtonTest'));

  beforeEach(inject(function($rootScope, importModal) {
    sandbox = sinon.sandbox.create();
    scope = $rootScope.$new();
    scope.fileBrowser = {};
    scope.fileBrowser.currentTarget = {
      path: '/mockFile.raml'
    };
    modal = importModal;
  }));

  afterEach(function() {
    scope.$destroy();
    el = scope  = undefined;
    sandbox.restore();
  });

  describe('import', function() {
    var importFiles;

    beforeEach(function() {
      importFiles = sandbox.stub(modal, 'open').returns(promise.resolved());
      compileExportMenu();
    });

    afterEach(function() {
      importFiles = undefined;
    });

    it('should open import modal', function() {
      clickImportFilesButton();
      importFiles.should.have.been.called;
    });
  });
});
