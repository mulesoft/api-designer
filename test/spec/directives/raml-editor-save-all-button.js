describe('ramlEditorSaveAllFilesButton', function() {
  'use strict';

  var scope, el, sandbox, ramlRepository;

  function compileSaveFileButton() {
    el = compileTemplate('<raml-editor-save-all-button></raml-editor-save-all-button>', scope);
  }

  function clickSaveAllFileButton() {
    el.triggerHandler('click');
  }

  beforeEach(module('ramlEditorApp'));

  beforeEach(inject(function($rootScope, $injector) {
    sandbox = sinon.sandbox.create();
    scope = $rootScope.$new();
    scope.fileBrowser = {
      selectedFile: {
        path: '/myFile.raml',
        contents: 'some content',
        dirty: true
      }
    };
    scope.homeDirectory = {
      children: [scope.fileBrowser.selectedFile],
      forEachChildDo: function(action) {
        for (var i = 0; i < this.children.length; i++) {
          action.call(this.children[i], this.children[i]);
        }
      }
    };

    var ramlRepositoryElements = $injector.get('ramlRepositoryElements');
    ramlRepository = $injector.get('ramlRepository');
    ramlRepository.rootFile = new ramlRepositoryElements.RamlDirectory('/', {}, scope.homeDirectory.children);
  }));

  afterEach(function() {
    scope.$destroy();
    el = scope = undefined;
    sandbox.restore();
  });

  describe('on "Save all" click', function() {
    var saveFileSpy, rootScope;

    beforeEach(inject(function($rootScope) {
      rootScope = $rootScope;
      saveFileSpy = sandbox.stub(ramlRepository, 'saveFile').returns(promise.resolved());
      compileSaveFileButton();
    }));

    describe('when ramlRepository successfully saves', function() {
      beforeEach(inject(function($rootScope) {
        clickSaveAllFileButton();
        $rootScope.$digest();
      }));

      it('broadcasts an event', function(done) {
        sandbox.stub(rootScope, '$broadcast', function (type, content) {
          rootScope.$broadcast.restore();

          type.should.be.equal('event:notification');
          content.message.should.be.equal('All files saved.');
          content.expires.should.be.true();

          done();
        });
      });
    });
  });
});

