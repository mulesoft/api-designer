describe('ramlEditorSaveFileButton', function() {
  'use strict';

  var scope, el, sandbox, ramlRepository;

  function compileSaveFileButton() {
    el = compileTemplate('<raml-editor-save-file-button></raml-editor-save-file-button>', scope);
  }

  function clickSaveFileButton() {
    angular.element(el[0].querySelector('[role="save-button"]')).triggerHandler('click');
  }

  beforeEach(module('ramlEditorApp'));

  beforeEach(inject(function($rootScope, $injector) {
    sandbox = sinon.sandbox.create();
    scope = $rootScope.$new();
    scope.fileBrowser = {
      selectedFile: {
        path: '/myFile.raml',
        contents: 'some content'
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
});
