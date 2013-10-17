'use strict';

angular.module('raml')
  .factory('ramlSnippets', function () {
    var service = {};

    service.getEmptyRaml = function () {
      return '#%RAML 0.8\n';
    };

    service.getSnippet = function (suggestion) {
      var snippetName = suggestion.name;
      var ind = '{{padding}}';

      if (snippetName.toLowerCase() === 'get') {
        return '' +
          ind + 'get:\n' +
          ind + '  description: <<insert text or markdown here>>\n';
      }

      if (snippetName.toLowerCase() === 'post') {
        return '' +
          ind + 'post:\n' +
          ind + '  description: <<insert text or markdown here>>\n';
      }

      if (snippetName.toLowerCase() === 'put') {
        return '' +
          ind + 'put:\n' +
          ind + '  description: <<insert text or markdown here>>\n';
      }

      if (snippetName.toLowerCase() === 'delete') {
        return '' +
          ind + 'delete:\n' +
          ind + '  description: <<insert text or markdown here>>\n';
      }

      if (snippetName.toLowerCase() === 'new resource') {
        return '' +
          ind + '/newResource:\n' +
          ind + '  displayName: resourceName\n';
      }

      if (snippetName.toLowerCase() === 'title') {
        return '' +
          ind + 'title: My API\n';
      }

      if (snippetName.toLowerCase() === 'version') {
        return '' +
          ind + 'version: v0.1\n';
      }

      if (snippetName.toLowerCase() === 'baseuri') {
        return '' +
          ind + 'baseUri: http://server/api/{version}\n';
      }

      if (suggestion.isText) {
        return ind + snippetName + '\n';
      }

      return ind + snippetName + ':';
    };

    return service;
  });
