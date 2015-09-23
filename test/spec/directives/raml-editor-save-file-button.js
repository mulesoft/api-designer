describe('ramlEditorSaveFileButton', function() {
  'use strict';

  var scope, el, sandbox, ramlRepository, eventEmitter;

  function compileSaveFileButton() {
    el = compileTemplate('<raml-editor-save-file-button></raml-editor-save-file-button>', scope);
  }

  function clickSaveFileButton() {
    angular.element(el[0].querySelector('[role="save-button"]')).triggerHandler('click');
  }

  beforeEach(module('ramlEditorApp'));

  beforeEach(inject(function($rootScope, $injector) {
    eventEmitter      = $injector.get('eventEmitter');
    sandbox           = sinon.sandbox.create();
    scope             = $rootScope.$new();
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

    beforeEach(inject(function() {
      broadcastSpy = sandbox.spy(eventEmitter, 'publish');
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

      // it('broadcasts an event', function() {
      //   broadcastSpy.should.have.been.calledWith('event:notification', {
      //     message: 'File saved.',
      //     expires: true
      //   });
      // });
    });
  });
});
