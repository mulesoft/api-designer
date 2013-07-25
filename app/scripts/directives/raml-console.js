angular.module('ramlConsoleApp')
    .directive('ramlConsole', function ($rootScope) {
        return {
            restrict: 'E',
            templateUrl: 'views/raml-console.tmpl.html',
            replace: true,
            transclude: false,
            scope: {
                'id': '@',
                'definition': '@'
            },
            link: function ($scope, $element, $attributes) {
                $scope.resources = [];

                $rootScope.$on('event:raml-parsed', function (e, args) {
                    var baseUri = (args.baseUri || '').replace(/\/\/*$/g, '');
                    var version = args.version || '';

                    baseUri = baseUri.replace(':0', '\\:0');
                    baseUri = baseUri.replace(':1', '\\:1');
                    baseUri = baseUri.replace(':2', '\\:2');
                    baseUri = baseUri.replace(':3', '\\:3');
                    baseUri = baseUri.replace(':4', '\\:4');
                    baseUri = baseUri.replace(':5', '\\:5');
                    baseUri = baseUri.replace(':6', '\\:6');
                    baseUri = baseUri.replace(':7', '\\:7');
                    baseUri = baseUri.replace(':8', '\\:8');
                    baseUri = baseUri.replace(':9', '\\:9');

                    $scope.baseUri = baseUri.replace('{version}', version);
                    $scope.resources = args.resources;
                    $scope.documentation = args.documentation;
                    $scope.$apply();
                });
            }
        };
    });