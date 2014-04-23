!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),(f.RAML||(f.RAML={})).Parser=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
  var MarkedYAMLError, events, nodes, raml, util, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

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
      this.composeRamlTree = __bind(this.composeRamlTree, this);
      this.anchors = {};
      this.filesToRead = [];
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

    Composer.prototype.getYamlRoot = function() {
      var document, event;
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
      return document;
    };

    Composer.prototype.composeRamlTree = function(node, settings) {
      if (settings.validate || settings.transform) {
        this.load_schemas(node);
        this.load_traits(node);
        this.load_types(node);
        this.load_security_schemes(node);
      }
      if (settings.validate) {
        this.validate_document(node);
      }
      if (settings.transform) {
        this.apply_types(node);
        this.apply_traits(node);
        this.apply_schemas(node);
        this.apply_protocols(node);
        this.join_resources(node);
      }
      return node;
    };

    Composer.prototype.compose_document = function() {
      var node;
      this.get_event();
      node = this.compose_node();
      this.get_event();
      this.anchors = {};
      return node;
    };

    Composer.prototype.getPendingFilesList = function() {
      return this.filesToRead;
    };

    Composer.prototype.compose_node = function(parent, index) {
      var anchor, event, node;
      if (this.check_event(events.AliasEvent)) {
        event = this.get_event();
        anchor = event.anchor;
        if (!(anchor in this.anchors)) {
          throw new exports.ComposerError(null, null, "found undefined alias " + anchor, event.start_mark);
        }
        return this.anchors[anchor].clone();
      }
      event = this.peek_event();
      anchor = event.anchor;
      if (anchor !== null && anchor in this.anchors) {
        throw new exports.ComposerError("found duplicate anchor " + anchor + "; first occurence", this.anchors[anchor].start_mark, 'second occurrence', event.start_mark);
      }
      this.descend_resolver(parent, index);
      if (this.check_event(events.ScalarEvent)) {
        node = this.compose_scalar_node(anchor, parent, index);
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

    Composer.prototype.compose_scalar_node = function(anchor, parent, key) {
      var event, extension, fileType, node, tag;
      event = this.get_event();
      tag = event.tag;
      node = {};
      if (tag === null || tag === '!') {
        tag = this.resolve(nodes.ScalarNode, event.value, event.implicit);
      }
      if (event.tag === '!include') {
        if (event.value.match(/^\s*$/)) {
          throw new exports.ComposerError('while composing scalar out of !include', null, "file name/URL cannot be null", event.start_mark);
        }
        extension = event.value.split('.').pop();
        if (extension === 'yaml' || extension === 'yml' || extension === 'raml') {
          fileType = 'fragment';
        } else {
          fileType = 'scalar';
        }
        this.filesToRead.push({
          targetUri: event.value,
          type: fileType,
          parentNode: parent,
          parentKey: key,
          event: event,
          includingContext: this.src,
          targetFileUri: event.value
        });
        node = void 0;
      } else {
        node = new nodes.ScalarNode(tag, event.value, event.start_mark, event.end_mark, event.style);
      }
      if (anchor && node) {
        this.anchors[anchor] = node;
      }
      return node;
    };

    Composer.prototype.compose_sequence_node = function(anchor) {
      var end_event, index, node, start_event, tag, value;
      start_event = this.get_event();
      tag = start_event.tag;
      if (tag === null || tag === '!') {
        tag = this.resolve(nodes.SequenceNode, null, start_event.implicit);
      }
      node = new nodes.SequenceNode(tag, [], start_event.start_mark, null, start_event.flow_style);
      index = 0;
      if (anchor) {
        this.anchors[anchor] = node;
      }
      while (!this.check_event(events.SequenceEndEvent)) {
        if (value = this.compose_node(node, index)) {
          node.value[index] = value;
        }
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
        if (item_value = this.compose_node(node, item_key)) {
          node.value.push([item_key, item_value]);
        }
      }
      end_event = this.get_event();
      node.end_mark = end_event.end_mark;
      return node;
    };

    return Composer;

  })();

}).call(this);

},{"./errors":3,"./events":4,"./nodes":7,"./raml":10,"./util":20}],2:[function(require,module,exports){
(function (Buffer){
(function() {
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
      "true": true,
      "false": false
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

}).call(this,require("buffer").Buffer)
},{"./errors":3,"./nodes":7,"./util":20,"buffer":31}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{"./errors":3,"./nodes":7}],6:[function(require,module,exports){
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

      components = [Reader, Scanner, Composer, Transformations, Parser, Resolver, Validator, Traits, ResourceTypes, Schemas, Protocols, Joiner, Constructor, SecuritySchemes];

      util.extend.apply(util, [_Class.prototype].concat((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = components.length; _i < _len; _i++) {
          component = components[_i];
          _results.push(component.prototype);
        }
        return _results;
      })()));

      function _Class(stream, location, settings, parent) {
        var _i, _len, _ref;
        this.parent = parent != null ? parent : null;
        components[0].call(this, stream, location);
        components[1].call(this, settings);
        components[2].call(this, settings);
        components[3].call(this, settings);
        _ref = components.slice(4);
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

},{"./composer":1,"./construct":2,"./joiner":5,"./parser":8,"./protocols":9,"./reader":11,"./resolver":12,"./resourceTypes":13,"./scanner":14,"./schemas":15,"./securitySchemes":16,"./traits":18,"./transformations":19,"./util":20,"./validator":21}],7:[function(require,module,exports){
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

},{"./errors":3}],8:[function(require,module,exports){
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

},{"./errors":3,"./events":4,"./tokens":17}],9:[function(require,module,exports){
(function() {
  var MarkedYAMLError, nodes, url, util,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  url = require('url');

  MarkedYAMLError = require('./errors').MarkedYAMLError;

  nodes = require('./nodes');

  util = require('./util');

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
      if (!(baseUri = this.property_value(node, 'baseUri'))) {
        return;
      }
      parsedBaseUri = url.parse(baseUri);
      protocol = (parsedBaseUri.protocol || 'http:').slice(0, -1).toUpperCase();
      protocols = [new nodes.ScalarNode('tag:yaml.org,2002:str', 'protocols', node.start_mark, node.end_mark), new nodes.SequenceNode('tag:yaml.org,2002:seq', [new nodes.ScalarNode('tag:yaml.org,2002:str', protocol, node.start_mark, node.end_mark)], node.start_mark, node.end_mark)];
      node.value.push(protocols);
      return protocols[1];
    };

    Protocols.prototype.apply_protocols_to_resources = function(node, protocols) {
      var resource, _i, _len, _ref, _results;
      _ref = this.child_resources(node);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        resource = _ref[_i];
        this.apply_protocols_to_resources(resource, protocols);
        _results.push(this.apply_protocols_to_methods(resource, protocols));
      }
      return _results;
    };

    Protocols.prototype.apply_protocols_to_methods = function(node, protocols) {
      var method, _i, _len, _ref, _results;
      _ref = this.child_methods(node[1]);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        method = _ref[_i];
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

},{"./errors":3,"./nodes":7,"./util":20,"url":46}],10:[function(require,module,exports){
(function() {
  var defaultSettings, util, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.errors = require('./errors');

  this.loader = require('./loader');

  util = require('./util');

  this.FileError = (function(_super) {
    __extends(FileError, _super);

    function FileError() {
      _ref = FileError.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return FileError;

  })(this.errors.MarkedYAMLError);

  this.FileReader = (function() {
    function FileReader(readFileAsyncOverride) {
      this.q = require('q');
      this.url = require('url');
      if (readFileAsyncOverride) {
        this.readFileAsyncOverride = readFileAsyncOverride;
      }
    }

    /*
    Read file either locally or from the network.
    */


    FileReader.prototype.readFileAsync = function(file) {
      var targerUrl;
      if (this.readFileAsyncOverride) {
        return this.readFileAsyncOverride(file);
      }
      targerUrl = this.url.parse(file);
      if (targerUrl.protocol != null) {
        if (!targerUrl.protocol.match(/^https?/i)) {
          throw new exports.FileError("while reading " + file, null, "unknown protocol " + targerUrl.protocol, this.start_mark);
        } else {
          return this.fetchFileAsync(file);
        }
      } else {
        if (typeof window !== "undefined" && window !== null) {
          return this.fetchFileAsync(file);
        } else {
          return this.fetchLocalFileAsync(file);
        }
      }
    };

    /*
    Read file from the disk.
    */


    FileReader.prototype.fetchLocalFileAsync = function(file) {
      var deferred,
        _this = this;
      deferred = this.q.defer();
      require('fs').readFile(file, function(err, data) {
        if (err) {
          return deferred.reject(new exports.FileError("while reading " + file, null, "cannot read " + file + " (" + err + ")", _this.start_mark));
        } else {
          return deferred.resolve(data.toString());
        }
      });
      return deferred.promise;
    };

    /*
    Read file from the network.
    */


    FileReader.prototype.fetchFileAsync = function(file) {
      var deferred, error, xhr,
        _this = this;
      deferred = this.q.defer();
      if (typeof window !== "undefined" && window !== null) {
        xhr = new XMLHttpRequest();
      } else {
        xhr = new (require('xmlhttprequest').XMLHttpRequest)();
      }
      try {
        xhr.open('GET', file, false);
        xhr.setRequestHeader('Accept', 'application/raml+yaml, */*');
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            if ((typeof xhr.status === 'number' && xhr.status === 200) || (typeof xhr.status === 'string' && xhr.status.match(/^200/i))) {
              return deferred.resolve(xhr.responseText);
            } else {
              return deferred.reject(new exports.FileError("while fetching " + file, null, "cannot fetch " + file + " (" + xhr.statusText + ")", _this.start_mark));
            }
          }
        };
        xhr.send(null);
        return deferred.promise;
      } catch (_error) {
        error = _error;
        throw new exports.FileError("while fetching " + file, null, "cannot fetch " + file + " (" + error + "), check that the server is up and that CORS is enabled", this.start_mark);
      }
    };

    return FileReader;

  })();

  /*
  OO version of the parser, static functions will be removed after consumers move on to use the OO version
  OO will offer caching
  */


  this.RamlParser = (function() {
    function RamlParser(settings) {
      this.settings = settings != null ? settings : defaultSettings;
      this.q = require('q');
      this.url = require('url');
      this.nodes = require('./nodes');
      this.loadDefaultSettings(settings);
    }

    RamlParser.prototype.loadDefaultSettings = function(settings) {
      var _this = this;
      return Object.keys(defaultSettings).forEach(function(settingName) {
        if (!(settingName in settings)) {
          return settings[settingName] = defaultSettings[settingName];
        }
      });
    };

    RamlParser.prototype.loadFile = function(file, settings) {
      var error,
        _this = this;
      if (settings == null) {
        settings = this.settings;
      }
      try {
        return settings.reader.readFileAsync(file).then(function(stream) {
          return _this.load(stream, file, settings);
        });
      } catch (_error) {
        error = _error;
        return this.q.fcall(function() {
          throw new exports.FileError("while fetching " + file, null, "cannot fetch " + file + " (" + error + ")", null);
        });
      }
    };

    RamlParser.prototype.composeFile = function(file, settings) {
      var error,
        _this = this;
      if (settings == null) {
        settings = this.settings;
      }
      try {
        return settings.reader.readFileAsync(file).then(function(stream) {
          return _this.compose(stream, file, settings, parent);
        });
      } catch (_error) {
        error = _error;
        return this.q.fcall(function() {
          throw new exports.FileError("while fetching " + file, null, "cannot fetch " + file + " (" + error + ")", null);
        });
      }
    };

    RamlParser.prototype.compose = function(stream, location, settings, parent) {
      if (settings == null) {
        settings = this.settings;
      }
      if (parent == null) {
        parent = {
          src: location
        };
      }
      settings.compose = false;
      return this.parseStream(stream, location, settings, parent);
    };

    RamlParser.prototype.load = function(stream, location, settings) {
      if (settings == null) {
        settings = this.settings;
      }
      settings.compose = true;
      return this.parseStream(stream, location, settings, {
        src: location
      });
    };

    RamlParser.prototype.parseStream = function(stream, location, settings, parent) {
      var loader,
        _this = this;
      if (settings == null) {
        settings = this.settings;
      }
      loader = new exports.loader.Loader(stream, location, settings, parent);
      return this.q.fcall(function() {
        return loader.getYamlRoot();
      }).then(function(partialTree) {
        var files;
        files = loader.getPendingFilesList();
        return _this.getPendingFiles(loader, partialTree, files);
      }).then(function(fullyAssembledTree) {
        loader.composeRamlTree(fullyAssembledTree, settings);
        if (settings.compose) {
          if (fullyAssembledTree != null) {
            return loader.construct_document(fullyAssembledTree);
          } else {
            return null;
          }
        } else {
          return fullyAssembledTree;
        }
      });
    };

    RamlParser.prototype.getPendingFiles = function(loader, node, files) {
      var file, lastVisitedNode, loc, _i, _len,
        _this = this;
      loc = [];
      lastVisitedNode = void 0;
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        loc.push(this.getPendingFile(loader, file).then(function(overwritingnode) {
          if (overwritingnode && !lastVisitedNode) {
            return lastVisitedNode = overwritingnode;
          }
        }));
      }
      return this.q.all(loc).then(function() {
        if (lastVisitedNode) {
          return lastVisitedNode;
        } else {
          return node;
        }
      });
    };

    RamlParser.prototype.getPendingFile = function(loader, fileInfo) {
      var error, event, fileUri, key, node,
        _this = this;
      node = fileInfo.parentNode;
      event = fileInfo.event;
      key = fileInfo.parentKey;
      fileUri = fileInfo.targetFileUri;
      if (fileInfo.includingContext) {
        fileUri = this.url.resolve(fileInfo.includingContext, fileInfo.targetFileUri);
      }
      if (loader.parent && this.isInIncludeTagsStack(fileUri, loader)) {
        throw new exports.FileError('while composing scalar out of !include', null, "detected circular !include of " + event.value, event.start_mark);
      }
      try {
        if (fileInfo.type === 'fragment') {
          return this.settings.reader.readFileAsync(fileUri).then(function(result) {
            return _this.compose(result, fileUri, {
              validate: false,
              transform: false,
              compose: true
            }, loader);
          }).then(function(value) {
            return _this.appendNewNodeToParent(node, key, value);
          })["catch"](function(error) {
            return _this.addContextToError(error, event);
          });
        } else {
          return this.settings.reader.readFileAsync(fileUri).then(function(result) {
            var value;
            value = new _this.nodes.ScalarNode('tag:yaml.org,2002:str', result, event.start_mark, event.end_mark, event.style);
            return _this.appendNewNodeToParent(node, key, value);
          })["catch"](function(error) {
            return _this.addContextToError(error, event);
          });
        }
      } catch (_error) {
        error = _error;
        return this.addContextToError(error, event);
      }
    };

    RamlParser.prototype.addContextToError = function(error, event) {
      if (error.constructor.name === "FileError") {
        if (!error.problem_mark) {
          error.problem_mark = event.start_mark;
        }
        throw error;
      } else {
        throw new exports.FileError('while reading file', null, "error: " + error, event.start_mark);
      }
    };

    RamlParser.prototype.isInIncludeTagsStack = function(include, parent) {
      while (parent = parent.parent) {
        if (parent.src === include) {
          return true;
        }
      }
      return false;
    };

    RamlParser.prototype.appendNewNodeToParent = function(node, key, value) {
      if (node) {
        if (util.isSequence(node)) {
          node.value[key] = value;
        } else {
          node.value.push([key, value]);
        }
        return null;
      } else {
        return value;
      }
    };

    return RamlParser;

  })();

  /*
    validate controls whether the stream must be processed as a
  */


  defaultSettings = {
    validate: true,
    transform: true,
    compose: true,
    reader: new exports.FileReader(null)
  };

  /*
  Parse the first RAML document in a stream and produce the corresponding
  Javascript object.
  */


  this.loadFile = function(file, settings) {
    var parser;
    if (settings == null) {
      settings = defaultSettings;
    }
    parser = new exports.RamlParser(settings);
    return parser.loadFile(file, settings);
  };

  /*
  Parse the first RAML document in a file and produce the corresponding
  representation tree.
  */


  this.composeFile = function(file, settings, parent) {
    var parser;
    if (settings == null) {
      settings = defaultSettings;
    }
    if (parent == null) {
      parent = file;
    }
    parser = new exports.RamlParser(settings);
    return parser.composeFile(file, settings, parent);
  };

  /*
  Parse the first RAML document in a stream and produce the corresponding
  representation tree.
  */


  this.compose = function(stream, location, settings, parent) {
    var parser;
    if (settings == null) {
      settings = defaultSettings;
    }
    if (parent == null) {
      parent = location;
    }
    parser = new exports.RamlParser(settings);
    return parser.compose(stream, location, settings, parent);
  };

  /*
  Parse the first RAML document in a stream and produce the corresponding
  Javascript object.
  */


  this.load = function(stream, location, settings) {
    var parser;
    if (settings == null) {
      settings = defaultSettings;
    }
    parser = new exports.RamlParser(settings);
    return parser.load(stream, location, settings, null);
  };

}).call(this);

},{"./errors":3,"./loader":6,"./nodes":7,"./util":20,"fs":22,"q":51,"url":46,"xmlhttprequest":53}],11:[function(require,module,exports){
(function() {
  var Mark, MarkedYAMLError, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require('./errors'), Mark = _ref.Mark, MarkedYAMLError = _ref.MarkedYAMLError;

  this.ReaderError = (function(_super) {
    __extends(ReaderError, _super);

    function ReaderError() {
      _ref1 = ReaderError.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    return ReaderError;

  })(MarkedYAMLError);

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
          this.check_printable(char);
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

    Reader.prototype.check_printable = function(char) {
      if (NON_PRINTABLE.exec(char)) {
        throw new exports.ReaderError('while reading file', null, "non printable characters are not allowed column: " + (this.get_mark().column), this.get_mark());
      }
    };

    return Reader;

  })();

}).call(this);

},{"./errors":3}],12:[function(require,module,exports){
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

  this.Resolver.add_implicit_resolver('tag:yaml.org,2002:bool', /^(?:true|True|TRUE|false|False|FALSE)$/, 'tTfF');

  this.Resolver.add_implicit_resolver('tag:yaml.org,2002:float', /^(?:[-+]?(?:[0-9][0-9_]*)\.[0-9_]*(?:[eE][-+][0-9]+)?|\.[0-9_]+(?:[eE][-+][0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*|[-+]?\.(?:inf|Inf|INF)|\.(?:nan|NaN|NAN))$/, '-+0123456789.');

  this.Resolver.add_implicit_resolver('tag:yaml.org,2002:int', /^(?:[-+]?0b[01_]+|[-+]?0[0-7_]+|[-+]?(?:0|[1-9][0-9_]*)|[-+]?0x[0-9a-fA-F_]+|[-+]?0o[0-7_]+|[-+]?[1-9][0-9_]*(?::[0-5]?[0-9])+)$/, '-+0123456789');

  this.Resolver.add_implicit_resolver('tag:yaml.org,2002:merge', /^(?:<<)$/, '<');

  this.Resolver.add_implicit_resolver('tag:yaml.org,2002:null', /^(?:~|null|Null|NULL|)$/, ['~', 'n', 'N', '']);

  this.Resolver.add_implicit_resolver('tag:yaml.org,2002:timestamp', /^(?:[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]|[0-9][0-9][0-9][0-9]-[0-9][0-9]?-[0-9][0-9]?(?:[Tt]|[\x20\t]+)[0-9][0-9]?:[0-9][0-9]:[0-9][0-9](?:\.[0-9]*)?(?:[\x20\t]*(?:Z|[-+][0-9][0-9]?(?::[0-9][0-9])?))?)$/, '0123456789');

  this.Resolver.add_implicit_resolver('tag:yaml.org,2002:value', /^(?:=)$/, '=');

  this.Resolver.add_implicit_resolver('tag:yaml.org,2002:yaml', /^(?:!|&|\*)$/, '!&*');

}).call(this);

},{"./errors":3,"./nodes":7,"./util":20}],13:[function(require,module,exports){
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
      if (!(typeName != null ? typeName.trim() : void 0)) {
        throw new exports.ResourceTypeError('while applying resource type', null, 'resource type name must be provided', typeKey.start_mark);
      }
      if (!(type = this.get_type(typeName))) {
        throw new exports.ResourceTypeError('while applying resource type', null, "there is no resource type named " + typeName, typeKey.start_mark);
      }
      type = type[1].clone();
      parameters = this._get_parameters_from_type_key(resourceUri, typeKey);
      this.apply_parameters(type, parameters, typeKey);
      return type;
    };

    ResourceTypes.prototype._get_parameters_from_type_key = function(resourceUri, typeKey) {
      var parameter, parameters, reserved, result, _i, _len, _ref1;
      result = {};
      reserved = {
        resourcePath: resourceUri.replace(/\/\/*/g, '/'),
        resourcePathName: this.extractResourcePathName(resourceUri)
      };
      if (util.isMapping(typeKey)) {
        parameters = this.value_or_undefined(typeKey);
        if (util.isMapping(parameters[0][1])) {
          _ref1 = parameters[0][1].value;
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            parameter = _ref1[_i];
            if (parameter[0].value in reserved) {
              throw new exports.ResourceTypeError('while applying parameters', null, "invalid parameter name: " + parameter[0].value + " is reserved", parameter[0].start_mark);
            }
            result[parameter[0].value] = parameter[1].value;
          }
        }
      }
      return util.extend(result, reserved);
    };

    return ResourceTypes;

  })();

}).call(this);

},{"./errors":3,"./nodes":7,"./util":20}],14:[function(require,module,exports){
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


    function Scanner(settings) {
      this.settings = settings;
      this.done = false;
      this.ramlHeaderFound = !this.settings.validate;
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
      var comment, found, trimmedComment, _ref1, _results;
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
          trimmedComment = comment.trim();
          if (trimmedComment && RAML_VERSION_RE.test(trimmedComment)) {
            if (trimmedComment === RAML_VERSION) {
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

},{"./errors":3,"./tokens":17,"./util":20}],15:[function(require,module,exports){
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
        allSchemas = this.property_value(node, 'schemas');
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

},{"./errors":3,"./nodes":7}],16:[function(require,module,exports){
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
      this.load_security_schemes = __bind(this.load_security_schemes, this);
      this.declaredSchemes = {};
    }

    SecuritySchemes.prototype.load_security_schemes = function(node) {
      var allschemes,
        _this = this;
      if (this.has_property(node, "securitySchemes")) {
        allschemes = this.property_value(node, 'securitySchemes');
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

    SecuritySchemes.prototype.get_all_schemes = function() {
      return this.declaredSchemes;
    };

    SecuritySchemes.prototype.get_security_scheme = function(schemaName) {
      return this.declaredSchemes[schemaName];
    };

    return SecuritySchemes;

  })();

}).call(this);

},{"./errors":3,"./nodes":7}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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
      if (this.has_property(node, 'traits')) {
        allTraits = this.property_value(node, 'traits');
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
      if (this.declaredTraits.length === 0 && this.has_property(node, 'traits')) {
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
      if (this.has_property(resource, 'is')) {
        uses = this.property_value(resource, 'is');
        uses.forEach(function(use) {
          return methods.forEach(function(method) {
            return _this.apply_trait(resourceUri, method, use);
          });
        });
      }
      methods.forEach(function(method) {
        if (_this.has_property(method[1], 'is')) {
          uses = _this.property_value(method[1], 'is');
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
      if (!(traitName != null ? traitName.trim() : void 0)) {
        throw new exports.TraitError('while applying trait', null, 'trait name must be provided', useKey.start_mark);
      }
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
        resourcePathName: true,
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
      var parameter, parameters, reserved, result, _i, _len, _ref2;
      result = {};
      reserved = {
        methodName: methodName,
        resourcePath: resourceUri.replace(/\/\/*/g, '/'),
        resourcePathName: this.extractResourcePathName(resourceUri)
      };
      if (util.isMapping(typeKey)) {
        parameters = this.value_or_undefined(typeKey);
        if (util.isMapping(parameters[0][1])) {
          _ref2 = parameters[0][1].value;
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            parameter = _ref2[_i];
            if (parameter[0].value in reserved) {
              throw new exports.TraitError('while applying parameters', null, "invalid parameter name: " + parameter[0].value + " is reserved", parameter[0].start_mark);
            }
            result[parameter[0].value] = parameter[1].value;
          }
        }
      }
      return util.extend(result, reserved);
    };

    Traits.prototype.extractResourcePathName = function(resourceUri) {
      var pathSegments, segment;
      pathSegments = resourceUri.split(/\//);
      while (segment = pathSegments.pop()) {
        if (!(typeof segment !== "undefined" && segment !== null ? segment.match(/[{}]/) : void 0)) {
          return segment;
        }
      }
      return "";
    };

    return Traits;

  })();

}).call(this);

},{"./errors":3,"./nodes":7,"./util":20,"inflection":49}],19:[function(require,module,exports){
(function() {
  var nodes, uritemplate, util,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  uritemplate = require('uritemplate');

  nodes = require('./nodes');

  util = require('./util');

  /*
     Applies transformations to the RAML
  */


  this.Transformations = (function() {
    function Transformations(settings) {
      this.settings = settings;
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
      if (this.settings.transform) {
        this.applyTransformationsToRoot(rootObject);
        resources = rootObject.resources;
        return this.applyTransformationsToResources(rootObject, resources);
      }
    };

    Transformations.prototype.applyAstTransformations = function(document) {
      if (this.settings.transform) {
        return this.transform_document(document);
      }
    };

    Transformations.prototype.load_default_media_type = function(node) {
      if (!util.isMapping(node || (node != null ? node.value : void 0))) {
        return;
      }
      return this.mediaType = this.property_value(node, 'mediaType');
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
      var expressions, inheritedSecScheme, method, parameterName, pathParts, resource, template, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _results;
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
          pathParts = resource.relativeUri.split('\/');
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
      var childResource, method, _i, _j, _len, _len1, _ref, _ref1, _results;
      if (!this.mediaType) {
        return;
      }
      if (!util.isMapping(resource)) {
        return;
      }
      _ref = this.child_resources(resource);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        childResource = _ref[_i];
        this.apply_default_media_type_to_resource(childResource[1]);
      }
      _ref1 = this.child_methods(resource);
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        method = _ref1[_j];
        _results.push(this.apply_default_media_type_to_method(method[1]));
      }
      return _results;
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
      if (this.has_property(method, 'body')) {
        this.apply_default_media_type_to_body(this.get_property(method, 'body'));
      }
      if (this.has_property(method, 'responses')) {
        responses = this.get_property(method, 'responses');
        if (!(responses && responses.value)) {
          return;
        }
        return responses.value.forEach(function(response) {
          if (_this.has_property(response[1], 'body')) {
            return _this.apply_default_media_type_to_body(_this.get_property(response[1], 'body'));
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
            return _this.transform_named_params(property, allowParameterKeys, false);
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
              return _this.transform_named_params(property, allowParameterKeys, false);
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

},{"./nodes":7,"./util":20,"uritemplate":52}],20:[function(require,module,exports){
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

  this.isNumber = function(node) {
    return (node != null ? node.tag : void 0) === 'tag:yaml.org,2002:int' || (node != null ? node.tag : void 0) === 'tag:yaml.org,2002:float';
  };

  this.isScalar = function(node) {
    return (node != null ? node.tag : void 0) === 'tag:yaml.org,2002:null' || (node != null ? node.tag : void 0) === 'tag:yaml.org,2002:bool' || (node != null ? node.tag : void 0) === 'tag:yaml.org,2002:int' || (node != null ? node.tag : void 0) === 'tag:yaml.org,2002:float' || (node != null ? node.tag : void 0) === 'tag:yaml.org,2002:binary' || (node != null ? node.tag : void 0) === 'tag:yaml.org,2002:timestamp' || (node != null ? node.tag : void 0) === 'tag:yaml.org,2002:str';
  };

  this.isCollection = function(node) {
    return (node != null ? node.tag : void 0) === 'tag:yaml.org,2002:omap' || (node != null ? node.tag : void 0) === 'tag:yaml.org,2002:pairs' || (node != null ? node.tag : void 0) === 'tag:yaml.org,2002:set' || (node != null ? node.tag : void 0) === 'tag:yaml.org,2002:seq' || (node != null ? node.tag : void 0) === 'tag:yaml.org,2002:map';
  };

}).call(this);

},{}],21:[function(require,module,exports){
(function() {
  var MarkedYAMLError, jsonlint, nodes, traits, uritemplate, url, util, _ref,
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

  jsonlint = require('json-lint');

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
      var scheme, scheme_entry, _i, _len, _ref1, _results;
      if (!util.isSequence(schemesProperty)) {
        throw new exports.ValidationError('while validating securitySchemes', null, 'invalid security schemes property, it must be an array', schemesProperty.start_mark);
      }
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

    Validator.prototype.trackRepeatedProperties = function(properties, key, property, section, errorMessage) {
      if (section == null) {
        section = "RAML";
      }
      if (errorMessage == null) {
        errorMessage = "a property with the same name already exists";
      }
      if (key in properties) {
        throw new exports.ValidationError("while validating " + section, null, "" + errorMessage + ": '" + key + "'", property.start_mark);
      }
      return properties[key] = property;
    };

    Validator.prototype.validate_security_scheme = function(scheme) {
      var property, schemeProperties, settings, type, _i, _len, _ref1;
      type = null;
      settings = null;
      schemeProperties = {};
      _ref1 = scheme.value;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        property = _ref1[_i];
        this.trackRepeatedProperties(schemeProperties, property[0].value, property[0], 'while validating security scheme', "property already used in security scheme");
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
        this.trackRepeatedProperties(settingProperties, property[0].value, property[0], 'while validating security scheme', "setting with the same name already exists");
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
        this.trackRepeatedProperties(settingProperties, property[0].value, property[0], 'while validating security scheme', "setting with the same name already exists");
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
        }
        _results.push(this.validateSchema(schema[1]));
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

    Validator.prototype.validate_base_uri_parameters = function() {
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
          this.trackRepeatedProperties(uriParameters, parameterName, uriProperty, 'while validating URI parameters', "URI parameter with the same name already exists");
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
      var type, type_entry, types, _i, _len, _results;
      types = typeProperty.value;
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
      var trait, trait_entry, _i, _len, _results;
      traits = traitProperty.value;
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
      var booleanValues, canonicalPropertyName, childNode, enumValues, parameterProperties, parameterType, propertyName, propertyValue, unusableProperty, valid, validTypes, _i, _j, _k, _len, _len1, _len2, _ref1, _ref2, _ref3, _results;
      parameterProperties = {};
      parameterType = "string";
      _ref1 = node.value;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        childNode = _ref1[_i];
        propertyName = childNode[0].value;
        propertyValue = childNode[1].value;
        this.trackRepeatedProperties(parameterProperties, this.canonicalizePropertyName(childNode[0].value, true), childNode[0], 'while validating parameter properties', "parameter property already used");
        booleanValues = ["true", "false"];
        if (allowParameterKeys) {
          if (this.isParameterKey(childNode) || this.isParameterValue(childNode)) {
            continue;
          }
        }
        canonicalPropertyName = this.canonicalizePropertyName(propertyName, allowParameterKeys);
        valid = true;
        switch (propertyName) {
          case "displayName":
            if (!util.isScalar(childNode[1])) {
              throw new exports.ValidationError('while validating parameter properties', null, 'the value of displayName must be a scalar', childNode[1].start_mark);
            }
            break;
          case "pattern":
            if (!util.isScalar(childNode[1])) {
              throw new exports.ValidationError('while validating parameter properties', null, 'the value of pattern must be a scalar', childNode[1].start_mark);
            }
            break;
          case "default":
            if (!util.isScalar(childNode[1])) {
              throw new exports.ValidationError('while validating parameter properties', null, 'the value of default must be a scalar', childNode[1].start_mark);
            }
            break;
          case "description":
            if (!util.isScalar(childNode[1])) {
              throw new exports.ValidationError('while validating parameter properties', null, 'the value of description must be a scalar', childNode[1].start_mark);
            }
            break;
          case "example":
            if (!util.isScalar(childNode[1])) {
              throw new exports.ValidationError('while validating parameter properties', null, 'the value of example must be a scalar', childNode[1].start_mark);
            }
            break;
          case "minLength":
            if (isNaN(propertyValue)) {
              throw new exports.ValidationError('while validating parameter properties', null, 'the value of minLength must be a number', childNode[1].start_mark);
            }
            break;
          case "maxLength":
            if (isNaN(propertyValue)) {
              throw new exports.ValidationError('while validating parameter properties', null, 'the value of maxLength must be a number', childNode[1].start_mark);
            }
            break;
          case "minimum":
            if (isNaN(propertyValue)) {
              throw new exports.ValidationError('while validating parameter properties', null, 'the value of minimum must be a number', childNode[1].start_mark);
            }
            break;
          case "maximum":
            if (isNaN(propertyValue)) {
              throw new exports.ValidationError('while validating parameter properties', null, 'the value of maximum must be a number', childNode[1].start_mark);
            }
            break;
          case "type":
            parameterType = propertyValue;
            validTypes = ['string', 'number', 'integer', 'date', 'boolean', 'file'];
            if (__indexOf.call(validTypes, propertyValue) < 0) {
              throw new exports.ValidationError('while validating parameter properties', null, 'type can be either of: string, number, integer, file, date or boolean ', childNode[1].start_mark);
            }
            break;
          case "required":
            if (__indexOf.call(booleanValues, propertyValue) < 0) {
              throw new exports.ValidationError('while validating parameter properties', null, 'required can be any either true or false', childNode[1].start_mark);
            }
            break;
          case "repeat":
            if (__indexOf.call(booleanValues, propertyValue) < 0) {
              throw new exports.ValidationError('while validating parameter properties', null, 'repeat can be any either true or false', childNode[1].start_mark);
            }
            break;
          default:
            valid = false;
        }
        switch (canonicalPropertyName) {
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
            }
            break;
          default:
            if (!valid) {
              throw new exports.ValidationError('while validating parameter properties', null, "unknown property " + propertyName, childNode[0].start_mark);
            }
        }
      }
      if (parameterType !== "string") {
        _ref2 = ['enum', 'pattern', 'minLength', 'maxLength'];
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          unusableProperty = _ref2[_j];
          if (unusableProperty in parameterProperties) {
            throw new exports.ValidationError('while validating parameter properties', null, "property " + unusableProperty + " can only be used if type is 'string'", parameterProperties[unusableProperty].start_mark);
          }
        }
      }
      if (!(parameterType === "number" || parameterType === "integer")) {
        _ref3 = ['minimum', 'maximum'];
        _results = [];
        for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
          unusableProperty = _ref3[_k];
          if (unusableProperty in parameterProperties) {
            throw new exports.ValidationError('while validating parameter properties', null, "property " + unusableProperty + " can only be used if type is 'number' or 'integer'", parameterProperties[unusableProperty].start_mark);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    Validator.prototype.get_list_values = function(node) {
      var _this = this;
      return node.map(function(item) {
        return item.value;
      });
    };

    Validator.prototype.validate_root_properties = function(node) {
      var checkVersion, property, rootProperties, _i, _len, _ref1;
      checkVersion = false;
      rootProperties = {};
      if (node != null ? node.value : void 0) {
        _ref1 = node.value;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          property = _ref1[_i];
          if (property[0].value.match(/^\//)) {
            this.trackRepeatedProperties(rootProperties, this.canonicalizePropertyName(property[0].value, true), property[0], 'while validating root properties', "resource already declared");
          } else {
            this.trackRepeatedProperties(rootProperties, property[0].value, property[0], 'while validating root properties', 'root property already used');
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
              this.baseUri = property[1].value;
              checkVersion = this.validate_base_uri(property[1]);
              break;
            case 'securitySchemes':
              this.validate_security_schemes(property[1]);
              break;
            case 'schemas':
              this.validate_root_schemas(property[1]);
              break;
            case 'version':
              if (!util.isScalar(property[1])) {
                throw new exports.ValidationError('while validating root properties', null, 'version must be a string', property[0].start_mark);
              }
              if (!util.isNull(property[1])) {
                property[1].tag = 'tag:yaml.org,2002:str';
              }
              break;
            case 'traits':
              this.validate_traits(property[1]);
              break;
            case 'documentation':
              if (!util.isSequence(property[1])) {
                throw new exports.ValidationError('while validating root properties', null, 'documentation must be an array', property[0].start_mark);
              }
              this.validate_documentation(property[1]);
              break;
            case 'mediaType':
              if (!util.isString(property[1])) {
                throw new exports.ValidationError('while validating root properties', null, 'mediaType must be a scalar', property[0].start_mark);
              }
              break;
            case 'baseUriParameters':
              this.baseUriParameters = property[1];
              util.isNoop(property[1]);
              break;
            case 'resourceTypes':
              this.validate_types(property[1]);
              break;
            case 'securedBy':
              this.validate_secured_by(property);
              break;
            case 'protocols':
              this.validate_protocols_property(property);
              break;
            default:
              if (property[0].value.match(/^\//)) {
                this.validate_resource(property);
              } else {
                throw new exports.ValidationError('while validating root properties', null, "unknown property " + property[0].value, property[0].start_mark);
              }
          }
        }
      }
      if (!('title' in rootProperties)) {
        throw new exports.ValidationError('while validating root properties', null, 'missing title', node.start_mark);
      }
      if (checkVersion && !('version' in rootProperties)) {
        throw new exports.ValidationError('while validating version', null, 'missing version', node.start_mark);
      }
    };

    Validator.prototype.validate_documentation = function(documentation_property) {
      var docSection, _i, _len, _ref1, _results;
      if (!documentation_property.value.length) {
        throw new exports.ValidationError('while validating documentation section', null, 'there must be at least one document in the documentation section', documentation_property.start_mark);
      }
      _ref1 = documentation_property.value;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        docSection = _ref1[_i];
        _results.push(this.validate_doc_section(docSection));
      }
      return _results;
    };

    Validator.prototype.validate_doc_section = function(docSection) {
      var docProperties, property, _i, _len, _ref1;
      if (!util.isMapping(docSection)) {
        throw new exports.ValidationError('while validating documentation section', null, 'each documentation section must be a map', docSection.start_mark);
      }
      docProperties = {};
      _ref1 = docSection.value;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        property = _ref1[_i];
        this.trackRepeatedProperties(docProperties, property[0].value, property[0], 'while validating documentation section', "property already used");
        switch (property[0].value) {
          case "title":
            if (!(util.isScalar(property[1]) && !util.isNull(property[1]))) {
              throw new exports.ValidationError('while validating documentation section', null, 'title must be a string', property[0].start_mark);
            }
            break;
          case "content":
            if (!(util.isScalar(property[1]) && !util.isNull(property[1]))) {
              throw new exports.ValidationError('while validating documentation section', null, 'content must be a string', property[0].start_mark);
            }
            break;
          default:
            throw new exports.ValidationError('while validating root properties', null, 'unknown property ' + property[0].value, property[0].start_mark);
        }
      }
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
      var canonicalKey, err, key, property, resourceProperties, template, valid, _i, _len, _ref1, _ref2, _results;
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
        _ref2 = resource[1].value;
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          property = _ref2[_i];
          if (property[0].value.match(/^\//)) {
            this.trackRepeatedProperties(resourceProperties, this.canonicalizePropertyName(property[0].value, true), property[0], 'while validating resource', "resource already declared");
          } else if (this.isHttpMethod(property[0].value, allowParameterKeys)) {
            this.trackRepeatedProperties(resourceProperties, this.canonicalizePropertyName(property[0].value, true), property[0], 'while validating resource', "method already declared");
          } else {
            this.trackRepeatedProperties(resourceProperties, this.canonicalizePropertyName(property[0].value, true), property[0], 'while validating resource', "property already used");
          }
          if (!this.validate_common_properties(property, allowParameterKeys)) {
            if (property[0].value.match(/^\//)) {
              if (allowParameterKeys) {
                throw new exports.ValidationError('while validating trait properties', null, 'resource type cannot define child resources', property[0].start_mark);
              }
              _results.push(this.validate_resource(property, allowParameterKeys));
            } else if (this.isHttpMethod(property[0].value, allowParameterKeys)) {
              _results.push(this.validate_method(property, allowParameterKeys, 'method'));
            } else {
              key = property[0].value;
              canonicalKey = this.canonicalizePropertyName(key, allowParameterKeys);
              valid = true;
              switch (canonicalKey) {
                case "uriParameters":
                  if (!util.isNullableMapping(property[1])) {
                    throw new exports.ValidationError('while validating uri parameters', null, 'uri parameters must be a map', property[0].start_mark);
                  }
                  this.validate_uri_parameters(resource[0].value, property[1], allowParameterKeys, allowParameterKeys);
                  break;
                case "baseUriParameters":
                  if (!this.baseUri) {
                    throw new exports.ValidationError('while validating uri parameters', null, 'base uri parameters defined when there is no baseUri', property[0].start_mark);
                  }
                  if (!util.isNullableMapping(property[1])) {
                    throw new exports.ValidationError('while validating uri parameters', null, 'base uri parameters must be a map', property[0].start_mark);
                  }
                  this.validate_uri_parameters(this.baseUri, property[1], allowParameterKeys);
                  break;
                default:
                  valid = false;
              }
              switch (key) {
                case "type":
                  _results.push(this.validate_type_property(property, allowParameterKeys));
                  break;
                case "usage":
                  if (!allowParameterKeys) {
                    throw new exports.ValidationError('while validating resources', null, "property: '" + property[0].value + "' is invalid in a resource", property[0].start_mark);
                  } else {
                    _results.push(void 0);
                  }
                  break;
                case "securedBy":
                  _results.push(this.validate_secured_by(property));
                  break;
                default:
                  if (!valid) {
                    throw new exports.ValidationError('while validating resources', null, "property: '" + property[0].value + ("' is invalid in a " + context), property[0].start_mark);
                  } else {
                    _results.push(void 0);
                  }
              }
            }
          } else {
            _results.push(void 0);
          }
        }
        return _results;
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

    Validator.prototype.validate_type_property = function(property) {
      var parameter, typeName, _i, _len, _ref1, _results;
      if (!(util.isMapping(property[1]) || util.isString(property[1]))) {
        throw new exports.ValidationError('while validating resource types', null, "property 'type' must be a string or a map", property[0].start_mark);
      }
      if (util.isMapping(property[1])) {
        if (property[1].value.length > 1) {
          throw new exports.ValidationError('while validating resource types', null, 'a resource or resourceType can inherit from a single resourceType', property[0].start_mark);
        }
      }
      typeName = this.key_or_value(property[1]);
      if (!(typeName != null ? typeName.trim() : void 0)) {
        throw new exports.ValidationError('while validating resource type consumption', null, 'resource type name must be provided', property[1].start_mark);
      }
      if (!(this.isParameterKeyValue(typeName) || this.get_type(typeName))) {
        throw new exports.ValidationError('while validating resource type consumption', null, "there is no resource type named " + typeName, property[1].start_mark);
      }
      if (util.isMapping(property[1])) {
        _ref1 = property[1].value;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          parameter = _ref1[_i];
          if (!(util.isNull(parameter[1]) || util.isMapping(parameter[1]))) {
            throw new exports.ValidationError('while validating resource consumption', null, 'resource type parameters must be in a map', parameter[1].start_mark);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
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
        this.trackRepeatedProperties(methodProperties, this.canonicalizePropertyName(property[0].value, true), property[0], 'while validating method', "property already used");
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
          case 'baseUriParameters':
            if (!this.baseUri) {
              throw new exports.ValidationError('while validating uri parameters', null, 'base uri parameters defined when there is no baseUri', property[0].start_mark);
            }
            if (!util.isNullableMapping(property[1])) {
              throw new exports.ValidationError('while validating uri parameters', null, 'base uri parameters must be a map', property[0].start_mark);
            }
            this.validate_uri_parameters(this.baseUri, property[1], allowParameterKeys);
            break;
          case 'protocols':
            this.validate_protocols_property(property);
            break;
          default:
            valid = false;
        }
        switch (key) {
          case 'securedBy':
            _results.push(this.validate_secured_by(property));
            break;
          case 'usage':
            if (!(allowParameterKeys && context === 'trait')) {
              throw new exports.ValidationError('while validating resources', null, "property: 'usage' is invalid in a " + context, property[0].start_mark);
            } else {
              _results.push(void 0);
            }
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
        this.trackRepeatedProperties(responseValues, this.canonicalizePropertyName(response[0].value, true), response[0], 'while validating responses', "response code already used");
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
        this.trackRepeatedProperties(queryParameters, this.canonicalizePropertyName(param[0].value, true), param[0], 'while validating query parameter', "parameter name already used");
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
        this.trackRepeatedProperties(formParameters, this.canonicalizePropertyName(param[0].value, true), param[0], 'while validating form parameter', "parameter name already used");
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
        this.trackRepeatedProperties(headerNames, this.canonicalizePropertyName(param[0].value, true), param[0], 'while validating headers', "header name already used");
        _results.push(this.valid_common_parameter_properties(param[1], allowParameterKeys));
      }
      return _results;
    };

    Validator.prototype.validate_response = function(response, allowParameterKeys) {
      var canonicalKey, property, responseCode, responseProperties, valid, _i, _j, _len, _len1, _ref1, _ref2, _results;
      if (util.isSequence(response[0])) {
        if (!response[0].value.length) {
          throw new exports.ValidationError('while validating responses', null, 'there must be at least one response code', response[0].start_mark);
        }
        _ref1 = response[0].value;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          responseCode = _ref1[_i];
          if (!(this.isParameterKey(responseCode) || util.isInteger(responseCode) || !isNaN(this.canonicalizePropertyName(responseCode, allowParameterKeys)))) {
            throw new exports.ValidationError('while validating responses', null, "each response key must be an integer", responseCode.start_mark);
          }
        }
      } else if (!(this.isParameterKey(response) || util.isInteger(response[0]) || !isNaN(this.canonicalizePropertyName(response[0].value, allowParameterKeys)))) {
        throw new exports.ValidationError('while validating responses', null, "each response key must be an integer", response[0].start_mark);
      }
      if (!util.isNullableMapping(response[1])) {
        throw new exports.ValidationError('while validating responses', null, "each response property must be a map", response[0].start_mark);
      }
      if (util.isMapping(response[1])) {
        responseProperties = {};
        _ref2 = response[1].value;
        _results = [];
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          property = _ref2[_j];
          canonicalKey = this.canonicalizePropertyName(property[0].value, allowParameterKeys);
          this.trackRepeatedProperties(responseProperties, canonicalKey, property[0], 'while validating responses', "property already used");
          valid = true;
          if (!this.isParameterKey(property)) {
            switch (property[0].value) {
              case "description":
                if (!util.isScalar(property[1])) {
                  throw new exports.ValidationError('while validating responses', null, 'property description must be a string', response[0].start_mark);
                }
                break;
              default:
                valid = false;
            }
            switch (canonicalKey) {
              case "body":
                _results.push(this.validate_body(property, allowParameterKeys, null, true));
                break;
              case "headers":
                if (!util.isNullableMapping(property[1])) {
                  throw new exports.ValidationError('while validating resources', null, "property 'headers' must be a map", property[0].start_mark);
                }
                _results.push(this.validate_headers(property));
                break;
              default:
                if (!valid) {
                  throw new exports.ValidationError('while validating response', null, "property: '" + property[0].value + "' is invalid in a response", property[0].start_mark);
                } else {
                  _results.push(void 0);
                }
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
        return (_ref1 = value.toLowerCase()) === 'options' || _ref1 === 'get' || _ref1 === 'head' || _ref1 === 'post' || _ref1 === 'put' || _ref1 === 'delete' || _ref1 === 'trace' || _ref1 === 'connect' || _ref1 === 'patch';
      }
      return false;
    };

    Validator.prototype.isParameterValue = function(property) {
      return this.isParameterKey(property, false);
    };

    Validator.prototype.isParameterKey = function(property, checkKey) {
      var offset;
      if (checkKey == null) {
        checkKey = true;
      }
      offset = checkKey ? 0 : 1;
      if (!(checkKey || util.isScalar(property[1]))) {
        return false;
      }
      if (this.isParameterKeyValue(property[offset].value)) {
        return true;
      } else if (property[offset].value.match(/<<\s*([^\|\s>]+)\s*\|.*\s*>>/g)) {
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
      var bodyProperties, bodyProperty, canonicalProperty, implicitMode, key, start_mark, valid, _i, _len, _ref1;
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
        this.trackRepeatedProperties(bodyProperties, this.canonicalizePropertyName(bodyProperty[0].value, true), bodyProperty[0], 'while validating body', "property already used");
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
          valid = true;
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
            default:
              valid = false;
          }
          switch (key) {
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
              this.validateSchema(bodyProperty[1]);
              break;
            default:
              if (!valid) {
                throw new exports.ValidationError('while validating body', null, "property: '" + bodyProperty[0].value + "' is invalid in a body", bodyProperty[0].start_mark);
              }
          }
        }
      }
      if ("formParameters" in bodyProperties) {
        start_mark = bodyProperties.formParameters.start_mark;
        if (isResponseBody) {
          throw new exports.ValidationError('while validating body', null, "formParameters cannot be used to describe response bodies", start_mark);
        }
        if ("schema" in bodyProperties || "example" in bodyProperties) {
          throw new exports.ValidationError('while validating body', null, "formParameters cannot be used together with the example or schema properties", start_mark);
        }
      }
      if (bodyMode === "implicit") {
        if (!this.get_media_type()) {
          throw new exports.ValidationError('while validating body', null, "body tries to use default Media Type, but mediaType is null", property[0].start_mark);
        }
      }
    };

    Validator.prototype.validateSchema = function(property) {
      var error, lint, mark, schema;
      if (this.isXmlSchema(property.value)) {
        return void 0;
      } else if (this.isJsonSchema(property.value)) {
        lint = jsonlint(property.value);
        if (lint.error) {
          mark = this.create_mark(property.start_mark.line + lint.line, 0);
          if (property.end_mark.line === mark.line && property.end_mark.column === 0) {
            mark.line--;
          }
          throw new exports.ValidationError('while validating body', null, "schema is not valid JSON error: '" + lint.error + "'", mark);
        }
        try {
          return schema = JSON.parse(property.value);
        } catch (_error) {
          error = _error;
          throw new exports.ValidationError('while validating body', null, "schema is not valid JSON error: '" + error + "'", property.start_mark);
        }
      }
    };

    Validator.prototype.isJsonSchema = function(string) {
      return string != null ? string.match(/^\s*\{/) : void 0;
    };

    Validator.prototype.isXmlSchema = function(string) {
      return string != null ? string.match(/^\s*(<\?xml[^>]+>)?[\s\n]*<xs:schema/) : void 0;
    };

    Validator.prototype.validate_common_properties = function(property, allowParameterKeys, context) {
      var use, _i, _len, _ref1;
      if (this.isParameterKey(property)) {
        if (!allowParameterKeys) {
          throw new exports.ValidationError('while validating resources', null, "property '" + property[0].value + "' is invalid in a resource", property[0].start_mark);
        }
        return true;
      } else {
        switch (property[0].value) {
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
          case "is":
            if (!util.isSequence(property[1])) {
              throw new exports.ValidationError('while validating resources', null, "property 'is' must be an array", property[0].start_mark);
            }
            _ref1 = property[1].value;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              use = _ref1[_i];
              this.validate_trait_use(use);
            }
            return true;
        }
      }
      return false;
    };

    Validator.prototype.validate_trait_use = function(node) {
      var parameter, traitName, traitValue, _i, _len, _ref1, _results;
      if (!(util.isScalar(node) || util.isMapping(node))) {
        throw new exports.ValidationError('while validating trait consumption', null, 'trait must be a string or a map', node.start_mark);
      }
      traitName = this.key_or_value(node);
      if (!(traitName != null ? traitName.trim() : void 0)) {
        throw new exports.ValidationError('while validating trait consumption', null, 'trait name must be provided', node.start_mark);
      }
      if (!(this.isParameterKeyValue(traitName) || this.get_trait(traitName))) {
        throw new exports.ValidationError('while validating trait consumption', null, "there is no trait named " + traitName, node.start_mark);
      }
      if (util.isScalar(node)) {
        return;
      }
      traitValue = node.value[0][1];
      if (!(util.isNull(traitValue) || util.isMapping(traitValue))) {
        throw new exports.ValidationError('while validating trait consumption', null, 'trait must be a map', traitValue.start_mark);
      }
      if (util.isNull(traitValue)) {
        return;
      }
      _ref1 = traitValue.value;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        parameter = _ref1[_i];
        if (!util.isScalar(parameter[1])) {
          throw new exports.ValidationError('while validating trait consumption', null, 'parameter value must be a scalar', parameter[1].start_mark);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
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
          return childNode[0].value && typeof childNode[0].value !== "object" && childNode[0].value === property;
        });
      }
      return false;
    };

    Validator.prototype.property_value = function(node, property) {
      var filteredNodes;
      filteredNodes = node.value.filter(function(childNode) {
        return typeof childNode[0].value !== "object" && childNode[0].value === property;
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
          return util.isString(childNode[0]) && childNode[0].value === property;
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
      var prop, properties, _i, _len, _ref1;
      properties = [];
      if (node && util.isMapping(node)) {
        _ref1 = node.value;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          prop = _ref1[_i];
          if (util.isString(prop[0]) && prop[0].value === property) {
            properties.push(prop);
          } else {
            properties = properties.concat(this.get_properties(prop[1], property));
          }
        }
      }
      return properties;
    };

    Validator.prototype.valid_absolute_uris = function(node) {
      var repeatedUri, uris;
      uris = this.get_absolute_uris(node);
      if (repeatedUri = this.hasDuplicatesUris(uris)) {
        throw new exports.ValidationError('while validating trait consumption', null, "two resources share same URI " + repeatedUri.uri, repeatedUri.mark);
      }
    };

    Validator.prototype.get_absolute_uris = function(node, parentPath) {
      var childResource, child_resources, response, uri, _i, _len;
      response = [];
      if (!util.isNullableMapping(node)) {
        throw new exports.ValidationError('while validating resources', null, 'resource is not a map', node.start_mark);
      }
      child_resources = this.child_resources(node);
      for (_i = 0, _len = child_resources.length; _i < _len; _i++) {
        childResource = child_resources[_i];
        if (parentPath != null) {
          uri = parentPath + childResource[0].value;
        } else {
          uri = childResource[0].value;
        }
        response.push({
          uri: uri,
          mark: childResource[0].start_mark
        });
        response = response.concat(this.get_absolute_uris(childResource[1], uri));
      }
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
      var baseUri, err, expressions, protocol, template, _ref1, _ref2;
      baseUri = (_ref1 = baseUriNode.value) != null ? _ref1.trim() : void 0;
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
        throw new exports.ValidationError('while validating baseUri', null, err != null ? (_ref2 = err.options) != null ? _ref2.message : void 0 : void 0, baseUriNode.start_mark);
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

},{"./errors":3,"./nodes":7,"./traits":18,"./util":20,"json-lint":50,"uritemplate":52,"url":46}],22:[function(require,module,exports){

},{}],23:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        throw TypeError('Uncaught, unspecified "error" event.');
      }
      return false;
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
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
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
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

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],24:[function(require,module,exports){
var http = module.exports;
var EventEmitter = require('events').EventEmitter;
var Request = require('./lib/request');
var url = require('url')

http.request = function (params, cb) {
    if (typeof params === 'string') {
        params = url.parse(params)
    }
    if (!params) params = {};
    if (!params.host && !params.port) {
        params.port = parseInt(window.location.port, 10);
    }
    if (!params.host && params.hostname) {
        params.host = params.hostname;
    }
    
    if (!params.scheme) params.scheme = window.location.protocol.split(':')[0];
    if (!params.host) {
        params.host = window.location.hostname || window.location.host;
    }
    if (/:/.test(params.host)) {
        if (!params.port) {
            params.port = params.host.split(':')[1];
        }
        params.host = params.host.split(':')[0];
    }
    if (!params.port) params.port = params.scheme == 'https' ? 443 : 80;
    
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

},{"./lib/request":25,"events":23,"url":46}],25:[function(require,module,exports){
var Stream = require('stream');
var Response = require('./response');
var Base64 = require('Base64');
var inherits = require('inherits');

var Request = module.exports = function (xhr, params) {
    var self = this;
    self.writable = true;
    self.xhr = xhr;
    self.body = [];
    
    self.uri = (params.scheme || 'http') + '://'
        + params.host
        + (params.port ? ':' + params.port : '')
        + (params.path || '/')
    ;
    
    try { xhr.withCredentials = true }
    catch (e) {}
    
    xhr.open(
        params.method || 'GET',
        self.uri,
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

inherits(Request, Stream);

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
    this.body.push(s);
};

Request.prototype.destroy = function (s) {
    this.xhr.abort();
    this.emit('close');
};

Request.prototype.end = function (s) {
    if (s !== undefined) this.body.push(s);
    if (this.body.length === 0) {
        this.xhr.send('');
    }
    else if (typeof this.body[0] === 'string') {
        this.xhr.send(this.body.join(''));
    }
    else if (isArray(this.body[0])) {
        var body = [];
        for (var i = 0; i < this.body.length; i++) {
            body.push.apply(body, this.body[i]);
        }
        this.xhr.send(body);
    }
    else if (/Array/.test(Object.prototype.toString.call(this.body[0]))) {
        var len = 0;
        for (var i = 0; i < this.body.length; i++) {
            len += this.body[i].length;
        }
        var body = new(this.body[0].constructor)(len);
        var k = 0;
        
        for (var i = 0; i < this.body.length; i++) {
            var b = this.body[i];
            for (var j = 0; j < b.length; j++) {
                body[k++] = b[j];
            }
        }
        this.xhr.send(body);
    }
    else {
        var body = '';
        for (var i = 0; i < this.body.length; i++) {
            body += this.body[i].toString();
        }
        this.xhr.send(body);
    }
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

},{"./response":26,"Base64":27,"inherits":29,"stream":39}],26:[function(require,module,exports){
var Stream = require('stream');
var util = require('util');

var Response = module.exports = function (res) {
    this.offset = 0;
    this.readable = true;
};

util.inherits(Response, Stream);

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

},{"stream":39,"util":48}],27:[function(require,module,exports){
;(function () {

  var object = typeof exports != 'undefined' ? exports : this; // #8: web workers
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  function InvalidCharacterError(message) {
    this.message = message;
  }
  InvalidCharacterError.prototype = new Error;
  InvalidCharacterError.prototype.name = 'InvalidCharacterError';

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
      if (charCode > 0xFF) {
        throw new InvalidCharacterError("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
      }
      block = block << 8 | charCode;
    }
    return output;
  });

  // decoder
  // [https://gist.github.com/1020396] by [https://github.com/atk]
  object.atob || (
  object.atob = function (input) {
    input = input.replace(/=+$/, '')
    if (input.length % 4 == 1) {
      throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
    }
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

},{}],28:[function(require,module,exports){
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

},{"http":24}],29:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],30:[function(require,module,exports){
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
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
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

},{}],31:[function(require,module,exports){
var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
   // Detect if browser supports Typed Arrays. Supported browsers are IE 10+,
   // Firefox 4+, Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+.
   if (typeof Uint8Array === 'undefined' || typeof ArrayBuffer === 'undefined')
      return false

  // Does the browser support adding properties to `Uint8Array` instances? If
  // not, then that's the same as no `Uint8Array` support. We need to be able to
  // add all the node Buffer API methods.
  // Relevant Firefox bug: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var arr = new Uint8Array(0)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // Assume object is an array
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof Uint8Array === 'function' &&
      subject instanceof Uint8Array) {
    // Speed optimization -- use set if we're copying from a Uint8Array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  switch (encoding) {
    case 'hex':
      return _hexWrite(this, string, offset, length)
    case 'utf8':
    case 'utf-8':
    case 'ucs2': // TODO: No support for ucs2 or utf16le encodings yet
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return _utf8Write(this, string, offset, length)
    case 'ascii':
      return _asciiWrite(this, string, offset, length)
    case 'binary':
      return _binaryWrite(this, string, offset, length)
    case 'base64':
      return _base64Write(this, string, offset, length)
    default:
      throw new Error('Unknown encoding')
  }
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  switch (encoding) {
    case 'hex':
      return _hexSlice(self, start, end)
    case 'utf8':
    case 'utf-8':
    case 'ucs2': // TODO: No support for ucs2 or utf16le encodings yet
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return _utf8Slice(self, start, end)
    case 'ascii':
      return _asciiSlice(self, start, end)
    case 'binary':
      return _binarySlice(self, start, end)
    case 'base64':
      return _base64Slice(self, start, end)
    default:
      throw new Error('Unknown encoding')
  }
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  // copy!
  for (var i = 0; i < end - start; i++)
    target[i + target_start] = this[i + start]
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

// http://nodejs.org/api/buffer.html#buffer_buf_slice_start_end
Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array === 'function') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment the Uint8Array *instance* (not the class!) with Buffer methods
 */
function augment (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value == 'number', 'cannot write a non-number as a number')
  assert(value >= 0,
      'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint(value, max, min) {
  assert(typeof value == 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754(value, max, min) {
  assert(typeof value == 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

},{"base64-js":32,"ieee754":33}],32:[function(require,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var ZERO   = '0'.charCodeAt(0)
	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS)
			return 62 // '+'
		if (code === SLASH)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	module.exports.toByteArray = b64ToByteArray
	module.exports.fromByteArray = uint8ToBase64
}())

},{}],33:[function(require,module,exports){
exports.read = function(buffer, offset, isLE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isLE ? (nBytes - 1) : 0,
      d = isLE ? -1 : 1,
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

exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isLE ? 0 : (nBytes - 1),
      d = isLE ? 1 : -1,
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

},{}],34:[function(require,module,exports){
(function (global){
/*! http://mths.be/punycode v1.2.4 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports;
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^ -~]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /\x2E|\u3002|\uFF0E|\uFF61/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		while (length--) {
			array[length] = fn(array[length]);
		}
		return array;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings.
	 * @private
	 * @param {String} domain The domain name.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		return map(string.split(regexSeparators), fn).join('.');
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <http://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * http://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols to a Punycode string of ASCII-only
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name to Unicode. Only the
	 * Punycoded parts of the domain name will be converted, i.e. it doesn't
	 * matter if you call it on a string that has already been converted to
	 * Unicode.
	 * @memberOf punycode
	 * @param {String} domain The Punycode domain name to convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(domain) {
		return mapDomain(domain, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name to Punycode. Only the
	 * non-ASCII parts of the domain name will be converted, i.e. it doesn't
	 * matter if you call it with a domain that's already in ASCII.
	 * @memberOf punycode
	 * @param {String} domain The domain name to convert, as a Unicode string.
	 * @returns {String} The Punycode representation of the given domain name.
	 */
	function toASCII(domain) {
		return mapDomain(domain, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.2.4',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <http://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else { // in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],35:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],36:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return obj[k].map(function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],37:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":35,"./encode":36}],38:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

module.exports = Duplex;
var inherits = require('inherits');
var setImmediate = require('process/browser.js').nextTick;
var Readable = require('./readable.js');
var Writable = require('./writable.js');

inherits(Duplex, Readable);

Duplex.prototype.write = Writable.prototype.write;
Duplex.prototype.end = Writable.prototype.end;
Duplex.prototype._write = Writable.prototype._write;

function Duplex(options) {
  if (!(this instanceof Duplex))
    return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false)
    this.readable = false;

  if (options && options.writable === false)
    this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false)
    this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended)
    return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  var self = this;
  setImmediate(function () {
    self.end();
  });
}

},{"./readable.js":42,"./writable.js":44,"inherits":29,"process/browser.js":40}],39:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Stream;

var EE = require('events').EventEmitter;
var inherits = require('inherits');

inherits(Stream, EE);
Stream.Readable = require('./readable.js');
Stream.Writable = require('./writable.js');
Stream.Duplex = require('./duplex.js');
Stream.Transform = require('./transform.js');
Stream.PassThrough = require('./passthrough.js');

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

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
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
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

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

},{"./duplex.js":38,"./passthrough.js":41,"./readable.js":42,"./transform.js":43,"./writable.js":44,"events":23,"inherits":29}],40:[function(require,module,exports){
module.exports=require(30)
},{}],41:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

module.exports = PassThrough;

var Transform = require('./transform.js');
var inherits = require('inherits');
inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough))
    return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function(chunk, encoding, cb) {
  cb(null, chunk);
};

},{"./transform.js":43,"inherits":29}],42:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Readable;
Readable.ReadableState = ReadableState;

var EE = require('events').EventEmitter;
var Stream = require('./index.js');
var Buffer = require('buffer').Buffer;
var setImmediate = require('process/browser.js').nextTick;
var StringDecoder;

var inherits = require('inherits');
inherits(Readable, Stream);

function ReadableState(options, stream) {
  options = options || {};

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : 16 * 1024;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.buffer = [];
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = false;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // In streams that never have any data, and do push(null) right away,
  // the consumer can miss the 'end' event if they do some I/O before
  // consuming the stream.  So, we don't emit('end') until some reading
  // happens.
  this.calledRead = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, becuase any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;


  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // when piping, we only care about 'readable' events that happen
  // after read()ing all the bytes and not getting any pushback.
  this.ranOut = false;

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder)
      StringDecoder = require('string_decoder').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  if (!(this instanceof Readable))
    return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  Stream.call(this);
}

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function(chunk, encoding) {
  var state = this._readableState;

  if (typeof chunk === 'string' && !state.objectMode) {
    encoding = encoding || state.defaultEncoding;
    if (encoding !== state.encoding) {
      chunk = new Buffer(chunk, encoding);
      encoding = '';
    }
  }

  return readableAddChunk(this, state, chunk, encoding, false);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function(chunk) {
  var state = this._readableState;
  return readableAddChunk(this, state, chunk, '', true);
};

function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er) {
    stream.emit('error', er);
  } else if (chunk === null || chunk === undefined) {
    state.reading = false;
    if (!state.ended)
      onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (state.ended && !addToFront) {
      var e = new Error('stream.push() after EOF');
      stream.emit('error', e);
    } else if (state.endEmitted && addToFront) {
      var e = new Error('stream.unshift() after end event');
      stream.emit('error', e);
    } else {
      if (state.decoder && !addToFront && !encoding)
        chunk = state.decoder.write(chunk);

      // update the buffer info.
      state.length += state.objectMode ? 1 : chunk.length;
      if (addToFront) {
        state.buffer.unshift(chunk);
      } else {
        state.reading = false;
        state.buffer.push(chunk);
      }

      if (state.needReadable)
        emitReadable(stream);

      maybeReadMore(stream, state);
    }
  } else if (!addToFront) {
    state.reading = false;
  }

  return needMoreData(state);
}



// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended &&
         (state.needReadable ||
          state.length < state.highWaterMark ||
          state.length === 0);
}

// backwards compatibility.
Readable.prototype.setEncoding = function(enc) {
  if (!StringDecoder)
    StringDecoder = require('string_decoder').StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
};

// Don't raise the hwm > 128MB
var MAX_HWM = 0x800000;
function roundUpToNextPowerOf2(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2
    n--;
    for (var p = 1; p < 32; p <<= 1) n |= n >> p;
    n++;
  }
  return n;
}

function howMuchToRead(n, state) {
  if (state.length === 0 && state.ended)
    return 0;

  if (state.objectMode)
    return n === 0 ? 0 : 1;

  if (isNaN(n) || n === null) {
    // only flow one buffer at a time
    if (state.flowing && state.buffer.length)
      return state.buffer[0].length;
    else
      return state.length;
  }

  if (n <= 0)
    return 0;

  // If we're asking for more than the target buffer level,
  // then raise the water mark.  Bump up to the next highest
  // power of 2, to prevent increasing it excessively in tiny
  // amounts.
  if (n > state.highWaterMark)
    state.highWaterMark = roundUpToNextPowerOf2(n);

  // don't have that much.  return null, unless we've ended.
  if (n > state.length) {
    if (!state.ended) {
      state.needReadable = true;
      return 0;
    } else
      return state.length;
  }

  return n;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function(n) {
  var state = this._readableState;
  state.calledRead = true;
  var nOrig = n;

  if (typeof n !== 'number' || n > 0)
    state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 &&
      state.needReadable &&
      (state.length >= state.highWaterMark || state.ended)) {
    emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0)
      endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;

  // if we currently have less than the highWaterMark, then also read some
  if (state.length - n <= state.highWaterMark)
    doRead = true;

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading)
    doRead = false;

  if (doRead) {
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0)
      state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
  }

  // If _read called its callback synchronously, then `reading`
  // will be false, and we need to re-evaluate how much data we
  // can return to the user.
  if (doRead && !state.reading)
    n = howMuchToRead(nOrig, state);

  var ret;
  if (n > 0)
    ret = fromList(n, state);
  else
    ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  }

  state.length -= n;

  // If we have nothing in the buffer, then we want to know
  // as soon as we *do* get something into the buffer.
  if (state.length === 0 && !state.ended)
    state.needReadable = true;

  // If we happened to read() exactly the remaining amount in the
  // buffer, and the EOF has been seen at this point, then make sure
  // that we emit 'end' on the very next tick.
  if (state.ended && !state.endEmitted && state.length === 0)
    endReadable(this);

  return ret;
};

