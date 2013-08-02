;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
var Alternatives, Boolean, Category, ConstantString, Include, Integer, JSONSchema, Markdown, Multiple, Node, NodeMap, PostposedExecution, PrimitiveAlternatives, Regex, StringNode, TreeMap, Tuple, XMLSchema, action, actionDefinition, actionName, baseUri, body, bodySchema, boolean, chapter, d3fault, defaultMediaTypes, description, documentation, enum2, example, excludes, formParameters, header, headers, include, integer, jsonSchema, markdown, maxLength, maximum, mimeType, mimeTypeParameters, minLength, minimum, model, name, notImplemented, parameterProperty, pattern, provides, queryParameterDefinition, queryParameters, regex, required, requires, resource, resourceDefinition, responseCode, responses, root, rootElement, schemas, stringNode, summary, title, trait, traitDefinition, traits, transverse, transversePrimitive, typ3, type, uriParameter, uriParameters, use, version, xmlSchema, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7,
  __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

typ3 = require('./utils.coffee').typ3;

Tuple = (function() {
  function Tuple(key, value, category) {
    this.key = key;
    this.value = value;
    this.category = category != null ? category : 'spec';
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

PrimitiveAlternatives = (function() {
  function PrimitiveAlternatives() {
    var alternatives;
    alternatives = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    this.alternatives = alternatives;
  }

  return PrimitiveAlternatives;

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

transversePrimitive = function(nodeMap, node) {
  if (node === void 0) {
    throw new Error('Invalid root specified');
  }
  switch (false) {
    case !(node instanceof Markdown):
      return nodeMap.markdown(node);
    case !(node instanceof Include):
      return nodeMap.include(node);
    case !(node instanceof JSONSchema):
      return nodeMap.jsonSchema(node);
    case !(node instanceof Regex):
      return nodeMap.regex(node);
    case !(node instanceof Integer):
      return nodeMap.integer(node);
    case !(node instanceof Boolean):
      return nodeMap.boolean(node);
    case !(node instanceof XMLSchema):
      return nodeMap.xmlSchema(node);
    case !(node instanceof StringNode):
      return nodeMap.stringNode(node);
    case !(node instanceof ConstantString):
      return nodeMap.constantString(node);
    default:
      throw 'Invalid state: type ' + typ3(root) + ' object ' + root;
  }
};

TreeMap = (function() {
  function TreeMap() {}

  TreeMap.alternatives = notImplemented;

  TreeMap.tuple = notImplemented;

  TreeMap.multiple = notImplemented;

  TreeMap.primitiveAlternatives = notImplemented;

  TreeMap.postponedExecution = notImplemented;

  TreeMap.nodeMap = notImplemented;

  return TreeMap;

})();

transverse = function(treeMap, root) {
  var a, alternative, alternatives, b, m, promise;
  if (root === void 0) {
    throw new Error('Invalid root specified');
  }
  switch (false) {
    case !(root instanceof Alternatives):
      alternatives = (function() {
        var _i, _len, _ref8, _results;
        _ref8 = root.alternatives;
        _results = [];
        for (_i = 0, _len = _ref8.length; _i < _len; _i++) {
          alternative = _ref8[_i];
          _results.push(transverse(treeMap, alternative));
        }
        return _results;
      })();
      return treeMap.alternatives(root, alternatives);
    case !(root instanceof Tuple):
      a = transverse(treeMap, root.key);
      b = transverse(treeMap, root.value);
      return treeMap.tuple(root, a, b);
    case !(root instanceof Multiple):
      m = transverse(treeMap, root.element);
      return treeMap.multiple(root, m);
    case !(root instanceof PrimitiveAlternatives):
      alternatives = (function() {
        var _i, _len, _ref8, _results;
        _ref8 = root.alternatives;
        _results = [];
        for (_i = 0, _len = _ref8.length; _i < _len; _i++) {
          alternative = _ref8[_i];
          _results.push(transverse(treeMap, alternative));
        }
        return _results;
      })();
      return treeMap.primitiveAlternatives(root, alternatives);
    case !(root instanceof PostposedExecution):
      promise = new PostposedExecution(function() {
        return transverse(treeMap, root.f());
      });
      return treeMap.postponedExecution(root, promise);
    case !(root instanceof Node):
      return treeMap.node(root);
    default:
      throw new Error('Invalid state: type ' + typ3(root) + ' object ' + root);
  }
};

this.transverse = transverse;

title = new Tuple(new ConstantString('title'), stringNode);

version = new Tuple(new ConstantString('version'), stringNode);

baseUri = new Tuple(new ConstantString('baseUri'), stringNode);

model = new Tuple(stringNode, jsonSchema);

schemas = new Tuple(new ConstantString('schemas'), new Multiple(model));

name = new Tuple(new ConstantString('name'), stringNode);

description = new Tuple(new ConstantString('description'), stringNode);

type = new Tuple(new ConstantString('type'), new PrimitiveAlternatives(new ConstantString('string'), new ConstantString('number'), new ConstantString('integer'), new ConstantString('date')));

enum2 = new Tuple(new ConstantString('enum'), new Multiple(stringNode));

pattern = new Tuple(new ConstantString('pattern'), regex);

minLength = new Tuple(new ConstantString('minLength'), integer);

maxLength = new Tuple(new ConstantString('maxLength'), integer);

minimum = new Tuple(new ConstantString('minimum'), integer);

maximum = new Tuple(new ConstantString('maximum'), integer);

required = new Tuple(new ConstantString('required'), boolean);

d3fault = new Tuple(new ConstantString('default'), stringNode);

requires = new Tuple(new ConstantString('requires'), new Multiple(stringNode));

provides = new Tuple(new ConstantString('provides'), new Multiple(stringNode));

excludes = new Tuple(new ConstantString('excludes'), new Multiple(stringNode));

parameterProperty = new Alternatives(name, description, type, enum2, pattern, minLength, maxLength, maximum, minimum, required, d3fault, requires, excludes);

uriParameter = new Tuple(stringNode, new Multiple(parameterProperty));

uriParameters = new Tuple(new ConstantString('uriParameters'), new Multiple(uriParameter));

defaultMediaTypes = new Tuple(new ConstantString('defaultMediaTypes'), new PrimitiveAlternatives(stringNode, new Multiple(stringNode)));

chapter = new Alternatives(new Tuple(new ConstantString('title'), stringNode), new Tuple(new ConstantString('content'), stringNode));

documentation = new Tuple(new ConstantString('documentation'), new Multiple(chapter));

summary = new Tuple(new ConstantString('summary'), stringNode);

example = new Tuple(new ConstantString('example'), stringNode);

header = new Tuple(stringNode, new Multiple(new Alternatives(parameterProperty, example)));

headers = new Tuple(new ConstantString('headers'), new Multiple(header));

queryParameterDefinition = new Tuple(stringNode, new Multiple(new Alternatives(parameterProperty, example)));

queryParameters = new Tuple(new ConstantString('queryParameters'), new Multiple(queryParameterDefinition));

formParameters = new Tuple(new ConstantString('formParameters'), new Multiple(new Alternatives(parameterProperty, example)));

bodySchema = new Tuple(new ConstantString('schema'), new PrimitiveAlternatives(xmlSchema, jsonSchema));

mimeTypeParameters = new Multiple(new Alternatives(bodySchema, example));

mimeType = new Alternatives(new Tuple(new ConstantString('application/x-www-form-urlencoded'), new Multiple(formParameters)), new Tuple(new ConstantString('multipart/form-data'), new Multiple(formParameters)), new Tuple(stringNode, new Multiple(mimeTypeParameters)));

body = new Tuple(new ConstantString('body'), new Multiple(mimeType));

responseCode = new Tuple(integer, new Multiple(integer), new Multiple(new Alternatives(body, description)));

responses = new Tuple(new ConstantString('responses'), new Multiple(responseCode));

actionDefinition = new Alternatives(summary, description, headers, queryParameters, body, responses);

action = (function(func, args, ctor) {
  ctor.prototype = func.prototype;
  var child = new ctor, result = func.apply(child, args);
  return Object(result) === result ? result : child;
})(Alternatives, (function() {
  var _i, _len, _ref8, _results;
  _ref8 = [new ConstantString('get'), new ConstantString('post'), new ConstantString('put'), new ConstantString('delete'), new ConstantString('head'), new ConstantString('path'), new ConstantString('options')];
  _results = [];
  for (_i = 0, _len = _ref8.length; _i < _len; _i++) {
    actionName = _ref8[_i];
    _results.push(new Tuple(actionName, new Multiple(actionDefinition), 'method'));
  }
  return _results;
})(), function(){});

use = new Tuple(new ConstantString('use'), new Multiple(stringNode));

resourceDefinition = new Alternatives(name, action, use, new Tuple(stringNode, new PostposedExecution(function() {
  return resourceDefinition;
})));

resource = new Tuple(stringNode, new Multiple(resourceDefinition), 'data');

traitDefinition = new Tuple(stringNode, new Multiple(new Alternatives(description, provides, requires)));

trait = new Tuple(new ConstantString('traits'), traitDefinition);

traits = new Multiple(trait);

rootElement = new Alternatives(title, version, schemas, baseUri, uriParameters, defaultMediaTypes, documentation, resource, traits);

root = new Multiple(rootElement);

this.root = root;

this.transversePrimitive = transversePrimitive;

this.TreeMap = TreeMap;

this.NodeMap = NodeMap;

Category = (function() {
  function Category(name, elements) {
    this.name = name;
    this.elements = elements;
  }

  return Category;

})();


},{"./utils.coffee":3}],2:[function(require,module,exports){
var NodeMap, OpenSuggestion, SimpleSuggestion, StringWildcard, SuggestItem, Suggestion, SuggestionNodeMap, TreeMap, TreeMapToSuggestionTree, Tuple, functionize, root, stringWilcard, suggest, suggestRAML, suggestionTree, transverse, transversePrimitive, type, _ref, _ref1, _ref2,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

type = require('./utils.coffee').typ3;

_ref = require('./main.coffee'), TreeMap = _ref.TreeMap, NodeMap = _ref.NodeMap, transverse = _ref.transverse, root = _ref.root, transversePrimitive = _ref.transversePrimitive;

Suggestion = (function() {
  function Suggestion() {}

  return Suggestion;

})();

SimpleSuggestion = (function(_super) {
  __extends(SimpleSuggestion, _super);

  function SimpleSuggestion(suggestions) {
    this.suggestions = suggestions;
  }

  return SimpleSuggestion;

})(Suggestion);

OpenSuggestion = (function(_super) {
  __extends(OpenSuggestion, _super);

  function OpenSuggestion(suggestions, open) {
    this.suggestions = suggestions;
    this.open = open;
  }

  return OpenSuggestion;

})(Suggestion);

SuggestItem = (function() {
  function SuggestItem(open, name, category) {
    this.open = open;
    this.name = name;
    this.category = category != null ? category : 'spec';
  }

  return SuggestItem;

})();

StringWildcard = (function() {
  function StringWildcard() {}

  return StringWildcard;

})();

stringWilcard = new StringWildcard;

SuggestionNodeMap = (function(_super) {
  var name;

  __extends(SuggestionNodeMap, _super);

  function SuggestionNodeMap() {
    _ref1 = SuggestionNodeMap.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  name = function(node) {
    return node.constructor.name;
  };

  SuggestionNodeMap.markdown = name;

  SuggestionNodeMap.include = name;

  SuggestionNodeMap.jsonSchema = name;

  SuggestionNodeMap.regex = name;

  SuggestionNodeMap.integer = name;

  SuggestionNodeMap.boolean = name;

  SuggestionNodeMap.xmlSchema = name;

  SuggestionNodeMap.stringNode = function() {
    return stringWilcard;
  };

  SuggestionNodeMap.constantString = function(root) {
    return root.value;
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

Tuple = (function() {
  function Tuple(key, value) {
    this.key = key;
    this.value = value;
  }

  return Tuple;

})();

TreeMapToSuggestionTree = (function(_super) {
  __extends(TreeMapToSuggestionTree, _super);

  function TreeMapToSuggestionTree() {
    _ref2 = TreeMapToSuggestionTree.__super__.constructor.apply(this, arguments);
    return _ref2;
  }

  TreeMapToSuggestionTree.alternatives = function(root, alternatives) {
    var alternative, d, key, open, value, _i, _len, _ref3, _ref4;
    d = {};
    for (_i = 0, _len = alternatives.length; _i < _len; _i++) {
      alternative = alternatives[_i];
      switch (false) {
        case !(alternative instanceof SimpleSuggestion):
          _ref3 = alternative.suggestions;
          for (key in _ref3) {
            value = _ref3[key];
            d[key] = value;
          }
          break;
        case !(alternative instanceof OpenSuggestion):
          _ref4 = alternative.suggestions;
          for (key in _ref4) {
            value = _ref4[key];
            d[key] = value;
          }
          open = alternative.open;
          break;
        default:
          throw new Error('Invalid type: ' + alternatives);
      }
    }
    if (open != null) {
      return new OpenSuggestion(d, function() {
        return open();
      });
    } else {
      return new SimpleSuggestion(d);
    }
  };

  TreeMapToSuggestionTree.multiple = function(root, element) {
    return element;
  };

  TreeMapToSuggestionTree.tuple = function(root, key, value) {
    var d;
    if (key === stringWilcard) {
      return new OpenSuggestion({}, functionize(value));
    } else {
      d = {};
      d[key] = new SuggestItem(functionize(value), key, root.category);
      return new SimpleSuggestion(d);
    }
  };

  TreeMapToSuggestionTree.primitiveAlternatives = function(root, alternatives) {
    return alternatives;
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
  var key, val;
  key = path[index];
  if (key == null) {
    return root;
  }
  val = root.suggestions[key] != null ? root.suggestions[key].open() : root.open();
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