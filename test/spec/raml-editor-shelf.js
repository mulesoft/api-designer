'use strict';

describe('Shelf controller', function () {
  var applySuggestion;

  beforeEach(module('ramlEditorApp'));
  beforeEach(inject(function ($injector) {
    applySuggestion = $injector.get('applySuggestion');
  }));

  describe('applySuggestion', function () {
    it('should insert snippet at right place when cursor is in one-key mapping', function () {
      var editor = getEditor(
        [
          'traits:',            //
          '  - hola:',          //
          '      displayName:'  // <--
        ].join('\n'),
        {
          line: 2,
          ch: 6
        }
      );

      applySuggestion(editor, {name: 'description'});
      editor.replaceRangeArguments[0].should.be.equal('      description:\n');
    });

    it('should insert suggestion in the cursor position on empty line', function () {
      var editor = getEditor(
        [
          'traits:',              //
          '  - hola:',            //
          '      displayName:',   //
          '             '         // <--
        ].join('\n'),
        {
          line: 3,
          ch: 6
        }
      );

      applySuggestion(editor, {name: 'description'});
      editor.replaceRangeArguments[0].should.be.equal('      description:');
    });

    it('should not insert suggestion in the cursor position on non-empty line', function () {
      var editor = getEditor(
        [
          'traits:',             //
          '  - hola:',           //
          '      displayName:'   // <--
        ].join('\n'),
        {
          line: 2,
          ch: 0
        }
      );

      applySuggestion(editor, {name: 'description'});
      editor.replaceRangeArguments[0].should.be.equal('      description:\n');
    });
  });
});
