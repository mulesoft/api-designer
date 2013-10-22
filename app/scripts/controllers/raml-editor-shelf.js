'use strict';

angular.module('ramlEditorApp')
  .factory('applySuggestion', function (ramlSnippets, getLineIndent, generateTabs) {
    return function (editor, suggestion) {
      var cursor = editor.getCursor();
      var code = ramlSnippets.getSnippet(suggestion);
      var line = editor.getLine(cursor.line);
      var padding = generateTabs(getLineIndent(line).tabCount);
      var rangeLine = cursor.line;
      var rangeEndChar = 0;

      if (code) {
        code = code.replace(/\{\{padding\}\}/g, padding);

        if (line.trim()) {
          if (code.indexOf('\n') === -1) {
            code = code + '\n';
          }
        } else {
          rangeEndChar = line.length;
          if (code.indexOf('\n') !== -1) {
            code = code + padding;
          }
        }

        editor.replaceRange(code, {line: rangeLine, ch: 0}, {line: rangeLine, ch: rangeEndChar});
        editor.focus();
      }
    };
  })
  .controller('ramlEditorShelf', function ($scope, ramlHint,
    eventService, codeMirror, safeApply, applySuggestion) {

    eventService.on('event:raml-editor-initialized', function () {
      var editor = codeMirror.getEditor();
      editor.on('cursorActivity', $scope.cursorMoved.bind($scope));
    });

    $scope.cursorMoved = function () {
      var editor = codeMirror.getEditor();
      var suggestions = ramlHint.getSuggestions(editor);
      var sections = {};
      var model = { sections: [] };

      suggestions.forEach(function (item) {
        sections[item.category] = sections[item.category] || { name: item.category, items: [] };
        sections[item.category].items.push(item);
      });

      for (var prop in sections) {
        model.sections.push(sections[prop]);
      }

      model.path = suggestions.path;
      $scope.model = model;

      safeApply($scope);
    };

    $scope.orderSections = function (section) {
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

    $scope.itemClick = function (suggestion) {
      applySuggestion(codeMirror.getEditor(), suggestion);
    };
  });
