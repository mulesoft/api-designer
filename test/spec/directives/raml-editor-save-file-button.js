describe('ramlEditorSaveFileButton', function() {
  'use strict';

  var scope, el, sandbox, ramlRepository;

  function compileSaveFileButton() {
    el = compileTemplate('<raml-editor-save-file-button></raml-editor-save-file-button>', scope);
  }

  function compileSaveAllFileButton() {
    el = compileTemplate('<raml-editor-save-all-button></raml-editor-save-all-button>', scope);
  }

  function clickSaveFileButton() {
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
        for (var i = 0, len = this.children.length; i < len; i++) {
          action.call(this.children[i], this.children[i]);
        }
      }
    };

    ramlRepository = $injector.get('ramlRepository');
  }));

  afterEach(function() {
    scope.$destroy();
    el = scope = undefined;
    sandbox.restore();
  });


  describe('on click', function() {
    var saveFileSpy, broadcastSpy;

    beforeEach(inject(function($rootScope) {
      broadcastSpy = sandbox.spy($rootScope, '$broadcast');
      saveFileSpy = sandbox.stub(ramlRepository, 'saveFile').returns(promise.resolved());
      compileSaveFileButton();
    }));

    it('calls saveFile on the ramlRepository', function() {
      clickSaveFileButton();
      ramlRepository.saveFile.should.have.been.calledWith(scope.fileBrowser.selectedFile);
    });

    describe('when ramlRepository successfully saves', function() {
      beforeEach(inject(function($rootScope) {
        clickSaveFileButton();
        $rootScope.$digest();
      }));

      it('broadcasts an event', function() {
        broadcastSpy.should.have.been.calledWith('event:notification', {
          message: 'File saved.',
          expires: true
        });
      });
    });
  });

  describe('on click save all', function() {
    var saveFileSpy, broadcastSpy, rootScope;

    beforeEach(inject(function($rootScope) {
      rootScope = $rootScope;
      broadcastSpy = sandbox.spy($rootScope, '$broadcast');
      saveFileSpy = sandbox.stub(ramlRepository, 'saveFile').returns(promise.resolved());
      compileSaveAllFileButton();
    }));

    it('calls saveFile on the ramlRepository', function() {
      clickSaveFileButton();
      ramlRepository.saveFile.should.have.been.calledWith(scope.fileBrowser.selectedFile);
    });

    it('is the same as event:save-all broadcast', function() {
      rootScope.$broadcast('event:save-all');
      ramlRepository.saveFile.should.have.been.calledWith(scope.fileBrowser.selectedFile);
    });

    describe('when ramlRepository successfully saves', function() {
      beforeEach(inject(function($rootScope) {
        clickSaveFileButton();
        $rootScope.$digest();
      }));

      it('broadcasts an event', function() {
        broadcastSpy.should.have.been.calledWith('event:notification', {
          message: 'All files saved.',
          expires: true
        });
      });
    });
  });
});
