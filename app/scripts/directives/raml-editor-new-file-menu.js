(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorNewFileMenu', function ramlEditorNewFileMenu(
      newFileService,
      subMenuService
    ) {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          target: '=',
          showFileMenu: '=',
          showFragmentMenu: '=',
          openFileMenuCondition : '@',
          menuRole : '@'
        },
        templateUrl:'views/menu/new-file-menu.tmpl.html',
        link:     function (scope) {
          scope.closeFragmentMenu = function () {
            scope.showFragmentMenu = false;
          };

          scope.openFragmentMenu = function () {
            subMenuService.openSubMenu(scope, 'showFragmentMenu');
            scope.fragments = newFileService.files['1.0'];
          };

          scope.newFragmentFile = function newFragmentFile(fragmentType) {
            return newFileService.newFragmentFile(scope.target || scope.$parent.homeDirectory, fragmentType);
          };

          scope.newFile = function newFile(version) {
            return newFileService.newFile(scope.target || scope.$parent.homeDirectory, version);
          };

          scope.notSorted = function(fragments){
            if (!fragments) {
              return [];
            }
            return Object.keys(fragments).map(function(f) {
              return fragments[f];
            });
          };
        }
      };
    })
  ;
})();
