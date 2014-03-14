'use strict';
var webdriver = require('selenium-webdriver');

function ConsoleHelper() {
  this.titleCss = '#raml-console-api-title';
  this.listResourcesCss = '#raml-console-api-reference [role="resource-group"] [role="resource-placeholder"]:first-of-type h3';
  this.listMainResourcesCss = '#raml-console-api-reference [role="resource-group"] [ng-repeat="resource in resourceGroup"]:first-of-type h3';
  this.listResourceDescriptionCss = '[role=\'description\'] p';
  this.listResourcesCss = '[role="resource"]';
  this.listResourcesNameCss = '[role=\'resource\'] h3.path';
  this.listResourceTraitsCss = '[role="api-console"] [role="resource"] [role="resource-summary"] [role="trait"]';
  this.rtAndTraitsSection = '[role="resource"] [role="resource-summary"] div';
  this.listResourceMethodsCss = '[role="api-console"] [role="resource"] [role="resource-summary"] [role="methods"] li';
  this.documentationSectionlistCss = '[role="api-console"] div [role="root-documentation"] section';
  this.consoleSection = '#consoleAndEditor';
  this.expandAll = '.toggle-resource-groups [role="expand-all"]';
  this.collapseAll ='.toggle-resource-groups [role="collapse-all"]';
  this.resourceGroupExpandedClass  = 'resource-group ng-scope expanded';
  this.resourceGroupCollapsedClass = 'resource-group ng-scope collapsed';
  this.currentmethod = '[role="method"] [role="documentation"] .method-nav ul.method-nav-group :first-of-type a';
  this.Alltabs = '[role="method"] [role="documentation"] .method-nav ul.method-nav-group .method-nav-item a';
  this.currentEnableTabs = '[role="method"] [role="documentation"] .method-nav ul.method-nav-group [class="method-nav-item ng-scope"] a';
  this.currentDisabledTabs = '[role="method"] [role="documentation"] .method-nav ul.method-nav-group [class="method-nav-item ng-scope disabled"] a';
  this.activeTab = '[role="method"] [role="documentation"] .method-nav ul.method-nav-group [class="method-nav-item ng-scope active"] a';
  this.methodDescriptionCss = '[role="method"] [role="full-description"] p' ;

//  tabs
  this.requestTab = '[role="method"] [role="documentation"] [role="documentation-requests"]';
  //request
    //headers
  this.requestTabHeaders = '[role="method"] [role="documentation"] [role="documentation-requests"] [heading="Headers"]';
  this.requestTabHeadersh2 = '[role="method"] [role="documentation"] [role="documentation-requests"] [heading="Headers"] h2';
  this.requestTabHeadersListDisplayName = '[heading="Headers"] [role="parameter"] [ng-repeat="definition in parameter"] [role="display-name"]';
  this.requestTabHeadersConstraints = '[heading="Headers"] [role="parameter"] [ng-repeat="definition in parameter"] .constraints';
  this.requestTabHeadersDescription = '[heading="Headers"] [role="parameter"] [ng-repeat="definition in parameter"] .info [role="description"]';
  //UriParameters
  this.requestTabUriParameters = '[role="method"] [role="documentation"] [role="documentation-requests"] [heading="URI Parameters"]';
  this.requestTabUriParametersh2 = '[role="method"] [role="documentation"] [role="documentation-requests"] [heading="URI Parameters"] h2';
  this.requestTabUriParametersListDisplayName = '[heading="URI Parameters"] [role="parameter"] [ng-repeat="definition in parameter"] [role="display-name"]';
  this.requestTabUriParametersConstraints = '[heading="URI Parameters"] [role="parameter"] [ng-repeat="definition in parameter"] .constraints';
  this.requestTabUriParametersDescription = '[heading="URI Parameters"] [role="parameter"] [ng-repeat="definition in parameter"] .info [role="description"]';
  //QueryParameters
  this.requestTabQuertParameters = '[role="method"] [role="documentation"] [role="documentation-requests"] [heading="Query Parameters"]';
  this.requestTabQueryParametersh2 = '[role="method"] [role="documentation"] [role="documentation-requests"] [heading="Query Parameters"] h2';
  this.requestTabQueryParametersListDisplayName = '[heading="Query Parameters"] [role="parameter"] [ng-repeat="definition in parameter"] [role="display-name"]';
  this.requestTabQueryParametersConstraints = '[heading="Query Parameters"] [role="parameter"] [ng-repeat="definition in parameter"] .constraints';
  this.requestTabQueryParametersDescription = '[heading="Query Parameters"] [role="parameter"] [ng-repeat="definition in parameter"] .info [role="description"]';
  //body
  this.requestTabBodyDocmentation = '[role="method"] [role="documentation"] [role="documentation-requests"] .body-documentation';
  this.requestTabBodyh2 = '[role="method"] [role="documentation"] [role="documentation-requests"] .body-documentation h2';
  this.requestTabBodyDisplayNameListNP = '[role="method"] [role="documentation"] [role="documentation-requests"] .body-documentation [role="display-name"]';
  this.requestTabBodyConstraintsNP = '[role="method"] [role="documentation"] [role="documentation-requests"] .body-documentation .constraints';
  this.requestTabBodyDescriptionNP = '[role="method"] [role="documentation"] [role="documentation-requests"] .body-documentation .info [role="description"]';
  this.requestTabBodyMediaTypeList = '[role="method"] [role="documentation"] [role="documentation-requests"] .body-documentation fieldset label span';
  this.requestTabBodyMediaTypeListStatus = '[role="method"] [role="documentation"] [role="documentation-requests"] .body-documentation fieldset label';
  this.requestTabBodySchemaLink = '';
  this.requestTabBodySchemaContent = '';
  this.requestTabBodyExample = '';
  this.responseTab = '';
  this.tryitTab = '';
  this.tryItPath = '[role="method"] [role="documentation"] .method-nav [role="path"] [class="segment ng-scope ng-binding"]'; // does not include the field parameters
  this.tryItTabAuthenticationh2 = '[role="method"] [role="documentation"] [role="try-it"] .try-it [class="documentation-section authentication ng-isolate-scope"] h2';
  this.tryItTabHeadersh2 = '[role="method"] [role="documentation"] [role="try-it"] .try-it [heading="Headers"] h2';
  this.tryItTabHeadersNameList = '[role="method"] [role="documentation"] [role="try-it"] .try-it [heading="Headers"] [ng-if="!repeatable"] label';
  this.tryItHeadersFieldsList = '[role="method"] [role="documentation"] [role="try-it"] .try-it [heading="Headers"] [ng-if="!repeatable"] input';
  this.tryItTabQueryParametersh2  = '[role="method"] [role="documentation"] [role="try-it"] .try-it [heading="Query Parameters"] h2';
  this.tryItTabQueryParametersNameList = '[role="method"] [role="documentation"] [role="try-it"] .try-it [heading="Query Parameters"] [ng-if="!repeatable"] label';
  this.tryItTabQueryParametersFieldsList ='[role="method"] [role="documentation"] [role="try-it"] .try-it [heading="Query Parameters"] [ng-if="!repeatable"] input';
  this.tryItTabBodyh2 = '[role="method"] [role="documentation"] [role="try-it"] .try-it [class="documentation-section request-body ng-isolate-scope"] h2';
  this.tryItTabBodyNameList = '[role="method"] [role="documentation"] [role="try-it"] .try-it [class="documentation-section request-body ng-isolate-scope"] [ng-if="!repeatable"] label';
  this.tryItTabBodyFieldList = '[role="method"] [role="documentation"] [role="try-it"] .try-it [class="documentation-section request-body ng-isolate-scope"] [ng-if="!repeatable"] input';
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

ConsoleHelper.prototype.getListResourcesDescription = function getListResourcesDescription(){
  var that = this;
  return element.all(by.css(that.listResourceDescriptionCss));
};

ConsoleHelper.prototype.getListResourcesName = function getListResourcesName(){
  var that = this;
  return element.all(by.css(that.listResourcesNameCss));
};

ConsoleHelper.prototype.getListTrait = function getListTrait(){
  var that = this;
  return  element.all(by.css(that.listResourceTraitsCss));
};

ConsoleHelper.prototype.getListMethods = function getListMethods(){
  var that = this ;
  return element.all(by.css(that.listResourceMethodsCss));
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

ConsoleHelper.prototype.toggleBetweenMethodByName = function toggleBetweenMethodByName(method){
  $('[class="method-name ng-scope ng-binding '+method+'"]').click();
};

ConsoleHelper.prototype.selectTab = function selectTab(pos){
  // pos --;
  element.all(by.css(this.Alltabs)).then(function(tab){
    tab[pos].click();
  });
};

ConsoleHelper.prototype.getMethodDescription = function getMethodDescription (){
  return element.all(by.css(this.methodDescriptionCss));
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

ConsoleHelper.prototype.getrequestTabUriParametersh2 = function getrequestTabUriParametersh2(){
  return $(this.requestTabUriParametersh2);
};

ConsoleHelper.prototype.getrequestTabQueryParametersh2 = function getrequestTabQueryParametersh2(){
  return $(this.requestTabQueryParametersh2);
};

ConsoleHelper.prototype.getrequestTabBodyh2 = function getrequestTabBodyh2(){
  return $(this.requestTabBodyh2);
};

ConsoleHelper.prototype.getrequestTabBodyMediaTypeList = function getrequestTabBodyMediaTypeList (){
  return element.all(by.css(this.requestTabBodyMediaTypeList));
};

// try it
ConsoleHelper.prototype.getTryItAuthenticationh2 = function getTryItAuthenticationh2(){
  return $(this.tryItTabAuthenticationh2);
};

ConsoleHelper.prototype.getTryItHeadersh2 = function getTryItHeadersh2(){
  return $(this.tryItTabHeadersh2);
};

ConsoleHelper.prototype.getHeaderFieldList = function getHeaderFieldList(){
  return element.all(by.css(this.tryItHeadersFieldsList));
};

ConsoleHelper.prototype.getQuerParamFieldList = function getHeaderFieldList(){
  return element.all(by.css(this.tryItTabQueryParametersFieldsList));
};

ConsoleHelper.prototype.getBodyFieldList = function getHeaderFieldList(){
  return element.all(by.css(this.tryItTabBodyFieldList));
};

ConsoleHelper.prototype.sendKeysToHeaderFieldByPos = function sendKeysToHeaderFieldByPos(pos, value){
  this.getHeaderFieldList().then(function(list){
    list[pos].sendKeys(value);
  });
};

ConsoleHelper.prototype.sendKeysToQueParFieldByPos = function sendKeysToQueParFieldByPos(pos, value){
  this.getQuerParamFieldList().then(function(list){
    list[pos].sendKeys(value);
  });
};

ConsoleHelper.prototype.sendKeysToBodyFieldByPos = function sendKeysToBodyByPos(pos, value){
  this.getBodyFieldList().then(function(list){
    list[pos].sendKeys(value);
  });

};

ConsoleHelper.prototype.getTryItQueryParametersh2 = function getTryItQueryParametersh2(){
  return $(this.tryItTabQueryParametersh2);
};

ConsoleHelper.prototype.getTryItBodyh2 = function getTryItBodyh2(){
  return $(this.tryItTabBodyh2);
};


exports.ConsoleHelper = ConsoleHelper;
