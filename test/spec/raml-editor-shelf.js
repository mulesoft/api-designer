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
          '  - hola:',
          '      displayName:' // <--
        ],
        {
          line: 2,
          ch:   6
        }
      );

      applySuggestion(editor, {name: 'description'});
      editor.getLine(3).should.be.equal('      description:');
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
  });
});
