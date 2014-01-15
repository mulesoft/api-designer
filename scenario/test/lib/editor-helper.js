'use strict';
var webdriver = require('selenium-webdriver');

function EditorHelper(){
  this.editorLinesListCssWithCol =  '.CodeMirror-code div[style="position: relative;"]';
  this.editorLinesListCss =  '.CodeMirror-code div[style="position: relative;"] pre';
//  Syntax highlight
  this.keySHighlight = 'cm-key';
  this.traitTitleSHighlight= 'cm-trait-title';
  this.ramlTagSHighlight = 'cm-raml-tag';
}

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

EditorHelper.prototype.getSHighlightClass = function(line, pos){
  var that = this;
  var d = webdriver.promise.defer();
  browser.findElements(by.css(that.editorLinesListCss)).then(function(list){
    list[line].findElements(by.css('span')).then(function(lintext){
      if(lintext[pos]) {
        lintext[pos].getAttribute('class').then(function(classe){
          d.fulfill(classe);
        });
      } else {
        d.fulfill('');
      }
    });
  });
  return d.promise;
};

exports.EditorHelper = EditorHelper;