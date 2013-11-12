'use strict';
(function() {

  var webdriver = require('selenium-webdriver');
//  var protractor = require('protractor');
  var elementsVersion = ['#%RAML 0.8'];
//  Root Level
  var elementsRootLevel = ['title','version','schemas','baseUri','mediaType','protocols', 'documentation',
  'baseUriParameters','securitySchemes','securedBy','New resource','traits','resourceTypes'];

  var elementsRootLevelRoot = ['title','version','schemas','baseUri','mediaType','protocols'];
  var elementsRootLevelDocs = ['documentation'];
  var elementsRootLevelParameters = ['baseUriParameters'];
  var elementsRootLevelSecurity = ['securitySchemes', 'securedBy'];
  var elementsRootLevelResources = ['New resource'];
  var elementsRootLevelTraitsAndTypes = [ 'traits', 'resourceTypes'];
//  Resource level
  var elementsResourceLevel = ['displayName','get','post','put','delete','head','patch','options','trace', 'connect','uriParameters','baseUriParameters','securedBy','New resource','is', 'type'];
  var elementsResourceLevelDocs = ['displayName'];
  var elementsResourceLevelMethods = ['get','post','put','delete','head','patch','options','trace', 'connect'];
  var elementsResourceLevelParameters = ['uriParameters','baseUriParameters'];
  var elementsResourceLevelSecurity = ['securedBy'];
  var elementsResourceLevelResources = ['New resource'];
  var elementsResourceLevelTraitsAndTypes = ['is', 'type'];
// Method level
  var groupsForMethods = 7;
  var elemMethodLevel = ['protocols','description','baseUriParameters','headers','queryParameters','responses','securedBy','is','body'];
  var elemMethodLevelRoot = ['protocols'];
  var elemMethodLevelDocs = ['description']; // for resource Types need to be added usage option
  var elemMethodLevelParameters = ['baseUriParameters','headers','queryParameters'];
  var elemMethodLevelResponses = ['responses'];
  var elemMethodLevelSecurity = ['securedBy'];
  var elemMethodLevelTraitsAndTypes = ['is'];
  var elemMethodLevelBody = ['body'];

//Named Parameter
  var elemNamedParametersLevel = ['displayName', 'description', 'example', 'type','enum', 'pattern', 'minLength', 'maxLength', 'maximum','minimum','required','default'];
  var elemNamedParametersLevelDocs = ['displayName', 'description', 'example'];
  var elemNamedParametersLevelParameters = ['type','enum', 'pattern', 'minLength', 'maxLength', 'maximum','minimum','required','default'];

//Root
  global.shelfGetElementsRootLevel = function(){
    return elementsRootLevel;
  };

  global.shelfGetElementsRootLevelWithoutNewResource = function(){
    return  shelfGetElementsRootLevelRoot().concat(shelfGetElementsRootLevelDocs(), shelfGetElementsRootLevelParameters(),shelfGetElementsRootLevelSecurity(),shelfGetElementsRootLevelTraitsAndTypes());
  };
  global.shelfGetElementsRootLevelRoot = function(){
    return elementsRootLevelRoot;
  };
  global.shelfGetElementsRootLevelDocs = function(){
    return elementsRootLevelDocs;
  };
  global.shelfGetElementsRootLevelParameters = function(){
    return elementsRootLevelParameters;
  };
  global.shelfGetElementsRootLevelSecurity = function(){
    return elementsRootLevelSecurity;
  };
  global.shelfGetElementsRootLevelResources = function(){
    return elementsRootLevelResources;
  };
  global.shelfGetElementsRootLevelTraitsAndTypes = function(){
    return elementsRootLevelTraitsAndTypes;
  };
//  Resource
  global.shelfGetElementsResourceLevel = function(){
    return elementsResourceLevel;
  };
  global.shelfGetElementsResourceLevelWithoutNewResoource = function(){
    return shelfGetElementsResourceLevelDocs().concat(shelfGetElementsResourceLevelMethods(),shelfGetElementsResourceLevelParameters(),shelfGetElementsResourceLevelSecurity(),shelfGetElementsResourceLevelTraitsAndTypes());
  };
  global.shelfGetElementsResourceLevelDocs = function(){
    return elementsResourceLevelDocs;
  };
  global.shelfGetElementsResourceLevelMethods = function(){
    return elementsResourceLevelMethods;
  };
  global.shelfGetElementsResourceLevelParameters = function(){
    return elementsResourceLevelParameters;
  };
  global.shelfGetElementsResourceLevelSecurity = function(){
    return elementsResourceLevelSecurity;
  };
  global.shelfGetElementsResourceLevelResources = function(){
    return elementsResourceLevelResources;
  };
  global.shelfGetElementsResourceLevelTraitsAndTypes = function(){
    return elementsResourceLevelTraitsAndTypes;
  };
//  Methods
  global.shelfGetCantGroupsForMEthods = function(){
    return groupsForMethods;
  };
  global.getelemForMethods = function(){
    return elemForMethods;
  };
  global.shelfGetElemMethodLevel = function(){
    return elemMethodLevel;
  };
//  global.shelfGetelemResourceTypeMethodLevel = function (){
//    return shelfGetElemMethodLevel().concat(['usage']);
//  };
  global.shelfGetElemMethodLevelRoot = function(){
    return elemMethodLevelRoot;
  };
  global.shelfGetElemMethodLevelDocs = function(){
    return elemMethodLevelDocs;
  };
//  global.shelfGetElemResourceTypeMethodLevelDoc = function(){
//    return shelfGetElemMethodLevelDocs().concat(['usage']);
//  };
  global.shelfGetElemMethodLevelParameters = function(){
    return elemMethodLevelParameters;
  };
  global.shelfGetElemMethodLevelResponses = function(){
    return elemMethodLevelResponses;
  };
  global.shelfGetElemMethodLevelSecurity = function(){
    return elemMethodLevelSecurity;
  };
  global.shelfGetElemMethodLevelTraitsAndTypes = function(){
    return elemMethodLevelTraitsAndTypes;
  };
  global.shelfGetElemMethodLevelBody = function(){
    return elemMethodLevelBody;
  };

// Named Parameters
  global.shelfGetElemNamedParametersLevel = function(){
    return elemNamedParametersLevel;
  };
  global.shelfGetElemNamedParametersLevelDocs = function(){
    return elemNamedParametersLevelDocs;
  };
  global.shelfGetElemNamedParametersLevelParameters = function(){
    return elemNamedParametersLevelParameters;
  };

  global.shelfGetElementsVersion = function(){
    return elementsVersion;
  };

  // traits
  var elementsTraitsLevel = ['protocols','displayName', 'description','baseUriParameters', 'headers', 'queryParameters','responses', 'securedBy', 'body'];
  var elementsTraitsLevelRoot =['protocols'];
  var elementsTraitsLevelDocs = ['displayName', 'description']; //missing usage option
  var elementsTraitsLevelParameters = ['baseUriParameters', 'headers', 'queryParameters'];
  var elementsTraitsLevelResponses = ['responses'];
  var elementsTraitsLevelSecurity = ['securedBy'];
  var elementsTraitsLevelBody = ['body'];

  global.shelfGetElementsTraitsLevel = function(){
    return elementsTraitsLevel;
  };
  global.shelfGetElementsTraitsLevelRoot = function(){
    return elementsTraitsLevelRoot;
  };
  global.shelfGetElementsTraitsLevelDocs = function(){
    return elementsTraitsLevelDocs;
  };
  global.shelfGetElementsTraitsLevelParameters = function(){
    return elementsTraitsLevelParameters;
  };
  global.shelfGetElementsTraitsLevelResponses = function(){
    return elementsTraitsLevelResponses;
  };
  global.shelfGetElementsTraitsLevelSecurity = function(){
    return elementsTraitsLevelSecurity;
  };
  global.shelfGetElementsTraitsLevelBody = function(){
    return elementsTraitsLevelBody;
  };
//Resource Types - root
  var elemResourceTypesLevel = ['description', 'displayName','get','post','put','delete','head','patch','options','trace', 'connect','uriParameters','baseUriParameters','securedBy','is','type']; // missing usage
  var elemResourceTypesLevelDocs = ['description', 'displayName']; // missing usage
  var elemResourceTypesLevelMethods = ['get','post','put','delete','head','patch','options','trace', 'connect'];
  var elemResourceTypesLevelParameters = ['uriParameters','baseUriParameters'];
  var elemResourceTypesLevelSecurity = ['securedBy'];
  var elemResourceTypesLevelTraitsAndTypes = ['is', 'type'];

  global.shelfGetElemResourceTypesLevel = function (){
    return elemResourceTypesLevel;
  };
  global.shelfGetElemResourceTypesLevelDocs = function (){
    return elemResourceTypesLevelDocs;
  };
  global.shelfGetElemResourceTypesLevelMethods = function (){
    return elemResourceTypesLevelMethods;
  };
  global.shelfGetElemResourceTypesLevelParameters = function (){
    return elemResourceTypesLevelParameters;
  };
  global.shelfGetElemResourceTypesLevelSecurity = function (){
    return elemResourceTypesLevelSecurity;
  };
  global.shelfGetElemResourceTypesLevelTraitsAndTypes = function (){
    return elemResourceTypesLevelTraitsAndTypes;
  };

// rtMethods



//Responses
  var elementsResponsesLevel = ['description', 'body'];
  var elementsResponsesLevelDocs = ['description'];
  var elementsResponsesLevelBody = ['body'];

  global.shelfGetElementsResponseLevel = function(){
    return elementsResponsesLevel;
  };
  global.shelfGetElementsResponseLevelDocs = function(){
    return elementsResponsesLevelDocs;
  };
  global.shelfGetElementsResponseLevelBody = function(){
    return elementsResponsesLevelBody;
  };

  global.shelfGetElementsFromShelf = function () {
    return browser.findElements(by.css('[ng-repeat=\'item in section.items\'] span'));
  };

  global.shelfGetListOfElementsFromShelf = function (){
    var d = webdriver.promise.defer();

    function afterAllThens(items){
      d.fulfill(items);
    }

    shelfGetElementsFromShelf().then(function(list){
      var items=[];
      var i=0;
      list.forEach(function (item) {
        var t= i++;
        item.getText().then(function(text){
          items[t]=text;
          if (t === list.length-1){
            afterAllThens(items);
          }
        });
      });
    });

    return d;
  };

  global.shelfGetElementsFromShelfByGroup = function (group) {
    return browser.findElements(by.css('.'+group+' ul li span'));
  };

  global.shelfGetSectionsFromShelf = function(){
    return browser.findElements(by.css('[role=\'section\']'));
  };

  global.itemsInSection = function(){
    return '[role=\'items\'] li span';
  };
})();
