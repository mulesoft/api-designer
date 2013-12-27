'use strict';
function EditorHelper(){}

EditorHelper.prototype = {};

EditorHelper.prototype.getErrorLineMessage = function(){
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

EditorHelper.prototype.IsParserErrorDisplayed = function(){
  return browser.isElementPresent(by.css('.CodeMirror-lint-marker-error'));
};

EditorHelper.prototype.getErrorMessage = function(){
  var webdriver = require('selenium-webdriver');
  var d = webdriver.promise.defer();
  this.getErrorLineMessage().then(function (list) {
    var message = list[1];
    d.fulfill(message);
  });
  return d.promise;
};

EditorHelper.prototype.getErrorLine = function(){
  var webdriver = require('selenium-webdriver');
  var d = webdriver.promise.defer();
  this.getErrorLineMessage().then(function (list) {
    var line = list[0];
    d.fulfill(line);
  });
  return d.promise;
};

EditorHelper.prototype.setLine = function(line, text){
  line --;
  return browser.executeScript('window.editor.setLine(' + line + ',"' + text + '")');
};

EditorHelper.prototype.getLine = function(line){
  line --;
  return browser.executeScript('return window.editor.getLine(' + line + ')').then(function (text) {
    return text;
  });
};

EditorHelper.prototype.setValue = function(text){
  return browser.executeScript('window.editor.setValue(\'' + text + '\')');
};

EditorHelper.prototype.setCursor = function(line, char){
  line --;
  browser.executeScript('window.editor.setCursor('+ line +','+ char +')');
};

exports.EditorHelper = EditorHelper;