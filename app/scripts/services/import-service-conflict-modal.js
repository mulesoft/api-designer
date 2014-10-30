(function () {
  'use strict';

  var SKIP_FILE    = 0;
  var KEEP_FILE    = 1;
  var REPLACE_FILE = 2;

  angular.module('ramlEditorApp')
    .service('importServiceConflictModal', function newNameModal(
      $modal
    ) {
      var self = this;

      self.open = function open (path) {
        return $modal
          .open({
            backdrop:    'static',
            templateUrl: 'views/import-service-conflict-modal.html',
            controller:  'ImportServiceConflictModal',
            resolve: {
              path: function pathResolver () { return path; }
            }
          })
          .result;
      };

      self.KEEP_FILE    = KEEP_FILE;
      self.SKIP_FILE    = SKIP_FILE;
      self.REPLACE_FILE = REPLACE_FILE;

      return self;
    })
    .controller('ImportServiceConflictModal', function ImportServiceConflictModal(
      $scope,
      $modalInstance,
      path
    ) {
      $scope.path = path;

      $scope.skip = function () {
        $modalInstance.close(SKIP_FILE);
      };

      $scope.keep = function () {
        $modalInstance.close(KEEP_FILE);
      };

      $scope.replace = function () {
        $modalInstance.close(REPLACE_FILE);
      };
    });
})();
