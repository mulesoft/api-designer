'use strict';

var hinter, editor;

var describe = window.describe, beforeEach = window.beforeEach,
    expect = window.expect, it = window.it;

function getEditor(text, cursor) {
    var Editor = {
      getCursor: function () {
        return this.cursor;
      },
      getLine: function (line) {
        //console.log(line, this.text.split('\n')[line]);
        return this.text.split('\n')[line];
      },
      lineCount: function () {
        return this.text.split('\n').length;
      }
    };

    var editor = Object.create(Editor);
  
    editor.text = text;
    editor.cursor = cursor || { line: 0, ch: 0 };

    return editor;
}

describe('RAML Hint Service', function () {
  beforeEach(function () {
    var $injector = angular.injector(['raml']);
    hinter = $injector.get('ramlHint');
    expect(hinter).not.toBe(null);
  });

  describe('computePath', function () {
    it('should handle root level paths', function () {
      editor = getEditor(
        'title: hello\n'+
        'version: v1.0\n' +
        'baseUri: http://example.com/api\n',
        {line: 1, ch: 4});
      var res = hinter.computePath(editor);
      expect(res).not.toBe(undefined);
      expect(res.length).toBe(1);
      expect(res[0]).toBe('version');
    });

    it('should handle second level paths', function () {
      editor = getEditor(
        'title: hello\n'+
        'version: v1.0\n' +
        'baseUri: http://example.com/api\n' +
        '/hello:\n' +
        '  /bye:\n' +
        '    get:\n',
        {line: 5, ch: 4});

      var res = hinter.computePath(editor);
      expect(res).not.toBe(undefined);
      expect(res.length).toBe(3);
      expect(res[0]).toBe('/hello');
      expect(res[1]).toBe('/bye');
      expect(res[2]).toBe('get');
    });
    
    it('should handle variable indentUnits', function () {
      //TODO Add test when decoupling indentUnit
    });
  });

  describe('getScopes', function () {
    it('should handle simple structures', function () {
      editor = getEditor(
        'title: hello\n'+
        'version: v1.0\n' +
        'baseUri: http://example.com/api\n' +
        '/hello:\n' +
        '  /bye:\n' +
        '    get: {}\n' +
        '  /ciao:\n' +
        '    get:');
      

      var scopesByLine = hinter.getScopes(editor).scopesByLine;
      expect(scopesByLine[0]).not.toBe(undefined);
      expect(scopesByLine[0].length).toBe(4);
      expect(scopesByLine[3].length).toBe(2);
      expect(scopesByLine[4].length).toBe(1);

      var scopeLevels = hinter.getScopes(editor).scopeLevels;
      expect(scopeLevels[0].length).toBe(4);
      expect(scopeLevels[1].length).toBe(2);
      expect(scopeLevels[2].length).toBe(2);
      expect(scopeLevels[3]).toBe(undefined);
    });
  });

  describe('getEditorState', function () {
    it('should be consistent with editor state', function () {
      editor = getEditor(
        'title: hello\n'+
        'version: v1.0\n' +
        'baseUri: http://example.com/api\n' +
        '/hello:\n' +
        '  /bye:\n' +
        '    get: {}\n' +
        '  /ciao:\n' +
        '    get:\n',
        {line: 4, ch: 4});

      var editorState = hinter.getEditorState(editor);
      expect(editorState).not.toBe(undefined);
      expect(editorState.curWord).toBe('bye');
      expect(editorState.start.line).toBe(4);
      expect(editorState.start.ch).toBe(3);
      expect(editorState.end.line).toBe(4);
      expect(editorState.end.ch).toBe(6);
      expect(editorState.curLine).toBe('  /bye:');
      expect(editorState.currLineTabCount).toBe(1);
    });
  });

  describe('getKeysToErase', function () {
    it('should list the keys at the same level with the same parent', function () {
      editor = getEditor(
        'title: hello\n'+
        'version: v1.0\n' +
        'baseUri: http://example.com/api\n' +
        '/hello:\n' +
        '  /bye:\n' +
        '    get: {}\n' +
        '  /ciao:\n' +
        '    get:', {line: 2, ch: 5});

      var keysToErase = hinter.getKeysToErase(editor);
      expect(keysToErase.length).toBe(4);
      var expected = ['title', 'version', 'baseUri', '/hello'];
      var i;
      for (i = 0; i < expected.length; i++) {
        expect(keysToErase[i]).toBe(expected[i]);
      }
      
    });
    it('should list third level keys ok', function () {
      editor = getEditor(
        'title: hello\n'+
        'version: v1.0\n' +
        'baseUri: http://example.com/api\n' +
        '/hello:\n' +
        '  /bye:\n' +
        '    get: {}\n' +
        '    post: {}\n' +
        '    put: {}\n' +
        '    delete: {}\n' +
        '  /ciao:\n' +
        '    get:', {line: 5, ch: 6});

      var keysToErase = hinter.getKeysToErase(editor);
      expect(keysToErase.length).toBe(4);
      var expected = ['get', 'post', 'put', 'delete'];
      var i;
      for (i = 0; i < expected.length; i++) {
        expect(keysToErase[i]).toBe(expected[i]);
      }

    });
  });

  describe('selectiveCloneAlternatives', function () {
    it('should clone all the keys in suggestions when keysToErase is empty', function () {
      var key;

      var suggestions = {x: 1, y: 2};
      var alternatives = {a: 1, b: 2, c: 3, suggestions: suggestions};

      var newAlternatives = hinter.selectiveCloneAlternatives(alternatives, []);

      expect(alternatives === newAlternatives).toBe(false);
      expect(alternatives.suggestions === newAlternatives.suggestions).toBe(false);

      for (key in alternatives) {
        if (key !== 'suggestions') {
          expect(newAlternatives[key]).toBe(alternatives[key]);
        }
      }
      for (key in alternatives.suggestions) {
        expect(newAlternatives.suggestions[key]).toBe(alternatives.suggestions[key]);
      }
    });

    it('should exclude the keys found in keysToErase', function () {
      var key;

      var suggestions = {x: 1, y: 2};
      var alternatives = {a: 1, b: 2, c: 3, suggestions: suggestions};

      var newAlternatives = hinter.selectiveCloneAlternatives(alternatives, ['x']);
      
      expect(alternatives === newAlternatives).toBe(false);
      expect(alternatives.suggestions === newAlternatives.suggestions).toBe(false);

      for (key in alternatives) {
        if (key !== 'suggestions') {
          expect(newAlternatives[key]).toBe(alternatives[key]);
        }
      }
      
      expect(newAlternatives.suggestions.y).toBe(alternatives.suggestions['y']);
      expect(newAlternatives.suggestions.x).not.toBe(alternatives.suggestions['x']);
      expect(newAlternatives.suggestions.x).toBe(undefined);

    });
  });

  describe('getAlternatives', function () {
    it('should provide suggestRAML alternatives', function () {
      var key;

      var alternatives = {suggestions: {a: {}, b: {}, c: {}}, category: 'x'};
      hinter.suggestRAML = function() {
        return alternatives;
      };
      editor = getEditor(
        'title: hello\n',
        {line: 1, ch: 0});
      var newAlternatives = hinter.getAlternatives(editor);
      
      for (key in alternatives.suggestions) {
        expect(alternatives.suggestions[key]).toBe(newAlternatives.values.suggestions[key]);
      }
      
      expect(newAlternatives.keys.length).toBe(3);

    });
    
    it('should not provide existing keys', function () {
      var key;

      var alternatives = {suggestions: {title: {}, a: {}, b: {}, c: {}}, category: 'x'};
      hinter.suggestRAML = function() {
        return alternatives;
      };
      editor = getEditor(
        'title: hello\n',
        {line: 1, ch: 0});
      var newAlternatives = hinter.getAlternatives(editor);

      expect(newAlternatives.values.title).toBe(undefined);
      expect(newAlternatives.keys.indexOf('title')).toBe(-1);
      expect(newAlternatives.keys.length).toBe(3);
      

    });
    

  });



});