function chunkInvalid(state, chunk) {
  var er = null;
  if (!Buffer.isBuffer(chunk) &&
      'string' !== typeof chunk &&
      chunk !== null &&
      chunk !== undefined &&
      !state.objectMode &&
      !er) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}


function onEofChunk(stream, state) {
  if (state.decoder && !state.ended) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // if we've ended and we have some data left, then emit
  // 'readable' now to make sure it gets picked up.
  if (state.length > 0)
    emitReadable(stream);
  else
    endReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (state.emittedReadable)
    return;

  state.emittedReadable = true;
  if (state.sync)
    setImmediate(function() {
      emitReadable_(stream);
    });
  else
    emitReadable_(stream);
}

function emitReadable_(stream) {
  stream.emit('readable');
}


// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    setImmediate(function() {
      maybeReadMore_(stream, state);
    });
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended &&
         state.length < state.highWaterMark) {
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;
    else
      len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function(n) {
  this.emit('error', new Error('not implemented'));
};

Readable.prototype.pipe = function(dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;

  var doEnd = (!pipeOpts || pipeOpts.end !== false) &&
              dest !== process.stdout &&
              dest !== process.stderr;

  var endFn = doEnd ? onend : cleanup;
  if (state.endEmitted)
    setImmediate(endFn);
  else
    src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable) {
    if (readable !== src) return;
    cleanup();
  }

  function onend() {
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  function cleanup() {
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', cleanup);

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (!dest._writableState || dest._writableState.needDrain)
      ondrain();
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  // check for listeners before emit removes one-time listeners.
  var errListeners = EE.listenerCount(dest, 'error');
  function onerror(er) {
    unpipe();
    if (errListeners === 0 && EE.listenerCount(dest, 'error') === 0)
      dest.emit('error', er);
  }
  dest.once('error', onerror);

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    // the handler that waits for readable events after all
    // the data gets sucked out in flow.
    // This would be easier to follow with a .once() handler
    // in flow(), but that is too slow.
    this.on('readable', pipeOnReadable);

    state.flowing = true;
    setImmediate(function() {
      flow(src);
    });
  }

  return dest;
};

function pipeOnDrain(src) {
  return function() {
    var dest = this;
    var state = src._readableState;
    state.awaitDrain--;
    if (state.awaitDrain === 0)
      flow(src);
  };
}

function flow(src) {
  var state = src._readableState;
  var chunk;
  state.awaitDrain = 0;

  function write(dest, i, list) {
    var written = dest.write(chunk);
    if (false === written) {
      state.awaitDrain++;
    }
  }

  while (state.pipesCount && null !== (chunk = src.read())) {

    if (state.pipesCount === 1)
      write(state.pipes, 0, null);
    else
      forEach(state.pipes, write);

    src.emit('data', chunk);

    // if anyone needs a drain, then we have to wait for that.
    if (state.awaitDrain > 0)
      return;
  }

  // if every destination was unpiped, either before entering this
  // function, or in the while loop, then stop flowing.
  //
  // NB: This is a pretty rare edge case.
  if (state.pipesCount === 0) {
    state.flowing = false;

    // if there were data event listeners added, then switch to old mode.
    if (EE.listenerCount(src, 'data') > 0)
      emitDataEvents(src);
    return;
  }

  // at this point, no one needed a drain, so we just ran out of data
  // on the next readable event, start it over again.
  state.ranOut = true;
}

function pipeOnReadable() {
  if (this._readableState.ranOut) {
    this._readableState.ranOut = false;
    flow(this);
  }
}


Readable.prototype.unpipe = function(dest) {
  var state = this._readableState;

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0)
    return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes)
      return this;

    if (!dest)
      dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    this.removeListener('readable', pipeOnReadable);
    state.flowing = false;
    if (dest)
      dest.emit('unpipe', this);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    this.removeListener('readable', pipeOnReadable);
    state.flowing = false;

    for (var i = 0; i < len; i++)
      dests[i].emit('unpipe', this);
    return this;
  }

  // try to find the right one.
  var i = indexOf(state.pipes, dest);
  if (i === -1)
    return this;

  state.pipes.splice(i, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1)
    state.pipes = state.pipes[0];

  dest.emit('unpipe', this);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function(ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data' && !this._readableState.flowing)
    emitDataEvents(this);

  if (ev === 'readable' && this.readable) {
    var state = this._readableState;
    if (!state.readableListening) {
      state.readableListening = true;
      state.emittedReadable = false;
      state.needReadable = true;
      if (!state.reading) {
        this.read(0);
      } else if (state.length) {
        emitReadable(this, state);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function() {
  emitDataEvents(this);
  this.read(0);
  this.emit('resume');
};

Readable.prototype.pause = function() {
  emitDataEvents(this, true);
  this.emit('pause');
};

function emitDataEvents(stream, startPaused) {
  var state = stream._readableState;

  if (state.flowing) {
    // https://github.com/isaacs/readable-stream/issues/16
    throw new Error('Cannot switch to old mode now.');
  }

  var paused = startPaused || false;
  var readable = false;

  // convert to an old-style stream.
  stream.readable = true;
  stream.pipe = Stream.prototype.pipe;
  stream.on = stream.addListener = Stream.prototype.on;

  stream.on('readable', function() {
    readable = true;

    var c;
    while (!paused && (null !== (c = stream.read())))
      stream.emit('data', c);

    if (c === null) {
      readable = false;
      stream._readableState.needReadable = true;
    }
  });

  stream.pause = function() {
    paused = true;
    this.emit('pause');
  };

  stream.resume = function() {
    paused = false;
    if (readable)
      setImmediate(function() {
        stream.emit('readable');
      });
    else
      this.read(0);
    this.emit('resume');
  };

  // now make it start, just in case it hadn't already.
  stream.emit('readable');
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function(stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function() {
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length)
        self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function(chunk) {
    if (state.decoder)
      chunk = state.decoder.write(chunk);
    if (!chunk || !state.objectMode && !chunk.length)
      return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (typeof stream[i] === 'function' &&
        typeof this[i] === 'undefined') {
      this[i] = function(method) { return function() {
        return stream[method].apply(stream, arguments);
      }}(i);
    }
  }

  // proxy certain important events.
  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
  forEach(events, function(ev) {
    stream.on(ev, function (x) {
      return self.emit.apply(self, ev, x);
    });
  });

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function(n) {
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};



// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
function fromList(n, state) {
  var list = state.buffer;
  var length = state.length;
  var stringMode = !!state.decoder;
  var objectMode = !!state.objectMode;
  var ret;

  // nothing in the list, definitely empty.
  if (list.length === 0)
    return null;

  if (length === 0)
    ret = null;
  else if (objectMode)
    ret = list.shift();
  else if (!n || n >= length) {
    // read it all, truncate the array.
    if (stringMode)
      ret = list.join('');
    else
      ret = Buffer.concat(list, length);
    list.length = 0;
  } else {
    // read just some of it.
    if (n < list[0].length) {
      // just take a part of the first list item.
      // slice is the same for buffers and strings.
      var buf = list[0];
      ret = buf.slice(0, n);
      list[0] = buf.slice(n);
    } else if (n === list[0].length) {
      // first list is a perfect match
      ret = list.shift();
    } else {
      // complex case.
      // we have enough to cover it, but it spans past the first buffer.
      if (stringMode)
        ret = '';
      else
        ret = new Buffer(n);

      var c = 0;
      for (var i = 0, l = list.length; i < l && c < n; i++) {
        var buf = list[0];
        var cpy = Math.min(n - c, buf.length);

        if (stringMode)
          ret += buf.slice(0, cpy);
        else
          buf.copy(ret, c, 0, cpy);

        if (cpy < buf.length)
          list[0] = buf.slice(cpy);
        else
          list.shift();

        c += cpy;
      }
    }
  }

  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0)
    throw new Error('endReadable called on non-empty stream');

  if (!state.endEmitted && state.calledRead) {
    state.ended = true;
    setImmediate(function() {
      // Check that we didn't get one last unshift.
      if (!state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream.readable = false;
        stream.emit('end');
      }
    });
  }
}

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf (xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}

}).call(this,require("/Users/damian/projects/raml-js-parser/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))
},{"./index.js":39,"/Users/damian/projects/raml-js-parser/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":30,"buffer":31,"events":23,"inherits":29,"process/browser.js":40,"string_decoder":45}],43:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

module.exports = Transform;

var Duplex = require('./duplex.js');
var inherits = require('inherits');
inherits(Transform, Duplex);


function TransformState(options, stream) {
  this.afterTransform = function(er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb)
    return stream.emit('error', new Error('no writecb in Transform class'));

  ts.writechunk = null;
  ts.writecb = null;

  if (data !== null && data !== undefined)
    stream.push(data);

  if (cb)
    cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}


function Transform(options) {
  if (!(this instanceof Transform))
    return new Transform(options);

  Duplex.call(this, options);

  var ts = this._transformState = new TransformState(options, this);

  // when the writable side finishes, then flush out anything remaining.
  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  this.once('finish', function() {
    if ('function' === typeof this._flush)
      this._flush(function(er) {
        done(stream, er);
      });
    else
      done(stream);
  });
}

Transform.prototype.push = function(chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function(chunk, encoding, cb) {
  throw new Error('not implemented');
};

Transform.prototype._write = function(chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform ||
        rs.needReadable ||
        rs.length < rs.highWaterMark)
      this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function(n) {
  var ts = this._transformState;

  if (ts.writechunk && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};


function done(stream, er) {
  if (er)
    return stream.emit('error', er);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var rs = stream._readableState;
  var ts = stream._transformState;

  if (ws.length)
    throw new Error('calling transform done when ws.length != 0');

  if (ts.transforming)
    throw new Error('calling transform done when still transforming');

  return stream.push(null);
}

},{"./duplex.js":38,"inherits":29}],44:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, cb), and it'll handle all
// the drain event emission and buffering.

module.exports = Writable;
Writable.WritableState = WritableState;

var isUint8Array = typeof Uint8Array !== 'undefined'
  ? function (x) { return x instanceof Uint8Array }
  : function (x) {
    return x && x.constructor && x.constructor.name === 'Uint8Array'
  }
;
var isArrayBuffer = typeof ArrayBuffer !== 'undefined'
  ? function (x) { return x instanceof ArrayBuffer }
  : function (x) {
    return x && x.constructor && x.constructor.name === 'ArrayBuffer'
  }
;

var inherits = require('inherits');
var Stream = require('./index.js');
var setImmediate = require('process/browser.js').nextTick;
var Buffer = require('buffer').Buffer;

inherits(Writable, Stream);

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
}

function WritableState(options, stream) {
  options = options || {};

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : 16 * 1024;

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, becuase any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function(er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.buffer = [];
}

function Writable(options) {
  // Writable ctor is applied to Duplexes, though they're not
  // instanceof Writable, they're instanceof Readable.
  if (!(this instanceof Writable) && !(this instanceof Stream.Duplex))
    return new Writable(options);

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function() {
  this.emit('error', new Error('Cannot pipe. Not readable.'));
};


function writeAfterEnd(stream, state, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  setImmediate(function() {
    cb(er);
  });
}

// If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  if (!Buffer.isBuffer(chunk) &&
      'string' !== typeof chunk &&
      chunk !== null &&
      chunk !== undefined &&
      !state.objectMode) {
    var er = new TypeError('Invalid non-string/buffer chunk');
    stream.emit('error', er);
    setImmediate(function() {
      cb(er);
    });
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function(chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (!Buffer.isBuffer(chunk) && isUint8Array(chunk))
    chunk = new Buffer(chunk);
  if (isArrayBuffer(chunk) && typeof Uint8Array !== 'undefined')
    chunk = new Buffer(new Uint8Array(chunk));
  
  if (Buffer.isBuffer(chunk))
    encoding = 'buffer';
  else if (!encoding)
    encoding = state.defaultEncoding;

  if (typeof cb !== 'function')
    cb = function() {};

  if (state.ended)
    writeAfterEnd(this, state, cb);
  else if (validChunk(this, state, chunk, cb))
    ret = writeOrBuffer(this, state, chunk, encoding, cb);

  return ret;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode &&
      state.decodeStrings !== false &&
      typeof chunk === 'string') {
    chunk = new Buffer(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, chunk, encoding, cb) {
  chunk = decodeChunk(state, chunk, encoding);
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  state.needDrain = !ret;

  if (state.writing)
    state.buffer.push(new WriteReq(chunk, encoding, cb));
  else
    doWrite(stream, state, len, chunk, encoding, cb);

  return ret;
}

function doWrite(stream, state, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  if (sync)
    setImmediate(function() {
      cb(er);
    });
  else
    cb(er);

  stream.emit('error', er);
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er)
    onwriteError(stream, state, sync, er, cb);
  else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(stream, state);

    if (!finished && !state.bufferProcessing && state.buffer.length)
      clearBuffer(stream, state);

    if (sync) {
      setImmediate(function() {
        afterWrite(stream, state, finished, cb);
      });
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished)
    onwriteDrain(stream, state);
  cb();
  if (finished)
    finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}


// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;

  for (var c = 0; c < state.buffer.length; c++) {
    var entry = state.buffer[c];
    var chunk = entry.chunk;
    var encoding = entry.encoding;
    var cb = entry.callback;
    var len = state.objectMode ? 1 : chunk.length;

    doWrite(stream, state, len, chunk, encoding, cb);

    // if we didn't call the onwrite immediately, then
    // it means that we need to wait until it does.
    // also, that means that the chunk and cb are currently
    // being processed, so move the buffer counter past them.
    if (state.writing) {
      c++;
      break;
    }
  }

  state.bufferProcessing = false;
  if (c < state.buffer.length)
    state.buffer = state.buffer.slice(c);
  else
    state.buffer.length = 0;
}

Writable.prototype._write = function(chunk, encoding, cb) {
  cb(new Error('not implemented'));
};

Writable.prototype.end = function(chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (typeof chunk !== 'undefined' && chunk !== null)
    this.write(chunk, encoding);

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished)
    endWritable(this, state, cb);
};


function needFinish(stream, state) {
  return (state.ending &&
          state.length === 0 &&
          !state.finished &&
          !state.writing);
}

function finishMaybe(stream, state) {
  var need = needFinish(stream, state);
  if (need) {
    state.finished = true;
    stream.emit('finish');
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished)
      setImmediate(cb);
    else
      stream.once('finish', cb);
  }
  state.ended = true;
}

},{"./index.js":39,"buffer":31,"inherits":29,"process/browser.js":40}],45:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var Buffer = require('buffer').Buffer;

