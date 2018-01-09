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
      directory.getFiles()[0].path.should.be.equal(files.children[0].path);
      directory.getFiles()[0].name.should.be.equal(files.children[0].name);
      directory.getFiles()[0].dirty.should.be.false;
      directory.getFiles()[0].persisted.should.be.true;
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
      success.firstCall.args[0].getFiles().should.have.length(1);
      success.firstCall.args[0].getFiles()[0].should.have.property('path', '/example.raml');
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
      success.firstCall.args[0].getFiles().should.have.length(1);
      success.firstCall.args[0].getFiles()[0].should.have.property('root').and.be.true;
    });
  });

  describe('directory operations', function () {
    var rootDirectory, files, directoryDeferred;

    beforeEach(function () {
      // set up root directory for testing
      // Arrange
      directoryDeferred = $q.defer();
      sinon.stub(fileSystem, 'directory').returns(directoryDeferred.promise);
      var success = sinon.stub();

      files = {
        path: '/',
        name: '/',
        type: 'folder',
        children: [
          {
            path: '/example.raml',
            name: 'example.raml',
            type: 'file'
          },
          {
            path: '/folder',
            name: 'folder',
            children: [
              {
                path: '/folder/test.raml',
                name: 'test.raml',
                type: 'file',
                root: true
              },
              {
                path: '/folder/subfolder',
                name: 'subfolder',
                type: 'folder',
                children: []
              }
            ],
            type: 'folder'
          },
          {
            path: '/example.raml.meta',
            name: 'example.raml.meta',
            content: '{"key": "value"}'
          }
        ]
      };

      // Act
      ramlRepository.loadDirectory().then(success);

      directoryDeferred.resolve(files);
      $rootScope.$apply();

      rootDirectory = success.firstCall.args[0];
    });

    describe('generateDirectory', function () {
      var createDirDeferred, createFolderSpy;

      beforeEach(function () {
        createDirDeferred = $q.defer();
        createFolderSpy = sinon.stub(fileSystem, 'createFolder').returns(createDirDeferred.promise);
      });

      it('should be able to create a ramlDirectory object under root directory', function () {
        ramlRepository.generateDirectory(rootDirectory, 'newFolder');

        createDirDeferred.resolve();
        $rootScope.$apply();

        rootDirectory.children.length.should.equals(3);
        rootDirectory.getFiles().length.should.equals(1);
        rootDirectory.getDirectories().length.should.equals(2);
        rootDirectory.getDirectories()[1].name.should.equals('newFolder');
        rootDirectory.getDirectories()[1].path.should.equals('/newFolder');
      });

      it('should be able to create a ramlDirectory object under another directory', function () {
        var folder = rootDirectory.getDirectories()[0];
        ramlRepository.generateDirectory(folder, 'folder');

        createDirDeferred.resolve();
        $rootScope.$apply();

        rootDirectory.children.length.should.equals(2);
        rootDirectory.getFiles().length.should.equals(1);
        rootDirectory.getDirectories().length.should.equals(1);
        folder.children.length.should.equals(3);
        folder.getFiles().length.should.equals(1);
        folder.getDirectories().length.should.equals(2);
        folder.getDirectories()[0].name.should.equals('folder');
        folder.getDirectories()[0].path.should.equals('/folder/folder');
      });

      it('should broadcast an event on success', function (done) {
        ramlRepository.generateDirectory(rootDirectory, 'newFolder');
        createDirDeferred.resolve();
        $rootScope.$on('event:raml-editor-directory-created', function () {
          done();
        });
        $rootScope.$apply();
      });

      it('should create an entry in the file system', function () {
        ramlRepository.generateDirectory(rootDirectory, 'newFolder');
        createDirDeferred.resolve();
        $rootScope.$apply();

        createFolderSpy.should.have.been.calledWith('/newFolder');
      });

      it('should create nested directories', function () {
        ramlRepository.generateDirectory(rootDirectory, 'a/b/c');
        createDirDeferred.resolve();
        $rootScope.$apply();

        createFolderSpy.should.have.been.calledThrice;
        createFolderSpy.should.have.been.calledWith('/a');
        createFolderSpy.should.have.been.calledWith('/a/b');
        createFolderSpy.should.have.been.calledWith('/a/b/c');
      });
    });

    describe('getByPath', function () {
      it('returns the subtree representing the directory identified by path', function () {
        var folder = ramlRepository.getByPath('/folder');

        folder.children.length.should.equals(2);
        folder.getFiles().length.should.equals(1);
        folder.getDirectories().length.should.equals(1);

        var empty = ramlRepository.getByPath('/folder/subfolder', rootDirectory);
        empty.children.length.should.equals(0);
        empty.getFiles().length.should.equals(0);
        empty.getDirectories().length.should.equals(0);
      });

      it('returns undefined if the path is not found in the tree', function () {
        expect(ramlRepository.getByPath('/notFound', rootDirectory)).to.be.undefined;
        expect(ramlRepository.getByPath('/folder/notFound', rootDirectory.getDirectories()[0])).to.be.undefined;
      });
    });

    describe('removeDirectory', function () {
      var removeSpy, removeDeferred;

      beforeEach(function () {
        removeDeferred = $q.defer();
        removeSpy = sinon.stub(fileSystem, 'remove').returns(removeDeferred.promise);

        ramlRepository.removeDirectory(rootDirectory.getDirectories()[0]);
        removeDeferred.resolve();
      });

      it('should remove a folder and all of its children', function () {
        rootDirectory.children.length.should.equals(1);
        rootDirectory.getFiles().length.should.equals(1);
        rootDirectory.getDirectories().length.should.equals(0);
      });

      it('should remove a folder and its children from file system', function () {
        $rootScope.$apply();
        removeSpy.should.have.been.calledThrice;
      });

      it('should broadcast an event on success', function (done) {
        $rootScope.$on('event:raml-editor-directory-removed', function () {
          done();
        });
        $rootScope.$apply();
      });
    });

    describe('renameDirectory', function () {
      var folder;

      beforeEach(function () {
        folder = rootDirectory.getDirectories()[0];
        sinon.stub(fileSystem, 'rename').returns($q.when());
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
        folder.getFiles()[0].path.should.equals('/foo/test.raml');
        folder.getDirectories().length.should.equals(1);
        folder.getDirectories()[0].path.should.equals('/foo/subfolder');
      });
    });

    describe('creating a new file in a folder', function () {
      var createDirDeferred, createFolderSpy;

      beforeEach(function () {
        createDirDeferred = $q.defer();
        createFolderSpy = sinon.stub(fileSystem, 'createFolder').returns(createDirDeferred.promise);
      });

      it('should give the correct tree structure', function () {
        var folder = rootDirectory.getDirectories()[0];

        ramlRepository.generateFile(rootDirectory, 'new.raml');
        ramlRepository.generateFile(folder, 'another.raml');

        $rootScope.$apply();

        rootDirectory.children.length.should.equals(3);
        rootDirectory.getFiles().length.should.equals(2);
        rootDirectory.getFiles()[1].path.should.equals('/new.raml');
        rootDirectory.getDirectories().length.should.equals(1);

        folder.children.length.should.equals(3);
        folder.getFiles().length.should.equals(2);
        folder.getFiles()[0].path.should.equals('/folder/another.raml');
        folder.getDirectories().length.should.equals(1);
      });

      it('should create a nested file in the tree structure', function () {
        var folder = rootDirectory.getDirectories()[0];

        ramlRepository.generateFile(folder, 'a/b/c/test.raml');

        createDirDeferred.resolve();
        $rootScope.$apply();

        createFolderSpy.should.have.been.calledThrice;
        createFolderSpy.should.have.been.calledWith(folder.path + '/a');
        createFolderSpy.should.have.been.calledWith(folder.path + '/a/b');
        createFolderSpy.should.have.been.calledWith(folder.path + '/a/b/c');

        var aDir = ramlRepository.getByPath(folder.path + '/a');
        var bDir = aDir.children[0];
        var cDir = bDir.children[0];
        var file = cDir.children[0];

        aDir.name.should.equal('a');
        aDir.type.should.equal('directory');
        aDir.children.length.should.equal(1);

        bDir.name.should.equal('b');
        bDir.type.should.equal('directory');
        bDir.children.length.should.equal(1);

        cDir.name.should.equal('c');
        cDir.type.should.equal('directory');
        cDir.children.length.should.equal(1);

        file.name.should.equal('test.raml');
        file.type.should.equal('file');
      });
    });

    describe('renaming a file in a folder', function () {
      it('should not change tree structure', function () {
        var folder = rootDirectory.getDirectories()[0];
        sinon.stub(fileSystem, 'rename').returns($q.when());

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
    beforeEach(function () {
      // set up root directory for testing
      // Arrange
      var directoryDeferred = $q.defer();
      sinon.stub(fileSystem, 'directory').returns(directoryDeferred.promise);

      var files = {
        path: '/',
        name: '/',
        type: 'folder',
        children: [
          {
            path: '/example.raml',
            name: 'example.raml',
            type: 'file'
          },
          {
            path: '/folder',
            name: 'folder',
            children: [
              {
                path: '/folder/test.raml',
                name: 'test.raml',
                type: 'file',
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

      // Act
      ramlRepository.loadDirectory();

      directoryDeferred.resolve(files);
      $rootScope.$apply();
    });

    describe('when file is nonpersistent', function () {
      beforeEach(function () {
        sinon.spy(fileSystem, 'remove');

        ramlRepository.removeFile({
          path: '/file.raml',
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
      var fileMock = {path:'/mock.raml'};

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
      var fileMock = {persisted: true, path:'/mock.raml'};
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
        path: '/example.raml',
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
        path: '/example.raml',
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

  describe('generateFile', function () {
    var broadcastSpy, file, snippet, $rootScope, ramlSnippets;

    beforeEach(inject(function ($injector) {
      $rootScope   = $injector.get('$rootScope');
      ramlSnippets = $injector.get('ramlSnippets');
    }));

    beforeEach(function() {
      snippet = 'This is an empty RAML file content';
      sinon.stub(ramlSnippets, 'getEmptyRaml').returns(snippet);

      broadcastSpy = sandbox.spy($rootScope, '$broadcast');

      var directoryDeferred = $q.defer();
      sinon.stub(fileSystem, 'directory').returns(directoryDeferred.promise);
      var success = sinon.stub();
      var files = {
        path: '/',
        name: '/',
        children: []
      };

      // Act
      ramlRepository.loadDirectory('/').then(success);
      directoryDeferred.resolve(files);
      $rootScope.$apply();

      // Assert
      var directory = success.firstCall.args[0];

      ramlRepository.generateFile(directory, 'untitled.raml')
        .then(function (createdFile) {
          file = createdFile;
        });

      $rootScope.$apply();
    });

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

      var rootDir = {
        path: '/',
        name: '/',
        children: [],
        metaChildren: []
      };

      sinon.stub(ramlRepository, 'saveFile').returns($q.when({contents: JSON.stringify(meta)}));
      sinon.stub(ramlRepository, 'getParent').returns(rootDir);
      ramlRepository.saveMeta({path: path}, meta).then(success);

      $rootScope.$apply();

      ramlRepository.saveFile.should.have.been.called;
      ramlRepository.getParent.should.have.been.called;
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
    var directory;

    beforeEach(inject(function($rootScope) {
      var directoryDeferred = $q.defer();
      sinon.stub(fileSystem, 'directory').returns(directoryDeferred.promise);
      var success = sinon.stub();
      var files = {
        path: '/',
        name: '/',
        children: []
      };

      // Act
      ramlRepository.loadDirectory('/').then(success);
      directoryDeferred.resolve(files);
      $rootScope.$apply();

      // Assert
      directory = success.firstCall.args[0];
    }));

    it('should have a proper extension value extracted from name', function (done) {
      ramlRepository.generateFile(directory, 'api.raml')
        .then(function (file) {
          file.should.have.property('extension', 'raml');

          return done();
        });

      $rootScope.$apply();
    });

    it('should not extract an extension from name started with a dot', function (done) {
      ramlRepository.generateFile(directory, '.raml')
        .then(function (file) {
          file.should.not.have.property('extension');

          return done();
        });

      $rootScope.$apply();
    });
  });
});
