angular.module('ramlConsoleApp')
    .controller('ramlOperation', function ($scope, $filter, ramlHelper, eventService) {
        $scope.headerClick = function () {
            this.toggle('active');
        };

        $scope.changeMethod = function (methodName) {
            var method = this.resource.methods[methodName];
            var uri = ramlHelper.getAbsoluteUri(this.baseUri, this.resource.relativeUri);

            if (method) {
                $scope.operation = method;
                $scope.urlParams = ramlHelper.processUrlPartsNew(uri);
                $scope.queryParams = this.operation.queryParameters;
                $scope.contentType = this.operation.supportedTypes[0];
            }
        };

        $scope.isMethodActive = function (methodName) {
            return this.operation && (this.operation.name === methodName);
        };

        $scope.toggle = function (member) {
            this[member] = !this[member];
        };

        $scope.init = function () {
            if (this.resource.methods !== {}) {
                this.changeMethod(Object.keys(this.resource.methods)[0]);
            }
        };

        $scope.init();
    });