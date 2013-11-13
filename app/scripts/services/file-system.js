'use strict';

angular.module('fs')
  .factory('fileSystem', function ($injector, $window, config) {
    var fsFactory = config.get('fsFactory');

    if (!fsFactory) {
      fsFactory = 'mockFileSystem';

      // if ($window.location.hostname === 'j0hnqa.mulesoft.org') {
      //   fsFactory = 'remoteFileSystem';
      // }

      config.set('fsFactory', fsFactory);
    }

    return $injector.get(fsFactory);
  })
;
