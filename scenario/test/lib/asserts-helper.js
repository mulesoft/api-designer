'use strict';
var EditorHelper = require ('./editor-helper.js').EditorHelper;
var ShelfHelper = require ('./shelf-helper.js').ShelfHelper;
var ConsoleHelper = require ('./console-helper.js').ConsoleHelper;
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
  var consoleApi = new ConsoleHelper();
  expect(browser.$(consoleApi.titleCss).getText()).toEqual(title);
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

AssertsHelper.prototype.consoleMainResources = function(expList){
  var consoleApi = new ConsoleHelper();
  var i = 0;
  consoleApi.getListMainResources().then(function(list){
    expect(list.length).toEqual(expList.length);
    list.forEach(function(elem){
      var t = i++;
      expect(elem.getText()).toEqual(expList[t]);
    });
  });
};

AssertsHelper.prototype.consoleResources = function(expList){
  var consoleApi = new ConsoleHelper();
  var i = 0;
  consoleApi.getListResourcesName().then(function(list){
    expect(list.length).toEqual(expList.length);
    list.forEach(function(elem){
      var t = i++;
      expect(elem.getText()).toEqual(expList[t]);
    });
  });
};

AssertsHelper.prototype.consoleResourcesDescription = function(expList){
  var consoleApi = new ConsoleHelper();
  var i = 0;
  consoleApi.getListResourcesDescription().then(function(list){
    expect(list.length).toEqual(expList.length);
    list.forEach(function(elem){
      var t = i++;
      expect(elem.getText()).toEqual(expList[t]);
    });
  });
};

AssertsHelper.prototype.consoleResourceResourceType = function(expList){
  var consoleApi = new ConsoleHelper();
  var i=0;
  consoleApi.getListResourceType().then(function(list){
    expect(list.length).toEqual(expList.length);
    list.forEach(function(elem){
      var t = i++;
      expect(elem.getText()).toEqual(expList[t]);
    });
  });
};

AssertsHelper.prototype.consoleResourcesTraits = function(expList){
  var consoleApi = new ConsoleHelper();
  var i=0;
  consoleApi.getListTrait().then(function(list){
    expect(list.length).toEqual(expList.length);
    list.forEach(function(elem){
      var t = i++;
      expect(elem.getText()).toEqual(expList[t]);
    });
  });
};

AssertsHelper.prototype.consoleResourcesMethods = function(expList){
  var consoleApi = new ConsoleHelper();
  var i=0;
  consoleApi.getListMethods().then(function(list){
    expect(list.length).toEqual(expList.length);
    list.forEach(function(elem){
      var t = i++;
      expect(elem.getText()).toEqual(expList[t]);
    });
  });
};

AssertsHelper.prototype.consoleResourceName = function(expList){
  browser.findElements(by.css('[role="resource"]')).then(function(resources){
    var i =0;
    expect(resources.length).toEqual(expList.length);
    resources.forEach(function(resource){
      var t = i++;
      resource.findElements(by.css('h3')).then(function(h3){
        expect(h3.length).toEqual(1);
        expect(h3[0].getText()).toEqual(expList[t]);
      });
    });
  });
};


AssertsHelper.prototype.consoleResourceMethods = function(expList){
  browser.findElements(by.css('[role="resource"]')).then(function(resources){
    var i =0;
    resources.forEach(function(resource){
      var t = i++;
      resource.findElements(by.css('[role="methods"] li')).then(function(methods){
        expect(methods.length).toEqual(expList['r'+t].length);
        var j = 0;
        methods.forEach(function(method){
          expect(method.getText()).toEqual(expList['r'+t][j]);
          j++;
        });
      });
    });
  });
};

AssertsHelper.prototype.consoleResourceResourceType = function(expList){
  browser.findElements(by.css('[role="resource"]')).then(function(resources){
    var i =0;
    expect(resources.length).toEqual(expList.length);
    resources.forEach(function(resource){
      var t = i++;
      resource.findElements(by.css('[role="resource-type"]')).then(function(h3){
        expect(h3.length).toEqual(1);
        expect(h3[0].getText()).toEqual(expList[t]);
      });
    });
  });
};

AssertsHelper.prototype.consoleResourceTraits = function(expList){
  browser.findElements(by.css('[role="resource"]')).then(function(resources){
    var i =0;
//    expect(resources.length).toEqual(expList.length);
    resources.forEach(function(resource){
      var t = i++;
      resource.findElements(by.css('[role="trait"]')).then(function(traits){
        expect(traits.length).toEqual(expList['r'+t].length);
        var j = 0;
        traits.forEach(function(trait){
          expect(trait.getText()).toEqual(expList['r'+t][j]);
          j++;
        });
      });
    });
  });
};

AssertsHelper.prototype.consoleResourceDescription = function(descriptions){
  var i =0;
  var apiConsole = new ConsoleHelper();
  browser.findElements(by.css(apiConsole.listResourcesCss)).then(function(resources){
    expect(resources.length).toEqual(descriptions.length);
    resources.forEach(function(resource){
      var t = i++;
      resource.findElements(by.css(apiConsole.listResourceDescriptionCss)).then(function(description){
        expect(description.length).toEqual(1);
        expect(description[0].getText()).toEqual(descriptions[t]);
      });
    });
  });

};


//Console Ends

//Shelf starts
AssertsHelper.prototype.shelfElementsx = function(list, expList){
  expect(list.length).toEqual(expList.length);
  list.forEach(function(element){
    element.getText().then(function(text){
      expect(expList).toContain(text);
    });
  });
};

AssertsHelper.prototype.shelfElements = function(expList){
  shelf = new ShelfHelper();
  shelf.getElements().then(function(list){
    expect(list.length).toEqual(expList.length);
    list.forEach(function(element){
      element.getText().then(function(text){
        expect(expList).toContain(text);
      });
    });
  });
};

AssertsHelper.prototype.shelfElementsNotDisplayed = function(list2, expList){
  var that = this;
  list2.forEach(function(element){
    expList.splice(expList.indexOf(element), 1);
  });
  that.shelfElements(expList);
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
          that.shelfElementsx(items, byGroup[t]);
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

AssertsHelper.prototype.shelfWithNoElements = function(){
  shelf.getElements().then(function(list){
    expect(list.length).toEqual(0);
  });
};
//Shelf ends

exports.AssertsHelper = AssertsHelper;