RAML.Inspector = (function() {
  'use strict';

  var exports = {};

  var METHOD_ORDERING = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS', 'TRACE', 'CONNECT'];

  function extractResources(basePathSegments, api, securitySchemes) {
    var resources = [], apiResources = api.resources || [];

    apiResources.forEach(function(resource) {
      var resourcePathSegments = basePathSegments.concat(RAML.Client.createPathSegment(resource));
      var overview = exports.resourceOverviewSource(resourcePathSegments, resource);

      overview.methods = overview.methods.map(function(method) {
        return RAML.Inspector.Method.create(method, securitySchemes);
      });


      resources.push(overview);

      if (resource.resources) {
        var extracted = extractResources(resourcePathSegments, resource, securitySchemes);
        extracted.forEach(function(resource) {
          resources.push(resource);
        });
      }
    });

    return resources;
  }

  function groupResources(resources) {
    var currentPrefix, resourceGroups = [];

    (resources || []).forEach(function(resource) {
      var prefix = resource.pathSegments[0].toString();
      if (prefix === currentPrefix || prefix.indexOf(currentPrefix + '/') === 0) {
        resourceGroups[resourceGroups.length-1].push(resource);
      } else {
        currentPrefix = resource.pathSegments[0].toString();
        resourceGroups.push([resource]);
      }
    });

    return resourceGroups;
  }

  exports.resourceOverviewSource = function(pathSegments, resource) {
    var clone = RAML.Utils.clone(resource);

    clone.traits = resource.is;
    clone.resourceType = resource.type;
    clone.type = clone.is = undefined;
    clone.pathSegments = pathSegments;

    clone.methods = (resource.methods || []);

    clone.methods.sort(function(a, b) {
      var aOrder = METHOD_ORDERING.indexOf(a.method.toUpperCase());
      var bOrder = METHOD_ORDERING.indexOf(b.method.toUpperCase());

      return aOrder > bOrder ? 1 : -1;
    });

    clone.uriParametersForDocumentation = pathSegments
      .map(function(segment) { return segment.parameters; })
      .filter(function(params) { return !!params; })
      .reduce(function(accum, parameters) {
        for (var key in parameters) {
          var parameter = parameters[key];
          if (parameter) {
            parameter = (parameter instanceof Array) ? parameter : [ parameter ];
          }
          accum[key] = parameter;
        }
        return accum;
      }, {});

    clone.toString = function() {
      return this.pathSegments.map(function(segment) { return segment.toString(); }).join('');
    };

    return clone;
  };

  exports.create = function(api) {
    if (api.baseUri) {
      api.baseUri = RAML.Client.createBaseUri(api);
    }

    api.resources = extractResources([], api, api.securitySchemes);
    api.resourceGroups = groupResources(api.resources);

    return api;
  };

  return exports;
})();

(function() {
  'use strict';

  var PARAMETER = /\{\*\}/;

  function ensureArray(value) {
    if (value === undefined || value === null) {
      return;
    }

    return (value instanceof Array) ? value : [ value ];
  }

  function normalizeNamedParameters(parameters) {
    Object.keys(parameters || {}).forEach(function(key) {
      parameters[key] = ensureArray(parameters[key]);
    });
  }

  function wrapWithParameterizedHeader(name, definitions) {
    return definitions.map(function(definition) {
      return RAML.Inspector.ParameterizedHeader.fromRAML(name, definition);
    });
  }

  function filterHeaders(headers) {
    var filtered = {
      plain: {},
      parameterized: {}
    };

    Object.keys(headers || {}).forEach(function(key) {
      if (key.match(PARAMETER)) {
        filtered.parameterized[key] = wrapWithParameterizedHeader(key, headers[key]);
      } else {
        filtered.plain[key] = headers[key];
      }
    });

    return filtered;
  }

  function processBody(body) {
    var content = body['application/x-www-form-urlencoded'];
    if (content) {
      normalizeNamedParameters(content.formParameters);
    }

    content = body['multipart/form-data'];
    if (content) {
      normalizeNamedParameters(content.formParameters);
    }
  }

  function processResponses(responses) {
    Object.keys(responses).forEach(function(status) {
      var response = responses[status];
      if (response) {
        normalizeNamedParameters(response.headers);
      }
    });
  }

  function securitySchemesExtractor(securitySchemes) {
    securitySchemes = securitySchemes || [];

    return function() {
      var securedBy = this.securedBy || [],
          selectedSchemes = {};

      securedBy = securedBy.filter(function(name) {
        return name !== null && typeof name !== 'object';
      });

      securitySchemes.forEach(function(scheme) {
        securedBy.forEach(function(name) {
          if (scheme[name]) {
            selectedSchemes[name] = scheme[name];
          }
        });
      });

      return selectedSchemes;
    };
  }

  function allowsAnonymousAccess() {
    /*jshint validthis: true */
    var securedBy = this.securedBy || [null];
    return securedBy.some(function(name) { return name === null; });
  }

  RAML.Inspector.Method = {
    create: function(raml, securitySchemes) {
      var method = RAML.Utils.clone(raml);

      method.responseCodes = Object.keys(method.responses || {});
      method.securitySchemes = securitySchemesExtractor(securitySchemes);
      method.allowsAnonymousAccess = allowsAnonymousAccess;
      normalizeNamedParameters(method.headers);
      normalizeNamedParameters(method.queryParameters);

      method.headers = filterHeaders(method.headers);
      processBody(method.body || {});
      processResponses(method.responses || {});

      method.plainAndParameterizedHeaders = RAML.Utils.copy(method.headers.plain);
      Object.keys(method.headers.parameterized).forEach(function(parameterizedHeader) {
        method.plainAndParameterizedHeaders[parameterizedHeader] = method.headers.parameterized[parameterizedHeader].map(function(parameterized) {
          return parameterized.definition();
        });
      });

      return method;
    }
  };
})();

(function () {
  'use strict';

  function validate(value) {
    value = value ? value.trim() : '';

    if (value === '') {
      throw new Error();
    }

    return value;
  }

  function fromRAML(name, definition) {
    var parameterizedString = new RAML.Client.ParameterizedString(name, definition);

    return {
      create: function(value) {
        value = validate(value);

        var header = RAML.Utils.clone(definition);
        header.displayName = parameterizedString.render({'*': value});

        return header;
      },
      definition: function() {
        return definition;
      }
    };
  }

  RAML.Inspector.ParameterizedHeader = {
    fromRAML: fromRAML
  };
})();

'use strict';

(function() {
  var Client = function(configuration) {
    this.baseUri = configuration.getBaseUri();
  };

  function createConfiguration(parsed) {
    var config = {
      baseUriParameters: {}
    };

    return {
      baseUriParameters: function(baseUriParameters) {
        config.baseUriParameters = baseUriParameters || {};
      },

      getBaseUri: function() {
        var template = RAML.Client.createBaseUri(parsed);
        config.baseUriParameters.version = parsed.version;

        return template.render(config.baseUriParameters);
      }
    };
  }

  RAML.Client = {
    create: function(parsed, configure) {
      var configuration = createConfiguration(parsed);

      if (configure) {
        configure(configuration);
      }

      return new Client(configuration);
    },

    createBaseUri: function(rootRAML) {
      var baseUri = rootRAML.baseUri.toString().replace(/\/+$/, '');

      return new RAML.Client.ParameterizedString(baseUri, rootRAML.baseUriParameters, { parameterValues: {version: rootRAML.version} });
    },

    createPathSegment: function(resourceRAML) {
      return new RAML.Client.ParameterizedString(resourceRAML.relativeUri, resourceRAML.uriParameters);
    }
  };
})();

(function() {
  'use strict';

  RAML.Client.AuthStrategies = {
    for: function(scheme, credentials) {
      if (!scheme) {
        return RAML.Client.AuthStrategies.anonymous();
      }

      switch(scheme.type) {
      case 'Basic Authentication':
        return new RAML.Client.AuthStrategies.Basic(scheme, credentials);
      case 'OAuth 2.0':
        return new RAML.Client.AuthStrategies.Oauth2(scheme, credentials);
      case 'OAuth 1.0':
        return new RAML.Client.AuthStrategies.Oauth1(scheme, credentials);
      default:
        throw new Error('Unknown authentication strategy: ' + scheme.type);
      }
    }
  };
})();

'use strict';

(function() {
  var NO_OP_TOKEN = {
    sign: function() {}
  };

  var Anonymous = function() {};

  Anonymous.prototype.authenticate = function() {
    return {
      then: function(success) { success(NO_OP_TOKEN); }
    };
  };

  var anonymous = new Anonymous();

  RAML.Client.AuthStrategies.Anonymous = Anonymous;
  RAML.Client.AuthStrategies.anonymous = function() {
    return anonymous;
  };
})();

'use strict';

(function() {
  var Basic = function(scheme, credentials) {
    this.token = new Basic.Token(credentials);
  };

  Basic.prototype.authenticate = function() {
    var token = this.token;

    return {
      then: function(success) { success(token); }
    };
  };

  Basic.Token = function(credentials) {
    var words = CryptoJS.enc.Utf8.parse(credentials.username + ':' + credentials.password);
    this.encoded = CryptoJS.enc.Base64.stringify(words);
  };

  Basic.Token.prototype.sign = function(request) {
    request.header('Authorization', 'Basic ' + this.encoded);
  };

  RAML.Client.AuthStrategies.Basic = Basic;
})();

(function() {
  'use strict';

  var Oauth1 = function(scheme, credentials) {
    var signerFactory = RAML.Client.AuthStrategies.Oauth1.Signer.createFactory(scheme.settings, credentials);
    this.requestTemporaryCredentials = RAML.Client.AuthStrategies.Oauth1.requestTemporaryCredentials(scheme.settings, signerFactory);
    this.requestAuthorization = RAML.Client.AuthStrategies.Oauth1.requestAuthorization(scheme.settings);
    this.requestTokenCredentials = RAML.Client.AuthStrategies.Oauth1.requestTokenCredentials(scheme.settings, signerFactory);
  };

  Oauth1.parseUrlEncodedData = function(data) {
    var result = {};

    data.split('&').forEach(function(param) {
      var keyAndValue = param.split('=');
      result[keyAndValue[0]] = keyAndValue[1];
    });

    return result;
  };

  Oauth1.prototype.authenticate = function() {
    return this.requestTemporaryCredentials().then(this.requestAuthorization).then(this.requestTokenCredentials);
  };

  RAML.Client.AuthStrategies.Oauth1 = Oauth1;
})();

(function() {
  /* jshint camelcase: false */
  'use strict';

  var WINDOW_NAME = 'raml-console-oauth1';

  RAML.Client.AuthStrategies.Oauth1.requestAuthorization = function(settings) {
    return function requestAuthorization(temporaryCredentials) {
      var authorizationUrl = settings.authorizationUri + '?oauth_token=' + temporaryCredentials.token,
      deferred = $.Deferred();

      window.RAML.authorizationSuccess = function(authResult) {
        temporaryCredentials.verifier = authResult.verifier;
        deferred.resolve(temporaryCredentials);
      };
      window.open(authorizationUrl, WINDOW_NAME);
      return deferred.promise();
    };
  };
})();

(function() {
  /* jshint camelcase: false */
  'use strict';

  RAML.Client.AuthStrategies.Oauth1.requestTemporaryCredentials = function(settings, signerFactory) {
    return function requestTemporaryCredentials() {
      var request = RAML.Client.Request.create(settings.requestTokenUri, 'post');

      signerFactory().sign(request);

      return $.ajax(request.toOptions()).then(function(rawFormData) {
        var data = RAML.Client.AuthStrategies.Oauth1.parseUrlEncodedData(rawFormData);

        return {
          token: data.oauth_token,
          tokenSecret: data.oauth_token_secret
        };
      });
    };
  };

})();

(function() {
  /* jshint camelcase: false */
  'use strict';

  RAML.Client.AuthStrategies.Oauth1.requestTokenCredentials = function(settings, signerFactory) {
    return function requestTokenCredentials(temporaryCredentials) {
      var request = RAML.Client.Request.create(settings.tokenCredentialsUri, 'post');

      signerFactory(temporaryCredentials).sign(request);

      return $.ajax(request.toOptions()).then(function(rawFormData) {
        var credentials = RAML.Client.AuthStrategies.Oauth1.parseUrlEncodedData(rawFormData);

        return signerFactory({
          token: credentials.oauth_token,
          tokenSecret: credentials.oauth_token_secret
        });
      });
    };
  };
})();

