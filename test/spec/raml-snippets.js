'use strict';

describe('RAML Snippets', function () {
  var ramlSnippets;

  beforeEach(module('raml'));

  beforeEach(inject(function (_ramlSnippets_) {
    ramlSnippets = _ramlSnippets_;
  }));

  it('should provide snippets for "get", "post", "put", "delete" methods', function () {

    function generateMethodTemplate (name) {
      return ['{{padding}}' + name + ':',
      '{{padding}}  description: <<insert text or markdown here>>',
      ''].join('\n');
    }

    var methods = ['get', 'post', 'put', 'delete'];

    methods.forEach(function (method) {
      ramlSnippets.getSnippet({name: method}).should.be.equal(
        generateMethodTemplate(method)
      );
    });

  });
  
  it('should provide snippets for "title", "baseUri", "version" root level elements', function () {
    ramlSnippets.getSnippet({name: 'title'}).should.be.equal([
      '{{padding}}title: My API',
      ''
    ].join('\n'));

    ramlSnippets.getSnippet({name: 'version'}).should.be.equal([
      '{{padding}}version: v0.1',
      ''
    ].join('\n'));
    
    ramlSnippets.getSnippet({name: 'baseUri'}).should.be.equal([
      '{{padding}}baseUri: http://server/api/{version}',
      ''
    ].join('\n'));
  });

  it('should provide snippet for "new resource"', function () {
    ramlSnippets.getSnippet({name: 'new resource'}).should.be.equal([
      '{{padding}}/newResource:',
      '{{padding}}  displayName: resourceName',
      ''
    ].join('\n'));
  });

  it('should provide an empty RAML', function () {
    ramlSnippets.getEmptyRaml().should.be.equal([
      '#%RAML 0.8',
      'title:'
    ].join('\n'));
  });
  
  it('should add ":" at the end if key was not recognized', function () {
    ramlSnippets.getSnippet({name: 'foo'}).should.be.equal('{{padding}}foo:');
  });

  it('should not add ":" at the end if suggestion is a text node', function () {
    ramlSnippets.getSnippet({name: 'foo', isText: true}).should.be.equal('{{padding}}foo\n');
  });

});
