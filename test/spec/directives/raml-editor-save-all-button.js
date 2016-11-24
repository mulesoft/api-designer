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

    ramlRepository = $injector.get('ramlRepository');
  }));

  afterEach(function() {
    scope.$destroy();
    el = scope = undefined;
    sandbox.restore();
  });

  describe('on save all click', function() {
    var saveFileSpy, broadcastSpy;

    beforeEach(inject(function($rootScope) {
      broadcastSpy = sandbox.spy($rootScope, '$broadcast');
      saveFileSpy = sandbox.stub(ramlRepository, 'saveFile').returns(promise.resolved());
      compileSaveFileButton();
    }));

    describe('when ramlRepository successfully saves', function() {
      beforeEach(inject(function($rootScope) {
        clickSaveAllFileButton();
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

