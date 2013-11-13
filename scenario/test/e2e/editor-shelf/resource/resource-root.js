'use strict';
var expect = require('expect.js');
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

  var options = shelfElements.getResourcelevelWithouNewResource();
  var namedParameters = [ 'baseUriParameters', 'baseUriParameters'];
  var namedParamElems = shelfElements.getNamedParametersLevel();
  describe('resource-root elements',function(){

    it('resource shelf elements by group', function(){
      var definition = [
        '#%RAML 0.8',
        'title: My api',
        '/res:',
        '    '
      ].join('\\n');
      editorSetValue(definition);
      editorSetCursor(4,3);
      shelfElementsResourceByGroupAssertion();

    });

    describe('not displayed after being selected', function(){

      options.forEach(function(option){
        it(option+' is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            '/res:',
            '  '+option+': ',
            '   '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(5,3);
          var list2 =[option];
          var listPromise = shelfGetListOfElementsFromShelf();
          listPromise.then(function (list) {
            noShelfElementsAssertion(list, shelfGetElementsResourceLevel(),list2);
          });
        });
      });

    }); //not displayed after being selected


    xdescribe('Named Parameter' , function(){ // https://www.pivotaltracker.com/story/show/60351064

      namedParameters.forEach(function(namedParameter){
        it(namedParameter+' namedParameters are displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            'baseUri: http://www.theapi.com/{hola}',
            '/res:',
            '  '+namedParameter+': ',
            '    hola: ',
            '        '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(7,7);
          shelfElemNamedParametersByGroupAssertion();
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
              editorSetValue(definition);
              editorSetCursor(7,7);
              var list2 =[namedParamElem];
              var listPromise = shelfGetListOfElementsFromShelf();
              listPromise.then(function (list) {
                noShelfElementsAssertion(list, shelfGetElemNamedParametersLevel(),list2);
              });
            });
          });
        });

      }); // Not displayed after being selected

    }); //Named Parameters

  });//resource-root elements
}); // shelf