function assertEncoding(encoding) {
  if (encoding && !Buffer.isEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

var StringDecoder = exports.StringDecoder = function(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  this.charBuffer = new Buffer(6);
  this.charReceived = 0;
  this.charLength = 0;
};


StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  var offset = 0;

  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var i = (buffer.length >= this.charLength - this.charReceived) ?
                this.charLength - this.charReceived :
                buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, offset, i);
    this.charReceived += (i - offset);
    offset = i;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (i == buffer.length) return charStr;

    // otherwise cut off the characters end from the beginning of this buffer
    buffer = buffer.slice(i, buffer.length);
    break;
  }

  var lenIncomplete = this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - lenIncomplete, end);
    this.charReceived = lenIncomplete;
    end -= lenIncomplete;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    this.charBuffer.write(charStr.charAt(charStr.length - 1), this.encoding);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }

  return i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  var incomplete = this.charReceived = buffer.length % 2;
  this.charLength = incomplete ? 2 : 0;
  return incomplete;
}

function base64DetectIncompleteChar(buffer) {
  var incomplete = this.charReceived = buffer.length % 3;
  this.charLength = incomplete ? 3 : 0;
  return incomplete;
}

},{"buffer":31}],46:[function(require,module,exports){
/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true eqeqeq:true immed:true latedef:true*/
(function () {
  "use strict";

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var punycode = require('punycode');

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '~', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(delims),
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

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

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
    var atSign = rest.indexOf('@');
    if (atSign !== -1) {
      var auth = rest.slice(0, atSign);

      // there *may be* an auth
      var hasAuth = true;
      for (var i = 0, l = nonAuthChars.length; i < l; i++) {
        if (auth.indexOf(nonAuthChars[i]) !== -1) {
          // not a valid auth.  Something like http://foo.com/bar@baz/
          hasAuth = false;
          break;
        }
      }

      if (hasAuth) {
        // pluck off the auth portion.
        out.auth = decodeURIComponent(auth);
        rest = rest.substr(atSign + 1);
      }
    }

    var firstNonHost = -1;
    for (var i = 0, l = nonHostChars.length; i < l; i++) {
      var index = rest.indexOf(nonHostChars[i]);
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
    var keys = Object.keys(p);
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      out[key] = p[key];
    }

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    out.hostname = out.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = out.hostname[0] === '[' &&
        out.hostname[out.hostname.length - 1] === ']';

    // validate a little.
    if (out.hostname.length > hostnameMaxLen) {
      out.hostname = '';
    } else if (!ipv6Hostname) {
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

    if (!ipv6Hostname) {
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
    }

    out.host = (out.hostname || '') +
        ((out.port) ? ':' + out.port : '');
    out.href += out.host;

    // strip [ and ] from the hostname
    if (ipv6Hostname) {
      out.hostname = out.hostname.substr(1, out.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
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
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    out.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
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
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = obj.protocol || '',
      pathname = obj.pathname || '',
      hash = obj.hash || '',
      host = false,
      query = '';

  if (obj.host !== undefined) {
    host = auth + obj.host;
  } else if (obj.hostname !== undefined) {
    host = auth + (obj.hostname.indexOf(':') === -1 ?
        obj.hostname :
        '[' + obj.hostname + ']');
    if (obj.port) {
      host += ':' + obj.port;
    }
  }

  if (obj.query && typeof obj.query === 'object' &&
      Object.keys(obj.query).length) {
    query = querystring.stringify(obj.query);
  }

  var search = obj.search || (query && ('?' + query)) || '';

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
      var authInHost = source.host && source.host.indexOf('@') > 0 ?
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
    var authInHost = source.host && source.host.indexOf('@') > 0 ?
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
    if (port !== ':') {
      out.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) out.hostname = host;
  return out;
}

}());

},{"punycode":34,"querystring":37}],47:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],48:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
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
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
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
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
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
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
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


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require("/Users/damian/projects/raml-js-parser/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":47,"/Users/damian/projects/raml-js-parser/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":30,"inherits":29}],49:[function(require,module,exports){
/*!
 * inflection
 * Copyright(c) 2011 Ben Lin <ben@dreamerslab.com>
 * MIT Licensed
 *
 * @fileoverview
 * A port of inflection-js to node.js module.
 */

( function ( root ){

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

    // do not replace if its already a plural word
    [ new RegExp( '(m)en$',      'gi' )],
    [ new RegExp( '(pe)ople$',   'gi' )],
    [ new RegExp( '(child)ren$', 'gi' )],
    [ new RegExp( '([ti])a$',    'gi' )],
    [ new RegExp( '((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$','gi' )],
    [ new RegExp( '(hive)s$',           'gi' )],
    [ new RegExp( '(tive)s$',           'gi' )],
    [ new RegExp( '(curve)s$',          'gi' )],
    [ new RegExp( '([lr])ves$',         'gi' )],
    [ new RegExp( '([^fo])ves$',        'gi' )],
    [ new RegExp( '([^aeiouy]|qu)ies$', 'gi' )],
    [ new RegExp( '(s)eries$',          'gi' )],
    [ new RegExp( '(m)ovies$',          'gi' )],
    [ new RegExp( '(x|ch|ss|sh)es$',    'gi' )],
    [ new RegExp( '([m|l])ice$',        'gi' )],
    [ new RegExp( '(bus)es$',           'gi' )],
    [ new RegExp( '(o)es$',             'gi' )],
    [ new RegExp( '(shoe)s$',           'gi' )],
    [ new RegExp( '(cris|ax|test)es$',  'gi' )],
    [ new RegExp( '(octop|vir)i$',      'gi' )],
    [ new RegExp( '(alias|status)es$',  'gi' )],
    [ new RegExp( '^(ox)en',            'gi' )],
    [ new RegExp( '(vert|ind)ices$',    'gi' )],
    [ new RegExp( '(matr)ices$',        'gi' )],
    [ new RegExp( '(quiz)zes$',         'gi' )],

    // original rule
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

    [ new RegExp( 's$', 'gi' ), 's' ],
    [ new RegExp( '$', 'gi' ),  's' ]
  ];

  /**
   * @description These rules translate from the plural form of a noun to its singular form.
   * @private
   */
  var singular_rules = [

    // do not replace if its already a singular word
    [ new RegExp( '(m)an$',                 'gi' )],
    [ new RegExp( '(pe)rson$',              'gi' )],
    [ new RegExp( '(child)$',               'gi' )],
    [ new RegExp( '^(ox)$',                 'gi' )],
    [ new RegExp( '(ax|test)is$',           'gi' )],
    [ new RegExp( '(octop|vir)us$',         'gi' )],
    [ new RegExp( '(alias|status)$',        'gi' )],
    [ new RegExp( '(bu)s$',                 'gi' )],
    [ new RegExp( '(buffal|tomat|potat)o$', 'gi' )],
    [ new RegExp( '([ti])um$',              'gi' )],
    [ new RegExp( 'sis$',                   'gi' )],
    [ new RegExp( '(?:([^f])fe|([lr])f)$',  'gi' )],
    [ new RegExp( '(hive)$',                'gi' )],
    [ new RegExp( '([^aeiouy]|qu)y$',       'gi' )],
    [ new RegExp( '(x|ch|ss|sh)$',          'gi' )],
    [ new RegExp( '(matr|vert|ind)ix|ex$',  'gi' )],
    [ new RegExp( '([m|l])ouse$',           'gi' )],
    [ new RegExp( '(quiz)$',                'gi' )],

    // original rule
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
    [ new RegExp( 'ss$', 'gi' ),                                                          'ss' ],
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

  var inflector = {

  /**
   * A helper method that applies rules based replacement to a String.
   * @private
   * @function
   * @param {String} str String to modify and return based on the passed rules.
   * @param {Array: [RegExp, String]} rules Regexp to match paired with String to use for replacement
   * @param {Array: [String]} skip Strings to skip if they match
   * @param {String} override String to return as though this method succeeded (used to conform to APIs)
   * @returns {String} Return passed String modified by passed rules.
   * @example
   *
   *     this._apply_rules( 'cows', singular_rules ); // === 'cow'
   */
    _apply_rules : function( str, rules, skip, override ){
      if( override ){
        str = override;
      }else{
        var ignore = ( inflector.indexOf( skip, str.toLowerCase()) > -1 );

        if( !ignore ){
          var i = 0;
          var j = rules.length;

          for( ; i < j; i++ ){
            if( str.match( rules[ i ][ 0 ])){
              if( rules[ i ][ 1 ] !== undefined ){
                str = str.replace( rules[ i ][ 0 ], rules[ i ][ 1 ]);
              }
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
   * @returns {Number} Return index position in the Array of the passed item.
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
   * @returns {String} Singular English language nouns are returned in plural form.
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
      return inflector._apply_rules( str, plural_rules, uncountable_words, plural );
    },



  /**
   * This function adds singularization support to every String object.
   * @public
   * @function
   * @param {String} str The subject string.
   * @param {String} singular Overrides normal output with said String.(optional)
   * @returns {String} Plural English language nouns are returned in singular form.
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
      return inflector._apply_rules( str, singular_rules, uncountable_words, singular );
    },



  /**
   * This function adds camelization support to every String object.
   * @public
   * @function
   * @param {String} str The subject string.
   * @param {Boolean} lowFirstLetter Default is to capitalize the first letter of the results.(optional)
   *                                 Passing true will lowercase it.
   * @returns {String} Lower case underscored words will be returned in camel case.
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
   * @param {Boolean} allUpperCase Default is to lowercase and add underscore prefix.(optional)
   *                  Passing true will return as entered.
   * @returns {String} Camel cased words are returned as lower cased and underscored.
   *                  additionally '::' is translated to '/'.
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.underscore( 'MessageProperties' ); // === 'message_properties'
   *     inflection.underscore( 'messageProperties' ); // === 'message_properties'
   *     inflection.underscore( 'MP', true ); // === 'MP'
   */
    underscore : function ( str, allUpperCase ){
      if( allUpperCase && str === str.toUpperCase()) return str;

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
   * @returns {String} Lower case underscored words will be returned in humanized form.
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
        str = inflector.capitalize( str );
      }

      return str;
    },



  /**
   * This function adds capitalization support to every String object.
   * @public
   * @function
   * @param {String} str The subject string.
   * @returns {String} All characters will be lower case and the first will be upper.
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.capitalize( 'message_properties' ); // === 'Message_properties'
   *     inflection.capitalize( 'message properties', true ); // === 'Message properties'
   */
    capitalize : function ( str ){
      str = str.toLowerCase();

      return str.substring( 0, 1 ).toUpperCase() + str.substring( 1 );
    },



  /**
   * This function adds dasherization support to every String object.
   * @public
   * @function
   * @param {String} str The subject string.
   * @returns {String} Replaces all spaces or underbars with dashes.
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
   * @returns {String} Capitalizes words as you would for a book title.
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
          if( inflector.indexOf( non_titlecased_words, d[ k ].toLowerCase()) < 0 ){
            d[ k ] = inflector.capitalize( d[ k ]);
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
   * @returns {String} Removes module names leaving only class names.(Ruby style)
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
   * @returns {String} Return camel cased words into their underscored plural form.
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.tableize( 'MessageBusProperty' ); // === 'message_bus_properties'
   */
    tableize : function ( str ){
      str = inflector.underscore( str );
      str = inflector.pluralize( str );

      return str;
    },



  /**
   * This function adds classification support to every String object.
   * @public
   * @function
   * @param {String} str The subject string.
   * @returns {String} Underscored plural nouns become the camel cased singular form.
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.classify( 'message_bus_properties' ); // === 'MessageBusProperty'
   */
    classify : function ( str ){
      str = inflector.camelize( str );
      str = inflector.singularize( str );

      return str;
    },



  /**
   * This function adds foreign key support to every String object.
   * @public
   * @function
   * @param {String} str The subject string.
   * @param {Boolean} dropIdUbar Default is to seperate id with an underbar at the end of the class name,
                                 you can pass true to skip it.(optional)
   * @returns {String} Underscored plural nouns become the camel cased singular form.
   * @example
   *
   *     var inflection = require( 'inflection' );
   *
   *     inflection.foreign_key( 'MessageBusProperty' ); // === 'message_bus_property_id'
   *     inflection.foreign_key( 'MessageBusProperty', true ); // === 'message_bus_propertyid'
   */
    foreign_key : function( str, dropIdUbar ){
      str = inflector.demodulize( str );
      str = inflector.underscore( str ) + (( dropIdUbar ) ? ( '' ) : ( '_' )) + 'id';

      return str;
    },



  /**
   * This function adds ordinalize support to every String object.
   * @public
   * @function
   * @param {String} str The subject string.
   * @returns {String} Return all found numbers their sequence like "22nd".
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

  if( typeof exports === 'undefined' ) return root.inflection = inflector;

/**
 * @public
 */
  inflector.version = "1.2.5";
/**
 * Exports module.
 */
  module.exports = inflector;
})( this );

},{}],50:[function(require,module,exports){
(function( glob, undefined ) {

var rnumber = /[0-9]/,
	rnewline = /(\r\n|\r|\n)/,
	revidence = /\r\n|\r|\n/,
	rwhitespace = /(\s|\t)/,
	rvalidsolidus = /\\("|\\|\/|b|f|n|r|t|u[0-9]{4})/,
	rE = /^(\-|\+)?[0-9]/;


// Leeeeeeerrrrroooyy Jennkkkiiinnnss
function JSONLint( json, options ) {
	var self = this;

	if ( ! ( self instanceof JSONLint ) ) {
		return new JSONLint( json, options );
	}

	// Argument handling
	self.json = json || '';
	self.options = options || {};
	self.lower = self.json.toLowerCase();

	// Allow comments by default
	if ( ! self.options.hasOwnProperty( 'comments' ) ) {
		self.options.comments = true;
	}

	// Internals
	self.c = '';
	self.i = -1;
	self.length = self.json.length;
	self.line = 1;
	self.character = 0;
	self._evidence = self.json.split( revidence );
	self.endblock = '';
	self.commabreak = false;

	try {
		self.render();
	} catch ( e ) {
		if ( typeof e != 'string' ) {
			throw e;
		}
		self.error = e;
		self.setEvidence();
	}
}


// Meta (Please change contact info for republishing with changes)
JSONLint.contact = "Corey Hart (corey@codenothing.com)";
JSONLint.version = '[VERSION]';
JSONLint.date = '[DATE]';


// Methods
JSONLint.prototype = {

	// Rendering Start
	render: function(){
		var self = this, peek = '', content = false;

		for ( ; ++self.i < self.length; ) {
			self.c = self.json[ self.i ];
			self.character++;

			if ( self.options.comments && self.c == '/' ) {
				peek = self.json[ self.i + 1 ];
				if ( peek == '*' ) {
					self.multicomment();
				}
				else if ( peek == '/' ) {
					self.comment();
				}
				else {
					throw "Unknown character '/', maybe a comment?";
				}
			}
			else if ( rnewline.exec( self.c ) ) {
				self.line++;
				self.character = 0;
			}
			else if ( rwhitespace.exec( self.c ) ) {
				continue;
			}
			else if ( content ) {
				throw "Unknown character '" + self.c + "', expecting end of file.";
			}
			else if ( self.c == '[' ) {
				content = true;
				self.array();
			}
			else if ( self.c == '{' ) {
				content = true;
				self.object();
			}
			else {
				throw "Unknown character '" + self.c + "', expecting opening block '{' or '[', or maybe a comment";
			}
		}

		// Check for pure whitespace
		if ( ! content ) {
			throw "Invalid JSON, no content.";
		}
	},

	// Multi line comment
	multicomment: function(){
		var self = this;

		for ( ; ++self.i < self.length; ) {
			self.c = self.json[ self.i ];
			self.character++;

			if ( self.c == "*" && self.json[ self.i + 1 ] == "/" ) {
				self.i++;
				self.character++;
				break;
			}
			else if ( rnewline.exec( self.c ) ) {
				self.line++;
				self.character = 0;
			}
		}
	},

	// Single line comment
	comment: function(){
		var self = this;

		for ( ; ++self.i < self.length; ) {
			self.c = self.json[ self.i ];
			self.character++;

			if ( rnewline.exec( self.c ) ) {
				self.line++;
				self.character = 0;
				break;
			}
		}
	},

	// Array Block
	array: function(){
		// Keep reference of current endblock
		var self = this,
			_endblock = self.endblock,
			_commabreak = self.commabreak,
			ended = false;

		self.endblock = ']';
		self.commabreak = false;
		while ( ( ended = self.value() ) !== true && self.i < self.length ) {
			// Do nothing, just wait for array values to finish
		}

		if ( ! ended ) {
			throw "EOF Error. Expecting closing ']'";
		}

		// Reset previous endblock
		self.endblock = _endblock;
		self.commabreak = _commabreak;
	},

	// Object Block
	object: function(){
		// Keep reference of current endblock
		var self = this,
			_endblock = self.endblock,
			_commabreak = self.commabreak,
			found = false, peek = '', empty = true;

		self.endblock = '}';
		self.commabreak = false;
		for ( ; ++self.i < self.length; ) {
			self.c = self.json[ self.i ];
			self.character++;

			if ( self.options.comments && self.c == '/' ) {
				peek = self.json[ self.i + 1 ];
				if ( peek == '*' ) {
					self.multicomment();
				}
				else if ( peek == '/' ) {
					self.comment();
				}
				else {
					throw "Unknown character '/', maybe a comment?";
				}
			}
			else if ( rnewline.exec( self.c ) ) {
				self.line++;
				self.character = 0;
			}
			else if ( rwhitespace.exec( self.c ) ) {
				continue;
			}
			else if ( self.c == '"' ) {
				empty = false;
				if ( self.key() === true ) {
					// Reset old endblock
					self.endblock = _endblock;
					self.commabreak = _commabreak;
					found = true;
					break;
				}
			}
			else if ( empty && self.c == '}' ) {
				self.endblock = _endblock;
				self.commabreak = _commabreak;
				found = true;
				break;
			}
			else {
				throw "Unknown Character '" + self.c + "', expecting a string for key statement.";
			}
		}

		if ( ! found ) {
			throw "EOF Error, expecting closing '}'.";
		}
	},

	// Key Statement
	key: function(){
		var self = this;
		self.string();

		for ( var peek = ''; ++self.i < self.length; ) {
			self.c = self.json[ self.i ];
			self.character++;

			if ( self.options.comments && self.c == '/' ) {
				peek = self.json[ self.i + 1 ];
				if ( peek == '*' ) {
					self.multicomment();
				}
				else if ( peek == '/' ) {
					self.comment();
				}
				else {
					throw "Unknown character '/', maybe a comment?";
				}
			}
			else if ( rnewline.exec( self.c ) ) {
				self.line++;
				self.character = 0;
			}
			else if ( rwhitespace.exec( self.c ) ) {
				continue;
			}
			else if ( self.c == ":" ) {
				return self.value();
			}
			else {
				throw "Unknown Character '" + self.c + "', expecting a semicolon.";
			}
		}
	},

	// Value statement
	value: function(){
		var self = this, peek = '';

		for ( ; ++self.i < self.length; ) {
			self.c = self.json[ self.i ];
			self.character++;

			if ( self.options.comments && self.c == '/' ) {
				peek = self.json[ self.i + 1 ];
				if ( peek == '*' ) {
					self.multicomment();
				}
				else if ( peek == '/' ) {
					self.comment();
				}
				else {
					throw "Unknown character '/', maybe a comment?";
				}
			}
			else if ( rnewline.exec( self.c ) ) {
				self.line++;
				self.character = 0;
			}
			else if ( rwhitespace.exec( self.c ) ) {
				continue;
			}
			else if ( self.c == '{' ) {
				self.object();
				return self.endval();
			}
			else if ( self.c == '[' ) {
				self.array();
				return self.endval();
			}
			else if ( self.c == '"' ) {
				self.string();
				return self.endval();
			}
			else if ( self.json.indexOf( 'true', self.i ) === self.i ) {
				self.i += 3;
				self.character += 3;
				return self.endval();
			}
			else if ( self.json.indexOf( 'false', self.i ) === self.i ) {
				self.i += 4;
				self.character += 4;
				return self.endval();
			}
			else if ( self.json.indexOf( 'null', self.i ) === self.i ) {
				self.i += 3;
				self.character += 3;
				return self.endval();
			}
			else if ( self.c == '-' || rnumber.exec( self.c ) ) {
				return self.numeric();
			}
			else if ( self.c == ']' && self.endblock == ']' ) {
				if ( self.commabreak ) {
					throw "Unexpected End Of Array Error. Expecting a value statement.";
				}
				return true;
			}
			else {
				throw "Unknown Character '" + self.c + "', expecting a value.";
			}
		}
	},

	// String statement
	string: function(){
		var self = this, found = false, m;

		for ( ; ++self.i < self.length; ) {
			self.c = self.json[ self.i ];
			self.character++;

			if ( self.c == "\\" ) {
				if ( ( m = rvalidsolidus.exec( self.json.substr( self.i ) ) ) && m.index === 0 ) {
					self.i += m[ 1 ].length;
					self.character += m[ 1 ].length;
				}
				else {
					throw "Invalid Reverse Solidus '\\' declaration.";
				}
			}
			else if ( rnewline.exec( self.c ) ) {
				self.line++;
				self.character = 0;
			}
			else if ( self.c == '"' ) {
				found = true;
				break;
			}
		}

		// Make sure close string is found
		if ( ! found ) {
			throw "EOF: No close string '\"' found.";
		}
	},

	// Numeric Value
	numeric: function(){
		var self = this,
			negative = true,
			decimal = null,
			e = null,
			peek = '';

		// We need to jump back a character to catch the whole number
		self.i--;
		self.character--;
		for ( ; ++self.i < self.length; ) {
			self.c = self.json[ self.i ];
			self.character++;

			// Handle initial negative sign
			if ( negative ) {
				negative = false;
				if ( self.c == '-' ) {
					if ( ! rnumber.exec( self.json[ self.i + 1 ] ) ) {
						throw "Unknown Character '" + self.c + "' following a negative, expecting a numeric value.";
					}
					continue;
				}
			}

			// Only a single decimal is allowed in a numeric value
			if ( decimal && self.c == '.' ) {
				decimal = false;
				e = true;
				continue;
			}
			// Only a single e notation is allowed in a numeric value
			else if ( e && self.c.toLowerCase() == 'e' ) {
				e = false;
				negative = true;
				if ( rE.exec( self.json.substr( self.i + 1, 2 ) ) ) {
					self.character++;
					self.i++;
				}
				else {
					self.character++;
					throw "Unknown Character '" + self.json[ self.i + 1 ] + "' following e notation, expecting a numeric value.";
				}
			}
			// Normal Digit
			else if ( rnumber.exec( self.c ) ) {
				if ( decimal === null ) {
					decimal = true;
				}
			}
			// Assume end of number, and allow endval to handle it
			else {
				// Jump back a character to include the current one
				self.i--;
				self.character--;
				return self.endval();
			}
		}
	},

	// Ending a value statement
	endval: function(){
		var self = this, peek = '';
		self.commabreak = false;

		for ( ; ++self.i < self.length; ) {
			self.c = self.json[ self.i ];
			self.character++;

			if ( self.options.comments && self.c == '/' ) {
				peek = self.json[ self.i + 1 ];
				if ( peek == '*' ) {
					self.multicomment();
				}
				else if ( peek == '/' ) {
					self.comment();
				}
				else {
					throw "Unknown character '/', maybe a comment?";
				}
			}
			else if ( rnewline.exec( self.c ) ) {
				self.line++;
				self.character = 0;
			}
			else if ( rwhitespace.exec( self.c ) ) {
				continue;
			}
			else if ( self.c == ',' ) {
				self.commabreak = true;
				break;
			}
			else if ( self.c == self.endblock ) {
				return true;
			}
			else {
				throw "Unknown Character '" + self.c + "', expecting a comma or a closing '" + self.endblock + "'";
			}
		}
	},

	// Expose line of the error
	setEvidence: function(){
		var self = this, start = self.line - 5, end = start + 8, evidence = '';

		// Min start
		if ( start < 0 ) {
			start = 0;
			end = 8;
		}

		// Max end
		if ( end >= self._evidence.length ) {
			end = self._evidence.length;
		}

		// Evidence display
		for ( ; start < end; start++ ) {
			evidence += ( start === ( self.line - 1 ) ? "-> " : "   " ) +
				( start + 1 ) + '| ' +
				self._evidence[ start ] + "\n";
		}

		// Set the evidence display
		self.evidence = evidence;
	}
};


// Check for nodejs module system
if ( typeof exports == 'object' && typeof module == 'object' ) {
	module.exports = JSONLint;
}
// In a browser
else {
	glob.JSONLint = JSONLint;
}

})( this );

},{}],51:[function(require,module,exports){
// vim:ts=4:sts=4:sw=4:
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
        /* jshint loopfunc: true */

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
                    if (domain) {
                        domain.exit();
                    }
                    setTimeout(flush, 0);
                    if (domain) {
                        domain.enter();
                    }

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
        // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
        // working message ports the first time a page loads.
        channel.port1.onmessage = function () {
            requestTick = requestPortTick;
            channel.port1.onmessage = flush;
            flush();
        };
        var requestPortTick = function () {
            // Opera requires us to provide a message payload, regardless of
            // whether we use it.
            channel.port2.postMessage(0);
        };
        requestTick = function () {
            setTimeout(flush, 0);
            requestPortTick();
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
var call = Function.call;
function uncurryThis(f) {
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
 * Constructs a promise for an immediate reference, passes promises through, or
 * coerces promises from different systems.
 * @param value immediate reference or promise
 */
function Q(value) {
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
Q.resolve = Q;

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

        become(Q(value));
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
    try {
        resolver(deferred.resolve, deferred.reject, deferred.notify);
    } catch (reason) {
        deferred.reject(reason);
    }
    return deferred.promise;
}

// XXX experimental.  This method is a way to denote that a local value is
// serializable and should be immediately dispatched to a remote upon request,
// instead of passing a reference.
Q.passByCopy = function (object) {
    //freeze(object);
    //passByCopies.set(object, true);
    return object;
};

Promise.prototype.passByCopy = function () {
    //freeze(object);
    //passByCopies.set(object, true);
    return this;
};

/**
 * If two promises eventually fulfill to the same value, promises that value,
 * but otherwise rejects.
 * @param x {Any*}
 * @param y {Any*}
 * @returns {Any*} a promise for x and y if they are the same, but a rejection
 * otherwise.
 *
 */
Q.join = function (x, y) {
    return Q(x).join(y);
};

Promise.prototype.join = function (that) {
    return Q([this, that]).spread(function (x, y) {
        if (x === y) {
            // TODO: "===" should be Object.is or equiv
            return x;
        } else {
            throw new Error("Can't join: not the same: " + x + " " + y);
        }
    });
};

/**
 * Returns a promise for the first of an array of promises to become fulfilled.
 * @param answers {Array[Any*]} promises to race
 * @returns {Any*} the first promise to be fulfilled
 */
Q.race = race;
function race(answerPs) {
    return promise(function(resolve, reject) {
        // Switch to this once we can assume at least ES5
        // answerPs.forEach(function(answerP) {
        //     Q(answerP).then(resolve, reject);
        // });
        // Use this in the meantime
        for (var i = 0, len = answerPs.length; i < len; i++) {
            Q(answerPs[i]).then(resolve, reject);
        }
    });
}

Promise.prototype.race = function () {
    return this.then(Q.race);
};

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

Promise.prototype.toString = function () {
    return "[object Promise]";
};

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

Promise.prototype.thenResolve = function (value) {
    return this.then(function () { return value; });
};

Q.thenResolve = function (promise, value) {
    return Q(promise).thenResolve(value);
};

Promise.prototype.thenReject = function (reason) {
    return this.then(function () { throw reason; });
};

Q.thenReject = function (promise, reason) {
    return Q(promise).thenReject(reason);
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

Promise.prototype.isPending = function () {
    return this.inspect().state === "pending";
};

/**
 * @returns whether the given object is a value or fulfilled
 * promise.
 */
Q.isFulfilled = isFulfilled;
function isFulfilled(object) {
    return !isPromise(object) || object.inspect().state === "fulfilled";
}

Promise.prototype.isFulfilled = function () {
    return this.inspect().state === "fulfilled";
};

/**
 * @returns whether the given object is a rejected promise.
 */
Q.isRejected = isRejected;
function isRejected(object) {
    return isPromise(object) && object.inspect().state === "rejected";
}

Promise.prototype.isRejected = function () {
    return this.inspect().state === "rejected";
};

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
        console.warn("Unhandled rejection reason:", reason);
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
    if (reason && typeof reason.stack !== "undefined") {
        unhandledReasons.push(reason.stack);
    } else {
        unhandledReasons.push("(no stack) " + reason);
    }
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
        "apply": function (thisp, args) {
            return value.apply(thisp, args);
        },
        "keys": function () {
            return object_keys(value);
        }
    }, void 0, function inspect() {
        return { state: "fulfilled", value: value };
    });
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
        return Q(object).inspect();
    });
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
function spread(value, fulfilled, rejected) {
    return Q(value).spread(fulfilled, rejected);
}

Promise.prototype.spread = function (fulfilled, rejected) {
    return this.all().then(function (array) {
        return fulfilled.apply(void 0, array);
    }, rejected);
};

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
        var callback = continuer.bind(continuer, "next");
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
 * add(Q(a), Q(B));
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
    return Q(object).dispatch(op, args);
}

Promise.prototype.dispatch = function (op, args) {
    var self = this;
    var deferred = defer();
    nextTick(function () {
        self.promiseDispatch(deferred.resolve, op, args);
    });
    return deferred.promise;
};

/**
 * Gets the value of a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to get
 * @return promise for the property value
 */
Q.get = function (object, key) {
    return Q(object).dispatch("get", [key]);
};

Promise.prototype.get = function (key) {
    return this.dispatch("get", [key]);
};

/**
 * Sets the value of a property in a future turn.
 * @param object    promise or immediate reference for object object
 * @param name      name of property to set
 * @param value     new value of property
 * @return promise for the return value
 */
Q.set = function (object, key, value) {
    return Q(object).dispatch("set", [key, value]);
};

Promise.prototype.set = function (key, value) {
    return this.dispatch("set", [key, value]);
};

/**
 * Deletes a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to delete
 * @return promise for the return value
 */
Q.del = // XXX legacy
Q["delete"] = function (object, key) {
    return Q(object).dispatch("delete", [key]);
};

Promise.prototype.del = // XXX legacy
Promise.prototype["delete"] = function (key) {
    return this.dispatch("delete", [key]);
};

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
Q.mapply = // XXX As proposed by "Redsandro"
Q.post = function (object, name, args) {
    return Q(object).dispatch("post", [name, args]);
};

Promise.prototype.mapply = // XXX As proposed by "Redsandro"
Promise.prototype.post = function (name, args) {
    return this.dispatch("post", [name, args]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param ...args   array of invocation arguments
 * @return promise for the return value
 */
Q.send = // XXX Mark Miller's proposed parlance
Q.mcall = // XXX As proposed by "Redsandro"
Q.invoke = function (object, name /*...args*/) {
    return Q(object).dispatch("post", [name, array_slice(arguments, 2)]);
};

Promise.prototype.send = // XXX Mark Miller's proposed parlance
Promise.prototype.mcall = // XXX As proposed by "Redsandro"
Promise.prototype.invoke = function (name /*...args*/) {
    return this.dispatch("post", [name, array_slice(arguments, 1)]);
};

/**
 * Applies the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param args      array of application arguments
 */
Q.fapply = function (object, args) {
    return Q(object).dispatch("apply", [void 0, args]);
};

Promise.prototype.fapply = function (args) {
    return this.dispatch("apply", [void 0, args]);
};

/**
 * Calls the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q["try"] =
Q.fcall = function (object /* ...args*/) {
    return Q(object).dispatch("apply", [void 0, array_slice(arguments, 1)]);
};

Promise.prototype.fcall = function (/*...args*/) {
    return this.dispatch("apply", [void 0, array_slice(arguments)]);
};

/**
 * Binds the promised function, transforming return values into a fulfilled
 * promise and thrown errors into a rejected one.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q.fbind = function (object /*...args*/) {
    var promise = Q(object);
    var args = array_slice(arguments, 1);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};
Promise.prototype.fbind = function (/*...args*/) {
    var promise = this;
    var args = array_slice(arguments);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};

/**
 * Requests the names of the owned properties of a promised
 * object in a future turn.
 * @param object    promise or immediate reference for target object
 * @return promise for the keys of the eventually settled object
 */
Q.keys = function (object) {
    return Q(object).dispatch("keys", []);
};

Promise.prototype.keys = function () {
    return this.dispatch("keys", []);
};

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
                when(
                    promise,
                    function (value) {
                        promises[index] = value;
                        if (--countDown === 0) {
                            deferred.resolve(promises);
                        }
                    },
                    deferred.reject,
                    function (progress) {
                        deferred.notify({ index: index, value: progress });
                    }
                );
            }
        }, void 0);
        if (countDown === 0) {
            deferred.resolve(promises);
        }
        return deferred.promise;
    });
}

