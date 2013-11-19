'use strict';

angular.module('raml')
  .value('config', {
    set: function (key, value) {
      localStorage['config.' + key] = value;
    },

    get: function (key, defaultValue) {
      key = 'config.' + key;
      if (key in localStorage) {
        return localStorage[key];
      }

      return defaultValue;
    },

    remove: function (key) {
      delete localStorage['config.' + key];
    },

    clear: function () {
      localStorage.clear();
    }
  })
;
