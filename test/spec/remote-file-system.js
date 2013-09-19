'use strict';


var describe = window.describe, beforeEach = window.beforeEach, it = window.it,
  inject = window.inject, should = window.should, remoteFileSystem, mockedRequestTokenBuilder,
  sinon = window.sinon;


describe('File Persistence Service', function () {

  var tokenBuilderMock = {};
  
  var success = function () {}, error = function () {};

  beforeEach(module('fs'));
  beforeEach(function () {
    tokenBuilderMock.method = sinon.stub().returns(tokenBuilderMock);
    tokenBuilderMock.path = sinon.stub().returns(tokenBuilderMock);
    tokenBuilderMock.success = sinon.stub().returns(tokenBuilderMock);
    tokenBuilderMock.error = sinon.stub().returns(tokenBuilderMock);
    tokenBuilderMock.data = sinon.stub().returns(tokenBuilderMock);
    tokenBuilderMock.call = sinon.stub().returns(tokenBuilderMock);

    module(function ($provide) {
      $provide.factory('requestTokenBuilder', function () {
        return function () {
          return tokenBuilderMock;
        };
      });
    });
  });

  describe('directory', function () {
    beforeEach(
      inject(function ($injector) {
        remoteFileSystem = $injector.get('remoteFileSystem');
      })
    );
    it.skip('should generate the right request', function (done) {
      remoteFileSystem.directory('/', success, error);
      tokenBuilderMock.path.calledWith('files').should.be.true;
      tokenBuilderMock.path.calledOnce.should.be.true;
    
      tokenBuilderMock.success.calledOnce.should.be.true;
    
      tokenBuilderMock.error.calledOnce.should.be.true;
      tokenBuilderMock.error.calledWith(error).should.be.true;
      
      tokenBuilderMock.call.calledOnce.should.be.true;

      done();
    });
    
    it.skip('should populate files object on success', function () {
      // TODO write me
    });

    it.skip('should call the success callback', function () {
      // TODO write me
    });
  });

  describe('load', function () {
    beforeEach(function () {
      module(function ($provide) {
        $provide.value('files', {myfile: {id: 'myid'}});
      });
    });
    beforeEach(
      inject(function ($injector) {
        remoteFileSystem = $injector.get('remoteFileSystem');
      })
    );

    it('should generate the right request', function (done) {
      remoteFileSystem.load('/', 'myfile', success, error);
      
      tokenBuilderMock.path.calledOnce.should.be.ok;
      tokenBuilderMock.path.calledWith('files', 'myid').should.be.ok;

      tokenBuilderMock.error.calledOnce.should.be.true;
      tokenBuilderMock.error.calledWith(error).should.be.ok;
      
      tokenBuilderMock.call.calledOnce.should.be.true;

      done();
    });
    
    it.skip('should call the success callback', function () {
      // TODO write me
    });

  });
  
  describe('remove', function () {
    beforeEach(function () {
      module(function ($provide) {
        $provide.value('files', {myfile: {id: 'myid'}});
      });
    });
    beforeEach(
      inject(function ($injector) {
        remoteFileSystem = $injector.get('remoteFileSystem');
      })
    );

    it('should generate the right request', function (done) {
      remoteFileSystem.remove('/', 'myfile', success, error);
      
      tokenBuilderMock.method.calledOnce.should.be.ok;
      tokenBuilderMock.method.calledWith('DELETE').should.be.ok;
      
      tokenBuilderMock.path.calledOnce.should.be.ok;
      tokenBuilderMock.path.calledWith('files', 'myid').should.be.ok;
      
      tokenBuilderMock.success.calledOnce.should.be.true;
      tokenBuilderMock.success.calledWith(success).should.be.ok;

      tokenBuilderMock.error.calledOnce.should.be.true;
      tokenBuilderMock.error.calledWith(error).should.be.ok;
      
      tokenBuilderMock.call.calledOnce.should.be.true;

      done();
    });
    
    it.skip('should call the success callback', function () {
      // TODO write me
    });

  });
  
  describe('save', function () {
    beforeEach(function () {
      module(function ($provide) {
        $provide.value('files', {myfile: {id: 'myid'}});
      });
    });
    beforeEach(
      inject(function ($injector) {
        remoteFileSystem = $injector.get('remoteFileSystem');
      })
    );

    it('should generate the right request for existing file', function (done) {
      remoteFileSystem.save('/', 'myfile', 'some content', success, error);
      
      tokenBuilderMock.method.calledOnce.should.be.ok;
      tokenBuilderMock.method.calledWith('PUT').should.be.ok;
      
      tokenBuilderMock.path.calledOnce.should.be.ok;
      tokenBuilderMock.path.calledWith('files').should.be.ok;
      
      tokenBuilderMock.success.calledOnce.should.be.true;

      tokenBuilderMock.error.calledOnce.should.be.true;
      tokenBuilderMock.error.calledWith(error).should.be.ok;
      
      tokenBuilderMock.data.calledOnce.should.be.true;
      tokenBuilderMock.data.calledWith({entry: 'myfile', content: 'some content'}).should.be.ok;
      
      tokenBuilderMock.call.calledOnce.should.be.true;

      done();
    });
    
    it('should generate the right request for new file', function (done) {
      remoteFileSystem.save('/', 'newfile', 'some content', success, error);
      
      tokenBuilderMock.method.calledOnce.should.be.ok;
      tokenBuilderMock.method.calledWith('POST').should.be.ok;
      
      tokenBuilderMock.path.calledOnce.should.be.ok;
      tokenBuilderMock.path.calledWith('files').should.be.ok;
      
      tokenBuilderMock.success.calledOnce.should.be.true;

      tokenBuilderMock.error.calledOnce.should.be.true;
      tokenBuilderMock.error.calledWith(error).should.be.ok;
      
      tokenBuilderMock.data.calledOnce.should.be.true;
      tokenBuilderMock.data.calledWith({entry: 'newfile', content: 'some content'}).should.be.ok;
      
      tokenBuilderMock.call.calledOnce.should.be.true;

      done();

    });
    
    it.skip('should call the success callback', function () {
      // TODO write me
    });
  });
});
