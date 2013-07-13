angular.module('editorApp')
  .controller('MainCtrl', function ($scope) {
    var editor = CodeMirror.fromTextArea(document.getElementById('code'), {
        lineNumbers: true,
        mode: 'yaml',
        theme: 'solarized dark'
      });
  });
