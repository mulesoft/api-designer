'use strict';
//var expect = require('expect.js');
//var webdriver = require('selenium-webdriver'),    protractor = require('protractor');

function ShelfElements() {}

ShelfElements.prototype = {};
//Root Elements
var elementsRootLevelRoot = ['title','version','schemas','baseUri','mediaType','protocols'];
var elementsRootLevelDocs = ['documentation'];
var elementsRootLevelParameters = ['baseUriParameters'];
var elementsRootLevelSecurity = ['securitySchemes', 'securedBy'];
var elementsRootLevelResources = ['New resource'];
var elementsRootLevelTraitsAndTypes = [ 'traits', 'resourceTypes'];

ShelfElements.prototype.getRootLevelWithoutNewResource = function (){
  return elementsRootLevelRoot.concat(elementsRootLevelDocs,elementsRootLevelParameters,elementsRootLevelSecurity,elementsRootLevelTraitsAndTypes);
};
ShelfElements.prototype.getRootLevel = function(){
  return elementsRootLevelRoot.concat(elementsRootLevelDocs,elementsRootLevelParameters,elementsRootLevelSecurity,elementsRootLevelResources,elementsRootLevelTraitsAndTypes);
};
ShelfElements.prototype.getRootLevelDocs = function(){
  return elementsRootLevelDocs;
};
ShelfElements.prototype.getRootLevelParameters = function(){
  return elementsRootLevelParameters;
};
ShelfElements.prototype.getRootLevelSecurity = function(){
  return elementsRootLevelSecurity;
};
ShelfElements.prototype.getRootLevelResources = function(){
  return elementsRootLevelResources;
};
ShelfElements.prototype.getRootLevelTraitsAndTypes = function(){
  return elementsRootLevelTraitsAndTypes;
};


//Named Parameter
var elemNamedParametersLevelDocs = ['displayName', 'description', 'example'];
var elemNamedParametersLevelParameters = ['type','enum', 'pattern', 'minLength', 'maxLength', 'maximum','minimum','required','default'];

ShelfElements.prototype.getNamedParametersLevel = function(){
  return elemNamedParametersLevelDocs.concat(elemNamedParametersLevelParameters);
};
ShelfElements.prototype.getNamedParametersLevelDocs = function(){
  return elemNamedParametersLevelDocs;
};
ShelfElements.prototype.getNamedParametersLevelParameters = function(){
  return elemNamedParametersLevelParameters;
};

//traits
var elementsTraitsLevelRoot =['protocols'];
var elementsTraitsLevelDocs = ['displayName', 'description']; //missing usage option
var elementsTraitsLevelParameters = ['baseUriParameters', 'headers', 'queryParameters'];
var elementsTraitsLevelResponses = ['responses'];
var elementsTraitsLevelSecurity = ['securedBy'];
var elementsTraitsLevelBody = ['body'];

ShelfElements.prototype.getTraitsLevel = function(){
  return elementsTraitsLevelRoot.concat(elementsTraitsLevelDocs,elementsTraitsLevelParameters, elementsTraitsLevelResponses,elementsTraitsLevelSecurity,elementsTraitsLevelBody);
};
ShelfElements.prototype.getTraitsLevelRoot = function(){
  return elementsTraitsLevelRoot;
};
ShelfElements.prototype.getTraitsLevelDocs = function(){
  return elementsTraitsLevelDocs;
};
ShelfElements.prototype.getTraitsLevelParameters = function(){
  return elementsTraitsLevelParameters;
};
ShelfElements.prototype.getTraitsLevelResponses = function(){
  return elementsTraitsLevelResponses;
};
ShelfElements.prototype.getTraitsLevelSecurity = function(){
  return elementsTraitsLevelSecurity;
};
ShelfElements.prototype.getTraitsLevelBody = function(){
  return elementsTraitsLevelBody;
};

//Methods
var elemMethodLevelRoot = ['protocols'];
var elemMethodLevelDocs = ['description']; // for resource Types need to be added usage option
var elemMethodLevelParameters = ['baseUriParameters','headers','queryParameters'];
var elemMethodLevelResponses = ['responses'];
var elemMethodLevelSecurity = ['securedBy'];
var elemMethodLevelTraitsAndTypes = ['is'];
var elemMethodLevelBody = ['body'];

