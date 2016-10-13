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

  describe('errors', function () {

    var codeMirrorErrors;

    beforeEach(inject(function ($injector) {
      codeMirrorErrors = $injector.get('codeMirrorErrors');
    }));

    it('should show errors', function () {
      var editor = getEditor(codeMirror,
        [
          'title: hello',
          'version: v1.0',
          'baseUri: http://example.com/api'
        ].join('\n'),
        {line: 3, ch: 0},
        {indentUnit: 7}
      );

      should.not.exist(editor.lineInfo(0).gutterMarkers);
      should.not.exist(editor.lineInfo(1).gutterMarkers);
      should.not.exist(editor.lineInfo(2).gutterMarkers);

      codeMirrorErrors.displayAnnotations([
        {severity:'error', message: 'error msg', line: 1},
        {severity:'warning', message: 'warning msg', line: 2}
        ], editor);

      should.exist(editor.lineInfo(0).gutterMarkers);
      should.exist(editor.lineInfo(1).gutterMarkers);
      should.not.exist(editor.lineInfo(2).gutterMarkers);
    });
  });

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
          'lala'
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

    it('should delete one space before cursor', function () {
      var indentUnit = 2;
      var editor     = getEditor(codeMirror,
        [
          'title: hello '
        ],
        {line: 0, ch: 666},
        {indentUnit: indentUnit}
      );

      editor.fakeKey('Backspace');
      editor.getLine(0).should.be.equal('title: hello');
    });

    it('should delete tab before cursor', function () {
      var indentUnit = 2;
      var editor     = getEditor(codeMirror,
        [
          'title: hello',
          sp(indentUnit * 2)
        ],
        {line: 1, ch: 666},
        {indentUnit: indentUnit}
      );

      editor.fakeKey('Backspace');
      editor.getLine(1).should.be.equal('  ');
    });

    it('should delete tab before cursor with other characters before tab', function () {
      var indentUnit = 2;
      var editor     = getEditor(codeMirror,
        [
          'title: hello  '
        ],
        {line: 0, ch: 666},
        {indentUnit: indentUnit}
      );

      editor.fakeKey('Backspace');
      editor.getLine(0).should.be.equal('title: hello');
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

    it('should delete one char if cursor at first column (even with tabs after)', function () {
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

    it('should delete one char with cursor at first column and tabs after', function () {
      var indentUnit = 2;
      var editor     = getEditor(codeMirror,
        [
          'title: hello',
          '   '
        ],
        {line: 1, ch: 1},
        {indentUnit: indentUnit}
      );

      editor.fakeKey('Backspace');
      editor.lineCount().should.be.equal(2);
      editor.getLine(1).should.be.equal('  ');
    });

    it('should delete one whitespace at cursor position when total number of whitespaces is not a multiple of indentUnit', function () {
      var indentUnit = 2;
      var editor     = getEditor(codeMirror,
        [
          '   '
        ],
        {line: 0, ch: 666},
        {indentUnit: indentUnit}
      );

      editor.fakeKey('Backspace');

      editor.lineCount().should.be.equal(1);
      editor.getLine(0).should.be.equal('  ');
    });
  });

  describe('enter key', function() {
    var editor;

    describe('in a line with no indentation or children', function() {
      beforeEach(function() {
        editor     = getEditor(codeMirror, ['version: v1.0']);
      });

      it('keeps indentation level when enter is pressed at the beginning of a line', function () {
        editor.setCursor(0, 0);
        editor.fakeKey('Enter');
        editor.getLine(0).should.be.equal('');
        editor.getLine(1).should.be.equal('version: v1.0');
      });

      it('keeps indentation level when enter is pressed in the middle of a line', function () {
        editor.setCursor(0, 3);
        editor.fakeKey('Enter');
        editor.getLine(0).should.be.equal('ver');
        editor.getLine(1).should.be.equal('sion: v1.0');
      });

      it('keeps indentation level when enter is pressed in the end of a line', function () {
        editor.setCursor(0, 666);
        editor.fakeKey('Enter');
        editor.getLine(0).should.be.equal('version: v1.0');
        editor.getLine(1).should.be.equal('');
      });
    });

    describe('in an indented line with no children', function() {
      beforeEach(function() {
        editor     = getEditor(codeMirror, ['  displayName: Tags']);
      });

      it('keeps indentation level when enter is pressed at the beginning of a line', function () {
        editor.setCursor(0, 0);
        editor.fakeKey('Enter');
        editor.getLine(0).should.be.equal('');
        editor.getLine(1).should.be.equal('  displayName: Tags');
      });

      it('keeps indentation level when enter is pressed in the middle of a line', function () {
        editor.setCursor(0, 2);
        editor.fakeKey('Enter');
        editor.getLine(0).should.be.equal('  ');
        editor.getLine(1).should.be.equal('  displayName: Tags');
      });

      it('keeps indentation level when enter is pressed in the end of a line', function () {
        editor.setCursor(0, 666);
        editor.fakeKey('Enter');
        editor.getLine(0).should.be.equal('  displayName: Tags');
        editor.getLine(1).should.be.equal('  ');
      });
    });

    describe('in a line with children', function() {
      beforeEach(function() {
        editor     = getEditor(codeMirror, ['/tags:', '  displayName: Tags']);
      });

      it('keeps indentation level when enter is pressed at the beginning of a line', function () {
        editor.setCursor(0, 0);
        editor.fakeKey('Enter');
        editor.getLine(0).should.be.equal('');
        editor.getLine(1).should.be.equal('/tags:');
      });

      it('keeps indentation level when enter is pressed in the middle of a line', function () {
        editor.setCursor(0, 2);
        editor.fakeKey('Enter');
        editor.getLine(0).should.be.equal('/t');
        editor.getLine(1).should.be.equal('ags:');
      });

      it('indents a new child when enter is pressed at the end of the line', function () {
        editor.setCursor(0, 666);
        editor.fakeKey('Enter');
        editor.getLine(0).should.be.equal('/tags:');
        editor.getLine(1).should.be.equal('  ');
      });
    });

    describe('in a line that ends with the pipe character', function() {
      beforeEach(function() {
        editor     = getEditor(codeMirror, ['schema: |']);
      });

      it('keeps indentation level when enter is pressed at the beginning of a line', function () {
        editor.setCursor(0, 0);
        editor.fakeKey('Enter');
        editor.getLine(0).should.be.equal('');
        editor.getLine(1).should.be.equal('schema: |');
      });

      it('keeps indentation level when enter is pressed in the middle of a line', function () {
        editor.setCursor(0, 2);
        editor.fakeKey('Enter');
        editor.getLine(0).should.be.equal('sc');
        editor.getLine(1).should.be.equal('hema: |');
      });

      it('indents a new child when enter is pressed at the end of the line', function () {
        editor.setCursor(0, 666);
        editor.fakeKey('Enter');
        editor.getLine(0).should.be.equal('schema: |');
        editor.getLine(1).should.be.equal('  ');
      });
    });

    describe('in a line with a dictionary value', function() {
      beforeEach(function() {
        editor    = getEditor(codeMirror, ['description: a long description']);
      });

      it('keeps indentation level when enter is pressed at the beginning of a line', function () {
        editor.setCursor(0, 0);
        editor.fakeKey('Enter');
        editor.getLine(0).should.be.equal('');
        editor.getLine(1).should.be.equal('description: a long description');
      });

      it('keeps indentation level when enter is inside the key', function () {
        editor.setCursor(0, 10);
        editor.fakeKey('Enter');
        editor.getLine(0).should.be.equal('descriptio');
        editor.getLine(1).should.be.equal('n: a long description');
      });

      // new feature suggestion
      xit('indents when enter is pressed inside the value', function() {
        editor.setCursor(0, 12);
        editor.fakeKey('Enter');
        editor.getLine(0).should.be.equal('description:');
        editor.getLine(1).should.be.equal('   a long description');
      });
    });

    ['traits', 'resourceTypes'].forEach(function(key) {
      describe('immediately inside of a ' + key + ' array', function() {
        beforeEach(function() {
          editor    = getEditor(codeMirror, [key + ':', '  - myThing:']);
        });

        it('keeps indentation level when enter is pressed at the beginning of a line', function () {
          editor.setCursor(1, 0);
          editor.fakeKey('Enter');
          editor.getLine(1).should.be.equal('');
          editor.getLine(2).should.be.equal('  - myThing:');
        });

        it('adds one indentation level when enter in the middle of the line', function () {
          editor.setCursor(1, 6);
          editor.fakeKey('Enter');
          editor.getLine(1).should.be.equal('  - my');
          editor.getLine(2).should.be.equal('    Thing:');
        });

        it('indents twice at the end of the line', function() {
          editor.setCursor(1, 666);
          editor.fakeKey('Enter');
          editor.getLine(1).should.be.equal('  - myThing:');
          editor.getLine(2).should.be.equal('      ');
        });
      });
    });

    describe('within an array not inside resourceTypes or traits', function() {
      beforeEach(function() {
        editor = getEditor(codeMirror, ['- myKey:']);
      });

      it('keeps indentation level when enter is pressed at the beginning of a line', function () {
        editor.setCursor(0, 0);
        editor.fakeKey('Enter');
        editor.getLine(0).should.be.equal('');
        editor.getLine(1).should.be.equal('- myKey:');
      });

      it('keeps indentation level when enter in the middle of the line', function () {
        editor.setCursor(0, 4);
        editor.fakeKey('Enter');
        editor.getLine(0).should.be.equal('- my');
        editor.getLine(1).should.be.equal('  Key:');
      });

      it('indents once at the end of the line', function() {
        editor.setCursor(0, 666);
        editor.fakeKey('Enter');
        editor.getLine(0).should.be.equal('- myKey:');
        editor.getLine(1).should.be.equal('  ');
      });
    });
  });
});
