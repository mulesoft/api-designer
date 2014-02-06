'use strict';
function ConsoleHelper() {
  this.methodsList = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'trace', 'connect'];
  this.titleCss = '#raml-console-api-title';
  this.listMainResourcesCss = '#raml-console-api-reference h1';
  this.listResourceDescriptionCss = '[role=\'description\'] p';
  this.listResourcesCss = '[role="resource"]';
  this.listResourcesNameCss = '[role=\'resource\'] h3.path';
  this.listResourceRTCss = '[role="api-console"] [role="resource"] [role="resource-summary"] [role="resource-type"]';
  this.listResourceTraitsCss = '[role="api-console"] [role="resource"] [role="resource-summary"] [role="trait"]';
  this.listResourceMethodsCss = '[role="api-console"] [role="resource"] [role="resource-summary"] [role="methods"] li';
//  this.methodDocumentationArea = '[role="api-console"] [role="resource"] [role="method"] [ng-show="methodView.expanded"] .documentation';
  this.ListOftabs = '[role="api-console"] [role="resource"] [role="method"] [ng-show="methodView.expanded"] .documentation div ul li a';
  this.documentationSectionlistCss = '[role="api-console"] div [role="root-documentation"] section';
  this.consoleSection = '#consoleAndEditor';
}

ConsoleHelper.prototype = {};

ConsoleHelper.prototype.toggleDocumentationApiReference = function toggleDocumentationApiReference(view){
  var button = browser.findElement(by.css('[role="api-console"] nav a'));
  if (view === 'api'){
    expect(button.getAttribute('ng-click')).toEqual('ramlConsole.gotoView("apiReference")');
    button.click();
  }else {
    if (view ==='documentation'){
      expect(button.getAttribute('ng-click')).toEqual('ramlConsole.gotoView("rootDocumentation")');
      button.click();
    }
  }
};

ConsoleHelper.prototype.getDocumentationSections = function getDocumentationSections(){
  return browser.findElements(by.css(this.documentationSectionlistCss));
};

ConsoleHelper.prototype.getListMainResources = function getListMainResources(){
  var that = this;
  return browser.findElements(by.css(that.listMainResourcesCss));
};

ConsoleHelper.prototype.getListResourcesDescription = function getListResourcesDescription(){
  var that = this;
  return browser.findElements(by.css(that.listResourceDescriptionCss));
};

ConsoleHelper.prototype.getListResourcesName = function getListResourcesName(){
  var that = this;
  return browser.findElements(by.css(that.listResourcesNameCss));
};

ConsoleHelper.prototype.getListResourceType = function getListResourceType(){
  var that = this;
  return  browser.findElements(by.css(that.listResourceRTCss));
};
ConsoleHelper.prototype.getListTrait = function getListTrait(){
  var that = this;
  return  browser.findElements(by.css(that.listResourceTraitsCss));
};
ConsoleHelper.prototype.getListMethods = function getListMethods(){
  var that = this ;
  return browser.findElements(by.css(that.listResourceMethodsCss));
};
ConsoleHelper.prototype.getListResources = function getListResources(){
  var that = this;
  return browser.findElements(by.css(that.listResourcesCss));
};
ConsoleHelper.prototype.getResourceTypeForAResource = function getResourceTypeForAResource(t){
//  var that = this;
  var resource = this.getListResources();
  return resource[t].findElements(by.css('.modifiers [role=\'resource-type\']'));
};

ConsoleHelper.prototype.getListResourcesDisplayName = function getListResourcesDisplayName(){
  return browser.findElements(by.css('[ng-show=\'resource.name\']'));
};

ConsoleHelper.prototype.getListOfMethodByResourceCss = function getListOfMethodByResourceCss(){
    //$('[role=\'resourceSummary\']').filter(function(){ return /^\s+\/classes\s*$/.test($(this).find("h2").text());})
};

ConsoleHelper.prototype.expandCollapseMainResourcebyPos = function expandCollapseMainResourcebyPos(pos){
//  resource needed to be expanded.
  pos--;
//send 0 to expand all.
  if(pos ===-1){
    browser.executeScript(function(){
      $('#raml-console-api-reference h1').click();
    });
  }else{
    browser.findElements(by.css('#raml-console-api-reference h1')).then(function(mainResources){
      mainResources[pos].click();
    });
  }
};

ConsoleHelper.prototype.areResourceGroupsExpanded = function areResourceGroupsExpanded(){
  browser.findElements(by.css('#raml-console-api-reference [role="resource-group"] div[ng-transclude]')).then(function(groups){
    groups.forEach(function(group){
      expect(group.getAttribute('class')).toMatch('expanded');
    });
  });
};

ConsoleHelper.prototype.areResourceGroupsCollapsed = function areResourceGroupsCollapsed(){
  browser.findElements(by.css('#raml-console-api-reference [role="resource-group"] div[ng-transclude]')).then(function(groups){
    groups.forEach(function(group){
      expect(group.getAttribute('class')).toMatch('collapsed');
    });
  });
};

