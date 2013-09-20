'use strict';

var describe = window.describe, beforeEach = window.beforeEach, it = window.it,
  inject = window.inject, should = window.should, sinon = window.sinon;

describe('Request Token Builder', function () {
  var requestBuilderMock = {}, config, requestTokenBuilder,
    requestBuilderEntryPoint,
    $cookies, TOKEN_COOKIE_KEY;

  beforeEach(module('fs'));
  beforeEach(function () {
    module(function ($provide) {
      $provide.decorator('requestBuilder', function ($delegate) {
        var requestBuilderInstance = $delegate(), key;
        
        requestBuilderMock = sinon.mock($delegate);

        for (key in requestBuilderInstance) {
          var value = requestBuilderInstance[key];
          if (typeof value === 'function') {
            requestBuilderMock[key] = sinon.stub().returns(requestBuilderMock);
          }
        }

        requestBuilderEntryPoint = sinon.stub().returns(requestBuilderMock);

        return requestBuilderEntryPoint;
      });

      $provide.value('shouldAutoRunInit', false);
    });

    inject(function ($injector) {
      requestTokenBuilder = $injector.get('requestTokenBuilder');
      config = $injector.get('config');

      // cleanup cookies
      $cookies = $injector.get('$cookies');
      TOKEN_COOKIE_KEY = $injector.get('TOKEN_COOKIE_KEY');
      $cookies[TOKEN_COOKIE_KEY] = undefined;
    });

  });

  describe('init', function () {
    it('should use existing token if found', function (done) {
      var fakeToken = 'thisisthetoken';
      config.get = sinon.stub().returns(fakeToken);

      requestTokenBuilder.init();

      $cookies[TOKEN_COOKIE_KEY].should.be.equal(fakeToken);

      requestTokenBuilder().should.be.equal(requestBuilderMock);

      done();
    });
    
    it('should create token if not found', function (done) {
      config.get = sinon.stub().returns(undefined);
      
      requestTokenBuilder.init();
      
      should.not.exist($cookies[TOKEN_COOKIE_KEY]);

      requestBuilderEntryPoint.calledOnce.should.be.equal(true);
      requestBuilderEntryPoint.calledWith(requestTokenBuilder.shouldExecute);

      requestBuilderMock.method.calledOnce.should.be.equal(true);
      requestBuilderMock.method.calledWith('POST').should.be.equal(true);

      requestBuilderMock.path.calledOnce.should.be.equal(true);
      requestBuilderMock.path.calledWith('token').should.be.equal(true);

      requestBuilderMock.success.calledOnce.should.be.equal(true);
      
      requestBuilderMock.error.calledOnce.should.be.equal(true);
      
      requestBuilderMock.call.calledOnce.should.be.equal(true);

      done();

    });

    it('should execute success callback on success', function (done) {
      var success, newToken = 'newToken:)';

      config.get = sinon.stub().returns(undefined);
      config.set = sinon.stub();
      config.save = sinon.stub();
      
      requestTokenBuilder.init();
      
      requestBuilderMock.success.calledOnce.should.be.equal(true);
      success = requestBuilderMock.success.getCall(0).args[0];

      success(newToken);

      $cookies[TOKEN_COOKIE_KEY].should.be.equal(newToken);

      config.set.calledOnce.should.be.equal(true);
      config.set.calledWith('token', newToken).should.be.equal(true);

      config.save.calledOnce.should.be.equal(true);

      done();
    });
    
    it('should execute error callback on error', function (done) {
      var error, newToken = 'newToken:)';

      config.get = sinon.stub().returns(undefined);
      config.set = sinon.stub();
      config.save = sinon.stub();
      
      requestTokenBuilder.init();
      
      requestBuilderMock.error.calledOnce.should.be.equal(true);
      error = sinon.spy(requestBuilderMock.error.getCall(0).args[0]);

      try {
        error(newToken);
      } catch (e) {

      }

      error.threw('Token could not be created').should.be.equal(true);

      should.not.exist($cookies[TOKEN_COOKIE_KEY]);

      config.set.callCount.should.be.equal(0);
      config.save.callCount.should.be.equal(0);

      done();

    });

  });

  describe('shouldExecute', function () {
    it('should filter requests while token is being retrieved', function (done) {
      requestTokenBuilder.shouldExecute({path: 'somepath', method: 'GET'}).should.be.equal(false);

      done();
    });
    
    it('should not block token requests', function (done) {
      requestTokenBuilder.shouldExecute({path: 'token', method: 'POST'}).should.be.equal(true);

      done();
    });
    
    it('should allow requests after token was retrieved', function (done) {
      var fakeToken = 'thisisthetoken';
      config.get = sinon.stub().returns(fakeToken);

      requestTokenBuilder.init();

      requestTokenBuilder.shouldExecute({path: 'files', method: 'POST'}).should.be.equal(true);

      done();

    });
  });


});
