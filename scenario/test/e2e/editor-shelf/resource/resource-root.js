'use strict';
var ShelfHelper = require('../../../lib/shelf-helper.js').ShelfHelper;
var AssertsHelper = require('../../../lib/asserts-helper.js').AssertsHelper;
var EditorHelper = require('../../../lib/editor-helper.js').EditorHelper;
describe('shelf',function(){
  var shelf = new ShelfHelper();
  var designerAsserts= new AssertsHelper();
  var editor= new EditorHelper();
  var options = shelf.elemResourceLevelWithoutNewReosurce;
  var namedParameters = [ 'baseUriParameters', 'uriParameters'];
  var namedParamElems = shelf.elemNamedParametersLevel;

  describe('resource-root elements',function(){

    it('resource shelf elements by group', function(){
      var definition = [
        '#%RAML 0.8',
        'title: My api',
        '/res:',
        '    '
      ].join('\\n');
      editor.setValue(definition);
      editor.setCursor(4,2);
      designerAsserts.ShelfElementsByGroup(shelf.elemResourceByGroup);
    });

    describe('not displayed after being selected', function(){

      options.forEach(function(option){
        it(option+' is no longer displayed on the shelf', function(){
          shelf = new ShelfHelper();
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            '/res:',
            '  '+option+': ',
            '    '
          ].join('\\n');
          editor.setValue(definition);
          editor.setCursor(5,2);
          var list2 =[option];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResourceLevel);
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
          editor.setValue(definition);
          editor.setCursor(7,6);
          designerAsserts.ShelfElementsByGroup(shelf.elemNamedParametersByGroups);
        });
      });

      describe('Not displayed after select', function(){

        namedParameters.forEach(function(namedParameter){
          namedParamElems.forEach(function(namedParamElem){
            it(namedParameter+'-'+namedParamElem+' is no longer displayed on the shelf', function(){
              shelf = new ShelfHelper();
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
              editor.setValue(definition);
              editor.setCursor(7,6);
              var list2 =[namedParamElem];
              designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemNamedParametersLevel);
            });
          });
        });

      }); // Not displayed after being selected

    }); //Named Parameters

  });//resource-root elements
}); // shelf