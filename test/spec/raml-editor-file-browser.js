describe('ramlEditorFileBrowser', function() {
  'use strict';

  var scope, el, sandbox, ramlRepository;

  function clickNewFileButton() {
    el[0].querySelector('[role="new-button"]').click();
  }

  function createMockFile(name) {
    return {
      name: name
    };
  }

  angular.module('fileBrowserTest', ['ramlEditorApp', 'testFs']);
  beforeEach(module('fileBrowserTest'));

  beforeEach(inject(function($rootScope, $injector) {
    sandbox = sinon.sandbox.create();
    scope = $rootScope.$new();
    ramlRepository = $injector.get('ramlRepository');
  }));

  afterEach(function() {
    sandbox.restore();
  });

  it('displays the file list', function() {
    ramlRepository.files = [createMockFile('file1'), createMockFile('file2')];
    el = compileTemplate('<raml-editor-file-browser></raml-editor-file-browser>', scope);

    scope.fileBrowser.files.length.should.equal(2);
    scope.fileBrowser.files[0].name.should.equal('file1');
    scope.fileBrowser.files[1].name.should.equal('file2');

    el.text().should.contain('file1');
    el.text().should.contain('file2');
  });

  describe('creating a new file', function() {
    var promptSpy;

    beforeEach(function() {
      promptSpy = sandbox.stub(window, 'prompt');
      ramlRepository.files = [createMockFile('file1'), createMockFile('file2')];
    });

    it('prompts user for filename', function() {
      el = compileTemplate('<raml-editor-file-browser></raml-editor-file-browser>', scope);
      clickNewFileButton();
      promptSpy.should.have.been.calledWith('Name your file:');
    });

    describe('upon choosing a name', function() {
      beforeEach(function() {
        promptSpy.returns('MyFile.raml');
      });

      it('adds the file to the list', function() {
        el = compileTemplate('<raml-editor-file-browser></raml-editor-file-browser>', scope);
        clickNewFileButton();
        scope.fileBrowser.files.length.should.equal(3);
      });
    });

    describe('upon cancellation', function() {
      beforeEach(function() {
        promptSpy.returns(null);
      });

      it('does not add a file', function() {
        el = compileTemplate('<raml-editor-file-browser></raml-editor-file-browser>', scope);
        clickNewFileButton();
        scope.fileBrowser.files.length.should.equal(2);
      });
    });

    describe('suggested filename', function() {
      it('defaults to Untitled-1.raml first', function() {
        el = compileTemplate('<raml-editor-file-browser></raml-editor-file-browser>', scope);
        clickNewFileButton();
        promptSpy.should.have.been.calledWith(sinon.match.any, 'Untitled-1.raml');
      });

      it('does not increment the filename if you cancel', function() {
        el = compileTemplate('<raml-editor-file-browser></raml-editor-file-browser>', scope);
        promptSpy.returns(null);
        clickNewFileButton();
        clickNewFileButton();
        promptSpy.should.have.been.calledWith(sinon.match.any, 'Untitled-1.raml');
      });

      it('defaults to Untitled-2.raml second', function() {
        el = compileTemplate('<raml-editor-file-browser></raml-editor-file-browser>', scope);
        promptSpy.returns('Untitled-1.raml');
        clickNewFileButton();
        clickNewFileButton();
        promptSpy.should.have.been.calledWith(sinon.match.any, 'Untitled-2.raml');
      });

      describe('given an existing Untitled-6.raml', function() {
        beforeEach(function() {
          ramlRepository.files = [createMockFile('file2'), createMockFile('Untitled-6.raml'), createMockFile('Zebras')];
        });

        it('it defaults to Untitled-7.raml', function() {
          el = compileTemplate('<raml-editor-file-browser></raml-editor-file-browser>', scope);
          clickNewFileButton();
          promptSpy.should.have.been.calledWith(sinon.match.any, 'Untitled-7.raml');
        });
      });
    });
  });
});
