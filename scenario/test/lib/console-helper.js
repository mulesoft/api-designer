'use strict';
function ConsoleHelper() {}

ConsoleHelper.prototype = {};

ConsoleHelper.prototype.getTitleCss = function(){
  return '#raml-console-api-title';
};

ConsoleHelper.prototype.getListMainResources = function(){
  return browser.findElements(by.css('#raml-console-api-reference h1'));
};

ConsoleHelper.prototype.getListOfResourcesCss = function(){
  return 'div[role=\'resourceSummary\']';
};

ConsoleHelper.prototype.getListResourcesNameCss = function(){
  return 'div[role=\'resourceSummary\'] h3';
};
ConsoleHelper.prototype.getListResourcesName = function(){
  return browser.findElements(by.css('[role=\'resource\'] h3.path'));
};
ConsoleHelper.prototype.getListResourceType = function(){
  return  browser.findElements(by.css('[role="api-console"] [role="resource"] [role="resource-summary"] [role="resource-type"]'));
};

ConsoleHelper.prototype.getListTrait = function(){
  return  browser.findElements(by.css('[role="api-console"] [role="resource"] [role="resource-summary"] [role="trait"]'));
};

ConsoleHelper.prototype.getListMethods = function(){
  return browser.findElements(by.css('[role="api-console"] [role="resource"] [role="resource-summary"] [role="methods"] li'));
};

ConsoleHelper.prototype.getListResources = function(){
//  return browser.findElements(by.css('[role=\'resource\'] h3.path'));
  return browser.findElements(by.css('[role="api-console"] [role="resource"] [role="resource-summary"]'));
};

ConsoleHelper.prototype.getResourceTypeForAResource = function(t){
//  var that = this;
  var resource = this.getListResources();
  console.log('resource t',resource[t]);
  return resource[t].findElements(by.css('.modifiers [role=\'resource-type\']'));
};

ConsoleHelper.prototype.consoleExapndResourceArea = function(t){
//  t is the possition of the resource in the list - starts with 0
  browser.findElements(by.css('[role=\'resource\'] h3.path')[t].click());
};

ConsoleHelper.prototype.getListResourcesDisplayName = function(){
  return browser.findElements(by.css('[ng-show=\'resource.name\']'));
};

ConsoleHelper.prototype.getListOfMethodByResourceCss = function(){
    //$('[role=\'resourceSummary\']').filter(function(){ return /^\s+\/classes\s*$/.test($(this).find("h2").text());})
};



exports.ConsoleHelper = ConsoleHelper;