'use strict';
var ShelfElements = require ('../../../lib/shelf-elements.js').ShelfElements;
describe('shelf',function(){
  var  shelfElements= new ShelfElements();
//  beforeEach(function () {
    browser.get('/');
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

  var namedParameters = ['baseUriParameters', 'uriParameters'];
  var namedParamElems = shelfElements.getNamedParametersLevel();
  var options = shelfElements.getResourceTypeLevel();

  describe('resourceTypes elements',function(){
    it('resource shelf elements by group', function(){
      var definition = [
        '#%RAML 0.8',
        'title: My api',
        'resourceTypes:',
        '  - rt1: ',
        '        '
      ].join('\\n');
      editorSetValue(definition);
      editorSetCursor(5,6);
      shelfElemResourceTypesByGroupAssertion(shelfElements);
    });

    describe('after being selected', function(){

      options.forEach(function(option){
        it(option+' is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            'resourceTypes:',
            '  - rt1: ',
            '      '+option+':',
            '          '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(6,7);
          var list2 =[option];
          var listPromise = shelfGetListOfElementsFromShelf();
          listPromise.then(function (list) {
            noShelfElementsAssertion(list, shelfElements.getResourceTypeLevel(),list2);
          });
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
          editorSetValue(definition);
          editorSetCursor(7,10);
          shelfElemNamedParametersByGroupAssertion(shelfElements);
        });
      });

      describe('after being  selected', function(){
        namedParameters.forEach(function(namedParameter){
          namedParamElems.forEach(function(namedParamElem){
            it(namedParameter+'-'+namedParamElem+' attribute is no longer displayed on the shelf', function(){
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
              editorSetValue(definition);
              editorSetCursor(8,13);
              var list2 =[namedParamElem];
              var listPromise = shelfGetListOfElementsFromShelf();
              listPromise.then(function (list) {
                noShelfElementsAssertion(list, shelfElements.getNamedParametersLevel(),list2);
              });
            });
          });
        });
      }); // Not displayed after being selected
    }); //NamedParameters


  });//resourceTypes elements
}); // shelf
