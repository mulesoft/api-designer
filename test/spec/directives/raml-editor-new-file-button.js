describe('ramlEditorNewFileButton', function() {
  'use strict';

  var scope, el, sandbox, newFilePrompt, repository;

  function compileNewFileButton() {
    el = compileTemplate('<raml-editor-new-file-button></raml-editor-new-file-button>', scope);
  }

  function clickNewFileButton() {
    angular.element(el[0].querySelector('[role="new-button"]')).triggerHandler('click');
  }

  angular.module('fileBrowserTest', ['ramlEditorApp', 'testFs']);
  beforeEach(module('fileBrowserTest'));

  beforeEach(inject(function($rootScope, ramlRepository, newNameModal) {
    sandbox = sinon.sandbox.create();
    scope = $rootScope.$new();
    scope.homeDirectory = ramlRepository.getByPath('/');
    scope.fileBrowser = {};
    scope.fileBrowser.currentTarget = {
      path: '/mockFile.raml'
    };
    newFilePrompt = newNameModal;
    repository = ramlRepository;
  }));

  afterEach(function() {
    scope.$destroy();
    el = scope = newFilePrompt = undefined;
    sandbox.restore();
  });

  describe('on success', function() {
    var promptOpenSpy;

    beforeEach(function() {
      repository.generateFile = sandbox.spy({
        then: function () {},
        catch: function () {}
      });
      promptOpenSpy = sandbox.stub(newFilePrompt, 'open').returns(promise.resolved('MyFile.raml'));

      compileNewFileButton();
      clickNewFileButton();
    });

    it.skip('delegates to the raml repository', function() {
      promptOpenSpy.should.have.been.called;

      repository.generateFile.should.have.been.calledWith(scope.homeDirectory, 'MyFile.raml');
    });
  });
});
