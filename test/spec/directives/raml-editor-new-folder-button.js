describe('ramlEditorNewFolderButton', function() {
  'use strict';

  var scope, el, sandbox, newFolderService;

  function compileNewFolderButton() {
    el = compileTemplate('<raml-editor-new-folder-button></raml-editor-new-folder-button>', scope);
  }

  function clickNewFolderButton() {
    el.triggerHandler('click');
  }

  angular.module('newFolderButtonTest', ['ramlEditorApp', 'testFs', 'utils']);
  beforeEach(module('newFolderButtonTest'));

  beforeEach(inject(function($rootScope, $injector) {
    sandbox = sinon.sandbox.create();
    scope = $rootScope.$new();
    scope.fileBrowser = {
      selectedFile: {
        path: '/myFile.raml',
        contents: 'some content'
      }
    };
    scope.homeDirectory = { path: '/', children: [scope.fileBrowser.selectedFile] };

    newFolderService = $injector.get('newFolderService');
  }));

  afterEach(function() {
    scope.$destroy();
    el = scope = undefined;
    sandbox.restore();
  });


  describe('on click', function() {
    var prompt;

    beforeEach(inject(function() {
      prompt = sandbox.spy(newFolderService, 'prompt');
      compileNewFolderButton();
    }));

    it('new folder', function() {
      clickNewFolderButton();
      prompt.should.have.been.called;
    });
  });
});

