'use strict';

angular.module('ramlEditorApp')
  .factory('applySuggestion', function (ramlHint, ramlSnippets, getLineIndent, generateTabs, isArrayStarter) {
    return function (editor, suggestion) {
      var snippet           = ramlSnippets.getSnippet(suggestion);
      var snippetLinesCount = snippet.length;
      var cursor            = editor.getCursor();
      var line              = editor.getLine(cursor.line);
      var lineIndent        = getLineIndent(line);
      var lineHasPadding    = lineIndent.tabCount > 0;
      var lineIsEmpty       = line.trim() === '';
      var lineIsArray       = line.trim() === '-';
      var cursorIsAtNode    = !(lineIsEmpty || lineIsArray);
      var i                 = cursor.line + 1;
      var nextLine          = editor.getLine(i);
      var nextLineIndent    = nextLine && getLineIndent(nextLine);
      var path              = ramlHint.computePath(editor);
      var padding           = cursor.line === 0 ? '' : generateTabs(path.length - 1 + (path.length > 1 ? path.listsTraveled : 0));

      //For list element suggestions, we need to know whether or not to add the '- ' list
      //indicator: If a previous element at our tab depth already added the list indicator
      //then we should not do so.
      var isList = suggestion.isList;
      if (isList) {
        var prevLineIdx = cursor.line - (cursorIsAtNode ? 0 : 1);
        if (prevLineIdx >= 0) {
          var prevLine = editor.getLine(prevLineIdx);
          var prevLineIndent = getLineIndent(prevLine);
          var prevLineIsArray = isArrayStarter(prevLine);
          //We apply the list '- ' indicator only if we are not already in an
          //array. E.g. indent has changed or the previous line is not the
          //first item in an array:
          var indentChanged = lineIndent.tabCount !== prevLineIndent.tabCount;
          isList = indentChanged !== prevLineIsArray;
          if (isList && cursorIsAtNode) {
            padding = generateTabs(prevLineIndent.tabCount - (prevLineIsArray ? 0 : 1));
          }
        }
      }

      // add paddings to snippet lines
      snippet = snippet.map(function (line, index) {
        if (index === 0) {
          if (lineIsArray) {
            return ' ' + line;
          } else if (isList) {
            return '- ' + line;
          }

          if (lineIsEmpty && lineHasPadding) {
            return line;
          }
        }

        return padding + line;
      }).join('\n');

      // insert into current cursor's position
      // to re-use indentation as there is nothing else
      if (cursorIsAtNode) {
        if (isList) {
          snippet = padding + snippet;
        }
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
      if (!cursorIsAtNode) {
        i = i - 1;
      }

      editor.setCursor({
        line: i + snippetLinesCount - 1
      });

      editor.focus();
    };
  })
  .value('suggestionNameToTitleMapping', {
    '<resource>': 'New Resource'
  })
  .factory('updateSuggestions', function(ramlHint, suggestionNameToTitleMapping) {
    return function (editor) {
      var suggestions = ramlHint.getSuggestions(editor);
      var sections    = {};
      var model       = {sections: []};

      suggestions.forEach(function (item) {
        item.title = suggestionNameToTitleMapping[item.name] || item.name;

        sections[item.category] = sections[item.category] || {name: item.category, items: []};
        //61553714: Because item is the model passed into the designer, we need to copy the
        //isList property into it so that the designer can format things properly.
        item.isList = suggestions.isList;
        sections[item.category].items.push(item);
      });

      Object.keys(sections).forEach(function (key) {
        model.sections.push(sections[key]);
      });

      model.path = suggestions.path;
      return model;
    };
  })
  .controller('ramlEditorShelf', function ($scope, eventService, codeMirror, safeApply, applySuggestion, updateSuggestions) {
    eventService.on('event:raml-editor-initialized', function () {
      var editor = codeMirror.getEditor();
      editor.on('cursorActivity', $scope.cursorMoved.bind($scope));
    });

    $scope.cursorMoved = function () {
      $scope.model = updateSuggestions(codeMirror.getEditor());

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
