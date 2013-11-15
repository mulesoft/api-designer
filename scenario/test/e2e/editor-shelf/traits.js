'use strict';
var ramlUrl = require('../../config').url;
var ShelfElements = require('../../lib/shelf-elements.js').ShelfElements;
describe('shelf',function(){

  var  shelfElements = new ShelfElements();
//  beforeEach(function () {
    browser.get(ramlUrl);
    browser.executeScript(function () {
      localStorage['config.updateResponsivenessInterval'] = 1;
      window.onbeforeunload = null;
    });
    browser.wait(function(){
      return editorGetLine(2).then(function(text) {
        return text === 'title:';
      });
    });
//  });

  var namedParameters = ['baseUriParameters', 'headers', 'queryParameters'];
  describe('traits elements',function(){

    it('check elements at trait level', function (){
      var definition = [
        '#%RAML 0.8',
        'title: The API',
        'traits: ',
        '  - trait1: ',
        '         '
      ].join('\\n');
      editorSetValue(definition);
      editorSetCursor(5,7);
      shelfElemTraitsByGroupAssertion(shelfElements);
    });

    describe('Named Parameters', function(){

      namedParameters.forEach(function(namedParameter){
        it(namedParameter+'displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: The API',
            'traits: ',
            '  - trait1: ',
            '      '+namedParameter+': ',
            '        hola: ',
            '              '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(7,10);
          shelfElemNamedParametersByGroupAssertion(shelfElements);
        });
      });

      describe('after being selected', function(){
        var options = shelfElements.getNamedParametersLevel();
        namedParameters.forEach(function(namedParameter){
          options.forEach(function(option){
            it(namedParameter+': '+option+' is no longer displayed on the shelf', function(){
              var definition = [
                '#%RAML 0.8',
                'title: The API',
                'traits: ',
                '  - trait1: ',
                '      '+namedParameter+': ',
                '        hola:',
                '          '+option+':',
                '            '
              ].join('\\n');
              editorSetValue(definition);
              editorSetCursor(8,10);
              var list2 =[option];
              var listPromise = shelfGetListOfElementsFromShelf();
              listPromise.then(function (list) {
                noShelfElementsAssertion(list, shelfElements.getNamedParametersLevel(),list2);
              });
            });
          });
        });
      }); // Not displayed after being selected
    }); //NAmed Parameter
    
    describe('response', function(){

      it('displayed on the shelf', function(){
        var definition = [
          '#%RAML 0.8',
          'title: The API',
          'traits: ',
          '  - trait1: ',
          '      responses: ',
          '        200: ',
          '          '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(7,10);
        shelfElemResponsesByGroupAssertion(shelfElements);
      });

      describe('after being selected', function(){

        it('displayName is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: The API',
            'traits: ',
            '  - trait1: ',
            '      responses: ',
            '        200: ',
            '          description: ',
            '             '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(8,10);
          var list2 =['description'];
          var listPromise = shelfGetListOfElementsFromShelf();
          listPromise.then(function (list) {
            noShelfElementsAssertion(list, shelfElements.getResponseLevel(),list2);
          });
        });

        it('displayName is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: The API',
            'traits: ',
            '  - trait1: ',
            '      responses: ',
            '        200: ',
            '          body: ',
            '             '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(8,10);
          var list2 =['body'];
          var listPromise = shelfGetListOfElementsFromShelf();
          listPromise.then(function (list) {
            noShelfElementsAssertion(list, shelfElements.getResponseLevel(),list2);
          });
        });

      }); // Not displayed after select

    }); //response

    describe('body', function(){

    }); //body

    describe('after being selected', function(){
      var options = shelfElements.getTraitsLevel();
      options.forEach(function(option){
        it(option+': property is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: The API',
            'traits: ',
            '  - trait1: ',
            '      '+option+': ',
            '        '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(6,7);
          var list2 =[option];
          var listPromise = shelfGetListOfElementsFromShelf();
          listPromise.then(function (list) {
            noShelfElementsAssertion(list, shelfElements.getTraitsLevel(),list2);
          });
        });
      });
    });// Don't displayed after select
  });//traits elements
}); // shelf
