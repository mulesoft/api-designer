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

  beforeEach(function(){
    editor.setValue('');
    expect(editor.getLine(1)).toEqual('');
    designerAsserts.shelfElements(shelf.elemRamlVersion);
    expect(editor.IsParserErrorDisplayed()).toBe(false);
  });


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

  });

}); //optional attributes