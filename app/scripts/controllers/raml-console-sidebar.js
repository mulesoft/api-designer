angular.module('ramlConsoleApp')
    .controller('ramlConsoleSidebar', function ($scope, $filter, eventService, $rootScope) {
        var broadcast = function (data, isDoc, isRes) {
            var result = {
                data: data,
                isDocumentation: isDoc,
                isResource: isRes
            };

            $rootScope.elementName = data.name || (data[0] ? data[0].title : data.relativeUri);
            $rootScope.type = isDoc && !isRes ? 'document' : 'resource';

            eventService.broadcast('event:raml-sidebar-clicked', result);
        };

        $rootScope.elementName = '';
        $rootScope.type = '';

        $scope.loaded = function (doc, res) {
            if (typeof doc !== 'undefined') {
                broadcast([doc], true, false);
            } else if (typeof res !== 'undefined') {
                broadcast(res, false, true);
            }

        };

        $scope.elementClick = function (id) {
            var data = this.resource || this.documentation;

            broadcast($filter('filter')(data, function (el) {
                return el.name === id || el.title === id;
            }), this.documentation ? true : false, this.resource ? true : false);
        };

        $scope.isElementActive = function (elementName, type) {
            return elementName === $rootScope.elementName && type === $rootScope.type;
        };
    });