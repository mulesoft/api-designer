'use strict';

angular.module('raml')
  .factory('config', function () {

    var configService = {}, config = {};

    configService.loadFromLocalStorage = function loadFromLocalStorage () {
      var i, key;
      
      if (window && window.localStorage) {
        for (i = 0; i < localStorage.length; i++){
          key = localStorage.key(i);
          
          if (key.indexOf('config.') === 0) {
            config[key.substring('config.'.length)] = localStorage.getItem(key);
          }
        }
      }
    };

    configService.get = function get (key, d3fault) {
      if (!key) {
        throw new Error('First argument (key to lookup) is mandatory');
      }

      return config.hasOwnProperty(key) ? config[key] : d3fault;
    };

    configService.set = function set (key, value) {
      if (!key) {
        throw new Error('First argument (key to set) is mandatory');
      }

      config[key] = value;
    };

    configService.save = function () {
      var key, value;
      for (key in config) {
        value = config[key];

        localStorage['config.' + key] = value;
      }
    };

    configService.loadFromLocalStorage();

    return configService;
  });


