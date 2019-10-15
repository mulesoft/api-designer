(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .controller('mockingServiceController', function mockingServiceControllerFactory(
      $scope,
      $rootScope,
      mockingService,
      mockingServiceClient,
      codeMirror,
      getNode
    ) {
      function addBaseUri() {
        function setLine(lineNumber, line, prefix) {
          codeMirror.setLine($scope.editor, lineNumber, (prefix || '') + $scope.editor.getLine(lineNumber) + '\n' + line);
        }

        var baseUri = 'baseUri: ' + $rootScope.mock;
        var node    = getNode($scope.editor, 0);

        // try to find `baseUri` line
        while (node) {
          if (node.getKey() === 'baseUri') {
            if (node.getValue().text !== $rootScope.mock) {
              setLine(node.lineNumber, baseUri, '#');
            }
            return;
          }

          node = node.getNextSibling();
        }

        // try to find `---` line
        for (var i = 0; $scope.editor.getLine(i); i++) {
          if ($scope.editor.getLine(i).trim() === '---') {
            setLine(i, baseUri);
            return;
          }
        }

        // place it right after RAML version tag
        setLine(0, baseUri);
      }

      function removeBaseUri(baseUriLine) {
        var lineNumber  = void(0);
        var line        = void(0);

        // trying to find mocked baseUri
        // and remove it
        for (lineNumber = 0; lineNumber < $scope.editor.lineCount(); lineNumber++) {
          line = $scope.editor.getLine(lineNumber).trim();

          if (line === baseUriLine) {
            codeMirror.removeLine($scope.editor, lineNumber);
            break;
          }
        }

        // trying to find previous commented out baseUri
        // and uncomment it
        for (lineNumber = Math.min(lineNumber, $scope.editor.lineCount() - 1); lineNumber >= 0; lineNumber--) {
          line = $scope.editor.getLine(lineNumber).trim();

          if (line.indexOf('#') === 0 && line.slice(1).trim().indexOf('baseUri: ') === 0) {
            codeMirror.setLine($scope.editor, lineNumber, line.slice(1).trim());
            break;
          }
        }
      }

      function loading(promise) {
        $scope.loading = true;
        return promise.finally(function onFinally() {
          $scope.loading = false;
        });
      }

      function setMock(mock) {
        $rootScope.mock    = mock;
        $rootScope.enabled = !!mock;
      }

      function getMock() {
        loading(mockingService.getMock($scope.fileBrowser.selectedFile)
          .then(setMock)
          .then(function() {
            if ($rootScope.mock) { addBaseUri(); }
          })
        );
      }

      function enableMock(isLegacyMockingMigration) {
        loading(mockingService.enableMock($scope.fileBrowser.selectedFile)
          .then(setMock)
          .then(addBaseUri)
          .then(function mockMigrated() {
            if (isLegacyMockingMigration) {
              $rootScope.mockMigrated = true;
            }
          })
        );
      }

      function deleteMock(isLegacyMockingMigration) {
        var deleteMockPromise = isLegacyMockingMigration ?
          mockingService.deleteMock1($scope.fileBrowser.selectedFile) :
          mockingService.deleteMock($scope.fileBrowser.selectedFile);

        var baseUri = isLegacyMockingMigration ? 'baseUri: ' + $scope.raml.baseUri : 'baseUri: ' + $rootScope.mock;

        loading(
          deleteMockPromise
            .then(function () {
              removeBaseUri(baseUri);
            })
            .then(setMock)
        );
      }

      $scope.toggleMockingService = function toggleMockingService(isLegacyMockingMigration) {
        if (!$scope.fileBrowser.selectedFile) {
          return;
        }

        if (isLegacyMockingMigration) {
          deleteMock(isLegacyMockingMigration);
          enableMock(isLegacyMockingMigration);
          return;
        }

        if ($rootScope.enabled) {
          deleteMock();
          return;
        }

        enableMock();
      };

      $scope.$watch('fileBrowser.selectedFile', function watch(newValue) {
        if (newValue) {
          getMock();
        } else {
          setMock();
        }
      });
    })
  ;
})();
