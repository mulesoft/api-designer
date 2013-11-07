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
    describe('directory', function () {
      it('should return no entries', function () {
        mockFileSystem.directory('/').then(function (entries) {
          entries.should.have.length(0);
        });

        $timeout.flush();
      });
    });

    describe('load', function () {
      it('should be rejected', function () {
        mockFileSystem.load('/', 'file').then(function () {}, function (error) {
          error.should.be.equal('Error reading file');
        });

        $timeout.flush();
      });
    });

    describe('remove', function () {
      it('should be rejected', function () {
        mockFileSystem.remove('/', 'file').then(function () {}, function (error) {
          error.should.be.equal('Error reading file');
        });

        $timeout.flush();
      });
    });
  });

  describe('when trying to save a file', function () {
    var path = '/';
    var name = 'created-at-' + Date.now();
    var content = 'content';

    describe('save', function () {
      it('should store file successfully', function () {
        mockFileSystem.save(path, name, content).then(function () {}, function (error) {
          throw error;
        });

        $timeout.flush();
      });
    });

    describe('directory', function () {
      it('should list recently saved file among the entries', function () {
        mockFileSystem.directory(path).then(function (entries) {
          entries.should.have.length(1);
          entries[0].should.be.equal(name);
        });

        $timeout.flush();
      });
    });

    describe('load', function () {
      it('should return recently saved file', function () {
        mockFileSystem.load(path, name).then(function (loadedContent) {
          loadedContent.should.be.equal(content);
        });

        $timeout.flush();
      });
    });

    describe('remove', function () {
      it('should remove recently saved file', function () {
        mockFileSystem.remove(path, name).then(function () {
          mockFileSystem.directory(path).then(function (entries) {
            entries.should.have.length(0);
          });
        });

        mockFileSystem.remove(path, 'name');

        $timeout.flush();
      });
    });
  });
});