Promise.prototype.all = function () {
    return all(this);
};

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
        promises = array_map(promises, Q);
        return when(all(array_map(promises, function (promise) {
            return when(promise, noop, noop);
        })), function () {
            return promises;
        });
    });
}

Promise.prototype.allResolved = function () {
    return allResolved(this);
};

/**
 * @see Promise#allSettled
 */
Q.allSettled = allSettled;
function allSettled(promises) {
    return Q(promises).allSettled();
}

/**
 * Turns an array of promises into a promise for an array of their states (as
 * returned by `inspect`) when they have all settled.
 * @param {Array[Any*]} values an array (or promise for an array) of values (or
 * promises for values)
 * @returns {Array[State]} an array of states for the respective values.
 */
Promise.prototype.allSettled = function () {
    return this.then(function (promises) {
        return all(array_map(promises, function (promise) {
            promise = Q(promise);
            function regardless() {
                return promise.inspect();
            }
            return promise.then(regardless, regardless);
        }));
    });
};

/**
 * Captures the failure of a promise, giving an oportunity to recover
 * with a callback.  If the given promise is fulfilled, the returned
 * promise is fulfilled.
 * @param {Any*} promise for something
 * @param {Function} callback to fulfill the returned promise if the
 * given promise is rejected
 * @returns a promise for the return value of the callback
 */
