'use strict';

if (!Array.prototype.find) {
  Array.prototype.find = function (predicate) {
    for (var i = 0; i < this.length; i++) {
      var item = this[i];
      if (predicate(item)) { return item; }
    }
    return undefined;
  };
}
