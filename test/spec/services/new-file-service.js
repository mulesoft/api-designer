'use strict';

describe('newFileService', function () {
  var $q;
  var $rootScope;
  var newFileService;
  var ramlRepository;

  beforeEach(module('ramlEditorApp'));

  beforeEach(inject(function ($injector) {
    $q = $injector.get('$q');
    $rootScope = $injector.get('$rootScope');
    newFileService = $injector.get('newFileService');
    ramlRepository = $injector.get('ramlRepository');
  }));

  describe('new fragment file', function () {
    function resolve() {
      return $q.when({});
    }

    beforeEach(function () {
      $rootScope.fileBrowser = {
        rootFile: {
          type: 'file',
          path: '/api.raml',
          isDirectory : true,
          extension: 'raml',
          name: 'api.raml',
          contents: '#%RAML 1.0\ntitle: My API\nresourceTypes:\n  collection: !include resourceType.raml',
          children: []
        },
        traitFile: {
          type: 'file',
          path: '/trait.raml',
          isDirectory : true,
          extension: 'raml',
          name: 'Trait-1.raml',
          contents: '#%RAML 1.0 Trait\ntitle: My API\nresourceTypes:\n  collection: !include resourceType.raml',
          children: []
        }
      };
      $rootScope.homeDirectory = { path: '/', children: [$rootScope.fileBrowser.rootFile] };
    });

    it('should create raml 1.0 fragment', function () {
      var promptStub = sinon.stub(newFileService, 'prompt', resolve);
      var homeDirectory = ramlRepository.getByPath('/');
      newFileService.newFragmentFile(homeDirectory, '');

      promptStub.should.have.been.calledWith(homeDirectory, '1.0');
    });

    it('should create typed fragment', function () {
      var promptSpy = sinon.spy(newFileService, 'prompt');
      var fragmentType = 'ResourceType';
      newFileService.newFragmentFile($rootScope.homeDirectory, fragmentType);

      promptSpy.should.have.been.calledWith($rootScope.homeDirectory, '1.0', fragmentType);
    });
  });

  describe('new file', function () {
    function resolve() {
      return $q.when({});
    }

    it('should create raml 1.0', function () {
      var promptStub = sinon.stub(newFileService, 'prompt', resolve);
      var homeDirectory = ramlRepository.getByPath('/');
      var version = '1.0';

      newFileService.newFile(homeDirectory, version);

      promptStub.should.have.been.calledWith(homeDirectory, version);
    });

    it('should create raml 0.8', function () {
      var promptStub = sinon.stub(newFileService, 'prompt', resolve);
      var homeDirectory = ramlRepository.getByPath('/');
      var version = '0.8';

      newFileService.newFile(homeDirectory, version);

      promptStub.should.have.been.calledWith(homeDirectory, version);
    });
  });
});