Q.fail = // XXX legacy
Q["catch"] = function (object, rejected) {
    return Q(object).then(void 0, rejected);
};

Promise.prototype.fail = // XXX legacy
Promise.prototype["catch"] = function (rejected) {
    return this.then(void 0, rejected);
};

/**
 * Attaches a listener that can respond to progress notifications from a
 * promise's originating deferred. This listener receives the exact arguments
 * passed to ``deferred.notify``.
 * @param {Any*} promise for something
 * @param {Function} callback to receive any progress notifications
 * @returns the given promise, unchanged
 */
Q.progress = progress;
function progress(object, progressed) {
    return Q(object).then(void 0, void 0, progressed);
}

Promise.prototype.progress = function (progressed) {
    return this.then(void 0, void 0, progressed);
};

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
Q.fin = // XXX legacy
Q["finally"] = function (object, callback) {
    return Q(object)["finally"](callback);
};

Promise.prototype.fin = // XXX legacy
Promise.prototype["finally"] = function (callback) {
    callback = Q(callback);
    return this.then(function (value) {
        return callback.fcall().then(function () {
            return value;
        });
    }, function (reason) {
        // TODO attempt to recycle the rejection with "this".
        return callback.fcall().then(function () {
            throw reason;
        });
    });
};

/**
 * Terminates a chain of promises, forcing rejections to be
 * thrown as exceptions.
 * @param {Any*} promise at the end of a chain of promises
 * @returns nothing
 */
