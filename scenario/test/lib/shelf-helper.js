'use strict';
(function() {
//  var protractor = require('protractor');
  var elementsVersion = ['#%RAML 0.8'];
  var elementsRootLevel = ['title','version','schemas','baseUri','mediaType','protocols', 'documentation',
  'baseUriParameters','securitySchemes','securedBy','New resource','traits','resourceTypes'];
  var elementsRootLevelRoot = ['title','version','schemas','baseUri','mediaType','protocols'];
  var elementsRootLevelDocs = ['documentation'];
  var elementsRootLevelParameters = ['baseUriParameters'];
  var elementsRootLevelSecurity = ['securitySchemes', 'securedBy'];
  var elementsRootLevelResources = ['New resource'];
  var elementsRootLevelTraitsAndTypes = [ 'traits', 'resourceTypes'];
//  var elementR


  var elementsResourceLevel = ['displayName','get','post','put','delete','head','patch','options','uriParameters','baseUriParameters','securedBy','New resource','is', 'type'];


  global.shelfGetElementsRootLevel = function(){
    return elementsRootLevel;
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


  global.shelfGetElementsResourceLevel = function(){
    return elementsResourceLevel;
  };
  global.shelfGetElementsVersion = function(){
    return elementsVersion;
  };
  global.shelfGetElementsFromShelf = function () {
    return browser.findElements(by.css('[ng-repeat=\'item in section.items\'] span'));
  };
  global.shelfGetElementsFromShelfByGroup = function (group) {
    return browser.findElements(by.css('.'+group+' ul li span'));
  };

})();