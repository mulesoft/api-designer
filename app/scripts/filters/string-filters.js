'use strict';

angular.module('stringFilters', [])
  .filter('dasherize', function() {
    return function (input) {
      return input ? input.toLowerCase().trim().replace(/\s/g, '-') : '';
    };
  });
