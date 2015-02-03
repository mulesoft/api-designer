'use strict';

describe('importService', function () {
  var $q;
  var $window;
  var $rootScope;
  var importService;
  var ramlRepository;

  beforeEach(module('ramlEditorApp'));

  beforeEach(inject(function ($injector) {
    $q             = $injector.get('$q');
    $window        = $injector.get('$window');
    $rootScope     = $injector.get('$rootScope');
    importService  = $injector.get('importService');
    ramlRepository = $injector.get('ramlRepository');
  }));

  describe('zip files', function () {
    var zipStub;
    var getByPathStub;
    var createFileStub;
    var checkExistenceStub;
    var createDirectoryStub;

    beforeEach(function () {
      var file = {
        asText: function () { return ''; }
      };

      var directory = {};

      zipStub = sinon.stub($window, 'JSZip', function () {
        var self = {};

        self.files = {
          '/examples/': directory,
          '/examples/account/': directory,
          '/examples/account/item.json': file,
          '/examples/event/': directory,
          '/examples/event/item.json': file,
          '/api.raml': file
        };

        return self;
      });

      getByPathStub = sinon.stub(ramlRepository, 'getByPath', function (path) {
        return { path: path };
      });

      function resolve () {
        return $q.when({});
      }

      createFileStub = sinon.stub(ramlRepository, 'createFile', resolve);
      createDirectoryStub = sinon.stub(ramlRepository, 'createDirectory', resolve);

      checkExistenceStub = sinon.stub(importService, 'checkExistence', resolve);
    });

    afterEach(function () {
      zipStub.restore();

      createFileStub.restore();
      createDirectoryStub.restore();

      checkExistenceStub.restore();
    });

    describe('merge directory', function () {
      describe('with file prefix', function () {
        it('should not remove prefixes', function () {
          var root = ramlRepository.getByPath('/');

          // Test merging of a stubbed zip file.
          importService.mergeZip(root, '');

          $rootScope.$digest();

          createFileStub.should.have.callCount(3);
          createDirectoryStub.should.have.callCount(3);

          createFileStub.should.have.been.calledWith(root, '/api.raml');
          createFileStub.should.have.been.calledWith(root, '/examples/account/item.json');
          createFileStub.should.have.been.calledWith(root, '/examples/event/item.json');

          createDirectoryStub.should.have.been.calledWith(root, '/examples/');
          createDirectoryStub.should.have.been.calledWith(root, '/examples/account/');
          createDirectoryStub.should.have.been.calledWith(root, '/examples/event/');
        });
      });
    });
  });
});
