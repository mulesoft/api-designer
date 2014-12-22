(function (root) {
  /**
   * Check if a value is empty.
   *
   * @param  {*}       value
   * @return {Boolean}
   */
  var isEmpty = function (value) {
    return value == null;
  };

  /**
   * Convert a value into a boolean.
   *
   * @param  {String}  value
   * @return {Boolean}
   */
  var toBoolean = function (value) {
    return [0, false, '', '0', 'false'].indexOf(value) === -1;
  };

  /**
   * Convert a value into a number. Non-number strings and infinite values will
   * sanitize into `NaN`.
   *
   * @param  {String} value
   * @return {Number}
   */
  var toNumber = function (value) {
    return isFinite(value) ? Number(value) : null;
  };

  /**
   * Convert a value into an integer. Use strict sanitization - if something is
   * not an integer, return `NaN`.
   *
   * @param  {String} value
   * @return {Number}
   */
  var toInteger = function (value) {
    return value % 1 === 0 ? Number(value) : null;
  };

  /**
   * Convert a value into a date.
   *
   * @param  {String} value
   * @return {Date}
   */
  var toDate = function (value) {
    return !isNaN(Date.parse(value)) ? new Date(value) : null;
  };

  /**
   * Convert the schema config into a single sanitization function.
   *
   * @param  {Object}   configs
   * @param  {Object}   rules
   * @param  {Object}   types
   * @return {Function}
   */
  var toSanitization = function (configs, rules, types) {
    configs = Array.isArray(configs) ? configs : [configs];

    // Map configurations into function sanitization chains.
    var sanitizations = configs.map(function (config) {
      var fns = [];

      // Push type sanitization first.
      if (typeof types[config.type] === 'function') {
        fns.push(types[config.type]);
      }

      // Iterate over the schema configuration and push sanitization functions
      // into the sanitization array.
      Object.keys(config).filter(function (rule) {
        return rule !== 'type' && rule !== 'repeat' && rule !== 'default';
      }).forEach(function (rule) {
        if (typeof rules[rule] === 'function') {
          fns.push(rules[rule](config[rule], rule, config));
        }
      });

      /**
       * Sanitize a single value using the function chain. Breaks when any value
       * returns an empty value (`null` or `undefined`).
       *
       * @param  {*}      value
       * @param  {String} key
       * @param  {Object} object
       * @return {*}
       */
      var sanitize = function (value, key, object) {
        // Iterate over each sanitization function and return a single value.
        fns.every(function (fn) {
          value = fn(value, key, object);

          // Break when the value returns `null`.
          return value != null;
        });

        return value;
      };

      /**
       * Do the entire sanitization flow using the current config.
       *
       * @param  {*}      value
       * @param  {String} key
       * @param  {Object} object
       * @return {*}
       */
      return function sanitization (value, key, object) {
        // Immediately return empty values with attempting to sanitize.
        if (isEmpty(value)) {
          // Fallback to providing the default value instead.
          if (config.default != null) {
            return sanitization(config.default, key, object);
          }

          // Return an empty array for repeatable values.
          return config.repeat && !config.required ? [] : value;
        }

        // Support repeated parameters as arrays.
        if (config.repeat) {
          // Turn the result into an array
          if (!Array.isArray(value)) {
            value = [value];
          }

          // Map every value to be sanitized into a new array.
          value = value.map(function (value) {
            return sanitize(value, key, object);
          });

          // If any of the values are empty, refuse the sanitization.
          return value.some(isEmpty) ? null : value;
        }

        return sanitize(value, key, object);
      };
    });

    /**
     * Pass in a value to be sanitized.
     *
     * @param  {*}      value
     * @param  {String} key
     * @param  {Object} object
     * @return {*}
     */
    return function (value, key, object) {
      var result = value;

      // Iterate over each sanitization until one is not empty.
      sanitizations.some(function (sanitization) {
        var sanitized = sanitization(value, key, object);

        // If the value was accepted and sanitized, return it.
        if (sanitized != null) {
          // Assign the sanitized value to the result.
          result = sanitized;

          return true;
        }

        return false;
      });

      return result;
    };
  };

  /**
   * Every time the module is exported and executed, we return a new instance.
   *
   * @return {Function}
   */
  RAMLSanitize = function () {
    /**
     * Return a sanitization function based on the passed in schema.
     *
     * @param  {Object}   schema
     * @return {Function}
     */
    var sanitize = function (schema) {
      var sanitizations = {};

      // Map each parameter in the schema to a validation function.
      Object.keys(schema).forEach(function (param) {
        var config = schema[param];
        var types  = sanitize.TYPES;
        var rules  = sanitize.RULES;

        sanitizations[param] = toSanitization(config, rules, types);
      });

      /**
       * Execute the returned function with a model to return a sanitized object.
       *
       * @param  {Object} model
       * @return {Object}
       */
      return function (model) {
        model = model || {};

        // Create a new model instance to be sanitized without any additional
        // properties or overrides occuring.
        var sanitized = {};

        // Iterate only the sanitized parameters to get a clean model.
        Object.keys(sanitizations).forEach(function (param) {
          var value    = model[param];
          var sanitize = sanitizations[param];

          // Ensure the value is a direct property on the model object before
          // sanitizing. The keeps model handling in sync with expectations.
          if (Object.prototype.hasOwnProperty.call(model, param)) {
            sanitized[param] = sanitize(value, param, model);
          }
        });

        return sanitized;
      };
    };

    /**
     * Provide sanitization based on types.
     *
     * @type {Object}
     */
    sanitize.TYPES = {
      string:  String,
      number:  toNumber,
      integer: toInteger,
      boolean: toBoolean,
      date:    toDate
    };

    /**
     * Provide sanitization based on rules.
     *
     * @type {Object}
     */
    sanitize.RULES = {};

    return sanitize;
  };

  /**
   * Export the raml-sanitize for multiple environments.
   */
  if (typeof define === 'function' && define.amd) {
    define([], function () {
      return RAMLSanitize;
    });
  } else if (typeof exports === 'object') {
    module.exports = RAMLSanitize;
  } else {
    root.RAMLSanitize = RAMLSanitize;
  }
})(this);
