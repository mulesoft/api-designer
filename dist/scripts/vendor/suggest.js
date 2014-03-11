!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),(f.RAML||(f.RAML={})).Grammar=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var EmptySuggestor, SuggestionItem, Suggestor, UnionSuggestor, describedBySuggestor, dynamicResource, makeMethodGroupSuggestor, makeMethodSuggestor, methodBodySuggestor, namedParameterGroupSuggestor, namedParameterSuggestor, noopSuggestor, protocolsSuggestor, requestBodySuggestor, resourceBasicSuggestor, resourceFallback, resourceSuggestor, resourceTypeGroupSuggestor, resourceTypeSuggestor, responseBodyGroupSuggestor, responseBodyMimetypeSuggestor, responseGroupSuggestor, responseSuggestor, rootDocumentationSuggestor, rootSuggestor, securitySchemeTypeSuggestor, securitySchemesGroupSuggestor, securitySchemesSettingSuggestor, securitySchemesSuggestor, suggestorForPath, traitAdditions, traitGroupSuggestor, traitSuggestor,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

SuggestionItem = (function() {
  function SuggestionItem(key, suggestor, metadata) {
    this.key = key;
    this.suggestor = suggestor;
    this.metadata = metadata != null ? metadata : {};
  }

  SuggestionItem.prototype.matches = function(key) {
    return this.key === key || this.metadata.canBeOptional && this.key + '?' === key;
  };

  return SuggestionItem;

})();

Suggestor = (function() {
  function Suggestor(items, fallback, metadata) {
    this.items = items;
    this.fallback = fallback;
    this.metadata = metadata != null ? metadata : {};
    if (this.fallback == null) {
      this.fallback = function() {};
    }
  }

  Suggestor.prototype.suggestorFor = function(key) {
    var matchingItems;
    matchingItems = this.items.filter(function(item) {
      return item.matches(key);
    });
    if (matchingItems.length > 0) {
      return matchingItems[0].suggestor;
    } else {
      return this.fallback(key);
    }
  };

  Suggestor.prototype.suggestions = function() {
    var item, suggestions, _i, _len, _ref;
    suggestions = {};
    _ref = this.items;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      suggestions[item.key] = {
        metadata: item.metadata
      };
    }
    return suggestions;
  };

  return Suggestor;

})();

EmptySuggestor = (function(_super) {
  __extends(EmptySuggestor, _super);

  function EmptySuggestor(fallback) {
    EmptySuggestor.__super__.constructor.call(this, [], fallback);
  }

  return EmptySuggestor;

})(Suggestor);

UnionSuggestor = (function() {
  function UnionSuggestor(suggestors, fallback) {
    this.suggestors = suggestors;
    this.fallback = fallback;
    if (this.fallback == null) {
      this.fallback = function() {};
    }
  }

  UnionSuggestor.prototype.suggestorFor = function(key) {
    var suggestor, _i, _len, _ref;
    _ref = this.suggestors;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      suggestor = _ref[_i];
      if (suggestor = suggestor.suggestorFor(key)) {
        return suggestor;
      }
    }
    return this.fallback(key);
  };

  UnionSuggestor.prototype.suggestions = function() {
    var key, suggestions, suggestor, suggestorSuggestions, value, _i, _len, _ref;
    suggestions = {};
    _ref = this.suggestors;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      suggestor = _ref[_i];
      suggestorSuggestions = suggestor.suggestions();
      for (key in suggestorSuggestions) {
        value = suggestorSuggestions[key];
        suggestions[key] = value;
      }
    }
    return suggestions;
  };

  return UnionSuggestor;

})();

noopSuggestor = new EmptySuggestor;

namedParameterSuggestor = new Suggestor([
  new SuggestionItem('description', noopSuggestor, {
    category: 'docs'
  }), new SuggestionItem('displayName', noopSuggestor, {
    category: 'docs'
  }), new SuggestionItem('example', noopSuggestor, {
    category: 'docs'
  }), new SuggestionItem('default', noopSuggestor, {
    category: 'parameters'
  }), new SuggestionItem('enum', noopSuggestor, {
    category: 'parameters'
  }), new SuggestionItem('maximum', noopSuggestor, {
    category: 'parameters'
  }), new SuggestionItem('maxLength', noopSuggestor, {
    category: 'parameters'
  }), new SuggestionItem('minimum', noopSuggestor, {
    category: 'parameters'
  }), new SuggestionItem('minLength', noopSuggestor, {
    category: 'parameters'
  }), new SuggestionItem('pattern', noopSuggestor, {
    category: 'parameters'
  }), new SuggestionItem('required', noopSuggestor, {
    category: 'parameters'
  }), new SuggestionItem('type', noopSuggestor, {
    category: 'parameters'
  })
]);

namedParameterGroupSuggestor = new EmptySuggestor(function(key) {
  return namedParameterSuggestor;
});

