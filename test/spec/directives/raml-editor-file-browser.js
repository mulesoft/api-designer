describe('ramlEditorFileBrowser', function() {
  'use strict';

  var scope, el, sandbox, ramlRepository;

  function createMockFile(name, options) {
    options = options || {};

    return {
      name: name,
      dirty: !!options.dirty,
      contents: options.contents
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
    scope.$destroy();
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
        promptSpy.should.have.been.calledWith(sinon.match.any, 'Untitled-1.raml');
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

  describe('when a new file is created', function() {
    beforeEach(inject(function($rootScope) {
      compileFileBrowser();
      $rootScope.$broadcast('event:raml-editor-new-file', createMockFile('filenameOfTheNewFile'));
      scope.$digest();
    }));

    it('selects the file', function() {
      scope.fileBrowser.selectedFile.name.should.equal('filenameOfTheNewFile');
    });
  });

  describe('saving a file', function() {
    var saveSpy;

    beforeEach(function() {
      ramlRepository.files = [createMockFile('file1'), createMockFile('file2')];
      compileFileBrowser();
      var fileToSave = el[0].querySelectorAll('[role="file-name"]')[1];
      angular.element(fileToSave).triggerHandler('click');
      saveSpy = sandbox.spy(ramlRepository, 'saveFile');
    });

    it('calls saveFile passing the selected file', function() {

      el[0].querySelector('[role="save-button"]').click();

      saveSpy.should.have.been.calledWith(ramlRepository.files[1]);
    });

    it('saves when meta-s is pressed', function() {
      var event = document.createEvent('Events');

      event.initEvent('keydown', true, true);

      event.keyCode = 83;
      event.which = 83;
      event.metaKey = true;

      document.dispatchEvent(event);
      saveSpy.should.have.been.calledWith(ramlRepository.files[1]);
    });
  });

  describe('file list', function() {
    it('displays', function() {
      ramlRepository.files = [createMockFile('file1'), createMockFile('file2')];
      compileFileBrowser();

      scope.homeDirectory.files.length.should.equal(2);
      scope.homeDirectory.files[0].name.should.equal('file1');
      scope.homeDirectory.files[1].name.should.equal('file2');

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
