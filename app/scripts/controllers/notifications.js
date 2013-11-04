'use strict';

angular.module('ramlEditorApp')
  .controller('notifications', function ($scope) {
    $scope.hideNotifications = function () {
      $scope.shouldDisplayNotifications = true;
    };
  });
