'use strict';

var codeMirrorService, editor;

var describe = window.describe, beforeEach = window.beforeEach,
  it = window.it;

window.getEditor = window.getEditor || {};


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
        {line: 3, ch: 0},
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
        {line: 3, ch: 0},
        {indentUnit: indentUnit});

      codeMirrorService.backspaceKey(editor);
      editor.deleteOffset.should.be.equal(-indentUnit);
    });
  });
});
