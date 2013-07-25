angular.module('helpers', [])
    .factory('ramlPaser', function () {
        return RAML.Parser;
    })
    .factory('ramlHelper', function () {
        return {
            toUriParams: function (object) {
                var result = '';

                for (var param in object) {
                    result = result + param + '=' + object[param] + '&';
                }

                return result.replace(/\&$/, ';');
            },
            getUriPath: function (uri) {
                var tempUri = uri.replate('//', '');
                var pathStart = tempUri.indexOf('/');

                return tempUri.substr(pathStart);
            },
            getAbsoluteUri: function (baseUri, relativeUri) {
                return baseUri + relativeUri;
            },
            getRequestData: function (descriptor) {
                var arr = [];

                if (descriptor.body) {
                    for (var contentType in descriptor.body) {
                        var temp = {
                            name: contentType,
                            schema: descriptor.body[contentType].schema || '',
                            example: descriptor.body[contentType].example || ''
                        };

                        if (descriptor.body[contentType].formParameters) {
                            var params = [];

                            for (var param in descriptor.body[contentType].formParameters) {
                                var t1 = descriptor.body[contentType].formParameters[param];

                                t1.name = param;

                                params.push(t1);
                            }

                            temp.params = params;
                        }

                        arr.push(temp);
                    }
                } else {
                    arr.push({
                        name: 'application/json',
                        schema: '',
                        example: '',
                        params: []
                    });
                }

                return arr;
            },
            processQueryParts: function (query) {
                var queryParams = [];
                var param;

                for (var prop in query) {
                    param = query[prop];
                    param.name = prop;
                    queryParams.push(param);
                }

                return queryParams;
            },
            processUrlPartsNew: function (url) {
                var urlParts = [];
                var parts = url.split('}');

                angular.forEach(parts, function (part) {
                    var splitted = (part || '').split('{');

                    if (splitted.length) {
                        urlParts.push({
                            name: splitted[0],
                            editable: false
                        });
                    }
                    if (splitted.length === 2) {
                        urlParts.push({
                            name: '{' + splitted[1] + '}',
                            editable: true,
                            memberName: splitted[1]
                        });
                    }
                });

                return urlParts;
            },
            processUrlParts: function (url) {
                var urlParts = [];
                var paths = url.split('/');

                angular.forEach(paths, function (path) {
                    var template;
                    if (!path) {
                        return;
                    }
                    template = path.match(/{(.*?)}/ig);
                    if (template) {
                        urlParts.push({
                            name: template[0],
                            editable: true,
                            memberName: template[0].replace('{', '').replace('}', '')
                        });
                    } else {
                        urlParts.push({
                            name: path,
                            editable: false
                        });
                    }
                });

                return urlParts;
            },
            massage: function (resource, parent) {
                resource.use = this.readTraits(resource.use);

                if (!resource.name) {
                    resource.name = resource.relativeUri;
                }

                if (resource.resources) {
                    var temp = JSON.parse(JSON.stringify(resource));

                    delete temp.resources;

                    temp.relativeUri = '';

                    if (temp.methods) {
                        resource.resources.unshift(temp);
                    }

                    angular.forEach(resource.resources, function (r) {
                        if (!r.name) {
                            r.name = r.relativeUri;
                        }

                        r.relativeUri = resource.relativeUri + r.relativeUri;

                        var exists = null;

                        if (parent && parent.resources) {
                            exists = parent.resources.filter(function (p) {
                                return p.name === r.name;
                            }.bind(this)).pop();
                        }

                        if (parent && !exists) {
                            parent.resources.push(r);
                        }

                        this.massage(r, resource);
                    }.bind(this));
                } else {
                    var exists = false;

                    if (parent) {
                        exists = parent.resources.filter(function (p) {
                            return p.name === p.name;
                        }.bind(this)).pop();
                    }

                    if (parent && !exists) {
                        parent.resources.push(resource);
                    }
                }

                if (!parent) {
                    var res = JSON.parse(JSON.stringify(resource));

                    if (resource.resources) {
                        var flag = resource.resources.filter(function (p) {
                            return p.name === p.name;
                        }.bind(this)).pop();

                        if (!flag) {
                            var tt = JSON.Parse(JSON.stringify(resource));

                            delete res.resources;

                            resource.resources.push(tt);
                        }
                    } else {
                        resource.resources = [];
                        resource.resources.push(res);
                    }
                }
            },
            readTraits: function (usages) {
                var temp = [];

                if (usages) {
                    angular.forEach(usages, function (use) {
                        if (typeof use === 'string' && temp.indexOf(use) === -1) {
                            temp.push(use);
                        } else if (typeof use === 'object') {
                            var keys = Object.keys(use);

                            if (keys.length) {
                                var key = Object.keys(use)[0];

                                if (temp.indexOf(key) === -1) {
                                    temp.push(key);
                                }
                            }
                        }
                    });
                }

                return temp;
            }
        };
    })
    .factory('commons', function () {
        return {
            extend: function (destination, source) {
                for (var elem in source) {
                    if (source.hasOwnProperty(elem)) {
                        destination[elem] = source[elem];
                    }
                }

                return destination;
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
            makeReadyStateHandler: function (xhr, callback) {
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        callback && callback.call(null, xhr.responseText, xhr);
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
                    r.push(v == null ? n : (n + '=' + encodeURIComponent(v)));
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
    })
    .filter('formatUriPart', function () {
        return function (text) {
            return text.replace(/\//g, '&nbsp/&nbsp').replace(/\&nbsp\&nbsp/g, '&nbsp').replace(/\&nbsp$/g, '');
        };
    });