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
      shelfElemResourceTypesByGroupAssertion();
    });

    describe('not displayed after being selected', function(){

      it('property is no longer displayed on the shelf', function(){
        var options = shelfGetElemResourceTypesLevel();
        options.forEach(function(option){
          var definition = [
            '#%RAML 0.8',
            'title: My api',
            'resourceTypes:',
            '  - rt1: ',
            '      '+option+':',
            '          '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(6,6);
          var list2 =[option];
          var listPromise = shelfGetListOfElementsFromShelf();
          listPromise.then(function (list) {
            noShelfElementsAssertion(list, shelfGetElemResourceTypesLevel(),list2);
          });
        });
      });

    }); // not displayed after being selected.

    xdescribe('uriParameters - Named Parameter', function(){ // https://www.pivotaltracker.com/story/show/60351064

      it('NamedParameters displayed on the shelf', function(){
        var definition = [
          '#%RAML 0.8',
          'title: My api',
          'resourceTypes:',
          '  - rt1: ',
          '      uriParameters: ',
          '        hola:',
          '           '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(7,9);
        shelfElemNamedParametersByGroupAssertion();
      });

      describe('Not displayed after select', function(){

        it('NamedParameter attribute is no longer displayed on the shelf', function(){
          var options = shelfGetElemNamedParametersLevel();
          options.forEach(function(option){
            var definition = [
              '#%RAML 0.8',
              'title: My api',
              'resourceTypes:',
              '  - rt1: ',
              '      uriParameters: ',
              '        hola:',
              '          '+option+':',
              '              '
            ].join('\\n');
            editorSetValue(definition);
            editorSetCursor(8,13);
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
          'resourceTypes:',
          '  - rt1: ',
          '      baseUriParameters: ',
          '        hola: ',
          '          '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(7,9);
        shelfElemNamedParametersByGroupAssertion();
      });

      describe('Not displayed after select', function(){

        it('NamedParameter attribute is no longer displayed on the shelf', function(){
          var options = shelfGetElemNamedParametersLevel();
          options.forEach(function(option){
            var definition = [
              '#%RAML 0.8',
              'title: My api',
              'resourceTypes:',
              '  - rt1: ',
              '      baseUriParameters: ',
              '        hola: ',
              '          '+option+':',
              '           '
            ].join('\\n');
            editorSetValue(definition);
            editorSetCursor(8,13);
            var list2 =[option];
            var listPromise = shelfGetListOfElementsFromShelf();
            listPromise.then(function (list) {
              noShelfElementsAssertion(list, shelfGetElemNamedParametersLevel(),list2);
            });
          });
        });

      }); // Not displayed after being selected

    }); //baseUriParameters


  });//resourceTypes elements
}); // shelf