(function() {
  /* jshint camelcase: false */
  'use strict';

  var Signer = RAML.Client.AuthStrategies.Oauth1.Signer = {};

  Signer.createFactory = function(settings, consumerCredentials) {
    settings = settings || {};

    return function createSigner(tokenCredentials) {
      var type = settings.signatureMethod === 'PLAINTEXT' ? 'Plaintext' : 'Hmac';
      var mode = tokenCredentials === undefined ? 'Temporary' : 'Token';

      return new Signer[type][mode](consumerCredentials, tokenCredentials);
    };
  };

  function baseParameters(consumerCredentials) {
    return {
      oauth_consumer_key: consumerCredentials.consumerKey,
      oauth_version: '1.0'
    };
  }

  Signer.generateTemporaryCredentialParameters = function(consumerCredentials) {
    var result = baseParameters(consumerCredentials);
    result.oauth_callback = RAML.Settings.oauth1RedirectUri;

    return result;
  };

  Signer.generateTokenCredentialParameters = function(consumerCredentials, tokenCredentials) {
    var result = baseParameters(consumerCredentials);

    result.oauth_token = tokenCredentials.token;
    if (tokenCredentials.verifier) {
      result.oauth_verifier = tokenCredentials.verifier;
    }

    return result;
  };

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
  Signer.rfc3986Encode = function(str) {
    return encodeURIComponent(str).replace(/[!'()]/g, window.escape).replace(/\*/g, '%2A');
  };

  Signer.setRequestHeader = function(params, request) {
    var header = Object.keys(params).map(function(key) {
      return key + '="' + Signer.rfc3986Encode(params[key]) + '"';
    }).join(', ');

    request.header('Authorization', 'OAuth ' + header);
  };
})();

(function() {
  /* jshint camelcase: false */
  'use strict';

  var generateTemporaryCredentialParameters = RAML.Client.AuthStrategies.Oauth1.Signer.generateTemporaryCredentialParameters,
      generateTokenCredentialParameters = RAML.Client.AuthStrategies.Oauth1.Signer.generateTokenCredentialParameters,
      rfc3986Encode = RAML.Client.AuthStrategies.Oauth1.Signer.rfc3986Encode,
      setRequestHeader = RAML.Client.AuthStrategies.Oauth1.Signer.setRequestHeader;

  function generateSignature(params, request, key) {
    params.oauth_signature_method = 'HMAC-SHA1';
    params.oauth_timestamp = Math.floor(Date.now() / 1000);
    params.oauth_nonce = CryptoJS.lib.WordArray.random(16).toString();

    var data = Hmac.constructHmacText(request, params);
    var hash = CryptoJS.HmacSHA1(data, key);
    params.oauth_signature = hash.toString(CryptoJS.enc.Base64);
  }

  var Hmac = {
    constructHmacText: function(request, oauthParams) {
      var options = request.toOptions();

      return [
        options.type.toUpperCase(),
        this.encodeURI(options.url),
        rfc3986Encode(this.encodeParameters(request, oauthParams))
      ].join('&');
    },

    encodeURI: function(uri) {
      var parser = document.createElement('a');
      parser.href = uri;

      var hostname = '';
      if (parser.protocol === 'https:' && parser.port === 443 || parser.protocol === 'http:' && parser.port === 80) {
        hostname = parser.hostname.toLowerCase();
      } else {
        hostname = parser.host.toLowerCase();
      }

      return rfc3986Encode(parser.protocol + '//' + hostname + parser.pathname);
    },

    encodeParameters: function(request, oauthParameters) {
      var params = request.queryParams();
      var formParams = {};
      if (request.toOptions().contentType === 'application/x-www-form-urlencoded') {
        formParams = request.data();
      }

      var result = [];
      for (var key in params) {
        result.push([rfc3986Encode(key), rfc3986Encode(params[key])]);
      }

      for (var formKey in formParams) {
        result.push([rfc3986Encode(formKey), rfc3986Encode(formParams[formKey])]);
      }

      for (var oauthKey in oauthParameters) {
        result.push([rfc3986Encode(oauthKey), rfc3986Encode(oauthParameters[oauthKey])]);
      }

      result.sort(function(a, b) {
        return (a[0] === b[0] ? a[1].localeCompare(b[1]) : a[0].localeCompare(b[0]));
      });

      return result.map(function(tuple) { return tuple.join('='); }).join('&');
    }
  };

  Hmac.Temporary = function(consumerCredentials) {
    this.consumerCredentials = consumerCredentials;
  };

  Hmac.Temporary.prototype.sign = function(request) {
    var params = generateTemporaryCredentialParameters(this.consumerCredentials);
    var key = rfc3986Encode(this.consumerCredentials.consumerSecret) + '&';

    generateSignature(params, request, key);
    setRequestHeader(params, request);
  };

  Hmac.Token = function(consumerCredentials, tokenCredentials) {
    this.consumerCredentials = consumerCredentials;
    this.tokenCredentials = tokenCredentials;
  };

  Hmac.Token.prototype.sign = function(request) {
    var params = generateTokenCredentialParameters(this.consumerCredentials, this.tokenCredentials);
    var key = rfc3986Encode(this.consumerCredentials.consumerSecret) + '&' + rfc3986Encode(this.tokenCredentials.tokenSecret);

    generateSignature(params, request, key);
    setRequestHeader(params, request);
  };

  RAML.Client.AuthStrategies.Oauth1.Signer.Hmac = Hmac;
})();

(function() {
  /* jshint camelcase: false */
  'use strict';

  var generateTemporaryCredentialParameters = RAML.Client.AuthStrategies.Oauth1.Signer.generateTemporaryCredentialParameters,
      generateTokenCredentialParameters = RAML.Client.AuthStrategies.Oauth1.Signer.generateTokenCredentialParameters,
      rfc3986Encode = RAML.Client.AuthStrategies.Oauth1.Signer.rfc3986Encode,
      setRequestHeader = RAML.Client.AuthStrategies.Oauth1.Signer.setRequestHeader;

  var Plaintext = {};

  Plaintext.Temporary = function(consumerCredentials) {
    this.consumerCredentials = consumerCredentials;
  };

  Plaintext.Temporary.prototype.sign = function(request) {
    var params = generateTemporaryCredentialParameters(this.consumerCredentials);
    params.oauth_signature = rfc3986Encode(this.consumerCredentials.consumerSecret) + '&';
    params.oauth_signature_method = 'PLAINTEXT';

    setRequestHeader(params, request);
  };

  Plaintext.Token = function(consumerCredentials, tokenCredentials) {
    this.consumerCredentials = consumerCredentials;
    this.tokenCredentials = tokenCredentials;
  };

  Plaintext.Token.prototype.sign = function(request) {
    var params = generateTokenCredentialParameters(this.consumerCredentials, this.tokenCredentials);
    params.oauth_signature = rfc3986Encode(this.consumerCredentials.consumerSecret) + '&' + rfc3986Encode(this.tokenCredentials.tokenSecret);
    params.oauth_signature_method = 'PLAINTEXT';

    setRequestHeader(params, request);
  };

  RAML.Client.AuthStrategies.Oauth1.Signer.Plaintext = Plaintext;
})();

(function() {
  'use strict';

  var Oauth2 = function(scheme, credentials) {
    this.grant = RAML.Client.AuthStrategies.Oauth2.Grant.create(scheme.settings, credentials);
    this.tokenFactory = RAML.Client.AuthStrategies.Oauth2.Token.createFactory(scheme);
  };

  Oauth2.prototype.authenticate = function() {
    return this.grant.request().then(Oauth2.createToken(this.tokenFactory));
  };

  RAML.Client.AuthStrategies.Oauth2 = Oauth2;
})();

(function() {
  'use strict';

  RAML.Client.AuthStrategies.Oauth2.createToken = function(tokenFactory) {
    return function(token) {
      return tokenFactory(token);
    };
  };
})();

(function() {
  /* jshint camelcase: false */
  'use strict';

  RAML.Client.AuthStrategies.Oauth2.credentialsManager = function(credentials, responseType) {
    credentials.scopes = credentials.scopes || [];

    return {
      authorizationUrl : function(baseUrl) {
        return baseUrl +
          '?client_id=' + credentials.clientId +
          '&response_type=' + responseType +
          '&redirect_uri=' + RAML.Settings.oauth2RedirectUri +
          '&scope=' + encodeURIComponent(credentials.scopes.join(' '));
      },

      accessTokenParameters: function(code) {
        return {
          client_id: credentials.clientId,
          client_secret: credentials.clientSecret,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: RAML.Settings.oauth2RedirectUri
        };
      },

      clientCredentialsParameters: function () {
        return {
          client_id: credentials.clientId,
          client_secret: credentials.clientSecret,
          grant_type: 'client_credentials',
          scope: credentials.scopes.join(' ')
        };
      },

      resourceOwnerParameters: function () {
        var params = {
          username: credentials.username,
          password: credentials.password,
          grant_type: 'password',
          scope: credentials.scopes.join(' ')
        };

        if (!credentials.clientSecret) {
          params.client_id = credentials.clientId;
        }

        return params;
      },

      resourceOwnerHeaders: function () {
        if (!credentials.clientSecret) {
          return {};
        }

        var authorization = btoa(credentials.clientId + ':' + credentials.clientSecret);

        return {
          'Authorization': 'Bearer ' + authorization
        };
      }
    };
  };
})();

(function() {
  'use strict';

  var Oauth2 = RAML.Client.AuthStrategies.Oauth2;

  var grants = {
    code: true,
    token: true,
    owner: true,
    credentials: true
  };

  var Grant = {
    create: function(settings, credentials) {
      var type = credentials.grantType.type;
      var credentialsManager = Oauth2.credentialsManager(credentials, type);

      if (!grants[type]) {
        throw new Error('Unknown grant type: ' + type);
      }

      var className = type.charAt(0).toUpperCase() + type.slice(1);

      return new this[className](settings, credentialsManager);
    }
  };

  Grant.Code = function(settings, credentialsManager) {
    this.settings = settings;
    this.credentialsManager = credentialsManager;
  };

  Grant.Code.prototype.request = function() {
    var requestAuthorization = Oauth2.requestAuthorization(this.settings, this.credentialsManager);
    var requestAccessToken = Oauth2.requestAccessToken(this.settings, this.credentialsManager);

    return requestAuthorization.then(requestAccessToken);
  };

  Grant.Token = function(settings, credentialsManager) {
    this.settings = settings;
    this.credentialsManager = credentialsManager;
  };

  Grant.Token.prototype.request = function() {
    return Oauth2.requestAuthorization(this.settings, this.credentialsManager);
  };

  Grant.Owner = function(settings, credentialsManager) {
    this.settings = settings;
    this.credentialsManager = credentialsManager;
  };

  Grant.Owner.prototype.request = function() {
    var requestToken = Oauth2.requestOwnerToken(this.settings, this.credentialsManager);

    return requestToken();
  };

  Grant.Credentials = function(settings, credentialsManager) {
    this.settings = settings;
    this.credentialsManager = credentialsManager;
  };

  Grant.Credentials.prototype.request = function() {
    var requestToken = Oauth2.requestCredentialsToken(this.settings, this.credentialsManager);

    return requestToken();
  };

  Oauth2.Grant = Grant;
})();

(function() {
  /* jshint camelcase: false */
  'use strict';

  function accessTokenFromObject(data) {
    return data.access_token;
  }

  function accessTokenFromString(data) {
    var vars = data.split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) === 'access_token') {
        return decodeURIComponent(pair[1]);
      }
    }

    return undefined;
  }

  function extract(data) {
    var method = accessTokenFromString;

    if (typeof data === 'object') {
      method = accessTokenFromObject;
    }

    return method(data);
  }

  RAML.Client.AuthStrategies.Oauth2.requestAccessToken = function(settings, credentialsManager) {
    return function(code) {
      var request = RAML.Client.Request.create(settings.accessTokenUri, 'post');

      request.data(credentialsManager.accessTokenParameters(code));

      return $.ajax(request.toOptions()).then(extract);
    };
  };

  RAML.Client.AuthStrategies.Oauth2.requestCredentialsToken = function(settings, credentialsManager) {
    return function() {
      var request = RAML.Client.Request.create(settings.accessTokenUri, 'post');

      request.data(credentialsManager.clientCredentialsParameters());

      return $.ajax(request.toOptions()).then(extract);
    };
  };

  RAML.Client.AuthStrategies.Oauth2.requestOwnerToken = function(settings, credentialsManager) {
    return function() {
      var request = RAML.Client.Request.create(settings.accessTokenUri, 'post');

      request.headers(credentialsManager.resourceOwnerHeaders());
      request.data(credentialsManager.resourceOwnerParameters());

      return $.ajax(request.toOptions()).then(extract);
    };
  };
})();

(function() {
  'use strict';

  var WINDOW_NAME = 'raml-console-oauth2';

  RAML.Client.AuthStrategies.Oauth2.requestAuthorization = function(settings, credentialsManager) {
    var authorizationUrl = credentialsManager.authorizationUrl(settings.authorizationUri),
        deferred = $.Deferred();

    window.RAML.authorizationSuccess = function(code) { deferred.resolve(code); };
    window.open(authorizationUrl, WINDOW_NAME);
    return deferred.promise();
  };
})();

(function() {
  /* jshint camelcase: false */
  'use strict';

  function tokenConstructorFor(scheme) {
    var describedBy = scheme.describedBy || {},
        headers = describedBy.headers || {},
        queryParameters = describedBy.queryParameters || {};

    if (headers.Authorization) {
      return Header;
    }

    if (queryParameters.access_token) {
      return QueryParameter;
    }

    return Header;
  }

  var Header = function(accessToken) {
    this.accessToken = accessToken;
  };

  Header.prototype.sign = function(request) {
    request.header('Authorization', 'Bearer ' + this.accessToken);
  };

  var QueryParameter = function(accessToken) {
    this.accessToken = accessToken;
  };

  QueryParameter.prototype.sign = function(request) {
    request.queryParam('access_token', this.accessToken);
  };

  RAML.Client.AuthStrategies.Oauth2.Token = {
    createFactory: function(scheme) {
      var TokenConstructor = tokenConstructorFor(scheme);

      return function createToken(value) {
        return new TokenConstructor(value);
      };
    }
  };
})();

(function() {
  'use strict';

  var templateMatcher = /\{([^}]*)\}/g;

  function tokenize(template) {
    var tokens = template.split(templateMatcher);

    return tokens.filter(function(token) {
      return token.length > 0;
    });
  }

  function rendererFor(template, uriParameters) {
    var requiredParameters = Object.keys(uriParameters || {}).filter(function(name) {
      return uriParameters[name].required;
    });

    return function renderer(context) {
      context = context || {};

      requiredParameters.forEach(function(name) {
        if (!context[name]) {
          throw new Error('Missing required uri parameter: ' + name);
        }
      });

      var templated = template.replace(templateMatcher, function(match, parameterName) {
        return context[parameterName] || '';
      });

      return templated;
    };
  }

  RAML.Client.ParameterizedString = function(template, uriParameters, options) {
    options = options || {parameterValues: {} };
    template = template.replace(templateMatcher, function(match, parameterName) {
      if (options.parameterValues[parameterName]) {
        return options.parameterValues[parameterName];
      }
      return '{' + parameterName + '}';
    });

    this.parameters = uriParameters;
    this.templated = Object.keys(this.parameters || {}).length > 0;
    this.tokens = tokenize(template);
    this.render = rendererFor(template, uriParameters);
    this.toString = function() { return template; };
  };
})();

(function() {
  'use strict';

  RAML.Client.PathBuilder = {
    create: function(pathSegments) {
      return function pathBuilder(contexts) {
        contexts = contexts || [];

        return pathSegments.map(function(pathSegment, index) {
          return pathSegment.render(contexts[index]);
        }).join('');
      };
    }
  };
})();

(function() {
  'use strict';

  var CONTENT_TYPE = 'content-type';
  var FORM_DATA = 'multipart/form-data';

  var RequestDsl = function(options) {
    var rawData;
    var queryParams;
    var isMultipartRequest;

    this.data = function(data) {
      if (data === undefined) {
        return RAML.Utils.clone(rawData);
      } else {
        rawData = data;
      }
    };

    this.queryParams = function(parameters) {
      if (parameters === undefined) {
        return RAML.Utils.clone(queryParams);
      } else {
        queryParams = parameters;
      }
    };

    this.queryParam = function(name, value) {
      queryParams = queryParams || {};
      queryParams[name] = value;
    };

    this.header = function(name, value) {
      options.headers = options.headers || {};

      if (name.toLowerCase() === CONTENT_TYPE) {
        if (value === FORM_DATA) {
          isMultipartRequest = true;
          options.contentType = false;
          return;
        } else {
          isMultipartRequest = false;
          options.contentType = value;
        }
      }

      options.headers[name] = value;
    };

    this.headers = function(headers) {
      options.headers = {};
      isMultipartRequest = false;

      for (var name in headers) {
        this.header(name, headers[name]);
      }
    };

    this.toOptions = function() {
      var o = RAML.Utils.copy(options);
      o.traditional = true;

      if (rawData) {
        if (isMultipartRequest) {
          var data = new FormData();

          var appendValueForKey = function(key) {
            return function(value) {
              data.append(key, value);
            };
          };

          for (var key in rawData) {
            rawData[key].forEach(appendValueForKey(key));
          }

          o.processData = false;
          o.data = data;
        } else {
          o.processData = true;
          o.data = rawData;
        }
      }

      if (!RAML.Utils.isEmpty(queryParams)) {
        var separator = (options.url.match('\\?') ? '&' : '?');
        o.url = options.url + separator + $.param(queryParams, true);
      }

      if (!RAML.Services.Config.config.disableProxy && RAML.Settings.proxy) {
        o.url = RAML.Settings.proxy + o.url;
      }

      return o;
    };
  };

  RAML.Client.Request = {
    create: function(url, method) {
      return new RequestDsl({ url: url, type: method });
    }
  };
})();

