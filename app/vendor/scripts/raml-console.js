angular.module('ramlConsoleApp', ['helpers', 'raml', 'ngResource', 'ngSanitize']);
'use strict';

angular.module('raml', [])
    .factory('ramlReader', function () {
        return {
            processBaseUri: function (definition) {
                var baseUri = (definition.baseUri || '').replace(/\/\/*$/g, '');
                var version = definition.version || '';

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

                return baseUri.replace('{version}', version);
            },
            readRootElements: function (raml) {
                var result = {};

                if (typeof raml.title !== 'undefined') {
                    result.title = raml.title;
                } else {
                    throw new Error('title is not defined');
                }

                if (typeof raml.baseUri !== 'undefined') {
                    result.baseUri = raml.baseUri;
                }

                if (typeof raml.version !== 'undefined') {
                    result.version = raml.version;
                }

                return result;
            },
            readDocumentation: function (raml) {
                var result = {};

                if (typeof raml.documentation !== 'undefined') {
                    result.documentation = raml.documentation;
                }

                return result;
            },
            convert: function (query) {
                var queryParams = [];
                var param;

                for (var prop in query) {
                    param = query[prop];
                    param.paramName = prop;
                    queryParams.push(param);
                }

                return queryParams;
            },
            readHttpMethodData: function (methodDescriptor) {
                var result = {};

                if (typeof methodDescriptor.method !== 'undefined') {
                    result.name = methodDescriptor.method;
                }

                if (typeof methodDescriptor.description !== 'undefined') {
                    result.description = methodDescriptor.description;
                }

                if (typeof methodDescriptor.responses !== 'undefined') {
                    result.responses = methodDescriptor.responses;

                    for (var prop in result.responses) {
                        if (result.responses[prop] === null) {
                            result.responses[prop] = prop;
                        }
                    }
                }

                if (typeof methodDescriptor.queryParameters !== 'undefined') {
                    result.queryParameters = [];

                    angular.forEach(methodDescriptor.queryParameters, function () {
                        result.queryParameters = this.convert(methodDescriptor.queryParameters);
                    }.bind(this));
                }

                if (typeof methodDescriptor.uriParameters !== 'undefined') {
                    result.uriParameters = methodDescriptor.uriParameters;
                }

                if (typeof methodDescriptor.body !== 'undefined') {
                    result.request = methodDescriptor.body;

                    for (var contentType in result.request) {
                        if (typeof result.request[contentType].formParameters !== 'undefined') {
                            for (var param in result.request[contentType].formParameters) {
                                var temp = JSON.parse(JSON.stringify(result.request[contentType].formParameters[param]));

                                result.request[contentType].formParameters[param].paramName = param;
                                temp.paramName = param;

                                if (temp.type === 'file') {
                                    delete result.request[contentType].formParameters[param];

                                    if (typeof result.request[contentType].formParameters.__files === 'undefined') {
                                        result.request[contentType].formParameters.__files = {};
                                    }

                                    result.request[contentType].formParameters.__files[param] = temp;
                                }
                            }
                        }
                    }
                }

                return result;
            },
            readContentTypes: function (methodDescriptor) {
                var types = [];

                if (typeof methodDescriptor.body !== 'undefined') {
                    for (var type in methodDescriptor.body) {
                        if (types.indexOf(type) === -1) {
                            types.push(type);
                        }
                    }
                }

                // if (typeof methodDescriptor.responses !== 'undefined') {
                //     angular.forEach(methodDescriptor.responses, function (element) {
                //         for (var httpCode in element) {
                //             for (var contentType in methodDescriptor.responses[httpCode]) {
                //                 if (types.indexOf(contentType) === -1) {
                //                     types.push(contentType);
                //                 }
                //             }
                //         }
                //     });
                // }

                return types;
            },
            readTraits: function (traitList, traitsDescription) {
                var traits = [];

                traitList.forEach(function (use) {
                    var traitName, found;

                    if (typeof use === 'string') {
                        traitName = use;
                    } else if (typeof use === 'object') {
                        for (var key in use) {
                            if (use.hasOwnProperty(key)) {
                                traitName = key;
                            }
                        }
                    }

                    if (traitName) {
                        found = traitsDescription
                            .filter(function (t) {
                                return t[traitName];
                            })
                            .map(function (t) {
                                return t[traitName];
                            });

                        traits.push.apply(traits, found);
                    }
                });

                return traits;
            },
            readResourceData: function (resource, raml) {
                var result = JSON.parse(JSON.stringify(resource));

                if (!resource.methods instanceof Array) {
                    delete result.methods;
                }

                if (typeof result.name === 'undefined') {
                    result.name = result.relativeUri;
                }

                if (result.type) {
                    result.resourceType = this.readResourceType(result, raml.resourceTypes);
                }

                if (typeof result.relativeUri === 'undefined') {
                    throw new Error('relativeUri is not defined');
                }

                if (typeof resource.methods !== 'undefined') {
                    if (resource.methods instanceof Array) {
                        result.methods = {};
                        angular.forEach(resource.methods, function (element) {
                            result.methods[element.method] = this.readHttpMethodData(element);
                            result.methods[element.method].supportedTypes = this.readContentTypes(element);
                        }.bind(this));
                    }
                }

                if (result.traits) {
                    result.traits.concat(this.readTraitsDeep(resource, raml.traits));
                } else {
                    result.traits = this.readTraitsDeep(resource, raml.traits);
                }

                result.absoluteUri = raml.baseUri + result.relativeUri;

                return result;
            },
            readResourceType: function (resource, resourceTypeDetails) {
                var resourceTypeName;

                if (typeof(resource.type) === 'string') {
                    resourceTypeName = resource.type;
                } else {
                    for (var prop in resource.type) {
                        resourceTypeName = prop;
                    }
                }

                if (!resourceTypeName) {
                    return null;
                } else {
                    return resourceTypeName;
                }
            },
            readTraitsDeep: function (resource, traitsDetails) {
                var traits = [];

                if (typeof resource.is !== 'undefined') {
                    traits = this.readTraits(resource.is, traitsDetails);
                }

                angular.forEach(resource.methods, function (method) {
                    if (typeof method.is !== 'undefined') {
                        traits = traits.concat(this.readTraits(method.is, traitsDetails));
                    }
                }.bind(this));

                return traits;
            },
            readRootResources: function (raml) {
                var result = {
                    resources: []
                };

                if (typeof raml.resources !== 'undefined') {
                    angular.forEach(raml.resources, function (element) {
                        result.resources.push(this.readResourceData(element, raml));
                    }.bind(this));
                }

                return result;
            },
            read: function (raml) {
                var rootResources = this.readRootResources(raml),
                    rootDocumentation = this.readDocumentation(raml),
                    result;

                angular.forEach(rootResources.resources, function (resource) {
                    var flatResources = this.flatten(resource);

                    delete resource.resources;

                    resource.resources = [];

                    angular.forEach(flatResources, function (el) {
                        var r = this.readResourceData(el, raml);
                        resource.resources.push(r);
                    }.bind(this));
                }.bind(this));

                result = this.readRootElements(raml);
                result.documentation = rootDocumentation.documentation;
                result.resources = rootResources.resources;

                return result;
            },
            flatten: function (resource, container) {
                var result = [],
                    temp, uriPart = resource.relativeUri;

                if (typeof container === 'undefined') {
                    temp = JSON.parse(JSON.stringify(resource));

                    delete temp.resources;

                    if (typeof temp.methods !== 'undefined') {
                        result = [temp];
                    }

                } else {
                    result = container;
                }

                if (typeof resource.resources === 'undefined') {
                    resource.resources = [];
                }

                if (resource.resources.length > 0) {
                    angular.forEach(resource.resources, function (el) {
                        temp = JSON.parse(JSON.stringify(el));

                        delete temp.resources;

                        temp.parentUri = uriPart;
                        temp.localUri = temp.relativeUri;

                        temp.relativeUri = uriPart + temp.relativeUri;
                        el.relativeUri = temp.relativeUri;

                        result.push(temp);

                        return this.flatten(el, result);
                    }.bind(this));

                    return result;
                } else {
                    return result;
                }
            }
        };
    });
'use strict';

angular.module('raml')
    .factory('ramlParser', function () {
        return RAML.Parser;
    });
'use strict';

angular.module('helpers', [])
    .factory('commons', function () {
        return {
            extend: function (destination, source) {
                for (var elem in source) {
                    if (source.hasOwnProperty(elem)) {
                        if (source[elem]) {
                            destination[elem] = source[elem];
                        }
                    }
                }

                return destination;
            },
            getAbsoluteUri: function (baseUri, relativeUri) {
                return baseUri + relativeUri;
            },
            joinUrl: function (url1, url2) {
                if (url1.lastIndexOf('/') === url1.length - 1) {
                    url1 = url1.substring(0, url1.lastIndexOf('/'));
                }

                if (url2.indexOf('/') !== 0) {
                    url2 = '/' + url2;
                }

                return url1 + url2;
            },
            toUriParams: function (object) {
                var result = '';

                for (var param in object) {
                    result = result + param + '=' + object[param] + '&';
                }

                return result.replace(/\&$/, ';');
            },
            resolveParams: function (urlTemplate, params) {
                if (params) {
                    params.forEach(function (p) {
                        if (p.value) {
                            urlTemplate = urlTemplate.replace(p.name, p.value);
                        }
                    });
                }

                return urlTemplate;
            },
            processUrlParts: function (url) {
                var urlParts = [];
                var parts = url.split('}');

                parts.forEach(function (part) {
                    var splitted = (part || '').split('{');

                    if (splitted.length) {
                        urlParts.push({
                            displayName: splitted[0],
                            editable: false
                        });
                    }
                    if (splitted.length === 2) {
                        urlParts.push({
                            displayName: '{' + splitted[1] + '}',
                            editable: true,
                            memberName: splitted[1]
                        });
                    }
                });

                return urlParts;
            },
            makeReadyStateHandler: function (xhr, callback) {
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && callback) {
                        callback.call(null, xhr.responseText, xhr);
                    }
                };
            },
            setRequestHeaders: function (xhr, headers) {
                if (headers) {
                    for (var name in headers) {
                        xhr.setRequestHeader(name, headers[name]);
                    }
                }
            },
            toQueryString: function (params) {
                var r = [];
                for (var n in params) {
                    var v = params[n];
                    n = encodeURIComponent(n);
                    r.push(v === null ? n : (n + '=' + encodeURIComponent(v)));
                }
                return r.join('&');
            },
            /**
             * Sends a HTTP request to the server and returns the XHR object.
             *
             * @method request
             * @param {Object} inOptions
             *    @param {String} inOptions.url The url to which the request is sent.
             *    @param {String} inOptions.method The HTTP method to use, default is GET.
             *    @param {boolean} inOptions.sync By default, all requests are sent asynchronously.
             *        To send synchronous requests, set to true.
             *    @param {Object} inOptions.params Data to be sent to the server.
             *    @param {Object} inOptions.body The content for the request body for POST method.
             *    @param {Object} inOptions.headers HTTP request headers.
             *    @param {Object} inOptions.callback Called when request is completed.
             * @returns {Object} XHR object.
             */
            request: function (options) {
                var xhr = new XMLHttpRequest();
                var url = options.url;
                var method = options.method || 'GET';
                var async = !options.sync;
                var params = this.toQueryString(options.params);
                if (params && method === 'GET') {
                    url += (url.indexOf('?') > 0 ? '&' : '?') + params;
                }
                xhr.open(method, url, async);
                this.makeReadyStateHandler(xhr, options.callback);

                this.setRequestHeaders(xhr, options.headers);
                xhr.send(method === 'POST' || method === 'PUT' ? (options.body || params) : null);
                if (!async) {
                    xhr.onreadystatechange(xhr);
                }
                return xhr;
            }
        };
    });
'use strict';

angular.module('helpers')
    .factory('showdown', function () {
        var Showdown = window.Showdown;
        var showdown = new Showdown.converter();

        return showdown;
    });
'use strict';

angular.module('helpers')
  .factory('eventService', function ($rootScope, $timeout) {
    var service = {};
    var lastEvents = {};

    service.broadcast = function (eventName, data) {
      $rootScope.$broadcast(eventName, data);
      lastEvents[eventName] = { data: data };
    };

    service.on = function (eventName, handler) {
      $rootScope.$on(eventName, handler);
      if (lastEvents[eventName] && handler) {
        $timeout(function () {
          handler({}, lastEvents[eventName].data);
        });
      }
    };

    return service;
});
'use strict';

angular.module('ramlConsoleApp')
    .directive('preventDefault', function () {
        return function (scope, element) {
            var preventDefaultHandler = function (event) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
            };
            element[0].addEventListener('click', preventDefaultHandler, false);
        };
    });
'use strict';

angular.module('ramlConsoleApp')
    .directive('ramlConsole', function ($rootScope, ramlReader) {
        return {
            restrict: 'E',
            templateUrl: 'views/raml-console.tmpl.html',
            replace: true,
            transclude: false,
            scope: {
                'id': '@',
                'definition': '@'
            },
            link: function ($scope) {
                $scope.resources = [];
                $scope.consoleSettings = { displayTryIt: true };

                $rootScope.$on('event:raml-parsed', function (e, args) {
                    var definition = ramlReader.read(args);
                    $scope.baseUri = ramlReader.processBaseUri(args);
                    $scope.resources = definition.resources;
                    $scope.documentation = args.documentation;
                    $scope.$apply();
                });
            }
        };
    });

'use strict';

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
            controller: function ($scope, $element, $attrs, ramlParser) {
                ramlParser.loadFile($attrs.src)
                    .done(function (result) {
                        $rootScope.$emit('event:raml-parsed', result);
                    });
            }
        };
    });

