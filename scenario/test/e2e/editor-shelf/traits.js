'use strict';
var ShelfHelper = require('../../lib/shelf-helper.js').ShelfHelper;
var AssertsHelper = require ('../../lib/asserts-helper.js').AssertsHelper;
var EditorHelper = require ('../../lib/editor-helper.js').EditorHelper;
describe('shelf',function(){
  var  shelf = new ShelfHelper();
  var designerAsserts = new AssertsHelper();
  var editor = new EditorHelper();
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
      editor.setValue(definition);
      editor.setCursor(5,6);
      designerAsserts.ShelfElementsByGroup(shelf.elemTraitsByGroup);
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
          editor.setValue(definition);
          editor.setCursor(7,10);
          designerAsserts.ShelfElementsByGroup(shelf.elemNamedParametersByGroups);
        });
      });

      describe('after being selected', function(){
        var options = shelf.elemNamedParametersLevel;
        namedParameters.forEach(function(namedParameter){
          options.forEach(function(option){
            it(namedParameter+': '+option+' is no longer displayed on the shelf', function(){
              shelf = new ShelfHelper();
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
              editor.setValue(definition);
              editor.setCursor(8,10);
              designerAsserts.shelfElementsNotDisplayed([option], shelf.elemNamedParametersLevel);
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
        editor.setValue(definition);
        editor.setCursor(7,10);
        designerAsserts.ShelfElementsByGroup(shelf.elemResponsesByGroup);

      });

      describe('after being selected', function(){

        it('displayName is no longer displayed on the shelf', function(){
          shelf = new ShelfHelper();
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
          editor.setValue(definition);
          editor.setCursor(8,10);
          var list2 =['description'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResponsesLevel);
        });

        it('displayName is no longer displayed on the shelf', function(){
          shelf = new ShelfHelper();
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
          editor.setValue(definition);
          editor.setCursor(8,10);
          var list2 =['body'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResponsesLevel);
        });

      }); // Not displayed after select

    }); //response

    describe('body', function(){

    }); //body

    describe('after being selected', function(){
      var options = shelf.elemTraitsLevel;
      options.forEach(function(option){
        it(option+': property is no longer displayed on the shelf', function(){
          shelf = new ShelfHelper();
          var definition = [
            '#%RAML 0.8',
            'title: The API',
            'traits: ',
            '  - trait1: ',
            '      '+option+': ',
            '          '
          ].join('\\n');
          editor.setValue(definition);
          editor.setCursor(6,6);
          var list2 =[option];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemTraitsLevel);
        });
      });

    });// Don't displayed after select
  });//traits elements
}); // shelf