(function() {
  'use strict';

  // number regular expressions from http://yaml.org/spec/1.2/spec.html#id2804092

  var RFC1123 = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), \d{2} (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4} \d{2}:\d{2}:\d{2} GMT$/;

  function isEmpty(value) {
    return value === null || value === undefined || value === '';
  }

  var VALIDATIONS = {
    required: function(value) { return !isEmpty(value); },
    boolean: function(value) { return isEmpty(value) || value === 'true' || value === 'false'; },
    enum: function(enumeration) {
      return function(value) {
        return isEmpty(value) || enumeration.some(function(item) { return item === value; });
      };
    },
    integer: function(value) { return isEmpty(value) || !!/^-?(0|[1-9][0-9]*)$/.exec(value); },
    number: function(value) { return isEmpty(value) || !!/^-?(0|[1-9][0-9]*)(\.[0-9]*)?([eE][-+]?[0-9]+)?$/.exec(value); },
    minimum: function(minimum) {
      return function(value) {
        return isEmpty(value) || value >= minimum;
      };
    },
    maximum: function(maximum) {
      return function(value) {
        return isEmpty(value) || value <= maximum;
      };
    },
    minLength: function(minimum) {
      return function(value) {
        return isEmpty(value) || value.length >= minimum;
      };
    },
    maxLength: function(maximum) {
      return function(value) {
        return isEmpty(value) || value.length <= maximum;
      };
    },
    pattern: function(pattern) {
      var regex = new RegExp(pattern);

      return function(value) {
        return isEmpty(value) || !!regex.exec(value);
      };
    },
    date: function(value) { return isEmpty(value) || !!RFC1123.exec(value); }
  };

  function baseValidations(definition) {
    var validations = {};

    if (definition.required) {
      validations.required = VALIDATIONS.required;
    }

    return validations;
  }

  function numberValidations(validations, definition) {
    if (definition.minimum) {
      validations.minimum = VALIDATIONS.minimum(definition.minimum);
    }

    if (definition.maximum) {
      validations.maximum = VALIDATIONS.maximum(definition.maximum);
    }
  }

  // function copyValidations(validations, types) {
  //   Object.keys(types).forEach(function(type) {
  //     validations[type] = VALIDATIONS[type](types[type]);
  //   });
  // }

  var VALIDATIONS_FOR_TYPE = {
    string: function(definition) {
      var validations = baseValidations(definition);
      if (definition.enum) {
        validations.enum = VALIDATIONS.enum(definition.enum);
      }
      if (definition.minLength) {
        validations.minLength = VALIDATIONS.minLength(definition.minLength);
      }
      if (definition.maxLength) {
        validations.maxLength = VALIDATIONS.maxLength(definition.maxLength);
      }
      if (definition.pattern) {
        validations.pattern = VALIDATIONS.pattern(definition.pattern);
      }
      return validations;
    },

    integer: function(definition) {
      var validations = baseValidations(definition);
      validations.integer = VALIDATIONS.integer;
      numberValidations(validations, definition);
      return validations;
    },

    number: function(definition) {
      var validations = baseValidations(definition);
      validations.number = VALIDATIONS.number;
      numberValidations(validations, definition);
      return validations;
    },

    boolean: function(definition) {
      var validations = baseValidations(definition);
      validations.boolean = VALIDATIONS.boolean;
      return validations;
    },

    date: function(definition) {
      var validations = baseValidations(definition);
      validations.date = VALIDATIONS.date;
      return validations;
    }
  };

  function Validator(validations) {
    this.validations = validations;
  }

  Validator.prototype.validate = function(value) {
    var errors;

    for (var validation in this.validations) {
      if (!this.validations[validation](value)) {
        errors = errors || [];
        errors.push(validation);
      }
    }

    return errors;
  };

  Validator.from = function(definition) {
    if (!definition) {
      throw new Error('definition is required!');
    }

    var validations;

    if (VALIDATIONS_FOR_TYPE[definition.type]) {
      validations = VALIDATIONS_FOR_TYPE[definition.type](definition);
    } else {
      validations = {};
    }

    return new Validator(validations);
  };

  RAML.Client.Validator = Validator;
})();

'use strict';

(function() {
  RAML.Controllers = {};
})();

(function() {
  'use strict';

  RAML.Controllers.BodyDocumentation = function bodyDocumentationController($scope, DataStore) {
    $scope.bodyKey =  $scope.keyBase + ':body';
    $scope.displayed = {};

    $scope.expandSchema = function(contentType) {
      var key = $scope.bodyKey + ':schemaExpanded:' + contentType;
      return DataStore.set(key, true);
    };

    $scope.schemaExpanded = function(contentType) {
      var key = $scope.bodyKey + ':schemaExpanded:' + contentType;
      return DataStore.get(key);
    };
  };
})();

(function() {
  'use strict';

  var FORM_MIME_TYPES = ['application/x-www-form-urlencoded', 'multipart/form-data'];

  function hasFormParameters(method) {
    return FORM_MIME_TYPES.some(function(type) {
      return method.body && method.body[type] && !RAML.Utils.isEmpty(method.body[type].formParameters);
    });
  }

  var controller = function($scope) {
    $scope.documentation = this;
    $scope.generateKey = function(base, method) {
      return base + ':' + method.method;
    };

    function hasUriParameters() {
      return $scope.resource.pathSegments.some(function(segment) {
        return segment.templated;
      });
    }

    function hasParameters() {
      return !!(hasUriParameters() || $scope.method.queryParameters ||
        !RAML.Utils.isEmpty($scope.method.headers.plain) || hasFormParameters($scope.method));
    }

    function hasTraits(method) {
      return method.is && method.is.length > 0;
    }

    this.hasRequestDocumentation = function() {
      return hasTraits($scope.method) || !!$scope.method.description || hasParameters() || !RAML.Utils.isEmpty($scope.method.body);
    };

    this.hasResponseDocumentation = function() {
      return !RAML.Utils.isEmpty($scope.method.responses);
    };
  };

  controller.prototype.isEmpty = function(params) {
    return RAML.Utils.isEmpty(params);
  };

  RAML.Controllers.Documentation = controller;
})();

'use strict';

(function() {
  var controller = function($scope) {
    $scope.namedParametersDocumentation = this;
  };

  controller.prototype.constraints = function(parameter) {
    var result = '';

    if (parameter.required) {
      result += 'required, ';
    }

    if (parameter.enum) {
      result += 'one of (' + parameter.enum.join(', ') + ')';
    } else {
      result += parameter.type;
    }

    if (parameter.pattern) {
      result += ' matching ' + parameter.pattern;
    }

    if (parameter.minLength && parameter.maxLength) {
      result += ', ' + parameter.minLength + '-' + parameter.maxLength + ' characters';
    } else if (parameter.minLength && !parameter.maxLength) {
      result += ', at least ' + parameter.minLength + ' characters';
    } else if (parameter.maxLength && !parameter.minLength) {
      result += ', at most ' + parameter.maxLength + ' characters';
    }


    if (parameter.minimum && parameter.maximum) {
      result += ' between ' + parameter.minimum + '-' + parameter.maximum;
    } else if (parameter.minimum && !parameter.maximum) {
      result += ' ≥ ' + parameter.minimum;
    } else if (parameter.maximum && !parameter.minimum) {
      result += ' ≤ ' + parameter.maximum;
    }

    if (parameter.repeat) {
      result += ', repeatable';
    }

    if (parameter.default) {
      result += ', default: ' + parameter.default;
    }

    return result;
  };

  RAML.Controllers.NamedParametersDocumentation = controller;
})();

(function() {
  'use strict';

  var controller = function($scope, $attrs, ramlParserWrapper) {
    $scope.ramlConsole = this;

    if ($attrs.hasOwnProperty('withRootDocumentation')) {
      this.withRootDocumentation = true;
    }

    if ($scope.src) {
      ramlParserWrapper.load($scope.src);
    }

    this.keychain = {};
    this.config   = RAML.Services.Config.config;
    this.settings = RAML.Settings;
  };

  controller.prototype.gotoView = function(view) {
    this.view = view;
  };

  controller.prototype.tryItEnabled = function() {
    return !!(this.api && this.api.baseUri);
  };

  controller.prototype.showRootDocumentation = function() {
    return this.withRootDocumentation && this.api && this.api.documentation && this.api.documentation.length > 0;
  };

  RAML.Controllers.RAMLConsole = controller;
})();

(function() {
  'use strict';

  function generateKey(resource) {
    return resource.toString();
  }

  RAML.Controllers.Resource = function Resource($scope, DataStore, $element) {
    $scope.resourceView = this;
    $scope.$emit('console:resource:rendered', $scope.resource, $element);
    $scope.$on('$destroy', function() {
      $scope.$emit('console:resource:destroyed', $scope.resource);
    });

    this.expanded = DataStore.get(generateKey($scope.resource));

    this.openDocumentation = function($event, method) {
      $event.stopPropagation();

      this.expanded || this.toggleExpansion();
      $scope.$emit('console:expand', $scope.resource, method, $element);
    };

    this.toggleExpansion = function() {
      this.expanded = !this.expanded;
      DataStore.set(generateKey($scope.resource), this.expanded);
    };
  };
})();

'use strict';

(function() {
  function Controller($scope, DataStore) {
    this.tabs = [];
    this.DataStore = DataStore;
    this.key = $scope.keyBase + ':tabset';

    $scope.tabset = this;
  }

  Controller.prototype.select = function(tab, dontPersist) {
    if (tab.disabled) {
      return;
    }

    if (!dontPersist) {
      this.DataStore.set(this.key, tab.heading);
    }

    this.tabs.forEach(function(item) {
      item.active = false;
    });

    tab.active = true;
    this.active = tab;
  };

  Controller.prototype.addTab = function(tab) {
    var previouslyEnabled = this.DataStore.get(this.key) === tab.heading,
        allOthersDisabled = this.tabs.every(function(tab) { return tab.disabled; });

    if (allOthersDisabled || previouslyEnabled) {
      this.select(tab, this.DataStore.get(this.key));
    }

    this.tabs.push(tab);
  };


  RAML.Controllers.tabset = Controller;
})();

'use strict';

(function() {
  var controller = function($scope, DataStore) {
    this.DataStore = DataStore;
    this.key = $scope.keyBase + ':toggle';
    this.toggleItems = $scope.toggleItems = [];
    this.toggleModel = $scope.toggleModel || {};

    $scope.toggle = this;
  };

  controller.prototype.select = function(toggleItem, dontPersist) {
    this.toggleModel.selected = undefined;
    this.toggleItems.forEach(function(toggleItem) {
      toggleItem.active = false;
    });

    toggleItem.active = true;
    this.toggleModel.selected = toggleItem.heading;

    if (!dontPersist) {
      this.DataStore.set(this.key, toggleItem.heading);
    }
  };

  controller.prototype.addToggleItem = function(toggleItem) {
    var previouslyEnabled = this.DataStore.get(this.key) === toggleItem.heading,
        noneActive = this.toggleItems.every(function(toggleItem) { return !toggleItem.active; });

    if (noneActive || previouslyEnabled) {
      this.select(toggleItem, true);
    }

    this.toggleItems.push(toggleItem);
  };

  RAML.Controllers.toggle = controller;
})();

'use strict';

(function() {
  function parseHeaders(headers) {
    var parsed = {}, key, val, i;

    if (!headers) {
      return parsed;
    }

    headers.split('\n').forEach(function(line) {
      i = line.indexOf(':');
      key = line.substr(0, i).trim().toLowerCase();
      val = line.substr(i + 1).trim();

      if (key) {
        if (parsed[key]) {
          parsed[key] += ', ' + val;
        } else {
          parsed[key] = val;
        }
      }
    });

    return parsed;
  }

  var apply;

  var TryIt = function($scope, DataStore) {
    $scope.apiClient = this;

    var baseKey = $scope.resource.toString() + ':' + $scope.method.method;
    $scope.baseKey = function() {
      return baseKey;
    };

    var contextKey = baseKey + ':context';
    var responseKey = baseKey + ':response';

    var context = new RAML.Controllers.TryIt.Context($scope.resource, $scope.method);
    var oldContext = DataStore.get(contextKey);

    if (oldContext) {
      context.merge(oldContext);
    }

    this.context = $scope.context = context;
    this.response = DataStore.get(responseKey);

    DataStore.set(contextKey, this.context);

    this.method = $scope.method;
    this.httpMethod = $scope.method.method;
    this.parsed = $scope.api;
    this.securitySchemes = $scope.method.securitySchemes();
    this.keychain = $scope.ramlConsole.keychain;

    apply = function() {
      $scope.$apply.apply($scope, arguments);
    };

    this.setResponse = function(response) {
      DataStore.set(responseKey, response);
      $scope.apiClient.response = response;
      return response;
    };
  };

  TryIt.prototype.inProgress = function() {
    return (this.response && !this.response.status && !this.missingUriParameters);
  };

  TryIt.prototype.execute = function() {
    this.missingUriParameters = false;
    this.disallowedAnonymousRequest = false;

    var response = this.setResponse({});

    function handleResponse(jqXhr) {
      response.body = jqXhr.responseText,
      response.status = jqXhr.status,
      response.headers = parseHeaders(jqXhr.getAllResponseHeaders());

      if (response.headers['content-type']) {
        response.contentType = response.headers['content-type'].split(';')[0];
      }
      apply();
    }

    var url;
    try {
      var pathBuilder = this.context.pathBuilder;
      var client = RAML.Client.create(this.parsed, function(client) {
        client.baseUriParameters(pathBuilder.baseUriContext);
      });
      url = response.requestUrl = client.baseUri + pathBuilder(pathBuilder.segmentContexts);
    } catch (e) {
      this.setResponse(undefined);
      this.missingUriParameters = true;
      return;
    }

    var request = RAML.Client.Request.create(url, this.httpMethod);

    if (!RAML.Utils.isEmpty(this.context.queryParameters.data())) {
      request.queryParams(this.context.queryParameters.data());
    }

    if (!RAML.Utils.isEmpty(this.context.headers.data())) {
      request.headers(this.context.headers.data());
    }

    if (this.context.bodyContent) {
      request.header('Content-Type', this.context.bodyContent.selected);
      request.data(this.context.bodyContent.data());
    }

    var authStrategy;

    try {
      if (this.keychain.selected === 'Anonymous' && !this.method.allowsAnonymousAccess()) {
        this.disallowedAnonymousRequest = true;
      }

      var scheme = this.securitySchemes && this.securitySchemes[this.keychain.selected];
      var credentials = this.keychain[this.keychain.selected];
      authStrategy = RAML.Client.AuthStrategies.for(scheme, credentials);
    } catch (e) {
      // custom strategies aren't supported yet.
    }

    authStrategy.authenticate().then(function(token) {
      token.sign(request);
      $.ajax(request.toOptions()).then(
        function(data, textStatus, jqXhr) { handleResponse(jqXhr); },
        function(jqXhr) { handleResponse(jqXhr); }
      );
    });
  };

  RAML.Controllers.TryIt = TryIt;
})();

