'use strict';
var expect = require('expect.js');
var ramlUrl = require('../../../config').url;
describe('shelf',function(){

  beforeEach(function () {
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
  });

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

      it('property is no longer displayed on the shelf', function(){
        var options = shelfGetElementsResourceLevelWithoutNewResoource();
        options.forEach(function(option){
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

    xdescribe('uriParameters - Named Parameter', function(){ // https://www.pivotaltracker.com/story/show/60351064

      it('NamedParameters displayed on the shelf', function(){
        var definition = [
          '#%RAML 0.8',
          'title: My api',
          'baseUri: http://www.theapi.com/',
          '/{hola}:',
          '  uriParameters: ',
          '    hola:',
          '        '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(7,7);
        shelfElemNamedParametersByGroupAssertion();
      });

      describe('Not displayed after select', function(){

        it('NamedParameter attribute is no longer displayed on the shelf', function(){
          var options = shelfGetElemNamedParametersLevel();
          options.forEach(function(option){
            var definition = [
              '#%RAML 0.8',
              'title: My api',
              'baseUri: http://www.theapi.com/',
              '/{hola}:',
              '  baseUriParameters: ',
              '    hola:',
              '      '+option+':',
              '        '
            ].join('\\n');
            editorSetValue(definition);
            editorSetCursor(7,7);
            var list2 =[option];
            var listPromise = shelfGetListOfElementsFromShelf();
            listPromise.then(function (list) {
              noShelfElementsAssertion(list, shelfGetElemNamedParametersLevel(),list2);
            });
          });
        });
      }); // Not displayed after being selected

    }); //uriParameters


    xdescribe('baseUriParameters - Named Parameter' , function(){ // https://www.pivotaltracker.com/story/show/60351064

      it('Named Parameters displayed on the shelf', function(){
        var definition = [
          '#%RAML 0.8',
          'title: My api',
          'baseUri: http://www.theapi.com/{hola}',
          '/res:',
          '  baseUriParameters: ',
          '    hola: ',
          '        '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(7,7);
        shelfElemNamedParametersByGroupAssertion();
      });

      describe('Not displayed after select', function(){

        it('NamedParameter attribute is no longer displayed on the shelf', function(){
          var options = shelfGetElemNamedParametersLevel();
          options.forEach(function(option){
            var definition = [
              '#%RAML 0.8',
              'title: My api',
              'baseUri: http://www.theapi.com/{hola}',
              '/res:',
              '  baseUriParameters: ',
              '    hola:',
              '      '+option+':',
              '         '
            ].join('\\n');
            editorSetValue(definition);
            editorSetCursor(7,7);
            var list2 =[option];
            var listPromise = shelfGetListOfElementsFromShelf();
            listPromise.then(function (list) {
              noShelfElementsAssertion(list, shelfGetElemNamedParametersLevel(),list2);
            });
          });
        });

      }); // Not displayed after being selected

    }); //baseUriParameters

  });//resource-root elements
}); // shelf