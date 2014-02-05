'use strict';
var ShelfHelper = require('../lib/shelf-helper.js').ShelfHelper;
var AssertsHelper = require ('../lib/asserts-helper.js').AssertsHelper;
var EditorHelper = require ('../lib/editor-helper.js').EditorHelper;
describe('optionals Attributes',function(){
  var  shelf = new ShelfHelper();
  var designerAsserts = new AssertsHelper();
  var editor = new EditorHelper();
  var notOptNamedParam = ['description','displayName','example','default','maxLength','maximum','minLength','minimum','pattern','required','type'];
  var namedParamElems = shelf.elemNamedParametersLevel;

//
//  beforeEach(function(){
//    editor.setValue('');
//    expect(editor.getLine(1)).toEqual('');
//    designerAsserts.shelfElements(shelf.elemRamlVersion);
//    expect(editor.IsParserErrorDisplayed()).toBe(false);
//  });


  describe('resource-Types Methods', function(){

    var methods = shelf.elemResourceTypeLevelMethods;
    var namedParameters = ['baseUriParameters', 'headers', 'queryParameters'];
    var methodElems = shelf.elemRtMethodLevel;
    var notOptMethodElems = [ 'description', 'securedBy', 'is'];

    methods.forEach(function(method){
      methodElems.forEach(function(methodElem){
        it(method+'-'+methodElem+'? is no longer displayed on the shelf', function(){
          shelf = new ShelfHelper();
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            'resourceTypes:',
            '  - collection:',
            '      '+method+':',
            '        '+methodElem+'?: ',
            '            '
          ].join('\\n');
          editor.setValue(definition);
          if (notOptMethodElems.indexOf(methodElem) !== -1){
            designerAsserts.parserError('6','property: \''+methodElem+'?\' is invalid in a method');
            editor.setCursor(7,8);
            designerAsserts.shelfElements(shelf.elemRtMethodLevel);
          }else{
            if (methodElem === 'protocols'||methodElem === 'baseUriParameters'||
              methodElem === 'headers' || methodElem === 'queryParameters' ||
              methodElem === 'responses' ||  methodElem === 'body'){
//              console.log(methodElem+' is not removed from the shelf #63154018');
            }else{
              editor.setCursor(7,8);
              designerAsserts.shelfElementsNotDisplayed([methodElem], shelf.elemRtMethodLevel);
            }
          }
        });
      });
    });

    methods.forEach(function(method){
      methodElems.forEach(function(methodElem){
        it(method+'? -'+methodElem+'? is no longer displayed on the shelf', function(){
          shelf = new ShelfHelper();
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            'resourceTypes:',
            '  - collection:',
            '      '+method+'?:',
            '                    '
          ].join('\\n');
          editor.setValue(definition);
          editor.setCursor(6,8);
          designerAsserts.shelfElements(shelf.elemRtMethodLevel);  // add when the shelf is working for this properties
          editor.setLine(6,'        '+methodElem+'?: \\n                   ');
          if (notOptMethodElems.indexOf(methodElem) !== -1){
            designerAsserts.parserError('6','property: \''+methodElem+'?\' is invalid in a method');
            editor.setCursor(7,8);
            designerAsserts.shelfElements(shelf.elemRtMethodLevel);
          }else{
            if (methodElem === 'protocols'||methodElem === 'baseUriParameters'||
              methodElem === 'headers' || methodElem === 'queryParameters' ||
              methodElem === 'responses' ||  methodElem === 'body'){
//              console.log(methodElem+' is not removed from the shelf #63154018');
            }else{
              editor.setCursor(7,8);
              designerAsserts.shelfElementsNotDisplayed([methodElem], shelf.elemRtMethodLevel);
            }
          }
        });
      });
    });

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

    methods.forEach(function(method){
      xit(method+' under body? shelf options', function(){
//    bug in the spec - not properly defined
        var definition = [
          ' #%RAML 0.8',
          'title:',
          'baseUri: http://server/api/{hol1}',
          'resourceTypes:',
          '  - hola:',
          '      '+method+':',
          '        body?:'
        ].join('\\n');
        editor.setValue(definition);
        expect(true).toEqual(false);
      });
    });

    methods.forEach(function(method){
      xit(method+' under protocols? shelf options', function(){
//        shelf is not working properly - not options is offer under protocols? 63154018
        var definition = [
          ' #%RAML 0.8',
          'title:',
          'baseUri: http://server/api/{hol1}',
          'resourceTypes:',
          '  - hola:',
          '      '+method+':',
          '        protocols?:'
        ].join('\\n');
        editor.setValue(definition);
        expect(true).toEqual(false);
      });
    });

    methods.forEach(function(method){
      xit(method+' under description? shelf options', function(){
//         shelf is not working properly - not options is offer under responses? 63154018
        var definition = [
          ' #%RAML 0.8',
          'title:',
          'baseUri: http://server/api/{hol1}',
          'resourceTypes:',
          '  - hola:',
          '      '+method+':',
          '        responses?:',
          '          200:',
          '              '
        ].join('\\n');
        editor.setValue(definition);
        expect(true).toEqual(false);
      });
    });


  }); // resource-Types Methods

}); //optional attributes