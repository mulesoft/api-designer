(function () {
  var WORD = /[\w$]+/;

  CodeMirror.registerHelper('hint', 'yaml', function(editor, options) {
    var word = options && options.word || WORD;
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

    function computePath(editor, tabCount, line) {
      var tabs = editor.getLine(line).split('  '),
        value = tabs.pop(), result = [];

      if (tabs.length === tabCount) {
        if (tabCount !== 0) {
          result = computePath(editor, tabs.length - 1, line - 1);
        }
        return result.concat([value.substring(0, value.length - 1)]);
      } else {
        return computePath(editor, tabCount, line - 1);
      }
    }

    var val = computePath(editor, currLineTabCount, cur.line);
    val.pop();

    var s = '  ';
    for (var i = 0; i < currLineTabCount; i++) {
      s += '  ';
    }

    var alternatives = suggest(suggestionTree, 0, val),
      alternativeKeys = Object.keys(alternatives).filter(function (e) {
      if (e === 'StringNode') {
        return false;
      }

      return true;
    });
    var list = alternativeKeys.map(function (e) {

      var type = alternatives[e]();

      if (typeof type === 'string') {
        return {text: e + ': ', displayText: e  + ' (autocomplete)'};
        } else {
            return {text: e + ':\n' + s, displayText: e  + ' (autocomplete)'};
        }
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
  });
})();
