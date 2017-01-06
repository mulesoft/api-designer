/**
 * RAML JSON output normalizer.
 * It transforms the structure of the JSON output to a data type recognized by ARC components.
 *
 * ## Transformed objects
 * ### types
 * Types are transformed into a map of types loosing any array structure.
 * Types are flattened. It means that inheritance tree is removed and properties from parent types
 * are applied to the type. The `properties` has additional property `ownerTypes` which is the
 * array of inheritance objects. Each object has `name` and `displayName` keys that reference
 * correcponding values from original types.
 *
 * ### properties
 * Properties are transformed into a list of maps. Its strucure is the same.
 *
 *
 * ## Notes
 * Objects in .types are copied when are flattened. However they are referenced to the same
 * object in memory when mathods / resources points to the type / uriParameters.
 * It means that changing a property in a type or in uriParameters it will be changed in all
 * objects that points to this object (in the resources array).
 */
var RamlNormalizer = {
  baseTypes: ['string', 'number', 'boolean', 'date-only', 'time-only', 'datetime-only',
    'datetime', 'file', 'integer', 'nil', 'array', 'object'
  ],
  // https://github.com/raml2html/raml2obj/blob/master/consistency-helpers.js
  // MIT License
  isObject: function(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  },
  // https://github.com/raml2html/raml2obj/blob/master/arrays-objects-helpers.js
  // MIT License
  objectToArray: function(obj) {
    if (RamlNormalizer.isObject(obj)) {
      for (var property in obj) {
        var value = obj[property];
        if (['responses', 'body', 'queryParameters',
          'headers', 'properties', 'baseUriParameters', 'annotations', 'uriParameters']
          .indexOf(property) !== -1) {
          obj[property] = RamlNormalizer._objectToArray(value);
        }
        RamlNormalizer.objectToArray(obj[property]);
      }
    } else if (Array.isArray(obj)) {
      obj.forEach(function(value) {
        RamlNormalizer.objectToArray(value);
      });
    }
    return obj;
  },

  // https://github.com/raml2html/raml2obj/blob/master/arrays-objects-helpers.js
  // Transforms some TOP LEVEL properties from arrays to simple objects
  // MIT License
  arrayToObject: function(ramlObj) {
    ['types', 'traits', 'resourceTypes', 'annotationTypes', 'securitySchemes', 'schemas']
    .forEach(function(key) {
      if (ramlObj[key]) {
        ramlObj[key] = RamlNormalizer._arrayToObject(ramlObj[key]);
      }
    });
    return ramlObj;
  },
  // https://github.com/raml2html/raml2obj/blob/master/arrays-objects-helpers.js
  // MIT License
  _arrayToObject: function(arr) {
    return arr.reduce(function(acc, cur) {
      Object.keys(cur).forEach(function(key) {
        acc[key] = cur[key];
      });
      return acc;
    }, {});
  },

  flattenTypeArray: function(obj) {
    if (RamlNormalizer.isObject(obj)) {
      for (var prop in obj) {
        if (prop === 'types') {
          continue; // Types are handled by other function.
        }
        if (['type', 'is'].indexOf(prop) !== -1 && Array.isArray(obj[prop])) {
          obj[prop] = obj[prop][0];
        }
        RamlNormalizer.flattenTypeArray(obj[prop]);
      }
    } else if (Array.isArray(obj)) {
      obj.forEach(function(item) {
        RamlNormalizer.flattenTypeArray(item);
      });
    }
  },
  //https://github.com/raml2html/raml2obj/blob/master/arrays-objects-helpers.js
  // MIT License
  _objectToArray(obj) {
    if (Array.isArray(obj)) {
      return obj;
    }
    return Object.keys(obj).map(function(key) {
      if (RamlNormalizer.isObject(obj[key])) {
        obj[key].key = key;
      }
      return obj[key];
    });
  },
  // https://github.com/raml2html/raml2obj/blob/master/index.js
  // MIT license
  // Adds unique id's and parent URL's plus parent URI parameters to resources
  _addRamlProperties: function(ramlObj, parentUrl, allUriParameters, baseUri) {
    if (!ramlObj.resources) {
      return ramlObj;
    }

    baseUri = baseUri || ramlObj.baseUri;
    if (baseUri[baseUri.length - 1] === '/') {
      baseUri = baseUri.substr(0, baseUri.length - 1);
    }

    ramlObj.resources.forEach((resource) => {
      resource.parentUrl = parentUrl || '';
      resource.absoluteUrl = baseUri + resource.relativeUri;
      resource.allUriParameters = ramlObj.baseUriParameters || [];

      if (allUriParameters) {
        resource.allUriParameters.push.apply(resource.allUriParameters, allUriParameters);
      }

      if (resource.uriParameters) {
        resource.uriParameters.forEach((uriParameter) => {
          resource.allUriParameters.push(uriParameter);
        });
      }

      // Copy the RESOURCE uri parameters to the METHOD, because that's where they will be rendered.
      if (resource.methods) {
        resource.methods.forEach((method) => {
          method.allUriParameters = resource.allUriParameters;
          method.absoluteUrl = resource.absoluteUrl;
        });
      }

      RamlNormalizer._addRamlProperties(resource, resource.parentUrl + resource.relativeUri,
        resource.allUriParameters, ramlObj.baseUri || baseUri);
    });

    return ramlObj;
  },

  /**
   * Transform RAML parser JS output into something miningful in JS world.
   *
   * @param {object} object A parser output.
   */
  transform: function(object) {
    object = RamlNormalizer.arrayToObject(object);
    RamlNormalizer.transformTypes(object, object.types);
    RamlNormalizer.clearTypes(object);
    RamlNormalizer.transformProperties(object, object.types);
    RamlNormalizer.objectToArray(object);
    object = RamlNormalizer._addRamlProperties(object);
    return object;
  },
  /**
   * Transforms types array in the `object`.
   *
   * @param {Object} object An object on which transform the types array
   * @param {Array} source Source types declaration
   */
  transformTypes: function(object, source) {
    if (!object.types || !Object.getOwnPropertyNames(object.types).length) {
      return object;
    }
    // Replace type names with type declarations
    for (var typeName in object.types) {
      if (object.types[typeName].__isTranslated) {
        // some of the objects can be already transformed because of recursion.
        continue;
      }
      RamlNormalizer.translateTypeObject(object.types[typeName], source);
    }
    // flatten type objects so it will contain only one type declaration withoud recoursiveness
    for (typeName in object.types) {
      RamlNormalizer.flattenType(object.types[typeName]);
    }
    // In other places than .types replace arrays with it's only child object | string
    RamlNormalizer.flattenTypeArray(object);
    return object;
  },

  /**
   * Translate an object which is the `type` property of another object.
   *
   * @param {Object} object A type object to translate
   */
  translateTypeObject: function(object, source) {
    object.__isTranslated = true;
    if (!object.type) {
      return;
    }
    var type = RamlNormalizer.translateTypeType(object, source);
    object.type = type;
    return object;
  },
  /**
   * Tramslate type's type declaration
   *
   * @param {Array|Object|String} type A type declaration of the type.
   * @param {Array} source All types defined in RAML.
   */
  translateTypeType: function(type, source) {
    if (!type) {
      return console.warn('Type is undefined');
    }
    var _type = type.type;
    if (!_type && type) {
      _type = type;
    } else if (!_type) {
      console.warn('The type is missing type declaration.');
      return type;
    }

    if (typeof _type === 'string') {
      _type = [_type];
    }

    return RamlNormalizer.getType(_type, source);
  },

  getType: function(type, source) {
    var i = 0;
    var len = 0;
    var types; //ES5...
    if (type instanceof Array) {
      if (type.length === 1) {
        if (RamlNormalizer.baseTypes.indexOf(type[0]) !== -1) {
          return type[0];
        } else if (type[0].indexOf('|') !== -1) {
          // Union type
          var components = type[0].split('|').map(function(name) {
            return name.trim();
          });
          types = [];
          for (i = 0, len = components.length; i < len; i++) {
            types[types.length] = RamlNormalizer.getTypeDeclaration(components[i], source);
          }
          return types;
        } else {
          return RamlNormalizer.getTypeDeclaration(type[0], source);
        }
      } else {
        types = [];
        for (i = 0, len = type.length; i < len; i++) {
          if (RamlNormalizer.baseTypes.indexOf(type[i]) !== -1) {
            types[i] = type[i];
          } else {
            types[i] = RamlNormalizer.getTypeDeclaration(type[i], source);
          }
        }
        return types;
      }
    } else {
      if (type.__isTranslated) {
        return type;
      }
      return RamlNormalizer.translateTypeObject(type, source);
    }
  },
  /**
   * Finds a type declaration for given type name.
   * This function will return a copy of the object or later when manipulating properties
   * change in one object tree will cause change in all objects extending the type.
   *
   * @param {String} needle A name to find
   * @param {Array} source A list of source types declarations.
   * @return {Object|string} A type declaration or it's name if not found. Returned object is
   * already trnaslated.
   */
  getTypeDeclaration: function(needle, source) {
    if (!needle || !source || !Object.getOwnPropertyNames(source).length) {
      return needle;
    }
    if (!(needle in source)) {
      return needle;
    }
    var type = source[needle];
    if (type.__isTranslated) {
      return type;
    }
    return RamlNormalizer.clone(RamlNormalizer.transformTypes(type, source));
  },
  /**
   * It takes object sub types (if any object or array is the sub type) and promotes it's
   * properties to the parent object.
   *
   * @param {Object} object An type object declaration.
   */
  flattenType: function(object) {
    var subTypeProperties;
    if (typeof object.type === 'string') {
      // no subtype;
      return;
    } else if (object.type instanceof Array) {
      subTypeProperties = [];
      object.type.forEach(function(item) {
        subTypeProperties[subTypeProperties.length] = RamlNormalizer.extractProperties(item);
      });
    } else {
      subTypeProperties = RamlNormalizer.extractProperties(object.type);
    }

    if (!subTypeProperties) {
      return;
    }

    var properties = object.properties || {};
    if (subTypeProperties instanceof Array) {
      var result = [];
      subTypeProperties.forEach(function(obj) {
        result[result.length] = Object.assign({}, obj, properties); // parent ovverides child (?)
      });
      object.properties = result;
    } else {
      object.properties = Object.assign({}, subTypeProperties, properties);
    }

    for (var property in object.properties) {
      if (object.discriminator === property) {
        object.properties[property].isDiscriminator = true;
      }
      if (!object.properties[property].ownerTypes) {
        object.properties[property].ownerTypes = [];
      }
      object.properties[property].ownerTypes.unshift({
        name: object.name,
        displayName: object.displayName
      });
    }
  },
  /**
   * Extract properties declaration from the sub-type
   *
   * @param {Object} type A sub-type declaration.
   */
  extractProperties: function(type) {
    type = RamlNormalizer.clone(type);
    var properties = type.properties || {};
    for (var property in properties) {
      if (type.discriminator === property) {
        properties[property].isDiscriminator = true;
      }
      if (!properties[property].ownerTypes) {
        properties[property].ownerTypes = [];
      }
      properties[property].ownerTypes.unshift({
        name: type.name,
        displayName: type.displayName
      });
    }
    var subProperties;
    if (typeof type.type === 'string') {
      // do nothing
    } else if (type.type instanceof Array) {
      // this is an union type, so the final properties will be an array (the same length as
      // length of types) as a concatenation this object properties with each of returned
      // properties.
      subProperties = [];
      type.type.forEach(function(subType) {
        subProperties[subProperties.length] = RamlNormalizer.extractProperties(subType);
      });
    } else {
      subProperties = RamlNormalizer.extractProperties(type.type);
    }

    if (!subProperties) {
      return properties;
    }
    if (subProperties instanceof Array) {
      var result = [];
      subProperties.forEach(function(obj) {
        result[result.length] = Object.assign({}, obj, properties); // parent ovverides child (?)
      });
      return result;
    }
    return Object.assign({}, subProperties, properties);
  },
  // Deep clone object
  // http://stackoverflow.com/a/34624648/1127848
  clone: function(o) {
    var _out;
    var v;
    var _key;
    _out = Array.isArray(o) ? [] : {};
    for (_key in o) {
      v = o[_key];
      _out[_key] = (typeof v === 'object') ? RamlNormalizer.clone(v) : v;
    }
    return _out;
  },
  /**
   * Called when all properties has been asigned and deep types declaration is no londer
   * required.
   * @param {Object} object a RAML definition
   */
  clearTypes: function(object) {
    if (!object || !object.types || !Object.getOwnPropertyNames(object.types).length) {
      return;
    }
    for (var name in object.types) {
      var type = object.types[name];
      if (!type.type || typeof type.type === 'string') {
        continue;
      }
      if (type.type instanceof Array) {
        type.type = 'union';
      } else {
        type.type = 'object';
      }
    }
  },
  /**
   * Translates properties of each type object in the api so it will not reference complex types
   * anymore.
   *
   * @param {Object} object API reference object.
   */
  transformProperties: function(object) {
    if (!object.types || !Object.getOwnPropertyNames(object.types).length) {
      return object;
    }
    var typeName;
    for (typeName in object.types) {
      RamlNormalizer.translateTypeProperties(object.types[typeName], object.types);
    }
    for (typeName in object.types) {
      var properties = RamlNormalizer.flattenTypeProperties(object.types[typeName]);
      if (properties && properties !== object.types[typeName]) {
        object.types[typeName].properties = properties;
      }
    }
    // make properties an array

    return object;
  },
  /**
   * Transorm a type object for it's properties will contain a type object declaration instead
   * its name.
   *
   * @param {Object} type An API type object.
   * @param {Object} source a map of API's types.
   */
  translateTypeProperties: function(type, source) {
    if (!type.properties || !Object.getOwnPropertyNames(type.properties).length) {
      if (type.type && type.type.type && RamlNormalizer.baseTypes.indexOf(type.type.type) !== -1) {
        // Copy type's type's propertirs to current object
        for (var _key in type.type) {
          if (['name', 'displayName', 'type'].indexOf(_key) !== -1) {
            continue;
          }
          type[_key] = type.type[_key];
        }
        type.type = type.type.type;
      }
      return;
    }
    var name;
    var _type;
    var arrayType;
    var len;
    var i;
    var properties = RamlNormalizer.clone(type.properties);
    var isUnion = type.type === 'union';
    if (isUnion && Array.isArray(properties)) {
      for (i = 0, len = properties.length; i < len; i++) {
        for (name in properties[i]) {
          if (name === 'ownerTypes') {
            delete properties[i].ownerTypes;
            continue;
          }
          var _property = properties[i][name];
          _type = RamlNormalizer.getPropertyType(name, _property, source);
          if (!_type) {
            continue;
          }
          _property.type = _type;
          if (_type === 'array') {
            if (typeof _property.items === 'string') {
              arrayType = [_property.items];
            } else if (_property.items instanceof Array) {
              arrayType = _property.items;
            } else {
              // It's already a type declaration
            }
            if (arrayType) {
              _property.items = RamlNormalizer.getType(arrayType, source);
              arrayType = undefined;
            }
          } else if (_type.properties) {
            _property.properties = Object.assign((_property.properties || {}),
              _type.properties);
            if (_property.type && _property.type.type === 'union') {
              _property.type = 'union';
            }
          }
          RamlNormalizer.translateTypeProperties(_property, source);
          // properties[i][name] = _property;
        }
      }
    } else {
      for (name in properties) {
        _type = RamlNormalizer.getPropertyType(name, properties[name], source);
        if (!_type) {
          continue;
        }
        properties[name].type = _type;
        if (_type === 'array') {
          if (typeof properties[name].items === 'string') {
            arrayType = [properties[name].items];
          } else if (properties[name].items instanceof Array) {
            arrayType = properties[name].items;
          } else {
            // It's already a type declaration
          }
          if (arrayType) {
            properties[name].items = RamlNormalizer.getType(arrayType, source);
            arrayType = undefined;
          }
        } else if (_type.properties) {
          var _ownProperties = properties[name].properties || {};
          if (_type.type === 'union') {
            for (i = 0, len = _type.properties.length; i < len; i++) {
              _type.properties[i] = Object.assign(_ownProperties, _type.properties[i]);
            }
            properties[name].type = 'union';
          } else {
            _type.properties = Object.assign(_ownProperties, _type.properties);
          }
          properties[name].properties = _type.properties;
        }
        RamlNormalizer.translateTypeProperties(properties[name], source);
      }
    }
    type.properties = properties;
    if (RamlNormalizer.isObject(type.type)) {
      type.type = isUnion ? 'union' : 'object';
    }
  },

  getPropertyType: function(name, property, source) {
    if (name === 'ownerTypes' &&
      Object.prototype.toString.call(property) === '[object Array]') {
      return;
    }
    return RamlNormalizer.translateTypeType(property, source);
  },

  /**
   * If a property of a type has a complex object it will extract properties from enclosed
   * type object and put it into the `type`'s properies map.
   */
  flattenTypeProperties: function(type) {
    if (type.properties) {
      if (type.properties instanceof Array) {
        return type.properties;
      }
      for (var property in type.properties) {
        var propValue = type.properties[property];
        if (!propValue.type || typeof propValue.type === 'string' &&
          ['object', 'union'].indexOf(propValue.type) === -1) {
          continue;
        }
        var _subProp = RamlNormalizer.flattenTypeProperties(propValue);
        if (_subProp) {
          if (_subProp instanceof Array) {
            if (type.properties[property].properties) {
              var __currentProperties = type.properties[property].properties;
              var __result = []; // Map would be better but don't make functions in a loop...
              for (var i = 0, len = _subProp.length; i < len; i++) {
                __result[__result.length] = Object.assign({}, __currentProperties[i], _subProp[i]);
              }
              type.properties[property].properties = __result;
            } else {
              type.properties[property].properties = _subProp;
            }
          } else {
            if (!type.properties[property].properties) {
              var name = type.properties[property].name;
              type.properties[property] = _subProp;
              type.properties[property].name = name;
            } else {
              type.properties[property].properties = type.properties[property].properties || {};
              type.properties[property].properties =
                Object.assign({}, type.properties[property].properties, _subProp);
            }
          }
        }
      }
    }
    if (!type.type || typeof type.type === 'string') {
      if (RamlNormalizer.baseTypes.indexOf(type.type) !== -1 && type.type !== 'object') {
        return type;
      }
      return type.properties;
    }

    var _props = type.properties || {};
    var _propsSize = Object.getOwnPropertyNames(_props).length;

    if (type.type instanceof Array) {
      var result = [];
      type.type.forEach(function(_type) {
        if (typeof _type === 'string') {
          result[result.length] = _type;
          return;
        }
        var _subProps = RamlNormalizer.flattenTypeProperties(_type);
        if (!_subProps) {
          return;
        }
        result[result.length] = Object.assign({}, _props, _subProps);
      });
      if (result.length === 1) {
        result = result[0];
      }
      return result;
    } else {
      var _subProps = RamlNormalizer.flattenTypeProperties(type.type);
      if (!_subProps) {
        return type.properties;
      }
      if (_subProps instanceof Array) {
        if (!_propsSize) {
          return _subProps;
        }
        return _subProps.map(function(item) {
          return Object.assign({}, _props, item);
        });
      }
      return Object.assign({}, _props, _subProps);
    }
  }
};
