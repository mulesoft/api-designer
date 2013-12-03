'use strict';

(function () {
  var keyNamesToKeyCodes = {};
  Object.keys(CodeMirror.keyNames).forEach(function (key) {
    keyNamesToKeyCodes[CodeMirror.keyNames[key]] = key;
  });

  window.getEditor = function (codeMirrorService, value, cursor, options) {
    var el = document.createElement('div');
    var cm = codeMirrorService.createEditor(el, options);

    if (value) {
      if (Array.isArray(value)) {
        value = value.join('\n');
      }
      cm.setValue(value);
    }

    if (cursor) {
      cm.setCursor(cursor);
    }

    cm.fakeKey = function fakeKey(keyName, options) {
      var e = {
        type:            'keydown',
        keyCode:         keyNamesToKeyCodes[keyName],
        preventDefault:  function () {},
        stopPropagation: function () {}
      };

      if (options) {
        Object.keys(options, function (key) {
          e[key] = options[key];
        });
      }

      this.triggerOnKeyDown(e);
    };

    return cm;
  };
}());
