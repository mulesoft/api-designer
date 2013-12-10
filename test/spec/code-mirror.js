'use strict';

function sp (i) {
  return new Array(i + 1).join(' ');
}

describe('CodeMirror Service', function () {
  var codeMirror;

  beforeEach(module('codeMirror'));
  beforeEach(inject(function ($injector) {
    codeMirror = $injector.get('codeMirror');
  }));

  describe('tab key', function () {
    it('should complete the indentUnit', function () {
      var indentUnit       = 7;
      var incompleteIndent = 3;
      var editor           = getEditor(codeMirror,
        [
          'title: hello',
          'version: v1.0',
          'baseUri: http://example.com/api',
          sp(incompleteIndent)
        ].join('\n'),
        {line: 3, ch: 0},
        {indentUnit: indentUnit}
      );

      editor.fakeKey('Tab');
      editor.getLine(3).should.be.equal(sp(indentUnit));
    });

    it('should tab normally with non-whitespace', function () {
      var indentUnit = 7;
      var editor     = getEditor(codeMirror,
        [
          'title: hello',
          'version: v1.0',
          'baseUri: http://example.com/api',
          'lala',
        ],
        {line: 3, ch: 0},
        {indentUnit: indentUnit}
      );

      editor.fakeKey('Tab');
      editor.getLine(3).should.be.equal(sp(indentUnit) + 'lala');
    });
  });

  describe('backspace key', function () {
    it('should delete only one non-whitespace character', function () {
      var indentUnit = 2;
      var editor     = getEditor(codeMirror,
        [
          'title: hello',
          'version: v1.0',
          'baseUri: http://example.com/api',
          'lala'
        ],
        {line: 3, ch: 4},
        {indentUnit: indentUnit}
      );

      editor.fakeKey('Backspace');
      editor.getLine(3).should.be.equal('lal');
    });

    it('should delete tabs when line is tab only', function () {
      var indentUnit = 2;
      var editor     = getEditor(codeMirror,
        [
          'title: hello',
          'version: v1.0',
          'baseUri: http://example.com/api',
          '    '
        ],
        {line: 3, ch: 3},
        {indentUnit: indentUnit}
      );

      editor.fakeKey('Backspace');
      editor.getLine(3).should.be.equal('  ');
    });

    it('should delete tabs with arbitrary tab size', function () {
      var indentUnit = 7;
      var editor     = getEditor(codeMirror,
        [
          'title: hello',
          'version: v1.0',
          'baseUri: http://example.com/api',
          sp(indentUnit)
        ],
        {line: 3, ch: 666},
        {indentUnit: indentUnit}
      );

      editor.fakeKey('Backspace');
      editor.getLine(3).should.be.equal('');
    });

    it('should delete one char if cursor is on first column (even with tabs after)', function () {
      var indentUnit = 7;
      var editor     = getEditor(codeMirror,
        [
          'title: hello',
          'version: v1.0',
          'baseUri: http://example.com/api',
          sp(indentUnit)
        ],
        {line: 3, ch: 0},
        {indentUnit: indentUnit}
      );

      editor.fakeKey('Backspace');
      editor.getLine(2).should.be.equal('baseUri: http://example.com/api' + sp(indentUnit));
    });
  });

  describe('enter key', function () {
    it('should keep the same indentation level by default', function () {
      var indentUnit = 2;
      var editor     = getEditor(codeMirror,
        [
          'title: hello',
          'version: v1.0',
          'baseUri: http://example.com/api',
          '/tags:',
          '  displayName: Tags'
        ],
        { line: 4, ch: 19},
        { indentUnit: indentUnit }
      );

      editor.fakeKey('Enter');
      editor.getLine(5).should.be.equal(sp(indentUnit));
    });

    it('should keep the same indentation level for elements without children', function () {
      var indentUnit = 2;
      var editor     = getEditor(codeMirror,
        [
          'title: hello',
          'version: v1.0',
          'baseUri: http://example.com/api',
          '/tags:'
        ],
        { line: 3, ch: 6 },
        { indentUnit: indentUnit }
      );

      editor.fakeKey('Enter');
      editor.getLine(4).should.be.equal('');
    });

    it('should add one indentation level if the current line has children', function () {
      var indentUnit = 2;
      var editor     = getEditor(codeMirror,
        [
          'title: Test',
          'baseUri: http://www.api.com/{version}/{company}',
          'version: v1.1',
          '/tags:',
          '  name: Tags',
          '  description: This is a description of tags',
          '  get:', // <--
          '    summary: Get a list of recently tagged media',
          '    description: This is a description of getting tags',
        ],
        { line: 6, ch: 666 },
        { indentUnit: indentUnit }
      );

      editor.fakeKey('Enter');
      editor.getLine(7).should.be.equal(sp(indentUnit * 2));
    });

    it('should add another indentation if the current line has a continuation character ("|") and has one indent', function () {
      var indentUnit = 2;
      var editor     = getEditor(codeMirror,
        [
          'title: Test',
          'baseUri: http://www.api.com/{version}/{company}',
          'version: v1.1',
          '/tags:',
          '  ',
          '  name: Tags',
          '  description: |', // <--
          '  get:',
          '    summary: Get a list of recently tagged media',
          '    description: This is a description of getting tags',
        ],
        { line: 6, ch: 666 },
        { indentUnit: indentUnit }
      );

      editor.fakeKey('Enter');
      editor.getLine(7).should.be.equal(sp(indentUnit * 2));
    });

    it('should preserve the whitespace if the current line has a parent with continuation character ("|") and one indent', function () {
      var indentUnit = 2;
      var editor     = getEditor(codeMirror,
        [
          'title: Test',
          'baseUri: http://www.api.com/{version}/{company}',
          'version: v1.1',
          '/tags:',
          '  name: Tags',
          '  description: |',
          '    Here be dragons', // <--
          '  get:',
          '    summary: Get a list of recently tagged media',
          '    description: This is a description of getting tags',
        ],
        { line: 6, ch: 666 },
        { indentUnit: indentUnit }
      );

      editor.fakeKey('Enter');
      editor.getLine(7).should.be.equal(sp(indentUnit * 2));
    });

    it('should add another indentation if the current line has a continuation character ("|") and has two indents', function () {
      var indentUnit = 2;
      var editor     = getEditor(codeMirror,
        [
          'title: Test',
          'baseUri: http://www.api.com/{version}/{company}',
          'version: v1.1',
          '/tags:',
          '  ',
          '  name: Tags',
          '  description: This is the description of the tag',
          '  get:',
          '    summary: Get a list of recently tagged media',
          '    description: |', // <--
        ],
        { line: 9, ch: 666 },
        { indentUnit: indentUnit }
      );

      editor.fakeKey('Enter');
      editor.getLine(10).should.be.equal(sp(indentUnit * 3));
    });

    it('should keep the same indentation level if the current line is all tabs', function () {
      var indentUnit = 2;
      var editor     = getEditor(codeMirror,
        [
          'title: Test',
          'baseUri: http://www.api.com/{version}/{company}',
          'version: v1.1',
          '/tags:',
          '  ',
          '  name: Tags',
          '  description: This is a description of tags',
          '  get:',
          '    summary: Get a list of recently tagged media',
          '    description: This is a description of getting tags',
        ],
        { line: 4, ch: 2 },
        { indentUnit: indentUnit }
      );

      editor.fakeKey('Enter');
      editor.getLine(5).should.be.equal(sp(indentUnit));
    });

    it('should keep the same indentation level if the current line is all tabs, preserving any extra whitespace', function () {
      var indentUnit = 2;
      var editor     = getEditor(codeMirror,
        [
          'title: Test',
          'baseUri: http://www.api.com/{version}/{company}',
          'version: v1.1',
          '/tags:',
          '   ', // <--
          '  name: Tags',
          '  description: This is a description of tags',
          '  get:',
          '    summary: Get a list of recently tagged media',
          '    description: This is a description of getting tags'
        ],
        { line: 4, ch: 2 },
        { indentUnit: indentUnit }
      );

      editor.fakeKey('Enter');
      editor.getLine(5).should.be.equal(sp(4));
    });

    it('should add one indentation level if the cursor is in the middle of a sentence', function () {
      var indentUnit = 2;
      var editor     = getEditor(codeMirror,
        [
          'title: Test',
          'baseUri: http://www.api.com/{version}/{company}',
          'version: v1.1',
          '/tags:',
          '  name: Tags',
          '  description: This is a description of tags      with spaces in it', // <--
          '  get:',
          '    summary: Get a list of recently tagged media',
          '    description: This is a description of getting tags',
        ],
        { line: 5, ch: 46 },
        { indentUnit: indentUnit }
      );

      editor.fakeKey('Enter');
      editor.getLine(6).substr(0, indentUnit * 2).should.be.equal(sp(indentUnit * 2));
    });

    it('should keep the same indentation level if the cursor is in the middle of a sentence and not on the first line', function () {
      var indentUnit = 2;
      var editor     = getEditor(codeMirror,
        [
          'title: Test',
          'baseUri: http://www.api.com/{version}/{company}',
          'version: v1.1',
          '/tags:',
          '  name: Tags',
          '  description: This is a description of tags with spaces in it',
          '    but no in the first        line', // <--
          '  get:',
          '    summary: Get a list of recently tagged media',
          '    description: This is a description of getting tags',
        ],
        { line: 6, ch: 22 },
        { indentUnit: indentUnit }
      );

      editor.fakeKey('Enter');
      editor.getLine(7).substr(0, indentUnit * 2).should.be.equal(sp(indentUnit * 2));
    });

    it('should keep the same indentation level if the cursor is at the beginning of a sentence', function () {
      var indentUnit = 2;
      var editor     = getEditor(codeMirror,
        [
          'title: Test',
          'baseUri: http://www.api.com/{version}/{company}',
          'version: v1.1',
          '/tags:',
          '  name: Tags',
          '  description: This is a description of tags with spaces in it',
          '    but no in the first        line', // <--
          '  get:',
          '    summary: Get a list of recently tagged media',
          '    description: This is a description of getting tags'
        ],
        { line: 6, ch: 22 },
        { indentUnit: indentUnit }
      );

      editor.fakeKey('Enter');
      editor.getLine(7).substr(0, indentUnit * 2).should.be.equal(sp(indentUnit * 2));
    });

    it('should detect traits and add an extra indentation level', function () {
      var indentUnit = 2;
      var editor     = getEditor(codeMirror,
        [
          'title: Test',
          'baseUri: http://www.api.com/{version}/{company}',
          'version: v1.1',
          'traits:',
          '  - trait-one:',
          '  - trait-two:',
          '    trait-three:'
        ],
        { line: 4, ch: 666 },
        { indentUnit: indentUnit }
      );

      editor.fakeKey('Enter');
      editor.getLine(5).should.be.equal(sp(indentUnit * 3));

      editor.setCursor(5, 666);
      editor.fakeKey('Enter');
      editor.getLine(6).should.be.equal(sp(indentUnit * 3));

      editor.setCursor(6, 666);
      editor.fakeKey('Enter');
      editor.getLine(7).should.be.equal(sp(indentUnit * 3));
    });

    it('should detect resource types and add an extra indentation level', function () {
      var indentUnit = 2;
      var editor     = getEditor(codeMirror,
        [
          'title: Test',
          'baseUri: http://www.api.com/{version}/{company}',
          'version: v1.1',
          'resourceTypes:',
          '  - base:',
          '  - collection:',
          '    member:'
        ],
        { line: 4, ch: 666 },
        { indentUnit: indentUnit }
      );

      editor.fakeKey('Enter');
      editor.getLine(5).should.be.equal(sp(indentUnit * 3));
    });

    it('should detect arrays and add an extra indentation level', function () {
      var indentUnit = 2;
      var editor     = getEditor(codeMirror,
        [
          'title: Test',
          'baseUri: http://www.api.com/{version}/{company}',
          'version: v1.1',
          'documentation:',
          '  - title:'
        ],
        { line: 4, ch: 666 },
        { indentUnit: indentUnit }
      );

      editor.fakeKey('Enter');
      editor.getLine(5).should.be.equal(sp(indentUnit * 2));
    });

    it('should keep the same indentation level for sequence of entries with a little help', function () {
      var indentUnit = 2;
      var editor     = getEditor(codeMirror,
        [
          'key1:',
          '  - value1:',
          '  - value2:',
          '    value3:'
        ],
        {
          line: 2,
          ch:   null
        },
        {
          indentUnit: indentUnit
        }
      );

      editor.fakeKey('Enter');
      editor.getLine(3).should.be.equal(sp(indentUnit * 2));

      editor.setCursor(2, 666);
      editor.fakeKey('Enter');
      editor.getLine(3).should.be.equal(sp(indentUnit * 2));

      editor.setCursor(3, 666);
      editor.fakeKey('Enter');
      editor.getLine(3).should.be.equal(sp(indentUnit * 2));
    });

    it('should keep the same indentation level for document start marker (RT-156)', function () {
      var indentUnit = 2;
      var editor     = getEditor(codeMirror,
        [
          '---'
        ],
        {line: 0, ch: 3},
        {indentUnit: indentUnit}
      );

      editor.fakeKey('Enter');
      editor.getLine(1).should.be.equal('');
    });

    it('should keep the same indentation level and any extra whitespace for lines that are "rubbish"', function () {
      var indentUnit = 2;
      var editor     = getEditor(codeMirror,
        [
          'title: Test',
          'baseUri: http://www.api.com/{version}/{company}',
          'version: v1.1',
          '/tags:',
          '   this is rubbish',
          '  name: Tags',
          '  description: This is a description of tags',
          '  get:',
          '    summary: Get a list of recently tagged media',
          '    description: This is a description of getting tags'
        ],
        {line: 4, ch: 2},
        {indentUnit: indentUnit}
      );

      editor.fakeKey('Enter');
      editor.getLine(5).substr(0, 3).should.be.equal(sp(3));
    });

    it('keeps indentation level after the enter key is pressed at the start of the line', function () {
      var indentUnit = 2;
      var editor     = getEditor(codeMirror,
        [
          '#%RAML 0.8',
          'title: Test'
        ],
        {line: 1, ch: 0},
        {indentUnit: indentUnit}
      );

      editor.fakeKey('Enter');
      editor.getLine(1).should.be.equal('');
      editor.getLine(2).should.be.equal('title: Test');
    });

    it('keeps indentation level (with children) after the enter key is pressed at the start of the line', function () {
      var indentUnit = 2;
      var editor     = getEditor(codeMirror,
        [
          '#%RAML 0.8',
          'title: Test',
          '/resource:',
          '  get:'
        ],
        {line: 2, ch: 0},
        {indentUnit: indentUnit}
      );

      editor.fakeKey('Enter');
      editor.getLine(2).should.be.equal('');
      editor.getLine(3).should.be.equal('/resource:');
    });
  });
});
