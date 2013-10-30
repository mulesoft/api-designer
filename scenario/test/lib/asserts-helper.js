'use strict';
var expect = require('expect.js');
var webdriver = require('selenium-webdriver'),
  protractor = require('protractor');

function AssertsHelper (ptor, driver) {
  this.ptor = ptor;
  this.driver = driver;
}

AssertsHelper.prototype = {};

AssertsHelper.prototype.editorParserErrorAssertions = function (editorHelper, vLine, vMessage){
  var d = webdriver.promise.defer();
  editorHelper.getErrorLineMessage().then(function (list) {
    var line = list[0], message = list[1];
    expect(message).to.eql(vMessage);
    expect(line).to.eql(vLine);
    d.fulfill();
  });
  return d.promise;
};

//Editor Ends

//Console Starts
AssertsHelper.prototype.consoleApiTitleAssertion = function(title){
  this.ptor.findElement(protractor.By.css('#raml-console-api-title')).getText().then(function(text){
    expect(text).to.eql(title);
  });
};

AssertsHelper.prototype.resourcesNameAssertion = function(list, expList){
  var i=0;
  var d = webdriver.promise.defer();
  expect(list.length).to.eql(expList.length);

  list.forEach(function (element) {
    element.getText().then(function (text) {
      expect(text).to.eql(expList[i]);
      i++;
      if (i === list.length){
        d.fulfill();
      }
    });
  });
  return d;
};
//Console Ends

//Shelf starts
AssertsHelper.prototype.shelfElementsAssertion = function (list, expList, done){
  var i, d = {}, counter = 0;
  expect(list.length).to.eql(expList.length);
  for (i = 0; i < expList.length; i++) {
    d[expList[i]] = false;
  }

  function afterAllThens() {
    var key, value;
    for (key in d) {
      value = d[key];
//      console.log(JSON.stringify(d));
      expect(value).to.eql(true);
    }
    return done();
  }

  list.forEach(function (element) {
    element.getText().then(function (text) {
      d[text] = true;
      counter++;
      if (counter === expList.length) {
        afterAllThens();
      }
    });
  });
};

AssertsHelper.prototype.NoShelfElementsAssertion = function (list, expList, list2, done){
  var i, d = {}, counter = 0;
  var num = (expList.length - list2.length);
  expect(list.length).to.eql(num);
  for (i = 0; i < expList.length; i++) {
    d[expList[i]] = false;
  }

  function afterAllThens() {
    var key, value, i;
    for (i=0; i< list2.length; i++){
      value = d[list2[i]];
      expect(value).to.eql(false);
      d[list2[i]]=true;
    }
    for (key in d) {
      value = d[key];
      expect(value).to.eql(true);
    }
    return done();
  }

  list.forEach(function (element) {
    element.getText().then(function (text) {
      d[text] = true;
      counter++;
      if (counter === num) {
        afterAllThens();
      }
    });
  });
};

//Shelf ends

exports.AssertsHelper = AssertsHelper;