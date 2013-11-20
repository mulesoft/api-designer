'use strict';
var ShelfElements = require ('../../../lib/shelf-elements.js').ShelfElements;
var AssertsHelper = require ('../../../lib/asserts-helper.js').AssertsHelper;
var EditorHelper = require ('../../../lib/editor-helper.js').EditorHelper;
describe('shelf',function(){
  var shelfElements= new ShelfElements();
  var assertsHelper= new AssertsHelper();
  var editorHelper= new EditorHelper();
  var methods = shelfElements.getResourceLevelMethods();
  var options = ['baseUriParameters', 'headers', 'queryParameters'];
  var parameters = shelfElements.getNamedParametersLevel();
  var methodElems = shelfElements.getMethodsLevel();

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
        editorHelper.setValue(definition);
        editorHelper.setCursor(5,4);
        assertsHelper.shelfElementsMethodsByGroup();
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
            editorHelper.setValue(definition);
            editorHelper.setCursor(8,8);
            assertsHelper.shelfElemNamedParametersByGroup();
          });
        });
      });

      describe('after selected', function(){

        methods.forEach(function(method){
          options.forEach(function(option){
            parameters.forEach(function(parameter){
              it(method+'-'+option+'-'+parameter+'is no longer displayed on the shelf', function(){
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
                editorHelper.setValue(definition);
                editorHelper.setCursor(9,8);
                var list2 =[parameter];
                assertsHelper.shelfElementsNotDisplayed(list2, shelfElements.getNamedParametersLevel());
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
            var definition = [
              '#%RAML 0.8',
              'title: My api',
              '/res:',
              '  '+method+': ',
              '    '+methodElem+': ',
              '        '
            ].join('\\n');
            editorHelper.setValue(definition);
            editorHelper.setCursor(6,4);
            var list2 =[methodElem];
            assertsHelper.shelfElementsNotDisplayed(list2, shelfElements.getMethodsLevel());
          });
        });
      });
    }); // not displayed after being selected
  });//resource-Methods elements
}); // shelf