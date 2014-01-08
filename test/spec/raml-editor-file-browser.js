describe('ramlEditorFileBrowser', function() {
  'use strict';

  var scope, el, sandbox, ramlRepository;

  function clickNewFileButton() {
    el[0].querySelector('[role="new-button"]').click();
  }

  function createMockFile(name, options) {
    options = options || {};

    return {
      name: name,
      dirty: !!options.dirty
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
    el = scope = ramlRepository = undefined;
    sandbox.restore();
  });

  describe('when initialized', function() {
    it('selects the first file', function() {
      ramlRepository.files = [createMockFile('lastFile'), createMockFile('firstFile')];
      compileFileBrowser();
      scope.fileBrowser.selectedFile.name.should.equal('firstFile');
    });

    describe('when there are no files', function() {
      it('prompts you to name a new file', function() {
        var promptSpy;
        promptSpy = sandbox.stub(window, 'prompt');
        ramlRepository.files = [];
        compileFileBrowser();
        promptSpy.should.have.been.called;
      });
    });
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

      it('creates the file using ramlRepository', function() {
        var createSpy = sandbox.spy(ramlRepository, 'createFile');
        compileFileBrowser();
        clickNewFileButton();

        createSpy.should.have.been.calledWith('MyFile.raml');
      });

      it('adds the file to the list', function() {
        compileFileBrowser();
        clickNewFileButton();
        scope.fileBrowser.files.length.should.equal(3);
      });

      it('selects the file', function() {
        compileFileBrowser();
        clickNewFileButton();
        scope.fileBrowser.selectedFile.name.should.equal('MyFile.raml');
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

  describe('file list', function() {
    it('displays', function() {
      ramlRepository.files = [createMockFile('file1'), createMockFile('file2')];
      compileFileBrowser();

      scope.fileBrowser.files.length.should.equal(2);
      scope.fileBrowser.files[0].name.should.equal('file1');
      scope.fileBrowser.files[1].name.should.equal('file2');

      el.text().should.contain('file1');
      el.text().should.contain('file2');
    });

    describe('sorting', function() {
      beforeEach(function() {
        ramlRepository.files = [
          createMockFile('xFile'),
          createMockFile('yFile'),
          createMockFile('aFile'),
          createMockFile('bFile'),
          createMockFile('zFile')
        ];
        compileFileBrowser();
      });

      it('lists alphabetically', function() {
        var match = el.text().match(/(\wFile)/mg);
        match.should.deep.equal(['aFile', 'bFile', 'xFile', 'yFile', 'zFile']);
      });
    });

    describe('dirty tracking', function() {
      it('indicates unsaved files', function() {
        ramlRepository.files = [ createMockFile('dirty', { dirty : true }) ];
        compileFileBrowser();
        var file = el[0].querySelector('[role="file-name"]');
        file.classList.contains('dirty').should.be.true;
      });

      it('indicates saved files', function() {
        ramlRepository.files = [ createMockFile('saved') ];
        compileFileBrowser();
        var file = el[0].querySelector('[role="file-name"]');

        file.classList.contains('dirty').should.be.false;
      });

      it('marks the selected file dirty when its contents change', function() {
        var file = createMockFile('clean');
        ramlRepository.files = [file];
        compileFileBrowser();

        scope.fileBrowser.selectFile(file);
        scope.$digest();

        file.dirty.should.be.false;

        file.contents = 'dirty content';
        scope.$digest();

        file.dirty.should.be.true;
      });

    });
  });
});
