'use strict';
var ShelfElements = require ('../../../lib/shelf-elements.js').ShelfElements;
var AssertsHelper = require ('../../../lib/asserts-helper.js').AssertsHelper;
var EditorHelper = require ('../../../lib/editor-helper.js').EditorHelper;
describe('shelf',function(){
  var shelfElements= new ShelfElements();
  var assertsHelper= new AssertsHelper();
  var editorHelper= new EditorHelper();
  var options = shelfElements.getResourcelevelWithouNewResource();
  var namedParameters = [ 'baseUriParameters', 'uriParameters'];
  var namedParamElems = shelfElements.getNamedParametersLevel();
  describe('resource-root elements',function(){

    it('resource shelf elements by group', function(){
      var definition = [
        '#%RAML 0.8',
        'title: My api',
        '/res:',
        '    '
      ].join('\\n');
      editorHelper.setValue(definition);
      editorHelper.setCursor(4,2);
      assertsHelper.shelfElementsResourceByGroup();
    });

    describe('not displayed after being selected', function(){

      options.forEach(function(option){
        it(option+' is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            '/res:',
            '  '+option+': ',
            '    '
          ].join('\\n');
          editorHelper.setValue(definition);
          editorHelper.setCursor(5,2);
          var list2 =[option];
          assertsHelper.shelfElementsNotDisplayed(list2, shelfElements.getResourceLevel());
        });
      });

    }); //not displayed after being selected


    describe('Named Parameter' , function(){

      namedParameters.forEach(function(namedParameter){
        it(namedParameter+' attributes are displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            'baseUri: http://www.theapi.com/{hola}',
            '/res:',
            '  '+namedParameter+': ',
            '    hola: ',
            '        '
          ].join('\\n');
          editorHelper.setValue(definition);
          editorHelper.setCursor(7,6);
          assertsHelper.shelfElemNamedParametersByGroup();
        });
      });

      describe('Not displayed after select', function(){

        namedParameters.forEach(function(namedParameter){
          namedParamElems.forEach(function(namedParamElem){
            it(namedParameter+'-'+namedParamElem+' is no longer displayed on the shelf', function(){
              var definition = [
                '#%RAML 0.8',
                'title: My api',
                'baseUri: http://www.theapi.com/{hola}',
                '/res:',
                '  '+namedParameter+': ',
                '    hola:',
                '      '+namedParamElem+':',
                '         '
              ].join('\\n');
              editorHelper.setValue(definition);
              editorHelper.setCursor(7,6);
              var list2 =[namedParamElem];
              assertsHelper.shelfElementsNotDisplayed(list2, shelfElements.getNamedParametersLevel());
            });
          });
        });

      }); // Not displayed after being selected

    }); //Named Parameters

  });//resource-root elements
}); // shelf