ShelfElements.prototype.getMethodsLevel = function (){
  return elemMethodLevelRoot.concat(elemMethodLevelDocs,elemMethodLevelParameters,elemMethodLevelResponses,elemMethodLevelSecurity,elemMethodLevelTraitsAndTypes,elemMethodLevelBody);
};
ShelfElements.prototype.getMethodsLevelRoot = function (){
  return elemMethodLevelRoot;
};
ShelfElements.prototype.getMethodsLevelDocs = function (){
  return elemMethodLevelDocs;
};
ShelfElements.prototype.getMethodsLevelParameters = function (){
  return elemMethodLevelParameters;
};
ShelfElements.prototype.getMethodsLevelResponses = function (){
  return elemMethodLevelResponses;
};
ShelfElements.prototype.getMethodsLevelSecurity = function (){
  return elemMethodLevelSecurity;
};
ShelfElements.prototype.getMethodsLevelTraitsAndTypes = function (){
  return elemMethodLevelTraitsAndTypes;
};
ShelfElements.prototype.getMethodsLevelBody = function (){
  return elemMethodLevelBody;
};

ShelfElements.prototype.getResourceTypesMethodsLevel = function (){
  return this.getMethodsLevel(); // missing to add usage.
};

//  Resource level
var elemResourceLevelDocs = ['displayName'];
var elemResourceLevelMethods = ['get','post','put','delete','head','patch','options','trace', 'connect'];
var elemResourceLevelParameters = ['uriParameters','baseUriParameters'];
var elemResourceLevelSecurity = ['securedBy'];
var elemResourceLevelResources = ['New resource'];
var elemResourceLevelTraitsAndTypes = ['is', 'type'];

ShelfElements.prototype.getResourcelevelWithouNewResource = function(){
  return elemResourceLevelDocs.concat(elemResourceLevelMethods,elemResourceLevelParameters,elemResourceLevelSecurity,elemResourceLevelTraitsAndTypes);
};
ShelfElements.prototype.getResourceLevel = function(){
  return elemResourceLevelDocs.concat(elemResourceLevelMethods,elemResourceLevelParameters,elemResourceLevelSecurity,elemResourceLevelResources,elemResourceLevelTraitsAndTypes);
};
ShelfElements.prototype.getResourceLevelDocs = function(){
  return elemResourceLevelDocs;
};
ShelfElements.prototype.getResourceLevelMethods = function(){
  return elemResourceLevelMethods;
};
ShelfElements.prototype.getResourceLevelParameters = function(){
  return elemResourceLevelParameters;
};
ShelfElements.prototype.getResourceLevelSecurity = function(){
  return elemResourceLevelSecurity;
};
ShelfElements.prototype.getResourceLevelResource = function(){
  return elemResourceLevelResources;
};
ShelfElements.prototype.getResourceLevelTraitsAndTypes = function(){
  return elemResourceLevelTraitsAndTypes;
};
//ResourceType root
var elemResourceTypesLevelDocs = ['description', 'displayName']; // missing usage
var elemResourceTypesLevelMethods = ['get','post','put','delete','head','patch','options','trace', 'connect'];
var elemResourceTypesLevelParameters = ['uriParameters','baseUriParameters'];
var elemResourceTypesLevelSecurity = ['securedBy'];
var elemResourceTypesLevelTraitsAndTypes = ['is', 'type'];



ShelfElements.prototype.getResourceTypeLevel = function(){
  return elemResourceTypesLevelDocs.concat(elemResourceTypesLevelMethods,elemResourceTypesLevelParameters,elemResourceTypesLevelSecurity,elemResourceTypesLevelTraitsAndTypes);
};
ShelfElements.prototype.getResourceTypeLevelDocs = function(){
  return elemResourceTypesLevelDocs;
};
ShelfElements.prototype.getResourceTypeLevelMethods = function(){
  return elemResourceTypesLevelMethods;
};
ShelfElements.prototype.getResourceTypeLevelParameters = function(){
  return elemResourceTypesLevelParameters;
};
ShelfElements.prototype.getResourceTypeLevelSecurity = function(){
  return elemResourceTypesLevelSecurity;
};
ShelfElements.prototype.getResourceTypeLevelTraitsAndTypes = function(){
  return elemResourceTypesLevelTraitsAndTypes;
};





exports.ShelfElements = ShelfElements;