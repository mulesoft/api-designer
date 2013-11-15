'use strict';
//var webdriver = require('selenium-webdriver'),    protractor = require('protractor');

function ShelfElements() {}

ShelfElements.prototype = {};
var ramlVersion = '#%RAML 0.8';
//Root Elements
var elementsRootLevelRoot = ['title','version','schemas','baseUri','mediaType','protocols'];
var elementsRootLevelDocs = ['documentation'];
var elementsRootLevelParameters = ['baseUriParameters'];
var elementsRootLevelSecurity = ['securitySchemes', 'securedBy'];
var elementsRootLevelResources = ['New resource'];
var elementsRootLevelTraitsAndTypes = [ 'traits', 'resourceTypes'];
//Named Parameter
var elemNamedParametersLevelDocs = ['displayName', 'description', 'example'];
var elemNamedParametersLevelParameters = ['type','enum', 'pattern', 'minLength', 'maxLength', 'maximum','minimum','required','default'];
//traits
var elementsTraitsLevelRoot =['protocols'];
var elementsTraitsLevelDocs = ['displayName', 'description','usage'];
var elementsTraitsLevelParameters = ['baseUriParameters', 'headers', 'queryParameters'];
var elementsTraitsLevelResponses = ['responses'];
var elementsTraitsLevelSecurity = ['securedBy'];
var elementsTraitsLevelBody = ['body'];
//Methods
var elemMethodLevelRoot = ['protocols'];
var elemMethodLevelDocs = ['description'];
var elemMethodLevelParameters = ['baseUriParameters','headers','queryParameters'];
var elemMethodLevelResponses = ['responses'];
var elemMethodLevelSecurity = ['securedBy'];
var elemMethodLevelTraitsAndTypes = ['is'];
var elemMethodLevelBody = ['body'];
//  Resource level
var elemResourceLevelDocs = ['displayName'];
var elemResourceLevelMethods = ['get','post','put','delete','head','patch','options','trace', 'connect'];
var elemResourceLevelParameters = ['uriParameters','baseUriParameters'];
var elemResourceLevelSecurity = ['securedBy'];
var elemResourceLevelResources = ['New resource'];
var elemResourceLevelTraitsAndTypes = ['is', 'type'];
//Responses
var elementsResponsesLevelDocs = ['description'];
var elementsResponsesLevelBody = ['body'];

//Root Elements
ShelfElements.prototype.getRamlVersion = function(){
  return ramlVersion;
};
ShelfElements.prototype.getRootLevelWithoutNewResource = function (){
  return elementsRootLevelRoot.concat(elementsRootLevelDocs,elementsRootLevelParameters,elementsRootLevelSecurity,elementsRootLevelTraitsAndTypes);
};
ShelfElements.prototype.getRootLevel = function(){
  return elementsRootLevelRoot.concat(elementsRootLevelDocs,elementsRootLevelParameters,elementsRootLevelSecurity,elementsRootLevelResources,elementsRootLevelTraitsAndTypes);
};
ShelfElements.prototype.getRootLevelRoot = function(){
  return elementsRootLevelRoot;
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
//RT Methods
ShelfElements.prototype.getRTMethodsLevel = function (){
  return this.getMethodsLevel().concat('usage');
};
ShelfElements.prototype.getRTMethodsLevelRoot = function (){
  return elemMethodLevelRoot;
};
ShelfElements.prototype.getRTMethodsLevelDocs = function (){
  return elemMethodLevelDocs.concat('usage');
};
ShelfElements.prototype.getRTMethodsLevelParameters = function (){
  return elemMethodLevelParameters;
};
ShelfElements.prototype.getRTMethodsLevelResponses = function (){
  return elemMethodLevelResponses;
};
ShelfElements.prototype.getRTMethodsLevelSecurity = function (){
  return elemMethodLevelSecurity;
};
ShelfElements.prototype.getRTMethodsLevelTraitsAndTypes = function (){
  return elemMethodLevelTraitsAndTypes;
};
ShelfElements.prototype.getRTMethodsLevelBody = function (){
  return elemMethodLevelBody;
};
//  Resource Root
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
ShelfElements.prototype.getResourceTypeLevel = function(){
  return this.getResourceTypeLevelDocs().concat(this.getResourceTypeLevelMethods(),this.getResourceTypeLevelParameters(),this.getResourceTypeLevelSecurity(),this.getResourceTypeLevelTraitsAndTypes());
};
ShelfElements.prototype.getResourceTypeLevelDocs = function(){
  return elemResourceLevelDocs.concat('description','usage');
};
ShelfElements.prototype.getResourceTypeLevelMethods = function(){
  return elemResourceLevelMethods;
};
ShelfElements.prototype.getResourceTypeLevelParameters = function(){
  return elemResourceLevelParameters;
};
ShelfElements.prototype.getResourceTypeLevelSecurity = function(){
  return elemResourceLevelSecurity;
};
ShelfElements.prototype.getResourceTypeLevelTraitsAndTypes = function(){
  return elemResourceLevelTraitsAndTypes;
};
//Responses
ShelfElements.prototype.getResponseLevel = function(){
  return elementsResponsesLevelDocs.concat(elementsResponsesLevelBody);
};
ShelfElements.prototype.getResponseLevelDocs = function(){
  return elementsResponsesLevelDocs;
};
ShelfElements.prototype.getResponseLevelBody = function(){
  return elementsResponsesLevelBody;
};

exports.ShelfElements = ShelfElements;