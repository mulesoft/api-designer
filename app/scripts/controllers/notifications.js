(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .constant('NOTIFICATION_TIMEOUT', 3000)
    .controller('notifications', function (NOTIFICATION_TIMEOUT, $scope, $timeout) {
      var notifications = [];
      $scope.shouldDisplayNotifications = false;

      function processNotifications () {
        var args;

        if (notifications.length) {
          args = notifications.splice(0, 1)[0];

          $scope.message = args.message;
          $scope.expires = args.expires;
          $scope.level   = args.level || 'info';  // info, error

          $scope.shouldDisplayNotifications = true;

          if (args.expires) {
            $timeout(function () {
              $scope.shouldDisplayNotifications = false;
              processNotifications();
            }, NOTIFICATION_TIMEOUT);
          }
        }
      }

      $scope.$on('event:notification', function (e, args) {
        notifications.push(JSON.parse(JSON.stringify(args)));
        processNotifications();
      });

      $scope.hideNotifications = function () {
        $scope.shouldDisplayNotifications = false;
        processNotifications();
      };
    })
  ;
})();
