'use strict';
(function() {

  var webdriver = require('selenium-webdriver');

//Editor Starts
  global.editorParserErrorAssertions = function ( vLine, vMessage){
    var d = webdriver.promise.defer();
    editorGetErrorLineMessage().then(function (list) {
      var line = list[0], message = list[1];
      expect(message).toEqual(vMessage);
      expect(line).toEqual(vLine);
      d.fulfill();
    });
    return d.promise;
  };

//Editor Ends

//Console Starts
  global.consoleApiTitleAssertion = function(title){
    browser.$('#raml-console-api-title').getText().then(function(text){
     expect(text).toEqual(title);
    });
  };
  global.resourcesNameAssertion = function(list, expList){
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
  global.shelfElementsAssertion = function (list, expList){
    var i, dic = {}, counter = 0;
    var d = webdriver.promise.defer();
    expect(list.length).toEqual(expList.length);
    for (i = 0; i < expList.length; i++) {
      dic[expList[i]] = false;
    }
    function afterAllThens() {
      var key, value;
      for (key in dic) {
        value = dic[key];
        if (!value){
          console.log(JSON.stringify(dic));
        }
        expect(value).toEqual(true);
      }
      return d.fulfill();
    }
    list.forEach(function (element) {
      element.getText().then(function(text){
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
    expect(list.length).toEqual(num);
    for (i = 0; i < expList.length; i++) {
      dic[expList[i]] = false;
    }
    function afterAllThens() {
      var key, value, i;
      for (i=0; i< list2.length; i++){
        value = dic[list2[i]];
        expect(value).toEqual(false);
        dic[list2[i]]=true;
      }
      for (key in dic) {
        value = dic[key];
        expect(value).toEqual(true);
      }
      return d.fulfill();
    }
    list.forEach(function (element) {
        dic[element] = true;
        counter++;
        if (counter === num) {
          afterAllThens();
        }
    });
  };


  global.shefGetElementsByGroupAssertion = function(groupInfo, byGroup){
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
    shelfGetSectionsFromShelf().then(function(sections){
      sections.forEach(function(section){
        var t = i++;
        section.getText().then(function(text){
          dic1[text] = true;
        }).then(function(){
            section.findElements(by.css(itemsInSection())).then(function(items){
              dic2[byGroup[t]]=true;
              shelfElementsAssertion(items, byGroup[t]);
              if (t === sections.length -1){
                afterAllThens();
              }
            });
          });
      });
      expect(sections.length).toEqual(byGroup.length);
    });
  };

  global.shelfElementsRootByGroupAssertion = function(shelfElements){
    var byGroup = [shelfElements.getRootLevelRoot(),shelfElements.getRootLevelDocs(),shelfElements.getRootLevelParameters(),shelfElements.getRootLevelSecurity(),shelfElements.getRootLevelResources(),shelfElements.getRootLevelTraitsAndTypes()];
    var groupInfo = ['ROOT (6)\ntitle\nversion\nschemas\nbaseUri\nmediaType\nprotocols','DOCS (1)\ndocumentation','PARAMETERS (1)\nbaseUriParameters','SECURITY (2)\nsecuritySchemes\nsecuredBy','RESOURCES (1)\nNew resource','TRAITS AND TYPES (2)\ntraits\nresourceTypes'];
    shefGetElementsByGroupAssertion(groupInfo, byGroup);
  };
  global.shelfElementsResourceByGroupAssertion = function(shelfElements){
    var byGroup =[shelfElements.getResourceLevelDocs(),shelfElements.getResourceLevelMethods(),shelfElements.getResourceLevelParameters(),shelfElements.getResourceLevelSecurity(), shelfElements.getResourceLevelResource(),shelfElements.getResourceLevelTraitsAndTypes()];
    var groupInfo = ['DOCS (1)\ndisplayName','METHODS (9)\noptions\nget\nhead\npost\nput\ndelete\ntrace\nconnect\npatch','PARAMETERS (2)\nuriParameters\nbaseUriParameters','SECURITY (1)\nsecuredBy','RESOURCES (1)\nNew resource','TRAITS AND TYPES (2)\nis\ntype'];
    shefGetElementsByGroupAssertion(groupInfo, byGroup);
  };
  global.shelfElementsMethodsByGroupAssertion = function(shelfElements){
    var byGroup = [shelfElements.getMethodsLevelRoot(),shelfElements.getMethodsLevelDocs(),shelfElements.getMethodsLevelParameters(), shelfElements.getMethodsLevelResponses(),shelfElements.getMethodsLevelSecurity(),shelfElements.getMethodsLevelTraitsAndTypes(), shelfElements.getMethodsLevelBody()];
    var groupInfo = ['ROOT (1)\nprotocols','DOCS (1)\ndescription','PARAMETERS (3)\nbaseUriParameters\nheaders\nqueryParameters','RESPONSES (1)\nresponses','SECURITY (1)\nsecuredBy','TRAITS AND TYPES (1)\nis','BODY (1)\nbody'];
    shefGetElementsByGroupAssertion(groupInfo, byGroup);
  };
  global.shelfElemNamedParametersByGroupAssertion = function(shelfElements){
    var byGroup = [shelfElements.getNamedParametersLevelDocs(),shelfElements.getNamedParametersLevelParameters()];
    var groupInfo = ['DOCS (3)\ndisplayName\ndescription\nexample','PARAMETERS (9)\ntype\nenum\npattern\nminLength\nmaxLength\nmaximum\nminimum\nrequired\ndefault'];
    shefGetElementsByGroupAssertion(groupInfo, byGroup);
  };
  global.shelfElemTraitsByGroupAssertion = function(shelfElements){
    var byGroup = [shelfElements.getTraitsLevelRoot(),shelfElements.getTraitsLevelDocs(),shelfElements.getTraitsLevelParameters(),shelfElements.getTraitsLevelResponses(),shelfElements.getTraitsLevelSecurity(),shelfElements.getTraitsLevelBody()];
    var groupInfo = ['ROOT (1)\nprotocols','DOCS (3)\ndisplayName\ndescription\nusage','PARAMETERS (3)\nbaseUriParameters\nheaders\nqueryParameters','RESPONSES (1)\nresponses','SECURITY (1)\nsecuredBy','BODY (1)\nbody'];
    shefGetElementsByGroupAssertion(groupInfo, byGroup);
  };
  global.shelfElemResponsesByGroupAssertion = function(shelfElements){
    var byGroup = [shelfElements.getResponseLevelDocs(),shelfElements.getResponseLevelBody()];
    var groupInfo = ['DOCS (1)\ndescription','BODY (1)\nbody'];
    shefGetElementsByGroupAssertion(groupInfo, byGroup);
  };
  global.shelfElemResourceTypesByGroupAssertion = function(shelfElements){
    var byGroup = [shelfElements.getResourceTypeLevelDocs(),shelfElements.getResourceTypeLevelMethods(),shelfElements.getResourceTypeLevelParameters(),shelfElements.getResourceTypeLevelSecurity(),shelfElements.getResourceTypeLevelTraitsAndTypes()];
    var groupInfo = ['DOCS (3)\ndescription\ndisplayName\nusage','METHODS (9)\noptions\nget\nhead\npost\nput\ndelete\ntrace\nconnect\npatch','PARAMETERS (2)\nbaseUriParameters\nuriParameters','SECURITY (1)\nsecuredBy','TRAITS AND TYPES (2)\nis\ntype'];
    shefGetElementsByGroupAssertion(groupInfo, byGroup);
  };
  global.shelfElementsRTMethodsByGroupAssertion = function(shelfElements){ //missing usage property
    var byGroup = [shelfElements.getRTMethodsLevelRoot(),shelfElements.getRTMethodsLevelDocs(),shelfElements.getRTMethodsLevelParameters(), shelfElements.getRTMethodsLevelResponses(),shelfElements.getRTMethodsLevelSecurity(),shelfElements.getRTMethodsLevelTraitsAndTypes(), shelfElements.getRTMethodsLevelBody()];
    var groupInfo = ['ROOT (1)\nprotocols','DOCS (2)\ndescription\nusage','PARAMETERS (3)\nbaseUriParameters\nheaders\nqueryParameters','RESPONSES (1)\nresponses','SECURITY (1)\nsecuredBy','TRAITS AND TYPES (1)\nis','BODY (1)\nbody'];
    shefGetElementsByGroupAssertion(groupInfo, byGroup);
  };
//Shelf ends

})();