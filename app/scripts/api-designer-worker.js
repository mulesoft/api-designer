'use strict';

function RamlExpander() {

  function retrieveType(raml, typeName) {
    if (!raml.types) {
      return;
    }

    var object = raml.types.filter(function (type) {
      return type[typeName];
    })[0];
    return object ? object[typeName] : object;
  }

  function replaceTypeIfExists(raml, type, value) {
    var valueHasExamples = value.example || value.examples;
    var expandedType = retrieveType(raml, type);
    if (expandedType) {
      for (var key in expandedType) {
        if (expandedType.hasOwnProperty(key)) {
          if ((key === 'example' || key === 'examples') && valueHasExamples) { continue; }
          if (key === 'properties') { // can have extra properties
            value[key] = Object.assign(value.properties || {}, expandedType[key]);
          } else {
            value[key] = expandedType[key];
          }
        }
      }
    }
  }

  function dereferenceTypes(raml) {
    jsTraverse.traverse(raml).forEach(function (value) {
      if (this.path.slice(-2).join('.') === 'body.application/json' && value.type) {
        var type = value.type[0];
        replaceTypeIfExists(raml, type, value);
      }
    });

  }

  function extractArrayType(arrayNode) {
    return arrayNode.items && arrayNode.items.type ? arrayNode.items.type[0] : arrayNode.items;
  }

  function isNotObject(value) {
    return value === null || typeof value !== 'object';
  }

  function dereferenceTypesInArrays(raml) {
    jsTraverse.traverse(raml).forEach(function (value) {
      if (this.path.slice(-2).join('.') === 'body.application/json' && value.type && value.type[0] === 'array') {
        var type = extractArrayType(value);
        if (isNotObject(value.items)) { value.items = {}; }
        replaceTypeIfExists(raml, type, value.items);

        if (!value.examples && !value.example) { generateArrayExampleIfPossible(value); }
      }
    });

  }

  function generateArrayExampleIfPossible(arrayNode) {
    var examples = getExampleList(arrayNode.items);
    if (examples.length === 0) {
      return;
    }

    arrayNode.example = examples;
  }

  function getExampleList(node) {
    if (node.examples) {
      return node.examples.map(function (example) {
        return example.structuredValue;
      });
    }
    if (node.example) {
      return [node.example];
    }

    return [];
  }

  function dereferenceSchemas(raml) {
    jsTraverse.traverse(raml).forEach(function (value) {
      if (this.path.slice(-2).join('.') === 'body.application/json' && value.schema) {
        var schema = value.schema[0];
        replaceSchemaIfExists(raml, schema, value);
      }
    });
  }

  function replaceSchemaIfExists(raml, schema, value) {
    var expandedSchema = retrieveSchema(raml, schema);
    if (expandedSchema) {
      value.schema[0] = expandedSchema.type[0];
    }
  }

  function retrieveSchema(raml, schemaName) {
    if (!raml.schemas) {
      return;
    }

    var object = raml.schemas.filter(function (schema) {
      return schema[schemaName];
    })[0];
    return object ? object[schemaName] : object;
  }

  this.expandRaml = function expandRaml(raml) {
    dereferenceTypes(raml);
    dereferenceSchemas(raml);
    dereferenceTypesInArrays(raml);
  };
}


