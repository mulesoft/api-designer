describe('ramlEditorNewFileButton', function() {
  'use strict';

  var scope, el, sandbox, newFilePrompt;

  function compileNewFileButton() {
    el = compileTemplate('<raml-editor-new-file-button></raml-editor-new-file-button>', scope);
  }

  function clickNewFileButton() {
    angular.element(el[0].querySelector('[role="new-button"]')).triggerHandler('click');
  }

  angular.module('fileBrowserTest', ['ramlEditorApp', 'testFs']);
  beforeEach(module('fileBrowserTest'));

  beforeEach(inject(function($rootScope, ramlEditorNewFilePrompt) {
    sandbox = sinon.sandbox.create();
    scope = $rootScope.$new();
    newFilePrompt = ramlEditorNewFilePrompt;
  }));

  afterEach(function() {
    scope.$destroy();
    el = scope = newFilePrompt = undefined;
    sandbox.restore();
  });

  describe('by default', function() {
    var promptSpy;

    beforeEach(function() {
      promptSpy = sandbox.stub(newFilePrompt, 'open');
      compileNewFileButton();
      clickNewFileButton();
    });

    it('prompts user for filename', function() {
      promptSpy.should.have.been.called;
    });
  });
});
