'use strict';
var ShelfHelper = require('../../../lib/shelf-helper.js').ShelfHelper;
var AssertsHelper = require('../../../lib/asserts-helper.js').AssertsHelper;
var EditorHelper = require('../../../lib/editor-helper.js').EditorHelper;

describe('shelf',function(){
  var  shelf= new ShelfHelper();
  var designerAsserts= new AssertsHelper();
  var editor= new EditorHelper();
  var namedParameters = ['baseUriParameters', 'uriParameters'];
  var namedParamElems = shelf.elemNamedParametersLevel;
  var options = shelf.elemResourceTypeLevel;

  describe('resourceTypes elements',function(){
    it('resource shelf elements by group', function(){
      var definition = [
        '#%RAML 0.8',
        'title: My api',
        'resourceTypes:',
        '  - rt1: ',
        '        '
      ].join('\\n');
      editor.setValue(definition);
      editor.setCursor(5,6);
      designerAsserts.ShelfElementsByGroup(shelf.elemResourceTypeTypeByGroup);
    });

    describe('after being selected', function(){

      options.forEach(function(option){
        it(option+' is no longer displayed on the shelf', function(){
          shelf = new ShelfHelper();
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            'resourceTypes:',
            '  - rt1: ',
            '      '+option+':',
            '          '
          ].join('\\n');
          editor.setValue(definition);
          editor.setCursor(6,6);
          var list2 =[option];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResourceTypeLevel);
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
          editor.setValue(definition);
          editor.setCursor(7,10);
          designerAsserts.ShelfElementsByGroup(shelf.elemNamedParametersByGroups);
        });
      });

      describe('after being  selected', function(){
        namedParameters.forEach(function(namedParameter){
          namedParamElems.forEach(function(namedParamElem){
            it(namedParameter+'-'+namedParamElem+' attribute is no longer displayed on the shelf', function(){
              shelf = new ShelfHelper();
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
              editor.setValue(definition);
              editor.setCursor(8,10);
              var list2 =[namedParamElem];
              designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemNamedParametersLevel);
            });
          });
        });

      }); // Not displayed after being selected
    }); //NamedParameters


  });//resourceTypes elements
}); // shelf
