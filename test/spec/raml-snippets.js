'use strict';

describe('RAML Snippets', function () {
  var ramlSnippets;

  beforeEach(module('raml'));
  beforeEach(inject(function ($injector) {
    ramlSnippets = $injector.get('ramlSnippets');
  }));

  it('should provide snippets for all supported HTTP methods', function () {
    function generateMethodTemplate (httpMethod) {
      return ['{{padding}}' + httpMethod + ':',
      '{{padding}}  description: <<insert text or markdown here>>',
      ''].join('\n');
    }

    ['options', 'get', 'head', 'post', 'put', 'delete', 'trace', 'connect', 'patch'].forEach(function (httpMethod) {
      ramlSnippets.getSnippet({name: httpMethod}).should.be.equal(
        generateMethodTemplate(httpMethod)
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
