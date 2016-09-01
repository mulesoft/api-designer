(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .factory('applySuggestion', function applySuggestionFactory() {
      return function applySuggestion(editor, suggestion) {
        var cursor = editor.getCursor();

        editor.replaceRange(suggestion.key, cursor, cursor);

        var suggestionLines = suggestion.key.split('\n');
        var ch = suggestionLines.length > 1 ?
          suggestionLines[suggestionLines.length - 1].length :
          cursor.ch + suggestionLines[0].length;
        var line = cursor.line + suggestionLines.length - 1;
        editor.setCursor({ line: line, ch: ch});

        editor.focus();
      };
    })
    .factory('updateSuggestions', function(ramlSuggest) {
      return function (homeDirectory, selectedFile, editor) {
        var suggestions = ramlSuggest.suggest(homeDirectory, selectedFile, editor);
        return createModel(suggestions);
      };
    })
    .controller('ramlEditorShelf', function ($scope, safeApplyWrapper, updateSuggestions, applySuggestion) {
      var editor = $scope.editor;

      $scope.cursorMoved = safeApplyWrapper(null, function cursorMoved() {
        $scope.model = updateSuggestions($scope.homeDirectory, $scope.fileBrowser.selectedFile, editor);
      });

      $scope.orderSections = function orderSections(section) {
        var index = [
          'root',
          'docs',
          'methods',
          'parameters',
          'responses',
          'security',
          'resources',
          'traits and types'
        ].indexOf(section.name.toLowerCase());

        return (index === -1) ? index.length : index;
      };

      $scope.itemClick = function itemClick(suggestion) { applySuggestion(editor, suggestion); };

      editor.on('cursorActivity', $scope.cursorMoved);
    });

  var createModel = function (suggestions) {
    var category = {name: 'Category Name'};
    category.items = suggestions.map(function (suggestion) {
      return {
        title: suggestion.displayText || suggestion.text,
        key: suggestion.text
      };
    });

    // model.path = suggestions.path;
    return {categories: [category]}; // model
  };
})();
