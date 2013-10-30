'use strict';

var webdriver = require('selenium-webdriver'),
  protractor = require('protractor');

function EditorHelper (ptor, driver) {
  this.ptor = ptor;
  this.driver = driver;
}

EditorHelper.prototype = {};

EditorHelper.prototype.getErrorLineMessage = function () {
  var d = webdriver.promise.defer(), that = this;

  this.ptor.wait(function () {
    return that.ptor.driver.isElementPresent(protractor.By.css('.CodeMirror-lint-marker-error'));
  }).then(function () {
      that.ptor.executeScript(function () {
        var querySelectorMarkerError = document.querySelector('.CodeMirror-lint-marker-error');
        return [
          querySelectorMarkerError.getAttribute('data-marker-line'),
          querySelectorMarkerError.getAttribute('data-marker-message')
        ]
      }).then(function (list) {
          d.fulfill(list);
        });
    });
  return d.promise;
};

EditorHelper.prototype.getErrorMessage = function () {
  var d = webdriver.promise.defer();

  this.getErrorLineMessage().then(function (list) {
    var message = list[1];
    d.fulfill(message);
  });

  return d.promise;
};

EditorHelper.prototype.getErrorLine = function () {
  var d = webdriver.promise.defer();

  this.getErrorLineMessage().then(function (list) {
    var line = list[0];
    d.fulfill(line);
  });

  return d.promise;

};

EditorHelper.prototype.setLine = function (line, text) {
  line --;
  return this.ptor.executeScript('window.editor.setLine(' + line + ',"' + text + '")');
};

EditorHelper.prototype.getLine = function (line) {
  line --;
  return this.ptor.executeScript('return window.editor.getLine(' + line + ')').then(function (text) {
    return text;
  });
};

EditorHelper.prototype.setValue = function (text) {
  return this.ptor.executeScript('window.editor.setValue(\'' + text + '\')');
};


EditorHelper.prototype.setCursor = function (line, char) {
  line --;
  char --;

  this.ptor.executeScript('window.editor.setCursor('+ line +','+ char +')');

};


exports.EditorHelper = EditorHelper;
