'use strict';

describe('Request Executor', function () {
  var requestExecutor, $httpBackend;

  beforeEach(module('fs'));
  beforeEach(inject(function ($injector) {
    requestExecutor = $injector.get('requestExecutor');
    $httpBackend = $injector.get('$httpBackend');

    $httpBackend.when('POST','http://myhost/some/path').respond(201, '');
    $httpBackend.when('POST','http://myhost/some/failing/path').respond(404, '');
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should call $http to execute requests', inject(function (requestQueue) {
    // Arrange
    var success = sinon.stub(), error = sinon.stub();
    requestExecutor.add({
      method: 'POST',
      data: 'my data',
      host: 'http://myhost',
      path: 'some/path',
      success: success,
      error: error
    });

    requestQueue.should.not.be.deep.equal([]);

    // Act
    requestExecutor.process();

    // Assert
    requestQueue.should.be.deep.equal([]);

    $httpBackend.flush();

    success.calledOnce.should.be.equal(true);
    error.called.should.be.equal(false);
  }));

  it('should call error callback if $http request fails', inject(function (requestQueue) {
    // Assert
    var success = sinon.stub(), error = sinon.stub();

    requestExecutor.add({
      method: 'POST',
      data: 'my data',
      host: 'http://myhost',
      path: 'some/failing/path',
      success: success,
      error: error
    });

    requestQueue.should.not.be.deep.equal([]);

    // Act
    requestExecutor.process();

    // Assert
    requestQueue.should.be.deep.equal([]);

    $httpBackend.flush();

    success.called.should.be.equal(false);
    error.calledOnce.should.be.equal(true);
  }));
});
