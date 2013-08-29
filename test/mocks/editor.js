/* Generator of mock editor */
(function () {
  var Editor = function (text, cursor, options) {
    this.text = text;
    this.cursor = cursor || {line: 0, ch: 0};
    this.options = options || [];
  };
  
  Editor.prototype = {
    getCursor: function () {
      return this.cursor;
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
      (range).should.be.equal('char');
      this.deleteOffset = offset;
    }
  };
  
  window.getEditor = function (text, cursor, options) {
    return new Editor(text, cursor, options);
  };
  
}());
