angular.module('ramlConsoleApp')
    .controller('ramlOperationList', function ($scope, $filter) {
        $scope.model = {};

        $scope.$on('event:raml-sidebar-clicked', function (e, eventData) {
            if (eventData.isResource) {
                $scope.model = eventData.data;
                $scope.$apply();
            } else {
                $scope.model = {};
            }
        });
    });