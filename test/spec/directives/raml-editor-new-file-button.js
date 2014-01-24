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

  beforeEach(inject(function($rootScope, ramlEditorFilenamePrompt) {
    sandbox = sinon.sandbox.create();
    scope = $rootScope.$new();
    scope.homeDirectory = { path: '/' };
    newFilePrompt = ramlEditorFilenamePrompt;
  }));

  afterEach(function() {
    scope.$destroy();
    el = scope = newFilePrompt = undefined;
    sandbox.restore();
  });

  describe('on success', function() {
    var promptOpenSpy;

    beforeEach(function() {
      scope.homeDirectory.createFile = sandbox.spy();
      promptOpenSpy = sandbox.stub(newFilePrompt, 'open').returns(promise.resolved('MyFile.raml'));

      compileNewFileButton();
      clickNewFileButton();
    });

    it('delegates to the raml repository', function() {
      promptOpenSpy.should.have.been.called;

      scope.homeDirectory.createFile.should.have.been.calledWith('MyFile.raml');
    });
  });
});
