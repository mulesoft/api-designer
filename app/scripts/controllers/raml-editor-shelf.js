'use strict';

angular.module('ramlEditorApp')
  .controller('ramlEditorShelf', function ($scope, $rootScope, ramlHint,
    eventService, codeMirror, ramlSnippets, safeApply) {
    var hinter = ramlHint;

    eventService.on('event:raml-editor-initialized', function () {
      var editor = codeMirror.getEditor();
      editor.on('cursorActivity', $scope.cursorMoved.bind($scope));
    });

    $scope.cursorMoved = function () {
      var editor = codeMirror.getEditor();
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

      model.path = suggestions.path;
      $scope.model = model;

      safeApply();
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

    $scope.itemClick = function (item) {
      var editor = codeMirror.getEditor();
      var cur = editor.getCursor();
      var code = ramlSnippets.getSnippet(item);
      var line = editor.getLine(cur.line);
      var count = $scope.model.path.length;
      var padding = ramlHint.createIndentation(count);
      var rangeLine = cur.line;
      var rangeEndChar = 0;

      if (code) {
        code = code.replace(/\{\{padding\}\}/g, padding);

        if (line.replace(/^\s+|\s+$/g, '') === '') {
          rangeEndChar = line.length;
          if (code.indexOf('\n') >= 0) {
            code = code + padding;
          }
        } else {
          if (code.indexOf('\n') < 0) {
            code = code + '\n';
          }
        }

        editor.replaceRange(code, {line: rangeLine, ch: 0}, {line: rangeLine, ch: rangeEndChar});
        editor.focus();
      }
    };
  });
