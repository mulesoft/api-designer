(function() {
  'use strict';

  angular.module('ramlEditorApp').directive('ramlEditorFileBrowser', function($rootScope, $q, $window, ramlEditorNewFilePrompt, fileList, ramlRepository, config, eventService) {
    var controller = function($scope) {
      var unwatchSelectedFile = angular.noop, contextMenu;
      $scope.fileBrowser = this;
      $scope.homeDirectory = fileList;

      ramlRepository.getDirectory().then(function() {
        $scope.$watch('homeDirectory.files', function(files) {
          if (files.length === 0) {
            setTimeout(function() {
              ramlEditorNewFilePrompt.open();
            }, 0);
          }
        }, true);

        if (fileList.files.length > 0) {
          var lastFile = JSON.parse(config.get('currentFile', '{}'));

          var fileToOpen = fileList.files.filter(function(file) {
            return file.name === lastFile.name && file.path === lastFile.path;
          })[0];

          fileToOpen = fileToOpen || fileList.files[0];

          $scope.fileBrowser.selectFile(fileToOpen);
        }
      });

      $scope.$on('event:raml-editor-file-created', function(event, file) {
        $scope.fileBrowser.selectFile(file);
      });

      $scope.$on('event:raml-editor-file-removed', function(event, file) {
        if (file === $scope.fileBrowser.selectedFile && fileList.files.length > 0) {
          $scope.fileBrowser.selectFile(fileList.files[0]);
        }
      });

      this.selectFile = function(file) {
        config.set('currentFile', JSON.stringify({ path: file.path, name: file.name }));
        unwatchSelectedFile();

        var isLoaded = !file.persisted || angular.isString(file.contents);
        var afterLoading = isLoaded ? $q.when(file) : ramlRepository.loadFile(file);

        afterLoading.then(function(file) {

          $scope.fileBrowser.selectedFile = file;
          $scope.$emit('event:raml-editor-file-selected', file);
          unwatchSelectedFile = $scope.$watch('fileBrowser.selectedFile.contents', function(newContents, oldContents) {
            if (newContents !== oldContents) {
              file.dirty = true;
            }
          });
        });
      };

      this.saveFile = function(file) {
        ramlRepository.saveFile(file).then(function success() {
          eventService.broadcast('event:notification', {
            message: 'File saved.',
            expires: true
          });
        });
      };

      $scope.registerContextMenu = function(cm) {
        contextMenu = cm;
      };

      this.showContextMenu = function(event, file) {
        contextMenu.open(event, file);
      };

      this.contextMenuOpenedFor = function(file) {
        return contextMenu.file === file;
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
      controller: controller,
      replace: true
    };
  });
})();
