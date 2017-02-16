(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .factory('applySuggestion', function applySuggestionFactory() {
      return function applySuggestion(editor, suggestion) {
        var replacementPrefix = suggestion.replacementPrefix || '';
        var cursor = editor.getCursor();

        var rangeEnd = {
          line: cursor.line,
          ch: editor.getLine(cursor.line).length
        };

        var rangeStart = {
          line: cursor.line,
          ch: cursor.ch - replacementPrefix.length
        };

        editor.replaceRange(suggestion.key, rangeStart, rangeEnd);

        var suggestionLines = suggestion.key.split('\n');
        var ch = suggestionLines.length > 1 ?
          suggestionLines[suggestionLines.length - 1].length :
          cursor.ch + suggestionLines[0].length - replacementPrefix.length;
        var line = cursor.line + suggestionLines.length - 1;
        editor.setCursor({ line: line, ch: ch});

        editor.focus();
      };
    })
    .factory('newSuggestions', function(ramlSuggest) {
      var groupBy = function (items, key) {
        var addItemToResult = function (result, item) {
          var list = result[item[key]] || [];
          list.push(item);
          result[item[key]] = list;
          return result;
        };

        return items.reduce(addItemToResult, {});
      };

      var createModel = function (suggestions) {
        var items = suggestions.map(function (suggestion) {
          return {
            category: suggestion.category,
            title: suggestion.displayText || suggestion.text,
            key: suggestion.text,
            replacementPrefix: suggestion.replacementPrefix || ''
          };
        });
        var categoryMap = groupBy(items, 'category');
        var categories = Object.keys(categoryMap).map(function(key) {
          return {name: key, items: categoryMap[key]};
        });

        return {categories: categories}; // model
      };

      return function (homeDirectory, selectedFile, editor) {
        return ramlSuggest.suggest(homeDirectory, selectedFile, editor)
          .then(createModel);
      };
    })
    .controller('ramlEditorShelf', function ($scope, safeApplyWrapper, newSuggestions, applySuggestion) {
      var editor = $scope.editor;

      function updateModel(suggestions) {
        $scope.model = suggestions;
        $scope.$digest();
      }

      $scope.cursorMoved = safeApplyWrapper(null, function cursorMoved() {
        if ($scope.shelf.collapsed) {
          $scope.model = [];
        } else {
          newSuggestions($scope.homeDirectory, $scope.fileBrowser.selectedFile, editor)
            .then(updateModel);
        }
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

      $scope.itemClick = function itemClick(suggestion) {
        applySuggestion(editor, suggestion);
      };

      editor.on('cursorActivity', $scope.cursorMoved);
    });
})();