'use strict';

angular.module('ramlConsoleApp')
    .directive('markdown', function (showdown) {
        return {
            restrict: 'C',
            link: function ($scope, element, attrs) {
                $scope.$watch(attrs.ngModel, function (value) {
                    if (typeof value !== 'undefined' && value !== null) {
                        element.html(showdown.makeHtml(value));
                    }
                });
            }
        };
    });
'use strict';

angular.module('ramlConsoleApp')
    .filter('formatUriPart', function () {
        return function (text) {
            return text.replace('\\', '');
        };
    });
angular.module('ramlConsoleApp')
    .controller('ramlOperation', function ($scope, $filter, commons, eventService) {
        $scope.headerClick = function () {
            this.toggle('active');
        };

        $scope.changeMethod = function (methodName) {
            var method = this.resource.methods[methodName];
            var uri = commons.getAbsoluteUri(this.baseUri, this.resource.relativeUri);

            if (method) {
                $scope.operation = method;
                $scope.urlParams = commons.processUrlParts(uri);
                $scope.queryParams = this.operation.queryParameters;
                $scope.contentType = this.operation.supportedTypes[0];
            }

            eventService.broadcast('event:raml-method-changed', methodName);
        };

        $scope.isMethodActive = function (methodName) {
            return this.operation && (this.operation.name === methodName);
        };

        $scope.toggle = function (member) {
            this[member] = !this[member];
        };

        $scope.init = function () {
            if (!$scope.operation) {
                $scope.operation = {};
            }

            if (this.resource.methods && this.resource.methods !== {}) {
                this.changeMethod(Object.keys(this.resource.methods)[0]);
            }
        };

        $scope.init();
    });
