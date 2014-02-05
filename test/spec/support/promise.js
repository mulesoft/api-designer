(function() {
  'use strict';

  window.promise = {
    resolved: function(value) {
      return {
        then: function(success) {
          success(value);
        }
      };
    },
    rejected: function(error) {
      return {
        then: function(success, failure) {
          if (typeof failure === 'function') {
            failure(error);
          }
        }
      };
    },
    stub: function() {
      return {
        then: function() {}
      };
    }
  };
})();
