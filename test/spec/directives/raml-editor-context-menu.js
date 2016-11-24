describe('ramlEditorContextMenu', function() {
  'use strict';

  var scope, el, sandbox, contextMenu, file;

  var createScope = inject(function createScope($rootScope) {
    scope = $rootScope.$new();
    scope.homeDirectory = { path: '/', children: [] };
    scope.registerContextMenu = function(cm) {
      contextMenu = cm;
    };
  });

  function compileContextMenu() {
    el = compileTemplate('<raml-editor-context-menu></raml-editor-context-menu>', scope);
    document.body.appendChild(el[0]);
  }

  function findLink(text) {
    return Array.prototype.slice.call(el.find('a')).filter(function(child) {
      return child.text.indexOf(text) !== -1;
    })[0];
  }

  function findListItem(text) {
    return Array.prototype.slice.call(el.find('li')).filter(function(child) {
      return angular.element(child).text().indexOf(text) !== -1;
    })[0];
  }

  angular.module('contextMenuTest', ['ramlEditorApp', 'testFs', 'utils']);
  beforeEach(module('contextMenuTest'));

  beforeEach(function() {
    sandbox = sinon.sandbox.create();

    createScope();
    compileContextMenu();
  });

  afterEach(function() {
    scope.$destroy();
    file = el = scope = contextMenu = undefined;
    sandbox.restore();
  });

  describe('when open', function() {
    var scrollDisableStub, scrollEnableStub, rectStub;

    beforeEach(inject(function(scroll) {
      var event = {
        stopPropagation: angular.noop,
        target: {
          getBoundingClientRect: angular.noop
        }
      };

      file = {
        name: 'filename.raml',
        path: '/filename.raml',
        parentPath: function() { return '/'; }
      };

      scrollDisableStub = sinon.stub(scroll, 'disable');
      scrollEnableStub = sinon.stub(scroll, 'enable');
      rectStub = sinon.stub(event.target, 'getBoundingClientRect').returns({
        left: 1,
        width: 2,
        top: 3,
        height: 4
      });

      contextMenu.open(event, file);
      scope.$digest();
    }));

    it('disables scroll', function() {
      scrollDisableStub.should.have.been.called;
    });

    describe('saving a file', function() {
      var saveFileSpy;

      beforeEach(inject(function(ramlRepository) {
        saveFileSpy = sinon.spy(ramlRepository, 'saveFile');
        var saveItem = findListItem('Save');

        saveItem.dispatchEvent(events.click());
      }));

      it('delegates to the ramlRepository', function() {
        saveFileSpy.should.have.been.calledWith(file);
      });
    });

    describe('removing a file', function() {
      var confirmStub, removeItem, removeItemStub;

      beforeEach(inject(function($window, confirmModal, ramlRepository) {
        removeItemStub = sandbox.stub(ramlRepository, 'remove');
        confirmStub = sandbox.stub(confirmModal, 'open');
        removeItem = findListItem('Delete');
      }));

      it('opens the confirmModal with the name of the file to delete', function() {
        confirmStub.returns(promise.stub());
        removeItem.dispatchEvent(events.click());

        confirmStub.should.have.been.calledWith('Are you sure you want to delete "' + file.name + '"?', 'Delete file',{closeButtonCssClass: 'btn-danger', closeButtonLabel: 'Delete' });
      });

      describe('upon success', function () {
        beforeEach(function () {
          confirmStub.returns(promise.resolved());
          removeItem.dispatchEvent(events.click());
        });

        it('removes the file in the ramlRepository', function() {
          removeItemStub.should.have.been.calledWith(file);
        });
      });

      describe('upon failure', function () {
        beforeEach(function () {
          confirmStub.returns(promise.rejected());
          removeItem.dispatchEvent(events.click());
        });

        it('does not remove the file', function() {
          removeItemStub.should.not.have.been.called;
        });
      });
    });

    describe('renaming', function() {
      var renameItem, renameFileStub, filenamePromptStub;

      beforeEach(function() {
        inject(function(ramlRepository, newNameModal) {
          renameFileStub = sandbox.stub(ramlRepository, 'rename');
          filenamePromptStub = sandbox.stub(newNameModal, 'open');
        });

        renameItem = Array.prototype.slice.call(el.children().children()).filter(function(child) {
          return angular.element(child).text().indexOf('Rename') !== -1;
        })[0];
      });

      it('opens the newNameModal with the file\'s current name', function() {
        filenamePromptStub.returns(promise.stub());
        renameItem.dispatchEvent(events.click());

        filenamePromptStub.should.have.been.calledWith('Enter a new name for this file:', 'filename.raml');
      });

      describe('upon success', function() {
        beforeEach(function() {
          filenamePromptStub.returns(promise.resolved('NewName.raml'));
          renameItem.dispatchEvent(events.click());
        });

        it('renames the file in the ramlRepository', function() {
          renameFileStub.should.have.been.calledWith(file, 'NewName.raml');
        });

      });

      describe('upon failure', function() {
        beforeEach(function() {
          filenamePromptStub.returns(promise.rejected());
          renameItem.dispatchEvent(events.click());
        });

        it('does not rename the file', function() {
          renameFileStub.should.not.have.been.called;
        });
      });
    });

    describe('closing', function() {
      it('closes when clicking on the page', function() {
        el[0].getBoundingClientRect().height.should.not.eql(0);
        document.body.dispatchEvent(events.click());
        el[0].getBoundingClientRect().height.should.eql(0);
      });

      it('closes on pressing escape', function() {
        var event = events.keydown(27);
        el[0].getBoundingClientRect().height.should.not.eql(0);
        el[0].dispatchEvent(event);
        el[0].getBoundingClientRect().height.should.eql(0);
      });

      it('enables scroll', function() {
        document.body.dispatchEvent(events.click());
        scrollEnableStub.should.have.been.called;
      });
    });
  });

  describe('when open on directory', function() {
    var scrollDisableStub, scrollEnableStub, rectStub;

    beforeEach(inject(function(scroll) {
      var event = {
        stopPropagation: angular.noop,
        target: {
          getBoundingClientRect: angular.noop
        }
      };

      file = {
        name: 'root.raml',
        path: '/filename.raml',
        isDirectory: true,
        parentPath: function() { return '/'; }
      };

      scrollDisableStub = sinon.stub(scroll, 'disable');
      scrollEnableStub = sinon.stub(scroll, 'enable');
      rectStub = sinon.stub(event.target, 'getBoundingClientRect').returns({
        left: 1,
        width: 2,
        top: 3,
        height: 4
      });

      contextMenu.open(event, file);

      scope.showFileMenu     = true;
      scope.showFragmentMenu = true;

      scope.$digest();
    }));

    it('disables scroll', function() {
      scrollDisableStub.should.have.been.called;
    });

    describe('removing a file', function() {
      var confirmStub, removeItem, removeItemStub;

      beforeEach(inject(function($window, confirmModal, ramlRepository) {
        removeItemStub = sandbox.stub(ramlRepository, 'remove');
        confirmStub = sandbox.stub(confirmModal, 'open');
        removeItem = findListItem('Delete');
      }));

      it('opens the confirmModal with the name of the file to delete', function() {
        confirmStub.returns(promise.stub());
        removeItem.dispatchEvent(events.click());

        confirmStub.should.have.been.calledWith('Are you sure you want to delete "' + file.name + '" and all its contents?', 'Delete folder',{closeButtonCssClass: 'btn-danger', closeButtonLabel: 'Delete' });
      });
    });

    describe('adding new file', function() {
      var promptStub, openSubmenuStub, newFile, subMenu;

      beforeEach(inject(function($window, confirmModal, newFileService, subMenuService) {
        promptStub = sandbox.stub(newFileService, 'prompt');
        openSubmenuStub = sandbox.stub(subMenuService, 'openSubMenu');
        newFile = newFileService;
        subMenu = subMenuService;
      }));

      it('new raml 0.8 file', function() {
        var newRaml = findLink('Raml 0.8 API Spec');
        newRaml.dispatchEvent(events.click());
        promptStub.should.have.been.called;
      });
    });

    describe('adding new folder', function() {
      var newFolderItem, promptStub;

      beforeEach(inject(function($window, newFolderService) {
        promptStub = sandbox.stub(newFolderService, 'prompt');
        newFolderItem = findListItem('New Folder');
      }));

      it('opens the confirmModal with the name of the file to delete', function() {
        newFolderItem.dispatchEvent(events.click());
        promptStub.should.have.been.called;
      });
    });

    describe('closing', function() {
      it('closes when clicking on the page', function() {
        el[0].getBoundingClientRect().height.should.not.eql(0);
        document.body.dispatchEvent(events.click());
        el[0].getBoundingClientRect().height.should.eql(0);
      });

      it('closes on pressing escape', function() {
        var event = events.keydown(27);
        el[0].getBoundingClientRect().height.should.not.eql(0);
        el[0].dispatchEvent(event);
        el[0].getBoundingClientRect().height.should.eql(0);
      });

      it('enables scroll', function() {
        document.body.dispatchEvent(events.click());
        scrollEnableStub.should.have.been.called;
      });
    });
  });
});
