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

  describe('traits', function(){
    var options = shelf.elemTraitsLevel;
    var notOptOptional = ['description','usage','displayName','is', 'securedBy'];
    options.forEach(function(option){
      it(option+': property is no longer displayed on the shelf', function(){
        shelf = new ShelfHelper();
        var definition = [
          '#%RAML 0.8',
          'title: The API',
          'traits: ',
          '  - trait1: ',
          '      '+option+'?: ',
          '          '
        ].join('\\n');
        editor.setValue(definition);
        if (notOptOptional.indexOf(option) !== -1){
          designerAsserts.parserError('5','property: \''+option+'?\' is invalid in a trait');
//          uncomment when 63154018 is fixed
//          editor.setCursor(6,8);
//          designerAsserts.shelfElementsNotDisplayed(option, shelf.elemTraitsLevel);
        }else{
          if (option ==='baseUriParameters'|| option ==='headers' || option === 'queryParameters' ||
            option === 'responses' || option === 'body' || option ==='protocols'){
//            console.log(option+' is not removed from the shelf #63154018');
          }else{
//            console.log('option',option);
            editor.setCursor(6,6);
            designerAsserts.shelfElementsNotDisplayed([option], shelf.elemTraitsLevel);
          }
        }
      });
    });

    describe('Named Parameters', function(){
      var namedParameters = ['baseUriParameters', 'headers', 'queryParameters'];

      namedParameters.forEach(function(namedParameter){
        namedParamElems.forEach(function(namedParamElem){
          it(namedParameter+': '+namedParamElem+'? is no longer displayed on the shelf', function(){
            shelf = new ShelfHelper();
            var definition = [
              '#%RAML 0.8',
              'title: The API',
              'baseUri: http://server/api/{hola}',
              'traits: ',
              '  - trait1: ',
              '      '+namedParameter+': ',
              '        hola:',
              '          '+namedParamElem+'?:',
              '            '
            ].join('\\n');
            editor.setValue(definition);
            if (notOptNamedParam.indexOf(namedParamElem) !== -1){
              designerAsserts.parserError('8','unknown property '+namedParamElem+'?');
//              uncomment when 63154018 is fixed
//              editor.setCursor(7,12);
//              designerAsserts.shelfElements(shelf.elemNamedParametersLevel);
            }else{
              if(namedParamElem === 'enum'){
//                console.log('enum is not removed from the shelf #63154018');
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
          it(namedParameter+'?: '+namedParamElem+'? is no longer displayed on the shelf', function(){
            shelf = new ShelfHelper();
            var definition = [
              '#%RAML 0.8',
              'title: The API',
              'baseUri: http://server/api/{hola}',
              'traits: ',
              '  - trait1: ',
              '      '+namedParameter+'?: ',
              '        hola:',
              '          '+namedParamElem+'?:',
              '            '
            ].join('\\n');
            editor.setValue(definition);
            if (notOptNamedParam.indexOf(namedParamElem) !== -1){
              designerAsserts.parserError('8','unknown property '+namedParamElem+'?');
//              uncomment when 63154018 is fixed
//              editor.setCursor(7,12);
//              designerAsserts.shelfElements(shelf.elemNamedParametersLevel);
            }else{
              if(namedParamElem === 'enum'){
//                console.log('enum is not removed from the shelf #63154018');
//                  https://www.pivotaltracker.com/story/show/63154018
              }else{
                editor.setCursor(9,10);
                designerAsserts.shelfElementsNotDisplayed([namedParamElem], shelf.elemNamedParametersLevel);
              }
            }
          });
        });
      });


    }); // Named Parameters

  }); // traits

}); //optional attributes