'use strict';
function ConsoleHelper() {
  this.titleCss = '#raml-console-api-title';
  this.listMainResourcesCss = '#raml-console-api-reference h1';
  this.listResourceDescriptionCss = '[role=\'description\'] p';
  this.listResourcesCss = '[role="resource"]';
  this.listResourcesNameCss = '[role=\'resource\'] h3.path';
  this.listResourceRTCss = '[role="api-console"] [role="resource"] [role="resource-summary"] [role="resource-type"]';
  this.listResourceTraitsCss = '[role="api-console"] [role="resource"] [role="resource-summary"] [role="trait"]';
  this.listResourceMethodsCss = '[role="api-console"] [role="resource"] [role="resource-summary"] [role="methods"] li';
}

ConsoleHelper.prototype = {};

ConsoleHelper.prototype.getListMainResources = function(){
  var that = this;
  return browser.findElements(by.css(that.listMainResourcesCss));
};
ConsoleHelper.prototype.getListResourcesDescription = function(){
  var that = this;
  return browser.findElements(by.css(that.listResourceDescriptionCss));
};
ConsoleHelper.prototype.getListResourcesName = function(){
  var that = this;
  return browser.findElements(by.css(that.listResourcesNameCss));
};
ConsoleHelper.prototype.getListResourceType = function(){
  var that = this;
  return  browser.findElements(by.css(that.listResourceRTCss));
};
ConsoleHelper.prototype.getListTrait = function(){
  var that = this;
  return  browser.findElements(by.css(that.listResourceTraitsCss));
};
ConsoleHelper.prototype.getListMethods = function(){
  var that = this ;
  return browser.findElements(by.css(that.listResourceMethodsCss));
};
ConsoleHelper.prototype.getListResources = function(){
  var that = this;
  return browser.findElements(by.css(that.listResourcesCss));
};
ConsoleHelper.prototype.getResourceTypeForAResource = function(t){
//  var that = this;
  var resource = this.getListResources();
  return resource[t].findElements(by.css('.modifiers [role=\'resource-type\']'));
};

ConsoleHelper.prototype.getListResourcesDisplayName = function(){
  return browser.findElements(by.css('[ng-show=\'resource.name\']'));
};

ConsoleHelper.prototype.getListOfMethodByResourceCss = function(){
    //$('[role=\'resourceSummary\']').filter(function(){ return /^\s+\/classes\s*$/.test($(this).find("h2").text());})
};

ConsoleHelper.prototype.expandResourcebyPos = function(pos){
  var that = this;
  pos--;
//send 0 to expand all.
  browser.findElements(by.css(that.listResourcesNameCss)).then(function(resources){

    if(pos === -1){
      resources.forEach(function(resource){
        resource.click();
      });
    }else{
      resources[pos].click();
    }
  });
};

exports.ConsoleHelper = ConsoleHelper;