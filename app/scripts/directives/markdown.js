angular.module('ramlConsoleApp').directive('markdown', function (showdown) {
    return {
        restrict: 'C',
        link: function ($scope, element, attrs, ngModel) {
            $scope.$watch(attrs.ngModel, function (value) {
                if (typeof value !== 'undefined') {
                    element.html(showdown.makeHtml(value));
                }
            });
        }
    };
});