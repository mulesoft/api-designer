describe('ramlEditorFileBrowser', function () {
  'use strict';

  var scope, el, sandbox, ramlRepository, config;

  function createMockFile(name, options) {
    options = options || {};

    return {
      type:      'file',
      name:      name,
      path:      '/' + name,
      dirty:     !!options.dirty,
      persisted: options.persisted || true,
      contents:  options.contents,
      root:      options.root
    };
  }

  function compileFileBrowser() {
    el = compileTemplate('<raml-editor-file-browser></raml-editor-file-browser>', scope);
    document.body.appendChild(el[0]);
  }

  angular.module('fileBrowserTest', ['ramlEditorApp', 'testFs']);
  beforeEach(module('fileBrowserTest'));

  beforeEach(inject(function ($rootScope, $injector) {
    sandbox        = sinon.sandbox.create();
    scope          = $rootScope.$new();
    ramlRepository = $injector.get('ramlRepository');
    config         = $injector.get('config');
  }));

  afterEach(function () {
    scope.$destroy();
    el = scope = ramlRepository = undefined;
    sandbox.restore();
    config.clear();
  });

  describe('initialization', function () {
    describe('by default', function () {
      describe('with a root file', function () {
        it('should set `rootFile` property to a root file', function () {
          var rootFile = createMockFile('api.raml', {root: true});

          ramlRepository.children = [rootFile];
          compileFileBrowser();

          scope.fileBrowser.should.have.property('rootFile', rootFile);
        });
      });

      describe('without a root file', function () {
        it('should not have `rootFile` property', function () {
          var rootFile = createMockFile('api.raml');

          ramlRepository.children = [rootFile];
          compileFileBrowser();

          scope.fileBrowser.should.not.have.property('rootFile');
        });
      });

      it('selects the first file', function () {
        ramlRepository.children = [createMockFile('firstFile'), createMockFile('lastFile')];
        sinon.stub(ramlRepository, 'getByPath').returns(undefined);
        compileFileBrowser();
        scope.fileBrowser.selectedFile.name.should.equal('firstFile');
      });
    });

    describe('with a previous file selected', function () {
      var getByPathStub;
      var fileToOpen;

      beforeEach(function () {
        ramlRepository.children = [createMockFile('lastFile'), createMockFile('firstFile')];
        fileToOpen = ramlRepository.children[0];
        getByPathStub = sinon.stub(ramlRepository, 'getByPath').returns(fileToOpen);

        config.set('currentFile', JSON.stringify({ name: fileToOpen.name, path: fileToOpen.path }));
        compileFileBrowser();
      });

      it('selects the previously selected file', function () {
        scope.fileBrowser.selectedFile.name.should.equal('lastFile');
        getByPathStub.should.have.been.calledWith(fileToOpen.path);
      });
    });

    describe('when there are no files', function () {
      var openStub;

      beforeEach(inject(function (newNameModal) {
        openStub = sinon.spy(newNameModal, 'open');
      }));

      it('prompts you to name a new file', inject(function ($timeout) {
        compileFileBrowser();

        $timeout.flush();

        openStub.should.have.been.called;
      }));
    });

    it('should prefer root file over first file as selected file', function () {
      var rootFile      = createMockFile('2.raml', {root: true});
      ramlRepository.children = [createMockFile('1.raml'), rootFile];

      sinon.stub(ramlRepository, 'getByPath').returns(undefined);

      compileFileBrowser();
      scope.fileBrowser.should.have.property('selectedFile', rootFile);
    });

    it('should prefer previously selected file over root and first files as selected file', function () {
      ramlRepository.children = [createMockFile('1.raml'), createMockFile('2.raml'), createMockFile('3.raml', {root: true})];
      var fileToOpen    = ramlRepository.children[0];
      var getByPathStub = sinon.stub(ramlRepository, 'getByPath').returns(fileToOpen);

      config.set('currentFile', JSON.stringify({ name: fileToOpen.name, path: fileToOpen.path }));
      compileFileBrowser();

      scope.fileBrowser.should.have.property('selectedFile', fileToOpen);
      getByPathStub.should.have.been.calledWith(fileToOpen.path);
    });
  });

  describe('clicking a file', function () {
    var fileToClick;

    beforeEach(function () {
      ramlRepository.children = [createMockFile('file1'), createMockFile('file2')];
      compileFileBrowser();
      fileToClick = el[0].querySelectorAll('.file-item')[1];

      sandbox.spy(ramlRepository, 'loadFile');
    });

    describe('by default', function () {
      beforeEach(function () {
        angular.element(fileToClick).triggerHandler('click');
      });

      it.skip('updates selectedFile to the file clicked', function () {
        scope.fileBrowser.selectedFile.name.should.equal('file2');
      });

      it.skip('updates the currentFile stored in config', function () {
        JSON.parse(config.get('currentFile')).name.should.equal('file2');
        JSON.parse(config.get('currentFile')).path.should.equal('/file2');
      });

      it('adds the "currentfile" class to the file clicked', function () {
        fileToClick.classList.contains('currentfile').should.be.true;
      });

      it('removes the "currentfile" class from all other files', function () {
        el[0].querySelectorAll('.currentfile').length.should.equal(1);
      });
    });

    describe('when the file is not loaded', function () {
      it('loads the file content', function () {
        angular.element(fileToClick).triggerHandler('click');
        ramlRepository.loadFile.should.have.been.called;
      });
    });

    describe('when the file is loaded', function () {
      beforeEach(function () {
        ramlRepository.children[1].loaded   = true;
        ramlRepository.children[1].contents = 'raml';
        angular.element(fileToClick).triggerHandler('click');
      });

      it.skip('does not load the file content', function () {
        ramlRepository.loadFile.should.not.have.been.called;
      });
    });
  });

  describe('opening the context menu', function () {
    var iconToClick;

    beforeEach(function () {
      ramlRepository.children = [createMockFile('file1'), createMockFile('file2')];
      sinon.stub(ramlRepository, 'getByPath').returns(ramlRepository.children[0]);
      compileFileBrowser();
      iconToClick = el[0].querySelectorAll('.file-item .fa-cog')[1];

      sandbox.spy(ramlRepository, 'loadFile');
    });

    describe('by default', function () {
      beforeEach(function () {
        scope.fileBrowser.selectedFile.name.should.equal('file1');
        iconToClick.dispatchEvent(events.click());
      });

      it('does not update the selectedFile', function () {
        scope.fileBrowser.selectedFile.name.should.equal('file1');
      });

      it('adds the "geared" class to the file clicked', function () {
        iconToClick.parentElement.classList.contains('geared').should.be.true;
      });

      it('opens the context menu', function () {
        var rect = el[0].querySelector('[role="context-menu"]').getBoundingClientRect();
        rect.height.should.be.greaterThan(0);
      });
    });
  });

  describe('when a new file is generated', function () {
    beforeEach(inject(function ($rootScope) {
      compileFileBrowser();
      $rootScope.$broadcast('event:raml-editor-file-generated', createMockFile('filenameOfTheNewFile'));
      scope.$digest();
    }));

    it('selects the file', function () {
      scope.fileBrowser.selectedFile.name.should.equal('filenameOfTheNewFile');
    });
  });

  describe('removing a file', function () {
    beforeEach(inject(function (ramlRepository) {
      ramlRepository.children.push(createMockFile('some.raml'));
      compileFileBrowser();
    }));

    describe('when it is the last file', function () {
      var openStub;

      beforeEach(inject(function ($rootScope, ramlRepository, newNameModal) {
        var removed = ramlRepository.children.pop();
        openStub = sinon.spy(newNameModal, 'open');

        $rootScope.$broadcast('event:raml-editor-file-removed', removed);
        scope.$digest();
      }));

      it('prompts the user to create a new file', inject(function ($timeout) {
        $timeout.flush();

        openStub.should.have.been.called;
      }));
    });

    describe('when it is the selected file', function () {
      beforeEach(inject(function ($rootScope) {
        var removed = scope.fileBrowser.selectedFile = createMockFile('old.raml');

        $rootScope.$broadcast('event:raml-editor-file-removed', removed);
        scope.$digest();
      }));

      it('selects the first file from the fileList', inject(function ($timeout) {
        $timeout.flush();

        scope.fileBrowser.selectedFile.name.should.equal('some.raml');
      }));
    });
  });

  describe('saving a file', function () {
    var saveSpy;

    beforeEach(function () {
      ramlRepository.children = [createMockFile('file1'), createMockFile('file2')];
      compileFileBrowser();
      var fileToSave = el[0].querySelectorAll('.file-item')[1];
      angular.element(fileToSave).triggerHandler('click');
      saveSpy = sandbox.spy(ramlRepository, 'saveFile');
    });

    it.skip('saves when meta-s is pressed', function () {
      var event = events.keydown(83, { metaKey: true});
      document.dispatchEvent(event);
      saveSpy.should.have.been.calledWith(ramlRepository.children[1]);
    });

    it.skip('saves when ctrl-s is pressed', function () {
      var event = events.keydown(83, { ctrlKey: true});
      document.dispatchEvent(event);
      saveSpy.should.have.been.calledWith(ramlRepository.children[1]);
    });
  });

  describe('file list', function () {
    it('displays', function () {
      ramlRepository.children = [createMockFile('file1'), createMockFile('file2')];
      compileFileBrowser();

      scope.homeDirectory.children.length.should.equal(2);
      scope.homeDirectory.children[0].name.should.equal('file1');
      scope.homeDirectory.children[1].name.should.equal('file2');

      el.text().should.contain('file1');
      el.text().should.contain('file2');
    });

    describe('dirty tracking', function () {
      it.skip('indicates unsaved files', function () {
        ramlRepository.children = [ createMockFile('dirty', { dirty : true }) ];
        compileFileBrowser();
        var file = el[0].querySelector('.file-item');
        file.classList.contains('dirty').should.be.true;
      });

      it('indicates saved files', function () {
        ramlRepository.children = [ createMockFile('saved') ];
        compileFileBrowser();
        var file = el[0].querySelector('.file-item');

        file.classList.contains('dirty').should.be.false;
      });

      it('marks the selected file dirty when its contents change', function () {
        var file = createMockFile('clean');
        ramlRepository.children = [file];
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
