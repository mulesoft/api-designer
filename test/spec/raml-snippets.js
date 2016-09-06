'use strict';

describe('RAML Snippets', function () {
  var ramlSnippets;

  beforeEach(module('raml'));
  beforeEach(inject(function ($injector) {
    ramlSnippets = $injector.get('ramlSnippets');
  }));

  it('should provide snippets for all supported HTTP methods', function () {
    ['options', 'get', 'head', 'post', 'put', 'delete', 'trace', 'connect', 'patch'].forEach(function (httpMethod) {
      ramlSnippets.getSnippet({key: httpMethod}).should.be.deep.equal([
        httpMethod + ':',
        '  description: <<insert text or markdown here>>',
      ]);
    });
  });

  it('should provide snippets for "title", "baseUri", "version" root level elements', function () {
    ramlSnippets.getSnippet({key: 'title'}).should.be.deep.equal([
      'title: My API'
    ]);

    ramlSnippets.getSnippet({key: 'version'}).should.be.deep.equal([
      'version: v0.1'
    ]);

    ramlSnippets.getSnippet({key: 'baseUri'}).should.be.deep.equal([
      'baseUri: http://server/api/{version}'
    ]);
  });

  it('should provide snippet for "<resource>"', function () {
    ramlSnippets.getSnippet({key: '<resource>'}).should.be.deep.equal([
      '/newResource:',
      '  displayName: resourceName'
    ]);
  });

  it('should provide an empty RAML', function () {
    ramlSnippets.getEmptyRaml().should.be.equal([
      '#%RAML 1.0',
      'title:'
    ].join('\n'));
  });

  it('should add ":" at the end if key was not recognized', function () {
    ramlSnippets.getSnippet({key: 'foo'}).should.be.deep.equal([
      'foo:'
    ]);
  });

  it('should not add ":" at the end if suggestion is a text node', function () {
    ramlSnippets.getSnippet({key: 'foo', metadata: {isText: true}}).should.be.deep.equal([
      'foo',
      ''
    ]);
  });
});
