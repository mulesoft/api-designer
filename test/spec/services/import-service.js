'use strict';

describe('importService', function () {
  var $q;
  var $window;
  var $rootScope;
  var importService;
  var ramlRepository;
  var importServiceConflictModal;

  beforeEach(module('ramlEditorApp'));

  beforeEach(inject(function ($injector) {
    $q                         = $injector.get('$q');
    $window                    = $injector.get('$window');
    $rootScope                 = $injector.get('$rootScope');
    importService              = $injector.get('importService');
    ramlRepository             = $injector.get('ramlRepository');
    importServiceConflictModal = $injector.get('importServiceConflictModal');
  }));

  describe('zip files', function () {
    var zipStub;
    var getByPathStub;
    var createFileStub;
    var checkExistenceStub;

    beforeEach(function () {
      function File(name) {
        this.name = name;
        this.asText = function () {
          return '';
        };
      }

      var directory = {};

      zipStub = sinon.stub($window, 'JSZip', function () {
        var self = {};

        self.files = {
          '/examples/': directory,
          '/examples/account/': directory,
          '/examples/account/item.json': new File('item.json'),
          '/examples/event/': directory,
          '/examples/event/item.json': new File('item.json'),
          '/api.raml': new File('api.raml')
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
      checkExistenceStub = sinon.stub(importService, 'checkExistence', resolve);
    });

    afterEach(function () {
      zipStub.restore();
      createFileStub.restore();
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

          createFileStub.should.have.been.calledWith(root, '/api.raml');
          createFileStub.should.have.been.calledWith(root, '/examples/account/item.json');
          createFileStub.should.have.been.calledWith(root, '/examples/event/item.json');
        });
      });
    });
  });

  describe('import zip', function () {
    var zipStub;
    var getByPathStub;
    var loadFileStub;
    var checkExistenceStub;

    beforeEach(function () {
      function File(name) {
        this.name = name;
        this.asText = function () {
          return 'new content';
        };
      }

      var directory = {};

      zipStub = sinon.stub($window, 'JSZip', function () {
        var self = {};

        self.files = {
          '/examples/': directory,
          '/examples/account/': directory,
          '/examples/account/item.json': new File('item.json'),
          '/examples/event/': directory,
          '/examples/event/item.json': new File('item.json'),
          '/api.raml': new File('api.raml')
        };

        return self;
      });

      getByPathStub = sinon.stub(ramlRepository, 'getByPath', function (path) {
        return { path: path };
      });

      var loadFileResult = function () {
        return $q.when({
          contents: 'old content'
        });
      };
      loadFileStub = sinon.stub(ramlRepository, 'loadFile', loadFileResult);

      var checkExistenceResult = function () {
        return $q.when(importServiceConflictModal.REPLACE_FILE);
      };
      checkExistenceStub = sinon.stub(importService, 'checkExistence', checkExistenceResult);
    });

    afterEach(function () {
      zipStub.restore();
      checkExistenceStub.restore();
      loadFileStub.restore();
    });

    describe('when exists and is resolved with replace', function () {
      it('should replace original file contents', function (done) {
        importService.importZip('/', zipStub)
          .then(function (result) {
            result.dirty.should.be.true;
            result.doc.should.be.truthy;
            result.doc.getValue().should.equal('new content');
            result.contents.should.equal('old content');

            checkExistenceStub.should.have.been.calledWith('/', '/api.raml');
            checkExistenceStub.should.have.been.calledWith('/', '/examples/account/item.json');
            checkExistenceStub.should.have.been.calledWith('/', '/examples/event/item.json');

            done();
          });
        $rootScope.$apply();
      });
    });
  });
});
