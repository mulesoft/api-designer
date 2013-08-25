angular.module('raml', [])
    .factory('ramlReader', function () {
        return {
            readRootElements: function (raml) {
                var result = {};

                if (typeof raml.title !== 'undefined') {
                    result.title = raml.title;
                } else {
                    throw new Error('title is not defined');
                }

                if (typeof raml.baseUri !== 'undefined') {
                    result.baseUri = raml.baseUri;
                } else {
                    throw new Error('baseUri is not defined');
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
                    param.name = prop;
                    queryParams.push(param);
                }

                return queryParams;
            },

            readHttpMethodData: function (methodDescriptor) {
                var result = {};

                if (typeof methodDescriptor.method !== 'undefined') {
                    result.name = methodDescriptor.method;
                }

                if (typeof methodDescriptor.summary !== 'undefined') {
                    result.summary = methodDescriptor.summary;
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
                }

                return result;
            },

            readContentTypes: function (methodDescriptor) {
                var types = ['application/json'];

                if (typeof methodDescriptor.body !== 'undefined') {
                    for (var type in methodDescriptor.body) {
                        if (types.indexOf(type) === -1) {
                            types.push(type);
                        }
                    }
                }

                if (typeof methodDescriptor.responses !== 'undefined') {
                    angular.forEach(methodDescriptor.responses, function (element) {
                        for (var httpCode in element) {
                            for (var contentType in methodDescriptor.responses[httpCode]) {
                                if (types.indexOf(contentType) === -1) {
                                    types.push(contentType);
                                }
                            }
                        }
                    });
                }

                return types;
            },

            readTraits: function (resource) {
                var traits = [];

                angular.forEach(resource.use, function (use) {
                    if (typeof use === 'string' && traits.indexOf(use) === -1) {
                        traits.push(use);
                    } else if (typeof use === 'object') {
                        var keys = Object.keys(use);

                        if (keys.length) {
                            var key = Object.keys(use)[0];

                            if (traits.indexOf(key) === -1) {
                                traits.push(key);
                            }
                        }
                    }
                });

                return traits;
            },

            readResourceData: function (resource, baseUri) {
                var result = JSON.parse(JSON.stringify(resource));

                if (!resource.methods instanceof Array) {
                    delete result.methods;
                }

                if (typeof result.name === 'undefined') {
                    result.name = result.relativeUri;
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

                if (typeof resource.use !== 'undefined') {
                    result.traits = this.readTraits(resource);
                }

                result.absoluteUri = baseUri + result.relativeUri;

                return result;
            },

            readRootResources: function (raml) {
                var result = {
                    resources: []
                };

                if (typeof raml.resources !== 'undefined') {
                    angular.forEach(raml.resources, function (element) {
                        result.resources.push(this.readResourceData(element, raml.baseUri));
                    }.bind(this));
                }

                return result;
            },

            read: function (raml) {
                var rootResources = this.readRootResources(raml),
                    rootDocumentation = this.readDocumentation(raml),
                    result, resultResources = [];

                angular.forEach(rootResources.resources, function (resource) {
                    var flatResources = this.flatten(resource);


                    delete resource.resources;

                    resource.resources = [];

                    angular.forEach(flatResources, function (el) {
                        var r = this.readResourceData(el, raml.baseUri);
                        resultResources.push(r);

                        if (!r.methods) {
                            r.methods = {};
                        }

                        resource.resources.push(r);
                    }.bind(this));
                }.bind(this));

                result = this.readRootElements(raml);
                result.documentation = rootDocumentation.documentation;
                result.resources = resultResources;

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