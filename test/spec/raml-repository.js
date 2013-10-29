'use strict';

describe('RAML Repository', function () {
  var ramlRepository;

  beforeEach(module('fs'));

  beforeEach(inject(function (_ramlRepository_) {
    ramlRepository = _ramlRepository_;
  }));

  function extractProperties (obj) {
    var extractedProperies = {}, i, currentPropertyKey;
    
    for (i = 1; i < arguments.length; i++) {
      currentPropertyKey = arguments[i];
      extractedProperies[currentPropertyKey] = obj[currentPropertyKey];
    }

    return extractedProperies;
    
  }

  describe('getDirectory', function () {

    it('should reflect the contents of a directory on success', inject(function (fileSystem) {
      // Arrange
      var fileSystemMock = sinon.mock(fileSystem),
          files = ['myfile'],
          directoryExpectation = fileSystemMock.expects('directory').once(),
          success = sinon.stub(),
          error = sinon.stub();

      // Act
      var directoryList = ramlRepository.getDirectory('/', success, error);
      var oldDirectoryList = extractProperties(directoryList, 'loading', 'length', 'error');
      directoryExpectation.firstCall.args[1](files);

      // Assert
      oldDirectoryList.loading.should.be.equal(true);
      oldDirectoryList.length.should.be.equal(0);
      should.not.exist(oldDirectoryList.error);

      
      directoryList.loading.should.be.equal(false);
      directoryList.length.should.be.equal(1);
      should.not.exist(directoryList.error);

      success.calledOnce.should.be.equal(true);
      var successCallFirstArgument = success.firstCall.args[0];
      successCallFirstArgument.should.be.deep.equal(directoryList);
      directoryList[0].path.should.be.equal('/');
      directoryList[0].name.should.be.equal(files[0]);

      error.called.should.be.equal(false);

      // Restore
      fileSystemMock.verify();

    }));
    
    it('should handle errors', inject(function (fileSystem) {
      // Arrange
      var fileSystemMock = sinon.mock(fileSystem),
          directoryExpectation = fileSystemMock.expects('directory').once(),
          success = sinon.stub(),
          error = sinon.stub(),
          errorData = {message: 'Error occurred'};

      // Act
      var directoryList = ramlRepository.getDirectory('/', success, error);
      var oldDirectoryList = extractProperties(directoryList, 'loading', 'length', 'error');
      directoryExpectation.firstCall.args[2](errorData);

      // Assert
      oldDirectoryList.loading.should.be.equal(true);
      oldDirectoryList.length.should.be.equal(0);
      should.not.exist(oldDirectoryList.error);

      directoryList.loading.should.be.equal(false);
      directoryList.length.should.be.equal(0);
      directoryList.error.should.be.equal(errorData);

      error.calledOnce.should.be.equal(true);
      error.firstCall.args[0].should.be.deep.equal(errorData);

      success.called.should.be.equal(false);

      // Restore
      fileSystemMock.verify();
    }));
  });
  
  describe('loadFile', function () {
    it('should reflect the content of a file on success', inject(function (fileSystem) {
      // Arrange
      var fileSystemMock = sinon.mock(fileSystem),
          fileContent = 'this is the file content',
          loadExpectation = fileSystemMock.expects('load').once(),
          success = sinon.stub(),
          error = sinon.stub(),
          fileMock = {};

      // Act
      ramlRepository.loadFile(fileMock, success, error);
      var oldFileMock = extractProperties(fileMock, 'loading');
      loadExpectation.firstCall.args[2](fileContent);

      // Assert
      oldFileMock.loading.should.be.equal(true);
      
      success.calledOnce.should.be.equal(true);
      var file = success.firstCall.args[0];

      file.should.be.equal(fileMock);
      
      file.loading.should.be.equal(false);
      file.dirty.should.be.equal(false);
      file.contents.should.be.equal(fileContent);
      should.not.exist(file.error);

      error.called.should.be.equal(false);

      // Restore
      fileSystemMock.verify();
    }));

    it('should handle errors', inject(function (fileSystem) {
      // Arrange
      var fileSystemMock = sinon.mock(fileSystem),
          loadExpectation = fileSystemMock.expects('load').once(),
          success = sinon.stub(),
          error = sinon.stub(),
          fileMock = {},
          errorData = {message: 'This is the error description'};

      // Act
      ramlRepository.loadFile(fileMock, success, error);
      var oldFileMock = extractProperties(fileMock, 'loading');
      loadExpectation.firstCall.args[3](errorData);

      // Assert
      oldFileMock.loading.should.be.equal(true);

      
      error.firstCall.args[0].should.be.equal(errorData);
      
      error.calledOnce.should.be.equal(true);

      fileMock.loading.should.be.equal(false);
      fileMock.dirty.should.be.equal(false);
      fileMock.error.should.be.equal(errorData);

      success.called.should.be.equal(false);

      // Restore
      fileSystemMock.verify();
    }));
  });
  
  describe('removeFile', function () {
    it('should update file on success', inject(function (fileSystem) {
      // Arrange
      var fileSystemMock = sinon.mock(fileSystem),
          fileContent = 'this is the file content',
          removeExpectation = fileSystemMock.expects('remove').once(),
          success = sinon.stub(),
          error = sinon.stub(),
          fileMock = {};

      // Act
      ramlRepository.removeFile(fileMock, success, error);
      var oldFileMock = extractProperties(fileMock, 'loading');
      removeExpectation.firstCall.args[2](fileContent);

      // Assert
      oldFileMock.loading.should.be.equal(true);
      
      success.calledOnce.should.be.equal(true);
      var file = success.firstCall.args[0];

      file.should.be.equal(fileMock);
      
      file.loading.should.be.equal(false);
      file.dirty.should.be.equal(false);
      file.removed.should.be.equal(true);
      should.not.exist(file.error);

      error.called.should.be.equal(false);

      // Restore
      fileSystemMock.verify();
    }));
    
    it('should handle errors', inject(function (fileSystem) {
      // Arrange
      var fileSystemMock = sinon.mock(fileSystem),
          removeExpectation = fileSystemMock.expects('remove').once(),
          success = sinon.stub(),
          error = sinon.stub(),
          fileMock = {},
          errorData = {message: 'This is the error description'};

      // Act
      ramlRepository.removeFile(fileMock, success, error);
      var oldFileMock = extractProperties(fileMock, 'loading');
      removeExpectation.firstCall.args[3](errorData);

      // Assert
      oldFileMock.loading.should.be.equal(true);
      
      error.firstCall.args[0].should.be.equal(errorData);
      
      error.calledOnce.should.be.equal(true);

      fileMock.loading.should.be.equal(false);
      fileMock.removed.should.be.equal(false);
      fileMock.error.should.be.equal(errorData);

      success.called.should.be.equal(false);

      // Restore
      fileSystemMock.verify();
    }));
  });
  
  describe('saveFile', function () {
    it('should do nothing when file is not dirty', inject(function (fileSystem) {
      // Arrange
      var fileSystemMock = sinon.mock(fileSystem),
          success = sinon.stub(),
          error = sinon.stub(),
          fileMock = {dirty: false};

      // Act
      ramlRepository.saveFile(fileMock, success, error);

      // Assert
      success.called.should.be.equal(false);
      error.called.should.be.equal(false);

      // Restore
      fileSystemMock.verify();
    }));

    it('should update file state on success', inject(function (fileSystem) {
      // Arrange
      var fileSystemMock = sinon.mock(fileSystem),
          fileContent = 'this is the file content',
          saveExpectation = fileSystemMock.expects('save').once(),
          success = sinon.stub(),
          error = sinon.stub(),
          fileMock = {dirty: true};

      // Act
      ramlRepository.saveFile(fileMock, success, error);
      var oldFileMock = extractProperties(fileMock, 'loading');
      saveExpectation.firstCall.args[3](fileContent);

      // Assert
      oldFileMock.loading.should.be.equal(true);
      
      success.calledOnce.should.be.equal(true);
      var file = success.firstCall.args[0];

      file.should.be.equal(fileMock);
      
      file.loading.should.be.equal(false);
      file.dirty.should.be.equal(false);
      file.removed.should.be.equal(false);
      file.persisted.should.be.equal(true);
      should.not.exist(file.error);

      error.called.should.be.equal(false);

      // Restore
      fileSystemMock.verify();
    }));
    
    it('should handle errors', inject(function (fileSystem) {
      // Arrange
      var fileSystemMock = sinon.mock(fileSystem),
          saveExpectation = fileSystemMock.expects('save').once(),
          success = sinon.stub(),
          error = sinon.stub(),
          fileMock = {dirty: true},
          errorData = {message: 'This is the error description'};

      // Act
      ramlRepository.saveFile(fileMock, success, error);
      var oldFileMock = extractProperties(fileMock, 'loading');
      saveExpectation.firstCall.args[4](errorData);

      // Assert
      oldFileMock.loading.should.be.equal(true);
      
      error.firstCall.args[0].should.be.equal(errorData);
      
      error.calledOnce.should.be.equal(true);

      fileMock.loading.should.be.equal(false);
      fileMock.error.should.be.equal(errorData);

      success.called.should.be.equal(false);

      // Restore
      fileSystemMock.verify();
    }));
  });
  
  describe('createFile', function () {
    it('should return a new file with snippet content', inject(function (ramlSnippets) {
      // Arrange
      var snippetsMock = sinon.mock(ramlSnippets),
          fileContent = 'This is an empty RAML file content';
      snippetsMock.expects('getEmptyRaml').once().returns(fileContent);

      // Act
      var file = ramlRepository.createFile();

      // Assert
      file.contents.should.be.equal(fileContent);
      file.name.should.be.equal('untitled.raml');
      file.path.should.be.equal('/');

      snippetsMock.verify();
    }));
  });
  
  describe('bootstrap', function () {
    it('should open the first file entry if there are file entries', inject(function () {
      // Arrange
      var then = sinon.stub(),
          getDirectoryStub = sinon.stub(ramlRepository, 'getDirectory'),
          loadFileStub = sinon.stub(ramlRepository, 'loadFile'),
          fileMock = {};

      // Act
      ramlRepository.bootstrap(then);
      then.called.should.be.equal(false);
      getDirectoryStub.firstCall.args[1]([fileMock, {someotherfile: 'file'}, {somefile: 'file'}]);
      loadFileStub.firstCall.args[1]();

      // Assert
      then.called.should.be.equal(true);
      then.firstCall.args[0].should.be.equal(fileMock);
      
      ramlRepository.getDirectory.calledOnce.should.be.equal(true);
      ramlRepository.loadFile.calledOnce.should.be.equal(true);

      getDirectoryStub.restore();
      loadFileStub.restore();
    }));
    it('should create a new file if there are not file entries', inject(function () {
      // Arrange
      var then = sinon.stub(),
          getDirectoryStub = sinon.stub(ramlRepository, 'getDirectory'),
          loadFileStub = sinon.stub(ramlRepository, 'loadFile'),
          createFileStub = sinon.stub(ramlRepository, 'createFile'),
          newFileContent = 'This is a new file';

      createFileStub.returns(newFileContent);

      // Act
      ramlRepository.bootstrap(then);
      then.called.should.be.equal(false);
      getDirectoryStub.firstCall.args[1]([]);

      // Assert
      then.called.should.be.equal(true);
      then.firstCall.args[0].should.be.equal(newFileContent);
      
      ramlRepository.getDirectory.calledOnce.should.be.equal(true);
      ramlRepository.loadFile.called.should.be.equal(false);

      getDirectoryStub.restore();
      loadFileStub.restore();
      createFileStub.restore();
    }));
    it('should create a new file on fail', inject(function () {
      // Arrange
      var then = sinon.stub(),
          getDirectoryStub = sinon.stub(ramlRepository, 'getDirectory'),
          loadFileStub = sinon.stub(ramlRepository, 'loadFile'),
          createFileStub = sinon.stub(ramlRepository, 'createFile'),
          newFileContent = 'This is a new file';

      createFileStub.returns(newFileContent);

      // Act
      ramlRepository.bootstrap(then);
      then.called.should.be.equal(false);
      getDirectoryStub.firstCall.args[2]();

      // Assert
      then.called.should.be.equal(true);
      then.firstCall.args[0].should.be.equal(newFileContent);
      
      ramlRepository.getDirectory.calledOnce.should.be.equal(true);
      ramlRepository.loadFile.called.should.be.equal(false);

      getDirectoryStub.restore();
      loadFileStub.restore();
      createFileStub.restore();
    }));
  });
});
