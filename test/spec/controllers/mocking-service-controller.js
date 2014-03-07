'use strict';

describe('mockingServiceController', function () {
  var $q;
  var $scope;
  var mockingService;
  var sandbox;

  beforeEach(module('ramlEditorApp'));
  beforeEach(inject(function beforeEach($injector) {
    sandbox        = sinon.sandbox.create();
    mockingService = $injector.get('mockingService');
    $q             = $injector.get('$q');
    $scope         = angular.extend($injector.get('$rootScope').$new(), {
      editor: getEditor($injector.get('codeMirror'))
    });

    sandbox.stub(mockingService, 'getMock', function getMock(file) {
      return $q.when(file.mock);
    });

    sandbox.stub(mockingService, 'createMock', function createMock(file) {
      return $q.when(file.mock || {});
    });

    sandbox.stub(mockingService, 'updateMock', function updateMock(mock) {
      return $q.when(mock);
    });

    sandbox.stub(mockingService, 'deleteMock', function deleteMock() {
      return $q.when();
    });
  }));

  afterEach(function afterEach() {
    sandbox.restore();
  });

  describe('with selected file', function () {
    describe('and mocking service enabled', function () {
      beforeEach(inject(function ($injector) {
        $injector.get('$controller')('mockingServiceController', {
          $scope: angular.extend($scope, {
            fileBrowser: {
              selectedFile: {
                mock: {

                }
              }
            }
          })
        });

        $scope.$apply();
      }));

      it('should set `$scope.enabled`', function () {
        $scope.should.have.property('enabled').and.be.true;
      });

      describe('when raml is updated', function () {
        beforeEach(function () {
          $scope.fileBrowser.selectedFile.raml = {};
          $scope.$apply();
        });

        it('should update mocking service', function () {
          mockingService.updateMock.should.have.been.called;
        });
      }); // when raml is updated

      describe('#toggleMockingService', function () {
        it('should disable mocking service', function () {
          $scope.toggleMockingService();
          $scope.$apply();

          $scope.should.have.property('enabled').and.be.false;
        });
      }); // #toggleMockingService
    }); // and mocking service enabled

    describe('and mocking service disabled', function () {
      beforeEach(inject(function ($injector) {
        $injector.get('$controller')('mockingServiceController', {
          $scope: angular.extend($scope, {
            fileBrowser: {
              selectedFile: {
                mock: null
              }
            }
          })
        });

        $scope.$apply();
      }));

      it('should unset `$scope.enabled`', function () {
        $scope.should.have.property('enabled').and.be.false;
      });

      describe('when raml is updated', function () {
        beforeEach(function () {
          $scope.fileBrowser.selectedFile.raml = {};
          $scope.$apply();
        });

        it('should not update mocking service', function () {
          mockingService.updateMock.should.not.have.been.called;
        });
      }); // when raml is updated

      describe('when switch to another file with mocking service enabled', function () {
        beforeEach(function () {
          $scope.fileBrowser.selectedFile = {
            mock: {
            }
          };

          $scope.$apply();
        });

        it('should update `$scope.enabled` and reflect mocking service state', function () {
          $scope.should.have.property('enabled').and.be.true;
        });

        it('should not update mocking service', function () {
          mockingService.updateMock.should.not.have.been.called;
        });
      }); // when switch to another file with mocking service enabled

      describe('#toggleMockingService', function () {
        it('should enable mocking service', function () {
          $scope.toggleMockingService();
          $scope.$apply();

          $scope.should.have.property('enabled').and.be.true;
        });
      }); // #toggleMockingService
    }); // and mocking service disabled
  }); // with selected file

  describe('without selected file', function () {
    beforeEach(inject(function ($injector) {
      $injector.get('$controller')('mockingServiceController', {
        $scope: angular.extend($scope, {
          fileBrowser: {
          }
        })
      });

      $scope.$apply();
    }));

    it('should unset `$scope.enabled`', function () {
      $scope.should.have.property('enabled').and.be.false;
    });

    describe('when switch to another file with mocking service enabled', function () {
      beforeEach(function () {
        $scope.fileBrowser.selectedFile = {
          mock: {
          }
        };

        $scope.$apply();
      });

      it('should update `$scope.enabled` and reflect mocking service state', function () {
        $scope.should.have.property('enabled').and.be.true;
      });
    }); // when switch to another file
  }); // without selected file

  describe('enabling mocking service', function () {
    var selectedFile = {};

    beforeEach(inject(function ($injector) {
      selectedFile = {};

      $injector.get('$controller')('mockingServiceController', {
        $scope: angular.extend($scope, {
          fileBrowser: {
            selectedFile: selectedFile
          }
        })
      });

      $scope.$apply();
    }));

    it('should add `baseUri` when there is only RAML version tag', function () {
      selectedFile.mock = {
        baseUri: 'http://my.api.com'
      };

      $scope.editor.setValue([
        '#%RAML 0.8'
      ].join('\n'));

      $scope.toggleMockingService();
      $scope.$apply();

      $scope.editor.getValue().should.be.equal([
        '#%RAML 0.8',
        'baseUri: ' + selectedFile.mock.baseUri
      ].join('\n'));
    });

    it('should add `baseUri` right after `---`', function () {
      selectedFile.mock = {
        baseUri: 'http://my.api.com'
      };

      $scope.editor.setValue([
        '#%RAML 0.8',
        '---'
      ].join('\n'));

      $scope.toggleMockingService();
      $scope.$apply();

      $scope.editor.getValue().should.be.equal([
        '#%RAML 0.8',
        '---',
        'baseUri: ' + selectedFile.mock.baseUri
      ].join('\n'));
    });

    it('should replace `baseUri` with mocked one', function () {
      selectedFile.mock = {
        baseUri: 'http://my.api.com'
      };

      $scope.editor.setValue([
        '#%RAML 0.8',
        '---',
        'baseUri: http://old.my.api.com'
      ].join('\n'));

      $scope.toggleMockingService();
      $scope.$apply();

      $scope.editor.getValue().should.be.equal([
        '#%RAML 0.8',
        '---',
        '#baseUri: http://old.my.api.com',
        'baseUri: ' + selectedFile.mock.baseUri
      ].join('\n'));
    });
  }); // enabling mocking service
}); // mockingServiceController
