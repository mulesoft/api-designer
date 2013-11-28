'use strict';


describe('remoteFileSystem', function () {
  var $rootScope;
  var tokenBuilderMock;
  var remoteFileSystem;

  beforeEach(module('fs'));
  beforeEach(function () {
    module(function ($provide) {
      $provide.value('shouldAutoRunInit', false);
      $provide.factory('requestTokenBuilder', function () {
        tokenBuilderMock = {};
        ['host', 'method', 'path', 'data', 'success', 'error', 'call'].forEach(function (name) {
          tokenBuilderMock[name] = sinon.stub().returns(tokenBuilderMock);
        });

        return function () {
          return tokenBuilderMock;
        };
      });
    });
  });

  describe('list', function () {
    var files;

    beforeEach(inject(function ($injector) {
      $rootScope = $injector.get('$rootScope');
      remoteFileSystem = $injector.get('remoteFileSystem');
      files = $injector.get('files');
    }));

    it('should generate the right request', function () {
      remoteFileSystem.list('/');

      tokenBuilderMock.method.calledWith('GET').should.be.true;
      tokenBuilderMock.path.calledWith('files').should.be.true;
    });

    it('should populate files object', function (done) {
      var data = [
        {entry: 'my_file',      content: 'some raml'},
        {entry: 'another_file', content: 'another raml file'}
      ];

      Object.keys(files).length.should.be.equal(0);

      remoteFileSystem.list('/').then(function (data) {
        Object.keys(files).length.should.be.equal(2);
        Object.keys(files).should.be.deep.equal(data);

        done();
      });

      tokenBuilderMock.success.firstCall.args[0](data);
      $rootScope.$apply();
    });

    it('should call the error function on error', function (done) {
      remoteFileSystem.list('/').then(
        // success
        function () {},

        // failure
        function () {
          done();
        }
      );

      tokenBuilderMock.error.firstCall.args[0]();
      $rootScope.$apply();
    });
  });

  describe('load', function () {
    var files;

    beforeEach(function () {
      files = {myfile: {id: 'myid'}};
      module(function ($provide) {
        $provide.value('files', files);
      });
    });

    beforeEach(inject(function ($injector) {
      $rootScope = $injector.get('$rootScope');
      remoteFileSystem = $injector.get('remoteFileSystem');
    }));

    it('should generate the right request', function () {
      remoteFileSystem.load('/', 'myfile');

      tokenBuilderMock.method.calledWith('GET');
      tokenBuilderMock.path.calledWith('files', 'myid');
    });

    it('should call the success callback with the content of the file', function (done) {
      var file = {
        entry  : 'myfile',
        content: 'this is the content of the file'
      };

      remoteFileSystem.load('/', 'myfile').then(function (data) {
        data.should.be.equal(file.content);
        done();
      });

      tokenBuilderMock.success.firstCall.args[0](file);
      $rootScope.$apply();
    });

    it('should call the error callback on error', function (done) {
      remoteFileSystem.load('/', 'myfile').then(
        // success
        function () {},

        // failure
        function () {
          done();
        }
      );

      tokenBuilderMock.error.firstCall.args[0]();
      $rootScope.$apply();
    });
  });

  describe('remove', function () {
    var files;

    beforeEach(function () {
      files = {myfile: {id: 'myid'}};
      module(function ($provide) {
        $provide.value('files', files);
      });
    });

    beforeEach(inject(function ($injector) {
      $rootScope = $injector.get('$rootScope');
      remoteFileSystem = $injector.get('remoteFileSystem');
    }));

    it('should generate the right request', function () {
      remoteFileSystem.remove('/', 'myfile');

      tokenBuilderMock.method.calledWith('DELETE');
      tokenBuilderMock.path.calledWith('files', 'myid');
    });

    it('should call the error callback if file not found locally', function (done) {
      remoteFileSystem.remove('/', 'filedoesnotexist').then(
        // success
        function () {},

        // failure
        function () {
          ['method', 'path', 'success', 'error', 'call'].forEach(function (name) {
            tokenBuilderMock[name].called.should.be.equal(false);
          });

          done();
        }
      );

      $rootScope.$apply();
    });

    it('should call the success callback and remove the file from files on success', function (done) {
      var FILE_NAME = 'myfile';

      remoteFileSystem.remove('/', FILE_NAME).then(function () {
        should.not.exist(files[FILE_NAME]);
        done();
      });

      tokenBuilderMock.success.firstCall.args[0]();
      $rootScope.$apply();
    });

    it('should call the error callback and preserve the file on error', function (done) {
      var FILE_NAME = 'myfile';

      remoteFileSystem.remove('/', FILE_NAME).then(
        // success
        function () {},

        // failure
        function () {
          files[FILE_NAME].should.exist;
          done();
        }
      );

      tokenBuilderMock.error.firstCall.args[0]();
      $rootScope.$apply();
    });
  });

  describe('save', function () {
    var files;

    beforeEach(function () {
      files = {myfile: {id: 'myid'}};
      module(function ($provide) {
        $provide.value('files', files);
      });
    });

    beforeEach(inject(function ($injector) {
      $rootScope = $injector.get('$rootScope');
      remoteFileSystem = $injector.get('remoteFileSystem');
    }));

    it('should generate the right request for new file', function () {
      var file = {entry: 'newfile', content: 'some content'};
      remoteFileSystem.save('/', file.entry, file.content);

      tokenBuilderMock.method.calledWith('POST');
      tokenBuilderMock.path.calledWith('files');
      tokenBuilderMock.data.calledWith(file);
    });

    it('should generate the right request for existing file', function () {
      var file = {entry: 'myfile', content: 'some content'};
      remoteFileSystem.save('/', file.entry, file.content);

      tokenBuilderMock.method.calledWith('PUT');
      tokenBuilderMock.path.calledWith('files', 'myid');
      tokenBuilderMock.data.calledWith(file);
    });

    it('should call the success callback on success on existing file', function (done) {
      remoteFileSystem.save('/', 'myfile', 'some content').then(function () {
        done();
      });

      tokenBuilderMock.success.firstCall.args[0]();
      $rootScope.$apply();
    });

    it('should call the error callback on error on existing file', function (done) {
      remoteFileSystem.save('/', 'myfile', 'some content').then(
        // success
        function () {},

        // failure
        function () {
          done();
        }
      );

      tokenBuilderMock.error.firstCall.args[0]();
      $rootScope.$apply();
    });

    it('should call the success callback on success on new file', function (done) {
      var id = 'newfileid';
      var fileName = 'newfile';
      var content = 'some content';

      remoteFileSystem.save('/', fileName, content).then(function () {
        files[fileName].content.should.be.equal(content);
        done();
      });

      tokenBuilderMock.success.firstCall.args[0](JSON.stringify(id));
      $rootScope.$apply();
    });

    it('should call the error callback on error on new file', function (done) {
      var fileName = 'newfile';

      remoteFileSystem.save('/', fileName, 'some content').then(
        // success
        function () {},

        // failure
        function () {
          should.not.exist(files[fileName]);
          done();
        }
      );

      tokenBuilderMock.error.firstCall.args[0]();
      $rootScope.$apply();
    });

    it('should not lose references if callbacks arrive in different order', function (done) {
      var success1;
      var success2;
      var id = 'newfileid';
      var content1 = 'some content';
      var content2 = 'some other content';
      var callback2Executed = false;
      var fileName1 = 'newfile1';
      var fileName2 = 'newfile2';

      remoteFileSystem.save('/', 'newfile1', content1).then(function () {
        files[fileName1].content.should.be.equal(content1);
        files[fileName2].content.should.be.equal(content2);

        callback2Executed.should.be.equal(true);

        done();
      });

      remoteFileSystem.save('/', 'newfile2', content2).then(function () {
        callback2Executed = true;
      });

      success2 = tokenBuilderMock.success.getCall(1).args[0];
      success2(JSON.stringify(id + '2'));

      success1 = tokenBuilderMock.success.getCall(0).args[0];
      success1(JSON.stringify(id + '1'));

      $rootScope.$apply();
    });
  });
});
