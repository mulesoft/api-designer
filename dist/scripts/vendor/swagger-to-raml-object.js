!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.swaggerToRamlObject=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var extend     = require('extend');
var getVersion = require('./utils/version');

/**
 * Map of valid param types to raml types.
 *
 * @type {Object}
 */
var PARAM_TYPE_MAP = {
  string:  { type: 'string' },
  number:  { type: 'number' },
  integer: { type: 'integer' },
  boolean: { type: 'boolean' },
  File:    { type: 'file' },
  array:   { repeat: true }
};

/**
 * Map of valid param types to json schema types.
 *
 * @type {Object}
 */
var JSON_TYPE_MAP = {
  string:  { type: 'string' },
  number:  { type: 'number' },
  integer: { type: 'integer' },
  boolean: { type: 'boolean' },
  array:   { type: 'array' },
  object:  { type: 'object' }
};

/**
 * Map of valid formats to their properties.
 *
 * @type {Object}
 */
var PARAM_FORMAT_MAP = {
  int32: {
    type: 'integer',
    minimum: -2147483648,
    maximum: 2147483647
  },
  int64: {
    type: 'integer',
    minimum: -9223372036854775808,
    maximum: 9223372036854775807
  },
  date: {
    type: 'date'
  },
  'date-time': {
    type: 'date'
  }
};

/**
 * Url-encoded form content type.
 *
 * @type {String}
 */
var URL_ENCODED_MIME = 'application/x-www-form-urlencoded';

/**
 * Content type for multipart form uploads.
 *
 * @type {String}
 */
var MULTI_PART_MIME = 'multipart/form-data';

/**
 * Location of the spec on api declarations.
 *
 * @type {String}
 */
var API_SPEC_URI = 'https://github.com/wordnik/swagger-spec' +
  '/blob/master/versions/1.2.md#52-api-declaration';

/**
 * Expose the converter function.
 */
module.exports = convertApiDeclaration;

/**
 * Convert an api declaration into RAML.
 *
 * @param  {Object} declaration
 * @param  {Object} ramlObject
 * @return {Object}
 */
function convertApiDeclaration (declaration, ramlObject) {
  var version = getVersion(declaration);

  if (version >= 2) {
    throw new Error('Swagger ' + version.toFixed(1) + ' is not supported');
  }

  // Verify the api declaration is valid.
  if (!declaration.basePath || !declaration.apis) {
    throw new Error('Must be a valid api declaration: ' + API_SPEC_URI);
  }

  ramlObject = ramlObject || {};

  // Check if the api version is still the same.
  if (ramlObject.version && declaration.apiVersion !== ramlObject.version) {
    throw new Error(
      'The api version has changed: ' +
      ramlObject.version + ' -> ' + declaration.apiVersion
    );
  } else if (!ramlObject.version) {
    ramlObject.version = declaration.apiVersion;
  }

  addBasePath(declaration.basePath, ramlObject);
  convertApis(declaration, ramlObject);

  return ramlObject;
}

/**
 * Set the base path from the api declaration on the raml object.
 *
 * @param  {String} basePath
 * @param  {Object} ramlObject
 * @return {Object}
 */
function addBasePath (basePath, ramlObject) {
  // If a base uri has not been set yet, set it here.
  if (!ramlObject.baseUri) {
    ramlObject.baseUri = basePath;

    return ramlObject;
  }

  // If the base path changes for some reason, throw an error. In the future,
  // we may want to refactor the resource tree with new prefixes.
  if (ramlObject.baseUri !== basePath) {
    throw new Error(
      'The base uri has changed: ' + ramlObject.baseUri + ' -> ' + basePath
    );
  }

  return ramlObject;
}

/**
 * Convert an array of apis into a raml resource.
 *
 * @param  {Object} declaration
 * @param  {Object} ramlObject
 * @return {Object}
 */
