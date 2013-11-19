'use strict';
var ShelfElements = require ('../../../lib/shelf-elements.js').ShelfElements;
describe('shelf',function(){
  var  shelfElements= new ShelfElements();
////  beforeEach(function () {
//  browser.get('');
//  browser.executeScript(function () {
//    localStorage['config.updateResponsivenessInterval'] = 1;
//    window.onbeforeunload = null;
//  });
//  browser.wait(function(){
//    return editorGetLine(2).then(function(text) {
//      return text === 'title:';
//    });
//  });
////  });

  var options = shelfElements.getResourcelevelWithouNewResource();
  var namedParameters = [ 'baseUriParameters', 'uriParameters'];
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
      editorSetCursor(4,2);
      shelfElementsResourceByGroupAssertion(shelfElements);

    });

    describe('not displayed after being selected', function(){

      options.forEach(function(option){
        it(option+' is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            '/res:',
            '  '+option+': ',
            '    '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(5,2);
          var list2 =[option];
          noShelfElementsAssertion(list2, shelfElements.getResourceLevel());
        });
      });

    }); //not displayed after being selected


    describe('Named Parameter' , function(){

      namedParameters.forEach(function(namedParameter){
        it(namedParameter+' attributes are displayed on the shelf', function(){
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
          editorSetCursor(7,6);
          shelfElemNamedParametersByGroupAssertion(shelfElements);
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
              editorSetCursor(7,6);
              var list2 =[namedParamElem];
              noShelfElementsAssertion(list2, shelfElements.getNamedParametersLevel());
            });
          });
        });

      }); // Not displayed after being selected

    }); //Named Parameters

  });//resource-root elements
}); // shelf