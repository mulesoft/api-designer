'use strict';
var EditorHelper = require ('./editor-helper.js').EditorHelper;
var ShelfHelper = require ('./shelf-helper.js').ShelfHelper;
var webdriver = require('selenium-webdriver');
function AssertsHelper() {}

AssertsHelper.prototype = {};

var editor = new EditorHelper();
var shelf = new ShelfHelper();

//Editor Starts
AssertsHelper.prototype.parserError = function(vLine, vMessage){
  var d = webdriver.promise.defer();
  editor.getErrorLineMessage().then(function (list) {
    var line = list[0], message = list[1];
    expect(message).toEqual(vMessage);
    expect(line).toEqual(vLine);
    d.fulfill();
  });
  return d.promise;
};
//Editor Ends

//Console Starts
AssertsHelper.prototype.consoleApiTitle= function(title){
  expect(browser.$('#raml-console-api-title').getText()).toEqual(title);
};

AssertsHelper.prototype.consoleResourcesName = function(list, expList){
  var i=0;
  var d = webdriver.promise.defer();
  expect(list.length).toEqual(expList.length);

  list.forEach(function (element) {
    element.getText().then(function (text) {
      expect(text).toEqual(expList[i]);
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
AssertsHelper.prototype.shelfElements = function(list, expList){
  expect(list.length).toEqual(expList.length);
  list.forEach(function(element){
    element.getText().then(function(text){
      expect(expList).toContain(text);
    });
  });
};
AssertsHelper.prototype.shelfElementsNotDisplayed = function(list2, expList){
  var that = this;
  list2.forEach(function(element){
    expList.splice(expList.indexOf(element), 1);
  });
  shelf.getElements().then(function(list){
    that.shelfElements(list, expList);
  });
};
AssertsHelper.prototype.shelfElementsByGroup = function(groupInfo, byGroup){
  var that = this ;
  var j, dic1 = {}, dic2 = {} ;
  var d = webdriver.promise.defer();
  var i = 0;
  for (j = 0; j < groupInfo.length; j++) {
    dic1[groupInfo[j]] = false;
  }
  for (j = 0; j < byGroup.length; j++) {
    dic2[byGroup[j]] = false;
  }
  function afterAllThens(){
    var key1, value1, key2, value2;
    for (key1 in dic1) {
      value1 = dic1[key1];
      if (!value1) {
        console.log(JSON.stringify(dic1));
      }
      expect(value1).toEqual(true);
    }
    for (key2 in dic2){
      value2 = dic2[key2];
      if (!value2){
        console.log(JSON.stringify(dic2));
      }
      expect(value2).toEqual(true);
    }
    return d.fulfill();
  }
  shelf.getSections().then(function(sections){
    sections.forEach(function(section){
      var t = i++;
      section.getText().then(function(text){
        dic1[text] = true;
      }).then(function(){
          section.findElements(by.css(shelf.itemsInSection())).then(function(items){
            dic2[byGroup[t]]=true;
            that.shelfElements(items, byGroup[t]);
            if (t === sections.length -1){
              afterAllThens();
            }
          });
        });
    });
    expect(sections.length).toEqual(byGroup.length);
  });
};

AssertsHelper.prototype.shelfElementsRootByGroup = function(){
  var that = this;
  var byGroup = [shelf.elemRootLevelRoot,shelf.elemRootLevelDocs,shelf.elemRootLevelParameters,shelf.elemRootLevelSecurity,shelf.elemRootLevelResources,shelf.elemRootLevelTraitsAndTypes];
  var groupInfo = ['ROOT (6)\ntitle\nversion\nschemas\nbaseUri\nmediaType\nprotocols','DOCS (1)\ndocumentation','PARAMETERS (1)\nbaseUriParameters','SECURITY (2)\nsecuritySchemes\nsecuredBy','RESOURCES (1)\nNew resource','TRAITS AND TYPES (2)\ntraits\nresourceTypes'];
  that.shelfElementsByGroup(groupInfo, byGroup);
};

AssertsHelper.prototype.shelfElementsResourceByGroup = function(){
  var that = this;
  var byGroup = [shelf.elemResourceLevelDocs,shelf.elemResourceLevelMethods,shelf.elemResourceLevelParameters,shelf.elemResourceLevelSecurity, shelf.elemResourceLevelResources,shelf.elemResourceLevelTraitsAndTypes];
  var groupInfo = ['DOCS (2)\ndisplayName\ndescription','METHODS (9)\noptions\nget\nhead\npost\nput\ndelete\ntrace\nconnect\npatch','PARAMETERS (2)\nuriParameters\nbaseUriParameters','SECURITY (1)\nsecuredBy','RESOURCES (1)\nNew resource','TRAITS AND TYPES (2)\nis\ntype'];
  that.shelfElementsByGroup(groupInfo, byGroup);
};

AssertsHelper.prototype.shelfElementsMethodsByGroup = function(){
  var that = this;
  var byGroup = [shelf.elemMethodLevelRoot,shelf.elemMethodLevelDocs,shelf.elemMethodLevelParameters, shelf.elemMethodLevelResponses,shelf.elemMethodLevelSecurity,shelf.elemMethodLevelTraitsAndTypes, shelf.elemMethodLevelBody];
  var groupInfo = ['ROOT (1)\nprotocols','DOCS (1)\ndescription','PARAMETERS (3)\nbaseUriParameters\nheaders\nqueryParameters','RESPONSES (1)\nresponses','SECURITY (1)\nsecuredBy','TRAITS AND TYPES (1)\nis','BODY (1)\nbody'];
  that.shelfElementsByGroup(groupInfo, byGroup);
};

AssertsHelper.prototype.shelfElemNamedParametersByGroup = function(){
  var that = this;
  var byGroup = [shelf.elemNamedParametersLevelDocs,shelf.elemNamedParametersLevelParameters];
  var groupInfo = ['DOCS (3)\ndisplayName\ndescription\nexample','PARAMETERS (9)\ntype\nenum\npattern\nminLength\nmaxLength\nmaximum\nminimum\nrequired\ndefault'];
  that.shelfElementsByGroup(groupInfo, byGroup);
};

AssertsHelper.prototype.shelfElemTraitsByGroup = function(){
  var that = this;
  var byGroup = [shelf.elemTraitsLevelRoot,shelf.elemTraitsLevelDocs,shelf.elemTraitsLevelParameters,shelf.elemTraitsLevelResponses,shelf.elemTraitsLevelSecurity,shelf.elemTraitsLevelBody];
  var groupInfo = ['ROOT (1)\nprotocols','DOCS (3)\ndisplayName\ndescription\nusage','PARAMETERS (3)\nbaseUriParameters\nheaders\nqueryParameters','RESPONSES (1)\nresponses','SECURITY (1)\nsecuredBy','BODY (1)\nbody'];
  that.shelfElementsByGroup(groupInfo, byGroup);
};

AssertsHelper.prototype.shelfElemResponsesByGroup = function(){
  var that = this;
  var byGroup = [shelf.elemResponsesLevelDocs,shelf.elemResponsesLevelBody];
  var groupInfo = ['DOCS (1)\ndescription','BODY (1)\nbody'];
  that.shelfElementsByGroup(groupInfo, byGroup);
};

AssertsHelper.prototype.shelfElemResourceTypesByGroup = function(){
  var that = this;
  var byGroup = [shelf.elemResourceTypeLevelDocs,shelf.elemResourceTypeLevelMethods,shelf.elemResourceTypeLevelParameters,shelf.elemResourceTypeLevelSecurity,shelf.elemResourceTypeLevelTraitsAndTypes];
  var groupInfo = ['DOCS (3)\ndisplayName\ndescription\nusage','METHODS (9)\noptions\nget\nhead\npost\nput\ndelete\ntrace\nconnect\npatch','PARAMETERS (2)\nbaseUriParameters\nuriParameters','SECURITY (1)\nsecuredBy','TRAITS AND TYPES (2)\nis\ntype'];
  that.shelfElementsByGroup(groupInfo, byGroup);
};

AssertsHelper.prototype.shelfElementsRTMethodsByGroup = function(){
  var that = this;
  var byGroup = [shelf.elemRtMethodLevelRoot,shelf.elemRtMethodLevelDocs,shelf.elemRtMethodLevelParameters, shelf.elemRtMethodLevelResponses,shelf.elemRtMethodLevelSecurity,shelf.elemRtMethodLevelTraitsAndTypes, shelf.elemRtMethodLevelBody];
  var groupInfo = ['ROOT (1)\nprotocols','DOCS (2)\ndescription\nusage','PARAMETERS (3)\nbaseUriParameters\nheaders\nqueryParameters','RESPONSES (1)\nresponses','SECURITY (1)\nsecuredBy','TRAITS AND TYPES (1)\nis','BODY (1)\nbody'];
  that.shelfElementsByGroup(groupInfo, byGroup);
};
//Shelf ends

exports.AssertsHelper = AssertsHelper;