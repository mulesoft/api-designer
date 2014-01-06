'use strict';
var AssertsHelper = require('../../../lib/asserts-helper.js').AssertsHelper;
var ShelfHelper = require('../../../lib/shelf-helper.js').ShelfHelper;
var EditorHelper = require('../../../lib/editor-helper.js').EditorHelper;
describe('shelf',function(){

  var shelf= new ShelfHelper();
  var designerAsserts= new AssertsHelper();
  var editor= new EditorHelper();
  var methods = shelf.elemResourceLevelMethods;
  var options = ['baseUriParameters', 'headers', 'queryParameters'];
  var parameters = shelf.elemNamedParametersLevel;
  var methodElems = shelf.elemMethodLevel;

  describe('resource-Methods elements',function(){
    methods.forEach(function(method){
      it(method+'- check section', function(){
        var definition = [
          '#%RAML 0.8',
          'title: My api',
          '/res:',
          '  '+method+':',
          '     '
        ].join('\\n');
        editor.setValue(definition);
        editor.setCursor(5,4);
        designerAsserts.ShelfElementsByGroup(shelf.elemMethodByGroup);
      });
    });

    describe('Named Parameters', function(){

      methods.forEach(function(method){
        options.forEach(function(option){
          it(method+'-'+option+': NamedParameters displayed on the shelf', function(){
            var definition = [
              '#%RAML 0.8',
              'title: My api',
              'baseUri: http://www.theapi.com/{hola}',
              '/res:',
              '  '+method+':',
              '    '+option+': ',
              '      hola:',
              '          '
            ].join('\\n');
            editor.setValue(definition);
            editor.setCursor(8,8);
            designerAsserts.ShelfElementsByGroup(shelf.elemNamedParametersByGroups);
          });
        });
      });

      describe('after selected', function(){

        methods.forEach(function(method){
          options.forEach(function(option){
            parameters.forEach(function(parameter){
              it(method+'-'+option+'-'+parameter+'is no longer displayed on the shelf', function(){
                shelf = new ShelfHelper;
                var definition = [
                  '#%RAML 0.8',
                  'title: My api',
                  'baseUri: http://www.theapi.com/{hola}',
                  '/res:',
                  '  '+method+': ',
                  '    '+option+': ',
                  '      hola:',
                  '        '+parameter+':',
                  '          '
                ].join('\\n');
                editor.setValue(definition);
                editor.setCursor(9,8);
                var list2 =[parameter];
                designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemNamedParametersLevel);
              });
            });
          });
        });

      }); // Not displayed after being selected

    }); //NamedParameters

    describe('response', function(){

    }); //response

    describe('body', function(){

    }); //body

    describe('after being selected', function(){
      methods.forEach(function(method){
        methodElems.forEach(function(methodElem){
          it(methods+'-'+methodElem+' is no longer displayed on the shelf', function(){
            shelf = new ShelfHelper;
            var definition = [
              '#%RAML 0.8',
              'title: My api',
              '/res:',
              '  '+method+': ',
              '    '+methodElem+': ',
              '        '
            ].join('\\n');
            editor.setValue(definition);
            editor.setCursor(6,4);
            var list2 =[methodElem];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemMethodLevel);
          });
        });
      });
    }); // not displayed after being selected
  });//resource-Methods elements
}); // shelf