describe('ramlEditorRemoveFilePrompt', function() {
  'use strict';

  var sandbox, ramlRepository, removeFilePrompt;

  function createMockFile(name, options) {
    options = options || {};

    return {
      name: name,
      dirty: !!options.dirty,
      contents: options.contents
    };
  }

  angular.module('fileBrowserTest', ['ramlEditorApp', 'testFs']);
  beforeEach(module('fileBrowserTest'));

  beforeEach(inject(function($rootScope, $injector, ramlEditorRemoveFilePrompt) {
    sandbox = sinon.sandbox.create();
    ramlRepository = $injector.get('ramlRepository');
    removeFilePrompt = ramlEditorRemoveFilePrompt;
  }));

  afterEach(function() {
    ramlRepository = removeFilePrompt = undefined;
    sandbox.restore();
  });

  describe('by default', function() {
    var confirmSpy;

    beforeEach(function() {
      confirmSpy = sandbox.stub(window, 'confirm');
      ramlRepository.files = [createMockFile('file1'), createMockFile('file2')];
    });

    it('prompts user to confirm deletion', function() {
      removeFilePrompt.open(ramlRepository, ramlRepository.files[1]);

      confirmSpy.should.have.been.calledWith('Are you sure you want to delete "file2"?');
    });

    describe('upon confirmation', function() {
      beforeEach(function() {
        confirmSpy.returns(true);
      });

      it('removes the file using ramlRepository', function() {
        var fileToRemove = ramlRepository.files[1];
        var removeFileSpy = sandbox.spy(ramlRepository, 'removeFile');
        removeFilePrompt.open(ramlRepository, fileToRemove);

        removeFileSpy.should.have.been.calledWith(fileToRemove);
      });
    });

    describe('upon cancellation', function() {
      beforeEach(function() {
        confirmSpy.returns(false);
      });

      it('does not remove the file', function() {
        var removeFileSpy = sandbox.spy(ramlRepository, 'removeFile');
        removeFilePrompt.open(ramlRepository, ramlRepository.files[1]);

        removeFileSpy.should.not.have.been.called;
      });
    });
  });
});
