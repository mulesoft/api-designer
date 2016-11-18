describe('ramlEditorNewFileMenu', function() {
  'use strict';

  var scope, el, sandbox, newFile;

  function compileNewFileButton() {
    el = compileTemplate('<raml-editor-new-file-menu></raml-editor-new-file-menu>', scope);
  }

  function clickNew08FileButton() {
    angular.element(el[0].querySelector('[role="new-raml-0.8"]')).triggerHandler('click');
  }

  angular.module('newFileMenuTest', ['ramlEditorApp', 'testFs']);
  beforeEach(module('newFileMenuTest'));

  beforeEach(inject(function($rootScope, ramlRepository, newFileService) {
    sandbox = sinon.sandbox.create();
    scope = $rootScope.$new();
    scope.homeDirectory = ramlRepository.getByPath('/');
    newFile = newFileService;
  }));

  afterEach(function() {
    scope.$destroy();
    el = scope = newFile = undefined;
    sandbox.restore();
  });

  describe('create new file', function() {
    var promptNewFileSpy;

    beforeEach(function() {
      promptNewFileSpy = sandbox.stub(newFile, 'prompt').returns(promise.resolved());
      compileNewFileButton();
    });

    it('new raml 0.8', function() {
      clickNew08FileButton();
      promptNewFileSpy.should.have.been.called;
    });
  });
});