function convertApis (declaration, ramlObject) {
  var relativeUri   = declaration.resourcePath;
  var ramlResources = ramlObject.resources = ramlObject.resources || [];
  var ramlResource  = findResource(ramlResources, relativeUri);

  declaration.apis.forEach(function (api) {
    var path = api.path;
    var resource;

    // I assume this will always occur based on the Swagger specs I've seen.
    if (path.substr(0, relativeUri.length) === relativeUri) {
      path = path.substr(relativeUri.length);

      // If no raml resource exists, create it.
      if (!ramlResource) {
        ramlResource = { relativeUri: relativeUri };

        ramlResources.push(ramlResource);
      }

      ramlResource.resources = ramlResource.resources || [];
      ramlResource.resources.push(resource = { relativeUri: path });
    } else {
      ramlResources.push(resource = {
        relativeUri: path
      });
    }

    // Alias the api description onto the new raml resource.
    if (api.description) {
      resource.description = api.description;
    }

    return convertOperations(api.operations, declaration, resource);
  });

  return ramlResource;
}

/**
 * Find a resource by uri in an array of resources.
 *
 * @param  {Array}  resources
 * @param  {String} uri
 * @return {Object}
 */
function findResource (resources, uri) {
  var matchingResource;

  resources.some(function (resource) {
    if (resource.relativeUri === uri) {
      return (matchingResource = resource);
    }
  });

  return matchingResource;
}

/**
 * Convert an array of swagger operations for a raml resource.
 *
 * @param  {Object} operations
 * @param  {Object} declaration
 * @param  {Object} ramlResource
 * @return {Object}
 */
function convertOperations (operations, declaration, ramlResource) {
  ramlResource.methods = ramlResource.methods || [];

  operations.forEach(function (operation) {
    if (!operation.method) {
      throw new Error('Expected the operation to have a method defined');
    }

    // Initialise the method object. This assumes the same method name has not
    // already been used.
    var method = {
      method:      operation.method,
      displayName: operation.nickname,
      description: operation.notes || operation.summary || ''
    };

    if (operation.deprecated === 'true' || operation.deprecated === true) {
      if (method.description) {
        method.description += '\n\n';
      }

      method.description += 'This method has been deprecated.';
    }

    convertParameters(operation, declaration, method, ramlResource);
    convertResponseMessages(operation, declaration, method);

    ramlResource.methods.push(method);
  });

  return ramlResource;
}

/**
 * Convert response messages into the raml object.
 *
 * @param  {Object} operation
 * @param  {Object} declaration
 * @param  {Object} method
 * @return {Object}
 */
function convertResponseMessages (operation, declaration, method) {
  if (!operation.responseMessages || !operation.responseMessages.length) {
    return method;
  }

  // Initialise the responses object.
  var responses = method.responses = method.responses || {};
  var produces  = operation.produces || declaration.produces || [];

  // Alias all response messages.
  operation.responseMessages.forEach(function (response) {
    responses[response.code] = { description: response.message };

    // Adds the produces mime types to the reponses object.
    if (produces.length) {
      responses[response.code].body = {};

      produces.forEach(function (mime) {
        responses[response.code].body[mime] = null;
      });
    }
  });

  return method;
}

/**
 * Convert swagger operation parameters for a raml method.
 *
 * @param  {Array}  operation
 * @param  {Object} declaration
 * @param  {Object} ramlMethod
 * @param  {Object} ramlResource
 * @return {Object}
 */
function convertParameters (operation, declaration, ramlMethod, ramlResource) {
  var consumes   = operation.consumes || declaration.consumes || [];
  var parameters = groupParameters(operation.parameters);

  // Path parameters are more applicable to the resource than the method.
  if (parameters.path) {
    ramlResource.uriParameters = convertParametersToRaml(
      parameters.path, declaration
    );
  }

  // Add query parameters to the current method.
  if (parameters.query) {
    ramlMethod.queryParameters = convertParametersToRaml(
      parameters.query, declaration
    );
  }

  // Add headers to the current method.
  if (parameters.header) {
    ramlMethod.headers = convertParametersToRaml(
      parameters.header, declaration
    );
  }

  // Convert the body parameters before attempting the form.
  if (parameters.body) {
    convertBodyParameters(parameters.body, consumes, declaration, ramlMethod);
  }

  // Convert the form parameter into something that works better
  if (parameters.form) {
    convertFormParameters(parameters.form, consumes, declaration, ramlMethod);
  }

  return ramlMethod;
}

