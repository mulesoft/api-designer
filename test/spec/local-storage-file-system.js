'use strict';

describe('Local Storage File System', function () {
  var $timeout;
  var localStorageFileSystem;
  var LOCAL_PERSISTENCE_KEY;

  beforeEach(module('fs'));
  beforeEach(inject(function ($injector) {
    LOCAL_PERSISTENCE_KEY = $injector.get('LOCAL_PERSISTENCE_KEY');
    $timeout = $injector.get('$timeout');
    localStorageFileSystem = $injector.get('localStorageFileSystem');
  }));
  beforeEach(function () {
    localStorage.clear();

    localStorage.setItem(LOCAL_PERSISTENCE_KEY + './', '{ "path": "/", "name": "", "type": "folder" }');
    localStorage.setItem(LOCAL_PERSISTENCE_KEY + './folder', '{ "path": "/folder", "name": "folder", "type": "folder" }');
    localStorage.setItem(LOCAL_PERSISTENCE_KEY + './folder/subFolderA', '{ "path": "/folder/subFolderA", "name": "subFolderA", "type": "folder" }');
    localStorage.setItem(LOCAL_PERSISTENCE_KEY + './folder/subFolderB', '{ "path": "/folder/subFolderB", "name": "subFolderB", "type": "folder" }');

    localStorage.setItem(LOCAL_PERSISTENCE_KEY + './example.raml', '{ "path": "/example.raml", "name": "example.raml", "type": "file" }');
    localStorage.setItem(LOCAL_PERSISTENCE_KEY + './folder/example.raml', '{ "path": "/folder/example.raml", "name": "example.raml", "type": "file"}');

    localStorage.setItem(LOCAL_PERSISTENCE_KEY + './emptyFolder', '{ "path": "/emptyFolder", "name": "emptyFolder", "type": "folder" }');
  });

  describe('when empty', function () {

    describe('list', function () {
      it('should return no entries', function () {
        localStorage.clear();
        localStorageFileSystem.list('/')
          .then(function (entries) {
            entries.should.have.length(0);
          }); //success

        $timeout.flush();
      });
    });

    describe('load', function () {
      it('should be rejected', function () {
        localStorageFileSystem.load('/file')
          .then(function () {}, function (error) {
            error.should.be.equal('file with path="/file" does not exist');
          }); //success/error

        $timeout.flush();
      });
    });

    describe('remove', function () {
      it('should be rejected', function () {
        localStorageFileSystem.remove('/file')
          .then(function () {}, function (error) {
            error.should.be.equal('file with path="/file" does not exist');
          }); //success/error

        $timeout.flush();
      });
    });
  });

  describe('when trying to save a file', function () {
    var name = 'created-at-' + Date.now();
    var folder = '/';
    var path = folder + name;
    var content = 'content';

    describe('save', function () {
      it('should store file successfully', function () {
        localStorageFileSystem.save({
          path: path,
          name: name,
          content: content
        }).then(function () {}, function (error) {
            throw error;
          });//success,error

        $timeout.flush();
      });
    });

    describe('list', function () {
      it('should list recently saved file among the entries', function () {
        localStorageFileSystem.save({
          path: path,
          name: name,
          content: content
        }).then(function () {
          localStorageFileSystem.list(folder).then(function (entries) {
            entries.should.have.length(4);
            //entries[0].path.should.be.equal(path + name);
          });
        }, function (error) {
            throw error;
          });//success,error

        $timeout.flush();
        $timeout.flush();
      });
    });

    describe('load', function () {
      it('should return recently saved file', function () {
        localStorageFileSystem.load(path).then(function (loadedContent) {
          loadedContent.should.be.equal(content);
        });

        $timeout.flush();
      });
    });

    describe('remove', function () {
      it('should remove recently saved file', function () {
        localStorageFileSystem.remove(path).then(function () {
          localStorageFileSystem.list(path).then(function (entries) {
            entries.should.have.length(0);
          });
        });

        localStorageFileSystem.remove(path);

        $timeout.flush();
      });
    });
  });

  describe('when using folders', function () {

    describe('list', function () {
      it('should list files and folders for root folder', function (done) {

        localStorageFileSystem.list('/').then(function (entries) {
          entries.should.have.length(3);
          // entries.should.be.deep.equal(files.map(function (file) {
          //   return file.path;
          // }));
          done();
        });

        $timeout.flush();
      });

      it('should list files and folders for sub folders', function (done) {

        localStorageFileSystem.list('/folder').then(function (entries) {
          entries.length.should.equal(3);
          // entries.should.be.deep.equal(files.map(function (file) {
          //   return file.path;
          // }));
          done();
        });

        $timeout.flush();
      });
    });

    describe('create folder', function () {
      it('should prevent creation of duplicated folders', function () {
        //Arrange
        var error = sinon.stub();
        localStorageFileSystem.createFolder('/folder').then(function () {}, error);
        //Act
        $timeout.flush();
        //Assert
        error.should.have.been.calledOnce;
      });

      it('should create folders at root level', function (done) {
        localStorageFileSystem.createFolder('/newFolder').then(function () {
          localStorageFileSystem.list('/').then(function (entries) {
            entries.should.have.length(4);
            //entries.path.indexOf('/newfolder').should.not.be.equal(-1);
            done();
          });
        });

        $timeout.flush();
        $timeout.flush();
      });

      it('should prevent users from creating folders on any random path', function() {
        //Arrange
        var error = sinon.stub();
        localStorageFileSystem.createFolder('/newFolder/newSubFolder').then(function () {}, error);
        //Act
        $timeout.flush();
        //Assert
        error.called.should.be.ok;
      });

      it('should support nested folders', function (done) {
        localStorageFileSystem.createFolder('/folder/newSubFolder').then(function () {
          localStorageFileSystem.list('/folder', true).then(function (entries) {
            entries.length.should.equal(4);
            //entries.indexOf('/newfolder/lala').should.not.be.equal(-1);
            done();
          });
        });

        $timeout.flush();
        $timeout.flush();
      });

      it('should prevent users from creating folders that are named as existing files', function () {
        //Arrange
        var error = sinon.stub();
        localStorageFileSystem.createFolder('/folder/example.raml').then(function () {}, error);
        //Act
        $timeout.flush();
        //Assert
        error.called.should.be.ok;
      });
    });

    describe('save', function () {
      it('should fail to save files with the same name as a folder', function () {
        //Arrange
        var error = sinon.stub();
        localStorageFileSystem.save({
          path: '/',
          name: 'folder',
          content: ''
        }).then(function () {}, error);
        //Act
        $timeout.flush();
        //Assert
        error.called.should.be.ok;
      });

      it('should work to save files inside a folder', function () {
        localStorageFileSystem.save({
          path: '/folder/exampleA.raml',
          name: 'exampleA.raml',
          content: ''
        }).then(
          function () {},
          function (error) {
            throw error;
          });//success,error

        $timeout.flush();
      });

      it('should throw an error if folder is not created before saving file', function () {
        //Arrange
        var error = sinon.stub();
        localStorageFileSystem.save({
          path: '/randomFolder/exampleA.raml',
          name: 'exampleA.raml',
          content: ''
        }).then(function () {}, error);
        //Act
        $timeout.flush();
        //Assert
        error.called.should.be.ok;
      });
    });

    describe('load', function () {
      it('should not allow to load a folder', function () {
        var error = sinon.stub();
        localStorageFileSystem.load('/folder').then(function(){}, error);

        $timeout.flush();
        error.called.should.be.ok;
      });
    });

    describe('remove', function () {
      it('should not allow the removal of folders with childs', function(){
        var error = sinon.stub();
        localStorageFileSystem.remove('/folder').then(function(){}, error);
        $timeout.flush();
        error.called.should.be.ok;
      });

      it('should remove an empty folder successfully', function () {
        localStorageFileSystem.remove('/emptyFolder').then(
          function () {},
          function (error) {
            throw error;
          });
        $timeout.flush();
      });
    });
  });
});
