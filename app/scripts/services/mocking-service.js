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
        })
      ;
    }

    function setMockMeta(file, mock) {
      return ramlRepository.loadMeta(file)
        .then(function success(meta) {
          meta.mock = mock;
          return ramlRepository.saveMeta(file, meta);
        })
        .then(function success() {
          return mock;
        })
      ;
    }

    self.getMock = function getMock(file) {
      return getMockMeta(file);
    };

    self.createMock = function createMock(file, raml) {
      return mockingServiceClient.createMock({raml: file.contents, json: raml})
        .then(function success(mock) {
          return setMockMeta(file, mock);
        })
      ;
    };

    self.updateMock = function updateMock(file, raml) {
      return getMockMeta(file)
        .then(function success(mock) {
          return mock && mockingServiceClient.updateMock(angular.extend(mock, {
            raml: file.contents,
            json: raml
          }));
        })
        .then(function success(mock) {
          return setMockMeta(file, mock);
        })
      ;
    };

    self.deleteMock = function deleteMock(file) {
      return getMockMeta(file)
        .then(function (mock) {
          return mock && mockingServiceClient.deleteMock(mock);
        })
        .then(function success() {
          return setMockMeta(file, null);
        })
      ;
    };
  })
;
