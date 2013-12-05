'use strict';
var ShelfHelper = require('../../lib/shelf-helper.js').ShelfHelper;
var AssertsHelper = require ('../../lib/asserts-helper.js').AssertsHelper;
var EditorHelper = require ('../../lib/editor-helper.js').EditorHelper;
describe('shelf',function(){
  var  shelf = new ShelfHelper();
  var designerAsserts = new AssertsHelper();
  var editor = new EditorHelper();

  beforeEach(function(){
    editor.setValue('');
    expect(editor.getLine(1)).toEqual('');
    designerAsserts.shelfElements(shelf.elemRamlVersion);
    designerAsserts.parserError('1', 'The first line must be: \'#%RAML 0.8\'');
  });

  describe('Adding elements from shelf',function(){

    it('elements added ', function(){
      var definition = [
        '#%RAML 0.8',
        'title: hola',
        'resourceTypes:',
        '  - hola:',
        '      trace: \\n      '
      ].join('\\n');
      editor.setValue(definition);
      editor.setCursor(6,0);
      shelf.getElements().then(function(list){
        list[0].click();
      });
      expect(editor.getLine(6)).toEqual('version: v0.1');
    });

    it('elements added like with blanks at the end', function(){
      var definition = [
        '#%RAML 0.8',
        'title: hola',
        '/res:',
        '  options: \\n        '
      ].join('\\n');
      editor.setValue(definition);
      editor.setCursor(5,2);
      shelf.getElements().then(function(list){
        list[0].click();
      });
      expect(editor.getLine(5)).toEqual('  displayName:');
    });

    it('elements are added below', function(){
      editor.setCursor(1,0);
      var lista = ['#%RAML 0.8','title: My API','version: v0.1','schemas:','baseUri: http://server/api/{version}','mediaType:','protocols:','documentation:','baseUriParameters:','securitySchemes:','securedBy:','/newResource:','  displayName: resourceName','  description:','  options:','    description: <<insert text or markdown here>>','    protocols:','    baseUriParameters:','    headers:','    queryParameters:','    responses:','    securedBy:','    is:','    body:'];
      var i=1;
      var promise;
      lista.forEach(function(elem){
        var t = i++;
        if (elem === '  displayName: resourceName' || elem === '    description: <<insert text or markdown here>>'){
          expect(editor.getLine(t)).toEqual(elem);
          t++;
        }else{
          promise = shelf.selectFirstElem();
          promise.then(function(){
            expect(editor.getLine(t)).toEqual(elem);
            t++;
          });
        }
      });
    });

  });// adding elements from shelf

}); // Shelf

