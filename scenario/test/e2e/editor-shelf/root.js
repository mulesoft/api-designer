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

      it('offer RAML version on line 1', function(){
        var definition = '';
        editor.setValue(definition);
        shelf.getElements().then(function(list){
          expect(list.length).toEqual(1);
          expect(list[0]).toEqual(shelf.elemRamlVersion[0]);
        });
      });

      it('not be offer RAML version - line 1', function(){
        var definition = '#%RAML 0.8';
        editor.setValue(definition);
        designerAsserts.shelfElementsNotDisplayed(['#%RAML 0.8'], shelf.elemRootLevel);
      });

    }); //RAML version

    describe('root section', function(){

      xit('by group', function(){
        var definition = [
          '#%RAML 0.8',
          ' '
        ].join('\\n');
        editor.setValue(definition);
        editor.setCursor(2,0);
        designerAsserts.ShelfElementsByGroup(shelf.elemRootByGroup);
      });

      describe('documentation', function(){
        it('documentation - basic node - adding title from  shelf', function(){

          var definition = [
            '#%RAML 0.8',
            'title: The API',
            '       \\n      \\n      \\n      \\n      \\n     \\n'
          ].join('\\n');
          designerAsserts.checkSyntaxHignlight(1, 0, editor.ramlTagSHighlight);
          designerAsserts.checkSyntaxHignlight(2, 0, editor.keySHighlight);
          editor.setValue(definition);
          editor.setCursor(3,0);
          shelf.selectShelfElemByPos(4);
          expect(editor.getLine(3)).toEqual('documentation:');
          designerAsserts.checkSyntaxHignlight(3, 0, editor.keySHighlight);
          editor.setCursor(4,2);
          shelf.selectShelfElemByPos(1);
          expect(editor.getLine(4)).toEqual('  - title: My API');
          designerAsserts.checkSyntaxHignlight(4, 1, editor.keySHighlight);
          shelf = new ShelfHelper();
          editor.setCursor(5,4);
          designerAsserts.shelfElementsNotDisplayed(['title'], shelf.elemDocumentationLevel);
          editor.setCursor(5,4);
          shelf.selectShelfElemByPos(0);
          expect(editor.getLine(5)).toEqual('    content:');
          designerAsserts.checkSyntaxHignlight(5,0,editor.keySHighlight);
          shelf = new ShelfHelper();
          editor.setCursor(6,4);
          designerAsserts.shelfElementsNotDisplayed(['title','content'], shelf.elemDocumentationLevel);
          shelf = new ShelfHelper();
          editor.setCursor(6,2);
          designerAsserts.shelfElements(shelf.elemDocumentationLevel);
          shelf.selectShelfElemByPos(0);
          expect(editor.getLine(6)).toEqual('  - content:');
          designerAsserts.checkSyntaxHignlight(6,1,editor.keySHighlight);
          shelf = new ShelfHelper();
          editor.setCursor(7,4);
          designerAsserts.shelfElementsNotDisplayed(['content'], shelf.elemDocumentationLevel);
          shelf = new ShelfHelper();
          editor.setCursor(7,2);
          designerAsserts.shelfElements(shelf.elemDocumentationLevel);
          editor.setCursor(7,4);
          shelf.selectShelfElemByPos(0);
          expect(editor.getLine(7)).toEqual('    title: My API');
          designerAsserts.checkSyntaxHignlight(7,0,editor.keySHighlight);
          shelf = new ShelfHelper();
          editor.setCursor(8,4);
          designerAsserts.shelfElementsNotDisplayed(['title','content'], shelf.elemDocumentationLevel);
          shelf = new ShelfHelper();
          editor.setCursor(8,2);
          designerAsserts.shelfElements(shelf.elemDocumentationLevel);
        });


        it('documentation - basic node - adding multiples nodes  from  shelf as list', function(){
          var definition = [
            '#%RAML 0.8',
            'title: The API',
            '     \\n    \\n    \\n    \\n    \\n   \\n'
          ].join('\\n');
          editor.setValue(definition);
          editor.setCursor(3,0);
          shelf.selectShelfElemByPos(4);
          expect(editor.getLine(3)).toEqual('documentation:');
          editor.setCursor(4,2);
          shelf.selectShelfElemByPos(1);
          expect(editor.getLine(4)).toEqual('  - title: My API');
          editor.setCursor(5,4);
          shelf = new ShelfHelper();
          designerAsserts.shelfElementsNotDisplayed(['title'], shelf.elemDocumentationLevel);
          shelf = new ShelfHelper();
          editor.setCursor(5,2);
          designerAsserts.shelfElements(shelf.elemDocumentationLevel);
          shelf.selectShelfElemByPos(0);
          expect(editor.getLine(5)).toEqual('  - content:');
          editor.setCursor(6,4);
          shelf = new ShelfHelper();
          designerAsserts.shelfElementsNotDisplayed(['content'], shelf.elemDocumentationLevel);
        });

        it('Adding Descriotion with multiline text - check syntaxhighlight', function(){
          var definition = [
            '#%RAML 0.8',
            'title: my api',
            'documentation: ',
            '  - content: |',
            '      this is documentation 1 comment ',
            '      with more than one line',
            '    title: Doc section 1 title'
          ].join('\\n');
          editor.setValue(definition);
          designerAsserts.checkSyntaxHignlight(1,0,editor.ramlTagSHighlight);
          designerAsserts.checkSyntaxHignlight(2,0,editor.keySHighlight);
          designerAsserts.checkSyntaxHignlight(3,0,editor.keySHighlight);
          designerAsserts.checkSyntaxHignlight(4,1,editor.keySHighlight);
//          designerAsserts.checkSyntaxHignlight(5,1,editor.keySHighlight);
          designerAsserts.checkSyntaxHignlight(7,0,editor.keySHighlight);


        });

//        shelf
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
          designerAsserts.ShelfElementsByGroup(shelf.elemNamedParametersByGroups);
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
            editor.setCursor(3,0);
            var list2 =[option];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRootLevel);
          });
        });

      }); // Not displayed after select
    }); // root section
  }); // root elements

});//shelf
   
