(function() {
  'use strict';

  window.events = {
    click: function() {
      var event = document.createEvent('MouseEvent');
      event.initMouseEvent(
          'click',
          true /* bubble */, true /* cancelable */,
          window, null,
          0, 0, 0, 0, /* coordinates */
          false, false, false, false, /* modifier keys */
          0 /*left*/, null
      );

      return event;
    },

    keydown: function(which, modifiers) {
      modifiers = modifiers || {};
      var event = document.createEvent('Events');
      event.initEvent('keydown', true, true);
      event.keyCode = which;
      event.which = which;
      event.metaKey = modifiers.metaKey;
      event.ctrlKey = modifiers.ctrlKey;
      event.altKey = modifiers.altKey;
      event.shiftKey = modifiers.shiftKey;

      return event;
    }
  };
})();
