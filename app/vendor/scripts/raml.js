CodeMirror.defineMode("raml", function(config, parserConfig) {

  var yamlMode = CodeMirror.getMode(config, "yaml");
  var xmlMode = CodeMirror.getMode(config, "xml");
  var jsonMode = CodeMirror.getMode(config, { name: "javascript", json: true });
  var gfmMode = CodeMirror.getMode(config, "gfm");

  function yaml(stream, state) {
    //TODO:refactor this into a dictionary, or something we can iterate
    if(/text\/xml:/.test(stream.string)) {
      state.mode = "xml";
    }
    if(/application\/json:/.test(stream.string)) {
      state.mode = "json";
    }

    if(/(schema:|example:)(\s?)\|/.test(stream.string)) {
      state.token = state.mode == "json" ? json : xml;
      state.localState = state.mode == "json" ? jsonMode.startState() : xmlMode.startState();
      state.localState.indentation = stream.indentation();
    }

    return yamlMode.token(stream, state.yamlState);
  }

  //TODO: refactor this and json into a function that takes a parameter?
  function xml(stream, state) {
    if(stream.indentation() <= state.localState.indentation){
      state.token = yaml;
      state.localState = null;
      return yaml(stream, state);
    }
    return xmlMode.token(stream, state.localState);
  }

  function json(stream, state) {
    if(stream.indentation() <= state.localState.indentation){
      state.token = yaml;
      state.localState = null;
      return yaml(stream, state);
    }
    return jsonMode.token(stream, state.localState);
  }

  return {
    startState: function () {
      return {
        mode: "json",
        token: yaml,
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