responseBodyMimetypeSuggestor = new Suggestor([
  new SuggestionItem('schema', noopSuggestor, {
    category: 'schemas'
  }), new SuggestionItem('example', noopSuggestor, {
    category: 'docs'
  })
]);

responseBodyGroupSuggestor = new Suggestor([
  new SuggestionItem('application/json', responseBodyMimetypeSuggestor, {
    category: 'body'
  }), new SuggestionItem('application/x-www-form-urlencoded', responseBodyMimetypeSuggestor, {
    category: 'body'
  }), new SuggestionItem('application/xml', responseBodyMimetypeSuggestor, {
    category: 'body'
  }), new SuggestionItem('multipart/form-data', responseBodyMimetypeSuggestor, {
    category: 'body'
  })
]);

responseSuggestor = new Suggestor([
  new SuggestionItem('body', responseBodyGroupSuggestor, {
    category: 'responses'
  }), new SuggestionItem('description', noopSuggestor, {
    category: 'docs'
  })
]);

responseGroupSuggestor = new EmptySuggestor(function(key) {
  if (/\d{3}/.test(key)) {
    return responseSuggestor;
  }
});

requestBodySuggestor = new EmptySuggestor(function() {
  return namedParameterGroupSuggestor;
});

methodBodySuggestor = new Suggestor([
  new SuggestionItem('application/json', noopSuggestor, {
    category: 'body'
  }), new SuggestionItem('application/x-www-form-urlencoded', requestBodySuggestor, {
    category: 'body'
  }), new SuggestionItem('application/xml', noopSuggestor, {
    category: 'body'
  }), new SuggestionItem('multipart/form-data', requestBodySuggestor, {
    category: 'body'
  })
]);

protocolsSuggestor = new Suggestor([
  new SuggestionItem('HTTP', noopSuggestor, {
    isText: true
  }), new SuggestionItem('HTTPS', noopSuggestor, {
    isText: true
  })
], null, {
  isList: true
});

makeMethodSuggestor = function() {
  return new Suggestor([
    new SuggestionItem('description', noopSuggestor, {
      category: 'docs'
    }), new SuggestionItem('body', methodBodySuggestor, {
      category: 'body'
    }), new SuggestionItem('protocols', protocolsSuggestor, {
      category: 'root'
    }), new SuggestionItem('baseUriParameters', namedParameterGroupSuggestor, {
      category: 'parameters'
    }), new SuggestionItem('headers', namedParameterGroupSuggestor, {
      category: 'parameters'
    }), new SuggestionItem('queryParameters', namedParameterGroupSuggestor, {
      category: 'parameters'
    }), new SuggestionItem('responses', responseGroupSuggestor, {
      category: 'responses'
    }), new SuggestionItem('securedBy', noopSuggestor, {
      category: 'security'
    })
  ]);
};

makeMethodGroupSuggestor = function(optional) {
  var method, methodSuggestor;
  if (optional == null) {
    optional = false;
  }
  methodSuggestor = new UnionSuggestor([
    makeMethodSuggestor(), new Suggestor([
      new SuggestionItem('is', noopSuggestor, {
        category: 'traits and types'
      })
    ])
  ]);
  return new Suggestor((function() {
    var _i, _len, _ref, _results;
    _ref = ['options', 'get', 'head', 'post', 'put', 'delete', 'trace', 'connect', 'patch'];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      method = _ref[_i];
      _results.push(new SuggestionItem(method, methodSuggestor, {
        category: 'methods',
        canBeOptional: optional
      }));
    }
    return _results;
  })());
};

resourceBasicSuggestor = new Suggestor([
  new SuggestionItem('description', noopSuggestor, {
    category: 'docs'
  }), new SuggestionItem('displayName', noopSuggestor, {
    category: 'docs'
  }), new SuggestionItem('securedBy', noopSuggestor, {
    category: 'security'
  }), new SuggestionItem('type', noopSuggestor, {
    category: 'traits and types'
  }), new SuggestionItem('is', noopSuggestor, {
    category: 'traits and types'
  })
]);

resourceFallback = function(key) {
  if (/^\//.test(key)) {
    return resourceSuggestor;
  }
};

dynamicResource = new SuggestionItem('<resource>', resourceSuggestor, {
  category: 'resources',
  dynamic: true
});

resourceSuggestor = new UnionSuggestor([
  resourceBasicSuggestor, makeMethodGroupSuggestor(), new Suggestor([
    new SuggestionItem('baseUriParameters', namedParameterGroupSuggestor, {
      category: 'parameters'
    }), new SuggestionItem('uriParameters', namedParameterGroupSuggestor, {
      category: 'parameters'
    }), dynamicResource
  ])
], resourceFallback);

traitAdditions = new Suggestor([
  new SuggestionItem('displayName', noopSuggestor, {
    category: 'docs'
  }), new SuggestionItem('usage', noopSuggestor, {
    category: 'docs'
  })
]);

