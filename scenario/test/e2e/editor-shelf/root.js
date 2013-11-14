'use strict';
var ShelfElements = require ('../../lib/shelf-elements.js').ShelfElements;

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

  describe('root elements',function(){

    describe('RAML version', function(){

      it('should offer RAML version on line 1', function(){
        var definition = '';
        editorSetValue(definition);
        shelfGetElementsFromShelf().then(function(list){
          expect(list.length).toEqual(1);
          expect(list[0].getText()).toEqual(shelfElements.getRamlVersion());
        });
      });

      xit('should not be offer RAML version - line 1 - fail RT-363', function(){
        var definition = '#%RAML 0.8';
        editorSetValue(definition);
        shelfGetElementsFromShelf().then(function(list){
          expect(list.length).toEqual(0);
        });

      });

    }); //RAML version

    describe('root section', function(){

      it('by group', function(){
        var definition = [
          '#%RAML 0.8',
          '      '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(2,1);
        shelfElementsRootByGroupAssertion(shelfElements);
      });

      xdescribe('documentation', function(){

      }); //description

      describe('baseUriParameters - NamedParameter', function(){

        it('baseUriParameters - Named Parameters section by group', function(){
          var definition = [
            '#%RAML 0.8',
            'title: The API',
            'baseUri: http://www.theapi.com/{hola}',
            'baseUriParameters:',
            '  hola:',
            '     '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(6,5);
          shelfElemNamedParametersByGroupAssertion(shelfElements);
        });

        describe('after being selected', function(){
          var options = shelfElements.getNamedParametersLevel();
          options.forEach(function(option){
            it(option+': NamedParameter attribute is no longer displayed on the shelf', function(){
              var definition = [
                '#%RAML 0.8',
                'title: The API',
                'baseUri: http://www.theapi.com/{hola}',
                'baseUriParameters:',
                '  hola:',
                '    '+option+':',
                '      '
              ].join('\\n');
              editorSetValue(definition);
              editorSetCursor(7,5);
              var list2 =[option];
              var listPromise = shelfGetListOfElementsFromShelf();
              listPromise.then(function (list) {
                noShelfElementsAssertion(list, shelfElements.getNamedParametersLevel(),list2);
              });
            });
          });

        }); // Not displayed after being selected

      }); //baseUriParameters

      describe('after being selected', function(){
        var options = shelfElements.getRootLevelWithoutNewResource();
        options.forEach(function(option){
          it(option+': property is no longer displayed on the shelf', function(){
            var definition = [
              '#%RAML 0.8',
              ''+option+': ',
              '  '
            ].join('\\n');
            editorSetValue(definition);
            editorSetCursor(3,1);
            var list2 =[option];
            var listPromise = shelfGetListOfElementsFromShelf();
            listPromise.then(function (list) {
              noShelfElementsAssertion(list, shelfElements.getRootLevel(),list2);
            });
          });
        });
      }); // Not displayed after select
    }); // root section
  }); // root elements

});//shelf
   
