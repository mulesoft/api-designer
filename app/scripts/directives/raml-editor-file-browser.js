(function() {
  'use strict';

  angular.module('ramlEditorApp').directive('ramlEditorFileBrowser', function(ramlRepository, $window, $q) {
    var controller = function($scope) {
      $scope.fileBrowser = this;

      ramlRepository.getDirectory().then(function(files) {
        $scope.fileBrowser.files = files;
        $scope.fileBrowser.files.sort(function(file1, file2) {
          return file1.name.localeCompare(file2.name);
        });

        if (files.length > 0) {
          $scope.fileBrowser.selectFile($scope.fileBrowser.files[0]);
        } else {
          $scope.fileBrowser.newFile();
        }
      });

      this.newFile = function() {
        var currentMax = Math.max.apply(undefined, this.files.map(function(file) {
          var match = file.name.match(/Untitled-(\d+)\.raml/);
          return match ? match[1] : 0;
        }));

        var suggestedFileName = 'Untitled-' + (currentMax + 1) + '.raml';
        var filename = $window.prompt('Name your file:', suggestedFileName);

        if (filename) {
          var filenameAlreadyTaken = $scope.fileBrowser.files.some(function(file) {
            return file.name.toLowerCase() === filename.toLowerCase();
          });
          if (filenameAlreadyTaken) {
            $window.alert('That filename is already taken.');
          } else {
            var file = this.selectedFile = ramlRepository.createFile(filename);
            this.files.push(file);
          }
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

      this.saveFile = function(file) {
        ramlRepository.saveFile(file);
      };

      var saveListener = function(e) {
        if (e.which === 83 && e.metaKey) {
          e.preventDefault();
          $scope.$apply(function() {
            $scope.fileBrowser.saveFile($scope.fileBrowser.selectedFile);
          });
        }
      };

      $window.addEventListener('keydown', saveListener);

      $scope.$on('$destroy', function() {
        $window.removeEventListener('keydown', saveListener);
      });
    };

    return {
      restrict: 'E',
      templateUrl: 'views/raml-editor-file-browser.tmpl.html',
      controller: controller
    };
  });
})();
