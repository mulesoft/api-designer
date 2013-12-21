'use strict';

angular.module('codeMirror')
  .factory('codeMirrorHighLight', function () {
    var mode = {};

    mode.highlight = function(config) {
      mode.indentationOverlay = {
        token: function(stream, state) {
          if (stream.match('  ') && (state.cutoff === undefined || stream.column() <= state.cutoff)) {
            return 'indent indent-col-' + stream.column();
          } else {
            stream.skipToEnd();
          }
        },
        startState: function() {
          return {};
        }
      }
      mode.yaml = CodeMirror.overlayMode(CodeMirror.getMode(config, 'yaml'), mode.indentationOverlay);
      mode.xml = CodeMirror.overlayMode(CodeMirror.getMode(config, 'xml'), mode.indentationOverlay);
      mode.json = CodeMirror.overlayMode(CodeMirror.getMode(config, { name: 'javascript', json: true }), mode.indentationOverlay);
      mode.markdown = CodeMirror.overlayMode(CodeMirror.getMode(config, 'gfm'), mode.indentationOverlay);

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
        mode._setMode('json', stream, state, 2);
      }

      if(/text\/xml:/.test(stream.string)) {
        mode._setMode('xml', stream, state, 2);
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
    mode._setMode = function(modeName, stream, state, indent) {
      state.token = mode['_' + modeName];
      state.localMode = mode[modeName];
      state.localState = mode[modeName].startState();
      state.localState.parentIndentation = stream.indentation() + (indent || 0);

      if(modeName === 'markdown') {
        state.localState.base.parentIndentation = state.localState.parentIndentation;
      }
    };
    mode._applyMode = function (modeName, stream, state) {
      if(/(schema|example):(\s?)\|/.test(stream.string)) {
        return mode._yaml(stream, state);
      }

      if(stream.string.trim().length > 0 &&
         stream.indentation() <= state.localState.parentIndentation) {

        state.token = mode._yaml;
        state.localState = state.localMode = null;
        return mode._yaml(stream, state);
      }

      state.localState.overlay.cutoff = state.localState.parentIndentation;
      return mode[modeName].token(stream, state.localState);
    };

    return mode;
  });
