'use strict';
function ConsoleHelper() {}

ConsoleHelper.prototype = {};

ConsoleHelper.prototype.getTitleCss = function(){
//  global.consoleGetTitleElement = function () {
  return '#raml-console-api-title';
};

ConsoleHelper.prototype.getListOfResourcesCss = function(){
//  global.consoleGetListOfResources = function() {
  return 'div[role=\'resourceSummary\']';
};

ConsoleHelper.prototype.getListResourcesNameCss = function(){
//  global.consoleGetListResourcesNameElement = function () {
  return 'div[role=\'resourceSummary\'] h3';
};
ConsoleHelper.prototype.getListResourcesName = function(){
//  global.consoleGetListResourcesName = function () {
  return browser.findElements(by.css('div[role=\'resourceSummary\'] h2'));
};
ConsoleHelper.prototype.getListResourcesDisplayName = function(){
//  global.consoleGetListResourcesDisplayName = function(){
  return browser.findElements(by.css('[ng-show=\'resource.name\']'));
};

ConsoleHelper.prototype.getListOfMethodByResourceCss = function(){
//  global.consoleGetListOfMethodByResource = function(){
    //$('[role=\'resourceSummary\']').filter(function(){ return /^\s+\/classes\s*$/.test($(this).find("h2").text());})
};

exports.ConsoleHelper = ConsoleHelper;