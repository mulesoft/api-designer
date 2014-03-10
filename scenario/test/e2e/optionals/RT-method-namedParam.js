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

  describe('resource-Types Methods', function(){

    var methods = shelf.elemResourceTypeLevelMethods;
    var namedParameters = ['baseUriParameters', 'headers', 'queryParameters'];

    describe('namedParameters', function(){

      methods.forEach(function(method){
        namedParameters.forEach(function(namedParameter){
          namedParamElems.forEach(function(namedParamElem){
            it(method+'-'+namedParameter+'-'+namedParamElem+'? attribute is no longer displayed on the shelf', function(){
              shelf = new ShelfHelper();
              var definition = [
                '#%RAML 0.8',
                'title: My api',
                'baseUri: http://server/api/{hola}',
                'resourceTypes:',
                '  - collection:',
                '      '+method+':',
                '        '+namedParameter+': ',
                '          hola:',
                '            '+namedParamElem+'?:',
                '              '
              ].join('\\n');
              editor.setValue(definition);

              if (notOptNamedParam.indexOf(namedParamElem) !== -1){
                designerAsserts.parserError('9','unknown property '+namedParamElem+'?');
                editor.setCursor(10,12);
                designerAsserts.shelfElements(shelf.elemNamedParametersLevel);
                //https://www.pivotaltracker.com/story/show/61241162
              }else{
                if(namedParamElem === 'enum'){
//                  console.log('enum is not removed from the shelf');
//                  https://www.pivotaltracker.com/story/show/63154018
                }else{
                  editor.setCursor(10,12);
                  designerAsserts.shelfElementsNotDisplayed([namedParamElem], shelf.elemNamedParametersLevel);
                }
              }
            });
          });
        });
      });

      methods.forEach(function(method){
        namedParameters.forEach(function(namedParameter){
          namedParamElems.forEach(function(namedParamElem){
//            63154018 - properties  are not being offered if namedParameter is optional
            xit(method+'-'+namedParameter+'?-'+namedParamElem+'? attribute is no longer displayed on the shelf', function(){
              shelf = new ShelfHelper();
              var definition = [
                '#%RAML 0.8',
                'title: My api',
                'baseUri: http://server/api/{hola}',
                'resourceTypes:',
                '  - collection:',
                '      '+method+':',
                '        '+namedParameter+'?: ',
                '          hola:',
                '               '
              ].join('\\n');
              editor.setValue(definition);
              editor.setCursor(9,12);
              designerAsserts.shelfElements(shelf.elemNamedParametersLevel);
              editor.setLine(9,'            '+namedParamElem+'?:\\n                ');
              if (notOptNamedParam.indexOf(namedParamElem) !== -1){
                designerAsserts.parserError('9','unknown property '+namedParamElem+'?');
                editor.setCursor(10,12);
                designerAsserts.shelfElements(shelf.elemNamedParametersLevel);
              }else{
                if(namedParamElem === 'enum'){
//                  console.log('enum is not removed from the shelf');
//                  https://www.pivotaltracker.com/story/show/63154018
                }else{
                  editor.setCursor(10,12);
                  designerAsserts.shelfElementsNotDisplayed([namedParamElem], shelf.elemNamedParametersLevel);
                }
              }
            });
          });
        });
      });

      methods.forEach(function(method){
        namedParameters.forEach(function(namedParameter){
          namedParamElems.forEach(function(namedParamElem){
//            63154018 - properties  are not being offered if namedParameter is optional
            xit(method+'?-'+namedParameter+'?-'+namedParamElem+'? attribute is no longer displayed on the shelf', function(){
              shelf = new ShelfHelper();
              var definition = [
                '#%RAML 0.8',
                'title: My api',
                'baseUri: http://server/api/{hola}',
                'resourceTypes:',
                '  - collection:',
                '      '+method+'?:',
                '                    '
              ].join('\\n');
              editor.setValue(definition);
              editor.setCursor(7,8);
              designerAsserts.shelfElements(shelf.elemRtMethodLevel);
              editor.setLine(7,'        '+namedParameter+'?: \\n          hola: \\n                ');
              editor.setCursor(9,12);
              designerAsserts.shelfElements(shelf.elemNamedParametersLevel);
              editor.setLine(9,'            '+namedParamElem+'?: \\n                        ');
              if (notOptNamedParam.indexOf(namedParamElem) !== -1){
                designerAsserts.parserError('9','unknown property '+namedParamElem+'?');
                editor.setCursor(10,12);
                designerAsserts.shelfElements(shelf.elemNamedParametersLevel);
              }else{
                if(namedParamElem === 'enum'){
//                  console.log('enum is not removed from the shelf');
//                  https://www.pivotaltracker.com/story/show/63154018
                }else{
                  editor.setCursor(10,12);
                  designerAsserts.shelfElementsNotDisplayed([namedParamElem], shelf.elemNamedParametersLevel);
                }
              }
            });
          });
        });
      });

    }); // namedParameters

  }); // resource-Types Methods

}); //optional attributes
