(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .factory('eventEmitter', function eventEmitter() {
      var self = this;
      var events = {};

      self.publish = function publish(eventName, data) {
        if(!events[eventName] || events[eventName].length < 1) {
          return;
        }

        events[eventName].forEach(function(listener) {
          listener(data || {});
        });
      };

      self.subscribe = function subscribe(eventName, listener) {
        if(!events[eventName]) {
          events[eventName] = [];
        }

        events[eventName].push(listener);
      };

      return self;
    })
  ;
})();
