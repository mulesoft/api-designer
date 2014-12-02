!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.swaggerToRamlObject=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var extend         = require('extend');
var camelCase      = require('camel-case');
var getVersion     = require('./utils/version');
var compareVersion = require('./utils/version-equal');

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
  if (!compareVersion(declaration.apiVersion, ramlObject.version)) {
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
    var path     = api.path;
    var resource = ramlResource;

    // I assume this will always occur based on the Swagger specs I've seen.
    if (path.substr(0, relativeUri.length) === relativeUri) {
      path = path.substr(relativeUri.length);

      // If no raml resource exists, create it.
      if (!ramlResource) {
        resource = ramlResource = { relativeUri: relativeUri };

        ramlResources.push(resource);
      }

      // Only create a new subresource when the path has changed.
      if (path !== '') {
        resource = { relativeUri: path };

        ramlResource.resources = ramlResource.resources || [];
        ramlResource.resources.push(resource);
      }
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
      matchingResource = resource;

      return true;
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
    var method = { method: operation.method };

    if (operation.nickname) {
      method.displayName = operation.nickname;
    }

    if (operation.notes || operation.summary) {
      method.description = operation.notes || operation.summary;
    }

    if (operation.deprecated === 'true' || operation.deprecated === true) {
      if (!method.description) {
        method.description = '';
      } else {
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
 * Checks whether a uri parameter is valid.
 *
 * @param  {String}  name
 * @return {Boolean}
 */
function isValidUriParameterName (name) {
  return /^(?:[\w\.]|%\d{2})*$/.test(name);
}

/**
 * Correct resource uri parameters to be valid.
 *
 * @param  {Object} ramlResource
 * @return {Object}
 */
function sanitizeUriParameterNames (ramlResource) {
  /**
   * Replace uri parameters with valid names.
   *
   * @param  {String} match
   * @param  {String} name
   * @return {String}
   */
  function replaceParameters (match, name) {
    if (isValidUriParameterName(name)) {
      return match;
    }

    // Camelize invalid parameter names. Purely stylistic over the
    // alternative of using percent-encoding.
    var updatedName = camelCase(name);
    var uriParameters = ramlResource.uriParameters;

    // Move the uri parameter definition.
    if (uriParameters[name]) {
      uriParameters[updatedName] = uriParameters[name];
      delete uriParameters[name];
    }

    return '{' + updatedName + '}';
  }

  ramlResource.relativeUri = ramlResource.relativeUri
    .replace(/\{([^\}]+)\}/g, replaceParameters);

  return ramlResource;
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

    sanitizeUriParameterNames(ramlResource);
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

  if (params.length > 1) {
    throw new Error('Found ' + param.length + ' parameters for body type');
  }

  // Iterate over the consumes object and convert known types.
  params.forEach(function (param) {
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

},{"./utils/version":7,"./utils/version-equal":6,"camel-case":8,"extend":13}],2:[function(require,module,exports){
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

},{"./utils/version":7}],4:[function(require,module,exports){
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
 * Export the function.
 */
module.exports = versionEqual;

/**
 * Check whether the new version is the same as the previous version.
 *
 * @param  {String}  currentVersion
 * @param  {String}  newVersion
 * @return {Boolean}
 */
function versionEqual (currentVersion, newVersion) {
  // Allow the new version to be empty.
  if (newVersion == null) {
    return true;
  }

  var newVersionNumber     = Number(newVersion);
  var currentVersionNumber = Number(currentVersion);

  // If both are valid numbers, compare as numbers.
  if (newVersionNumber && currentVersionNumber) {
    return newVersionNumber === currentVersionNumber;
  }

  // Compare directly as strings.
  return currentVersion === newVersion;
}

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
var sentence = require('sentence-case');

/**
 * Camel case a string.
 *
 * @param  {String} string
 * @return {String}
 */
module.exports = function (string) {
  return sentence(string)
    // Replace periods between numeric entities with an underscore.
    .replace(/(\d) (?=\d)/g, '$1_')
    // Replace spaces between words with a string upper cased character.
    .replace(/ (\w)/g, function (_, $1) {
      return $1.toUpperCase();
    });
};

},{"sentence-case":9}],9:[function(require,module,exports){
var NON_WORD_REGEXP       = require('./vendor/non-word-regexp.js');
var CAMEL_CASE_REGEXP     = require('./vendor/camel-case-regexp.js');
var TRAILING_DIGIT_REGEXP = require('./vendor/trailing-digit-regexp.js');

/**
 * Sentence case a string.
 *
 * @param  {String} str
 * @return {String}
 */
module.exports = function (str) {
  if (str == null) {
    return '';
  }

  return String(str)
    // Enables camel case support.
    .replace(CAMEL_CASE_REGEXP, '$1 $2')
    // Add a space after any digits.
    .replace(TRAILING_DIGIT_REGEXP, '$1 $2')
    // Remove all non-word characters and replace with a single space.
    .replace(NON_WORD_REGEXP, ' ')
    // Trim whitespace around the string.
    .replace(/^ | $/g, '')
    // Finally lower case the entire string.
    .toLowerCase();
};

},{"./vendor/camel-case-regexp.js":10,"./vendor/non-word-regexp.js":11,"./vendor/trailing-digit-regexp.js":12}],10:[function(require,module,exports){
module.exports = /([\u0061-\u007A\u00B5\u00DF-\u00F6\u00F8-\u00FF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0561-\u0587\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7FA\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A])([\u0041-\u005A\u00C0-\u00D6\u00D8-\u00DE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA\uFF21-\uFF3A\u0030-\u0039\u00B2\u00B3\u00B9\u00BC-\u00BE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])/g;
},{}],11:[function(require,module,exports){
module.exports = /[^\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC\u0030-\u0039\u00B2\u00B3\u00B9\u00BC-\u00BE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19]+/g;
},{}],12:[function(require,module,exports){
module.exports = /([\u0030-\u0039\u00B2\u00B3\u00B9\u00BC-\u00BE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])([^\u0030-\u0039\u00B2\u00B3\u00B9\u00BC-\u00BE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])/g;
},{}],13:[function(require,module,exports){
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


},{}],14:[function(require,module,exports){
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

},{"./lib/api-declaration":1,"./lib/parse":2,"./lib/resource-listing":3,"./lib/utils/is-resource-listing":4,"./lib/utils/resolve":5}]},{},[14])(14)
});