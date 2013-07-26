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
            controller: function ($scope, $element, $attrs, ramlPaser, ramlReader) {
                ramlPaser.loadFile($attrs.src)
                    .done(function (result) {
                        var readData = ramlReader.read(result);
                        console.log(readData);
                        $rootScope.$emit('event:raml-parsed', readData);
                    });
            }
        };
    });