function RamlParser(onFileRequest, proxyUrl) {
  var ramlExpander = new RamlExpander();
  var options = {
    attributeDefaults: true,
    rejectOnErrors: false,
    fsResolver: {
      contentAsync: onFileRequest,
      content: function (path) {
        throw new Error('RamlParser should call contentAsync instead of content. File: ' + path);
      }
    }
  };

  if (proxyUrl) {
    options.httpResolver = {
      getResourceAsync: function (url) {
        return new Promise(function (resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', proxyUrl + url);
          xhr.setRequestHeader('Accept', 'application/raml+yaml');
          xhr.onload = function() {
            if (xhr.status === 200) {
              resolve({content: xhr.responseText});
            }
            else {
              reject(xhr.status);
            }
          };
          xhr.send();
        });
      }
    };
  }

  var jsonOptions = {
    serializeMetadata: false,
    dumpSchemaContents: true,
    rootNodeDetails: true
  };

  function toJson(api) {
    var json = api.toJSON(jsonOptions);
    if (json.specification) {
      ramlExpander.expandRaml(json.specification);
    }
    return json;
  }

  this.parse = function (path) {
    return RAML.Parser.loadApi(path, options).then(function (api) {
      api = api.expand ? api.expand(true) : api;
      return toJson(api);
    });
  };
}

if (self.importScripts && self.location.hash) {

  var workerParameters = (function getQueryParams(qs) {
    if (qs.indexOf('#') === 0) {
      qs = qs.substring(1);
    }
    qs = qs.split('+').join(' ');

    var params = {},
      tokens,
      re = /[?&]?([^=]+)=([^&]*)/g;

    tokens = re.exec(qs);
    while (tokens) {
      params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
      tokens = re.exec(qs);
    }

    return params;
  })(self.location.hash);

  // console.log('Worker initialed with parameter:', workerParameters);

  if (self.location.host.indexOf('localhost:9013') > -1) {
    // dev dependencies to parser
    self.importScripts(
      '/bower_components/js-polyfills/polyfill.js',
      '/bower_components/promise-polyfill/promise.min.js',
      '/bower_components/raml-1-parser/raml-json-validation.js',
      '/bower_components/raml-1-parser/raml-xml-validation.js',
      '/bower_components/raml-1-parser/raml-1-parser.js',
      '/.tmp/js-traverse/js-traverse.js'
    );
  } else {
    self.importScripts(workerParameters.parser);
  }

  var requestFileCallbacks = {};

  var post = function (type, payload) {
    try {
      self.postMessage({type: type, payload: payload});
    } catch (e) {
      console.error('Error when trying to post back from worker', e);
      self.postMessage({type: type}); // send just the type, so the flow can continue
    }
  };

  var listen = function (type, fn) {
    self.addEventListener('message', function (e) {
      if (e.data.type === type) {
        fn(e.data.payload);
      }
    }, false);
  };

  var postReject = function (type, error) {
    // console.timeEnd(type);
    // js exceptions cant be serialized as normal strings, so just post the error message in that case
    var serializableError = error.stack ? {message: error.message} : error;
    return post(type + '-reject', serializableError);
  };

  var listenThenPost = function (type, fn) {
    listen(type, function (data) {
      // console.time(type);
      try {
        fn(data)
          .then(function (result) {
            // console.timeEnd(type);
            return post(type + '-resolve', result);
          })
          .catch(function (error) {
            postReject(type, error);
          });
      } catch (e) {
        postReject(type, e);
      }
    });
  };

  var requestFile = function (path, callback) {
    var callbackList = requestFileCallbacks[path] || [];
    callbackList.push(callback);
    requestFileCallbacks[path] = callbackList;
    post('requestFile', {path: path});
  };

  var responseFile = function (path, error, content) {
    var callbacks = requestFileCallbacks[path];
    if (callbacks) {
      callbacks.forEach(function (callback) {
        callback(error, content);
      });
      delete requestFileCallbacks[path];
    }
  };

  var requestFilePromise = function (path) {
    return new Promise(function (resolve, reject) {
      requestFile(path, function (err, content) {
        if (err) {
          reject(err);
        }
        else {
          resolve(content);
        }
      });
    });
  };

  var ramlParser = new RamlParser(requestFilePromise, workerParameters.proxy);

  listenThenPost('ramlParse', function (data) {
    return ramlParser.parse(data.path);
  });

  listen('requestFile', function (data) {
    return responseFile(data.path, data.error, data.content);
  });
}
