'use strict';
var webdriver = require('selenium-webdriver');

function ConsoleHelper() {
  this.methodsList = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'trace', 'connect'];
  this.titleCss = '#raml-console-api-title';
  this.listMainResourcesCss = '#raml-console-api-reference [role="resource-group"] [role="resource-placeholder"]:first-of-type h3';
  this.listResourceDescriptionCss = '[role=\'description\'] p';
  this.listResourcesCss = '[role="resource"]';
  this.listResourcesNameCss = '[role=\'resource\'] h3.path';
  this.listResourceRTCss = '[role="api-console"] [role="resource"] [role="resource-summary"] [role="resource-type"]';
  this.listResourceTraitsCss = '[role="api-console"] [role="resource"] [role="resource-summary"] [role="trait"]';
  this.listResourceMethodsCss = '[role="api-console"] [role="resource"] [role="resource-summary"] [role="methods"] li';
//  this.methodDocumentationArea = '[role="api-console"] [role="resource"] [role="method"] [ng-show="methodView.expanded"] .documentation';
  this.documentationSectionlistCss = '[role="api-console"] div [role="root-documentation"] section';
  this.consoleSection = '#consoleAndEditor';
  this.expandAll = '.toggle-resource-groups [role="expand-all"]';
  this.collapseAll ='.toggle-resource-groups [role="collapse-all"]';
  this.resourceGroupExpandedClass  = 'resource-group ng-scope expanded';
  this.resourceGroupCollapsedClass = 'resource-group ng-scope collapsed';
//  this.currentmethod = '[role="api-console"] [role="resource"] [role="methodSummary"] [role="verb"]';
  this.currentmethod = '[role="api-console"] [role="method"] .nav [class="ng-scope disabled"]:first-of-type a';
  this.currentEnableTabs = '[role="api-console"] [role="method"] .nav [class="ng-scope"] a';
  this.currentDisabledTabs = '[role="api-console"] [role="method"] .nav [class="ng-scope disabled"] a';
  this.activeTab = '[role="api-console"] [role="method"] .nav [class="ng-scope active"] a';

//  this.closeMethodbtn = '[role="resource"] div i[class="icon-remove collapse"]';
  this.methodDescriptionCss = '[role="method"] [role="full-description"] p' ;

//  tabs
  this.requestTab = '[role="method"] .tab-content [role="documentation-requests"]';
  //request
    //headers
  this.requestTabHeaders = '[role="method"] .tab-content [role="documentation-requests"] [heading="Headers"]';
  this.requestTabHeadersh2 = '[role="method"] .tab-content [role="documentation-requests"] [heading="Headers"] section h2';
  this.requestTabHeadersListDisplayName = '[heading="Headers"] [role="parameter"] [ng-repeat="definition in parameter"] [role="display-name"]';
  this.requestTabHeadersConstraints = '[heading="Headers"] [role="parameter"] [ng-repeat="definition in parameter"] .constraints';
  this.requestTabHeadersDescription = '[heading="Headers"] [role="parameter"] [ng-repeat="definition in parameter"] .info [role="description"]';
  this.requestTabUriParameters = '[role="method"] .tab-content [role="documentation-requests"] [heading="URI Parameters"]';
  this.requestTabQuertParameters = '[role="method"] .tab-content [role="documentation-requests"] [heading="Query Parameters"]';
  this.requestTabBodyDocmentation = '[role="method"] .tab-content [role="documentation-requests"] .body-documentation';

  this.responseTab = '';
  this.tryitTab = '';
}


ConsoleHelper.prototype = {};

// Resource Groups - start

ConsoleHelper.prototype.expandCollapseAllResourcesGroupPromise = function expandCollapseAllResourcesGroupPromise(expandCollapse){
  var d = webdriver.promise.defer();
  if (expandCollapse === 'collapse'){
    browser.$(this.collapseAll).click();
    d.fulfill();
  }else{
    if (expandCollapse ==='expand'){
      browser.$(this.expandAll).click();
      d.fulfill();
    }else{
      console.log('invalid option - should be collapse/expand');
      d.fulfill();
    }
  }
  return d.promise;
};

// Resource Groups - end

// Documentation section - stars

ConsoleHelper.prototype.toggleDocumentationApiReference = function toggleDocumentationApiReference(view){
  var button = $('[role="api-console"] nav a');
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
  return element.all(by.css(this.documentationSectionlistCss));
};

// Documentation section - ends

ConsoleHelper.prototype.getListMainResources = function getListMainResources(){
//  var that = this;
  return element.all(by.css(this.listMainResourcesCss));
};

ConsoleHelper.prototype.getListMainResourcesName = function getListMainResourcesName(){
  var that = this;
  return element.all(by.css(that.listMainResourcesCss));
};

ConsoleHelper.prototype.getListResourcesDescription = function getListResourcesDescription(){
  var that = this;
  return element.all(by.css(that.listResourceDescriptionCss));
};

ConsoleHelper.prototype.getListResourcesName = function getListResourcesName(){
  var that = this;
  return element.all(by.css(that.listResourcesNameCss));
};

ConsoleHelper.prototype.getListResourceType = function getListResourceType(){
  var that = this;
  return  element.all(by.css(that.listResourceRTCss));
};
ConsoleHelper.prototype.getListTrait = function getListTrait(){
  var that = this;
  return  element.all(by.css(that.listResourceTraitsCss));
};
ConsoleHelper.prototype.getListMethods = function getListMethods(){
  var that = this ;
  return element.all(by.css(that.listResourceMethodsCss));
};
ConsoleHelper.prototype.getListResources = function getListResources(){
  var that = this;
  return element.all(by.css(that.listResourcesCss));
};

