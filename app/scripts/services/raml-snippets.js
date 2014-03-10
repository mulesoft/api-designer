'use strict';

angular.module('raml')
  .value('snippets', {
    options: ['options:', '  description: <<insert text or markdown here>>'],
    head: ['head:', '  description: <<insert text or markdown here>>'],
    get: ['get:', '  description: <<insert text or markdown here>>'],
    post: ['post:', '  description: <<insert text or markdown here>>'],
    put: ['put:', '  description: <<insert text or markdown here>>'],
    delete: ['delete:', '  description: <<insert text or markdown here>>'],
    trace: ['trace:', '  description: <<insert text or markdown here>>'],
    connect: ['connect:', '  description: <<insert text or markdown here>>'],
    patch: ['patch:', '  description: <<insert text or markdown here>>'],
    '<resource>': ['/newResource:', '  displayName: resourceName'],
    title: ['title: My API'],
    version: ['version: v0.1'],
    baseuri: ['baseUri: http://server/api/{version}']
  })
  .factory('ramlSnippets', function (snippets) {
    var service = {};

    service.getEmptyRaml = function () {
      return [
        '#%RAML 0.8',
        'title:'
      ].join('\n');
    };

    service.getSnippet = function getSnippet(suggestion) {
      var key      = suggestion.key;
      var metadata = suggestion.metadata || {};
      var snippet  = snippets[key.toLowerCase()];

      if (snippet) {
        return snippet;
      }

      if (metadata.isText) {
        //For text elements that are part of an array
        //we do not add an empty line break:
        return suggestion.isList ? [key] : [key, ''];
      }

      return [
        key + ':'
      ];
    };

    return service;
  });
