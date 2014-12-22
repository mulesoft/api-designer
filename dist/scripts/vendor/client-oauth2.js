(function (root) {
  var _hasOwnProperty = Object.prototype.hasOwnProperty;
  var btoa            = typeof Buffer === 'function' ? bufferBtoa : root.btoa;

  /**
   * Format error response types to regular strings for displaying to clients.
   *
   * Reference: http://tools.ietf.org/html/rfc6749#section-4.1.2.1
   *
   * @type {Object}
   */
  var ERROR_RESPONSES = {
    'invalid_request': [
      'The request is missing a required parameter, includes an',
      'invalid parameter value, includes a parameter more than',
      'once, or is otherwise malformed.'
    ].join(' '),
    'invalid_client': [
      'Client authentication failed (e.g., unknown client, no',
      'client authentication included, or unsupported',
      'authentication method).'
    ].join(' '),
    'invalid_grant': [
      'The provided authorization grant (e.g., authorization',
      'code, resource owner credentials) or refresh token is',
      'invalid, expired, revoked, does not match the redirection',
      'URI used in the authorization request, or was issued to',
      'another client.'
    ].join(' '),
    'unauthorized_client': [
      'The client is not authorized to request an authorization',
      'code using this method.'
    ].join(' '),
    'unsupported_grant_type': [
      'The authorization grant type is not supported by the',
      'authorization server.'
    ].join(' '),
    'access_denied': [
      'The resource owner or authorization server denied the request.'
    ].join(' '),
    'unsupported_response_type': [
      'The authorization server does not support obtaining',
      'an authorization code using this method.'
    ].join(' '),
    'invalid_scope': [
      'The requested scope is invalid, unknown, or malformed.'
    ].join(' '),
    'server_error': [
      'The authorization server encountered an unexpected',
      'condition that prevented it from fulfilling the request.',
      '(This error code is needed because a 500 Internal Server',
      'Error HTTP status code cannot be returned to the client',
      'via an HTTP redirect.)'
    ].join(' '),
    'temporarily_unavailable': [
      'The authorization server is currently unable to handle',
      'the request due to a temporary overloading or maintenance',
      'of the server.'
    ].join(' ')
  };

  /**
   * Iterate over a source object and copy properties to the destination object.
   *
   * @param  {Object} dest
   * @param  {Object} source
   * @return {Object}
   */
  function assign (dest /*, ...source */) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (_hasOwnProperty.call(source, key)) {
          dest[key] = source[key];
        }
      }
    }

    return dest;
  }

  /**
   * Support base64 in node like how it works in the browser.
   *
   * @param  {String} string
   * @return {String}
   */
  function bufferBtoa (string) {
    return new Buffer(string).toString('base64');
  }

  /**
   * Check if properties exist on an object and throw when they aren't.
   *
   * @throws {TypeError} If an expected property is missing.
   *
   * @param {Object} obj
   * @param {Array}  props
   */
  function expects (obj, props) {
    for (var i = 0; i < props.length; i++) {
      var prop = props[i];

      // Check whether the property is empty.
      if (obj[prop] == null) {
        throw new TypeError('Expected "' + prop + '" to exist');
      }
    }
  }

  /**
   * Create a new object based on a source object with keys omitted.
   *
   * @param  {Object} source
   * @param  {Array}  keys
   * @return {Object}
   */
  function omit (source, keys) {
    var obj = {};

    // Iterate over the source object and set properties on a new object.
    Object.keys(source || {}).forEach(function (key) {
      if (keys.indexOf(key) === -1) {
        obj[key] = source[key];
      }
    });

    return obj;
  }

  /**
   * Attempt (and fix) URI component encoding.
   *
   * @param  {String} str
   * @return {String}
   */
  function encodeComponent (str) {
    return encodeURIComponent(str)
      .replace(/[!'()]/g, root.escape)
      .replace(/\*/g, '%2A');
  }

  /**
   * Attempt URI component decoding.
   *
   * @param  {String} str
   * @return {String}
   */
  function decodeComponent (str) {
    return decodeURIComponent(str);
  }

  /**
   * Convert an object into a query string.
   *
   * @param  {Object} obj
   * @param  {String} sep
   * @param  {String} eq
   * @return {String}
   */
  function uriEncode (obj, sep, eq) {
    var params = [];

    eq  = eq  || '=';
    sep = sep || '&';

    Object.keys(obj).forEach(function (key) {
      var value  = obj[key];
      var keyStr = encodeComponent(key) + eq;

      if (Array.isArray(value)) {
        for (var i = 0; i < value.length; i++) {
          params.push(keyStr + encodeComponent(value[i]));
        }
      } else if (value != null) {
        params.push(keyStr + encodeComponent(value));
      }
    });

    return params.join(sep);
  }

  /**
   * Convert a query string into an object.
   *
   * @param  {String} qs
   * @param  {String} sep
   * @param  {String} eq
   * @return {Object}
   */
  function uriDecode (qs, sep, eq) {
    eq  = eq  || '=';
    sep = sep || '&';
    qs  = qs.split(sep);

    var obj     = {};
    var maxKeys = 1000;
    var len     = qs.length > maxKeys ? maxKeys : qs.length;

    for (var i = 0; i < len; i++) {
      var key   = qs[i].replace(/\+/g, '%20');
      var value = '';
      var index = key.indexOf(eq);

      if (index !== -1) {
        value = key.substr(index + 1);
        key   = key.substr(0, index);
      }

      key   = decodeComponent(key);
      value = decodeComponent(value);

      if (!_hasOwnProperty.call(obj, key)) {
        obj[key] = value;
      } else if (Array.isArray(obj[key])) {
        obj[key].push(value);
      } else {
        obj[key] = [obj[key], value];
      }
    }

    return obj;
  }

  /**
   * Pull an authentication error from the response data.
   *
   * @param  {Object} data
   * @return {String}
   */
  function getAuthError (data) {
    var message = ERROR_RESPONSES[data.error] ||
      data.error ||
      data.error_message;

    // Return an error instance with the message if it exists.
    return message && new Error(message);
  }

  /**
   * Retrieve all the HTTP response headers for an XMLHttpRequest instance.
   *
   * @param  {XMLHttpRequest} xhr
   * @return {Object}
   */
  function getAllReponseHeaders (xhr) {
    var headers = {};

    // Split all header lines and iterate.
    xhr.getAllResponseHeaders().split('\n').forEach(function (header) {
      var index = header.indexOf(':');

      if (index === -1) {
        return;
      }

      var name  = header.substr(0, index).toLowerCase();
      var value = header.substr(index + 1).trim();

      headers[name] = value;
    });

    return headers;
  }

  /**
   * Sanitize the scopes option to be a string.
   *
   * @param  {Array}  scopes
   * @return {String}
   */
  function sanitizeScope (scopes) {
    if (!Array.isArray(scopes)) {
      return scopes == null ? null : String(scopes);
    }

    return scopes.join(' ');
  }

  /**
   * Construct an object that can handle the multiple OAuth 2.0 flows.
   *
   * @param {Object} options
   */
  function ClientOAuth2 (options) {
    this.options = options;

    this.code        = new CodeFlow(this);
    this.token       = new TokenFlow(this);
    this.owner       = new OwnerFlow(this);
    this.credentials = new CredentialsFlow(this);
  }

  /**
   * Alias the token constructor.
   *
   * @type {Function}
   */
  ClientOAuth2.Token = ClientOAuth2Token;

  /**
   * Create a new token from existing data.
   *
   * @param  {String} access
   * @param  {String} [refresh]
   * @param  {String} [type]
   * @param  {Object} [data]
   * @return {Object}
   */
  ClientOAuth2.prototype.createToken = function (access, refresh, type, data) {
    return new ClientOAuth2Token(this, assign({}, data, {
      access_token:  access,
      refresh_token: refresh,
      token_type:    type
    }));
  };

  /**
   * Using the built-in request method, we'll automatically attempt to parse
   * the response.
   *
   * @param {Object}   options
   * @param {Function} done
   */
  ClientOAuth2.prototype._request = function (options, done) {
    return this.request(options, function (err, res) {
      if (err) {
        return done(err);
      }

      // Check the response status and fail.
      if (res.status && Math.floor(res.status / 100) !== 2) {
        err = new Error('HTTP Status ' + res.status);
        err.status = res.status;

        return done(err);
      }

      // Support already parsed responses in case of custom body parsing.
      if (typeof res.body !== 'string') {
        return done(null, res.body);
      }

      // Attempt to parse as JSON, falling back to parsing as a query string.
      try {
        done(null, JSON.parse(res.body), res.raw);
      } catch (e) {
        done(null, uriDecode(res.body), res.raw);
      }
    });
  };

  if (typeof window !== 'undefined') {
    /**
     * Make a HTTP request using XMLHttpRequest.
     *
     * @param {Object}   options
     * @param {Function} done
     */
    ClientOAuth2.prototype.request = function (options, done) {
      var xhr     = new root.XMLHttpRequest();
      var headers = options.headers || {};

      // Open the request to the uri and method.
      xhr.open(options.method, options.uri);

      // When the request has loaded, attempt to automatically parse the body.
      xhr.onload = function () {
        return done(null, {
          raw:     xhr,
          status:  xhr.status,
          headers: getAllReponseHeaders(xhr),
          body:    xhr.responseText
        });
      };

      // Catch request errors.
      xhr.onerror = xhr.onabort = function () {
        return done(new Error(xhr.statusText || 'XHR aborted'));
      };

      // Set all request headers.
      Object.keys(headers).forEach(function (header) {
        xhr.setRequestHeader(header, headers[header]);
      });

      // Make the request with the body.
      xhr.send(options.body);
    };
  } else {
    var url   = require('url');
    var http  = require('http');
    var https = require('https');

    /**
     * Make a request using the built-in node http library.
     *
     * @param {Object}   options
     * @param {Function} done
     */
    ClientOAuth2.prototype.request = function (options, done) {
      var lib     = http;
      var reqOpts = url.parse(options.uri);

      // If the protocol is over https, switch request library.
      if (reqOpts.protocol === 'https:') {
        lib = https;
      }

      // Alias request options.
      reqOpts.method  = options.method;
      reqOpts.headers = options.headers;

      // Send the http request and listen for the response to finish.
      var req = lib.request(reqOpts, function (res) {
        var data = '';

        // Callback to `done` if a response error occurs.
        res.on('error', done);

        // Concat all the data chunks into a string.
        res.on('data', function (chunk) {
          data += chunk;
        });

        // When the response is finished, attempt to parse the data string.
        res.on('end', function () {
          return done(null, {
            raw:     res,
            status:  res.statusCode,
            headers: res.headers,
            body:    data
          });
        });
      });

      // Callback to `done` if a request error occurs.
      req.on('error', done);

      // Send the body and make the request.
      req.write(options.body);
      req.end();
    };
  }

  /**
   * General purpose client token generator.
   *
   * @param {Object} client
   * @param {Object} data
   */
  function ClientOAuth2Token (client, data) {
    this.client = client;

    this.data = omit(data, [
      'access_token', 'refresh_token', 'token_type', 'expires_in', 'scope',
      'state', 'error', 'error_description', 'error_uri'
    ]);

    this.tokenType    = (data.token_type || 'bearer').toLowerCase();
    this.accessToken  = data.access_token;
    this.refreshToken = data.refresh_token;

    // Set the expiration date.
    if (data.expires_in) {
      this.expires = new Date();

      this.expires.setSeconds(this.expires.getSeconds() + data.expires_in);
    }
  }

  /**
   * Sign a standardised request object with user authentication information.
   *
   * @param  {Object} opts
   * @return {Object}
   */
  ClientOAuth2Token.prototype.sign = function (opts) {
    if (!this.accessToken) {
      throw new Error('Unable to sign without access token');
    }

    opts.headers = opts.headers || {};

    if (this.tokenType === 'bearer') {
      opts.headers.Authorization = 'Bearer ' + this.accessToken;
    } else {
      var parts    = opts.uri.split('#');
      var token    = 'access_token=' + this.accessToken;
      var uri      = parts[0].replace(/[?&]access_token=[^&#]/, '');
      var fragment = parts[1] ? '#' + parts[1] : '';

      // Prepend the correct query string parameter to the uri.
      opts.uri = uri + (uri.indexOf('?') > -1 ? '&' : '?') + token + fragment;

      // Attempt to avoid storing the uri in proxies, since the access token
      // is exposed in the query parameters.
      opts.headers.Pragma           = 'no-store';
      opts.headers['Cache-Control'] = 'no-store';
    }

    return opts;
  };

  /**
   * Make a HTTP request as the user.
   *
   * @param {Object}   opts
   * @param {Function} done
   */
  ClientOAuth2Token.prototype.request = function (opts, done) {
    return this.client.client.request(this.sign(opts), done);
  };

  /**
   * Refresh a user access token with the supplied token.
   *
   * @param {Function} done
   */
  ClientOAuth2Token.prototype.refresh = function (done) {
    var self    = this;
    var options = this.client.options;

    if (!this.refreshToken) {
      return done(new Error('No refresh token set'));
    }

    var authorization = btoa(options.clientId + ':' + options.clientSecret);

    return this.client._request({
      uri: options.accessTokenUri,
      method: 'POST',
      headers: {
        'Accept':        'application/json, application/x-www-form-urlencoded',
        'Content-Type':  'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + authorization
      },
      body: uriEncode({
        refresh_token: this.refreshToken,
        grant_type:    'refresh_token'
      })
    }, function (err, data) {
      // If an error exists or the data contains an error, return `done`.
      if (err || (err = getAuthError(data))) {
        return done(err);
      }

      // Update stored tokens on the current instance.
      self.accessToken  = data.access_token;
      self.refreshToken = data.refresh_token;

      return done(null, self);
    });
  };

  /**
   * Check whether the token has expired.
   *
   * @return {Boolean}
   */
  ClientOAuth2Token.prototype.expired = function () {
    if (this.expires) {
      return Date.now() < this.expires.getTime();
    }

    return false;
  };

  /**
   * Support resource owner password credentials OAuth 2.0 grant.
   *
   * Reference: http://tools.ietf.org/html/rfc6749#section-4.3
   *
   * @param {ClientOAuth2} client
   */
  function OwnerFlow (client) {
    this.client = client;
  }

  /**
   * Make a request on behalf of the user credentials to get an acces token.
   *
   * @param {String}   username
   * @param {String}   password
   * @param {Function} done
   */
  OwnerFlow.prototype.getToken = function (username, password, done) {
    var self          = this;
    var options       = this.client.options;
    var authorization = btoa(options.clientId + ':' + options.clientSecret);

    return this.client._request({
      uri: options.accessTokenUri,
      method: 'POST',
      headers: {
        'Accept':        'application/json, application/x-www-form-urlencoded',
        'Content-Type':  'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + authorization
      },
      body: uriEncode({
        scope:      sanitizeScope(options.scopes),
        username:   username,
        password:   password,
        grant_type: 'password'
      })
    }, function (err, data) {
      // If an error exists or the data contains an error, return `done`.
      if (err || (err = getAuthError(data))) {
        return done(err);
      }

      return done(null, new ClientOAuth2Token(self, data));
    });
  };

  /**
   * Support implicit OAuth 2.0 grant.
   *
   * Reference: http://tools.ietf.org/html/rfc6749#section-4.2
   *
   * @param {ClientOAuth2} client
   */
  function TokenFlow (client) {
    this.client = client;
  }

  /**
   * Get the uri to redirect the user to for implicit authentication.
   *
   * @param  {Object} options
   * @return {String}
   */
  TokenFlow.prototype.getUri = function (options) {
    options = assign({}, this.client.options, options);

    // Check the parameters have been set.
    expects(options, [
      'clientId',
      'redirectUri',
      'authorizationUri'
    ]);

    return options.authorizationUri + '?' + uriEncode({
      state:         options.state,
      scope:         sanitizeScope(options.scopes),
      client_id:     options.clientId,
      redirect_uri:  options.redirectUri,
      response_type: 'token'
    });
  };

  /**
   * Get the user access token from the uri.
   *
   * @param {String}   uri
   * @param {String}   [state]
   * @param {Function} done
   */
  TokenFlow.prototype.getToken = function (uri, state, done) {
    var options = this.client.options;
    var err;

    // State is an optional pass in.
    if (typeof state === 'function') {
      done  = state;
      state = null;
    }

    // Make sure the uri matches our expected redirect uri.
    if (uri.substr(0, options.redirectUri.length) !== options.redirectUri) {
      return done(new Error('Invalid uri (should to match redirect): ' + uri));
    }

    var queryString    = uri.replace(/^[^\?]*|\#.*$/g, '').substr(1);
    var fragmentString = uri.replace(/^[^\#]*/, '').substr(1);

    // Check whether a query string is present in the uri.
    if (!queryString && !fragmentString) {
      return done(new Error('Unable to process uri: ' + uri));
    }

    // Merge the fragment with the the query string. This is because, at least,
    // Instagram has a bug where the OAuth 2.0 state is being passed back as
    // part of the query string instead of the fragment. For example:
    // "?state=123#access_token=abc"
    var data = assign(
      queryString ? uriDecode(queryString) : {},
      fragmentString ? uriDecode(fragmentString) : {}
    );

    // Check if the query string was populated with a known error.
    if (err = getAuthError(data)) {
      return done(err);
    }

    // Check whether the state is correct.
    if (state && data.state !== state) {
      return done(new Error('Invalid state:' + data.state));
    }

    // Initalize a new token and return.
    return done(null, new ClientOAuth2Token(this, data));
  };

  /**
   * Support client credentials OAuth 2.0 grant.
   *
   * Reference: http://tools.ietf.org/html/rfc6749#section-4.4
   *
   * @param {ClientOAuth2} client
   */
  function CredentialsFlow (client) {
    this.client = client;
  }

  /**
   * Request an access token using the client credentials.
   *
   * @param {Object}   [options]
   * @param {Function} done
   */
  CredentialsFlow.prototype.getToken = function (options, done) {
    var self = this;

    // Allow the options argument to be omitted.
    if (typeof options === 'function') {
      done = options;
      options = null;
    }

    options = assign({}, this.client.options, options);

    expects(options, [
      'clientId',
      'clientSecret',
      'accessTokenUri'
    ]);

    // Base64 encode the client id and secret for the Authorization header.
    var authorization = btoa(options.clientId + ':' + options.clientSecret);

    return this.client._request({
      uri: options.accessTokenUri,
      method: 'POST',
      headers: {
        'Accept':        'application/json, application/x-www-form-urlencoded',
        'Content-Type':  'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + authorization
      },
      body: uriEncode({
        scope:      sanitizeScope(options.scopes),
        grant_type: 'client_credentials'
      })
    }, function (err, data) {
      // If an error exists or the data contains an error, return `done`.
      if (err || (err = getAuthError(data))) {
        return done(err);
      }

      return done(null, new ClientOAuth2Token(self, data));
    });
  };

  /**
   * Support authorization code OAuth 2.0 grant.
   *
   * Reference: http://tools.ietf.org/html/rfc6749#section-4.1
   *
   * @param {ClientOAuth2} client
   */
  function CodeFlow (client) {
    this.client = client;
  }

  /**
   * Generate the uri for doing the first redirect.
   *
   * @return {String}
   */
  CodeFlow.prototype.getUri = function (options) {
    options = assign({}, this.client.options, options);

    // Check the parameters have been set.
    expects(options, [
      'clientId',
      'redirectUri',
      'authorizationUri'
    ]);

    return options.authorizationUri + '?' + uriEncode({
      state:         options.state,
      scope:         sanitizeScope(options.scopes),
      client_id:     options.clientId,
      redirect_uri:  options.redirectUri,
      response_type: 'code'
    });
  };

  /**
   * Get the code token from the redirected uri and make another request for
   * the user access token.
   *
   * @param {String}   uri
   * @param {String}   [state]
   * @param {Function} done
   */
  CodeFlow.prototype.getToken = function (uri, state, done) {
    var self    = this;
    var options = this.client.options;
    var err;

    // State is an optional pass in.
    if (typeof state === 'function') {
      done  = state;
      state = null;
    }

    expects(options, [
      'clientId',
      'clientSecret',
      'redirectUri',
      'accessTokenUri'
    ]);

    // Make sure the uri matches our expected redirect uri.
    if (uri.substr(0, options.redirectUri.length) !== options.redirectUri) {
      return done(new Error('Invalid uri (should to match redirect): ' + uri));
    }

    // Extract the query string from the url.
    var queryString = uri.replace(/^[^\?]*|\#.*$/g, '').substr(1);

    // Check whether a query string is present in the uri.
    if (!queryString) {
      return done(new Error('Unable to process uri: ' + uri));
    }

    var query = uriDecode(queryString);

    // Check if the query string was populated with a known error.
    if (err = getAuthError(query)) {
      return done(err);
    }

    // Check whether the state is correct.
    if (state && query.state !== state) {
      return done(new Error('Invalid state:' + query.state));
    }

    // Check whether the response code is set.
    if (!query.code) {
      return done(new Error('Missing code, unable to request token'));
    }

    return this.client._request({
      uri: options.accessTokenUri,
      method: 'POST',
      headers: {
        'Accept':       'application/json, application/x-www-form-urlencoded',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: uriEncode({
        code:          query.code,
        grant_type:    'authorization_code',
        redirect_uri:  options.redirectUri,
        client_id:     options.clientId,
        client_secret: options.clientSecret
      })
    }, function (err, data, raw) {
      // If an error exists or the data contains an error, return `done`.
      if (err || (err = getAuthError(data))) {
        return done(err, null, raw);
      }

      return done(null, new ClientOAuth2Token(self, data), raw);
    });
  };

  /**
   * Export the OAuth2 client for multiple environments.
   */
  if (typeof define === 'function' && define.amd) {
    define([], function () {
      return ClientOAuth2;
    });
  } else if (typeof exports === 'object') {
    module.exports = ClientOAuth2;
  } else {
    root.ClientOAuth2 = ClientOAuth2;
  }
})(this);
