'use strict';
var ShelfElements = require('../../lib/shelf-elements.js').ShelfElements;
var AssertsHelper = require ('../../lib/asserts-helper.js').AssertsHelper;
var EditorHelper = require ('../../lib/editor-helper.js').EditorHelper;
describe('shelf',function(){
  var  shelfElements = new ShelfElements();
  var assertsHelper= new AssertsHelper();
  var editorHelper= new EditorHelper();
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
      editorHelper.setValue(definition);
      editorHelper.setCursor(5,6);
      assertsHelper.shelfElemTraitsByGroup();
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
          editorHelper.setValue(definition);
          editorHelper.setCursor(7,10);
          assertsHelper.shelfElemNamedParametersByGroup();
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
              editorHelper.setValue(definition);
              editorHelper.setCursor(8,10);
              assertsHelper.shelfElementsNotDisplayed([option], shelfElements.getNamedParametersLevel());
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
          '            '
        ].join('\\n');
        editorHelper.setValue(definition);
        editorHelper.setCursor(7,10);
        assertsHelper.shelfElemResponsesByGroup();
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
          editorHelper.setValue(definition);
          editorHelper.setCursor(8,10);
          var list2 =['description'];
          assertsHelper.shelfElementsNotDisplayed(list2, shelfElements.getResponseLevel());
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
          editorHelper.setValue(definition);
          editorHelper.setCursor(8,10);
          var list2 =['body'];
          assertsHelper.shelfElementsNotDisplayed(list2, shelfElements.getResponseLevel());
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
            '          '
          ].join('\\n');
          editorHelper.setValue(definition);
          editorHelper.setCursor(6,6);
          var list2 =[option];
          assertsHelper.shelfElementsNotDisplayed(list2, shelfElements.getTraitsLevel());
        });
      });

    });// Don't displayed after select
  });//traits elements
}); // shelf
