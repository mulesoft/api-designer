(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorNewFileButton', function ramlEditorNewFileButton(ramlEditorInputPrompt, ramlRepository, generateName) {
      return {
        restrict: 'E',
        template: '<span role="new-button" ng-click="newFile()"><i class="fa fa-plus"></i>&nbsp;New File</span>',
        link:     function (scope) {
          scope.newFile = function newFile() {
            var directory = scope.fileBrowser.selectedTarget.isDirectory ?
              scope.fileBrowser.selectedTarget :
              ramlRepository.getDirectory(scope.fileBrowser.selectedTarget.parentPath(), scope.homeDirectory);

            var message = [
              'For a new RAML spec, be sure to name your file <something>.raml; ',
              'For files to be !included, feel free to use an extension or not.'
            ].join('');
            var defaultName = generateName(directory.getFiles().map(function (f){return f.name;}), 'Untitled-', 'raml');

            var validations = [
              {
                message: 'That file name is already taken.',
                validate: function(input) {
                  return !directory.getFiles().some(function (file) {
                    return file.name.toLowerCase() === input.toLowerCase();
                  });
                }
              } , {
                message: 'File name cannot be empty.',
                validate: function(input) {
                  return input.length > 0;
                }
              }
            ];

            ramlEditorInputPrompt.open(message, defaultName, validations)
              .then(function(name) {
                directory.createFile.call(directory, name);
              });
          };
        }
      };
    })
  ;
})();
