'use strict';

describe('RAML Parser adapter', function () {
  var ramlParserAdapter;

  angular.module('ramlParserAdapterTest', ['ramlEditorApp']);
  beforeEach(module('ramlParserAdapterTest'));

  beforeEach(inject(function ($injector) {
    ramlParserAdapter = $injector.get('ramlParserAdapter');
  }));

  describe('parse RAML', function () {
    it('should parse the parse the RAML file with version and title', function (done) {
      var file = {
        name: 'api.raml',
        path: '/api.raml',
        contents: '#%RAML 1.0\ntitle: My RAML'
      };

      var loadPath = ramlParserAdapter.loadPathUnwrapped('/api.raml', function (path) {
        return Promise.resolve(path === file.path ? file.contents : '');
      });
      loadPath.then(
        function (api) {
          api.ramlVersion.should.be.equal('RAML10');
          api.specification.title.should.be.equal('My RAML');
          done();
        }
      );
    });

    it('should parse the expand with out flag the RAML file with title and types', function (done) {
      var file = {
        name: 'api.raml',
        path: '/api.raml',
        contents: [
          '#%RAML 1.0',
          'title: My RAML',
          'uses:',
          '  lib: library.raml',
          '/myResource:',
          '  get:',
          '    body:',
          '      application/json:',
          '        type: lib.MyType'
        ].join('\n')
      };

      var lib = {
        name: 'library.raml',
        path: '/library.raml',
        contents: [
          '#%RAML 1.0',
          'title: My Lib',
          'types:',
          '  MyType:',
          '    properties:',
          '      name: string',
          '      address: string'
        ].join('\n')
      };

      var loadPath = ramlParserAdapter.loadPathUnwrapped('/api.raml', function (path) {
        var content;
        if (path === file.path) { content = file.contents; }
        if (path === lib.path) { content = lib.contents; }

        return Promise.resolve(content ? content : '');
      });

      loadPath.then(
        function (api) {
          var raml = api.specification;
          raml.title.should.be.equal('My RAML');
          raml.types[0]['lib.MyType'].name.should.be.equal('MyType');
          done();
        }
      );
    });

  });
});
