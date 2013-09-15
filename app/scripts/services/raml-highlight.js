'use strict';

var CodeMirror = window.CodeMirror;

angular.module('codeMirror')
  .factory('codeMirrorHighLight', function () {
    //this will be a problem. Highlight modes don't have access
    //to the codemirror editor...
    var indentUnit = 2;
    var mode = {};

    mode.highlight = function(config) {
      mode.yaml = CodeMirror.getMode(config, "yaml");
      mode.xml = CodeMirror.getMode(config, "xml");
      mode.json = CodeMirror.getMode(config, { name: "javascript", json: true });
      mode.markdown = CodeMirror.getMode(config, "gfm");

      return {
        startState: function () {
          return {
            mode: "json",
            token: yaml,
            localState: null,
            yamlState: mode.yaml.startState()
          };
        },
        token: function(stream, state) {
          return state.token(stream, state);
        }
      };
    }

    function yaml(stream, state) {
      if(/(documentation:|description:)(\s?)\|/.test(stream.string)) {
        state.token = markdown;
        state.localState = mode.markdown.startState();
        state.localState.indentation = stream.indentation();
      }

      if(/application\/json:/.test(stream.string)) {
        state.token = json;
        state.localState = mode.json.startState();
        state.localState.indentation = stream.indentation();
      }

      if(/text\/xml:/.test(stream.string)) {
        state.token = xml;
        state.localState = mode.xml.startState();
        state.localState.indentation = stream.indentation();
      }

      return mode.yaml.token(stream, state.yamlState);
    }
    function xml(stream, state) {
      if(stream.indentation() <= state.localState.indentation){
        state.token = yaml;
        state.localState = null;
        return yaml(stream, state);
      }
      return mode.xml.token(stream, state.localState);
    }
    function json(stream, state) {
      if(stream.indentation() <= state.localState.indentation){
        state.token = yaml;
        state.localState = null;
        return yaml(stream, state);
      }
      return mode.json.token(stream, state.localState);
    }
    function markdown(stream, state) {
      if(stream.indentation() <= state.localState.indentation) {
        state.token = yaml;
        state.localState = null;
        return yaml(stream, state);
      }
      return mode.markdown.token(stream, state.localState);
    }

    return mode;
  });