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
      var baseUri = mockingServiceClient.baseUri = 'http://host';
      var path    = 'path';

      mockingServiceClient.buildURL(path).should.be.equal(baseUri + '/sources/manager/apis/' + path);
    });

    it('should use proxy configured via $window.RAML.Settings.proxy', inject(function ($window) {
      var proxy   = $window.RAML.Settings.proxy  = '/proxy/';
      var baseUri = mockingServiceClient.baseUri = 'http://host';
      var path    = 'path';
      var url     = proxy + baseUri + '/sources/manager/apis/' + path;

      mockingServiceClient.buildURL(path).should.be.equal(url);
    }));

    it('should use proxy configured via "proxy" property', function () {
      var proxy   = mockingServiceClient.proxy   = '/proxy/';
      var baseUri = mockingServiceClient.baseUri = 'http://host';
      var path    = 'path';
      var url     = proxy + baseUri + '/sources/manager/apis/' + path;

      mockingServiceClient.buildURL(path).should.be.equal(url);
    });

    it('should use proxy configured via "proxy" property with $window.RAML.Settings.proxy configured at the same time',
      inject(function ($window) {
        var proxy = mockingServiceClient.proxy = '/proxy1/';
        var baseUri = mockingServiceClient.baseUri = 'http://host';
        var path = 'path';
        var url = proxy + baseUri + '/sources/manager/apis/' + path;

        $window.RAML.Settings.proxy = '/proxy2/';

        mockingServiceClient.buildURL(path).should.be.equal(url);
      }));
  });

  describe('enableMock', function () {
    it('should exist', function () {
      should.exist(mockingServiceClient.enableMock);
    });

    it.skip('should make POST request to proper URL', function () {
      var file = {name: 'filename'};

      var getHeaders = {
        'MS2-Main-File': 'filename',
        'Accept': 'application/json, text/plain, */*'
      };
      $httpBackend.expectGET(mockingServiceClient.buildURL(), getHeaders).respond(200, {});

      var postHeaders = Object.assign(getHeaders, {
        'Content-Type': 'application/json;charset=utf-8'
      });

      $httpBackend.expectPOST(mockingServiceClient.buildURL('link'), null, postHeaders).respond(200, {});

      mockingServiceClient.enableMock(file);

      $httpBackend.flush();
    });

    it.skip('should eventually return mock instance', function () {
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
          baseUri:   'baseUri/mocks/'
        }),

        // headers
        {
          'Content-Type': 'application/json'
        }
      );

      mockingServiceClient.enableMock(data).then(function success($mock) {
        mock = $mock;
      });

      $httpBackend.flush();

      mock.should.have.keys('id', 'manageKey', 'baseUri');
    });
  });

  describe.skip('deleteMock', function () {
    it('should exist', function () {
      should.exist(mockingServiceClient.deleteMock);
    });

    it('should make DELETE request to proper URL', function () {
      var file = {
        name: 'filename'
      };

      var headers = {
        'MS2-Main-File': 'filename',
        'Accept': 'application/json, text/plain, */*'
      };

      var url  = mockingServiceClient.buildURL();

      $httpBackend.expectDELETE(url, null, headers).respond(200);

      mockingServiceClient.deleteMock(file);

      $httpBackend.flush();
    });
  });
});
