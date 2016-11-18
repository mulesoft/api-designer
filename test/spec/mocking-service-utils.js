'use strict';

describe('Raml Expander', function () {
  var ramlParserAdapter;

  angular.module('ramlExpanderTest', ['ramlEditorApp']);
  beforeEach(module('ramlExpanderTest'));

  beforeEach(inject(function ($injector) {
    ramlParserAdapter = $injector.get('ramlParserAdapter');
  }));

  describe('Dereference raml', function () {
    it('should dereference type', function (done) {
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

      ramlParserAdapter.loadPathUnwrapped('/api.raml', function (path) {
        var content;
        if (path === file.path) {
          content = file.contents;
        }
        if (path === lib.path) {
          content = lib.contents;
        }

        return Promise.resolve(content ? content : '');
      }).then(function (api) {
        var raml = api.specification;
        raml.title.should.be.equal('My RAML');
        raml.types[0]['lib.MyType'].name.should.be.equal('MyType');
        // raml.resources[0].methods[0].body['application/json'].type[0].should.be.equal('lib.MyType');

        raml.resources[0].methods[0].body['application/json'].type[0].should.be.equal('object');
        raml.resources[0].methods[0].body['application/json'].properties.name.type[0].should.be.equal('string');
        raml.resources[0].methods[0].body['application/json'].properties.address.type[0].should.be.equal('string');

        done();
      }).catch(function (error) {
        expect(error).to.be.undefined();
        done();
      });
    });

    describe('Dereference raml', function () {
      it('should not replace example in the resource', function (done) {
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
            '        type: lib.MyType',
            '        example: ',
            '          name: The Name',
            '          address: Some Address'
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
            '      address: string',
            '    example:',
            '      name: Example Name',
            '      address: Example Address'
          ].join('\n')
        };

        ramlParserAdapter.loadPathUnwrapped('/api.raml', function (path) {
          var content;
          if (path === file.path) {
            content = file.contents;
          }
          if (path === lib.path) {
            content = lib.contents;
          }

          return Promise.resolve(content ? content : '');
        }).then(function (api) {
          var raml = api.specification;
          raml.title.should.be.equal('My RAML');
          raml.types[0]['lib.MyType'].name.should.be.equal('MyType');

          raml.resources[0].methods[0].body['application/json'].type[0].should.be.equal('object');
          raml.resources[0].methods[0].body['application/json'].example.name.should.be.equal('The Name');
          raml.resources[0].methods[0].body['application/json'].example.address.should.be.equal('Some Address');

          should.not.exist(raml.resources[0].methods[0].body['application/json'].examples);

          done();
        }).catch(function (error) {
          expect(error).to.be.undefined();
          done();
        });
      });
    });

    describe('Dereference raml', function () {
      it('should not add "examples" in the resource', function (done) {
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
            '        type: lib.MyType',
            '        example:',
            '          name: The Name',
            '          address: Some Address'
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
            '      address: string',
            '    examples:',
            '      example1:',
            '        name: Example Name',
            '        address: Example Address',
            '      example2:',
            '        name: Example Name 2',
            '        address: Example Address 2'
          ].join('\n')
        };

        ramlParserAdapter.loadPathUnwrapped('/api.raml', function (path) {
          var content;
          if (path === file.path) {
            content = file.contents;
          }
          if (path === lib.path) {
            content = lib.contents;
          }

          return Promise.resolve(content ? content : '');
        }).then(function (api) {
          var raml = api.specification;
          raml.title.should.be.equal('My RAML');
          raml.types[0]['lib.MyType'].name.should.be.equal('MyType');

          raml.resources[0].methods[0].body['application/json'].type[0].should.be.equal('object');
          raml.resources[0].methods[0].body['application/json'].example.name.should.be.equal('The Name');
          raml.resources[0].methods[0].body['application/json'].example.address.should.be.equal('Some Address');

          should.not.exist(raml.resources[0].methods[0].body['application/json'].examples);

          done();
        }).catch(function (error) {
          expect(error).to.be.undefined();
          done();
        });
      });
    });

    describe('Dereference raml', function () {
      it('should not add "example" in the resource if it has examples', function (done) {
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
            '        type: lib.MyType',
            '        examples:',
            '          example1:',
            '            name: The Name',
            '            address: Some Address',
            '          example2:',
            '            name: The Name 2',
            '            address: Some Address 2'
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
            '      address: string',
            '    example:',
            '      name: Example Name',
            '      address: Example Address'
          ].join('\n')
        };

        ramlParserAdapter.loadPathUnwrapped('/api.raml', function (path) {
          var content;
          if (path === file.path) {
            content = file.contents;
          }
          if (path === lib.path) {
            content = lib.contents;
          }

          return Promise.resolve(content ? content : '');
        }).then(function (api) {
          var raml = api.specification;
          raml.title.should.be.equal('My RAML');
          raml.types[0]['lib.MyType'].name.should.be.equal('MyType');

          raml.resources[0].methods[0].body['application/json'].type[0].should.be.equal('object');
          raml.resources[0].methods[0].body['application/json'].examples[0]
            .structuredValue.name.should.be.equal('The Name');
          raml.resources[0].methods[0].body['application/json'].examples[0]
            .structuredValue.address.should.be.equal('Some Address');

          should.not.exist(raml.resources[0].methods[0].body['application/json'].example);

          done();
        }).catch(function (error) {
          expect(error).to.be.undefined();
          done();
        });
      });
    });

    it('should dereference array', function (done) {
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
          '        type: lib.MyType[]'
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
          '      address: string',
          '    examples:',
          '      A:',
          '        name: a',
          '        address: aa',
          '      B:',
          '        name: b',
          '        address: bb'
        ].join('\n')
      };

      ramlParserAdapter.loadPathUnwrapped('/api.raml', function (path) {
        var content;
        if (path === file.path) {
          content = file.contents;
        }
        if (path === lib.path) {
          content = lib.contents;
        }

        return Promise.resolve(content ? content : '');
      }).then(function (api) {
        var raml = api.specification;
        raml.title.should.be.equal('My RAML');
        raml.types[0]['lib.MyType'].name.should.be.equal('MyType');
        // raml.resources[0].methods[0].body['application/json'].type[0].should.be.equal('array');
        // raml.resources[0].methods[0].body['application/json'].items.should.be.equal('lib.MyType');

        raml.resources[0].methods[0].body['application/json'].type[0].should.be.equal('array');
        raml.resources[0].methods[0].body['application/json'].items.name.should.be.equal('MyType');
        raml.resources[0].methods[0].body['application/json'].items.examples[0].name.should.be.equal('A');
        raml.resources[0].methods[0].body['application/json'].items.examples[1].name.should.be.equal('B');
        raml.resources[0].methods[0].body['application/json'].example[0].name.should.be.equal('a');
        raml.resources[0].methods[0].body['application/json'].example[1].name.should.be.equal('b');

        done();
      }).catch(function (error) {
        expect(error).to.be.undefined();
        done();
      });
    });
  });
});
