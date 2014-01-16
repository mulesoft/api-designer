'use strict';

describe('RAML Repository', function () {
  var $rootScope;
  var $q;
  var ramlRepository;
  var fileSystem;

  beforeEach(module('fs'));
  beforeEach(function () {
    module(function($exceptionHandlerProvider) {
      $exceptionHandlerProvider.mode('log');
    });
  });
  beforeEach(inject(function ($injector) {
    $rootScope = $injector.get('$rootScope');
    $q = $injector.get('$q');
    ramlRepository = $injector.get('ramlRepository');
    fileSystem = $injector.get('fileSystem');
  }));

  describe('getDirectory', function () {
    it('should reflect the contents of a directory on success', function () {
      // Arrange
      var directoryDeferred = $q.defer();
      var directoryStub = sinon.stub(fileSystem, 'directory').returns(directoryDeferred.promise);
      var success = sinon.stub();
      var files = ['myfile'];

      // Act
      ramlRepository.getDirectory('/').then(success);

      directoryDeferred.resolve(files);
      $rootScope.$apply();

      // Assert
      success.firstCall.args[0][0].path.should.be.equal('/');
      success.firstCall.args[0][0].name.should.be.equal(files[0]);
      success.firstCall.args[0][0].dirty.should.be.false;
      success.firstCall.args[0][0].persisted.should.be.true;

      // Restore
      directoryStub.restore();
    });

    it('should handle errors', function () {
      // Arrange
      var directoryDeferred = $q.defer();
      var directoryStub = sinon.stub(fileSystem, 'directory').returns(directoryDeferred.promise);
      var error = sinon.stub();
      var errorData = {message: 'Error occurred'};

      // Act
      ramlRepository.getDirectory('/').then(function () {}, error);

      directoryDeferred.reject(errorData);
      $rootScope.$apply();

      // Assert
      error.firstCall.args[0].should.be.deep.equal(errorData);

      // Restore
      directoryStub.restore();
    });
  });

  describe('loadFile', function () {
    it('should reflect the content of a file on success', function () {
      // Arrange
      var loadDeferred = $q.defer();
      var loadStub = sinon.stub(fileSystem, 'load').returns(loadDeferred.promise);
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

      // Restore
      loadStub.restore();
    });

    it('should handle errors', function () {
      // Arrange
      var loadDeferred = $q.defer();
      var loadStub = sinon.stub(fileSystem, 'load').returns(loadDeferred.promise);
      var error = sinon.stub();
      var errorData = {message: 'Error occurred'};
      var fileMock = {};

      // Act
      ramlRepository.loadFile(fileMock).then(function () {}, error);

      loadDeferred.reject(errorData);
      $rootScope.$apply();

      // Assert
      error.firstCall.args[0].should.be.equal(errorData);

      fileMock.dirty.should.be.equal(false);
      fileMock.error.should.be.equal(errorData);

      // Restore
      loadStub.restore();
    });
  });

  describe('removeFile', function () {
    it('should update file on success', function () {
      // Arrange
      var removeDeferred = $q.defer();
      var removeStub = sinon.stub(fileSystem, 'remove').returns(removeDeferred.promise);
      var success = sinon.stub();
      var fileMock = {};

      // Act
      ramlRepository.removeFile(fileMock).then(success);

      removeDeferred.resolve();
      $rootScope.$apply();

      // Assert
      fileMock.dirty.should.be.equal(false);
      should.not.exist(fileMock.error);

      // Restore
      removeStub.restore();
    });

    it('should handle errors', function () {
      // Arrange
      var removeDeferred = $q.defer();
      var removeStub = sinon.stub(fileSystem, 'remove').returns(removeDeferred.promise);
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

      // Restore
      removeStub.restore();
    });
  });

  describe('saveFile', function () {
    it('should update file state on success', function () {
      // Arrange
      var saveDeferred = $q.defer();
      var saveStub = sinon.stub(fileSystem, 'save').returns(saveDeferred.promise);
      var success = sinon.stub();
      var fileMock = {dirty: true};
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

      // Restore
      saveStub.restore();
    });

    it('should handle errors', function () {
      // Arrange
      var saveDeferred = $q.defer();
      var saveStub = sinon.stub(fileSystem, 'save').returns(saveDeferred.promise);
      var error = sinon.stub();
      var fileMock = {dirty: true};
      var errorData = {message: 'This is the error description'};

      // Act
      ramlRepository.saveFile(fileMock).then(function () {}, error);

      saveDeferred.reject(errorData);
      $rootScope.$apply();

      // Assert
      error.firstCall.args[0].should.be.equal(errorData);

      fileMock.error.should.be.equal(errorData);

      // Restore
      saveStub.restore();
    });
  });

  describe('createFile', function () {
    it('should return a new file with snippet content', inject(function (ramlSnippets) {
      // Arrange
      var snippet = 'This is an empty RAML file content';
      var getEmptyRamlStub = sinon.stub(ramlSnippets, 'getEmptyRaml').returns(snippet);
      var file;

      // Act
      file = ramlRepository.createFile();

      // Assert
      file.path.should.be.equal('/');
      file.name.should.be.equal('untitled.raml');
      file.contents.should.be.equal(snippet);
      file.dirty.should.be.true;
      file.persisted.should.be.false;

      // Restore
      getEmptyRamlStub.restore();
    }));

    it('names the file according to the argument given', function() {
      var file = ramlRepository.createFile('myfile.raml');

      file.name.should.be.equal('myfile.raml');
      file.dirty.should.be.true;
    });
  });

  describe('bootstrap', function () {
    it('should create a new file if there are not file entries', function () {
      // Arrange
      var getDirectoryDeferred = $q.defer();
      var getDirectoryStub = sinon.stub(ramlRepository, 'getDirectory').returns(getDirectoryDeferred.promise);
      var newFileContent = 'content';
      var createFileStub = sinon.stub(ramlRepository, 'createFile').returns(newFileContent);
      var success = sinon.stub();

      // Act
      ramlRepository.bootstrap().then(success);

      getDirectoryDeferred.resolve([]);
      $rootScope.$apply();

      // Assert
      success.firstCall.args[0].should.be.equal(newFileContent);

      // Restore
      getDirectoryStub.restore();
      createFileStub.restore();
    });

    it('should open the first file entry if there are file entries', function () {
      // Arrange
      var getDirectoryDeferred = $q.defer();
      var getDirectoryStub = sinon.stub(ramlRepository, 'getDirectory').returns(getDirectoryDeferred.promise);
      var loadFileDeferred = $q.defer();
      var loadFileStub = sinon.stub(ramlRepository, 'loadFile').returns(loadFileDeferred.promise);
      var success = sinon.stub();
      var fileMock = {};

      // Act
      ramlRepository.bootstrap().then(success);

      getDirectoryDeferred.resolve([fileMock]);
      loadFileDeferred.resolve(fileMock);
      $rootScope.$apply();

      // Assert
      success.firstCall.args[0].should.be.equal(fileMock);

      // Restore
      getDirectoryStub.restore();
      loadFileStub.restore();
    });
  });
});
