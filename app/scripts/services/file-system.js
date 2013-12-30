'use strict';

angular.module('fs')
  .factory('fileSystem', function ($injector, $window, config) {
    var fsFactory = config.get('fsFactory');

    if (!fsFactory) {
      fsFactory = 'mockFileSystem';

      config.set('fsFactory', fsFactory);
    }

    return $injector.get(fsFactory);
  })
;
