'use strict';

describe('RAML Repository', function () {
  var $rootScope, $q, $timeout, ramlRepository, fileSystem, sandbox;

  beforeEach(module('fs'));
  beforeEach(function () {
    module(function($exceptionHandlerProvider) {
      $exceptionHandlerProvider.mode('log');
    });
  });

  beforeEach(inject(function ($injector) {
    $rootScope     = $injector.get('$rootScope');
    $q             = $injector.get('$q');
    $timeout       = $injector.get('$timeout');
    fileSystem     = $injector.get('fileSystem');
    ramlRepository = $injector.get('ramlRepository');
    sandbox        = sinon.sandbox.create();
  }));

  afterEach(function() {
    sandbox.restore();
  });

  describe('loadDirectory', function () {
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
      ramlRepository.loadDirectory('/').then(success);

      directoryDeferred.resolve(files);
      $rootScope.$apply();

      // Assert
      var directory = success.firstCall.args[0];
      directory.children[0].path.should.be.equal(files.children[0].path);
      directory.children[0].name.should.be.equal(files.children[0].name);
      directory.children[0].dirty.should.be.false;
      directory.children[0].persisted.should.be.true;
    });

    it('should handle errors', function () {
      // Arrange
      var directoryDeferred = $q.defer();
      sinon.stub(fileSystem, 'directory').returns(directoryDeferred.promise);
      var error = sinon.stub();
      var errorData = {message: 'Error occurred'};

      // Act
      ramlRepository.loadDirectory('/').then(function () {}, error);

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
      ramlRepository.loadDirectory('/').then(success);
      $rootScope.$apply();

      // Assert
      success.should.have.been.called;
      success.firstCall.args[0].children.should.have.length(1);
      success.firstCall.args[0].children[0].should.have.property('path', '/example.raml');
    });

    it('should copy `root` property of files', function () {
      // Arrange
      var success = sinon.stub();
      var folder  = {
        path:     '/',
        name:     '/',
        children: [
          {
            path:    '/file1.raml',
            name:    'file1.raml',
            content: '',
            root:    true
          }
        ]
      };

      // Act
      sinon.stub(fileSystem, 'directory').returns($q.when(folder));
      ramlRepository.loadDirectory('/').then(success);
      $rootScope.$apply();

      // Assert
      success.should.have.been.called;
      success.firstCall.args[0].children.should.have.length(1);
      success.firstCall.args[0].children[0].should.have.property('root').and.be.true;
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
    describe('when file is nonpersistent', function () {
      beforeEach(function () {
        sinon.spy(fileSystem, 'remove');

        ramlRepository.removeFile({
          persisted: false
        });
      });

      it('should not make call to file system', function () {
        fileSystem.remove.should.not.be.called;
      });
    });

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
      var fileMock = {persisted: true};
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

  describe('RamlFile', function () {
    it('should have a proper extension value extracted from name', function () {
      ramlRepository.createFile('api.raml').should.have.property('extension', 'raml');
    });

    it('should not extract an extension from name started with a dot', function () {
      ramlRepository.createFile('.raml').should.not.have.property('extension');
    });
  });

  describe('RamlDirectory', function () {
    it('should takeout trailing slashes in pathnames', function () {
      ramlRepository.createDirectory('folder1/').path.should.equals('/folder1');
      ramlRepository.createDirectory('folder2').path.should.equals('/folder2');
    });
  });

  describe('If folders are supported', function () {
    var rootDirectory;

    beforeEach(function () {
      var directoryDeferred = $q.defer();
      sinon.stub(fileSystem, 'directory').returns(directoryDeferred.promise);
      var success = sinon.stub();
      var files = {
        path: '/',
        name: '/',
        type: 'folder',
        children: [
          {
            path: '/example.raml',
            name: 'example.raml',
            content: '',
            type: 'file'
          },
          {
            path: '/folder',
            name: 'folder',
            children: [
              {
                path: '/folder/example.raml',
                name: 'example.raml',
                content: '',
                type: 'file'
              },
              {
                path: '/folder/subfolder',
                name: 'subfolder',
                type: 'folder',
                children: []
              }
            ],
            type: 'folder'
          }
        ]
      };

      ramlRepository.loadDirectory('/').then(success);

      directoryDeferred.resolve(files);
      $rootScope.$apply();

      rootDirectory = success.firstCall.args[0];
    });

    describe('creating a new file in a folder', function () {
      it('should give the correct tree structure', function () {
        var folder = rootDirectory.getDirectories()[0];

        rootDirectory.createFile('new.raml');
        folder.createFile('another.raml');

        rootDirectory.children.length.should.equals(3);
        rootDirectory.getFiles().length.should.equals(2);
        rootDirectory.getFiles()[1].path.should.equals('/new.raml');
        rootDirectory.getDirectories().length.should.equals(1);

        folder.children.length.should.equals(3);
        folder.getFiles().length.should.equals(2);
        folder.getFiles()[1].path.should.equals('/folder/another.raml');
        folder.getDirectories().length.should.equals(1);
      });

    });

    describe('renaming a file in a folder', function () {
      it('should not change tree structure', function () {
        var folder = rootDirectory.getDirectories()[0];

        ramlRepository.renameFile(rootDirectory.getFiles()[0], 'newName.raml');
        ramlRepository.renameFile(folder.getFiles()[0], 'newName.raml');
        $timeout.flush();

        rootDirectory.children.length.should.equals(2);
        rootDirectory.getFiles().length.should.equals(1);
        rootDirectory.getFiles()[0].path.should.equals('/newName.raml');
        rootDirectory.getDirectories().length.should.equals(1);

        folder.children.length.should.equals(2);
        folder.getFiles().length.should.equals(1);
        folder.getFiles()[0].path.should.equals('/folder/newName.raml');
        folder.getDirectories().length.should.equals(1);
      });
    });

    describe('creating a new folder', function () {
      it('should give the correct tree structure', function () {
        rootDirectory.createDirectory('newFolder');

        rootDirectory.children.length.should.equals(3);
        rootDirectory.getFiles().length.should.equals(1);
        rootDirectory.getDirectories().length.should.equals(2);
        rootDirectory.getDirectories()[1].path.should.equals('/newFolder');

        var folder = rootDirectory.getDirectories()[0];
        folder.createDirectory('newFolder');

        folder.children.length.should.equals(3);
        folder.getFiles().length.should.equals(1);
        folder.getDirectories().length.should.equals(2);
        folder.getDirectories()[1].path.should.equals('/folder/newFolder');
      });
    });

    describe('renaming a folder', function () {
      var folder;

      beforeEach(function () {
        folder = rootDirectory.getDirectories()[0];
        sinon.stub(fileSystem, 'rename').returns($q.when(folder));
      });

      it('should not change tree structure', function () {
        ramlRepository.renameDirectory(folder.getDirectories()[0], 'folder2');
        $timeout.flush();

        folder.children.length.should.equals(2);
        folder.getFiles().length.should.equals(1);
        folder.getDirectories().length.should.equals(1);
        folder.getDirectories()[0].path.should.equals('/folder/folder2');
      });

      it('should update the path of all its children', function () {
        ramlRepository.renameDirectory(rootDirectory.getDirectories()[0], 'foo');
        $timeout.flush();

        rootDirectory.getDirectories()[0].path.should.equals('/foo');

        folder.children.length.should.equals(2);
        folder.getFiles().length.should.equals(1);
        folder.getFiles()[0].path.should.equals('/foo/example.raml');
        folder.getDirectories().length.should.equals(1);
        folder.getDirectories()[0].path.should.equals('/foo/subfolder');
      });
    });

    describe('deleting a folder', function () {
      var removeSpy;

      beforeEach(function () {
        removeSpy = sinon.spy(fileSystem, 'remove');

        rootDirectory.removeDirectory(rootDirectory.getDirectories()[0]);
      });

      it('should give the correct tree structure', function () {
        rootDirectory.children.length.should.equals(1);
        rootDirectory.getFiles().length.should.equals(1);
        rootDirectory.getDirectories().length.should.equals(0);
      });

      it('should delete all its children as well', function () {
        removeSpy.should.have.been.calledThrice;
      });
    });

    describe('getDirectory', function () {
      beforeEach(function () {
        rootDirectory.createDirectory('empty');
      });

      it('returns the subtree representing the directory identified by path', function () {
        var folder = ramlRepository.getDirectory('/folder', rootDirectory);

        folder.children.length.should.equals(2);
        folder.getFiles().length.should.equals(1);
        folder.getDirectories().length.should.equals(1);

        var empty = ramlRepository.getDirectory('/empty', rootDirectory);
        empty.children.length.should.equals(0);
        empty.getFiles().length.should.equals(0);
        empty.getDirectories().length.should.equals(0);
      });

      it('returns undefined if the path is not found in the tree', function () {
        expect(ramlRepository.getDirectory('/notFound', rootDirectory)).to.be.undefined;
        expect(ramlRepository.getDirectory('/folder/notFound', rootDirectory.getDirectories()[0])).to.be.undefined;
      });
    });
  });
});
