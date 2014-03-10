'use strict';
var ShelfHelper = require('../../lib/shelf-helper.js').ShelfHelper;
var AssertsHelper = require ('../../lib/asserts-helper.js').AssertsHelper;
var EditorHelper = require ('../../lib/editor-helper.js').EditorHelper;
describe('optionals Attributes',function(){
  var  shelf = new ShelfHelper();
  var designerAsserts = new AssertsHelper();
  var editor = new EditorHelper();
  var notOptNamedParam = ['description','displayName','example','default','maxLength','maximum','minLength','minimum','pattern','required','type'];
  var namedParamElems = shelf.elemNamedParametersLevel;

//  beforeEach(function(){
//    editor.setValue('');
//    expect(editor.getLine(1)).toEqual('');
//    designerAsserts.shelfElements(shelf.elemRamlVersion);
//    expect(editor.IsParserErrorDisplayed()).toBe(false);
//  });


  describe('resourceTypes elements',function(){
    var namedParameters = ['baseUriParameters', 'uriParameters'];
    var options = shelf.elemResourceTypeLevel;
    var notOptOptionals = ['description','displayName', 'usage', 'securedBy', 'is', 'type']; //cannot be scalars

    describe('root level after being selected', function(){

      options.forEach(function(option){
        it(option+'? is no longer displayed on the shelf', function(){
          shelf = new ShelfHelper();
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            'resourceTypes:',
            '  - rt1: ',
            '      '+option+'?:',
            '          '
          ].join('\\n');
          editor.setValue(definition);
          if (notOptOptionals.indexOf(option) !== -1){
            designerAsserts.parserError('5','property: \''+option+'?\' is invalid in a resource type');
            editor.setCursor(6,6);
            designerAsserts.shelfElements(shelf.elemResourceTypeLevel);
          }else{
            editor.setCursor(6,6);
            designerAsserts.shelfElementsNotDisplayed([option], shelf.elemResourceTypeLevel);
          }
        });
      });
    }); // not displayed after being selected.

    describe('named parameter - after being selected', function(){
      namedParameters.forEach(function(namedParameter){
        namedParamElems.forEach(function(namedParamElem){
          it(namedParameter+'-'+namedParamElem+'? property is no longer displayed on the shelf', function(){
            shelf = new ShelfHelper();
            var definition = [
              '#%RAML 0.8',
              'title: My api',
              'baseUri: http://server/api/{hola}',
              'resourceTypes:',
              '  - rt1: ',
              '      '+namedParameter+': ',
              '        hola:',
              '          '+namedParamElem+'?:',
              '              '
            ].join('\\n');
            editor.setValue(definition);

            if (notOptNamedParam.indexOf(namedParamElem) !== -1){
              designerAsserts.parserError('8','unknown property '+namedParamElem+'?');
              editor.setCursor(9,10);
              designerAsserts.shelfElements(shelf.elemNamedParametersLevel);
            }else{
              if(namedParamElem === 'enum'){
//                console.log('enum is not removed from the shelf - #63154018');
//                  https://www.pivotaltracker.com/story/show/63154018
              }else{
                editor.setCursor(9,10);
                designerAsserts.shelfElementsNotDisplayed([namedParamElem], shelf.elemNamedParametersLevel);
              }
            }
          });
        });
      });

      namedParameters.forEach(function(namedParameter){
        namedParamElems.forEach(function(namedParamElem){
          it(namedParameter+'?-'+namedParamElem+'? property is no longer displayed on the shelf', function(){
            shelf = new ShelfHelper();
            var definition = [
              '#%RAML 0.8',
              'title: My api',
              'baseUri: http://server/api/{hola}',
              'resourceTypes:',
              '  - rt1: ',
              '      '+namedParameter+'?: ',
              '        hola:',
              '                    '
            ].join('\\n');
            editor.setValue(definition);
            editor.setCursor(8,10);
            designerAsserts.shelfElements(shelf.elemNamedParametersLevel);
            editor.setLine(8,'          '+namedParamElem+'?:\\n              ');
            if (notOptNamedParam.indexOf(namedParamElem) !== -1){
              designerAsserts.parserError('8','unknown property '+namedParamElem+'?');
              editor.setCursor(9,10);
              designerAsserts.shelfElements(shelf.elemNamedParametersLevel);
            }else{
              if(namedParamElem === 'enum'){
//                console.log('enum is not removed from the shelf - #63154018');
//                  https://www.pivotaltracker.com/story/show/63154018
              }else{
                editor.setCursor(9,10);
                designerAsserts.shelfElementsNotDisplayed([namedParamElem], shelf.elemNamedParametersLevel);
              }
            }
          });
        });
      });

    }); // Not displayed after being selected
  });//resourceTypes elements

}); //optional attributes