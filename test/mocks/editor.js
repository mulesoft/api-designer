'use strict';

/* exported getEditor */

/* Generator of mock editor */
(function () {
  function Editor (text, cursor, options) {
    this.text = text;
    this.cursor = cursor || {line: 0, ch: 0};
    this.options = options || [];

    this.deleteOffset = 0;
  }

  Editor.prototype = {
    getCursor: function () {
      return this.cursor;
    },
    setCursor: function (line, character) {
      this.cursor.line = line;
      this.cursor.ch = character;
    },
    getLine: function (line) {
      //console.log(line, this.text.split('\n')[line]);
      return this.text.split('\n')[line];
    },
    lineCount: function () {
      return this.text.split('\n').length;
    },
    replaceSelection: function (spaces) {
      this.spacesToInsert = spaces;
    },
    getOption: function (key) {
      return this.options[key];
    },
    deleteH: function (offset, range) {
      range.should.be.equal('char');
      this.deleteOffset += offset;
    }
  };

  window.getEditor = function (text, cursor, options) {
    return new Editor(text, cursor, options);
  };

}());
