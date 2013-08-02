angular.module('ramlConsoleApp')
  .controller('ramlEditorShelf', function ($scope, $rootScope, ramlHint) {
    var hinter = ramlHint;

    $rootScope.$on('event:raml-editor-has-changes', function (e, args) {
      var editor = args;
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
      $scope.apply();
    });
  });
