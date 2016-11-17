(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .service('mockingServiceClient', function mockingServiceClientFactory($http, $q, $window, resolveUri) {
      var self = this;

      self.proxy   = null;
      // self.baseUri = 'http://mocksvc.mulesoft.com';
      self.baseUri = 'http://ec2-52-201-242-128.compute-1.amazonaws.com';

      self.buildURL = function buildURL() {
        var url   = self.baseUri + ['/mocks'].concat(Array.prototype.slice.call(arguments, 0)).join('/');
        var proxy = self.proxy || $window.RAML.Settings.proxy;

        if (proxy) {
          url = proxy + resolveUri(url);
        }

        return url;
      };

      function cleanBaseUri(mock) {
        var baseUri       = mock.baseUri;
        var mocksQuantity = baseUri.match(/mocks\//g).length;

        if (mocksQuantity > 1) {
          var mocks = 'mocks/';

          for (var i = mocksQuantity; i > 1; i--) {
            var from  = baseUri.indexOf(mocks);
            var to    = baseUri.indexOf('/', from + mocks.length);
            baseUri   = baseUri.substring(0, from) + baseUri.substring(to + 1, baseUri.length);
          }

        }
        mock.baseUri = baseUri;
      }

      self.simplifyMock = function simplifyMock(mock) {
        if (mock.baseUri) { cleanBaseUri(mock); }

        return {
          id:        mock.id,
          baseUri:   mock.baseUri,
          manageKey: mock.manageKey
        };
      };

      self.getMock = function getMock(mock) {
        return $http.get(self.buildURL(mock.id, mock.manageKey)).then(
          function success(response) {
            return self.simplifyMock(response.data);
          },

          function failure(response) {
            if (response.status === 404) {
              return;
            }

            return $q.reject(response);
          }
        );
      };

      self.createMock = function createMock(mock) {
        return $http.post(self.buildURL(), mock).then(
          function success(response) {
            return self.simplifyMock(response.data);
          }
        );
      };

      self.updateMock = function updateMock(mock) {
        return $http({
          method: 'PATCH',
          url:    self.buildURL(mock.id, mock.manageKey),
          data:   {raml: mock.raml, json: mock.json}
        }).then(
          function success(response) {
            return self.simplifyMock(angular.extend(mock, response.data));
          }
        );
      };

      self.deleteMock = function deleteMock(mock) {
        return $http.delete(self.buildURL(mock.id, mock.manageKey));
      };
    })
  ;
})();
