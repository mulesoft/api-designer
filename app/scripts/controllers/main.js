angular.module('editorApp')
  .controller('MainCtrl', function ($scope) {
    var raml = RAML.Parser;
    var editor = CodeMirror.fromTextArea(document.getElementById('code'), {
        lineNumbers: true,
        mode: 'yaml',
        lineWrapping: true,
        theme: 'solarized dark',
        autofocus: true,
        indentUnit: 2,
        indentWithTabs: false,
        tabSize: 2,
        extraKeys: {"Ctrl-Space": "autocomplete"}
    });

    CodeMirror.commands.autocomplete = function(cm) {
      CodeMirror.showHint(cm, CodeMirror.hint.javascript);
    };

    $scope.raml = {};
    $scope.definition = '';
    $scope.errorMessage = '';

    $scope.updated = function () {
      this.definition = editor.getValue();
      this.updatePreview();
    };

    $scope.updatePreview = function () {
      var that = this;
      raml.load(this.definition).then(function (data) {
        a = raml.compose(that.definition);

        console.log(a);
        that.raml = data;
        that.errorMessage = '';
        that.$apply();
      }, function (error) {
        console.log(error);
        that.errorMessage = error;
        that.$apply();
      });
    };

    editor.on('update', $scope.updated.bind($scope));
      $scope.updated();
    });