/**
 * Map of conversion mime types to functions.
 *
 * @type {Object}
 */
var CONVERT_PARAMS_TO_SCHEMA = {
  'application/xml':  null, // convertParameterToXmlSchema
  'application/json': convertParameterToJsonSchema
};

/**
 * Convert body parameters inline into raml schemas.
 *
 * @param  {Array}  params
 * @param  {Array}  consumes
 * @param  {Object} declaration
 * @param  {Object} ramlMethod
 * @return {Object}
 */
function convertBodyParameters (params, consumes, declaration, ramlMethod) {
  ramlMethod.body = ramlMethod.body || {};

  // Iterate over the consumes object and convert known types.
  params.forEach(function (param) {
    if (param.name !== 'body') {
      throw new Error('Invalid parameter name for body: ' + param.name);
    }

    consumes.forEach(function (mime) {
      if (CONVERT_PARAMS_TO_SCHEMA[mime]) {
        return ramlMethod.body[mime] = {
          schema: CONVERT_PARAMS_TO_SCHEMA[mime](param, declaration)
        };
      }

      ramlMethod.body[mime] = null;
    });
  });

  return ramlMethod;
}

/**
 * Convert form parameters inline and mutate the raml method.
 *
 * @param  {Array}  params
 * @param  {Array}  consumes
 * @param  {Object} declaration
 * @param  {Object} ramlMethod
 * @return {Object}
 */
function convertFormParameters (params, consumes, declaration, ramlMethod) {
  var multiPart  = consumes.indexOf(MULTI_PART_MIME) > -1;
  var urlEncoded = consumes.indexOf(URL_ENCODED_MIME) > -1;
  var ramlParams = convertParametersToRaml(params, declaration);

  // Enforce multipart if the parameters contain a file type.
  if (!multiPart) {
    multiPart = params.some(function (param) {
      return param.type === 'File';
    });
  }

  // Initialise the body to an object, if it hasn't already been.
  ramlMethod.body = ramlMethod.body || {};

  // Alias the object based on the consumes type.
  if (multiPart && urlEncoded) {
    ramlMethod.body[MULTI_PART_MIME] = { formParameters: ramlParams };
    ramlMethod.body[URL_ENCODED_MIME] = { formParameters: ramlParams };
  } else if (multiPart) {
    ramlMethod.body[MULTI_PART_MIME] = { formParameters: ramlParams };
  } else {
    ramlMethod.body[URL_ENCODED_MIME] = { formParameters: ramlParams };
  }

  return ramlMethod;
}

/**
 * Group parameters by types.
 *
 * @param  {Array}  parameters
 * @return {Object}
 */
function groupParameters (parameters) {
  var groups = {};

  Object.keys(parameters).forEach(function (key) {
    var parameter = parameters[key];
    var type      = parameter.paramType;
    var group     = groups[type] = groups[type] || [];

    group.push(parameter);
  });

  return groups;
}

/**
 * Convert an array of swagger parameters to the resource path.
 *
 * @param  {Array}  params
 * @param  {Object} declaration
 * @return {Object}
 */
function convertParametersToRaml (params, declaration) {
  var ramlParams = {};

  params.forEach(function (param) {
    ramlParams[param.name] = convertParameter(param, declaration);
  });

  return ramlParams;
}

/**
 * Convert a single parameter to raml style.
 *
 * @param  {Object} param
 * @param  {Object} declaration
 * @return {Object}
 */
