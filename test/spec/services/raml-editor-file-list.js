'use strict';

describe('FileList', function () {
  angular.module('fileListTest', ['ramlEditorApp', 'testFs']);
  beforeEach(module('fileListTest'));

  var sandbox;

  function fileNames(files) {
    return files.map(function(file) { return file.name; });
  }

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
      fileNames(files).should.include('shiny.raml');
    });

    it('emits an event indicating that a file has been added', function() {
      broadcastSpy.should.have.been.calledWith('event:raml-editor-file-created', sinon.match({ name: 'shiny.raml' }));
    });
  });

  describe('saving a file', function() {
    var saveFileSpy, fileList, file;

    beforeEach(inject(function(ramlRepository, $rootScope, $injector) {
      saveFileSpy = sandbox.spy(ramlRepository, 'saveFile');
      fileList = $injector.get('fileList');
      file = fileList.newFile('some-file.raml');
    }));

    describe('by default', function() {
      beforeEach(function() {
        fileList.saveFile(file);
      });

      it('saves the file with the repository', function() {
        saveFileSpy.should.have.been.calledWith(file);
      });
    });
  });

  describe('removing a file', function() {
    var broadcastSpy, removeFileSpy, fileList, file;

    beforeEach(inject(function(ramlRepository, $rootScope, $injector) {
      broadcastSpy = sandbox.spy($rootScope, '$broadcast');

      removeFileSpy = sandbox.spy(ramlRepository, 'removeFile');
      fileList = $injector.get('fileList');
      file = fileList.newFile('some-file.raml');
    }));

    describe('by default', function() {
      beforeEach(inject(function($rootScope) {
        file.persisted = true;
        fileList.removeFile(file);
        $rootScope.$digest();
      }));

      it('removes it from the file list', function() {
        fileNames(fileList.files).should.not.include('some-file.raml');
      });

      it('removes it from the repository', function() {
        removeFileSpy.should.have.been.calledWith(file);
      });

      it('broadcasts an event', function() {
        broadcastSpy.should.have.been.calledWith('event:raml-editor-file-removed', sinon.match({name: 'some-file.raml'}));
      });
    });

    describe('when the file has not been', function() {
      beforeEach(inject(function($rootScope) {
        fileList.removeFile(file);
        $rootScope.$digest();
      }));

      it('does not try to remove the file from the repository', function() {
        removeFileSpy.should.not.have.been.called;
      });
    });
  });
});
