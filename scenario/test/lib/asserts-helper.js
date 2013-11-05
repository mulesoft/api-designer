'use strict';
(function() {
  var expect = require('expect.js');
  var webdriver = require('selenium-webdriver');

//Editor Starts

  global.editorParserErrorAssertions = function ( vLine, vMessage){
    var d = webdriver.promise.defer();
    editorGetErrorLineMessage().then(function (list) {
      var line = list[0], message = list[1];
      expect(message).to.eql(vMessage);
      expect(line).to.eql(vLine);
      d.fulfill();
    });
    return d.promise;
  };

//Editor Ends

//Console Starts
  global.consoleApiTitleAssertion = function(title){
    browser.$('#raml-console-api-title').getText().then(function(text){
     expect(text).to.eql(title);
    });
  };

  global.resourcesNameAssertion = function(list, expList){
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
  global.shelfElementsAssertion = function (list, expList){
    var i, dic = {}, counter = 0;
    var d = webdriver.promise.defer();
//    console.log('list: ' +list.length);
//    console.log('explist: '+expList.length);
    expect(list.length).to.eql(expList.length);
    for (i = 0; i < expList.length; i++) {
      dic[expList[i]] = false;
    }

    function afterAllThens() {
      var key, value;
      for (key in dic) {
        value = dic[key];
  //      console.log(JSON.stringify(dic));
        expect(value).to.eql(true);
      }
      return d.fulfill();
    }

    list.forEach(function (element) {
      element.getText().then(function(text){
//        console.log(text);
        dic[text] = true;
        counter++;
        if (counter === expList.length) {
          afterAllThens();
        }
      });
    });
  };

  global.noShelfElementsAssertion = function (list, expList, list2){
    var i, dic = {}, counter = 0;
    var d = webdriver.promise.defer();
    var num = (expList.length - list2.length);
    expect(list.length).to.eql(num);
    for (i = 0; i < expList.length; i++) {
      dic[expList[i]] = false;
    }

    function afterAllThens() {
      var key, value, i;
      for (i=0; i< list2.length; i++){
        value = dic[list2[i]];
        expect(value).to.eql(false);
        dic[list2[i]]=true;
      }
      for (key in dic) {
        value = dic[key];
        expect(value).to.eql(true);
      }
      return d.fulfill();
    }

    list.forEach(function (element) {
      element.getText().then(function (text) {
//        console.log(text);
        dic[text] = true;
        counter++;
        if (counter === num) {
          afterAllThens();
        }
      });
    });
  };

  global.shefGetElementsByGroupAssertion = function(groupInfo, byGroup){
    var i = 0;
    ShelfGetSectionsFromShelf().then(function(sections){
//      console.log(sections.length);
      sections.forEach(function(section){
        var t = i++;
        section.getText().then(function(text){
          expect(text).to.eql(groupInfo[t]);
        }).then(function(){
            section.findElements(by.css(itemsInSection())).then(function(items){
              shelfElementsAssertion(items, byGroup[t]);
            });
          });
      });
      expect(i).to.eql(sections.length);
    });


  };

  global.shelfElementsRootByGroupAssertion = function(){
    var byGroup = [shelfGetElementsRootLevelRoot(),shelfGetElementsRootLevelDocs(),shelfGetElementsRootLevelParameters(),shelfGetElementsRootLevelSecurity(),shelfGetElementsRootLevelResources(),shelfGetElementsRootLevelTraitsAndTypes()];
    var groupInfo = ['ROOT (6)\ntitle\nversion\nschemas\nbaseUri\nmediaType\nprotocols','DOCS (1)\ndocumentation','PARAMETERS (1)\nbaseUriParameters','SECURITY (2)\nsecuritySchemes\nsecuredBy','RESOURCES (1)\nNew resource','TRAITS AND TYPES (2)\ntraits\nresourceTypes'];
    shefGetElementsByGroupAssertion(groupInfo, byGroup);
  };

  global.shelfElementsResourceByGroupAssertion = function(){
    var byGroup =[shelfGetElementsResourceLevelDocs(),shelfGetElementsResourceLevelMethods(),shelfGetElementsResourceLevelParameters(),shelfGetElementsResourceLevelSecurity(), shelfGetElementsResourceLevelResources(),shelfGetElementsResourceLevelTraitsAndTypes()];
    var groupInfo = ['DOCS (1)\ndisplayName','METHODS (7)\nget\npost\nput\ndelete\nhead\npatch\noptions','PARAMETERS (2)\nuriParameters\nbaseUriParameters','SECURITY (1)\nsecuredBy','RESOURCES (1)\nNew resource','TRAITS AND TYPES (2)\nis\ntype'];
    shefGetElementsByGroupAssertion(groupInfo, byGroup);
  };
  global.shelfElementsMethodsByGroupAssertion = function(){
    var byGroup = [shelfGetElemMethodLevelRoot(),shelfGetElemMethodLevelDocs(),shelfGetElemMethodLevelParameters(), shelfGetElemMethodLevelResponses(),shelfGetElemMethodLevelSecurity(),shelfGetElemMethodLevelTraitsAndTypes(), shelfGetElemMethodLevelBody()];
    var groupInfo = ['ROOT (1)\nprotocols','DOCS (1)\ndescription','PARAMETERS (3)\nbaseUriParameters\nheaders\nqueryParameters','RESPONSES (1)\nresponses','SECURITY (1)\nsecuredBy','TRAITS AND TYPES (1)\nis','BODY (1)\nbody'];
    shefGetElementsByGroupAssertion(groupInfo, byGroup);
  };


//Shelf ends

})();