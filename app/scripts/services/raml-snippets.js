'use strict';

angular.module('raml')
  .value('snippets', {
    get: ['', 'get:\n', '  description: <<insert text or markdown here>>\n'],
    post: ['', 'post:\n', '  description: <<insert text or markdown here>>\n'],
    put: ['', 'put:\n', '  description: <<insert text or markdown here>>\n'],
    'delete': ['', 'delete:\n', '  description: <<insert text or markdown here>>\n'],
    'new resource': ['', '/newResource:\n', '  displayName: resourceName\n'],
    title: ['', 'title: My API\n'],
    version: ['', 'version: v0.1\n'],
    baseuri: ['', 'baseUri: http://server/api/{version}\n']
  })
  .factory('ramlSnippets', function (snippets) {
    var service = {};

    service.getEmptyRaml = function () {
      return '#%RAML 0.8\n' +
             'title:';
    };

    service.getSnippet = function (suggestion) {
      var snippetName = suggestion.name;
      var ind = '{{padding}}';

      var snippetToSuggest = snippets[snippetName.toLowerCase()];

      if (snippetToSuggest) {
        return snippetToSuggest.join(ind);
      }

      if (suggestion.isText) {
        return ind + snippetName + '\n';
      }

      return ind + snippetName + ':';
    };

    return service;
  });
