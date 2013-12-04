'use strict';

angular.module('codeMirror')
  .factory('codeMirrorHighLight', function () {
    var mode = {};

    mode.highlight = function(config) {
      mode.yaml = CodeMirror.getMode(config, 'yaml');
      mode.xml = CodeMirror.getMode(config, 'xml');
      mode.json = CodeMirror.getMode(config, { name: 'javascript', json: true });
      mode.markdown = CodeMirror.getMode(config, 'gfm');

      return {
        startState: function () {
          return {
            token: mode._yaml,
            localMode: null,
            localState: null,
            yamlState: mode.yaml.startState()
          };
        },
        copyState: function(state) {
          var local;
          if (state.localState){
            local = CodeMirror.copyState(state.localMode, state.localState);

            if(!local.parentIndentation) {
              local.parentIndentation = state.localState.parentIndentation;
            }
          }

          return {
            token: state.token,
            localMode: state.localMode,
            localState: local,
            yamlState: CodeMirror.copyState(mode.yaml, state.yamlState)
          };
        },
        innerMode: function(state) {
          return {
            state: state.localState || state.yamlState,
            mode: state.localMode || mode.yaml
          };
        },
        token: function(stream, state) {
          return state.token(stream, state);
        }
      };
    };

    mode._yaml = function(stream, state) {
      if(/(content|description):(\s?)\|/.test(stream.string)) {
        mode._setMode('markdown', stream, state);
      }

      if(/application\/json:/.test(stream.string)) {
        mode._setMode('json', stream, state);
      }

      if(/text\/xml:/.test(stream.string)) {
        mode._setMode('xml', stream, state);
      }

      return mode.yaml.token(stream, state.yamlState);
    };
    mode._xml = function (stream, state) {
      return mode._applyMode('xml', stream, state);
    };
    mode._json = function (stream, state) {
      return mode._applyMode('json', stream, state);
    };
    mode._markdown = function (stream, state) {
      return mode._applyMode('markdown', stream, state);
    };
    mode._setMode = function(modeName, stream, state) {
      state.token = mode['_' + modeName];
      state.localMode = mode[modeName];
      state.localState = mode[modeName].startState();
      state.localState.parentIndentation = stream.indentation();

      if(modeName === 'markdown') {
        state.localState.base.parentIndentation = state.localState.parentIndentation;
      }
    };
    mode._applyMode = function (modeName, stream, state) {
      if(stream.string.trim().length > 0 &&
         stream.indentation() <= state.localState.parentIndentation) {

        state.token = mode._yaml;
        state.localState = state.localMode = null;
        return mode._yaml(stream, state);
      }

      if(/(schema|example):(\s?)\|/.test(stream.string)) {
        return mode._yaml(stream, state);
      }

      return mode[modeName].token(stream, state.localState);
    };

    return mode;
  });
