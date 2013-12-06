'use strict';

angular.module('ramlEditorApp')
  .factory('applySuggestion', function (ramlHint, ramlSnippets, getLineIndent, generateTabs) {
    return function (editor, suggestion) {
      var snippet           = ramlSnippets.getSnippet(suggestion);
      var snippetLinesCount = snippet.length;
      var cursor            = editor.getCursor();
      var line              = editor.getLine(cursor.line);
      var lineIndent        = getLineIndent(line);
      var lineHasPadding    = lineIndent.tabCount > 0;
      var lineIsEmpty       = line.trim() === '';
      var lineIsArray       = line.trim() === '-';
      var i                 = cursor.line + 1;
      var nextLine          = editor.getLine(i);
      var nextLineIndent    = nextLine && getLineIndent(nextLine);
      var path              = ramlHint.computePath(editor);
      var padding           = cursor.line === 0 ? '' : generateTabs(path.length - 1 + (path.length > 1 ? path.listsTraveled : 0));

      // add paddings to snippet lines
      snippet = snippet.map(function (line, index) {
        if (index === 0) {
          if (lineIsArray) {
            return ' ' + line;
          }

          if (lineIsEmpty && lineHasPadding) {
            return line;
          }
        }

        return padding + line;
      }).join('\n');

      // insert into current cursor's position
      // to re-use indentation as there is nothing else
      if (!(lineIsEmpty || lineIsArray)) {
        snippet = '\n' + snippet;
      }

      // search for a line that has the same indentation as
      // current line or descending
      while ((nextLine || '').trim() && nextLineIndent.tabCount > lineIndent.tabCount) {
        nextLine       = editor.getLine(++i);
        nextLineIndent = nextLine && getLineIndent(nextLine);
      }

      editor.replaceRange(snippet,
        // from
        {
          line: i - 1,
          ch:   lineIsArray ? (line.indexOf('-') + 1) : lineIsEmpty ? padding.length : null
        },
        // to
        {
          line: i - 1
        }
      );

      // in case of inserting into current line we're
      // moving cursor one line less further as we're
      // re-using current line
      if (lineIsEmpty || lineIsArray) {
        i = i - 1;
      }

      editor.setCursor({
        line: i + snippetLinesCount - 1
      });

      editor.focus();
    };
  })
  .controller('ramlEditorShelf', function ($scope, ramlHint,
    eventService, codeMirror, safeApply, applySuggestion) {

    eventService.on('event:raml-editor-initialized', function () {
      var editor = codeMirror.getEditor();
      editor.on('cursorActivity', $scope.cursorMoved.bind($scope));
    });

    $scope.cursorMoved = function () {
      var editor      = codeMirror.getEditor();
      var suggestions = ramlHint.getSuggestions(editor);
      var sections    = {};
      var model       = {sections: []};

      suggestions.forEach(function (item) {
        sections[item.category] = sections[item.category] || {name: item.category, items: []};
        sections[item.category].items.push(item);
      });

      Object.keys(sections).forEach(function (key) {
        model.sections.push(sections[key]);
      });

      model.path   = suggestions.path;
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
