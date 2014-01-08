(function() {
  'use strict';

  angular.module('ramlEditorApp').directive('ramlEditorFileBrowser', function(ramlRepository, $window, $q) {
    var controller = function($scope) {
      $scope.fileBrowser = this;

      ramlRepository.getDirectory().then(function(files) {
        $scope.fileBrowser.files = files;
      });

      this.newFile = function() {
        var currentMax = Math.max.apply(undefined, this.files.map(function(file) {
          var match = file.name.match(/Untitled-(\d+)\.raml/);
          return match ? match[1] : 0;
        }));

        var suggestedFileName = 'Untitled-' + (currentMax + 1) + '.raml';
        var filename = $window.prompt('Name your file:', suggestedFileName);

        if (filename) {
          var file = this.selectedFile = ramlRepository.createFile(filename);
          this.files.push(file);
        }
      };

      var unwatchSelectedFile = angular.noop;
      this.selectFile = function(file) {
        unwatchSelectedFile();

        var isLoaded = angular.isString(file.contents);
        var afterLoading = isLoaded ? $q.when(file) : ramlRepository.loadFile(file);

        afterLoading.then(function(file) {
          $scope.fileBrowser.selectedFile = file;
          unwatchSelectedFile = $scope.$watch('fileBrowser.selectedFile.contents', function(newContents, oldContents) {
            if (newContents !== oldContents) {
              file.dirty = true;
            }
          });
        });
      };
    };

    return {
      restrict: 'E',
      templateUrl: 'views/raml-editor-file-browser.tmpl.html',
      controller: controller
    };
  });
})();
