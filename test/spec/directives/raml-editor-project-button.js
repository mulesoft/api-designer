describe('ramlEditorProjectButton', function() {
  'use strict';

  var scope, editor, sandbox, submenuService, newFolderService;

  function compileProjectButton() {
    editor = compileTemplate('<raml-editor-project-button></raml-editor-project-button>', scope);
  }

  function findElement(selector) {
    return angular.element(editor[0].querySelector(selector));
  }

  function openProjectMenu() {
    findElement('[role="project-button"]').triggerHandler('click');
  }

  function isFileMenuOpened() {
    return scope.showFileMenu;
  }

  function openNewFileSubMenu() {
    findElement('[role="new-file"]').triggerHandler('mouseenter');
  }

  function closeNewFileSubMenu() {
    findElement('[role="new-file"]').triggerHandler('mouseleave');
  }

  function openExportSubMenu() {
    angular.element(editor.children()[1].querySelector('[ng-mouseenter="openExportMenu()"]')).triggerHandler('mouseenter');
  }

  function projectItem(name) {
    return Array.prototype.slice.call(editor.find('a')).filter(function(child) {
      return child.text.indexOf(name) !== -1;
    })[0];
  }

  function hasNewFolderItem() {
    return projectItem('New Folder') != null;
  }

  function hasSaveItem() {
    return projectItem('Save') != null;
  }

  function hasSaveAllItem() {
    return projectItem('Save All') != null;
  }

  function hasImportItem() {
    return projectItem('Import') != null;
  }

  beforeEach(module('ramlEditorApp'));

  beforeEach(inject(function($rootScope, $injector) {
    sandbox = sinon.sandbox.create();
    scope = $rootScope.$new();
    scope.xOasExport = true;
    submenuService = $injector.get('subMenuService');
    newFolderService =  $injector.get('newFolderService');
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

  describe('menu items', function() {
    beforeEach(inject(function () {
      compileProjectButton();
    }));

    it('new file submenu is an item', function() {
      sinon.spy(submenuService, 'openSubMenu');

      openNewFileSubMenu();
      isFileMenuOpened().should.be.true;
      submenuService.openSubMenu.should.have.been.called;

      closeNewFileSubMenu();
      isFileMenuOpened().should.be.false;
    });

    it('new folder is an item', function() {
      hasNewFolderItem().should.be.true;
    });

    it('save is an item', function() {
      hasSaveItem().should.be.true;
    });

    it('save all is an item', function() {
      hasSaveAllItem().should.be.true;
    });

    it('import is an item', function() {
      hasImportItem().should.be.true;
    });

    it('export menu is an item', function() {
      sinon.spy(submenuService, 'openSubMenu');

      openExportSubMenu();
      submenuService.openSubMenu.should.have.been.called;
    });
  });
});
