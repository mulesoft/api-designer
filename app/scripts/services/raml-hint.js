'use strict';

angular.module('raml')
  .factory('ramlHint', function () {
    var hinter = {};
    var WORD = /[\w$]+/;

    hinter.computePath = function computePath (editor, tabCount, line) {
      if (line <= 0) {
        return [];
      }
      var tabs = editor.getLine(line).split('  '),
          value = tabs.pop(), result = [];

      if (tabs.length === tabCount) {
        if (tabCount !== 0) {
          result = computePath(editor, tabs.length - 1, line - 1);
        }

        // Removing spaces and :
        // TODO Unit tests for exceptions
        return result.concat([value.replace(/:\s*/g, '')]);
      } else {
        return computePath(editor, tabCount, line - 1);
      }
    };

    hinter.createIndentation = function createIndentation (tabCount) {
      var s = '  ';
      var result = '';
      for (var i = 0; i < tabCount; i++) {
        result += s;
      }
      return result;
    };

    hinter.getPadding = function getPadding(node, tabCount) {
      if (!node || !node.constructor || !node.constructor.name) {
        throw new Error('Can\'t determine padding for node: ' + node);
      }

      if ('StringWildcard' === node.constructor.name) {
        return ' ';
      }

      return '\n' + hinter.createIndentation(tabCount);
    };

    hinter.getCurWord = function(editor, options) {
      var word = options && options.word || WORD;
      var cur = editor.getCursor(), curLine = editor.getLine(cur.line);
      var start = cur.ch, end = start;
      var currLineTabCount = curLine.split('  ').length - 1;
      while (end < curLine.length && word.test(curLine.charAt(end))) {
        ++end;
      }
      while (start && word.test(curLine.charAt(start - 1))) {
        --start;
      }
      return {
        curWord: start !== end && curLine.slice(start, end),
        start: start,
        end: end,
        cur: cur,
        curLine: curLine,
        currLineTabCount: currLineTabCount
      };
    };

    hinter.getSuggestions = function (editor, callback) {
      var d = hinter.getCurWord(editor);
      var currLineTabCount = d.currLineTabCount,
          cur = d.cur;
      var val = hinter.computePath(editor, currLineTabCount, cur.line);
      val.pop();

      var alternatives = suggestRAML(val);
      var alternativeKeys = [];

      if (alternatives && alternatives.suggestions) {
        alternativeKeys = Object.keys(alternatives.suggestions);
      }

      var list = alternativeKeys.map(function (e) {
        var suggestion = alternatives.suggestions[e];
        return { name: suggestion.name, category: suggestion.category };
      }) || [];

      if (alternatives.constructor.name === 'OpenSuggestion' &&
          alternatives.category === 'snippets') {
        list.push({name: 'New resource', category: alternatives.category});
      }

      list.path = val;

      return callback ? callback(list) : list;
    };

    hinter.autocompleteHelper = function(editor) {
      var d = hinter.getCurWord(editor);
      var start = d.start, end = d.end, curWord = d.curWord;
      var cur = d.cur, currLineTabCount = d.currLineTabCount;
      var val = hinter.computePath(editor, currLineTabCount, cur.line);
      val.pop();

      var alternatives = suggestRAML(val);
      var alternativeKeys = [];

      if (alternatives && alternatives.suggestions) {
        alternativeKeys = Object.keys(alternatives.suggestions);
      }

      var list = alternativeKeys.map(function (e) {
        var suggestion = alternatives.suggestions[e],
          node = suggestion.open && suggestion.open(),
          padding = hinter.getPadding(node, currLineTabCount);

        // FIXME Use editor.indentLine to handle the indentation!
        return {text: e + ':' + padding, displayText: e  + ' (' + suggestion.category + ')'};
      }).filter(function(e) {
        if (curWord) {
            if (e && e.text.indexOf(curWord) === 0) {
                return true;
            }
            return false;
        }
        return true;
      }) || [];

      return {list: list,
        from: CodeMirror.Pos(cur.line, start),
        to: CodeMirror.Pos(cur.line, end)
      };
    };

    return hinter;
  });
