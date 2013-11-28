'use strict';
var ShelfHelper = require ('../../lib/shelf-helper.js').ShelfHelper;
var AssertsHelper = require ('../../lib/asserts-helper.js').AssertsHelper;
var EditorHelper = require ('../../lib/editor-helper.js').EditorHelper;
describe('shelf',function(){
  var shelf = new ShelfHelper();
  var designerAsserts = new AssertsHelper();
  var editor = new EditorHelper();

  describe('root elements',function(){

    describe('RAML version', function(){

      it('should offer RAML version on line 1', function(){
        var definition = '';
        editor.setValue(definition);
        shelf.getElements().then(function(list){
          expect(list.length).toEqual(1);
          expect(list[0].getText()).toEqual(shelf.elemRamlVersion[0]);
        });
      });

      it('should not be offer RAML version - line 1 - fail RT-363', function(){
        var definition = '#%RAML 0.8';
        editor.setValue(definition);
        shelf.getElements().then(function(list){
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
        editor.setValue(definition);
        editor.setCursor(2,1);
        designerAsserts.shelfElementsRootByGroup();
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
          editor.setValue(definition);
          editor.setCursor(6,4);
          designerAsserts.shelfElemNamedParametersByGroup();
        });

        describe('after being selected', function(){
          var options = shelf.elemNamedParametersLevel;
          options.forEach(function(option){
            it(option+': NamedParameter attribute is no longer displayed on the shelf', function(){
              shelf = new ShelfHelper();
              var definition = [
                '#%RAML 0.8',
                'title: The API',
                'baseUri: http://www.theapi.com/{hola}',
                'baseUriParameters:',
                '  hola:',
                '    '+option+':',
                '      '
              ].join('\\n');
              editor.setValue(definition);
              editor.setCursor(7,4);
              var list2 =[option];
              designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemNamedParametersLevel);
            });
          });

        }); // Not displayed after being selected

      }); //baseUriParameters

      describe('after being selected', function(){
        var options = shelf.elemRootLevelWithoutNewResource;
        options.forEach(function(option){
          it(option+': property is no longer displayed on the shelf', function(){
            shelf = new ShelfHelper();
            var definition = [
              '#%RAML 0.8',
              ''+option+': ',
              ' '
            ].join('\\n');
            editor.setValue(definition);
            editor.setCursor(3,1);
            var list2 =[option];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRootLevel);
          });
        });

      }); // Not displayed after select
    }); // root section
  }); // root elements

});//shelf
   
