'use strict';
var ShelfHelper = require('../lib/shelf-helper.js').ShelfHelper;
var AssertsHelper = require ('../lib/asserts-helper.js').AssertsHelper;
var EditorHelper = require ('../lib/editor-helper.js').EditorHelper;
xdescribe('optionals Attributes',function(){
  var  shelf = new ShelfHelper();
  var designerAsserts = new AssertsHelper();
  var editor = new EditorHelper();

  beforeEach(function(){
    editor.setValue('');
    expect(editor.getLine(1)).toEqual('');
    designerAsserts.shelfElements(shelf.elemRamlVersion);
    expect(editor.IsParserErrorDisplayed()).toBe(false);
  });


  describe('resourceTypes elements',function(){
    var namedParameters = ['baseUriParameters', 'uriParameters'];
    var namedParamElems = shelf.elemNamedParametersLevel;
    var notOptNamedParam = ['description','displayName','example','default','maxLength','maximum','minLength','minimum','pattern','required','type'];
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
            if (option=== 'description' || option === 'displayName'){
              //https://www.pivotaltracker.com/story/show/61241162
            }else{
              designerAsserts.parserError('5','property: \''+option+'?\' is invalid in a resource type');
            }
          }else{
            editor.setCursor(6,6);
            var list2 =[option];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResourceTypeLevel);
          }
        });
      });
    }); // not displayed after being selected.

    describe('named parameter - after being selected', function(){
      namedParameters.forEach(function(namedParameter){
        namedParamElems.forEach(function(namedParamElem){
          it(namedParameter+'-'+namedParamElem+'? attribute is no longer displayed on the shelf', function(){
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
              if (namedParamElem===''){ // we are missing to add the parser validation to all the properties
                designerAsserts.parserError('8','property: \''+namedParamElem+'?\' is invalid in a resource type');
              }else{
                console.log('missing parser validation for '+namedParamElem);
                //https://www.pivotaltracker.com/story/show/61241162
              }
            }else{
              if(namedParamElem === 'enum'){
                console.log('enum is not removed from the shelf');
//                  https://www.pivotaltracker.com/story/show/63154018
              }else{
                editor.setCursor(9,10);
                var list2 =[namedParamElem];
                designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemNamedParametersLevel);
              }
            }
          });
        });
      });

      namedParameters.forEach(function(namedParameter){
        namedParamElems.forEach(function(namedParamElem){
          it(namedParameter+'?-'+namedParamElem+'? attribute is no longer displayed on the shelf', function(){
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
//              '          '+namedParamElem+'?:',
//              '              '
            ].join('\\n');
            editor.setValue(definition);
            editor.setCursor(8,10);
            designerAsserts.shelfElementsNotDisplayed([], shelf.elemNamedParametersLevel);
            editor.setLine(8,'          '+namedParamElem+'?:\\n              ');
            if (notOptNamedParam.indexOf(namedParamElem) !== -1){
              if (namedParamElem===''){ // we are missing to add the parser validation to all the properties
                designerAsserts.parserError('8','property: \''+namedParamElem+'?\' is invalid in a resource type');
              }else{
                console.log('missing parser validation for '+namedParamElem);
                //https://www.pivotaltracker.com/story/show/61241162
              }
            }else{
              if(namedParamElem === 'enum'){
                console.log('enum is not removed from the shelf');
//                  https://www.pivotaltracker.com/story/show/63154018
              }else{
                editor.setCursor(9,10);
                var list2 =[namedParamElem];
                designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemNamedParametersLevel);
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
    var namedParamElems = shelf.elemNamedParametersLevel;
    var notOptNamedParam = ['description','displayName','example','default','maxLength','maximum','minLength','minimum','pattern','required','type'];
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
            if (methodElem=== 'description' ){
              console.log('missing parser validation for methodElem');
              //https://www.pivotaltracker.com/story/show/61241162
            }else{
              designerAsserts.parserError('6','property: \''+methodElem+'?\' is invalid in a method');
            }
          }else{
            if (methodElem === 'protocols'||methodElem === 'baseUriParameters'||
              methodElem === 'headers' || methodElem === 'queryParameters' ||
              methodElem === 'responses' ||  methodElem === 'body'){
              console.log('shelf is not working properly for this optional property',methodElem);
            }else{
              editor.setCursor(7,8);
              var list2 =[methodElem];
              designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRtMethodLevel);
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
//            '        '+methodElem+'?: ',
//            '            '
          ].join('\\n');
          editor.setValue(definition);
          editor.setCursor(6,8);
//          designerAsserts.shelfElementsNotDisplayed([], shelf.elemRtMethodLevel);  // add when the shelf is working for this properties
          editor.setLine(6,'        '+methodElem+'?: \\n                   ');
          if (notOptMethodElems.indexOf(methodElem) !== -1){
            if (methodElem === 'description' ){
              console.log('missing parser validation '+methodElem);
              //https://www.pivotaltracker.com/story/show/61241162
            }else{
              designerAsserts.parserError('6','property: \''+methodElem+'?\' is invalid in a method');
            }
          }else{
            if (methodElem === 'protocols'||methodElem === 'baseUriParameters'||
              methodElem === 'headers' || methodElem === 'queryParameters' ||
              methodElem === 'responses' ||  methodElem === 'body'){
              console.log('shelf is not working properly for this optional property '+methodElem);
            }else{
              editor.setCursor(7,8);
              var list2 =[methodElem];
              designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRtMethodLevel);
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
                if (namedParamElem===''){ // we are missing to add the parser validation to all the properties
                  designerAsserts.parserError('8','property: \''+namedParamElem+'?\' is invalid in a resource type');
                }else{
                  //https://www.pivotaltracker.com/story/show/61241162
                }
              }else{
                if(namedParamElem === 'enum'){
                  console.log('enum is not removed from the shelf');
//                  https://www.pivotaltracker.com/story/show/63154018
                }else{
                  editor.setCursor(9,12);
                  var list2 =[namedParamElem];
                  designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemNamedParametersLevel);
                }
              }
            });
          });
        });
      });

      methods.forEach(function(method){
        namedParameters.forEach(function(namedParameter){
          namedParamElems.forEach(function(namedParamElem){
            it(method+'-'+namedParameter+'?-'+namedParamElem+'? attribute is no longer displayed on the shelf', function(){
              shelf = new ShelfHelper();
              var definition = [
                '#%RAML 0.8',
                'title: My api',
                'resourceTypes:',
                '  - collection:',
                '      '+method+':',
                '        '+namedParameter+'?: ',
                '          hola:',
                '               '
//                '            '+namedParamElem+'?:',
//                '              '
              ].join('\\n');
              editor.setValue(definition);
              editor.setCursor(8,12);
              designerAsserts.shelfElementsNotDisplayed([], shelf.elemNamedParametersLevel);
              editor.setLine(8,'            '+namedParamElem+'?:\\n                ');
              if (notOptNamedParam.indexOf(namedParamElem) !== -1){
                if (namedParamElem===''){ // we are missing to add the parser validation to all the properties
                  designerAsserts.parserError('8','property: \''+namedParamElem+'?\' is invalid in a resource type');
                }else{
                  //https://www.pivotaltracker.com/story/show/61241162
                }
              }else{
                if(namedParamElem === 'enum'){
                  console.log('enum is not removed from the shelf');
//                  https://www.pivotaltracker.com/story/show/63154018
                }else{
                  editor.setCursor(9,12);
                  var list2 =[namedParamElem];
                  designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemNamedParametersLevel);
                }
              }
            });
          });
        });
      });

      methods.forEach(function(method){
        namedParameters.forEach(function(namedParameter){
          namedParamElems.forEach(function(namedParamElem){
            it(method+'?-'+namedParameter+'?-'+namedParamElem+'? attribute is no longer displayed on the shelf', function(){
              shelf = new ShelfHelper();
              var definition = [
                '#%RAML 0.8',
                'title: My api',
                'resourceTypes:',
                '  - collection:',
                '      '+method+':',
                '        '+namedParameter+'?: ',
                '          hola:',
                '            '+namedParamElem+'?:',
                '                    '
              ].join('\\n');
              editor.setValue(definition);

              if (notOptNamedParam.indexOf(namedParamElem) !== -1){
                if (namedParamElem===''){ // we are missing to add the parser validation to all the properties
                  designerAsserts.parserError('8','property: \''+namedParamElem+'?\' is invalid in a resource type');
                }else{
                  //https://www.pivotaltracker.com/story/show/61241162
                }
              }else{
                if(namedParamElem === 'enum'){
                  console.log('enum is not removed from the shelf');
//                  https://www.pivotaltracker.com/story/show/63154018
                }else{
                  editor.setCursor(9,12);
                  var list2 =[namedParamElem];
                  console.log('');
                  designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemNamedParametersLevel);
                }
              }
            });
          });
        });
      });

    }); // namedParameters

    it('under body? shelf options', function(){
      var definition = [
        ' #%RAML 0.8',
        'title:',
        'baseUri: http://server/api/{hol1}',
        'resourceTypes:',
        '  - hola:',
        '      connect:',
        '        body?:'
      ].join('\\n');
      editor.setValue(definition);
      expect(true).toEqual(false);
    });

    it('under protocols? shelf options', function(){
      var definition = [
        ' #%RAML 0.8',
        'title:',
        'baseUri: http://server/api/{hol1}',
        'resourceTypes:',
        '  - hola:',
        '      connect:',
        '        protocols?:'
      ].join('\\n');
      editor.setValue(definition);
      expect(true).toEqual(false);
    });



  }); // resource-Types Methods

  it('traits - methods', function(){

  });

  it('traits - named parameters', function(){

  });

}); //optional attributes



