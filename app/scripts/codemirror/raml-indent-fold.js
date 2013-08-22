CodeMirror.registerHelper("fold", "indent", function(cm, start) {
  var tabSize = cm.getOption("tabSize");

  var line = cm.getLine(start.line);
  var indent = CodeMirror.countColumn(line, null, tabSize);

  var nextLine = cm.getLine(start.line + 1);
  if (!nextLine) {
    return;
  }
  var nextLineIndent = CodeMirror.countColumn(nextLine, null, tabSize);

  if(nextLineIndent > indent) {
    for(var i = start.line + 2, end = cm.lineCount(); i < end; ++i) {
      nextLine = cm.getLine(i);
      nextLineIndent = CodeMirror.countColumn(nextLine, null, tabSize);

      if(nextLineIndent === indent) {
        nextLine = cm.getLine(i-1);

        return {
          from: CodeMirror.Pos(start.line, line.length),
          to: CodeMirror.Pos(i - 1, nextLine.length)
        };
      }

      if (i === end - 1) {
        nextLine = cm.getLine(end - 1);
        return {
          from: CodeMirror.Pos(start.line, line.length),
          to: CodeMirror.Pos(end - 1, nextLine.length)
        };
      }
    }
  }
});
CodeMirror.indentRangeFinder = CodeMirror.fold.indent; // deprecated