function convertParameter (param, declaration) {
  var ramlParameter = {};

  // Extend the parameter information based on the type.
  if (param.type && PARAM_TYPE_MAP[param.type]) {
    extend(ramlParameter, PARAM_TYPE_MAP[param.type]);
  } else {
    // TODO: Handle params with `.type` or `.$ref` models.
  }

  // Extend the parameter with defaults set by the format.
  if (PARAM_FORMAT_MAP[param.format]) {
    extend(ramlParameter, PARAM_FORMAT_MAP[param.format]);
  }

  if (typeof param.description === 'string') {
    ramlParameter.description = param.description;
  }

  if (typeof param.required === 'boolean') {
    ramlParameter.required = param.required;
  }

  if (param.defaultValue) {
    ramlParameter.default = param.defaultValue;
  }

  if (Array.isArray(param.enum)) {
    ramlParameter.enum = param.enum;
  }

  if (typeof param.minimum === 'number') {
    ramlParameter.minimum = param.minimum;
  }

  if (typeof param.maximum === 'number') {
    ramlParameter.maximum = param.maximum;
  }

  return ramlParameter;
}

/**
 * Convert a model to a JSON schema object.
 *
 * @param  {String} name
 * @param  {Object} declaration
 * @return {Object}
 */
function convertModelToJson (name, declaration) {
  var schema = {};
  var model  = declaration.models[name];

  // Unfortunately, it is possible that the model has not been documented.
  if (!model) {
    return;
  }

  // Find potential parent models.
  Object.keys(declaration.models).some(function (key) {
    var model = declaration.models[key];

    if (!model || !model.subTypes || !model.subTypes.indexOf(name)) {
      return false;
    }

    // Find and compile the parent schema.
    var parentSchema = convertParameterToJson(key, declaration);

    extend(schema, parentSchema);
    schema.properties = extend({}, parentSchema.properties);

    return true;
  });

  // Compile child properties into expected objects.
  Object.keys(model.properties || {}).forEach(function (key) {
    var property   = model.properties[key];
    var properties = schema.properties = schema.properties || {};

    properties[key] = convertParameterToJson(property, declaration);
  });

  return schema;
}

/**
 * Convert a parameter into JSON schema object.
 *
 * @param  {Object} param
 * @param  {Object} declaration
 * @return {Object}
 */
function convertParameterToJson (param, declaration) {
  var schema = {};

  if (param.type && JSON_TYPE_MAP[param.type]) {
    extend(schema, JSON_TYPE_MAP[param.type]);
  } else if (param.$ref || param.type) {
    // Extend the current schema with model meta data.
    extend(schema, convertModelToJson(param.$ref || param.type, declaration));
  }

  // Iterate over the allowed JSON schema properties in Swagger and set.
  [
    'description',
    'defaultValue',
    'enum',
    'minimum',
    'maximum',
    'items',
    'required',
    'uniqueItems'
  ].forEach(function (key) {
    if (param[key] == null) {
      return;
    }

    // Handle sub-items different and convert the types.
    if (key === 'items') {
      return schema[key] = convertParameterToJson(param[key], declaration);
    }

    schema[key] = param[key];
  });

  return schema;
}

/**
 * Convert a parameter to JSON.
 *
 * @param  {Object} param
 * @param  {Object} declaration
 * @return {String}
 */
