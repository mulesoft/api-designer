'use strict';

var codeMirrorService, editor;

var describe = window.describe, beforeEach = window.beforeEach,
  it = window.it;

window.getEditor = window.getEditor || {};


function sp (i) {
  return new Array(i + 1).join(' ');
}

describe('CodeMirror Service', function () {
  beforeEach(function () {
    var $injector = angular.injector(['codeMirror']);
    codeMirrorService = $injector.get('codeMirror');
    codeMirrorService.should.be.ok;
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
      editor.spacesToInsert.should.be.equal(sp(indentUnit));
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
      editor.spacesToInsert.should.be.equal(sp(indentUnit - incompleteIndent));

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
      editor.spacesToInsert.should.be.equal(sp(indentUnit));
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
      editor.deleteOffset.should.be.equal(-1);
    });

    it('should delete tabs when line is tab only', function () {
      var indentUnit = 2;
      editor = getEditor(
        'title: hello\n'+
        'version: v1.0\n' +
        'baseUri: http://example.com/api\n' +
        '    ',
        {line: 3, ch: 3},
        {indentUnit: indentUnit});

      codeMirrorService.backspaceKey(editor);
      editor.deleteOffset.should.be.equal(-2);
    });

    it('should delete tabs with arbitrary tab size', function () {
      var indentUnit = 7;
      editor = getEditor(
        'title: hello\n'+
        'version: v1.0\n' +
        'baseUri: http://example.com/api\n' +
        sp(indentUnit),
        {line: 3, ch: indentUnit - 1},
        {indentUnit: indentUnit});

      codeMirrorService.backspaceKey(editor);
      editor.deleteOffset.should.be.equal(-indentUnit);
    });
    
    it('should delete one char if cursor is on first column (even with tabs after)', function () {
      var indentUnit = 7;
      editor = getEditor(
        'title: hello\n'+
        'version: v1.0\n' +
        'baseUri: http://example.com/api\n' +
        sp(indentUnit),
        {line: 3, ch: 0},
        {indentUnit: indentUnit});

      codeMirrorService.backspaceKey(editor);
      editor.deleteOffset.should.be.equal(-1);
    });

  });

  describe('enter key', function () {
    it('should keep the same tab level if the current line is a literal', function (){
      var indentUnit = 2;
      editor = getEditor(
        'title: hello\n' +
        'version: v1.0\n' +
        'baseUri: http://example.com/api\n' +
        '/tags:\n' +
        '  name: Tags',
        { line: 4, ch: 13},
        { indentUnit: indentUnit });

      codeMirrorService.enterKey(editor);
      editor.spacesToInsert.should.be.equal("\n" + sp(indentUnit));
    });

    it('should add another tab level if the current line is a scalar', function () {
      var indentUnit = 2;
      editor = getEditor(
        'title: hello\n' +
        'version: v1.0\n' +
        'baseUri: http://example.com/api\n' +
        '/tags:\n' +
        '  name: Tags',
        { line: 3, ch: 6},
        { indentUnit: indentUnit });

      codeMirrorService.enterKey(editor);
      editor.spacesToInsert.should.be.equal("\n" + sp(indentUnit));
    });

    it('should add another tab level for second level scalars', function () {
      var indentUnit = 2;
      editor = getEditor(
        'title: Test\n' +
        'baseUri: http://www.api.com/{version}/{company}\n' +
        'version: v1.1\n' +
        '/tags:\n' +
        '  name: Tags\n' +
        '  description: This is a description of tags\n' +
        '  get:\n' +
        '    summary: Get a list of recently tagged media\n' +
        '    description: This is a description of getting tags',
        { line: 6, ch: 0 },
        { indentUnit: indentUnit });

      codeMirrorService.enterKey(editor);
      editor.spacesToInsert.should.be.equal("\n" + sp(indentUnit * 2));
    });

    it('should keep the same indentation level if the current line is all tabs', function (){
      var indentUnit = 2;
      editor = getEditor(
        'title: Test\n' +
        'baseUri: http://www.api.com/{version}/{company}\n' +
        'version: v1.1\n' +
        '/tags:\n' +
        '  \n' +
        '  name: Tags\n' +
        '  description: This is a description of tags\n' +
        '  get:\n' +
        '    summary: Get a list of recently tagged media\n' +
        '    description: This is a description of getting tags',
        { line: 4, ch: 2 },
        { indentUnit: indentUnit });

      codeMirrorService.enterKey(editor);
      editor.spacesToInsert.should.be.equal("\n" + sp(indentUnit));
    });

    it('should keep the same indentation level if the current line is all tabs, preserving any extra whitespace', function (){
      var indentUnit = 2;
      editor = getEditor(
        'title: Test\n' +
          'baseUri: http://www.api.com/{version}/{company}\n' +
          'version: v1.1\n' +
          '/tags:\n' +
          '   \n' +
          '  name: Tags\n' +
          '  description: This is a description of tags\n' +
          '  get:\n' +
          '    summary: Get a list of recently tagged media\n' +
          '    description: This is a description of getting tags',
        { line: 4, ch: 2 },
        { indentUnit: indentUnit });

      codeMirrorService.enterKey(editor);
      editor.spacesToInsert.should.be.equal("\n" + sp(3));
    });

    it.skip('should keep the same indentation level and any extra whitespace for lines that are \"rubbish\"', function (){
      var indentUnit = 2;
      editor = getEditor(
        'title: Test\n' +
        'baseUri: http://www.api.com/{version}/{company}\n' +
        'version: v1.1\n' +
        '/tags:\n' +
        '   this is rubbish\n' +
        '  name: Tags\n' +
        '  description: This is a description of tags\n' +
        '  get:\n' +
        '    summary: Get a list of recently tagged media\n' +
        '    description: This is a description of getting tags',
        { line: 4, ch: 2 },
        { indentUnit: indentUnit });

      codeMirrorService.enterKey(editor);
      editor.spacesToInsert.should.be.equal("\n" + sp(3));
    });

  });

});
