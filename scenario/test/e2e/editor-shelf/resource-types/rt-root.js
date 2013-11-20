'use strict';
var ShelfElements = require ('../../../lib/shelf-elements.js').ShelfElements;
var AssertsHelper = require ('../../../lib/asserts-helper.js').AssertsHelper;
var EditorHelper = require ('../../../lib/editor-helper.js').EditorHelper;
describe('shelf',function(){
  var  shelfElements= new ShelfElements();
  var assertsHelper= new AssertsHelper();
  var editorHelper= new EditorHelper();
  var namedParameters = ['baseUriParameters', 'uriParameters'];
  var namedParamElems = shelfElements.getNamedParametersLevel();
  var options = shelfElements.getResourceTypeLevel();

  describe('resourceTypes elements',function(){
    it('resource shelf elements by group', function(){
      var definition = [
        '#%RAML 0.8',
        'title: My api',
        'resourceTypes:',
        '  - rt1: ',
        '        '
      ].join('\\n');
      editorHelper.setValue(definition);
      editorHelper.setCursor(5,6);
      assertsHelper.shelfElemResourceTypesByGroup();
    });

    describe('after being selected', function(){

      options.forEach(function(option){
        it(option+' is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            'resourceTypes:',
            '  - rt1: ',
            '      '+option+':',
            '          '
          ].join('\\n');
          editorHelper.setValue(definition);
          editorHelper.setCursor(6,6);
          var list2 =[option];
          assertsHelper.shelfElementsNotDisplayed(list2, shelfElements.getResourceTypeLevel());
        });
      });
    }); // not displayed after being selected.

    describe('NamedParameters', function(){
      namedParameters.forEach(function(namedParameter){
        it(namedParameter+'- attribute displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            'resourceTypes:',
            '  - rt1: ',
            '      '+namedParameter+': ',
            '        hola:',
            '            '
          ].join('\\n');
          editorHelper.setValue(definition);
          editorHelper.setCursor(7,10);
          assertsHelper.shelfElemNamedParametersByGroup();
        });
      });

      describe('after being  selected', function(){
        namedParameters.forEach(function(namedParameter){
          namedParamElems.forEach(function(namedParamElem){
            it(namedParameter+'-'+namedParamElem+' attribute is no longer displayed on the shelf', function(){
              var definition = [
                '#%RAML 0.8',
                'title: My api',
                'resourceTypes:',
                '  - rt1: ',
                '      '+namedParameter+': ',
                '        hola:',
                '          '+namedParamElem+':',
                '              '
              ].join('\\n');
              editorHelper.setValue(definition);
              editorHelper.setCursor(8,10);
              var list2 =[namedParamElem];
              assertsHelper.shelfElementsNotDisplayed(list2, shelfElements.getNamedParametersLevel());
            });
          });
        });

      }); // Not displayed after being selected
    }); //NamedParameters


  });//resourceTypes elements
}); // shelf
