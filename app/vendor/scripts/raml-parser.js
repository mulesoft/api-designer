;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
(function() {
  var _ref,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Mark = (function() {
    function Mark(name, line, column, buffer, pointer) {
      this.name = name;
      this.line = line;
      this.column = column;
      this.buffer = buffer;
      this.pointer = pointer;
    }

    Mark.prototype.get_snippet = function(indent, max_length) {
      var break_chars, end, head, start, tail, _ref, _ref1;
      if (indent == null) {
        indent = 4;
      }
      if (max_length == null) {
        max_length = 75;
      }
      if (this.buffer == null) {
        return null;
      }
      break_chars = '\x00\r\n\x85\u2028\u2029';
      head = '';
      start = this.pointer;
      while (start > 0 && (_ref = this.buffer[start - 1], __indexOf.call(break_chars, _ref) < 0)) {
        start--;
        if (this.pointer - start > max_length / 2 - 1) {
          head = ' ... ';
          start += 5;
          break;
        }
      }
      tail = '';
      end = this.pointer;
      while (end < this.buffer.length && (_ref1 = this.buffer[end], __indexOf.call(break_chars, _ref1) < 0)) {
        end++;
        if (end - this.pointer > max_length / 2 - 1) {
          tail = ' ... ';
          end -= 5;
          break;
        }
      }
      return "" + ((new Array(indent)).join(' ')) + head + this.buffer.slice(start, end) + tail + "\n" + ((new Array(indent + this.pointer - start + head.length)).join(' ')) + "^";
    };

    Mark.prototype.toString = function() {
      var snippet, where;
      snippet = this.get_snippet();
      where = "  in \"" + this.name + "\", line " + (this.line + 1) + ", column " + (this.column + 1);
      if (snippet) {
        return where;
      } else {
        return "" + where + ":\n" + snippet;
      }
    };

    return Mark;

  })();

  this.YAMLError = (function(_super) {
    __extends(YAMLError, _super);

    function YAMLError() {
      YAMLError.__super__.constructor.call(this);
    }

    return YAMLError;

  })(Error);

  this.MarkedYAMLError = (function(_super) {
    __extends(MarkedYAMLError, _super);

    function MarkedYAMLError(context, context_mark, message, problem_mark, note) {
      this.context = context;
      this.context_mark = context_mark;
      this.message = message;
      this.problem_mark = problem_mark;
      this.note = note;
      MarkedYAMLError.__super__.constructor.call(this);
      if (!this.message) {
        this.message = this.context;
      }
      if (!this.problem_mark) {
        this.problem_mark = this.context_mark;
      }
    }

    MarkedYAMLError.prototype.toString = function() {
      var lines;
      lines = [];
      if (this.context != null) {
        lines.push(this.context);
      }
      if ((this.context_mark != null) && ((this.message == null) || (this.problem_mark == null) || this.context_mark.name !== this.problem_mark.name || this.context_mark.line !== this.problem_mark.line || this.context_mark.column !== this.problem_mark.column)) {
        lines.push(this.context_mark.toString());
      }
      if (this.message != null) {
        lines.push(this.message);
      }
      if (this.problem_mark != null) {
        lines.push(this.problem_mark.toString());
      }
      if (this.note != null) {
        lines.push(this.note);
      }
      return lines.join('\n');
    };

    return MarkedYAMLError;

  })(this.YAMLError);

  /*
  The Validator throws these.
  */


  this.ValidationError = (function(_super) {
    __extends(ValidationError, _super);

    function ValidationError() {
      _ref = ValidationError.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return ValidationError;

  })(this.MarkedYAMLError);

}).call(this);

},{}],2:[function(require,module,exports){
(function() {
  var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Event = (function() {
    function Event(start_mark, end_mark) {
      this.start_mark = start_mark;
      this.end_mark = end_mark;
    }

    return Event;

  })();

  this.NodeEvent = (function(_super) {
    __extends(NodeEvent, _super);

    function NodeEvent(anchor, start_mark, end_mark) {
      this.anchor = anchor;
      this.start_mark = start_mark;
      this.end_mark = end_mark;
    }

    return NodeEvent;

  })(this.Event);

  this.CollectionStartEvent = (function(_super) {
    __extends(CollectionStartEvent, _super);

    function CollectionStartEvent(anchor, tag, implicit, start_mark, end_mark) {
      this.anchor = anchor;
      this.tag = tag;
      this.implicit = implicit;
      this.start_mark = start_mark;
      this.end_mark = end_mark;
    }

    return CollectionStartEvent;

  })(this.NodeEvent);

  this.CollectionEndEvent = (function(_super) {
    __extends(CollectionEndEvent, _super);

    function CollectionEndEvent() {
      _ref = CollectionEndEvent.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return CollectionEndEvent;

  })(this.Event);

  this.StreamStartEvent = (function(_super) {
    __extends(StreamStartEvent, _super);

    function StreamStartEvent(start_mark, end_mark, explicit, version, tags) {
      this.start_mark = start_mark;
      this.end_mark = end_mark;
      this.explicit = explicit;
      this.version = version;
      this.tags = tags;
    }

    return StreamStartEvent;

  })(this.Event);

  this.StreamEndEvent = (function(_super) {
    __extends(StreamEndEvent, _super);

    function StreamEndEvent() {
      _ref1 = StreamEndEvent.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    return StreamEndEvent;

  })(this.Event);

  this.DocumentStartEvent = (function(_super) {
    __extends(DocumentStartEvent, _super);

    function DocumentStartEvent(start_mark, end_mark, explicit, version, tags) {
      this.start_mark = start_mark;
      this.end_mark = end_mark;
      this.explicit = explicit;
      this.version = version;
      this.tags = tags;
    }

    return DocumentStartEvent;

  })(this.Event);

  this.DocumentEndEvent = (function(_super) {
    __extends(DocumentEndEvent, _super);

    function DocumentEndEvent(start_mark, end_mark, explicit) {
      this.start_mark = start_mark;
      this.end_mark = end_mark;
      this.explicit = explicit;
    }

    return DocumentEndEvent;

  })(this.Event);

  this.AliasEvent = (function(_super) {
    __extends(AliasEvent, _super);

    function AliasEvent() {
      _ref2 = AliasEvent.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    return AliasEvent;

  })(this.NodeEvent);

  this.ScalarEvent = (function(_super) {
    __extends(ScalarEvent, _super);

    function ScalarEvent(anchor, tag, implicit, value, start_mark, end_mark, style) {
      this.anchor = anchor;
      this.tag = tag;
      this.implicit = implicit;
      this.value = value;
      this.start_mark = start_mark;
      this.end_mark = end_mark;
      this.style = style;
    }

    return ScalarEvent;

  })(this.NodeEvent);

  this.SequenceStartEvent = (function(_super) {
    __extends(SequenceStartEvent, _super);

    function SequenceStartEvent() {
      _ref3 = SequenceStartEvent.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    return SequenceStartEvent;

  })(this.CollectionStartEvent);

  this.SequenceEndEvent = (function(_super) {
    __extends(SequenceEndEvent, _super);

    function SequenceEndEvent() {
      _ref4 = SequenceEndEvent.__super__.constructor.apply(this, arguments);
      return _ref4;
    }

    return SequenceEndEvent;

  })(this.CollectionEndEvent);

  this.MappingStartEvent = (function(_super) {
    __extends(MappingStartEvent, _super);

    function MappingStartEvent() {
      _ref5 = MappingStartEvent.__super__.constructor.apply(this, arguments);
      return _ref5;
    }

    return MappingStartEvent;

  })(this.CollectionStartEvent);

  this.MappingEndEvent = (function(_super) {
    __extends(MappingEndEvent, _super);

    function MappingEndEvent() {
      _ref6 = MappingEndEvent.__super__.constructor.apply(this, arguments);
      return _ref6;
    }

    return MappingEndEvent;

  })(this.CollectionEndEvent);

}).call(this);

},{}],3:[function(require,module,exports){
(function() {
  var _ref, _ref1, _ref10, _ref11, _ref12, _ref13, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Token = (function() {
    function Token(start_mark, end_mark) {
      this.start_mark = start_mark;
      this.end_mark = end_mark;
    }

    return Token;

  })();

  this.DirectiveToken = (function(_super) {
    __extends(DirectiveToken, _super);

    DirectiveToken.prototype.id = '<directive>';

    function DirectiveToken(name, value, start_mark, end_mark) {
      this.name = name;
      this.value = value;
      this.start_mark = start_mark;
      this.end_mark = end_mark;
    }

    return DirectiveToken;

  })(this.Token);

  this.DocumentStartToken = (function(_super) {
    __extends(DocumentStartToken, _super);

    function DocumentStartToken() {
      _ref = DocumentStartToken.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    DocumentStartToken.prototype.id = '<document start>';

    return DocumentStartToken;

  })(this.Token);

  this.DocumentEndToken = (function(_super) {
    __extends(DocumentEndToken, _super);

    function DocumentEndToken() {
      _ref1 = DocumentEndToken.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    DocumentEndToken.prototype.id = '<document end>';

    return DocumentEndToken;

  })(this.Token);

  this.StreamStartToken = (function(_super) {
    __extends(StreamStartToken, _super);

    StreamStartToken.prototype.id = '<stream start>';

    function StreamStartToken(start_mark, end_mark, encoding) {
      this.start_mark = start_mark;
      this.end_mark = end_mark;
      this.encoding = encoding;
    }

    return StreamStartToken;

  })(this.Token);

  this.StreamEndToken = (function(_super) {
    __extends(StreamEndToken, _super);

    function StreamEndToken() {
      _ref2 = StreamEndToken.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    StreamEndToken.prototype.id = '<stream end>';

    return StreamEndToken;

  })(this.Token);

  this.BlockSequenceStartToken = (function(_super) {
    __extends(BlockSequenceStartToken, _super);

    function BlockSequenceStartToken() {
      _ref3 = BlockSequenceStartToken.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    BlockSequenceStartToken.prototype.id = '<block sequence start>';

    return BlockSequenceStartToken;

  })(this.Token);

  this.BlockMappingStartToken = (function(_super) {
    __extends(BlockMappingStartToken, _super);

    function BlockMappingStartToken() {
      _ref4 = BlockMappingStartToken.__super__.constructor.apply(this, arguments);
      return _ref4;
    }

    BlockMappingStartToken.prototype.id = '<block mapping end>';

    return BlockMappingStartToken;

  })(this.Token);

  this.BlockEndToken = (function(_super) {
    __extends(BlockEndToken, _super);

    function BlockEndToken() {
      _ref5 = BlockEndToken.__super__.constructor.apply(this, arguments);
      return _ref5;
    }

    BlockEndToken.prototype.id = '<block end>';

    return BlockEndToken;

  })(this.Token);

  this.FlowSequenceStartToken = (function(_super) {
    __extends(FlowSequenceStartToken, _super);

    function FlowSequenceStartToken() {
      _ref6 = FlowSequenceStartToken.__super__.constructor.apply(this, arguments);
      return _ref6;
    }

    FlowSequenceStartToken.prototype.id = '[';

    return FlowSequenceStartToken;

  })(this.Token);

  this.FlowMappingStartToken = (function(_super) {
    __extends(FlowMappingStartToken, _super);

    function FlowMappingStartToken() {
      _ref7 = FlowMappingStartToken.__super__.constructor.apply(this, arguments);
      return _ref7;
    }

    FlowMappingStartToken.prototype.id = '{';

    return FlowMappingStartToken;

  })(this.Token);

  this.FlowSequenceEndToken = (function(_super) {
    __extends(FlowSequenceEndToken, _super);

    function FlowSequenceEndToken() {
      _ref8 = FlowSequenceEndToken.__super__.constructor.apply(this, arguments);
      return _ref8;
    }

    FlowSequenceEndToken.prototype.id = ']';

    return FlowSequenceEndToken;

  })(this.Token);

  this.FlowMappingEndToken = (function(_super) {
    __extends(FlowMappingEndToken, _super);

    function FlowMappingEndToken() {
      _ref9 = FlowMappingEndToken.__super__.constructor.apply(this, arguments);
      return _ref9;
    }

    FlowMappingEndToken.prototype.id = '}';

    return FlowMappingEndToken;

  })(this.Token);

  this.KeyToken = (function(_super) {
    __extends(KeyToken, _super);

    function KeyToken() {
      _ref10 = KeyToken.__super__.constructor.apply(this, arguments);
      return _ref10;
    }

    KeyToken.prototype.id = '?';

    return KeyToken;

  })(this.Token);

  this.ValueToken = (function(_super) {
    __extends(ValueToken, _super);

    function ValueToken() {
      _ref11 = ValueToken.__super__.constructor.apply(this, arguments);
      return _ref11;
    }

    ValueToken.prototype.id = ':';

    return ValueToken;

  })(this.Token);

  this.BlockEntryToken = (function(_super) {
    __extends(BlockEntryToken, _super);

    function BlockEntryToken() {
      _ref12 = BlockEntryToken.__super__.constructor.apply(this, arguments);
      return _ref12;
    }

    BlockEntryToken.prototype.id = '-';

    return BlockEntryToken;

  })(this.Token);

  this.FlowEntryToken = (function(_super) {
    __extends(FlowEntryToken, _super);

    function FlowEntryToken() {
      _ref13 = FlowEntryToken.__super__.constructor.apply(this, arguments);
      return _ref13;
    }

    FlowEntryToken.prototype.id = ',';

    return FlowEntryToken;

  })(this.Token);

  this.AliasToken = (function(_super) {
    __extends(AliasToken, _super);

    AliasToken.prototype.id = '<alias>';

    function AliasToken(value, start_mark, end_mark) {
      this.value = value;
      this.start_mark = start_mark;
      this.end_mark = end_mark;
    }

    return AliasToken;

  })(this.Token);

  this.AnchorToken = (function(_super) {
    __extends(AnchorToken, _super);

    AnchorToken.prototype.id = '<anchor>';

    function AnchorToken(value, start_mark, end_mark) {
      this.value = value;
      this.start_mark = start_mark;
      this.end_mark = end_mark;
    }

    return AnchorToken;

  })(this.Token);

  this.TagToken = (function(_super) {
    __extends(TagToken, _super);

    TagToken.prototype.id = '<tag>';

    function TagToken(value, start_mark, end_mark) {
      this.value = value;
      this.start_mark = start_mark;
      this.end_mark = end_mark;
    }

    return TagToken;

  })(this.Token);

  this.ScalarToken = (function(_super) {
    __extends(ScalarToken, _super);

    ScalarToken.prototype.id = '<scalar>';

    function ScalarToken(value, plain, start_mark, end_mark, style) {
      this.value = value;
      this.plain = plain;
      this.start_mark = start_mark;
      this.end_mark = end_mark;
      this.style = style;
    }

    return ScalarToken;

  })(this.Token);

}).call(this);

},{}],4:[function(require,module,exports){
(function() {
  var __slice = [].slice,
    __hasProp = {}.hasOwnProperty;

  this.extend = function() {
    var destination, k, source, sources, v, _i, _len;
    destination = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_i = 0, _len = sources.length; _i < _len; _i++) {
      source = sources[_i];
      for (k in source) {
        v = source[k];
        destination[k] = v;
      }
    }
    return destination;
  };

  this.is_empty = function(obj) {
    var key;
    if (Array.isArray(obj) || typeof obj === 'string') {
      return obj.length === 0;
    }
    for (key in obj) {
      if (!__hasProp.call(obj, key)) continue;
      return false;
    }
    return true;
  };

  this.isNoop = function(node) {
    return node;
  };

  this.isMapping = function(node) {
    return (node != null ? node.tag : void 0) === "tag:yaml.org,2002:map";
  };

  this.isNull = function(node) {
    return (node != null ? node.tag : void 0) === "tag:yaml.org,2002:null";
  };

  this.isSequence = function(node) {
    return (node != null ? node.tag : void 0) === "tag:yaml.org,2002:seq";
  };

  this.isString = function(node) {
    return (node != null ? node.tag : void 0) === "tag:yaml.org,2002:str";
  };

  this.isInteger = function(node) {
    return (node != null ? node.tag : void 0) === "tag:yaml.org,2002:int";
  };

  this.isNullableMapping = function(node) {
    return this.isMapping(node) || this.isNull(node);
  };

  this.isNullableString = function(node) {
    return this.isString(node) || this.isNull(node);
  };

  this.isNullableSequence = function(node) {
    return this.isSequence(node) || this.isNull(node);
  };

  this.isScalar = function(node) {
    return (node != null ? node.tag : void 0) === 'tag:yaml.org,2002:null' || (node != null ? node.tag : void 0) === 'tag:yaml.org,2002:bool' || (node != null ? node.tag : void 0) === 'tag:yaml.org,2002:int' || (node != null ? node.tag : void 0) === 'tag:yaml.org,2002:float' || (node != null ? node.tag : void 0) === 'tag:yaml.org,2002:binary' || (node != null ? node.tag : void 0) === 'tag:yaml.org,2002:timestamp' || (node != null ? node.tag : void 0) === 'tag:yaml.org,2002:str';
  };

  this.isCollection = function(node) {
    return (node != null ? node.tag : void 0) === 'tag:yaml.org,2002:omap' || (node != null ? node.tag : void 0) === 'tag:yaml.org,2002:pairs' || (node != null ? node.tag : void 0) === 'tag:yaml.org,2002:set' || (node != null ? node.tag : void 0) === 'tag:yaml.org,2002:seq' || (node != null ? node.tag : void 0) === 'tag:yaml.org,2002:map';
  };

}).call(this);

},{}],5:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],6:[function(require,module,exports){
(function(process){// vim:ts=4:sts=4:sw=4:
/*!
 *
 * Copyright 2009-2012 Kris Kowal under the terms of the MIT
 * license found at http://github.com/kriskowal/q/raw/master/LICENSE
 *
 * With parts by Tyler Close
 * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found
 * at http://www.opensource.org/licenses/mit-license.html
 * Forked at ref_send.js version: 2009-05-11
 *
 * With parts by Mark Miller
 * Copyright (C) 2011 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

(function (definition) {
    // Turn off strict mode for this function so we can assign to global.Q
    /* jshint strict: false */

    // This file will function properly as a <script> tag, or a module
    // using CommonJS and NodeJS or RequireJS module formats.  In
    // Common/Node/RequireJS, the module exports the Q API and when
    // executed as a simple <script>, it creates a Q global instead.

    // Montage Require
    if (typeof bootstrap === "function") {
        bootstrap("promise", definition);

    // CommonJS
    } else if (typeof exports === "object") {
        module.exports = definition();

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
        define(definition);

    // SES (Secure EcmaScript)
    } else if (typeof ses !== "undefined") {
        if (!ses.ok()) {
            return;
        } else {
            ses.makeQ = definition;
        }

    // <script>
    } else {
        Q = definition();
    }

})(function () {
"use strict";

var hasStacks = false;
try {
    throw new Error();
} catch (e) {
    hasStacks = !!e.stack;
}

// All code after this point will be filtered from stack traces reported
// by Q.
var qStartingLine = captureLine();
var qFileName;

// shims

// used for fallback in "allResolved"
var noop = function () {};

// Use the fastest possible means to execute a task in a future turn
// of the event loop.
var nextTick =(function () {
    // linked list of tasks (single, with head node)
    var head = {task: void 0, next: null};
    var tail = head;
    var flushing = false;
    var requestTick = void 0;
    var isNodeJS = false;

    function flush() {
        while (head.next) {
            head = head.next;
            var task = head.task;
            head.task = void 0;
            var domain = head.domain;

            if (domain) {
                head.domain = void 0;
                domain.enter();
            }

            try {
                task();

            } catch (e) {
                if (isNodeJS) {
                    // In node, uncaught exceptions are considered fatal errors.
                    // Re-throw them synchronously to interrupt flushing!

                    // Ensure continuation if the uncaught exception is suppressed
                    // listening "uncaughtException" events (as domains does).
                    // Continue in next event to avoid tick recursion.
                    domain && domain.exit();
                    setTimeout(flush, 0);
                    domain && domain.enter();

                    throw e;

                } else {
                    // In browsers, uncaught exceptions are not fatal.
                    // Re-throw them asynchronously to avoid slow-downs.
                    setTimeout(function() {
                       throw e;
                    }, 0);
                }
            }

            if (domain) {
                domain.exit();
            }
        }

        flushing = false;
    }

    nextTick = function (task) {
        tail = tail.next = {
            task: task,
            domain: isNodeJS && process.domain,
            next: null
        };

        if (!flushing) {
            flushing = true;
            requestTick();
        }
    };

    if (typeof process !== "undefined" && process.nextTick) {
        // Node.js before 0.9. Note that some fake-Node environments, like the
        // Mocha test runner, introduce a `process` global without a `nextTick`.
        isNodeJS = true;

        requestTick = function () {
            process.nextTick(flush);
        };

    } else if (typeof setImmediate === "function") {
        // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
        if (typeof window !== "undefined") {
            requestTick = setImmediate.bind(window, flush);
        } else {
            requestTick = function () {
                setImmediate(flush);
            };
        }

    } else if (typeof MessageChannel !== "undefined") {
        // modern browsers
        // http://www.nonblocking.io/2011/06/windownexttick.html
        var channel = new MessageChannel();
        channel.port1.onmessage = flush;
        requestTick = function () {
            channel.port2.postMessage(0);
        };

    } else {
        // old browsers
        requestTick = function () {
            setTimeout(flush, 0);
        };
    }

    return nextTick;
})();

// Attempt to make generics safe in the face of downstream
// modifications.
// There is no situation where this is necessary.
// If you need a security guarantee, these primordials need to be
// deeply frozen anyway, and if you don’t need a security guarantee,
// this is just plain paranoid.
// However, this does have the nice side-effect of reducing the size
// of the code by reducing x.call() to merely x(), eliminating many
// hard-to-minify characters.
// See Mark Miller’s explanation of what this does.
// http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming
function uncurryThis(f) {
    var call = Function.call;
    return function () {
        return call.apply(f, arguments);
    };
}
// This is equivalent, but slower:
// uncurryThis = Function_bind.bind(Function_bind.call);
// http://jsperf.com/uncurrythis

var array_slice = uncurryThis(Array.prototype.slice);

var array_reduce = uncurryThis(
    Array.prototype.reduce || function (callback, basis) {
        var index = 0,
            length = this.length;
        // concerning the initial value, if one is not provided
        if (arguments.length === 1) {
            // seek to the first value in the array, accounting
            // for the possibility that is is a sparse array
            do {
                if (index in this) {
                    basis = this[index++];
                    break;
                }
                if (++index >= length) {
                    throw new TypeError();
                }
            } while (1);
        }
        // reduce
        for (; index < length; index++) {
            // account for the possibility that the array is sparse
            if (index in this) {
                basis = callback(basis, this[index], index);
            }
        }
        return basis;
    }
);

var array_indexOf = uncurryThis(
    Array.prototype.indexOf || function (value) {
        // not a very good shim, but good enough for our one use of it
        for (var i = 0; i < this.length; i++) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    }
);

var array_map = uncurryThis(
    Array.prototype.map || function (callback, thisp) {
        var self = this;
        var collect = [];
        array_reduce(self, function (undefined, value, index) {
            collect.push(callback.call(thisp, value, index, self));
        }, void 0);
        return collect;
    }
);

var object_create = Object.create || function (prototype) {
    function Type() { }
    Type.prototype = prototype;
    return new Type();
};

var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);

var object_keys = Object.keys || function (object) {
    var keys = [];
    for (var key in object) {
        if (object_hasOwnProperty(object, key)) {
            keys.push(key);
        }
    }
    return keys;
};

var object_toString = uncurryThis(Object.prototype.toString);

function isObject(value) {
    return value === Object(value);
}

// generator related shims

// FIXME: Remove this function once ES6 generators are in SpiderMonkey.
function isStopIteration(exception) {
    return (
        object_toString(exception) === "[object StopIteration]" ||
        exception instanceof QReturnValue
    );
}

// FIXME: Remove this helper and Q.return once ES6 generators are in
// SpiderMonkey.
var QReturnValue;
if (typeof ReturnValue !== "undefined") {
    QReturnValue = ReturnValue;
} else {
    QReturnValue = function (value) {
        this.value = value;
    };
}

// Until V8 3.19 / Chromium 29 is released, SpiderMonkey is the only
// engine that has a deployed base of browsers that support generators.
// However, SM's generators use the Python-inspired semantics of
// outdated ES6 drafts.  We would like to support ES6, but we'd also
// like to make it possible to use generators in deployed browsers, so
// we also support Python-style generators.  At some point we can remove
// this block.
var hasES6Generators;
try {
    /* jshint evil: true, nonew: false */
    new Function("(function* (){ yield 1; })");
    hasES6Generators = true;
} catch (e) {
    hasES6Generators = false;
}

// long stack traces

var STACK_JUMP_SEPARATOR = "From previous event:";

function makeStackTraceLong(error, promise) {
    // If possible, transform the error stack trace by removing Node and Q
    // cruft, then concatenating with the stack trace of `promise`. See #57.
    if (hasStacks &&
        promise.stack &&
        typeof error === "object" &&
        error !== null &&
        error.stack &&
        error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
    ) {
        var stacks = [];
        for (var p = promise; !!p; p = p.source) {
            if (p.stack) {
                stacks.unshift(p.stack);
            }
        }
        stacks.unshift(error.stack);

        var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
        error.stack = filterStackString(concatedStacks);
    }
}

function filterStackString(stackString) {
    var lines = stackString.split("\n");
    var desiredLines = [];
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];

        if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
            desiredLines.push(line);
        }
    }
    return desiredLines.join("\n");
}

function isNodeFrame(stackLine) {
    return stackLine.indexOf("(module.js:") !== -1 ||
           stackLine.indexOf("(node.js:") !== -1;
}

function getFileNameAndLineNumber(stackLine) {
    // Named functions: "at functionName (filename:lineNumber:columnNumber)"
    // In IE10 function name can have spaces ("Anonymous function") O_o
    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
    if (attempt1) {
        return [attempt1[1], Number(attempt1[2])];
    }

    // Anonymous functions: "at filename:lineNumber:columnNumber"
    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
    if (attempt2) {
        return [attempt2[1], Number(attempt2[2])];
    }

    // Firefox style: "function@filename:lineNumber or @filename:lineNumber"
    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
    if (attempt3) {
        return [attempt3[1], Number(attempt3[2])];
    }
}

function isInternalFrame(stackLine) {
    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);

    if (!fileNameAndLineNumber) {
        return false;
    }

    var fileName = fileNameAndLineNumber[0];
    var lineNumber = fileNameAndLineNumber[1];

    return fileName === qFileName &&
        lineNumber >= qStartingLine &&
        lineNumber <= qEndingLine;
}

// discover own file name and line number range for filtering stack
// traces
function captureLine() {
    if (!hasStacks) {
        return;
    }

    try {
        throw new Error();
    } catch (e) {
        var lines = e.stack.split("\n");
        var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
        var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
        if (!fileNameAndLineNumber) {
            return;
        }

        qFileName = fileNameAndLineNumber[0];
        return fileNameAndLineNumber[1];
    }
}

function deprecate(callback, name, alternative) {
    return function () {
        if (typeof console !== "undefined" &&
            typeof console.warn === "function") {
            console.warn(name + " is deprecated, use " + alternative +
                         " instead.", new Error("").stack);
        }
        return callback.apply(callback, arguments);
    };
}

// end of shims
// beginning of real work

/**
 * Creates fulfilled promises from non-thenables,
 * Passes Q promises through,
 * Coerces other thenables to Q promises.
 */
function Q(value) {
    return resolve(value);
}

/**
 * Performs a task in a future turn of the event loop.
 * @param {Function} task
 */
Q.nextTick = nextTick;

/**
 * Controls whether or not long stack traces will be on
 */
Q.longStackSupport = false;

/**
 * Constructs a {promise, resolve, reject} object.
 *
 * `resolve` is a callback to invoke with a more resolved value for the
 * promise. To fulfill the promise, invoke `resolve` with any value that is
 * not a thenable. To reject the promise, invoke `resolve` with a rejected
 * thenable, or invoke `reject` with the reason directly. To resolve the
 * promise to another thenable, thus putting it in the same state, invoke
 * `resolve` with that other thenable.
 */
Q.defer = defer;
function defer() {
    // if "messages" is an "Array", that indicates that the promise has not yet
    // been resolved.  If it is "undefined", it has been resolved.  Each
    // element of the messages array is itself an array of complete arguments to
    // forward to the resolved promise.  We coerce the resolution value to a
    // promise using the `resolve` function because it handles both fully
    // non-thenable values and other thenables gracefully.
    var messages = [], progressListeners = [], resolvedPromise;

    var deferred = object_create(defer.prototype);
    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, operands) {
        var args = array_slice(arguments);
        if (messages) {
            messages.push(args);
            if (op === "when" && operands[1]) { // progress operand
                progressListeners.push(operands[1]);
            }
        } else {
            nextTick(function () {
                resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
            });
        }
    };

    // XXX deprecated
    promise.valueOf = deprecate(function () {
        if (messages) {
            return promise;
        }
        var nearerValue = nearer(resolvedPromise);
        if (isPromise(nearerValue)) {
            resolvedPromise = nearerValue; // shorten chain
        }
        return nearerValue;
    }, "valueOf", "inspect");

    promise.inspect = function () {
        if (!resolvedPromise) {
            return { state: "pending" };
        }
        return resolvedPromise.inspect();
    };

    if (Q.longStackSupport && hasStacks) {
        try {
            throw new Error();
        } catch (e) {
            // NOTE: don't try to use `Error.captureStackTrace` or transfer the
            // accessor around; that causes memory leaks as per GH-111. Just
            // reify the stack trace as a string ASAP.
            //
            // At the same time, cut off the first line; it's always just
            // "[object Promise]\n", as per the `toString`.
            promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
        }
    }

    // NOTE: we do the checks for `resolvedPromise` in each method, instead of
    // consolidating them into `become`, since otherwise we'd create new
    // promises with the lines `become(whatever(value))`. See e.g. GH-252.

    function become(newPromise) {
        resolvedPromise = newPromise;
        promise.source = newPromise;

        array_reduce(messages, function (undefined, message) {
            nextTick(function () {
                newPromise.promiseDispatch.apply(newPromise, message);
            });
        }, void 0);

        messages = void 0;
        progressListeners = void 0;
    }

    deferred.promise = promise;
    deferred.resolve = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(resolve(value));
    };

    deferred.fulfill = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(fulfill(value));
    };
    deferred.reject = function (reason) {
        if (resolvedPromise) {
            return;
        }

        become(reject(reason));
    };
    deferred.notify = function (progress) {
        if (resolvedPromise) {
            return;
        }

        array_reduce(progressListeners, function (undefined, progressListener) {
            nextTick(function () {
                progressListener(progress);
            });
        }, void 0);
    };

    return deferred;
}

/**
 * Creates a Node-style callback that will resolve or reject the deferred
 * promise.
 * @returns a nodeback
 */
defer.prototype.makeNodeResolver = function () {
    var self = this;
    return function (error, value) {
        if (error) {
            self.reject(error);
        } else if (arguments.length > 2) {
            self.resolve(array_slice(arguments, 1));
        } else {
            self.resolve(value);
        }
    };
};

/**
 * @param resolver {Function} a function that returns nothing and accepts
 * the resolve, reject, and notify functions for a deferred.
 * @returns a promise that may be resolved with the given resolve and reject
 * functions, or rejected by a thrown exception in resolver
 */
Q.promise = promise;
function promise(resolver) {
    if (typeof resolver !== "function") {
        throw new TypeError("resolver must be a function.");
    }

    var deferred = defer();
    fcall(
        resolver,
        deferred.resolve,
        deferred.reject,
        deferred.notify
    ).fail(deferred.reject);
    return deferred.promise;
}

/**
 * Constructs a Promise with a promise descriptor object and optional fallback
 * function.  The descriptor contains methods like when(rejected), get(name),
 * set(name, value), post(name, args), and delete(name), which all
 * return either a value, a promise for a value, or a rejection.  The fallback
 * accepts the operation name, a resolver, and any further arguments that would
 * have been forwarded to the appropriate method above had a method been
 * provided with the proper name.  The API makes no guarantees about the nature
 * of the returned object, apart from that it is usable whereever promises are
 * bought and sold.
 */
Q.makePromise = Promise;
function Promise(descriptor, fallback, inspect) {
    if (fallback === void 0) {
        fallback = function (op) {
            return reject(new Error(
                "Promise does not support operation: " + op
            ));
        };
    }
    if (inspect === void 0) {
        inspect = function () {
            return {state: "unknown"};
        };
    }

    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, args) {
        var result;
        try {
            if (descriptor[op]) {
                result = descriptor[op].apply(promise, args);
            } else {
                result = fallback.call(promise, op, args);
            }
        } catch (exception) {
            result = reject(exception);
        }
        if (resolve) {
            resolve(result);
        }
    };

    promise.inspect = inspect;

    // XXX deprecated `valueOf` and `exception` support
    if (inspect) {
        var inspected = inspect();
        if (inspected.state === "rejected") {
            promise.exception = inspected.reason;
        }

        promise.valueOf = deprecate(function () {
            var inspected = inspect();
            if (inspected.state === "pending" ||
                inspected.state === "rejected") {
                return promise;
            }
            return inspected.value;
        });
    }

    return promise;
}

Promise.prototype.then = function (fulfilled, rejected, progressed) {
    var self = this;
    var deferred = defer();
    var done = false;   // ensure the untrusted promise makes at most a
                        // single call to one of the callbacks

    function _fulfilled(value) {
        try {
            return typeof fulfilled === "function" ? fulfilled(value) : value;
        } catch (exception) {
            return reject(exception);
        }
    }

    function _rejected(exception) {
        if (typeof rejected === "function") {
            makeStackTraceLong(exception, self);
            try {
                return rejected(exception);
            } catch (newException) {
                return reject(newException);
            }
        }
        return reject(exception);
    }

    function _progressed(value) {
        return typeof progressed === "function" ? progressed(value) : value;
    }

    nextTick(function () {
        self.promiseDispatch(function (value) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_fulfilled(value));
        }, "when", [function (exception) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_rejected(exception));
        }]);
    });

    // Progress propagator need to be attached in the current tick.
    self.promiseDispatch(void 0, "when", [void 0, function (value) {
        var newValue;
        var threw = false;
        try {
            newValue = _progressed(value);
        } catch (e) {
            threw = true;
            if (Q.onerror) {
                Q.onerror(e);
            } else {
                throw e;
            }
        }

        if (!threw) {
            deferred.notify(newValue);
        }
    }]);

    return deferred.promise;
};

Promise.prototype.thenResolve = function (value) {
    return when(this, function () { return value; });
};

Promise.prototype.thenReject = function (reason) {
    return when(this, function () { throw reason; });
};

// Chainable methods
array_reduce(
    [
        "isFulfilled", "isRejected", "isPending",
        "dispatch",
        "when", "spread",
        "get", "set", "del", "delete",
        "post", "send", "mapply", "invoke", "mcall",
        "keys",
        "fapply", "fcall", "fbind",
        "all", "allResolved",
        "timeout", "delay",
        "catch", "finally", "fail", "fin", "progress", "done",
        "nfcall", "nfapply", "nfbind", "denodeify", "nbind",
        "npost", "nsend", "nmapply", "ninvoke", "nmcall",
        "nodeify"
    ],
    function (undefined, name) {
        Promise.prototype[name] = function () {
            return Q[name].apply(
                Q,
                [this].concat(array_slice(arguments))
            );
        };
    },
    void 0
);

Promise.prototype.toSource = function () {
    return this.toString();
};

Promise.prototype.toString = function () {
    return "[object Promise]";
};

/**
 * If an object is not a promise, it is as "near" as possible.
 * If a promise is rejected, it is as "near" as possible too.
 * If it’s a fulfilled promise, the fulfillment value is nearer.
 * If it’s a deferred promise and the deferred has been resolved, the
 * resolution is "nearer".
 * @param object
 * @returns most resolved (nearest) form of the object
 */

// XXX should we re-do this?
Q.nearer = nearer;
function nearer(value) {
    if (isPromise(value)) {
        var inspected = value.inspect();
        if (inspected.state === "fulfilled") {
            return inspected.value;
        }
    }
    return value;
}

/**
 * @returns whether the given object is a promise.
 * Otherwise it is a fulfilled value.
 */
Q.isPromise = isPromise;
function isPromise(object) {
    return isObject(object) &&
        typeof object.promiseDispatch === "function" &&
        typeof object.inspect === "function";
}

Q.isPromiseAlike = isPromiseAlike;
function isPromiseAlike(object) {
    return isObject(object) && typeof object.then === "function";
}

/**
 * @returns whether the given object is a pending promise, meaning not
 * fulfilled or rejected.
 */
Q.isPending = isPending;
function isPending(object) {
    return isPromise(object) && object.inspect().state === "pending";
}

/**
 * @returns whether the given object is a value or fulfilled
 * promise.
 */
Q.isFulfilled = isFulfilled;
function isFulfilled(object) {
    return !isPromise(object) || object.inspect().state === "fulfilled";
}

/**
 * @returns whether the given object is a rejected promise.
 */
Q.isRejected = isRejected;
function isRejected(object) {
    return isPromise(object) && object.inspect().state === "rejected";
}

//// BEGIN UNHANDLED REJECTION TRACKING

// This promise library consumes exceptions thrown in handlers so they can be
// handled by a subsequent promise.  The exceptions get added to this array when
// they are created, and removed when they are handled.  Note that in ES6 or
// shimmed environments, this would naturally be a `Set`.
var unhandledReasons = [];
var unhandledRejections = [];
var unhandledReasonsDisplayed = false;
var trackUnhandledRejections = true;
function displayUnhandledReasons() {
    if (
        !unhandledReasonsDisplayed &&
        typeof window !== "undefined" &&
        !window.Touch &&
        window.console
    ) {
        console.warn("[Q] Unhandled rejection reasons (should be empty):",
                     unhandledReasons);
    }

    unhandledReasonsDisplayed = true;
}

function logUnhandledReasons() {
    for (var i = 0; i < unhandledReasons.length; i++) {
        var reason = unhandledReasons[i];
        if (reason && typeof reason.stack !== "undefined") {
            console.warn("Unhandled rejection reason:", reason.stack);
        } else {
            console.warn("Unhandled rejection reason (no stack):", reason);
        }
    }
}

function resetUnhandledRejections() {
    unhandledReasons.length = 0;
    unhandledRejections.length = 0;
    unhandledReasonsDisplayed = false;

    if (!trackUnhandledRejections) {
        trackUnhandledRejections = true;

        // Show unhandled rejection reasons if Node exits without handling an
        // outstanding rejection.  (Note that Browserify presently produces a
        // `process` global without the `EventEmitter` `on` method.)
        if (typeof process !== "undefined" && process.on) {
            process.on("exit", logUnhandledReasons);
        }
    }
}

function trackRejection(promise, reason) {
    if (!trackUnhandledRejections) {
        return;
    }

    unhandledRejections.push(promise);
    unhandledReasons.push(reason);
    displayUnhandledReasons();
}

function untrackRejection(promise) {
    if (!trackUnhandledRejections) {
        return;
    }

    var at = array_indexOf(unhandledRejections, promise);
    if (at !== -1) {
        unhandledRejections.splice(at, 1);
        unhandledReasons.splice(at, 1);
    }
}

Q.resetUnhandledRejections = resetUnhandledRejections;

Q.getUnhandledReasons = function () {
    // Make a copy so that consumers can't interfere with our internal state.
    return unhandledReasons.slice();
};

Q.stopUnhandledRejectionTracking = function () {
    resetUnhandledRejections();
    if (typeof process !== "undefined" && process.on) {
        process.removeListener("exit", logUnhandledReasons);
    }
    trackUnhandledRejections = false;
};

resetUnhandledRejections();

//// END UNHANDLED REJECTION TRACKING

/**
 * Constructs a rejected promise.
 * @param reason value describing the failure
 */
Q.reject = reject;
function reject(reason) {
    var rejection = Promise({
        "when": function (rejected) {
            // note that the error has been handled
            if (rejected) {
                untrackRejection(this);
            }
            return rejected ? rejected(reason) : this;
        }
    }, function fallback() {
        return this;
    }, function inspect() {
        return { state: "rejected", reason: reason };
    });

    // Note that the reason has not been handled.
    trackRejection(rejection, reason);

    return rejection;
}

/**
 * Constructs a fulfilled promise for an immediate reference.
 * @param value immediate reference
 */
Q.fulfill = fulfill;
function fulfill(value) {
    return Promise({
        "when": function () {
            return value;
        },
        "get": function (name) {
            return value[name];
        },
        "set": function (name, rhs) {
            value[name] = rhs;
        },
        "delete": function (name) {
            delete value[name];
        },
        "post": function (name, args) {
            // Mark Miller proposes that post with no name should apply a
            // promised function.
            if (name === null || name === void 0) {
                return value.apply(void 0, args);
            } else {
                return value[name].apply(value, args);
            }
        },
        "apply": function (thisP, args) {
            return value.apply(thisP, args);
        },
        "keys": function () {
            return object_keys(value);
        }
    }, void 0, function inspect() {
        return { state: "fulfilled", value: value };
    });
}

/**
 * Constructs a promise for an immediate reference, passes promises through, or
 * coerces promises from different systems.
 * @param value immediate reference or promise
 */
Q.resolve = resolve;
function resolve(value) {
    // If the object is already a Promise, return it directly.  This enables
    // the resolve function to both be used to created references from objects,
    // but to tolerably coerce non-promises to promises.
    if (isPromise(value)) {
        return value;
    }

    // assimilate thenables
    if (isPromiseAlike(value)) {
        return coerce(value);
    } else {
        return fulfill(value);
    }
}

/**
 * Converts thenables to Q promises.
 * @param promise thenable promise
 * @returns a Q promise
 */
function coerce(promise) {
    var deferred = defer();
    nextTick(function () {
        try {
            promise.then(deferred.resolve, deferred.reject, deferred.notify);
        } catch (exception) {
            deferred.reject(exception);
        }
    });
    return deferred.promise;
}

/**
 * Annotates an object such that it will never be
 * transferred away from this process over any promise
 * communication channel.
 * @param object
 * @returns promise a wrapping of that object that
 * additionally responds to the "isDef" message
 * without a rejection.
 */
Q.master = master;
function master(object) {
    return Promise({
        "isDef": function () {}
    }, function fallback(op, args) {
        return dispatch(object, op, args);
    }, function () {
        return resolve(object).inspect();
    });
}

/**
 * Registers an observer on a promise.
 *
 * Guarantees:
 *
 * 1. that fulfilled and rejected will be called only once.
 * 2. that either the fulfilled callback or the rejected callback will be
 *    called, but not both.
 * 3. that fulfilled and rejected will not be called in this turn.
 *
 * @param value      promise or immediate reference to observe
 * @param fulfilled  function to be called with the fulfilled value
 * @param rejected   function to be called with the rejection exception
 * @param progressed function to be called on any progress notifications
 * @return promise for the return value from the invoked callback
 */
Q.when = when;
function when(value, fulfilled, rejected, progressed) {
    return Q(value).then(fulfilled, rejected, progressed);
}

/**
 * Spreads the values of a promised array of arguments into the
 * fulfillment callback.
 * @param fulfilled callback that receives variadic arguments from the
 * promised array
 * @param rejected callback that receives the exception if the promise
 * is rejected.
 * @returns a promise for the return value or thrown exception of
 * either callback.
 */
Q.spread = spread;
function spread(promise, fulfilled, rejected) {
    return when(promise, function (valuesOrPromises) {
        return all(valuesOrPromises).then(function (values) {
            return fulfilled.apply(void 0, values);
        }, rejected);
    }, rejected);
}

/**
 * The async function is a decorator for generator functions, turning
 * them into asynchronous generators.  Although generators are only part
 * of the newest ECMAScript 6 drafts, this code does not cause syntax
 * errors in older engines.  This code should continue to work and will
 * in fact improve over time as the language improves.
 *
 * ES6 generators are currently part of V8 version 3.19 with the
 * --harmony-generators runtime flag enabled.  SpiderMonkey has had them
 * for longer, but under an older Python-inspired form.  This function
 * works on both kinds of generators.
 *
 * Decorates a generator function such that:
 *  - it may yield promises
 *  - execution will continue when that promise is fulfilled
 *  - the value of the yield expression will be the fulfilled value
 *  - it returns a promise for the return value (when the generator
 *    stops iterating)
 *  - the decorated function returns a promise for the return value
 *    of the generator or the first rejected promise among those
 *    yielded.
 *  - if an error is thrown in the generator, it propagates through
 *    every following yield until it is caught, or until it escapes
 *    the generator function altogether, and is translated into a
 *    rejection for the promise returned by the decorated generator.
 */
Q.async = async;
function async(makeGenerator) {
    return function () {
        // when verb is "send", arg is a value
        // when verb is "throw", arg is an exception
        function continuer(verb, arg) {
            var result;
            if (hasES6Generators) {
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    return reject(exception);
                }
                if (result.done) {
                    return result.value;
                } else {
                    return when(result.value, callback, errback);
                }
            } else {
                // FIXME: Remove this case when SM does ES6 generators.
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    if (isStopIteration(exception)) {
                        return exception.value;
                    } else {
                        return reject(exception);
                    }
                }
                return when(result, callback, errback);
            }
        }
        var generator = makeGenerator.apply(this, arguments);
        var callback = continuer.bind(continuer, "send");
        var errback = continuer.bind(continuer, "throw");
        return callback();
    };
}

/**
 * The spawn function is a small wrapper around async that immediately
 * calls the generator and also ends the promise chain, so that any
 * unhandled errors are thrown instead of forwarded to the error
 * handler. This is useful because it's extremely common to run
 * generators at the top-level to work with libraries.
 */
Q.spawn = spawn;
function spawn(makeGenerator) {
    Q.done(Q.async(makeGenerator)());
}

// FIXME: Remove this interface once ES6 generators are in SpiderMonkey.
/**
 * Throws a ReturnValue exception to stop an asynchronous generator.
 *
 * This interface is a stop-gap measure to support generator return
 * values in older Firefox/SpiderMonkey.  In browsers that support ES6
 * generators like Chromium 29, just use "return" in your generator
 * functions.
 *
 * @param value the return value for the surrounding generator
 * @throws ReturnValue exception with the value.
 * @example
 * // ES6 style
 * Q.async(function* () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      return foo + bar;
 * })
 * // Older SpiderMonkey style
 * Q.async(function () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      Q.return(foo + bar);
 * })
 */
Q["return"] = _return;
function _return(value) {
    throw new QReturnValue(value);
}

/**
 * The promised function decorator ensures that any promise arguments
 * are settled and passed as values (`this` is also settled and passed
 * as a value).  It will also ensure that the result of a function is
 * always a promise.
 *
 * @example
 * var add = Q.promised(function (a, b) {
 *     return a + b;
 * });
 * add(Q.resolve(a), Q.resolve(B));
 *
 * @param {function} callback The function to decorate
 * @returns {function} a function that has been decorated.
 */
Q.promised = promised;
function promised(callback) {
    return function () {
        return spread([this, all(arguments)], function (self, args) {
            return callback.apply(self, args);
        });
    };
}

/**
 * sends a message to a value in a future turn
 * @param object* the recipient
 * @param op the name of the message operation, e.g., "when",
 * @param args further arguments to be forwarded to the operation
 * @returns result {Promise} a promise for the result of the operation
 */
Q.dispatch = dispatch;
function dispatch(object, op, args) {
    var deferred = defer();
    nextTick(function () {
        resolve(object).promiseDispatch(deferred.resolve, op, args);
    });
    return deferred.promise;
}

/**
 * Constructs a promise method that can be used to safely observe resolution of
 * a promise for an arbitrarily named method like "propfind" in a future turn.
 *
 * "dispatcher" constructs methods like "get(promise, name)" and "set(promise)".
 */
Q.dispatcher = dispatcher;
function dispatcher(op) {
    return function (object) {
        var args = array_slice(arguments, 1);
        return dispatch(object, op, args);
    };
}

/**
 * Gets the value of a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to get
 * @return promise for the property value
 */
Q.get = dispatcher("get");

/**
 * Sets the value of a property in a future turn.
 * @param object    promise or immediate reference for object object
 * @param name      name of property to set
 * @param value     new value of property
 * @return promise for the return value
 */
Q.set = dispatcher("set");

/**
 * Deletes a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to delete
 * @return promise for the return value
 */
Q["delete"] = // XXX experimental
Q.del = dispatcher("delete");

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param value     a value to post, typically an array of
 *                  invocation arguments for promises that
 *                  are ultimately backed with `resolve` values,
 *                  as opposed to those backed with URLs
 *                  wherein the posted value can be any
 *                  JSON serializable object.
 * @return promise for the return value
 */
// bound locally because it is used by other methods
var post = Q.post = dispatcher("post");
Q.mapply = post; // experimental

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param ...args   array of invocation arguments
 * @return promise for the return value
 */
Q.send = send;
Q.invoke = send; // synonyms
Q.mcall = send; // experimental
function send(value, name) {
    var args = array_slice(arguments, 2);
    return post(value, name, args);
}

/**
 * Applies the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param args      array of application arguments
 */
Q.fapply = fapply;
function fapply(value, args) {
    return dispatch(value, "apply", [void 0, args]);
}

/**
 * Calls the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q["try"] = fcall; // XXX experimental
Q.fcall = fcall;
function fcall(value) {
    var args = array_slice(arguments, 1);
    return fapply(value, args);
}

/**
 * Binds the promised function, transforming return values into a fulfilled
 * promise and thrown errors into a rejected one.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q.fbind = fbind;
function fbind(value) {
    var args = array_slice(arguments, 1);
    return function fbound() {
        var allArgs = args.concat(array_slice(arguments));
        return dispatch(value, "apply", [this, allArgs]);
    };
}

/**
 * Requests the names of the owned properties of a promised
 * object in a future turn.
 * @param object    promise or immediate reference for target object
 * @return promise for the keys of the eventually settled object
 */
Q.keys = dispatcher("keys");

/**
 * Turns an array of promises into a promise for an array.  If any of
 * the promises gets rejected, the whole array is rejected immediately.
 * @param {Array*} an array (or promise for an array) of values (or
 * promises for values)
 * @returns a promise for an array of the corresponding values
 */
// By Mark Miller
// http://wiki.ecmascript.org/doku.php?id=strawman:concurrency&rev=1308776521#allfulfilled
Q.all = all;
function all(promises) {
    return when(promises, function (promises) {
        var countDown = 0;
        var deferred = defer();
        array_reduce(promises, function (undefined, promise, index) {
            var snapshot;
            if (
                isPromise(promise) &&
                (snapshot = promise.inspect()).state === "fulfilled"
            ) {
                promises[index] = snapshot.value;
            } else {
                ++countDown;
                when(promise, function (value) {
                    promises[index] = value;
                    if (--countDown === 0) {
                        deferred.resolve(promises);
                    }
                }, deferred.reject);
            }
        }, void 0);
        if (countDown === 0) {
            deferred.resolve(promises);
        }
        return deferred.promise;
    });
}

/**
 * Waits for all promises to be settled, either fulfilled or
 * rejected.  This is distinct from `all` since that would stop
 * waiting at the first rejection.  The promise returned by
 * `allResolved` will never be rejected.
 * @param promises a promise for an array (or an array) of promises
 * (or values)
 * @return a promise for an array of promises
 */
Q.allResolved = deprecate(allResolved, "allResolved", "allSettled");
function allResolved(promises) {
    return when(promises, function (promises) {
        promises = array_map(promises, resolve);
        return when(all(array_map(promises, function (promise) {
            return when(promise, noop, noop);
        })), function () {
            return promises;
        });
    });
}

Q.allSettled = allSettled;
function allSettled(values) {
    return when(values, function (values) {
        return all(array_map(values, function (value, i) {
            return when(
                value,
                function (fulfillmentValue) {
                    values[i] = { state: "fulfilled", value: fulfillmentValue };
                    return values[i];
                },
                function (reason) {
                    values[i] = { state: "rejected", reason: reason };
                    return values[i];
                }
            );
        })).thenResolve(values);
    });
}

/**
 * Captures the failure of a promise, giving an oportunity to recover
 * with a callback.  If the given promise is fulfilled, the returned
 * promise is fulfilled.
 * @param {Any*} promise for something
 * @param {Function} callback to fulfill the returned promise if the
 * given promise is rejected
 * @returns a promise for the return value of the callback
 */
Q["catch"] = // XXX experimental
Q.fail = fail;
function fail(promise, rejected) {
    return when(promise, void 0, rejected);
}

/**
 * Attaches a listener that can respond to progress notifications from a
 * promise's originating deferred. This listener receives the exact arguments
 * passed to ``deferred.notify``.
 * @param {Any*} promise for something
 * @param {Function} callback to receive any progress notifications
 * @returns the given promise, unchanged
 */
Q.progress = progress;
function progress(promise, progressed) {
    return when(promise, void 0, void 0, progressed);
}

/**
 * Provides an opportunity to observe the settling of a promise,
 * regardless of whether the promise is fulfilled or rejected.  Forwards
 * the resolution to the returned promise when the callback is done.
 * The callback can return a promise to defer completion.
 * @param {Any*} promise
 * @param {Function} callback to observe the resolution of the given
 * promise, takes no arguments.
 * @returns a promise for the resolution of the given promise when
 * ``fin`` is done.
 */
Q["finally"] = // XXX experimental
Q.fin = fin;
function fin(promise, callback) {
    return when(promise, function (value) {
        return when(callback(), function () {
            return value;
        });
    }, function (exception) {
        return when(callback(), function () {
            return reject(exception);
        });
    });
}

/**
 * Terminates a chain of promises, forcing rejections to be
 * thrown as exceptions.
 * @param {Any*} promise at the end of a chain of promises
 * @returns nothing
 */
Q.done = done;
function done(promise, fulfilled, rejected, progress) {
    var onUnhandledError = function (error) {
        // forward to a future turn so that ``when``
        // does not catch it and turn it into a rejection.
        nextTick(function () {
            makeStackTraceLong(error, promise);

            if (Q.onerror) {
                Q.onerror(error);
            } else {
                throw error;
            }
        });
    };

    // Avoid unnecessary `nextTick`ing via an unnecessary `when`.
    var promiseToHandle = fulfilled || rejected || progress ?
        when(promise, fulfilled, rejected, progress) :
        promise;

    if (typeof process === "object" && process && process.domain) {
        onUnhandledError = process.domain.bind(onUnhandledError);
    }
    fail(promiseToHandle, onUnhandledError);
}

/**
 * Causes a promise to be rejected if it does not get fulfilled before
 * some milliseconds time out.
 * @param {Any*} promise
 * @param {Number} milliseconds timeout
 * @param {String} custom error message (optional)
 * @returns a promise for the resolution of the given promise if it is
 * fulfilled before the timeout, otherwise rejected.
 */
Q.timeout = timeout;
function timeout(promise, ms, msg) {
    var deferred = defer();
    var timeoutId = setTimeout(function () {
        deferred.reject(new Error(msg || "Timed out after " + ms + " ms"));
    }, ms);

    when(promise, function (value) {
        clearTimeout(timeoutId);
        deferred.resolve(value);
    }, function (exception) {
        clearTimeout(timeoutId);
        deferred.reject(exception);
    }, deferred.notify);

    return deferred.promise;
}

/**
 * Returns a promise for the given value (or promised value) after some
 * milliseconds.
 * @param {Any*} promise
 * @param {Number} milliseconds
 * @returns a promise for the resolution of the given promise after some
 * time has elapsed.
 */
Q.delay = delay;
function delay(promise, timeout) {
    if (timeout === void 0) {
        timeout = promise;
        promise = void 0;
    }

    var deferred = defer();

    when(promise, undefined, undefined, deferred.notify);
    setTimeout(function () {
        deferred.resolve(promise);
    }, timeout);

    return deferred.promise;
}

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided as an array, and returns a promise.
 *
 *      Q.nfapply(FS.readFile, [__filename])
 *      .then(function (content) {
 *      })
 *
 */
Q.nfapply = nfapply;
function nfapply(callback, args) {
    var nodeArgs = array_slice(args);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());

    fapply(callback, nodeArgs).fail(deferred.reject);
    return deferred.promise;
}

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided individually, and returns a promise.
 *
 *      Q.nfcall(FS.readFile, __filename)
 *      .then(function (content) {
 *      })
 *
 */
Q.nfcall = nfcall;
function nfcall(callback/*, ...args */) {
    var nodeArgs = array_slice(arguments, 1);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());

    fapply(callback, nodeArgs).fail(deferred.reject);
    return deferred.promise;
}

/**
 * Wraps a NodeJS continuation passing function and returns an equivalent
 * version that returns a promise.
 *
 *      Q.nfbind(FS.readFile, __filename)("utf-8")
 *      .then(console.log)
 *      .done()
 *
 */
Q.nfbind = nfbind;
Q.denodeify = Q.nfbind; // synonyms
function nfbind(callback/*, ...args */) {
    var baseArgs = array_slice(arguments, 1);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());

        fapply(callback, nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
}

Q.nbind = nbind;
function nbind(callback, thisArg /*, ... args*/) {
    var baseArgs = array_slice(arguments, 2);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());

        function bound() {
            return callback.apply(thisArg, arguments);
        }

        fapply(bound, nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
}

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback with a given array of arguments, plus a provided callback.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param {Array} args arguments to pass to the method; the callback
 * will be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.npost = npost;
Q.nmapply = npost; // synonyms
function npost(object, name, args) {
    var nodeArgs = array_slice(args || []);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());

    post(object, name, nodeArgs).fail(deferred.reject);
    return deferred.promise;
}

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback, forwarding the given variadic arguments, plus a provided
 * callback argument.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param ...args arguments to pass to the method; the callback will
 * be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nsend = nsend;
Q.ninvoke = Q.nsend; // synonyms
Q.nmcall = Q.nsend; // synonyms
function nsend(object, name /*, ...args*/) {
    var nodeArgs = array_slice(arguments, 2);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    post(object, name, nodeArgs).fail(deferred.reject);
    return deferred.promise;
}

Q.nodeify = nodeify;
function nodeify(promise, nodeback) {
    if (nodeback) {
        promise.then(function (value) {
            nextTick(function () {
                nodeback(null, value);
            });
        }, function (error) {
            nextTick(function () {
                nodeback(error);
            });
        });
    } else {
        return promise;
    }
}

// All code before this point will be filtered from stack traces.
var qEndingLine = captureLine();

return Q;

});

})(require("__browserify_process"))
},{"__browserify_process":5}],7:[function(require,module,exports){
var punycode = { encode : function (s) { return s } };

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

function arrayIndexOf(array, subject) {
    for (var i = 0, j = array.length; i < j; i++) {
        if(array[i] == subject) return i;
    }
    return -1;
}

var objectKeys = Object.keys || function objectKeys(object) {
    if (object !== Object(object)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in object) if (object.hasOwnProperty(key)) keys[keys.length] = key;
    return keys;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]+$/,
    // RFC 2396: characters reserved for delimiting URLs.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],
    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '~', '[', ']', '`'].concat(delims),
    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''],
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#']
      .concat(unwise).concat(autoEscape),
    nonAuthChars = ['/', '@', '?', '#'].concat(delims),
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[a-zA-Z0-9][a-z0-9A-Z_-]{0,62}$/,
    hostnamePartStart = /^([a-zA-Z0-9][a-z0-9A-Z_-]{0,62})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always have a path component.
    pathedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = require('querystring');

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && typeof(url) === 'object' && url.href) return url;

  if (typeof url !== 'string') {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  var out = {},
      rest = url;

  // cut off any delimiters.
  // This is to support parse stuff like "<http://foo.com>"
  for (var i = 0, l = rest.length; i < l; i++) {
    if (arrayIndexOf(delims, rest.charAt(i)) === -1) break;
  }
  if (i !== 0) rest = rest.substr(i);


  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    out.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      out.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {
    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    // don't enforce full RFC correctness, just be unstupid about it.

    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the first @ sign, unless some non-auth character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    var atSign = arrayIndexOf(rest, '@');
    if (atSign !== -1) {
      // there *may be* an auth
      var hasAuth = true;
      for (var i = 0, l = nonAuthChars.length; i < l; i++) {
        var index = arrayIndexOf(rest, nonAuthChars[i]);
        if (index !== -1 && index < atSign) {
          // not a valid auth.  Something like http://foo.com/bar@baz/
          hasAuth = false;
          break;
        }
      }
      if (hasAuth) {
        // pluck off the auth portion.
        out.auth = rest.substr(0, atSign);
        rest = rest.substr(atSign + 1);
      }
    }

    var firstNonHost = -1;
    for (var i = 0, l = nonHostChars.length; i < l; i++) {
      var index = arrayIndexOf(rest, nonHostChars[i]);
      if (index !== -1 &&
          (firstNonHost < 0 || index < firstNonHost)) firstNonHost = index;
    }

    if (firstNonHost !== -1) {
      out.host = rest.substr(0, firstNonHost);
      rest = rest.substr(firstNonHost);
    } else {
      out.host = rest;
      rest = '';
    }

    // pull out port.
    var p = parseHost(out.host);
    var keys = objectKeys(p);
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      out[key] = p[key];
    }

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    out.hostname = out.hostname || '';

    // validate a little.
    if (out.hostname.length > hostnameMaxLen) {
      out.hostname = '';
    } else {
      var hostparts = out.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            out.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    // hostnames are always lower case.
    out.hostname = out.hostname.toLowerCase();

    // IDNA Support: Returns a puny coded representation of "domain".
    // It only converts the part of the domain name that
    // has non ASCII characters. I.e. it dosent matter if
    // you call it with a domain that already is in ASCII.
    var domainArray = out.hostname.split('.');
    var newOut = [];
    for (var i = 0; i < domainArray.length; ++i) {
      var s = domainArray[i];
      newOut.push(s.match(/[^A-Za-z0-9_-]/) ?
          'xn--' + punycode.encode(s) : s);
    }
    out.hostname = newOut.join('.');

    out.host = (out.hostname || '') +
        ((out.port) ? ':' + out.port : '');
    out.href += out.host;
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }

    // Now make sure that delims never appear in a url.
    var chop = rest.length;
    for (var i = 0, l = delims.length; i < l; i++) {
      var c = arrayIndexOf(rest, delims[i]);
      if (c !== -1) {
        chop = Math.min(c, chop);
      }
    }
    rest = rest.substr(0, chop);
  }


  // chop off from the tail first.
  var hash = arrayIndexOf(rest, '#');
  if (hash !== -1) {
    // got a fragment string.
    out.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = arrayIndexOf(rest, '?');
  if (qm !== -1) {
    out.search = rest.substr(qm);
    out.query = rest.substr(qm + 1);
    if (parseQueryString) {
      out.query = querystring.parse(out.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    out.search = '';
    out.query = {};
  }
  if (rest) out.pathname = rest;
  if (slashedProtocol[proto] &&
      out.hostname && !out.pathname) {
    out.pathname = '/';
  }

  //to support http.request
  if (out.pathname || out.search) {
    out.path = (out.pathname ? out.pathname : '') +
               (out.search ? out.search : '');
  }

  // finally, reconstruct the href based on what has been validated.
  out.href = urlFormat(out);
  return out;
}

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (typeof(obj) === 'string') obj = urlParse(obj);

  var auth = obj.auth || '';
  if (auth) {
    auth = auth.split('@').join('%40');
    for (var i = 0, l = nonAuthChars.length; i < l; i++) {
      var nAC = nonAuthChars[i];
      auth = auth.split(nAC).join(encodeURIComponent(nAC));
    }
    auth += '@';
  }

  var protocol = obj.protocol || '',
      host = (obj.host !== undefined) ? auth + obj.host :
          obj.hostname !== undefined ? (
              auth + obj.hostname +
              (obj.port ? ':' + obj.port : '')
          ) :
          false,
      pathname = obj.pathname || '',
      query = obj.query &&
              ((typeof obj.query === 'object' &&
                objectKeys(obj.query).length) ?
                 querystring.stringify(obj.query) :
                 '') || '',
      search = obj.search || (query && ('?' + query)) || '',
      hash = obj.hash || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (obj.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  return protocol + host + pathname + search + hash;
}

function urlResolve(source, relative) {
  return urlFormat(urlResolveObject(source, relative));
}

function urlResolveObject(source, relative) {
  if (!source) return relative;

  source = urlParse(urlFormat(source), false, true);
  relative = urlParse(urlFormat(relative), false, true);

  // hash is always overridden, no matter what.
  source.hash = relative.hash;

  if (relative.href === '') {
    source.href = urlFormat(source);
    return source;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    relative.protocol = source.protocol;
    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[relative.protocol] &&
        relative.hostname && !relative.pathname) {
      relative.path = relative.pathname = '/';
    }
    relative.href = urlFormat(relative);
    return relative;
  }

  if (relative.protocol && relative.protocol !== source.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      relative.href = urlFormat(relative);
      return relative;
    }
    source.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      relative.pathname = relPath.join('/');
    }
    source.pathname = relative.pathname;
    source.search = relative.search;
    source.query = relative.query;
    source.host = relative.host || '';
    source.auth = relative.auth;
    source.hostname = relative.hostname || relative.host;
    source.port = relative.port;
    //to support http.request
    if (source.pathname !== undefined || source.search !== undefined) {
      source.path = (source.pathname ? source.pathname : '') +
                    (source.search ? source.search : '');
    }
    source.slashes = source.slashes || relative.slashes;
    source.href = urlFormat(source);
    return source;
  }

  var isSourceAbs = (source.pathname && source.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host !== undefined ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (source.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = source.pathname && source.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = source.protocol &&
          !slashedProtocol[source.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // source.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {

    delete source.hostname;
    delete source.port;
    if (source.host) {
      if (srcPath[0] === '') srcPath[0] = source.host;
      else srcPath.unshift(source.host);
    }
    delete source.host;
    if (relative.protocol) {
      delete relative.hostname;
      delete relative.port;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      delete relative.host;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    source.host = (relative.host || relative.host === '') ?
                      relative.host : source.host;
    source.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : source.hostname;
    source.search = relative.search;
    source.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    source.search = relative.search;
    source.query = relative.query;
  } else if ('search' in relative) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      source.hostname = source.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especialy happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = source.host && arrayIndexOf(source.host, '@') > 0 ?
                       source.host.split('@') : false;
      if (authInHost) {
        source.auth = authInHost.shift();
        source.host = source.hostname = authInHost.shift();
      }
    }
    source.search = relative.search;
    source.query = relative.query;
    //to support http.request
    if (source.pathname !== undefined || source.search !== undefined) {
      source.path = (source.pathname ? source.pathname : '') +
                    (source.search ? source.search : '');
    }
    source.href = urlFormat(source);
    return source;
  }
  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    delete source.pathname;
    //to support http.request
    if (!source.search) {
      source.path = '/' + source.search;
    } else {
      delete source.path;
    }
    source.href = urlFormat(source);
    return source;
  }
  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (source.host || relative.host) && (last === '.' || last === '..') ||
      last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last == '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    source.hostname = source.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especialy happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = source.host && arrayIndexOf(source.host, '@') > 0 ?
                     source.host.split('@') : false;
    if (authInHost) {
      source.auth = authInHost.shift();
      source.host = source.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (source.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  source.pathname = srcPath.join('/');
  //to support request.http
  if (source.pathname !== undefined || source.search !== undefined) {
    source.path = (source.pathname ? source.pathname : '') +
                  (source.search ? source.search : '');
  }
  source.auth = relative.auth || source.auth;
  source.slashes = source.slashes || relative.slashes;
  source.href = urlFormat(source);
  return source;
}

function parseHost(host) {
  var out = {};
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    out.port = port.substr(1);
    host = host.substr(0, host.length - port.length);
  }
  if (host) out.hostname = host;
  return out;
}

},{"querystring":8}],9:[function(require,module,exports){
// nothing to see here... no file methods for the browser

},{}],10:[function(require,module,exports){
window.RAML = {}

window.RAML.Parser = require('../lib/raml')
},{"../lib/raml":11}],12:[function(require,module,exports){
(function() {
  var MarkedYAMLError, events, nodes, raml, util, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  events = require('./events');

  MarkedYAMLError = require('./errors').MarkedYAMLError;

  nodes = require('./nodes');

  raml = require('./raml');

  util = require('./util');

  this.ComposerError = (function(_super) {
    __extends(ComposerError, _super);

    function ComposerError() {
      _ref = ComposerError.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return ComposerError;

  })(MarkedYAMLError);

  this.Composer = (function() {
    function Composer() {
      this.anchors = {};
    }

    Composer.prototype.check_node = function() {
      if (this.check_event(events.StreamStartEvent)) {
        this.get_event();
      }
      return !this.check_event(events.StreamEndEvent);
    };

    /*
    Get the root node of the next document.
    */


    Composer.prototype.get_node = function() {
      if (!this.check_event(events.StreamEndEvent)) {
        return this.compose_document();
      }
    };

    Composer.prototype.get_single_node = function(validate, apply, join) {
      var document, event;
      if (validate == null) {
        validate = true;
      }
      if (apply == null) {
        apply = true;
      }
      if (join == null) {
        join = true;
      }
      this.get_event();
      document = null;
      if (!this.check_event(events.StreamEndEvent)) {
        document = this.compose_document();
      }
      if (!this.check_event(events.StreamEndEvent)) {
        event = this.get_event();
        throw new exports.ComposerError('document scan', document.start_mark, 'expected a single document in the stream but found another document', event.start_mark);
      }
      this.get_event();
      if (validate || apply) {
        this.load_schemas(document);
        this.load_traits(document);
        this.load_types(document);
        this.load_security_schemes(document);
      }
      if (validate) {
        this.validate_document(document);
      }
      if (apply) {
        this.apply_types(document);
        this.apply_traits(document);
        this.apply_schemas(document);
        this.apply_protocols(document);
      }
      if (join) {
        this.join_resources(document);
      }
      return document;
    };

    Composer.prototype.compose_document = function() {
      var node;
      this.get_event();
      node = this.compose_node();
      this.get_event();
      this.anchors = {};
      return node;
    };

    Composer.prototype.compose_node = function(parent, index) {
      var anchor, event, node;
      if (this.check_event(events.AliasEvent)) {
        event = this.get_event();
        anchor = event.anchor;
        if (!(anchor in this.anchors)) {
          throw new exports.ComposerError(null, null, "found undefined alias " + anchor, event.start_mark);
        }
        return this.anchors[anchor];
      }
      event = this.peek_event();
      anchor = event.anchor;
      if (anchor !== null && anchor in this.anchors) {
        throw new exports.ComposerError("found duplicate anchor " + anchor + "; first occurence", this.anchors[anchor].start_mark, 'second occurrence', event.start_mark);
      }
      this.descend_resolver(parent, index);
      if (this.check_event(events.ScalarEvent)) {
        node = this.compose_scalar_node(anchor);
      } else if (this.check_event(events.SequenceStartEvent)) {
        node = this.compose_sequence_node(anchor);
      } else if (this.check_event(events.MappingStartEvent)) {
        node = this.compose_mapping_node(anchor);
      }
      this.ascend_resolver();
      return node;
    };

    Composer.prototype.compose_fixed_scalar_node = function(anchor, value) {
      var event, node;
      event = this.get_event();
      node = new nodes.ScalarNode('tag:yaml.org,2002:str', value, event.start_mark, event.end_mark, event.style);
      if (anchor !== null) {
        this.anchors[anchor] = node;
      }
      return node;
    };

    Composer.prototype.compose_scalar_node = function(anchor) {
      var event, extension, node, tag;
      event = this.get_event();
      tag = event.tag;
      if (tag === null || tag === '!') {
        tag = this.resolve(nodes.ScalarNode, event.value, event.implicit);
      }
      if (event.tag === '!include') {
        if (event.value.match(/^\s*$/)) {
          throw new exports.ComposerError('while composing scalar out of !include', null, "file name/URL cannot be null", event.start_mark);
        }
        if (this.src != null) {
          event.value = require('url').resolve(this.src, event.value);
        }
        if (this.isInIncludeTagsStack(event.value)) {
          throw new exports.ComposerError('while composing scalar out of !include', null, "detected circular !include of " + event.value, event.start_mark);
        }
        extension = event.value.split(".").pop();
        if (extension === 'yaml' || extension === 'yml' || extension === 'raml') {
          raml.start_mark = event.start_mark;
          return raml.composeFile(event.value, false, false, false, this);
        }
        raml.start_mark = event.start_mark;
        node = new nodes.ScalarNode('tag:yaml.org,2002:str', raml.readFile(event.value), event.start_mark, event.end_mark, event.style);
      } else {
        node = new nodes.ScalarNode(tag, event.value, event.start_mark, event.end_mark, event.style);
      }
      if (anchor !== null) {
        this.anchors[anchor] = node;
      }
      return node;
    };

    Composer.prototype.compose_sequence_node = function(anchor) {
      var end_event, index, node, start_event, tag;
      start_event = this.get_event();
      tag = start_event.tag;
      if (tag === null || tag === '!') {
        tag = this.resolve(nodes.SequenceNode, null, start_event.implicit);
      }
      node = new nodes.SequenceNode(tag, [], start_event.start_mark, null, start_event.flow_style);
      if (anchor !== null) {
        this.anchors[anchor] = node;
      }
      index = 0;
      while (!this.check_event(events.SequenceEndEvent)) {
        node.value.push(this.compose_node(node, index));
        index++;
      }
      end_event = this.get_event();
      node.end_mark = end_event.end_mark;
      return node;
    };

    Composer.prototype.compose_mapping_node = function(anchor) {
      var end_event, item_key, item_value, node, start_event, tag;
      start_event = this.get_event();
      tag = start_event.tag;
      if (tag === null || tag === '!') {
        tag = this.resolve(nodes.MappingNode, null, start_event.implicit);
      }
      node = new nodes.MappingNode(tag, [], start_event.start_mark, null, start_event.flow_style);
      if (anchor !== null) {
        this.anchors[anchor] = node;
      }
      while (!this.check_event(events.MappingEndEvent)) {
        item_key = this.compose_node(node);
        if (!util.isScalar(item_key)) {
          throw new exports.ComposerError('while composing mapping key', null, "only scalar map keys are allowed in RAML", item_key.start_mark);
        }
        item_value = this.compose_node(node, item_key);
        node.value.push([item_key, item_value]);
      }
      end_event = this.get_event();
      node.end_mark = end_event.end_mark;
      return node;
    };

    Composer.prototype.isInIncludeTagsStack = function(include) {
      var parent;
      parent = this;
      while (parent = parent.parent) {
        if (parent.src === include) {
          return true;
        }
      }
      return false;
    };

    return Composer;

  })();

}).call(this);

},{"./errors":1,"./events":2,"./nodes":13,"./raml":11,"./util":4,"url":7}],14:[function(require,module,exports){
require=(function(e,t,n,r){function i(r){if(!n[r]){if(!t[r]){if(e)return e(r);throw new Error("Cannot find module '"+r+"'")}var s=n[r]={exports:{}};t[r][0](function(e){var n=t[r][1][e];return i(n?n:e)},s,s.exports)}return n[r].exports}for(var s=0;s<r.length;s++)i(r[s]);return i})(typeof require!=="undefined"&&require,{1:[function(require,module,exports){
exports.readIEEE754 = function(buffer, offset, isBE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isBE ? 0 : (nBytes - 1),
      d = isBE ? 1 : -1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.writeIEEE754 = function(buffer, value, offset, isBE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isBE ? (nBytes - 1) : 0,
      d = isBE ? -1 : 1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

},{}],2:[function(require,module,exports){
(function(){// UTILITY
var util = require('util');
var Buffer = require("buffer").Buffer;
var pSlice = Array.prototype.slice;

function objectKeys(object) {
  if (Object.keys) return Object.keys(object);
  var result = [];
  for (var name in object) {
    if (Object.prototype.hasOwnProperty.call(object, name)) {
      result.push(name);
    }
  }
  return result;
}

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.message = options.message;
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
};
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (value === undefined) {
    return '' + value;
  }
  if (typeof value === 'number' && (isNaN(value) || !isFinite(value))) {
    return value.toString();
  }
  if (typeof value === 'function' || value instanceof RegExp) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (typeof s == 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

assert.AssertionError.prototype.toString = function() {
  if (this.message) {
    return [this.name + ':', this.message].join(' ');
  } else {
    return [
      this.name + ':',
      truncate(JSON.stringify(this.actual, replacer), 128),
      this.operator,
      truncate(JSON.stringify(this.expected, replacer), 128)
    ].join(' ');
  }
};

// assert.AssertionError instanceof Error

assert.AssertionError.__proto__ = Error.prototype;

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!!!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (Buffer.isBuffer(actual) && Buffer.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

  // 7.3. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (typeof actual != 'object' && typeof expected != 'object') {
    return actual == expected;

  // 7.4. For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b),
        key, i;
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (expected instanceof RegExp) {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail('Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail('Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

})()
},{"util":3,"buffer":4}],"buffer-browserify":[function(require,module,exports){
module.exports=require('q9TxCC');
},{}],"q9TxCC":[function(require,module,exports){
(function(){function SlowBuffer (size) {
    this.length = size;
};

var assert = require('assert');

exports.INSPECT_MAX_BYTES = 50;


function toHex(n) {
  if (n < 16) return '0' + n.toString(16);
  return n.toString(16);
}

function utf8ToBytes(str) {
  var byteArray = [];
  for (var i = 0; i < str.length; i++)
    if (str.charCodeAt(i) <= 0x7F)
      byteArray.push(str.charCodeAt(i));
    else {
      var h = encodeURIComponent(str.charAt(i)).substr(1).split('%');
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16));
    }

  return byteArray;
}

function asciiToBytes(str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++ )
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push( str.charCodeAt(i) & 0xFF );

  return byteArray;
}

function base64ToBytes(str) {
  return require("base64-js").toByteArray(str);
}

SlowBuffer.byteLength = function (str, encoding) {
  switch (encoding || "utf8") {
    case 'hex':
      return str.length / 2;

    case 'utf8':
    case 'utf-8':
      return utf8ToBytes(str).length;

    case 'ascii':
    case 'binary':
      return str.length;

    case 'base64':
      return base64ToBytes(str).length;

    default:
      throw new Error('Unknown encoding');
  }
};

function blitBuffer(src, dst, offset, length) {
  var pos, i = 0;
  while (i < length) {
    if ((i+offset >= dst.length) || (i >= src.length))
      break;

    dst[i + offset] = src[i];
    i++;
  }
  return i;
}

SlowBuffer.prototype.utf8Write = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten =  blitBuffer(utf8ToBytes(string), this, offset, length);
};

SlowBuffer.prototype.asciiWrite = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten =  blitBuffer(asciiToBytes(string), this, offset, length);
};

SlowBuffer.prototype.binaryWrite = SlowBuffer.prototype.asciiWrite;

SlowBuffer.prototype.base64Write = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten = blitBuffer(base64ToBytes(string), this, offset, length);
};

SlowBuffer.prototype.base64Slice = function (start, end) {
  var bytes = Array.prototype.slice.apply(this, arguments)
  return require("base64-js").fromByteArray(bytes);
}

function decodeUtf8Char(str) {
  try {
    return decodeURIComponent(str);
  } catch (err) {
    return String.fromCharCode(0xFFFD); // UTF 8 invalid char
  }
}

SlowBuffer.prototype.utf8Slice = function () {
  var bytes = Array.prototype.slice.apply(this, arguments);
  var res = "";
  var tmp = "";
  var i = 0;
  while (i < bytes.length) {
    if (bytes[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(bytes[i]);
      tmp = "";
    } else
      tmp += "%" + bytes[i].toString(16);

    i++;
  }

  return res + decodeUtf8Char(tmp);
}

SlowBuffer.prototype.asciiSlice = function () {
  var bytes = Array.prototype.slice.apply(this, arguments);
  var ret = "";
  for (var i = 0; i < bytes.length; i++)
    ret += String.fromCharCode(bytes[i]);
  return ret;
}

SlowBuffer.prototype.binarySlice = SlowBuffer.prototype.asciiSlice;

SlowBuffer.prototype.inspect = function() {
  var out = [],
      len = this.length;
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i]);
    if (i == exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...';
      break;
    }
  }
  return '<SlowBuffer ' + out.join(' ') + '>';
};


SlowBuffer.prototype.hexSlice = function(start, end) {
  var len = this.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; i++) {
    out += toHex(this[i]);
  }
  return out;
};


SlowBuffer.prototype.toString = function(encoding, start, end) {
  encoding = String(encoding || 'utf8').toLowerCase();
  start = +start || 0;
  if (typeof end == 'undefined') end = this.length;

  // Fastpath empty strings
  if (+end == start) {
    return '';
  }

  switch (encoding) {
    case 'hex':
      return this.hexSlice(start, end);

    case 'utf8':
    case 'utf-8':
      return this.utf8Slice(start, end);

    case 'ascii':
      return this.asciiSlice(start, end);

    case 'binary':
      return this.binarySlice(start, end);

    case 'base64':
      return this.base64Slice(start, end);

    case 'ucs2':
    case 'ucs-2':
      return this.ucs2Slice(start, end);

    default:
      throw new Error('Unknown encoding');
  }
};


SlowBuffer.prototype.hexWrite = function(string, offset, length) {
  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2) {
    throw new Error('Invalid hex string');
  }
  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(byte)) throw new Error('Invalid hex string');
    this[offset + i] = byte;
  }
  SlowBuffer._charsWritten = i * 2;
  return i;
};


SlowBuffer.prototype.write = function(string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length;
      length = undefined;
    }
  } else {  // legacy
    var swap = encoding;
    encoding = offset;
    offset = length;
    length = swap;
  }

  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase();

  switch (encoding) {
    case 'hex':
      return this.hexWrite(string, offset, length);

    case 'utf8':
    case 'utf-8':
      return this.utf8Write(string, offset, length);

    case 'ascii':
      return this.asciiWrite(string, offset, length);

    case 'binary':
      return this.binaryWrite(string, offset, length);

    case 'base64':
      return this.base64Write(string, offset, length);

    case 'ucs2':
    case 'ucs-2':
      return this.ucs2Write(string, offset, length);

    default:
      throw new Error('Unknown encoding');
  }
};


// slice(start, end)
SlowBuffer.prototype.slice = function(start, end) {
  if (end === undefined) end = this.length;

  if (end > this.length) {
    throw new Error('oob');
  }
  if (start > end) {
    throw new Error('oob');
  }

  return new Buffer(this, end - start, +start);
};

SlowBuffer.prototype.copy = function(target, targetstart, sourcestart, sourceend) {
  var temp = [];
  for (var i=sourcestart; i<sourceend; i++) {
    assert.ok(typeof this[i] !== 'undefined', "copying undefined buffer bytes!");
    temp.push(this[i]);
  }

  for (var i=targetstart; i<targetstart+temp.length; i++) {
    target[i] = temp[i-targetstart];
  }
};

SlowBuffer.prototype.fill = function(value, start, end) {
  if (end > this.length) {
    throw new Error('oob');
  }
  if (start > end) {
    throw new Error('oob');
  }

  for (var i = start; i < end; i++) {
    this[i] = value;
  }
}

function coerce(length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length);
  return length < 0 ? 0 : length;
}


// Buffer

function Buffer(subject, encoding, offset) {
  if (!(this instanceof Buffer)) {
    return new Buffer(subject, encoding, offset);
  }

  var type;

  // Are we slicing?
  if (typeof offset === 'number') {
    this.length = coerce(encoding);
    this.parent = subject;
    this.offset = offset;
  } else {
    // Find the length
    switch (type = typeof subject) {
      case 'number':
        this.length = coerce(subject);
        break;

      case 'string':
        this.length = Buffer.byteLength(subject, encoding);
        break;

      case 'object': // Assume object is an array
        this.length = coerce(subject.length);
        break;

      default:
        throw new Error('First argument needs to be a number, ' +
                        'array or string.');
    }

    if (this.length > Buffer.poolSize) {
      // Big buffer, just alloc one.
      this.parent = new SlowBuffer(this.length);
      this.offset = 0;

    } else {
      // Small buffer.
      if (!pool || pool.length - pool.used < this.length) allocPool();
      this.parent = pool;
      this.offset = pool.used;
      pool.used += this.length;
    }

    // Treat array-ish objects as a byte array.
    if (isArrayIsh(subject)) {
      for (var i = 0; i < this.length; i++) {
        if (subject instanceof Buffer) {
          this.parent[i + this.offset] = subject.readUInt8(i);
        }
        else {
          this.parent[i + this.offset] = subject[i];
        }
      }
    } else if (type == 'string') {
      // We are a string
      this.length = this.write(subject, 0, encoding);
    }
  }

}

function isArrayIsh(subject) {
  return Array.isArray(subject) || Buffer.isBuffer(subject) ||
         subject && typeof subject === 'object' &&
         typeof subject.length === 'number';
}

exports.SlowBuffer = SlowBuffer;
exports.Buffer = Buffer;

Buffer.poolSize = 8 * 1024;
var pool;

function allocPool() {
  pool = new SlowBuffer(Buffer.poolSize);
  pool.used = 0;
}


// Static methods
Buffer.isBuffer = function isBuffer(b) {
  return b instanceof Buffer || b instanceof SlowBuffer;
};

Buffer.concat = function (list, totalLength) {
  if (!Array.isArray(list)) {
    throw new Error("Usage: Buffer.concat(list, [totalLength])\n \
      list should be an Array.");
  }

  if (list.length === 0) {
    return new Buffer(0);
  } else if (list.length === 1) {
    return list[0];
  }

  if (typeof totalLength !== 'number') {
    totalLength = 0;
    for (var i = 0; i < list.length; i++) {
      var buf = list[i];
      totalLength += buf.length;
    }
  }

  var buffer = new Buffer(totalLength);
  var pos = 0;
  for (var i = 0; i < list.length; i++) {
    var buf = list[i];
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer;
};

// Inspect
Buffer.prototype.inspect = function inspect() {
  var out = [],
      len = this.length;

  for (var i = 0; i < len; i++) {
    out[i] = toHex(this.parent[i + this.offset]);
    if (i == exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...';
      break;
    }
  }

  return '<Buffer ' + out.join(' ') + '>';
};


Buffer.prototype.get = function get(i) {
  if (i < 0 || i >= this.length) throw new Error('oob');
  return this.parent[this.offset + i];
};


Buffer.prototype.set = function set(i, v) {
  if (i < 0 || i >= this.length) throw new Error('oob');
  return this.parent[this.offset + i] = v;
};


// write(string, offset = 0, length = buffer.length-offset, encoding = 'utf8')
Buffer.prototype.write = function(string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length;
      length = undefined;
    }
  } else {  // legacy
    var swap = encoding;
    encoding = offset;
    offset = length;
    length = swap;
  }

  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase();

  var ret;
  switch (encoding) {
    case 'hex':
      ret = this.parent.hexWrite(string, this.offset + offset, length);
      break;

    case 'utf8':
    case 'utf-8':
      ret = this.parent.utf8Write(string, this.offset + offset, length);
      break;

    case 'ascii':
      ret = this.parent.asciiWrite(string, this.offset + offset, length);
      break;

    case 'binary':
      ret = this.parent.binaryWrite(string, this.offset + offset, length);
      break;

    case 'base64':
      // Warning: maxLength not taken into account in base64Write
      ret = this.parent.base64Write(string, this.offset + offset, length);
      break;

    case 'ucs2':
    case 'ucs-2':
      ret = this.parent.ucs2Write(string, this.offset + offset, length);
      break;

    default:
      throw new Error('Unknown encoding');
  }

  Buffer._charsWritten = SlowBuffer._charsWritten;

  return ret;
};


// toString(encoding, start=0, end=buffer.length)
Buffer.prototype.toString = function(encoding, start, end) {
  encoding = String(encoding || 'utf8').toLowerCase();

  if (typeof start == 'undefined' || start < 0) {
    start = 0;
  } else if (start > this.length) {
    start = this.length;
  }

  if (typeof end == 'undefined' || end > this.length) {
    end = this.length;
  } else if (end < 0) {
    end = 0;
  }

  start = start + this.offset;
  end = end + this.offset;

  switch (encoding) {
    case 'hex':
      return this.parent.hexSlice(start, end);

    case 'utf8':
    case 'utf-8':
      return this.parent.utf8Slice(start, end);

    case 'ascii':
      return this.parent.asciiSlice(start, end);

    case 'binary':
      return this.parent.binarySlice(start, end);

    case 'base64':
      return this.parent.base64Slice(start, end);

    case 'ucs2':
    case 'ucs-2':
      return this.parent.ucs2Slice(start, end);

    default:
      throw new Error('Unknown encoding');
  }
};


// byteLength
Buffer.byteLength = SlowBuffer.byteLength;


// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill(value, start, end) {
  value || (value = 0);
  start || (start = 0);
  end || (end = this.length);

  if (typeof value === 'string') {
    value = value.charCodeAt(0);
  }
  if (!(typeof value === 'number') || isNaN(value)) {
    throw new Error('value is not a number');
  }

  if (end < start) throw new Error('end < start');

  // Fill 0 bytes; we're done
  if (end === start) return 0;
  if (this.length == 0) return 0;

  if (start < 0 || start >= this.length) {
    throw new Error('start out of bounds');
  }

  if (end < 0 || end > this.length) {
    throw new Error('end out of bounds');
  }

  return this.parent.fill(value,
                          start + this.offset,
                          end + this.offset);
};


// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function(target, target_start, start, end) {
  var source = this;
  start || (start = 0);
  end || (end = this.length);
  target_start || (target_start = 0);

  if (end < start) throw new Error('sourceEnd < sourceStart');

  // Copy 0 bytes; we're done
  if (end === start) return 0;
  if (target.length == 0 || source.length == 0) return 0;

  if (target_start < 0 || target_start >= target.length) {
    throw new Error('targetStart out of bounds');
  }

  if (start < 0 || start >= source.length) {
    throw new Error('sourceStart out of bounds');
  }

  if (end < 0 || end > source.length) {
    throw new Error('sourceEnd out of bounds');
  }

  // Are we oob?
  if (end > this.length) {
    end = this.length;
  }

  if (target.length - target_start < end - start) {
    end = target.length - target_start + start;
  }

  return this.parent.copy(target.parent,
                          target_start + target.offset,
                          start + this.offset,
                          end + this.offset);
};


// slice(start, end)
Buffer.prototype.slice = function(start, end) {
  if (end === undefined) end = this.length;
  if (end > this.length) throw new Error('oob');
  if (start > end) throw new Error('oob');

  return new Buffer(this.parent, end - start, +start + this.offset);
};


// Legacy methods for backwards compatibility.

Buffer.prototype.utf8Slice = function(start, end) {
  return this.toString('utf8', start, end);
};

Buffer.prototype.binarySlice = function(start, end) {
  return this.toString('binary', start, end);
};

Buffer.prototype.asciiSlice = function(start, end) {
  return this.toString('ascii', start, end);
};

Buffer.prototype.utf8Write = function(string, offset) {
  return this.write(string, offset, 'utf8');
};

Buffer.prototype.binaryWrite = function(string, offset) {
  return this.write(string, offset, 'binary');
};

Buffer.prototype.asciiWrite = function(string, offset) {
  return this.write(string, offset, 'ascii');
};

Buffer.prototype.readUInt8 = function(offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (offset >= buffer.length) return;

  return buffer.parent[buffer.offset + offset];
};

function readUInt16(buffer, offset, isBigEndian, noAssert) {
  var val = 0;


  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (offset >= buffer.length) return 0;

  if (isBigEndian) {
    val = buffer.parent[buffer.offset + offset] << 8;
    if (offset + 1 < buffer.length) {
      val |= buffer.parent[buffer.offset + offset + 1];
    }
  } else {
    val = buffer.parent[buffer.offset + offset];
    if (offset + 1 < buffer.length) {
      val |= buffer.parent[buffer.offset + offset + 1] << 8;
    }
  }

  return val;
}

Buffer.prototype.readUInt16LE = function(offset, noAssert) {
  return readUInt16(this, offset, false, noAssert);
};

Buffer.prototype.readUInt16BE = function(offset, noAssert) {
  return readUInt16(this, offset, true, noAssert);
};

function readUInt32(buffer, offset, isBigEndian, noAssert) {
  var val = 0;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (offset >= buffer.length) return 0;

  if (isBigEndian) {
    if (offset + 1 < buffer.length)
      val = buffer.parent[buffer.offset + offset + 1] << 16;
    if (offset + 2 < buffer.length)
      val |= buffer.parent[buffer.offset + offset + 2] << 8;
    if (offset + 3 < buffer.length)
      val |= buffer.parent[buffer.offset + offset + 3];
    val = val + (buffer.parent[buffer.offset + offset] << 24 >>> 0);
  } else {
    if (offset + 2 < buffer.length)
      val = buffer.parent[buffer.offset + offset + 2] << 16;
    if (offset + 1 < buffer.length)
      val |= buffer.parent[buffer.offset + offset + 1] << 8;
    val |= buffer.parent[buffer.offset + offset];
    if (offset + 3 < buffer.length)
      val = val + (buffer.parent[buffer.offset + offset + 3] << 24 >>> 0);
  }

  return val;
}

Buffer.prototype.readUInt32LE = function(offset, noAssert) {
  return readUInt32(this, offset, false, noAssert);
};

Buffer.prototype.readUInt32BE = function(offset, noAssert) {
  return readUInt32(this, offset, true, noAssert);
};


/*
 * Signed integer types, yay team! A reminder on how two's complement actually
 * works. The first bit is the signed bit, i.e. tells us whether or not the
 * number should be positive or negative. If the two's complement value is
 * positive, then we're done, as it's equivalent to the unsigned representation.
 *
 * Now if the number is positive, you're pretty much done, you can just leverage
 * the unsigned translations and return those. Unfortunately, negative numbers
 * aren't quite that straightforward.
 *
 * At first glance, one might be inclined to use the traditional formula to
 * translate binary numbers between the positive and negative values in two's
 * complement. (Though it doesn't quite work for the most negative value)
 * Mainly:
 *  - invert all the bits
 *  - add one to the result
 *
 * Of course, this doesn't quite work in Javascript. Take for example the value
 * of -128. This could be represented in 16 bits (big-endian) as 0xff80. But of
 * course, Javascript will do the following:
 *
 * > ~0xff80
 * -65409
 *
 * Whoh there, Javascript, that's not quite right. But wait, according to
 * Javascript that's perfectly correct. When Javascript ends up seeing the
 * constant 0xff80, it has no notion that it is actually a signed number. It
 * assumes that we've input the unsigned value 0xff80. Thus, when it does the
 * binary negation, it casts it into a signed value, (positive 0xff80). Then
 * when you perform binary negation on that, it turns it into a negative number.
 *
 * Instead, we're going to have to use the following general formula, that works
 * in a rather Javascript friendly way. I'm glad we don't support this kind of
 * weird numbering scheme in the kernel.
 *
 * (BIT-MAX - (unsigned)val + 1) * -1
 *
 * The astute observer, may think that this doesn't make sense for 8-bit numbers
 * (really it isn't necessary for them). However, when you get 16-bit numbers,
 * you do. Let's go back to our prior example and see how this will look:
 *
 * (0xffff - 0xff80 + 1) * -1
 * (0x007f + 1) * -1
 * (0x0080) * -1
 */
Buffer.prototype.readInt8 = function(offset, noAssert) {
  var buffer = this;
  var neg;

  if (!noAssert) {
    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (offset >= buffer.length) return;

  neg = buffer.parent[buffer.offset + offset] & 0x80;
  if (!neg) {
    return (buffer.parent[buffer.offset + offset]);
  }

  return ((0xff - buffer.parent[buffer.offset + offset] + 1) * -1);
};

function readInt16(buffer, offset, isBigEndian, noAssert) {
  var neg, val;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to read beyond buffer length');
  }

  val = readUInt16(buffer, offset, isBigEndian, noAssert);
  neg = val & 0x8000;
  if (!neg) {
    return val;
  }

  return (0xffff - val + 1) * -1;
}

Buffer.prototype.readInt16LE = function(offset, noAssert) {
  return readInt16(this, offset, false, noAssert);
};

Buffer.prototype.readInt16BE = function(offset, noAssert) {
  return readInt16(this, offset, true, noAssert);
};

function readInt32(buffer, offset, isBigEndian, noAssert) {
  var neg, val;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  val = readUInt32(buffer, offset, isBigEndian, noAssert);
  neg = val & 0x80000000;
  if (!neg) {
    return (val);
  }

  return (0xffffffff - val + 1) * -1;
}

Buffer.prototype.readInt32LE = function(offset, noAssert) {
  return readInt32(this, offset, false, noAssert);
};

Buffer.prototype.readInt32BE = function(offset, noAssert) {
  return readInt32(this, offset, true, noAssert);
};

function readFloat(buffer, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  return require('./buffer_ieee754').readIEEE754(buffer, offset, isBigEndian,
      23, 4);
}

Buffer.prototype.readFloatLE = function(offset, noAssert) {
  return readFloat(this, offset, false, noAssert);
};

Buffer.prototype.readFloatBE = function(offset, noAssert) {
  return readFloat(this, offset, true, noAssert);
};

function readDouble(buffer, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset + 7 < buffer.length,
        'Trying to read beyond buffer length');
  }

  return require('./buffer_ieee754').readIEEE754(buffer, offset, isBigEndian,
      52, 8);
}

Buffer.prototype.readDoubleLE = function(offset, noAssert) {
  return readDouble(this, offset, false, noAssert);
};

Buffer.prototype.readDoubleBE = function(offset, noAssert) {
  return readDouble(this, offset, true, noAssert);
};


/*
 * We have to make sure that the value is a valid integer. This means that it is
 * non-negative. It has no fractional component and that it does not exceed the
 * maximum allowed value.
 *
 *      value           The number to check for validity
 *
 *      max             The maximum value
 */
function verifuint(value, max) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value >= 0,
      'specified a negative value for writing an unsigned value');

  assert.ok(value <= max, 'value is larger than maximum value for type');

  assert.ok(Math.floor(value) === value, 'value has a fractional component');
}

Buffer.prototype.writeUInt8 = function(value, offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xff);
  }

  if (offset < buffer.length) {
    buffer.parent[buffer.offset + offset] = value;
  }
};

function writeUInt16(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xffff);
  }

  for (var i = 0; i < Math.min(buffer.length - offset, 2); i++) {
    buffer.parent[buffer.offset + offset + i] =
        (value & (0xff << (8 * (isBigEndian ? 1 - i : i)))) >>>
            (isBigEndian ? 1 - i : i) * 8;
  }

}

Buffer.prototype.writeUInt16LE = function(value, offset, noAssert) {
  writeUInt16(this, value, offset, false, noAssert);
};

Buffer.prototype.writeUInt16BE = function(value, offset, noAssert) {
  writeUInt16(this, value, offset, true, noAssert);
};

function writeUInt32(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xffffffff);
  }

  for (var i = 0; i < Math.min(buffer.length - offset, 4); i++) {
    buffer.parent[buffer.offset + offset + i] =
        (value >>> (isBigEndian ? 3 - i : i) * 8) & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function(value, offset, noAssert) {
  writeUInt32(this, value, offset, false, noAssert);
};

Buffer.prototype.writeUInt32BE = function(value, offset, noAssert) {
  writeUInt32(this, value, offset, true, noAssert);
};


/*
 * We now move onto our friends in the signed number category. Unlike unsigned
 * numbers, we're going to have to worry a bit more about how we put values into
 * arrays. Since we are only worrying about signed 32-bit values, we're in
 * slightly better shape. Unfortunately, we really can't do our favorite binary
 * & in this system. It really seems to do the wrong thing. For example:
 *
 * > -32 & 0xff
 * 224
 *
 * What's happening above is really: 0xe0 & 0xff = 0xe0. However, the results of
 * this aren't treated as a signed number. Ultimately a bad thing.
 *
 * What we're going to want to do is basically create the unsigned equivalent of
 * our representation and pass that off to the wuint* functions. To do that
 * we're going to do the following:
 *
 *  - if the value is positive
 *      we can pass it directly off to the equivalent wuint
 *  - if the value is negative
 *      we do the following computation:
 *         mb + val + 1, where
 *         mb   is the maximum unsigned value in that byte size
 *         val  is the Javascript negative integer
 *
 *
 * As a concrete value, take -128. In signed 16 bits this would be 0xff80. If
 * you do out the computations:
 *
 * 0xffff - 128 + 1
 * 0xffff - 127
 * 0xff80
 *
 * You can then encode this value as the signed version. This is really rather
 * hacky, but it should work and get the job done which is our goal here.
 */

/*
 * A series of checks to make sure we actually have a signed 32-bit number
 */
function verifsint(value, max, min) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value <= max, 'value larger than maximum allowed value');

  assert.ok(value >= min, 'value smaller than minimum allowed value');

  assert.ok(Math.floor(value) === value, 'value has a fractional component');
}

function verifIEEE754(value, max, min) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value <= max, 'value larger than maximum allowed value');

  assert.ok(value >= min, 'value smaller than minimum allowed value');
}

Buffer.prototype.writeInt8 = function(value, offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7f, -0x80);
  }

  if (value >= 0) {
    buffer.writeUInt8(value, offset, noAssert);
  } else {
    buffer.writeUInt8(0xff + value + 1, offset, noAssert);
  }
};

function writeInt16(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7fff, -0x8000);
  }

  if (value >= 0) {
    writeUInt16(buffer, value, offset, isBigEndian, noAssert);
  } else {
    writeUInt16(buffer, 0xffff + value + 1, offset, isBigEndian, noAssert);
  }
}

Buffer.prototype.writeInt16LE = function(value, offset, noAssert) {
  writeInt16(this, value, offset, false, noAssert);
};

Buffer.prototype.writeInt16BE = function(value, offset, noAssert) {
  writeInt16(this, value, offset, true, noAssert);
};

function writeInt32(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7fffffff, -0x80000000);
  }

  if (value >= 0) {
    writeUInt32(buffer, value, offset, isBigEndian, noAssert);
  } else {
    writeUInt32(buffer, 0xffffffff + value + 1, offset, isBigEndian, noAssert);
  }
}

Buffer.prototype.writeInt32LE = function(value, offset, noAssert) {
  writeInt32(this, value, offset, false, noAssert);
};

Buffer.prototype.writeInt32BE = function(value, offset, noAssert) {
  writeInt32(this, value, offset, true, noAssert);
};

function writeFloat(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to write beyond buffer length');

    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38);
  }

  require('./buffer_ieee754').writeIEEE754(buffer, value, offset, isBigEndian,
      23, 4);
}

Buffer.prototype.writeFloatLE = function(value, offset, noAssert) {
  writeFloat(this, value, offset, false, noAssert);
};

Buffer.prototype.writeFloatBE = function(value, offset, noAssert) {
  writeFloat(this, value, offset, true, noAssert);
};

function writeDouble(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 7 < buffer.length,
        'Trying to write beyond buffer length');

    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308);
  }

  require('./buffer_ieee754').writeIEEE754(buffer, value, offset, isBigEndian,
      52, 8);
}

Buffer.prototype.writeDoubleLE = function(value, offset, noAssert) {
  writeDouble(this, value, offset, false, noAssert);
};

Buffer.prototype.writeDoubleBE = function(value, offset, noAssert) {
  writeDouble(this, value, offset, true, noAssert);
};

SlowBuffer.prototype.readUInt8 = Buffer.prototype.readUInt8;
SlowBuffer.prototype.readUInt16LE = Buffer.prototype.readUInt16LE;
SlowBuffer.prototype.readUInt16BE = Buffer.prototype.readUInt16BE;
SlowBuffer.prototype.readUInt32LE = Buffer.prototype.readUInt32LE;
SlowBuffer.prototype.readUInt32BE = Buffer.prototype.readUInt32BE;
SlowBuffer.prototype.readInt8 = Buffer.prototype.readInt8;
SlowBuffer.prototype.readInt16LE = Buffer.prototype.readInt16LE;
SlowBuffer.prototype.readInt16BE = Buffer.prototype.readInt16BE;
SlowBuffer.prototype.readInt32LE = Buffer.prototype.readInt32LE;
SlowBuffer.prototype.readInt32BE = Buffer.prototype.readInt32BE;
SlowBuffer.prototype.readFloatLE = Buffer.prototype.readFloatLE;
SlowBuffer.prototype.readFloatBE = Buffer.prototype.readFloatBE;
SlowBuffer.prototype.readDoubleLE = Buffer.prototype.readDoubleLE;
SlowBuffer.prototype.readDoubleBE = Buffer.prototype.readDoubleBE;
SlowBuffer.prototype.writeUInt8 = Buffer.prototype.writeUInt8;
SlowBuffer.prototype.writeUInt16LE = Buffer.prototype.writeUInt16LE;
SlowBuffer.prototype.writeUInt16BE = Buffer.prototype.writeUInt16BE;
SlowBuffer.prototype.writeUInt32LE = Buffer.prototype.writeUInt32LE;
SlowBuffer.prototype.writeUInt32BE = Buffer.prototype.writeUInt32BE;
SlowBuffer.prototype.writeInt8 = Buffer.prototype.writeInt8;
SlowBuffer.prototype.writeInt16LE = Buffer.prototype.writeInt16LE;
SlowBuffer.prototype.writeInt16BE = Buffer.prototype.writeInt16BE;
SlowBuffer.prototype.writeInt32LE = Buffer.prototype.writeInt32LE;
SlowBuffer.prototype.writeInt32BE = Buffer.prototype.writeInt32BE;
SlowBuffer.prototype.writeFloatLE = Buffer.prototype.writeFloatLE;
SlowBuffer.prototype.writeFloatBE = Buffer.prototype.writeFloatBE;
SlowBuffer.prototype.writeDoubleLE = Buffer.prototype.writeDoubleLE;
SlowBuffer.prototype.writeDoubleBE = Buffer.prototype.writeDoubleBE;

})()
},{"assert":2,"./buffer_ieee754":1,"base64-js":5}],3:[function(require,module,exports){
var events = require('events');

exports.isArray = isArray;
exports.isDate = function(obj){return Object.prototype.toString.call(obj) === '[object Date]'};
exports.isRegExp = function(obj){return Object.prototype.toString.call(obj) === '[object RegExp]'};


exports.print = function () {};
exports.puts = function () {};
exports.debug = function() {};

exports.inspect = function(obj, showHidden, depth, colors) {
  var seen = [];

  var stylize = function(str, styleType) {
    // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
    var styles =
        { 'bold' : [1, 22],
          'italic' : [3, 23],
          'underline' : [4, 24],
          'inverse' : [7, 27],
          'white' : [37, 39],
          'grey' : [90, 39],
          'black' : [30, 39],
          'blue' : [34, 39],
          'cyan' : [36, 39],
          'green' : [32, 39],
          'magenta' : [35, 39],
          'red' : [31, 39],
          'yellow' : [33, 39] };

    var style =
        { 'special': 'cyan',
          'number': 'blue',
          'boolean': 'yellow',
          'undefined': 'grey',
          'null': 'bold',
          'string': 'green',
          'date': 'magenta',
          // "name": intentionally not styling
          'regexp': 'red' }[styleType];

    if (style) {
      return '\033[' + styles[style][0] + 'm' + str +
             '\033[' + styles[style][1] + 'm';
    } else {
      return str;
    }
  };
  if (! colors) {
    stylize = function(str, styleType) { return str; };
  }

  function format(value, recurseTimes) {
    // Provide a hook for user-specified inspect functions.
    // Check that value is an object with an inspect function on it
    if (value && typeof value.inspect === 'function' &&
        // Filter out the util module, it's inspect function is special
        value !== exports &&
        // Also filter out any prototype objects using the circular check.
        !(value.constructor && value.constructor.prototype === value)) {
      return value.inspect(recurseTimes);
    }

    // Primitive types cannot have properties
    switch (typeof value) {
      case 'undefined':
        return stylize('undefined', 'undefined');

      case 'string':
        var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                                 .replace(/'/g, "\\'")
                                                 .replace(/\\"/g, '"') + '\'';
        return stylize(simple, 'string');

      case 'number':
        return stylize('' + value, 'number');

      case 'boolean':
        return stylize('' + value, 'boolean');
    }
    // For some reason typeof null is "object", so special case here.
    if (value === null) {
      return stylize('null', 'null');
    }

    // Look up the keys of the object.
    var visible_keys = Object_keys(value);
    var keys = showHidden ? Object_getOwnPropertyNames(value) : visible_keys;

    // Functions without properties can be shortcutted.
    if (typeof value === 'function' && keys.length === 0) {
      if (isRegExp(value)) {
        return stylize('' + value, 'regexp');
      } else {
        var name = value.name ? ': ' + value.name : '';
        return stylize('[Function' + name + ']', 'special');
      }
    }

    // Dates without properties can be shortcutted
    if (isDate(value) && keys.length === 0) {
      return stylize(value.toUTCString(), 'date');
    }

    var base, type, braces;
    // Determine the object type
    if (isArray(value)) {
      type = 'Array';
      braces = ['[', ']'];
    } else {
      type = 'Object';
      braces = ['{', '}'];
    }

    // Make functions say that they are functions
    if (typeof value === 'function') {
      var n = value.name ? ': ' + value.name : '';
      base = (isRegExp(value)) ? ' ' + value : ' [Function' + n + ']';
    } else {
      base = '';
    }

    // Make dates with properties first say the date
    if (isDate(value)) {
      base = ' ' + value.toUTCString();
    }

    if (keys.length === 0) {
      return braces[0] + base + braces[1];
    }

    if (recurseTimes < 0) {
      if (isRegExp(value)) {
        return stylize('' + value, 'regexp');
      } else {
        return stylize('[Object]', 'special');
      }
    }

    seen.push(value);

    var output = keys.map(function(key) {
      var name, str;
      if (value.__lookupGetter__) {
        if (value.__lookupGetter__(key)) {
          if (value.__lookupSetter__(key)) {
            str = stylize('[Getter/Setter]', 'special');
          } else {
            str = stylize('[Getter]', 'special');
          }
        } else {
          if (value.__lookupSetter__(key)) {
            str = stylize('[Setter]', 'special');
          }
        }
      }
      if (visible_keys.indexOf(key) < 0) {
        name = '[' + key + ']';
      }
      if (!str) {
        if (seen.indexOf(value[key]) < 0) {
          if (recurseTimes === null) {
            str = format(value[key]);
          } else {
            str = format(value[key], recurseTimes - 1);
          }
          if (str.indexOf('\n') > -1) {
            if (isArray(value)) {
              str = str.split('\n').map(function(line) {
                return '  ' + line;
              }).join('\n').substr(2);
            } else {
              str = '\n' + str.split('\n').map(function(line) {
                return '   ' + line;
              }).join('\n');
            }
          }
        } else {
          str = stylize('[Circular]', 'special');
        }
      }
      if (typeof name === 'undefined') {
        if (type === 'Array' && key.match(/^\d+$/)) {
          return str;
        }
        name = JSON.stringify('' + key);
        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
          name = name.substr(1, name.length - 2);
          name = stylize(name, 'name');
        } else {
          name = name.replace(/'/g, "\\'")
                     .replace(/\\"/g, '"')
                     .replace(/(^"|"$)/g, "'");
          name = stylize(name, 'string');
        }
      }

      return name + ': ' + str;
    });

    seen.pop();

    var numLinesEst = 0;
    var length = output.reduce(function(prev, cur) {
      numLinesEst++;
      if (cur.indexOf('\n') >= 0) numLinesEst++;
      return prev + cur.length + 1;
    }, 0);

    if (length > 50) {
      output = braces[0] +
               (base === '' ? '' : base + '\n ') +
               ' ' +
               output.join(',\n  ') +
               ' ' +
               braces[1];

    } else {
      output = braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
    }

    return output;
  }
  return format(obj, (typeof depth === 'undefined' ? 2 : depth));
};


function isArray(ar) {
  return ar instanceof Array ||
         Array.isArray(ar) ||
         (ar && ar !== Object.prototype && isArray(ar.__proto__));
}


function isRegExp(re) {
  return re instanceof RegExp ||
    (typeof re === 'object' && Object.prototype.toString.call(re) === '[object RegExp]');
}


function isDate(d) {
  if (d instanceof Date) return true;
  if (typeof d !== 'object') return false;
  var properties = Date.prototype && Object_getOwnPropertyNames(Date.prototype);
  var proto = d.__proto__ && Object_getOwnPropertyNames(d.__proto__);
  return JSON.stringify(proto) === JSON.stringify(properties);
}

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}

exports.log = function (msg) {};

exports.pump = null;

var Object_keys = Object.keys || function (obj) {
    var res = [];
    for (var key in obj) res.push(key);
    return res;
};

var Object_getOwnPropertyNames = Object.getOwnPropertyNames || function (obj) {
    var res = [];
    for (var key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) res.push(key);
    }
    return res;
};

var Object_create = Object.create || function (prototype, properties) {
    // from es5-shim
    var object;
    if (prototype === null) {
        object = { '__proto__' : null };
    }
    else {
        if (typeof prototype !== 'object') {
            throw new TypeError(
                'typeof prototype[' + (typeof prototype) + '] != \'object\''
            );
        }
        var Type = function () {};
        Type.prototype = prototype;
        object = new Type();
        object.__proto__ = prototype;
    }
    if (typeof properties !== 'undefined' && Object.defineProperties) {
        Object.defineProperties(object, properties);
    }
    return object;
};

exports.inherits = function(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object_create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
};

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (typeof f !== 'string') {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(exports.inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j': return JSON.stringify(args[i++]);
      default:
        return x;
    }
  });
  for(var x = args[i]; i < len; x = args[++i]){
    if (x === null || typeof x !== 'object') {
      str += ' ' + x;
    } else {
      str += ' ' + exports.inspect(x);
    }
  }
  return str;
};

},{"events":6}],5:[function(require,module,exports){
(function (exports) {
	'use strict';

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	function b64ToByteArray(b64) {
		var i, j, l, tmp, placeHolders, arr;
	
		if (b64.length % 4 > 0) {
			throw 'Invalid string. Length must be a multiple of 4';
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		placeHolders = b64.indexOf('=');
		placeHolders = placeHolders > 0 ? b64.length - placeHolders : 0;

		// base64 is 4/3 + up to two characters of the original data
		arr = [];//new Uint8Array(b64.length * 3 / 4 - placeHolders);

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length;

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (lookup.indexOf(b64[i]) << 18) | (lookup.indexOf(b64[i + 1]) << 12) | (lookup.indexOf(b64[i + 2]) << 6) | lookup.indexOf(b64[i + 3]);
			arr.push((tmp & 0xFF0000) >> 16);
			arr.push((tmp & 0xFF00) >> 8);
			arr.push(tmp & 0xFF);
		}

		if (placeHolders === 2) {
			tmp = (lookup.indexOf(b64[i]) << 2) | (lookup.indexOf(b64[i + 1]) >> 4);
			arr.push(tmp & 0xFF);
		} else if (placeHolders === 1) {
			tmp = (lookup.indexOf(b64[i]) << 10) | (lookup.indexOf(b64[i + 1]) << 4) | (lookup.indexOf(b64[i + 2]) >> 2);
			arr.push((tmp >> 8) & 0xFF);
			arr.push(tmp & 0xFF);
		}

		return arr;
	}

	function uint8ToBase64(uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length;

		function tripletToBase64 (num) {
			return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
		};

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
			output += tripletToBase64(temp);
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1];
				output += lookup[temp >> 2];
				output += lookup[(temp << 4) & 0x3F];
				output += '==';
				break;
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1]);
				output += lookup[temp >> 10];
				output += lookup[(temp >> 4) & 0x3F];
				output += lookup[(temp << 2) & 0x3F];
				output += '=';
				break;
		}

		return output;
	}

	module.exports.toByteArray = b64ToByteArray;
	module.exports.fromByteArray = uint8ToBase64;
}());

},{}],7:[function(require,module,exports){
exports.readIEEE754 = function(buffer, offset, isBE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isBE ? 0 : (nBytes - 1),
      d = isBE ? 1 : -1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.writeIEEE754 = function(buffer, value, offset, isBE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isBE ? (nBytes - 1) : 0,
      d = isBE ? -1 : 1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

},{}],8:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],6:[function(require,module,exports){
(function(process){if (!process.EventEmitter) process.EventEmitter = function () {};

var EventEmitter = exports.EventEmitter = process.EventEmitter;
var isArray = typeof Array.isArray === 'function'
    ? Array.isArray
    : function (xs) {
        return Object.prototype.toString.call(xs) === '[object Array]'
    }
;
function indexOf (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0; i < xs.length; i++) {
        if (x === xs[i]) return i;
    }
    return -1;
}

// By default EventEmitters will print a warning if more than
// 10 listeners are added to it. This is a useful default which
// helps finding memory leaks.
//
// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
var defaultMaxListeners = 10;
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!this._events) this._events = {};
  this._events.maxListeners = n;
};


EventEmitter.prototype.emit = function(type) {
  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events || !this._events.error ||
        (isArray(this._events.error) && !this._events.error.length))
    {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }
  }

  if (!this._events) return false;
  var handler = this._events[type];
  if (!handler) return false;

  if (typeof handler == 'function') {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        var args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
    return true;

  } else if (isArray(handler)) {
    var args = Array.prototype.slice.call(arguments, 1);

    var listeners = handler.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;

  } else {
    return false;
  }
};

// EventEmitter is defined in src/node_events.cc
// EventEmitter.prototype.emit() is also defined there.
EventEmitter.prototype.addListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('addListener only takes instances of Function');
  }

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type == "newListeners"! Before
  // adding it to the listeners, first emit "newListeners".
  this.emit('newListener', type, listener);

  if (!this._events[type]) {
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  } else if (isArray(this._events[type])) {

    // Check for listener leak
    if (!this._events[type].warned) {
      var m;
      if (this._events.maxListeners !== undefined) {
        m = this._events.maxListeners;
      } else {
        m = defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;
        console.error('(node) warning: possible EventEmitter memory ' +
                      'leak detected. %d listeners added. ' +
                      'Use emitter.setMaxListeners() to increase limit.',
                      this._events[type].length);
        console.trace();
      }
    }

    // If we've already got an array, just append.
    this._events[type].push(listener);
  } else {
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  var self = this;
  self.on(type, function g() {
    self.removeListener(type, g);
    listener.apply(this, arguments);
  });

  return this;
};

EventEmitter.prototype.removeListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('removeListener only takes instances of Function');
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (!this._events || !this._events[type]) return this;

  var list = this._events[type];

  if (isArray(list)) {
    var i = indexOf(list, listener);
    if (i < 0) return this;
    list.splice(i, 1);
    if (list.length == 0)
      delete this._events[type];
  } else if (this._events[type] === listener) {
    delete this._events[type];
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  if (arguments.length === 0) {
    this._events = {};
    return this;
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (type && this._events && this._events[type]) this._events[type] = null;
  return this;
};

EventEmitter.prototype.listeners = function(type) {
  if (!this._events) this._events = {};
  if (!this._events[type]) this._events[type] = [];
  if (!isArray(this._events[type])) {
    this._events[type] = [this._events[type]];
  }
  return this._events[type];
};

})(require("__browserify_process"))
},{"__browserify_process":8}],4:[function(require,module,exports){
(function(){function SlowBuffer (size) {
    this.length = size;
};

var assert = require('assert');

exports.INSPECT_MAX_BYTES = 50;


function toHex(n) {
  if (n < 16) return '0' + n.toString(16);
  return n.toString(16);
}

function utf8ToBytes(str) {
  var byteArray = [];
  for (var i = 0; i < str.length; i++)
    if (str.charCodeAt(i) <= 0x7F)
      byteArray.push(str.charCodeAt(i));
    else {
      var h = encodeURIComponent(str.charAt(i)).substr(1).split('%');
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16));
    }

  return byteArray;
}

function asciiToBytes(str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++ )
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push( str.charCodeAt(i) & 0xFF );

  return byteArray;
}

function base64ToBytes(str) {
  return require("base64-js").toByteArray(str);
}

SlowBuffer.byteLength = function (str, encoding) {
  switch (encoding || "utf8") {
    case 'hex':
      return str.length / 2;

    case 'utf8':
    case 'utf-8':
      return utf8ToBytes(str).length;

    case 'ascii':
      return str.length;

    case 'base64':
      return base64ToBytes(str).length;

    default:
      throw new Error('Unknown encoding');
  }
};

function blitBuffer(src, dst, offset, length) {
  var pos, i = 0;
  while (i < length) {
    if ((i+offset >= dst.length) || (i >= src.length))
      break;

    dst[i + offset] = src[i];
    i++;
  }
  return i;
}

SlowBuffer.prototype.utf8Write = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten =  blitBuffer(utf8ToBytes(string), this, offset, length);
};

SlowBuffer.prototype.asciiWrite = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten =  blitBuffer(asciiToBytes(string), this, offset, length);
};

SlowBuffer.prototype.base64Write = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten = blitBuffer(base64ToBytes(string), this, offset, length);
};

SlowBuffer.prototype.base64Slice = function (start, end) {
  var bytes = Array.prototype.slice.apply(this, arguments)
  return require("base64-js").fromByteArray(bytes);
}

function decodeUtf8Char(str) {
  try {
    return decodeURIComponent(str);
  } catch (err) {
    return String.fromCharCode(0xFFFD); // UTF 8 invalid char
  }
}

SlowBuffer.prototype.utf8Slice = function () {
  var bytes = Array.prototype.slice.apply(this, arguments);
  var res = "";
  var tmp = "";
  var i = 0;
  while (i < bytes.length) {
    if (bytes[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(bytes[i]);
      tmp = "";
    } else
      tmp += "%" + bytes[i].toString(16);

    i++;
  }

  return res + decodeUtf8Char(tmp);
}

SlowBuffer.prototype.asciiSlice = function () {
  var bytes = Array.prototype.slice.apply(this, arguments);
  var ret = "";
  for (var i = 0; i < bytes.length; i++)
    ret += String.fromCharCode(bytes[i]);
  return ret;
}

SlowBuffer.prototype.inspect = function() {
  var out = [],
      len = this.length;
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i]);
    if (i == exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...';
      break;
    }
  }
  return '<SlowBuffer ' + out.join(' ') + '>';
};


SlowBuffer.prototype.hexSlice = function(start, end) {
  var len = this.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; i++) {
    out += toHex(this[i]);
  }
  return out;
};


SlowBuffer.prototype.toString = function(encoding, start, end) {
  encoding = String(encoding || 'utf8').toLowerCase();
  start = +start || 0;
  if (typeof end == 'undefined') end = this.length;

  // Fastpath empty strings
  if (+end == start) {
    return '';
  }

  switch (encoding) {
    case 'hex':
      return this.hexSlice(start, end);

    case 'utf8':
    case 'utf-8':
      return this.utf8Slice(start, end);

    case 'ascii':
      return this.asciiSlice(start, end);

    case 'binary':
      return this.binarySlice(start, end);

    case 'base64':
      return this.base64Slice(start, end);

    case 'ucs2':
    case 'ucs-2':
      return this.ucs2Slice(start, end);

    default:
      throw new Error('Unknown encoding');
  }
};


SlowBuffer.prototype.hexWrite = function(string, offset, length) {
  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2) {
    throw new Error('Invalid hex string');
  }
  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(byte)) throw new Error('Invalid hex string');
    this[offset + i] = byte;
  }
  SlowBuffer._charsWritten = i * 2;
  return i;
};


SlowBuffer.prototype.write = function(string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length;
      length = undefined;
    }
  } else {  // legacy
    var swap = encoding;
    encoding = offset;
    offset = length;
    length = swap;
  }

  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase();

  switch (encoding) {
    case 'hex':
      return this.hexWrite(string, offset, length);

    case 'utf8':
    case 'utf-8':
      return this.utf8Write(string, offset, length);

    case 'ascii':
      return this.asciiWrite(string, offset, length);

    case 'binary':
      return this.binaryWrite(string, offset, length);

    case 'base64':
      return this.base64Write(string, offset, length);

    case 'ucs2':
    case 'ucs-2':
      return this.ucs2Write(string, offset, length);

    default:
      throw new Error('Unknown encoding');
  }
};


// slice(start, end)
SlowBuffer.prototype.slice = function(start, end) {
  if (end === undefined) end = this.length;

  if (end > this.length) {
    throw new Error('oob');
  }
  if (start > end) {
    throw new Error('oob');
  }

  return new Buffer(this, end - start, +start);
};

SlowBuffer.prototype.copy = function(target, targetstart, sourcestart, sourceend) {
  var temp = [];
  for (var i=sourcestart; i<sourceend; i++) {
    assert.ok(typeof this[i] !== 'undefined', "copying undefined buffer bytes!");
    temp.push(this[i]);
  }

  for (var i=targetstart; i<targetstart+temp.length; i++) {
    target[i] = temp[i-targetstart];
  }
};

function coerce(length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length);
  return length < 0 ? 0 : length;
}


// Buffer

function Buffer(subject, encoding, offset) {
  if (!(this instanceof Buffer)) {
    return new Buffer(subject, encoding, offset);
  }

  var type;

  // Are we slicing?
  if (typeof offset === 'number') {
    this.length = coerce(encoding);
    this.parent = subject;
    this.offset = offset;
  } else {
    // Find the length
    switch (type = typeof subject) {
      case 'number':
        this.length = coerce(subject);
        break;

      case 'string':
        this.length = Buffer.byteLength(subject, encoding);
        break;

      case 'object': // Assume object is an array
        this.length = coerce(subject.length);
        break;

      default:
        throw new Error('First argument needs to be a number, ' +
                        'array or string.');
    }

    if (this.length > Buffer.poolSize) {
      // Big buffer, just alloc one.
      this.parent = new SlowBuffer(this.length);
      this.offset = 0;

    } else {
      // Small buffer.
      if (!pool || pool.length - pool.used < this.length) allocPool();
      this.parent = pool;
      this.offset = pool.used;
      pool.used += this.length;
    }

    // Treat array-ish objects as a byte array.
    if (isArrayIsh(subject)) {
      for (var i = 0; i < this.length; i++) {
        this.parent[i + this.offset] = subject[i];
      }
    } else if (type == 'string') {
      // We are a string
      this.length = this.write(subject, 0, encoding);
    }
  }

}

function isArrayIsh(subject) {
  return Array.isArray(subject) || Buffer.isBuffer(subject) ||
         subject && typeof subject === 'object' &&
         typeof subject.length === 'number';
}

exports.SlowBuffer = SlowBuffer;
exports.Buffer = Buffer;

Buffer.poolSize = 8 * 1024;
var pool;

function allocPool() {
  pool = new SlowBuffer(Buffer.poolSize);
  pool.used = 0;
}


// Static methods
Buffer.isBuffer = function isBuffer(b) {
  return b instanceof Buffer || b instanceof SlowBuffer;
};

Buffer.concat = function (list, totalLength) {
  if (!Array.isArray(list)) {
    throw new Error("Usage: Buffer.concat(list, [totalLength])\n \
      list should be an Array.");
  }

  if (list.length === 0) {
    return new Buffer(0);
  } else if (list.length === 1) {
    return list[0];
  }

  if (typeof totalLength !== 'number') {
    totalLength = 0;
    for (var i = 0; i < list.length; i++) {
      var buf = list[i];
      totalLength += buf.length;
    }
  }

  var buffer = new Buffer(totalLength);
  var pos = 0;
  for (var i = 0; i < list.length; i++) {
    var buf = list[i];
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer;
};

// Inspect
Buffer.prototype.inspect = function inspect() {
  var out = [],
      len = this.length;

  for (var i = 0; i < len; i++) {
    out[i] = toHex(this.parent[i + this.offset]);
    if (i == exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...';
      break;
    }
  }

  return '<Buffer ' + out.join(' ') + '>';
};


Buffer.prototype.get = function get(i) {
  if (i < 0 || i >= this.length) throw new Error('oob');
  return this.parent[this.offset + i];
};


Buffer.prototype.set = function set(i, v) {
  if (i < 0 || i >= this.length) throw new Error('oob');
  return this.parent[this.offset + i] = v;
};


// write(string, offset = 0, length = buffer.length-offset, encoding = 'utf8')
Buffer.prototype.write = function(string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length;
      length = undefined;
    }
  } else {  // legacy
    var swap = encoding;
    encoding = offset;
    offset = length;
    length = swap;
  }

  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase();

  var ret;
  switch (encoding) {
    case 'hex':
      ret = this.parent.hexWrite(string, this.offset + offset, length);
      break;

    case 'utf8':
    case 'utf-8':
      ret = this.parent.utf8Write(string, this.offset + offset, length);
      break;

    case 'ascii':
      ret = this.parent.asciiWrite(string, this.offset + offset, length);
      break;

    case 'binary':
      ret = this.parent.binaryWrite(string, this.offset + offset, length);
      break;

    case 'base64':
      // Warning: maxLength not taken into account in base64Write
      ret = this.parent.base64Write(string, this.offset + offset, length);
      break;

    case 'ucs2':
    case 'ucs-2':
      ret = this.parent.ucs2Write(string, this.offset + offset, length);
      break;

    default:
      throw new Error('Unknown encoding');
  }

  Buffer._charsWritten = SlowBuffer._charsWritten;

  return ret;
};


// toString(encoding, start=0, end=buffer.length)
Buffer.prototype.toString = function(encoding, start, end) {
  encoding = String(encoding || 'utf8').toLowerCase();

  if (typeof start == 'undefined' || start < 0) {
    start = 0;
  } else if (start > this.length) {
    start = this.length;
  }

  if (typeof end == 'undefined' || end > this.length) {
    end = this.length;
  } else if (end < 0) {
    end = 0;
  }

  start = start + this.offset;
  end = end + this.offset;

  switch (encoding) {
    case 'hex':
      return this.parent.hexSlice(start, end);

    case 'utf8':
    case 'utf-8':
      return this.parent.utf8Slice(start, end);

    case 'ascii':
      return this.parent.asciiSlice(start, end);

    case 'binary':
      return this.parent.binarySlice(start, end);

    case 'base64':
      return this.parent.base64Slice(start, end);

    case 'ucs2':
    case 'ucs-2':
      return this.parent.ucs2Slice(start, end);

    default:
      throw new Error('Unknown encoding');
  }
};


// byteLength
Buffer.byteLength = SlowBuffer.byteLength;


// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill(value, start, end) {
  value || (value = 0);
  start || (start = 0);
  end || (end = this.length);

  if (typeof value === 'string') {
    value = value.charCodeAt(0);
  }
  if (!(typeof value === 'number') || isNaN(value)) {
    throw new Error('value is not a number');
  }

  if (end < start) throw new Error('end < start');

  // Fill 0 bytes; we're done
  if (end === start) return 0;
  if (this.length == 0) return 0;

  if (start < 0 || start >= this.length) {
    throw new Error('start out of bounds');
  }

  if (end < 0 || end > this.length) {
    throw new Error('end out of bounds');
  }

  return this.parent.fill(value,
                          start + this.offset,
                          end + this.offset);
};


// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function(target, target_start, start, end) {
  var source = this;
  start || (start = 0);
  end || (end = this.length);
  target_start || (target_start = 0);

  if (end < start) throw new Error('sourceEnd < sourceStart');

  // Copy 0 bytes; we're done
  if (end === start) return 0;
  if (target.length == 0 || source.length == 0) return 0;

  if (target_start < 0 || target_start >= target.length) {
    throw new Error('targetStart out of bounds');
  }

  if (start < 0 || start >= source.length) {
    throw new Error('sourceStart out of bounds');
  }

  if (end < 0 || end > source.length) {
    throw new Error('sourceEnd out of bounds');
  }

  // Are we oob?
  if (end > this.length) {
    end = this.length;
  }

  if (target.length - target_start < end - start) {
    end = target.length - target_start + start;
  }

  return this.parent.copy(target.parent,
                          target_start + target.offset,
                          start + this.offset,
                          end + this.offset);
};


// slice(start, end)
Buffer.prototype.slice = function(start, end) {
  if (end === undefined) end = this.length;
  if (end > this.length) throw new Error('oob');
  if (start > end) throw new Error('oob');

  return new Buffer(this.parent, end - start, +start + this.offset);
};


// Legacy methods for backwards compatibility.

Buffer.prototype.utf8Slice = function(start, end) {
  return this.toString('utf8', start, end);
};

Buffer.prototype.binarySlice = function(start, end) {
  return this.toString('binary', start, end);
};

Buffer.prototype.asciiSlice = function(start, end) {
  return this.toString('ascii', start, end);
};

Buffer.prototype.utf8Write = function(string, offset) {
  return this.write(string, offset, 'utf8');
};

Buffer.prototype.binaryWrite = function(string, offset) {
  return this.write(string, offset, 'binary');
};

Buffer.prototype.asciiWrite = function(string, offset) {
  return this.write(string, offset, 'ascii');
};

Buffer.prototype.readUInt8 = function(offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to read beyond buffer length');
  }

  return buffer.parent[buffer.offset + offset];
};

function readUInt16(buffer, offset, isBigEndian, noAssert) {
  var val = 0;


  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (isBigEndian) {
    val = buffer.parent[buffer.offset + offset] << 8;
    val |= buffer.parent[buffer.offset + offset + 1];
  } else {
    val = buffer.parent[buffer.offset + offset];
    val |= buffer.parent[buffer.offset + offset + 1] << 8;
  }

  return val;
}

Buffer.prototype.readUInt16LE = function(offset, noAssert) {
  return readUInt16(this, offset, false, noAssert);
};

Buffer.prototype.readUInt16BE = function(offset, noAssert) {
  return readUInt16(this, offset, true, noAssert);
};

function readUInt32(buffer, offset, isBigEndian, noAssert) {
  var val = 0;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (isBigEndian) {
    val = buffer.parent[buffer.offset + offset + 1] << 16;
    val |= buffer.parent[buffer.offset + offset + 2] << 8;
    val |= buffer.parent[buffer.offset + offset + 3];
    val = val + (buffer.parent[buffer.offset + offset] << 24 >>> 0);
  } else {
    val = buffer.parent[buffer.offset + offset + 2] << 16;
    val |= buffer.parent[buffer.offset + offset + 1] << 8;
    val |= buffer.parent[buffer.offset + offset];
    val = val + (buffer.parent[buffer.offset + offset + 3] << 24 >>> 0);
  }

  return val;
}

Buffer.prototype.readUInt32LE = function(offset, noAssert) {
  return readUInt32(this, offset, false, noAssert);
};

Buffer.prototype.readUInt32BE = function(offset, noAssert) {
  return readUInt32(this, offset, true, noAssert);
};


/*
 * Signed integer types, yay team! A reminder on how two's complement actually
 * works. The first bit is the signed bit, i.e. tells us whether or not the
 * number should be positive or negative. If the two's complement value is
 * positive, then we're done, as it's equivalent to the unsigned representation.
 *
 * Now if the number is positive, you're pretty much done, you can just leverage
 * the unsigned translations and return those. Unfortunately, negative numbers
 * aren't quite that straightforward.
 *
 * At first glance, one might be inclined to use the traditional formula to
 * translate binary numbers between the positive and negative values in two's
 * complement. (Though it doesn't quite work for the most negative value)
 * Mainly:
 *  - invert all the bits
 *  - add one to the result
 *
 * Of course, this doesn't quite work in Javascript. Take for example the value
 * of -128. This could be represented in 16 bits (big-endian) as 0xff80. But of
 * course, Javascript will do the following:
 *
 * > ~0xff80
 * -65409
 *
 * Whoh there, Javascript, that's not quite right. But wait, according to
 * Javascript that's perfectly correct. When Javascript ends up seeing the
 * constant 0xff80, it has no notion that it is actually a signed number. It
 * assumes that we've input the unsigned value 0xff80. Thus, when it does the
 * binary negation, it casts it into a signed value, (positive 0xff80). Then
 * when you perform binary negation on that, it turns it into a negative number.
 *
 * Instead, we're going to have to use the following general formula, that works
 * in a rather Javascript friendly way. I'm glad we don't support this kind of
 * weird numbering scheme in the kernel.
 *
 * (BIT-MAX - (unsigned)val + 1) * -1
 *
 * The astute observer, may think that this doesn't make sense for 8-bit numbers
 * (really it isn't necessary for them). However, when you get 16-bit numbers,
 * you do. Let's go back to our prior example and see how this will look:
 *
 * (0xffff - 0xff80 + 1) * -1
 * (0x007f + 1) * -1
 * (0x0080) * -1
 */
Buffer.prototype.readInt8 = function(offset, noAssert) {
  var buffer = this;
  var neg;

  if (!noAssert) {
    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to read beyond buffer length');
  }

  neg = buffer.parent[buffer.offset + offset] & 0x80;
  if (!neg) {
    return (buffer.parent[buffer.offset + offset]);
  }

  return ((0xff - buffer.parent[buffer.offset + offset] + 1) * -1);
};

function readInt16(buffer, offset, isBigEndian, noAssert) {
  var neg, val;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to read beyond buffer length');
  }

  val = readUInt16(buffer, offset, isBigEndian, noAssert);
  neg = val & 0x8000;
  if (!neg) {
    return val;
  }

  return (0xffff - val + 1) * -1;
}

Buffer.prototype.readInt16LE = function(offset, noAssert) {
  return readInt16(this, offset, false, noAssert);
};

Buffer.prototype.readInt16BE = function(offset, noAssert) {
  return readInt16(this, offset, true, noAssert);
};

function readInt32(buffer, offset, isBigEndian, noAssert) {
  var neg, val;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  val = readUInt32(buffer, offset, isBigEndian, noAssert);
  neg = val & 0x80000000;
  if (!neg) {
    return (val);
  }

  return (0xffffffff - val + 1) * -1;
}

Buffer.prototype.readInt32LE = function(offset, noAssert) {
  return readInt32(this, offset, false, noAssert);
};

Buffer.prototype.readInt32BE = function(offset, noAssert) {
  return readInt32(this, offset, true, noAssert);
};

function readFloat(buffer, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  return require('./buffer_ieee754').readIEEE754(buffer, offset, isBigEndian,
      23, 4);
}

Buffer.prototype.readFloatLE = function(offset, noAssert) {
  return readFloat(this, offset, false, noAssert);
};

Buffer.prototype.readFloatBE = function(offset, noAssert) {
  return readFloat(this, offset, true, noAssert);
};

function readDouble(buffer, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset + 7 < buffer.length,
        'Trying to read beyond buffer length');
  }

  return require('./buffer_ieee754').readIEEE754(buffer, offset, isBigEndian,
      52, 8);
}

Buffer.prototype.readDoubleLE = function(offset, noAssert) {
  return readDouble(this, offset, false, noAssert);
};

Buffer.prototype.readDoubleBE = function(offset, noAssert) {
  return readDouble(this, offset, true, noAssert);
};


/*
 * We have to make sure that the value is a valid integer. This means that it is
 * non-negative. It has no fractional component and that it does not exceed the
 * maximum allowed value.
 *
 *      value           The number to check for validity
 *
 *      max             The maximum value
 */
function verifuint(value, max) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value >= 0,
      'specified a negative value for writing an unsigned value');

  assert.ok(value <= max, 'value is larger than maximum value for type');

  assert.ok(Math.floor(value) === value, 'value has a fractional component');
}

Buffer.prototype.writeUInt8 = function(value, offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xff);
  }

  buffer.parent[buffer.offset + offset] = value;
};

function writeUInt16(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xffff);
  }

  if (isBigEndian) {
    buffer.parent[buffer.offset + offset] = (value & 0xff00) >>> 8;
    buffer.parent[buffer.offset + offset + 1] = value & 0x00ff;
  } else {
    buffer.parent[buffer.offset + offset + 1] = (value & 0xff00) >>> 8;
    buffer.parent[buffer.offset + offset] = value & 0x00ff;
  }
}

Buffer.prototype.writeUInt16LE = function(value, offset, noAssert) {
  writeUInt16(this, value, offset, false, noAssert);
};

Buffer.prototype.writeUInt16BE = function(value, offset, noAssert) {
  writeUInt16(this, value, offset, true, noAssert);
};

function writeUInt32(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xffffffff);
  }

  if (isBigEndian) {
    buffer.parent[buffer.offset + offset] = (value >>> 24) & 0xff;
    buffer.parent[buffer.offset + offset + 1] = (value >>> 16) & 0xff;
    buffer.parent[buffer.offset + offset + 2] = (value >>> 8) & 0xff;
    buffer.parent[buffer.offset + offset + 3] = value & 0xff;
  } else {
    buffer.parent[buffer.offset + offset + 3] = (value >>> 24) & 0xff;
    buffer.parent[buffer.offset + offset + 2] = (value >>> 16) & 0xff;
    buffer.parent[buffer.offset + offset + 1] = (value >>> 8) & 0xff;
    buffer.parent[buffer.offset + offset] = value & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function(value, offset, noAssert) {
  writeUInt32(this, value, offset, false, noAssert);
};

Buffer.prototype.writeUInt32BE = function(value, offset, noAssert) {
  writeUInt32(this, value, offset, true, noAssert);
};


/*
 * We now move onto our friends in the signed number category. Unlike unsigned
 * numbers, we're going to have to worry a bit more about how we put values into
 * arrays. Since we are only worrying about signed 32-bit values, we're in
 * slightly better shape. Unfortunately, we really can't do our favorite binary
 * & in this system. It really seems to do the wrong thing. For example:
 *
 * > -32 & 0xff
 * 224
 *
 * What's happening above is really: 0xe0 & 0xff = 0xe0. However, the results of
 * this aren't treated as a signed number. Ultimately a bad thing.
 *
 * What we're going to want to do is basically create the unsigned equivalent of
 * our representation and pass that off to the wuint* functions. To do that
 * we're going to do the following:
 *
 *  - if the value is positive
 *      we can pass it directly off to the equivalent wuint
 *  - if the value is negative
 *      we do the following computation:
 *         mb + val + 1, where
 *         mb   is the maximum unsigned value in that byte size
 *         val  is the Javascript negative integer
 *
 *
 * As a concrete value, take -128. In signed 16 bits this would be 0xff80. If
 * you do out the computations:
 *
 * 0xffff - 128 + 1
 * 0xffff - 127
 * 0xff80
 *
 * You can then encode this value as the signed version. This is really rather
 * hacky, but it should work and get the job done which is our goal here.
 */

/*
 * A series of checks to make sure we actually have a signed 32-bit number
 */
function verifsint(value, max, min) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value <= max, 'value larger than maximum allowed value');

  assert.ok(value >= min, 'value smaller than minimum allowed value');

  assert.ok(Math.floor(value) === value, 'value has a fractional component');
}

function verifIEEE754(value, max, min) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value <= max, 'value larger than maximum allowed value');

  assert.ok(value >= min, 'value smaller than minimum allowed value');
}

Buffer.prototype.writeInt8 = function(value, offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7f, -0x80);
  }

  if (value >= 0) {
    buffer.writeUInt8(value, offset, noAssert);
  } else {
    buffer.writeUInt8(0xff + value + 1, offset, noAssert);
  }
};

function writeInt16(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7fff, -0x8000);
  }

  if (value >= 0) {
    writeUInt16(buffer, value, offset, isBigEndian, noAssert);
  } else {
    writeUInt16(buffer, 0xffff + value + 1, offset, isBigEndian, noAssert);
  }
}

Buffer.prototype.writeInt16LE = function(value, offset, noAssert) {
  writeInt16(this, value, offset, false, noAssert);
};

Buffer.prototype.writeInt16BE = function(value, offset, noAssert) {
  writeInt16(this, value, offset, true, noAssert);
};

function writeInt32(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7fffffff, -0x80000000);
  }

  if (value >= 0) {
    writeUInt32(buffer, value, offset, isBigEndian, noAssert);
  } else {
    writeUInt32(buffer, 0xffffffff + value + 1, offset, isBigEndian, noAssert);
  }
}

Buffer.prototype.writeInt32LE = function(value, offset, noAssert) {
  writeInt32(this, value, offset, false, noAssert);
};

Buffer.prototype.writeInt32BE = function(value, offset, noAssert) {
  writeInt32(this, value, offset, true, noAssert);
};

function writeFloat(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to write beyond buffer length');

    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38);
  }

  require('./buffer_ieee754').writeIEEE754(buffer, value, offset, isBigEndian,
      23, 4);
}

Buffer.prototype.writeFloatLE = function(value, offset, noAssert) {
  writeFloat(this, value, offset, false, noAssert);
};

Buffer.prototype.writeFloatBE = function(value, offset, noAssert) {
  writeFloat(this, value, offset, true, noAssert);
};

function writeDouble(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 7 < buffer.length,
        'Trying to write beyond buffer length');

    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308);
  }

  require('./buffer_ieee754').writeIEEE754(buffer, value, offset, isBigEndian,
      52, 8);
}

Buffer.prototype.writeDoubleLE = function(value, offset, noAssert) {
  writeDouble(this, value, offset, false, noAssert);
};

Buffer.prototype.writeDoubleBE = function(value, offset, noAssert) {
  writeDouble(this, value, offset, true, noAssert);
};

SlowBuffer.prototype.readUInt8 = Buffer.prototype.readUInt8;
SlowBuffer.prototype.readUInt16LE = Buffer.prototype.readUInt16LE;
SlowBuffer.prototype.readUInt16BE = Buffer.prototype.readUInt16BE;
SlowBuffer.prototype.readUInt32LE = Buffer.prototype.readUInt32LE;
SlowBuffer.prototype.readUInt32BE = Buffer.prototype.readUInt32BE;
SlowBuffer.prototype.readInt8 = Buffer.prototype.readInt8;
SlowBuffer.prototype.readInt16LE = Buffer.prototype.readInt16LE;
SlowBuffer.prototype.readInt16BE = Buffer.prototype.readInt16BE;
SlowBuffer.prototype.readInt32LE = Buffer.prototype.readInt32LE;
SlowBuffer.prototype.readInt32BE = Buffer.prototype.readInt32BE;
SlowBuffer.prototype.readFloatLE = Buffer.prototype.readFloatLE;
SlowBuffer.prototype.readFloatBE = Buffer.prototype.readFloatBE;
SlowBuffer.prototype.readDoubleLE = Buffer.prototype.readDoubleLE;
SlowBuffer.prototype.readDoubleBE = Buffer.prototype.readDoubleBE;
SlowBuffer.prototype.writeUInt8 = Buffer.prototype.writeUInt8;
SlowBuffer.prototype.writeUInt16LE = Buffer.prototype.writeUInt16LE;
SlowBuffer.prototype.writeUInt16BE = Buffer.prototype.writeUInt16BE;
SlowBuffer.prototype.writeUInt32LE = Buffer.prototype.writeUInt32LE;
SlowBuffer.prototype.writeUInt32BE = Buffer.prototype.writeUInt32BE;
SlowBuffer.prototype.writeInt8 = Buffer.prototype.writeInt8;
SlowBuffer.prototype.writeInt16LE = Buffer.prototype.writeInt16LE;
SlowBuffer.prototype.writeInt16BE = Buffer.prototype.writeInt16BE;
SlowBuffer.prototype.writeInt32LE = Buffer.prototype.writeInt32LE;
SlowBuffer.prototype.writeInt32BE = Buffer.prototype.writeInt32BE;
SlowBuffer.prototype.writeFloatLE = Buffer.prototype.writeFloatLE;
SlowBuffer.prototype.writeFloatBE = Buffer.prototype.writeFloatBE;
SlowBuffer.prototype.writeDoubleLE = Buffer.prototype.writeDoubleLE;
SlowBuffer.prototype.writeDoubleBE = Buffer.prototype.writeDoubleBE;

})()
},{"assert":2,"./buffer_ieee754":7,"base64-js":9}],9:[function(require,module,exports){
(function (exports) {
	'use strict';

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	function b64ToByteArray(b64) {
		var i, j, l, tmp, placeHolders, arr;
	
		if (b64.length % 4 > 0) {
			throw 'Invalid string. Length must be a multiple of 4';
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		placeHolders = b64.indexOf('=');
		placeHolders = placeHolders > 0 ? b64.length - placeHolders : 0;

		// base64 is 4/3 + up to two characters of the original data
		arr = [];//new Uint8Array(b64.length * 3 / 4 - placeHolders);

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length;

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (lookup.indexOf(b64[i]) << 18) | (lookup.indexOf(b64[i + 1]) << 12) | (lookup.indexOf(b64[i + 2]) << 6) | lookup.indexOf(b64[i + 3]);
			arr.push((tmp & 0xFF0000) >> 16);
			arr.push((tmp & 0xFF00) >> 8);
			arr.push(tmp & 0xFF);
		}

		if (placeHolders === 2) {
			tmp = (lookup.indexOf(b64[i]) << 2) | (lookup.indexOf(b64[i + 1]) >> 4);
			arr.push(tmp & 0xFF);
		} else if (placeHolders === 1) {
			tmp = (lookup.indexOf(b64[i]) << 10) | (lookup.indexOf(b64[i + 1]) << 4) | (lookup.indexOf(b64[i + 2]) >> 2);
			arr.push((tmp >> 8) & 0xFF);
			arr.push(tmp & 0xFF);
		}

		return arr;
	}

	function uint8ToBase64(uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length;

		function tripletToBase64 (num) {
			return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
		};

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
			output += tripletToBase64(temp);
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1];
				output += lookup[temp >> 2];
				output += lookup[(temp << 4) & 0x3F];
				output += '==';
				break;
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1]);
				output += lookup[temp >> 10];
				output += lookup[(temp >> 4) & 0x3F];
				output += lookup[(temp << 2) & 0x3F];
				output += '=';
				break;
		}

		return output;
	}

	module.exports.toByteArray = b64ToByteArray;
	module.exports.fromByteArray = uint8ToBase64;
}());

},{}]},{},[])
;;module.exports=require("buffer-browserify")

},{}],15:[function(require,module,exports){
(function(Buffer){(function() {
  var MarkedYAMLError, nodes, util, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  MarkedYAMLError = require('./errors').MarkedYAMLError;

  nodes = require('./nodes');

  util = require('./util');

  this.ConstructorError = (function(_super) {
    __extends(ConstructorError, _super);

    function ConstructorError() {
      _ref = ConstructorError.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return ConstructorError;

  })(MarkedYAMLError);

  this.BaseConstructor = (function() {
    BaseConstructor.prototype.yaml_constructors = {};

    BaseConstructor.prototype.yaml_multi_constructors = {};

    BaseConstructor.add_constructor = function(tag, constructor) {
      if (!this.prototype.hasOwnProperty('yaml_constructors')) {
        this.prototype.yaml_constructors = util.extend({}, this.prototype.yaml_constructors);
      }
      return this.prototype.yaml_constructors[tag] = constructor;
    };

    BaseConstructor.add_multi_constructor = function(tag_prefix, multi_constructor) {
      if (!this.prototype.hasOwnProperty('yaml_multi_constructors')) {
        this.prototype.yaml_multi_constructors = util.extend({}, this.prototype.yaml_multi_constructors);
      }
      return this.prototype.yaml_multi_constructors[tag_prefix] = multi_constructor;
    };

    function BaseConstructor() {
      this.constructed_objects = {};
      this.constructing_nodes = [];
      this.deferred_constructors = [];
    }

    /*
    Are there more documents available?
    */


    BaseConstructor.prototype.check_data = function() {
      return this.check_node();
    };

    /*
    Construct and return the next document.
    */


    BaseConstructor.prototype.get_data = function() {
      if (this.check_node()) {
        return this.construct_document(this.get_node());
      }
    };

    /*
    Ensure that the stream contains a single document and construct it.
    */


    BaseConstructor.prototype.get_single_data = function(validate, apply, join) {
      var node;
      if (validate == null) {
        validate = true;
      }
      if (apply == null) {
        apply = true;
      }
      if (join == null) {
        join = true;
      }
      node = this.get_single_node(validate, apply, join);
      if (node != null) {
        return this.construct_document(node);
      }
      return null;
    };

    BaseConstructor.prototype.construct_document = function(node) {
      var data;
      this.applyAstTransformations(node);
      data = this.construct_object(node);
      while (!util.is_empty(this.deferred_constructors)) {
        this.deferred_constructors.pop()();
      }
      this.applyTransformations(data);
      return data;
    };

    BaseConstructor.prototype.defer = function(f) {
      return this.deferred_constructors.push(f);
    };

    BaseConstructor.prototype.construct_object = function(node) {
      var constructor, object, tag_prefix, tag_suffix, _ref1;
      if (node.unique_id in this.constructed_objects) {
        return this.constructed_objects[node.unique_id];
      }
      if (_ref1 = node.unique_id, __indexOf.call(this.constructing_nodes, _ref1) >= 0) {
        throw new exports.ConstructorError(null, null, 'found unconstructable recursive node', node.start_mark);
      }
      this.constructing_nodes.push(node.unique_id);
      constructor = null;
      tag_suffix = null;
      if (node.tag in this.yaml_constructors) {
        constructor = this.yaml_constructors[node.tag];
      } else {
        for (tag_prefix in this.yaml_multi_constructors) {
          if (node.tag.indexOf(tag_prefix === 0)) {
            tag_suffix = node.tag.slice(tag_prefix.length);
            constructor = this.yaml_multi_constructors[tag_prefix];
            break;
          }
        }
        if (constructor == null) {
          if (null in this.yaml_multi_constructors) {
            tag_suffix = node.tag;
            constructor = this.yaml_multi_constructors[null];
          } else if (null in this.yaml_constructors) {
            constructor = this.yaml_constructors[null];
          } else if (node instanceof nodes.ScalarNode) {
            constructor = this.construct_scalar;
          } else if (node instanceof nodes.SequenceNode) {
            constructor = this.construct_sequence;
          } else if (node instanceof nodes.MappingNode) {
            constructor = this.construct_mapping;
          }
        }
      }
      object = constructor.call(this, tag_suffix != null ? tag_suffix : node, node);
      this.constructed_objects[node.unique_id] = object;
      this.constructing_nodes.pop();
      return object;
    };

    BaseConstructor.prototype.construct_scalar = function(node) {
      if (!(node instanceof nodes.ScalarNode)) {
        throw new exports.ConstructorError(null, null, "expected a scalar node but found " + node.id, node.start_mark);
      }
      return node.value;
    };

    BaseConstructor.prototype.construct_sequence = function(node) {
      var child, _i, _len, _ref1, _results;
      if (!(node instanceof nodes.SequenceNode)) {
        throw new exports.ConstructorError(null, null, "expected an array node but found " + node.id, node.start_mark);
      }
      _ref1 = node.value;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        child = _ref1[_i];
        _results.push(this.construct_object(child));
      }
      return _results;
    };

    BaseConstructor.prototype.construct_mapping = function(node) {
      var key, key_item, key_item_value, key_node, mapping, value, value_node, _i, _j, _len, _len1, _ref1, _ref2, _ref3;
      if (!(node instanceof nodes.MappingNode)) {
        throw new exports.ConstructorError(null, null, "expected a map node but found " + node.id, node.start_mark);
      }
      mapping = {};
      _ref1 = node.value;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        _ref2 = _ref1[_i], key_node = _ref2[0], value_node = _ref2[1];
        key = this.construct_object(key_node);
        value = this.construct_object(value_node);
        if (typeof key === 'object' && key_node.tag === 'tag:yaml.org,2002:seq') {
          _ref3 = key_node.value;
          for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
            key_item = _ref3[_j];
            key_item_value = this.construct_object(key_item);
            mapping[key_item_value] = value;
          }
        } else if (typeof key === 'object') {
          throw new exports.ConstructorError('while constructing a map', node.start_mark, 'found unhashable key', key_node.start_mark);
        } else {
          mapping[key] = value;
        }
      }
      return mapping;
    };

    BaseConstructor.prototype.construct_pairs = function(node) {
      var key, key_node, pairs, value, value_node, _i, _len, _ref1, _ref2;
      if (!(node instanceof nodes.MappingNode)) {
        throw new exports.ConstructorError(null, null, "expected a map node but found " + node.id, node.start_mark);
      }
      pairs = [];
      _ref1 = node.value;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        _ref2 = _ref1[_i], key_node = _ref2[0], value_node = _ref2[1];
        key = this.construct_object(key_node);
        value = this.construct_object(value_node);
        pairs.push([key, value]);
      }
      return pairs;
    };

    return BaseConstructor;

  })();

  this.Constructor = (function(_super) {
    var BOOL_VALUES, TIMESTAMP_PARTS, TIMESTAMP_REGEX;

    __extends(Constructor, _super);

    function Constructor() {
      _ref1 = Constructor.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    BOOL_VALUES = {
      on: true,
      off: false,
      "true": true,
      "false": false,
      yes: true,
      no: false
    };

    TIMESTAMP_REGEX = /^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:(?:[Tt]|[\x20\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\.([0-9]*))?(?:[\x20\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?)?$/;

    TIMESTAMP_PARTS = {
      year: 1,
      month: 2,
      day: 3,
      hour: 4,
      minute: 5,
      second: 6,
      fraction: 7,
      tz: 8,
      tz_sign: 9,
      tz_hour: 10,
      tz_minute: 11
    };

    Constructor.prototype.yaml_constructors = {};

    Constructor.prototype.yaml_multi_constructors = {};

    Constructor.prototype.construct_scalar = function(node) {
      var key_node, value_node, _i, _len, _ref2, _ref3;
      if (node instanceof nodes.MappingNode) {
        _ref2 = node.value;
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          _ref3 = _ref2[_i], key_node = _ref3[0], value_node = _ref3[1];
          if (key_node.tag === 'tag:yaml.org,2002:value') {
            return this.construct_scalar(value_node);
          }
        }
      }
      return Constructor.__super__.construct_scalar.call(this, node);
    };

    Constructor.prototype.flatten_mapping = function(node) {
      var index, key_node, merge, submerge, subnode, value, value_node, _i, _j, _len, _len1, _ref2, _ref3;
      merge = [];
      index = 0;
      while (index < node.value.length) {
        _ref2 = node.value[index], key_node = _ref2[0], value_node = _ref2[1];
        if (key_node.tag === 'tag:yaml.org,2002:merge') {
          node.value.splice(index, 1);
          if (value_node instanceof nodes.MappingNode) {
            this.flatten_mapping(value_node);
            merge = merge.concat(value_node.value);
          } else if (value_node instanceof nodes.SequenceNode) {
            submerge = [];
            _ref3 = value_node.value;
            for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
              subnode = _ref3[_i];
              if (!(subnode instanceof nodes.MappingNode)) {
                throw new exports.ConstructorError('while constructing a map', node.start_mark, "expected a map for merging, but found " + subnode.id, subnode.start_mark);
              }
              this.flatten_mapping(subnode);
              submerge.push(subnode.value);
            }
            submerge.reverse();
            for (_j = 0, _len1 = submerge.length; _j < _len1; _j++) {
              value = submerge[_j];
              merge = merge.concat(value);
            }
          } else {
            throw new exports.ConstructorError('while constructing a map', node.start_mark, "expected a map or an array of maps for            merging but found " + value_node.id, value_node.start_mark);
          }
        } else if (key_node.tag === 'tag:yaml.org,2002:value') {
          key_node.tag = 'tag:yaml.org,2002:str';
          index++;
        } else {
          index++;
        }
      }
      if (merge.length) {
        return node.value = merge.concat(node.value);
      }
    };

    Constructor.prototype.construct_mapping = function(node) {
      if (node instanceof nodes.MappingNode) {
        this.flatten_mapping(node);
      }
      return Constructor.__super__.construct_mapping.call(this, node);
    };

    Constructor.prototype.construct_yaml_null = function(node) {
      this.construct_scalar(node);
      return null;
    };

    Constructor.prototype.construct_yaml_bool = function(node) {
      var value;
      value = this.construct_scalar(node);
      return BOOL_VALUES[value.toLowerCase()];
    };

    Constructor.prototype.construct_yaml_int = function(node) {
      var base, digit, digits, part, sign, value, _i, _len, _ref2;
      value = this.construct_scalar(node);
      value = value.replace(/_/g, '');
      sign = value[0] === '-' ? -1 : 1;
      if (_ref2 = value[0], __indexOf.call('+-', _ref2) >= 0) {
        value = value.slice(1);
      }
      if (value === '0') {
        return 0;
      } else if (value.indexOf('0b') === 0) {
        return sign * parseInt(value.slice(2), 2);
      } else if (value.indexOf('0x') === 0) {
        return sign * parseInt(value.slice(2), 16);
      } else if (value.indexOf('0o') === 0) {
        return sign * parseInt(value.slice(2), 8);
      } else if (value[0] === '0') {
        return sign * parseInt(value, 8);
      } else if (__indexOf.call(value, ':') >= 0) {
        digits = (function() {
          var _i, _len, _ref3, _results;
          _ref3 = value.split(/:/g);
          _results = [];
          for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
            part = _ref3[_i];
            _results.push(parseInt(part));
          }
          return _results;
        })();
        digits.reverse();
        base = 1;
        value = 0;
        for (_i = 0, _len = digits.length; _i < _len; _i++) {
          digit = digits[_i];
          value += digit * base;
          base *= 60;
        }
        return sign * value;
      } else {
        return sign * parseInt(value);
      }
    };

    Constructor.prototype.construct_yaml_float = function(node) {
      var base, digit, digits, part, sign, value, _i, _len, _ref2;
      value = this.construct_scalar(node);
      value = value.replace(/_/g, '').toLowerCase();
      sign = value[0] === '-' ? -1 : 1;
      if (_ref2 = value[0], __indexOf.call('+-', _ref2) >= 0) {
        value = value.slice(1);
      }
      if (value === '.inf') {
        return sign * Infinity;
      } else if (value === '.nan') {
        return NaN;
      } else if (__indexOf.call(value, ':') >= 0) {
        digits = (function() {
          var _i, _len, _ref3, _results;
          _ref3 = value.split(/:/g);
          _results = [];
          for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
            part = _ref3[_i];
            _results.push(parseFloat(part));
          }
          return _results;
        })();
        digits.reverse();
        base = 1;
        value = 0.0;
        for (_i = 0, _len = digits.length; _i < _len; _i++) {
          digit = digits[_i];
          value += digit * base;
          base *= 60;
        }
        return sign * value;
      } else {
        return sign * parseFloat(value);
      }
    };

    Constructor.prototype.construct_yaml_binary = function(node) {
      var error, value;
      value = this.construct_scalar(node);
      try {
        if (typeof window !== "undefined" && window !== null) {
          return atob(value);
        }
        return new Buffer(value, 'base64').toString('ascii');
      } catch (_error) {
        error = _error;
        throw new exports.ConstructorError(null, null, "failed to decode base64 data: " + error, node.start_mark);
      }
    };

    Constructor.prototype.construct_yaml_timestamp = function(node) {
      var date, day, fraction, hour, index, key, match, millisecond, minute, month, second, tz_hour, tz_minute, tz_sign, value, values, year;
      value = this.construct_scalar(node);
      match = node.value.match(TIMESTAMP_REGEX);
      values = {};
      for (key in TIMESTAMP_PARTS) {
        index = TIMESTAMP_PARTS[key];
        values[key] = match[index];
      }
      year = parseInt(values.year);
      month = parseInt(values.month) - 1;
      day = parseInt(values.day);
      if (!values.hour) {
        return new Date(Date.UTC(year, month, day));
      }
      hour = parseInt(values.hour);
      minute = parseInt(values.minute);
      second = parseInt(values.second);
      millisecond = 0;
      if (values.fraction) {
        fraction = values.fraction.slice(0, 6);
        while (fraction.length < 6) {
          fraction += '0';
        }
        fraction = parseInt(fraction);
        millisecond = Math.round(fraction / 1000);
      }
      if (values.tz_sign) {
        tz_sign = values.tz_sign === '-' ? 1 : -1;
        if (tz_hour = parseInt(values.tz_hour)) {
          hour += tz_sign * tz_hour;
        }
        if (tz_minute = parseInt(values.tz_minute)) {
          minute += tz_sign * tz_minute;
        }
      }
      date = new Date(Date.UTC(year, month, day, hour, minute, second, millisecond));
      return date;
    };

    Constructor.prototype.construct_yaml_pair_list = function(type, node) {
      var list,
        _this = this;
      list = [];
      if (!(node instanceof nodes.SequenceNode)) {
        throw new exports.ConstructorError("while constructing " + type, node.start_mark, "expected an array but found " + node.id, node.start_mark);
      }
      this.defer(function() {
        var key, key_node, subnode, value, value_node, _i, _len, _ref2, _ref3, _results;
        _ref2 = node.value;
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          subnode = _ref2[_i];
          if (!(subnode instanceof nodes.MappingNode)) {
            throw new exports.ConstructorError("while constructing " + type, node.start_mark, "expected a map of length 1 but found " + subnode.id, subnode.start_mark);
          }
          if (subnode.value.length !== 1) {
            throw new exports.ConstructorError("while constructing " + type, node.start_mark, "expected a map of length 1 but found " + subnode.id, subnode.start_mark);
          }
          _ref3 = subnode.value[0], key_node = _ref3[0], value_node = _ref3[1];
          key = _this.construct_object(key_node);
          value = _this.construct_object(value_node);
          _results.push(list.push([key, value]));
        }
        return _results;
      });
      return list;
    };

    Constructor.prototype.construct_yaml_omap = function(node) {
      return this.construct_yaml_pair_list('an ordered map', node);
    };

    Constructor.prototype.construct_yaml_pairs = function(node) {
      return this.construct_yaml_pair_list('pairs', node);
    };

    Constructor.prototype.construct_yaml_set = function(node) {
      var data,
        _this = this;
      data = [];
      this.defer(function() {
        var item, _results;
        _results = [];
        for (item in _this.construct_mapping(node)) {
          _results.push(data.push(item));
        }
        return _results;
      });
      return data;
    };

    Constructor.prototype.construct_yaml_str = function(node) {
      return this.construct_scalar(node);
    };

    Constructor.prototype.construct_yaml_seq = function(node) {
      var data,
        _this = this;
      data = [];
      this.defer(function() {
        var item, _i, _len, _ref2, _results;
        _ref2 = _this.construct_sequence(node);
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          item = _ref2[_i];
          _results.push(data.push(item));
        }
        return _results;
      });
      return data;
    };

    Constructor.prototype.construct_yaml_map = function(node) {
      var data,
        _this = this;
      data = {};
      this.defer(function() {
        var key, value, _ref2, _results;
        _ref2 = _this.construct_mapping(node);
        _results = [];
        for (key in _ref2) {
          value = _ref2[key];
          _results.push(data[key] = value);
        }
        return _results;
      });
      return data;
    };

    Constructor.prototype.construct_yaml_object = function(node, klass) {
      var data,
        _this = this;
      data = new klass;
      this.defer(function() {
        var key, value, _ref2, _results;
        _ref2 = _this.construct_mapping(node, true);
        _results = [];
        for (key in _ref2) {
          value = _ref2[key];
          _results.push(data[key] = value);
        }
        return _results;
      });
      return data;
    };

    Constructor.prototype.construct_undefined = function(node) {
      throw new exports.ConstructorError(null, null, "could not determine a constructor for the tag " + node.tag, node.start_mark);
    };

    return Constructor;

  })(this.BaseConstructor);

  this.Constructor.add_constructor('tag:yaml.org,2002:null', this.Constructor.prototype.construct_yaml_null);

  this.Constructor.add_constructor('tag:yaml.org,2002:bool', this.Constructor.prototype.construct_yaml_bool);

  this.Constructor.add_constructor('tag:yaml.org,2002:int', this.Constructor.prototype.construct_yaml_int);

  this.Constructor.add_constructor('tag:yaml.org,2002:float', this.Constructor.prototype.construct_yaml_float);

  this.Constructor.add_constructor('tag:yaml.org,2002:binary', this.Constructor.prototype.construct_yaml_binary);

  this.Constructor.add_constructor('tag:yaml.org,2002:timestamp', this.Constructor.prototype.construct_yaml_timestamp);

  this.Constructor.add_constructor('tag:yaml.org,2002:omap', this.Constructor.prototype.construct_yaml_omap);

  this.Constructor.add_constructor('tag:yaml.org,2002:pairs', this.Constructor.prototype.construct_yaml_pairs);

  this.Constructor.add_constructor('tag:yaml.org,2002:set', this.Constructor.prototype.construct_yaml_set);

  this.Constructor.add_constructor('tag:yaml.org,2002:str', this.Constructor.prototype.construct_yaml_str);

  this.Constructor.add_constructor('tag:yaml.org,2002:seq', this.Constructor.prototype.construct_yaml_seq);

  this.Constructor.add_constructor('tag:yaml.org,2002:map', this.Constructor.prototype.construct_yaml_map);

  this.Constructor.add_constructor(null, this.Constructor.prototype.construct_undefined);

  module.exports.Constructor = this.Constructor;

  module.exports.ConstructorError = this.ConstructorError;

}).call(this);

})(require("__browserify_buffer").Buffer)
},{"./errors":1,"./nodes":13,"./util":4,"__browserify_buffer":14}],16:[function(require,module,exports){
(function() {
  var MarkedYAMLError, nodes, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  MarkedYAMLError = require('./errors').MarkedYAMLError;

  nodes = require('./nodes');

  /*
  The Traits throws these.
  */


  this.JoinError = (function(_super) {
    __extends(JoinError, _super);

    function JoinError() {
      _ref = JoinError.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return JoinError;

  })(MarkedYAMLError);

  /*
  The Joiner class groups resources under resource property and groups methods under operations property
  */


  this.Joiner = (function() {
    function Joiner() {}

    Joiner.prototype.join_resources = function(node, call) {
      var resources, resourcesArray, resourcesName, resourcesValue,
        _this = this;
      if (call == null) {
        call = 0;
      }
      resources = [];
      if (node != null ? node.value : void 0) {
        resources = node.value.filter(function(childNode) {
          var _ref1;
          return (_ref1 = childNode[0]) != null ? _ref1.value.match(/^\//) : void 0;
        });
      }
      resourcesArray = [];
      if (resources.length > 0) {
        if (node != null ? node.value : void 0) {
          node.value = node.value.filter(function(childNode) {
            return !childNode[0].value.match(/^\//);
          });
        }
        resourcesName = new nodes.ScalarNode('tag:yaml.org,2002:str', 'resources', resources[0][0].start_mark, resources[resources.length - 1][1].end_mark);
        resources.forEach(function(resource) {
          var relativeUriName, relativeUriValue;
          relativeUriName = new nodes.ScalarNode('tag:yaml.org,2002:str', 'relativeUri', resource[0].start_mark, resource[1].end_mark);
          relativeUriValue = new nodes.ScalarNode('tag:yaml.org,2002:str', resource[0].value, resource[0].start_mark, resource[1].end_mark);
          if (resource[1].tag === "tag:yaml.org,2002:null") {
            resource[1] = new nodes.MappingNode('tag:yaml.org,2002:map', [], resource[0].start_mark, resource[1].end_mark);
          }
          resource[1].value.push([relativeUriName, relativeUriValue]);
          resourcesArray.push(resource[1]);
          _this.join_methods(resource[1]);
          return _this.join_resources(resource[1], ++call);
        });
        resourcesValue = new nodes.SequenceNode('tag:yaml.org,2002:seq', resourcesArray, resources[0][0].start_mark, resources[resources.length - 1][1].end_mark);
        return node.value.push([resourcesName, resourcesValue]);
      }
    };

    Joiner.prototype.join_methods = function(node) {
      var methods, methodsArray, methodsName, methodsValue,
        _this = this;
      methods = [];
      if (node && node.value) {
        methods = node.value.filter(function(childNode) {
          var _ref1;
          return _this.isHttpMethod((_ref1 = childNode[0]) != null ? _ref1.value : void 0);
        });
      }
      methodsArray = [];
      if (methods.length > 0) {
        node.value = node.value.filter(function(childNode) {
          return !_this.isHttpMethod(childNode[0].value);
        });
        methodsName = new nodes.ScalarNode('tag:yaml.org,2002:str', 'methods', methods[0][0].start_mark, methods[methods.length - 1][1].end_mark);
        methods.forEach(function(method) {
          var methodName, methodValue;
          methodName = new nodes.ScalarNode('tag:yaml.org,2002:str', 'method', method[0].start_mark, method[1].end_mark);
          methodValue = new nodes.ScalarNode('tag:yaml.org,2002:str', method[0].value, method[0].start_mark, method[1].end_mark);
          if (method[1].tag === 'tag:yaml.org,2002:null') {
            method[1] = new nodes.MappingNode('tag:yaml.org,2002:map', [], method[1].start_mark, method[1].end_mark);
          }
          method[1].value.push([methodName, methodValue]);
          return methodsArray.push(method[1]);
        });
        methodsValue = new nodes.SequenceNode('tag:yaml.org,2002:seq', methodsArray, methods[0][0].start_mark, methods[methods.length - 1][1].end_mark);
        return node.value.push([methodsName, methodsValue]);
      }
    };

    return Joiner;

  })();

}).call(this);

},{"./errors":1,"./nodes":13}],17:[function(require,module,exports){
(function() {
  var composer, construct, joiner, parser, protocols, reader, resolver, scanner, schemas, securitySchemes, traits, transformations, types, util, validator;

  util = require('./util');

  reader = require('./reader');

  scanner = require('./scanner');

  parser = require('./parser');

  composer = require('./composer');

  resolver = require('./resolver');

  construct = require('./construct');

  validator = require('./validator');

  joiner = require('./joiner');

  traits = require('./traits');

  types = require('./resourceTypes');

  schemas = require('./schemas');

  protocols = require('./protocols');

  securitySchemes = require('./securitySchemes');

  transformations = require('./transformations');

  this.make_loader = function(Reader, Scanner, Parser, Composer, Resolver, Validator, ResourceTypes, Traits, Schemas, Protocols, Joiner, SecuritySchemes, Constructor, Transformations) {
    if (Reader == null) {
      Reader = reader.Reader;
    }
    if (Scanner == null) {
      Scanner = scanner.Scanner;
    }
    if (Parser == null) {
      Parser = parser.Parser;
    }
    if (Composer == null) {
      Composer = composer.Composer;
    }
    if (Resolver == null) {
      Resolver = resolver.Resolver;
    }
    if (Validator == null) {
      Validator = validator.Validator;
    }
    if (ResourceTypes == null) {
      ResourceTypes = types.ResourceTypes;
    }
    if (Traits == null) {
      Traits = traits.Traits;
    }
    if (Schemas == null) {
      Schemas = schemas.Schemas;
    }
    if (Protocols == null) {
      Protocols = protocols.Protocols;
    }
    if (Joiner == null) {
      Joiner = joiner.Joiner;
    }
    if (SecuritySchemes == null) {
      SecuritySchemes = securitySchemes.SecuritySchemes;
    }
    if (Constructor == null) {
      Constructor = construct.Constructor;
    }
    if (Transformations == null) {
      Transformations = transformations.Transformations;
    }
    return (function() {
      var component, components;

      components = [Reader, Scanner, Parser, Composer, Resolver, Validator, Traits, ResourceTypes, Schemas, Protocols, Joiner, Constructor, SecuritySchemes, Transformations];

      util.extend.apply(util, [_Class.prototype].concat((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = components.length; _i < _len; _i++) {
          component = components[_i];
          _results.push(component.prototype);
        }
        return _results;
      })()));

      function _Class(stream, location, validate, parent) {
        var _i, _len, _ref;
        this.parent = parent;
        components[0].call(this, stream, location);
        components[1].call(this, validate);
        _ref = components.slice(2);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          component = _ref[_i];
          component.call(this);
        }
      }

      return _Class;

    })();
  };

  this.Loader = this.make_loader();

}).call(this);

},{"./composer":12,"./construct":15,"./joiner":16,"./parser":20,"./protocols":26,"./reader":18,"./resolver":21,"./resourceTypes":24,"./scanner":19,"./schemas":25,"./securitySchemes":27,"./traits":23,"./transformations":28,"./util":4,"./validator":22}],13:[function(require,module,exports){
(function() {
  var MarkedYAMLError, unique_id, _ref, _ref1, _ref2,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  MarkedYAMLError = require('./errors').MarkedYAMLError;

  unique_id = 0;

  this.ApplicationError = (function(_super) {
    __extends(ApplicationError, _super);

    function ApplicationError() {
      _ref = ApplicationError.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return ApplicationError;

  })(MarkedYAMLError);

  this.Node = (function() {
    function Node(tag, value, start_mark, end_mark) {
      this.tag = tag;
      this.value = value;
      this.start_mark = start_mark;
      this.end_mark = end_mark;
      this.unique_id = "node_" + (unique_id++);
    }

    Node.prototype.clone = function() {
      var temp;
      temp = new this.constructor(this.tag, this.value, this.start_mark, this.end_mark);
      return temp;
    };

    return Node;

  })();

  this.ScalarNode = (function(_super) {
    __extends(ScalarNode, _super);

    ScalarNode.prototype.id = 'scalar';

    function ScalarNode(tag, value, start_mark, end_mark, style) {
      this.tag = tag;
      this.value = value;
      this.start_mark = start_mark;
      this.end_mark = end_mark;
      this.style = style;
      ScalarNode.__super__.constructor.apply(this, arguments);
    }

    ScalarNode.prototype.clone = function() {
      var temp;
      temp = new this.constructor(this.tag, this.value, this.start_mark, this.end_mark, this.style);
      return temp;
    };

    ScalarNode.prototype.cloneRemoveIs = function() {
      return this.clone();
    };

    ScalarNode.prototype.combine = function(node) {
      if (this.tag === 'tag:yaml.org,2002:null' && node.tag === 'tag:yaml.org,2002:map') {
        this.value = new exports.MappingNode('tag:yaml.org,2002:map', [], node.start_mark, node.end_mark);
        return this.value.combine(node);
      } else if (!(node instanceof exports.ScalarNode)) {
        throw new exports.ApplicationError('while applying node', null, 'different YAML structures', this.start_mark);
      }
      return this.value = node.value;
    };

    ScalarNode.prototype.remove_question_mark_properties = function() {};

    return ScalarNode;

  })(this.Node);

  this.CollectionNode = (function(_super) {
    __extends(CollectionNode, _super);

    function CollectionNode(tag, value, start_mark, end_mark, flow_style) {
      this.tag = tag;
      this.value = value;
      this.start_mark = start_mark;
      this.end_mark = end_mark;
      this.flow_style = flow_style;
      CollectionNode.__super__.constructor.apply(this, arguments);
    }

    return CollectionNode;

  })(this.Node);

  this.SequenceNode = (function(_super) {
    __extends(SequenceNode, _super);

    function SequenceNode() {
      _ref1 = SequenceNode.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    SequenceNode.prototype.id = 'sequence';

    SequenceNode.prototype.clone = function() {
      var item, items, temp, value, _i, _len, _ref2;
      items = [];
      _ref2 = this.value;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        item = _ref2[_i];
        value = item.clone();
        items.push(value);
      }
      temp = new this.constructor(this.tag, items, this.start_mark, this.end_mark, this.flow_style);
      return temp;
    };

    SequenceNode.prototype.cloneRemoveIs = function() {
      return this.clone();
    };

    SequenceNode.prototype.combine = function(node) {
      var property, value, _i, _len, _ref2, _results;
      if (!(node instanceof exports.SequenceNode)) {
        throw new exports.ApplicationError('while applying node', null, 'different YAML structures', this.start_mark);
      }
      _ref2 = node.value;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        property = _ref2[_i];
        value = property.clone();
        _results.push(this.value.push(value));
      }
      return _results;
    };

    SequenceNode.prototype.remove_question_mark_properties = function() {
      var item, _i, _len, _ref2, _results;
      _ref2 = this.value;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        item = _ref2[_i];
        _results.push(item.remove_question_mark_properties());
      }
      return _results;
    };

    return SequenceNode;

  })(this.CollectionNode);

  this.MappingNode = (function(_super) {
    __extends(MappingNode, _super);

    function MappingNode() {
      _ref2 = MappingNode.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    MappingNode.prototype.id = 'mapping';

    MappingNode.prototype.clone = function() {
      var name, properties, property, temp, value, _i, _len, _ref3;
      properties = [];
      _ref3 = this.value;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        property = _ref3[_i];
        name = property[0].clone();
        value = property[1].clone();
        properties.push([name, value]);
      }
      temp = new this.constructor(this.tag, properties, this.start_mark, this.end_mark, this.flow_style);
      return temp;
    };

    MappingNode.prototype.cloneRemoveIs = function() {
      var name, properties, property, temp, value, _i, _len, _ref3, _ref4;
      properties = [];
      _ref3 = this.value;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        property = _ref3[_i];
        name = property[0].cloneRemoveIs();
        value = property[1].cloneRemoveIs();
        if ((_ref4 = name.value) !== 'is') {
          properties.push([name, value]);
        }
      }
      temp = new this.constructor(this.tag, properties, this.start_mark, this.end_mark, this.flow_style);
      return temp;
    };

    MappingNode.prototype.cloneForTrait = function() {
      var name, properties, property, temp, value, _i, _len, _ref3, _ref4;
      properties = [];
      _ref3 = this.value;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        property = _ref3[_i];
        name = property[0].clone();
        value = property[1].clone();
        if ((_ref4 = name.value) !== 'usage' && _ref4 !== 'displayName') {
          properties.push([name, value]);
        }
      }
      temp = new this.constructor(this.tag, properties, this.start_mark, this.end_mark, this.flow_style);
      return temp;
    };

    MappingNode.prototype.cloneForResourceType = function() {
      var name, properties, property, temp, value, _i, _len, _ref3, _ref4;
      properties = [];
      _ref3 = this.value;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        property = _ref3[_i];
        name = property[0].cloneRemoveIs();
        value = property[1].cloneRemoveIs();
        if ((_ref4 = name.value) !== 'is' && _ref4 !== 'type' && _ref4 !== 'usage' && _ref4 !== 'displayName') {
          properties.push([name, value]);
        }
      }
      temp = new this.constructor(this.tag, properties, this.start_mark, this.end_mark, this.flow_style);
      return temp;
    };

    MappingNode.prototype.combine = function(resourceNode) {
      var name, node_has_property, nonNullNode, ownNodeProperty, ownNodePropertyName, resourceProperty, _i, _len, _ref3, _results;
      if (resourceNode.tag === 'tag:yaml.org,2002:null') {
        resourceNode = new exports.MappingNode('tag:yaml.org,2002:map', [], resourceNode.start_mark, resourceNode.end_mark);
      }
      if (!(resourceNode instanceof exports.MappingNode)) {
        throw new exports.ApplicationError('while applying node', null, 'different YAML structures', this.start_mark);
      }
      _ref3 = resourceNode.value;
      _results = [];
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        resourceProperty = _ref3[_i];
        name = resourceProperty[0].value;
        node_has_property = this.value.some(function(someProperty) {
          return (someProperty[0].value === name) || ((someProperty[0].value + '?') === name) || (someProperty[0].value === (name + '?'));
        });
        if (node_has_property) {
          _results.push((function() {
            var _j, _len1, _ref4, _results1;
            _ref4 = this.value;
            _results1 = [];
            for (_j = 0, _len1 = _ref4.length; _j < _len1; _j++) {
              ownNodeProperty = _ref4[_j];
              ownNodePropertyName = ownNodeProperty[0].value;
              if ((ownNodePropertyName === name) || ((ownNodePropertyName + '?') === name) || (ownNodePropertyName === (name + '?'))) {
                if ((ownNodeProperty[1].tag === 'tag:yaml.org,2002:null') && (resourceProperty[1].tag === 'tag:yaml.org,2002:map')) {
                  nonNullNode = new exports.MappingNode('tag:yaml.org,2002:map', [], ownNodeProperty[1].start_mark, ownNodeProperty[1].end_mark);
                  ownNodeProperty[1] = nonNullNode;
                }
                ownNodeProperty[1].combine(resourceProperty[1]);
                _results1.push(ownNodeProperty[0].value = ownNodeProperty[0].value.replace(/\?$/, ''));
              } else {
                _results1.push(void 0);
              }
            }
            return _results1;
          }).call(this));
        } else {
          _results.push(this.value.push([resourceProperty[0].clone(), resourceProperty[1].clone()]));
        }
      }
      return _results;
    };

    MappingNode.prototype.remove_question_mark_properties = function() {
      var property, _i, _len, _ref3, _results;
      this.value = this.value.filter(function(property) {
        return property[0].value.slice(-1) !== '?';
      });
      _ref3 = this.value;
      _results = [];
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        property = _ref3[_i];
        _results.push(property[1].remove_question_mark_properties());
      }
      return _results;
    };

    return MappingNode;

  })(this.CollectionNode);

}).call(this);

},{"./errors":1}],26:[function(require,module,exports){
(function() {
  var MarkedYAMLError, nodes, url, util, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  url = require('url');

  MarkedYAMLError = require('./errors').MarkedYAMLError;

  nodes = require('./nodes');

  util = require('./util');

  /*
  The Protocols throws these.
  */


  this.ProtocolError = (function(_super) {
    __extends(ProtocolError, _super);

    function ProtocolError() {
      _ref = ProtocolError.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return ProtocolError;

  })(MarkedYAMLError);

  /*
  The Protocols class deals with applying protocols to methods according to the spec
  */


  this.Protocols = (function() {
    function Protocols() {
      this.apply_protocols = __bind(this.apply_protocols, this);
    }

    Protocols.prototype.apply_protocols = function(node) {
      var protocols;
      if (protocols = this.apply_protocols_to_root(node)) {
        return this.apply_protocols_to_resources(node, protocols);
      }
    };

    Protocols.prototype.apply_protocols_to_root = function(node) {
      var baseUri, parsedBaseUri, protocol, protocols;
      if (this.has_property(node, 'protocols')) {
        return this.get_property(node, 'protocols');
      }
      if (!(baseUri = this.property_value(node, /^baseUri$/))) {
        return;
      }
      parsedBaseUri = url.parse(baseUri);
      protocol = (parsedBaseUri.protocol || 'http:').slice(0, -1).toUpperCase();
      protocols = [new nodes.ScalarNode('tag:yaml.org,2002:str', 'protocols', node.start_mark, node.end_mark), new nodes.SequenceNode('tag:yaml.org,2002:seq', [new nodes.ScalarNode('tag:yaml.org,2002:str', protocol, node.start_mark, node.end_mark)], node.start_mark, node.end_mark)];
      node.value.push(protocols);
      return protocols[1];
    };

    Protocols.prototype.apply_protocols_to_resources = function(node, protocols) {
      var resource, _i, _len, _ref1, _results;
      _ref1 = this.child_resources(node);
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        resource = _ref1[_i];
        this.apply_protocols_to_resources(resource, protocols);
        _results.push(this.apply_protocols_to_methods(resource, protocols));
      }
      return _results;
    };

    Protocols.prototype.apply_protocols_to_methods = function(node, protocols) {
      var method, _i, _len, _ref1, _results;
      _ref1 = this.child_methods(node[1]);
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        method = _ref1[_i];
        if (!this.has_property(method[1], 'protocols')) {
          if (!util.isMapping(method[1])) {
            method[1] = new nodes.MappingNode('tag:yaml.org,2002:map', [], method[1].start_mark, method[1].end_mark);
          }
          _results.push(method[1].value.push([new nodes.ScalarNode('tag:yaml.org,2002:str', 'protocols', method[0].start_mark, method[0].end_mark), protocols.clone()]));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return Protocols;

  })();

}).call(this);

},{"./errors":1,"./nodes":13,"./util":4,"url":7}],20:[function(require,module,exports){
(function() {
  var MarkedYAMLError, events, tokens, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  events = require('./events');

  MarkedYAMLError = require('./errors').MarkedYAMLError;

  tokens = require('./tokens');

  this.ParserError = (function(_super) {
    __extends(ParserError, _super);

    function ParserError() {
      _ref = ParserError.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return ParserError;

  })(MarkedYAMLError);

  this.Parser = (function() {
    var DEFAULT_TAGS;

    DEFAULT_TAGS = {
      '!': '!',
      '!!': 'tag:yaml.org,2002:'
    };

    function Parser() {
      this.current_event = null;
      this.yaml_version = null;
      this.tag_handles = {};
      this.states = [];
      this.marks = [];
      this.state = 'parse_stream_start';
    }

    /*
    Reset the state attributes.
    */


    Parser.prototype.dispose = function() {
      this.states = [];
      return this.state = null;
    };

    /*
    Check the type of the next event.
    */


    Parser.prototype.check_event = function() {
      var choice, choices, _i, _len;
      choices = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (this.current_event === null) {
        if (this.state != null) {
          this.current_event = this[this.state]();
        }
      }
      if (this.current_event !== null) {
        if (choices.length === 0) {
          return true;
        }
        for (_i = 0, _len = choices.length; _i < _len; _i++) {
          choice = choices[_i];
          if (this.current_event instanceof choice) {
            return true;
          }
        }
      }
      return false;
    };

    /*
    Get the next event.
    */


    Parser.prototype.peek_event = function() {
      if (this.current_event === null && (this.state != null)) {
        this.current_event = this[this.state]();
      }
      return this.current_event;
    };

    /*
    Get the event and proceed further.
    */


    Parser.prototype.get_event = function() {
      var event;
      if (this.current_event === null && (this.state != null)) {
        this.current_event = this[this.state]();
      }
      event = this.current_event;
      this.current_event = null;
      return event;
    };

    /*
    Parse the stream start.
    */


    Parser.prototype.parse_stream_start = function() {
      var event, token;
      token = this.get_token();
      event = new events.StreamStartEvent(token.start_mark, token.end_mark);
      this.state = 'parse_implicit_document_start';
      return event;
    };

    /*
    Parse an implicit document.
    */


    Parser.prototype.parse_implicit_document_start = function() {
      var end_mark, event, start_mark, token;
      if (!this.check_token(tokens.DirectiveToken, tokens.DocumentStartToken, tokens.StreamEndToken)) {
        this.tag_handles = DEFAULT_TAGS;
        token = this.peek_token();
        start_mark = end_mark = token.start_mark;
        event = new events.DocumentStartEvent(start_mark, end_mark, false);
        this.states.push('parse_document_end');
        this.state = 'parse_block_node';
        return event;
      } else {
        return this.parse_document_start();
      }
    };

    /*
    Parse an explicit document.
    */


    Parser.prototype.parse_document_start = function() {
      var end_mark, event, start_mark, tags, token, version, _ref1;
      while (this.check_token(tokens.DocumentEndToken)) {
        this.get_token();
      }
      if (!this.check_token(tokens.StreamEndToken)) {
        start_mark = this.peek_token().start_mark;
        _ref1 = this.process_directives(), version = _ref1[0], tags = _ref1[1];
        if (!this.check_token(tokens.DocumentStartToken)) {
          throw new exports.ParserError("expected '<document start>', but found " + (this.peek_token().id), this.peek_token().start_mark);
        }
        token = this.get_token();
        end_mark = token.end_mark;
        event = new events.DocumentStartEvent(start_mark, end_mark, true, version, tags);
        this.states.push('parse_document_end');
        this.state = 'parse_document_content';
      } else {
        token = this.get_token();
        event = new events.StreamEndEvent(token.start_mark, token.end_mark);
        if (this.states.length !== 0) {
          throw new Error('assertion error, states should be empty');
        }
        if (this.marks.length !== 0) {
          throw new Error('assertion error, marks should be empty');
        }
        this.state = null;
      }
      return event;
    };

    /*
    Parse the document end.
    */


    Parser.prototype.parse_document_end = function() {
      var end_mark, event, explicit, start_mark, token;
      token = this.peek_token();
      start_mark = end_mark = token.start_mark;
      explicit = false;
      if (this.check_token(tokens.DocumentEndToken)) {
        token = this.get_token();
        end_mark = token.end_mark;
        explicit = true;
      }
      event = new events.DocumentEndEvent(start_mark, end_mark, explicit);
      this.state = 'parse_document_start';
      return event;
    };

    Parser.prototype.parse_document_content = function() {
      var event;
      if (this.check_token(tokens.DirectiveToken, tokens.DocumentStartToken, tokens.DocumentEndToken, tokens.StreamEndToken)) {
        event = this.process_empty_scalar(this.peek_token().start_mark);
        this.state = this.states.pop();
        return event;
      } else {
        return this.parse_block_node();
      }
    };

    Parser.prototype.process_directives = function() {
      var handle, major, minor, prefix, tag_handles_copy, token, value, _ref1, _ref2, _ref3;
      this.yaml_version = null;
      this.tag_handles = {};
      while (this.check_token(tokens.DirectiveToken)) {
        token = this.get_token();
        if (token.name === 'YAML') {
          if (this.yaml_version !== null) {
            throw new exports.ParserError(null, null, 'found duplicate YAML directive', token.start_mark);
          }
          _ref1 = token.value, major = _ref1[0], minor = _ref1[1];
          if (major !== 1 || minor !== 2) {
            throw new exports.ParserError(null, null, 'found incompatible YAML document (version 1.2 is required)', token.start_mark);
          }
          this.yaml_version = token.value;
        } else if (token.name === 'TAG') {
          _ref2 = token.value, handle = _ref2[0], prefix = _ref2[1];
          if (handle in this.tag_handles) {
            throw new exports.ParserError(null, null, "duplicate tag handle " + handle, token.start_mark);
          }
          this.tag_handles[handle] = prefix;
        }
      }
      tag_handles_copy = null;
      _ref3 = this.tag_handles;
      for (handle in _ref3) {
        if (!__hasProp.call(_ref3, handle)) continue;
        prefix = _ref3[handle];
        if (tag_handles_copy == null) {
          tag_handles_copy = {};
        }
        tag_handles_copy[handle] = prefix;
      }
      value = [this.yaml_version, tag_handles_copy];
      for (handle in DEFAULT_TAGS) {
        if (!__hasProp.call(DEFAULT_TAGS, handle)) continue;
        prefix = DEFAULT_TAGS[handle];
        if (!(prefix in this.tag_handles)) {
          this.tag_handles[handle] = prefix;
        }
      }
      return value;
    };

    Parser.prototype.parse_block_node = function() {
      return this.parse_node(true);
    };

    Parser.prototype.parse_flow_node = function() {
      return this.parse_node();
    };

    Parser.prototype.parse_block_node_or_indentless_sequence = function() {
      return this.parse_node(true, true);
    };

    Parser.prototype.parse_node = function(block, indentless_sequence) {
      var anchor, end_mark, event, handle, implicit, node, start_mark, suffix, tag, tag_mark, token;
      if (block == null) {
        block = false;
      }
      if (indentless_sequence == null) {
        indentless_sequence = false;
      }
      if (this.check_token(tokens.AliasToken)) {
        token = this.get_token();
        event = new events.AliasEvent(token.value, token.start_mark, token.end_mark);
        this.state = this.states.pop();
      } else {
        anchor = null;
        tag = null;
        start_mark = end_mark = tag_mark = null;
        if (this.check_token(tokens.AnchorToken)) {
          token = this.get_token();
          start_mark = token.start_mark;
          end_mark = token.end_mark;
          anchor = token.value;
          if (this.check_token(tokens.TagToken)) {
            token = this.get_token();
            tag_mark = token.start_mark;
            end_mark = token.end_mark;
            tag = token.value;
          }
        } else if (this.check_token(tokens.TagToken)) {
          token = this.get_token();
          start_mark = tag_mark = token.start_mark;
          end_mark = token.end_mark;
          tag = token.value;
          if (this.check_token(tokens.AnchorToken)) {
            token = this.get_token();
            end_mark = token.end_mark;
            anchor = token.value;
          }
        }
        if (tag !== null) {
          handle = tag[0], suffix = tag[1];
          if (handle !== null) {
            if (!(handle in this.tag_handles)) {
              throw new exports.ParserError('while parsing a node', start_mark, "found undefined tag handle " + handle, tag_mark);
            }
            tag = this.tag_handles[handle] + suffix;
          } else {
            tag = suffix;
          }
        }
        if (start_mark === null) {
          start_mark = end_mark = this.peek_token().start_mark;
        }
        event = null;
        implicit = tag === null || tag === '!';
        if (indentless_sequence && this.check_token(tokens.BlockEntryToken)) {
          end_mark = this.peek_token().end_mark;
          event = new events.SequenceStartEvent(anchor, tag, implicit, start_mark, end_mark);
          this.state = 'parse_indentless_sequence_entry';
        } else {
          if (this.check_token(tokens.ScalarToken)) {
            token = this.get_token();
            end_mark = token.end_mark;
            if ((token.plain && tag === null) || tag === '!') {
              implicit = [true, false];
            } else if (tag === null) {
              implicit = [false, true];
            } else {
              implicit = [false, false];
            }
            event = new events.ScalarEvent(anchor, tag, implicit, token.value, start_mark, end_mark, token.style);
            this.state = this.states.pop();
          } else if (this.check_token(tokens.FlowSequenceStartToken)) {
            end_mark = this.peek_token().end_mark;
            event = new events.SequenceStartEvent(anchor, tag, implicit, start_mark, end_mark, true);
            this.state = 'parse_flow_sequence_first_entry';
          } else if (this.check_token(tokens.FlowMappingStartToken)) {
            end_mark = this.peek_token().end_mark;
            event = new events.MappingStartEvent(anchor, tag, implicit, start_mark, end_mark, true);
            this.state = 'parse_flow_mapping_first_key';
          } else if (block && this.check_token(tokens.BlockSequenceStartToken)) {
            end_mark = this.peek_token().end_mark;
            event = new events.SequenceStartEvent(anchor, tag, implicit, start_mark, end_mark, false);
            this.state = 'parse_block_sequence_first_entry';
          } else if (block && this.check_token(tokens.BlockMappingStartToken)) {
            end_mark = this.peek_token().end_mark;
            event = new events.MappingStartEvent(anchor, tag, implicit, start_mark, end_mark, false);
            this.state = 'parse_block_mapping_first_key';
          } else if (anchor !== null || tag !== null) {
            event = new events.ScalarEvent(anchor, tag, [implicit, false], '', start_mark, end_mark);
            this.state = this.states.pop();
          } else {
            if (block) {
              node = 'block';
            } else {
              node = 'flow';
            }
            token = this.peek_token();
            throw new exports.ParserError("while parsing a " + node + " node", start_mark, "expected the node content, but found " + token.id, token.start_mark);
          }
        }
      }
      return event;
    };

    Parser.prototype.parse_block_sequence_first_entry = function() {
      var token;
      token = this.get_token();
      this.marks.push(token.start_mark);
      return this.parse_block_sequence_entry();
    };

    Parser.prototype.parse_block_sequence_entry = function() {
      var event, token;
      if (this.check_token(tokens.BlockEntryToken)) {
        token = this.get_token();
        if (!this.check_token(tokens.BlockEntryToken, tokens.BlockEndToken)) {
          this.states.push('parse_block_sequence_entry');
          return this.parse_block_node();
        } else {
          this.state = 'parse_block_sequence_entry';
          return this.process_empty_scalar(token.end_mark);
        }
      }
      if (!this.check_token(tokens.BlockEndToken)) {
        token = this.peek_token();
        throw new exports.ParserError('while parsing a block collection', this.marks.slice(-1)[0], "expected <block end>, but found " + token.id, token.start_mark);
      }
      token = this.get_token();
      event = new events.SequenceEndEvent(token.start_mark, token.end_mark);
      this.state = this.states.pop();
      this.marks.pop();
      return event;
    };

    Parser.prototype.parse_indentless_sequence_entry = function() {
      var event, token;
      if (this.check_token(tokens.BlockEntryToken)) {
        token = this.get_token();
        if (!this.check_token(tokens.BlockEntryToken, tokens.KeyToken, tokens.ValueToken, tokens.BlockEndToken)) {
          this.states.push('parse_indentless_sequence_entry');
          return this.parse_block_node();
        } else {
          this.state = 'parse_indentless_sequence_entry';
          return this.process_empty_scalar(token.end_mark);
        }
      }
      token = this.peek_token();
      event = new events.SequenceEndEvent(token.start_mark, token.start_mark);
      this.state = this.states.pop();
      return event;
    };

    Parser.prototype.parse_block_mapping_first_key = function() {
      var token;
      token = this.get_token();
      this.marks.push(token.start_mark);
      return this.parse_block_mapping_key();
    };

    Parser.prototype.parse_block_mapping_key = function() {
      var event, token;
      if (this.check_token(tokens.KeyToken)) {
        token = this.get_token();
        if (!this.check_token(tokens.KeyToken, tokens.ValueToken, tokens.BlockEndToken)) {
          this.states.push('parse_block_mapping_value');
          return this.parse_block_node_or_indentless_sequence();
        } else {
          this.state = 'parse_block_mapping_value';
          return this.process_empty_scalar(token.end_mark);
        }
      }
      if (!this.check_token(tokens.BlockEndToken)) {
        token = this.peek_token();
        throw new exports.ParserError('while parsing a block mapping', this.marks.slice(-1)[0], "expected <block end>, but found " + token.id, token.start_mark);
      }
      token = this.get_token();
      event = new events.MappingEndEvent(token.start_mark, token.end_mark);
      this.state = this.states.pop();
      this.marks.pop();
      return event;
    };

    Parser.prototype.parse_block_mapping_value = function() {
      var token;
      if (this.check_token(tokens.ValueToken)) {
        token = this.get_token();
        if (!this.check_token(tokens.KeyToken, tokens.ValueToken, tokens.BlockEndToken)) {
          this.states.push('parse_block_mapping_key');
          return this.parse_block_node_or_indentless_sequence();
        } else {
          this.state = 'parse_block_mapping_key';
          return this.process_empty_scalar(token.end_mark);
        }
      } else {
        this.state = 'parse_block_mapping_key';
        token = this.peek_token();
        return this.process_empty_scalar(token.start_mark);
      }
    };

    Parser.prototype.parse_flow_sequence_first_entry = function() {
      var token;
      token = this.get_token();
      this.marks.push(token.start_mark);
      return this.parse_flow_sequence_entry(true);
    };

    Parser.prototype.parse_flow_sequence_entry = function(first) {
      var event, token;
      if (first == null) {
        first = false;
      }
      if (!this.check_token(tokens.FlowSequenceEndToken)) {
        if (!first) {
          if (this.check_token(tokens.FlowEntryToken)) {
            this.get_token();
          } else {
            token = this.peek_token();
            throw new exports.ParserError('while parsing a flow sequence', this.marks.slice(-1)[0], "expected ',' or ']', but got " + token.id, token.start_mark);
          }
        }
        if (this.check_token(tokens.KeyToken)) {
          token = this.peek_token();
          event = new events.MappingStartEvent(null, null, true, token.start_mark, token.end_mark, true);
          this.state = 'parse_flow_sequence_entry_mapping_key';
          return event;
        } else if (!this.check_token(tokens.FlowSequenceEndToken)) {
          this.states.push('parse_flow_sequence_entry');
          return this.parse_flow_node();
        }
      }
      token = this.get_token();
      event = new events.SequenceEndEvent(token.start_mark, token.end_mark);
      this.state = this.states.pop();
      this.marks.pop();
      return event;
    };

    Parser.prototype.parse_flow_sequence_entry_mapping_key = function() {
      var token;
      token = this.get_token();
      if (!this.check_token(tokens.ValueToken, tokens.FlowEntryToken, tokens.FlowSequenceEndToken)) {
        this.states.push('parse_flow_sequence_entry_mapping_value');
        return this.parse_flow_node();
      } else {
        this.state = 'parse_flow_sequence_entry_mapping_value';
        return this.process_empty_scalar(token.end_mark);
      }
    };

    Parser.prototype.parse_flow_sequence_entry_mapping_value = function() {
      var token;
      if (this.check_token(tokens.ValueToken)) {
        token = this.get_token();
        if (!this.check_token(tokens.FlowEntryToken, tokens.FlowSequenceEndToken)) {
          this.states.push('parse_flow_sequence_entry_mapping_end');
          return this.parse_flow_node();
        } else {
          this.state = 'parse_flow_sequence_entry_mapping_end';
          return this.process_empty_scalar(token.end_mark);
        }
      } else {
        this.state = 'parse_flow_sequence_entry_mapping_end';
        token = this.peek_token();
        return this.process_empty_scalar(token.start_mark);
      }
    };

    Parser.prototype.parse_flow_sequence_entry_mapping_end = function() {
      var token;
      this.state = 'parse_flow_sequence_entry';
      token = this.peek_token();
      return new events.MappingEndEvent(token.start_mark, token.start_mark);
    };

    Parser.prototype.parse_flow_mapping_first_key = function() {
      var token;
      token = this.get_token();
      this.marks.push(token.start_mark);
      return this.parse_flow_mapping_key(true);
    };

    Parser.prototype.parse_flow_mapping_key = function(first) {
      var event, token;
      if (first == null) {
        first = false;
      }
      if (!this.check_token(tokens.FlowMappingEndToken)) {
        if (!first) {
          if (this.check_token(tokens.FlowEntryToken)) {
            this.get_token();
          } else {
            token = this.peek_token();
            throw new exports.ParserError('while parsing a flow mapping', this.marks.slice(-1)[0], "expected ',' or '}', but got " + token.id, token.start_mark);
          }
        }
        if (this.check_token(tokens.KeyToken)) {
          token = this.get_token();
          if (!this.check_token(tokens.ValueToken, tokens.FlowEntryToken, tokens.FlowMappingEndToken)) {
            this.states.push('parse_flow_mapping_value');
            return this.parse_flow_node();
          } else {
            this.state = 'parse_flow_mapping_value';
            return this.process_empty_scalar(token.end_mark);
          }
        } else if (!this.check_token(tokens.FlowMappingEndToken)) {
          this.states.push('parse_flow_mapping_empty_value');
          return this.parse_flow_node();
        }
      }
      token = this.get_token();
      event = new events.MappingEndEvent(token.start_mark, token.end_mark);
      this.state = this.states.pop();
      this.marks.pop();
      return event;
    };

    Parser.prototype.parse_flow_mapping_value = function() {
      var token;
      if (this.check_token(tokens.ValueToken)) {
        token = this.get_token();
        if (!this.check_token(tokens.FlowEntryToken, tokens.FlowMappingEndToken)) {
          this.states.push('parse_flow_mapping_key');
          return this.parse_flow_node();
        } else {
          this.state = 'parse_flow_mapping_key';
          return this.process_empty_scalar(token.end_mark);
        }
      } else {
        this.state = 'parse_flow_mapping_key';
        token = this.peek_token();
        return this.process_empty_scalar(token.start_mark);
      }
    };

    Parser.prototype.parse_flow_mapping_empty_value = function() {
      this.state = 'parse_flow_mapping_key';
      return this.process_empty_scalar(this.peek_token().start_mark);
    };

    Parser.prototype.process_empty_scalar = function(mark) {
      return new events.ScalarEvent(null, null, [true, false], '', mark, mark);
    };

    return Parser;

  })();

}).call(this);

},{"./errors":1,"./events":2,"./tokens":3}],18:[function(require,module,exports){
(function() {
  var Mark, YAMLError, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require('./errors'), Mark = _ref.Mark, YAMLError = _ref.YAMLError;

  this.ReaderError = (function(_super) {
    __extends(ReaderError, _super);

    function ReaderError(name, position, character, reason) {
      this.name = name;
      this.position = position;
      this.character = character;
      this.reason = reason;
      ReaderError.__super__.constructor.call(this);
    }

    ReaderError.prototype.toString = function() {
      return "unacceptable character " + (this.character.charCodeAt()) + ": " + this.reason + "\n  in \"" + this.name + "\", position " + this.position;
    };

    return ReaderError;

  })(YAMLError);

  /*
  Reader:
    checks if characters are within the allowed range
    add '\x00' to the end
  */


  this.Reader = (function() {
    var NON_PRINTABLE;

    NON_PRINTABLE = /[^\x09\x0A\x0D\x20-\x7E\x85\xA0-\uD7FF\uE000-\uFFFD]/;

    function Reader(string, src) {
      this.string = string;
      this.src = src;
      this.line = 0;
      this.column = 0;
      this.index = 0;
      this.check_printable();
      this.string += '\x00';
    }

    Reader.prototype.peek = function(index) {
      if (index == null) {
        index = 0;
      }
      return this.string[this.index + index];
    };

    Reader.prototype.prefix = function(length) {
      if (length == null) {
        length = 1;
      }
      return this.string.slice(this.index, this.index + length);
    };

    Reader.prototype.forward = function(length) {
      var char, _results;
      if (length == null) {
        length = 1;
      }
      _results = [];
      while (length) {
        char = this.string[this.index];
        this.index++;
        if (__indexOf.call('\n\x85\u2082\u2029', char) >= 0 || (char === '\r' && this.string[this.index] !== '\n')) {
          this.line++;
          this.column = 0;
        } else {
          this.column++;
        }
        _results.push(length--);
      }
      return _results;
    };

    Reader.prototype.create_mark = function(line, column) {
      if (line == null) {
        line = this.line;
      }
      if (column == null) {
        column = this.column;
      }
      return new Mark(this.src, line, column, this.string, this.index);
    };

    Reader.prototype.get_mark = function() {
      return this.create_mark();
    };

    Reader.prototype.check_printable = function() {
      var character, match, position;
      match = NON_PRINTABLE.exec(this.string);
      if (match) {
        character = match[0];
        position = (this.string.length - this.index) + match.index;
        throw new exports.ReaderError(this.name, position, character.charCodeAt(), 'special characters are not allowed');
      }
    };

    return Reader;

  })();

}).call(this);

},{"./errors":1}],21:[function(require,module,exports){
(function() {
  var YAMLError, nodes, util, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  nodes = require('./nodes');

  util = require('./util');

  YAMLError = require('./errors').YAMLError;

  this.ResolverError = (function(_super) {
    __extends(ResolverError, _super);

    function ResolverError() {
      _ref = ResolverError.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return ResolverError;

  })(YAMLError);

  this.BaseResolver = (function() {
    var DEFAULT_MAPPING_TAG, DEFAULT_SCALAR_TAG, DEFAULT_SEQUENCE_TAG;

    DEFAULT_SCALAR_TAG = 'tag:yaml.org,2002:str';

    DEFAULT_SEQUENCE_TAG = 'tag:yaml.org,2002:seq';

    DEFAULT_MAPPING_TAG = 'tag:yaml.org,2002:map';

    BaseResolver.prototype.yaml_implicit_resolvers = {};

    BaseResolver.prototype.yaml_path_resolvers = {};

    BaseResolver.add_implicit_resolver = function(tag, regexp, first) {
      var char, _base, _i, _len, _results;
      if (first == null) {
        first = [null];
      }
      if (!this.prototype.hasOwnProperty('yaml_implicit_resolvers')) {
        this.prototype.yaml_implicit_resolvers = util.extend({}, this.prototype.yaml_implicit_resolvers);
      }
      _results = [];
      for (_i = 0, _len = first.length; _i < _len; _i++) {
        char = first[_i];
        _results.push(((_base = this.prototype.yaml_implicit_resolvers)[char] != null ? (_base = this.prototype.yaml_implicit_resolvers)[char] : _base[char] = []).push([tag, regexp]));
      }
      return _results;
    };

    function BaseResolver() {
      this.resolver_exact_paths = [];
      this.resolver_prefix_paths = [];
    }

    BaseResolver.prototype.descend_resolver = function(current_node, current_index) {
      var depth, exact_paths, kind, path, prefix_paths, _i, _j, _len, _len1, _ref1, _ref2, _ref3, _ref4;
      if (util.is_empty(this.yaml_path_resolvers)) {
        return;
      }
      exact_paths = {};
      prefix_paths = [];
      if (current_node) {
        depth = this.resolver_prefix_paths.length;
        _ref1 = this.resolver_prefix_paths.slice(-1)[0];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          _ref2 = _ref1[_i], path = _ref2[0], kind = _ref2[1];
          if (this.check_resolver_prefix(depth, path, kind, current_node, current_index)) {
            if (path.length > depth) {
              prefix_paths.push([path, kind]);
            } else {
              exact_paths[kind] = this.yaml_path_resolvers[path][kind];
            }
          }
        }
      } else {
        _ref3 = this.yaml_path_resolvers;
        for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
          _ref4 = _ref3[_j], path = _ref4[0], kind = _ref4[1];
          if (!path) {
            exact_paths[kind] = this.yaml_path_resolvers[path][kind];
          } else {
            prefix_paths.push([path, kind]);
          }
        }
      }
      this.resolver_exact_paths.push(exact_paths);
      return this.resolver_prefix_paths.push(prefix_paths);
    };

    BaseResolver.prototype.ascend_resolver = function() {
      if (util.is_empty(this.yaml_path_resolvers)) {
        return;
      }
      this.resolver_exact_paths.pop();
      return this.resolver_prefix_paths.pop();
    };

    BaseResolver.prototype.check_resolver_prefix = function(depth, path, kind, current_node, current_index) {
      var index_check, node_check, _ref1;
      _ref1 = path[depth - 1], node_check = _ref1[0], index_check = _ref1[1];
      if (typeof node_check === 'string') {
        if (current_node.tag !== node_check) {
          return;
        }
      } else if (node_check !== null) {
        if (!(current_node instanceof node_check)) {
          return;
        }
      }
      if (index_check === true && current_index !== null) {
        return;
      }
      if ((index_check === false || index_check === null) && current_index === null) {
        return;
      }
      if (typeof index_check === 'string') {
        if (!(current_index instanceof nodes.ScalarNode) && index_check === current_index.value) {
          return;
        }
      } else if (typeof index_check === 'number') {
        if (index_check !== current_index) {
          return;
        }
      }
      return true;
    };

    BaseResolver.prototype.resolve = function(kind, value, implicit) {
      var empty, exact_paths, k, regexp, resolvers, tag, _i, _len, _ref1, _ref2, _ref3, _ref4;
      if (kind === nodes.ScalarNode && implicit[0]) {
        if (value === '') {
          resolvers = (_ref1 = this.yaml_implicit_resolvers['']) != null ? _ref1 : [];
        } else {
          resolvers = (_ref2 = this.yaml_implicit_resolvers[value[0]]) != null ? _ref2 : [];
        }
        resolvers = resolvers.concat((_ref3 = this.yaml_implicit_resolvers[null]) != null ? _ref3 : []);
        for (_i = 0, _len = resolvers.length; _i < _len; _i++) {
          _ref4 = resolvers[_i], tag = _ref4[0], regexp = _ref4[1];
          if (value.match(regexp)) {
            return tag;
          }
        }
        implicit = implicit[1];
      }
      empty = true;
      for (k in this.yaml_path_resolvers) {
        if ({}[k] == null) {
          empty = false;
        }
      }
      if (!empty) {
        exact_paths = this.resolver_exact_paths.slice(-1)[0];
        if (__indexOf.call(exact_paths, kind) >= 0) {
          return exact_paths[kind];
        }
        if (__indexOf.call(exact_paths, null) >= 0) {
          return exact_paths[null];
        }
      }
      if (kind === nodes.ScalarNode) {
        return DEFAULT_SCALAR_TAG;
      }
      if (kind === nodes.SequenceNode) {
        return DEFAULT_SEQUENCE_TAG;
      }
      if (kind === nodes.MappingNode) {
        return DEFAULT_MAPPING_TAG;
      }
    };

    return BaseResolver;

  })();

  this.Resolver = (function(_super) {
    __extends(Resolver, _super);

    function Resolver() {
      _ref1 = Resolver.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    return Resolver;

  })(this.BaseResolver);

  this.Resolver.add_implicit_resolver('tag:yaml.org,2002:bool', /^(?:yes|Yes|YES|true|True|TRUE|on|On|ON|no|No|NO|false|False|FALSE|off|Off|OFF)$/, 'yYnNtTfFoO');

  this.Resolver.add_implicit_resolver('tag:yaml.org,2002:float', /^(?:[-+]?(?:[0-9][0-9_]*)\.[0-9_]*(?:[eE][-+][0-9]+)?|\.[0-9_]+(?:[eE][-+][0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*|[-+]?\.(?:inf|Inf|INF)|\.(?:nan|NaN|NAN))$/, '-+0123456789.');

  this.Resolver.add_implicit_resolver('tag:yaml.org,2002:int', /^(?:[-+]?0b[01_]+|[-+]?0[0-7_]+|[-+]?(?:0|[1-9][0-9_]*)|[-+]?0x[0-9a-fA-F_]+|[-+]?0o[0-7_]+|[-+]?[1-9][0-9_]*(?::[0-5]?[0-9])+)$/, '-+0123456789');

  this.Resolver.add_implicit_resolver('tag:yaml.org,2002:merge', /^(?:<<)$/, '<');

  this.Resolver.add_implicit_resolver('tag:yaml.org,2002:null', /^(?:~|null|Null|NULL|)$/, ['~', 'n', 'N', '']);

  this.Resolver.add_implicit_resolver('tag:yaml.org,2002:timestamp', /^(?:[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]|[0-9][0-9][0-9][0-9]-[0-9][0-9]?-[0-9][0-9]?(?:[Tt]|[\x20\t]+)[0-9][0-9]?:[0-9][0-9]:[0-9][0-9](?:\.[0-9]*)?(?:[\x20\t]*(?:Z|[-+][0-9][0-9]?(?::[0-9][0-9])?))?)$/, '0123456789');

  this.Resolver.add_implicit_resolver('tag:yaml.org,2002:value', /^(?:=)$/, '=');

  this.Resolver.add_implicit_resolver('tag:yaml.org,2002:yaml', /^(?:!|&|\*)$/, '!&*');

}).call(this);

},{"./errors":1,"./nodes":13,"./util":4}],24:[function(require,module,exports){
(function() {
  var MarkedYAMLError, nodes, util, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  MarkedYAMLError = require('./errors').MarkedYAMLError;

  nodes = require('./nodes');

  util = require('./util');

  /*
  The ResourceTypes throws these.
  */


  this.ResourceTypeError = (function(_super) {
    __extends(ResourceTypeError, _super);

    function ResourceTypeError() {
      _ref = ResourceTypeError.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return ResourceTypeError;

  })(MarkedYAMLError);

  /*
  The ResourceTypes class deals with applying ResourceTypes to resources according to the spec
  */


  this.ResourceTypes = (function() {
    function ResourceTypes() {
      this.apply_parameters_to_type = __bind(this.apply_parameters_to_type, this);
      this.apply_type = __bind(this.apply_type, this);
      this.apply_types = __bind(this.apply_types, this);
      this.get_type = __bind(this.get_type, this);
      this.has_types = __bind(this.has_types, this);
      this.load_types = __bind(this.load_types, this);
      this.declaredTypes = {};
    }

    ResourceTypes.prototype.load_types = function(node) {
      var allTypes,
        _this = this;
      this.load_default_media_type(node);
      if (this.has_property(node, 'resourceTypes')) {
        allTypes = this.property_value(node, 'resourceTypes');
        if (allTypes && typeof allTypes === 'object') {
          return allTypes.forEach(function(type_item) {
            if (type_item && typeof type_item === 'object' && typeof type_item.value === 'object') {
              return type_item.value.forEach(function(type) {
                return _this.declaredTypes[type[0].value] = type;
              });
            }
          });
        }
      }
    };

    ResourceTypes.prototype.has_types = function(node) {
      if (Object.keys(this.declaredTypes).length === 0 && this.has_property(node, 'resourceTypes')) {
        this.load_types(node);
      }
      return Object.keys(this.declaredTypes).length > 0;
    };

    ResourceTypes.prototype.get_type = function(typeName) {
      return this.declaredTypes[typeName];
    };

    ResourceTypes.prototype.apply_types = function(node, resourceUri) {
      var resources,
        _this = this;
      if (resourceUri == null) {
        resourceUri = "";
      }
      if (!util.isMapping(node)) {
        return;
      }
      if (this.has_types(node)) {
        resources = this.child_resources(node);
        return resources.forEach(function(resource) {
          var type;
          _this.apply_default_media_type_to_resource(resource[1]);
          if (_this.has_property(resource[1], 'type')) {
            type = _this.get_property(resource[1], 'type');
            _this.apply_type(resourceUri + resource[0].value, resource, type);
          }
          return _this.apply_types(resource[1], resourceUri + resource[0].value);
        });
      } else {
        resources = this.child_resources(node);
        return resources.forEach(function(resource) {
          return _this.apply_default_media_type_to_resource(resource[1]);
        });
      }
    };

    ResourceTypes.prototype.apply_type = function(resourceUri, resource, typeKey) {
      var tempType;
      tempType = this.resolve_inheritance_chain(resourceUri, typeKey);
      tempType.combine(resource[1]);
      resource[1] = tempType;
      return resource[1].remove_question_mark_properties();
    };

    ResourceTypes.prototype.resolve_inheritance_chain = function(resourceUri, typeKey) {
      var baseType, childType, childTypeName, childTypeProperty, compiledTypes, inheritsFrom, parentType, parentTypeName, pathToCircularRef, result, rootType, typesToApply;
      childTypeName = this.key_or_value(typeKey);
      childType = this.apply_parameters_to_type(resourceUri, childTypeName, typeKey);
      typesToApply = [childTypeName];
      compiledTypes = {};
      compiledTypes[childTypeName] = childType;
      this.apply_default_media_type_to_resource(childType);
      this.apply_traits_to_resource(resourceUri, childType, false);
      while (this.has_property(childType, 'type')) {
        typeKey = this.get_property(childType, 'type');
        parentTypeName = this.key_or_value(typeKey);
        if (parentTypeName in compiledTypes) {
          pathToCircularRef = typesToApply.concat(parentTypeName).join(' -> ');
          childTypeProperty = this.get_type(childTypeName)[0];
          throw new exports.ResourceTypeError('while applying resourceTypes', null, "circular reference of \"" + parentTypeName + "\" has been detected: " + pathToCircularRef, childTypeProperty.start_mark);
        }
        parentType = this.apply_parameters_to_type(resourceUri, parentTypeName, typeKey);
        this.apply_default_media_type_to_resource(parentType);
        this.apply_traits_to_resource(resourceUri, parentType, false);
        childTypeName = parentTypeName;
        childType = parentType;
        compiledTypes[childTypeName] = childType;
        typesToApply.push(childTypeName);
      }
      rootType = typesToApply.pop();
      baseType = compiledTypes[rootType].cloneForResourceType();
      result = baseType;
      while (inheritsFrom = typesToApply.pop()) {
        baseType = compiledTypes[inheritsFrom].cloneForResourceType();
        result.combine(baseType);
      }
      return result;
    };

    ResourceTypes.prototype.apply_parameters_to_type = function(resourceUri, typeName, typeKey) {
      var parameters, type;
      if (!(type = this.get_type(typeName))) {
        throw new exports.ResourceTypeError('while applying parameters', null, "there is no resource type named " + typeName, typeKey.start_mark);
      }
      type = type[1].clone();
      parameters = this._get_parameters_from_type_key(resourceUri, typeKey);
      this.apply_parameters(type, parameters, typeKey);
      return type;
    };

    ResourceTypes.prototype._get_parameters_from_type_key = function(resourceUri, typeKey) {
      var parameters, result,
        _this = this;
      result = {
        resourcePath: resourceUri.replace(/\/\/*/g, '/')
      };
      if (!util.isMapping(typeKey)) {
        return result;
      }
      parameters = this.value_or_undefined(typeKey);
      if (!util.isNull(parameters[0][1])) {
        parameters[0][1].value.forEach(function(parameter) {
          var _ref1;
          if (!util.isScalar(parameter[1])) {
            throw new exports.ResourceTypeError('while applying parameters', null, 'parameter value is not a scalar', parameter[1].start_mark);
          }
          if ((_ref1 = parameter[1].value) === "methodName" || _ref1 === "resourcePath" || _ref1 === "resourcePathName") {
            throw new exports.ResourceTypeError('while applying parameters', null, 'invalid parameter name "methodName", "resourcePath" are reserved parameter names "resourcePathName"', parameter[1].start_mark);
          }
          return result[parameter[0].value] = parameter[1].value;
        });
      }
      return result;
    };

    return ResourceTypes;

  })();

}).call(this);

},{"./errors":1,"./nodes":13,"./util":4}],19:[function(require,module,exports){
(function() {
  var MarkedYAMLError, SimpleKey, tokens, util, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  MarkedYAMLError = require('./errors').MarkedYAMLError;

  tokens = require('./tokens');

  util = require('./util');

  /*
  The Scanner throws these.
  */


  this.ScannerError = (function(_super) {
    __extends(ScannerError, _super);

    function ScannerError() {
      _ref = ScannerError.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return ScannerError;

  })(MarkedYAMLError);

  /*
  Represents a possible simple key.
  */


  SimpleKey = (function() {
    function SimpleKey(token_number, required, index, line, column, mark) {
      this.token_number = token_number;
      this.required = required;
      this.index = index;
      this.line = line;
      this.column = column;
      this.mark = mark;
    }

    return SimpleKey;

  })();

  /*
  The Scanner class deals with converting a YAML stream into a token stream.
  */


  this.Scanner = (function() {
    var C_LB, C_NUMBERS, C_WS, ESCAPE_CODES, ESCAPE_REPLACEMENTS, RAML_VERSION, RAML_VERSION_RE;

    C_LB = '\r\n\x85\u2028\u2029';

    C_WS = '\t ';

    C_NUMBERS = '0123456789';

    ESCAPE_REPLACEMENTS = {
      '0': '\x00',
      'a': '\x07',
      'b': '\x08',
      't': '\x09',
      '\t': '\x09',
      'n': '\x0A',
      'v': '\x0B',
      'f': '\x0C',
      'r': '\x0D',
      'e': '\x1B',
      ' ': '\x20',
      '"': '"',
      '\\': '\\',
      'N': '\x85',
      '_': '\xA0',
      'L': '\u2028',
      'P': '\u2029'
    };

    ESCAPE_CODES = {
      'x': 2,
      'u': 4,
      'U': 8
    };

    RAML_VERSION = '#%RAML 0.8';

    RAML_VERSION_RE = /^#%RAML .+$/;

    /*
    Initialise the Scanner
    */


    function Scanner(validateHeader) {
      if (validateHeader == null) {
        validateHeader = false;
      }
      this.done = false;
      this.ramlHeaderFound = !validateHeader;
      this.flow_level = 0;
      this.tokens = [];
      this.fetch_stream_start();
      this.tokens_taken = 0;
      this.indent = -1;
      this.indents = [];
      this.allow_simple_key = true;
      this.possible_simple_keys = {};
    }

    /*
    Check if the next token is one of the given types.
    */


    Scanner.prototype.check_token = function() {
      var choice, choices, _i, _len;
      choices = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      while (this.need_more_tokens()) {
        this.fetch_more_tokens();
      }
      if (this.tokens.length !== 0) {
        if (choices.length === 0) {
          return true;
        }
        for (_i = 0, _len = choices.length; _i < _len; _i++) {
          choice = choices[_i];
          if (this.tokens[0] instanceof choice) {
            return true;
          }
        }
      }
      return false;
    };

    /*
    Return the next token, but do not delete it from the queue.
    */


    Scanner.prototype.peek_token = function() {
      while (this.need_more_tokens()) {
        this.fetch_more_tokens();
      }
      if (this.tokens.length !== 0) {
        return this.tokens[0];
      }
    };

    /*
    Return the next token, and remove it from the queue.
    */


    Scanner.prototype.get_token = function() {
      while (this.need_more_tokens()) {
        this.fetch_more_tokens();
      }
      if (this.tokens.length !== 0) {
        this.tokens_taken++;
        return this.tokens.shift();
      }
    };

    Scanner.prototype.need_more_tokens = function() {
      if (this.done) {
        return false;
      }
      if (this.tokens.length === 0) {
        return true;
      }
      this.stale_possible_simple_keys();
      if (this.next_possible_simple_key() === this.tokens_taken) {
        return true;
      }
      return false;
    };

    Scanner.prototype.fetch_more_tokens = function() {
      var char;
      this.scan_to_next_token();
      this.stale_possible_simple_keys();
      this.unwind_indent(this.column);
      char = this.peek();
      if (char === '\x00') {
        return this.fetch_stream_end();
      }
      if (char === '%' && this.check_directive()) {
        return this.fetch_directive();
      }
      if (char === '-' && this.check_document_start()) {
        return this.fetch_document_start();
      }
      if (char === '.' && this.check_document_end()) {
        return this.fetch_document_end();
      }
      if (char === '[') {
        return this.fetch_flow_sequence_start();
      }
      if (char === '{') {
        return this.fetch_flow_mapping_start();
      }
      if (char === ']') {
        return this.fetch_flow_sequence_end();
      }
      if (char === '}') {
        return this.fetch_flow_mapping_end();
      }
      if (char === ',') {
        return this.fetch_flow_entry();
      }
      if (char === '-' && this.check_block_entry()) {
        return this.fetch_block_entry();
      }
      if (char === '?' && this.check_key()) {
        return this.fetch_key();
      }
      if (char === ':' && this.check_value()) {
        return this.fetch_value();
      }
      if (char === '*') {
        return this.fetch_alias();
      }
      if (char === '&') {
        return this.fetch_anchor();
      }
      if (char === '!') {
        return this.fetch_tag();
      }
      if (char === '|' && this.flow_level === 0) {
        return this.fetch_literal();
      }
      if (char === '>' && this.flow_level === 0) {
        return this.fetch_folded();
      }
      if (char === '\'') {
        return this.fetch_single();
      }
      if (char === '"') {
        return this.fetch_double();
      }
      if (this.check_plain()) {
        return this.fetch_plain();
      }
      throw new exports.ScannerError('while scanning for the next token', null, "found character " + char + " that cannot start any token", this.get_mark());
    };

    /*
    Return the number of the nearest possible simple key.
    */


    Scanner.prototype.next_possible_simple_key = function() {
      var key, level, min_token_number, _ref1;
      min_token_number = null;
      _ref1 = this.possible_simple_keys;
      for (level in _ref1) {
        if (!__hasProp.call(_ref1, level)) continue;
        key = _ref1[level];
        if (min_token_number === null || key.token_number < min_token_number) {
          min_token_number = key.token_number;
        }
      }
      return min_token_number;
    };

    /*
    Remove entries that are no longer possible simple keys.  According to the
    YAML spec, simple keys:
      should be limited to a single line
      should be no longer than 1024 characters
    Disabling this procedure will allow simple keys of any length and height
    (may cause problems if indentation is broken though).
    */


    Scanner.prototype.stale_possible_simple_keys = function() {
      var key, level, _ref1, _results;
      _ref1 = this.possible_simple_keys;
      _results = [];
      for (level in _ref1) {
        if (!__hasProp.call(_ref1, level)) continue;
        key = _ref1[level];
        if (key.line === this.line && this.index - key.index <= 1024) {
          continue;
        }
        if (!key.required) {
          _results.push(delete this.possible_simple_keys[level]);
        } else {
          throw new exports.ScannerError('while scanning a simple key', key.mark, 'could not find expected \':\'', this.get_mark());
        }
      }
      return _results;
    };

    /*
    The next token may start a simple key.  We check if it's possible and save
    its position.  This function is called for ALIAS, ANCHOR, TAG,
    SCALAR (flow),'[' and '{'.
    */


    Scanner.prototype.save_possible_simple_key = function() {
      var required, token_number;
      required = this.flow_level === 0 && this.indent === this.column;
      if (required && !this.allow_simple_key) {
        throw new Error('logic failure');
      }
      if (!this.allow_simple_key) {
        return;
      }
      this.remove_possible_simple_key();
      token_number = this.tokens_taken + this.tokens.length;
      return this.possible_simple_keys[this.flow_level] = new SimpleKey(token_number, required, this.index, this.line, this.column, this.get_mark());
    };

    /*
    Remove the saved possible simple key at the current flow level.
    */


    Scanner.prototype.remove_possible_simple_key = function() {
      var key;
      if (!(key = this.possible_simple_keys[this.flow_level])) {
        return;
      }
      if (!key.required) {
        return delete this.possible_simple_keys[this.flow_level];
      } else {
        throw new exports.ScannerError('while scanning a simple key', key.mark, 'could not find expected \':\'', this.get_mark());
      }
    };

    /*
    In flow context, tokens should respect indentation.
    Actually the condition should be `self.indent >= column` according to
    the spec. But this condition will prohibit intuitively correct
    constructions such as
      key : {
      }
    */


    Scanner.prototype.unwind_indent = function(column) {
      var mark, _results;
      if (this.flow_level !== 0) {
        return;
      }
      _results = [];
      while (this.indent > column) {
        mark = this.get_mark();
        this.indent = this.indents.pop();
        _results.push(this.tokens.push(new tokens.BlockEndToken(mark, mark)));
      }
      return _results;
    };

    /*
    Check if we need to increase indentation.
    */


    Scanner.prototype.add_indent = function(column) {
      if (!(column > this.indent)) {
        return false;
      }
      this.indents.push(this.indent);
      this.indent = column;
      return true;
    };

    Scanner.prototype.fetch_stream_start = function() {
      var mark;
      mark = this.get_mark();
      return this.tokens.push(new tokens.StreamStartToken(mark, mark, this.encoding));
    };

    Scanner.prototype.fetch_stream_end = function() {
      var mark;
      this.unwind_indent(-1);
      this.remove_possible_simple_key();
      this.allow_possible_simple_key = false;
      this.possible_simple_keys = {};
      mark = this.get_mark();
      this.tokens.push(new tokens.StreamEndToken(mark, mark));
      return this.done = true;
    };

    Scanner.prototype.fetch_directive = function() {
      this.unwind_indent(-1);
      this.remove_possible_simple_key();
      this.allow_simple_key = false;
      return this.tokens.push(this.scan_directive());
    };

    Scanner.prototype.fetch_document_start = function() {
      return this.fetch_document_indicator(tokens.DocumentStartToken);
    };

    Scanner.prototype.fetch_document_end = function() {
      return this.fetch_document_indicator(tokens.DocumentEndToken);
    };

    Scanner.prototype.fetch_document_indicator = function(TokenClass) {
      var start_mark;
      this.unwind_indent(-1);
      this.remove_possible_simple_key();
      this.allow_simple_key = false;
      start_mark = this.get_mark();
      this.forward(3);
      return this.tokens.push(new TokenClass(start_mark, this.get_mark()));
    };

    Scanner.prototype.fetch_flow_sequence_start = function() {
      return this.fetch_flow_collection_start(tokens.FlowSequenceStartToken);
    };

    Scanner.prototype.fetch_flow_mapping_start = function() {
      return this.fetch_flow_collection_start(tokens.FlowMappingStartToken);
    };

    Scanner.prototype.fetch_flow_collection_start = function(TokenClass) {
      var start_mark;
      this.save_possible_simple_key();
      this.flow_level++;
      this.allow_simple_key = true;
      start_mark = this.get_mark();
      this.forward();
      return this.tokens.push(new TokenClass(start_mark, this.get_mark()));
    };

    Scanner.prototype.fetch_flow_sequence_end = function() {
      return this.fetch_flow_collection_end(tokens.FlowSequenceEndToken);
    };

    Scanner.prototype.fetch_flow_mapping_end = function() {
      return this.fetch_flow_collection_end(tokens.FlowMappingEndToken);
    };

    Scanner.prototype.fetch_flow_collection_end = function(TokenClass) {
      var start_mark;
      this.remove_possible_simple_key();
      this.flow_level--;
      this.allow_simple_key = false;
      start_mark = this.get_mark();
      this.forward();
      return this.tokens.push(new TokenClass(start_mark, this.get_mark()));
    };

    Scanner.prototype.fetch_flow_entry = function() {
      var start_mark;
      this.allow_simple_key = true;
      this.remove_possible_simple_key();
      start_mark = this.get_mark();
      this.forward();
      return this.tokens.push(new tokens.FlowEntryToken(start_mark, this.get_mark()));
    };

    Scanner.prototype.fetch_block_entry = function() {
      var mark, start_mark;
      if (this.flow_level === 0) {
        if (!this.allow_simple_key) {
          throw new exports.ScannerError(null, null, 'sequence entries are not allowed here', this.get_mark());
        }
        if (this.add_indent(this.column)) {
          mark = this.get_mark();
          this.tokens.push(new tokens.BlockSequenceStartToken(mark, mark));
        }
      }
      this.allow_simple_key = true;
      this.remove_possible_simple_key();
      start_mark = this.get_mark();
      this.forward();
      return this.tokens.push(new tokens.BlockEntryToken(start_mark, this.get_mark()));
    };

    Scanner.prototype.fetch_key = function() {
      var mark, start_mark;
      if (this.flow_level === 0) {
        if (!this.allow_simple_key) {
          throw new exports.ScannerError(null, null, 'mapping keys are not allowed here', this.get_mark());
        }
        if (this.add_indent(this.column)) {
          mark = this.get_mark();
          this.tokens.push(new tokens.BlockMappingStartToken(mark, mark));
        }
      }
      this.allow_simple_key = !this.flow_level;
      this.remove_possible_simple_key();
      start_mark = this.get_mark();
      this.forward();
      return this.tokens.push(new tokens.KeyToken(start_mark, this.get_mark()));
    };

    Scanner.prototype.fetch_value = function() {
      var key, mark, start_mark;
      if (key = this.possible_simple_keys[this.flow_level]) {
        delete this.possible_simple_keys[this.flow_level];
        this.tokens.splice(key.token_number - this.tokens_taken, 0, new tokens.KeyToken(key.mark, key.mark));
        if (this.flow_level === 0) {
          if (this.add_indent(key.column)) {
            this.tokens.splice(key.token_number - this.tokens_taken, 0, new tokens.BlockMappingStartToken(key.mark, key.mark));
          }
        }
        this.allow_simple_key = false;
      } else {
        if (this.flow_level === 0) {
          if (!this.allow_simple_key) {
            throw new exports.ScannerError(null, null, 'mapping values are not allowed here', this.get_mark());
          }
          if (this.add_indent(this.column)) {
            mark = this.get_mark();
            this.tokens.push(new tokens.BlockMappingStartToken(mark, mark));
          }
        }
        this.allow_simple_key = !this.flow_level;
        this.remove_possible_simple_key();
      }
      start_mark = this.get_mark();
      this.forward();
      return this.tokens.push(new tokens.ValueToken(start_mark, this.get_mark()));
    };

    Scanner.prototype.fetch_alias = function() {
      this.save_possible_simple_key();
      this.allow_simple_key = false;
      return this.tokens.push(this.scan_anchor(tokens.AliasToken));
    };

    Scanner.prototype.fetch_anchor = function() {
      this.save_possible_simple_key();
      this.allow_simple_key = false;
      return this.tokens.push(this.scan_anchor(tokens.AnchorToken));
    };

    Scanner.prototype.fetch_tag = function() {
      this.save_possible_simple_key();
      this.allow_simple_key = false;
      return this.tokens.push(this.scan_tag());
    };

    Scanner.prototype.fetch_literal = function() {
      return this.fetch_block_scalar('|');
    };

    Scanner.prototype.fetch_folded = function() {
      return this.fetch_block_scalar('>');
    };

    Scanner.prototype.fetch_block_scalar = function(style) {
      this.allow_simple_key = true;
      this.remove_possible_simple_key();
      return this.tokens.push(this.scan_block_scalar(style));
    };

    Scanner.prototype.fetch_single = function() {
      return this.fetch_flow_scalar('\'');
    };

    Scanner.prototype.fetch_double = function() {
      return this.fetch_flow_scalar('"');
    };

    Scanner.prototype.fetch_flow_scalar = function(style) {
      this.save_possible_simple_key();
      this.allow_simple_key = false;
      return this.tokens.push(this.scan_flow_scalar(style));
    };

    Scanner.prototype.fetch_plain = function() {
      this.save_possible_simple_key();
      this.allow_simple_key = false;
      return this.tokens.push(this.scan_plain());
    };

    /*
    DIRECTIVE: ^ '%'
    */


    Scanner.prototype.check_directive = function() {
      if (this.column === 0) {
        return true;
      }
      return false;
    };

    /*
    DOCUMENT-START: ^ '---' (' '|'\n')
    */


    Scanner.prototype.check_document_start = function() {
      var _ref1;
      if (this.column === 0 && this.prefix(3) === '---' && (_ref1 = this.peek(3), __indexOf.call(C_LB + C_WS + '\x00', _ref1) >= 0)) {
        return true;
      }
      return false;
    };

    /*
    DOCUMENT-END: ^ '...' (' '|'\n')
    */


    Scanner.prototype.check_document_end = function() {
      var _ref1;
      if (this.column === 0 && this.prefix(3) === '...' && (_ref1 = this.peek(3), __indexOf.call(C_LB + C_WS + '\x00', _ref1) >= 0)) {
        return true;
      }
      return false;
    };

    /*
    BLOCK-ENTRY: '-' (' '|'\n')
    */


    Scanner.prototype.check_block_entry = function() {
      var _ref1;
      return _ref1 = this.peek(1), __indexOf.call(C_LB + C_WS + '\x00', _ref1) >= 0;
    };

    /*
    KEY (flow context):  '?'
    KEY (block context): '?' (' '|'\n')
    */


    Scanner.prototype.check_key = function() {
      var _ref1;
      if (this.flow_level !== 0) {
        return true;
      }
      return _ref1 = this.peek(1), __indexOf.call(C_LB + C_WS + '\x00', _ref1) >= 0;
    };

    /*
    VALUE (flow context):  ':'
    VALUE (block context): ':' (' '|'\n')
    */


    Scanner.prototype.check_value = function() {
      var _ref1;
      if (this.flow_level !== 0) {
        return true;
      }
      return _ref1 = this.peek(1), __indexOf.call(C_LB + C_WS + '\x00', _ref1) >= 0;
    };

    /*
    A plain scalar may start with any non-space character except:
      '-', '?', ':', ',', '[', ']', '{', '}',
      '#', '&', '*', '!', '|', '>', '\'', '"',
      '%', '@', '`'.
    
    It may also start with
      '-', '?', ':'
    if it is followed by a non-space character.
    
    Note that we limit the last rule to the block context (except the '-'
    character) because we want the flow context to be space independent.
    */


    Scanner.prototype.check_plain = function() {
      var char, _ref1;
      char = this.peek();
      return __indexOf.call(C_LB + C_WS + '\x00-?:,[]{}#&*!|>\'"%@`', char) < 0 || ((_ref1 = this.peek(1), __indexOf.call(C_LB + C_WS + '\x00', _ref1) < 0) && (char === '-' || (this.flow_level === 0 && __indexOf.call('?:', char) >= 0)));
    };

    /*
    We ignore spaces, line breaks and comments.
    If we find a line break in the block context, we set the flag
    `allow_simple_key` on.
    The byte order mark is stripped if it's the first character in the stream.
    We do not yet support BOM inside the stream as the specification requires.
    Any such mark will be considered as a part of the document.
    
    TODO: We need to make tab handling rules more sane.  A good rule is
      Tabs cannot precede tokens BLOCK-SEQUENCE-START, BLOCK-MAPPING-START,
      BLOCK-END, KEY (block context), VALUE (block context), BLOCK-ENTRY
    So the tab checking code is
      @allow_simple_key = off if <TAB>
    We also need to add the check for `allow_simple_key is on` to
    `unwind_indent` before issuing BLOCK-END.  Scanners for block, flow and
    plain scalars need to be modified.
    */


    Scanner.prototype.scan_to_next_token = function() {
      var comment, found, _ref1, _results;
      if (this.index === 0 && this.peek() === '\uFEFF') {
        this.forward();
      }
      found = false;
      _results = [];
      while (!found) {
        while (this.peek() === ' ') {
          this.forward();
        }
        comment = '';
        if (this.peek() === '#') {
          while (_ref1 = this.peek(), __indexOf.call(C_LB + '\x00', _ref1) < 0) {
            if (!this.ramlHeaderFound) {
              comment += this.peek();
            }
            this.forward();
          }
        }
        if (!this.ramlHeaderFound) {
          if (comment && RAML_VERSION_RE.test(comment)) {
            if (comment === RAML_VERSION) {
              this.ramlHeaderFound = true;
            } else {
              throw new exports.ScannerError('version validation', null, "Unsupported RAML version: '" + comment + "'", this.create_mark(0, 0));
            }
          } else {
            throw new exports.ScannerError('version validation', null, "The first line must be: '" + RAML_VERSION + "'", this.create_mark(0, 0));
          }
        }
        if (this.scan_line_break()) {
          if (this.flow_level === 0) {
            _results.push(this.allow_simple_key = true);
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(found = true);
        }
      }
      return _results;
    };

    /*
    See the specification for details.
    */


    Scanner.prototype.scan_directive = function() {
      var end_mark, name, start_mark, value, _ref1;
      start_mark = this.get_mark();
      this.forward();
      name = this.scan_directive_name(start_mark);
      value = null;
      if (name === 'YAML') {
        value = this.scan_yaml_directive_value(start_mark);
        end_mark = this.get_mark();
      } else if (name === 'TAG') {
        value = this.scan_tag_directive_value(start_mark);
        end_mark = this.get_mark();
      } else {
        end_mark = this.get_mark();
        while (_ref1 = this.peek(), __indexOf.call(C_LB + '\x00', _ref1) < 0) {
          this.forward();
        }
      }
      this.scan_directive_ignored_line(start_mark);
      return new tokens.DirectiveToken(name, value, start_mark, end_mark);
    };

    /*
    See the specification for details.
    */


    Scanner.prototype.scan_directive_name = function(start_mark) {
      var char, length, value;
      length = 0;
      char = this.peek(length);
      while (('0' <= char && char <= '9') || ('A' <= char && char <= 'Z') || ('a' <= char && char <= 'z') || __indexOf.call('-_', char) >= 0) {
        length++;
        char = this.peek(length);
      }
      if (length === 0) {
        throw new exports.ScannerError('while scanning a directive', start_mark, "expected alphanumeric or numeric character but found " + char, this.get_mark());
      }
      value = this.prefix(length);
      this.forward(length);
      char = this.peek();
      if (__indexOf.call(C_LB + '\x00 ', char) < 0) {
        throw new exports.ScannerError('while scanning a directive', start_mark, "expected alphanumeric or numeric character but found " + char, this.get_mark());
      }
      return value;
    };

    /*
    See the specification for details.
    */


    Scanner.prototype.scan_yaml_directive_value = function(start_mark) {
      var major, minor, _ref1;
      while (this.peek() === ' ') {
        this.forward();
      }
      major = this.scan_yaml_directive_number(start_mark);
      if (this.peek() !== '.') {
        throw new exports.ScannerError('while scanning a directive', start_mark, "expected a digit or '.' but found " + (this.peek()), this.get_mark());
      }
      this.forward();
      minor = this.scan_yaml_directive_number(start_mark);
      if (_ref1 = this.peek(), __indexOf.call(C_LB + '\x00 ', _ref1) < 0) {
        throw new exports.ScannerError('while scanning a directive', start_mark, "expected a digit or ' ' but found " + (this.peek()), this.get_mark());
      }
      return [major, minor];
    };

    /*
    See the specification for details.
    */


    Scanner.prototype.scan_yaml_directive_number = function(start_mark) {
      var char, length, value, _ref1;
      char = this.peek();
      if (!(('0' <= char && char <= '9'))) {
        throw new exports.ScannerError('while scanning a directive', start_mark, "expected a digit but found " + char, this.get_mark());
      }
      length = 0;
      while (('0' <= (_ref1 = this.peek(length)) && _ref1 <= '9')) {
        length++;
      }
      value = parseInt(this.prefix(length));
      this.forward(length);
      return value;
    };

    /*
    See the specification for details.
    */


    Scanner.prototype.scan_tag_directive_value = function(start_mark) {
      var handle, prefix;
      while (this.peek() === ' ') {
        this.forward();
      }
      handle = this.scan_tag_directive_handle(start_mark);
      while (this.peek() === ' ') {
        this.forward();
      }
      prefix = this.scan_tag_directive_prefix(start_mark);
      return [handle, prefix];
    };

    /*
    See the specification for details.
    */


    Scanner.prototype.scan_tag_directive_handle = function(start_mark) {
      var char, value;
      value = this.scan_tag_handle('directive', start_mark);
      char = this.peek();
      if (char !== ' ') {
        throw new exports.ScannerError('while scanning a directive', start_mark, "expected ' ' but found " + char, this.get_mark());
      }
      return value;
    };

    /*
    See the specification for details.
    */


    Scanner.prototype.scan_tag_directive_prefix = function(start_mark) {
      var char, value;
      value = this.scan_tag_uri('directive', start_mark);
      char = this.peek();
      if (__indexOf.call(C_LB + '\x00 ', char) < 0) {
        throw new exports.ScannerError('while scanning a directive', start_mark, "expected ' ' but found " + char, this.get_mark());
      }
      return value;
    };

    /*
    See the specification for details.
    */


    Scanner.prototype.scan_directive_ignored_line = function(start_mark) {
      var char, _ref1;
      while (this.peek() === ' ') {
        this.forward();
      }
      if (this.peek() === '#') {
        while (_ref1 = this.peek(), __indexOf.call(C_LB + '\x00', _ref1) < 0) {
          this.forward();
        }
      }
      char = this.peek();
      if (__indexOf.call(C_LB + '\x00', char) < 0) {
        throw new exports.ScannerError('while scanning a directive', start_mark, "expected a comment or a line break but found " + char, this.get_mark());
      }
      return this.scan_line_break();
    };

    /*
    The specification does not restrict characters for anchors and aliases.
    This may lead to problems, for instance, the document:
      [ *alias, value ]
    can be interpteted in two ways, as
      [ "value" ]
    and
      [ *alias , "value" ]
    Therefore we restrict aliases to numbers and ASCII letters.
    */


    Scanner.prototype.scan_anchor = function(TokenClass) {
      var char, indicator, length, name, start_mark, value;
      start_mark = this.get_mark();
      indicator = this.peek();
      if (indicator === '*') {
        name = 'alias';
      } else {
        name = 'anchor';
      }
      this.forward();
      length = 0;
      char = this.peek(length);
      while (('0' <= char && char <= '9') || ('A' <= char && char <= 'Z') || ('a' <= char && char <= 'z') || __indexOf.call('-_', char) >= 0) {
        length++;
        char = this.peek(length);
      }
      if (length === 0) {
        throw new exports.ScannerError("while scanning an " + name, start_mark, "expected alphabetic or numeric character but found '" + char + "'", this.get_mark());
      }
      value = this.prefix(length);
      this.forward(length);
      char = this.peek();
      if (__indexOf.call(C_LB + C_WS + '\x00' + '?:,]}%@`', char) < 0) {
        throw new exports.ScannerError("while scanning an " + name, start_mark, "expected alphabetic or numeric character but found '" + char + "'", this.get_mark());
      }
      return new TokenClass(value, start_mark, this.get_mark());
    };

    /*
    See the specification for details.
    */


    Scanner.prototype.scan_tag = function() {
      var char, handle, length, start_mark, suffix, use_handle;
      start_mark = this.get_mark();
      char = this.peek(1);
      if (char === '<') {
        handle = null;
        this.forward(2);
        suffix = this.scan_tag_uri('tag', start_mark);
        if (this.peek() !== '>') {
          throw new exports.ScannerError('while parsing a tag', start_mark, "expected '>' but found " + (this.peek()), this.get_mark());
        }
        this.forward();
      } else if (__indexOf.call(C_LB + C_WS + '\x00', char) >= 0) {
        handle = null;
        suffix = '!';
        this.forward();
      } else {
        length = 1;
        use_handle = false;
        while (__indexOf.call(C_LB + '\x00 ', char) < 0) {
          if (char === '!') {
            use_handle = true;
            break;
          }
          length++;
          char = this.peek(length);
        }
        if (use_handle) {
          handle = this.scan_tag_handle('tag', start_mark);
        } else {
          handle = '!';
          this.forward();
        }
        suffix = this.scan_tag_uri('tag', start_mark);
      }
      char = this.peek();
      if (__indexOf.call(C_LB + '\x00 ', char) < 0) {
        throw new exports.ScannerError('while scanning a tag', start_mark, "expected ' ' but found " + char, this.get_mark());
      }
      return new tokens.TagToken([handle, suffix], start_mark, this.get_mark());
    };

    /*
    See the specification for details.
    */


    Scanner.prototype.scan_block_scalar = function(style) {
      var breaks, chomping, chunks, end_mark, folded, increment, indent, leading_non_space, length, line_break, max_indent, min_indent, start_mark, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
      folded = style === '>';
      chunks = [];
      start_mark = this.get_mark();
      this.forward();
      _ref1 = this.scan_block_scalar_indicators(start_mark), chomping = _ref1[0], increment = _ref1[1];
      this.scan_block_scalar_ignored_line(start_mark);
      min_indent = this.indent + 1;
      if (min_indent < 1) {
        min_indent = 1;
      }
      if (increment == null) {
        _ref2 = this.scan_block_scalar_indentation(), breaks = _ref2[0], max_indent = _ref2[1], end_mark = _ref2[2];
        indent = Math.max(min_indent, max_indent);
      } else {
        indent = min_indent + increment - 1;
        _ref3 = this.scan_block_scalar_breaks(indent), breaks = _ref3[0], end_mark = _ref3[1];
      }
      line_break = '';
      while (this.column === indent && this.peek() !== '\x00') {
        chunks = chunks.concat(breaks);
        leading_non_space = (_ref4 = this.peek(), __indexOf.call(' \t', _ref4) < 0);
        length = 0;
        while (_ref5 = this.peek(length), __indexOf.call(C_LB + '\x00', _ref5) < 0) {
          length++;
        }
        chunks.push(this.prefix(length));
        this.forward(length);
        line_break = this.scan_line_break();
        _ref6 = this.scan_block_scalar_breaks(indent), breaks = _ref6[0], end_mark = _ref6[1];
        if (this.column === indent && this.peek() !== '\x00') {
          if (folded && line_break === '\n' && leading_non_space && (_ref7 = this.peek(), __indexOf.call(' \t', _ref7) < 0)) {
            if (util.is_empty(breaks)) {
              chunks.push(' ');
            }
          } else {
            chunks.push(line_break);
          }
        } else {
          break;
        }
      }
      if (chomping !== false) {
        chunks.push(line_break);
      }
      if (chomping === true) {
        chunks = chunks.concat(breaks);
      }
      return new tokens.ScalarToken(chunks.join(''), false, start_mark, end_mark, style);
    };

    /*
    See the specification for details.
    */


    Scanner.prototype.scan_block_scalar_indicators = function(start_mark) {
      var char, chomping, increment;
      chomping = null;
      increment = null;
      char = this.peek();
      if (__indexOf.call('+-', char) >= 0) {
        chomping = char === '+';
        this.forward();
        char = this.peek();
        if (__indexOf.call(C_NUMBERS, char) >= 0) {
          increment = parseInt(char);
          if (increment === 0) {
            throw new exports.ScannerError('while scanning a block scalar', start_mark, 'expected indentation indicator in the range 1-9 but found 0', this.get_mark());
          }
          this.forward();
        }
      } else if (__indexOf.call(C_NUMBERS, char) >= 0) {
        increment = parseInt(char);
        if (increment === 0) {
          throw new exports.ScannerError('while scanning a block scalar', start_mark, 'expected indentation indicator in the range 1-9 but found 0', this.get_mark());
        }
        this.forward();
        char = this.peek();
        if (__indexOf.call('+-', char) >= 0) {
          chomping = char === '+';
          this.forward();
        }
      }
      char = this.peek();
      if (__indexOf.call(C_LB + '\x00 ', char) < 0) {
        throw new exports.ScannerError('while scanning a block scalar', start_mark, "expected chomping or indentation indicators, but found " + char, this.get_mark());
      }
      return [chomping, increment];
    };

    /*
    See the specification for details.
    */


    Scanner.prototype.scan_block_scalar_ignored_line = function(start_mark) {
      var char, _ref1;
      while (this.peek() === ' ') {
        this.forward();
      }
      if (this.peek() === '#') {
        while (_ref1 = this.peek(), __indexOf.call(C_LB + '\x00', _ref1) < 0) {
          this.forward();
        }
      }
      char = this.peek();
      if (__indexOf.call(C_LB + '\x00', char) < 0) {
        throw new exports.ScannerError('while scanning a block scalar', start_mark, "expected a comment or a line break but found " + char, this.get_mark());
      }
      return this.scan_line_break();
    };

    /*
    See the specification for details.
    */


    Scanner.prototype.scan_block_scalar_indentation = function() {
      var chunks, end_mark, max_indent, _ref1;
      chunks = [];
      max_indent = 0;
      end_mark = this.get_mark();
      while (_ref1 = this.peek(), __indexOf.call(C_LB + ' ', _ref1) >= 0) {
        if (this.peek() !== ' ') {
          chunks.push(this.scan_line_break());
          end_mark = this.get_mark();
        } else {
          this.forward();
          if (this.column > max_indent) {
            max_indent = this.column;
          }
        }
      }
      return [chunks, max_indent, end_mark];
    };

    /*
    See the specification for details.
    */


    Scanner.prototype.scan_block_scalar_breaks = function(indent) {
      var chunks, end_mark, _ref1;
      chunks = [];
      end_mark = this.get_mark();
      while (this.column < indent && this.peek() === ' ') {
        this.forward();
      }
      while (_ref1 = this.peek(), __indexOf.call(C_LB, _ref1) >= 0) {
        chunks.push(this.scan_line_break());
        end_mark = this.get_mark();
        while (this.column < indent && this.peek() === ' ') {
          this.forward();
        }
      }
      return [chunks, end_mark];
    };

    /*
    See the specification for details.
    Note that we loose indentation rules for quoted scalars. Quoted scalars
    don't need to adhere indentation because " and ' clearly mark the beginning
    and the end of them. Therefore we are less restrictive than the
    specification requires. We only need to check that document separators are
    not included in scalars.
    */


    Scanner.prototype.scan_flow_scalar = function(style) {
      var chunks, double, quote, start_mark;
      double = style === '"';
      chunks = [];
      start_mark = this.get_mark();
      quote = this.peek();
      this.forward();
      chunks = chunks.concat(this.scan_flow_scalar_non_spaces(double, start_mark));
      while (this.peek() !== quote) {
        chunks = chunks.concat(this.scan_flow_scalar_spaces(double, start_mark));
        chunks = chunks.concat(this.scan_flow_scalar_non_spaces(double, start_mark));
      }
      this.forward();
      return new tokens.ScalarToken(chunks.join(''), false, start_mark, this.get_mark(), style);
    };

    /*
    See the specification for details.
    */


    Scanner.prototype.scan_flow_scalar_non_spaces = function(double, start_mark) {
      var char, chunks, code, k, length, _i, _ref1, _ref2;
      chunks = [];
      while (true) {
        length = 0;
        while (_ref1 = this.peek(length), __indexOf.call(C_LB + C_WS + '\'"\\\x00', _ref1) < 0) {
          length++;
        }
        if (length !== 0) {
          chunks.push(this.prefix(length));
          this.forward(length);
        }
        char = this.peek();
        if (!double && char === '\'' && this.peek(1) === '\'') {
          chunks.push('\'');
          this.forward(2);
        } else if ((double && char === '\'') || (!double && __indexOf.call('"\\', char) >= 0)) {
          chunks.push(char);
          this.forward();
        } else if (double && char === '\\') {
          this.forward();
          char = this.peek();
          if (char in ESCAPE_REPLACEMENTS) {
            chunks.push(ESCAPE_REPLACEMENTS[char]);
            this.forward();
          } else if (char in ESCAPE_CODES) {
            length = ESCAPE_CODES[char];
            this.forward();
            for (k = _i = 0; 0 <= length ? _i < length : _i > length; k = 0 <= length ? ++_i : --_i) {
              if (_ref2 = this.peek(k), __indexOf.call(C_NUMBERS + 'ABCDEFabcdef', _ref2) < 0) {
                throw new exports.ScannerError('while scanning a double-quoted scalar', start_mark, "expected escape sequence of " + length + " hexadecimal numbers, but found " + (this.peek(k)), this.get_mark());
              }
            }
            code = parseInt(this.prefix(length), 16);
            chunks.push(String.fromCharCode(code));
            this.forward(length);
          } else if (__indexOf.call(C_LB, char) >= 0) {
            this.scan_line_break();
            chunks = chunks.concat(this.scan_flow_scalar_breaks(double, start_mark));
          } else {
            throw new exports.ScannerError('while scanning a double-quoted scalar', start_mark, "found unknown escape character " + char, this.get_mark());
          }
        } else {
          return chunks;
        }
      }
    };

    /*
    See the specification for details.
    */


    Scanner.prototype.scan_flow_scalar_spaces = function(double, start_mark) {
      var breaks, char, chunks, length, line_break, whitespaces, _ref1;
      chunks = [];
      length = 0;
      while (_ref1 = this.peek(length), __indexOf.call(C_WS, _ref1) >= 0) {
        length++;
      }
      whitespaces = this.prefix(length);
      this.forward(length);
      char = this.peek();
      if (char === '\x00') {
        throw new exports.ScannerError('while scanning a quoted scalar', start_mark, 'found unexpected end of stream', this.get_mark());
      }
      if (__indexOf.call(C_LB, char) >= 0) {
        line_break = this.scan_line_break();
        breaks = this.scan_flow_scalar_breaks(double, start_mark);
        if (line_break !== '\n') {
          chunks.push(line_break);
        } else if (!breaks) {
          chunks.push(' ');
        }
        chunks = chunks.concat(breaks);
      } else {
        chunks.push(whitespaces);
      }
      return chunks;
    };

    /*
    See the specification for details.
    */


    Scanner.prototype.scan_flow_scalar_breaks = function(double, start_mark) {
      var chunks, prefix, _ref1, _ref2, _ref3;
      chunks = [];
      while (true) {
        prefix = this.prefix(3);
        if (prefix === '---' || prefix === '...' && (_ref1 = this.peek(3), __indexOf.call(C_LB + C_WS + '\x00', _ref1) >= 0)) {
          throw new exports.ScannerError('while scanning a quoted scalar', start_mark, 'found unexpected document separator', this.get_mark());
        }
        while (_ref2 = this.peek(), __indexOf.call(C_WS, _ref2) >= 0) {
          this.forward();
        }
        if (_ref3 = this.peek(), __indexOf.call(C_LB, _ref3) >= 0) {
          chunks.push(this.scan_line_break());
        } else {
          return chunks;
        }
      }
    };

    /*
    See the specification for details.
    We add an additional restriction for the flow context:
      plain scalars in the flow context cannot contain ',', ':' and '?'.
    We also keep track of the `allow_simple_key` flag here.
    Indentation rules are loosed for the flow context.
    */


    Scanner.prototype.scan_plain = function() {
      var char, chunks, end_mark, indent, length, spaces, start_mark, _ref1, _ref2;
      chunks = [];
      start_mark = end_mark = this.get_mark();
      indent = this.indent + 1;
      spaces = [];
      while (true) {
        length = 0;
        if (this.peek() === '#') {
          break;
        }
        while (true) {
          char = this.peek(length);
          if (__indexOf.call(C_LB + C_WS + '\x00', char) >= 0 || (this.flow_level === 0 && char === ':' && (_ref1 = this.peek(length + 1), __indexOf.call(C_LB + C_WS + '\x00', _ref1) >= 0)) || (this.flow_level !== 0 && __indexOf.call(',:?[]{}', char) >= 0)) {
            break;
          }
          length++;
        }
        if (this.flow_level !== 0 && char === ':' && (_ref2 = this.peek(length + 1), __indexOf.call(C_LB + C_WS + '\x00,[]{}', _ref2) < 0)) {
          this.forward(length);
          throw new exports.ScannerError('while scanning a plain scalar', start_mark, 'found unexpected \':\'', this.get_mark(), 'Please check http://pyyaml.org/wiki/YAMLColonInFlowContext');
        }
        if (length === 0) {
          break;
        }
        this.allow_simple_key = false;
        chunks = chunks.concat(spaces);
        chunks.push(this.prefix(length));
        this.forward(length);
        end_mark = this.get_mark();
        spaces = this.scan_plain_spaces(indent, start_mark);
        if ((spaces == null) || spaces.length === 0 || this.peek() === '#' || (this.flow_level === 0 && this.column < indent)) {
          break;
        }
      }
      return new tokens.ScalarToken(chunks.join(''), true, start_mark, end_mark);
    };

    /*
    See the specification for details.
    The specification is really confusing about tabs in plain scalars.
    We just forbid them completely. Do not use tabs in YAML!
    */


    Scanner.prototype.scan_plain_spaces = function(indent, start_mark) {
      var breaks, char, chunks, length, line_break, prefix, whitespaces, _ref1, _ref2;
      chunks = [];
      length = 0;
      while (_ref1 = this.peek(length), __indexOf.call(' ', _ref1) >= 0) {
        length++;
      }
      whitespaces = this.prefix(length);
      this.forward(length);
      char = this.peek();
      if (__indexOf.call(C_LB, char) >= 0) {
        line_break = this.scan_line_break();
        this.allow_simple_key = true;
        prefix = this.prefix(3);
        if (prefix === '---' || prefix === '...' && this.peek(__indexOf.call(C_LB + C_WS + '\x00', 3) >= 0)) {
          return;
        }
        breaks = [];
        while (_ref2 = this.peek(), __indexOf.call(C_LB + ' ', _ref2) >= 0) {
          if (this.peek() === ' ') {
            this.forward();
          } else {
            breaks.push(this.scan_line_break());
            prefix = this.prefix(3);
            if (prefix === '---' || prefix === '...' && this.peek(__indexOf.call(C_LB + C_WS + '\x00', 3) >= 0)) {
              return;
            }
          }
        }
        if (line_break !== '\n') {
          chunks.push(line_break);
        } else if (breaks.length === 0) {
          chunks.push(' ');
        }
        chunks = chunks.concat(breaks);
      } else if (whitespaces) {
        chunks.push(whitespaces);
      }
      return chunks;
    };

    /*
    See the specification for details.
    For some strange reasons, the specification does not allow '_' in tag
    handles. I have allowed it anyway.
    */


    Scanner.prototype.scan_tag_handle = function(name, start_mark) {
      var char, length, value;
      char = this.peek();
      if (char !== '!') {
        throw new exports.ScannerError("while scanning a " + name, start_mark, "expected '!' but found " + char, this.get_mark());
      }
      length = 1;
      char = this.peek(length);
      if (char !== ' ') {
        while (('0' <= char && char <= '9') || ('A' <= char && char <= 'Z') || ('a' <= char && char <= 'z') || __indexOf.call('-_', char) >= 0) {
          length++;
          char = this.peek(length);
        }
        if (char !== '!') {
          this.forward(length);
          throw new exports.ScannerError("while scanning a " + name, start_mark, "expected '!' but found " + char, this.get_mark());
        }
        length++;
      }
      value = this.prefix(length);
      this.forward(length);
      return value;
    };

    /*
    See the specification for details.
    Note: we do not check if URI is well-formed.
    */


    Scanner.prototype.scan_tag_uri = function(name, start_mark) {
      var char, chunks, length;
      chunks = [];
      length = 0;
      char = this.peek(length);
      while (('0' <= char && char <= '9') || ('A' <= char && char <= 'Z') || ('a' <= char && char <= 'z') || __indexOf.call('-;/?:@&=+$,_.!~*\'()[]%', char) >= 0) {
        if (char === '%') {
          chunks.push(this.prefix(length));
          this.forward(length);
          length = 0;
          chunks.push(this.scan_uri_escapes(name, start_mark));
        } else {
          length++;
        }
        char = this.peek(length);
      }
      if (length !== 0) {
        chunks.push(this.prefix(length));
        this.forward(length);
        length = 0;
      }
      if (chunks.length === 0) {
        throw new exports.ScannerError("while parsing a " + name, start_mark, "expected URI but found " + char, this.get_mark());
      }
      return chunks.join('');
    };

    /*
    See the specification for details.
    */


    Scanner.prototype.scan_uri_escapes = function(name, start_mark) {
      var bytes, k, mark, _i;
      bytes = [];
      mark = this.get_mark();
      while (this.peek() === '%') {
        this.forward();
        for (k = _i = 0; _i <= 2; k = ++_i) {
          throw new exports.ScannerError("while scanning a " + name, start_mark, "expected URI escape sequence of 2 hexadecimal numbers but found          " + (this.peek(k)), this.get_mark());
        }
        bytes.push(String.fromCharCode(parseInt(this.prefix(2), 16)));
        this.forward(2);
      }
      return bytes.join('');
    };

    /*
    Transforms:
      '\r\n'      :   '\n'
      '\r'        :   '\n'
      '\n'        :   '\n'
      '\x85'      :   '\n'
      '\u2028'    :   '\u2028'
      '\u2029     :   '\u2029'
      default     :   ''
    */


    Scanner.prototype.scan_line_break = function() {
      var char;
      char = this.peek();
      if (__indexOf.call('\r\n\x85', char) >= 0) {
        if (this.prefix(2) === '\r\n') {
          this.forward(2);
        } else {
          this.forward();
        }
        return '\n';
      } else if (__indexOf.call('\u2028\u2029', char) >= 0) {
        this.forward();
        return char;
      }
      return '';
    };

    return Scanner;

  })();

}).call(this);

},{"./errors":1,"./tokens":3,"./util":4}],25:[function(require,module,exports){
(function() {
  var MarkedYAMLError, nodes, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  MarkedYAMLError = require('./errors').MarkedYAMLError;

  nodes = require('./nodes');

  /*
  The Schemas throws these.
  */


  this.SchemaError = (function(_super) {
    __extends(SchemaError, _super);

    function SchemaError() {
      _ref = SchemaError.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return SchemaError;

  })(MarkedYAMLError);

  /*
    The Schemas class deals with applying schemas to resources according to the spec
  */


  this.Schemas = (function() {
    function Schemas() {
      this.get_schemas_used = __bind(this.get_schemas_used, this);
      this.apply_schemas = __bind(this.apply_schemas, this);
      this.get_all_schemas = __bind(this.get_all_schemas, this);
      this.has_schemas = __bind(this.has_schemas, this);
      this.load_schemas = __bind(this.load_schemas, this);
      this.declaredSchemas = {};
    }

    Schemas.prototype.load_schemas = function(node) {
      var allSchemas,
        _this = this;
      if (this.has_property(node, "schemas")) {
        allSchemas = this.property_value(node, "schemas");
        if (allSchemas && typeof allSchemas === "object") {
          return allSchemas.forEach(function(schema_entry) {
            if (schema_entry && typeof schema_entry === "object" && typeof schema_entry.value === "object") {
              return schema_entry.value.forEach(function(schema) {
                return _this.declaredSchemas[schema[0].value] = schema;
              });
            }
          });
        }
      }
    };

    Schemas.prototype.has_schemas = function(node) {
      if (this.declaredSchemas.length === 0 && this.has_property(node, "schemas")) {
        this.load_schemas(node);
      }
      return Object.keys(this.declaredSchemas).length > 0;
    };

    Schemas.prototype.get_all_schemas = function() {
      return this.declaredSchemas;
    };

    Schemas.prototype.apply_schemas = function(node) {
      var resources, schemas,
        _this = this;
      resources = this.child_resources(node);
      schemas = this.get_schemas_used(resources);
      return schemas.forEach(function(schema) {
        if (schema[1].value in _this.declaredSchemas) {
          return schema[1].value = _this.declaredSchemas[schema[1].value][1].value;
        }
      });
    };

    Schemas.prototype.get_schemas_used = function(resources) {
      var schemas,
        _this = this;
      schemas = [];
      resources.forEach(function(resource) {
        var properties;
        properties = _this.get_properties(resource[1], "schema");
        return schemas = schemas.concat(properties);
      });
      return schemas;
    };

    return Schemas;

  })();

}).call(this);

},{"./errors":1,"./nodes":13}],27:[function(require,module,exports){
(function() {
  var MarkedYAMLError, nodes, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  MarkedYAMLError = require('./errors').MarkedYAMLError;

  nodes = require('./nodes');

  /*
  The Schemas throws these.
  */


  this.SecuritySchemeError = (function(_super) {
    __extends(SecuritySchemeError, _super);

    /*
      The Schemas class deals with applying schemas to resources according to the spec
    */


    function SecuritySchemeError() {
      _ref = SecuritySchemeError.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return SecuritySchemeError;

  })(MarkedYAMLError);

  this.SecuritySchemes = (function() {
    function SecuritySchemes() {
      this.get_security_scheme = __bind(this.get_security_scheme, this);
      this.get_all_schemes = __bind(this.get_all_schemes, this);
      this.has_schemes = __bind(this.has_schemes, this);
      this.load_security_schemes = __bind(this.load_security_schemes, this);
      this.declaredSchemes = {};
    }

    SecuritySchemes.prototype.load_security_schemes = function(node) {
      var allschemes,
        _this = this;
      if (this.has_property(node, "securitySchemes")) {
        allschemes = this.property_value(node, "securitySchemes");
        if (allschemes && typeof allschemes === "object") {
          return allschemes.forEach(function(scheme_entry) {
            if (scheme_entry.tag === 'tag:yaml.org,2002:map') {
              return scheme_entry.value.forEach(function(scheme) {
                return _this.declaredSchemes[scheme[0].value] = scheme[1].value;
              });
            }
          });
        }
      }
    };

    SecuritySchemes.prototype.has_schemes = function(node) {
      if (this.declaredSchemes.length === 0 && this.has_property(node, "schemes")) {
        this.load_schemes(node);
      }
      return Object.keys(this.declaredSchemes).length > 0;
    };

    SecuritySchemes.prototype.get_all_schemes = function() {
      return this.declaredSchemes;
    };

    SecuritySchemes.prototype.get_security_scheme = function(schemaName) {
      return this.declaredSchemes[schemaName];
    };

    return SecuritySchemes;

  })();

}).call(this);

},{"./errors":1,"./nodes":13}],8:[function(require,module,exports){

/**
 * Object#toString() ref for stringify().
 */

var toString = Object.prototype.toString;

/**
 * Array#indexOf shim.
 */

var indexOf = typeof Array.prototype.indexOf === 'function'
  ? function(arr, el) { return arr.indexOf(el); }
  : function(arr, el) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === el) return i;
      }
      return -1;
    };

/**
 * Array.isArray shim.
 */

var isArray = Array.isArray || function(arr) {
  return toString.call(arr) == '[object Array]';
};

/**
 * Object.keys shim.
 */

var objectKeys = Object.keys || function(obj) {
  var ret = [];
  for (var key in obj) ret.push(key);
  return ret;
};

/**
 * Array#forEach shim.
 */

var forEach = typeof Array.prototype.forEach === 'function'
  ? function(arr, fn) { return arr.forEach(fn); }
  : function(arr, fn) {
      for (var i = 0; i < arr.length; i++) fn(arr[i]);
    };

/**
 * Array#reduce shim.
 */

var reduce = function(arr, fn, initial) {
  if (typeof arr.reduce === 'function') return arr.reduce(fn, initial);
  var res = initial;
  for (var i = 0; i < arr.length; i++) res = fn(res, arr[i]);
  return res;
};

/**
 * Cache non-integer test regexp.
 */

var isint = /^[0-9]+$/;

function promote(parent, key) {
  if (parent[key].length == 0) return parent[key] = {};
  var t = {};
  for (var i in parent[key]) t[i] = parent[key][i];
  parent[key] = t;
  return t;
}

function parse(parts, parent, key, val) {
  var part = parts.shift();
  // end
  if (!part) {
    if (isArray(parent[key])) {
      parent[key].push(val);
    } else if ('object' == typeof parent[key]) {
      parent[key] = val;
    } else if ('undefined' == typeof parent[key]) {
      parent[key] = val;
    } else {
      parent[key] = [parent[key], val];
    }
    // array
  } else {
    var obj = parent[key] = parent[key] || [];
    if (']' == part) {
      if (isArray(obj)) {
        if ('' != val) obj.push(val);
      } else if ('object' == typeof obj) {
        obj[objectKeys(obj).length] = val;
      } else {
        obj = parent[key] = [parent[key], val];
      }
      // prop
    } else if (~indexOf(part, ']')) {
      part = part.substr(0, part.length - 1);
      if (!isint.test(part) && isArray(obj)) obj = promote(parent, key);
      parse(parts, obj, part, val);
      // key
    } else {
      if (!isint.test(part) && isArray(obj)) obj = promote(parent, key);
      parse(parts, obj, part, val);
    }
  }
}

/**
 * Merge parent key/val pair.
 */

function merge(parent, key, val){
  if (~indexOf(key, ']')) {
    var parts = key.split('[')
      , len = parts.length
      , last = len - 1;
    parse(parts, parent, 'base', val);
    // optimize
  } else {
    if (!isint.test(key) && isArray(parent.base)) {
      var t = {};
      for (var k in parent.base) t[k] = parent.base[k];
      parent.base = t;
    }
    set(parent.base, key, val);
  }

  return parent;
}

/**
 * Parse the given obj.
 */

function parseObject(obj){
  var ret = { base: {} };
  forEach(objectKeys(obj), function(name){
    merge(ret, name, obj[name]);
  });
  return ret.base;
}

/**
 * Parse the given str.
 */

function parseString(str){
  return reduce(String(str).split('&'), function(ret, pair){
    var eql = indexOf(pair, '=')
      , brace = lastBraceInKey(pair)
      , key = pair.substr(0, brace || eql)
      , val = pair.substr(brace || eql, pair.length)
      , val = val.substr(indexOf(val, '=') + 1, val.length);

    // ?foo
    if ('' == key) key = pair, val = '';
    if ('' == key) return ret;

    return merge(ret, decode(key), decode(val));
  }, { base: {} }).base;
}

/**
 * Parse the given query `str` or `obj`, returning an object.
 *
 * @param {String} str | {Object} obj
 * @return {Object}
 * @api public
 */

exports.parse = function(str){
  if (null == str || '' == str) return {};
  return 'object' == typeof str
    ? parseObject(str)
    : parseString(str);
};

/**
 * Turn the given `obj` into a query string
 *
 * @param {Object} obj
 * @return {String}
 * @api public
 */

var stringify = exports.stringify = function(obj, prefix) {
  if (isArray(obj)) {
    return stringifyArray(obj, prefix);
  } else if ('[object Object]' == toString.call(obj)) {
    return stringifyObject(obj, prefix);
  } else if ('string' == typeof obj) {
    return stringifyString(obj, prefix);
  } else {
    return prefix + '=' + encodeURIComponent(String(obj));
  }
};

/**
 * Stringify the given `str`.
 *
 * @param {String} str
 * @param {String} prefix
 * @return {String}
 * @api private
 */

function stringifyString(str, prefix) {
  if (!prefix) throw new TypeError('stringify expects an object');
  return prefix + '=' + encodeURIComponent(str);
}

/**
 * Stringify the given `arr`.
 *
 * @param {Array} arr
 * @param {String} prefix
 * @return {String}
 * @api private
 */

function stringifyArray(arr, prefix) {
  var ret = [];
  if (!prefix) throw new TypeError('stringify expects an object');
  for (var i = 0; i < arr.length; i++) {
    ret.push(stringify(arr[i], prefix + '[' + i + ']'));
  }
  return ret.join('&');
}

/**
 * Stringify the given `obj`.
 *
 * @param {Object} obj
 * @param {String} prefix
 * @return {String}
 * @api private
 */

function stringifyObject(obj, prefix) {
  var ret = []
    , keys = objectKeys(obj)
    , key;

  for (var i = 0, len = keys.length; i < len; ++i) {
    key = keys[i];
    if (null == obj[key]) {
      ret.push(encodeURIComponent(key) + '=');
    } else {
      ret.push(stringify(obj[key], prefix
        ? prefix + '[' + encodeURIComponent(key) + ']'
        : encodeURIComponent(key)));
    }
  }

  return ret.join('&');
}

/**
 * Set `obj`'s `key` to `val` respecting
 * the weird and wonderful syntax of a qs,
 * where "foo=bar&foo=baz" becomes an array.
 *
 * @param {Object} obj
 * @param {String} key
 * @param {String} val
 * @api private
 */

function set(obj, key, val) {
  var v = obj[key];
  if (undefined === v) {
    obj[key] = val;
  } else if (isArray(v)) {
    v.push(val);
  } else {
    obj[key] = [v, val];
  }
}

/**
 * Locate last brace in `str` within the key.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function lastBraceInKey(str) {
  var len = str.length
    , brace
    , c;
  for (var i = 0; i < len; ++i) {
    c = str[i];
    if (']' == c) brace = false;
    if ('[' == c) brace = true;
    if ('=' == c && !brace) return i;
  }
}

/**
 * Decode `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function decode(str) {
  try {
    return decodeURIComponent(str.replace(/\+/g, ' '));
  } catch (err) {
    return str;
  }
}

},{}],11:[function(require,module,exports){
(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.composer = require('./composer');

  this.constructor = require('./construct');

  this.errors = require('./errors');

  this.events = require('./events');

  this.loader = require('./loader');

  this.nodes = require('./nodes');

  this.parser = require('./parser');

  this.reader = require('./reader');

  this.resolver = require('./resolver');

  this.scanner = require('./scanner');

  this.tokens = require('./tokens');

  this.q = require('q');

  this.FileError = (function(_super) {
    __extends(FileError, _super);

    function FileError() {
      _ref = FileError.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return FileError;

  })(this.errors.MarkedYAMLError);

  /*
  Scan a RAML stream and produce scanning tokens.
  */


  this.scan = function(stream, location) {
    var loader, _results;
    loader = new exports.loader.Loader(stream, location, false);
    _results = [];
    while (loader.check_token()) {
      _results.push(loader.get_token());
    }
    return _results;
  };

  /*
  Parse a RAML stream and produce parsing events.
  */


  this.parse = function(stream, location) {
    var loader, _results;
    loader = new exports.loader.Loader(stream, location, false);
    _results = [];
    while (loader.check_event()) {
      _results.push(loader.get_event());
    }
    return _results;
  };

  /*
  Parse the first RAML document in a stream and produce the corresponding
  representation tree.
  */


  this.compose = function(stream, validate, apply, join, location, parent) {
    var loader;
    if (validate == null) {
      validate = true;
    }
    if (apply == null) {
      apply = true;
    }
    if (join == null) {
      join = true;
    }
    loader = new exports.loader.Loader(stream, location, validate, parent);
    return loader.get_single_node(validate, apply, join);
  };

  /*
  Parse the first RAML document in a stream and produce the corresponding
  Javascript object.
  */


  this.load = function(stream, validate, location) {
    var _this = this;
    if (validate == null) {
      validate = true;
    }
    return this.q.fcall(function() {
      var loader;
      loader = new exports.loader.Loader(stream, location, validate);
      return loader.get_single_data();
    });
  };

  /*
  Parse the first RAML document in a stream and produce a list of
  all the absolute URIs for all resources.
  */


  this.resources = function(stream, validate, location) {
    var _this = this;
    if (validate == null) {
      validate = true;
    }
    return this.q.fcall(function() {
      var loader;
      loader = new exports.loader.Loader(stream, location, validate);
      return loader.resources();
    });
  };

  /*
  Parse the first RAML document in a stream and produce the corresponding
  Javascript object.
  */


  this.loadFile = function(file, validate) {
    var _this = this;
    if (validate == null) {
      validate = true;
    }
    return this.q.fcall(function() {
      var stream;
      stream = _this.readFile(file);
      return _this.load(stream, validate, file);
    });
  };

  /*
  Parse the first RAML document in a file and produce the corresponding
  representation tree.
  */


  this.composeFile = function(file, validate, apply, join, parent) {
    var stream;
    if (validate == null) {
      validate = true;
    }
    if (apply == null) {
      apply = true;
    }
    if (join == null) {
      join = true;
    }
    stream = this.readFile(file);
    return this.compose(stream, validate, apply, join, file, parent);
  };

  /*
  Parse the first RAML document in a file and produce a list of
  all the absolute URIs for all resources.
  */


  this.resourcesFile = function(file, validate) {
    var stream;
    if (validate == null) {
      validate = true;
    }
    stream = this.readFile(file);
    return this.resources(stream, validate, file);
  };

  /*
  Read file either locally or from the network.
  */


  this.readFile = function(file) {
    var error, url;
    url = require('url').parse(file);
    if (url.protocol != null) {
      if (!url.protocol.match(/^https?/i)) {
        throw new exports.FileError("while reading " + file, null, "unknown protocol " + url.protocol, this.start_mark);
      } else {
        return this.fetchFile(file);
      }
    } else {
      if (typeof window !== "undefined" && window !== null) {
        return this.fetchFile(file);
      } else {
        try {
          return require('fs').readFileSync(file).toString();
        } catch (_error) {
          error = _error;
          throw new exports.FileError("while reading " + file, null, "cannot read " + file + " (" + error + ")", this.start_mark);
        }
      }
    }
  };

  /*
  Read file from the network.
  */


  this.fetchFile = function(file) {
    var error, xhr;
    if (typeof window !== "undefined" && window !== null) {
      xhr = new XMLHttpRequest();
    } else {
      xhr = new (require('xmlhttprequest').XMLHttpRequest)();
    }
    try {
      xhr.open('GET', file, false);
      xhr.setRequestHeader('Accept', 'application/raml+yaml, */*');
      xhr.send(null);
      if ((typeof xhr.status === 'number' && xhr.status === 200) || (typeof xhr.status === 'string' && xhr.status.match(/^200/i))) {
        return xhr.responseText;
      }
      throw new Error("HTTP " + xhr.status + " " + xhr.statusText);
    } catch (_error) {
      error = _error;
      throw new exports.FileError("while fetching " + file, null, "cannot fetch " + file + " (" + error + ")", this.start_mark);
    }
  };

}).call(this);

},{"./composer":12,"./construct":15,"./errors":1,"./events":2,"./loader":17,"./nodes":13,"./parser":20,"./reader":18,"./resolver":21,"./scanner":19,"./tokens":3,"fs":9,"q":6,"url":7,"xmlhttprequest":29}],28:[function(require,module,exports){
(function() {
  var nodes, uritemplate, url, util,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  uritemplate = require('uritemplate');

  nodes = require('./nodes');

  url = require('url');

  util = require('./util');

  /*
     Applies transformations to the RAML
  */


  this.Transformations = (function() {
    function Transformations() {
      this.isContentTypeString = __bind(this.isContentTypeString, this);
      this.add_key_value_to_node = __bind(this.add_key_value_to_node, this);
      this.apply_default_media_type_to_resource = __bind(this.apply_default_media_type_to_resource, this);
      this.get_media_type = __bind(this.get_media_type, this);
      this.load_default_media_type = __bind(this.load_default_media_type, this);
      this.applyAstTransformations = __bind(this.applyAstTransformations, this);
      this.applyTransformations = __bind(this.applyTransformations, this);
      this.declaredSchemas = {};
    }

    Transformations.prototype.applyTransformations = function(rootObject) {
      var resources;
      this.applyTransformationsToRoot(rootObject);
      resources = rootObject.resources;
      return this.applyTransformationsToResources(rootObject, resources);
    };

    Transformations.prototype.applyAstTransformations = function(document) {
      return this.transform_document(document);
    };

    Transformations.prototype.load_default_media_type = function(node) {
      if (!util.isMapping(node || (node != null ? node.value : void 0))) {
        return;
      }
      return this.mediaType = this.property_value(node, "mediaType");
    };

    Transformations.prototype.get_media_type = function() {
      return this.mediaType;
    };

    Transformations.prototype.applyTransformationsToRoot = function(rootObject) {
      var expressions, template;
      if (rootObject.baseUri) {
        template = uritemplate.parse(rootObject.baseUri);
        expressions = template.expressions.filter(function(expr) {
          return 'templateText' in expr;
        }).map(function(expression) {
          return expression.templateText;
        });
        if (expressions.length) {
          if (!rootObject.baseUriParameters) {
            rootObject.baseUriParameters = {};
          }
        }
        return expressions.forEach(function(parameterName) {
          if (!(parameterName in rootObject.baseUriParameters)) {
            rootObject.baseUriParameters[parameterName] = {
              type: "string",
              required: true,
              displayName: parameterName
            };
            if (parameterName === "version") {
              return rootObject.baseUriParameters[parameterName]["enum"] = [rootObject.version];
            }
          }
        });
      }
    };

    Transformations.prototype.applyTransformationsToResources = function(rootObject, resources) {
      var expressions, inheritedSecScheme, method, parameterName, pathParts, relativeUri, resource, template, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _results;
      if (resources != null ? resources.length : void 0) {
        _results = [];
        for (_i = 0, _len = resources.length; _i < _len; _i++) {
          resource = resources[_i];
          inheritedSecScheme = resource.securedBy ? resource.securedBy : rootObject != null ? rootObject.securedBy : void 0;
          if ((_ref = resource.methods) != null ? _ref.length : void 0) {
            _ref1 = resource.methods;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              method = _ref1[_j];
              if (!("securedBy" in method)) {
                if (inheritedSecScheme) {
                  method.securedBy = inheritedSecScheme;
                }
              }
            }
          }
          relativeUri = url.parse(resource.relativeUri);
          pathParts = relativeUri.path.split('\/');
          while (!pathParts[0] && pathParts.length) {
            pathParts.shift();
          }
          resource.relativeUriPathSegments = pathParts;
          template = uritemplate.parse(resource.relativeUri);
          expressions = template.expressions.filter(function(expr) {
            return 'templateText' in expr;
          }).map(function(expression) {
            return expression.templateText;
          });
          if (expressions.length) {
            if (!resource.uriParameters) {
              resource.uriParameters = {};
            }
          }
          for (_k = 0, _len2 = expressions.length; _k < _len2; _k++) {
            parameterName = expressions[_k];
            if (!(parameterName in resource.uriParameters)) {
              resource.uriParameters[parameterName] = {
                type: "string",
                required: true,
                displayName: parameterName
              };
            }
          }
          _results.push(this.applyTransformationsToResources(rootObject, resource.resources));
        }
        return _results;
      }
    };

    /*
    Media Type pivot when using default mediaType property
    */


    Transformations.prototype.apply_default_media_type_to_resource = function(resource) {
      var methods,
        _this = this;
      if (!this.mediaType) {
        return;
      }
      if (!util.isMapping(resource)) {
        return;
      }
      methods = this.child_methods(resource);
      return methods.forEach(function(method) {
        return _this.apply_default_media_type_to_method(method[1]);
      });
    };

    Transformations.prototype.apply_default_media_type_to_method = function(method) {
      var responses,
        _this = this;
      if (!this.mediaType) {
        return;
      }
      if (!util.isMapping(method)) {
        return;
      }
      if (this.has_property(method, "body")) {
        this.apply_default_media_type_to_body(this.get_property(method, "body"));
      }
      if (this.has_property(method, "responses")) {
        responses = this.get_property(method, "responses");
        return responses.value.forEach(function(response) {
          if (_this.has_property(response[1], "body")) {
            return _this.apply_default_media_type_to_body(_this.get_property(response[1], "body"));
          }
        });
      }
    };

    Transformations.prototype.apply_default_media_type_to_body = function(body) {
      var key, responseType, responseTypeKey, _ref, _ref1, _ref2;
      if (!util.isMapping(body)) {
        return;
      }
      if (body != null ? (_ref = body.value) != null ? (_ref1 = _ref[0]) != null ? (_ref2 = _ref1[0]) != null ? _ref2.value : void 0 : void 0 : void 0 : void 0) {
        key = body.value[0][0].value;
        if (!key.match(/\//)) {
          responseType = new nodes.MappingNode('tag:yaml.org,2002:map', [], body.start_mark, body.end_mark);
          responseTypeKey = new nodes.ScalarNode('tag:yaml.org,2002:str', this.mediaType, body.start_mark, body.end_mark);
          responseType.value.push([responseTypeKey, body.clone()]);
          return body.value = responseType.value;
        }
      }
    };

    Transformations.prototype.noop = function() {};

    Transformations.prototype.transform_types = function(typeProperty) {
      var types,
        _this = this;
      types = typeProperty.value;
      return types.forEach(function(type_entry) {
        return type_entry.value.forEach(function(type) {
          return _this.transform_resource(type, true);
        });
      });
    };

    Transformations.prototype.transform_traits = function(traitProperty) {
      var traits,
        _this = this;
      traits = traitProperty.value;
      return traits.forEach(function(trait_entry) {
        return trait_entry.value.forEach(function(trait) {
          return _this.transform_method(trait[1], true);
        });
      });
    };

    Transformations.prototype.transform_named_params = function(property, allowParameterKeys, requiredByDefault) {
      var _this = this;
      if (requiredByDefault == null) {
        requiredByDefault = true;
      }
      if (util.isNull(property[1])) {
        return;
      }
      return property[1].value.forEach(function(param) {
        if (util.isNull(param[1])) {
          param[1] = new nodes.MappingNode('tag:yaml.org,2002:map', [], param[1].start_mark, param[1].end_mark);
        }
        return _this.transform_common_parameter_properties(param[0].value, param[1], allowParameterKeys, requiredByDefault);
      });
    };

    Transformations.prototype.transform_common_parameter_properties = function(parameterName, node, allowParameterKeys, requiredByDefault) {
      var _this = this;
      if (util.isSequence(node)) {
        return node.value.forEach(function(parameter) {
          return _this.transform_named_parameter(parameterName, parameter, allowParameterKeys, requiredByDefault);
        });
      } else {
        return this.transform_named_parameter(parameterName, node, allowParameterKeys, requiredByDefault);
      }
    };

    Transformations.prototype.transform_named_parameter = function(parameterName, node, allowParameterKeys, requiredByDefault) {
      var hasDisplayName, hasRequired, hasType,
        _this = this;
      hasDisplayName = false;
      hasRequired = false;
      hasType = false;
      node.value.forEach(function(childNode) {
        var canonicalPropertyName;
        if (allowParameterKeys && _this.isParameterKey(childNode)) {
          return;
        }
        canonicalPropertyName = _this.canonicalizePropertyName(childNode[0].value, allowParameterKeys);
        switch (canonicalPropertyName) {
          case "pattern":
            return _this.noop();
          case "default":
            return _this.noop();
          case "enum":
            return _this.noop();
          case "description":
            return _this.noop();
          case "example":
            return _this.noop();
          case "minLength":
            return _this.noop();
          case "maxLength":
            return _this.noop();
          case "minimum":
            return _this.noop();
          case "maximum":
            return _this.noop();
          case "repeat":
            return _this.noop();
          case "displayName":
            return hasDisplayName = true;
          case "type":
            return hasType = true;
          case "required":
            return hasRequired = true;
          default:
            return _this.noop();
        }
      });
      if (!hasDisplayName) {
        this.add_key_value_to_node(node, 'displayName', 'tag:yaml.org,2002:str', this.canonicalizePropertyName(parameterName, allowParameterKeys));
      }
      if (!hasRequired) {
        if (requiredByDefault) {
          this.add_key_value_to_node(node, 'required', 'tag:yaml.org,2002:bool', 'true');
        }
      }
      if (!hasType) {
        return this.add_key_value_to_node(node, 'type', 'tag:yaml.org,2002:str', 'string');
      }
    };

    Transformations.prototype.add_key_value_to_node = function(node, keyName, valueTag, value) {
      var propertyName, propertyValue;
      propertyName = new nodes.ScalarNode('tag:yaml.org,2002:str', keyName, node.start_mark, node.end_mark);
      propertyValue = new nodes.ScalarNode(valueTag, value, node.start_mark, node.end_mark);
      return node.value.push([propertyName, propertyValue]);
    };

    Transformations.prototype.transform_document = function(node) {
      var _this = this;
      if (node != null ? node.value : void 0) {
        return node.value.forEach(function(property) {
          var _ref;
          switch (property[0].value) {
            case "title":
              return _this.noop();
            case "securitySchemes":
              return _this.noop();
            case "schemas":
              return _this.noop();
            case "version":
              return _this.noop();
            case "documentation":
              return _this.noop();
            case "mediaType":
              return _this.noop();
            case "securedBy":
              return _this.noop();
            case "baseUri":
              return _this.noop();
            case "traits":
              return _this.transform_traits(property[1]);
            case "baseUriParameters":
              return _this.transform_named_params(property, false);
            case "resourceTypes":
              return _this.transform_types(property[1]);
            case "resources":
              return (_ref = property[1]) != null ? _ref.value.forEach(function(resource) {
                return _this.transform_resource(resource);
              }) : void 0;
            default:
              return _this.noop();
          }
        });
      }
    };

    Transformations.prototype.transform_resource = function(resource, allowParameterKeys) {
      var _this = this;
      if (allowParameterKeys == null) {
        allowParameterKeys = false;
      }
      if (resource.value) {
        return resource.value.forEach(function(property) {
          var canonicalKey, isKnownCommonProperty, _ref, _ref1;
          isKnownCommonProperty = _this.transform_common_properties(property, allowParameterKeys);
          if (!isKnownCommonProperty) {
            if (_this.isHttpMethod(property[0].value, allowParameterKeys)) {
              return _this.transform_method(property[1], allowParameterKeys);
            } else {
              canonicalKey = _this.canonicalizePropertyName(property[0].value, allowParameterKeys);
              switch (canonicalKey) {
                case "type":
                  return _this.noop();
                case "usage":
                  return _this.noop();
                case "securedBy":
                  return _this.noop();
                case "uriParameters":
                  return _this.transform_named_params(property, allowParameterKeys);
                case "baseUriParameters":
                  return _this.transform_named_params(property, allowParameterKeys);
                case "resources":
                  return (_ref = property[1]) != null ? _ref.value.forEach(function(resource) {
                    return _this.transform_resource(resource);
                  }) : void 0;
                case "methods":
                  return (_ref1 = property[1]) != null ? _ref1.value.forEach(function(method) {
                    return _this.transform_method(method, allowParameterKeys);
                  }) : void 0;
                default:
                  return _this.noop();
              }
            }
          }
        });
      }
    };

    Transformations.prototype.transform_method = function(method, allowParameterKeys) {
      var _this = this;
      if (util.isNull(method)) {
        return;
      }
      return method.value.forEach(function(property) {
        var canonicalKey;
        if (_this.transform_common_properties(property, allowParameterKeys)) {
          return;
        }
        canonicalKey = _this.canonicalizePropertyName(property[0].value, allowParameterKeys);
        switch (canonicalKey) {
          case "securedBy":
            return _this.noop();
          case "usage":
            return _this.noop();
          case "headers":
            return _this.transform_named_params(property, allowParameterKeys);
          case "queryParameters":
            return _this.transform_named_params(property, allowParameterKeys, false);
          case "baseUriParameters":
            return _this.transform_named_params(property, allowParameterKeys);
          case "body":
            return _this.transform_body(property, allowParameterKeys);
          case "responses":
            return _this.transform_responses(property, allowParameterKeys);
          default:
            return _this.noop();
        }
      });
    };

    Transformations.prototype.transform_responses = function(responses, allowParameterKeys) {
      var _this = this;
      if (util.isNull(responses[1])) {
        return;
      }
      return responses[1].value.forEach(function(response) {
        return _this.transform_response(response, allowParameterKeys);
      });
    };

    Transformations.prototype.transform_response = function(response, allowParameterKeys) {
      var _this = this;
      if (util.isMapping(response[1])) {
        return response[1].value.forEach(function(property) {
          var canonicalKey;
          canonicalKey = _this.canonicalizePropertyName(property[0].value, allowParameterKeys);
          switch (canonicalKey) {
            case "description":
              return _this.noop();
            case "body":
              return _this.transform_body(property, allowParameterKeys);
            case "headers":
              return _this.transform_named_params(property, allowParameterKeys);
            default:
              return _this.noop();
          }
        });
      }
    };

    Transformations.prototype.isContentTypeString = function(value) {
      return value != null ? value.match(/^[^\/]+\/[^\/]+$/) : void 0;
    };

    Transformations.prototype.transform_body = function(property, allowParameterKeys) {
      var _ref,
        _this = this;
      if (util.isNull(property[1])) {
        return;
      }
      return (_ref = property[1].value) != null ? _ref.forEach(function(bodyProperty) {
        var canonicalProperty;
        if (_this.isParameterKey(bodyProperty)) {
          return _this.noop();
        } else if (_this.isContentTypeString(bodyProperty[0].value)) {
          return _this.transform_body(bodyProperty, allowParameterKeys);
        } else {
          canonicalProperty = _this.canonicalizePropertyName(bodyProperty[0].value, allowParameterKeys);
          switch (canonicalProperty) {
            case "example":
              return _this.noop();
            case "schema":
              return _this.noop();
            case "formParameters":
              return _this.transform_named_params(bodyProperty, allowParameterKeys, false);
            default:
              return _this.noop();
          }
        }
      }) : void 0;
    };

    Transformations.prototype.transform_common_properties = function(property, allowParameterKeys) {
      var canonicalProperty;
      if (this.isParameterKey(property)) {
        return true;
      } else {
        canonicalProperty = this.canonicalizePropertyName(property[0].value, allowParameterKeys);
        switch (canonicalProperty) {
          case "displayName":
            return true;
          case "description":
            return true;
          case "is":
            return true;
          default:
            this.noop();
        }
      }
      return false;
    };

    return Transformations;

  })();

}).call(this);

},{"./nodes":13,"./util":4,"uritemplate":30,"url":7}],22:[function(require,module,exports){
(function() {
  var MarkedYAMLError, nodes, traits, uritemplate, url, util, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  url = require('url');

  uritemplate = require('uritemplate');

  MarkedYAMLError = require('./errors').MarkedYAMLError;

  nodes = require('./nodes');

  traits = require('./traits');

  util = require('./util');

  /*
  The Validator throws these.
  */


  this.ValidationError = (function(_super) {
    __extends(ValidationError, _super);

    function ValidationError() {
      _ref = ValidationError.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return ValidationError;

  })(MarkedYAMLError);

  /*
  A collection of multiple validation errors
  */


  this.ValidationErrors = (function(_super) {
    __extends(ValidationErrors, _super);

    function ValidationErrors(validation_errors) {
      this.validation_errors = validation_errors;
    }

    ValidationErrors.prototype.get_validation_errors = function() {
      return this.validation_errors;
    };

    return ValidationErrors;

  })(MarkedYAMLError);

  /*
  The Validator class deals with validating a YAML file according to the spec
  */


  this.Validator = (function() {
    function Validator() {
      this.get_properties = __bind(this.get_properties, this);
      this.get_list_values = __bind(this.get_list_values, this);
      this.validations = [this.validate_root, this.validate_root_properties, this.validate_base_uri_parameters, this.valid_absolute_uris];
    }

    Validator.prototype.validate_document = function(node) {
      var validation, _i, _len, _ref1;
      _ref1 = this.validations;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        validation = _ref1[_i];
        validation.call(this, node);
      }
      return true;
    };

    Validator.prototype.validate_security_schemes = function(schemesProperty) {
      var scheme, schemeNamesTrack, scheme_entry, _i, _len, _ref1, _results;
      if (!util.isSequence(schemesProperty)) {
        throw new exports.ValidationError('while validating securitySchemes', null, 'invalid security schemes property, it must be an array', schemesProperty.start_mark);
      }
      schemeNamesTrack = {};
      _ref1 = schemesProperty.value;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        scheme_entry = _ref1[_i];
        if (!util.isMapping(scheme_entry)) {
          throw new exports.ValidationError('while validating securitySchemes', null, 'invalid security scheme property, it must be a map', scheme_entry.start_mark);
        }
        _results.push((function() {
          var _j, _len1, _ref2, _results1;
          _ref2 = scheme_entry.value;
          _results1 = [];
          for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
            scheme = _ref2[_j];
            if (!util.isMapping(scheme[1])) {
              throw new exports.ValidationError('while validating securitySchemes', null, 'invalid security scheme property, it must be a map', scheme[0].start_mark);
            }
            _results1.push(this.validate_security_scheme(scheme[1]));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    Validator.prototype.trackRepeatedProperties = function(properties, property, mark, section, errorMessage) {
      if (section == null) {
        section = "RAML";
      }
      if (errorMessage == null) {
        errorMessage = "a property with the same name already exists";
      }
      if (property in properties) {
        throw new exports.ValidationError("while validating " + section, null, errorMessage + (": '" + property + "'"), mark);
      }
      return properties[property] = true;
    };

    Validator.prototype.validate_security_scheme = function(scheme) {
      var property, schemeProperties, settings, type, _i, _len, _ref1;
      type = null;
      settings = null;
      schemeProperties = {};
      _ref1 = scheme.value;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        property = _ref1[_i];
        this.trackRepeatedProperties(schemeProperties, property[0].value, property[0].start_mark, 'while validating security scheme', "property already used in security scheme");
        switch (property[0].value) {
          case "description":
            if (!util.isScalar(property[1])) {
              throw new exports.ValidationError('while validating security scheme', null, 'schemes description must be a string', property[1].start_mark);
            }
            break;
          case "type":
            type = property[1].value;
            if (!(util.isString(property[1]) && type.match(/^(OAuth 1.0|OAuth 2.0|Basic Authentication|Digest Authentication|x-.+)$/))) {
              throw new exports.ValidationError('while validating security scheme', null, 'schemes type must be any of: "OAuth 1.0", "OAuth 2.0", "Basic Authentication", "Digest Authentication", "x-\{.+\}"', property[1].start_mark);
            }
            break;
          case "describedBy":
            this.validate_method(property, true, "security scheme");
            break;
          case "settings":
            settings = property;
            if (!util.isNullableMapping(property[1])) {
              throw new exports.ValidationError('while validating security scheme', null, 'schemes settings must be a map', property[1].start_mark);
            }
            break;
          default:
            throw new exports.ValidationError('while validating security scheme', null, "property: '" + property[0].value + "' is invalid in a security scheme", property[0].start_mark);
        }
      }
      if (!type) {
        throw new exports.ValidationError('while validating security scheme', null, 'schemes type must be any of: "OAuth 1.0", "OAuth 2.0", "Basic Authentication", "Digest Authentication", "x-\{.+\}"', scheme.start_mark);
      } else if (type === "OAuth 2.0") {
        if (!settings) {
          throw new exports.ValidationError('while validating security scheme', null, 'for OAuth 2.0 settings must be a map', scheme.start_mark);
        }
        return this.validate_oauth2_settings(settings);
      } else if (type === "OAuth 1.0") {
        if (!settings) {
          throw new exports.ValidationError('while validating security scheme', null, 'for OAuth 1.0 settings must be a map', scheme.start_mark);
        }
        return this.validate_oauth1_settings(settings);
      }
    };

    Validator.prototype.validate_oauth2_settings = function(settings) {
      var property, propertyName, settingProperties, _i, _j, _len, _len1, _ref1, _ref2, _results;
      settingProperties = {};
      _ref1 = settings[1].value;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        property = _ref1[_i];
        this.trackRepeatedProperties(settingProperties, property[0].value, property[0].start_mark, 'while validating security scheme', "setting with the same name already exists");
        switch (property[0].value) {
          case "authorizationUri":
            if (!util.isString(property[1])) {
              throw new exports.ValidationError('while validating security scheme', null, 'authorizationUri must be a URL', property[0].start_mark);
            }
            break;
          case "accessTokenUri":
            if (!util.isString(property[1])) {
              throw new exports.ValidationError('while validating security scheme', null, 'accessTokenUri must be a URL', property[0].start_mark);
            }
        }
      }
      _ref2 = ['accessTokenUri', 'authorizationUri'];
      _results = [];
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        propertyName = _ref2[_j];
        if (!(propertyName in settingProperties)) {
          throw new exports.ValidationError('while validating security scheme', null, "OAuth 2.0 settings must have " + propertyName + " property", settings[0].start_mark);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Validator.prototype.validate_oauth1_settings = function(settings) {
      var property, propertyName, settingProperties, _i, _j, _len, _len1, _ref1, _ref2, _results;
      settingProperties = {};
      _ref1 = settings[1].value;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        property = _ref1[_i];
        this.trackRepeatedProperties(settingProperties, property[0].value, property[0].start_mark, 'while validating security scheme', "setting with the same name already exists");
        switch (property[0].value) {
          case "requestTokenUri":
            if (!util.isString(property[1])) {
              throw new exports.ValidationError('while validating security scheme', null, 'requestTokenUri must be a URL', property[0].start_mark);
            }
            break;
          case "authorizationUri":
            if (!util.isString(property[1])) {
              throw new exports.ValidationError('while validating security scheme', null, 'authorizationUri must be a URL', property[0].start_mark);
            }
            break;
          case "tokenCredentialsUri":
            if (!util.isString(property[1])) {
              throw new exports.ValidationError('while validating security scheme', null, 'tokenCredentialsUri must be a URL', property[0].start_mark);
            }
        }
      }
      _ref2 = ['requestTokenUri', 'authorizationUri', 'tokenCredentialsUri'];
      _results = [];
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        propertyName = _ref2[_j];
        if (!(propertyName in settingProperties)) {
          throw new exports.ValidationError('while validating security scheme', null, "OAuth 1.0 settings must have " + propertyName + " property", settings[0].start_mark);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Validator.prototype.validate_root_schemas = function(schemas) {
      var schema, schemaList, schemaName, _results;
      if (!util.isSequence(schemas)) {
        throw new exports.ValidationError('while validating schemas', null, 'schemas property must be an array', schemas.start_mark);
      }
      schemaList = this.get_all_schemas();
      _results = [];
      for (schemaName in schemaList) {
        schema = schemaList[schemaName];
        if (!(schema[1].tag && util.isString(schema[1]))) {
          throw new exports.ValidationError('while validating schemas', null, 'schema ' + schemaName + ' must be a string', schema[0].start_mark);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Validator.prototype.validate_root = function(node) {
      if (!(node || util.isNull(node))) {
        throw new exports.ValidationError('while validating root', null, 'empty document', node != null ? node.start_mark : void 0);
      }
      if (!util.isMapping(node)) {
        throw new exports.ValidationError('while validating root', null, 'document must be a map', node.start_mark);
      }
    };

    Validator.prototype.validate_base_uri_parameters = function(node) {
      if (!this.baseUriParameters) {
        return;
      }
      if (!this.baseUri) {
        throw new exports.ValidationError('while validating uri parameters', null, 'uri parameters defined when there is no baseUri', this.baseUriParameters.start_mark);
      }
      if (!util.isNullableMapping(this.baseUriParameters)) {
        throw new exports.ValidationError('while validating uri parameters', null, 'base uri parameters must be a map', this.baseUriParameters.start_mark);
      }
      return this.validate_uri_parameters(this.baseUri, this.baseUriParameters, false, false, ["version"]);
    };

    Validator.prototype.validate_uri_parameters = function(uri, uriProperty, allowParameterKeys, skipParameterUseCheck, reservedNames) {
      var err, expressions, parameterName, template, uriParameter, uriParameters, _i, _len, _ref1, _ref2, _results;
      if (reservedNames == null) {
        reservedNames = [];
      }
      try {
        template = uritemplate.parse(uri);
      } catch (_error) {
        err = _error;
        throw new exports.ValidationError('while validating uri parameters', null, err != null ? (_ref1 = err.options) != null ? _ref1.message : void 0 : void 0, uriProperty.start_mark);
      }
      expressions = template.expressions.filter(function(expr) {
        return "templateText" in expr;
      }).map(function(expression) {
        return expression.templateText;
      });
      uriParameters = {};
      if (typeof uriProperty.value === "object") {
        _ref2 = uriProperty.value;
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          uriParameter = _ref2[_i];
          parameterName = this.canonicalizePropertyName(uriParameter[0].value, allowParameterKeys);
          this.trackRepeatedProperties(uriParameters, parameterName, uriProperty.start_mark, 'while validating URI parameters', "URI parameter with the same name already exists");
          if (__indexOf.call(reservedNames, parameterName) >= 0) {
            throw new exports.ValidationError('while validating baseUri', null, uriParameter[0].value + ' parameter not allowed here', uriParameter[0].start_mark);
          }
          if (!(util.isNullableMapping(uriParameter[1], allowParameterKeys) || util.isNullableSequence(uriParameter[1], allowParameterKeys))) {
            throw new exports.ValidationError('while validating baseUri', null, 'URI parameter must be a map', uriParameter[0].start_mark);
          }
          if (!util.isNull(uriParameter[1])) {
            this.valid_common_parameter_properties(uriParameter[1], allowParameterKeys);
          }
          if (!(skipParameterUseCheck || this.isParameterKey(uriParameter) || __indexOf.call(expressions, parameterName) >= 0)) {
            throw new exports.ValidationError('while validating baseUri', null, uriParameter[0].value + ' uri parameter unused', uriParameter[0].start_mark);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    Validator.prototype.validate_types = function(typeProperty) {
      var type, type_entry, types, typesNamesTrack, _i, _len, _results;
      types = typeProperty.value;
      typesNamesTrack = {};
      if (!util.isSequence(typeProperty)) {
        throw new exports.ValidationError('while validating resource types', null, 'invalid resourceTypes definition, it must be an array', typeProperty.start_mark);
      }
      _results = [];
      for (_i = 0, _len = types.length; _i < _len; _i++) {
        type_entry = types[_i];
        if (!util.isMapping(type_entry)) {
          throw new exports.ValidationError('while validating resource types', null, 'invalid resourceType definition, it must be a map', type_entry.start_mark);
        }
        _results.push((function() {
          var _j, _len1, _ref1, _results1;
          _ref1 = type_entry.value;
          _results1 = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            type = _ref1[_j];
            if (this.isParameterKey(type)) {
              throw new exports.ValidationError('while validating resource types', null, 'parameter key cannot be used as a resource type name', type[0].start_mark);
            }
            if (!util.isMapping(type[1])) {
              throw new exports.ValidationError('while validating resource types', null, 'invalid resourceType definition, it must be a map', type[1].start_mark);
            }
            _results1.push(this.validate_resource(type, true, 'resource type'));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    Validator.prototype.validate_traits = function(traitProperty) {
      var trait, traitNamesTrack, trait_entry, _i, _len, _results;
      traits = traitProperty.value;
      traitNamesTrack = {};
      if (!Array.isArray(traits)) {
        throw new exports.ValidationError('while validating traits', null, 'invalid traits definition, it must be an array', traitProperty.start_mark);
      }
      _results = [];
      for (_i = 0, _len = traits.length; _i < _len; _i++) {
        trait_entry = traits[_i];
        if (!Array.isArray(trait_entry.value)) {
          throw new exports.ValidationError('while validating traits', null, 'invalid traits definition, it must be an array', traitProperty.start_mark);
        }
        _results.push((function() {
          var _j, _len1, _ref1, _results1;
          _ref1 = trait_entry.value;
          _results1 = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            trait = _ref1[_j];
            if (this.isParameterKey(trait)) {
              throw new exports.ValidationError('while validating traits', null, 'parameter key cannot be used as a trait name', trait[0].start_mark);
            }
            if (!util.isMapping(trait[1])) {
              throw new exports.ValidationError('while validating traits', null, 'invalid trait definition, it must be a map', trait[1].start_mark);
            }
            _results1.push(this.valid_traits_properties(trait));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    Validator.prototype.valid_traits_properties = function(node) {
      var invalid;
      if (!node[1].value) {
        return;
      }
      if (!util.isMapping(node[1])) {
        return;
      }
      invalid = node[1].value.filter(function(childNode) {
        return childNode[0].value === "is" || childNode[0].value === "type";
      });
      if (invalid.length > 0) {
        throw new exports.ValidationError('while validating trait properties', null, "property: '" + invalid[0][0].value + "' is invalid in a trait", invalid[0][0].start_mark);
      }
      return this.validate_method(node, true, 'trait');
    };

    Validator.prototype.canonicalizePropertyName = function(propertyName, mustRemoveQuestionMark) {
      if (mustRemoveQuestionMark && propertyName.slice(-1) === '?') {
        return propertyName.slice(0, -1);
      }
      return propertyName;
    };

    Validator.prototype.valid_common_parameter_properties = function(node, allowParameterKeys) {
      var parameter, _i, _len, _ref1, _results;
      if (!node.value) {
        return;
      }
      if (util.isSequence(node)) {
        if (node.value.length === 0) {
          throw new exports.ValidationError('while validating parameter properties', null, 'named parameter needs at least one type', node.start_mark);
        }
        if (!(node.value.length > 1)) {
          throw new exports.ValidationError('while validating parameter properties', null, 'single type for variably typed parameter', node.start_mark);
        }
        _ref1 = node.value;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          parameter = _ref1[_i];
          _results.push(this.validate_named_parameter(parameter, allowParameterKeys));
        }
        return _results;
      } else {
        return this.validate_named_parameter(node, allowParameterKeys);
      }
    };

    Validator.prototype.validate_named_parameter = function(node, allowParameterKeys) {
      var booleanValues, canonicalPropertyName, childNode, enumValues, parameterProperties, propertyName, propertyValue, validTypes, _i, _len, _ref1, _results;
      parameterProperties = {};
      _ref1 = node.value;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        childNode = _ref1[_i];
        propertyName = childNode[0].value;
        propertyValue = childNode[1].value;
        this.trackRepeatedProperties(parameterProperties, this.canonicalizePropertyName(childNode[0].value, true), childNode[0].start_mark, 'while validating parameter properties', "parameter property already used");
        booleanValues = ["true", "false"];
        if (allowParameterKeys && this.isParameterKey(childNode)) {
          continue;
        }
        canonicalPropertyName = this.canonicalizePropertyName(propertyName, allowParameterKeys);
        switch (canonicalPropertyName) {
          case "displayName":
            if (!util.isScalar(childNode[1])) {
              throw new exports.ValidationError('while validating parameter properties', null, 'the value of displayName must be a scalar', childNode[1].start_mark);
            } else {
              _results.push(void 0);
            }
            break;
          case "pattern":
            if (!util.isScalar(childNode[1])) {
              throw new exports.ValidationError('while validating parameter properties', null, 'the value of pattern must be a scalar', childNode[1].start_mark);
            } else {
              _results.push(void 0);
            }
            break;
          case "default":
            if (!util.isScalar(childNode[1])) {
              throw new exports.ValidationError('while validating parameter properties', null, 'the value of default must be a scalar', childNode[1].start_mark);
            } else {
              _results.push(void 0);
            }
            break;
          case "enum":
            if (!util.isNullableSequence(childNode[1])) {
              throw new exports.ValidationError('while validating parameter properties', null, 'the value of enum must be an array', childNode[1].start_mark);
            }
            if (!childNode[1].value.length) {
              throw new exports.ValidationError('while validating parameter properties', null, 'enum is empty', childNode[1].start_mark);
            }
            enumValues = this.get_list_values(childNode[1].value);
            if (this.hasDuplicates(enumValues)) {
              throw new exports.ValidationError('while validating parameter properties', null, 'enum contains duplicated values', childNode[1].start_mark);
            } else {
              _results.push(void 0);
            }
            break;
          case "description":
            if (!util.isScalar(childNode[1])) {
              throw new exports.ValidationError('while validating parameter properties', null, 'the value of description must be a scalar', childNode[1].start_mark);
            } else {
              _results.push(void 0);
            }
            break;
          case "example":
            if (!util.isScalar(childNode[1])) {
              throw new exports.ValidationError('while validating parameter properties', null, 'the value of example must be a scalar', childNode[1].start_mark);
            } else {
              _results.push(void 0);
            }
            break;
          case "minLength":
            if (isNaN(propertyValue)) {
              throw new exports.ValidationError('while validating parameter properties', null, 'the value of minLength must be a number', childNode[1].start_mark);
            } else {
              _results.push(void 0);
            }
            break;
          case "maxLength":
            if (isNaN(propertyValue)) {
              throw new exports.ValidationError('while validating parameter properties', null, 'the value of maxLength must be a number', childNode[1].start_mark);
            } else {
              _results.push(void 0);
            }
            break;
          case "minimum":
            if (isNaN(propertyValue)) {
              throw new exports.ValidationError('while validating parameter properties', null, 'the value of minimum must be a number', childNode[1].start_mark);
            } else {
              _results.push(void 0);
            }
            break;
          case "maximum":
            if (isNaN(propertyValue)) {
              throw new exports.ValidationError('while validating parameter properties', null, 'the value of maximum must be a number', childNode[1].start_mark);
            } else {
              _results.push(void 0);
            }
            break;
          case "type":
            validTypes = ['string', 'number', 'integer', 'date', 'boolean', 'file'];
            if (__indexOf.call(validTypes, propertyValue) < 0) {
              throw new exports.ValidationError('while validating parameter properties', null, 'type can be either of: string, number, integer, file, date or boolean ', childNode[1].start_mark);
            } else {
              _results.push(void 0);
            }
            break;
          case "required":
            if (__indexOf.call(booleanValues, propertyValue) < 0) {
              throw new exports.ValidationError('while validating parameter properties', null, 'required can be any either true or false', childNode[1].start_mark);
            } else {
              _results.push(void 0);
            }
            break;
          case "repeat":
            if (__indexOf.call(booleanValues, propertyValue) < 0) {
              throw new exports.ValidationError('while validating parameter properties', null, 'repeat can be any either true or false', childNode[1].start_mark);
            } else {
              _results.push(void 0);
            }
            break;
          default:
            throw new exports.ValidationError('while validating parameter properties', null, 'unknown property ' + propertyName, childNode[0].start_mark);
        }
      }
      return _results;
    };

    Validator.prototype.get_list_values = function(node) {
      var _this = this;
      return node.map(function(item) {
        return item.value;
      });
    };

    Validator.prototype.validate_root_properties = function(node) {
      var checkVersion, rootProperties,
        _this = this;
      checkVersion = false;
      rootProperties = {};
      if (node != null ? node.value : void 0) {
        node.value.forEach(function(property) {
          if (property[0].value.match(/^\//)) {
            _this.trackRepeatedProperties(rootProperties, _this.canonicalizePropertyName(property[0].value, true), property[0].start_mark, 'while validating root properties', "resource already declared");
          } else {
            _this.trackRepeatedProperties(rootProperties, property[0].value, property[0].start_mark, 'while validating root properties', 'root property already used');
          }
          switch (property[0].value) {
            case 'title':
              if (!util.isScalar(property[1])) {
                throw new exports.ValidationError('while validating root properties', null, 'title must be a string', property[0].start_mark);
              }
              break;
            case 'baseUri':
              if (!util.isScalar(property[1])) {
                throw new exports.ValidationError('while validating root properties', null, 'baseUri must be a string', property[0].start_mark);
              }
              _this.baseUri = property[1].value;
              return checkVersion = _this.validate_base_uri(property[1]);
            case 'securitySchemes':
              return _this.validate_security_schemes(property[1]);
            case 'schemas':
              return _this.validate_root_schemas(property[1]);
            case 'version':
              if (!util.isScalar(property[1])) {
                throw new exports.ValidationError('while validating root properties', null, 'version must be a string', property[0].start_mark);
              }
              break;
            case 'traits':
              return _this.validate_traits(property[1]);
            case 'documentation':
              if (!util.isSequence(property[1])) {
                throw new exports.ValidationError('while validating root properties', null, 'documentation must be an array', property[0].start_mark);
              }
              return _this.validate_documentation(property[1]);
            case 'mediaType':
              if (!util.isString(property[1])) {
                throw new exports.ValidationError('while validating root properties', null, 'mediaType must be a scalar', property[0].start_mark);
              }
              break;
            case 'baseUriParameters':
              _this.baseUriParameters = property[1];
              return util.isNoop(property[1]);
            case 'resourceTypes':
              return _this.validate_types(property[1]);
            case 'securedBy':
              return _this.validate_secured_by(property);
            case 'protocols':
              return _this.validate_protocols_property(property);
            default:
              if (property[0].value.match(/^\//)) {
                return _this.validate_resource(property);
              } else {
                throw new exports.ValidationError('while validating root properties', null, "unknown property " + property[0].value, property[0].start_mark);
              }
          }
        });
      }
      if (!('title' in rootProperties)) {
        throw new exports.ValidationError('while validating root properties', null, 'missing title', node.start_mark);
      }
      if (checkVersion && !('version' in rootProperties)) {
        throw new exports.ValidationError('while validating version', null, 'missing version', node.start_mark);
      }
    };

    Validator.prototype.validate_documentation = function(documentation_property) {
      var _this = this;
      if (!documentation_property.value.length) {
        throw new exports.ValidationError('while validating documentation section', null, 'there must be at least one document in the documentation section', documentation_property.start_mark);
      }
      return documentation_property.value.forEach(function(docSection) {
        return _this.validate_doc_section(docSection);
      });
    };

    Validator.prototype.validate_doc_section = function(docSection) {
      var docProperties,
        _this = this;
      if (!util.isMapping(docSection)) {
        throw new exports.ValidationError('while validating documentation section', null, 'each documentation section must be a map', docSection.start_mark);
      }
      docProperties = {};
      docSection.value.forEach(function(property) {
        var hasContent, hasTitle;
        _this.trackRepeatedProperties(docProperties, property[0].value, property[0].start_mark, 'while validating documentation section', "property already used");
        switch (property[0].value) {
          case "title":
            if (!(util.isScalar(property[1]) && !util.isNull(property[1]))) {
              throw new exports.ValidationError('while validating documentation section', null, 'title must be a string', property[0].start_mark);
            }
            return hasTitle = true;
          case "content":
            if (!(util.isScalar(property[1]) && !util.isNull(property[1]))) {
              throw new exports.ValidationError('while validating documentation section', null, 'content must be a string', property[0].start_mark);
            }
            return hasContent = true;
          default:
            throw new exports.ValidationError('while validating root properties', null, 'unknown property ' + property[0].value, property[0].start_mark);
        }
      });
      if (!("content" in docProperties)) {
        throw new exports.ValidationError('while validating documentation section', null, 'a documentation entry must have content property', docSection.start_mark);
      }
      if (!("title" in docProperties)) {
        throw new exports.ValidationError('while validating documentation section', null, 'a documentation entry must have title property', docSection.start_mark);
      }
    };

    Validator.prototype.child_resources = function(node) {
      if (node && util.isMapping(node)) {
        return node.value.filter(function(childNode) {
          return childNode[0].value.match(/^\//);
        });
      }
      return [];
    };

    Validator.prototype.validate_resource = function(resource, allowParameterKeys, context) {
      var err, resourceProperties, template, _ref1,
        _this = this;
      if (allowParameterKeys == null) {
        allowParameterKeys = false;
      }
      if (context == null) {
        context = "resource";
      }
      if (!(resource[1] && util.isNullableMapping(resource[1]))) {
        throw new exports.ValidationError('while validating resources', null, 'resource is not a map', resource[1].start_mark);
      }
      if (resource[0].value) {
        try {
          template = uritemplate.parse(resource[0].value);
        } catch (_error) {
          err = _error;
          throw new exports.ValidationError('while validating resource', null, "Resource name is invalid: " + (err != null ? (_ref1 = err.options) != null ? _ref1.message : void 0 : void 0), resource[0].start_mark);
        }
      }
      if (util.isNull(resource[1])) {
        return;
      }
      if (resource[1].value) {
        resourceProperties = {};
        return resource[1].value.forEach(function(property) {
          var canonicalKey, key, valid;
          if (property[0].value.match(/^\//)) {
            _this.trackRepeatedProperties(resourceProperties, _this.canonicalizePropertyName(property[0].value, true), property[0].start_mark, 'while validating resource', "resource already declared");
          } else if (_this.isHttpMethod(property[0].value, allowParameterKeys)) {
            _this.trackRepeatedProperties(resourceProperties, _this.canonicalizePropertyName(property[0].value, true), property[0].start_mark, 'while validating resource', "method already declared");
          } else {
            _this.trackRepeatedProperties(resourceProperties, _this.canonicalizePropertyName(property[0].value, true), property[0].start_mark, 'while validating resource', "property already used");
          }
          if (!_this.validate_common_properties(property, allowParameterKeys)) {
            if (property[0].value.match(/^\//)) {
              if (allowParameterKeys) {
                throw new exports.ValidationError('while validating trait properties', null, 'resource type cannot define child resources', property[0].start_mark);
              }
              return _this.validate_resource(property, allowParameterKeys);
            } else if (_this.isHttpMethod(property[0].value, allowParameterKeys)) {
              return _this.validate_method(property, allowParameterKeys, 'method');
            } else {
              key = property[0].value;
              canonicalKey = _this.canonicalizePropertyName(key, allowParameterKeys);
              valid = true;
              switch (canonicalKey) {
                case "uriParameters":
                  if (!util.isNullableMapping(property[1])) {
                    throw new exports.ValidationError('while validating uri parameters', null, 'uri parameters must be a map', property[0].start_mark);
                  }
                  _this.validate_uri_parameters(resource[0].value, property[1], allowParameterKeys, allowParameterKeys);
                  break;
                case "baseUriParameters":
                  if (!_this.baseUri) {
                    throw new exports.ValidationError('while validating uri parameters', null, 'base uri parameters defined when there is no baseUri', property[0].start_mark);
                  }
                  if (!util.isNullableMapping(property[1])) {
                    throw new exports.ValidationError('while validating uri parameters', null, 'base uri parameters must be a map', property[0].start_mark);
                  }
                  _this.validate_uri_parameters(_this.baseUri, property[1], allowParameterKeys);
                  break;
                default:
                  valid = false;
              }
              switch (key) {
                case "type":
                  return _this.validate_type_property(property, allowParameterKeys);
                case "usage":
                  if (!allowParameterKeys) {
                    throw new exports.ValidationError('while validating resources', null, "property: '" + property[0].value + "' is invalid in a resource", property[0].start_mark);
                  }
                  break;
                case "securedBy":
                  return _this.validate_secured_by(property);
                default:
                  if (!valid) {
                    throw new exports.ValidationError('while validating resources', null, "property: '" + property[0].value + ("' is invalid in a " + context), property[0].start_mark);
                  }
              }
            }
          }
        });
      }
    };

    Validator.prototype.validate_secured_by = function(property) {
      var secScheme, secSchemes, securitySchemeName, _i, _len, _ref1, _results;
      if (!util.isSequence(property[1])) {
        throw new exports.ValidationError('while validating securityScheme', null, "property 'securedBy' must be an array", property[0].start_mark);
      }
      secSchemes = this.get_list_values(property[1].value);
      if (this.hasDuplicates(secSchemes)) {
        throw new exports.ValidationError('while validating securityScheme consumption', null, 'securitySchemes can only be referenced once in a securedBy property', property[0].start_mark);
      }
      _ref1 = property[1].value;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        secScheme = _ref1[_i];
        if (util.isSequence(secScheme)) {
          throw new exports.ValidationError('while validating securityScheme consumption', null, 'securityScheme reference cannot be an array', secScheme.start_mark);
        }
        if (!util.isNull(secScheme)) {
          securitySchemeName = this.key_or_value(secScheme);
          if (!this.get_security_scheme(securitySchemeName)) {
            throw new exports.ValidationError('while validating securityScheme consumption', null, 'there is no securityScheme named ' + securitySchemeName, secScheme.start_mark);
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Validator.prototype.validate_protocols_property = function(property) {
      var protocol, _i, _len, _ref1, _ref2, _results;
      if (!util.isSequence(property[1])) {
        throw new exports.ValidationError('while validating protocols', null, 'property must be an array', property[0].start_mark);
      }
      _ref1 = property[1].value;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        protocol = _ref1[_i];
        if (!util.isString(protocol)) {
          throw new exports.ValidationError('while validating protocols', null, 'value must be a string', protocol.start_mark);
        }
        if ((_ref2 = protocol.value) !== 'HTTP' && _ref2 !== 'HTTPS') {
          throw new exports.ValidationError('while validating protocols', null, 'only HTTP and HTTPS values are allowed', protocol.start_mark);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Validator.prototype.validate_type_property = function(property, allowParameterKeys) {
      var typeName,
        _this = this;
      if (!(util.isMapping(property[1]) || util.isString(property[1]))) {
        throw new exports.ValidationError('while validating resource types', null, "property 'type' must be a string or a map", property[0].start_mark);
      }
      if (util.isMapping(property[1])) {
        if (property[1].value.length > 1) {
          throw new exports.ValidationError('while validating resource types', null, 'a resource or resourceType can inherit from a single resourceType', property[0].start_mark);
        }
      }
      typeName = this.key_or_value(property[1]);
      if (!typeName) {
        throw new exports.ValidationError('while validating resource type consumption', null, 'missing resource type name in type property', property[1].start_mark);
      }
      if (!(this.isParameterKeyValue(typeName) || this.get_type(typeName))) {
        throw new exports.ValidationError('while validating resource type consumption', null, "there is no resource type named " + typeName, property[1].start_mark);
      }
      if (util.isMapping(property[1])) {
        return property[1].value.forEach(function(parameter) {
          if (!(util.isNull(parameter[1]) || util.isMapping(parameter[1]))) {
            throw new exports.ValidationError('while validating resource consumption', null, 'resource type parameters must be in a map', parameter[1].start_mark);
          }
        });
      }
    };

    Validator.prototype.validate_method = function(method, allowParameterKeys, context) {
      var canonicalKey, key, methodProperties, property, valid, _i, _len, _ref1, _results;
      if (context == null) {
        context = 'method';
      }
      if (util.isNull(method[1])) {
        return;
      }
      if (!util.isMapping(method[1])) {
        throw new exports.ValidationError('while validating methods', null, "method must be a map", method[0].start_mark);
      }
      methodProperties = {};
      _ref1 = method[1].value;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        property = _ref1[_i];
        this.trackRepeatedProperties(methodProperties, this.canonicalizePropertyName(property[0].value, true), property[0].start_mark, 'while validating method', "property already used");
        if (this.validate_common_properties(property, allowParameterKeys, context)) {
          continue;
        }
        key = property[0].value;
        canonicalKey = this.canonicalizePropertyName(key, allowParameterKeys);
        valid = true;
        switch (canonicalKey) {
          case 'headers':
            this.validate_headers(property, allowParameterKeys);
            break;
          case 'queryParameters':
            this.validate_query_params(property, allowParameterKeys);
            break;
          case 'body':
            this.validate_body(property, allowParameterKeys, null, false);
            break;
          case 'responses':
            this.validate_responses(property, allowParameterKeys);
            break;
          default:
            valid = false;
        }
        switch (key) {
          case 'securedBy':
            _results.push(this.validate_secured_by(property));
            break;
          case 'baseUriParameters':
            if (!this.baseUri) {
              throw new exports.ValidationError('while validating uri parameters', null, 'base uri parameters defined when there is no baseUri', property[0].start_mark);
            }
            if (!util.isNullableMapping(property[1])) {
              throw new exports.ValidationError('while validating uri parameters', null, 'base uri parameters must be a map', property[0].start_mark);
            }
            _results.push(this.validate_uri_parameters(this.baseUri, property[1], allowParameterKeys));
            break;
          case 'usage':
            if (!(allowParameterKeys && context === 'trait')) {
              throw new exports.ValidationError('while validating resources', null, "property: 'usage' is invalid in a " + context, property[0].start_mark);
            } else {
              _results.push(void 0);
            }
            break;
          case 'protocols':
            _results.push(this.validate_protocols_property(property));
            break;
          default:
            if (!valid) {
              throw new exports.ValidationError('while validating resources', null, "property: '" + property[0].value + "' is invalid in a " + context, property[0].start_mark);
            } else {
              _results.push(void 0);
            }
        }
      }
      return _results;
    };

    Validator.prototype.validate_responses = function(responses, allowParameterKeys) {
      var response, responseValues, _i, _len, _ref1, _results;
      if (util.isNull(responses[1])) {
        return;
      }
      if (!util.isMapping(responses[1])) {
        throw new exports.ValidationError('while validating responses', null, "property: 'responses' must be a map", responses[0].start_mark);
      }
      responseValues = {};
      _ref1 = responses[1].value;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        response = _ref1[_i];
        if (!util.isNullableMapping(response[1])) {
          throw new exports.ValidationError('while validating responses', null, 'each response must be a map', response[1].start_mark);
        }
        this.trackRepeatedProperties(responseValues, this.canonicalizePropertyName(response[0].value, true), response[0].start_mark, 'while validating responses', "response code already used");
        _results.push(this.validate_response(response, allowParameterKeys));
      }
      return _results;
    };

    Validator.prototype.validate_query_params = function(property, allowParameterKeys) {
      var param, queryParameters, _i, _len, _ref1, _results;
      if (util.isNull(property[1])) {
        return;
      }
      if (!util.isMapping(property[1])) {
        throw new exports.ValidationError('while validating query parameters', null, "property: 'queryParameters' must be a map", property[0].start_mark);
      }
      queryParameters = {};
      _ref1 = property[1].value;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        param = _ref1[_i];
        if (!(util.isNullableMapping(param[1]) || util.isNullableSequence(param[1]))) {
          throw new exports.ValidationError('while validating query parameters', null, "each query parameter must be a map", param[1].start_mark);
        }
        this.trackRepeatedProperties(queryParameters, this.canonicalizePropertyName(param[0].value, true), param[0].start_mark, 'while validating query parameter', "parameter name already used");
        _results.push(this.valid_common_parameter_properties(param[1], allowParameterKeys));
      }
      return _results;
    };

    Validator.prototype.validate_form_params = function(property, allowParameterKeys) {
      var formParameters, param, _i, _len, _ref1, _results;
      if (util.isNull(property[1])) {
        return;
      }
      if (!util.isMapping(property[1])) {
        throw new exports.ValidationError('while validating query parameters', null, "property: 'formParameters' must be a map", property[0].start_mark);
      }
      formParameters = {};
      _ref1 = property[1].value;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        param = _ref1[_i];
        if (!(util.isNullableMapping(param[1]) || util.isNullableSequence(param[1]))) {
          throw new exports.ValidationError('while validating query parameters', null, 'each form parameter must be a map', param[1].start_mark);
        }
        this.trackRepeatedProperties(formParameters, this.canonicalizePropertyName(param[0].value, true), param[0].start_mark, 'while validating form parameter', "parameter name already used");
        _results.push(this.valid_common_parameter_properties(param[1], allowParameterKeys));
      }
      return _results;
    };

    Validator.prototype.validate_headers = function(property, allowParameterKeys) {
      var headerNames, param, _i, _len, _ref1, _results;
      if (util.isNull(property[1])) {
        return;
      }
      if (!util.isMapping(property[1])) {
        throw new exports.ValidationError('while validating headers', null, "property: 'headers' must be a map", property[0].start_mark);
      }
      headerNames = {};
      _ref1 = property[1].value;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        param = _ref1[_i];
        if (!(util.isNullableMapping(param[1]) || util.isNullableSequence(param[1]))) {
          throw new exports.ValidationError('while validating query parameters', null, "each header must be a map", param[1].start_mark);
        }
        this.trackRepeatedProperties(headerNames, this.canonicalizePropertyName(param[0].value, true), param[0].start_mark, 'while validating headers', "header name already used");
        _results.push(this.valid_common_parameter_properties(param[1], allowParameterKeys));
      }
      return _results;
    };

    Validator.prototype.validate_response = function(response, allowParameterKeys) {
      var canonicalKey, property, responseProperties, _i, _len, _ref1, _results,
        _this = this;
      if (util.isSequence(response[0])) {
        if (!response[0].value.length) {
          throw new exports.ValidationError('while validating responses', null, 'there must be at least one response code', response[0].start_mark);
        }
        response[0].value.forEach(function(responseCode) {
          if (!(_this.isParameterKey(responseCode) || util.isInteger(responseCode) || !isNaN(_this.canonicalizePropertyName(responseCode, allowParameterKeys)))) {
            throw new exports.ValidationError('while validating responses', null, "each response key must be an integer", responseCode.start_mark);
          }
        });
      } else if (!(this.isParameterKey(response) || util.isInteger(response[0]) || !isNaN(this.canonicalizePropertyName(response[0].value, allowParameterKeys)))) {
        throw new exports.ValidationError('while validating responses', null, "each response key must be an integer", response[0].start_mark);
      }
      if (!util.isNullableMapping(response[1])) {
        throw new exports.ValidationError('while validating responses', null, "each response property must be a map", response[0].start_mark);
      }
      if (util.isMapping(response[1])) {
        responseProperties = {};
        _ref1 = response[1].value;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          property = _ref1[_i];
          canonicalKey = this.canonicalizePropertyName(property[0].value, allowParameterKeys);
          this.trackRepeatedProperties(responseProperties, canonicalKey, property[0].start_mark, 'while validating responses', "property already used");
          if (!this.isParameterKey(property)) {
            switch (canonicalKey) {
              case "body":
                _results.push(this.validate_body(property, allowParameterKeys, null, true));
                break;
              case "description":
                if (!util.isScalar(property[1])) {
                  throw new exports.ValidationError('while validating responses', null, 'property description must be a string', response[0].start_mark);
                } else {
                  _results.push(void 0);
                }
                break;
              case "headers":
                if (!util.isNullableMapping(property[1])) {
                  throw new exports.ValidationError('while validating resources', null, "property 'headers' must be a map", property[0].start_mark);
                }
                _results.push(this.validate_headers(property));
                break;
              default:
                throw new exports.ValidationError('while validating response', null, "property: '" + property[0].value + "' is invalid in a response", property[0].start_mark);
            }
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    Validator.prototype.isHttpMethod = function(value, allowParameterKeys) {
      var _ref1;
      if (allowParameterKeys == null) {
        allowParameterKeys = false;
      }
      if (value) {
        value = this.canonicalizePropertyName(value, allowParameterKeys);
        return (_ref1 = value.toLowerCase()) === 'get' || _ref1 === 'post' || _ref1 === 'put' || _ref1 === 'delete' || _ref1 === 'head' || _ref1 === 'patch' || _ref1 === 'options' || _ref1 === 'update';
      }
      return false;
    };

    Validator.prototype.isParameterKey = function(property) {
      if (this.isParameterKeyValue(property[0].value)) {
        return true;
      } else if (property[0].value.match(/<<\s*([^\|\s>]+)\s*\|.*\s*>>/g)) {
        throw new exports.ValidationError('while validating parameter', null, "unknown function applied to property name", property[0].start_mark);
      }
      return false;
    };

    Validator.prototype.isParameterKeyValue = function(value) {
      if (value.match(/<<\s*([^\|\s>]+)\s*>>/g) || value.match(/<<\s*([^\|\s>]+)\s*(\|\s*\!\s*(singularize|pluralize))?\s*>>/g)) {
        return true;
      }
      return false;
    };

    Validator.prototype.validate_body = function(property, allowParameterKeys, bodyMode, isResponseBody) {
      var bodyProperties, bodyProperty, canonicalProperty, implicitMode, key, _i, _len, _ref1;
      if (bodyMode == null) {
        bodyMode = null;
      }
      if (util.isNull(property[1])) {
        return;
      }
      if (!util.isMapping(property[1])) {
        throw new exports.ValidationError('while validating body', null, "property: body specification must be a map", property[0].start_mark);
      }
      implicitMode = ["implicit", "forcedImplicit"];
      bodyProperties = {};
      _ref1 = property[1].value;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        bodyProperty = _ref1[_i];
        this.trackRepeatedProperties(bodyProperties, this.canonicalizePropertyName(bodyProperty[0].value, true), bodyProperty[0].start_mark, 'while validating body', "property already used");
        if (this.isParameterKey(bodyProperty)) {
          if (!allowParameterKeys) {
            throw new exports.ValidationError('while validating body', null, "property '" + bodyProperty[0].value + "' is invalid in a resource", bodyProperty[0].start_mark);
          }
        } else if (bodyProperty[0].value.match(/^[^\/]+\/[^\/]+$/)) {
          if (bodyMode && bodyMode !== "explicit") {
            throw new exports.ValidationError('while validating body', null, "not compatible with implicit default Media Type", bodyProperty[0].start_mark);
          }
          bodyMode = "explicit";
          this.validate_body(bodyProperty, allowParameterKeys, "forcedImplicit", isResponseBody);
        } else {
          key = bodyProperty[0].value;
          canonicalProperty = this.canonicalizePropertyName(key, allowParameterKeys);
          switch (canonicalProperty) {
            case "formParameters":
              if (bodyMode && __indexOf.call(implicitMode, bodyMode) < 0) {
                throw new exports.ValidationError('while validating body', null, "not compatible with explicit Media Type", bodyProperty[0].start_mark);
              }
              if (bodyMode == null) {
                bodyMode = "implicit";
              }
              this.validate_form_params(bodyProperty, allowParameterKeys);
              break;
            case "example":
              if (bodyMode && __indexOf.call(implicitMode, bodyMode) < 0) {
                throw new exports.ValidationError('while validating body', null, "not compatible with explicit Media Type", bodyProperty[0].start_mark);
              }
              if (bodyMode == null) {
                bodyMode = "implicit";
              }
              if (!util.isScalar(bodyProperty[1])) {
                throw new exports.ValidationError('while validating body', null, "example must be a string", bodyProperty[0].start_mark);
              }
              break;
            case "schema":
              if (bodyMode && __indexOf.call(implicitMode, bodyMode) < 0) {
                throw new exports.ValidationError('while validating body', null, "not compatible with explicit Media Type", bodyProperty[0].start_mark);
              }
              if (bodyMode == null) {
                bodyMode = "implicit";
              }
              if (!util.isScalar(bodyProperty[1])) {
                throw new exports.ValidationError('while validating body', null, "schema must be a string", bodyProperty[0].start_mark);
              }
              break;
            default:
              throw new exports.ValidationError('while validating body', null, "property: '" + bodyProperty[0].value + "' is invalid in a body", bodyProperty[0].start_mark);
          }
        }
      }
      if ("formParameters" in bodyProperties) {
        if (isResponseBody) {
          throw new exports.ValidationError('while validating body', null, "formParameters cannot be used to describe response bodies", property[0].start_mark);
        }
        if ("schema" in bodyProperties || "example" in bodyProperties) {
          throw new exports.ValidationError('while validating body', null, "formParameters cannot be used together with the example or schema properties", property[0].start_mark);
        }
      }
      if (bodyMode === "implicit") {
        if (!this.get_media_type()) {
          throw new exports.ValidationError('while validating body', null, "body tries to use default Media Type, but mediaType is null", property[0].start_mark);
        }
      }
    };

    Validator.prototype.validate_common_properties = function(property, allowParameterKeys, context) {
      var canonicalProperty, key, parameter, traitName, use, _i, _j, _len, _len1, _ref1, _ref2;
      if (this.isParameterKey(property)) {
        if (!allowParameterKeys) {
          throw new exports.ValidationError('while validating resources', null, "property '" + property[0].value + "' is invalid in a resource", property[0].start_mark);
        }
        return true;
      } else {
        key = property[0].value;
        canonicalProperty = this.canonicalizePropertyName(key, allowParameterKeys);
        switch (canonicalProperty) {
          case "displayName":
            if (context === 'method') {
              return false;
            }
            if (!util.isScalar(property[1])) {
              throw new exports.ValidationError('while validating resources', null, "property 'displayName' must be a string", property[0].start_mark);
            }
            return true;
          case "description":
            if (!util.isScalar(property[1])) {
              throw new exports.ValidationError('while validating resources', null, "property 'description' must be a string", property[0].start_mark);
            }
            return true;
        }
        switch (key) {
          case "is":
            if (!util.isSequence(property[1])) {
              throw new exports.ValidationError('while validating resources', null, "property 'is' must be an array", property[0].start_mark);
            }
            if (!(property[1].value instanceof Array)) {
              throw new exports.ValidationError('while validating trait consumption', null, 'is property must be an array', property[0].start_mark);
            }
            _ref1 = property[1].value;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              use = _ref1[_i];
              traitName = this.key_or_value(use);
              if (!this.isParameterKeyValue(traitName) && !this.get_trait(traitName)) {
                throw new exports.ValidationError('while validating trait consumption', null, 'there is no trait named ' + traitName, use.start_mark);
              }
              if (util.isMapping(use[1])) {
                _ref2 = property[1].value;
                for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                  parameter = _ref2[_j];
                  if (!(util.isNull(parameter[1]) || util.isMapping(parameter[1]))) {
                    throw new exports.ValidationError('while validating resource consumption', null, 'type parameters must be in a map', parameter[1].start_mark);
                  }
                }
              }
            }
            return true;
        }
      }
      return false;
    };

    Validator.prototype.child_methods = function(node) {
      var _this = this;
      if (!(node && util.isMapping(node))) {
        return [];
      }
      return node.value.filter(function(childNode) {
        return _this.isHttpMethod(childNode[0].value);
      });
    };

    Validator.prototype.has_property = function(node, property) {
      if (node && util.isMapping(node)) {
        return node.value.some(function(childNode) {
          return childNode[0].value && typeof childNode[0].value !== "object" && childNode[0].value.match(property);
        });
      }
      return false;
    };

    Validator.prototype.property_value = function(node, property) {
      var filteredNodes;
      filteredNodes = node.value.filter(function(childNode) {
        return typeof childNode[0].value !== "object" && childNode[0].value.match(property);
      });
      if (filteredNodes.length) {
        return filteredNodes[0][1].value;
      }
    };

    Validator.prototype.get_property = function(node, property) {
      var filteredNodes,
        _this = this;
      if (node && util.isMapping(node)) {
        filteredNodes = node.value.filter(function(childNode) {
          return util.isString(childNode[0]) && childNode[0].value.match(property);
        });
        if (filteredNodes.length > 0) {
          if (filteredNodes[0].length > 0) {
            return filteredNodes[0][1];
          }
        }
      }
      return [];
    };

    Validator.prototype.get_properties = function(node, property) {
      var prop, properties, _i, _len, _ref1, _ref2;
      properties = [];
      if (node && util.isMapping(node)) {
        _ref1 = node.value;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          prop = _ref1[_i];
          if (util.isString(prop[0]) && ((_ref2 = prop[0].value) != null ? _ref2.match(property) : void 0)) {
            properties.push(prop);
          } else {
            properties = properties.concat(this.get_properties(prop[1], property));
          }
        }
      }
      return properties;
    };

    Validator.prototype.resources = function(node, parentPath) {
      var child_resources, response,
        _this = this;
      if (node == null) {
        node = this.get_single_node(true, true, false);
      }
      response = [];
      child_resources = this.child_resources(node);
      child_resources.forEach(function(childResource) {
        var resourceResponse;
        resourceResponse = {};
        resourceResponse.methods = [];
        if (parentPath != null) {
          resourceResponse.uri = parentPath + childResource[0].value;
        } else {
          resourceResponse.uri = childResource[0].value;
        }
        if (_this.has_property(childResource[1], "displayName")) {
          resourceResponse.displayName = _this.property_value(childResource[1], "displayName");
        }
        if (_this.has_property(childResource[1], "get")) {
          resourceResponse.methods.push('get');
        }
        if (_this.has_property(childResource[1], "post")) {
          resourceResponse.methods.push('post');
        }
        if (_this.has_property(childResource[1], "put")) {
          resourceResponse.methods.push('put');
        }
        if (_this.has_property(childResource[1], "patch")) {
          resourceResponse.methods.push('patch');
        }
        if (_this.has_property(childResource[1], "delete")) {
          resourceResponse.methods.push('delete');
        }
        if (_this.has_property(childResource[1], "head")) {
          resourceResponse.methods.push('head');
        }
        if (_this.has_property(childResource[1], "options")) {
          resourceResponse.methods.push('options');
        }
        resourceResponse.line = childResource[0].start_mark.line + 1;
        resourceResponse.column = childResource[0].start_mark.column + 1;
        if (childResource[0].start_mark.name != null) {
          resourceResponse.src = childResource[0].start_mark.name;
        }
        response.push(resourceResponse);
        return response = response.concat(_this.resources(childResource[1], resourceResponse.uri));
      });
      return response;
    };

    Validator.prototype.valid_absolute_uris = function(node) {
      var repeatedUri, uris;
      uris = this.get_absolute_uris(node);
      if (repeatedUri = this.hasDuplicatesUris(uris)) {
        throw new exports.ValidationError('while validating trait consumption', null, "two resources share same URI " + repeatedUri.uri, repeatedUri.mark);
      }
    };

    Validator.prototype.get_absolute_uris = function(node, parentPath) {
      var child_resources, response,
        _this = this;
      if (node == null) {
        node = this.get_single_node(true, true, false);
      }
      response = [];
      if (!util.isNullableMapping(node)) {
        throw new exports.ValidationError('while validating resources', null, 'resource is not a map', node.start_mark);
      }
      child_resources = this.child_resources(node);
      child_resources.forEach(function(childResource) {
        var uri;
        if (parentPath != null) {
          uri = parentPath + childResource[0].value;
        } else {
          uri = childResource[0].value;
        }
        response.push({
          uri: uri,
          mark: childResource[0].start_mark
        });
        return response = response.concat(_this.get_absolute_uris(childResource[1], uri));
      });
      return response;
    };

    Validator.prototype.key_or_value = function(node) {
      var possibleKeyName, _ref1, _ref2, _ref3;
      if (node instanceof nodes.ScalarNode) {
        return node.value;
      }
      if (node instanceof nodes.MappingNode) {
        possibleKeyName = node != null ? (_ref1 = node.value) != null ? (_ref2 = _ref1[0]) != null ? (_ref3 = _ref2[0]) != null ? _ref3.value : void 0 : void 0 : void 0 : void 0;
        if (possibleKeyName) {
          return possibleKeyName;
        }
      }
      return null;
    };

    Validator.prototype.value_or_undefined = function(node) {
      if (node instanceof nodes.MappingNode) {
        return node.value;
      }
      return void 0;
    };

    Validator.prototype.validate_base_uri = function(baseUriNode) {
      var baseUri, err, expressions, protocol, template, _ref1;
      baseUri = (baseUriNode.value || '').trim();
      if (!baseUri) {
        throw new exports.ValidationError('while validating baseUri', null, 'baseUri must have a value', baseUriNode.start_mark);
      }
      protocol = ((url.parse(baseUri)).protocol || 'http:').slice(0, -1).toUpperCase();
      if (protocol !== 'HTTP' && protocol !== 'HTTPS') {
        throw new exports.ValidationError('while validating baseUri', null, 'baseUri protocol must be either HTTP or HTTPS', baseUriNode.start_mark);
      }
      try {
        template = uritemplate.parse(baseUri);
      } catch (_error) {
        err = _error;
        throw new exports.ValidationError('while validating baseUri', null, err != null ? (_ref1 = err.options) != null ? _ref1.message : void 0 : void 0, baseUriNode.start_mark);
      }
      expressions = template.expressions.filter(function(expr) {
        return 'templateText' in expr;
      }).map(function(expression) {
        return expression.templateText;
      });
      if (__indexOf.call(expressions, 'version') >= 0) {
        return true;
      }
    };

    Validator.prototype.get_validation_errors = function() {
      return this.validation_errors;
    };

    Validator.prototype.is_valid = function() {
      return this.validation_errors.length === 0;
    };

    Validator.prototype.hasDuplicatesUris = function(array) {
      var item, output, _i, _len;
      output = {};
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        item = array[_i];
        if (item.uri in output) {
          return item;
        }
        output[item.uri] = item;
      }
      return false;
    };

    Validator.prototype.hasDuplicates = function(array) {
      var item, output, _i, _len;
      output = {};
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        item = array[_i];
        if (item in output) {
          return true;
        }
        output[item] = true;
      }
      return false;
    };

    return Validator;

  })();

}).call(this);

},{"./errors":1,"./nodes":13,"./traits":23,"./util":4,"uritemplate":30,"url":7}],23:[function(require,module,exports){
(function() {
  var MarkedYAMLError, inflection, nodes, util, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  MarkedYAMLError = require('./errors').MarkedYAMLError;

  nodes = require('./nodes');

  inflection = require('inflection');

  util = require('./util');

  /*
  The Traits throws these.
  */


  this.TraitError = (function(_super) {
    __extends(TraitError, _super);

    function TraitError() {
      _ref = TraitError.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return TraitError;

  })(MarkedYAMLError);

  /*
  */


  this.ParameterError = (function(_super) {
    __extends(ParameterError, _super);

    function ParameterError() {
      _ref1 = ParameterError.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    return ParameterError;

  })(MarkedYAMLError);

  /*
  The Traits class deals with applying traits to resources according to the spec
  */


  this.Traits = (function() {
    function Traits() {
      this.declaredTraits = {};
    }

    Traits.prototype.load_traits = function(node) {
      var allTraits,
        _this = this;
      if (this.has_property(node, /^traits$/)) {
        allTraits = this.property_value(node, /^traits$/);
        if (allTraits && typeof allTraits === "object") {
          return allTraits.forEach(function(trait_item) {
            if (trait_item && typeof trait_item === "object" && typeof trait_item.value === "object") {
              return trait_item.value.forEach(function(trait) {
                return _this.declaredTraits[trait[0].value] = trait;
              });
            }
          });
        }
      }
    };

    Traits.prototype.has_traits = function(node) {
      if (this.declaredTraits.length === 0 && this.has_property(node, /^traits$/)) {
        this.load_traits(node);
      }
      return Object.keys(this.declaredTraits).length > 0;
    };

    Traits.prototype.get_trait = function(traitName) {
      if (traitName in this.declaredTraits) {
        return this.declaredTraits[traitName][1];
      }
      return null;
    };

    Traits.prototype.apply_traits = function(node, resourceUri, removeQs) {
      var resources,
        _this = this;
      if (resourceUri == null) {
        resourceUri = "";
      }
      if (removeQs == null) {
        removeQs = true;
      }
      if (!util.isMapping(node)) {
        return;
      }
      if (this.has_traits(node)) {
        resources = this.child_resources(node);
        return resources.forEach(function(resource) {
          return _this.apply_traits_to_resource(resourceUri + resource[0].value, resource[1], removeQs);
        });
      }
    };

    Traits.prototype.apply_traits_to_resource = function(resourceUri, resource, removeQs) {
      var methods, uses,
        _this = this;
      if (!util.isMapping(resource)) {
        return;
      }
      methods = this.child_methods(resource);
      if (this.has_property(resource, /^is$/)) {
        uses = this.property_value(resource, /^is$/);
        uses.forEach(function(use) {
          return methods.forEach(function(method) {
            return _this.apply_trait(resourceUri, method, use);
          });
        });
      }
      methods.forEach(function(method) {
        if (_this.has_property(method[1], /^is$/)) {
          uses = _this.property_value(method[1], /^is$/);
          return uses.forEach(function(use) {
            return _this.apply_trait(resourceUri, method, use);
          });
        }
      });
      if (removeQs) {
        resource.remove_question_mark_properties();
      }
      return this.apply_traits(resource, resourceUri, removeQs);
    };

    Traits.prototype.apply_trait = function(resourceUri, method, useKey) {
      var plainParameters, temp, trait, traitName;
      traitName = this.key_or_value(useKey);
      if (!(trait = this.get_trait(traitName))) {
        throw new exports.TraitError('while applying trait', null, "there is no trait named " + traitName, useKey.start_mark);
      }
      plainParameters = this.get_parameters_from_is_key(resourceUri, method[0].value, useKey);
      temp = trait.cloneForTrait();
      this.apply_parameters(temp, plainParameters, useKey);
      this.apply_default_media_type_to_method(temp);
      temp.combine(method[1]);
      return method[1] = temp;
    };

    Traits.prototype.apply_parameters = function(resource, parameters, useKey) {
      var parameterName, usedParameters, _results;
      this._apply_parameters(resource, parameters, useKey, usedParameters = {
        resourcePath: true,
        methodName: true
      });
      _results = [];
      for (parameterName in parameters) {
        if (!usedParameters[parameterName]) {
          throw new exports.ParameterError('while applying parameters', null, "unused parameter: " + parameterName, useKey.start_mark);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Traits.prototype._apply_parameters = function(resource, parameters, useKey, usedParameters) {
      var parameterUse,
        _this = this;
      if (!resource) {
        return;
      }
      if (util.isString(resource)) {
        if (parameterUse = resource.value.match(/<<\s*([^\|\s>]+)\s*(\|.*)?\s*>>/g)) {
          parameterUse.forEach(function(parameter) {
            var method, parameterName, value, _ref2, _ref3;
            parameterName = parameter != null ? (_ref2 = parameter.trim()) != null ? _ref2.replace(/[<>]+/g, '').trim() : void 0 : void 0;
            _ref3 = parameterName.split(/\s*\|\s*/), parameterName = _ref3[0], method = _ref3[1];
            if (!(parameterName in parameters)) {
              throw new exports.ParameterError('while applying parameters', null, "value was not provided for parameter: " + parameterName, useKey.start_mark);
            }
            value = parameters[parameterName];
            usedParameters[parameterName] = true;
            if (method) {
              if (method.match(/!\s*singularize/)) {
                value = inflection.singularize(value);
              } else if (method.match(/!\s*pluralize/)) {
                value = inflection.pluralize(value);
              } else {
                throw new exports.ParameterError('while validating parameter', null, 'unknown function applied to parameter', resource.start_mark);
              }
            }
            return resource.value = resource.value.replace(parameter, value);
          });
        }
        return;
      }
      if (util.isSequence(resource)) {
        resource.value.forEach(function(node) {
          return _this._apply_parameters(node, parameters, useKey, usedParameters);
        });
        return;
      }
      if (util.isMapping(resource)) {
        resource.value.forEach(function(property) {
          _this._apply_parameters(property[0], parameters, useKey, usedParameters);
          return _this._apply_parameters(property[1], parameters, useKey, usedParameters);
        });
      }
    };

    Traits.prototype.get_parameters_from_is_key = function(resourceUri, methodName, typeKey) {
      var parameters, result,
        _this = this;
      result = {
        methodName: methodName,
        resourcePath: resourceUri.replace(/\/\/*/g, '/')
      };
      if (!util.isMapping(typeKey)) {
        return result;
      }
      parameters = this.value_or_undefined(typeKey);
      parameters[0][1].value.forEach(function(parameter) {
        var _ref2;
        if (!util.isScalar(parameter[1])) {
          throw new exports.TraitError('while applying parameters', null, 'parameter value is not a scalar', parameter[1].start_mark);
        }
        if ((_ref2 = parameter[1].value) === "methodName" || _ref2 === "resourcePath" || _ref2 === "resourcePathName") {
          throw new exports.TraitError('while applying parameters', null, 'invalid parameter name "methodName", "resourcePath" are reserved parameter names "resourcePathName"', parameter[1].start_mark);
        }
        return result[parameter[0].value] = parameter[1].value;
      });
      return result;
    };

    return Traits;

  })();

}).call(this);

},{"./errors":1,"./nodes":13,"./util":4,"inflection":31}],29:[function(require,module,exports){
(function(process,Buffer){/**
 * Wrapper for built-in http.js to emulate the browser XMLHttpRequest object.
 *
 * This can be used with JS designed for browsers to improve reuse of code and
 * allow the use of existing libraries.
 *
 * Usage: include("XMLHttpRequest.js") and use XMLHttpRequest per W3C specs.
 *
 * @author Dan DeFelippi <dan@driverdan.com>
 * @contributor David Ellis <d.f.ellis@ieee.org>
 * @license MIT
 */

var Url = require("url")
  , spawn = require("child_process").spawn
  , fs = require('fs');

exports.XMLHttpRequest = function() {
  /**
   * Private variables
   */
  var self = this;
  var http = require('http');
  var https = require('https');

  // Holds http.js objects
  var client;
  var request;
  var response;

  // Request settings
  var settings = {};

  // Disable header blacklist.
  // Not part of XHR specs.
  var disableHeaderCheck = false;

  // Set some default headers
  var defaultHeaders = {
    "User-Agent": "node-XMLHttpRequest",
    "Accept": "*/*",
  };

  var headers = defaultHeaders;

  // These headers are not user setable.
  // The following are allowed but banned in the spec:
  // * user-agent
  var forbiddenRequestHeaders = [
    "accept-charset",
    "accept-encoding",
    "access-control-request-headers",
    "access-control-request-method",
    "connection",
    "content-length",
    "content-transfer-encoding",
    "cookie",
    "cookie2",
    "date",
    "expect",
    "host",
    "keep-alive",
    "origin",
    "referer",
    "te",
    "trailer",
    "transfer-encoding",
    "upgrade",
    "via"
  ];

  // These request methods are not allowed
  var forbiddenRequestMethods = [
    "TRACE",
    "TRACK",
    "CONNECT"
  ];

  // Send flag
  var sendFlag = false;
  // Error flag, used when errors occur or abort is called
  var errorFlag = false;

  // Event listeners
  var listeners = {};

  /**
   * Constants
   */

  this.UNSENT = 0;
  this.OPENED = 1;
  this.HEADERS_RECEIVED = 2;
  this.LOADING = 3;
  this.DONE = 4;

  /**
   * Public vars
   */

  // Current state
  this.readyState = this.UNSENT;

  // default ready state change handler in case one is not set or is set late
  this.onreadystatechange = null;

  // Result & response
  this.responseText = "";
  this.responseXML = "";
  this.status = null;
  this.statusText = null;

  /**
   * Private methods
   */

  /**
   * Check if the specified header is allowed.
   *
   * @param string header Header to validate
   * @return boolean False if not allowed, otherwise true
   */
  var isAllowedHttpHeader = function(header) {
    return disableHeaderCheck || (header && forbiddenRequestHeaders.indexOf(header.toLowerCase()) === -1);
  };

  /**
   * Check if the specified method is allowed.
   *
   * @param string method Request method to validate
   * @return boolean False if not allowed, otherwise true
   */
  var isAllowedHttpMethod = function(method) {
    return (method && forbiddenRequestMethods.indexOf(method) === -1);
  };

  /**
   * Public methods
   */

  /**
   * Open the connection. Currently supports local server requests.
   *
   * @param string method Connection method (eg GET, POST)
   * @param string url URL for the connection.
   * @param boolean async Asynchronous connection. Default is true.
   * @param string user Username for basic authentication (optional)
   * @param string password Password for basic authentication (optional)
   */
  this.open = function(method, url, async, user, password) {
    this.abort();
    errorFlag = false;

    // Check for valid request method
    if (!isAllowedHttpMethod(method)) {
      throw "SecurityError: Request method not allowed";
      return;
    }

    settings = {
      "method": method,
      "url": url.toString(),
      "async": (typeof async !== "boolean" ? true : async),
      "user": user || null,
      "password": password || null
    };

    setState(this.OPENED);
  };

  /**
   * Disables or enables isAllowedHttpHeader() check the request. Enabled by default.
   * This does not conform to the W3C spec.
   *
   * @param boolean state Enable or disable header checking.
   */
  this.setDisableHeaderCheck = function(state) {
    disableHeaderCheck = state;
  }

  /**
   * Sets a header for the request.
   *
   * @param string header Header name
   * @param string value Header value
   */
  this.setRequestHeader = function(header, value) {
    if (this.readyState != this.OPENED) {
      throw "INVALID_STATE_ERR: setRequestHeader can only be called when state is OPEN";
    }
    if (!isAllowedHttpHeader(header)) {
      console.warn('Refused to set unsafe header "' + header + '"');
      return;
    }
    if (sendFlag) {
      throw "INVALID_STATE_ERR: send flag is true";
    }
    headers[header] = value;
  };

  /**
   * Gets a header from the server response.
   *
   * @param string header Name of header to get.
   * @return string Text of the header or null if it doesn't exist.
   */
  this.getResponseHeader = function(header) {
    if (typeof header === "string"
      && this.readyState > this.OPENED
      && response.headers[header.toLowerCase()]
      && !errorFlag
    ) {
      return response.headers[header.toLowerCase()];
    }

    return null;
  };

  /**
   * Gets all the response headers.
   *
   * @return string A string with all response headers separated by CR+LF
   */
  this.getAllResponseHeaders = function() {
    if (this.readyState < this.HEADERS_RECEIVED || errorFlag) {
      return "";
    }
    var result = "";

    for (var i in response.headers) {
      // Cookie headers are excluded
      if (i !== "set-cookie" && i !== "set-cookie2") {
        result += i + ": " + response.headers[i] + "\r\n";
      }
    }
    return result.substr(0, result.length - 2);
  };

  /**
   * Gets a request header
   *
   * @param string name Name of header to get
   * @return string Returns the request header or empty string if not set
   */
  this.getRequestHeader = function(name) {
    // @TODO Make this case insensitive
    if (typeof name === "string" && headers[name]) {
      return headers[name];
    }

    return "";
  }

  /**
   * Sends the request to the server.
   *
   * @param string data Optional data to send as request body.
   */
  this.send = function(data) {
    if (this.readyState != this.OPENED) {
      throw "INVALID_STATE_ERR: connection must be opened before send() is called";
    }

    if (sendFlag) {
      throw "INVALID_STATE_ERR: send has already been called";
    }

    var ssl = false, local = false;
    var url = Url.parse(settings.url);

    // Determine the server
    switch (url.protocol) {
      case 'https:':
        ssl = true;
        // SSL & non-SSL both need host, no break here.
      case 'http:':
        var host = url.hostname;
        break;

      case 'file:':
        local = true;
        break;

      case undefined:
      case '':
        var host = "localhost";
        break;

      default:
        throw "Protocol not supported.";
    }

    // Load files off the local filesystem (file://)
    if (local) {
      if (settings.method !== "GET") {
        throw "XMLHttpRequest: Only GET method is supported";
      }

      if (settings.async) {
        fs.readFile(url.pathname, 'utf8', function(error, data) {
          if (error) {
            self.handleError(error);
          } else {
            self.status = 200;
            self.responseText = data;
            setState(self.DONE);
          }
        });
      } else {
        try {
          this.responseText = fs.readFileSync(url.pathname, 'utf8');
          this.status = 200;
          setState(self.DONE);
        } catch(e) {
          this.handleError(e);
        }
      }

      return;
    }

    // Default to port 80. If accessing localhost on another port be sure
    // to use http://localhost:port/path
    var port = url.port || (ssl ? 443 : 80);
    // Add query string if one is used
    var uri = url.pathname + (url.search ? url.search : '');

    // Set the Host header or the server may reject the request
    headers["Host"] = host;
    if (!((ssl && port === 443) || port === 80)) {
      headers["Host"] += ':' + url.port;
    }

    // Set Basic Auth if necessary
    if (settings.user) {
      if (typeof settings.password == "undefined") {
        settings.password = "";
      }
      var authBuf = new Buffer(settings.user + ":" + settings.password);
      headers["Authorization"] = "Basic " + authBuf.toString("base64");
    }

    // Set content length header
    if (settings.method === "GET" || settings.method === "HEAD") {
      data = null;
    } else if (data) {
      headers["Content-Length"] = Buffer.byteLength(data);

      if (!headers["Content-Type"]) {
        headers["Content-Type"] = "text/plain;charset=UTF-8";
      }
    } else if (settings.method === "POST") {
      // For a post with no data set Content-Length: 0.
      // This is required by buggy servers that don't meet the specs.
      headers["Content-Length"] = 0;
    }

    var options = {
      host: host,
      port: port,
      path: uri,
      method: settings.method,
      headers: headers,
      agent: false
    };

    // Reset error flag
    errorFlag = false;

    // Handle async requests
    if (settings.async) {
      // Use the proper protocol
      var doRequest = ssl ? https.request : http.request;

      // Request is being sent, set send flag
      sendFlag = true;

      // As per spec, this is called here for historical reasons.
      self.dispatchEvent("readystatechange");

      // Create the request
      request = doRequest(options, function(resp) {
        response = resp;
        response.setEncoding("utf8");

        setState(self.HEADERS_RECEIVED);
        self.status = response.statusCode;

        response.on('data', function(chunk) {
          // Make sure there's some data
          if (chunk) {
            self.responseText += chunk;
          }
          // Don't emit state changes if the connection has been aborted.
          if (sendFlag) {
            setState(self.LOADING);
          }
        });

        response.on('end', function() {
          if (sendFlag) {
            // Discard the 'end' event if the connection has been aborted
            setState(self.DONE);
            sendFlag = false;
          }
        });

        response.on('error', function(error) {
          self.handleError(error);
        });
      }).on('error', function(error) {
        self.handleError(error);
      });

      // Node 0.4 and later won't accept empty data. Make sure it's needed.
      if (data) {
        request.write(data);
      }

      request.end();

      self.dispatchEvent("loadstart");
    } else { // Synchronous
      // Create a temporary file for communication with the other Node process
      var syncFile = ".node-xmlhttprequest-sync-" + process.pid;
      fs.writeFileSync(syncFile, "", "utf8");
      // The async request the other Node process executes
      var execString = "var http = require('http'), https = require('https'), fs = require('fs');"
        + "var doRequest = http" + (ssl ? "s" : "") + ".request;"
        + "var options = " + JSON.stringify(options) + ";"
        + "var responseText = '';"
        + "var req = doRequest(options, function(response) {"
        + "response.setEncoding('utf8');"
        + "response.on('data', function(chunk) {"
        + "responseText += chunk;"
        + "});"
        + "response.on('end', function() {"
        + "fs.writeFileSync('" + syncFile + "', 'NODE-XMLHTTPREQUEST-STATUS:' + response.statusCode + ',' + responseText, 'utf8');"
        + "});"
        + "response.on('error', function(error) {"
        + "fs.writeFileSync('" + syncFile + "', 'NODE-XMLHTTPREQUEST-ERROR:' + JSON.stringify(error), 'utf8');"
        + "});"
        + "}).on('error', function(error) {"
        + "fs.writeFileSync('" + syncFile + "', 'NODE-XMLHTTPREQUEST-ERROR:' + JSON.stringify(error), 'utf8');"
        + "});"
        + (data ? "req.write('" + data.replace(/'/g, "\\'") + "');":"")
        + "req.end();";
      // Start the other Node Process, executing this string
      syncProc = spawn(process.argv[0], ["-e", execString]);
      while((self.responseText = fs.readFileSync(syncFile, 'utf8')) == "") {
        // Wait while the file is empty
      }
      // Kill the child process once the file has data
      syncProc.stdin.end();
      // Remove the temporary file
      fs.unlinkSync(syncFile);
      if (self.responseText.match(/^NODE-XMLHTTPREQUEST-ERROR:/)) {
        // If the file returned an error, handle it
        var errorObj = self.responseText.replace(/^NODE-XMLHTTPREQUEST-ERROR:/, "");
        self.handleError(errorObj);
      } else {
        // If the file returned okay, parse its data and move to the DONE state
        self.status = self.responseText.replace(/^NODE-XMLHTTPREQUEST-STATUS:([0-9]*),.*/, "$1");
        self.responseText = self.responseText.replace(/^NODE-XMLHTTPREQUEST-STATUS:[0-9]*,(.*)/, "$1");
        setState(self.DONE);
      }
    }
  };

  /**
   * Called when an error is encountered to deal with it.
   */
  this.handleError = function(error) {
    this.status = 503;
    this.statusText = error;
    this.responseText = error.stack;
    errorFlag = true;
    setState(this.DONE);
  };

  /**
   * Aborts a request.
   */
  this.abort = function() {
    if (request) {
      request.abort();
      request = null;
    }

    headers = defaultHeaders;
    this.responseText = "";
    this.responseXML = "";

    errorFlag = true;

    if (this.readyState !== this.UNSENT
        && (this.readyState !== this.OPENED || sendFlag)
        && this.readyState !== this.DONE) {
      sendFlag = false;
      setState(this.DONE);
    }
    this.readyState = this.UNSENT;
  };

  /**
   * Adds an event listener. Preferred method of binding to events.
   */
  this.addEventListener = function(event, callback) {
    if (!(event in listeners)) {
      listeners[event] = [];
    }
    // Currently allows duplicate callbacks. Should it?
    listeners[event].push(callback);
  };

  /**
   * Remove an event callback that has already been bound.
   * Only works on the matching funciton, cannot be a copy.
   */
  this.removeEventListener = function(event, callback) {
    if (event in listeners) {
      // Filter will return a new array with the callback removed
      listeners[event] = listeners[event].filter(function(ev) {
        return ev !== callback;
      });
    }
  };

  /**
   * Dispatch any events, including both "on" methods and events attached using addEventListener.
   */
  this.dispatchEvent = function(event) {
    if (typeof self["on" + event] === "function") {
      self["on" + event]();
    }
    if (event in listeners) {
      for (var i = 0, len = listeners[event].length; i < len; i++) {
        listeners[event][i].call(self);
      }
    }
  };

  /**
   * Changes readyState and calls onreadystatechange.
   *
   * @param int state New state
   */
  var setState = function(state) {
    if (self.readyState !== state) {
      self.readyState = state;

      if (settings.async || self.readyState < self.OPENED || self.readyState === self.DONE) {
        self.dispatchEvent("readystatechange");
      }

      if (self.readyState === self.DONE && !errorFlag) {
        self.dispatchEvent("load");
        // @TODO figure out InspectorInstrumentation::didLoadXHR(cookie)
        self.dispatchEvent("loadend");
      }
    }
  };
};

})(require("__browserify_process"),require("__browserify_buffer").Buffer)
},{"__browserify_buffer":14,"__browserify_process":5,"child_process":32,"fs":9,"http":33,"https":34,"url":7}],30:[function(require,module,exports){
(function(global){/*global unescape, module, define, window, global*/

/*
 UriTemplate Copyright (c) 2012-2013 Franz Antesberger. All Rights Reserved.
 Available via the MIT license.
*/

(function (exportCallback) {
    "use strict";

var UriTemplateError = (function () {

    function UriTemplateError (options) {
        this.options = options;
    }

    UriTemplateError.prototype.toString = function () {
        if (JSON && JSON.stringify) {
            return JSON.stringify(this.options);
        }
        else {
            return this.options;
        }
    };

    return UriTemplateError;
}());

var objectHelper = (function () {
    function isArray (value) {
        return Object.prototype.toString.apply(value) === '[object Array]';
    }

    function isString (value) {
        return Object.prototype.toString.apply(value) === '[object String]';
    }
    
    function isNumber (value) {
        return Object.prototype.toString.apply(value) === '[object Number]';
    }
    
    function isBoolean (value) {
        return Object.prototype.toString.apply(value) === '[object Boolean]';
    }
    
    function join (arr, separator) {
        var
            result = '',
            first = true,
            index;
        for (index = 0; index < arr.length; index += 1) {
            if (first) {
                first = false;
            }
            else {
                result += separator;
            }
            result += arr[index];
        }
        return result;
    }

    function map (arr, mapper) {
        var
            result = [],
            index = 0;
        for (; index < arr.length; index += 1) {
            result.push(mapper(arr[index]));
        }
        return result;
    }

    function filter (arr, predicate) {
        var
            result = [],
            index = 0;
        for (; index < arr.length; index += 1) {
            if (predicate(arr[index])) {
                result.push(arr[index]);
            }
        }
        return result;
    }

    function deepFreezeUsingObjectFreeze (object) {
        if (typeof object !== "object" || object === null) {
            return object;
        }
        Object.freeze(object);
        var property, propertyName;
        for (propertyName in object) {
            if (object.hasOwnProperty(propertyName)) {
                property = object[propertyName];
                // be aware, arrays are 'object', too
                if (typeof property === "object") {
                    deepFreeze(property);
                }
            }
        }
        return object;
    }

    function deepFreeze (object) {
        if (typeof Object.freeze === 'function') {
            return deepFreezeUsingObjectFreeze(object);
        }
        return object;
    }


    return {
        isArray: isArray,
        isString: isString,
        isNumber: isNumber,
        isBoolean: isBoolean,
        join: join,
        map: map,
        filter: filter,
        deepFreeze: deepFreeze
    };
}());

var charHelper = (function () {

    function isAlpha (chr) {
        return (chr >= 'a' && chr <= 'z') || ((chr >= 'A' && chr <= 'Z'));
    }

    function isDigit (chr) {
        return chr >= '0' && chr <= '9';
    }

    function isHexDigit (chr) {
        return isDigit(chr) || (chr >= 'a' && chr <= 'f') || (chr >= 'A' && chr <= 'F');
    }

    return {
        isAlpha: isAlpha,
        isDigit: isDigit,
        isHexDigit: isHexDigit
    };
}());

var pctEncoder = (function () {
    var utf8 = {
        encode: function (chr) {
            // see http://ecmanaut.blogspot.de/2006/07/encoding-decoding-utf8-in-javascript.html
            return unescape(encodeURIComponent(chr));
        },
        numBytes: function (firstCharCode) {
            if (firstCharCode <= 0x7F) {
                return 1;
            }
            else if (0xC2 <= firstCharCode && firstCharCode <= 0xDF) {
                return 2;
            }
            else if (0xE0 <= firstCharCode && firstCharCode <= 0xEF) {
                return 3;
            }
            else if (0xF0 <= firstCharCode && firstCharCode <= 0xF4) {
                return 4;
            }
            // no valid first octet
            return 0;
        },
        isValidFollowingCharCode: function (charCode) {
            return 0x80 <= charCode && charCode <= 0xBF;
        }
    };

    /**
     * encodes a character, if needed or not.
     * @param chr
     * @return pct-encoded character
     */
    function encodeCharacter (chr) {
        var
            result = '',
            octets = utf8.encode(chr),
            octet,
            index;
        for (index = 0; index < octets.length; index += 1) {
            octet = octets.charCodeAt(index);
            result += '%' + (octet < 0x10 ? '0' : '') + octet.toString(16).toUpperCase();
        }
        return result;
    }

    /**
     * Returns, whether the given text at start is in the form 'percent hex-digit hex-digit', like '%3F'
     * @param text
     * @param start
     * @return {boolean|*|*}
     */
    function isPercentDigitDigit (text, start) {
        return text.charAt(start) === '%' && charHelper.isHexDigit(text.charAt(start + 1)) && charHelper.isHexDigit(text.charAt(start + 2));
    }

    /**
     * Parses a hex number from start with length 2.
     * @param text a string
     * @param start the start index of the 2-digit hex number
     * @return {Number}
     */
    function parseHex2 (text, start) {
        return parseInt(text.substr(start, 2), 16);
    }

    /**
     * Returns whether or not the given char sequence is a correctly pct-encoded sequence.
     * @param chr
     * @return {boolean}
     */
    function isPctEncoded (chr) {
        if (!isPercentDigitDigit(chr, 0)) {
            return false;
        }
        var firstCharCode = parseHex2(chr, 1);
        var numBytes = utf8.numBytes(firstCharCode);
        if (numBytes === 0) {
            return false;
        }
        for (var byteNumber = 1; byteNumber < numBytes; byteNumber += 1) {
            if (!isPercentDigitDigit(chr, 3*byteNumber) || !utf8.isValidFollowingCharCode(parseHex2(chr, 3*byteNumber + 1))) {
                return false;
            }
        }
        return true;
    }

    /**
     * Reads as much as needed from the text, e.g. '%20' or '%C3%B6'. It does not decode!
     * @param text
     * @param startIndex
     * @return the character or pct-string of the text at startIndex
     */
    function pctCharAt(text, startIndex) {
        var chr = text.charAt(startIndex);
        if (!isPercentDigitDigit(text, startIndex)) {
            return chr;
        }
        var utf8CharCode = parseHex2(text, startIndex + 1);
        var numBytes = utf8.numBytes(utf8CharCode);
        if (numBytes === 0) {
            return chr;
        }
        for (var byteNumber = 1; byteNumber < numBytes; byteNumber += 1) {
            if (!isPercentDigitDigit(text, startIndex + 3 * byteNumber) || !utf8.isValidFollowingCharCode(parseHex2(text, startIndex + 3 * byteNumber + 1))) {
                return chr;
            }
        }
        return text.substr(startIndex, 3 * numBytes);
    }

    return {
        encodeCharacter: encodeCharacter,
        isPctEncoded: isPctEncoded,
        pctCharAt: pctCharAt
    };
}());

var rfcCharHelper = (function () {

    /**
     * Returns if an character is an varchar character according 2.3 of rfc 6570
     * @param chr
     * @return (Boolean)
     */
    function isVarchar (chr) {
        return charHelper.isAlpha(chr) || charHelper.isDigit(chr) || chr === '_' || pctEncoder.isPctEncoded(chr);
    }

    /**
     * Returns if chr is an unreserved character according 1.5 of rfc 6570
     * @param chr
     * @return {Boolean}
     */
    function isUnreserved (chr) {
        return charHelper.isAlpha(chr) || charHelper.isDigit(chr) || chr === '-' || chr === '.' || chr === '_' || chr === '~';
    }

    /**
     * Returns if chr is an reserved character according 1.5 of rfc 6570
     * or the percent character mentioned in 3.2.1.
     * @param chr
     * @return {Boolean}
     */
    function isReserved (chr) {
        return chr === ':' || chr === '/' || chr === '?' || chr === '#' || chr === '[' || chr === ']' || chr === '@' || chr === '!' || chr === '$' || chr === '&' || chr === '(' ||
            chr === ')' || chr === '*' || chr === '+' || chr === ',' || chr === ';' || chr === '=' || chr === "'";
    }

    return {
        isVarchar: isVarchar,
        isUnreserved: isUnreserved,
        isReserved: isReserved
    };

}());

/**
 * encoding of rfc 6570
 */
var encodingHelper = (function () {

    function encode (text, passReserved) {
        var
            result = '',
            index,
            chr = '';
        if (typeof text === "number" || typeof text === "boolean") {
            text = text.toString();
        }
        for (index = 0; index < text.length; index += chr.length) {
            chr = text.charAt(index);
            result += rfcCharHelper.isUnreserved(chr) || (passReserved && rfcCharHelper.isReserved(chr)) ? chr : pctEncoder.encodeCharacter(chr);
        }
        return result;
    }

    function encodePassReserved (text) {
        return encode(text, true);
    }

    function encodeLiteralCharacter (literal, index) {
        var chr = pctEncoder.pctCharAt(literal, index);
        if (chr.length > 1) {
            return chr;
        }
        else {
            return rfcCharHelper.isReserved(chr) || rfcCharHelper.isUnreserved(chr) ? chr : pctEncoder.encodeCharacter(chr);
        }
    }

    function encodeLiteral (literal) {
        var
            result = '',
            index,
            chr = '';
        for (index = 0; index < literal.length; index += chr.length) {
            chr = pctEncoder.pctCharAt(literal, index);
            if (chr.length > 1) {
                result += chr;
            }
            else {
                result += rfcCharHelper.isReserved(chr) || rfcCharHelper.isUnreserved(chr) ? chr : pctEncoder.encodeCharacter(chr);
            }
        }
        return result;
    }

    return {
        encode: encode,
        encodePassReserved: encodePassReserved,
        encodeLiteral: encodeLiteral,
        encodeLiteralCharacter: encodeLiteralCharacter
    };

}());


// the operators defined by rfc 6570
var operators = (function () {

    var
        bySymbol = {};

    function create (symbol) {
        bySymbol[symbol] = {
            symbol: symbol,
            separator: (symbol === '?') ? '&' : (symbol === '' || symbol === '+' || symbol === '#') ? ',' : symbol,
            named: symbol === ';' || symbol === '&' || symbol === '?',
            ifEmpty: (symbol === '&' || symbol === '?') ? '=' : '',
            first: (symbol === '+' ) ? '' : symbol,
            encode: (symbol === '+' || symbol === '#') ? encodingHelper.encodePassReserved : encodingHelper.encode,
            toString: function () {
                return this.symbol;
            }
        };
    }

    create('');
    create('+');
    create('#');
    create('.');
    create('/');
    create(';');
    create('?');
    create('&');
    return {
        valueOf: function (chr) {
            if (bySymbol[chr]) {
                return bySymbol[chr];
            }
            if ("=,!@|".indexOf(chr) >= 0) {
                return null;
            }
            return bySymbol[''];
        }
    };
}());


/**
 * Detects, whether a given element is defined in the sense of rfc 6570
 * Section 2.3 of the RFC makes clear defintions:
 * * undefined and null are not defined.
 * * the empty string is defined
 * * an array ("list") is defined, if it is not empty (even if all elements are not defined)
 * * an object ("map") is defined, if it contains at least one property with defined value
 * @param object
 * @return {Boolean}
 */
function isDefined (object) {
    var
        propertyName;
    if (object === null || object === undefined) {
        return false;
    }
    if (objectHelper.isArray(object)) {
        // Section 2.3: A variable defined as a list value is considered undefined if the list contains zero members
        return object.length > 0;
    }
    if (typeof object === "string" || typeof object === "number" || typeof object === "boolean") {
        // falsy values like empty strings, false or 0 are "defined"
        return true;
    }
    // else Object
    for (propertyName in object) {
        if (object.hasOwnProperty(propertyName) && isDefined(object[propertyName])) {
            return true;
        }
    }
    return false;
}

var LiteralExpression = (function () {
    function LiteralExpression (literal) {
        this.literal = encodingHelper.encodeLiteral(literal);
    }

    LiteralExpression.prototype.expand = function () {
        return this.literal;
    };

    LiteralExpression.prototype.toString = LiteralExpression.prototype.expand;

    return LiteralExpression;
}());

var parse = (function () {

    function parseExpression (expressionText) {
        var
            operator,
            varspecs = [],
            varspec = null,
            varnameStart = null,
            maxLengthStart = null,
            index,
            chr = '';

        function closeVarname () {
            var varname = expressionText.substring(varnameStart, index);
            if (varname.length === 0) {
                throw new UriTemplateError({expressionText: expressionText, message: "a varname must be specified", position: index});
            }
            varspec = {varname: varname, exploded: false, maxLength: null};
            varnameStart = null;
        }

        function closeMaxLength () {
            if (maxLengthStart === index) {
                throw new UriTemplateError({expressionText: expressionText, message: "after a ':' you have to specify the length", position: index});
            }
            varspec.maxLength = parseInt(expressionText.substring(maxLengthStart, index), 10);
            maxLengthStart = null;
        }

        operator = (function (operatorText) {
            var op = operators.valueOf(operatorText);
            if (op === null) {
                throw new UriTemplateError({expressionText: expressionText, message: "illegal use of reserved operator", position: index, operator: operatorText});
            }
            return op;
        }(expressionText.charAt(0)));
        index = operator.symbol.length;

        varnameStart = index;

        for (; index < expressionText.length; index += chr.length) {
            chr = pctEncoder.pctCharAt(expressionText, index);

            if (varnameStart !== null) {
                // the spec says: varname =  varchar *( ["."] varchar )
                // so a dot is allowed except for the first char
                if (chr === '.') {
                    if (varnameStart === index) {
                        throw new UriTemplateError({expressionText: expressionText, message: "a varname MUST NOT start with a dot", position: index});
                    }
                    continue;
                }
                if (rfcCharHelper.isVarchar(chr)) {
                    continue;
                }
                closeVarname();
            }
            if (maxLengthStart !== null) {
                if (index === maxLengthStart && chr === '0') {
                    throw new UriTemplateError({expressionText: expressionText, message: "A :prefix must not start with digit 0", position: index});
                }
                if (charHelper.isDigit(chr)) {
                    if (index - maxLengthStart >= 4) {
                        throw new UriTemplateError({expressionText: expressionText, message: "A :prefix must have max 4 digits", position: index});
                    }
                    continue;
                }
                closeMaxLength();
            }
            if (chr === ':') {
                if (varspec.maxLength !== null) {
                    throw new UriTemplateError({expressionText: expressionText, message: "only one :maxLength is allowed per varspec", position: index});
                }
                if (varspec.exploded) {
                    throw new UriTemplateError({expressionText: expressionText, message: "an exploeded varspec MUST NOT be varspeced", position: index});
                }
                maxLengthStart = index + 1;
                continue;
            }
            if (chr === '*') {
                if (varspec === null) {
                    throw new UriTemplateError({expressionText: expressionText, message: "exploded without varspec", position: index});
                }
                if (varspec.exploded) {
                    throw new UriTemplateError({expressionText: expressionText, message: "exploded twice", position: index});
                }
                if (varspec.maxLength) {
                    throw new UriTemplateError({expressionText: expressionText, message: "an explode (*) MUST NOT follow to a prefix", position: index});
                }
                varspec.exploded = true;
                continue;
            }
            // the only legal character now is the comma
            if (chr === ',') {
                varspecs.push(varspec);
                varspec = null;
                varnameStart = index + 1;
                continue;
            }
            throw new UriTemplateError({expressionText: expressionText, message: "illegal character", character: chr, position: index});
        } // for chr
        if (varnameStart !== null) {
            closeVarname();
        }
        if (maxLengthStart !== null) {
            closeMaxLength();
        }
        varspecs.push(varspec);
        return new VariableExpression(expressionText, operator, varspecs);
    }

    function parse (uriTemplateText) {
        // assert filled string
        var
            index,
            chr,
            expressions = [],
            braceOpenIndex = null,
            literalStart = 0;
        for (index = 0; index < uriTemplateText.length; index += 1) {
            chr = uriTemplateText.charAt(index);
            if (literalStart !== null) {
                if (chr === '}') {
                    throw new UriTemplateError({templateText: uriTemplateText, message: "unopened brace closed", position: index});
                }
                if (chr === '{') {
                    if (literalStart < index) {
                        expressions.push(new LiteralExpression(uriTemplateText.substring(literalStart, index)));
                    }
                    literalStart = null;
                    braceOpenIndex = index;
                }
                continue;
            }

            if (braceOpenIndex !== null) {
                // here just { is forbidden
                if (chr === '{') {
                    throw new UriTemplateError({templateText: uriTemplateText, message: "brace already opened", position: index});
                }
                if (chr === '}') {
                    if (braceOpenIndex + 1 === index) {
                        throw new UriTemplateError({templateText: uriTemplateText, message: "empty braces", position: braceOpenIndex});
                    }
                    try {
                        expressions.push(parseExpression(uriTemplateText.substring(braceOpenIndex + 1, index)));
                    }
                    catch (error) {
                        if (error.prototype === UriTemplateError.prototype) {
                            throw new UriTemplateError({templateText: uriTemplateText, message: error.options.message, position: braceOpenIndex + error.options.position, details: error.options});
                        }
                        throw error;
                    }
                    braceOpenIndex = null;
                    literalStart = index + 1;
                }
                continue;
            }
            throw new Error('reached unreachable code');
        }
        if (braceOpenIndex !== null) {
            throw new UriTemplateError({templateText: uriTemplateText, message: "unclosed brace", position: braceOpenIndex});
        }
        if (literalStart < uriTemplateText.length) {
            expressions.push(new LiteralExpression(uriTemplateText.substr(literalStart)));
        }
        return new UriTemplate(uriTemplateText, expressions);
    }

    return parse;
}());

var VariableExpression = (function () {
    // helper function if JSON is not available
    function prettyPrint (value) {
        return (JSON && JSON.stringify) ? JSON.stringify(value) : value;
    }

    function isEmpty (value) {
        if (!isDefined(value)) {
            return true;
        }
        if (objectHelper.isString(value)) {
            return value === '';
        }
        if (objectHelper.isNumber(value) || objectHelper.isBoolean(value)) {
            return false;
        }
        if (objectHelper.isArray(value)) {
            return value.length === 0;
        }
        for (var propertyName in value) {
            if (value.hasOwnProperty(propertyName)) {
                return false;
            }
        }
        return true;
    }

    function propertyArray (object) {
        var
            result = [],
            propertyName;
        for (propertyName in object) {
            if (object.hasOwnProperty(propertyName)) {
                result.push({name: propertyName, value: object[propertyName]});
            }
        }
        return result;
    }

    function VariableExpression (templateText, operator, varspecs) {
        this.templateText = templateText;
        this.operator = operator;
        this.varspecs = varspecs;
    }

    VariableExpression.prototype.toString = function () {
        return this.templateText;
    };

    function expandSimpleValue(varspec, operator, value) {
        var result = '';
        value = value.toString();
        if (operator.named) {
            result += encodingHelper.encodeLiteral(varspec.varname);
            if (value === '') {
                result += operator.ifEmpty;
                return result;
            }
            result += '=';
        }
        if (varspec.maxLength !== null) {
            value = value.substr(0, varspec.maxLength);
        }
        result += operator.encode(value);
        return result;
    }

    function valueDefined (nameValue) {
        return isDefined(nameValue.value);
    }

    function expandNotExploded(varspec, operator, value) {
        var
            arr = [],
            result = '';
        if (operator.named) {
            result += encodingHelper.encodeLiteral(varspec.varname);
            if (isEmpty(value)) {
                result += operator.ifEmpty;
                return result;
            }
            result += '=';
        }
        if (objectHelper.isArray(value)) {
            arr = value;
            arr = objectHelper.filter(arr, isDefined);
            arr = objectHelper.map(arr, operator.encode);
            result += objectHelper.join(arr, ',');
        }
        else {
            arr = propertyArray(value);
            arr = objectHelper.filter(arr, valueDefined);
            arr = objectHelper.map(arr, function (nameValue) {
                return operator.encode(nameValue.name) + ',' + operator.encode(nameValue.value);
            });
            result += objectHelper.join(arr, ',');
        }
        return result;
    }

    function expandExplodedNamed (varspec, operator, value) {
        var
            isArray = objectHelper.isArray(value),
            arr = [];
        if (isArray) {
            arr = value;
            arr = objectHelper.filter(arr, isDefined);
            arr = objectHelper.map(arr, function (listElement) {
                var tmp = encodingHelper.encodeLiteral(varspec.varname);
                if (isEmpty(listElement)) {
                    tmp += operator.ifEmpty;
                }
                else {
                    tmp += '=' + operator.encode(listElement);
                }
                return tmp;
            });
        }
        else {
            arr = propertyArray(value);
            arr = objectHelper.filter(arr, valueDefined);
            arr = objectHelper.map(arr, function (nameValue) {
                var tmp = encodingHelper.encodeLiteral(nameValue.name);
                if (isEmpty(nameValue.value)) {
                    tmp += operator.ifEmpty;
                }
                else {
                    tmp += '=' + operator.encode(nameValue.value);
                }
                return tmp;
            });
        }
        return objectHelper.join(arr, operator.separator);
    }

    function expandExplodedUnnamed (operator, value) {
        var
            arr = [],
            result = '';
        if (objectHelper.isArray(value)) {
            arr = value;
            arr = objectHelper.filter(arr, isDefined);
            arr = objectHelper.map(arr, operator.encode);
            result += objectHelper.join(arr, operator.separator);
        }
        else {
            arr = propertyArray(value);
            arr = objectHelper.filter(arr, function (nameValue) {
                return isDefined(nameValue.value);
            });
            arr = objectHelper.map(arr, function (nameValue) {
                return operator.encode(nameValue.name) + '=' + operator.encode(nameValue.value);
            });
            result += objectHelper.join(arr, operator.separator);
        }
        return result;
    }


    VariableExpression.prototype.expand = function (variables) {
        var
            expanded = [],
            index,
            varspec,
            value,
            valueIsArr,
            oneExploded = false,
            operator = this.operator;

        // expand each varspec and join with operator's separator
        for (index = 0; index < this.varspecs.length; index += 1) {
            varspec = this.varspecs[index];
            value = variables[varspec.varname];
            // if (!isDefined(value)) {
            // if (variables.hasOwnProperty(varspec.name)) {
            if (value === null || value === undefined) {
                continue;
            }
            if (varspec.exploded) {
                oneExploded = true;
            }
            valueIsArr = objectHelper.isArray(value);
            if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
                expanded.push(expandSimpleValue(varspec, operator, value));
            }
            else if (varspec.maxLength && isDefined(value)) {
                // 2.4.1 of the spec says: "Prefix modifiers are not applicable to variables that have composite values."
                throw new Error('Prefix modifiers are not applicable to variables that have composite values. You tried to expand ' + this + " with " + prettyPrint(value));
            }
            else if (!varspec.exploded) {
                if (operator.named || !isEmpty(value)) {
                    expanded.push(expandNotExploded(varspec, operator, value));
                }
            }
            else if (isDefined(value)) {
                if (operator.named) {
                    expanded.push(expandExplodedNamed(varspec, operator, value));
                }
                else {
                    expanded.push(expandExplodedUnnamed(operator, value));
                }
            }
        }

        if (expanded.length === 0) {
            return "";
        }
        else {
            return operator.first + objectHelper.join(expanded, operator.separator);
        }
    };

    return VariableExpression;
}());

var UriTemplate = (function () {
    function UriTemplate (templateText, expressions) {
        this.templateText = templateText;
        this.expressions = expressions;
        objectHelper.deepFreeze(this);
    }

    UriTemplate.prototype.toString = function () {
        return this.templateText;
    };

    UriTemplate.prototype.expand = function (variables) {
        // this.expressions.map(function (expression) {return expression.expand(variables);}).join('');
        var
            index,
            result = '';
        for (index = 0; index < this.expressions.length; index += 1) {
            result += this.expressions[index].expand(variables);
        }
        return result;
    };

    UriTemplate.parse = parse;
    UriTemplate.UriTemplateError = UriTemplateError;
    return UriTemplate;
}());

    exportCallback(UriTemplate);

}(function (UriTemplate) {
        "use strict";
        // export UriTemplate, when module is present, or pass it to window or global
        if (typeof module !== "undefined") {
            module.exports = UriTemplate;
        }
        else if (typeof define === "function") {
            define([],function() {
                return UriTemplate;
            });
        }
        else if (typeof window !== "undefined") {
            window.UriTemplate = UriTemplate;
        }
        else {
            global.UriTemplate = UriTemplate;
        }
    }
));

})(window)
},{}],32:[function(require,module,exports){
exports.spawn = function () {};
exports.exec = function () {};

},{}],34:[function(require,module,exports){
var http = require('http');

var https = module.exports;

for (var key in http) {
    if (http.hasOwnProperty(key)) https[key] = http[key];
};

https.request = function (params, cb) {
    if (!params) params = {};
    params.scheme = 'https';
    return http.request.call(this, params, cb);
}
},{"http":33}],31:[function(require,module,exports){
module.exports = require( './lib/inflection' );
},{"./lib/inflection":35}],36:[function(require,module,exports){
(function(process){if (!process.EventEmitter) process.EventEmitter = function () {};

var EventEmitter = exports.EventEmitter = process.EventEmitter;
var isArray = typeof Array.isArray === 'function'
    ? Array.isArray
    : function (xs) {
        return Object.prototype.toString.call(xs) === '[object Array]'
    }
;
function indexOf (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0; i < xs.length; i++) {
        if (x === xs[i]) return i;
    }
    return -1;
}

// By default EventEmitters will print a warning if more than
// 10 listeners are added to it. This is a useful default which
// helps finding memory leaks.
//
// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
var defaultMaxListeners = 10;
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!this._events) this._events = {};
  this._events.maxListeners = n;
};


EventEmitter.prototype.emit = function(type) {
  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events || !this._events.error ||
        (isArray(this._events.error) && !this._events.error.length))
    {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }
  }

  if (!this._events) return false;
  var handler = this._events[type];
  if (!handler) return false;

  if (typeof handler == 'function') {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        var args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
    return true;

  } else if (isArray(handler)) {
    var args = Array.prototype.slice.call(arguments, 1);

    var listeners = handler.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;

  } else {
    return false;
  }
};

// EventEmitter is defined in src/node_events.cc
// EventEmitter.prototype.emit() is also defined there.
EventEmitter.prototype.addListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('addListener only takes instances of Function');
  }

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type == "newListeners"! Before
  // adding it to the listeners, first emit "newListeners".
  this.emit('newListener', type, listener);

  if (!this._events[type]) {
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  } else if (isArray(this._events[type])) {

    // Check for listener leak
    if (!this._events[type].warned) {
      var m;
      if (this._events.maxListeners !== undefined) {
        m = this._events.maxListeners;
      } else {
        m = defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;
        console.error('(node) warning: possible EventEmitter memory ' +
                      'leak detected. %d listeners added. ' +
                      'Use emitter.setMaxListeners() to increase limit.',
                      this._events[type].length);
        console.trace();
      }
    }

    // If we've already got an array, just append.
    this._events[type].push(listener);
  } else {
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  var self = this;
  self.on(type, function g() {
    self.removeListener(type, g);
    listener.apply(this, arguments);
  });

  return this;
};

EventEmitter.prototype.removeListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('removeListener only takes instances of Function');
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (!this._events || !this._events[type]) return this;

  var list = this._events[type];

  if (isArray(list)) {
    var i = indexOf(list, listener);
    if (i < 0) return this;
    list.splice(i, 1);
    if (list.length == 0)
      delete this._events[type];
  } else if (this._events[type] === listener) {
    delete this._events[type];
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  if (arguments.length === 0) {
    this._events = {};
    return this;
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (type && this._events && this._events[type]) this._events[type] = null;
  return this;
};

EventEmitter.prototype.listeners = function(type) {
  if (!this._events) this._events = {};
  if (!this._events[type]) this._events[type] = [];
  if (!isArray(this._events[type])) {
    this._events[type] = [this._events[type]];
  }
  return this._events[type];
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (typeof emitter._events[type] === 'function')
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

})(require("__browserify_process"))
},{"__browserify_process":5}],33:[function(require,module,exports){
var http = module.exports;
var EventEmitter = require('events').EventEmitter;
var Request = require('./lib/request');

http.request = function (params, cb) {
    if (!params) params = {};
    if (!params.host) params.host = window.location.host.split(':')[0];
    if (!params.port) params.port = window.location.port;
    if (!params.scheme) params.scheme = window.location.protocol.split(':')[0];
    
    var req = new Request(new xhrHttp, params);
    if (cb) req.on('response', cb);
    return req;
};

http.get = function (params, cb) {
    params.method = 'GET';
    var req = http.request(params, cb);
    req.end();
    return req;
};

http.Agent = function () {};
http.Agent.defaultMaxSockets = 4;

var xhrHttp = (function () {
    if (typeof window === 'undefined') {
        throw new Error('no window object present');
    }
    else if (window.XMLHttpRequest) {
        return window.XMLHttpRequest;
    }
    else if (window.ActiveXObject) {
        var axs = [
            'Msxml2.XMLHTTP.6.0',
            'Msxml2.XMLHTTP.3.0',
            'Microsoft.XMLHTTP'
        ];
        for (var i = 0; i < axs.length; i++) {
            try {
                var ax = new(window.ActiveXObject)(axs[i]);
                return function () {
                    if (ax) {
                        var ax_ = ax;
                        ax = null;
                        return ax_;
                    }
                    else {
                        return new(window.ActiveXObject)(axs[i]);
                    }
                };
            }
            catch (e) {}
        }
        throw new Error('ajax not supported in this browser')
    }
    else {
        throw new Error('ajax not supported in this browser');
    }
})();

},{"./lib/request":37,"events":36}],35:[function(require,module,exports){
/*!
 * inflection
 * Copyright(c) 2011 Ben Lin <ben@dreamerslab.com>
 * MIT Licensed
 *
 * @fileoverview
 * A port of inflection-js to node.js module
 */

/**
 * @description This is a list of nouns that use the same form for both singular and plural.
 *              This list should remain entirely in lower case to correctly match Strings.
 * @private
 */
var uncountable_words = [
  'equipment', 'information', 'rice', 'money', 'species',
  'series', 'fish', 'sheep', 'moose', 'deer', 'news'
];

/**
 * @description These rules translate from the singular form of a noun to its plural form.
 * @private
 */
var plural_rules = [
  [ new RegExp( '(m)an$', 'gi' ),                 '$1en' ],
  [ new RegExp( '(pe)rson$', 'gi' ),              '$1ople' ],
  [ new RegExp( '(child)$', 'gi' ),               '$1ren' ],
  [ new RegExp( '^(ox)$', 'gi' ),                 '$1en' ],
  [ new RegExp( '(ax|test)is$', 'gi' ),           '$1es' ],
  [ new RegExp( '(octop|vir)us$', 'gi' ),         '$1i' ],
  [ new RegExp( '(alias|status)$', 'gi' ),        '$1es' ],
  [ new RegExp( '(bu)s$', 'gi' ),                 '$1ses' ],
  [ new RegExp( '(buffal|tomat|potat)o$', 'gi' ), '$1oes' ],
  [ new RegExp( '([ti])um$', 'gi' ),              '$1a' ],
  [ new RegExp( 'sis$', 'gi' ),                   'ses' ],
  [ new RegExp( '(?:([^f])fe|([lr])f)$', 'gi' ),  '$1$2ves' ],
  [ new RegExp( '(hive)$', 'gi' ),                '$1s' ],
  [ new RegExp( '([^aeiouy]|qu)y$', 'gi' ),       '$1ies' ],
  [ new RegExp( '(x|ch|ss|sh)$', 'gi' ),          '$1es' ],
  [ new RegExp( '(matr|vert|ind)ix|ex$', 'gi' ),  '$1ices' ],
  [ new RegExp( '([m|l])ouse$', 'gi' ),           '$1ice' ],
  [ new RegExp( '(quiz)$', 'gi' ),                '$1zes' ],
  [ new RegExp( 's$', 'gi' ),                     's' ],
  [ new RegExp( '$', 'gi' ),                      's' ]
];

/**
 * @description These rules translate from the plural form of a noun to its singular form.
 * @private
 */
var singular_rules = [
  [ new RegExp( '(m)en$', 'gi' ),                                                       '$1an' ],
  [ new RegExp( '(pe)ople$', 'gi' ),                                                    '$1rson' ],
  [ new RegExp( '(child)ren$', 'gi' ),                                                  '$1' ],
  [ new RegExp( '([ti])a$', 'gi' ),                                                     '$1um' ],
  [ new RegExp( '((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$','gi' ), '$1$2sis' ],
  [ new RegExp( '(hive)s$', 'gi' ),                                                     '$1' ],
  [ new RegExp( '(tive)s$', 'gi' ),                                                     '$1' ],
  [ new RegExp( '(curve)s$', 'gi' ),                                                    '$1' ],
  [ new RegExp( '([lr])ves$', 'gi' ),                                                   '$1f' ],
  [ new RegExp( '([^fo])ves$', 'gi' ),                                                  '$1fe' ],
  [ new RegExp( '([^aeiouy]|qu)ies$', 'gi' ),                                           '$1y' ],
  [ new RegExp( '(s)eries$', 'gi' ),                                                    '$1eries' ],
  [ new RegExp( '(m)ovies$', 'gi' ),                                                    '$1ovie' ],
  [ new RegExp( '(x|ch|ss|sh)es$', 'gi' ),                                              '$1' ],
  [ new RegExp( '([m|l])ice$', 'gi' ),                                                  '$1ouse' ],
  [ new RegExp( '(bus)es$', 'gi' ),                                                     '$1' ],
  [ new RegExp( '(o)es$', 'gi' ),                                                       '$1' ],
  [ new RegExp( '(shoe)s$', 'gi' ),                                                     '$1' ],
  [ new RegExp( '(cris|ax|test)es$', 'gi' ),                                            '$1is' ],
  [ new RegExp( '(octop|vir)i$', 'gi' ),                                                '$1us' ],
  [ new RegExp( '(alias|status)es$', 'gi' ),                                            '$1' ],
  [ new RegExp( '^(ox)en', 'gi' ),                                                      '$1' ],
  [ new RegExp( '(vert|ind)ices$', 'gi' ),                                              '$1ex' ],
  [ new RegExp( '(matr)ices$', 'gi' ),                                                  '$1ix' ],
  [ new RegExp( '(quiz)zes$', 'gi' ),                                                   '$1' ],
  [ new RegExp( 's$', 'gi' ),                                                           '' ]
];

/**
 * @description This is a list of words that should not be capitalized for title case.
 * @private
 */
var non_titlecased_words = [
  'and', 'or', 'nor', 'a', 'an', 'the', 'so', 'but', 'to', 'of', 'at','by',
  'from', 'into', 'on', 'onto', 'off', 'out', 'in', 'over', 'with', 'for'
];

/**
 * @description These are regular expressions used for converting between String formats.
 * @private
 */
var id_suffix         = new RegExp( '(_ids|_id)$', 'g' );
var underbar          = new RegExp( '_', 'g' );
var space_or_underbar = new RegExp( '[\ _]', 'g' );
var uppercase         = new RegExp( '([A-Z])', 'g' );
var underbar_prefix   = new RegExp( '^_' );



module.exports = {

/**
 * @public
 * @version 0.0.1
 */
  version : '0.0.1',



/**
 * A helper method that applies rules based replacement to a String.
 * @private
 * @function
 * @param {String} str String to modify and return based on the passed rules.
 * @param {Array: [RegExp, String]} rules Regexp to match paired with String to use for replacement
 * @param {Array: [String]} skip Strings to skip if they match
 * @param {String} override String to return as though this method succeeded (used to conform to APIs)
 * @return {String} Return passed String modified by passed rules.
 * @example
 *
 *     this._apply_rules( 'cows', singular_rules ); // === 'cow'
 */
  _apply_rules : function( str, rules, skip, override ){
      if( override ){
        str = override;
      }else{
        var ignore = ( this.indexOf( skip, str.toLowerCase()) > -1 );

        if( !ignore ){
          var i = 0;
          var j = rules.length;

          for( ; i < j; i++ ){
            if( str.match( rules[ i ][ 0 ])){
              str = str.replace( rules[ i ][ 0 ], rules[ i ][ 1 ]);
              break;
            }
          }
        }
      }

      return str;
  },



/**
 * This lets us detect if an Array contains a given element.
 * @public
 * @function
 * @param {Array} arr The subject array.
 * @param {Object} item Object to locate in the Array.
 * @param {Number} fromIndex Starts checking from this position in the Array.(optional)
 * @param {Function} compareFunc Function used to compare Array item vs passed item.(optional)
 * @return {Number} Return index position in the Array of the passed item.
 * @example
 *
 *     var inflection = require( 'inflection' );
 *
 *     inflection.indexOf([ 'hi','there' ], 'guys' ); // === -1
 *     inflection.indexOf([ 'hi','there' ], 'hi' ); // === 0
 */
  indexOf : function( arr, item, fromIndex, compareFunc ){
    if( !fromIndex ){
      fromIndex = -1;
    }

    var index = -1;
    var i     = fromIndex;
    var j     = arr.length;

    for( ; i < j; i++ ){
      if( arr[ i ]  === item || compareFunc && compareFunc( arr[ i ], item )){
        index = i;
        break;
      }
    }

    return index;
  },



/**
 * This function adds pluralization support to every String object.
 * @public
 * @function
 * @param {String} str The subject string.
 * @param {String} plural Overrides normal output with said String.(optional)
 * @return {String} Singular English language nouns are returned in plural form.
 * @example
 *
 *     var inflection = require( 'inflection' );
 *
 *     inflection.pluralize( 'person' ); // === 'people'
 *     inflection.pluralize( 'octopus' ); // === "octopi"
 *     inflection.pluralize( 'Hat' ); // === 'Hats'
 *     inflection.pluralize( 'person', 'guys' ); // === 'guys'
 */
  pluralize : function ( str, plural ){
    return this._apply_rules( str, plural_rules, uncountable_words, plural );
  },



/**
 * This function adds singularization support to every String object.
 * @public
 * @function
 * @param {String} str The subject string.
 * @param {String} singular Overrides normal output with said String.(optional)
 * @return {String} Plural English language nouns are returned in singular form.
 * @example
 *
 *     var inflection = require( 'inflection' );
 *
 *     inflection.singularize( 'people' ); // === 'person'
 *     inflection.singularize( 'octopi' ); // === "octopus"
 *     inflection.singularize( 'Hats' ); // === 'Hat'
 *     inflection.singularize( 'guys', 'person' ); // === 'person'
 */
  singularize : function ( str, singular ){
    return this._apply_rules( str, singular_rules, uncountable_words, singular );
  },



/**
 * This function adds camelization support to every String object.
 * @public
 * @function
 * @param {String} str The subject string.
 * @param {Boolean} lowFirstLetter Default is to capitalize the first letter of the results.(optional)
 *                                 Passing true will lowercase it.
 * @return {String} Lower case underscored words will be returned in camel case.
 *                  additionally '/' is translated to '::'
 * @example
 *
 *     var inflection = require( 'inflection' );
 *
 *     inflection.camelize( 'message_properties' ); // === 'MessageProperties'
 *     inflection.camelize( 'message_properties', true ); // === 'messageProperties'
 */
  camelize : function ( str, lowFirstLetter ){
    var str_path = str.toLowerCase().split( '/' );
    var i        = 0;
    var j        = str_path.length;

    for( ; i < j; i++ ){
      var str_arr = str_path[ i ].split( '_' );
      var initX   = (( lowFirstLetter && i + 1 === j ) ? ( 1 ) : ( 0 ));
      var k       = initX;
      var l       = str_arr.length;

      for( ; k < l; k++ ){
        str_arr[ k ] = str_arr[ k ].charAt( 0 ).toUpperCase() + str_arr[ k ].substring( 1 );
      }

      str_path[ i ] = str_arr.join( '' );
    }

    return str_path.join( '::' );
  },



/**
 * This function adds underscore support to every String object.
 * @public
 * @function
 * @param {String} str The subject string.
 * @return {String} Camel cased words are returned as lower cased and underscored.
 *                  additionally '::' is translated to '/'.
 * @example
 *
 *     var inflection = require( 'inflection' );
 *
 *     inflection.underscore( 'MessageProperties' ); // === 'message_properties'
 *     inflection.underscore( 'messageProperties' ); // === 'message_properties'
 */
  underscore : function ( str ){
    var str_path = str.split( '::' );
    var i        = 0;
    var j        = str_path.length;

    for( ; i < j; i++ ){
      str_path[ i ] = str_path[ i ].replace( uppercase, '_$1' );
      str_path[ i ] = str_path[ i ].replace( underbar_prefix, '' );
    }

    return str_path.join( '/' ).toLowerCase();
  },



/**
 * This function adds humanize support to every String object.
 * @public
 * @function
 * @param {String} str The subject string.
 * @param {Boolean} lowFirstLetter Default is to capitalize the first letter of the results.(optional)
 *                                 Passing true will lowercase it.
 * @return {String} Lower case underscored words will be returned in humanized form.
 * @example
 *
 *     var inflection = require( 'inflection' );
 *
 *     inflection.humanize( 'message_properties' ); // === 'Message properties'
 *     inflection.humanize( 'message_properties', true ); // === 'message properties'
 */
  humanize : function( str, lowFirstLetter ){
    str = str.toLowerCase();
    str = str.replace( id_suffix, '' );
    str = str.replace( underbar, ' ' );

    if( !lowFirstLetter ){
      str = this.capitalize( str );
    }

    return str;
  },



/**
 * This function adds capitalization support to every String object.
 * @public
 * @function
 * @param {String} str The subject string.
 * @return {String} All characters will be lower case and the first will be upper.
 * @example
 *
 *     var inflection = require( 'inflection' );
 *
 *     inflection.capitalize( 'message_properties' ); // === 'Message_properties'
 *     inflection.capitalize( 'message properties', true ); // === 'Message properties'
 */
  capitalize : function ( str ){
    str = str.toLowerCase();

    return str.substring( 0, 1 ).
                toUpperCase() + str.substring( 1 );
  },



/**
 * This function adds dasherization support to every String object.
 * @public
 * @function
 * @param {String} str The subject string.
 * @return {String} Replaces all spaces or underbars with dashes.
 * @example
 *
 *     var inflection = require( 'inflection' );
 *
 *     inflection.dasherize( 'message_properties' ); // === 'message-properties'
 *     inflection.dasherize( 'Message Properties' ); // === 'Message-Properties'
 */
  dasherize : function ( str ){
    return str.replace( space_or_underbar, '-' );
  },



/**
 * This function adds titleize support to every String object.
 * @public
 * @function
 * @param {String} str The subject string.
 * @return {String} Capitalizes words as you would for a book title.
 * @example
 *
 *     var inflection = require( 'inflection' );
 *
 *     inflection.titleize( 'message_properties' ); // === 'Message Properties'
 *     inflection.titleize( 'message properties to keep' ); // === 'Message Properties to Keep'
 */
  titleize : function ( str ){
    str         = str.toLowerCase().replace( underbar, ' ');
    var str_arr = str.split(' ');
    var i       = 0;
    var j       = str_arr.length;

    for( ; i < j; i++ ){
      var d = str_arr[ i ].split( '-' );
      var k = 0;
      var l = d.length;

      for( ; k < l; k++){
        if( this.indexOf( non_titlecased_words, d[ k ].toLowerCase()) < 0 ){
          d[ k ] = this.capitalize( d[ k ]);
        }
      }

      str_arr[ i ] = d.join( '-' );
    }

    str = str_arr.join( ' ' );
    str = str.substring( 0, 1 ).toUpperCase() + str.substring( 1 );

    return str;
  },



/**
 * This function adds demodulize support to every String object.
 * @public
 * @function
 * @param {String} str The subject string.
 * @return {String} Removes module names leaving only class names.(Ruby style)
 * @example
 *
 *     var inflection = require( 'inflection' );
 *
 *     inflection.demodulize( 'Message::Bus::Properties' ); // === 'Properties'
 */
  demodulize : function ( str ){
    var str_arr = str.split( '::' );

    return str_arr[ str_arr.length - 1 ];
  },



/**
 * This function adds tableize support to every String object.
 * @public
 * @function
 * @param {String} str The subject string.
 * @return {String} Return camel cased words into their underscored plural form.
 * @example
 *
 *     var inflection = require( 'inflection' );
 *
 *     inflection.tableize( 'MessageBusProperty' ); // === 'message_bus_properties'
 */
  tableize : function ( str ){
    str = this.underscore( str );
    str = this.pluralize( str );

    return str;
  },



/**
 * This function adds classification support to every String object.
 * @public
 * @function
 * @param {String} str The subject string.
 * @return {String} Underscored plural nouns become the camel cased singular form.
 * @example
 *
 *     var inflection = require( 'inflection' );
 *
 *     inflection.classify( 'message_bus_properties' ); // === 'MessageBusProperty'
 */
  classify : function ( str ){
    str = this.camelize( str );
    str = this.singularize( str );

    return str;
  },



/**
 * This function adds foreign key support to every String object.
 * @public
 * @function
 * @param {String} str The subject string.
 * @param {Boolean} dropIdUbar Default is to seperate id with an underbar at the end of the class name,
                               you can pass true to skip it.(optional)
 * @return {String} Underscored plural nouns become the camel cased singular form.
 * @example
 *
 *     var inflection = require( 'inflection' );
 *
 *     inflection.foreign_key( 'MessageBusProperty' ); // === 'message_bus_property_id'
 *     inflection.foreign_key( 'MessageBusProperty', true ); // === 'message_bus_propertyid'
 */
  foreign_key : function( str, dropIdUbar ){
    str = this.demodulize( str );
    str = this.underscore( str ) + (( dropIdUbar ) ? ( '' ) : ( '_' )) + 'id';

    return str;
  },



/**
 * This function adds ordinalize support to every String object.
 * @public
 * @function
 * @param {String} str The subject string.
 * @return {String} Return all found numbers their sequence like "22nd".
 * @example
 *
 *     var inflection = require( 'inflection' );
 *
 *     inflection.ordinalize( 'the 1 pitch' ); // === 'the 1st pitch'
 */
  ordinalize : function ( str ){
    var str_arr = str.split(' ');
    var i       = 0;
    var j       = str_arr.length;

    for( ; i < j; i++ ){
      var k = parseInt( str_arr[ i ], 10 );

      if( !isNaN( k )){
        var ltd = str_arr[ i ].substring( str_arr[ i ].length - 2 );
        var ld  = str_arr[ i ].substring( str_arr[ i ].length - 1 );
        var suf = 'th';

        if( ltd != '11' && ltd != '12' && ltd != '13' ){
          if( ld === '1' ){
            suf = 'st';
          }else if( ld === '2' ){
            suf = 'nd';
          }else if( ld === '3' ){
            suf = 'rd';
          }
        }

        str_arr[ i ] += suf;
      }
    }

    return str_arr.join( ' ' );
  }
};

},{}],38:[function(require,module,exports){
var events = require('events');
var util = require('util');

function Stream() {
  events.EventEmitter.call(this);
}
util.inherits(Stream, events.EventEmitter);
module.exports = Stream;
// Backwards-compat with node 0.4.x
Stream.Stream = Stream;

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once, and
  // only when all sources have ended.
  if (!dest._isStdio && (!options || options.end !== false)) {
    dest._pipeCount = dest._pipeCount || 0;
    dest._pipeCount++;

    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest._pipeCount--;

    // remove the listeners
    cleanup();

    if (dest._pipeCount > 0) {
      // waiting for other incoming streams to end.
      return;
    }

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest._pipeCount--;

    // remove the listeners
    cleanup();

    if (dest._pipeCount > 0) {
      // waiting for other incoming streams to end.
      return;
    }

    dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (this.listeners('error').length === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('end', cleanup);
    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('end', cleanup);
  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

},{"events":36,"util":39}],39:[function(require,module,exports){
var events = require('events');

exports.isArray = isArray;
exports.isDate = function(obj){return Object.prototype.toString.call(obj) === '[object Date]'};
exports.isRegExp = function(obj){return Object.prototype.toString.call(obj) === '[object RegExp]'};


exports.print = function () {};
exports.puts = function () {};
exports.debug = function() {};

exports.inspect = function(obj, showHidden, depth, colors) {
  var seen = [];

  var stylize = function(str, styleType) {
    // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
    var styles =
        { 'bold' : [1, 22],
          'italic' : [3, 23],
          'underline' : [4, 24],
          'inverse' : [7, 27],
          'white' : [37, 39],
          'grey' : [90, 39],
          'black' : [30, 39],
          'blue' : [34, 39],
          'cyan' : [36, 39],
          'green' : [32, 39],
          'magenta' : [35, 39],
          'red' : [31, 39],
          'yellow' : [33, 39] };

    var style =
        { 'special': 'cyan',
          'number': 'blue',
          'boolean': 'yellow',
          'undefined': 'grey',
          'null': 'bold',
          'string': 'green',
          'date': 'magenta',
          // "name": intentionally not styling
          'regexp': 'red' }[styleType];

    if (style) {
      return '\u001b[' + styles[style][0] + 'm' + str +
             '\u001b[' + styles[style][1] + 'm';
    } else {
      return str;
    }
  };
  if (! colors) {
    stylize = function(str, styleType) { return str; };
  }

  function format(value, recurseTimes) {
    // Provide a hook for user-specified inspect functions.
    // Check that value is an object with an inspect function on it
    if (value && typeof value.inspect === 'function' &&
        // Filter out the util module, it's inspect function is special
        value !== exports &&
        // Also filter out any prototype objects using the circular check.
        !(value.constructor && value.constructor.prototype === value)) {
      return value.inspect(recurseTimes);
    }

    // Primitive types cannot have properties
    switch (typeof value) {
      case 'undefined':
        return stylize('undefined', 'undefined');

      case 'string':
        var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                                 .replace(/'/g, "\\'")
                                                 .replace(/\\"/g, '"') + '\'';
        return stylize(simple, 'string');

      case 'number':
        return stylize('' + value, 'number');

      case 'boolean':
        return stylize('' + value, 'boolean');
    }
    // For some reason typeof null is "object", so special case here.
    if (value === null) {
      return stylize('null', 'null');
    }

    // Look up the keys of the object.
    var visible_keys = Object_keys(value);
    var keys = showHidden ? Object_getOwnPropertyNames(value) : visible_keys;

    // Functions without properties can be shortcutted.
    if (typeof value === 'function' && keys.length === 0) {
      if (isRegExp(value)) {
        return stylize('' + value, 'regexp');
      } else {
        var name = value.name ? ': ' + value.name : '';
        return stylize('[Function' + name + ']', 'special');
      }
    }

    // Dates without properties can be shortcutted
    if (isDate(value) && keys.length === 0) {
      return stylize(value.toUTCString(), 'date');
    }

    var base, type, braces;
    // Determine the object type
    if (isArray(value)) {
      type = 'Array';
      braces = ['[', ']'];
    } else {
      type = 'Object';
      braces = ['{', '}'];
    }

    // Make functions say that they are functions
    if (typeof value === 'function') {
      var n = value.name ? ': ' + value.name : '';
      base = (isRegExp(value)) ? ' ' + value : ' [Function' + n + ']';
    } else {
      base = '';
    }

    // Make dates with properties first say the date
    if (isDate(value)) {
      base = ' ' + value.toUTCString();
    }

    if (keys.length === 0) {
      return braces[0] + base + braces[1];
    }

    if (recurseTimes < 0) {
      if (isRegExp(value)) {
        return stylize('' + value, 'regexp');
      } else {
        return stylize('[Object]', 'special');
      }
    }

    seen.push(value);

    var output = keys.map(function(key) {
      var name, str;
      if (value.__lookupGetter__) {
        if (value.__lookupGetter__(key)) {
          if (value.__lookupSetter__(key)) {
            str = stylize('[Getter/Setter]', 'special');
          } else {
            str = stylize('[Getter]', 'special');
          }
        } else {
          if (value.__lookupSetter__(key)) {
            str = stylize('[Setter]', 'special');
          }
        }
      }
      if (visible_keys.indexOf(key) < 0) {
        name = '[' + key + ']';
      }
      if (!str) {
        if (seen.indexOf(value[key]) < 0) {
          if (recurseTimes === null) {
            str = format(value[key]);
          } else {
            str = format(value[key], recurseTimes - 1);
          }
          if (str.indexOf('\n') > -1) {
            if (isArray(value)) {
              str = str.split('\n').map(function(line) {
                return '  ' + line;
              }).join('\n').substr(2);
            } else {
              str = '\n' + str.split('\n').map(function(line) {
                return '   ' + line;
              }).join('\n');
            }
          }
        } else {
          str = stylize('[Circular]', 'special');
        }
      }
      if (typeof name === 'undefined') {
        if (type === 'Array' && key.match(/^\d+$/)) {
          return str;
        }
        name = JSON.stringify('' + key);
        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
          name = name.substr(1, name.length - 2);
          name = stylize(name, 'name');
        } else {
          name = name.replace(/'/g, "\\'")
                     .replace(/\\"/g, '"')
                     .replace(/(^"|"$)/g, "'");
          name = stylize(name, 'string');
        }
      }

      return name + ': ' + str;
    });

    seen.pop();

    var numLinesEst = 0;
    var length = output.reduce(function(prev, cur) {
      numLinesEst++;
      if (cur.indexOf('\n') >= 0) numLinesEst++;
      return prev + cur.length + 1;
    }, 0);

    if (length > 50) {
      output = braces[0] +
               (base === '' ? '' : base + '\n ') +
               ' ' +
               output.join(',\n  ') +
               ' ' +
               braces[1];

    } else {
      output = braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
    }

    return output;
  }
  return format(obj, (typeof depth === 'undefined' ? 2 : depth));
};


function isArray(ar) {
  return Array.isArray(ar) ||
         (typeof ar === 'object' && Object.prototype.toString.call(ar) === '[object Array]');
}


function isRegExp(re) {
  typeof re === 'object' && Object.prototype.toString.call(re) === '[object RegExp]';
}


function isDate(d) {
  return typeof d === 'object' && Object.prototype.toString.call(d) === '[object Date]';
}

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}

exports.log = function (msg) {};

exports.pump = null;

var Object_keys = Object.keys || function (obj) {
    var res = [];
    for (var key in obj) res.push(key);
    return res;
};

var Object_getOwnPropertyNames = Object.getOwnPropertyNames || function (obj) {
    var res = [];
    for (var key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) res.push(key);
    }
    return res;
};

var Object_create = Object.create || function (prototype, properties) {
    // from es5-shim
    var object;
    if (prototype === null) {
        object = { '__proto__' : null };
    }
    else {
        if (typeof prototype !== 'object') {
            throw new TypeError(
                'typeof prototype[' + (typeof prototype) + '] != \'object\''
            );
        }
        var Type = function () {};
        Type.prototype = prototype;
        object = new Type();
        object.__proto__ = prototype;
    }
    if (typeof properties !== 'undefined' && Object.defineProperties) {
        Object.defineProperties(object, properties);
    }
    return object;
};

exports.inherits = function(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object_create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
};

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (typeof f !== 'string') {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(exports.inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j': return JSON.stringify(args[i++]);
      default:
        return x;
    }
  });
  for(var x = args[i]; i < len; x = args[++i]){
    if (x === null || typeof x !== 'object') {
      str += ' ' + x;
    } else {
      str += ' ' + exports.inspect(x);
    }
  }
  return str;
};

},{"events":36}],40:[function(require,module,exports){
var Stream = require('stream');

var Response = module.exports = function (res) {
    this.offset = 0;
    this.readable = true;
};

Response.prototype = new Stream;

var capable = {
    streaming : true,
    status2 : true
};

function parseHeaders (res) {
    var lines = res.getAllResponseHeaders().split(/\r?\n/);
    var headers = {};
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (line === '') continue;
        
        var m = line.match(/^([^:]+):\s*(.*)/);
        if (m) {
            var key = m[1].toLowerCase(), value = m[2];
            
            if (headers[key] !== undefined) {
            
                if (isArray(headers[key])) {
                    headers[key].push(value);
                }
                else {
                    headers[key] = [ headers[key], value ];
                }
            }
            else {
                headers[key] = value;
            }
        }
        else {
            headers[line] = true;
        }
    }
    return headers;
}

Response.prototype.getResponse = function (xhr) {
    var respType = String(xhr.responseType).toLowerCase();
    if (respType === 'blob') return xhr.responseBlob || xhr.response;
    if (respType === 'arraybuffer') return xhr.response;
    return xhr.responseText;
}

Response.prototype.getHeader = function (key) {
    return this.headers[key.toLowerCase()];
};

Response.prototype.handle = function (res) {
    if (res.readyState === 2 && capable.status2) {
        try {
            this.statusCode = res.status;
            this.headers = parseHeaders(res);
        }
        catch (err) {
            capable.status2 = false;
        }
        
        if (capable.status2) {
            this.emit('ready');
        }
    }
    else if (capable.streaming && res.readyState === 3) {
        try {
            if (!this.statusCode) {
                this.statusCode = res.status;
                this.headers = parseHeaders(res);
                this.emit('ready');
            }
        }
        catch (err) {}
        
        try {
            this._emitData(res);
        }
        catch (err) {
            capable.streaming = false;
        }
    }
    else if (res.readyState === 4) {
        if (!this.statusCode) {
            this.statusCode = res.status;
            this.emit('ready');
        }
        this._emitData(res);
        
        if (res.error) {
            this.emit('error', this.getResponse(res));
        }
        else this.emit('end');
        
        this.emit('close');
    }
};

Response.prototype._emitData = function (res) {
    var respBody = this.getResponse(res);
    if (respBody.toString().match(/ArrayBuffer/)) {
        this.emit('data', new Uint8Array(respBody, this.offset));
        this.offset = respBody.byteLength;
        return;
    }
    if (respBody.length > this.offset) {
        this.emit('data', respBody.slice(this.offset));
        this.offset = respBody.length;
    }
};

var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};

},{"stream":38}],37:[function(require,module,exports){
var Stream = require('stream');
var Response = require('./response');
var concatStream = require('concat-stream');
var Base64 = require('Base64');

var Request = module.exports = function (xhr, params) {
    var self = this;
    self.writable = true;
    self.xhr = xhr;
    self.body = concatStream()
    
    var uri = params.host
        + (params.port ? ':' + params.port : '')
        + (params.path || '/')
    ;
    
    xhr.open(
        params.method || 'GET',
        (params.scheme || 'http') + '://' + uri,
        true
    );
    
    if (params.headers) {
        var keys = objectKeys(params.headers);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (!self.isSafeRequestHeader(key)) continue;
            var value = params.headers[key];
            if (isArray(value)) {
                for (var j = 0; j < value.length; j++) {
                    xhr.setRequestHeader(key, value[j]);
                }
            }
            else xhr.setRequestHeader(key, value)
        }
    }
    
    if (params.auth) {
        //basic auth
        this.setHeader('Authorization', 'Basic ' + Base64.btoa(params.auth));
    }

    var res = new Response;
    res.on('close', function () {
        self.emit('close');
    });
    
    res.on('ready', function () {
        self.emit('response', res);
    });
    
    xhr.onreadystatechange = function () {
        res.handle(xhr);
    };
};

Request.prototype = new Stream;

Request.prototype.setHeader = function (key, value) {
    if (isArray(value)) {
        for (var i = 0; i < value.length; i++) {
            this.xhr.setRequestHeader(key, value[i]);
        }
    }
    else {
        this.xhr.setRequestHeader(key, value);
    }
};

Request.prototype.write = function (s) {
    this.body.write(s);
};

Request.prototype.destroy = function (s) {
    this.xhr.abort();
    this.emit('close');
};

Request.prototype.end = function (s) {
    if (s !== undefined) this.body.write(s);
    this.body.end()
    this.xhr.send(this.body.getBody());
};

// Taken from http://dxr.mozilla.org/mozilla/mozilla-central/content/base/src/nsXMLHttpRequest.cpp.html
Request.unsafeHeaders = [
    "accept-charset",
    "accept-encoding",
    "access-control-request-headers",
    "access-control-request-method",
    "connection",
    "content-length",
    "cookie",
    "cookie2",
    "content-transfer-encoding",
    "date",
    "expect",
    "host",
    "keep-alive",
    "origin",
    "referer",
    "te",
    "trailer",
    "transfer-encoding",
    "upgrade",
    "user-agent",
    "via"
];

Request.prototype.isSafeRequestHeader = function (headerName) {
    if (!headerName) return false;
    return indexOf(Request.unsafeHeaders, headerName.toLowerCase()) === -1;
};

var objectKeys = Object.keys || function (obj) {
    var keys = [];
    for (var key in obj) keys.push(key);
    return keys;
};

var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};

var indexOf = function (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0; i < xs.length; i++) {
        if (xs[i] === x) return i;
    }
    return -1;
};

},{"./response":40,"Base64":42,"concat-stream":41,"stream":38}],42:[function(require,module,exports){
;(function () {

  var
    object = typeof exports != 'undefined' ? exports : window,
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
    INVALID_CHARACTER_ERR = (function () {
      // fabricate a suitable error object
      try { document.createElement('$'); }
      catch (error) { return error; }}());

  // encoder
  // [https://gist.github.com/999166] by [https://github.com/nignag]
  object.btoa || (
  object.btoa = function (input) {
    for (
      // initialize result and counter
      var block, charCode, idx = 0, map = chars, output = '';
      // if the next input index does not exist:
      //   change the mapping table to "="
      //   check if d has no fractional digits
      input.charAt(idx | 0) || (map = '=', idx % 1);
      // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
      output += map.charAt(63 & block >> 8 - idx % 1 * 8)
    ) {
      charCode = input.charCodeAt(idx += 3/4);
      if (charCode > 0xFF) throw INVALID_CHARACTER_ERR;
      block = block << 8 | charCode;
    }
    return output;
  });

  // decoder
  // [https://gist.github.com/1020396] by [https://github.com/atk]
  object.atob || (
  object.atob = function (input) {
    input = input.replace(/=+$/, '')
    if (input.length % 4 == 1) throw INVALID_CHARACTER_ERR;
    for (
      // initialize result and counters
      var bc = 0, bs, buffer, idx = 0, output = '';
      // get next character
      buffer = input.charAt(idx++);
      // character found in table? initialize bit storage and add its ascii value;
      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
        // and if not first of each 4 characters,
        // convert the first 8 bits to one ascii character
        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
      // try to find character in table (0-63, not found => -1)
      buffer = chars.indexOf(buffer);
    }
    return output;
  });

}());

},{}],41:[function(require,module,exports){
var stream = require('stream')
var bops = require('bops')
var util = require('util')

function ConcatStream(cb) {
  stream.Stream.call(this)
  this.writable = true
  if (cb) this.cb = cb
  this.body = []
  this.on('error', function(err) {
    // no-op
  })
}

util.inherits(ConcatStream, stream.Stream)

ConcatStream.prototype.write = function(chunk) {
  this.body.push(chunk)
}

ConcatStream.prototype.destroy = function() {}

ConcatStream.prototype.arrayConcat = function(arrs) {
  if (arrs.length === 0) return []
  if (arrs.length === 1) return arrs[0]
  return arrs.reduce(function (a, b) { return a.concat(b) })
}

ConcatStream.prototype.isArray = function(arr) {
  return Array.isArray(arr)
}

ConcatStream.prototype.getBody = function () {
  if (this.body.length === 0) return
  if (typeof(this.body[0]) === "string") return this.body.join('')
  if (this.isArray(this.body[0])) return this.arrayConcat(this.body)
  if (bops.is(this.body[0])) return bops.join(this.body)
  return this.body
}

ConcatStream.prototype.end = function() {
  if (this.cb) this.cb(this.getBody())
}

module.exports = function(cb) {
  return new ConcatStream(cb)
}

module.exports.ConcatStream = ConcatStream

},{"bops":43,"stream":38,"util":39}],43:[function(require,module,exports){
var proto = {}
module.exports = proto

proto.from = require('./from.js')
proto.to = require('./to.js')
proto.is = require('./is.js')
proto.subarray = require('./subarray.js')
proto.join = require('./join.js')
proto.copy = require('./copy.js')
proto.create = require('./create.js')

mix(require('./read.js'), proto)
mix(require('./write.js'), proto)

function mix(from, into) {
  for(var key in from) {
    into[key] = from[key]
  }
}

},{"./copy.js":49,"./create.js":50,"./from.js":44,"./is.js":46,"./join.js":48,"./read.js":51,"./subarray.js":47,"./to.js":45,"./write.js":52}],46:[function(require,module,exports){

module.exports = function(buffer) {
  return buffer instanceof Uint8Array;
}

},{}],47:[function(require,module,exports){
module.exports = subarray

function subarray(buf, from, to) {
  return buf.subarray(from || 0, to || buf.length)
}

},{}],48:[function(require,module,exports){
module.exports = join

function join(targets, hint) {
  if(!targets.length) {
    return new Uint8Array(0)
  }

  var len = hint !== undefined ? hint : get_length(targets)
    , out = new Uint8Array(len)
    , cur = targets[0]
    , curlen = cur.length
    , curidx = 0
    , curoff = 0
    , i = 0

  while(i < len) {
    if(curoff === curlen) {
      curoff = 0
      ++curidx
      cur = targets[curidx]
      curlen = cur && cur.length
      continue
    }
    out[i++] = cur[curoff++] 
  }

  return out
}

function get_length(targets) {
  var size = 0
  for(var i = 0, len = targets.length; i < len; ++i) {
    size += targets[i].byteLength
  }
  return size
}

},{}],49:[function(require,module,exports){
module.exports = copy

var slice = [].slice

function copy(source, target, target_start, source_start, source_end) {
  target_start = arguments.length < 3 ? 0 : target_start
  source_start = arguments.length < 4 ? 0 : source_start
  source_end = arguments.length < 5 ? source.length : source_end

  if(source_end === source_start) {
    return
  }

  if(target.length === 0 || source.length === 0) {
    return
  }

  if(source_end > source.length) {
    source_end = source.length
  }

  if(target.length - target_start < source_end - source_start) {
    source_end = target.length - target_start + start
  }

  if(source.buffer !== target.buffer) {
    return fast_copy(source, target, target_start, source_start, source_end)
  }
  return slow_copy(source, target, target_start, source_start, source_end)
}

function fast_copy(source, target, target_start, source_start, source_end) {
  var len = (source_end - source_start) + target_start

  for(var i = target_start, j = source_start;
      i < len;
      ++i,
      ++j) {
    target[i] = source[j]
  }
}

function slow_copy(from, to, j, i, jend) {
  // the buffers could overlap.
  var iend = jend + i
    , tmp = new Uint8Array(slice.call(from, i, iend))
    , x = 0

  for(; i < iend; ++i, ++x) {
    to[j++] = tmp[x]
  }
}

},{}],50:[function(require,module,exports){
module.exports = function(size) {
  return new Uint8Array(size)
}

},{}],51:[function(require,module,exports){
module.exports = {
    readUInt8:      read_uint8
  , readInt8:       read_int8
  , readUInt16LE:   read_uint16_le
  , readUInt32LE:   read_uint32_le
  , readInt16LE:    read_int16_le
  , readInt32LE:    read_int32_le
  , readFloatLE:    read_float_le
  , readDoubleLE:   read_double_le
  , readUInt16BE:   read_uint16_be
  , readUInt32BE:   read_uint32_be
  , readInt16BE:    read_int16_be
  , readInt32BE:    read_int32_be
  , readFloatBE:    read_float_be
  , readDoubleBE:   read_double_be
}

var map = require('./mapped.js')

function read_uint8(target, at) {
  return target[at]
}

function read_int8(target, at) {
  var v = target[at];
  return v < 0x80 ? v : v - 0x100
}

function read_uint16_le(target, at) {
  var dv = map.get(target);
  return dv.getUint16(at + target.byteOffset, true)
}

function read_uint32_le(target, at) {
  var dv = map.get(target);
  return dv.getUint32(at + target.byteOffset, true)
}

function read_int16_le(target, at) {
  var dv = map.get(target);
  return dv.getInt16(at + target.byteOffset, true)
}

function read_int32_le(target, at) {
  var dv = map.get(target);
  return dv.getInt32(at + target.byteOffset, true)
}

function read_float_le(target, at) {
  var dv = map.get(target);
  return dv.getFloat32(at + target.byteOffset, true)
}

function read_double_le(target, at) {
  var dv = map.get(target);
  return dv.getFloat64(at + target.byteOffset, true)
}

function read_uint16_be(target, at) {
  var dv = map.get(target);
  return dv.getUint16(at + target.byteOffset, false)
}

function read_uint32_be(target, at) {
  var dv = map.get(target);
  return dv.getUint32(at + target.byteOffset, false)
}

function read_int16_be(target, at) {
  var dv = map.get(target);
  return dv.getInt16(at + target.byteOffset, false)
}

function read_int32_be(target, at) {
  var dv = map.get(target);
  return dv.getInt32(at + target.byteOffset, false)
}

function read_float_be(target, at) {
  var dv = map.get(target);
  return dv.getFloat32(at + target.byteOffset, false)
}

function read_double_be(target, at) {
  var dv = map.get(target);
  return dv.getFloat64(at + target.byteOffset, false)
}

},{"./mapped.js":53}],52:[function(require,module,exports){
module.exports = {
    writeUInt8:      write_uint8
  , writeInt8:       write_int8
  , writeUInt16LE:   write_uint16_le
  , writeUInt32LE:   write_uint32_le
  , writeInt16LE:    write_int16_le
  , writeInt32LE:    write_int32_le
  , writeFloatLE:    write_float_le
  , writeDoubleLE:   write_double_le
  , writeUInt16BE:   write_uint16_be
  , writeUInt32BE:   write_uint32_be
  , writeInt16BE:    write_int16_be
  , writeInt32BE:    write_int32_be
  , writeFloatBE:    write_float_be
  , writeDoubleBE:   write_double_be
}

var map = require('./mapped.js')

function write_uint8(target, value, at) {
  return target[at] = value
}

function write_int8(target, value, at) {
  return target[at] = value < 0 ? value + 0x100 : value
}

function write_uint16_le(target, value, at) {
  var dv = map.get(target);
  return dv.setUint16(at + target.byteOffset, value, true)
}

function write_uint32_le(target, value, at) {
  var dv = map.get(target);
  return dv.setUint32(at + target.byteOffset, value, true)
}

function write_int16_le(target, value, at) {
  var dv = map.get(target);
  return dv.setInt16(at + target.byteOffset, value, true)
}

function write_int32_le(target, value, at) {
  var dv = map.get(target);
  return dv.setInt32(at + target.byteOffset, value, true)
}

function write_float_le(target, value, at) {
  var dv = map.get(target);
  return dv.setFloat32(at + target.byteOffset, value, true)
}

function write_double_le(target, value, at) {
  var dv = map.get(target);
  return dv.setFloat64(at + target.byteOffset, value, true)
}

function write_uint16_be(target, value, at) {
  var dv = map.get(target);
  return dv.setUint16(at + target.byteOffset, value, false)
}

function write_uint32_be(target, value, at) {
  var dv = map.get(target);
  return dv.setUint32(at + target.byteOffset, value, false)
}

function write_int16_be(target, value, at) {
  var dv = map.get(target);
  return dv.setInt16(at + target.byteOffset, value, false)
}

function write_int32_be(target, value, at) {
  var dv = map.get(target);
  return dv.setInt32(at + target.byteOffset, value, false)
}

function write_float_be(target, value, at) {
  var dv = map.get(target);
  return dv.setFloat32(at + target.byteOffset, value, false)
}

function write_double_be(target, value, at) {
  var dv = map.get(target);
  return dv.setFloat64(at + target.byteOffset, value, false)
}

},{"./mapped.js":53}],53:[function(require,module,exports){
var proto
  , map

module.exports = proto = {}

map = typeof WeakMap === 'undefined' ? null : new WeakMap

proto.get = !map ? no_weakmap_get : get

function no_weakmap_get(target) {
  return new DataView(target.buffer, 0)
}

function get(target) {
  var out = map.get(target.buffer)
  if(!out) {
    map.set(target.buffer, out = new DataView(target.buffer, 0))
  }
  return out
}

},{}],44:[function(require,module,exports){
module.exports = from

var base64 = require('base64-js')

var decoders = {
    hex: from_hex
  , utf8: from_utf
  , base64: from_base64
}

function from(source, encoding) {
  if(Array.isArray(source)) {
    return new Uint8Array(source)
  }

  return decoders[encoding || 'utf8'](source)
}

function from_hex(str) {
  var size = str.length / 2
    , buf = new Uint8Array(size)
    , character = ''

  for(var i = 0, len = str.length; i < len; ++i) {
    character += str.charAt(i)

    if(i > 0 && (i % 2) === 1) {
      buf[i>>>1] = parseInt(character, 16)
      character = '' 
    }
  }

  return buf 
}

function from_utf(str) {
  var bytes = []
    , tmp
    , ch

  for(var i = 0, len = str.length; i < len; ++i) {
    ch = str.charCodeAt(i)
    if(ch & 0x80) {
      tmp = encodeURIComponent(str.charAt(i)).substr(1).split('%')
      for(var j = 0, jlen = tmp.length; j < jlen; ++j) {
        bytes[bytes.length] = parseInt(tmp[j], 16)
      }
    } else {
      bytes[bytes.length] = ch 
    }
  }

  return new Uint8Array(bytes)
}

function from_base64(str) {
  return new Uint8Array(base64.toByteArray(str)) 
}

},{"base64-js":54}],45:[function(require,module,exports){
module.exports = to

var base64 = require('base64-js')
  , toutf8 = require('to-utf8')

var encoders = {
    hex: to_hex
  , utf8: to_utf
  , base64: to_base64
}

function to(buf, encoding) {
  return encoders[encoding || 'utf8'](buf)
}

function to_hex(buf) {
  var str = ''
    , byt

  for(var i = 0, len = buf.length; i < len; ++i) {
    byt = buf[i]
    str += ((byt & 0xF0) >>> 4).toString(16)
    str += (byt & 0x0F).toString(16)
  }

  return str
}

function to_utf(buf) {
  return toutf8(buf)
}

function to_base64(buf) {
  return base64.fromByteArray(buf)
}


},{"base64-js":54,"to-utf8":55}],54:[function(require,module,exports){
(function (exports) {
	'use strict';

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	function b64ToByteArray(b64) {
		var i, j, l, tmp, placeHolders, arr;
	
		if (b64.length % 4 > 0) {
			throw 'Invalid string. Length must be a multiple of 4';
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		placeHolders = b64.indexOf('=');
		placeHolders = placeHolders > 0 ? b64.length - placeHolders : 0;

		// base64 is 4/3 + up to two characters of the original data
		arr = [];//new Uint8Array(b64.length * 3 / 4 - placeHolders);

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length;

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (lookup.indexOf(b64[i]) << 18) | (lookup.indexOf(b64[i + 1]) << 12) | (lookup.indexOf(b64[i + 2]) << 6) | lookup.indexOf(b64[i + 3]);
			arr.push((tmp & 0xFF0000) >> 16);
			arr.push((tmp & 0xFF00) >> 8);
			arr.push(tmp & 0xFF);
		}

		if (placeHolders === 2) {
			tmp = (lookup.indexOf(b64[i]) << 2) | (lookup.indexOf(b64[i + 1]) >> 4);
			arr.push(tmp & 0xFF);
		} else if (placeHolders === 1) {
			tmp = (lookup.indexOf(b64[i]) << 10) | (lookup.indexOf(b64[i + 1]) << 4) | (lookup.indexOf(b64[i + 2]) >> 2);
			arr.push((tmp >> 8) & 0xFF);
			arr.push(tmp & 0xFF);
		}

		return arr;
	}

	function uint8ToBase64(uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length;

		function tripletToBase64 (num) {
			return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
		};

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
			output += tripletToBase64(temp);
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1];
				output += lookup[temp >> 2];
				output += lookup[(temp << 4) & 0x3F];
				output += '==';
				break;
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1]);
				output += lookup[temp >> 10];
				output += lookup[(temp >> 4) & 0x3F];
				output += lookup[(temp << 2) & 0x3F];
				output += '=';
				break;
		}

		return output;
	}

	module.exports.toByteArray = b64ToByteArray;
	module.exports.fromByteArray = uint8ToBase64;
}());

},{}],55:[function(require,module,exports){
module.exports = to_utf8

var out = []
  , col = []
  , fcc = String.fromCharCode
  , mask = [0x40, 0x20, 0x10, 0x08, 0x04, 0x02, 0x01]
  , unmask = [
      0x00
    , 0x01
    , 0x02 | 0x01
    , 0x04 | 0x02 | 0x01
    , 0x08 | 0x04 | 0x02 | 0x01
    , 0x10 | 0x08 | 0x04 | 0x02 | 0x01
    , 0x20 | 0x10 | 0x08 | 0x04 | 0x02 | 0x01
    , 0x40 | 0x20 | 0x10 | 0x08 | 0x04 | 0x02 | 0x01
  ]

function to_utf8(bytes, start, end) {
  start = start === undefined ? 0 : start
  end = end === undefined ? bytes.length : end

  var idx = 0
    , hi = 0x80
    , collecting = 0
    , pos
    , by

  col.length =
  out.length = 0

  while(idx < bytes.length) {
    by = bytes[idx]
    if(!collecting && by & hi) {
      pos = find_pad_position(by)
      collecting += pos
      if(pos < 8) {
        col[col.length] = by & unmask[6 - pos]
      }
    } else if(collecting) {
      col[col.length] = by & unmask[6]
      --collecting
      if(!collecting && col.length) {
        out[out.length] = fcc(reduced(col, pos))
        col.length = 0
      }
    } else { 
      out[out.length] = fcc(by)
    }
    ++idx
  }
  if(col.length && !collecting) {
    out[out.length] = fcc(reduced(col, pos))
    col.length = 0
  }
  return out.join('')
}

function find_pad_position(byt) {
  for(var i = 0; i < 7; ++i) {
    if(!(byt & mask[i])) {
      break
    }
  }
  return i
}

function reduced(list) {
  var out = 0
  for(var i = 0, len = list.length; i < len; ++i) {
    out |= list[i] << ((len - i - 1) * 6)
  }
  return out
}

},{}]},{},[10,12,15,1,2,16,17,13,20,26,11,18,21,24,19,25,3,27,23,28,4,22,6])
;