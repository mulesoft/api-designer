'use strict';
(function() {

  var webdriver = require('selenium-webdriver');

  global.shelfGetElementsFromShelf = function () {
    return browser.findElements(by.css('[ng-repeat=\'item in section.items\'] span'));
  };

  global.shelfGetListOfElementsFromShelf = function (){
    var d = webdriver.promise.defer();
    function afterAllThens(items){
      d.fulfill(items);
    }
    shelfGetElementsFromShelf().then(function(list){
      var items=[];
      var i=0;
      list.forEach(function (item) {
        var t= i++;
        item.getText().then(function(text){
          items[t]=text;
          if (t === list.length-1){
            afterAllThens(items);
          }
        });
      });
    });
    return d;
  };

  global.shelfGetElementsFromShelfByGroup = function (group) {
    return browser.findElements(by.css('.'+group+' ul li span'));
  };

  global.shelfGetSectionsFromShelf = function(){
    return browser.findElements(by.css('[role=\'section\']'));
  };

  global.itemsInSection = function(){
    return '[role=\'items\'] li span';
  };
})();
