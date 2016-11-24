describe('ramlEditorViewButton', function() {
  'use strict';

  var scope, el, sandbox, submenu;

  function compileViewButton() {
    el = compileTemplate('<raml-editor-view-button></raml-editor-view-button>', scope);
  }

  function clickOpenViewMenu() {
    angular.element(el[0].children[0]).triggerHandler('click');
  }

  function clickToChangeBackgroundColor() {
    angular.element(el[0].children[1].children[0].children[0]).triggerHandler('click');
  }

  angular.module('viewButtonTest', ['ramlEditorApp', 'testFs', 'utils']);
  beforeEach(module('viewButtonTest'));

  beforeEach(inject(function($rootScope, $injector, subMenuService) {
    sandbox = sinon.sandbox.create();
    scope = $rootScope.$new();
    scope.fileBrowser = {
      selectedFile: {
        path: '/myFile.raml',
        contents: 'some content'
      }
    };
    scope.theme = 'dark';
    submenu = subMenuService;
  }));

  afterEach(function() {
    scope.$destroy();
    el = scope = undefined;
    sandbox.restore();
  });


  describe('on click', function() {
    var open;

    beforeEach(inject(function() {
      open = sandbox.spy(submenu, 'open');
      compileViewButton();
    }));

    it('open menu', function() {
      clickOpenViewMenu();
      open.should.have.been.called;
    });

    it('change background color', function() {
      clickToChangeBackgroundColor();
    });
  });
});
