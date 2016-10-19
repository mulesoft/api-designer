(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorSaveAllButton', function ramlEditorSaveAllButton(
      $rootScope,
      ramlRepository,
      $window,
      $timeout,
      $q
    ) {
      return {
        restrict: 'E',
        template: '<a role="save-all-button" ng-click="saveAllFiles()"><i class="fa fa-save"></i>&nbsp;Save All</a>',
        link: function(scope) {
          scope.saveAllFiles = function saveAllFiles() {
            var promises = [];

            scope.homeDirectory.forEachChildDo(function (file) {
              if (file.isDirectory) {
                return;
              }

              if (file.dirty) {
                return promises.push(ramlRepository.saveFile(file));
              }
            });

            return $q.all(promises)
              .then(function success() {
                $rootScope.$broadcast('event:notification', {
                  message: 'All files saved.',
                  expires: true
                });
              });
          };
        }
      };
    })
  ;
})();
