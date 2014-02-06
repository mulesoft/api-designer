'use strict';
var EditorHelper = require ('./editor-helper.js').EditorHelper;
var ShelfHelper = require ('./shelf-helper.js').ShelfHelper;
var ConsoleHelper = require ('./console-helper.js').ConsoleHelper;
var webdriver = require('selenium-webdriver');
function AssertsHelper() {}

AssertsHelper.prototype = {};

var editor = new EditorHelper();
var shelf = new ShelfHelper();
var apiConsole = new ConsoleHelper();

//Editor Starts
AssertsHelper.prototype.parserError = function parserError(vLine, vMessage){
  var d = webdriver.promise.defer();
  editor.getErrorLineMessage().then(function (list) {
    var line = list[0], message = list[1];
    expect(message).toEqual(vMessage);
    expect(line).toEqual(vLine);
    d.fulfill();
  });
  return d.promise;
};

AssertsHelper.prototype.checkSyntaxHignlight = function checkSyntaxHignlight(line,pos,text){
  //Line is editor line, pos , text is the highlight class
  line--;
  editor.getSHighlightClass(line,pos).then(function(classe){
    expect(classe).toEqual(text);
  });
};

AssertsHelper.prototype.checkHignlightAndSwimLines = function checkHignlightAndSwimLines(line,pos,text){
  //Line is editor line, pos , text is the highlight class
  line--;
  editor.getSyntaxIndentClassArray(line,pos).then(function(classes){
    expect(classes).toEqual(text);
  });
};

AssertsHelper.prototype.editorCheckFileNameInList = function editorCheckFileNameInList(fileName){
  editor.getFileList().then(function(lista){
    expect(fileName in lista).toEqual(true);
  });
};

AssertsHelper.prototype.editorCheckFileNameNotInList = function editorCheckFileNameInList(fileName){
  editor.getFileList().then(function(lista){
    expect(fileName in lista).toEqual(false);
  });
};

AssertsHelper.prototype.editorCheckNotificationBarIsDisplayed = function editorCheckNotificationBarIsDisplayed(){
  editor.getNotificationBar().then(function(notBar){
//  var notBar = browser.findElements(by.css('[role="notifications"]'));
    console.log('notBar',notBar);
    expect(notBar[0].getAttribute('class')).toEqual('hola');
  });
};
//Editor Ends

//Console Starts
AssertsHelper.prototype.consoleSectionIsHidden= function consoleSectionIsHidden(){
  var consoleApi = new ConsoleHelper();
  expect(browser.$(consoleApi.consoleSection).getAttribute('class')).toEqual('ng-hide');
};

AssertsHelper.prototype.consoleApiTitle= function consoleApiTitle(title){
  var consoleApi = new ConsoleHelper();
  expect(browser.$(consoleApi.titleCss).getText()).toEqual(title);
};

AssertsHelper.prototype.consoleResourcesName = function consoleResourcesName(list, expList){
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

AssertsHelper.prototype.consoleMainResources = function consoleMainResources(expList){
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

AssertsHelper.prototype.consoleResources = function consoleResources(expList){
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

AssertsHelper.prototype.consoleResourcesDescription = function consoleResourcesDescription(expList){
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

AssertsHelper.prototype.consoleResourceResourceType = function consoleResourceResourceType(expList){
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

AssertsHelper.prototype.consoleResourcesTraits = function consoleResourcesTraits(expList){
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

AssertsHelper.prototype.consoleResourcesMethods = function consoleResourcesMethods(expList){
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

AssertsHelper.prototype.consoleResourceName = function consoleResourceName(expList){
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

AssertsHelper.prototype.consoleResourceMethods = function consoleResourceMethods(expList){
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

AssertsHelper.prototype.consoleResourceResourceType = function consoleResourceResourceType(expList){
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

AssertsHelper.prototype.consoleResourceTraits = function consoleResourceTraits(expList){
  browser.findElements(by.css('[role="resource"]')).then(function(resources){
    var i =0;
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

AssertsHelper.prototype.consoleResourceDescription = function consoleResourceDescription(descriptions){
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

AssertsHelper.prototype.consoleMethodDescriptionCollapsed = function consoleMethodDescriptionCollapsed(methods, desc){
  apiConsole.getListOfMethodsDescriptionCollapsed().then(function(dic){
    var i = 0;
    methods.forEach(function(method){
      expect(dic[method]).toEqual(desc[i]);
      i++;
    });
  });
};

AssertsHelper.prototype.consoleValidateDocumentationSectionPlainText = function consoleValidateDocumentationSectionPlainText(expTitle, expContent){
  apiConsole.getDocumentationSections().then(function(sections){
    expect(sections.length).toEqual(expTitle.length);
    var i = 0;
    sections.forEach(function(section){
      var p = i++;
      section.findElement(by.css('h2')).then(function(title){
        expect(title.getText()).toEqual(expTitle[p]);
        title.click();
      });
      section.findElement(by.css('p')).then(function(content){
        expect(content.getText()).toEqual(expContent[p]);
      });
    });
  });
};

//Console Ends

//Shelf starts
AssertsHelper.prototype.shelfElementsx = function shelfElementsx(list, expList){
  expect(list.length).toEqual(expList.length);
  list.forEach(function(element){
    element.getText().then(function(text){
      expect(expList).toContain(text);
    });
  });
};

AssertsHelper.prototype.shelfElementsSlow = function shelfElementsSlow(expList){
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

AssertsHelper.prototype.shelfElements = function shelfElements(expList){
  shelf = new ShelfHelper();
  var lista = shelf.getElements();
  expect(lista).toEqual(expList);
};

AssertsHelper.prototype.shelfElementsNotDisplayed = function shelfElementsNotDisplayed(list2, expList){
  var that = this;
  list2.forEach(function(element){
    if(element !== '#%RAML 0.8'){
      expList.splice(expList.indexOf(element), 1);
    }
  });
  that.shelfElements(expList);
};

AssertsHelper.prototype.shelfElementsNotDisplayedSlow = function shelfElementsNotDisplayedSlow(list2, expList){
  var that = this;
  list2.forEach(function(element){
    if(element !== '#%RAML 0.8'){
      expList.splice(expList.indexOf(element), 1);
    }
  });
  that.shelfElementsSlow(expList);
};

AssertsHelper.prototype.shelfElementsByGroupSlow = function shelfElementsByGroupSlow(groupInfo, byGroup){
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

AssertsHelper.prototype.ShelfElementsByGroup = function ShelfElementsByGroup(textByGroup){
  var text = browser.executeScript(function () {
    var t = $('[role="section"]').text();
    return  t.replace(/\s+/g,' ');
  });
  expect(text).toEqual(textByGroup);
};

AssertsHelper.prototype.shelfWithNoElements = function shelfWithNoElements(){
  shelf.getElements().then(function(list){
    expect(list.length).toEqual(0);
  });
};

AssertsHelper.prototype.shelfIsNotDisplayed = function shelfIsNotDisplayed(){
  browser.findElements(by.css('[role="shelf"]')).then(function(shelf){
    expect(shelf[0].getAttribute('class')).toEqual('expanded ng-hide');
  });
};

AssertsHelper.prototype.shelfIsDisplayed = function shelfIsDisplayed(){
  browser.findElements(by.css('[role="shelf"]')).then(function(shelf){
    expect(shelf[0].getAttribute('class')).toEqual('expanded');
  });
};
//Shelf ends

exports.AssertsHelper = AssertsHelper;
