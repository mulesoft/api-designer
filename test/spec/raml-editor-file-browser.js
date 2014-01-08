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

  function compileFileBrowser() {
    el = compileTemplate('<raml-editor-file-browser></raml-editor-file-browser>', scope);
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
    compileFileBrowser();

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
      compileFileBrowser();
      clickNewFileButton();
      promptSpy.should.have.been.calledWith('Name your file:');
    });

    describe('upon choosing a name', function() {
      beforeEach(function() {
        promptSpy.returns('MyFile.raml');
      });

      it('adds the file to the list', function() {
        compileFileBrowser();
        clickNewFileButton();
        scope.fileBrowser.files.length.should.equal(3);
      });
    });

    describe('upon cancellation', function() {
      beforeEach(function() {
        promptSpy.returns(null);
      });

      it('does not add a file', function() {
        compileFileBrowser();
        clickNewFileButton();
        scope.fileBrowser.files.length.should.equal(2);
      });
    });

    describe('suggested filename', function() {
      it('defaults to Untitled-1.raml first', function() {
        compileFileBrowser();
        clickNewFileButton();
        promptSpy.should.have.been.calledWith(sinon.match.any, 'Untitled-1.raml');
      });

      it('does not increment the filename if you cancel', function() {
        compileFileBrowser();
        promptSpy.returns(null);
        clickNewFileButton();
        clickNewFileButton();
        promptSpy.should.have.been.calledWith(sinon.match.any, 'Untitled-1.raml');
      });

      it('defaults to Untitled-2.raml second', function() {
        compileFileBrowser();
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
          compileFileBrowser();
          clickNewFileButton();
          promptSpy.should.have.been.calledWith(sinon.match.any, 'Untitled-7.raml');
        });
      });
    });
  });

  describe('clicking a file', function() {
    var fileToClick;

    beforeEach(function() {
      ramlRepository.files = [createMockFile('file1'), createMockFile('file2')];
      compileFileBrowser();
      fileToClick = el[0].querySelectorAll('[role="file-name"]')[1];

      sandbox.spy(ramlRepository, 'loadFile');
    });

    describe('by default', function() {
      beforeEach(function() {
        angular.element(fileToClick).triggerHandler('click');
      });

      it('updates selectedFile to the file clicked', function() {
        scope.fileBrowser.selectedFile.name.should.equal('file2');
      });

      it('adds the "currentfile" class to the file clicked', function() {
        fileToClick.classList.contains('currentfile').should.be.true;
      });

      it('removes the "currentfile" class from all other files', function() {
        el[0].querySelectorAll('.currentfile').length.should.equal(1);
      });
    });

    describe('when the file is not loaded', function() {
      it('loads the file content', function() {
        angular.element(fileToClick).triggerHandler('click');
        ramlRepository.loadFile.should.have.been.called;
      });
    });

    describe('when the file is loaded', function() {
      beforeEach(function() {
        ramlRepository.files[1].contents = 'raml';
        angular.element(fileToClick).triggerHandler('click');
      });

      it('does not load the file content', function() {
        ramlRepository.loadFile.should.not.have.been.called;
      });
    });
  });
});
