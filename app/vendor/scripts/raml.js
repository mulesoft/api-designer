CodeMirror.defineMode("raml", function(config, parserConfig) {

  var yamlMode = CodeMirror.getMode(config, "yaml");
  var xmlMode = CodeMirror.getMode(config, "xml");
  var jsonMode = CodeMirror.getMode(config, { name: "javascript", json: true });

  function yaml(stream, state) {
    var style = yamlMode.token(stream, state.yamlState);



    return style;
  }

  function xml(stream, state) {

  }

  function json(stream, state) {

  }

  function maybeBackup(stream, pat, style) {
    var cur = stream.current();
    var close = cur.search(pat), m;
    if (close > -1) stream.backUp(cur.length - close);
    else if (m = cur.match(/<\/?$/)) {
      stream.backUp(cur.length);
      if (!stream.match(pat, false)) stream.match(cur[0]);
    }
    return style;
  }

  return {
    startState: function () {
      return {
        token: yaml,
        localMode: null,
        localState: null,
        yamlState: yamlMode.startState()
      };
    },
    token: function(stream, state) {
      return state.token(stream, state);
    }
  };
}, "yaml", "javascript", "xml");
CodeMirror.defineMIME("text/x-raml", "raml");