'use strict';

describe('Shelf controller', function () {
  var codeMirror;
  var applySuggestion;

  beforeEach(module('ramlEditorApp'));
  beforeEach(inject(function ($injector) {
    codeMirror      = $injector.get('codeMirror');
    applySuggestion = $injector.get('applySuggestion');
  }));

  describe('updateSuggestions', function () {
    var updateSuggestions;

    beforeEach(inject(function ($injector) {
      updateSuggestions = $injector.get('updateSuggestions');
    }));

    it('should use a friendly title for <resource>', function () {
      var editor = getEditor(codeMirror,
        [
          '#%RAML 0.8',
          '',
        ],
        {
          line: 1,
          ch:   0
        }
      );

      var model = updateSuggestions(editor);

      var resourceSection = model.sections.filter(function(section) { return section.name === 'resources'; })[0];
      resourceSection.items.map(function (s) { return s.title; }).should.include('New Resource');
    });
  });

  describe('applySuggestion', function () {
    it('should not skip current empty line with whitespace-only lines after', function () {
      var editor = getEditor(codeMirror,
        [
          'title:',
          '',
          '  '
        ],
        {
          line: 1,
          ch:   0
        }
      );

      applySuggestion(editor, {key: 'description'});
      editor.getLine(1).should.be.equal('description:');
      editor.getCursor().line.should.be.equal(1);
    });

    it('should insert suggestion right after current property', function () {
      var editor = getEditor(codeMirror,
        [
          'traits:',
          '  - trait1:',
          '      displayName:',
          '  - trait2:',
          '      displayName:' // <--
        ],
        {
          line: 4,
          ch:   6
        }
      );

      applySuggestion(editor, {key: 'description'});
      editor.getLine(5).should.be.equal('      description:');
    });

    it('should insert suggestion right after current property following another', function () {
      var editor = getEditor(codeMirror,
        [
          'traits:',
          '  - hola:',
          '      displayName:', // <--
          '      usage:'
        ],
        {
          line: 2,
          ch:   6
        }
      );

      applySuggestion(editor, {key: 'description'});
      editor.getLine(3).should.be.equal('      description:');
    });

    it('should insert suggestion in the cursor position on empty line', function () {
      var editor = getEditor(codeMirror,
        [
          'traits:',
          '  - hola:',
          '      displayName:',
          '      '              // <--
        ],
        {
          line: 3,
          ch:   6
        }
      );

      applySuggestion(editor, {key: 'description'});
      editor.getLine(3).should.be.equal('      description:');
      editor.getCursor().line.should.be.equal(3);
    });

    it('should insert suggestion in the cursor position on empty line that follow another property', function () {
      var editor = getEditor(codeMirror,
        [
          'traits:',
          '  - hola:',
          '      displayName:',
          '      ',             // <--
          '      usage:'
        ],
        {
          line: 3,
          ch:   6
        }
      );

      applySuggestion(editor, {key: 'description'});
      editor.getLine(3).should.be.equal('      description:');
      editor.getCursor().line.should.be.equal(3);
    });

    it('should insert suggestion right after current property with another trait coming', function () {
      var editor = getEditor(codeMirror,
        [
          'traits:',
          '  - trait1:',
          '      displayName:', // <--
          '  - trait2:',
          '      displayName:'
        ],
        {
          line: 2,
          ch:   6
        }
      );

      applySuggestion(editor, {key: 'description'});
      editor.getLine(3).should.be.equal('      description:');
    });

    it('should insert suggestion right after current property skipping its sub-properties', function () {
      var editor = getEditor(codeMirror,
        [
          'traits:',
          '  - trait1:',
          '      queryParameters:', // <--
          '        param1:',
          '        param2:'
        ],
        {
          line: 2,
          ch:   6
        }
      );

      applySuggestion(editor, {key: 'description'});
      editor.getLine(5).should.be.equal('      description:');
    });

    it('should insert suggestion into current cursor position with an array above it', function () {
      var editor = getEditor(codeMirror,
        [
          'documentation:',
          '  - title: title',
          '    content: content',
          ''                      // <--
        ].join('\n'),
        {
          line: 3,
          ch:   0
        }
      );

      applySuggestion(editor, {key: 'schemas'});
      editor.getLine(3).should.be.equal('schemas:');
    });

    it('should insert suggestion into current cursor position without padding and newline #1', function () {
      var editor = getEditor(codeMirror,
        [
          'documentation:',
          '  - '            // <--
        ].join('\n'),
        {
          line: 1,
          ch:   4
        }
      );

      applySuggestion(editor, {key: 'title'});
      editor.getLine(1).should.be.equal('  - title: My API');
    });

    it('should insert suggestion into current cursor position without padding and newline #2', function () {
      var editor = getEditor(codeMirror,
        [
          'documentation:',
          '  -'             // <--
        ].join('\n'),
        {
          line: 1,
          ch:   4
        }
      );

      applySuggestion(editor, {key: 'title'});
      editor.getLine(1).should.be.equal('  - title: My API');
    });

    //region Unit tests for isList metadata validation on list child items of documentation element

    it ('should insert a documentation first child as a list item with a -', function () {
      var editor = createEditor(
        [
          'documentation:',
          '  '
        ]);

      applySuggestion(editor, {key: 'title', isList: true});
      editor.getLine(1).should.be.equal('  - title: My API');
    });

    it ('should not insert a documentation first child as a list item with a - is isList is false', function () {
      var editor = createEditor(
        [
          'documentation:',
          '  '
        ]);

      applySuggestion(editor, {key: 'title', isList: false });
      editor.getLine(1).should.be.equal('  title: My API');
    });

    it ('should insert a content node when cursor is at end of title array node', function () {
      var editor = createEditor(
        [
          'documentation:',
          '  - a: Hello'
        ]);

      applySuggestion(editor, {key: 'content', isList: true});
      editor.getLine(2).should.be.equal('    content:');
    });

    it ('should insert a documentation child at 1 tab over as array root', function () {
      var editor = createEditor(
        [
          'documentation:',
          '  - a: Hello',
          '  '
        ]);

      applySuggestion(editor, {key: 'b', isList: true});
      editor.getLine(2).should.be.equal('  - b:');
    });

    it ('should insert a documentation second child as a list item without a - when cursor is 2 tabs over', function () {
      var editor = createEditor(
        [
          'documentation:',
          '  - title: Hello',
          '    '
        ]);

      applySuggestion(editor, {key: 'content', isList: true});
      editor.getLine(2).should.be.equal('    content:');
    });

    it ('should insert a documentation third child as a list item with a -', function () {
      var editor = createEditor(
        [
          'documentation:',
          '  - a: Hello',
          '    b: World',
          '  '
        ]);

      applySuggestion(editor, {key: 'c', isList: true});
      editor.getLine(3).should.be.equal('  - c:');
    });

    it ('should insert a documentation third array child without a -', function () {
      var editor = createEditor(
        [
          'documentation:',
          '  - a: Hello',
          '    b: World',
          '    '
        ]);

      applySuggestion(editor, {key: 'c', isList: true});
      editor.getLine(3).should.be.equal('    c:');
    });

    it ('should insert a content element two array title starter elements when cursor is at end of line', function () {
      var editor = createEditor(
        [
          'documentation:',
          '  - title: Hello',
          '  - title: World',
          '  '
        ], 1);

      applySuggestion(editor, {key: 'content', isList: true});
      editor.getLine(1).should.be.equal('  - title: Hello');
      editor.getLine(2).should.be.equal('    content:');
      editor.getLine(3).should.be.equal('  - title: World');
    });

    //endregion
  });

  //--------- Utility functions

  /**
   *
   * @param Code to place in editor
   * @param Line on which to place the cursor, last line if not specified
   * @param Column on which to place the cursor, last column if not specified.
   * @returns {Object} CodeMirror Editor containing the given code with the
   * cursor placed at cursorLine, cursorColumn
   */
  function createEditor(linesArray, cursorLine, cursorColumn) {
    cursorLine   = arguments.length > 1 ? cursorLine   : linesArray.length - 1;
    cursorColumn = arguments.length > 2 ? cursorColumn : linesArray[cursorLine].length;
    return getEditor(codeMirror, linesArray.join('\n'), { line : cursorLine, ch: cursorColumn });
  }
});
