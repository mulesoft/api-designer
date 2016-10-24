'use strict';

if (!Array.prototype.find) {
  Array.prototype.find = function (predicate) {
    for (var i = 0, len = this.length; i < len; i++) {
      var item = this[i];
      if (predicate(item)) { return item; }
    }
    return undefined;
  };
}

if (!Array.prototype.includes) {
  Array.prototype.includes = function (value) {
    for (var i = 0, len = this.length; i < len; i++) {
      var item = this[i];
      if (item === value) { return true; }
    }
    return false;
  };
}