traitSuggestor = new UnionSuggestor([traitAdditions, makeMethodSuggestor()]);

resourceTypeSuggestor = new UnionSuggestor([
  resourceBasicSuggestor, makeMethodGroupSuggestor(true), new Suggestor([
    new SuggestionItem('baseUriParameters', namedParameterGroupSuggestor, {
      category: 'parameters',
      canBeOptional: true
    }), new SuggestionItem('uriParameters', namedParameterGroupSuggestor, {
      category: 'parameters',
      canBeOptional: true
    }), new SuggestionItem('usage', noopSuggestor, {
      category: 'docs'
    })
  ])
]);

securitySchemesSettingSuggestor = new Suggestor([
  new SuggestionItem('accessTokenUri', noopSuggestor, {
    category: 'security'
  }), new SuggestionItem('authorizationGrants', noopSuggestor, {
    category: 'security'
  }), new SuggestionItem('authorizationUri', noopSuggestor, {
    category: 'security'
  }), new SuggestionItem('requestTokenUri', noopSuggestor, {
    category: 'security'
  }), new SuggestionItem('scopes', noopSuggestor, {
    category: 'security'
  }), new SuggestionItem('tokenCredentialsUri', noopSuggestor, {
    category: 'security'
  })
]);

securitySchemeTypeSuggestor = new Suggestor([
  new SuggestionItem('OAuth 1.0', noopSuggestor, {
    category: 'security'
  }), new SuggestionItem('OAuth 2.0', noopSuggestor, {
    category: 'security'
  }), new SuggestionItem('Basic Authentication', noopSuggestor, {
    category: 'security'
  }), new SuggestionItem('Digest Authentication', noopSuggestor, {
    category: 'security'
  })
]);

describedBySuggestor = new Suggestor([
  new SuggestionItem('headers', namedParameterGroupSuggestor, {
    category: 'parameters'
  }), new SuggestionItem('queryParameters', namedParameterGroupSuggestor, {
    category: 'parameters'
  }), new SuggestionItem('responses', responseGroupSuggestor, {
    category: 'responses'
  })
]);

securitySchemesSuggestor = new Suggestor([
  new SuggestionItem('description', noopSuggestor, {
    category: 'docs'
  }), new SuggestionItem('describedBy', describedBySuggestor, {
    category: 'security'
  }), new SuggestionItem('type', securitySchemeTypeSuggestor, {
    category: 'security'
  }), new SuggestionItem('settings', securitySchemesSettingSuggestor, {
    category: 'security'
  })
]);

traitGroupSuggestor = new EmptySuggestor(function() {
  return traitSuggestor;
});

resourceTypeGroupSuggestor = new EmptySuggestor(function() {
  return resourceTypeSuggestor;
});

securitySchemesGroupSuggestor = new EmptySuggestor(function() {
  return securitySchemesSuggestor;
});

rootDocumentationSuggestor = new Suggestor([
  new SuggestionItem('content', noopSuggestor, {
    category: 'docs'
  }), new SuggestionItem('title', noopSuggestor, {
    category: 'docs'
  })
], null, {
  isList: true
});

rootSuggestor = new Suggestor([
  new SuggestionItem('baseUriParameters', namedParameterGroupSuggestor, {
    category: 'parameters'
  }), new SuggestionItem('baseUri', noopSuggestor, {
    category: 'root'
  }), new SuggestionItem('mediaType', noopSuggestor, {
    category: 'root'
  }), new SuggestionItem('protocols', protocolsSuggestor, {
    category: 'root'
  }), new SuggestionItem('title', noopSuggestor, {
    category: 'root'
  }), new SuggestionItem('version', noopSuggestor, {
    category: 'root'
  }), new SuggestionItem('documentation', rootDocumentationSuggestor, {
    category: 'docs'
  }), new SuggestionItem('schemas', noopSuggestor, {
    category: 'schemas'
  }), new SuggestionItem('securedBy', noopSuggestor, {
    category: 'security'
  }), new SuggestionItem('securitySchemes', securitySchemesGroupSuggestor, {
    category: 'security'
  }), new SuggestionItem('resourceTypes', resourceTypeGroupSuggestor, {
    category: 'traits and types'
  }), new SuggestionItem('traits', traitGroupSuggestor, {
    category: 'traits and types'
  }), dynamicResource
], resourceFallback);

suggestorForPath = function(path) {
  var suggestor;
  if (!path) {
    path = [];
  }
  suggestor = rootSuggestor;
  while (suggestor && path.length) {
    suggestor = suggestor.suggestorFor(path.shift());
  }
  return suggestor;
};

this.suggestRAML = function(path) {
  var suggestor;
  suggestor = (suggestorForPath(path)) || noopSuggestor;
  return {
    suggestions: suggestor.suggestions(),
    metadata: suggestor.metadata
  };
};


},{}]},{},[1])
(1)
});;