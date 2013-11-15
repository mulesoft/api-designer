'use strict';
(function() {
  global.editorGetErrorLineMessage = function () {
    var webdriver = require('selenium-webdriver');
    var d = webdriver.promise.defer();

    browser.wait(function () {
        return browser.isElementPresent(by.css('.CodeMirror-lint-marker-error'));
    }).then(function () {
        browser.executeScript(function () {
          var querySelectorMarkerError = document.querySelector('.CodeMirror-lint-marker-error');
          return [
            querySelectorMarkerError.getAttribute('data-marker-line'),
            querySelectorMarkerError.getAttribute('data-marker-message')
          ];
        }).then(function (list) {
            d.fulfill(list);
          });
      });
    return d.promise;
  };

  global.editorGetErrorMessage = function () {
    var webdriver = require('selenium-webdriver');
    var d = webdriver.promise.defer();

    this.getErrorLineMessage().then(function (list) {
      var message = list[1];
      d.fulfill(message);
    });
    return d.promise;
  };

  global.editorgetErrorLine = function () {
    var webdriver = require('selenium-webdriver');
    var d = webdriver.promise.defer();

    this.getErrorLineMessage().then(function (list) {
      var line = list[0];
      d.fulfill(line);
    });

    return d.promise;

  };

  global.editorSetLine = function (line, text) {
    line --;
    return browser.executeScript('window.editor.setLine(' + line + ',"' + text + '")');
  };

  global.editorGetLine = function (line) {
    line --;
    return browser.executeScript('return window.editor.getLine(' + line + ')').then(function (text) {
      return text;
    });
  };

  global.editorSetValue = function (text) {
    return browser.executeScript('window.editor.setValue(\'' + text + '\')');
  };

  global.editorSetCursor = function (line, char) {
    line --;
    char --;
    browser.executeScript('window.editor.setCursor('+ line +','+ char +')');

  };

})();
