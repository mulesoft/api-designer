(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .service('mockingServiceClient', function mockingServiceClientFactory(
      $http,
      $q,
      $window,
      $rootScope,
      resolveUri
    ) {
      var self = this;
      var SEPARATOR = '/';

      self.proxy   = null;
      self.baseUri = 'https://qax.anypoint.mulesoft.com/mocking/api/v1';
      self.legacyBaseUri = 'https://mocksvc.mulesoft.com';

      function mockingIds() {
        var regExp = /^#\/organizations\/([A-Za-z0-9-]+)\/dashboard\/apis\/([0-9-]+)\/versions\/([0-9-]+).*$/;
        var match = $window.location.hash.match(regExp);

        if (match === null || !match[1] || !match[2] || !match[3]) {
          return [];
        }

        return match.slice(1);
      }

      self.buildMockingService1Url = function buildMockingService2Url() {
        return self.legacyBaseUri + ['/mocks'].concat(Array.prototype.slice.call(arguments, 0)).join('/');
      };

      self.buildMockingService2Url = function buildMockingService2Url() {
        var args = ['sources', 'manager', 'apis'].concat(mockingIds()).concat(Array.prototype.slice.call(arguments, 0));
        return self.baseUri + SEPARATOR + args.join(SEPARATOR);
      };

      self.buildURL = function buildURL(url) {
        var completeUrl = url ? url : self.buildMockingService2Url();
        var proxy = self.proxy || $window.RAML.Settings.proxy;

        if (proxy) {
          completeUrl = proxy + resolveUri(completeUrl);
        }

        return completeUrl;
      };

      function getToken() {
        try {
          return JSON.parse(localStorage.user).token || '';
        } catch (e) {
          return '';
        }
      }

      function customHeader(file) {
        return {
          'MS2-Authorization': getToken(),
          'MS2-Main-File': encodeURI((file && file.name) || ''),
          'MS2-Origin': 'API Designer Legacy'
        };
      }

      self.enableMock = function createMock(file) {
        return $http.post(self.buildURL(this.buildMockingService2Url('link')), null, {headers: customHeader(file)})
          .then(function (mock) {
            const mockId = mock.data.id;
            return $http.get(self.buildURL(), { headers: customHeader(file) })
              .then(function (mockMetadata) {
                var baseUriPath = mockMetadata.data && mockMetadata.data.metadata && mockMetadata.data.metadata.baseUriPath;
                return self.baseUri + '/links/' + mockId  + baseUriPath;
              });
          });
      };

      self.deleteMock = function deleteMock(file) {
        return $http.delete(self.buildURL(), { headers: customHeader(file) });
      };

      self.deleteMock1 = function deleteMock1(mock) {
        return $http.delete(self.buildURL(self.buildMockingService1Url(), mock.id, mock.manageKey));
      };

      $rootScope.$on('event:evict-mocking', function(event, file) {
        self.deleteMock(file);
      });
    })
  ;
})();
