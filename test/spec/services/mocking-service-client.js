'use strict';

describe('mockingServiceClient', function () {
  var $httpBackend;
  var mockingServiceClient;

  beforeEach(module('ramlEditorApp'));
  beforeEach(inject(function ($injector, $window) {
    $httpBackend         = $injector.get('$httpBackend');
    mockingServiceClient = $injector.get('mockingServiceClient');

    delete $window.RAML.Settings.proxy;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('buildURL', function () {
    it('should return proper URL', function () {
      var host = mockingServiceClient.host = 'http://host';
      var base = mockingServiceClient.base = '/base';
      var path = 'path';

      mockingServiceClient.buildURL(path).should.be.equal(host + base + '/' + path);
    });

    it('should use proxy configured via $window.RAML.Settings.proxy', inject(function ($window) {
      var proxy = $window.RAML.Settings.proxy = '/proxy/';
      var host  = mockingServiceClient.host   = 'http://host';
      var base  = mockingServiceClient.base   = '/base';
      var path  = 'path';
      var url   = proxy + host + base + '/' + path;

      mockingServiceClient.buildURL(path).should.be.equal(url);
    }));

    it('should use proxy configured via "proxy" property', function () {
      var proxy = mockingServiceClient.proxy = '/proxy/';
      var host  = mockingServiceClient.host  = 'http://host';
      var base  = mockingServiceClient.base  = '/base';
      var path  = 'path';
      var url   = proxy + host + base + '/' + path;

      mockingServiceClient.buildURL(path).should.be.equal(url);
    });

    it('should use proxy configured via "proxy" property with $window.RAML.Settings.proxy configured at the same time', inject(function ($window) {
      var proxy = mockingServiceClient.proxy = '/proxy1/';
      var host  = mockingServiceClient.host  = 'http://host';
      var base  = mockingServiceClient.base  = '/base';
      var path  = 'path';
      var url   = proxy + host + base + '/' + path;

      $window.RAML.Settings.proxy = '/proxy2/';

      mockingServiceClient.buildURL(path).should.be.equal(url);
    }));
  });

  describe('getMock', function () {
    it('should exist', function () {
      should.exist(mockingServiceClient.getMock);
    });

    it('should make GET request to proper URL', function () {
      var id        = 1;
      var manageKey = 2;
      var url       = mockingServiceClient.buildURL(id, manageKey);

      $httpBackend.expectGET(url).respond(200, {});

      mockingServiceClient.getMock({id: id, manageKey: manageKey});

      $httpBackend.flush();
    });

    it('should eventually return mock instance', function () {
      var id        = 1;
      var manageKey = 2;
      var url       = mockingServiceClient.buildURL(id, manageKey);
      var mock;

      $httpBackend.expectGET(url).respond(
        // status
        200,

        // data
        angular.toJson({
          id:        id,
          manageKey: manageKey
        }),

        // headers
        {
          'Content-Type': 'application/json'
        }
      );

      mockingServiceClient.getMock({id: id, manageKey: manageKey}).then(function success($mock) {
        mock = $mock;
      });

      $httpBackend.flush();

      mock.should.have.property('id',    id);
      mock.should.have.property('manageKey', manageKey);
    });

    it('should handle "404" error', function () {
      var mock      = {};
      var id        = 1;
      var manageKey = 2;
      var url       = mockingServiceClient.buildURL(id, manageKey);

      $httpBackend.expectGET(url).respond(404);

      mockingServiceClient.getMock({id: id, manageKey: manageKey}).then(function success($mock) {
        mock = $mock;
      });

      $httpBackend.flush();

      should.not.exist(mock);
    });

    it('should propagate non "404" errors', function () {
      var id        = 1;
      var manageKey = 2;
      var url       = mockingServiceClient.buildURL(id, manageKey);
      var response;

      $httpBackend.expectGET(url).respond(500);

      mockingServiceClient.getMock({id: id, manageKey: manageKey}).then(
        function success()          { },
        function failure($response) {
          response = $response;
        }
      );

      $httpBackend.flush();

      response.status.should.be.equal(500);
    });
  });

  describe('createMock', function () {
    it('should exist', function () {
      should.exist(mockingServiceClient.createMock);
    });

    it('should make POST request to proper URL', function () {
      var url  = mockingServiceClient.buildURL();
      var data = {raml: '#%RAML 0.8\n---\ntitle: My API'};

      $httpBackend.expectPOST(url, data).respond(200, {});

      mockingServiceClient.createMock(data);

      $httpBackend.flush();
    });

    it('should eventually return mock instance', function () {
      var url  = mockingServiceClient.buildURL();
      var data = {raml: '#%RAML 0.8\n---\ntitle: My API'};
      var mock = void(0);

      $httpBackend.expectPOST(url, data).respond(
        // status
        200,

        // data
        angular.toJson({
          id:        'id',
          manageKey: 'manageKey',
          baseUri:   'baseUri'
        }),

        // headers
        {
          'Content-Type': 'application/json'
        }
      );

      mockingServiceClient.createMock(data).then(function success($mock) {
        mock = $mock;
      });

      $httpBackend.flush();

      mock.should.have.keys('id', 'manageKey', 'baseUri');
    });
  });

  describe('updateMock', function () {
    it('should exist', function () {
      should.exist(mockingServiceClient.updateMock);
    });

    it('should make PATCH request to proper URL', function () {
      var mock = {
        id:        '1',
        manageKey: '2',
        raml:      '#%RAML 0.8\n---\ntitle: My API'
      };
      var url  = mockingServiceClient.buildURL(mock.id, mock.manageKey);

      $httpBackend.expectPATCH(url, {raml: mock.raml}).respond(200);

      mockingServiceClient.updateMock(mock);

      $httpBackend.flush();
    });
  });

  describe('deleteMock', function () {
    it('should exist', function () {
      should.exist(mockingServiceClient.deleteMock);
    });

    it('should make DELETE request to proper URL', function () {
      var mock = {
        id:        '1',
        manageKey: '2'
      };
      var url  = mockingServiceClient.buildURL(mock.id, mock.manageKey);

      $httpBackend.expectDELETE(url).respond(200);

      mockingServiceClient.deleteMock(mock);

      $httpBackend.flush();
    });
  });
});
