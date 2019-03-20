(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorSaveAllButton', function ramlEditorSaveAllButton(
      $rootScope,
      ramlRepository,
      $q
    ) {
      return {
        restrict: 'E',
        replace: true,
        template:
          '<li role="save-all-button" ng-click="saveAllFiles()">' +
            '<a><i class="fa fa-save"></i>&nbsp;Save All</a>' +
          '</li>',
        link: function(scope) {
          scope.saveAllFiles = function saveAllFiles(importing) {
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
                if(importing){
                  $rootScope.$broadcast('event:imported-file-selected');
                }

                $rootScope.$broadcast('event:notification', {
                  message: 'All files saved.',
                  expires: true
                });
              });
          };

          $rootScope.$on('event:save-all', function(event, importing) {
            scope.saveAllFiles(importing);
          });
        }
      };
    })
  ;
})();
