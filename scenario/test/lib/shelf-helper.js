'use strict';
function ShelfHelper() {
  this.elemRamlVersion = ['#%RAML 0.8'];
//Root Elements
  this.elemRootLevelRoot = ['baseUri','mediaType','protocols','title','version'];
  this.elemRootLevelDocs = ['documentation'];
  this.elemRootLevelParameters = ['baseUriParameters'];
  this.elemRootLevelSecurity = ['securedBy','securitySchemes'];
  this.elemRootLevelResources = ['<resource>'];
  this.elemRootLevelTraitsAndTypes = ['resourceTypes','traits'];
  this.elemRootLevelSchemas = ['schemas'];
  this.elemRootLevel = this.elemRootLevelRoot.concat(this.elemRootLevelDocs,this.elemRootLevelParameters,this.elemRootLevelSecurity,this.elemRootLevelResources,this.elemRootLevelTraitsAndTypes,this.elemRootLevelSchemas);
  this.elemRootLevelWithoutNewResource = this.elemRootLevelRoot.concat(this.elemRootLevelDocs,this.elemRootLevelParameters,this.elemRootLevelSecurity,this.elemRootLevelTraitsAndTypes,this.elemRootLevelSchemas);
//Named Parameter
  this.elemNamedParametersLevelDocs = ['description','displayName','example'];
  this.elemNamedParametersLevelParameters = ['default','enum', 'maximum','maxLength','minimum','minLength','pattern','required','type'];
  this.elemNamedParametersLevel = this.elemNamedParametersLevelDocs.concat(this.elemNamedParametersLevelParameters);
//traits
  this.elemTraitsLevelRoot =['protocols'];
  this.elemTraitsLevelDocs = ['description','displayName','usage'];
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
  this.elemRtMethodLevelDocs = this.elemMethodLevelDocs;
  this.elemRtMethodLevelParameters = this.elemMethodLevelParameters;
  this.elemRtMethodLevelResponses = this.elemMethodLevelResponses;
  this.elemRtMethodLevelSecurity = this.elemMethodLevelSecurity;
  this.elemRtMethodLevelTraitsAndTypes = this.elemMethodLevelTraitsAndTypes;
  this.elemRtMethodLevelBody = this.elemMethodLevelBody;
  this.elemRtMethodLevel = this.elemRtMethodLevelRoot.concat(this.elemRtMethodLevelDocs,this.elemRtMethodLevelParameters,this.elemRtMethodLevelResponses,this.elemRtMethodLevelSecurity,this.elemRtMethodLevelTraitsAndTypes,this.elemRtMethodLevelBody);
//  Resource Root
  this.elemResourceLevelDocs = ['description','displayName'];
  this.elemResourceLevelMethods = ['get','post','put','delete','head','patch','options','trace', 'connect'];
  this.elemResourceLevelParameters = ['uriParameters','baseUriParameters'];
  this.elemResourceLevelSecurity = ['securedBy'];
  this.elemResourceLevelResources = ['<resource>'];
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

  this.elemlistCss = '[ng-repeat=\'item in section.items\'] span';
}

ShelfHelper.prototype = {};

ShelfHelper.prototype.getElements = function(){
  var that = this;
  return browser.findElements(by.css(that.elemlistCss));
};

ShelfHelper.prototype.selectFirstElem = function(){
  var that = this;
  return browser.wait(function(){
    return browser.isElementPresent(by.css(that.elemlistCss));
  }).then(function () {
    that.getElements().then(function(list){
      list[0].click();
    });
  });
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

