(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorNewFolderButton', function ramlEditorNewFolderButton(
      $injector,
      ramlEditorInputPrompt,
      ramlRepository,
      generateName
    ) {
      return {
        restrict: 'E',
        template: '<span role="new-button" ng-click="newFolder()"><i class="fa fa-folder-open"></i>&nbsp;New Folder</span>',
        link:     function (scope) {
          scope.newFolder = function newFolder() {
            var currentTarget = scope.fileBrowser.currentTarget;
            var parent        = currentTarget.isDirectory ? currentTarget : ramlRepository.getParent(currentTarget);
            var defaultName   = generateName(parent.getDirectories().map(function (d){return d.name;}), 'Folder');
            var message       = 'Input a name for your new folder:';
            var title         = 'Add a new folder';

            // check if the modal service exists
            var inputMethod = $injector.has('newNameModal') ?
              $injector.get('newNameModal') :
              ramlEditorInputPrompt;

            var validations = [
              {
                message: 'That folder name is already taken.',
                validate: function(input) {
                  return !parent.children.some(function (directory) {
                    return directory.name.toLowerCase() === input.toLowerCase();
                  });
                }
              } , {
                message: 'Folder name cannot be empty.',
                validate: function(input) {
                  return input.length > 0;
                }
              }
            ];

            inputMethod.open(message, defaultName, validations, title)
              .then(function(name) {
                ramlRepository.createDirectory(parent, name);
              });
          };
        }
      };
    })
  ;
})();
