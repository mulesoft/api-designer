'use strict';

(function () {
  function Editor (text, cursor, options) {
    this.text         = text;
    this.cursor       = cursor  || {line: 0, ch: 0};
    this.options      = options || {indentUnit: 2};
    this.deleteOffset = 0;
  }

  Editor.prototype = {
    getCursor: function () {
      return this.cursor;
    },

    setCursor: function (line, ch) {
      this.cursor.line = line;
      this.cursor.ch   = ch;
    },

    getLine: function (line) {
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
    },

    replaceRange: function () {
      this.replaceRangeArguments = Array.prototype.slice.call(arguments, 0);
    },

    focus: function () {
    },

    getValue: function () {
      return this.text;
    },

    somethingSelected: function () {
      return false;
    },

    indentSelection: function () {
    }
  };

  window.getEditor = function (text, cursor, options) {
    return new Editor(text, cursor, options);
  };
}());
