'use strict';

describe('swaggerToRAML', function () {
  var $q;
  var $window;
  var $rootScope;
  var importService;
  var swaggerToRAML;
  var $httpBackend;

  beforeEach(module('ramlEditorApp'));

  beforeEach(inject(function ($injector) {
    $q             = $injector.get('$q');
    $window        = $injector.get('$window');
    $rootScope     = $injector.get('$rootScope');
    importService  = $injector.get('importService');
    swaggerToRAML  = $injector.get('swaggerToRAML');
    $httpBackend   = $injector.get('$httpBackend');
  }));

  var FILES = {
    'api-docs': '{"apiVersion":"1.0.0","swaggerVersion":"1.2","apis":[{"path":"../pet","description":"Operations about pets"}],"authorizations":{"oauth2":{"type":"oauth2","scopes":[{"scope":"write:pets","description":"Modify pets in your account"},{"scope":"read:pets","description":"Read your pets"}],"grantTypes":{"implicit":{"loginEndpoint":{"url":"http://petstore.swagger.wordnik.com/api/oauth/dialog"},"tokenName":"access_token"},"authorization_code":{"tokenRequestEndpoint":{"url":"http://petstore.swagger.wordnik.com/api/oauth/requestToken","clientIdName":"client_id","clientSecretName":"client_secret"},"tokenEndpoint":{"url":"http://petstore.swagger.wordnik.com/api/oauth/token","tokenName":"auth_code"}}}}},"info":{"title":"Swagger Sample App","description":"This is a sample server Petstore server.  You can find out more about Swagger \\n    at <a href=\\"http://swagger.wordnik.com\\">http://swagger.wordnik.com</a> or on irc.freenode.net, #swagger.  For this sample,\\n    you can use the api key \\"special-key\\" to test the authorization filters","termsOfServiceUrl":"http://helloreverb.com/terms/","contact":"apiteam@wordnik.com","license":"Apache 2.0","licenseUrl":"http://www.apache.org/licenses/LICENSE-2.0.html"}}',
    'pet': '{"apiVersion":"1.0.0","swaggerVersion":"1.2","basePath":"http://petstore.swagger.wordnik.com/api","resourcePath":"/pet","produces":["application/json","application/xml","text/plain","text/html"],"apis":[{"path":"/pet","operations":[{"method":"PUT","summary":"Update an existing pet","notes":"","type":"void","nickname":"updatePet","authorizations":{},"parameters":[{"name":"body","description":"Pet object that needs to be updated in the store","required":true,"type":"Pet","paramType":"body","allowMultiple":false}],"responseMessages":[{"code":400,"message":"Invalid ID supplied"},{"code":404,"message":"Pet not found"},{"code":405,"message":"Validation exception"}]},{"method":"POST","summary":"Add a new pet to the store","notes":"","type":"void","nickname":"addPet","consumes":["application/json","application/xml"],"authorizations":{"oauth2":[{"scope":"write:pets","description":"modify pets in your account"}]},"parameters":[{"name":"body","description":"Pet object that needs to be added to the store","required":true,"type":"Pet","paramType":"body","allowMultiple":false}],"responseMessages":[{"code":405,"message":"Invalid input"}]}]},{"path":"/pet/findByStatus","operations":[{"method":"GET","summary":"Finds Pets by status","notes":"Multiple status values can be provided with comma seperated strings","type":"array","items":{"$ref":"Pet"},"nickname":"findPetsByStatus","authorizations":{},"parameters":[{"name":"status","description":"Status values that need to be considered for filter","defaultValue":"available","required":true,"type":"string","paramType":"query","allowMultiple":true,"enum":["available","pending","sold"]}],"responseMessages":[{"code":400,"message":"Invalid status value"}]}]},{"path":"/pet/findByTags","operations":[{"method":"GET","summary":"Finds Pets by tags","notes":"Muliple tags can be provided with comma seperated strings. Use tag1, tag2, tag3 for testing.","type":"array","items":{"$ref":"Pet"},"nickname":"findPetsByTags","authorizations":{},"parameters":[{"name":"tags","description":"Tags to filter by","required":true,"type":"string","paramType":"query","allowMultiple":true}],"responseMessages":[{"code":400,"message":"Invalid tag value"}],"deprecated":"true"}]},{"path":"/pet/{petId}","operations":[{"method":"POST","summary":"Updates a pet in the store with form data","notes":"","type":"void","nickname":"updatePetWithForm","consumes":["application/x-www-form-urlencoded"],"authorizations":{"oauth2":[{"scope":"write:pets","description":"modify pets in your account"}]},"parameters":[{"name":"petId","description":"ID of pet that needs to be updated","required":true,"type":"string","paramType":"path","allowMultiple":false},{"name":"name","description":"Updated name of the pet","required":false,"type":"string","paramType":"form","allowMultiple":false},{"name":"status","description":"Updated status of the pet","required":false,"type":"string","paramType":"form","allowMultiple":false}],"responseMessages":[{"code":405,"message":"Invalid input"}]},{"method":"GET","summary":"Find pet by ID","notes":"Returns a pet based on ID","type":"Pet","nickname":"getPetById","authorizations":{},"parameters":[{"name":"petId","description":"ID of pet that needs to be fetched","required":true,"type":"integer","format":"int64","paramType":"path","allowMultiple":false,"minimum":"1.0","maximum":"100000.0"}],"responseMessages":[{"code":400,"message":"Invalid ID supplied"},{"code":404,"message":"Pet not found"}]},{"method":"DELETE","summary":"Deletes a pet","notes":"","type":"void","nickname":"deletePet","authorizations":{"oauth2":[{"scope":"write:pets","description":"modify pets in your account"}]},"parameters":[{"name":"petId","description":"Pet id to delete","required":true,"type":"string","paramType":"path","allowMultiple":false}],"responseMessages":[{"code":400,"message":"Invalid pet value"}]},{"method":"PATCH","summary":"partial updates to a pet","notes":"","type":"array","items":{"$ref":"Pet"},"nickname":"partialUpdate","produces":["application/json","application/xml"],"consumes":["application/json","application/xml"],"authorizations":{"oauth2":[{"scope":"write:pets","description":"modify pets in your account"}]},"parameters":[{"name":"petId","description":"ID of pet that needs to be fetched","required":true,"type":"string","paramType":"path","allowMultiple":false},{"name":"body","description":"Pet object that needs to be added to the store","required":true,"type":"Pet","paramType":"body","allowMultiple":false}],"responseMessages":[{"code":400,"message":"Invalid tag value"}]}]},{"path":"/pet/uploadImage","operations":[{"method":"POST","summary":"uploads an image","notes":"","type":"void","nickname":"uploadFile","consumes":["multipart/form-data"],"authorizations":{"oauth2":[{"scope":"write:pets","description":"modify pets in your account"},{"scope":"read:pets","description":"read your pets"}]},"parameters":[{"name":"additionalMetadata","description":"Additional data to pass to server","required":false,"type":"string","paramType":"form","allowMultiple":false},{"name":"file","description":"file to upload","required":false,"type":"File","paramType":"form","allowMultiple":false}]}]}],"models":{"Tag":{"id":"Tag","properties":{"id":{"type":"integer","format":"int64"},"name":{"type":"string"}}},"Pet":{"id":"Pet","required":["id","name"],"properties":{"id":{"type":"integer","format":"int64","description":"unique identifier for the pet","minimum":"0.0","maximum":"100.0"},"category":{"$ref":"Category"},"name":{"type":"string"},"photoUrls":{"type":"array","items":{"type":"string"}},"tags":{"type":"array","items":{"$ref":"Tag"}},"status":{"type":"string","description":"pet status in the store","enum":["available","pending","sold"]}}},"Category":{"id":"Category","properties":{"id":{"type":"integer","format":"int64"},"name":{"type":"string"}}}}}'
  };

  describe('parse zip files', function () {
    var parseZipStub;
    var readFileStub;

    describe('multi-file zip', function () {
      beforeEach(function () {
        parseZipStub = sinon.stub(importService, 'parseZip', function () {
          return FILES;
        });

        readFileStub = sinon.stub(importService, 'readFile', function () {
          return $q.when('');
        });
      });

      afterEach(function () {
        parseZipStub.restore();
        readFileStub.restore();
      });

      it('should respond with RAML', function () {
        var spy     = sinon.spy();
        var promise = swaggerToRAML.zip({ name: 'api.zip' });

        promise.then(spy);

        $rootScope.$digest();

        spy.should.have.been.called.once;
        spy.getCall(0).args[0].should.be.a('string').and.match(/^#%RAML 0.8/);
      });
    });

    describe('single-file zip', function () {
      beforeEach(function () {
        parseZipStub = sinon.stub(importService, 'parseZip', function () {
          return { 'pet-store-1.2.json': FILES.pet };
        });

        readFileStub = sinon.stub(importService, 'readFile', function () {
          return $q.when('');
        });
      });

      afterEach(function () {
        parseZipStub.restore();
        readFileStub.restore();
      });

      it('should respond with RAML', function () {
        var spy     = sinon.spy();
        var promise = swaggerToRAML.zip({ name: 'api.zip' });

        promise.then(spy).catch(function (err) { console.log(err); });

        $rootScope.$digest();

        spy.should.have.been.called.once;
        spy.getCall(0).args[0].should.be.a('string').and.match(/^#%RAML 0.8/);
      });
    });
  });

  describe('parse HTTP(s) resources', function () {
    var swaggerRequestHandler;
    var URL = 'https://example.com/swagger/pet-store-1.2.json';
    var PROXY_URL = '/proxy/' + URL;

    beforeEach(function () {
      swaggerRequestHandler = $httpBackend.when('GET', PROXY_URL)
        .respond(200, FILES.pet);
    });

    it('should respond with RAML', function () {
      var spy = sinon.spy();

      $httpBackend.expectGET(PROXY_URL);
      var promise = swaggerToRAML.convert(URL);
      $httpBackend.flush();

      promise.then(spy);

      $rootScope.$digest();

      spy.should.have.been.called.once;
      spy.getCall(0).args[0].should.be.a('string').and.match(/^#%RAML 0.8/);
    });
  });
});
