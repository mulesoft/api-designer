var a;

(function () {
  var WORD = /[\w$]+/, RANGE = 500;

  CodeMirror.registerHelper("hint", "yaml", function(editor, options) {
    var word = options && options.word || WORD;
    var range = options && options.range || RANGE;
    var cur = editor.getCursor(), curLine = editor.getLine(cur.line);
    var start = cur.ch, end = start;
    while (end < curLine.length && word.test(curLine.charAt(end))) ++end;
    while (start && word.test(curLine.charAt(start - 1))) --start;
    var curWord = start != end && curLine.slice(start, end);

    editor.getLineHandle(cur.line);

    var d = [];

    function extract(root, path) {
        var startLine, endLine, startCol, endCol, i, j;

        if (root.constructor.name === 'MappingNode') {
            root.value.forEach(function (e) {
                extract(e[0], path);
                path.push(e[0].value);
                extract(e[1], path);
                path.pop();
            });
        } else if (root.constructor.name === 'ScalarNode') {
            startLine = root.start_mark.line;
            endLine = root.end_mark.line;
            startCol = root.start_mark.column;
            endCol = root.end_mark.column;

            for (i = startLine; i <= endLine; i++) {
                d[i] = d[i] || [];
                for (j = startCol; j <= endCol; j++) {
                    d[i][j] = d[i][j] || [];
                    d[i][j].push(root.value);
                }
            }
        } else if (root.constructor.name === 'SequenceNode') {
            root.value.forEach(function (e) {
                extract(e, path);
            });
        } else {
            throw 'Invalid state reached';
        }
    }

    extract(a, []);

    var val, list = [];


    if (d[cur.line][start]) {
        val = d[cur.line][start].filter(function (e) {
            return e !== 'resources' && e != 'relativeUri';
        });

        var s = '';
        for (var i = 0; i < start - 1; i++) {
            s += '  ';
        }

        list = Object.keys(suggest2(val)).map(function (e) {
            return {text: e + ":\n" + s, displayText: e  + ' (autocomplete)'};
        }) || [];
    }

      return {list: list,
          from: CodeMirror.Pos(cur.line, start),
            to: CodeMirror.Pos(cur.line, end)
      };
  });
})();
