'use strict';

angular.module('raml')
  .factory('config', function () {

    var configService = {}, config = {};

    configService.loadFromLocalStorage = function loadFromLocalStorage () {
      if (window && window.localStorage && window.localStorage.config) {
        try {
          config = JSON.parse(localStorage.config);
        } catch (e) {
          config = {};
          localStorage.config = JSON.stringify({});
        }
      }
    };

    configService.get = function get (key, defaultValue) {
      if (!key) {
        throw new Error('First argument (key to lookup) is mandatory');
      }

      return config.hasOwnProperty(key) ? config[key] : defaultValue;
    };

    configService.set = function set (key, value) {
      if (!key) {
        throw new Error('First argument (key to set) is mandatory');
      }

      config[key] = value;
    };

    configService.save = function () {
      localStorage.config = JSON.stringify(config);
    };

    configService.loadFromLocalStorage();

    return configService;
  });


