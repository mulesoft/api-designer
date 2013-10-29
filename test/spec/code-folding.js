'use strict';

describe('code folding', function () {
  var getFoldRange, getParentLine, editor;

  beforeEach(module('codeFolding'));

  beforeEach(inject(function (_getFoldRange_, _getParentLine_) {
    getFoldRange = _getFoldRange_;
    getParentLine = _getParentLine_;
  }));

  describe('document traversing', function (){
    it('should detect parent correctly for trait items with and without dash', function (){
      var indentUnit = 2;
      editor = getEditor(
        'title: document transversing\n' +
        'traits:\n' +
        '  - trait-one:\n' +
        '  - trait-two:\n' +
        '    trait-three:',
        {line: 0, ch: 0},
        { indentUnit: indentUnit });

      var parentLine = getParentLine(editor, 2, 1);
      parentLine.should.equal('traits:');

      var parentLine = getParentLine(editor, 3, 1);
      parentLine.should.equal('traits:');

      var parentLine = getParentLine(editor, 4, 1);
      parentLine.should.equal('traits:');
    });

    it('should detect parent correctly for resourceType items with and without dash', function (){
      var indentUnit = 2;
      editor = getEditor(
        'title: document transversing\n' +
        'resourceTypes:\n' +
        '  - base:\n' +
        '  - image:\n' +
        '    video:',
        {line: 0, ch: 0},
        { indentUnit: indentUnit });

      var parentLine = getParentLine(editor, 2, 1);
      parentLine.should.equal('resourceTypes:');

      var parentLine = getParentLine(editor, 3, 1);
      parentLine.should.equal('resourceTypes:');

      var parentLine = getParentLine(editor, 4, 2);
      parentLine.should.equal('resourceTypes:');
    });

    it('should detect parent correctly for array items with and without dash', function (){
      var indentUnit = 2;
      editor = getEditor(
        'title: document transversing\n' +
        'key:\n' +
        '  - base:\n' +
        '  - image:\n' +
        '    video:',
        {line: 0, ch: 0},
        { indentUnit: indentUnit });

      var parentLine = getParentLine(editor, 2, 1);
      parentLine.should.equal('key:');

      var parentLine = getParentLine(editor, 3, 1);
      parentLine.should.equal('key:');

      var parentLine = getParentLine(editor, 4, 2);
      parentLine.should.equal('key:');
    });
  });

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

    var foldRange = getFoldRange(editor, { line: 6 });
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

    var foldRange = getFoldRange(editor, { line: 3 });
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

    var foldRange = getFoldRange(editor, { line: 6 });
    foldRange.should.deep.equal({ from: { line: 6, ch: 6 }, to: { line: 8, ch: 54} });

    foldRange = getFoldRange(editor, { line: 9 });
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

    var foldRange = getFoldRange(editor, { line: 6 });
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

    var foldRange = getFoldRange(editor, { line: 10 });
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

    var foldRange = getFoldRange(editor, { line: 7 });
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

    var foldRange = getFoldRange(editor, { line: 7 });
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

    var foldRange = getFoldRange(editor, { line: 5 });
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

    var foldRange = getFoldRange(editor, { line: 9 });
    should.equal(foldRange, undefined);

    foldRange = getFoldRange(editor, { line: 12 });
    should.equal(foldRange, undefined);

    foldRange = getFoldRange(editor, { line: 21 });
    should.equal(foldRange, undefined);
  });

  it('should not allow folding of scalars even when having spaces after it (RT-325)', function (){
    var indentUnit = 2;
    editor = getEditor([
      '#%RAML 0.8',
      '---',
      'title: Test',
      'resourceTypes:   ',
      '  - base:',
      '      is: [hola]',
      '      get:',
      'traits:',
      '  - hola:',
      '      displayName: HOL',
      '/tags:',
      '  type:',
      '    base:',
      '  displayName: Tags',
      '  get:'
      ].join('\n'),
      { line: 7, ch: 0 },
      { indentUnit: indentUnit });

    var foldRange = getFoldRange(editor, { line: 2 });
    should.not.exist(foldRange);
  });

  it('should fold spaces inside the last fold level (RT-113)', function (){
    var indentUnit = 2,
        foldRange;

    editor = getEditor([
      '#%RAML 0.8',
      '---',
      'title: Test',
      'resourceTypes:   ',
      '  - base:',
      '      is: [hola]',
      '      get:',
      'traits:',
      '  - hola:',
      '      displayName: HOL',
      '/tags:',
      '  /abc:',
      '    /cde:',
      '',
      '  ',
      '    ',
      '      ',
      '        ',
      '  '
      ].join('\n'),
      { line: 7, ch: 0 },
      { indentUnit: indentUnit });

    foldRange = getFoldRange(editor, { line: 11 });
    foldRange.should.deep.equal({ from: { line: 11, ch: 7 }, to: { line: 18, ch: 2} });

    foldRange = getFoldRange(editor, { line: 13 });
    should.not.exist(foldRange);
  });
  
  it('should ignore spaces and include them on the parent fold', function (){
    var indentUnit = 2,
        foldRange;

    editor = getEditor([
      '#%RAML 0.8',
      '---',
      'title: Test',
      'resourceTypes:   ',
      '  - base:',
      '      is: [hola]',
      '      get:',
      'traits:',
      '  - hola:',
      '      displayName: HOL',
      '/tags:',
      '  /abc:',
      '    /cde:',
      '',
      '  ',
      '    ',
      '      ',
      '        ',
      '  ',
      '/foo:',
      '  /bar:',
      '    /ggg:'
      ].join('\n'),
      { line: 7, ch: 0 },
      { indentUnit: indentUnit });

    foldRange = getFoldRange(editor, { line: 10 });
    foldRange.should.deep.equal({ from: { line: 10, ch: 6 }, to: { line: 18, ch: 2} });
    
    foldRange = getFoldRange(editor, { line: 19 });
    foldRange.should.deep.equal({ from: { line: 19, ch: 5 }, to: { line: 21, ch: 9} });

    foldRange = getFoldRange(editor, { line: 13 });
    should.not.exist(foldRange);
  });
});
