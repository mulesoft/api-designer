'use strict';

describe('Shelf controller', function () {
  var codeMirror;
  var applySuggestion;

  beforeEach(module('ramlEditorApp'));
  beforeEach(inject(function ($injector) {
    codeMirror      = $injector.get('codeMirror');
    applySuggestion = $injector.get('applySuggestion');
  }));

  describe('applySuggestion', function () {
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

      applySuggestion(editor, {name: 'description'});
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

      applySuggestion(editor, {name: 'description'});
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

      applySuggestion(editor, {name: 'description'});
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

      applySuggestion(editor, {name: 'description'});
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
          '      displayName:',
        ],
        {
          line: 2,
          ch:   6
        }
      );

      applySuggestion(editor, {name: 'description'});
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

      applySuggestion(editor, {name: 'description'});
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

      applySuggestion(editor, {name: 'schemas'});
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

      applySuggestion(editor, {name: 'title'});
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

      applySuggestion(editor, {name: 'title'});
      editor.getLine(1).should.be.equal('  - title: My API');
    });
  });
});