(function() {
  'use strict';

  var FORM_URLENCODED = 'application/x-www-form-urlencoded';
  var FORM_DATA = 'multipart/form-data';

  var BodyContent = function(contentTypes) {
    this.contentTypes = Object.keys(contentTypes);
    this.selected = this.contentTypes[0];

    var definitions = this.definitions = {};
    this.contentTypes.forEach(function(contentType) {
      var definition = contentTypes[contentType] || {};

      switch (contentType) {
      case FORM_URLENCODED:
      case FORM_DATA:
        definitions[contentType] = new RAML.Controllers.TryIt.NamedParameters(definition.formParameters);
        break;
      default:
        definitions[contentType] = new RAML.Controllers.TryIt.BodyType(definition);
      }
    });
  };

  BodyContent.prototype.isForm = function(contentType) {
    return contentType === FORM_URLENCODED || contentType === FORM_DATA;
  };

  BodyContent.prototype.isSelected = function(contentType) {
    return contentType === this.selected;
  };

  BodyContent.prototype.fillWithExample = function($event) {
    $event.preventDefault();
    this.definitions[this.selected].fillWithExample();
  };

  BodyContent.prototype.hasExample = function(contentType) {
    return this.definitions[contentType].hasExample();
  };

  BodyContent.prototype.data = function() {
    if (this.selected) {
      return this.definitions[this.selected].data();
    }
  };

  BodyContent.prototype.copyFrom = function(oldContent) {
    var content = this;

    oldContent.contentTypes.forEach(function(contentType) {
      if (content.definitions[contentType]) {
        content.definitions[contentType].copyFrom(oldContent.definitions[contentType]);
      }
    });

    if (this.contentTypes.some(function(contentType) { return contentType === oldContent.selected; })) {
      this.selected = oldContent.selected;
    }
  };

  RAML.Controllers.TryIt.BodyContent = BodyContent;
})();

(function() {
  'use strict';

  var BodyType = function(contentType) {
    this.contentType = contentType || {};
    this.value = undefined;
  };

  BodyType.prototype.fillWithExample = function() {
    this.value = this.contentType.example;
  };

  BodyType.prototype.hasExample = function() {
    return !!this.contentType.example;
  };

  BodyType.prototype.data = function() {
    return this.value;
  };

  BodyType.prototype.copyFrom = function(oldBodyType) {
    this.value = oldBodyType.value;
  };

  RAML.Controllers.TryIt.BodyType = BodyType;
})();

(function() {
  'use strict';

  var Context = function(resource, method) {
    this.headers = new RAML.Controllers.TryIt.NamedParameters(method.headers.plain, method.headers.parameterized);
    this.queryParameters = new RAML.Controllers.TryIt.NamedParameters(method.queryParameters);
    if (method.body) {
      this.bodyContent = new RAML.Controllers.TryIt.BodyContent(method.body);
    }

    this.pathBuilder = new RAML.Client.PathBuilder.create(resource.pathSegments);
    this.pathBuilder.baseUriContext = {};
    this.pathBuilder.segmentContexts = resource.pathSegments.map(function() {
      return {};
    });
  };

  Context.prototype.merge = function(oldContext) {
    this.headers.copyFrom(oldContext.headers);
    this.queryParameters.copyFrom(oldContext.queryParameters);
    if (this.bodyContent && oldContext.bodyContent) {
      this.bodyContent.copyFrom(oldContext.bodyContent);
    }

    this.pathBuilder.baseUriContext = oldContext.pathBuilder.baseUriContext;
    this.pathBuilder.segmentContexts = oldContext.pathBuilder.segmentContexts;
  };

  RAML.Controllers.TryIt.Context = Context;
})();

(function() {
  'use strict';

  var NamedParameter = function(definitions) {
    this.definitions = definitions;
    this.selected = definitions[0].type;
  };

  NamedParameter.prototype.hasMultipleTypes = function() {
    return this.definitions.length > 1;
  };

  NamedParameter.prototype.isSelected = function(definition) {
    return this.selected === definition.type;
  };

  RAML.Controllers.TryIt.NamedParameter = NamedParameter;
})();

(function() {
  'use strict';

  function copy(object) {
    var shallow = {};
    Object.keys(object || {}).forEach(function(key) {
      shallow[key] = new RAML.Controllers.TryIt.NamedParameter(object[key]);
    });

    return shallow;
  }

  function filterEmpty(object) {
    var copy = {};

    Object.keys(object).forEach(function(key) {
      var values = object[key].filter(function(value) {
        return value !== undefined && value !== null && (typeof value !== 'string' || value.trim().length > 0);
      });

      if (values.length > 0) {
        copy[key] = values;
      }
    });

    return copy;
  }

  var NamedParameters = function(plain, parameterized) {
    this.plain = copy(plain);
    this.parameterized = parameterized;

    Object.keys(parameterized || {}).forEach(function(key) {
      parameterized[key].created = [];
    });

    this.values = {};
    Object.keys(this.plain).forEach(function(key) {
      this.values[key] = [undefined];
    }.bind(this));
  };

  NamedParameters.prototype.create = function(name, value) {
    var parameters = this.parameterized[name];

    var definition = parameters.map(function(parameterizedHeader) {
      return parameterizedHeader.create(value);
    });

    var parameterizedName = definition[0].displayName;

    parameters.created.push(parameterizedName);
    this.plain[parameterizedName] = new RAML.Controllers.TryIt.NamedParameter(definition);
    this.values[parameterizedName] = [undefined];
  };

  NamedParameters.prototype.remove = function(name) {
    delete this.plain[name];
    delete this.values[name];
    return;
  };

  NamedParameters.prototype.data = function() {
    return filterEmpty(this.values);
  };

  NamedParameters.prototype.copyFrom = function(oldParameters) {
    var parameters = this;

    Object.keys(oldParameters.parameterized || {}).forEach(function(key) {
      if (parameters.parameterized[key]) {
        oldParameters.parameterized[key].created.forEach(function(createdParam) {
          parameters.plain[createdParam] = oldParameters.plain[createdParam];
        });
      }
    });

    var keys = Object.keys(oldParameters.plain || {}).filter(function(key) {
      return parameters.plain[key];
    });

    keys.forEach(function(key) {
      parameters.values[key] = oldParameters.values[key];
    });
  };

  RAML.Controllers.TryIt.NamedParameters = NamedParameters;
})();

'use strict';

(function() {
  RAML.Directives = {};
})();

(function() {
  'use strict';

  RAML.Directives.apiResources = function() {
    var controller = function($scope) {
      var self = $scope.apiResources = this;
      this.collapsed = {};

      this.toggleAll = function(collapsed) {
        $scope.api.resourceGroups.forEach(function(group) {
          var key = self.keyFor(group);
          self.collapsed[key] = collapsed;
        });
      };

      this.isCollapsed = function(group) {
        var key = self.keyFor(group);
        return self.collapsed[key];
      };
    };

    controller.prototype.keyFor = function(group) {
      return group[0].pathSegments[0].toString();
    };

    return {
      restrict: 'E',
      templateUrl: 'views/api_resources.tmpl.html',
      replace: true,
      controller: controller
    };
  };
})();

'use strict';

(function() {
  RAML.Directives.basicAuth = function() {
    return {
      restrict: 'E',
      templateUrl: 'views/basic_auth.tmpl.html',
      replace: true,
      scope: {
        credentials: '='
      }
    };
  };
})();

(function() {
  'use strict';

  RAML.Directives.bodyContent = function() {

    return {
      restrict: 'E',
      templateUrl: 'views/body_content.tmpl.html',
      replace: true,
      scope: {
        body: '='
      }
    };
  };
})();

(function() {
  'use strict';

  RAML.Directives.bodyDocumentation = function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'views/body_documentation.tmpl.html',
      scope: {
        body: '=',
        keyBase: '='
      },
      controller: RAML.Controllers.BodyDocumentation
    };
  };
})();

(function() {
  'use strict';

  var formatters = {
    'application/json' : function(code) {
      return vkbeautify.json(code);
    },
    'text/xml' : function(code) {
      return vkbeautify.xml(code);
    },
    'default' : function(code) {
      return code;
    }
  };

  function sanitize(options) {
    var code = options.code || '',
        formatter = formatters[options.mode] || formatters.default;

    try {
      options.code = formatter(code);
    } catch(e) {}
  }

  var Controller = function($scope, $element) {
    sanitize($scope);

    this.editor = new CodeMirror($element[0], {
      mode: $scope.mode,
      readOnly: true,
      value: $scope.code,
      lineNumbers: true,
      indentUnit: 4
    });

    this.editor.setSize('100%', '100%');
  };

  Controller.prototype.refresh = function(options) {
    sanitize(options);
    this.editor.setOption('mode', options.mode);
    this.editor.setValue(options.code);

    this.editor.refresh();
  };

  var link = function(scope, element, attrs, editor) {
    var watchCode = function() {
      return scope.visible && scope.code;
    };

    scope.$watch(watchCode, function(visible) {
      if (visible) { editor.refresh(scope); }
    });
  };

  RAML.Directives.codeMirror = function() {
    return {
      link: link,
      restrict: 'A',
      replace: true,
      controller: Controller,
      scope: {
        code: '=codeMirror',
        visible: '=',
        mode: '@?'
      }
    };
  };

  RAML.Directives.codeMirror.Controller = Controller;
})();

(function() {
  'use strict';

  var Controller = function($scope) {
    this.toggle = function() {
      $scope.collapsed = !$scope.collapsed;
    };
  };

  RAML.Directives.collapsible = function($parse) {
    return {
      controller: Controller,
      restrict: 'EA',
      scope: true,
      link: function(scope, element, attrs) {
        if (!attrs.collapsed && !attrs.expanded) {
          scope.collapsed = true;
          return;
        }

        var attr = attrs.collapsed || attrs.expanded;
        var normalizeForAttribute = function(arg) {
          return attrs.expanded ? !arg : arg;
        };

        scope.collapsed = normalizeForAttribute($parse(attr)(scope));

        scope.$watch(attr, function(value) {
          scope.collapsed = normalizeForAttribute(value);
        });

        scope.$watch('collapsed', function(collapsed) {
          $parse(attr).assign(scope.$parent, normalizeForAttribute(collapsed));

          element.removeClass('collapsed expanded');
          element.addClass(collapsed ? 'collapsed' : 'expanded');
        });
      }
    };
  };

  RAML.Directives.collapsibleToggle = function() {
    return {
      require: '^collapsible',
      restrict: 'EA',
      link: function(scope, element, attrs, controller) {
        element.bind('click', function() {
          scope.$apply(controller.toggle);
        });
      }
    };
  };

  RAML.Directives.collapsibleContent = function() {
    return {
      require: '^collapsible',
      restrict: 'EA',
      link: function(scope, element) {
        scope.$watch('collapsed', function(collapsed) {
          element.css('display', collapsed ? 'none' : 'block');
        });
      }
    };
  };
})();

(function() {
  'use strict';

  RAML.Directives.documentation = function() {
    return {
      controller: RAML.Controllers.Documentation,
      restrict: 'E',
      templateUrl: 'views/documentation.tmpl.html',
      replace: true
    };
  };
})();

(function() {
  'use strict';

  RAML.Directives.enum = function($timeout, $filter) {
    var KEY_DOWN  = 40,
        KEY_UP    = 38,
        KEY_ENTER = 13;

    function correctHeight(el, container) {
      var enumRect = el.getBoundingClientRect(),
          containerRect = container.getBoundingClientRect(),
          top = enumRect.top,
          bottom = enumRect.bottom;

      if (top <= containerRect.top) {
        top = containerRect.top;
      }

      if (bottom >= containerRect.bottom) {
        bottom = containerRect.bottom;
      }

      return bottom - top;
    }

    var link = function($scope, $el) {
      function filterEnumElements() {
        $scope.filteredEnum = $filter('filter')($scope.options, $scope.$parent.model);
      }

      $scope.$watch('$parent.model', filterEnumElements);

      $scope.selectItem = function(item) {
        $scope.model = $scope.$parent.model = item;
        $scope.focused = false;
      };

      filterEnumElements();

      $el.find('input').bind('focus', function() {
        $scope.$apply(function() {
          $scope.selectedIndex = -1;
          $scope.focused = true;
        });
      });

      $el.find('input').bind('blur', function() {
        $scope.$apply(function() {
          $scope.model = $scope.$parent.model;
          $scope.focused = false;
        });
      });

      $el.bind('mousedown', function(event) {
        if (event.target.tagName === 'LI') {
          event.preventDefault();
        }
      });

      $el.find('input').bind('input', function() {
        $scope.$apply(function() {
          $scope.focused = true;
          $scope.selectedIndex = 0;
        });
      });

      $el.find('input').bind('keydown', function(e) {
        switch (e.keyCode) {
        case KEY_UP:
          $scope.selectedIndex = $scope.selectedIndex - 1;
          $scope.selectedIndex = Math.max(0, $scope.selectedIndex);
          e.preventDefault();

          break;
        case KEY_DOWN:
          $scope.selectedIndex = $scope.selectedIndex + 1;
          $scope.selectedIndex = Math.min($scope.filteredEnum.length - 1, $scope.selectedIndex);
          e.preventDefault();
          break;
        case KEY_ENTER:
          var selection = $scope.filteredEnum[$scope.selectedIndex];

          if (selection) {
            $scope.selectItem(selection);
          }
          e.preventDefault();
          break;
        }
        $scope.$apply();
      });

      $scope.$watch('focused', function() {
        $scope.filteredEnum = $scope.options;

        setTimeout(function() {
          var ul = $el.find('ul'), container = $el[0].offsetParent;
          ul.css('max-height', null);

          if ($scope.containedBy) {
            container = document.querySelector($scope.containedBy);
          }

          if(!container) {
            return;
          }

          ul.css('max-height', correctHeight(ul[0], container) + 'px');
          filterEnumElements();
          $scope.$digest();
        });
      });
    };

    return {
      restrict: 'E',
      transclude: true,
      link: link,
      templateUrl: 'views/enum.tmpl.html',
      scope: {
        options: '=',
        model: '=',
        containedBy: '='
      }
    };
  };
})();

(function(angular) {
  'use strict';

  var inputOverride = angular.module('fileInputOverride', []);

  // enhancement to ng-model for input[type="file"]
  // code for this directive taken from:
  // https://github.com/marcenuc/angular.js/commit/2bfff4668c341ddcfec0120c9a5018b0c2463982

  // since angular (as of version 1.2.3) breaks our enhancement to the input directive for files
  // we are disabling it (for only file type inputs) with this decorator.

  inputOverride.config(['$provide', function($provide) {
    $provide.decorator('inputDirective', ['$delegate', function($delegate) {
      angular.forEach($delegate, function(inputDirective) {
        var originalCompile = inputDirective.compile;
        inputDirective.compile = function(element, attrs) {
          if (!attrs.type || attrs.type.toLowerCase() !== 'file') {
            return originalCompile.apply(this, arguments);
          } else {
            return function(scope, element, attr, ctrl) {
              element.bind('change', function() {
                scope.$apply(function() {
                  var files = element[0].files;
                  var viewValue = attr.multiple ? files : files[0];

                  ctrl.$setViewValue(viewValue);
                });
              });
            };
          }
        };
      });
      return $delegate;
    }]);
  }]);
})(window.angular);

