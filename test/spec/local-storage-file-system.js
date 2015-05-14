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
    localStorage.setItem(LOCAL_PERSISTENCE_KEY + './example.raml', '{ "path": "/example.raml", "name": "example.raml", "type": "file" }');
    localStorage.setItem(LOCAL_PERSISTENCE_KEY + './emptyFolder', '{ "path": "/emptyFolder", "name": "emptyFolder", "type": "folder" }');
    localStorage.setItem(LOCAL_PERSISTENCE_KEY + './folder', '{ "path": "/folder", "name": "folder", "type": "folder" }');
    localStorage.setItem(LOCAL_PERSISTENCE_KEY + './folder/example.raml', '{ "path": "/folder/example.raml", "name": "example.raml", "type": "file"}');
    localStorage.setItem(LOCAL_PERSISTENCE_KEY + './folder/subFolderA', '{ "path": "/folder/subFolderA", "name": "subFolderA", "type": "folder" }');
    localStorage.setItem(LOCAL_PERSISTENCE_KEY + './folder/subFolderA/example.raml', '{ "path": "/folder/subFolderA/example.raml", "name": "example.raml", "type": "file"}');
    localStorage.setItem(LOCAL_PERSISTENCE_KEY + './folder/subFolderB', '{ "path": "/folder/subFolderB", "name": "subFolderB", "type": "folder" }');
    localStorage.setItem(LOCAL_PERSISTENCE_KEY + './folder/subFolderB/subFolderB', '{ "path": "/folder/subFolderB/subFolderB", "name": "subFolderB", "type": "file" }');
  });

  describe('when empty', function () {

    describe('list', function () {
      it('should return root with no entries', function () {
        localStorage.clear();
        localStorageFileSystem.directory('/')
          .then(function (folder) {
            folder.should.not.be.null;
            folder.children.should.have.length(0);
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
        localStorageFileSystem.save(path, content).then(
          function () {},
          function (error) {
            throw error;
          });//success,error

        $timeout.flush();
      });

      it('should allow files to have the same name as its parent', function () {
        localStorageFileSystem.save('/folder/folder', content)
          .then( function () {
            return localStorageFileSystem.directory('/');
          })
          .then(function (folder) {
            folder.should.not.be.null;
            folder.children.should.have.length(3);
            return localStorageFileSystem.directory('/folder');
          })
          .then(function (folder) {
            folder.should.not.be.null;
            folder.children.should.have.length(4);
            hasPath(folder.children, '/folder/folder').should.be.ok;
          }, function (error) {
            throw error;
          });//success,error

        $timeout.flush();
        $timeout.flush();
      });
    });

    describe('list', function () {
      it('should list recently saved file among the entries', function () {
        localStorageFileSystem.save(path, content)
          .then( function () {
            return localStorageFileSystem.directory(folder);
          })
          .then(function (folder) {
            folder.should.not.be.null;
            folder.children.should.have.length(4);
            hasPath(folder.children, path).should.be.ok;
          }, function (error) {
            throw error;
          });

        $timeout.flush();
        $timeout.flush();
      });
    });

    describe('load', function () {
      it('should return recently saved file', function () {
        localStorageFileSystem.load(path)
          .then(function (loadedContent) {
            loadedContent.should.be.equal(content);
          });

        $timeout.flush();
      });
    });

    describe('remove', function () {
      it('should remove recently saved file', function () {
        localStorageFileSystem.remove(path)
          .then(function () {
            return localStorageFileSystem.directory(folder);
          })
          .then(function (folder) {
            folder.should.not.be.null;
            folder.children.should.have.length(3);
            hasPath(folder.children, path).should.not.be.ok;
          });

        $timeout.flush();
        $timeout.flush();
      });

      it('should remove correctly when the file has the same name as its parents', function () {
        localStorage.setItem(LOCAL_PERSISTENCE_KEY + './folder/folder', '{ "path": "/folder/folder", "name": "folder", "type": "file" }');

        localStorageFileSystem.directory('/folder')
          .then(function (folder) {
            folder.should.not.be.null;
            folder.children.should.have.length(4);
            hasPath(folder.children, '/folder/folder').should.be.ok;
          });

        $timeout.flush();

        localStorageFileSystem.remove('/folder/folder')
          .then(function () {
            return localStorageFileSystem.directory('/folder');
          })
          .then(function (folder) {
            folder.should.not.be.null;
            folder.children.should.have.length(3);
            hasPath(folder.children, '/folder/folder').should.not.be.ok;
          });

        $timeout.flush();
        $timeout.flush();
      });

      it('should remove only the folder when it has the same prefix as a file', function () {
        localStorage.setItem(LOCAL_PERSISTENCE_KEY + './foo', '{ "path": "/foo", "name": "foo", "type": "folder" }');
        localStorage.setItem(LOCAL_PERSISTENCE_KEY + './foo.raml', '{ "path": "/foo.raml", "name": "foo.raml", "type": "file" }');

        localStorageFileSystem.remove('/foo')
          .then(function () {
            return localStorageFileSystem.directory('/');
          })
          .then(function (folder) {
            hasPath(folder.children, '/foo.raml').should.be.ok;
          });

        $timeout.flush();
        $timeout.flush();
      });
    });

    describe('rename', function (){
      it('should allow renaming of recently saved files', function (){
        var destination = folder + 'renamed-at-' + Date.now();

        localStorageFileSystem.save(path, content)
          .then(function () {
            return localStorageFileSystem.rename(path, destination);
          })
          .then(function(){
            return localStorageFileSystem.directory(folder);
          })
          .then(function(folder){
            folder.should.not.be.null;
            folder.children.should.have.length(4);
            hasPath(folder.children, destination).should.be.ok;
            hasPath(folder.children, path).should.not.be.ok;
          });

        $timeout.flush();
        $timeout.flush();
        $timeout.flush();
      });
    });
  });

  describe('when using folders', function () {

    describe('list', function () {
      it('should list files and folders for root folder', function (done) {
        localStorageFileSystem.directory('/')
          .then(function (folder) {
            folder.should.not.be.null;
            folder.children.should.have.length(3);

            done();
          });

        $timeout.flush();
      });

      it('should list files and folders for sub folders', function (done) {
        localStorageFileSystem.directory('/folder')
          .then(function (folder) {
            folder.should.not.be.null;
            folder.children.length.should.equal(3);
            hasPath(folder.children, '/folder/example.raml').should.be.ok;
            hasPath(folder.children, '/folder/subFolderA').should.be.ok;

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
          localStorageFileSystem.directory('/').then(function (folder) {
            folder.should.not.be.null;
            folder.children.should.have.length(4);
            hasPath(folder.children, '/newFolder').should.be.ok;
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
          localStorageFileSystem.directory('/folder').then(function (folder) {
            folder.should.not.be.null;
            folder.children.length.should.equal(4);
            hasPath(folder.children, '/folder/newSubFolder').should.be.ok;

            done();
          });
        });

        $timeout.flush();
        $timeout.flush();
      });

      it('should allow a nested folder to have the same name with its parent', function (done) {
        localStorageFileSystem.createFolder('/folder/folder')
          .then(function () {
            return localStorageFileSystem.directory('/');
          })
          .then(function (root) {
            root.should.not.be.null;
            root.children.length.should.equal(3);

            return localStorageFileSystem.directory('/folder');
          })
          .then(function (folder) {
            folder.should.not.be.null;
            folder.children.length.should.equal(4);
            hasPath(folder.children, '/folder/folder').should.be.ok;

            done();
          });

        $timeout.flush();
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
        localStorageFileSystem.save('/folder', '').then(function () {}, error);
        //Act
        $timeout.flush();
        //Assert
        error.called.should.be.ok;
      });

      it('should work to save files inside a folder', function () {
        localStorageFileSystem.save('/folder/exampleA.raml', '').then(
          function () {},
          function (error) {
            throw error;
          });

        $timeout.flush();
      });

      it('should throw an error if folder is not created before saving file', function () {
        //Arrange
        var error = sinon.stub();
        localStorageFileSystem.save('/randomFolder/exampleA.raml', '').then(
          function () {}, error);
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

    describe('rename', function () {

      it('should move a file to a different folder', function(){
        var error = sinon.spy();

        localStorageFileSystem.rename('/example.raml', '/emptyFolder/example.raml').then(function(){
          localStorageFileSystem.directory('/').then(function(folder){
            folder.should.not.be.null;
            folder.children.should.have.length(2);
            hasPath(folder.children, '/example.raml').should.not.be.ok;

            localStorageFileSystem.directory('/emptyFolder').then(function(folder){
              folder.should.not.be.null;
              folder.children.should.have.length(1);
              hasPath(folder.children, '/emptyFolder/example.raml').should.be.ok;
            }, error);
          }, error);
        }, error);

        $timeout.flush();
        $timeout.flush();
        $timeout.flush();

        error.called.should.not.be.ok;
      });

      it('should move a complete folder tree', function(){
        var error = sinon.spy();

        localStorageFileSystem.rename('/folder', '/renamedFolder').then(function(){
          localStorageFileSystem.directory('/folder').then(function(folder){
            expect(folder).to.be.null;

            localStorageFileSystem.directory('/renamedFolder').then(function(folder){
              folder.should.not.be.null;
              folder.children.should.have.length(3);

              localStorageFileSystem.directory('/renamedFolder/subFolderA').then(function(folder){
                folder.should.not.be.null;
                folder.children.should.have.length(1);
              }, error);
            },error);
          }, error);
        }, error);

        $timeout.flush();
        $timeout.flush();
        $timeout.flush();
        $timeout.flush();

        error.called.should.not.be.ok;
      });

      it('should not rename a file when there is a folder with the same name', function(){
        var error = sinon.spy();

        localStorageFileSystem.rename('/example.raml', '/folder').then(function(){}, error);

        $timeout.flush();
        error.called.should.be.ok;
      });

      it('should not rename a folder when there is a file with the same name', function(){
        var error = sinon.spy();

        localStorageFileSystem.rename('/folder', '/example.raml').then(function(){}, error);

        $timeout.flush();
        error.called.should.be.ok;
      });

      it('should not move files into unexisting paths', function(){
        var error = sinon.spy();

        localStorageFileSystem.rename('/example.raml', '/somethingRandom/example.raml').then(function(){}, error);

        $timeout.flush();
        error.called.should.be.ok;
      });

      it('should not move folders into unexisting paths', function(){
        var error = sinon.spy();

        localStorageFileSystem.rename('/folder', '/somethingRandom/folder').then(function(){}, error);

        $timeout.flush();
        error.called.should.be.ok;
      });
    });
  });

  function hasPath(entries, path) {
    for(var i = 0; i < entries.length; i++) {
      if(entries[i].path === path) {
        return true;
      }
    }
    return false;
  }

});
