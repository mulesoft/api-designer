'use strict';

angular.module('raml')
  .factory('ramlHint', function () {
    var hinter = {};
    var WORD = /[\w$]+/;

    hinter.computePath = function computePath (editor, tabCount, line) {
      var tabs = editor.getLine(line).split('  '),
          value = tabs.pop(), result = [];

      if (tabs.length === tabCount) {
        if (tabCount !== 0) {
          result = computePath(editor, tabs.length - 1, line - 1);
        }

        // Removing spaces and :
        return result.concat([value.replace(/:\s*/g, '')]);
      } else {
        return computePath(editor, tabCount, line - 1);
      }
    }

    hinter.createIndentation = function createIndentation (tabCount) {
      var s = '  ';
      var result = '';
      for (var i = 0; i < tabCount; i++) {
        result += s;
      }
      return result;
    }

    hinter.getPadding = function getPadding(node, tabCount) {
      if (!node || !node.constructor || !node.constructor.name) {
        throw new Error('Can\'t determine padding for node: ' + node);
      }

      if ('StringWildcard' === node.constructor.name) {
        return ' ';
      }

      return '\n' + hinter.createIndentation(tabCount);
    }

    hinter.getSuggestions = function (editor) {
      var word = WORD;
      var cur = editor.getCursor(), curLine = editor.getLine(cur.line);
      var start = cur.ch, end = start;
      while (end < curLine.length && word.test(curLine.charAt(end))) {
        ++end;
      }
      while (start && word.test(curLine.charAt(start - 1))) {
        --start;
      }
      var curWord = start !== end && curLine.slice(start, end);
      var currLineTabCount = curLine.split('  ').length - 1;
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

      return list;
    };

    return hinter;
  });
