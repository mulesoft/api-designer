'use strict';

var protractor = require('protractor');
var elementsRootLevel = ['title','version','schemas','baseUri','mediaType','protocols', 'documentation',
  'baseUriParameters','securitySchemes','securedBy','New resource','traits','resourceTypes'];
var elementsRootLevelRoot = ['title','version','schemas','baseUri','mediaType','protocols'];
var elementsResourceLevel = ['displayName','get','post','put','delete','head','patch','options','uriParameters','baseUriParameters','securedBy','New resource','is', 'type'];
function ShelfHelper (ptor, driver) {
  this.ptor = ptor;
  this.driver = driver;
}



ShelfHelper.prototype = {};

ShelfHelper.prototype.getElementsRootLevel = function(){
  return elementsRootLevel;
};
ShelfHelper.prototype.getElementsRootLevelRoot = function(){
  return elementsRootLevelRoot;
};
ShelfHelper.prototype.getElementsResourceLevel = function(){
  return elementsResourceLevel;
};
ShelfHelper.prototype.getElementsFromShelf = function () {
  return this.ptor.findElements(protractor.By.css('[ng-repeat=\'item in section.items\'] span'));
};

ShelfHelper.prototype.getElementsFromShelfByGroup = function (group) {
  return this.ptor.findElements(protractor.By.css('.'+group+' ul li span'));
};

exports.ShelfHelper = ShelfHelper;
