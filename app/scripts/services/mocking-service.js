(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .service('mockingService', function mockingServiceFactory(
      mockingServiceClient,
      ramlRepository
    ) {
      var self = this;

      function getMockMeta(file) {
        return ramlRepository.loadMeta(file)
          .then(function success(meta) {
            return meta.mock;
          });
      }

      function setMockMeta(file, mock) {
        return ramlRepository.loadMeta(file)
          .then(function success(meta) {
            meta.mock = mock;
            return ramlRepository.saveMeta(file, meta);
          })
          .then(function success() {
            return mock;
          });
      }

      self.getMock = function getMock(file) {
        return getMockMeta(file);
      };

      self.enableMock = function createMock(file) {
        return mockingServiceClient.enableMock(file)
          .then(function (mock) {
              return setMockMeta(file, mock);
          });
      };

      self.deleteMock = function deleteMock(file) {
        return mockingServiceClient.deleteMock(file)
          .then(function success() {
            return setMockMeta(file, null);
          });
      };

      self.deleteMock1 = function deleteMock1(file) {
        return getMockMeta(file)
          .then(function (mock) {
            return mock && mockingServiceClient.deleteMock(mock);
          });
      };

    })
  ;
})();
