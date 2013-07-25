angular.module('ramlConsoleApp')
    .controller('ramlOperationDetailsResponse', function ($scope, $filter) {
        $scope.$on('event:raml-method-changed', function () {
            $scope.init();
        });

        $scope.$on('event:raml-body-type-changed', function () {
            $scope.init();
        });

        $scope.init = function () {
            var statusCodes = [],
                contentType = $scope.bodyType ? $scope.bodyType.name : 'application/json',
                methodDescriptor = $filter('filter')($scope.resource.methods, {
                    method: $scope.operation.method
                })[0];

            if (methodDescriptor.responses) {
                for (var prop in methodDescriptor.responses) {
                    var response = methodDescriptor.responses[prop] || {},
                        example = response.body ? (response.body[contentType] ? response.body[contentType].example : '') : '',
                        schema = response.body ? (response.body[contentType] ? response.body[contentType].schema : '') : '';

                    statusCodes.push({
                        name: prop,
                        description: response.description,
                        example: example,
                        schema: schema
                    });
                }
            }

            $scope.statusCodes = statusCodes;
        };

        $scope.init();
    });