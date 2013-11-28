'use strict';

describe('Shelf controller', function () {
  var applySuggestion;

  beforeEach(module('ramlEditorApp'));
  beforeEach(inject(function ($injector) {
    applySuggestion = $injector.get('applySuggestion');
  }));

  describe('applySuggestion', function () {
    it('should insert suggestion into right position with arrays above', function () {
      var editor = getEditor(
        [
          'traits:',
          '  - trait1:',
          '      displayName:',
          '  - trait2:',
          '      displayName:' // <--
        ].join('\n'),
        {
          line: 4,
          ch:   6
        }
      );

      applySuggestion(editor, {name: 'description'});
      editor.replaceRangeArguments[0].should.be.equal('\n      description:');
      editor.replaceRangeArguments[1].should.be.deep.equal({
        line: 4,
        ch:   null
      });
    });

    it('should insert suggestion right after current property following another', function () {
      var editor = getEditor(
        [
          'traits:',
          '  - hola:',
          '      displayName:', // <--
          '      usage:'
        ].join('\n'),
        {
          line: 2,
          ch:   6
        }
      );

      applySuggestion(editor, {name: 'description'});
      editor.replaceRangeArguments[0].should.be.equal('\n      description:');
      editor.replaceRangeArguments[1].should.be.deep.equal({
        line: 2,
        ch:   null
      });
    });

    it('should insert suggestion in the cursor position on empty line', function () {
      var editor = getEditor(
        [
          'traits:',
          '  - hola:',
          '      displayName:',
          '      '              // <--
        ].join('\n'),
        {
          line: 3,
          ch:   6
        }
      );

      applySuggestion(editor, {name: 'description'});
      editor.replaceRangeArguments[0].should.be.equal('description:');
      editor.replaceRangeArguments[1].should.be.deep.equal({
        line: 3,
        ch:   6
      });
      editor.cursor.line.line.should.be.equal(3);
    });

    it('should insert suggestion in the cursor position on empty line with whitespace after cursor', function () {
      var editor = getEditor(
        [
          'traits:',
          '  - hola:',
          '      displayName:',
          '         '           // <--
        ].join('\n'),
        {
          line: 3,
          ch:   6
        }
      );

      applySuggestion(editor, {name: 'description'});
      editor.replaceRangeArguments[0].should.be.equal('description:');
      editor.replaceRangeArguments[1].should.be.deep.equal({
        line: 3,
        ch:   6
      });
      editor.cursor.line.line.should.be.equal(3);
    });

    it('should insert suggestion in the cursor position on empty line that follow another property', function () {
      var editor = getEditor(
        [
          'traits:',
          '  - hola:',
          '      displayName:',
          '      ',             // <--
          '      usage:'
        ].join('\n'),
        {
          line: 3,
          ch:   6
        }
      );

      applySuggestion(editor, {name: 'description'});
      editor.replaceRangeArguments[0].should.be.equal('description:');
      editor.replaceRangeArguments[1].should.be.deep.equal({
        line: 3,
        ch:   6
      });
      editor.cursor.line.line.should.be.equal(3);
    });

    it('should insert suggestion right after current property with another trait coming', function () {
      var editor = getEditor(
        [
          'traits:',
          '  - trait1:',
          '      displayName:', // <--
          '  - trait2:',
          '      displayName:',
        ].join('\n'),
        {
          line: 2,
          ch:   6
        }
      );

      applySuggestion(editor, {name: 'description'});
      editor.replaceRangeArguments[0].should.be.equal('\n      description:');
      editor.replaceRangeArguments[1].should.be.deep.equal({
        line: 2,
        ch:   null
      });
    });

    it('should insert suggestion right after current property skipping its sub-properties', function () {
      var editor = getEditor(
        [
          'traits:',
          '  - trait1:',
          '      queryParameters:', // <--
          '        param1:',
          '        param2:'
        ].join('\n'),
        {
          line: 2,
          ch:   6
        }
      );

      applySuggestion(editor, {name: 'description'});
      editor.replaceRangeArguments[0].should.be.equal('\n      description:');
      editor.replaceRangeArguments[1].should.be.deep.equal({
        line: 4,
        ch:   null
      });
    });

    it('should insert suggestion into current cursor position with an array above it', function () {
      var editor = getEditor(
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
      editor.replaceRangeArguments[0].should.be.equal('schemas:');
      editor.replaceRangeArguments[1].should.be.deep.equal({
        line: 3,
        ch:   0
      });
    });

    it('should insert suggestion into current cursor position without padding and newline #1', function () {
      var editor = getEditor(
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
      editor.replaceRangeArguments[0].should.be.equal(' title: My API');
      editor.replaceRangeArguments[1].should.be.deep.equal({
        line: 1,
        ch:   3
      });
    });

    it('should insert suggestion into current cursor position without padding and newline #2', function () {
      var editor = getEditor(
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
      editor.replaceRangeArguments[0].should.be.equal(' title: My API');
      editor.replaceRangeArguments[1].should.be.deep.equal({
        line: 1,
        ch:   3
      });
    });
  });
});
