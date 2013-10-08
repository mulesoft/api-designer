'use strict';

var Showdown = window.Showdown;

angular.module('helpers').factory('showdown', function () {
  var showdown = new Showdown.converter();

  return showdown;
});
