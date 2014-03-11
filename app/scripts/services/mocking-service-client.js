'use strict';

angular.module('ramlEditorApp')
  .service('mockingServiceClient', function mockingServiceClientFactory($http, $q, $window) {
    var self = this;

    self.proxy = null;
    self.host  = 'http://mocksvc.mulesoft.com';
    self.base  = '/mocks';

    self.buildURL = function buildURL() {
      var url   = self.host + self.base + [''].concat(Array.prototype.slice.call(arguments, 0)).join('/');
      var proxy = self.proxy || $window.RAML.Settings.proxy;

      if (proxy) {
        url = proxy + url;
      }

      return url;
    };

    self.simplifyMock = function simplifyMock(mock) {
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
