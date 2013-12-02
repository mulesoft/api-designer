'use strict';

describe('mockFileSystem', function () {
  var $timeout;
  var mockFileSystem;

  beforeEach(module('fs'));
  beforeEach(inject(function ($injector) {
    $timeout = $injector.get('$timeout');
    mockFileSystem = $injector.get('mockFileSystem');
  }));

  describe('when empty', function () {
    describe('list', function () {
      it('should return no entries', function () {
        mockFileSystem.list('/').then(function (entries) {
          entries.should.have.length(0);
        });

        $timeout.flush();
      });
    });

    describe('load', function () {
      it('should be rejected', function () {
        mockFileSystem.load('/file').then(function () {}, function (error) {
          error.should.be.equal('file with path="/file" does not exist');
        });

        $timeout.flush();
      });
    });

    describe('remove', function () {
      it('should be rejected', function () {
        mockFileSystem.remove('/file').then(function () {}, function (error) {
          error.should.be.equal('file with path="/file" does not exist');
        });

        $timeout.flush();
      });
    });
  });

  describe('when trying to save a file', function () {
    var path = '/created-at-' + Date.now();
    var content = 'content';

    describe('save', function () {
      it('should store file successfully', function () {
        mockFileSystem.save(path, content).then(function () {}, function (error) {
          throw error;
        });

        $timeout.flush();
      });
    });

    describe('list', function () {
      it('should list recently saved file among the entries', function () {
        mockFileSystem.list(path).then(function (entries) {
          entries.should.have.length(1);
          entries[0].should.be.equal(path);
        });

        $timeout.flush();
      });
    });

    describe('load', function () {
      it('should return recently saved file', function () {
        mockFileSystem.load(path).then(function (loadedContent) {
          loadedContent.should.be.equal(content);
        });

        $timeout.flush();
      });
    });

    describe('remove', function () {
      it('should remove recently saved file', function () {
        mockFileSystem.remove(path).then(function () {
          mockFileSystem.list(path).then(function (entries) {
            entries.should.have.length(0);
          });
        });

        mockFileSystem.remove(path);

        $timeout.flush();
      });
    });
  });

  describe('when using folders', function () {
    var filesForMockFileSystem;
    beforeEach(inject(function ($injector) {
      filesForMockFileSystem = [];
      $injector.get('filesForMockFileSystem', filesForMockFileSystem);
    }));

    describe('list', function () {
      it('should not list folders if "includeFolders" parameter is not set', function () {
        var files = [
          {path: '/folder/path2', name: 'myfile', content: 'some content'},
          {path: '/', name: 'myfile2', content: 'some other content'}
        ];

        var folders = [
          {path: '/folder', isFolder: true},
          {path: '/folder/path', isFolder: true},
          {path: '/folder/path2', isFolder: true}
        ];

        filesForMockFileSystem = files.concat(folders);

        mockFileSystem.list('/').then(function (entries) {
          entries.should.be.deep.equal(files.map(function (file) {
            return file.path;
          }));
        });

        $timeout.flush();
      });

      it('should list folders if "includeFolders" is set', function () {
      });
    });

    describe('create folder', function () {
      it('should create folders than can be later listed', function () {
      });

      it('should prevent users from creating folders that already exist', function () {
      });

      it('should prevent users from creating folders that are named as existing files', function () {
      });
    });

    describe('save', function () {
      it('should fail to save files with the same name as a folder', function () {
      });
      it('should work to save files inside a folder', function () {
      });
      it('should throw an error if folder is not created before', function () {
      });
    });

    describe('load', function () {
      it('should not allow to load a folder', function () {
      });
    });
    describe('remove', function () {
      it('should remove an empty folder successfully', function () {
      });

      it('should remove a folder and its content if provided the "recursive" flag', function () {

      });
    });
  });
});
