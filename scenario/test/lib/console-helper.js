'use strict';
function ConsoleHelper() {}

ConsoleHelper.prototype = {};

ConsoleHelper.prototype.getTitleCss = function(){
  return '#raml-console-api-title';
};

ConsoleHelper.prototype.getListOfResourcesCss = function(){
  return 'div[role=\'resourceSummary\']';
};

ConsoleHelper.prototype.getListResourcesNameCss = function(){
  return 'div[role=\'resourceSummary\'] h3';
};
ConsoleHelper.prototype.getListResourcesName = function(){
  return browser.findElements(by.css('div[role=\'resourceSummary\'] h2'));
};

ConsoleHelper.prototype.getListResourcesDisplayName = function(){
  return browser.findElements(by.css('[ng-show=\'resource.name\']'));
};

ConsoleHelper.prototype.getListOfMethodByResourceCss = function(){
    //$('[role=\'resourceSummary\']').filter(function(){ return /^\s+\/classes\s*$/.test($(this).find("h2").text());})
};

exports.ConsoleHelper = ConsoleHelper;