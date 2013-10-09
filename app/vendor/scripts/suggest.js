;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Alternatives, Boolean, ConstantString, Include, Integer, JSONSchema, ListNode, Markdown, Multiple, Node, NodeMap, PostposedExecution, Regex, StringNode, TreeMap, Tuple, XMLSchema, action, actionDefinition, actionName, baseUri, baseUriParameters, body, bodyCategory, bodySchema, boolean, cache, chapter, d3fault, describedBy, description, docsCategory, documentation, enum2, example, formParameters, header, headers, include, integer, isTrait, jsonSchema, listNode, markdown, maxLength, maximum, mediaType, methodsCategory, mimeType, mimeTypeParameters, minLength, minimum, model, name, notImplemented, parameterProperty, parameterType, parametersCategory, pattern, postposedResource, protocols, protocolsAlternatives, queryParameterDefinition, queryParameters, regex, required, resource, resourceDefinition, resourceTypes, resourceTypesDefinition, resourcesCategory, responseCode, responses, responsesCategory, root, rootCategory, rootElement, schemas, schemasCategory, securedBy, securityCategory, securitySchemes, securitySchemesDefinition, securityType, settingAlternative, settings, stringNode, summary, title, traits, traitsAndResourceTypesCategory, traitsDefinition, transverse, transversePrimitive, typ3, type, uriParameter, uriParameters, version, xmlSchema, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8,
  __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

typ3 = require('./utils.coffee').typ3;

Tuple = (function() {
  function Tuple(key, value, metadata) {
    this.key = key;
    this.value = value;
    this.metadata = metadata != null ? metadata : {
      category: 'docs'
    };
    if (typ3(this.metadata) === 'string') {
      throw new Error("Metadata should be a dictionary");
    }
    if (!this.key instanceof Node && typ3(this.key) !== 'string') {
      throw "Key: '" + (JSON.stringify(key)) + "' of type '" + (typ3(key)) + "' must be an string";
    }
  }

  return Tuple;

})();

Alternatives = (function() {
  function Alternatives() {
    var alternatives;
    alternatives = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    this.alternatives = alternatives;
  }

  return Alternatives;

})();

Multiple = (function() {
  function Multiple(element) {
    this.element = element;
  }

  return Multiple;

})();

PostposedExecution = (function() {
  function PostposedExecution(f) {
    this.f = f;
  }

  return PostposedExecution;

})();

Node = (function() {
  function Node() {}

  return Node;

})();