angular.module('ramlConsoleApp')
    .controller('ramlOperationList', function ($scope, ramlReader) {
        $scope.model = null;

        $scope.$on('event:raml-operation-list-published', function (e, eventData) {
            $scope.resources = ramlReader.read(eventData).resources;
        });

        $scope.$on('event:raml-sidebar-clicked', function (e, eventData) {
            if (eventData.isResource) {
                $scope.model = [eventData.data];
            } else {
                $scope.model = {};
            }
        });
    });

angular.module('ramlConsoleApp')
    .controller('ramlDocumentation', function ($scope) {
        $scope.model = null;

        $scope.$on('event:raml-sidebar-clicked', function (e, eventData) {
            if (eventData.isDocumentation) {
                $scope.model = eventData.data[0];
            } else {
                $scope.model = null;
            }
        });
    });
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

            if (isDoc) {
                eventService.broadcast('event:raml-sidebar-clicked', result);
            } else {
                eventService.broadcast('event:raml-operation-list-published', [data]);
            }
        };

        $rootScope.elementName = '';
        $rootScope.type = '';

        $scope.elementClick = function (id) {
            var data = this.resource || this.documentation;

            broadcast($filter('filter')(data, function (el) {
                return el.name === id || el.title === id;
            }), this.documentation ? true : false, this.resource ? true : false);
        };

        $scope.isElementActive = function (elementName, type) {
            return elementName === $rootScope.elementName && type === $rootScope.type;
        };

        $scope.initialStatus = function () {
            var doc = this.documentation && this.documentation.length ? this.documentation[0] : null,
                res = this.resources && this.resources.length ? this.resources[0] : null;

            if (doc) {
                broadcast([doc], true, false);
            } else if (res) {
                broadcast(res, false, true);
            }
        };

        $scope.$watch('resources || documentation', $scope.initialStatus.bind($scope), true);
    });
