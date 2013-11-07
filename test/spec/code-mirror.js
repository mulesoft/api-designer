'use strict';

function sp (i) {
  return new Array(i + 1).join(' ');
}

describe('CodeMirror Service', function () {
  var editor, codeMirror;

  beforeEach(module('codeMirror'));
  beforeEach(inject(function ($injector) {
    codeMirror = $injector.get('codeMirror');
  }));

  describe('tab key', function () {
    it('should not be hardcoded (indentUnit)', function () {
      var indentUnit = 7;
      editor = getEditor(
        'title: hello\n'+
        'version: v1.0\n' +
        'baseUri: http://example.com/api\n',
        {line: 3, ch: 0},
        {indentUnit: indentUnit});

      codeMirror.tabKey(editor);
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

      codeMirror.tabKey(editor);
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

      codeMirror.tabKey(editor);
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

      codeMirror.backspaceKey(editor);
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

      codeMirror.backspaceKey(editor);
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

      codeMirror.backspaceKey(editor);
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

      codeMirror.backspaceKey(editor);
      editor.deleteOffset.should.be.equal(-1);
    });
  });

  describe('auto indentation', function () {
    it('should keep the same indentation level by default', function () {
      var indentUnit = 2;
      editor = getEditor(
        'title: hello\n' +
        'version: v1.0\n' +
        'baseUri: http://example.com/api\n' +
        '/tags:\n' +
        '  displayName: Tags',
        { line: 4, ch: 19},
        { indentUnit: indentUnit });

      codeMirror.enterKey(editor);
      editor.spacesToInsert.should.be.equal('\n' + sp(indentUnit));
    });

    it('should keep the same indentation level for elements without children', function () {
      var indentUnit = 2;
      editor = getEditor(
        'title: hello\n' +
        'version: v1.0\n' +
        'baseUri: http://example.com/api\n' +
        '/tags:',
        { line: 3, ch: 6},
        { indentUnit: indentUnit });

      codeMirror.enterKey(editor);
      editor.spacesToInsert.should.be.equal('\n');
    });

    it('should add one indentation level if the current line has children', function () {
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

      codeMirror.enterKey(editor);
      editor.spacesToInsert.should.be.equal('\n' + sp(indentUnit * 2));
    });

    it('should add another indentation if the current line has a continuation character ("|") and has one indent', function () {
      var indentUnit = 2;
      editor = getEditor(
        'title: Test\n' +
        'baseUri: http://www.api.com/{version}/{company}\n' +
        'version: v1.1\n' +
        '/tags:\n' +
        '  \n' +
        '  name: Tags\n' +
        '  description: |\n' +
        '  get:\n' +
        '    summary: Get a list of recently tagged media\n' +
        '    description: This is a description of getting tags',
        { line: 6, ch: 15 },
        { indentUnit: indentUnit });

      codeMirror.enterKey(editor);
      editor.spacesToInsert.should.be.equal('\n' + sp(indentUnit * 2));
    });

    it('should preserve the whitespace if the current line has a parent with continuation character ("|") and one indent', function () {
      var indentUnit = 2;
      editor = getEditor(
        'title: Test\n' +
        'baseUri: http://www.api.com/{version}/{company}\n' +
        'version: v1.1\n' +
        '/tags:\n' +
        '  name: Tags\n' +
        '  description: |\n' +
        '    Here be dragons\n' +
        '  get:\n' +
        '    summary: Get a list of recently tagged media\n' +
        '    description: This is a description of getting tags',
        { line: 6, ch: 18 },
        { indentUnit: indentUnit });

      codeMirror.enterKey(editor);
      editor.spacesToInsert.should.be.equal('\n' + sp(indentUnit * 2));
    });

    it('should add another indentation if the current line has a continuation character ("|") and has two indents', function () {
      var indentUnit = 2;
      editor = getEditor(
        'title: Test\n' +
        'baseUri: http://www.api.com/{version}/{company}\n' +
        'version: v1.1\n' +
        '/tags:\n' +
        '  \n' +
        '  name: Tags\n' +
        '  description: This is the description of the tag\n' +
        '  get:\n' +
        '    summary: Get a list of recently tagged media\n' +
        '    description: |',
        { line: 9, ch: 17 },
        { indentUnit: indentUnit });

      codeMirror.enterKey(editor);
      editor.spacesToInsert.should.be.equal('\n' + sp(indentUnit * 3));
    });

    it('should keep the same indentation level if the current line is all tabs', function () {
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

      codeMirror.enterKey(editor);
      editor.spacesToInsert.should.be.equal('\n' + sp(indentUnit));
    });

    it('should keep the same indentation level if the current line is all tabs, preserving any extra whitespace', function () {
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

      codeMirror.enterKey(editor);
      editor.spacesToInsert.should.be.equal('\n' + sp(3));
    });

    it('should add one indentation level if the cursor is in the middle of a sentence.', function () {
      var indentUnit = 2;
      editor = getEditor(
        'title: Test\n' +
        'baseUri: http://www.api.com/{version}/{company}\n' +
        'version: v1.1\n' +
        '/tags:\n' +
        '  name: Tags\n' +
        '  description: This is a description of tags      with spaces in it\n' +
        '  get:\n' +
        '    summary: Get a list of recently tagged media\n' +
        '    description: This is a description of getting tags',
        { line: 5, ch: 46 },
        { indentUnit: indentUnit });

      codeMirror.enterKey(editor);
      editor.spacesToInsert.should.be.equal('\n' + sp(indentUnit * 2));
    });

    it('should keep the same indentation level if the cursor is in the middle of a sentence and not on the first line.', function () {
      var indentUnit = 2;
      editor = getEditor(
        'title: Test\n' +
        'baseUri: http://www.api.com/{version}/{company}\n' +
        'version: v1.1\n' +
        '/tags:\n' +
        '  name: Tags\n' +
        '  description: This is a description of tags with spaces in it\n' +
        '    but no in the first        line\n' +
        '  get:\n' +
        '    summary: Get a list of recently tagged media\n' +
        '    description: This is a description of getting tags',
        { line: 6, ch: 22 },
        { indentUnit: indentUnit });

      codeMirror.enterKey(editor);
      editor.spacesToInsert.should.be.equal('\n' + sp(indentUnit * 2));
    });

    it('should keep the same indentation level if the cursor is at the beginning of a sentence', function () {
      var indentUnit = 2;
      editor = getEditor(
        'title: Test\n' +
        'baseUri: http://www.api.com/{version}/{company}\n' +
        'version: v1.1\n' +
        '/tags:\n' +
        '  name: Tags\n' +
        '  description: This is a description of tags with spaces in it\n' +
        '    but no in the first        line\n' +
        '  get:\n' +
        '    summary: Get a list of recently tagged media\n' +
        '    description: This is a description of getting tags',
        { line: 6, ch: 22 },
        { indentUnit: indentUnit });

      codeMirror.enterKey(editor);
      editor.spacesToInsert.should.be.equal('\n' + sp(indentUnit * 2));
    });

    it('should detect traits and add an extra indentation level', function () {
      var indentUnit = 2;
      editor = getEditor(
        'title: Test\n' +
        'baseUri: http://www.api.com/{version}/{company}\n' +
        'version: v1.1\n' +
        'traits:\n' +
        '  - trait-one:\n' +
        '  - trait-two:\n' +
        '    trait-three:',
        { line: 4, ch: 13 },
        { indentUnit: indentUnit });

      codeMirror.enterKey(editor);
      editor.spacesToInsert.should.be.equal('\n' + sp(indentUnit * 3));

      editor.setCursor(5, 13);
      codeMirror.enterKey(editor);
      editor.spacesToInsert.should.be.equal('\n' + sp(indentUnit * 3));

      editor.setCursor(6, 15);
      codeMirror.enterKey(editor);
      editor.spacesToInsert.should.be.equal('\n' + sp(indentUnit * 3));
    });

    it('should detect resource types and add an extra indentation level', function () {
      var indentUnit = 2;
      editor = getEditor(
        'title: Test\n' +
        'baseUri: http://www.api.com/{version}/{company}\n' +
        'version: v1.1\n' +
        'resourceTypes:\n' +
        '  - base:\n' +
        '  - collection:\n' +
        '    member:',
        { line: 4, ch: 13 },
        { indentUnit: indentUnit });

      codeMirror.enterKey(editor);
      editor.spacesToInsert.should.be.equal('\n' + sp(indentUnit * 3));

      editor.setCursor(6, 11);
      codeMirror.enterKey(editor);
      editor.spacesToInsert.should.be.equal('\n' + sp(indentUnit * 3));
    });

    it('should detect arrays and add an extra indentation level', function () {
      var indentUnit = 2;
      editor = getEditor(
        'title: Test\n' +
        'baseUri: http://www.api.com/{version}/{company}\n' +
        'version: v1.1\n' +
        'documentation:\n' +
        '  - title:\n',
        { line: 4, ch: 10 },
        { indentUnit: indentUnit });

      codeMirror.enterKey(editor);
      editor.spacesToInsert.should.be.equal('\n' + sp(indentUnit * 2));
    });

    it('should keep the same indentation level for sequence of entries with a little help', function () {
      var indentUnit = 2;
      var editor = getEditor(
        [
          'key1:',
          '  - value1:',
          '  - value2:',
          '    value3:'
        ].join('\n'),
        {
          line: 2,
          ch: -1
        },
        {
          indentUnit: indentUnit
        }
      );

      codeMirror.enterKey(editor);
      editor.spacesToInsert.should.be.equal('\n' + sp(indentUnit * 2));

      editor.setCursor(2, -1);
      codeMirror.enterKey(editor);
      editor.spacesToInsert.should.be.equal('\n' + sp(indentUnit * 2));

      editor.setCursor(3, -1);
      codeMirror.enterKey(editor);
      editor.spacesToInsert.should.be.equal('\n' + sp(indentUnit * 2));
    });

    it('should keep the same indentation level for document start marker (RT-156)', function () {
      var indentUnit = 2;
      var editor = getEditor(
        [
          '---'
        ].join('\n'),
        {
          line: 0,
          ch: 3
        },
        {
          indentUnit: indentUnit
        }
      );

      codeMirror.enterKey(editor);
      editor.spacesToInsert.should.be.equal('\n');
    });

    it('should keep the same indentation level and any extra whitespace for lines that are \"rubbish\"', function () {
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

      codeMirror.enterKey(editor);
      editor.spacesToInsert.should.be.equal('\n' + sp(3));
    });
  });
});
