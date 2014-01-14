'use strict';

describe('FileList', function () {
  angular.module('fileListTest', ['ramlEditorApp', 'testFs']);
  beforeEach(module('fileListTest'));

  var sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('creating a new file', function() {
    var broadcastSpy, createFileSpy, files;

    beforeEach(inject(function(fileList, ramlRepository, $rootScope) {
      broadcastSpy = sandbox.spy($rootScope, '$broadcast');

      createFileSpy = sandbox.spy(ramlRepository, 'createFile');
      fileList.newFile('shiny.raml');
      files = fileList.files;
    }));

    it('gets a file handle from the raml repository', function() {
      createFileSpy.should.have.been.calledWith('shiny.raml');
    });

    it('adds the file to the file list', function() {
      files.map(function(file) { return file.name; }).should.include('shiny.raml');
    });

    it('emits an event indicating that a file has been added', function() {
      broadcastSpy.should.have.been.calledWith('event:raml-editor-new-file', sinon.match({ name: 'shiny.raml' }));
    });
  });
});
