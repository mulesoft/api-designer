'use strict';
var webdriver = require('selenium-webdriver');
function ShelfHelper() {
  this.elemRamlVersion = ['#%RAML 0.8'];
  this.elemRamlByGroup = '';
//Root Elements
  this.elemRootLevelRoot = ['baseUri','mediaType','protocols','title','version'];
  this.elemRootLevelDocs = ['documentation'];
  this.elemRootLevelParameters = ['baseUriParameters'];
  this.elemRootLevelSecurity = ['securedBy','securitySchemes'];
  this.elemRootLevelResources = ['New Resource'];
  this.elemRootLevelTraitsAndTypes = ['resourceTypes','traits'];
  this.elemRootLevelSchemas = ['schemas'];
  this.elemRootLevel = this.elemRootLevelRoot.concat(this.elemRootLevelDocs,this.elemRootLevelParameters,this.elemRootLevelSecurity,this.elemRootLevelResources,this.elemRootLevelTraitsAndTypes,this.elemRootLevelSchemas);
  this.elemRootLevelWithoutNewResource = this.elemRootLevelRoot.concat(this.elemRootLevelDocs,this.elemRootLevelParameters,this.elemRootLevelSecurity,this.elemRootLevelTraitsAndTypes,this.elemRootLevelSchemas);
  this.elemRootByGroup = ' root (5) baseUrimediaTypeprotocolstitleversion docs (1) documentation parameters (1) baseUriParameters security (2) securedBysecuritySchemes resources (1) New Resource traits and types (2) resourceTypestraits schemas (1) schemas ';
//Named Parameter
  this.elemNamedParametersLevelDocs = ['description','displayName','example'];
  this.elemNamedParametersLevelParameters = ['default','enum','maxLength','maximum','minLength','minimum','pattern','required','type'];
  this.elemNamedParametersLevel = this.elemNamedParametersLevelDocs.concat(this.elemNamedParametersLevelParameters);
  this.elemNamedParametersByGroups = ' docs (3) descriptiondisplayNameexample parameters (9) defaultenummaxLengthmaximumminLengthminimumpatternrequiredtype ';
//traits
  this.elemTraitsLevelRoot =['protocols'];
  this.elemTraitsLevelDocs = ['description','displayName','usage'];
  this.elemTraitsLevelParameters = ['baseUriParameters', 'headers', 'queryParameters'];
  this.elemTraitsLevelResponses = ['responses'];
  this.elemTraitsLevelSecurity = ['securedBy'];
  this.elemTraitsLevelBody = ['body'];
  this.elemTraitsLevel = this.elemTraitsLevelRoot.concat(this.elemTraitsLevelDocs,this.elemTraitsLevelParameters, this.elemTraitsLevelResponses,this.elemTraitsLevelSecurity,this.elemTraitsLevelBody);
  this.elemTraitsByGroup = ' root (1) protocols docs (3) descriptiondisplayNameusage parameters (3) baseUriParametersheadersqueryParameters responses (1) responses security (1) securedBy body (1) body ';
//Methods
  this.elemMethodLevelRoot = ['protocols'];
  this.elemMethodLevelDocs = ['description'];
  this.elemMethodLevelParameters = ['baseUriParameters','headers','queryParameters'];
  this.elemMethodLevelResponses = ['responses'];
  this.elemMethodLevelSecurity = ['securedBy'];
  this.elemMethodLevelTraitsAndTypes = ['is'];
  this.elemMethodLevelBody = ['body'];
  this.elemMethodLevel = this.elemMethodLevelRoot.concat(this.elemMethodLevelDocs,this.elemMethodLevelParameters,this.elemMethodLevelResponses,this.elemMethodLevelSecurity,this.elemMethodLevelTraitsAndTypes,this.elemMethodLevelBody);
  this.elemMethodByGroup = ' root (1) protocols docs (1) description parameters (3) baseUriParametersheadersqueryParameters responses (1) responses security (1) securedBy traits and types (1) is body (1) body ';
//  RT Methods
  this.elemRtMethodLevelRoot = this.elemMethodLevelRoot;
  this.elemRtMethodLevelDocs = this.elemMethodLevelDocs;
  this.elemRtMethodLevelParameters = this.elemMethodLevelParameters;
  this.elemRtMethodLevelResponses = this.elemMethodLevelResponses;
  this.elemRtMethodLevelSecurity = this.elemMethodLevelSecurity;
  this.elemRtMethodLevelTraitsAndTypes = this.elemMethodLevelTraitsAndTypes;
  this.elemRtMethodLevelBody = this.elemMethodLevelBody;
  this.elemRtMethodLevel = this.elemRtMethodLevelRoot.concat(this.elemRtMethodLevelDocs,this.elemRtMethodLevelParameters,this.elemRtMethodLevelResponses,this.elemRtMethodLevelSecurity,this.elemRtMethodLevelTraitsAndTypes,this.elemRtMethodLevelBody);
  this.elemRtMethodByGroup = ' root (1) protocols docs (1) description parameters (3) baseUriParametersheadersqueryParameters responses (1) responses security (1) securedBy traits and types (1) is body (1) body ';
//  Resource Root
  this.elemResourceLevelDocs = ['description','displayName'];
  this.elemResourceLevelMethods = ['connect','delete','get','head','options','patch','post','put','trace'];
  this.elemResourceLevelParameters = ['baseUriParameters','uriParameters'];
  this.elemResourceLevelSecurity = ['securedBy'];
  this.elemResourceLevelResources = ['New Resource'];
  this.elemResourceLevelTraitsAndTypes = ['is', 'type'];
  this.elemResourceLevel = this.elemResourceLevelDocs.concat(this.elemResourceLevelMethods,this.elemResourceLevelParameters,this.elemResourceLevelSecurity,this.elemResourceLevelResources,this.elemResourceLevelTraitsAndTypes);
  this.elemResourceLevelWithoutNewReosurce = this.elemResourceLevelDocs.concat(this.elemResourceLevelMethods,this.elemResourceLevelParameters,this.elemResourceLevelSecurity,this.elemResourceLevelTraitsAndTypes);
  this.elemResourceByGroup = ' docs (2) descriptiondisplayName methods (9) connectdeletegetheadoptionspatchpostputtrace parameters (2) baseUriParametersuriParameters security (1) securedBy resources (1) New Resource traits and types (2) istype ';
//  RT root
  this.elemResourceTypeLevelDocs = this.elemResourceLevelDocs.concat('usage');
  this.elemResourceTypeLevelMethods = this.elemResourceLevelMethods;
  this.elemResourceTypeLevelParameters = this.elemResourceLevelParameters;
  this.elemResourceTypeLevelSecurity = this.elemResourceLevelSecurity;
  this.elemResourceTypeLevelTraitsAndTypes = this.elemResourceLevelTraitsAndTypes;
  this.elemResourceTypeLevel = this.elemResourceTypeLevelDocs.concat(this.elemResourceTypeLevelMethods,this.elemResourceTypeLevelParameters,this.elemResourceTypeLevelSecurity,this.elemResourceTypeLevelTraitsAndTypes);
  this.elemResourceTypeTypeByGroup = ' docs (3) descriptiondisplayNameusage methods (9) connectdeletegetheadoptionspatchpostputtrace parameters (2) baseUriParametersuriParameters security (1) securedBy traits and types (2) istype ';
//Responses
  this.elemResponsesLevelDocs = ['description'];
  this.elemResponsesLevelBody = ['body'];
  this.elemResponsesLevel = this.elemResponsesLevelDocs.concat(this.elemResponsesLevelBody);
  this.elemResponsesByGroup = ' docs (1) description responses (1) body ';
// body
  this.elemBodyLevelDocs = ['application/json', 'application/x-www-form-urlencoded', 'application/xml', 'multipart/form-data' ];
  this.elemBodyLevel = this.elemBodyLevelDocs;
  this.elemBodyByGroup = '';

// Documentation
  this.elemDocumentationLevelDocs = ['content','title'];
  this.elemDocumentationLevel = this.elemDocumentationLevelDocs;
//  protocols
  this.elemProtocolsLevel = ['HTTP', 'HTTPS'];
  this.elemProtocolsByGroup = ' (2) HTTPHTTPS ';

  this.elemlistCss = '[ng-repeat=\'item in section.items\'] span';

}

