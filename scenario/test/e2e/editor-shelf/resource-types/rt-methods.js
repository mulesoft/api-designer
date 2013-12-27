'use strict';
var ShelfHelper = require('../../../lib/shelf-helper.js').ShelfHelper;
var AssertsHelper = require('../../../lib/asserts-helper.js').AssertsHelper;
var EditorHelper = require('../../../lib/editor-helper.js').EditorHelper;
describe('shelf',function(){
  var shelf= new ShelfHelper();
  var designerAsserts= new AssertsHelper();
  var editor= new EditorHelper();
  var methods = shelf.elemResourceTypeLevelMethods;
  var namedParameters = ['baseUriParameters', 'headers', 'queryParameters'];
  var namedParamElems = shelf.elemNamedParametersLevel;
  var methodElems = shelf.elemRtMethodLevel;

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
        editor.setValue(definition);
        editor.setCursor(6,8);
        designerAsserts.ShelfElementsByGroup(shelf.elemRtMethodByGroup);
      });
    });

    describe('Named Parameters', function(){

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
            editor.setValue(definition);
            editor.setCursor(8,12);
            designerAsserts.ShelfElementsByGroup(shelf.elemNamedParametersByGroups);
          });
        });
      });

      describe('after being selected', function(){

        methods.forEach(function(method){
          namedParameters.forEach(function(namedParameter){
            namedParamElems.forEach(function(namedParamElem){
              it(method+'-'+namedParameter+'-'+namedParamElem+' attribute is no longer displayed on the shelf', function(){
                shelf = new ShelfHelper();
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
                editor.setValue(definition);
                editor.setCursor(9,12);
                var list2 =[namedParamElem];
                designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemNamedParametersLevel);
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
            shelf = new ShelfHelper();
            var definition = [
              '#%RAML 0.8',
              'title: My api',
              'resourceTypes:',
              '  - collection:',
              '      '+method+':',
              '        '+methodElem+': ',
              '            '
            ].join('\\n');
            editor.setValue(definition);
            editor.setCursor(7,8);
            var list2 =[methodElem];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRtMethodLevel);
          });
        });
      });

    }); // not displayed after being selected
  });//rt-Methods elements
}); // shelf
