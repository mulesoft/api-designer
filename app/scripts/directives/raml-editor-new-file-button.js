(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorNewFileButton', function ramlEditorNewFileButton(
      $injector,
      $rootScope,
      ramlRepository,
      generateName,
      newNameModal
    ) {
      return {
        restrict: 'E',
        template: '<span role="new-button" ng-click="newFile()"><i class="fa fa-plus"></i>&nbsp;New File</span>',
        link:     function (scope) {
          scope.newFile = function newFile() {
            var currentTarget = scope.fileBrowser.currentTarget;
            var parent        = currentTarget.isDirectory ? currentTarget : ramlRepository.getParent(currentTarget);
            var defaultName   = generateName(parent.getFiles().map(function (f){return f.name;}), 'Untitled-', 'raml');
            var title         = 'Add a new file';

            var message = [
              'For a new RAML spec, be sure to name your file <something>.raml; ',
              'For files to be !included, feel free to use an extension or not.'
            ].join('');

            var validations = [
              {
                message: 'That file name is already taken.',
                validate: function (input) {
                  return !parent.children.some(function (file) {
                    return file.name.toLowerCase() === input.toLowerCase();
                  });
                }
              }
            ];

            return newNameModal.open(message, defaultName, validations, title)
              .then(function (name) {
                return ramlRepository.generateFile(parent, name);
              })
              .catch(function (err) {
                return $rootScope.$broadcast('event:notification', {
                  message: err.message,
                  expires: true,
                  level: 'error'
                });
              });
          };
        }
      };
    })
  ;
})();
