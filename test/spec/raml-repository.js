'use strict';

describe('RAML Repository', function () {
  var $rootScope, $q, ramlRepository, fileSystem, sandbox;

  beforeEach(module('fs'));
  beforeEach(function () {
    module(function($exceptionHandlerProvider) {
      $exceptionHandlerProvider.mode('log');
    });
  });

  beforeEach(inject(function ($injector) {
    $rootScope     = $injector.get('$rootScope');
    $q             = $injector.get('$q');
    fileSystem     = $injector.get('fileSystem');
    ramlRepository = $injector.get('ramlRepository');
    sandbox        = sinon.sandbox.create();
  }));

  afterEach(function() {
    sandbox.restore();
  });

  describe('getDirectory', function () {
    it('should reflect the contents of a directory on success', function () {
      // Arrange
      var directoryDeferred = $q.defer();
      sinon.stub(fileSystem, 'directory').returns(directoryDeferred.promise);
      var success = sinon.stub();
      var files = {
        path: '/',
        name: '/',
        children: [
          {
            path: '/example.raml',
            name: 'example.raml',
            content: ''
          }
        ]
      };

      // Act
      ramlRepository.getDirectory('/').then(success);

      directoryDeferred.resolve(files);
      $rootScope.$apply();

      // Assert
      var directory = success.firstCall.args[0];
      directory.files[0].path.should.be.equal(files.children[0].path);
      directory.files[0].name.should.be.equal(files.children[0].name);
      directory.files[0].dirty.should.be.false;
      directory.files[0].persisted.should.be.true;
    });

    it('should handle errors', function () {
      // Arrange
      var directoryDeferred = $q.defer();
      sinon.stub(fileSystem, 'directory').returns(directoryDeferred.promise);
      var error = sinon.stub();
      var errorData = {message: 'Error occurred'};

      // Act
      ramlRepository.getDirectory('/').then(function () {}, error);

      directoryDeferred.reject(errorData);
      $rootScope.$apply();

      // Assert
      error.firstCall.args[0].should.be.deep.equal(errorData);
    });

    it('should filter out meta files', function () {
      // Arrange
      var success = sinon.stub();
      var folder  = {
        path: '/',
        name: '/',
        children: [
          {
            path: '/example.raml',
            name: 'example.raml',
            content: ''
          },
          {
            path: '/example.raml.meta',
            name: 'example.raml.meta',
            content: '{"key": "value"}'
          }
        ]
      };

      // Act
      sinon.stub(fileSystem, 'directory').returns($q.when(folder));
      ramlRepository.getDirectory('/').then(success);
      $rootScope.$apply();

      // Assert
      success.should.have.been.called;
      success.firstCall.args[0].files.should.have.length(1);
      success.firstCall.args[0].files[0].should.have.property('path', '/example.raml');
    });
  });

  describe('loadFile', function () {
    it('should reflect the content of a file on success', function () {
      // Arrange
      var loadDeferred = $q.defer();
      sinon.stub(fileSystem, 'load').returns(loadDeferred.promise);
      var success = sinon.stub();
      var fileContent = 'this is the file content';
      var file;

      // Act
      ramlRepository.loadFile({}).then(success);

      loadDeferred.resolve(fileContent);
      $rootScope.$apply();

      // Assert
      file = success.firstCall.args[0];
      file.dirty.should.be.equal(false);
      file.contents.should.be.equal(fileContent);
      should.not.exist(file.error);
    });

    it('should handle errors', function () {
      // Arrange
      var loadDeferred = $q.defer();
      sinon.stub(fileSystem, 'load').returns(loadDeferred.promise);
      var error = sinon.stub();
      var errorData = {message: 'Error occurred'};
      var fileMock = {};

      // Act
      ramlRepository.loadFile(fileMock).then(function () {}, error);

      loadDeferred.reject(errorData);
      $rootScope.$apply();

      // Assert
      error.firstCall.args[0].should.be.equal(errorData);

      fileMock.error.should.be.equal(errorData);
    });
  });

  describe('removeFile', function () {
    it('should update file on success', function () {
      // Arrange
      var removeDeferred = $q.defer();
      sinon.stub(fileSystem, 'remove').returns(removeDeferred.promise);
      var success = sinon.stub();
      var fileMock = {};

      // Act
      ramlRepository.removeFile(fileMock).then(success);

      removeDeferred.resolve();
      $rootScope.$apply();

      // Assert
      fileMock.dirty.should.be.equal(false);
      should.not.exist(fileMock.error);
    });

    it('should handle errors', function () {
      // Arrange
      var removeDeferred = $q.defer();
      sinon.stub(fileSystem, 'remove').returns(removeDeferred.promise);
      var error = sinon.stub();
      var fileMock = {};
      var errorData = {message: 'This is the error description'};

      // Act
      ramlRepository.removeFile(fileMock).then(function () {}, error);

      removeDeferred.reject(errorData);
      $rootScope.$apply();

      // Assert
      error.firstCall.args[0].should.be.equal(errorData);

      fileMock.error.should.be.equal(errorData);
    });
  });

  describe('saveFile', function () {
    it('should update file state on success', function () {
      // Arrange
      var saveDeferred = $q.defer();
      sinon.stub(fileSystem, 'save').returns(saveDeferred.promise);
      var success = sinon.stub();
      var fileMock = {
        path: '/',
        name: 'example.raml',
        dirty: true
      };
      var file;

      // Act
      ramlRepository.saveFile(fileMock).then(success);

      saveDeferred.resolve();
      $rootScope.$apply();

      // Assert
      file = success.firstCall.args[0];
      file.dirty.should.be.equal(false);
      file.persisted.should.be.equal(true);
      should.not.exist(file.error);
    });

    it('should handle errors', function () {
      // Arrange
      var saveDeferred = $q.defer();
      sinon.stub(fileSystem, 'save').returns(saveDeferred.promise);
      var error = sinon.stub();
      var fileMock = {
        path: '/',
        name: 'example.raml',
        dirty: true
      };
      var errorData = {message: 'This is the error description'};

      // Act
      ramlRepository.saveFile(fileMock).then(function () {}, error);

      saveDeferred.reject(errorData);
      $rootScope.$apply();

      // Assert
      error.firstCall.args[0].should.be.equal(errorData);

      fileMock.error.should.be.equal(errorData);
    });
  });

  describe('renameFile', function () {
    var file, fileSystemMock, renameFile;

    beforeEach(function() {
      file = { name: 'currentName', path: '/currentPath/currentName', persisted: true };
      fileSystemMock = sandbox.stub(fileSystem, 'rename');
    });

    describe('by default', function() {
      beforeEach(function() {
        renameFile = function() {
          ramlRepository.renameFile(file, 'newName');
        };
      });

      it('delegates to the fileSystem, providing the file\'s current path', function() {
        fileSystemMock.returns(promise.stub());
        renameFile();

        fileSystemMock.should.have.been.calledWith('/currentPath/currentName', '/currentPath/newName');
      });

      describe('upon fileSystem success', function() {
        beforeEach(function() {
          fileSystemMock.returns(promise.resolved());
        });

        it('updates the name', function() {
          renameFile();

          file.name.should.equal('newName');
        });
      });

      describe('upon fileSystem failure', function() {
        beforeEach(function() {
          fileSystemMock.returns(promise.rejected('errorMessage'));
        });

        it('assigns the error message on the file', function() {
          try {
            renameFile();
          } catch (e) {}

          file.error.should.equal('errorMessage');
        });
      });
    });

    describe('unsaved files', function() {
      beforeEach(function() {
        file.persisted = false;
        renameFile = function() {
          ramlRepository.renameFile(file, 'newName');
        };
      });

      it('does not delegate to the file system', function() {
        renameFile();

        fileSystemMock.should.not.have.been.called;
      });
    });
  });

  describe('createFile', function () {
    var broadcastSpy, file, snippet;

    beforeEach(inject(function($rootScope, ramlSnippets) {
      snippet = 'This is an empty RAML file content';
      sinon.stub(ramlSnippets, 'getEmptyRaml').returns(snippet);

      broadcastSpy = sandbox.spy($rootScope, '$broadcast');
      file = ramlRepository.createFile('untitled.raml');
    }));

    it('should return a new file with snippet content', function () {
      // Assert
      file.path.should.be.equal('/untitled.raml');
      file.name.should.be.equal('untitled.raml');
      file.contents.should.be.equal(snippet);
      file.dirty.should.be.true;
      file.persisted.should.be.false;
    });

    it('emits an event indicating that a file has been added', function() {
      broadcastSpy.should.have.been.calledWith('event:raml-editor-file-created', sinon.match({ name: 'untitled.raml' }));
    });
  });

  describe('saveMeta', function () {
    it('should call saveFile with proper file and path, and return meta', function () {
      var success = sinon.stub();
      var path    = '/api.raml';
      var meta    = {key: 'value'};

      sinon.stub(ramlRepository, 'saveFile').returns($q.when({contents: JSON.stringify(meta)}));
      ramlRepository.saveMeta({path: path}, meta).then(success);

      $rootScope.$apply();

      ramlRepository.saveFile.should.have.been.called;
      ramlRepository.saveFile.firstCall.args[0].should
        .have.property('path')
        .and
        .be.equal(path + '.meta')
      ;

      success.should.have.been.called;
      success.firstCall.args[0].should.be.deep.equal(meta);
    });
  });

  describe('loadMeta', function () {
    it('should call loadFile with proper file and path and return meta', function () {
      var success = sinon.stub();
      var meta    = {key: 'value'};
      var path    = '/api.raml';

      sinon.stub(ramlRepository, 'loadFile').returns($q.when({contents: JSON.stringify(meta)}));
      ramlRepository.loadMeta({path: path}).then(success);

      $rootScope.$apply();

      ramlRepository.loadFile.should.have.been.called;
      ramlRepository.loadFile.firstCall.args[0].should
        .have.property('path')
        .and
        .be.equal(path + '.meta')
      ;

      success.should.have.been.called;
      success.firstCall.args[0].should.be.deep.equal(meta);
    });

    it('should return an empty meta when something is wrong', function () {
      var success = sinon.stub();
      var path    = '/api.raml';

      sinon.stub(ramlRepository, 'loadFile').returns($q.reject(new Error('Ups!')));
      ramlRepository.loadMeta({path: path}).then(success);

      $rootScope.$apply();

      success.should.have.been.called;
      success.firstCall.args[0].should.be.deep.equal({});
    });
  });
});