function convertParameterToJsonSchema (param, declaration) {
  var schema = extend({
    $schema: 'http://json-schema.org/draft-04/schema#'
  }, convertParameterToJson(param, declaration));

  return JSON.stringify(schema, null, 2);
}

},{"./utils/version":6,"extend":7}],2:[function(require,module,exports){
/**
 * Expose the parse module.
 */
module.exports = parse;

/**
 * Parse the content based on the file name.
 *
 * @param  {String} content
 * @return {Object}
 */
function parse (content) {
  return JSON.parse(content);
}

},{}],3:[function(require,module,exports){
var getVersion = require('./utils/version');

/**
 * Map swagger documentation keys into title-cased strings.
 *
 * @type {Object}
 */
var DOCUMENTATION_NAME_MAP = {
  description:       'Description',
  termsOfServiceUrl: 'Terms of Service URL',
  contact:           'Contact',
  license:           'License',
  licenseUrl:        'License URL'
};

/**
 * Map of Swagger OAuth 2.0 grant types to the RAML equivalents.
 *
 * @type {Object}
 */
var GRANT_TYPE_MAP = {
  implicit:           'token',
  authorization_code: 'code'
};

/**
 * Map of ways to pass API keys in Swagger to RAML properties.
 * @type {Object}
 */
var API_KEY_PASS_AS_MAP = {
  header: 'headers',
  query:  'queryParameters'
};

/**
 * Location of the swagger spec on resource listings.
 *
 * @type {String}
 */
var RESOURCE_SPEC_URI = 'https://github.com/wordnik/swagger-spec' +
  '/blob/master/versions/1.2.md#51-resource-listing';

/**
 * Expose the converter.
 */
module.exports = convertResourceListing;

/**
 * Convert a resource listing into a base raml object.
 *
 * @param  {Object} resource
 * @param  {Object} ramlObject
 * @return {Object}
 */
function convertResourceListing (resource, ramlObject) {
  var version = getVersion(resource);

  if (version >= 2) {
    throw new Error('Swagger ' + version.toFixed(1) + ' is not supported');
  }

  if (!resource.apis) {
    throw new Error('Must be a valid resource listing: ' + RESOURCE_SPEC_URI);
  }

  ramlObject = ramlObject || {};

  if (resource.apiVersion) {
    ramlObject.version = resource.apiVersion;
  }

  convertInfo(resource.info, ramlObject);
  convertAuthorizations(resource.authorizations, ramlObject);

  return ramlObject;
}

/**
 * Attach information from the swagger spec to the raml object.
 *
 * @param  {Object} info
 * @param  {Object} ramlObject
 * @return {Object}
 */
function convertInfo (info, ramlObject) {
  if (!info) {
    return ramlObject;
  }

  var documentation = Object.keys(DOCUMENTATION_NAME_MAP)
    .filter(function (key) {
      return info[key];
    })
    .map(function (key) {
      return {
        title:   DOCUMENTATION_NAME_MAP[key],
        content: info[key]
      };
    });

  if (info.title) {
    ramlObject.title = info.title;
  }

  if (documentation.length) {
    ramlObject.documentation = documentation;
  }

  return ramlObject;
}

/**
 * Convert swagger authorizations into raml object format.
 *
 * @param  {Object} authorizations
 * @param  {Object} ramlObject
 * @return {Object}
 */
function convertAuthorizations (authorizations, ramlObject) {
  if (!authorizations) {
    return ramlObject;
  }

  ramlObject.securitySchemes = Object.keys(authorizations)
    .map(function (key) {
      var data = {};

      data[key] = convertAuthorization(authorizations[key]);

      return data;
    });

  return ramlObject;
}

/**
 * Convert a single swagger authorization object into something compatible
 * with raml.
 *
 * @param  {Object} authorization
 * @return {Object}
 */
function convertAuthorization (authorization) {
  if (authorization.type === 'oauth2') {
    return convertOAuth2(authorization);
  }

  if (authorization.type === 'apiKey') {
    return convertApiKey(authorization);
  }

  if (authorization.type === 'basicAuth') {
    return convertBasicAuth(authorization);
  }
}

/**
 * Convert the OAuth 2.0 authorization from swagger into raml object.
 *
 * @param  {Object} authorization
 * @return {Object}
 */
function convertOAuth2 (authorization) {
  var ramlAuth = {
    type: 'OAuth 2.0',
    settings: {
      authorizationGrants: []
    }
  };

  var implicit     = authorization.grantTypes.implicit;
  var authCode     = authorization.grantTypes.authorization_code;
  var description  = [];
  var authSettings = ramlAuth.settings;

  // Map scopes to the RAML object.
  if (authorization.scopes && authorization.scopes.length) {
    var scopeDescriptions = [];

    authSettings.scopes = authorization.scopes.map(function (scope) {
      var name = scope.scope;

      if (scope.description) {
        scopeDescriptions.push('* ' + name + ' - ' + scope.description);
      }

      return name;
    });

    // Push the scope descriptions onto the primary description.
    if (scopeDescriptions.length) {
      description.push('Available scopes: ');
      description.push(scopeDescriptions.join('\n'));
    }
  }

  // Map grant types into the raml object.
  Object.keys(authorization.grantTypes).forEach(function (grantType) {
    authSettings.authorizationGrants.push(GRANT_TYPE_MAP[grantType]);
  });

  if (implicit) {
    if (implicit.loginEndpoint && implicit.loginEndpoint.url) {
      authSettings.authorizationUri = implicit.loginEndpoint.url;
    }

    // Add a manual description if the token name is non-standard.
    if (implicit.tokenName && implicit.tokenName !== 'access_token') {
      description.push(
        'The token grant uses "' + implicit.tokenName + '" as the token name.'
      );
    }
  }

  if (authCode) {
    var tokenEndpoint        = authCode.tokenEndpoint;
    var tokenRequestEndpoint = authCode.tokenRequestEndpoint;
    var clientIdName         = tokenRequestEndpoint.clientIdName;
    var clientSecretName     = tokenRequestEndpoint.clientSecretName;
    var tokenName            = tokenEndpoint.tokenName;

    authSettings.accessTokenUri   = tokenEndpoint.url;
    authSettings.authorizationUri = tokenRequestEndpoint.url;

    if (clientIdName && clientIdName !== 'client_id') {
      description.push(
        'The code grant uses "' + clientIdName + '" as the parameter for ' +
        'passing the client id.'
      );
    }

    if (clientSecretName && clientSecretName !== 'client_secret') {
      description.push(
        'The code grant uses "' + clientSecretName + '" as the parameter ' +
        'for passing the client secret.'
      );
    }

    if (tokenName && tokenName !== 'access_code') {
      description.push(
        'The code grant uses "' + tokenName + '" as the parameter for ' +
        'passing the authorization token.'
      );
    }
  }

  // Add the description to the object if options are available.
  if (description.length) {
    ramlAuth.description = description.join('\n\n');
  }

  return ramlAuth;
}

/**
 * Convert the API key definition in Swagger to a RAML object.
 *
 * @param  {Object} authorization
 * @return {Object}
 */
function convertApiKey (authorization) {
  var ramlAuth = {
    type: 'x-api-key',
    describedBy: {}
  };

  var describedBy = API_KEY_PASS_AS_MAP[authorization.passAs];

  // If the described by property is valid,
  if (describedBy) {
    var description = ramlAuth.describedBy[describedBy] = {};

    // Set the correct parameter on the `describedBy` object.
    description[authorization.keyname] = {
      type:        'string',
      description: 'Used to send a valid API key for authentication.'
    };
  }

  return ramlAuth;
}

/**
 * Convert the basic auth definition in Swagger to a RAML object.
 *
 * @param  {Object} authorization
 * @return {Object}
 */
function convertBasicAuth (authorization) {
  return {
    type: 'Basic Authentication'
  };
}

},{"./utils/version":6}],4:[function(require,module,exports){
/**
 * Export the resource listing check.
 */
module.exports = isResourceListing;

/**
 * Check whether an object is a resource listing.
 *
 * @param  {Object}  resource
 * @return {Boolean}
 */
function isResourceListing (resource) {
  return !resource.basePath;
}

},{}],5:[function(require,module,exports){
/**
 * Export the resolve function.
 */
module.exports = resolve;

/**
 * Resolve a series of path segments.
 *
 * @return {String}
 */
function resolve () {
  return Array.prototype.reduce.call(arguments, function (path, part) {
    if (hasProtocol(part)) {
      return part;
    }

    if (isAbsolute(part)) {
      return path + part;
    }

    return path + '/' + part;
  });
}

/**
 * Check if the path begins with a protocol.
 *
 * @param  {String}  path
 * @return {Boolean}
 */
function hasProtocol (path) {
  return /^\w+:\//.test(path);
}

/**
 * Check if a path is absolute.
 *
 * @param  {String}  path
 * @return {Boolean}
 */
function isAbsolute (path) {
  return /^\//.test(path);
}

},{}],6:[function(require,module,exports){
/**
 * Export version function.
 */
module.exports = version;

/**
 * Retrieve the Swagger version from a specification.
 *
 * @param  {Object} declaration
 * @return {Number}
 */
function version (declaration) {
  return parseFloat(declaration.swaggerVersion || declaration.swagger);
}

},{}],7:[function(require,module,exports){
var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;
var undefined;

var isPlainObject = function isPlainObject(obj) {
	"use strict";
	if (!obj || toString.call(obj) !== '[object Object]' || obj.nodeType || obj.setInterval) {
		return false;
	}

	var has_own_constructor = hasOwn.call(obj, 'constructor');
	var has_is_property_of_method = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !has_own_constructor && !has_is_property_of_method) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {}

	return key === undefined || hasOwn.call(obj, key);
};

module.exports = function extend() {
	"use strict";
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === "boolean") {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if (typeof target !== "object" && typeof target !== "function" || target == undefined) {
			target = {};
	}

	for (; i < length; ++i) {
		// Only deal with non-null/undefined values
		if ((options = arguments[i]) != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target === copy) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
					if (copyIsArray) {
						copyIsArray = false;
						clone = src && Array.isArray(src) ? src : [];
					} else {
						clone = src && isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[name] = extend(deep, clone, copy);

				// Don't bring in undefined values
				} else if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};


},{}],8:[function(require,module,exports){
var parse                  = require('./lib/parse');
var resolve                = require('./lib/utils/resolve');
var isResourceListing      = require('./lib/utils/is-resource-listing');
var convertApiDeclaration  = require('./lib/api-declaration');
var convertResourceListing = require('./lib/resource-listing');

/**
 * Expose the swagger to raml object converter module.
 */
module.exports = swaggerToRamlObject;

/**
 * Convert swagger to a raml object by loading the file.
 *
 * @param {String}   filename
 * @param {Function} filereader
 * @param {Function} done
 */
function swaggerToRamlObject (filename, filereader, done) {
  var read = wrapFileReader(filereader);

  return read(filename, wrapContents(function (result) {
    if (!isResourceListing(result)) {
      return done(null, convertApiDeclaration(result));
    }

    // Parse the initial resource listing to start reading more resources.
    var ramlObject = convertResourceListing(result);
    var resources  = result.apis.map(function (api) {
      return resolve(filename, api.path);
    });

    return async(resources, read, wrapContents(function (results) {
      // Iterate over the resulting contents and convert into a single object.
      results.forEach(function (result) {
        convertApiDeclaration(result, ramlObject);
      });

      return done(null, ramlObject);
    }, done));
  }, done));
}

/**
 * Run a function on an array of items asynchonrously.
 *
 * @param {Array}    items
 * @param {Function} fn
 * @param {Function} done
 */
function async (items, fn, done) {
  var count   = 0;
  var length  = items.length;
  var results = [];
  var errored = false;

  items.forEach(function (item, index) {
    // Call the async function with the item and callback.
    fn(item, function (err, result) {
      if (errored) {
        return;
      }

      if (err) {
        return done(err);
      }

      count++
      results[index] = result;

      if (count === length) {
        return done(null, results);
      }
    });
  });
}

/**
 * Wrap the file reader functionality with parsing.
 *
 * @param  {Function} fn
 * @return {Function}
 */
function wrapFileReader (fn) {
  return function (filename, done) {
    return fn(filename, function (err, result) {
      if (err) {
        return done(err);
      }

      try {
        return done(null, parse(result));
      } catch (e) {
        return done(e);
      }
    });
  }
}

/**
 * Wrap the response from a file reader with parse ability.
 *
 * @param  {Function} resolve
 * @param  {Function} reject
 * @return {Function}
 */
function wrapContents (resolve, reject) {
  return function (err, result) {
    if (err) {
      return reject(err);
    }

    try {
      return resolve(result);
    } catch (e) {
      return reject(e);
    }
  };
}

},{"./lib/api-declaration":1,"./lib/parse":2,"./lib/resource-listing":3,"./lib/utils/is-resource-listing":4,"./lib/utils/resolve":5}]},{},[8])(8)
});