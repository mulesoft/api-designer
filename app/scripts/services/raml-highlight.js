'use strict';

var CodeMirror = window.CodeMirror;

angular.module('codeMirror')
  .factory('codeMirrorHighLight', function () {
    var mode = {};

    mode.highlight = function(config) {
      mode.yaml = CodeMirror.getMode(config, "yaml");
      mode.xml = CodeMirror.getMode(config, "xml");
      mode.json = CodeMirror.getMode(config, { name: "javascript", json: true });
      mode.markdown = CodeMirror.getMode(config, "gfm");

      return {
        startState: function () {
          return {
            token: mode._yaml,
            localState: null,
            yamlState: mode.yaml.startState()
          };
        },
        token: function(stream, state) {
          return state.token(stream, state);
        }
      };
    }

    mode._yaml = function(stream, state) {
      if(/(content|description):(\s?)\|/.test(stream.string)) {
        state.token = mode._markdown;
        state.localState = mode.markdown.startState();
        state.localState.parentIndentation = stream.indentation();
        state.localState.base.parentIndentation = state.localState.parentIndentation;
      }

      if(/application\/json:/.test(stream.string)) {
        state.token = mode._json;
        state.localState = mode.json.startState();
        state.localState.parentIndentation = stream.indentation();
      }

      if(/text\/xml:/.test(stream.string)) {
        state.token = mode._xml;
        state.localState = mode.xml.startState();
        state.localState.parentIndentation = stream.indentation();
      }

      return mode.yaml.token(stream, state.yamlState);
    }
    //TODO: refactor all this duplication
    mode._xml = function (stream, state) {
      if(stream.indentation() <= state.localState.parentIndentation){
        state.token = mode._yaml;
        state.localState = null;
        return mode._yaml(stream, state);
      }
      if(/(schema|example):(\s?)\|/.test(stream.string)) {
        return mode._yaml(stream, state);
      }
      return mode.xml.token(stream, state.localState);
    }
    mode._json = function (stream, state) {
      if(stream.indentation() <= state.localState.parentIndentation){
        state.token = mode._yaml;
        state.localState = null;
        return mode._yaml(stream, state);
      }
      if(/(schema|example):(\s?)\|/.test(stream.string)) {
        return mode._yaml(stream, state);
      }
      return mode.json.token(stream, state.localState);
    }
    mode._markdown = function (stream, state) {
      if(stream.indentation() <= state.localState.parentIndentation) {
        state.token = mode._yaml;
        state.localState = null;
        return mode._yaml(stream, state);
      }

      return mode.markdown.token(stream, state.localState);
    }

    return mode;
  });