ShelfHelper.prototype = {};

ShelfHelper.prototype.getElementsPromise = function getElementsPromise(){
  var that = this;
  return element.all(by.css(that.elemlistCss));
};

ShelfHelper.prototype.getElements = function getElements(){
  return browser.executeScript(function () {
    var list = [];
    $('[ng-repeat="item in section.items"] span').text(function( index,text ) {
      list[index] =text;
    });
    return list;
  });
};

ShelfHelper.prototype.selectFirstElem = function selectFirstElem(){
  var that = this;
  return browser.wait(function(){
    return browser.isElementPresent(by.css(that.elemlistCss));
  }).then(function () {
    that.getElementsPromise().then(function(list){
      list[0].click();
    });
  });
};

ShelfHelper.prototype.clickShelfElemByPos = function clickShelfElemByPos(pos){
  var that = this;
  var d = webdriver.promise.defer();
  browser.wait(function(){
    return browser.isElementPresent(by.css(that.elemlistCss));
  }).then(function(){
    that.getElementsPromise().then(function(list){
      list[pos].click().then(function(){
        d.fulfill('done');
      },function(){
        d.fulfill('error');
      });
    });
  });
  return d.promise;
};

ShelfHelper.prototype.selectShelfElemByPos = function selectShelfElemByPos(pos){
  this.clickShelfElemByPos(pos).then(function(text){
    expect(text).toEqual('done');
  });
};

ShelfHelper.prototype.getElementsByGroup = function getElementsByGroup(group){
  return element.all(by.css('.'+group+' ul li span'));
};

ShelfHelper.prototype.getSections = function getSections(){
  return element.all(by.css('[role=\'section\']'));
};

ShelfHelper.prototype.itemsInSection = function itemsInSection(){
  return '[role=\'items\'] li span';
};


ShelfHelper.prototype.getTextFromShelf = function getTextFromShelf(){
  return element.all(by.css('[role=\'shelf-container\']'));
};

exports.ShelfHelper = ShelfHelper;


