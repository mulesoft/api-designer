'use strict';

var CodeMirror = window.CodeMirror;

CodeMirror.defineMode('yaml', function () {

  var cons = ['true', 'false'];
  var keywordRegex = new RegExp('\\b((' + cons.join(')|(') + '))$', 'i');

  // Using one level of nesting nest (ie. [name + '.level']) instead of
  // [name].level to use default copy state function.
  function highlightRootElement(name, titleClass, contentClass, state, level, key) {

    if (level <= state[name + '.level']) {
      state[name + '.level'] = 0;
      state[name + '.inside'] = false;
    }
    if (name.indexOf(key) >= 0) {
      state[name + '.level'] = level;
      state[name + '.inside'] = true;
      return titleClass;
    }
    if (state[name + '.inside']) {
      return contentClass;
    }

    return false;

  }

  return {
    token: function(stream, state) {
      var ch = stream.peek();
      var esc = state.escaped;
      state.escaped = false;

      /* RAML tag */
      if (ch === '#' && stream.string.replace(/^\s+|\s+$/g, '').toUpperCase() === '#%RAML 0.2') {
        stream.skipToEnd();
        return 'raml-tag';
      }
      /* comments */
      if (ch === '#' && (stream.pos === 0 || /\s/.test(stream.string.charAt(stream.pos - 1)))) {
        stream.skipToEnd();
        return 'comment';
      }

      if (state.literal && stream.indentation() > state.keyCol) {
        stream.skipToEnd();
        return 'none';
      } else if (state.literal) {
        state.literal = false;
      }

      if (stream.sol()) {
        state.keyCol = 0;
        state.pair = false;
        state.pairStart = false;

        /* document start */
        if(stream.match(/---/)) {
          return 'def';
        }
        /* document end */
        if (stream.match(/\.\.\./)) {
          return 'def';
        }
        /* array list item */
        if (stream.match(/\s*-\s+/)) {
          return 'meta';
        }
      }
      /* pairs (associative arrays) -> key */
      if (!state.pair && stream.match(/^\s*([a-z0-9\?\/\{\}\._-])+(?=\s*:)/i)) {
        var key = stream.string.replace(/^\s+|\s+$/g, '').split(':')[0];
        var level = stream.string.split('  ').length - 1;

        state.pair = true;
        state.keyCol = stream.indentation();

        /* methods */
        if (level <= state.methodLevel || key.indexOf('/') === 0) {
          state.methodLevel = 0;
          state.insideMethod = false;
        }
        if ('get|get?|put|put?|post|post?|patch|patch?|delete|delete?|head|head?|options|options?'.indexOf(key) >= 0) {
          state.methodLevel = level;
          state.insideMethod = true;
        }
        if ('get|get?|put|put?|post|post?|patch|patch?|delete|delete?|head|head?|options|options?'.indexOf(key) >= 0) {
          return 'method-title';
        }
        if (state.insideMethod) {
          return 'method-content';
        }

        
        var rootElements =
          highlightRootElement('traits', 'trait-title', 'trait-content', state, level, key) ||
          highlightRootElement('resourceTypes', 'resource-type-title', 'resource-type-content', state, level, key) ||
          highlightRootElement('schemas', 'schema-title', 'schema-content', state, level, key) ||
          highlightRootElement('securitySchemes', 'security-scheme-title', 'security-scheme-content', state, level, key);
      
        if (rootElements) {
          return rootElements;
        }

        /* resources */
        if (key.indexOf('/') === 0) {
          return 'resource';
        }

        return 'key';
      }
      if (state.pair && stream.match(/^:\s*/)) { state.pairStart = true; return 'meta'; }

      /* inline pairs/lists */
      if (stream.match(/^(\{|\}|\[|\])/)) {
        if (ch === '{') {
          state.inlinePairs++;
        }
        else if (ch === '}') {
          state.inlinePairs--;
        }
        else if (ch === '[') {
          state.inlineList++;
        }
        else {
          state.inlineList--;
        }
        return 'meta';
      }

      /* list seperator */
      if (state.inlineList > 0 && !esc && ch === ',') {
        stream.next();
        return 'meta';
      }

      /* pairs seperator */
      if (state.inlinePairs > 0 && !esc && ch === ',') {
        state.keyCol = 0;
        state.pair = false;
        state.pairStart = false;
        stream.next();
        return 'meta';
      }

      /* start of value of a pair */
      if (state.pairStart) {
        /* block literals */
        if (stream.match(/^\s*(\||\>)\s*/)) {
          state.literal = true;
          return 'meta';
        }
        /* references */
        if (stream.match(/^\s*(\&|\*)[a-z0-9\._-]+\b/i)) {
          return 'variable-2';
        }
        /* numbers */
        if (state.inlinePairs === 0 && stream.match(/^\s*-?[0-9\.\,]+\s?$/)) {
          return 'number';
        }
        if (state.inlinePairs > 0 && stream.match(/^\s*-?[0-9\.\,]+\s?(?=(,|}))/)) {
          return 'number';
        }
        /* keywords */
        if (stream.match(keywordRegex)) { return 'keyword'; }
      }

      /* nothing found, continue */
      state.pairStart = false;
      state.escaped = (ch === '\\');
      stream.next();
      return null;
    },
    startState: function() {
      return {
        pair: false,
        pairStart: false,
        keyCol: 0,
        inlinePairs: 0,
        inlineList: 0,
        literal: false,
        escaped: false
      };
    }
  };
});

CodeMirror.defineMIME('text/x-yaml', 'yaml');