(function() {
  'use strict';

  RAML.Directives.markdown = function($sanitize) {
    var converter = new Showdown.converter({ extensions: ['table'] });

    var link = function(scope, element) {
      var processMarkdown = function(markdown) {
        var result = converter.makeHtml(markdown || '');
        element.html($sanitize(result));
      };

      scope.$watch('markdown', processMarkdown);
    };

    return {
      restrict: 'A',
      link: link,
      scope: {
        markdown: '='
      }
    };
  };
})();

(function() {
  'use strict';

  RAML.Directives.method = function() {
    return {
      restrict: 'E',
      templateUrl: 'views/method.tmpl.html',
      replace: true
    };
  };
})();

'use strict';

(function() {
  var Controller = function($scope) {
    $scope.displayParameters = function() {
      var parameters = $scope.parameters || {};
      parameters.plain = parameters.plain || {};
      parameters.parameterized = parameters.parameterized || {};

      return Object.keys(parameters.plain).length > 0 || Object.keys(parameters.parameterized).length > 0;
    };
  };

  RAML.Directives.namedParameters = function() {
    return {
      restrict: 'E',
      controller: Controller,
      templateUrl: 'views/named_parameters.tmpl.html',
      replace: true,
      scope: {
        heading: '@',
        parameters: '='
      }
    };
  };
})();

(function() {
  'use strict';

  RAML.Directives.namedParametersDocumentation = function() {
    return {
      restrict: 'E',
      replace: true,
      controller: RAML.Controllers.NamedParametersDocumentation,
      templateUrl: 'views/named_parameters_documentation.tmpl.html',
      scope: {
        heading: '@',
        parameters: '='
      }
    };
  };
})();

'use strict';

(function() {
  RAML.Directives.oauth1 = function() {
    return {
      restrict: 'E',
      templateUrl: 'views/oauth1.tmpl.html',
      replace: true,
      scope: {
        credentials: '='
      }
    };
  };
})();

'use strict';

(function() {
  RAML.Directives.oauth2 = function() {

    var GRANT_TYPES = [
      { name: 'Implicit', type: 'token' },
      { name: 'Authorization Code', type: 'code' },
      { name: 'Client Credentials', type: 'credentials' },
      { name: 'Resource Owner Password Credentials', type: 'owner' }
    ];

    var controller = function($scope) {
      var scopes              = $scope.scheme.settings.scopes || [];
      var authorizationGrants = $scope.scheme.settings.authorizationGrants;

      $scope.grantTypes = GRANT_TYPES.filter(function (grant) {
        return authorizationGrants.indexOf(grant.type) > -1;
      });

      $scope.credentials = {
        clientId: '',
        clientSecret: '',
        username: '',
        password: '',
        scopes: scopes.slice(),
        grantType: $scope.grantTypes[0]
      };

      $scope.toggleScope = function (scope) {
        var index = $scope.credentials.scopes.indexOf(scope);

        if (index === -1) {
          $scope.credentials.scopes.push(scope);
        } else {
          $scope.credentials.scopes.splice(index, 1);
        }
      };

      $scope.scopes = scopes;

      $scope.$watch('credentials.grantType.type', function (type) {
        $scope.hasClientSecret      = type !== 'token';
        $scope.hasOwnerCredentials  = type === 'owner';
        $scope.requiresClientSecret = $scope.hasClientSecret && type !== 'owner';
      });
    };

    return {
      restrict: 'E',
      templateUrl: 'views/oauth2.tmpl.html',
      replace: true,
      controller: controller,
      scope: {
        scheme: '=',
        credentials: '='
      }
    };
  };
})();

'use strict';

(function() {

  var Controller = function($scope) {
    $scope.placeholder = $scope.placeholder || $scope.definition.example;

    if ($scope.definition.type === 'file') {
      $scope.inputType = 'file';
    } else if (!!$scope.definition.enum) {
      $scope.inputType = 'enum';
    } else {
      $scope.inputType = 'default';
    }
  };

  RAML.Directives.parameterField = function() {
    return {
      restrict: 'E',
      templateUrl: 'views/parameter_field.tmpl.html',
      controller: Controller,
      scope: {
        name: '=',
        model: '=',
        definition: '=',
        placeholder: '=?',
        invalidClass: '@?',
        containedBy: '@'
      }
    };
  };
})();

'use strict';

(function() {


  RAML.Directives.parameterFields = function() {
    return {
      restrict: 'E',
      templateUrl: 'views/parameter_fields.tmpl.html',
      scope: {
        parameters: '=',
      }
    };
  };
})();

(function() {
  'use strict';

  var Controller = function($scope) {
    $scope.parameterFactory = this;

    this.parameterName = $scope.parameterName;
    this.parameters = $scope.parameters;
  };

  Controller.prototype.open = function($event) {
    $event.preventDefault();
    this.opened = true;
  };

  Controller.prototype.create = function($event) {
    $event.preventDefault();

    try {
      this.parameters.create(this.parameterName, this.value);
      this.opened = false;
      this.value = this.status = '';
    } catch (e) {
      this.status = 'error';
    }
  };

  RAML.Directives.parameterizedParameter = function() {
    return {
      restrict: 'E',
      templateUrl: 'views/parameterized_parameter.tmpl.html',
      replace: true,
      controller: Controller,
      scope: {
        parameters: '=',
        parameterName: '='
      }
    };
  };
})();

(function() {
  'use strict';

  RAML.Directives.ramlConsole = function(ramlParserWrapper, DataStore, $timeout) {

    var link = function ($scope, $el, $attrs, controller) {
      $scope.popOverOpen = function() {
        if (!$scope.api) {
          return false;
        }

        var currentlyDisplayed = DataStore.get($scope.api.title + ':popup');
        return $scope.api.resources.some(function(resource) {
          return resource.toString() === currentlyDisplayed;
        });
      };

      ramlParserWrapper.onParseSuccess(function(raml) {
        var inner = $($el[0]).find('.inner');

        if (inner.length) {
          var height = inner[0].scrollHeight;
          inner.css('height', height);
        }

        $scope.api = controller.api = RAML.Inspector.create(raml);
        $timeout(function() {
          inner.css('height', 'auto');
        }, 0);
      });

      ramlParserWrapper.onParseError(function(error) {
        $scope.parseError = error;
      });
    };

    return {
      restrict: 'E',
      templateUrl: 'views/raml-console.tmpl.html',
      controller: RAML.Controllers.RAMLConsole,
      scope: {
        src: '@'
      },
      link: link
    };
  };
})();

(function() {
  'use strict';

  RAML.Directives.ramlConsoleInitializer = function(ramlParserWrapper) {
    var controller = function($scope) {
      $scope.consoleLoader = this;
    };

    controller.prototype.load = function() {
      ramlParserWrapper.load(this.location);
      this.finished = true;
    };

    controller.prototype.parse = function() {
      ramlParserWrapper.parse(this.raml);
      this.finished = true;
    };

    var link = function($scope, $element, $attrs, controller) {
      if (document.location.search.indexOf('?raml=') !== -1) {
        controller.location = document.location.search.replace('?raml=', '');
        controller.load();
      }
    };

    return { restrict: 'E', controller: controller, link: link };
  };
})();

(function() {
  'use strict';

  RAML.Directives.resource = function() {
    return {
      restrict: 'E',
      templateUrl: 'views/resource.tmpl.html',
      replace: true,
      controller: RAML.Controllers.Resource
    };
  };
})();

(function() {
  'use strict';

  function calculateContainerPosition(container, consoleContainer, rect) {
    container.style.top = consoleContainer.scrollTop + rect.top - consoleContainer.offsetTop + 'px';
    container.style.bottom = consoleContainer.scrollTop + rect.bottom + 'px';
    container.style.height = rect.bottom - rect.top + 'px';
  }

  function calculateContainerHeight(container, consoleContainer) {
    container.css('height', consoleContainer[0].clientHeight - 10 + 'px');
    container[0].style.top = consoleContainer[0].scrollTop + 5 + 'px';
  }

  function createPopover(element) {
    var consoleContainer = angular.element(document.body).find('raml-console').parent(),
        resourceList = angular.element(document.getElementById('raml-console')),
        placeholder = angular.element(element[0].querySelector('.resource-placeholder')),
        container = angular.element(element[0].querySelector('.resource-container')),
        rect;

    return {
      open: function($scope, $resourceEl, resource, method) {
        $scope.resource = resource;

        consoleContainer.css('overflow', 'hidden');
        placeholder.css('height', resourceList[0].scrollHeight + 'px');
        container.addClass('grow-expansion-animation');

        setTimeout(function() {
          rect = $resourceEl[0].getBoundingClientRect();
          calculateContainerPosition(container[0], consoleContainer[0], rect);

          setTimeout(function() {
            placeholder.addClass('masked');
            calculateContainerHeight(container, consoleContainer);
            $scope.selectedMethod = method;
            $scope.$digest();
          });
        });
      },

      close: function($scope) {
        calculateContainerPosition(container[0], consoleContainer[0], rect);
        setTimeout(function() {
          placeholder.removeClass('masked');

          setTimeout(function() {
            container.removeClass('grow-expansion-animation');
            consoleContainer.css('overflow', 'auto');

            $scope.$apply('resource = undefined');
            $scope.$apply('selectedMethod = undefined');
          }, 200);
        });
      },

      resize: function() {
        calculateContainerHeight(container, consoleContainer);
      }
    };
  }

  RAML.Directives.resourceDocumentation = function($rootScope, $window, DataStore) {
    var popover;
    angular.element($window).bind('resize', function() {
      if (popover) {
        popover.resize();
      }
    });
    function prepare($scope, $element, $resourceEl, resource, method) {
      $scope.selectMethod = function(method) {
        DataStore.set(resource.toString() + ':method', method.method);
        $scope.selectedMethod = method;
        $scope.keyBase = resource.toString() +':' + method.method;
      };

      $scope.closePopover = function(e) {
        e.preventDefault();

        DataStore.set(resource.toString() + ':method', undefined);
        popover.close($scope);
        popover = undefined;
      };

      popover = createPopover($element);
      popover.open($scope, $resourceEl, resource, method);
      $scope.selectMethod(method);
    }

    function Controller($scope, $element) {
      var receipt;

      $rootScope.$on('console:resource:destroyed', function(event, resource) {
        if ($scope.resource && $scope.resource.toString() === resource.toString()) {
          receipt = setTimeout(function() {
            popover.close($scope);
            popover = undefined;
          }, 100);
        }
      });

      $rootScope.$on('console:resource:rendered', function(event, resource, $resourceEl) {
        var methodName = DataStore.get(resource.toString() + ':method');
        if (methodName) {
          var method = resource.methods.filter(function(method) {
            return method.method === methodName;
          })[0] || resource.methods[0];

          if (method) {
            if (receipt && $scope.resource && $scope.resource.toString() === resource.toString()) {
              clearTimeout(receipt);
              $scope.resource = resource;
              $scope.selectedMethod = method;
            } else {
              prepare($scope, $element, $resourceEl, resource, method);
            }
          }
        }
      });

      $rootScope.$on('console:expand', function(event, resource, method, $resourceEl) {
        prepare($scope, $element, $resourceEl, resource, method);
      });

    }

    return {
      restrict: 'E',
      templateUrl: 'views/resource_documentation.tmpl.html',
      controller: Controller,
      scope: {
        api: '=',
        ramlConsole: '='
      }
    };
  };
})();

(function() {
  'use strict';

  RAML.Directives.repeatable = function($parse) {
    var controller = function($scope, $attrs) {
      this.repeatable = function() {
        return $parse($attrs.repeatable)($scope);
      };

      this.new = function() {
        $scope.repeatableModel.push('');
      };

      this.remove = function(index) {
        $scope.repeatableModel.splice(index, 1);
      };
    };

    return {
      restrict: 'EA',
      templateUrl: 'views/repeatable.tmpl.html',
      transclude: true,
      controller: controller,
      link: function(scope, element, attrs) {
        scope.repeatable = !attrs.repeatable || $parse(attrs.repeatable)(scope);
        scope.repeatableModel = $parse(attrs.repeatableModel)(scope);

        scope.$watch('repeatableModel', function(value) {
          $parse(attrs.repeatableModel).assign(scope, value);
        }, true);
      }
    };
  };
})();

'use strict';

(function() {
  RAML.Directives.repeatableAdd = function() {
    return {
      require: '^repeatable',
      restrict: 'E',
      template: '<i class="fa fa-plus-square" ng-show="visible" ng-click="new()"></i>',
      scope: true,
      link: function(scope, element, attrs, controller) {
        scope.$watch('$last', function(last) {
          scope.visible = controller.repeatable() && last;
        });

        scope.new = function() {
          controller.new();
        };
      }
    };
  };
})();

'use strict';

(function() {
  RAML.Directives.repeatableRemove = function() {
    return {
      require: '^repeatable',
      restrict: 'E',
      template: '<i class="fa fa-times-circle" ng-show="visible" ng-click="remove()"></i>',
      scope: true,
      link: function(scope, element, attrs, controller) {
        scope.$watch('repeatableModel.length', function(length) {
          scope.visible = controller.repeatable() && length > 1;
        });

        scope.remove = function() {
          var index = scope.$index;
          controller.remove(index);
        };
      }
    };
  };
})();

'use strict';

(function() {
  RAML.Directives.responses = function() {
    return {
      restrict: 'E',
      templateUrl: 'views/responses.tmpl.html'
    };
  };
})();

(function() {
  'use strict';

  RAML.Directives.rootDocumentation = function() {
    return {
      restrict: 'E',
      templateUrl: 'views/root_documentation.tmpl.html',
      replace: true
    };
  };
})();

'use strict';

(function() {
  RAML.Directives.securitySchemes = function() {

    var controller = function($scope) {
      $scope.securitySchemes = this;
    };

    controller.prototype.supports = function(scheme) {
      return scheme.type === 'OAuth 2.0' ||
        scheme.type === 'OAuth 1.0' ||
        scheme.type === 'Basic Authentication';
    };

    return {
      restrict: 'E',
      templateUrl: 'views/security_schemes.tmpl.html',
      replace: true,
      controller: controller,
      scope: {
        schemes: '=',
        keychain: '=',
        baseKey: '='
      }
    };
  };
})();

