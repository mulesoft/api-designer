angular.module('ramlConsoleApp')
    .controller('ramlOperationDetailsTryIt', function ($scope, $resource, commons, eventService, ramlHelper) {
        $scope.hasAdditionalParams = function (operation) {
            return operation.queryParameters || operation.name === 'post' || operation.name === 'put' || operation.name === 'patch';
        };

        $scope.hasRequestBody = function (operation) {
            return operation.name === 'post' || operation.name === 'put' || operation.name === 'patch';
        };

        $scope.hasBodyParams = function (bodyType) {
            return bodyType && bodyType.params && bodyType.params.length;
        };

        $scope.showResponse = function () {
            return this.response;
        };

        $scope.tryIt = function () {
            var params = {};
            var tester = new this.testerResource();
            var bodyParams = this.hasBodyParams(this.bodyType) ? this.body[this.operation.name] : null;
            var body = this.hasRequestBody(this.operation) ? this.requestBody[this.operation.name] : null;

            body = bodyParams ? ramlHelper.toUriParams(bodyParams) : body;
            commons.extend(params, this.url);
            commons.extend(params, this.query[this.operation.name]);
            tester.body = body || null;

            this.response = null;
            this.$request(tester, params, this.operation.name);
        };

        $scope.$request = function (tester, params, method) {
            var that = this;

            tester['$' + method](params, function (data, headers, status, url) {
                that.response = {
                    data: data.data,
                    headers: data.headers,
                    statusCode: status,
                    url: url
                };
            }, function (error) {
                var params = ramlHelper.toUriParams(error.config.params).replace(';', '');
                that.response = {
                    data: error.data.data,
                    headers: error.data.headers,
                    statusCode: error.status,
                    url: error.config.url + '?' + params
                };
            });
        };

        $scope.transformResponse = function (data, headers) {
            try {
                data = JSON.parse(data);
                data = angular.toJson(data, true);
            } catch (e) {}

            return {
                data: data,
                headers: headers()
            };
        };

        $scope.transformRequest = function (data, headers) {
            return (data && data.body) ? data.body : null;
        };

        $scope.buildTester = function () {
            var resourceUri = this.baseUri.replace(/{/g, ':').replace(/}/g, '') + this.resource.relativeUri.replace(/{/g, ':').replace(/}/g, '');
            var contentType = $scope.contentType;

            this.testerResource = $resource(resourceUri, null, {
                'get': {
                    method: 'GET',
                    headers: {
                        'Accept': '*/*'
                    },
                    transformResponse: this.transformResponse,
                    transformRequest: this.transformRequest
                },
                'post': {
                    method: 'POST',
                    headers: {
                        'Content-Type': contentType,
                        'Accept': '*/*'
                    },
                    transformResponse: this.transformResponse,
                    transformRequest: this.transformRequest
                },
                'put': {
                    method: 'PUT',
                    headers: {
                        'Content-Type': contentType,
                        'Accept': '*/*'
                    },
                    transformResponse: this.transformResponse,
                    transformRequest: this.transformRequest
                },
                'patch': {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': contentType,
                        'Accept': '*/*'
                    },
                    transformResponse: this.transformResponse,
                    transformRequest: this.transformRequest
                },
                'delete': {
                    method: 'DELETE',
                    headers: {
                        'Accept': '*/*'
                    },
                    transformResponse: this.transformResponse,
                    transformRequest: this.transformRequest
                }
            });
        };

        $scope.init = function () {
            if (!this.request) {
                this.request = {};
            }

            if (!this.requestBody) {
                this.requestBody = {
                    put: '',
                    post: '',
                    patch: ''
                };
            }

            if (!this.body) {
                this.body = {
                    put: {},
                    post: {},
                    patch: {}
                };
            }

            if (!this.url) {
                this.url = {};
            }

            if (!this.query) {
                this.query = {
                    get: {},
                    put: {},
                    post: {},
                    delete: {},
                    patch: {}
                };
            }

            this.response = null;
            this.buildTester();
        };

        $scope.$on('event:raml-method-changed', function () {
            $scope.init();
        });

        $scope.$on('event:raml-body-type-changed', function () {
            $scope.init();
        });

        $scope.init();
    });