angular.module('ramlConsoleApp')
    .controller('ramlOperationDetails', function ($scope, eventService) {
        $scope.parseTypeName = function (value) {
            var split = value.split('/');

            if (split.length >= 2) {
                return split[1];
            } else {
                return split;
            }
        };

        $scope.hasDescription = function (value) {
            return !(typeof value !== 'undefined' && value !== '');
        };

        $scope.initTabs = function () {
            if ($scope.tabs) {
                return;
            }

            $scope.tabs = [];

            if ($scope.consoleSettings && $scope.consoleSettings.displayTryIt){
                $scope.tabs.push({
                    name: 'try-it',
                    displayName: 'Try It',
                    view: 'views/raml-operation-details-try-it.tmpl.html',
                    show: function () {
                        return true;
                    }
                });
            }

            $scope.tabs.push({
                name: 'parameters',
                displayName: 'Parameters',
                view: 'views/raml-operation-details-parameters.tmpl.html',
                show: function () {
                    var urlParams = ($scope.urlParams || []).filter(function (p) { return p.editable; });
                    return ($scope.operation.queryParameters && $scope.operation.queryParameters.length) || urlParams.length;
                }
            });

            $scope.tabs.push({
                name: 'requests',
                displayName: 'Request',
                view: 'views/raml-operation-details-request.tmpl.html',
                show: function () {
                    return typeof $scope.operation.request !== 'undefined';
                }
            });

            $scope.tabs.push({
                name: 'response',
                displayName: 'Response',
                view: 'views/raml-operation-details-response.tmpl.html',
                show: function () {
                    return typeof $scope.operation.responses !== 'undefined';
                }
            });

            $scope.initSelectedTab();
        };

        $scope.initSelectedTab = function () {
            $scope.tabName = null;
            $scope.tabs.forEach(function (tab) {
                if (!$scope.tabName && tab.show()) {
                    $scope.tabName = tab.name;
                }
            });
        };

        $scope.$on('event:raml-method-changed', function () {
            $scope.initSelectedTab();
            if ($scope.operation.supportedTypes && $scope.operation.supportedTypes.length) {
                eventService.broadcast('event:raml-body-type-changed', $scope.operation.supportedTypes[0]);
            } else {
                eventService.broadcast('event:raml-body-type-changed', 'application/json');
            }
        });

        $scope.isTabActive = function (tabName) {
            return tabName === $scope.tabName;
        };

        $scope.isTypeActive = function (mediaType) {
            return mediaType === $scope.contentType;
        };

        $scope.changeTab = function (tabName) {
            $scope.tabName = tabName;
        };

        $scope.requestFilter = function (el) {
            return el.method === $scope.operation.method && typeof el.body !== 'undefined' && typeof el.body[$scope.bodyType.name] !== 'undefined';
        };

        $scope.changeBodyType = function (mediaType) {
            $scope.contentType = mediaType;
            eventService.broadcast('event:raml-body-type-changed', mediaType);
        };

        $scope.responseFilter = function (el) {
            return el.name === $scope.operation.name && typeof el.responses !== 'undefined';
        };

        $scope.initTabs();
    });
angular.module('ramlConsoleApp').directive('fileUpload', function () {
    return {
        scope: true,
        link: function (scope, el) {
            el.bind('change', function (event) {
                var files = event.target.files;

                for (var i = 0; i < files.length; i++) {
                    scope.$emit('fileSelected', {
                        file: {
                            stream: files[i],
                            name: event.currentTarget.dataset.description
                        },
                        target: event.currentTarget.dataset.description
                    });
                }
            });
        }
    };
});

