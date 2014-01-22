'use strict';

describe('code folding', function () {
  var codeMirror;
  var getFoldRange;

  beforeEach(module('codeMirror'));
  beforeEach(module('codeFolding'));

  beforeEach(inject(function ($injector) {
    codeMirror   = $injector.get('codeMirror');
    getFoldRange = $injector.get('getFoldRange');
  }));

  it('should detect fold ranges of only one line', function () {
    var indentUnit = 2;
    var editor     = getEditor(codeMirror,
      [
        'title: Test',
        'baseUri: http://www.api.com/{version}/{company}',
        'version: v1.1',
        '/tags:',
        '  name: Tags',
        '  description: This is a description of tags',
        '  get:',
        '    summary: Get a list of recently tagged media',
        '  post:',
        '    summary: Create a new tagged media',
        '    description: This is a description of creating tags',
      ],
      { line: 6, ch: 0 },
      { indentUnit: indentUnit }
    );

    var foldRange = getFoldRange(editor, { line: 6 });
    foldRange.should.deep.equal({ from: { line: 6, ch: 6 }, to: { line: 7, ch: 48} });
  });

  it('should detect fold range for root nodes', function () {
    var indentUnit = 2;
    var editor     = getEditor(codeMirror,
      [
        'title: Test',
        'baseUri: http://www.api.com/{version}/{company}',
        'version: v1.1',
        '/tags:',
        '  name: Tags',
        '  description: This is a description of tags',
        '  get:',
        '    summary: Get a list of recently tagged media',
        '    description: This is a description of getting tags',
        '  post:',
        '    summary: Create a new tagged media',
        '    description: This is a description of creating tags',
      ],
      { line: 6, ch: 0 },
      { indentUnit: indentUnit }
    );

    var foldRange = getFoldRange(editor, { line: 3 });
    foldRange.should.deep.equal({ from: { line: 3, ch: 6 }, to: { line: 11, ch: 55} });
  });

  it('should detect fold range for first level nodes', function () {
    var indentUnit = 2;
    var editor     = getEditor(codeMirror,
      [
        'title: Test',
        'baseUri: http://www.api.com/{version}/{company}',
        'version: v1.1',
        '/tags:',
        '  name: Tags',
        '  description: This is a description of tags',
        '  get:',
        '    summary: Get a list of recently tagged media',
        '    description: This is a description of getting tags',
        '  post:',
        '    summary: Create a new tagged media',
        '    description: This is a description of creating tags',
      ],
      { line: 6, ch: 0 },
      { indentUnit: indentUnit }
    );

    var foldRange = getFoldRange(editor, { line: 6 });
    foldRange.should.deep.equal({ from: { line: 6, ch: 6 }, to: { line: 8, ch: 54} });

    foldRange = getFoldRange(editor, { line: 9 });
    foldRange.should.deep.equal({ from: { line: 9, ch: 7 }, to: { line: 11, ch: 55} });
  });

  it('should detect fold ranges for elements with children with more than one indentation level (traits, resourceTypes, etc)', function () {
    var indentUnit = 2;
    var editor     = getEditor(codeMirror,
      [
        '#%RAML 0.2',
        '---',
        'title: Example API',
        'baseUri: http://localhost:3000/api/{company}/',
        'version: 1.0',
        'traits:',
        '  - secured:',
        '      displayName: Secured',
        '      securitySchemes:',
      ],
      { line: 7, ch: 0 },
      { indentUnit: indentUnit }
    );

    var foldRange = getFoldRange(editor, { line: 6 });
    foldRange.should.deep.equal({ from: { line: 6, ch: 12 }, to: { line: 8, ch: 22} });
  });

  it('should not detect ranges for empty lines', function (){
    var indentUnit = 2;
    var editor     = getEditor(codeMirror,
      [
        'title: Test',
        'baseUri: http://www.api.com/{version}/{company}',
        'version: v1.1',
        'documentation:',
        ' - title: this is the title',
        '   content: |',
        '     this is some content',
        '     with multiple lines',
        '     with the same indentations',
        '     that should be ignored',
        '',
        '       empty lines to',
        '/tags:',
        '  name: Tags',
        '  description: This is a description of tags',
        '  get:',
        '    summary: Get a list of recently tagged media',
        '    description: This is a description of getting tags',
        '  post:',
        '    summary: Create a new tagged media',
        '    description: This is a description of creating tags',
      ],
      { line: 0, ch: 0 },
      { indentUnit: indentUnit }
    );

    var foldRange = getFoldRange(editor, { line: 10 });
    should.equal(foldRange, undefined);
  });

  it('should not detect ranges inside content blocks', function () {
    var indentUnit = 2;
    var editor     = getEditor(codeMirror,
      [
        'title: Test',
        'baseUri: http://www.api.com/{version}/{company}',
        'version: v1.1',
        'documentation:',
        ' - title: this is the title',
        '   content: |',
        '     this is some content',
        '     with multiple lines',
        '     with the same indentation',
        '     that should be ignored',
        '     ',
        '     empty lines to',
        '/tags:',
        '  name: Tags',
        '  description: This is a description of tags',
        '  get:',
        '    summary: Get a list of recently tagged media',
        '    description: This is a description of getting tags',
        '  post:',
        '    summary: Create a new tagged media',
        '    description: This is a description of creating tags',
      ],
      { line: 0, ch: 0 },
      { indentUnit: indentUnit }
    );

    var foldRange = getFoldRange(editor, { line: 7 });
    should.equal(foldRange, undefined);
  });

  it('should not detect ranges for items with more than one indentation level and no children (traits, resourceTypes, etc)', function (){
    var indentUnit = 2;
    var editor     = getEditor(codeMirror,
      [
        '#%RAML 0.2',
        '---',
        'title: Example API',
        'baseUri: http://localhost:3000/api/{company}/',
        'version: 1.0',
        'traits:',
        '  - secured:',
        '      displayName: Secured',
        '      securitySchemes:',
      ],
      { line: 7, ch: 0 },
      { indentUnit: indentUnit }
    );

    var foldRange = getFoldRange(editor, { line: 7 });
    should.equal(foldRange, undefined);
  });

  it('should ignore empty lines inside content blocks', function () {
    var indentUnit = 2;
    var editor     = getEditor(codeMirror,
      [
        'title: Test',
        'baseUri: http://www.api.com/{version}/{company}',
        'version: v1.1',
        'documentation:',
        ' - title: this is the title',
        '   content: |',
        '     this is some content',
        '     with multiple lines',
        '     with the same indentations',
        '     that should be ignored',
        '',
        '     empty lines to',
        '     as long as they are inside a content element',
        '/tags:',
        '  name: Tags',
        '  description: This is a description of tags',
        '  get:',
        '    summary: Get a list of recently tagged media',
        '    description: This is a description of getting tags',
        '  post:',
        '    summary: Create a new tagged media',
        '    description: This is a description of creating tags',
      ],
      { line: 0, ch: 0 },
      { indentUnit: indentUnit }
    );

    var foldRange = getFoldRange(editor, { line: 5 });
    foldRange.should.deep.equal({ from: { line: 5, ch: 13 }, to: { line: 12, ch: 49} });
  });

  it('should not allow folding of scalars even when having spaces after it (RT-325)', function (){
    var indentUnit = 2;
    var editor     = getEditor(codeMirror,
      [
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
      ],
      { line: 7, ch: 0 },
      { indentUnit: indentUnit }
    );

    var foldRange = getFoldRange(editor, { line: 2 });
    should.not.exist(foldRange);
  });

  it('should fold spaces inside the last fold level (RT-113)', function (){
    var foldRange;
    var indentUnit = 2;
    var editor     = getEditor(codeMirror,
      [
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
      ],
      { line: 7, ch: 0 },
      { indentUnit: indentUnit }
    );

    foldRange = getFoldRange(editor, { line: 11 });
    foldRange.should.deep.equal({ from: { line: 11, ch: 7 }, to: { line: 18, ch: 2} });

    foldRange = getFoldRange(editor, { line: 13 });
    should.not.exist(foldRange);
  });

  it('should ignore spaces and include them on the parent fold', function (){
    var foldRange;
    var indentUnit = 2;
    var editor     = getEditor(codeMirror,
      [
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
      ],
      { line: 7, ch: 0 },
      { indentUnit: indentUnit }
    );

    foldRange = getFoldRange(editor, { line: 10 });
    foldRange.should.deep.equal({ from: { line: 10, ch: 6 }, to: { line: 18, ch: 2} });

    foldRange = getFoldRange(editor, { line: 19 });
    foldRange.should.deep.equal({ from: { line: 19, ch: 5 }, to: { line: 21, ch: 9} });

    foldRange = getFoldRange(editor, { line: 13 });
    should.not.exist(foldRange);
  });
});