ConsoleHelper.prototype.expandCollapseResourcebyPos = function expandCollapseResourcebyPos(pos){
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

ConsoleHelper.prototype.expandCollpaseMethodsbyPos = function expandCollpaseMethodsbyPos(pos){
//  resource needed to be expanded.
  pos--;
//send 0 to expand all.
  if(pos ===-1){
    browser.executeScript(function(){
      $('[role="api-console"] [role="resource"] [role="method"] [role="methodSummary"]').click();
    });
  }else{
    browser.findElements(by.css('[role="api-console"] [role="resource"] [role="method"] [role="methodSummary"]')).then(function(methods){
      methods[pos].click();
    });
  }
};

ConsoleHelper.prototype.selectTab = function selectTab(pos){
  var that = this;
  // 0 - request, 1- responses, 2 try it
  browser.findElements(by.css(that.ListOftabs)).then(function(tab){
    tab[pos].click();
  });
};

ConsoleHelper.prototype.getListOfMethods = function getListOfMethods(){
  //works for collapsed and expanded console.
  return browser.executeScript(function () {
    var list = [];
    $('[role="api-console"] [role="resource"] [role="resource-summary"] [role="methods"] li').text(function( index,text ) {
      list[index] =text;
    });
    return list;
  });
};

ConsoleHelper.prototype.getListOfMethodsDescriptionCollapsed = function getListOfMethodsDescriptionCollapsed(){
  var webdriver = require('selenium-webdriver');
  var d = webdriver.promise.defer();
  browser.executeScript(function () {
    var dic = {};
    var keys = [];
    $('[role="api-console"] [role="resource"] [role="methodSummary"] [role="verb"]').text(function( index,text ) {
      dic[text]='';
      keys[index]=text;
    });
    $('[role="api-console"] [role="resource"] [role="methodSummary"] [role="description"] p').text(function( index,text ) {
      dic[keys[index]]=text;
    });
    return dic;
  }).then(function(dic){
      d.fulfill(dic);
    });
  return d.promise;
};

ConsoleHelper.prototype.getListOfMethodsDescriptionExpanded = function getListOfMethodsDescriptionExpanded(){
  var webdriver = require('selenium-webdriver');
  var d = webdriver.promise.defer();
  browser.executeScript(function () {
    var dic = {};
    var keys = [];
    $('[role="api-console"] [role="resource"] [role="methodSummary"] [role="verb"]').text(function( index,text ) {
      dic[text]='';
      keys[index]=text;
    });
    $('[role="api-console"] [role="resource"] [role="method"] [ng-show="methodView.expanded"] .documentation [role="full-description"]').text(function( index,text ) {
      dic[keys[index]]=text;
    });
    return dic;
  }).then(function(dic){
      d.fulfill(dic);
    });
  return d.promise;
};

ConsoleHelper.prototype.getResourcesResourceType = function getResourcesResourceType(){
  var webdriver = require('selenium-webdriver');
  var d = webdriver.promise.defer();
  browser.executeScript(function () {
    var dic = {};
    var keys = [];
    $('[role=\'resource\'] h3.path').text(function( index,text ) {
      var texto = text.replace(/\s+/g,'');
      dic[texto]='';
      keys[index]=texto;
    });
    $('[role="api-console"] [role="resource"] [role="resource-summary"] [role="resource-type"]').text(function( index,text ) {
      dic[keys[index]]=text.replace(/\s+/g,'');
    });
    return dic;
  }).then(function(dic){
      d.fulfill(dic);
    });
  return d.promise;
};

//ConsoleHelper.prototype.getResourcesTraits = function(){
//  var webdriver = require('selenium-webdriver');
//  var d = webdriver.promise.defer();
//
//  browser.executeScript(function () {
//    var dic = {};
//    var keys = [];
//    $('[role=\'resource\'] h3.path').text(function( index,text ) {
//      var texto = text.replace(/\s+/g,'');
//      dic[texto]='';
//      keys[index]=texto;
//    });
//    $('[role="api-console"] [role="resource"] [role="resource-summary"] [role="trait"]').text(function( index,text ) {
//      dic[keys[index]]=text.replace(/\s+/g,'');
//    });
//    return dic;
//  }).then(function(dic){
//      d.fulfill(dic);
//    });
//  return d.promise;
//};

ConsoleHelper.prototype.getMethodsTraits = function getMethodsTraits(){
  var webdriver = require('selenium-webdriver');
  var d = webdriver.promise.defer();
  browser.executeScript(function () {
    var dic = {};
    var keys = [];
    $('[role="api-console"] [role="resource"] [role="methodSummary"] [role="verb"]').text(function( index,text ) {
      dic[text]='';
      keys[index]=text;
    });
    $('[role="api-console"] [role="resource"] [role="method"] [ng-show="methodView.expanded"] .documentation [role="traits"]').text(function( index,text ) {
      dic[keys[index]]=text.replace(/\s+/g,' ');
    });
    return dic;
  }).then(function(dic){
      d.fulfill(dic);
    });
  return d.promise;
};
exports.ConsoleHelper = ConsoleHelper;