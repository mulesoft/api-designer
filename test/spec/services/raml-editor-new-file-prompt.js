describe('ramlEditorNewFilePrompt', function() {
  'use strict';

  var sandbox, fileList, newFilePrompt;

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

  beforeEach(inject(function($rootScope, $injector, ramlEditorNewFilePrompt) {
    sandbox = sinon.sandbox.create();
    fileList = $injector.get('fileList');
    newFilePrompt = ramlEditorNewFilePrompt;
  }));

  afterEach(function() {
    fileList = newFilePrompt = undefined;
    sandbox.restore();
  });

  describe('by default', function() {
    var promptSpy;

    beforeEach(function() {
      promptSpy = sandbox.stub(window, 'prompt');
      fileList.files = [createMockFile('file1'), createMockFile('file2')];
    });

    it('prompts user for filename', function() {
      newFilePrompt.open();

      promptSpy.should.have.been.calledWith('Name your file:');
    });

    describe('upon choosing a name', function() {
      beforeEach(function() {
        promptSpy.returns('MyFile.raml');
      });

      it('creates the file using fileList', function() {
        var newFileSpy = sandbox.spy(fileList, 'newFile');
        newFilePrompt.open();

        newFileSpy.should.have.been.calledWith('MyFile.raml');
      });

      describe('when the name is already taken (case-insensitive)', function() {
        var alertSpy, newFileSpy;

        beforeEach(function() {
          alertSpy = sandbox.stub(window, 'alert');
          newFileSpy = sandbox.spy(fileList, 'newFile');
          fileList.files.push(createMockFile('MYFILE.raml', { contents: 'my content' }));

          newFilePrompt.open();
        });

        it('alerts the user', function() {
          alertSpy.should.have.been.calledWith('That filename is already taken.');
        });

        it('does not create a new file', function() {
          newFileSpy.should.not.have.been.called;
        });
      });
    });

    describe('upon cancellation', function() {
      var newFileSpy;

      beforeEach(function() {
        newFileSpy = sandbox.spy(fileList, 'newFile');
        promptSpy.returns(null);

        newFilePrompt.open();
      });

      it('does not add a file', function() {
        newFileSpy.should.not.have.been.called;
      });
    });

    describe('suggested filename', function() {
      it('defaults to Untitled-1.raml first', function() {
        newFilePrompt.open();
        promptSpy.should.have.been.calledWith(sinon.match.any, 'Untitled-1.raml');
      });

      it('does not increment the filename if you cancel', function() {
        promptSpy.returns(null);
        newFilePrompt.open();
        newFilePrompt.open();
        promptSpy.should.have.been.calledWith(sinon.match.any, 'Untitled-1.raml');
      });

      it('defaults to Untitled-2.raml second', function() {
        promptSpy.returns('Untitled-1.raml');
        newFilePrompt.open();
        promptSpy.returns('the-name-i-actually-give-the-second-file.raml');
        newFilePrompt.open();
        promptSpy.should.have.been.calledWith(sinon.match.any, 'Untitled-2.raml');
      });

      describe('given an existing Untitled-6.raml', function() {
        beforeEach(function() {
          fileList.files = [createMockFile('file2'), createMockFile('Untitled-6.raml'), createMockFile('Zebras')];
        });

        it('it defaults to Untitled-7.raml', function() {
          newFilePrompt.open();
          promptSpy.should.have.been.calledWith(sinon.match.any, 'Untitled-7.raml');
        });
      });
    });
  });
});
