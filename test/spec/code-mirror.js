'use strict';

var codeMirrorService, editor;

var describe = window.describe, beforeEach = window.beforeEach,
    expect = window.expect, it = window.it;

window.getEditor = window.getEditor || {};


function sp (i) {
  return new Array(i + 1).join(' ');
}

describe('CodeMirror Service', function () {
  beforeEach(function () {
    var $injector = angular.injector(['codeMirror']);
    codeMirrorService = $injector.get('codeMirror');
    expect(codeMirrorService).not.toBe(null);

    window.getEditor = function (text, cursor, options) {
      options = options || {};
    
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
        },
        replaceSelection: function (spaces) {
          this.spacesToInsert = spaces;
        },
        getOption: function (key) {
          return options[key];
        },
        deleteH: function (offset, range) {
          expect(range).toBe('char');
          this.deleteOffset = offset;
        }
      };
    
      var editor = Object.create(Editor);
      
      editor.text = text;
      editor.cursor = cursor || { line: 0, ch: 0 };
    
      return editor;
    };
  });

  describe('tab key', function () {
    it('should not be hardcoded (indentUnit)', function () {
      var indentUnit = 7;
      editor = getEditor(
        'title: hello\n'+
        'version: v1.0\n' +
        'baseUri: http://example.com/api\n',
        {line: 3, ch: 0},
        {indentUnit: indentUnit});

      codeMirrorService.tabKey(editor);
      expect(editor.spacesToInsert).toBe(sp(indentUnit));

    });

    it('should complete the indentUnit', function () {
      var indentUnit = 7, incompleteIndent = 3;
      editor = getEditor(
        'title: hello\n'+
        'version: v1.0\n' +
        'baseUri: http://example.com/api\n' +
        sp(incompleteIndent),
        {line: 3, ch: 0},
        {indentUnit: indentUnit});

      codeMirrorService.tabKey(editor);
      expect(editor.spacesToInsert).toBe(sp(indentUnit - incompleteIndent));
      
    });
    
    it('should tab normally with non-whitespace', function () {
      var indentUnit = 7;
      editor = getEditor(
        'title: hello\n'+
        'version: v1.0\n' +
        'baseUri: http://example.com/api\n' +
        'lala',
        {line: 3, ch: 0},
        {indentUnit: indentUnit});
      
      codeMirrorService.tabKey(editor);
      expect(editor.spacesToInsert).toBe(sp(indentUnit));
    });

  });


  describe('backspace key', function () {
    it('should delete only one non-whitespace characters', function () {
      var indentUnit = 2;
      editor = getEditor(
        'title: hello\n'+
        'version: v1.0\n' +
        'baseUri: http://example.com/api\n' +
        'lala',
        {line: 3, ch: 0},
        {indentUnit: indentUnit});

      codeMirrorService.backspaceKey(editor);
      expect(editor.deleteOffset).toBe(-1);
    });

    it('should delete tabs when line is tab only', function () {
      var indentUnit = 2;
      editor = getEditor(
        'title: hello\n'+
        'version: v1.0\n' +
        'baseUri: http://example.com/api\n' +
        '    ',
        {line: 3, ch: 0},
        {indentUnit: indentUnit});

      codeMirrorService.backspaceKey(editor);
      expect(editor.deleteOffset).toBe(-2);
    });
    
    it('should delete tabs with arbitrary tab size', function () {
      var indentUnit = 7;
      editor = getEditor(
        'title: hello\n'+
        'version: v1.0\n' +
        'baseUri: http://example.com/api\n' +
        sp(indentUnit),
        {line: 3, ch: 0},
        {indentUnit: indentUnit});

      codeMirrorService.backspaceKey(editor);
      expect(editor.deleteOffset).toBe(-indentUnit);
    });
  });
});
