'use strict';
var ShelfElements = require ('../../lib/shelf-elements.js').ShelfElements;
var AssertsHelper = require ('../../lib/asserts-helper.js').AssertsHelper;
var EditorHelper = require ('../../lib/editor-helper.js').EditorHelper;
var ShelfHelper = require ('../../lib/shelf-helper.js').ShelfHelper;
describe('shelf',function(){
  var  shelfElements= new ShelfElements();
  var assertsHelper= new AssertsHelper();
  var editorHelper= new EditorHelper();
  var shelfHelper= new ShelfHelper();

  describe('root elements',function(){

    describe('RAML version', function(){

      it('should offer RAML version on line 1', function(){
        var definition = '';
        editorHelper.setValue(definition);
        shelfHelper.getElementsShelf().then(function(list){
          expect(list.length).toEqual(1);
          expect(list[0].getText()).toEqual(shelfElements.getRamlVersion()[0]);
        });
      });

      xit('should not be offer RAML version - line 1 - fail RT-363', function(){
        var definition = '#%RAML 0.8';
        editorHelper.setValue(definition);
        shelfHelper.getElementsShelf().then(function(list){
          expect(list.length).toEqual(0);
        });
      });

    }); //RAML version

    describe('root section', function(){

      it('by group', function(){
        var definition = [
          '#%RAML 0.8',
          ' '
        ].join('\\n');
        editorHelper.setValue(definition);
        editorHelper.setCursor(2,1);
        assertsHelper.shelfElementsRootByGroup();
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
          editorHelper.setValue(definition);
          editorHelper.setCursor(6,4);
          assertsHelper.shelfElemNamedParametersByGroup();
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
              editorHelper.setValue(definition);
              editorHelper.setCursor(7,4);
              var list2 =[option];
              assertsHelper.shelfElementsNotDisplayed(list2, shelfElements.getNamedParametersLevel());
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
              ' '
            ].join('\\n');
            editorHelper.setValue(definition);
            editorHelper.setCursor(3,1);
            var list2 =[option];
            assertsHelper.shelfElementsNotDisplayed(list2, shelfElements.getRootLevel());
          });
        });

      }); // Not displayed after select
    }); // root section
  }); // root elements

});//shelf
   
