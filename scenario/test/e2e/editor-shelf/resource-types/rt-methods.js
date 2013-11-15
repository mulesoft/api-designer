'use strict';
var ramlUrl = require('../../../config').url;
var ShelfElements = require ('../../../lib/shelf-elements.js').ShelfElements;
describe('shelf',function(){
  var  shelfElements= new ShelfElements();
//  beforeEach(function () {
  browser.get(ramlUrl);
  browser.executeScript(function () {
    localStorage['config.updateResponsivenessInterval'] = 1;
    window.onbeforeunload = null;
  });
  browser.wait(function(){
    return editorGetLine(2).then(function(text) {
      return text === 'title:';
    });
  });
//  });

  var methods = shelfElements.getResourceLevelMethods();
  var namedParameters = ['baseUriParameters', 'headers', 'queryParameters'];
  var namedParamElems = shelfElements.getNamedParametersLevel();
  var methodElems = shelfElements.getRTMethodsLevel();

  describe('rt-methods elements',function(){

    describe('rt-Methods elements',function(){

      methods.forEach(function(method){
        it(method+'- check section', function(){
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            'resourceTypes:',
            '  - collection:',
            '      '+method+':',
            '          '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(6,8);
          shelfElementsRTMethodsByGroupAssertion(shelfElements);
        });
      });

      describe('Named Parameters', function(){ // https://www.pivotaltracker.com/story/show/60351064

        methods.forEach(function(method){
          namedParameters.forEach(function(namedParameter){
            it(method+'-'+namedParameter+'elements displayed on the shelf', function(){
              var definition = [
                '#%RAML 0.8',
                'title: My api',
                'resourceTypes:',
                '  - collection:',
                '      '+method+':',
                '        '+namedParameter+': ',
                '          hola:',
                '             '
              ].join('\\n');
              editorSetValue(definition);
              editorSetCursor(8,13);
              shelfElemNamedParametersByGroupAssertion(shelfElements);
            });
          });
        });

        describe('after being selected', function(){

          methods.forEach(function(method){
            namedParameters.forEach(function(namedParameter){
              namedParamElems.forEach(function(namedParamElem){
                it(method+'-'+namedParameter+'-'+namedParamElem+' attribute is no longer displayed on the shelf', function(){
                  var definition = [
                    '#%RAML 0.8',
                    'title: My api',
                    'resourceTypes:',
                    '  - collection:',
                    '      '+method+':',
                    '        '+namedParameter+': ',
                    '          hola:',
                    '            '+namedParamElem+':',
                    '              '
                  ].join('\\n');
                  editorSetValue(definition);
                  editorSetCursor(9,13);
                  var list2 =[namedParamElem];
                  var listPromise = shelfGetListOfElementsFromShelf();
                  listPromise.then(function (list) {
                    noShelfElementsAssertion(list, shelfElements.getNamedParametersLevel(),list2);
                  });
                });
              });
            });
          });

        }); // Not displayed after being selected

      }); //Named Parameters

      describe('response', function(){

      }); //response

      describe('body', function(){

      }); //body

      describe('after being selected', function(){

        methods.forEach(function(method){
          methodElems.forEach(function(methodElem){
            it(method+'-'+methodElem+' is no longer displayed on the shelf', function(){
              var definition = [
                '#%RAML 0.8',
                'title: My api',
                'resourceTypes:',
                '  - collection:',
                '      '+method+':',
                '        '+methodElem+': ',
                '            '
              ].join('\\n');
              editorSetValue(definition);
              editorSetCursor(7,8);
              var list2 =[methodElem];
              var listPromise = shelfGetListOfElementsFromShelf();
              listPromise.then(function (list) {
                noShelfElementsAssertion(list, shelfElements.getRTMethodsLevel(),list2);
              });
            });
          });
        });

      }); // not displayed after being selected
    });// resource Methods elements
  });//rt-Methods elements
}); // shelf