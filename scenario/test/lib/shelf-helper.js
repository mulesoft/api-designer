'use strict';
function ShelfHelper() {
  this.elemRamlVersion = ['#%RAML 0.8'];
//Root Elements
  this.elemRootLevelRoot = ['title','version','schemas','baseUri','mediaType','protocols'];
  this.elemRootLevelDocs = ['documentation'];
  this.elemRootLevelParameters = ['baseUriParameters'];
  this.elemRootLevelSecurity = ['securitySchemes', 'securedBy'];
  this.elemRootLevelResources = ['New resource'];
  this.elemRootLevelTraitsAndTypes = [ 'traits', 'resourceTypes'];
  this.elemRootLevel = this.elemRootLevelRoot.concat(this.elemRootLevelDocs,this.elemRootLevelParameters,this.elemRootLevelSecurity,this.elemRootLevelResources,this.elemRootLevelTraitsAndTypes);
  this.elemRootLevelWithoutNewResource = this.elemRootLevelRoot.concat(this.elemRootLevelDocs,this.elemRootLevelParameters,this.elemRootLevelSecurity,this.elemRootLevelTraitsAndTypes);
//Named Parameter
  this.elemNamedParametersLevelDocs = ['displayName', 'description', 'example'];
  this.elemNamedParametersLevelParameters = ['type','enum', 'pattern', 'minLength', 'maxLength', 'maximum','minimum','required','default'];
  this.elemNamedParametersLevel = this.elemNamedParametersLevelDocs.concat(this.elemNamedParametersLevelParameters);
//traits
  this.elemTraitsLevelRoot =['protocols'];
  this.elemTraitsLevelDocs = ['displayName', 'description','usage'];
  this.elemTraitsLevelParameters = ['baseUriParameters', 'headers', 'queryParameters'];
  this.elemTraitsLevelResponses = ['responses'];
  this.elemTraitsLevelSecurity = ['securedBy'];
  this.elemTraitsLevelBody = ['body'];
  this.elemTraitsLevel = this.elemTraitsLevelRoot.concat(this.elemTraitsLevelDocs,this.elemTraitsLevelParameters, this.elemTraitsLevelResponses,this.elemTraitsLevelSecurity,this.elemTraitsLevelBody);
//Methods
  this.elemMethodLevelRoot = ['protocols'];
  this.elemMethodLevelDocs = ['description'];
  this.elemMethodLevelParameters = ['baseUriParameters','headers','queryParameters'];
  this.elemMethodLevelResponses = ['responses'];
  this.elemMethodLevelSecurity = ['securedBy'];
  this.elemMethodLevelTraitsAndTypes = ['is'];
  this.elemMethodLevelBody = ['body'];
  this.elemMethodLevel = this.elemMethodLevelRoot.concat(this.elemMethodLevelDocs,this.elemMethodLevelParameters,this.elemMethodLevelResponses,this.elemMethodLevelSecurity,this.elemMethodLevelTraitsAndTypes,this.elemMethodLevelBody);
//  RT Methods
  this.elemRtMethodLevelRoot = this.elemMethodLevelRoot;
  this.elemRtMethodLevelDocs = this.elemMethodLevelDocs.concat('usage');
  this.elemRtMethodLevelParameters = this.elemMethodLevelParameters;
  this.elemRtMethodLevelResponses = this.elemMethodLevelResponses;
  this.elemRtMethodLevelSecurity = this.elemMethodLevelSecurity;
  this.elemRtMethodLevelTraitsAndTypes = this.elemMethodLevelTraitsAndTypes;
  this.elemRtMethodLevelBody = this.elemMethodLevelBody;
  this.elemRtMethodLevel = this.elemRtMethodLevelRoot.concat(this.elemRtMethodLevelDocs,this.elemRtMethodLevelParameters,this.elemRtMethodLevelResponses,this.elemRtMethodLevelSecurity,this.elemRtMethodLevelTraitsAndTypes,this.elemRtMethodLevelBody);
//  Resource Root
  this.elemResourceLevelDocs = ['displayName','description'];
  this.elemResourceLevelMethods = ['get','post','put','delete','head','patch','options','trace', 'connect'];
  this.elemResourceLevelParameters = ['uriParameters','baseUriParameters'];
  this.elemResourceLevelSecurity = ['securedBy'];
  this.elemResourceLevelResources = ['New resource'];
  this.elemResourceLevelTraitsAndTypes = ['is', 'type'];
  this.elemResourceLevel = this.elemResourceLevelDocs.concat(this.elemResourceLevelMethods,this.elemResourceLevelParameters,this.elemResourceLevelSecurity,this.elemResourceLevelResources,this.elemResourceLevelTraitsAndTypes);
  this.elemResourceLevelWithoutNewReosurce = this.elemResourceLevelDocs.concat(this.elemResourceLevelMethods,this.elemResourceLevelParameters,this.elemResourceLevelSecurity,this.elemResourceLevelTraitsAndTypes);
//  RT root
  this.elemResourceTypeLevelDocs = this.elemResourceLevelDocs.concat('usage');
  this.elemResourceTypeLevelMethods = this.elemResourceLevelMethods;
  this.elemResourceTypeLevelParameters = this.elemResourceLevelParameters;
  this.elemResourceTypeLevelSecurity = this.elemResourceLevelSecurity;
  this.elemResourceTypeLevelTraitsAndTypes = this.elemResourceLevelTraitsAndTypes;
  this.elemResourceTypeLevel = this.elemResourceTypeLevelDocs.concat(this.elemResourceTypeLevelMethods,this.elemResourceTypeLevelParameters,this.elemResourceTypeLevelSecurity,this.elemResourceTypeLevelTraitsAndTypes);
//Responses
  this.elemResponsesLevelDocs = ['description'];
  this.elemResponsesLevelBody = ['body'];
  this.elemResponsesLevel = this.elemResponsesLevelDocs.concat(this.elemResponsesLevelBody);
// body
  this.elemBodyLevelDocs = ['application/x-www-form-urlencoded','multipart/form-data','application/json', 'application/xml' ];
  this.elemBodyLevel = this.elemBodyLevelDocs;
}

ShelfHelper.prototype = {};

ShelfHelper.prototype.getElements = function(){
  return browser.findElements(by.css('[ng-repeat=\'item in section.items\'] span'));
};

ShelfHelper.prototype.getElementsByGroup = function(group){
  return browser.findElements(by.css('.'+group+' ul li span'));
};

ShelfHelper.prototype.getSections = function(){
  return browser.findElements(by.css('[role=\'section\']'));
};

ShelfHelper.prototype.itemsInSection = function(){
  return '[role=\'items\'] li span';
};

exports.ShelfHelper = ShelfHelper;

