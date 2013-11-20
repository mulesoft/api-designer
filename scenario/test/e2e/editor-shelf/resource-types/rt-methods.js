'use strict';
var ShelfElements = require ('../../../lib/shelf-elements.js').ShelfElements;
var AssertsHelper = require ('../../../lib/asserts-helper.js').AssertsHelper;
var EditorHelper = require ('../../../lib/editor-helper.js').EditorHelper;
describe('shelf',function(){
  var shelfElements= new ShelfElements();
  var assertsHelper= new AssertsHelper();
  var editorHelper= new EditorHelper();
  var methods = shelfElements.getResourceLevelMethods();
  var namedParameters = ['baseUriParameters', 'headers', 'queryParameters'];
  var namedParamElems = shelfElements.getNamedParametersLevel();
  var methodElems = shelfElements.getRTMethodsLevel();

  describe('rt-methods elements',function(){

    describe('rt-Methods elements',function(){

      methods.forEach(function(method){
        it(method+'- check section', function(){
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            'resourceTypes:',
            '  - collection:',
            '      '+method+':',
            '          '
          ].join('\\n');
          editorHelper.setValue(definition);
          editorHelper.setCursor(6,8);
          assertsHelper.shelfElementsRTMethodsByGroup();
        });
      });

      describe('Named Parameters', function(){ // https://www.pivotaltracker.com/story/show/60351064

        methods.forEach(function(method){
          namedParameters.forEach(function(namedParameter){
            it(method+'-'+namedParameter+'elements displayed on the shelf', function(){
              var definition = [
                '#%RAML 0.8',
                'title: My api',
                'resourceTypes:',
                '  - collection:',
                '      '+method+':',
                '        '+namedParameter+': ',
                '          hola:',
                '             '
              ].join('\\n');
              editorHelper.setValue(definition);
              editorHelper.setCursor(8,12);
              assertsHelper.shelfElemNamedParametersByGroup();
            });
          });
        });

        describe('after being selected', function(){

          methods.forEach(function(method){
            namedParameters.forEach(function(namedParameter){
              namedParamElems.forEach(function(namedParamElem){
                it(method+'-'+namedParameter+'-'+namedParamElem+' attribute is no longer displayed on the shelf', function(){
                  var definition = [
                    '#%RAML 0.8',
                    'title: My api',
                    'resourceTypes:',
                    '  - collection:',
                    '      '+method+':',
                    '        '+namedParameter+': ',
                    '          hola:',
                    '            '+namedParamElem+':',
                    '              '
                  ].join('\\n');
                  editorHelper.setValue(definition);
                  editorHelper.setCursor(9,12);
                  var list2 =[namedParamElem];
                  assertsHelper.shelfElementsNotDisplayed(list2, shelfElements.getNamedParametersLevel());
                });
              });
            });
          });

        }); // Not displayed after being selected

      }); //Named Parameters

      describe('response', function(){

      }); //response

      describe('body', function(){

      }); //body

      describe('after being selected', function(){

        methods.forEach(function(method){
          methodElems.forEach(function(methodElem){
            it(method+'-'+methodElem+' is no longer displayed on the shelf', function(){
              var definition = [
                '#%RAML 0.8',
                'title: My api',
                'resourceTypes:',
                '  - collection:',
                '      '+method+':',
                '        '+methodElem+': ',
                '            '
              ].join('\\n');
              editorHelper.setValue(definition);
              editorHelper.setCursor(7,8);
              var list2 =[methodElem];
              assertsHelper.shelfElementsNotDisplayed(list2, shelfElements.getRTMethodsLevel());
            });
          });
        });

      }); // not displayed after being selected
    });// resource Methods elements
  });//rt-Methods elements
}); // shelf