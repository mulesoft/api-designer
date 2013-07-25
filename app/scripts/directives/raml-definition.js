angular.module('ramlConsoleApp')
    .directive('ramlDefinition', function ($rootScope) {
        return {
            restrict: 'E',
            templateUrl: 'views/raml-definition.tmpl.html',
            replace: true,
            transclude: false,
            scope: {
                'id': '@',
                'src': '@'
            },
            controller: function ($scope, $element, $attrs, ramlHelper, ramlPaser) {
                ramlPaser.loadFile($attrs.src)
                    .done(function (result) {
                        // ramlHelper.massage(result);
                        angular.forEach(result.resources, function (resource) {
                            ramlHelper.massage(resource);
                        });

                        console.log(result);
                        $rootScope.$emit('event:raml-parsed', result);
                    });
            }
        };
    });