'use strict';
(function() {

  global.consoleGetTitleElement = function () {
//	  return  '[role=\'resources\'] h2 span';
    return '#raml-console-api-title';
  };

  global.consoleGetListOfResources = function() {
	  return 'div[role=\'resourceSummary\']';
  };

  global.consoleGetListResourcesNameElement = function () {
	  return 'div[role=\'resourceSummary\'] h2';
  };

  global.consoleGetListResourcesName = function () {
    return browser.findElements(by.css('div[role=\'resourceSummary\'] h2'));
  };

  global.consoleGetListResourcesDisplayName = function(){
    return browser.findElements(by.css('[ng-show=\'resource.name\']'));
  };

  global.consoleGetListOfMethodByResource = function(){
    //$('[role=\'resourceSummary\']').filter(function(){ return /^\s+\/classes\s*$/.test($(this).find("h2").text());})
  };




})();