Q.done = function (object, fulfilled, rejected, progress) {
    return Q(object).done(fulfilled, rejected, progress);
};

Promise.prototype.done = function (fulfilled, rejected, progress) {
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
    var promise = fulfilled || rejected || progress ?
        this.then(fulfilled, rejected, progress) :
        this;

    if (typeof process === "object" && process && process.domain) {
        onUnhandledError = process.domain.bind(onUnhandledError);
    }

    promise.then(void 0, onUnhandledError);
};

/**
 * Causes a promise to be rejected if it does not get fulfilled before
 * some milliseconds time out.
 * @param {Any*} promise
 * @param {Number} milliseconds timeout
 * @param {String} custom error message (optional)
 * @returns a promise for the resolution of the given promise if it is
 * fulfilled before the timeout, otherwise rejected.
 */
Q.timeout = function (object, ms, message) {
    return Q(object).timeout(ms, message);
};

Promise.prototype.timeout = function (ms, message) {
    var deferred = defer();
    var timeoutId = setTimeout(function () {
        deferred.reject(new Error(message || "Timed out after " + ms + " ms"));
    }, ms);

    this.then(function (value) {
        clearTimeout(timeoutId);
        deferred.resolve(value);
    }, function (exception) {
        clearTimeout(timeoutId);
        deferred.reject(exception);
    }, deferred.notify);

    return deferred.promise;
};

