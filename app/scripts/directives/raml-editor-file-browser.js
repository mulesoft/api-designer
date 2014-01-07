(function() {
  'use strict';

  angular.module('ramlEditorApp').directive('ramlEditorFileBrowser', function(ramlRepository, $window) {
    var controller = function($scope) {
      $scope.fileBrowser = this;
      ramlRepository.getDirectory().then(function(files) {
        $scope.fileBrowser.files = files;
      });
    };

    controller.prototype.newFile = function() {
      var currentMax = Math.max.apply(undefined, this.files.map(function(file) {
        var match = file.name.match(/Untitled-(\d+)\.raml/);
        return match ? match[1] : 0;
      }));

      var suggestedFileName = 'Untitled-' + (currentMax + 1) + '.raml';
      var filename = $window.prompt('Name your file:', suggestedFileName);

      if (filename) {
        this.files.push({ name: filename });
      }
    };


    return {
      restrict: 'E',
      templateUrl: 'views/raml-editor-file-browser.tmpl.html',
      controller: controller
    };
  });
})();
