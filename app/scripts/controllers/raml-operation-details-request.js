angular.module('ramlConsoleApp')
    .controller('ramlOperationDetailsRequest', function ($scope) {
        $scope.parseTypeName = function (value) {
            var split = value.split('/');

            if (split.length >= 2) {
                return split[1];
            } else {
                return split;
            }
        };
    });