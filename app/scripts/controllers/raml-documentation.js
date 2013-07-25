angular.module('ramlConsoleApp')
    .controller('ramlDocumentation', function ($scope, $filter) {
        $scope.model = {};

        $scope.$on('event:raml-sidebar-clicked', function (e, eventData) {
            if (eventData.isDocumentation) {
                $scope.model = eventData.data[0];
            } else {
                $scope.model = {};
            }
        });
    });