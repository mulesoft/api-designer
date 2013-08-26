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
        'baseUri: http://example.com/api\n');
      var res = hinter.computePath(editor, 1);
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
        '    get:\n');
      var res = hinter.computePath(editor, 5);
      expect(res).not.toBe(undefined);
      expect(res.length).toBe(3);
      expect(res[0]).toBe('/hello');
      expect(res[1]).toBe('/bye');
      expect(res[2]).toBe('get');
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
        '    get:\n', {line: 4, ch: 4});

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

});