angular.module('ramlConsoleApp')
    .controller('ramlOperationDetailsTryIt', function ($scope, $resource, commons, eventService) {
        $scope.hasAdditionalParams = function (operation) {
            return operation.queryParameters || operation.name === 'post' || operation.name === 'put' || operation.name === 'patch';
        };

        $scope.hasRequestBody = function (operation) {
            return operation.name === 'post' || operation.name === 'put' || operation.name === 'patch';
        };

        $scope.hasBodyParams = function () {
            return this.operation && this.operation.request && this.operation.request[$scope.contentType] && this.operation.request[$scope.contentType].formParameters;
        };

        $scope.showResponse = function () {
            return this.response;
        };

        $scope.isFile = function (type) {
            return type === 'file';
        };

        $scope.files = [];

        $scope.$on('fileSelected', function (event, args) {
            $scope.$apply(function () {
                $scope.body[$scope.operation.name][args.target] = args.file.name;
                $scope.files.push(args.file);
            });
        });

        $scope.tryIt = function () {
            var params = {};
            var tester = new this.testerResource();
            var bodyParams = this.hasBodyParams(this.bodyType) ? this.body[this.operation.name] : null;
            var body = this.hasRequestBody(this.operation) ? this.requestBody[this.operation.name] : null;

            body = bodyParams ? commons.toUriParams(bodyParams) : body;

            if ($scope.contentType && $scope.contentType.indexOf('multipart') >= 0) {
                body = bodyParams ? bodyParams : body;
                body.payload = 'multipart/form-data';
            }

            commons.extend(params, this.url);
            commons.extend(params, this.query[this.operation.name]);
            tester.body = body || null;

            if (this.isValid() && $scope.additionalParamsForm.$valid) {
                this.response = null;
                this.$request(tester, params, this.operation.name);
            }
        };

        $scope.isValid = function () {
            var flag = true;

            for (var prop in this.url) {
                if (this.url[prop] === null || this.url[prop] === '') {
                    flag = false;
                    break;
                }
            }

            return flag;
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
                var params = commons.toUriParams(error.config.params).replace(';', '');
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

        $scope.transformRequest = function (data) {
            return (data && data.body) ? data.body : null;
        };

        $scope.transformMultipartRequest = function (data) {
            var fd = new FormData();

            angular.forEach(data.body, function (value, key) {
                fd.append(key, value);
            });

            for (var i = 0; i < $scope.files.length; i++) {
                fd.append($scope.files[i].name, $scope.files[i].stream);
            }

            return fd;
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
                        'Content-Type': contentType && contentType.indexOf('multipart') >= 0 ? false : contentType,
                        'Accept': '*/*'
                    },
                    transformResponse: this.transformResponse,
                    transformRequest: contentType && contentType.indexOf('multipart') >= 0 ? this.transformMultipartRequest : this.transformRequest
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

                angular.forEach(this.urlParams, function (el) {
                    if (el.memberName) {
                        this.url[el.memberName] = null;
                    }
                }.bind(this));
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

        // $scope.$on('event:raml-method-changed', function () {
        //     $scope.init();
        // });

        $scope.$on('event:raml-body-type-changed', function () {
            $scope.init();
        });

        $scope.init();
    });
angular.module('ramlConsoleApp')
    .controller('ramlOperationDetailsResponse', function ($scope) {
        $scope.parseTypeName = function (value) {
            var split = value.split('/');

            if (split.length >= 2) {
                return split[1];
            } else {
                return split;
            }
        };
    });
angular.module('ramlConsoleApp')
    .controller('ramlOperationDetailsRequest', function ($scope) {
        $scope.parseTypeName = function (value) {
            var split = value.split('/');

            if (split.length >= 2) {
                return split[1];
            } else {
                return split;
            }
        };
    });
angular.module("ramlConsoleApp").run(["$templateCache", function($templateCache) {

  $templateCache.put("views/raml-body-param-files.tmpl.html",
    "<label ng-switch on=\"bodyParam.type\">{{bodyParam.displayName}}\n" +
    "    <span style=\"color: #e9322d;\" ng-show=\"bodyParam.required\">*</span>\n" +
    "\n" +
    "    <input ng-switch-when=\"file\" data-description=\"{{bodyParam.paramName}}\" style=\"width: 533px; padding-top: 9px;\" name=\"file\" type=\"file\" placeholder=\"{{bodyParam.example}}\" ng-model=\"body[operation.name][bodyParam.paramName]\" ng-required=\"{{bodyParam.required}}\" file-upload>\n" +
    "</label>"
  );

  $templateCache.put("views/raml-body-param.tmpl.html",
    "<label ng-switch on=\"bodyParam.type\" ng-show=\"bodyParam.displayName\">{{bodyParam.displayName}}\n" +
    "    <span style=\"color: #e9322d;\" ng-show=\"bodyParam.required\">*</span>\n" +
    "\n" +
    "    <input ng-switch-default type=\"text\" placeholder=\"{{bodyParam.example}}\" ng-model=\"body[operation.name][bodyParam.paramName]\" ng-required=\"{{bodyParam.required}}\">\n" +
    "</label>"
  );

  $templateCache.put("views/raml-console-navbar.tmpl.html",
    "<header>\n" +
    "    <h1>api:<em>Console</em></h1>\n" +
    "    <span>{{api.title}} {{api.version}}</span>\n" +
    "</header>"
  );

  $templateCache.put("views/raml-console-sidebar.tmpl.html",
    "<div ng-controller=\"ramlConsoleSidebar\">\n" +
    "  <section role=\"documentation\" ng-if=\"documentation.length\">\n" +
    "    <header>\n" +
    "      <h1>Overview</h1>\n" +
    "    </header>\n" +
    "    <ul role=\"documentation\">\n" +
    "      <li ng-class=\"{active:isElementActive(document.title, 'document')}\" ng-repeat=\"document in documentation\">\n" +
    "        <a href=\"#\" ng-click=\"elementClick(document.title)\">{{document.title}}</a>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "  </section>\n" +
    "  <section role=\"resources\" ng-if=\"resources.length\">\n" +
    "    <header>\n" +
    "      <h1>Api Reference</h1>\n" +
    "    </header>\n" +
    "    <ul>\n" +
    "      <li ng-class=\"{active:isElementActive(resource.name, 'resource')}\" ng-repeat=\"resource in resources\">\n" +
    "        <a href=\"#\" ng-click=\"elementClick(resource.name)\">{{resource.name}}</a>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "  </section>\n" +
    "</div>"
  );

  $templateCache.put("views/raml-console.tmpl.html",
    "<section role=\"api-console\">\n" +
    "    <header>\n" +
    "        <ng-include src=\"'views/raml-console-navbar.tmpl.html'\"></ng-include>\n" +
    "    </header>\n" +
    "    <div style=\"display:table;\">\n" +
    "        <div style=\"display:table-row;\">\n" +
    "            <aside role=\"sidebar\" style=\"display:table-cell; vertical-align: top;\">\n" +
    "                <ng-include src=\"'views/raml-console-sidebar.tmpl.html'\" ng-controller=\"ramlConsoleSidebar\"></ng-include>\n" +
    "            </aside>\n" +
    "            <div style=\"display:table-cell; vertical-align: top;\">\n" +
    "                <section role=\"main\">\n" +
    "                    <ng-include src=\"'views/raml-documentation.tmpl.html'\" ng-controller=\"ramlDocumentation\"></ng-include>\n" +
    "                    <ng-include src=\"'views/raml-operation-list.tmpl.html'\"></ng-include>\n" +
    "                </section>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <footer></footer>\n" +
    "</section>\n"
  );

  $templateCache.put("views/raml-definition.tmpl.html",
    "<div></div>"
  );

  $templateCache.put("views/raml-documentation.tmpl.html",
    "<section role=\"api-documentation\" ng-show=\"model\">\n" +
    "  <header>\n" +
    "    <h1>{{model.title}}</h1>\n" +
    "  </header>\n" +
    "  <div id=\"content\" class=\"markdown\" ng-model=\"model.content\">\n" +
    "  </div>\n" +
    "</section>"
  );

  $templateCache.put("views/raml-operation-details-parameters.tmpl.html",
    "<section role=\"api-operation-details-section-parameters\">\n" +
    "  <section role=\"parameter-list\" ng-show=\"(urlParams | filter: {editable: true}).length\">\n" +
    "    <header>\n" +
    "      <h1>Url Parameters</h1>\n" +
    "    </header>\n" +
    "    <table>\n" +
    "      <thead>\n" +
    "        <tr>\n" +
    "          <th>Param</th>\n" +
    "          <th>Type</th>\n" +
    "          <th>Description</th>\n" +
    "          <th>Example</th>\n" +
    "        </tr>\n" +
    "      </thead>\n" +
    "      <tbody>\n" +
    "        <tr ng-repeat=\"param in urlParams | filter: {editable: true}\">\n" +
    "          <td>{{param.displayName}}</td>\n" +
    "          <td>{{param.type}}</td>\n" +
    "          <td class=\"markdown\" ng-model=\"param.description\"></td>\n" +
    "          <td>{{param.example}}</td>\n" +
    "        </tr>\n" +
    "      </tbody>\n" +
    "    </table>\n" +
    "  </section>\n" +
    "  <section role=\"parameter-list\" ng-show=\"queryParams && queryParams.length\">\n" +
    "    <header>\n" +
    "      <h1>Query Parameters</h1>\n" +
    "    </header>\n" +
    "    <table>\n" +
    "      <thead>\n" +
    "        <tr>\n" +
    "          <th>Param</th>\n" +
    "          <th>Type</th>\n" +
    "          <th>Description</th>\n" +
    "          <th>Example</th>\n" +
    "        </tr>\n" +
    "      </thead>\n" +
    "      <tbody>\n" +
    "        <tr ng-repeat=\"param in queryParams\">\n" +
    "          <td>{{param.displayName}}</td>\n" +
    "          <td>{{param.type}}</td>\n" +
    "          <td class=\"markdown\" ng-model=\"param.description\"></td>\n" +
    "          <td>{{param.example}}</td>\n" +
    "        </tr>\n" +
    "      </tbody>\n" +
    "    </table>\n" +
    "  </section>\n" +
    "</section>\n"
  );

  $templateCache.put("views/raml-operation-details-request.tmpl.html",
    "<section role=\"api-operation-details-section-request\" ng-controller=\"ramlOperationDetailsRequest\">\n" +
    "   <section role=\"codes-list\" ng-repeat=\"(contentType, content) in operation.request\">\n" +
    "    <table ng-show=\"content.schema\">\n" +
    "      <thead>\n" +
    "        <tr>\n" +
    "          <th>{{ parseTypeName(contentType) }} Schema</th>\n" +
    "        </tr>\n" +
    "      </thead>\n" +
    "      <tbody>\n" +
    "        <tr>\n" +
    "          <td>\n" +
    "        <pre>{{content.schema}}</pre>\n" +
    "      </td>\n" +
    "        </tr>\n" +
    "      </tbody>\n" +
    "    </table>\n" +
    "\n" +
    "    <table ng-show=\"content.example\">\n" +
    "      <thead>\n" +
    "        <tr>\n" +
    "          <th>{{ parseTypeName(contentType) }} Example</th>\n" +
    "        </tr>\n" +
    "      </thead>\n" +
    "      <tbody>\n" +
    "        <tr>\n" +
    "          <td>\n" +
    "        <pre>{{content.example}}</pre>\n" +
    "      </td>\n" +
    "        </tr>\n" +
    "      </tbody>\n" +
    "    </table>\n" +
    "\n" +
    "  </section>\n" +
    "\n" +
    "  <section role=\"codes-list\" ng-repeat=\"(contentType, content) in operation.request\" ng-show=\"content.formParameters\">\n" +
    "    <header>\n" +
    "      <h1>Form Parameters</h1>\n" +
    "    </header>\n" +
    "    <table>\n" +
    "      <thead>\n" +
    "        <tr>\n" +
    "          <th>Name</th>\n" +
    "          <th>Type</th>\n" +
    "          <th>Description</th>\n" +
    "        </tr>\n" +
    "      </thead>\n" +
    "      <tbody>\n" +
    "        <tr ng-repeat=\"param in content.formParameters\">\n" +
    "          <td>{{param.displayName}}</td>\n" +
    "          <td>{{param.type}}</td>\n" +
    "          <td class=\"markdown\" ng-model=\"param.description\"></td>\n" +
    "        </tr>\n" +
    "      </tbody>\n" +
    "    </table>\n" +
    "  </section>\n" +
    "</section>\n"
  );

  $templateCache.put("views/raml-operation-details-response.tmpl.html",
    "<section role=\"api-operation-details-section-response\" ng-controller=\"ramlOperationDetailsResponse\">\n" +
    "  <section role=\"codes-list\" ng-repeat=\"(statusCode, response) in operation.responses\">\n" +
    "    <header>\n" +
    "      <h1>{{statusCode}}<small ng-show=\"response.summary\">:&nbsp;{{response.summary}}</small></h1>\n" +
    "      <div class=\"markdown\" ng-model=\"response.description\"></div>\n" +
    "    </header>\n" +
    "\n" +
    "    <table ng-show=\"content.schema\" ng-repeat=\"(contentType, content) in response.body\">\n" +
    "      <thead>\n" +
    "        <tr>\n" +
    "          <th>{{ parseTypeName(contentType) }} Schema</th>\n" +
    "        </tr>\n" +
    "      </thead>\n" +
    "      <tbody>\n" +
    "        <tr>\n" +
    "          <td>\n" +
    "        <pre>{{content.schema}}</pre>\n" +
    "      </td>\n" +
    "        </tr>\n" +
    "      </tbody>\n" +
    "    </table>\n" +
    "\n" +
    "    <table ng-show=\"content.example\" ng-repeat=\"(contentType, content) in response.body\">\n" +
    "      <thead>\n" +
    "        <tr>\n" +
    "          <th>{{ parseTypeName(contentType) }} Example</th>\n" +
    "        </tr>\n" +
    "      </thead>\n" +
    "      <tbody>\n" +
    "        <tr>\n" +
    "          <td>\n" +
    "        <pre>{{content.example}}</pre>\n" +
    "      </td>\n" +
    "        </tr>\n" +
    "      </tbody>\n" +
    "    </table>\n" +
    "\n" +
    "  </section>\n" +
    "</section>\n"
  );

  $templateCache.put("views/raml-operation-details-try-it.tmpl.html",
    "<section role=\"api-operation-details-section-try-it\" ng-controller=\"ramlOperationDetailsTryIt\">\n" +
    "    <section role=\"request\">\n" +
    "        <header>\n" +
    "            <h1>Request</h1>\n" +
    "        </header>\n" +
    "        <form role=\"uri-params\" name=\"uriParamsForm\">\n" +
    "            <h2>Resource Uri</h2>\n" +
    "            <div role=\"uri\">\n" +
    "                <ng-include src=\"'views/raml-uri-part.tmpl.html'\" ng-repeat=\"uriPart in urlParams\"></ng-include>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "        <div role=\"additional-params\" ng-show=\"hasAdditionalParams(operation)\">\n" +
    "            <form role=\"query-params\" name=\"additionalParamsForm\">\n" +
    "                <h2>Additional parameters</h2>\n" +
    "                <div role=\"params\">\n" +
    "                    <ng-include src=\"'views/raml-query-param.tmpl.html'\" ng-repeat=\"queryParam in queryParams\"></ng-include>\n" +
    "                </div>\n" +
    "                <div role=\"params\">\n" +
    "                    <ng-include src=\"'views/raml-body-param.tmpl.html'\" ng-repeat=\"bodyParam in operation.request[contentType].formParameters\"></ng-include>\n" +
    "\n" +
    "                    <ng-include src=\"'views/raml-body-param-files.tmpl.html'\" ng-repeat=\"bodyParam in operation.request[contentType].formParameters.__files\"></ng-include>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "            <div role=\"request-body\" ng-show=\"hasRequestBody(operation) && !hasBodyParams(bodyType)\">\n" +
    "                <label>Body\n" +
    "                    <textarea ng-model=\"requestBody[operation.name]\"></textarea>\n" +
    "                </label>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div role=\"try-it\">\n" +
    "            <span ng-click=\"tryIt()\">Try It!</span>\n" +
    "        </div>\n" +
    "    </section>\n" +
    "    <section role=\"response\" ng-show=\"showResponse()\">\n" +
    "        <header>\n" +
    "            <h1>Response</h1>\n" +
    "        </header>\n" +
    "        <section role=\"request-uri\">\n" +
    "            <h1>Request URL</h1>\n" +
    "            <p>{{response.url}}</p>\n" +
    "        </section>\n" +
    "        <section role=\"response-code\">\n" +
    "            <h1>Response code</h1>\n" +
    "            <p>{{response.statusCode}}</p>\n" +
    "        </section>\n" +
    "        <section role=\"response-headers\">\n" +
    "            <h1>Response headers</h1>\n" +
    "            <ul role=\"headers-list\">\n" +
    "                <li ng-repeat=\"(key, value) in response.headers\">\n" +
    "                    <span role=\"key\">{{key}}</span>\n" +
    "                    <span role=\"value\">{{value}}</span>\n" +
    "                </li>\n" +
    "                <!-- Uncomment when this feature is ready in Angular release\n" +
    "                <dl>\n" +
    "                  <dt ng-repeat-start=\"(key, value) in response.headers\">{{key}}</dt>\n" +
    "                  <dd ng-repeat-end>{{value}}</dd>\n" +
    "                </dl>\n" +
    "                -->\n" +
    "            </ul>\n" +
    "        </section>\n" +
    "        <section role=\"response-body\">\n" +
    "            <h1>Response body</h1>\n" +
    "            <p>\n" +
    "                <pre>{{response.data}}</pre>\n" +
    "            </p>\n" +
    "        </section>\n" +
    "    </section>\n" +
    "</section>\n"
  );

  $templateCache.put("views/raml-operation-details.tmpl.html",
    "<section role=\"api-operation-details\" ng-show=\"operation\" ng-controller=\"ramlOperationDetails\">\n" +
    "  <header>\n" +
    "      <h1>Description</h1>\n" +
    "      <p ng-show=\"operation.description\">{{operation.description}}</p>\n" +
    "      <p ng-hide=\"operation.description\">No description.</p>\n" +
    "  </header>\n" +
    "  <div role=\"details-body\">\n" +
    "    <ul role=\"details-sections\">\n" +
    "        <li role=\"{{tab.name}}\"\n" +
    "            ng-repeat=\"tab in tabs\"\n" +
    "            ng-class=\"{active:isTabActive(tab.name)}\"\n" +
    "            ng-click=\"changeTab(tab.name)\"\n" +
    "            ng-show=\"tab.show()\">\n" +
    "          <span>{{tab.displayName}}</span>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "    <ul role=\"content-types\">\n" +
    "        <li ng-repeat=\"contenType in operation.supportedTypes\"\n" +
    "            ng-click=\"changeBodyType(contenType)\" ng-class=\"{active:isTypeActive(contenType)}\">\n" +
    "          {{ parseTypeName(contenType)}}\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "    <ng-include ng-repeat=\"tab in tabs\"\n" +
    "                ng-show=\"isTabActive(tab.name)\"\n" +
    "                src=\"tab.view\">\n" +
    "    </ng-include>\n" +
    "  </div>\n" +
    "</section>\n"
  );

  $templateCache.put("views/raml-operation-list.tmpl.html",
    "<div ng-show=\"resources && resources.length\" ng-controller=\"ramlOperationList\">\n" +
    "  <section role=\"api-operation-list\" ng-repeat=\"model in resources\">\n" +
    "    <ng-include src=\"'views/raml-operation.tmpl.html'\" ng-repeat=\"resource in model.resources\"></ng-include>\n" +
    "  </section>\n" +
    "</div>"
  );

  $templateCache.put("views/raml-operation.tmpl.html",
    "<section role=\"api-operation\" ng-class=\"{active:active, first:$first, last:$last}\" ng-controller=\"ramlOperation\">\n" +
    "  <header id=\"operationHeader\" ng-click=\"headerClick()\">\n" +
    "    <hgroup>\n" +
    "      <h2><span ng-show=\"resource.parentUri\">{{resource.parentUri}}&nbsp;</span><strong>{{resource.localUri || resource.relativeUri}}</strong></h2>\n" +
    "      <h1 ng-show=\"resource.resourceType\">Type: <strong>{{resource.resourceType}}</strong></h1>\n" +
    "    </hgroup>\n" +
    "    <div role=\"summary\">\n" +
    "      <ul role=\"traits\">\n" +
    "        <li ng-repeat=\"trait in resource.traits\">{{trait.displayName}}</li>\n" +
    "      </ul>\n" +
    "      <ul role=\"operations\">\n" +
    "        <li role=\"{{key}}\" ng-repeat=\"(key, value) in resource.methods\" ng-class=\"{active:isMethodActive(key)}\" ng-click=\"changeMethod(key); $event.stopPropagation()\">\n" +
    "          <span>{{key}}</span>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "  </header>\n" +
    "  <ng-include src=\"'views/raml-operation-details.tmpl.html'\"></ng-include>\n" +
    "</scection>"
  );

  $templateCache.put("views/raml-query-param.tmpl.html",
    "<label>{{queryParam.displayName}}\n" +
    "\t<span style=\"color: #e9322d;\" ng-show=\"queryParam.required\">*</span>\n" +
    "    <input type=\"text\" placeholder=\"{{queryParam.example}}\" ng-model=\"query[operation.name][queryParam.paramName]\" ng-required=\"{{queryParam.required}}\">\n" +
    "</label>"
  );

  $templateCache.put("views/raml-uri-part.tmpl.html",
    "<span ng-hide=\"uriPart.editable\" ng-bind-html='uriPart.displayName | formatUriPart'></span><input type=\"text\" name=\"{{uriPart.memberName}}\" ng-model=\"url[uriPart.memberName]\" ng-show=\"uriPart.editable\" placeholder=\"{{uriPart.displayName}}\" required></input>"
  );

}]);