ConsoleHelper.prototype.getResourceTypeForAResource = function getResourceTypeForAResource(t){
//  var that = this;
  var resource = this.getListResources();
  return resource[t].findElements(by.css('.modifiers [role=\'resource-type\']'));
};

ConsoleHelper.prototype.getListResourcesDisplayName = function getListResourcesDisplayName(){
  return element.all(by.css('[ng-show=\'resource.name\']'));
};

ConsoleHelper.prototype.getListOfMethodByResourceCss = function getListOfMethodByResourceCss(){
    //$('[role=\'resourceSummary\']').filter(function(){ return /^\s+\/classes\s*$/.test($(this).find("h2").text());})
};

ConsoleHelper.prototype.expandCollapseMainResourcebyPos = function expandCollapseMainResourcebyPos(pos){
//  resource needed to be expanded.
  var d = webdriver.promise.defer();
  pos--;
//send 0 to expand all.
  if(pos ===-1){
    browser.executeScript(function(){
      $('#raml-console-api-reference h1').click();
    }).then(function(){
      d.fulfill();
    });
  }else{
    element.all(by.css('#raml-console-api-reference h1')).then(function(mainResources){
      mainResources[pos].click();
      d.fulfill();
    });
  }
  return d.promise;
};

ConsoleHelper.prototype.expandCollapseResourcebyPos = function expandCollapseResourcebyPos(pos){
//  resource needed to be expanded.
  var d = webdriver.promise.defer();
  pos--;
//send 0 to expand all.
  if(pos ===-1){
    browser.executeScript(function(){
      $('[role="resource"] [role="resource-summary"] h3').click();
      d.fulfill();
    });
  }else{
    element.all(by.css('[role="resource"] [role="resource-summary"] h3')).then(function(resources){
      resources[pos].click();
      d.fulfill();
    });
  }
  return d.promise;
};

ConsoleHelper.prototype.areResourceGroupsExpanded = function areResourceGroupsExpanded(){
  element.all(by.css('#raml-console-api-reference [role="resource-group"] div[ng-transclude]')).then(function(groups){
    groups.forEach(function(group){
      expect(group.getAttribute('class')).toMatch('expanded');
    });
  });
};

ConsoleHelper.prototype.areResourceGroupsCollapsed = function areResourceGroupsCollapsed(){
  element.all(by.css('#raml-console-api-reference [role="resource-group"] div[ng-transclude]')).then(function(groups){
    groups.forEach(function(group){
      expect(group.getAttribute('class')).toMatch('collapsed');
    });
  });
};

ConsoleHelper.prototype.toggleResourceExpansion = function toggleResourceExpansion(){
  var that = this;
  element.all(by.css(that.listResourcesNameCss)).then(function(resources){
    resources.forEach(function(resource){
      resource.click();
    });
  });
};

ConsoleHelper.prototype.expandCollpaseMethodsbyPos = function expandCollpaseMethodsbyPos(pos){
//  resource needed to be expanded.
  var d = webdriver.promise.defer();
  pos--;
  element.all(by.css('[role="api-console"] [role="resource"] [role="methods"] li')).then(function(methods){
    methods[pos].click();
    d.fulfill();
  });
  return d.promise;
};

ConsoleHelper.prototype.toggleBetweenMethodByPos = function toggleBetweenMethodByPos(method){
  $('[class="method-name ng-scope ng-binding '+method+'"]').click();
};

ConsoleHelper.prototype.selectTab = function selectTab(pos){
  var that = this;
  // 0 - request, 1- responses, 2 try it
  element.all(by.css(that.ListOftabs)).then(function(tab){
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

ConsoleHelper.prototype.getListOfMethodsDescriptionExpanded = function getListOfMethodsDescriptionExpanded(){
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

ConsoleHelper.prototype.getMethodDescription = function getMethodDescription (){
  return element.all(by.css(this.methodDescriptionCss));
};

ConsoleHelper.prototype.getResourcesResourceType = function getResourcesResourceType(){
  var d = webdriver.promise.defer();
  browser.executeScript(function () {
    var dic = {};
    var keys = [];
    $('[role=\'resource\'] h3.path').text(function( index,text ) {
      var texto = text.replace(/\s+/g,'');
      dic[texto]='';
      keys[index]=texto;
    });
    $('[role="api-console"] [role="resource"] [role="resource-summary"] [ng-show="resourceView.expanded"] [role="resource-type"]').text(function( index,text ) {
      dic[keys[index]]=text.replace(/\s+/g,'');
    });
    return dic;
  }).then(function(dic){
      d.fulfill(dic);
    });
  return d.promise;
};

ConsoleHelper.prototype.getCurrentMethod = function getCurrentMethod (){
  return $(this.currentmethod);
};


ConsoleHelper.prototype.getActiveTab = function getActiveTab(){
  return $(this.activeTab);
};

ConsoleHelper.prototype.closeMethodPopUp = function closeMethodPopUp() {
  browser.executeScript(function () {
    $('[role="resource"] div i[class="icon-remove collapse"]').click();
  });
};

ConsoleHelper.prototype.getMethodsTraits = function getMethodsTraits(){

  return element.all(by.css('[role="method"] [role="documentation"] .modifiers [role="traits"] li'));

};

//request tab
ConsoleHelper.prototype.getrequestTabHeaderh2 = function getrequestTabHeaderh2(){
  return $(this.requestTabHeadersh2);
};
exports.ConsoleHelper = ConsoleHelper;
