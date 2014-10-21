(function () {
  'use strict';

  angular.module('validate', [])
    .directive('ngValidate', function ($parse) {
      return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelController) {
          var fn = $parse(attrs.ngValidate);

          scope.$watch(attrs.ngModel, function (value) {
            var validity = fn(scope, { $value: value });

            ngModelController.$setValidity('validate', validity);
          });
        }
      };
    });
})();
