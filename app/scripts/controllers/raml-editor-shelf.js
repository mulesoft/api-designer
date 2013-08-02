angular.module('ramlConsoleApp')
  .controller('ramlEditorShelf', function ($scope, $rootScope, ramlHint) {
    var hinter = ramlHint;
    var editor;

    $rootScope.$on('event:raml-editor-has-changes', function (e, args) {
      editor = args;
      var suggestions = hinter.getSuggestions(editor);
      var sections = {};
      var model = { sections: [] };

      suggestions.forEach(function (item) {
        sections[item.category] = sections[item.category] || { name: item.category, items: [] };
        sections[item.category].items.push(item);
      });

      for (var prop in sections) {
        model.sections.push(sections[prop]);
      }

      $scope.model = model;
      $scope.$apply();
    });

    $scope.itemClick = function (item) {
      var cur = editor.getCursor();
      var code = $scope.getSnippet(item.name);

      if (code) {
        editor.replaceRange(code, {line: cur.line, ch: 0}, {line: cur.line, ch: 0});
      }
    };

    $scope.getSnippet = function (snippetName) {
      if (snippetName === 'get') {
        return 'this is a test';
      }

      return null;
    }

  });
