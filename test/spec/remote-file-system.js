'use strict';

var describe = window.describe, beforeEach = window.beforeEach, it = window.it,
  inject = window.inject, should = window.should, remoteFileSystem,
  sinon = window.sinon;


describe('Remote File Persistence Service', function () {

  var tokenBuilderMock;
  
  beforeEach(module('fs'));
  beforeEach(function () {

    module(function ($provide) {
      $provide.value('shouldAutoRunInit', false);
      $provide.decorator('requestTokenBuilder', function ($delegate, requestBuilder) {
        var requestBuilderInstance = requestBuilder(),
        key;
        tokenBuilderMock = sinon.mock(requestBuilder);

        for (key in requestBuilderInstance) {
          var value = requestBuilderInstance[key];
          if (typeof value === 'function') {
            tokenBuilderMock[key] = sinon.stub().returns(tokenBuilderMock);
          }
        }

        return function () {
          return tokenBuilderMock;
        };
      });
    });
  });

  describe('directory', function () {
    var files;

    beforeEach(
      inject(function ($injector) {
        remoteFileSystem = $injector.get('remoteFileSystem');
        files = $injector.get('files');
      })
    );
    it('should generate the right request', function (done) {
      var success = function () {}, error = function () {};
      remoteFileSystem.directory('/', success, error);
      tokenBuilderMock.path.calledWith('files').should.be.equal(true);
      tokenBuilderMock.path.calledOnce.should.be.equal(true);
    
      tokenBuilderMock.success.calledOnce.should.be.equal(true);
    
      tokenBuilderMock.error.calledOnce.should.be.equal(true);
      tokenBuilderMock.error.calledWith(error).should.be.equal(true);
      
      tokenBuilderMock.call.calledOnce.should.be.equal(true);

      done();
    });
    
    it('provided success function should populate files object', function (done) {
      var success, data = [{entry: 'my_file', content: 'some raml'},
        {entry: 'another_file', content: 'another raml file'}], error = function () {};
        
      Object.keys(files).length.should.be.equal(0);

      remoteFileSystem.directory('/', function (data) {
        
        Object.keys(files).length.should.be.equal(2);

        Object.keys(files).should.be.deep.equal(data);

        files['my_file'].content.should.be.equal('some raml');
        files['another_file'].content.should.be.equal('another raml file');

        done();
      }, error);

      tokenBuilderMock.success.calledOnce.should.be.equal(true);
      success = tokenBuilderMock.success.getCall(0).args[0];
      success(data);
    });

    it('should call the error function if empty array returned', function (done) {
      var success;

      remoteFileSystem.directory('/', undefined, function () {
        done();
      });

      tokenBuilderMock.success.calledOnce.should.be.equal(true);
      success = tokenBuilderMock.success.getCall(0).args[0];
      success([]);
    });
    
    it('should call the error function on error', function (done) {
      var error;

      remoteFileSystem.directory('/', undefined, function () {
        done();
      });

      tokenBuilderMock.success.calledOnce.should.be.equal(true);
      error = tokenBuilderMock.error.getCall(0).args[0];
      error();

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
    beforeEach(
      inject(function ($injector) {
        remoteFileSystem = $injector.get('remoteFileSystem');
      })
    );

    it('should generate the right request', function (done) {
      var success = function () {}, error = function () {};
      remoteFileSystem.load('/', 'myfile', success, error);
      
      tokenBuilderMock.path.calledOnce.should.be.ok;
      tokenBuilderMock.path.calledWith('files', 'myid').should.be.ok;

      tokenBuilderMock.error.calledOnce.should.be.equal(true);
      tokenBuilderMock.error.calledWith(error).should.be.ok;
      
      tokenBuilderMock.call.calledOnce.should.be.equal(true);

      done();
    });
    
    it('should call the success callback with the content of the file', function (done) {
      var content = 'this is the content of the file', success;
      remoteFileSystem.load('/', 'myfile', function (data) {
        data.should.be.equal(content);
        done();
      }, undefined);

      tokenBuilderMock.success.calledOnce.should.be.equal(true);
      success = tokenBuilderMock.success.getCall(0).args[0];
      success({entry: 'myfile', content: content});
    });

    it('should call the error callback on error', function (done) {
      var error;
      
      remoteFileSystem.load('/', 'myfile', undefined, function () {
        done();
      });

      tokenBuilderMock.error.calledOnce.should.be.equal(true);
      error = tokenBuilderMock.error.getCall(0).args[0];
      error();
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
    beforeEach(
      inject(function ($injector) {
        remoteFileSystem = $injector.get('remoteFileSystem');
      })
    );

    it('should generate the right request', function (done) {
      var success = function () {}, error = function () {};
      remoteFileSystem.remove('/', 'myfile', success, error);
      
      tokenBuilderMock.method.calledOnce.should.be.ok;
      tokenBuilderMock.method.calledWith('DELETE').should.be.ok;
      
      tokenBuilderMock.path.calledOnce.should.be.ok;
      tokenBuilderMock.path.calledWith('files', 'myid').should.be.ok;
      
      tokenBuilderMock.success.calledOnce.should.be.equal(true);

      tokenBuilderMock.error.calledOnce.should.be.equal(true);
      tokenBuilderMock.error.calledWith(error).should.be.ok;
      
      tokenBuilderMock.call.calledOnce.should.be.equal(true);

      done();
    });
    
    it('should call the error callback if file not found locally', function (done) {
      var success = function () {};
      remoteFileSystem.remove('/', 'filedoesnotexist', success, function () {
        tokenBuilderMock.method.called.should.be.equal(false);
        tokenBuilderMock.path.called.should.be.equal(false);
        tokenBuilderMock.success.called.should.be.equal(false);
        tokenBuilderMock.error.calledOnce.should.be.equal(false);
        tokenBuilderMock.call.calledOnce.should.be.equal(false);

        done();
      });
      

    });
    
    it('should call the success callback and remove the file from files on success', function (done) {
      var success;

      remoteFileSystem.remove('/', 'myfile', function () {
        should.not.exist(files['myfile']);
        done();
      }, undefined);

      tokenBuilderMock.success.calledOnce.should.be.equal(true);
      success = tokenBuilderMock.success.getCall(0).args[0];
      success();
    });
    
    it('should call the error callback and preserve the file on error', function (done) {
      var error;

      remoteFileSystem.remove('/', 'myfile', undefined, function () {
        files['myfile'].should.be.ok;
        done();
      });
      
      tokenBuilderMock.success.calledOnce.should.be.equal(true);
      error = tokenBuilderMock.error.getCall(0).args[0];
      error();
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
    beforeEach(
      inject(function ($injector) {
        remoteFileSystem = $injector.get('remoteFileSystem');
      })
    );

    it('should generate the right request for existing file', function (done) {
      var success = function () {}, error = function () {};

      remoteFileSystem.save('/', 'myfile', 'some content', success, error);
      
      tokenBuilderMock.method.calledOnce.should.be.ok;
      tokenBuilderMock.method.calledWith('PUT').should.be.ok;
      
      tokenBuilderMock.path.calledOnce.should.be.ok;
      tokenBuilderMock.path.calledWith('files', 'myid').should.be.ok;
      
      tokenBuilderMock.success.calledOnce.should.be.equal(true);

      tokenBuilderMock.error.calledOnce.should.be.equal(true);
      tokenBuilderMock.error.calledWith(error).should.be.ok;
      
      tokenBuilderMock.data.calledOnce.should.be.equal(true);
      tokenBuilderMock.data.calledWith({entry: 'myfile', content: 'some content'}).should.be.ok;
      
      tokenBuilderMock.call.calledOnce.should.be.equal(true);

      done();

    });
    
    it('should generate the right request for new file', function (done) {
      var success = function () {}, error = function () {};

      remoteFileSystem.save('/', 'newfile', 'some content', success, error);
      
      tokenBuilderMock.method.calledOnce.should.be.ok;
      tokenBuilderMock.method.calledWith('POST').should.be.ok;
      
      tokenBuilderMock.path.calledOnce.should.be.ok;
      tokenBuilderMock.path.calledWith('files').should.be.ok;
      
      tokenBuilderMock.success.calledOnce.should.be.equal(true);

      tokenBuilderMock.error.calledOnce.should.be.equal(true);
      tokenBuilderMock.error.calledWith(error).should.be.ok;
      
      tokenBuilderMock.data.calledOnce.should.be.equal(true);
      tokenBuilderMock.data.calledWith({entry: 'newfile', content: 'some content'}).should.be.ok;
      
      tokenBuilderMock.call.calledOnce.should.be.equal(true);

      done();

    });
    
    it('should call the success callback on success on existing file', function (done) {
      var success;

      remoteFileSystem.save('/', 'myfile', 'some content', function () {
        done();
      }, undefined);
      
      tokenBuilderMock.success.calledOnce.should.be.equal(true);
      success = tokenBuilderMock.success.getCall(0).args[0];
      success();

    });

    it('should call the error callback on error on existing file', function (done) {
      var error;

      remoteFileSystem.save('/', 'myfile', 'some content', undefined, function () {
        done();
      });
      
      tokenBuilderMock.success.calledOnce.should.be.equal(true);
      error = tokenBuilderMock.error.getCall(0).args[0];
      error();
    });
    
    it('should call the success callback on success on new file', function (done) {
      var success, id = 'newfileid', content = 'some content';

      remoteFileSystem.save('/', 'newfile', content, function () {
        files['newfile'].content.should.be.equal(content);
        done();
      }, undefined);
      
      tokenBuilderMock.success.calledOnce.should.be.equal(true);
      success = tokenBuilderMock.success.getCall(0).args[0];
      success(JSON.stringify(id));
    });

    it('should call the error callback on error on new file', function (done) {
      var error;

      remoteFileSystem.save('/', 'newfile', 'some content', undefined, function () {
        should.not.exist(files['newfile']);
        done();
      });
      
      tokenBuilderMock.success.calledOnce.should.be.equal(true);
      error = tokenBuilderMock.error.getCall(0).args[0];
      error();
    });
    it('should not lose references if callbacks arrive in different order', function (done) {
      var success1, success2, id = 'newfileid', content1 = 'some content',
        content2 = 'some other content', callback2Executed = false;

      remoteFileSystem.save('/', 'newfile1', content1, function () {
        files['newfile1'].content.should.be.equal(content1);
        files['newfile2'].content.should.be.equal(content2);
        callback2Executed.should.be.equal(true);
        done();
      }, undefined);
      
      remoteFileSystem.save('/', 'newfile2', content2, function () {
        callback2Executed = true;
      }, undefined);
      
      tokenBuilderMock.success.calledTwice.should.be.equal(true);
      
      success2 = tokenBuilderMock.success.getCall(1).args[0];
      success2(JSON.stringify(id + "2"));
      
      success1 = tokenBuilderMock.success.getCall(0).args[0];
      success1(JSON.stringify(id + "1"));

      

    });
    
  });
    
});
