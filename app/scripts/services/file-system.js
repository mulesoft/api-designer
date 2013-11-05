'use strict';

angular.module('fs')
  .factory('fileSystem', function ($injector, $window, config) {
    var fsFactory = config.get('fsFactory');

    if (!fsFactory) {
      fsFactory = 'mockFileSystem';

      if ($window.location.origin === 'https://j0hn.mulesoft.org') {
        fsFactory = 'remoteFileSystem';
      }

      config.set('fsFactory', fsFactory);
    }

    config.save();

    return $injector.get(fsFactory);
  })
;