/**
 * Returns a promise for the given value (or promised value), some
 * milliseconds after it resolved. Passes rejections immediately.
 * @param {Any*} promise
 * @param {Number} milliseconds
 * @returns a promise for the resolution of the given promise after milliseconds
 * time has elapsed since the resolution of the given promise.
 * If the given promise rejects, that is passed immediately.
 */
Q.delay = function (object, timeout) {
    if (timeout === void 0) {
        timeout = object;
        object = void 0;
    }
    return Q(object).delay(timeout);
};

Promise.prototype.delay = function (timeout) {
    return this.then(function (value) {
        var deferred = defer();
        setTimeout(function () {
            deferred.resolve(value);
        }, timeout);
        return deferred.promise;
    });
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided as an array, and returns a promise.
 *
 *      Q.nfapply(FS.readFile, [__filename])
 *      .then(function (content) {
 *      })
 *
 */
Q.nfapply = function (callback, args) {
    return Q(callback).nfapply(args);
};

Promise.prototype.nfapply = function (args) {
    var deferred = defer();
    var nodeArgs = array_slice(args);
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided individually, and returns a promise.
 * @example
 * Q.nfcall(FS.readFile, __filename)
 * .then(function (content) {
 * })
 *
 */
Q.nfcall = function (callback /*...args*/) {
    var args = array_slice(arguments, 1);
    return Q(callback).nfapply(args);
};

Promise.prototype.nfcall = function (/*...args*/) {
    var nodeArgs = array_slice(arguments);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Wraps a NodeJS continuation passing function and returns an equivalent
 * version that returns a promise.
 * @example
 * Q.nfbind(FS.readFile, __filename)("utf-8")
 * .then(console.log)
 * .done()
 */
Q.nfbind =
Q.denodeify = function (callback /*...args*/) {
    var baseArgs = array_slice(arguments, 1);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        Q(callback).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nfbind =
Promise.prototype.denodeify = function (/*...args*/) {
    var args = array_slice(arguments);
    args.unshift(this);
    return Q.denodeify.apply(void 0, args);
};

Q.nbind = function (callback, thisp /*...args*/) {
    var baseArgs = array_slice(arguments, 2);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        function bound() {
            return callback.apply(thisp, arguments);
        }
        Q(bound).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nbind = function (/*thisp, ...args*/) {
    var args = array_slice(arguments, 0);
    args.unshift(this);
    return Q.nbind.apply(void 0, args);
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback with a given array of arguments, plus a provided callback.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param {Array} args arguments to pass to the method; the callback
 * will be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nmapply = // XXX As proposed by "Redsandro"
Q.npost = function (object, name, args) {
    return Q(object).npost(name, args);
};

Promise.prototype.nmapply = // XXX As proposed by "Redsandro"
Promise.prototype.npost = function (name, args) {
    var nodeArgs = array_slice(args || []);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

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
Q.nsend = // XXX Based on Mark Miller's proposed "send"
Q.nmcall = // XXX Based on "Redsandro's" proposal
Q.ninvoke = function (object, name /*...args*/) {
    var nodeArgs = array_slice(arguments, 2);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    Q(object).dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

Promise.prototype.nsend = // XXX Based on Mark Miller's proposed "send"
Promise.prototype.nmcall = // XXX Based on "Redsandro's" proposal
Promise.prototype.ninvoke = function (name /*...args*/) {
    var nodeArgs = array_slice(arguments, 1);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * If a function would like to support both Node continuation-passing-style and
 * promise-returning-style, it can end its internal promise chain with
 * `nodeify(nodeback)`, forwarding the optional nodeback argument.  If the user
 * elects to use a nodeback, the result will be sent there.  If they do not
 * pass a nodeback, they will receive the result promise.
 * @param object a result (or a promise for a result)
 * @param {Function} nodeback a Node.js-style callback
 * @returns either the promise or nothing
 */
Q.nodeify = nodeify;
function nodeify(object, nodeback) {
    return Q(object).nodeify(nodeback);
}

Promise.prototype.nodeify = function (nodeback) {
    if (nodeback) {
        this.then(function (value) {
            nextTick(function () {
                nodeback(null, value);
            });
        }, function (error) {
            nextTick(function () {
                nodeback(error);
            });
        });
    } else {
        return this;
    }
};

// All code before this point will be filtered from stack traces.
var qEndingLine = captureLine();

return Q;

});

},{}],52:[function(require,module,exports){
(function (global){
/*global unescape, module, define, window, global*/

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

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],53:[function(require,module,exports){
(function (process,Buffer){
/**
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
  };

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
  };

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
    var host;
    // Determine the server
    switch (url.protocol) {
      case 'https:':
        ssl = true;
        // SSL & non-SSL both need host, no break here.
      case 'http:':
        host = url.hostname;
        break;

      case 'file:':
        local = true;
        break;

      case undefined:
      case '':
        host = "localhost";
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
      headers["Content-Length"] = Buffer.isBuffer(data) ? data.length : Buffer.byteLength(data);

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

      // Handler for the response
      function responseHandler(resp) {
        // Set response var to the response we got back
        // This is so it remains accessable outside this scope
        response = resp;
        // Check for redirect
        // @TODO Prevent looped redirects
        if (response.statusCode === 302 || response.statusCode === 303 || response.statusCode === 307) {
          // Change URL to the redirect location
          settings.url = response.headers.location;
          var url = Url.parse(settings.url);
          // Set host var in case it's used later
          host = url.hostname;
          // Options for the new request
          var newOptions = {
            hostname: url.hostname,
            port: url.port,
            path: url.path,
            method: response.statusCode === 303 ? 'GET' : settings.method,
            headers: headers
          };

          // Issue the new request
          request = doRequest(newOptions, responseHandler).on('error', errorHandler);
          request.end();
          // @TODO Check if an XHR event needs to be fired here
          return;
        }

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
      }

      // Error handler for the request
      function errorHandler(error) {
        self.handleError(error);
      }

      // Create the request
      request = doRequest(options, responseHandler).on('error', errorHandler);

      // Node 0.4 and later won't accept empty data. Make sure it's needed.
      if (data) {
        request.write(data);
      }

      request.end();

      self.dispatchEvent("loadstart");
    } else { // Synchronous
      // Create a temporary file for communication with the other Node process
      var contentFile = ".node-xmlhttprequest-content-" + process.pid;
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
        + "  responseText += chunk;"
        + "});"
        + "response.on('end', function() {"
        + "fs.writeFileSync('" + contentFile + "', 'NODE-XMLHTTPREQUEST-STATUS:' + response.statusCode + ',' + responseText, 'utf8');"
        + "fs.unlinkSync('" + syncFile + "');"
        + "});"
        + "response.on('error', function(error) {"
        + "fs.writeFileSync('" + contentFile + "', 'NODE-XMLHTTPREQUEST-ERROR:' + JSON.stringify(error), 'utf8');"
        + "fs.unlinkSync('" + syncFile + "');"
        + "});"
        + "}).on('error', function(error) {"
        + "fs.writeFileSync('" + contentFile + "', 'NODE-XMLHTTPREQUEST-ERROR:' + JSON.stringify(error), 'utf8');"
        + "fs.unlinkSync('" + syncFile + "');"
        + "});"
        + (data ? "req.write('" + data.replace(/'/g, "\\'") + "');":"")
        + "req.end();";
      // Start the other Node Process, executing this string
      var syncProc = spawn(process.argv[0], ["-e", execString]);
      var statusText;
      while(fs.existsSync(syncFile)) {
        // Wait while the sync file is empty
      }
      self.responseText = fs.readFileSync(contentFile, 'utf8');
      // Kill the child process once the file has data
      syncProc.stdin.end();
      // Remove the temporary file
      fs.unlinkSync(contentFile);
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

}).call(this,require("/Users/damian/projects/raml-js-parser/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),require("buffer").Buffer)
},{"child_process":22,"fs":22,"http":24,"https":28,"url":46}]},{},[10])
(10)
});