Markdown = (function(_super) {
  __extends(Markdown, _super);

  function Markdown() {
    _ref = Markdown.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return Markdown;

})(Node);

Include = (function(_super) {
  __extends(Include, _super);

  function Include() {
    _ref1 = Include.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  return Include;

})(Node);

JSONSchema = (function(_super) {
  __extends(JSONSchema, _super);

  function JSONSchema() {
    _ref2 = JSONSchema.__super__.constructor.apply(this, arguments);
    return _ref2;
  }

  return JSONSchema;

})(Node);

Regex = (function(_super) {
  __extends(Regex, _super);

  function Regex() {
    _ref3 = Regex.__super__.constructor.apply(this, arguments);
    return _ref3;
  }

  return Regex;

})(Node);

Integer = (function(_super) {
  __extends(Integer, _super);

  function Integer() {
    _ref4 = Integer.__super__.constructor.apply(this, arguments);
    return _ref4;
  }

  return Integer;

})(Node);

Boolean = (function(_super) {
  __extends(Boolean, _super);

  function Boolean() {
    _ref5 = Boolean.__super__.constructor.apply(this, arguments);
    return _ref5;
  }

  return Boolean;

})(Node);

XMLSchema = (function(_super) {
  __extends(XMLSchema, _super);

  function XMLSchema() {
    _ref6 = XMLSchema.__super__.constructor.apply(this, arguments);
    return _ref6;
  }

  return XMLSchema;

})(Node);

StringNode = (function(_super) {
  __extends(StringNode, _super);

  function StringNode() {
    _ref7 = StringNode.__super__.constructor.apply(this, arguments);
    return _ref7;
  }

  return StringNode;

})(Node);

ListNode = (function(_super) {
  __extends(ListNode, _super);

  function ListNode() {
    _ref8 = ListNode.__super__.constructor.apply(this, arguments);
    return _ref8;
  }

  return ListNode;

})(Node);

ConstantString = (function(_super) {
  __extends(ConstantString, _super);

  function ConstantString(value) {
    this.value = value;
  }

  return ConstantString;

})(Node);

notImplemented = function() {
  throw new Error('Not implemented');
};

NodeMap = (function() {
  function NodeMap() {}

  NodeMap.markdown = notImplemented;

  NodeMap.include = notImplemented;

  NodeMap.jsonSchema = notImplemented;

  NodeMap.regex = notImplemented;

  NodeMap.integer = notImplemented;

  NodeMap.boolean = notImplemented;

  NodeMap.xmlSchema = notImplemented;

  NodeMap.stringNode = notImplemented;

  NodeMap.listNode = notImplemented;

  NodeMap.constantString = notImplemented;

  return NodeMap;

})();

markdown = new Markdown();

include = new Include();

jsonSchema = new JSONSchema();

regex = new Regex();

integer = new Integer();

boolean = new Boolean();

xmlSchema = new XMLSchema();

stringNode = new StringNode();

listNode = new ListNode();

transversePrimitive = function(nodeMap, node) {
  if (node === void 0) {
    throw new Error('Invalid root specified');
  }
  switch (node.constructor) {
    case Markdown:
      return nodeMap.markdown(node);
    case Include:
      return nodeMap.include(node);
    case JSONSchema:
      return nodeMap.jsonSchema(node);
    case Regex:
      return nodeMap.regex(node);
    case Integer:
      return nodeMap.integer(node);
    case Boolean:
      return nodeMap.boolean(node);
    case XMLSchema:
      return nodeMap.xmlSchema(node);
    case StringNode:
      return nodeMap.stringNode(node);
    case ListNode:
      return nodeMap.listNode(node);
    case ConstantString:
      return nodeMap.constantString(node);
    default:
      throw "Invalid state: type '" + (typ3(root)) + "' object '" + root + "'";
  }
};

TreeMap = (function() {
  function TreeMap() {}

  TreeMap.alternatives = notImplemented;

  TreeMap.tuple = notImplemented;

  TreeMap.multiple = notImplemented;

  TreeMap.postponedExecution = notImplemented;

  TreeMap.node = notImplemented;

  return TreeMap;

})();

cache = [];

transverse = function(treeMap, root) {
  var a, alternative, alternatives, b, cachedResult, cachedRoot, cachedTree, element, f, key, m, promise, result, value, _i, _len, _ref9;
  if (root === void 0) {
    throw new Error('Invalid root specified');
  }
  for (_i = 0, _len = cache.length; _i < _len; _i++) {
    _ref9 = cache[_i], cachedTree = _ref9.cachedTree, cachedRoot = _ref9.cachedRoot, cachedResult = _ref9.cachedResult;
    if (cachedTree === treeMap && cachedRoot === root) {
      return cachedResult;
    }
  }
  result = (function() {
    switch (root.constructor) {
      case Alternatives:
        alternatives = root.alternatives;
        alternatives = (function() {
          var _j, _len1, _results;
          _results = [];
          for (_j = 0, _len1 = alternatives.length; _j < _len1; _j++) {
            alternative = alternatives[_j];
            _results.push(transverse(treeMap, alternative));
          }
          return _results;
        })();
        return treeMap.alternatives(root, alternatives);
      case Tuple:
        key = root.key, value = root.value;
        a = transverse(treeMap, key);
        b = transverse(treeMap, value);
        return treeMap.tuple(root, a, b);
      case Multiple:
        element = root.element;
        m = transverse(treeMap, element);
        return treeMap.multiple(root, m);
      case PostposedExecution:
        f = root.f;
        promise = new PostposedExecution(function() {
          return transverse(treeMap, f());
        });
        return treeMap.postponedExecution(root, promise);
      default:
        if (root instanceof Node) {
          return treeMap.node(root);
        } else {
          throw new Error("Invalid state: type '" + (typ3(root)) + "' object '" + root + "'");
        }
    }
  })();
  cache.push({
    cachedTree: treeMap,
    cachedRoot: root,
    cachedResult: result
  });
  return result;
};

this.transverse = transverse;

rootCategory = {
  category: 'root'
};

docsCategory = {
  category: 'docs'
};

parametersCategory = {
  category: 'parameters'
};

schemasCategory = {
  category: 'schemas'
};

bodyCategory = {
  category: 'body'
};

responsesCategory = {
  category: 'responses'
};

methodsCategory = {
  category: 'methods'
};

securityCategory = {
  category: 'security'
};

traitsAndResourceTypesCategory = {
  category: 'traits and types'
};

resourcesCategory = {
  category: 'resources',
  id: 'resource'
};

title = new Tuple(new ConstantString('title'), stringNode, rootCategory);

version = new Tuple(new ConstantString('version'), stringNode, rootCategory);

baseUri = new Tuple(new ConstantString('baseUri'), stringNode, rootCategory);

model = new Tuple(stringNode, jsonSchema, rootCategory);

schemas = new Tuple(new ConstantString('schemas'), new Multiple(model), rootCategory);

protocolsAlternatives = new Alternatives(new ConstantString('HTTP'), new ConstantString('HTTPS'));

protocols = new Tuple(new ConstantString('protocols'), protocolsAlternatives, rootCategory);

name = new Tuple(new ConstantString('displayName'), stringNode, docsCategory);

description = new Tuple(new ConstantString('description'), stringNode, docsCategory);

parameterType = new Tuple(new ConstantString('type'), new Alternatives(new ConstantString('string'), new ConstantString('number'), new ConstantString('integer'), new ConstantString('date'), new ConstantString('boolean')), parametersCategory);

enum2 = new Tuple(new ConstantString('enum'), new Multiple(stringNode), parametersCategory);

pattern = new Tuple(new ConstantString('pattern'), regex, parametersCategory);

minLength = new Tuple(new ConstantString('minLength'), integer, parametersCategory);

maxLength = new Tuple(new ConstantString('maxLength'), integer, parametersCategory);

minimum = new Tuple(new ConstantString('minimum'), integer, parametersCategory);

maximum = new Tuple(new ConstantString('maximum'), integer, parametersCategory);

required = new Tuple(new ConstantString('required'), boolean, parametersCategory);

d3fault = new Tuple(new ConstantString('default'), stringNode, parametersCategory);

parameterProperty = new Alternatives(name, description, parameterType, enum2, pattern, minLength, maxLength, maximum, minimum, required, d3fault);

uriParameter = new Tuple(stringNode, new Multiple(parameterProperty), parametersCategory);

uriParameters = new Tuple(new ConstantString('uriParameters'), new Multiple(uriParameter), parametersCategory);

baseUriParameters = new Tuple(new ConstantString('baseUriParameters'), new Multiple(uriParameter), parametersCategory);

mediaType = new Tuple(new ConstantString('mediaType'), new Alternatives(stringNode, new Multiple(stringNode)), rootCategory);

chapter = new Alternatives(title, new Tuple(new ConstantString('content'), stringNode));

documentation = new Tuple(new ConstantString('documentation'), new Multiple(chapter), rootCategory);

summary = new Tuple(new ConstantString('summary'), stringNode, docsCategory);

example = new Tuple(new ConstantString('example'), stringNode, docsCategory);

header = new Tuple(stringNode, new Multiple(new Alternatives(parameterProperty, example)), parametersCategory);

headers = new Tuple(new ConstantString('headers'), new Multiple(header), parametersCategory);

queryParameterDefinition = new Tuple(stringNode, new Multiple(new Alternatives(parameterProperty, example)), parametersCategory);

queryParameters = new Tuple(new ConstantString('queryParameters'), new Multiple(queryParameterDefinition), parametersCategory);

formParameters = new Tuple(new ConstantString('formParameters'), new Multiple(new Alternatives(parameterProperty, example)), parametersCategory);

bodySchema = new Tuple(new ConstantString('schema'), new Alternatives(xmlSchema, jsonSchema), schemasCategory);

mimeTypeParameters = new Multiple(new Alternatives(bodySchema, example));

mimeType = new Alternatives(new Tuple(new ConstantString('application/x-www-form-urlencoded'), new Multiple(formParameters)), new Tuple(new ConstantString('multipart/form-data'), new Multiple(formParameters)), new Tuple(new ConstantString('application/json'), new Multiple(mimeTypeParameters)), new Tuple(new ConstantString('application/xml'), new Multiple(mimeTypeParameters)), new Tuple(stringNode, new Multiple(mimeTypeParameters)));

body = new Tuple(new ConstantString('body'), new Multiple(mimeType), bodyCategory);

responseCode = new Tuple(new Multiple(integer), new Multiple(new Alternatives(body, description)), responsesCategory);

responses = new Tuple(new ConstantString('responses'), new Multiple(responseCode), responsesCategory);

securedBy = new Tuple(new ConstantString('securedBy'), listNode, securityCategory);

actionDefinition = new Alternatives(summary, description, headers, queryParameters, body, responses, securedBy, protocols);

action = (function(func, args, ctor) {
  ctor.prototype = func.prototype;
  var child = new ctor, result = func.apply(child, args);
  return Object(result) === result ? result : child;
})(Alternatives, (function() {
  var _i, _len, _ref9, _results;
  _ref9 = ['get', 'post', 'put', 'delete', 'head', 'patch', 'options'];
  _results = [];
  for (_i = 0, _len = _ref9.length; _i < _len; _i++) {
    actionName = _ref9[_i];
    _results.push(new Tuple(new ConstantString(actionName), new Multiple(actionDefinition), methodsCategory));
  }
  return _results;
})(), function(){});

isTrait = new Tuple(new ConstantString('is'), listNode, traitsAndResourceTypesCategory);

type = new Tuple(new ConstantString('type'), stringNode, traitsAndResourceTypesCategory);

postposedResource = new Tuple(stringNode, new PostposedExecution(function() {
  return resourceDefinition;
}), resourcesCategory);

resourceDefinition = new Alternatives(name, action, isTrait, type, postposedResource, securedBy, uriParameters, baseUriParameters);

resource = new Tuple(stringNode, new Multiple(resourceDefinition), resourcesCategory);

traitsDefinition = new Tuple(stringNode, new Multiple(new Alternatives(name, summary, description, headers, queryParameters, body, responses, securedBy, protocols)), traitsAndResourceTypesCategory);

traits = new Tuple(new ConstantString('traits'), new Multiple(traitsDefinition), traitsAndResourceTypesCategory);

resourceTypesDefinition = new Tuple(stringNode, new Multiple(new Alternatives(summary, description, name, action, isTrait, type, securedBy, baseUriParameters, uriParameters)), traitsAndResourceTypesCategory);

resourceTypes = new Tuple(new ConstantString('resourceTypes'), resourceTypesDefinition, traitsAndResourceTypesCategory);

settingAlternative = [];

settingAlternative = settingAlternative.concat([
  new Tuple(new ConstantString('requestTokenUri'), stringNode, {
    category: 'security',
    type: ['OAuth 1.0']
  }), new Tuple(new ConstantString('authorizationUri'), stringNode, {
    category: 'security',
    type: ['OAuth 1.0', 'OAuth 2.0']
  }), new Tuple(new ConstantString('tokenCredentialsUri'), stringNode, {
    category: 'security',
    type: ['OAuth 1.0']
  })
]);

settingAlternative = settingAlternative.concat([
  new Tuple(new ConstantString('accessTokenUri'), stringNode, {
    category: 'security',
    type: ['OAuth 2.0']
  }), new Tuple(new ConstantString('authorizationGrants'), stringNode, {
    category: 'security',
    type: ['OAuth 2.0']
  }), new Tuple(new ConstantString('scopes'), stringNode, {
    category: 'security',
    type: ['OAuth 2.0']
  })
]);

settingAlternative = settingAlternative.concat([
  new Tuple(stringNode, stringNode, {
    category: 'security'
  })
]);

securityType = new Tuple(new ConstantString('type'), new Alternatives(new ConstantString('OAuth 1.0'), new ConstantString('OAuth 2.0'), new ConstantString('Basic Authentication'), new ConstantString('Digest Authentication'), stringNode), securityCategory);

describedBy = new Tuple(new ConstantString('describedBy'), new Alternatives(headers, queryParameters, responses), securityCategory);

settings = new Tuple(new ConstantString('settings'), (function(func, args, ctor) {
  ctor.prototype = func.prototype;
  var child = new ctor, result = func.apply(child, args);
  return Object(result) === result ? result : child;
})(Alternatives, settingAlternative, function(){}));

securitySchemesDefinition = new Tuple(stringNode, new Multiple(new Alternatives(description, securityType, settings, describedBy)));

securitySchemes = new Tuple(new ConstantString('securitySchemes'), securitySchemesDefinition, securityCategory);

rootElement = new Alternatives(title, version, schemas, baseUri, baseUriParameters, mediaType, documentation, resource, traits, resourceTypes, securitySchemes, securedBy, protocols);

root = new Multiple(rootElement);

this.root = root;

this.transversePrimitive = transversePrimitive;

this.TreeMap = TreeMap;

this.NodeMap = NodeMap;

this.integer = integer;


},{"./utils.coffee":3}],2:[function(require,module,exports){
var IntegerWildcard, InvalidState, NodeMap, OpenSuggestion, SimpleSuggestion, StringWildcard, SuggestItem, Suggestion, SuggestionNode, SuggestionNodeMap, TreeMap, TreeMapToSuggestionTree, functionize, integer, integerWildcard, invalidState, root, stringWilcard, suggest, suggestRAML, suggestionTree, transverse, transversePrimitive, type, _ref, _ref1, _ref2,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

type = require('./utils.coffee').typ3;

_ref = require('./main.coffee'), TreeMap = _ref.TreeMap, NodeMap = _ref.NodeMap, transverse = _ref.transverse, root = _ref.root, transversePrimitive = _ref.transversePrimitive, integer = _ref.integer;

Suggestion = (function() {
  function Suggestion() {}

  return Suggestion;

})();

SimpleSuggestion = (function(_super) {
  __extends(SimpleSuggestion, _super);

  function SimpleSuggestion(suggestions) {
    this.suggestions = suggestions;
    this.isScalar = false;
  }

  return SimpleSuggestion;

})(Suggestion);

OpenSuggestion = (function(_super) {
  __extends(OpenSuggestion, _super);

  function OpenSuggestion(suggestions, open, metadata) {
    this.suggestions = suggestions;
    this.open = open;
    this.metadata = metadata;
    this.isScalar = false;
  }

  return OpenSuggestion;

})(Suggestion);

SuggestItem = (function() {
  function SuggestItem(open, value, metadata) {
    this.open = open;
    this.value = value;
    this.metadata = metadata;
    this.isScalar = false;
  }

  return SuggestItem;

})();

SuggestionNode = (function() {
  function SuggestionNode(name, isScalar) {
    this.name = name;
    this.isScalar = isScalar != null ? isScalar : true;
  }

  return SuggestionNode;

})();

StringWildcard = (function(_super) {
  __extends(StringWildcard, _super);

  function StringWildcard() {
    this.isScalar = true;
  }

  return StringWildcard;

})(SuggestionNode);

stringWilcard = new StringWildcard;

IntegerWildcard = (function(_super) {
  __extends(IntegerWildcard, _super);

  function IntegerWildcard() {
    this.isScalar = true;
  }

  return IntegerWildcard;

})(SuggestionNode);

integerWildcard = new IntegerWildcard;

InvalidState = (function() {
  function InvalidState(suggestions) {
    this.suggestions = suggestions != null ? suggestions : {};
  }

  InvalidState.prototype.open = function() {
    return this;
  };

  return InvalidState;

})();

invalidState = new InvalidState;

SuggestionNodeMap = (function(_super) {
  var name;

  __extends(SuggestionNodeMap, _super);

  function SuggestionNodeMap() {
    _ref1 = SuggestionNodeMap.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  name = function(node) {
    return new SuggestionNode(node.constructor.name);
  };

  SuggestionNodeMap.markdown = name;

  SuggestionNodeMap.include = name;

  SuggestionNodeMap.jsonSchema = name;

  SuggestionNodeMap.regex = name;

  SuggestionNodeMap.integer = function() {
    return integerWildcard;
  };

  SuggestionNodeMap.boolean = name;

  SuggestionNodeMap.xmlSchema = name;

  SuggestionNodeMap.stringNode = function() {
    return stringWilcard;
  };

  SuggestionNodeMap.listNode = function() {
    return stringWilcard;
  };

  SuggestionNodeMap.constantString = function(root) {
    return new SuggestionNode(root.value);
  };

  return SuggestionNodeMap;

})(NodeMap);

functionize = function(value) {
  if (type(value) === 'function') {
    return value;
  } else {
    return function() {
      return value;
    };
  }
};

TreeMapToSuggestionTree = (function(_super) {
  __extends(TreeMapToSuggestionTree, _super);

  function TreeMapToSuggestionTree() {
    _ref2 = TreeMapToSuggestionTree.__super__.constructor.apply(this, arguments);
    return _ref2;
  }

  TreeMapToSuggestionTree.alternatives = function(root, alternatives) {
    var alternative, constructor, d, key, metadata, open, possibleMetadata, possibleOpen, suggestions, value, _i, _len, _ref3;
    d = {};
    for (_i = 0, _len = alternatives.length; _i < _len; _i++) {
      alternative = alternatives[_i];
      suggestions = alternative.suggestions, possibleOpen = alternative.open, possibleMetadata = alternative.metadata, constructor = alternative.constructor;
      switch (constructor) {
        case SimpleSuggestion:
          for (key in suggestions) {
            value = suggestions[key];
            d[key] = value;
          }
          break;
        case OpenSuggestion:
          _ref3 = [possibleOpen, possibleMetadata], open = _ref3[0], metadata = _ref3[1];
          break;
        case SuggestionNode:
        case StringWildcard:
        case IntegerWildcard:
          void 0;
          break;
        default:
          throw new Error("Invalid type: " + alternative + " of type " + constructor);
      }
    }
    if (open != null) {
      return new OpenSuggestion(d, (function() {
        return open();
      }), metadata);
    } else {
      return new SimpleSuggestion(d);
    }
  };

  TreeMapToSuggestionTree.multiple = function(root, element) {
    return element;
  };

  TreeMapToSuggestionTree.tuple = function(root, key, value) {
    var d, metadata;
    metadata = root.metadata;
    switch (key.constructor) {
      case StringWildcard:
      case IntegerWildcard:
        return new OpenSuggestion({}, functionize(value), metadata);
      default:
        d = {};
        d[key.name] = new SuggestItem(functionize(value), key, metadata);
        return new SimpleSuggestion(d);
    }
  };

  TreeMapToSuggestionTree.postponedExecution = function(root, execution) {
    return execution.f;
  };

  TreeMapToSuggestionTree.node = function(root) {
    return transversePrimitive(SuggestionNodeMap, root);
  };

  return TreeMapToSuggestionTree;

})(TreeMap);

suggestionTree = transverse(TreeMapToSuggestionTree, root);

suggest = function(root, index, path) {
  var currentSuggestion, key, suggestions, val;
  key = path[index];
  if (key == null) {
    return root;
  }
  suggestions = root.suggestions;
  if (suggestions) {
    currentSuggestion = suggestions[key];
  } else {
    currentSuggestion = void 0;
  }
  val = (function() {
    if (currentSuggestion) {
      switch (currentSuggestion.constructor) {
        case OpenSuggestion:
        case SuggestItem:
          return currentSuggestion;
        default:
          switch (root.constructor) {
            case OpenSuggestion:
            case SuggestItem:
              return root;
            default:
              return invalidState;
          }
      }
    } else {
      switch (root.constructor) {
        case OpenSuggestion:
        case SuggestItem:
          return root;
        default:
          return invalidState;
      }
    }
  })();
  val = val.open();
  return suggest(val, index + 1, path);
};

suggestRAML = function(path) {
  return suggest(suggestionTree, 0, path);
};

this.suggestRAML = suggestRAML;

if (typeof window !== 'undefined') {
  window.suggestRAML = suggestRAML;
}


},{"./main.coffee":1,"./utils.coffee":3}],3:[function(require,module,exports){
var typ3;

typ3 = function(obj) {
  var classToType, myClass, name, _i, _len, _ref;
  if (obj === void 0 || obj === null) {
    return String(obj);
  }
  classToType = new Object;
  _ref = "Boolean Number String Function Array Date RegExp".split(" ");
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    name = _ref[_i];
    classToType["[object " + name + "]"] = name.toLowerCase();
  }
  myClass = Object.prototype.toString.call(obj);
  if (myClass in classToType) {
    return classToType[myClass];
  }
  return "object";
};

this.typ3 = typ3;


},{}]},{},[2])
;