(function() {
  'use strict';

  (function() {
    RAML.Directives.consoleTabset = function() {
      return {
        restrict: 'E',
        templateUrl: 'views/tabset.tmpl.html',
        replace: true,
        transclude: true,
        controller: RAML.Controllers.tabset,
        scope: {
          heading: '@',
          keyBase: '@'
        }
      };
    };
  })();

  (function() {
    function Controller($scope) {
      this.registerSubtabs = function(subtabs, keyBase) {
        $scope.subtabs = subtabs;
        $scope.keyBase = keyBase;
      };

      this.registerUriBar = function(uriBar) {
        $scope.uriBar = uriBar;
      };
    }

    RAML.Directives.consoleTab = function($location, $anchorScroll, DataStore) {
      return {
        restrict: 'E',
        templateUrl: 'views/tab.tmpl.html',
        replace: true,
        transclude: true,
        require: '^consoleTabset',
        controller: Controller,
        link: function($scope, $element, $attrs, tabsetCtrl) {
          var selected = DataStore.get($scope.keyBase);

          $scope.select = function(subItem) {
            selected = subItem;

            var responseCode = $('#'+ selected)[0],
                container = $element.parent()[0];

            container.scrollTop = responseCode.offsetTop - container.getBoundingClientRect().top + responseCode.offsetParent.getBoundingClientRect().top;
            DataStore.set($scope.keyBase, selected);
          };

          $scope.selected = function(subItem) {
            return (selected || $scope.subtabs[0]) === subItem;
          };

          tabsetCtrl.addTab($scope);
        },
        scope: {
          active: '=',
          disabled: '=',
          heading: '@',
        }
      };
    };
  })();

  (function() {
    RAML.Directives.subtabs = function() {
      return {
        restrict: 'E',
        require: '^consoleTab',
        link: function($scope, $element, $attrs, tabCtrl) {
          tabCtrl.registerSubtabs($scope.tabs, $scope.keyBase);
        },
        scope: {
          tabs: '=',
          keyBase: '@'
        }
      };
    };
  })();

  (function() {
    RAML.Directives.uriBar = function() {
      return {
        restrict: 'E',
        require: '^consoleTab',
        link: function($scope, $element, $attrs, tabCtrl) {
          $attrs.$observe('pathBuilder', function(pathBuilder) {
            if (!pathBuilder) {
              return;
            }

            tabCtrl.registerUriBar($scope);
          });
        },
        scope: {
          pathBuilder: '=',
          baseUri: '=',
          pathSegments: '='
        }
      };
    };
  })();
})();

(function() {
  'use strict';

  RAML.Directives.toggle = function() {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      controller: RAML.Controllers.toggle,
      templateUrl: 'views/toggle.tmpl.html',
      scope: {
        keyBase: '@',
        toggleModel: '=?'
      }
    };
  };
})();

(function() {
  'use strict';

  var link = function($scope, $element, $attrs, toggleCtrl) {
    toggleCtrl.addToggleItem($scope);
  };

  RAML.Directives.toggleItem = function() {
    return {
      restrict: 'E',
      require: '^toggle',
      replace: true,
      transclude: true,
      link: link,
      templateUrl: 'views/toggle-item.tmpl.html',
      scope: {
        heading: '@',
        active: '=?'
      }
    };
  };
})();

(function() {
  'use strict';

  RAML.Directives.tryIt = function(DataStore) {
    return {
      restrict: 'E',
      templateUrl: 'views/try_it.tmpl.html',
      replace: true,
      link: function($scope) {
        // fix that ensures the try it display is updated
        // when switching between methods in the resource popover.
        $scope.$watch('method', function() {
          new RAML.Controllers.TryIt($scope, DataStore);
        });
      }
    };
  };
})();

(function() {
  'use strict';
  RAML.Directives.validatedInput = function($parse) {

    var Controller = function($attrs) {
      this.constraints = $parse($attrs.constraints);
    };

    Controller.prototype.validate = function(scope, value) {
      var constraints = this.constraints(scope);
      var validator = RAML.Client.Validator.from(constraints);

      return validator.validate(value);
    };

    var link = function($scope, $el, $attrs, controllers) {
      var modelController    = controllers[0],
          validateController = controllers[1],
          errorClass = $parse($attrs.invalidClass)($scope) || 'warning';

      function validateField() {
        var errors = validateController.validate($scope, modelController.$modelValue);

        if (errors) {
          $el.addClass(errorClass);
        } else {
          $el.removeClass(errorClass);
        }
      }

      $el.bind('blur', function() {
        $scope.$apply(validateField);
      });

      $el.bind('focus', function() {
        $scope.$apply(function() {
          $el.removeClass(errorClass);
        });
      });

      angular.element($el[0].form).bind('submit', function() {
        $scope.$apply(validateField);
      });
    };

    return {
      restrict: 'A',
      require: ['ngModel', 'validatedInput'],
      controller: Controller,
      link: link
    };
  };
})();

RAML.Filters = {};

(function() {
  'use strict';

  RAML.Filters.nameFromParameterizable = function() {
    return function(input) {
      if (typeof input === 'object' && input !== null) {
        return Object.keys(input)[0];
      } else if (input) {
        return input;
      } else {
        return undefined;
      }
    };
  };
})();

(function() {
  'use strict';

  RAML.Filters.yesNo = function() {
    return function(input) {
      return input ? 'Yes' : 'No';
    };
  };
})();

(function() {
  'use strict';

  RAML.Services = {};
})();

(function () {
  'use strict';

  /**
   * Store configuration in local storage under the current key.
   *
   * @type {String}
   */
  var STORAGE_KEY = 'raml-console-config';

  /**
   * This is extremely hacky but done because the entire app avoids using
   * the dependency injection in angular.
   *
   * @type {Object}
   */
  var config = {
    disableProxy: false
  };

  /**
   * Create a persistent configuration instance that works with angular.
   */
  RAML.Services.Config = function ($rootScope, $window) {
    /**
     * Update the config object when local storage changes.
     *
     * @param {Object} e
     */
    function handleStorage(e) {
      if (e.key !== STORAGE_KEY) {
        return;
      }

      // Update the config with the updated storage value.
      try {
        $scope.$apply(function () {
          angular.copy(JSON.parse(e.newValue), config);
        });
      } catch (e) {}
    }

    /**
     * Attempt to get the value out of local storage.
     *
     * @return {Object}
     */
    function getStorage() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY));
      } catch (e) {}
    }

    /**
     * Attempt to set the value in local storage.
     *
     * @param {Object} value
     */
    function setStorage(value) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
        return true;
      } catch (e) {}

      return false;
    }

    var $scope = $rootScope.$new();
    $scope.config = angular.extend(config, getStorage());

    // When the config options change, save into local storage.
    $scope.$watchCollection('config', setStorage, true);

    // Listen for local storage changes to persist across frames.
    if ($window.addEventListener) {
      $window.addEventListener('storage', handleStorage, false);
    } else {
      $window.attachEvent('onstorage', handleStorage);
    }

    return config;
  };

  // Alias the config for access outside angular.
  RAML.Services.Config.config = config;
})();

(function() {
  'use strict';

  RAML.Services.DataStore = function() {
    var store = {};

    return {
      get: function(key) {
        var entry = store[key];
        if (!entry) {
          return;
        } else {
          return entry.value;
        }
      },
      set: function(key, value) {
        store[key] = {
          valid: true,
          value: value
        };
      },
      reset: function() {
        store = {};
      }
    };
  };
})();

(function() {
  'use strict';

  RAML.Services.RAMLParserWrapper = function($rootScope, ramlParser, $q) {
    var ramlProcessor, errorProcessor, whenParsed, PARSE_SUCCESS = 'event:raml-parsed';

    var load = function(file) {
      setPromise(ramlParser.loadFile(file));
    };

    var parse = function(raml) {
      setPromise(ramlParser.load(raml));
    };

    var onParseSuccess = function(cb) {
      ramlProcessor = function() {
        cb.apply(this, arguments);
        if (!$rootScope.$$phase) {
          // handle aggressive digesters!
          $rootScope.$digest();
        }
      };

      if (whenParsed) {
        whenParsed.then(ramlProcessor);
      }
    };

    var onParseError = function(cb) {
      errorProcessor = function() {
        cb.apply(this, arguments);
        if (!$rootScope.$$phase) {
          // handle aggressive digesters!
          $rootScope.$digest();
        }
      };

      if (whenParsed) {
        whenParsed.then(undefined, errorProcessor);
      }

    };

    var setPromise = function(promise) {
      whenParsed = promise;

      if (ramlProcessor || errorProcessor) {
        whenParsed.then(ramlProcessor, errorProcessor);
      }
    };

    $rootScope.$on(PARSE_SUCCESS, function(e, raml) {
      setPromise($q.when(raml));
    });

    return {
      load: load,
      parse: parse,
      onParseSuccess: onParseSuccess,
      onParseError: onParseError
    };
  };
})();

'use strict';

(function() {
  RAML.Settings = RAML.Settings || {};

  var location = window.location;
  var uri      = location.protocol + '//' + location.host + location.pathname.replace(/\/$/, '');

  RAML.Settings.proxy = RAML.Settings.proxy || false;
  RAML.Settings.oauth2RedirectUri = RAML.Settings.oauth2RedirectUri || uri + '/authentication/oauth2.html';
  RAML.Settings.oauth1RedirectUri = RAML.Settings.oauth1RedirectUri || uri + '/authentication/oauth2.html';
})();

(function() {
  'use strict';

  function Clone() {}

  RAML.Utils = {
    clone: function(object) {
      Clone.prototype = object;
      return new Clone();
    },

    copy: function(object) {
      var copiedObject = {};
      for (var key in object) {
        copiedObject[key] = object[key];
      }
      return copiedObject;
    },

    isEmpty: function(object) {
      if (object) {
        return Object.keys(object).length === 0;
      } else {
        return true;
      }
    }
  };
})();

'use strict';

(function() {
  var module = angular.module('raml', []);

  module.factory('ramlParser', function () {
    return RAML.Parser;
  });

})();

'use strict';

(function() {
  var module = angular.module('ramlConsoleApp', ['raml', 'ngSanitize', 'fileInputOverride']);

  module.directive('apiResources', RAML.Directives.apiResources);
  module.directive('basicAuth', RAML.Directives.basicAuth);
  module.directive('bodyContent', RAML.Directives.bodyContent);
  module.directive('bodyDocumentation', RAML.Directives.bodyDocumentation);
  module.directive('codeMirror', RAML.Directives.codeMirror);
  module.directive('collapsible', RAML.Directives.collapsible);
  module.directive('collapsibleContent', RAML.Directives.collapsibleContent);
  module.directive('collapsibleToggle', RAML.Directives.collapsibleToggle);
  module.directive('documentation', RAML.Directives.documentation);
  module.directive('enum', RAML.Directives.enum);
  module.directive('markdown', RAML.Directives.markdown);
  module.directive('method', RAML.Directives.method);
  module.directive('namedParameters', RAML.Directives.namedParameters);
  module.directive('namedParametersDocumentation', RAML.Directives.namedParametersDocumentation);
  module.directive('oauth1', RAML.Directives.oauth1);
  module.directive('oauth2', RAML.Directives.oauth2);
  module.directive('parameterField', RAML.Directives.parameterField);
  module.directive('parameterFields', RAML.Directives.parameterFields);
  module.directive('parameterizedParameter', RAML.Directives.parameterizedParameter);
  module.directive('ramlConsole', RAML.Directives.ramlConsole);
  module.directive('ramlConsoleInitializer', RAML.Directives.ramlConsoleInitializer);
  module.directive('repeatable', RAML.Directives.repeatable);
  module.directive('repeatableAdd', RAML.Directives.repeatableAdd);
  module.directive('repeatableRemove', RAML.Directives.repeatableRemove);
  module.directive('resource', RAML.Directives.resource);
  module.directive('resourceDocumentation', RAML.Directives.resourceDocumentation);
  module.directive('responses', RAML.Directives.responses);
  module.directive('rootDocumentation', RAML.Directives.rootDocumentation);
  module.directive('securitySchemes', RAML.Directives.securitySchemes);
  module.directive('consoleTab', RAML.Directives.consoleTab);
  module.directive('consoleTabset', RAML.Directives.consoleTabset);
  module.directive('subtabs', RAML.Directives.subtabs);
  module.directive('uriBar', RAML.Directives.uriBar);
  module.directive('toggle', RAML.Directives.toggle);
  module.directive('toggleItem', RAML.Directives.toggleItem);
  module.directive('tryIt', RAML.Directives.tryIt);
  module.directive('validatedInput', RAML.Directives.validatedInput);

  module.controller('TryItController', RAML.Controllers.tryIt);

  module.service('ConfigService', RAML.Services.Config);
  module.service('DataStore', RAML.Services.DataStore);
  module.service('ramlParserWrapper', RAML.Services.RAMLParserWrapper);

  module.filter('nameFromParameterizable', RAML.Filters.nameFromParameterizable);
  module.filter('yesNo', RAML.Filters.yesNo);
})();

