angular.module('ramlConsoleApp')
    .controller('ramlOperationDetailsRequest', function ($scope, $filter, ramlHelper) {
        $scope.$on('event:raml-method-changed', function () {
            $scope.init();
        });

        $scope.$on('event:raml-body-type-changed', function () {
            $scope.init();
        });

        $scope.init = function () {
            var contentType = $scope.bodyType ? $scope.bodyType.name : 'application/json',
                methodDescriptor = $filter('filter')($scope.resource.methods, {
                    method: $scope.operation.method
                })[0];

            $scope.description = $filter('filter')(ramlHelper.getRequestData(methodDescriptor), {
                name: contentType
            })[0];
        };

        $scope.init();
    });