'use strict';

var codeMirrorService, editor;

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
    it('should keep the same indentation level by default', function (){
      var indentUnit = 2;
      editor = getEditor(
        'title: hello\n' +
        'version: v1.0\n' +
        'baseUri: http://example.com/api\n' +
        '/tags:\n' +
        '  displayName: Tags',
        { line: 4, ch: 19},
        { indentUnit: indentUnit });

      codeMirrorService.enterKey(editor);
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

      codeMirrorService.enterKey(editor);
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

      codeMirrorService.enterKey(editor);
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

      codeMirrorService.enterKey(editor);
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

      codeMirrorService.enterKey(editor);
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

      codeMirrorService.enterKey(editor);
      editor.spacesToInsert.should.be.equal('\n' + sp(indentUnit * 3));
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
      editor.spacesToInsert.should.be.equal('\n' + sp(indentUnit));
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
      editor.spacesToInsert.should.be.equal('\n' + sp(3));
    });

    it('should add one indentation level if the cursor is in the middle of a sentence.', function (){
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

      codeMirrorService.enterKey(editor);
      editor.spacesToInsert.should.be.equal('\n' + sp(indentUnit * 2));
    });

    it('should keep the same indentation level if the cursor is in the middle of a sentence and not on the first line.', function (){
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

      codeMirrorService.enterKey(editor);
      editor.spacesToInsert.should.be.equal('\n' + sp(indentUnit * 2));
    });

    if('should keep the same indentation level if the cursor is at the beginning of a sentence', function (){
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

      codeMirrorService.enterKey(editor);
      editor.spacesToInsert.should.be.equal('\n' + sp(indentUnit * 2));
    });

    it('should detect traits and add an extra indentation level', function (){
      var indentUnit = 2;
      editor = getEditor(
        'title: Test\n' +
        'baseUri: http://www.api.com/{version}/{company}\n' +
        'version: v1.1\n' +
        'traits:\n' +
        '  - trait-one:\n' +
        '  - trait-two:\n' +
        '    trait-three:\n' +
        '  name: Tags\n' +
        '  description: This is a description of tags\n' +
        '  get:\n' +
        '    summary: Get a list of recently tagged media\n' +
        '    description: This is a description of getting tags',
        { line: 4, ch: 13 },
        { indentUnit: indentUnit });

      codeMirrorService.enterKey(editor);
      editor.spacesToInsert.should.be.equal('\n' + sp(indentUnit * 3));

      editor.setCursor(6, 15);
      editor.spacesToInsert.should.be.equal('\n' + sp(indentUnit * 3));
    });

    it.skip('should use a mocked ramHint service', inject(function () {
    }));

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
      editor.spacesToInsert.should.be.equal('\n' + sp(3));
    });
  });

  describe('code folding', function () {
    it('should detect fold ranges of only one line', function (){
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
        '  post:\n' +
        '    summary: Create a new tagged media\n' +
        '    description: This is a description of creating tags',
        { line: 6, ch: 0 },
        { indentUnit: indentUnit });

      var foldRange = codeMirrorService.getFoldRange(editor, { line: 6 });
      foldRange.should.deep.equal({ from: { line: 6, ch: 6 }, to: { line: 7, ch: 48} });
    });

    it('should detect fold range for root nodes', function () {
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
        '    description: This is a description of getting tags\n' +
        '  post:\n' +
        '    summary: Create a new tagged media\n' +
        '    description: This is a description of creating tags',
        { line: 6, ch: 0 },
        { indentUnit: indentUnit });

      var foldRange = codeMirrorService.getFoldRange(editor, { line: 3 });
      foldRange.should.deep.equal({ from: { line: 3, ch: 6 }, to: { line: 11, ch: 55} });
    });

    it('should detect fold range for first level nodes', function () {
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
        '    description: This is a description of getting tags\n' +
        '  post:\n' +
        '    summary: Create a new tagged media\n' +
        '    description: This is a description of creating tags',
        { line: 6, ch: 0 },
        { indentUnit: indentUnit });

      var foldRange = codeMirrorService.getFoldRange(editor, { line: 6 });
      foldRange.should.deep.equal({ from: { line: 6, ch: 6 }, to: { line: 8, ch: 54} });

      foldRange = codeMirrorService.getFoldRange(editor, { line: 9 });
      foldRange.should.deep.equal({ from: { line: 9, ch: 7 }, to: { line: 11, ch: 55} });
    });

    it('should detect fold ranges for elements with children with more than one indentation level (traits, resourceTypes, etc)', function () {
      var indentUnit = 2;
      editor = getEditor(
        '#%RAML 0.2\n' +
        '---\n' +
        'title: Example API\n' +
        'baseUri: http://localhost:3000/api/{company}/\n' +
        'version: 1.0\n' +
        'traits:\n' +
        '  - secured:\n' +
        '      displayName: Secured\n' +
        '      securitySchemes:',
        { line: 7, ch: 0 },
        { indentUnit: indentUnit });

      var foldRange = codeMirrorService.getFoldRange(editor, { line: 6 });
      foldRange.should.deep.equal({ from: { line: 6, ch: 12 }, to: { line: 8, ch: 22} });
    });

    it('should not detect ranges for empty lines', function (){
      var indentUnit = 2;
      editor = getEditor(
        'title: Test\n' +
        'baseUri: http://www.api.com/{version}/{company}\n' +
        'version: v1.1\n' +
        'documentation:\n' +
        ' - title: this is the title\n' +
        '   content: |\n' +
        '     this is some content\n' +
        '     with multiple lines\n' +
        '     with the same indentations\n' +
        '     that should be ignored\n' +
        '\n' +
        '       empty lines to\n' +
        '/tags:\n' +
        '  name: Tags\n' +
        '  description: This is a description of tags\n' +
        '  get:\n' +
        '    summary: Get a list of recently tagged media\n' +
        '    description: This is a description of getting tags\n' +
        '  post:\n' +
        '    summary: Create a new tagged media\n' +
        '    description: This is a description of creating tags',
        { line: 0, ch: 0 },
        { indentUnit: indentUnit });

      var foldRange = codeMirrorService.getFoldRange(editor, { line: 10 });
      should.equal(foldRange, undefined);
    });

    it('should not detect ranges inside content blocks', function () {
      var indentUnit = 2;
      editor = getEditor(
        'title: Test\n' +
        'baseUri: http://www.api.com/{version}/{company}\n' +
        'version: v1.1\n' +
        'documentation:\n' +
        ' - title: this is the title\n' +
        '   content: |\n' +
        '     this is some content\n' +
        '     with multiple lines\n' +
        '     with the same indentation\n' +
        '     that should be ignored\n' +
        '     \n' +
        '     empty lines to\n' +
        '/tags:\n' +
        '  name: Tags\n' +
        '  description: This is a description of tags\n' +
        '  get:\n' +
        '    summary: Get a list of recently tagged media\n' +
        '    description: This is a description of getting tags\n' +
        '  post:\n' +
        '    summary: Create a new tagged media\n' +
        '    description: This is a description of creating tags',
        { line: 0, ch: 0 },
        { indentUnit: indentUnit });

      var foldRange = codeMirrorService.getFoldRange(editor, { line: 7 });
      should.equal(foldRange, undefined);
    });

    it('should not detect ranges for items with more than one indentation level and no children (traits, resourceTypes, etc)', function (){
      var indentUnit = 2;
      editor = getEditor(
        '#%RAML 0.2\n' +
        '---\n' +
        'title: Example API\n' +
        'baseUri: http://localhost:3000/api/{company}/\n' +
        'version: 1.0\n' +
        'traits:\n' +
        '  - secured:\n' +
        '      displayName: Secured\n' +
        '      securitySchemes:',
        { line: 7, ch: 0 },
        { indentUnit: indentUnit });

      var foldRange = codeMirrorService.getFoldRange(editor, { line: 7 });
      should.equal(foldRange, undefined);
    });

    it('should ignore empty lines inside content blocks', function () {
      var indentUnit = 2;
      editor = getEditor(
        'title: Test\n' +
        'baseUri: http://www.api.com/{version}/{company}\n' +
        'version: v1.1\n' +
        'documentation:\n' +
        ' - title: this is the title\n' +
        '   content: |\n' +
        '     this is some content\n' +
        '     with multiple lines\n' +
        '     with the same indentations\n' +
        '     that should be ignored\n' +
        '\n' +
        '     empty lines to\n' +
        '     as long as they are inside a content element\n' +
        '/tags:\n' +
        '  name: Tags\n' +
        '  description: This is a description of tags\n' +
        '  get:\n' +
        '    summary: Get a list of recently tagged media\n' +
        '    description: This is a description of getting tags\n' +
        '  post:\n' +
        '    summary: Create a new tagged media\n' +
        '    description: This is a description of creating tags',
        { line: 0, ch: 0 },
        { indentUnit: indentUnit });

      var foldRange = codeMirrorService.getFoldRange(editor, { line: 5 });
      foldRange.should.deep.equal({ from: { line: 5, ch: 13 }, to: { line: 12, ch: 49} });
    });

    it('should not detect ranges inside schema or examples', function (){
      var indentUnit = 2;
      editor = getEditor(
        'title: Test\n' +
        'baseUri: http://www.api.com/{version}/{company}\n' +
        'version: v1.1\n' +
        '/tags:\n' +
        '  displayName: Tags\n' +
        '  get:\n' +
        '    body:\n' +
        '      application/json:\n' +
        '        schema: |\n' +
        '          {\n' +
        '            "$schema": "http://json-schema.org/draft-03/schema",\n' +
        '            "properties": {\n' +
        '            "input": {\n' +
        '              "required": false,\n' +
        '                "type": "string"\n' +
        '            }\n' +
        '          },\n' +
        '            "required": false,\n' +
        '            "type": "object"\n' +
        '          }\n' +
        '        example: |\n' +
        '          [\n' +
        '            {\n' +
        '              "name": "job name"\n' +
        '              "description": "job description"\n' +
        '            },\n' +
        '            {\n' +
        '              "name": "job name"\n' +
        '              "description": "job description"\n' +
        '            }\n' +
        '          ]\n',
        { line: 0, ch: 0 },
        { indentUnit: indentUnit });

      var foldRange = codeMirrorService.getFoldRange(editor, { line: 9 });
      should.equal(foldRange, undefined);

      foldRange = codeMirrorService.getFoldRange(editor, { line: 12 });
      should.equal(foldRange, undefined);

      foldRange = codeMirrorService.getFoldRange(editor, { line: 21 });
      should.equal(foldRange, undefined);
    });
  });
});
