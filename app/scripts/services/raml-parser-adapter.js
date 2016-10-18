(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .factory('ramlParserAdapter', function ramlParserAdapter($http, $q, $window) {
      var jsonOptions = {
        serializeMetadata: false,
        dumpSchemaContents: true
      };

      return {
        loadPath: toQ(loadPath),
        expandApiToJSON: expandApiToJSON
      };

      // ---

      function loadPath(path, contentAsyncFn, options) {
        return loadApi(path, function contentAsync(path) {
          return contentAsyncFn ? contentAsyncFn(path) : $q.reject(new Error('ramlParser: loadPath: contentAsync: ' + path + ': no such path'));
        }, options);
      }

      // ---

      function toQ(fn) {
        return function toQWrapper() {
          return $q.when(fn.apply(this, arguments));
        };
      }

      function expandApiToJSON(api, expandFlag) {
        api = api.expand ? api.expand(expandFlag) : api;
        var apiJSON = api.toJSON(jsonOptions);
        if (api.uses && api.uses()) {
          apiJSON.uses = {};
          api.uses().forEach(function (usesItem) {
            var libraryAST = usesItem.ast();
            libraryAST = libraryAST.expand ? libraryAST.expand() : libraryAST;
            apiJSON.uses[usesItem.key()] = libraryAST.toJSON(jsonOptions);
          });
        }
        return apiJSON;
      }

      /**
       * @param  {String}   path
       * @param  {Function} contentAsyncFn
       * @param  {Object}   options
       * @param  {Boolean}  options.bypassProxy
       */
      function loadApi(path, contentAsyncFn, options) {
        options = options || {};
        return RAML.Parser.loadApi(path, {
          attributeDefaults: true,
          rejectOnErrors:    true,
          fsResolver:        {
            contentAsync: contentAsyncFn,
            content:      content
          },
          httpResolver:      {
            getResourceAsync: function getResourceAsync(url) {
              var settings = ($window.RAML || {}).Settings || {};
              var proxy    = (options.bypassProxy ? {} : settings).proxy || '';
              var req      = {
                method: 'GET',
                url: proxy + url,
                headers: {
                  'Accept': 'application/raml+yaml'
                },
                transformResponse: null
              };
              return $http(req)
                .then(function (res) {
                  return {content: res.data};
                })
                ;
            }
          }
        });

        // ---

        function content(path) {
          throw new Error('ramlParser: loadPath: loadApi: content: ' + path + ': no such path');
        }
      }
    })
  ;
})();
