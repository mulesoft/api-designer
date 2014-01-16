describe('ramlEditorContextMenu', function() {
  'use strict';

  var scope, el, sandbox, contextMenu, file;

  function compileContextMenu() {
    el = compileTemplate('<raml-editor-context-menu></raml-editor-context-menu>', scope);
    document.body.appendChild(el[0]);
  }

  function contextMenuItemNamed(name) {
    return Array.prototype.slice.call(el.children().children()).filter(function(child) {
      return angular.element(child).text() === name;
    })[0];
  }

  angular.module('contextMenuTest', ['ramlEditorApp', 'testFs']);
  beforeEach(module('contextMenuTest'));

  beforeEach(inject(function($rootScope) {
    sandbox = sinon.sandbox.create();
    scope = $rootScope.$new();
    scope.registerContextMenu = function(cm) {
      contextMenu = cm;
    };

    compileContextMenu();
  }));

  afterEach(function() {
    scope.$destroy();
    file = el = scope = contextMenu = undefined;
    sandbox.restore();
  });

  describe('when open', function() {
    beforeEach(function() {
      var event = {
        stopPropagation: angular.noop,
        target: {}
      };
      file = {
        name: 'filename.raml'
      };
      contextMenu.open(event, file);
      scope.$digest();
    });

    describe('saving a file', function() {
      var saveFileSpy;

      beforeEach(inject(function(ramlRepository) {
        saveFileSpy = sinon.spy(ramlRepository, 'saveFile');
        var saveItem = contextMenuItemNamed('Save');

        saveItem.dispatchEvent(events.click());
      }));

      it('delegates to the ramlRepository', function() {
        saveFileSpy.should.have.been.calledWith(file);
      });
    });

    describe('removing a file', function() {
      var openStub;

      beforeEach(inject(function(ramlEditorRemoveFilePrompt) {
        openStub = sinon.stub(ramlEditorRemoveFilePrompt, 'open');
        var removeItem = contextMenuItemNamed('Delete');

        removeItem.dispatchEvent(events.click());
      }));

      it('delegates to the ramlRepository', function() {
        openStub.should.have.been.calledWith(file);
      });
    });

    describe('renaming', function() {
      var renameItem, moveFileStub, promptSpy, filenamePromptStub;

      beforeEach(function() {
        inject(function(ramlRepository, ramlEditorFilenamePrompt) {
          moveFileStub = sandbox.stub(ramlRepository, 'moveFile');
          filenamePromptStub = sandbox.stub(ramlEditorFilenamePrompt, 'open');
        });
        promptSpy = sandbox.stub(window, 'prompt');

        renameItem = Array.prototype.slice.call(el.children().children()).filter(function(child) {
          return angular.element(child).text() === 'Rename';
        })[0];
      });

      it('opens the filenamePrompt with the file\'s current name', function() {
        filenamePromptStub.returns(promise.stub());
        renameItem.dispatchEvent(events.click());

        filenamePromptStub.should.have.been.calledWith('filename.raml');
      });

      describe('upon success', function() {
        beforeEach(function() {
          filenamePromptStub.returns(promise.resolved('NewName.raml'));
          renameItem.dispatchEvent(events.click());
        });

        it('renames the file in the ramlRepository', function() {
          moveFileStub.should.have.been.calledWith(file, 'NewName.raml');
        });

      });

      describe('upon failure', function() {
        beforeEach(function() {
          filenamePromptStub.returns(promise.rejected());
          renameItem.dispatchEvent(events.click());
        });

        it('does not rename the file', function() {
          moveFileStub.should.not.have.been.called;
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
    });
  });
});
