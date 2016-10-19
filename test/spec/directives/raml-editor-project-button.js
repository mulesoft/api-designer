describe('ramlEditorProjectButton', function() {
  'use strict';

  var scope, editor, sandbox, submenuService;

  function compileProjectButton() {
    editor = compileTemplate('<raml-editor-project-button></raml-editor-project-button>', scope);
  }

  function openProjectMenu() {
    angular.element(editor[0].querySelector('[role="project-button"]')).triggerHandler('click');
  }

  beforeEach(module('ramlEditorApp'));

  beforeEach(inject(function($rootScope, $injector) {
    sandbox = sinon.sandbox.create();
    scope = $rootScope.$new();
    submenuService = $injector.get('subMenuService');
  }));

  afterEach(function() {
    scope.$destroy();
    editor = scope = undefined;
    sandbox.restore();
  });


  describe('on click', function() {
    beforeEach(inject(function () {
      compileProjectButton();
    }));

    it('open project menu', function() {
      sinon.spy(submenuService, 'open');

      openProjectMenu();
      submenuService.open.should.have.been.called;
    });
  });
});