angular.module('ramlConsoleApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/api_resources.tmpl.html',
    "<div id=\"raml-console-api-reference\" role=\"resources\">\n" +
    "  <div class=\"toggle-resource-groups\">\n" +
    "    <a ng-click='apiResources.toggleAll(false)' role=\"expand-all\">Expand</a>\n" +
    "    <span>/</span>\n" +
    "    <a ng-click='apiResources.toggleAll(true)' role=\"collapse-all\">Collapse</a>\n" +
    "    <span>All</span>\n" +
    "  </div>\n" +
    "\n" +
    "  <div collapsible collapsed='apiResources.collapsed[apiResources.keyFor(resourceGroup)]' role=\"resource-group\" class=\"resource-group\" ng-repeat=\"resourceGroup in api.resourceGroups\">\n" +
    "    <i collapsible-toggle class=\"fa\" ng-class=\"{'fa-caret-right': collapsed, 'fa-caret-down': !collapsed}\"></i>\n" +
    "\n" +
    "    <div collapsible-toggle class=\"resource\" role=\"resource-group-placeholder\" ng-show=\"collapsed\" ng-init=\"resource = resourceGroup[0]\">\n" +
    "      <div class=\"resource-placeholder\" role=\"resource-placeholder\">\n" +
    "        <div class=\"resource-container\">\n" +
    "          <div class='resource'>\n" +
    "            <div>\n" +
    "              <div class='summary accordion-toggle'>\n" +
    "                <h3 class=\"path\">\n" +
    "                  <span ng-repeat='segment in resource.pathSegments'>{{segment.toString()}} </span>\n" +
    "                </h3>\n" +
    "              </div>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div collapsible-content>\n" +
    "      <resource ng-repeat=\"resource in resourceGroup\"></resource>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/basic_auth.tmpl.html',
    "<fieldset class=\"labelled-inline\" role=\"basic\">\n" +
    "  <div class=\"control-group\">\n" +
    "    <label for=\"username\">Username</label>\n" +
    "    <input type=\"text\" name=\"username\" ng-model='credentials.username'/>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"control-group\">\n" +
    "    <label for=\"password\">Password</label>\n" +
    "    <input type=\"password\" name=\"password\" ng-model='credentials.password'/>\n" +
    "  </div>\n" +
    "</fieldset>\n"
  );


  $templateCache.put('views/body_content.tmpl.html',
    "<section class=\"documentation-section request-body\" ng-show=\"body\">\n" +
    "  <fieldset class=\"bordered\">\n" +
    "    <h2>Body</h2>\n" +
    "\n" +
    "    <toggle key-base=\"baseKey + ':body'\" toggle-model=\"body\">\n" +
    "      <toggle-item ng-repeat=\"contentType in body.contentTypes\" heading=\"{{contentType}}\">\n" +
    "        <div class=\"labelled-inline\" ng-if='body.isForm(contentType)' ng-show=\"body.isSelected(contentType)\">\n" +
    "          <parameter-fields parameters='body.definitions[contentType]'></parameter-fields>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-if=\"!body.isForm(contentType)\" ng-show=\"body.isSelected(contentType)\">\n" +
    "          <textarea name=\"{{contentType}}\" ng-model=\"body.definitions[contentType].value\"></textarea>\n" +
    "          <a href=\"#\" class=\"body-prefill\" ng-show=\"body.hasExample(contentType)\" ng-click=\"body.fillWithExample($event)\">Prefill with example</a>\n" +
    "        </div>\n" +
    "      </toggle-item>\n" +
    "    </toggle>\n" +
    "  </fieldset>\n" +
    "</section>\n"
  );


  $templateCache.put('views/body_documentation.tmpl.html',
    "<section class='body-documentation'>\n" +
    "  <h2>Body</h2>\n" +
    "\n" +
    "  <toggle key-base='{{ bodyKey }}'>\n" +
    "    <toggle-item ng-repeat='(contentType, definition) in body track by contentType' active=\"displayed[contentType]\" heading='{{contentType}}'>\n" +
    "      <div ng-switch=\"contentType\">\n" +
    "        <named-parameters-documentation ng-switch-when=\"application/x-www-form-urlencoded\" role='parameter-group' parameters='definition.formParameters'></named-parameters-documentation>\n" +
    "        <named-parameters-documentation ng-switch-when=\"multipart/form-data\" role='parameter-group' parameters='definition.formParameters'></named-parameters-documentation>\n" +
    "        <div ng-switch-default>\n" +
    "          <section ng-if=\"definition.example\" role=\"example\">\n" +
    "            <h5>Example</h5>\n" +
    "            <div class=\"code\" code-mirror=\"definition.example\" mode=\"{{contentType}}\" visible=\"displayed[contentType]\"></div>\n" +
    "          </section>\n" +
    "          <section ng-if=\"definition.schema\" role=\"schema\">\n" +
    "            <a class=\"schema-toggle\" ng-click=\"expandSchema(contentType)\" ng-show=\"!schemaExpanded(contentType)\">Show Schema</a>\n" +
    "            <div ng-if=\"schemaExpanded(contentType)\">\n" +
    "              <h5>Schema</h5>\n" +
    "              <div class=\"code\" code-mirror=\"definition.schema\" mode=\"{{contentType}}\" visible=\"displayed[contentType] && schemaExpanded(contentType)\"></div>\n" +
    "            </div>\n" +
    "          </section>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </toggle-item>\n" +
    "  </toggle>\n" +
    "</section>\n"
  );


  $templateCache.put('views/documentation.tmpl.html',
    "<section class='documentation' role='documentation'>\n" +
    "  <console-tabset key-base='{{ generateKey(resource.toString(), method) }}' heading='{{ method.method }}'>\n" +
    "    <console-tab role='documentation-requests' heading=\"Request\" active='documentation.requestsActive' disabled=\"!documentation.hasRequestDocumentation()\">\n" +
    "      <div class=\"modifiers\">\n" +
    "        <span class=\"modifier-group\" ng-if=\"method.is\">\n" +
    "          <span class=\"caption\">Traits:</span>\n" +
    "          <ul role=\"traits\">\n" +
    "            <li class=\"trait\" ng-repeat=\"trait in method.is\" ng-bind=\"trait|nameFromParameterizable\"></li>\n" +
    "          </ul>\n" +
    "        </span>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"documentation-section\" ng-if=\"method.description\">\n" +
    "        <section>\n" +
    "          <h2>Description</h2>\n" +
    "          <div role=\"full-description\" class=\"description\" markdown=\"method.description\"></div>\n" +
    "        </section>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"documentation-section\" ng-if='!documentation.isEmpty(method.plainAndParameterizedHeaders)'>\n" +
    "        <named-parameters-documentation heading='Headers' role='parameter-group' parameters='method.plainAndParameterizedHeaders'></named-parameters-documentation>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"documentation-section\" ng-if='!documentation.isEmpty(resource.uriParametersForDocumentation)'>\n" +
    "        <named-parameters-documentation heading='URI Parameters' role='parameter-group' parameters='resource.uriParametersForDocumentation'></named-parameters-documentation>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"documentation-section\" ng-if='!documentation.isEmpty(method.queryParameters)'>\n" +
    "        <named-parameters-documentation heading='Query Parameters' role='parameter-group' parameters='method.queryParameters'></named-parameters-documentation>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"documentation-section\" ng-if='method.body && documentation.requestsActive'>\n" +
    "        <body-documentation body=\"method.body\" key-base=\"generateKey(resource.toString(), method) + ':request'\"></body-documentation>\n" +
    "      </div>\n" +
    "    </console-tab>\n" +
    "\n" +
    "    <console-tab role=\"documentation-responses\" heading=\"Responses\"  active='documentation.responsesActive' disabled='!documentation.hasResponseDocumentation()'>\n" +
    "      <responses></responses>\n" +
    "    </console-tab>\n" +
    "\n" +
    "    <console-tab role=\"try-it\" heading=\"Try It\" active=\"documentation.tryItActive\" disabled=\"!ramlConsole.tryItEnabled()\">\n" +
    "      <try-it></try-it>\n" +
    "    </console-tab>\n" +
    "  </console-tabset>\n" +
    "</section>\n"
  );


  $templateCache.put('views/enum.tmpl.html',
    "<div class=\"autocomplete\">\n" +
    "  <span ng-transclude></span>\n" +
    "  <ul ng-show=\"focused\">\n" +
    "    <li ng-click='selectItem(item)' ng-class=\"{ selected: $index == selectedIndex }\" ng-repeat=\"item in filteredEnum\">\n" +
    "      {{item}}\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "</div>\n"
  );


  $templateCache.put('views/method.tmpl.html',
    "<div class=\"method {{method.method}}\" role=\"method\">\n" +
    "  <documentation></documentation>\n" +
    "</div>\n"
  );


  $templateCache.put('views/named_parameters.tmpl.html',
    "<section class=\"documentation-section\" ng-show=\"displayParameters()\">\n" +
    "  <fieldset class='labelled-inline bordered'>\n" +
    "    <h2>{{heading}}</h2>\n" +
    "    <parameter-fields parameters=\"parameters\"></parameter-fields>\n" +
    "  </fieldset>\n" +
    "</section>\n"
  );


  $templateCache.put('views/named_parameters_documentation.tmpl.html',
    "<section class='named-parameters'>\n" +
    "  <h2>{{heading}}</h2>\n" +
    "  <section role='parameter' class='parameter' ng-repeat='parameter in parameters'>\n" +
    "    <div ng-repeat=\"definition in parameter\">\n" +
    "      <h4 class='strip-whitespace'>\n" +
    "        <span role=\"display-name\">{{definition.displayName}}</span>\n" +
    "        <span class=\"constraints\">{{namedParametersDocumentation.constraints(definition)}}</span>\n" +
    "      </h4>\n" +
    "\n" +
    "      <div class=\"info\">\n" +
    "        <div role=\"description\" markdown=\"definition.description\"></div>\n" +
    "        <div ng-if=\"definition.example\"><span class=\"label\">Example:</span> <code class=\"well\" role=\"example\">{{definition.example}}</code></div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </section>\n" +
    "</section>\n"
  );


  $templateCache.put('views/oauth1.tmpl.html',
    "<fieldset class=\"labelled-inline\" role=\"oauth1\">\n" +
    "  <div class=\"control-group\">\n" +
    "    <label for=\"consumerKey\">Consumer Key</label>\n" +
    "    <input type=\"text\" name=\"consumerKey\" ng-model='credentials.consumerKey'/>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"control-group\">\n" +
    "    <label for=\"consumerSecret\">Consumer Secret</label>\n" +
    "    <input type=\"password\" name=\"consumerSecret\" ng-model='credentials.consumerSecret'/>\n" +
    "  </div>\n" +
    "</fieldset>\n"
  );


  $templateCache.put('views/oauth2.tmpl.html',
    "<fieldset class=\"labelled-inline\" role=\"oauth2\">\n" +
    "  <div class=\"control-group\">\n" +
    "    <label for=\"grantType\">Grant Type</label>\n" +
    "    <select\n" +
    "      name=\"grantType\"\n" +
    "      ng-model=\"credentials.grantType\"\n" +
    "      ng-options=\"grant.name for grant in grantTypes\">\n" +
    "    </select>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"control-group\">\n" +
    "    <label for=\"clientId\" class=\"required\">Client ID</label>\n" +
    "\n" +
    "    <input type=\"text\" name=\"clientId\" ng-model=\"credentials.clientId\" required>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"control-group\" ng-if=\"hasClientSecret\">\n" +
    "    <label for=\"clientSecret\" ng-class=\"{ required: requiresClientSecret }\">\n" +
    "      Client Secret\n" +
    "    </label>\n" +
    "\n" +
    "    <input type=\"password\" name=\"clientSecret\" ng-model=\"credentials.clientSecret\" ng-required=\"requiresClientSecret\">\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"control-group\" ng-if=\"hasOwnerCredentials\">\n" +
    "    <label for=\"username\" class=\"required\">Username</label>\n" +
    "\n" +
    "    <input type=\"text\" name=\"username\" ng-model=\"credentials.username\" required>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"control-group\" ng-if=\"hasOwnerCredentials\">\n" +
    "    <label for=\"password\" class=\"required\">Password</label>\n" +
    "\n" +
    "    <input type=\"password\" name=\"password\" ng-model=\"credentials.password\" required>\n" +
    "  </div>\n" +
    "\n" +
    "  <div ng-if=\"!!scopes.length\">\n" +
    "    <div>Scopes</div>\n" +
    "\n" +
    "    <label ng-repeat=\"scope in scopes\">\n" +
    "      <input\n" +
    "        type=\"checkbox\"\n" +
    "        ng-checked=\"credentials.scopes.indexOf(scope) > -1\"\n" +
    "        ng-click=\"toggleScope(scope)\">\n" +
    "      {{scope}}\n" +
    "    </label>\n" +
    "  </div>\n" +
    "</fieldset>\n"
  );


  $templateCache.put('views/parameter_field.tmpl.html',
    "<ng-switch on='inputType' class='parameter-field-input'>\n" +
    "  <span ng-switch-when=\"file\">\n" +
    "    <input name=\"{{name}}\" type='file' ng-model='$parent.model'/>\n" +
    "  </span>\n" +
    "\n" +
    "  <span ng-switch-when=\"enum\">\n" +
    "    <enum options='definition.enum' model='$parent.model' contained-by=\"containedBy\">\n" +
    "      <input validated-input name=\"{{name}}\" type='text' ng-model='$parent.model' placeholder='{{placeholder}}' ng-trim=\"false\" constraints='definition' invalid-class='invalidClass'/>\n" +
    "    </enum>\n" +
    "  </span>\n" +
    "\n" +
    "  <span ng-switch-default>\n" +
    "    <input validated-input name=\"{{name}}\" type='text' ng-model='$parent.model' placeholder='{{placeholder}}' ng-trim=\"false\" constraints='definition' invalid-class='invalidClass'/>\n" +
    "  </span>\n" +
    "</ng-switch>\n"
  );


  $templateCache.put('views/parameter_fields.tmpl.html',
    "<fieldset>\n" +
    "  <div ng-repeat=\"(parameterName, parameter) in parameters.plain track by parameterName\">\n" +
    "    <div class=\"parameter-field\" ng-repeat=\"definition in parameter.definitions\" ng-show=\"parameter.isSelected(definition)\">\n" +
    "      <div repeatable=\"definition.repeat\" repeatable-model=\"parameters.values[parameterName]\">\n" +
    "        <div class=\"control-group\">\n" +
    "          <label for=\"{{parameterName}}\" ng-class=\"{ required: definition.required }\">\n" +
    "            {{definition.displayName}}\n" +
    "          </label>\n" +
    "          <parameter-field name='parameterName' model='repeatableModel[$index]' definition='definition' ></parameter-field>\n" +
    "          <repeatable-remove></repeatable-remove>\n" +
    "          <repeatable-add></repeatable-add>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"parameter-type\" ng-if=\"parameter.hasMultipleTypes()\">\n" +
    "      as\n" +
    "      <select class=\"form-control\" ng-model=\"parameter.selected\" ng-options=\"definition.type as definition.type for definition in parameter.definitions\"></select>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"parameter-factory\" ng-repeat='(name, _) in parameters.parameterized'>\n" +
    "    <parameterized-parameter parameter-name=\"name\" parameters=\"parameters\"></parameterized-parameter>\n" +
    "  </div>\n" +
    "</fieldset>\n"
  );


  $templateCache.put('views/parameterized_parameter.tmpl.html',
    "<div class=\"labelled-inline\">\n" +
    "  <label for=\"{{parameterName}}\">{{parameterName}}:</label>\n" +
    "  <a href='#' role=\"open-factory\" ng-click=\"parameterFactory.open($event)\" ng-hide=\"parameterFactory.opened\">Add Header<i class='fa fa-plus-square'></i></a>\n" +
    "  <span ng-show=\"parameterFactory.opened\">\n" +
    "    <input type=\"text\" name=\"{{parameterName}}\" ng-model=\"parameterFactory.value\" ng-class=\"parameterFactory.status\"/>\n" +
    "    <a href='#' role='create-parameter' ng-click=\"parameterFactory.create($event)\"><i class='fa fa-plus-square'></i></a>\n" +
    "  </span>\n" +
    "</div>\n"
  );


  $templateCache.put('views/raml-console.tmpl.html',
    "<article role=\"api-console\" id=\"raml-console\">\n" +
    "  <resource-documentation api=\"api\" raml-console=\"ramlConsole\"></resource-documentation>\n" +
    "  <div role=\"error\" ng-if=\"parseError\">\n" +
    "    {{parseError}}\n" +
    "  </div>\n" +
    "\n" +
    "  <header id=\"raml-console-api-title\">{{api.title}}</header>\n" +
    "\n" +
    "  <nav id=\"raml-console-proxy-nav\" ng-if=\"ramlConsole.settings.proxy\">\n" +
    "    <span>API is behind a firewall <a href=\"http://www.mulesoft.org/documentation/display/current/Accessing+Your+API+Behind+a+Firewall\" target=\"_blank\">(?)</a></span>\n" +
    "    <input type=\"checkbox\" ng-model=\"ramlConsole.config.disableProxy\">\n" +
    "  </nav>\n" +
    "\n" +
    "  <nav id=\"raml-console-main-nav\" ng-if='ramlConsole.showRootDocumentation()' ng-switch='ramlConsole.view'>\n" +
    "    <a class=\"btn\" ng-switch-when='rootDocumentation' role=\"view-api-reference\" ng-click='ramlConsole.gotoView(\"apiReference\")'>&larr; API Reference</a>\n" +
    "    <a class=\"btn\" ng-switch-default role=\"view-root-documentation\" ng-click='ramlConsole.gotoView(\"rootDocumentation\")'>Documentation &rarr;</a>\n" +
    "  </nav>\n" +
    "\n" +
    "  <div id=\"raml-console-content\">\n" +
    "    <div class=\"inner\" ng-switch='ramlConsole.view'>\n" +
    "      <div ng-switch-when='rootDocumentation'>\n" +
    "        <root-documentation></root-documentation>\n" +
    "      </div>\n" +
    "      <div ng-switch-default>\n" +
    "        <div ng-if='api.resourceGroups.length > 0'>\n" +
    "          <api-resources></api-resources>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</article>\n"
  );


  $templateCache.put('views/repeatable.tmpl.html',
    "<div ng-if=\"repeatable\" ng-repeat=\"model in repeatableModel track by $index\">\n" +
    "  <div ng-transclude></div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"!repeatable\">\n" +
    "  <div ng-transclude></div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/resource.tmpl.html',
    "<div class=\"resource-placeholder\" role=\"resource-placeholder\">\n" +
    "  <div class=\"resource-container\">\n" +
    "    <div ng-class=\"{expanded: resourceView.expanded || selectedMethod}\" class='resource' role=\"resource\" ng-click='resourceView.toggleExpansion()'>\n" +
    "      <div>\n" +
    "        <div class='summary accordion-toggle' role='resource-summary'>\n" +
    "          <div class=\"modifiers\" ng-class=\"{expanded: selectedMethod}\" ng-show='resourceView.expanded || selectedMethod'>\n" +
    "            <span class=\"modifier-group\" ng-if='resource.resourceType'>\n" +
    "              <span class=\"caption\">Type:</span>\n" +
    "              <ul>\n" +
    "                <li class=\"resource-type\" role=\"resource-type\" ng-bind=\"resource.resourceType|nameFromParameterizable\"></li>\n" +
    "              </ul>\n" +
    "            </span>\n" +
    "            <span class=\"modifier-group\" ng-if='resource.traits.length > 0'>\n" +
    "              <span class=\"caption\">Traits:</span>\n" +
    "              <ul>\n" +
    "                <li class=\"trait\" ng-show='resourceView.expanded' role=\"trait\" ng-repeat=\"trait in resource.traits\" ng-bind=\"trait|nameFromParameterizable\"></li>\n" +
    "              </ul>\n" +
    "            </span>\n" +
    "          </div>\n" +
    "\n" +
    "          <h3 class=\"path\">\n" +
    "            <span role='segment' ng-repeat='segment in resource.pathSegments'>{{segment.toString()}} </span>\n" +
    "          </h3>\n" +
    "          <ul class='methods' role=\"methods\" ng-if=\"resource.methods\">\n" +
    "            <li class='method-name' ng-class='method.method' ng-click=\"resourceView.openDocumentation($event, method)\" ng-repeat=\"method in resource.methods\">{{method.method}}</li>\n" +
    "          </ul>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div role='description'\n" +
    "           class='description'\n" +
    "           ng-show='resourceView.expanded && resource.description'\n" +
    "           markdown='resource.description'>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/resource_documentation.tmpl.html',
    "<div class=\"resource-placeholder resource-popover mask-resource-list\" ng-show=\"resource\">\n" +
    "  <div class=\"resource-container\">\n" +
    "    <div class=\"resource expanded\" ng-if=\"resource\">\n" +
    "      <div>\n" +
    "        <i class=\"fa fa-times collapse\" ng-click='closePopover($event)'></i>\n" +
    "\n" +
    "        <div class=\"summary accordion-toggle\" role=\"resource-summary\">\n" +
    "          <div class=\"modifiers expanded\">\n" +
    "            <span class=\"modifier-group\" ng-if='resource.resourceType'>\n" +
    "              <span class=\"caption\">Type:</span>\n" +
    "              <ul>\n" +
    "                <li class=\"resource-type\" role=\"resource-type\" ng-bind=\"resource.resourceType|nameFromParameterizable\"></li>\n" +
    "              </ul>\n" +
    "            </span>\n" +
    "            <span class=\"modifier-group\" ng-if='resource.traits.length > 0'>\n" +
    "              <span class=\"caption\">Traits:</span>\n" +
    "              <ul>\n" +
    "                <li class=\"trait\" role=\"trait\" ng-repeat=\"trait in resource.traits\" ng-bind=\"trait|nameFromParameterizable\"></li>\n" +
    "              </ul>\n" +
    "            </span>\n" +
    "          </div>\n" +
    "\n" +
    "          <h3 class=\"path\">\n" +
    "            <span role='segment' ng-repeat='segment in resource.pathSegments'>{{segment.toString()}} </span>\n" +
    "          </h3>\n" +
    "          <ul class='methods' role=\"methods\" ng-if=\"resource.methods\">\n" +
    "            <li class='method-name' ng-class='method.method' ng-repeat=\"method in resource.methods\" ng-click=\"selectMethod(method)\">{{method.method}}</li>\n" +
    "          </ul>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <method ng-repeat=\"method in resource.methods\" ng-if=\"method === selectedMethod\"></method>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/responses.tmpl.html',
    "<section class=\"responses\">\n" +
    "  <subtabs tabs=\"method.responseCodes\" key-base=\"{{ resource.toString() + ':' + method.method }}\"></subtabs>\n" +
    "  <div class=\"documentation-section response\" expanded='responsesView.expanded[responseCode]' ng-repeat='(responseCode, response) in method.responses'>\n" +
    "    <a id=\"{{responseCode}}\" class=\"response-code\" role=\"response-code\"> {{responseCode}} </a>\n" +
    "    <section role='response'>\n" +
    "      <div markdown='response.description'></div>\n" +
    "      <div ng-if='!documentation.isEmpty(response.headers)'>\n" +
    "        <named-parameters-documentation heading='Headers' role='parameter-group' parameters='response.headers'></named-parameters-documentation>\n" +
    "      </div>\n" +
    "\n" +
    "      <div ng-if=\"response.body && documentation.responsesActive\" class='body-documentation'>\n" +
    "        <body-documentation body=\"response.body\" key-base='keyBase + \":responses:\" + responseCode'></body-documentation>\n" +
    "      </div>\n" +
    "    </section>\n" +
    "  </div>\n" +
    "</section>\n"
  );


  $templateCache.put('views/root_documentation.tmpl.html',
    "<div role=\"root-documentation\">\n" +
    "  <section collapsible expanded='expanded' ng-repeat=\"document in api.documentation\">\n" +
    "    <h2 collapsible-toggle>{{document.title}}</h2>\n" +
    "    <div collapsible-content class=\"content\">\n" +
    "      <div markdown='document.content'></div>\n" +
    "    </div>\n" +
    "  </section>\n" +
    "</div>\n"
  );


  $templateCache.put('views/security_schemes.tmpl.html',
    "<section class=\"documentation-section authentication\">\n" +
    "  <fieldset class=\"bordered\">\n" +
    "    <h2>Authentication</h2>\n" +
    "\n" +
    "    <toggle key-base=\"baseKey + ':securitySchemes'\" toggle-model=\"keychain\">\n" +
    "      <toggle-item heading=\"Anonymous\"></toggle-item>\n" +
    "      <toggle-item ng-repeat=\"(name, scheme) in schemes\" heading=\"{{name}}\">\n" +
    "        <div ng-switch=\"scheme.type\">\n" +
    "          <basic-auth ng-switch-when=\"Basic Authentication\" scheme=\"scheme\" credentials=\"keychain[name]\"></basic-auth>\n" +
    "          <oauth1 ng-switch-when=\"OAuth 1.0\" scheme=\"scheme\" credentials=\"keychain[name]\"></oauth1>\n" +
    "          <oauth2 ng-switch-when=\"OAuth 2.0\" scheme=\"scheme\" credentials=\"keychain[name]\"></oauth2>\n" +
    "        </div>\n" +
    "      </toggle-item>\n" +
    "    </toggle>\n" +
    "  </fieldset>\n" +
    "</section>\n"
  );


  $templateCache.put('views/tab.tmpl.html',
    "<div class=\"method-content\" ng-class=\"{active: active, disabled: disabled}\" ng-show=\"active\" ng-transclude>\n" +
    "</div>\n"
  );


  $templateCache.put('views/tabset.tmpl.html',
    "<div class=\"method-nav-container\">\n" +
    "  <div class=\"method-nav\">\n" +
    "    <ul class=\"method-nav-group\">\n" +
    "      <li>\n" +
    "        <a>{{heading}}</a>\n" +
    "      </li>\n" +
    "\n" +
    "      <li class=\"method-nav-item\" ng-repeat=\"item in tabset.tabs\" ng-class=\"{active: item.active, disabled: item.disabled}\">\n" +
    "        <a ng-click=\"tabset.select(item)\">{{item.heading}}</a>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "\n" +
    "    <ul ng-repeat=\"item in tabset.tabs\" class=\"method-nav-group method-sub-nav\" ng-if=\"tabset.active.heading == item.heading && item.subtabs\">\n" +
    "      <li>\n" +
    "        <a>{{item.heading}}</a>\n" +
    "      </li>\n" +
    "      <li class=\"method-nav-item\" ng-repeat=\"subItem in item.subtabs\" ng-click=\"item.select(subItem)\" ng-class=\"{active: item.selected(subItem)}\">\n" +
    "        <a>{{subItem}}</a>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "\n" +
    "    <div class=\"method-nav-group method-sub-nav uri-bar\" ng-repeat=\"item in tabset.tabs\" ng-if=\"tabset.active.heading == item.heading && item.uriBar\">\n" +
    "      <span role=\"path\" class=\"path\">\n" +
    "        <span class=\"segment\">\n" +
    "          <span ng-repeat='token in item.uriBar.baseUri.tokens track by $index'>\n" +
    "            <span ng-if='item.uriBar.baseUri.parameters[token]'>\n" +
    "              <parameter-field name='token' placeholder='token' model='item.uriBar.pathBuilder.baseUriContext[token]' definition='item.uriBar.baseUri.parameters[token]' invalid-class='error'\n" +
    "              contained-by='[role=\"documentation\"]'></parameter-field>\n" +
    "            </span>\n" +
    "            <span class=\"segment\" ng-if=\"!item.uriBar.baseUri.parameters[token]\">{{token}}</span>\n" +
    "          </span>\n" +
    "          <span role='segment' ng-repeat='segment in item.uriBar.pathSegments' ng-init=\"$segmentIndex = $index\">\n" +
    "            <span ng-repeat='token in segment.tokens track by $index'>\n" +
    "              <span ng-if='segment.parameters[token]'>\n" +
    "                <parameter-field name='token' placeholder='token' model='item.uriBar.pathBuilder.segmentContexts[$segmentIndex][token]' definition='segment.parameters[token]' invalid-class='error' contained-by='[role=\"documentation\"]'></parameter-field>\n" +
    "              </span>\n" +
    "              <span class=\"segment\" ng-if=\"!segment.parameters[token]\">{{token}}</span>\n" +
    "            </span>\n" +
    "          </span>\n" +
    "        </span>\n" +
    "      </span>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"method-content-container\" ng-transclude>\n" +
    "  </div>\n" +
    "<div>\n"
  );


  $templateCache.put('views/toggle-item.tmpl.html',
    "<div class=\"toggle-item\" ng-class=\"{active: active, disabled: disabled}\" ng-show=\"active\" ng-transclude></div>\n"
  );


  $templateCache.put('views/toggle.tmpl.html',
    "<div class=\"toggle\">\n" +
    "  <fieldset class=\"labelled-radio-group\">\n" +
    "    <div class=\"radio-group\">\n" +
    "      <label class=\"radio\" ng-repeat=\"item in toggleItems\" ng-class=\"{active: item.active, disabled: item.disabled}\">\n" +
    "        <span ng-click=\"toggle.select(item)\">{{item.heading}}</span>\n" +
    "      </label>\n" +
    "    </div>\n" +
    "  </fieldset>\n" +
    "\n" +
    "  <div class=\"item-content\" ng-transclude></div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/try_it.tmpl.html',
    "<section class=\"try-it\">\n" +
    "  <form>\n" +
    "    <uri-bar base-uri=\"api.baseUri\" path-segments=\"resource.pathSegments\" path-builder=\"context.pathBuilder\"></uri-bar>\n" +
    "\n" +
    "    <security-schemes ng-if=\"apiClient.securitySchemes\" schemes=\"apiClient.securitySchemes\" keychain=\"ramlConsole.keychain\" base-key=\"apiClient.baseKey()\"></security-schemes>\n" +
    "    <named-parameters heading=\"Headers\" parameters=\"context.headers\"></named-parameters>\n" +
    "    <named-parameters heading=\"Query Parameters\" parameters=\"context.queryParameters\"></named-parameters>\n" +
    "    <!-- the ng-if below reinstantiates the try it directive which results in the try it\n" +
    "         section getting updated when a method is selected in the resource popover.\n" +
    "    -->\n" +
    "    <body-content ng-if=\"context.bodyContent\" body=\"context.bodyContent\"></body-content>\n" +
    "\n" +
    "\n" +
    "    <div class=\"form-actions\">\n" +
    "      <i ng-show='apiClient.inProgress()' class=\"fa fa-spinner fa-spin fa-lg\"></i>\n" +
    "\n" +
    "      <div role=\"error\" class=\"error\" ng-show=\"apiClient.missingUriParameters\">\n" +
    "        Required URI Parameters must be entered\n" +
    "      </div>\n" +
    "      <div role=\"warning\" class=\"warning\" ng-show=\"apiClient.disallowedAnonymousRequest\">\n" +
    "        Successful responses require authentication\n" +
    "      </div>\n" +
    "      <button role=\"try-it\" ng-class=\"'btn-' + method.method\" ng-click=\"apiClient.execute()\">\n" +
    "        {{method.method}}\n" +
    "      </button>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "\n" +
    "  <div class=\"response\" ng-if=\"apiClient.response\">\n" +
    "    <h4>Response</h4>\n" +
    "    <div class=\"request-url\">\n" +
    "      <h5>Request URL</h5>\n" +
    "      <code class=\"response-value\">{{apiClient.response.requestUrl}}</code>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"status\">\n" +
    "      <h5>Status</h5>\n" +
    "      <code class=\"response-value\">{{apiClient.response.status}}</code>\n" +
    "    </div>\n" +
    "    <div class=\"headers\">\n" +
    "      <h5>Headers</h5>\n" +
    "      <ul class=\"response-value\">\n" +
    "        <li ng-repeat=\"(header, value) in apiClient.response.headers track by header\">\n" +
    "          <code>\n" +
    "            <span class=\"header-key\">{{header}}:</span>\n" +
    "            <span class=\"header-value\">{{value}}</span>\n" +
    "          </code>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "    <div class=\"body\" ng-if=\"apiClient.response.body\">\n" +
    "      <h5>Body</h5>\n" +
    "      <div class=\"response-value\">\n" +
    "        <div class=\"code\" mode='{{apiClient.response.contentType}}' code-mirror=\"apiClient.response.body\" visible=\"apiClient.response.body\"></div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</section>\n"
  );

}]);
