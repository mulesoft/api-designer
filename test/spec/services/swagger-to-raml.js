'use strict';

describe('swaggerToRAML', function () {
  var $q;
  var $window;
  var $rootScope;
  var ramlRepository;
  var oasRamlConverter;
  var importService;
  var swaggerToRAML;
  var $httpBackend;

  angular.module('editorShelfTest', ['ramlEditorApp', 'testFs']);
  beforeEach(module('editorShelfTest'));

  beforeEach(inject(function ($injector) {
    $q             = $injector.get('$q');
    $window        = $injector.get('$window');
    $rootScope     = $injector.get('$rootScope');
    ramlRepository  = $injector.get('ramlRepository');
    oasRamlConverter  = $injector.get('oasRamlConverter');
    importService  = $injector.get('importService');
    swaggerToRAML  = $injector.get('swaggerToRAML');
    $httpBackend   = $injector.get('$httpBackend');
  }));

  var FILES = {
    'api-docs': '{"apiVersion":"1.0.0","swaggerVersion":"1.2","apis":[{"path":"../pet","description":"Operations about pets"}],"authorizations":{"oauth2":{"type":"oauth2","scopes":[{"scope":"write:pets","description":"Modify pets in your account"},{"scope":"read:pets","description":"Read your pets"}],"grantTypes":{"implicit":{"loginEndpoint":{"url":"http://petstore.swagger.wordnik.com/api/oauth/dialog"},"tokenName":"access_token"},"authorization_code":{"tokenRequestEndpoint":{"url":"http://petstore.swagger.wordnik.com/api/oauth/requestToken","clientIdName":"client_id","clientSecretName":"client_secret"},"tokenEndpoint":{"url":"http://petstore.swagger.wordnik.com/api/oauth/token","tokenName":"auth_code"}}}}},"info":{"title":"Swagger Sample App","description":"This is a sample server Petstore server.  You can find out more about Swagger \\n    at <a href=\\"http://swagger.wordnik.com\\">http://swagger.wordnik.com</a> or on irc.freenode.net, #swagger.  For this sample,\\n    you can use the api key \\"special-key\\" to test the authorization filters","termsOfServiceUrl":"http://helloreverb.com/terms/","contact":"apiteam@wordnik.com","license":"Apache 2.0","licenseUrl":"http://www.apache.org/licenses/LICENSE-2.0.html"}}',
    'pet': '{"apiVersion":"1.0.0","swaggerVersion":"1.2","basePath":"http://petstore.swagger.wordnik.com/api","resourcePath":"/pet","produces":["application/json","application/xml","text/plain","text/html"],"apis":[{"path":"/pet","operations":[{"method":"PUT","summary":"Update an existing pet","notes":"","type":"void","nickname":"updatePet","authorizations":{},"parameters":[{"name":"body","description":"Pet object that needs to be updated in the store","required":true,"type":"Pet","paramType":"body","allowMultiple":false}],"responseMessages":[{"code":400,"message":"Invalid ID supplied"},{"code":404,"message":"Pet not found"},{"code":405,"message":"Validation exception"}]},{"method":"POST","summary":"Add a new pet to the store","notes":"","type":"void","nickname":"addPet","consumes":["application/json","application/xml"],"authorizations":{"oauth2":[{"scope":"write:pets","description":"modify pets in your account"}]},"parameters":[{"name":"body","description":"Pet object that needs to be added to the store","required":true,"type":"Pet","paramType":"body","allowMultiple":false}],"responseMessages":[{"code":405,"message":"Invalid input"}]}]},{"path":"/pet/findByStatus","operations":[{"method":"GET","summary":"Finds Pets by status","notes":"Multiple status values can be provided with comma seperated strings","type":"array","items":{"$ref":"Pet"},"nickname":"findPetsByStatus","authorizations":{},"parameters":[{"name":"status","description":"Status values that need to be considered for filter","defaultValue":"available","required":true,"type":"string","paramType":"query","allowMultiple":true,"enum":["available","pending","sold"]}],"responseMessages":[{"code":400,"message":"Invalid status value"}]}]},{"path":"/pet/findByTags","operations":[{"method":"GET","summary":"Finds Pets by tags","notes":"Muliple tags can be provided with comma seperated strings. Use tag1, tag2, tag3 for testing.","type":"array","items":{"$ref":"Pet"},"nickname":"findPetsByTags","authorizations":{},"parameters":[{"name":"tags","description":"Tags to filter by","required":true,"type":"string","paramType":"query","allowMultiple":true}],"responseMessages":[{"code":400,"message":"Invalid tag value"}],"deprecated":"true"}]},{"path":"/pet/{petId}","operations":[{"method":"POST","summary":"Updates a pet in the store with form data","notes":"","type":"void","nickname":"updatePetWithForm","consumes":["application/x-www-form-urlencoded"],"authorizations":{"oauth2":[{"scope":"write:pets","description":"modify pets in your account"}]},"parameters":[{"name":"petId","description":"ID of pet that needs to be updated","required":true,"type":"string","paramType":"path","allowMultiple":false},{"name":"name","description":"Updated name of the pet","required":false,"type":"string","paramType":"form","allowMultiple":false},{"name":"status","description":"Updated status of the pet","required":false,"type":"string","paramType":"form","allowMultiple":false}],"responseMessages":[{"code":405,"message":"Invalid input"}]},{"method":"GET","summary":"Find pet by ID","notes":"Returns a pet based on ID","type":"Pet","nickname":"getPetById","authorizations":{},"parameters":[{"name":"petId","description":"ID of pet that needs to be fetched","required":true,"type":"integer","format":"int64","paramType":"path","allowMultiple":false,"minimum":"1.0","maximum":"100000.0"}],"responseMessages":[{"code":400,"message":"Invalid ID supplied"},{"code":404,"message":"Pet not found"}]},{"method":"DELETE","summary":"Deletes a pet","notes":"","type":"void","nickname":"deletePet","authorizations":{"oauth2":[{"scope":"write:pets","description":"modify pets in your account"}]},"parameters":[{"name":"petId","description":"Pet id to delete","required":true,"type":"string","paramType":"path","allowMultiple":false}],"responseMessages":[{"code":400,"message":"Invalid pet value"}]},{"method":"PATCH","summary":"partial updates to a pet","notes":"","type":"array","items":{"$ref":"Pet"},"nickname":"partialUpdate","produces":["application/json","application/xml"],"consumes":["application/json","application/xml"],"authorizations":{"oauth2":[{"scope":"write:pets","description":"modify pets in your account"}]},"parameters":[{"name":"petId","description":"ID of pet that needs to be fetched","required":true,"type":"string","paramType":"path","allowMultiple":false},{"name":"body","description":"Pet object that needs to be added to the store","required":true,"type":"Pet","paramType":"body","allowMultiple":false}],"responseMessages":[{"code":400,"message":"Invalid tag value"}]}]},{"path":"/pet/uploadImage","operations":[{"method":"POST","summary":"uploads an image","notes":"","type":"void","nickname":"uploadFile","consumes":["multipart/form-data"],"authorizations":{"oauth2":[{"scope":"write:pets","description":"modify pets in your account"},{"scope":"read:pets","description":"read your pets"}]},"parameters":[{"name":"additionalMetadata","description":"Additional data to pass to server","required":false,"type":"string","paramType":"form","allowMultiple":false},{"name":"file","description":"file to upload","required":false,"type":"File","paramType":"form","allowMultiple":false}]}]}],"models":{"Tag":{"id":"Tag","properties":{"id":{"type":"integer","format":"int64"},"name":{"type":"string"}}},"Pet":{"id":"Pet","required":["id","name"],"properties":{"id":{"type":"integer","format":"int64","description":"unique identifier for the pet","minimum":"0.0","maximum":"100.0"},"category":{"$ref":"Category"},"name":{"type":"string"},"photoUrls":{"type":"array","items":{"type":"string"}},"tags":{"type":"array","items":{"$ref":"Tag"}},"status":{"type":"string","description":"pet status in the store","enum":["available","pending","sold"]}}},"Category":{"id":"Category","properties":{"id":{"type":"integer","format":"int64"},"name":{"type":"string"}}}}}'
  };

  describe('parse files', function () {
    var parseZipStub;
    var readFileStub;
    var createFileStub;
    var checkExistenceStub;

    describe('multi-file zip', function () {
      beforeEach(function () {
        parseZipStub = sinon.stub(importService, 'parseZip', function () {
          return FILES;
        });

        readFileStub = sinon.stub(importService, 'readFile', function () {
          return $q.when('');
        });

        checkExistenceStub = sinon.stub(importService, 'checkExistence', function () {
          return $q.when(false);
        });

        createFileStub = sinon.stub(importService, 'createFile', function (f) {
          return $q.when(f);
        });
      });

      afterEach(function () {
        parseZipStub.restore();
        readFileStub.restore();
        createFileStub.restore();
        checkExistenceStub.restore();
      });

      it('should respond with RAML', function () {
        var spy     = sinon.spy();
        var promise = swaggerToRAML.zip(ramlRepository.rootDirectory, { name: 'api.zip' });

        promise.then(spy).catch(function (err) { console.log(err); });

        $rootScope.$digest();

        spy.should.have.been.called.once;
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

        checkExistenceStub = sinon.stub(importService, 'checkExistence', function () {
          return $q.when(false);
        });

        createFileStub = sinon.stub(importService, 'createFile', function (f) {
          return $q.when(f);
        });
      });

      afterEach(function () {
        parseZipStub.restore();
        readFileStub.restore();
        createFileStub.restore();
        checkExistenceStub.restore();
      });

      it('should respond with RAML', function () {
        var spy     = sinon.spy();
        var promise = swaggerToRAML.zip(ramlRepository.rootDirectory, { name: 'api.zip' });

        promise.then(spy).catch(function (err) { console.log(err); });

        $rootScope.$digest();

        spy.should.have.been.called.once;
      });
    });


    describe('single file', function () {

      var swaggerPetStore2 = '{"swagger":"2.0","info":{"description":"This is a sample server Petstore server.  You can find out more about Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).  For this sample, you can use the api key `special-key` to test the authorization filters.","version":"1.0.0","title":"Swagger Petstore","termsOfService":"http://swagger.io/terms/","contact":{"email":"apiteam@swagger.io"},"license":{"name":"Apache 2.0","url":"http://www.apache.org/licenses/LICENSE-2.0.html"}},"host":"petstore.swagger.io","basePath":"/v2","tags":[{"name":"pet","description":"Everything about your Pets","externalDocs":{"description":"Find out more","url":"http://swagger.io"}},{"name":"store","description":"Access to Petstore orders"},{"name":"user","description":"Operations about user","externalDocs":{"description":"Find out more about our store","url":"http://swagger.io"}}],"schemes":["http"],"paths":{"/pet":{"post":{"tags":["pet"],"summary":"Add a new pet to the store","description":"","operationId":"addPet","consumes":["application/json","application/xml"],"produces":["application/xml","application/json"],"parameters":[{"in":"body","name":"body","description":"Pet object that needs to be added to the store","required":true,"schema":{"$ref":"#/definitions/Pet"}}],"responses":{"405":{"description":"Invalid input"}},"security":[{"petstore_auth":["write:pets","read:pets"]}]},"put":{"tags":["pet"],"summary":"Update an existing pet","description":"","operationId":"updatePet","consumes":["application/json","application/xml"],"produces":["application/xml","application/json"],"parameters":[{"in":"body","name":"body","description":"Pet object that needs to be added to the store","required":true,"schema":{"$ref":"#/definitions/Pet"}}],"responses":{"400":{"description":"Invalid ID supplied"},"404":{"description":"Pet not found"},"405":{"description":"Validation exception"}},"security":[{"petstore_auth":["write:pets","read:pets"]}]}},"/pet/findByStatus":{"get":{"tags":["pet"],"summary":"Finds Pets by status","description":"Multiple status values can be provided with comma separated strings","operationId":"findPetsByStatus","produces":["application/xml","application/json"],"parameters":[{"name":"status","in":"query","description":"Status values that need to be considered for filter","required":true,"type":"array","items":{"type":"string","enum":["available","pending","sold"],"default":"available"},"collectionFormat":"multi"}],"responses":{"200":{"description":"successful operation","schema":{"type":"array","items":{"$ref":"#/definitions/Pet"}}},"400":{"description":"Invalid status value"}},"security":[{"petstore_auth":["write:pets","read:pets"]}]}},"/pet/findByTags":{"get":{"tags":["pet"],"summary":"Finds Pets by tags","description":"Muliple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.","operationId":"findPetsByTags","produces":["application/xml","application/json"],"parameters":[{"name":"tags","in":"query","description":"Tags to filter by","required":true,"type":"array","items":{"type":"string"},"collectionFormat":"multi"}],"responses":{"200":{"description":"successful operation","schema":{"type":"array","items":{"$ref":"#/definitions/Pet"}}},"400":{"description":"Invalid tag value"}},"security":[{"petstore_auth":["write:pets","read:pets"]}],"deprecated":true}},"/pet/{petId}":{"get":{"tags":["pet"],"summary":"Find pet by ID","description":"Returns a single pet","operationId":"getPetById","produces":["application/xml","application/json"],"parameters":[{"name":"petId","in":"path","description":"ID of pet to return","required":true,"type":"integer","format":"int64"}],"responses":{"200":{"description":"successful operation","schema":{"$ref":"#/definitions/Pet"}},"400":{"description":"Invalid ID supplied"},"404":{"description":"Pet not found"}},"security":[{"api_key":[]}]},"post":{"tags":["pet"],"summary":"Updates a pet in the store with form data","description":"","operationId":"updatePetWithForm","consumes":["application/x-www-form-urlencoded"],"produces":["application/xml","application/json"],"parameters":[{"name":"petId","in":"path","description":"ID of pet that needs to be updated","required":true,"type":"integer","format":"int64"},{"name":"name","in":"formData","description":"Updated name of the pet","required":false,"type":"string"},{"name":"status","in":"formData","description":"Updated status of the pet","required":false,"type":"string"}],"responses":{"405":{"description":"Invalid input"}},"security":[{"petstore_auth":["write:pets","read:pets"]}]},"delete":{"tags":["pet"],"summary":"Deletes a pet","description":"","operationId":"deletePet","produces":["application/xml","application/json"],"parameters":[{"name":"api_key","in":"header","required":false,"type":"string"},{"name":"petId","in":"path","description":"Pet id to delete","required":true,"type":"integer","format":"int64"}],"responses":{"400":{"description":"Invalid ID supplied"},"404":{"description":"Pet not found"}},"security":[{"petstore_auth":["write:pets","read:pets"]}]}},"/pet/{petId}/uploadImage":{"post":{"tags":["pet"],"summary":"uploads an image","description":"","operationId":"uploadFile","consumes":["multipart/form-data"],"produces":["application/json"],"parameters":[{"name":"petId","in":"path","description":"ID of pet to update","required":true,"type":"integer","format":"int64"},{"name":"additionalMetadata","in":"formData","description":"Additional data to pass to server","required":false,"type":"string"},{"name":"file","in":"formData","description":"file to upload","required":false,"type":"file"}],"responses":{"200":{"description":"successful operation","schema":{"$ref":"#/definitions/ApiResponse"}}},"security":[{"petstore_auth":["write:pets","read:pets"]}]}},"/store/inventory":{"get":{"tags":["store"],"summary":"Returns pet inventories by status","description":"Returns a map of status codes to quantities","operationId":"getInventory","produces":["application/json"],"parameters":[],"responses":{"200":{"description":"successful operation","schema":{"type":"object","additionalProperties":{"type":"integer","format":"int32"}}}},"security":[{"api_key":[]}]}},"/store/order":{"post":{"tags":["store"],"summary":"Place an order for a pet","description":"","operationId":"placeOrder","produces":["application/xml","application/json"],"parameters":[{"in":"body","name":"body","description":"order placed for purchasing the pet","required":true,"schema":{"$ref":"#/definitions/Order"}}],"responses":{"200":{"description":"successful operation","schema":{"$ref":"#/definitions/Order"}},"400":{"description":"Invalid Order"}}}},"/store/order/{orderId}":{"get":{"tags":["store"],"summary":"Find purchase order by ID","description":"For valid response try integer IDs with value >= 1 and <= 10. Other values will generated exceptions","operationId":"getOrderById","produces":["application/xml","application/json"],"parameters":[{"name":"orderId","in":"path","description":"ID of pet that needs to be fetched","required":true,"type":"integer","maximum":10.0,"minimum":1.0,"format":"int64"}],"responses":{"200":{"description":"successful operation","schema":{"$ref":"#/definitions/Order"}},"400":{"description":"Invalid ID supplied"},"404":{"description":"Order not found"}}},"delete":{"tags":["store"],"summary":"Delete purchase order by ID","description":"For valid response try integer IDs with positive integer value. Negative or non-integer values will generate API errors","operationId":"deleteOrder","produces":["application/xml","application/json"],"parameters":[{"name":"orderId","in":"path","description":"ID of the order that needs to be deleted","required":true,"type":"integer","minimum":1.0,"format":"int64"}],"responses":{"400":{"description":"Invalid ID supplied"},"404":{"description":"Order not found"}}}},"/user":{"post":{"tags":["user"],"summary":"Create user","description":"This can only be done by the logged in user.","operationId":"createUser","produces":["application/xml","application/json"],"parameters":[{"in":"body","name":"body","description":"Created user object","required":true,"schema":{"$ref":"#/definitions/User"}}],"responses":{"default":{"description":"successful operation"}}}},"/user/createWithArray":{"post":{"tags":["user"],"summary":"Creates list of users with given input array","description":"","operationId":"createUsersWithArrayInput","produces":["application/xml","application/json"],"parameters":[{"in":"body","name":"body","description":"List of user object","required":true,"schema":{"type":"array","items":{"$ref":"#/definitions/User"}}}],"responses":{"default":{"description":"successful operation"}}}},"/user/createWithList":{"post":{"tags":["user"],"summary":"Creates list of users with given input array","description":"","operationId":"createUsersWithListInput","produces":["application/xml","application/json"],"parameters":[{"in":"body","name":"body","description":"List of user object","required":true,"schema":{"type":"array","items":{"$ref":"#/definitions/User"}}}],"responses":{"default":{"description":"successful operation"}}}},"/user/login":{"get":{"tags":["user"],"summary":"Logs user into the system","description":"","operationId":"loginUser","produces":["application/xml","application/json"],"parameters":[{"name":"username","in":"query","description":"The user name for login","required":true,"type":"string"},{"name":"password","in":"query","description":"The password for login in clear text","required":true,"type":"string"}],"responses":{"200":{"description":"successful operation","schema":{"type":"string"},"headers":{"X-Rate-Limit":{"type":"integer","format":"int32","description":"calls per hour allowed by the user"},"X-Expires-After":{"type":"string","format":"date-time","description":"date in UTC when token expires"}}},"400":{"description":"Invalid username/password supplied"}}}},"/user/logout":{"get":{"tags":["user"],"summary":"Logs out current logged in user session","description":"","operationId":"logoutUser","produces":["application/xml","application/json"],"parameters":[],"responses":{"default":{"description":"successful operation"}}}},"/user/{username}":{"get":{"tags":["user"],"summary":"Get user by user name","description":"","operationId":"getUserByName","produces":["application/xml","application/json"],"parameters":[{"name":"username","in":"path","description":"The name that needs to be fetched. Use user1 for testing. ","required":true,"type":"string"}],"responses":{"200":{"description":"successful operation","schema":{"$ref":"#/definitions/User"}},"400":{"description":"Invalid username supplied"},"404":{"description":"User not found"}}},"put":{"tags":["user"],"summary":"Updated user","description":"This can only be done by the logged in user.","operationId":"updateUser","produces":["application/xml","application/json"],"parameters":[{"name":"username","in":"path","description":"name that need to be updated","required":true,"type":"string"},{"in":"body","name":"body","description":"Updated user object","required":true,"schema":{"$ref":"#/definitions/User"}}],"responses":{"400":{"description":"Invalid user supplied"},"404":{"description":"User not found"}}},"delete":{"tags":["user"],"summary":"Delete user","description":"This can only be done by the logged in user.","operationId":"deleteUser","produces":["application/xml","application/json"],"parameters":[{"name":"username","in":"path","description":"The name that needs to be deleted","required":true,"type":"string"}],"responses":{"400":{"description":"Invalid username supplied"},"404":{"description":"User not found"}}}}},"securityDefinitions":{"petstore_auth":{"type":"oauth2","authorizationUrl":"http://petstore.swagger.io/oauth/dialog","flow":"implicit","scopes":{"write:pets":"modify pets in your account","read:pets":"read your pets"}},"api_key":{"type":"apiKey","name":"api_key","in":"header"}},"definitions":{"Order":{"type":"object","properties":{"id":{"type":"integer","format":"int64"},"petId":{"type":"integer","format":"int64"},"quantity":{"type":"integer","format":"int32"},"shipDate":{"type":"string","format":"date-time"},"status":{"type":"string","description":"Order Status","enum":["placed","approved","delivered"]},"complete":{"type":"boolean","default":false}},"xml":{"name":"Order"}},"Category":{"type":"object","properties":{"id":{"type":"integer","format":"int64"},"name":{"type":"string"}},"xml":{"name":"Category"}},"User":{"type":"object","properties":{"id":{"type":"integer","format":"int64"},"username":{"type":"string"},"firstName":{"type":"string"},"lastName":{"type":"string"},"email":{"type":"string"},"password":{"type":"string"},"phone":{"type":"string"},"userStatus":{"type":"integer","format":"int32","description":"User Status"}},"xml":{"name":"User"}},"Tag":{"type":"object","properties":{"id":{"type":"integer","format":"int64"},"name":{"type":"string"}},"xml":{"name":"Tag"}},"Pet":{"type":"object","required":["name","photoUrls"],"properties":{"id":{"type":"integer","format":"int64"},"category":{"$ref":"#/definitions/Category"},"name":{"type":"string","example":"doggie"},"photoUrls":{"type":"array","xml":{"name":"photoUrl","wrapped":true},"items":{"type":"string"}},"tags":{"type":"array","xml":{"name":"tag","wrapped":true},"items":{"$ref":"#/definitions/Tag"}},"status":{"type":"string","description":"pet status in the store","enum":["available","pending","sold"]}},"xml":{"name":"Pet"}},"ApiResponse":{"type":"object","properties":{"code":{"type":"integer","format":"int32"},"type":{"type":"string"},"message":{"type":"string"}}}},"externalDocs":{"description":"Find out more about Swagger","url":"http://swagger.io"}}';

      beforeEach(function () {
        readFileStub = sinon.stub(importService, 'readFile', function () {
          return $q.when(swaggerPetStore2);
        });

        checkExistenceStub = sinon.stub(importService, 'checkExistence', function () {
          return $q.when(false);
        });

        createFileStub = sinon.stub(importService, 'createFile', function (f) {
          return $q.when(f);
        });
      });

      afterEach(function () {
        readFileStub.restore();
        createFileStub.restore();
        checkExistenceStub.restore();
      });

      it('should respond with RAML', function () {
        var spy     = sinon.spy();
        var promise = swaggerToRAML.file({ name: 'api-docs.json' });

        promise.then(function(raml) {
          console.log(raml);
          spy(raml);
        }).catch(function (err) {
          console.log(err);
          spy(err);
        });

        $rootScope.$digest();

        //spy.should.have.been.called.once;
      });
    });

    describe('parse HTTP(s) resources', function () {
      var URL = 'http://petstore.swagger.io/v2/swagger.json';

      it('should respond with RAML', function () {
        var spy = sinon.spy();

        var promise = swaggerToRAML.url(URL);
        promise.then(function(raml) {
          console.log(raml);
          spy(raml);
        }).catch(function (err) {
          console.log(err);
          spy(err);
        });

        $rootScope.$digest();

        //spy.should.have.been.called.once;
        //spy.getCall(0).args[0].should.be.a('string').and.match(/^#%RAML 0.8/);
      });
    });

  });
});
