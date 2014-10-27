(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorSaveFileButton', function ramlEditorSaveFileButton(
      $rootScope,
      ramlRepository,
      $window,
      $timeout,
      $q
    ) {
      return {
        restrict: 'E',
        template: [
          '<span role="save-button" ng-click="saveFile()"><i class="fa fa-save"></i>&nbsp;Save</span>',
          '<span class="menu-item-toggle" ng-click="openContextMenu($event)">',
          '  <i class="fa fa-caret-down"></i>',
          '</span>',
          '<ul role="context-menu" class="menu-item-context" ng-show="contextMenuOpen">',
          '  <li role="context-menu-item" ng-click="saveAllFiles()">Save All</li>',
          '</ul>'
        ].join('\n'),
        link:     function(scope) {
          scope.contextMenuOpen = false;

          scope.openContextMenu = function () {
            $timeout(function () {
              $window.addEventListener('click', function self () {
                scope.$apply(function () {
                  scope.contextMenuOpen = false;
                });

                $window.removeEventListener('click', self);
              });
            });

            scope.contextMenuOpen = true;
          };

          scope.saveFile = function saveFile() {
            var file = scope.fileBrowser.selectedFile;

            return ramlRepository.saveFile(file)
              .then(function success() {
                $rootScope.$broadcast('event:notification', {
                  message: 'File saved.',
                  expires: true
                });
              });
          };

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
