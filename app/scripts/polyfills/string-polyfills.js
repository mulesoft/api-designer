'use strict';

if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (text) {
    return this.indexOf(text) === 0;
  };
}

if (!String.prototype.endsWith) {
  String.prototype.endsWith = function (text) {
    return this.lastIndexOf(text) === this.length - text.length;
  };
}
