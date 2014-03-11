'use strict';
var ShelfHelper = require ('../../lib/shelf-helper.js').ShelfHelper;
var AssertsHelper = require ('../../lib/asserts-helper.js').AssertsHelper;
var EditorHelper = require ('../../lib/editor-helper.js').EditorHelper;
describe('shelf',function(){
  var shelf = new ShelfHelper();
  var designerAsserts = new AssertsHelper();
  var editor = new EditorHelper();

  describe('protocols', function(){

    describe('adding from shelf', function(){

      describe('root level', function(){

        it('protocols elements displayed on shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: my api',
            'protocols: ',
            '   '
          ].join('\\n');
          editor.setValue(definition);
          editor.setCursor(4,2);
          designerAsserts.ShelfElementsByGroup(shelf.elemProtocolsByGroup);
        });

        it('add HTTP', function(){
          editor.setCursor(4,2);
          designerAsserts.checkSyntaxHignlight(1, 0, editor.ramlTagSHighlight);
          designerAsserts.checkSyntaxHignlight(2, 0, editor.keySHighlight);
          designerAsserts.checkSyntaxHignlight(3, 0, editor.keySHighlight);
          shelf.selectShelfElemByPos(0);
          designerAsserts.shelfElementsNotDisplayed(['HTTP'], shelf.elemProtocolsLevel);
          designerAsserts.checkHignlightAndSwimLines(4, [0,2], ['cm-indent cm-indent-col-0',editor.cmMeta]);
          expect(editor.getLine(4)).toEqual('  - HTTP ');
        });

        it('add HTTPS', function(){
          shelf.selectShelfElemByPos(0);
          shelf = new ShelfHelper();
          designerAsserts.shelfElementsNotDisplayed(['HTTP', 'HTTPS'], shelf.elemProtocolsLevel);
          designerAsserts.checkHignlightAndSwimLines(5, [0,2], ['cm-indent cm-indent-col-0',editor.cmMeta]);
          expect(editor.getLine(5)).toEqual('  - HTTPS');
        });

      }); //root level

      describe('resource type method level', function(){
        var methods = shelf.elemResourceLevelMethods;
        methods.forEach(function(method){
          it(method+' protocols elements displayed on the shelf', function(){
            var definition = [
              '#%RAML 0.8',
              'title: my api',
              'resourceTypes:',
              '  - res:',
              '      '+method+':',
              '        protocols:',
              '          '
            ].join('\\n');
            editor.setValue(definition);
            editor.setCursor(7,10);
            designerAsserts.ShelfElementsByGroup(shelf.elemProtocolsByGroup);
          });

          it(method+' add HTTP', function(){
            shelf.selectShelfElemByPos(0);
            shelf = new ShelfHelper();
            designerAsserts.shelfElementsNotDisplayed(['HTTP'], shelf.elemProtocolsLevel);
            expect(editor.getLine(7)).toEqual('          - HTTP');
          });

          it(method+' add HTTPS', function(){
            shelf.selectShelfElemByPos(0);
            shelf = new ShelfHelper();
            editor.setCursor(8,10);
            expect(editor.getLine(8)).toEqual('          - HTTPS');
            designerAsserts.shelfElementsNotDisplayed(['HTTP', 'HTTPS'], shelf.elemProtocolsLevel);
          });
        });
      }); //resource type methods

      describe('traits', function(){

        it('protocols elements displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: my api',
            'traits:',
            '  - trait:',
            '      protocols:',
            '        '
          ].join('\\n');
          editor.setValue(definition);
          editor.setCursor(6,8);
          designerAsserts.ShelfElementsByGroup(shelf.elemProtocolsByGroup);
        });

        it('add HTTP', function(){
          shelf.selectShelfElemByPos(0);
          shelf = new ShelfHelper();
          designerAsserts.shelfElementsNotDisplayed(['HTTP'], shelf.elemProtocolsLevel);
          expect(editor.getLine(6)).toEqual('        - HTTP');
        });

        it('add HTTPS', function(){
          shelf.selectShelfElemByPos(0);
          shelf = new ShelfHelper();
          editor.setCursor(7,8);
          expect(editor.getLine(7)).toEqual('        - HTTPS');
          designerAsserts.shelfElementsNotDisplayed(['HTTP', 'HTTPS'], shelf.elemProtocolsLevel);
        });

      }); //traits

      describe('resource method', function(){
        var methods = shelf.elemResourceLevelMethods;
        methods.forEach(function(method){
          it(method+' protocols elements displayed on the shelf', function(){
            var definition = [
              '#%RAML 0.8',
              'title: my api',
              '/tecno:',
              '  '+method+':',
              '    protocols:',
              '          '
            ].join('\\n');
            editor.setValue(definition);
            editor.setCursor(6,6);
            designerAsserts.ShelfElementsByGroup(shelf.elemProtocolsByGroup);
          });

          it(method+' add HTTP', function(){
            shelf.selectShelfElemByPos(0);
            shelf = new ShelfHelper();
            designerAsserts.shelfElementsNotDisplayed(['HTTP'], shelf.elemProtocolsLevel);
            expect(editor.getLine(6)).toEqual('      - HTTP    ');
          });

          it(method+' add HTTPS', function(){
            shelf.selectShelfElemByPos(0);
            shelf = new ShelfHelper();
            editor.setCursor(7,8);
            expect(editor.getLine(7)).toEqual('      - HTTPS');
            designerAsserts.shelfElementsNotDisplayed(['HTTP', 'HTTPS'], shelf.elemProtocolsLevel);
          });
        });
      }); //resource Methods

    }); // adding from shelf

  }); // protocols

});//shelf