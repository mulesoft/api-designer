describe('ramlEditorContextMenu', function() {
  'use strict';

  var scope, el, sandbox, contextMenu, file;

  function compileContextMenu() {
    el = compileTemplate('<raml-editor-context-menu></raml-editor-context-menu>', scope);
    document.body.appendChild(el[0]);
  }

  beforeEach(module('ramlEditorApp'));

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

    describe('saving', function() {
      var saveFileStub;

      beforeEach(inject(function(ramlRepository) {
        saveFileStub = sinon.stub(ramlRepository, 'saveFile');

        var saveItem = Array.prototype.slice.call(el.children().children()).filter(function(child) {
          return angular.element(child).text() === 'Save';
        })[0];

        saveItem.dispatchEvent(events.click());
      }));

      it('delegates to the ramlRepository', function() {
        saveFileStub.should.have.been.calledWith(file);
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
