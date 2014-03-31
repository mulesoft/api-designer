'use strict';
var EditorHelper = require('../../lib/editor-helper.js').EditorHelper;
var AssertsHelper = require ('../../lib/asserts-helper.js').AssertsHelper;
var ShelfHelper = require ('../../lib/shelf-helper.js').ShelfHelper;
describe('Mocking service',function(){
	var editor = new EditorHelper();
  var designerAsserts = new AssertsHelper();
  var shelf = new ShelfHelper();

  describe('baseUriParameters defined - mocked uri should add them', function(){
    it('clear editor', function(){
      editor.setValue('');
      expect(editor.getLine(1)).toEqual('');
      designerAsserts.shelfElements(shelf.elemRamlVersion);
      expect(editor.IsParserErrorDisplayed()).toBe(false);
    });

    it('mocking service is disable by default',function(){
      var definition = [
        '#%RAML 0.8',
        'title: mocking with base Uri',
        'baseUri: http://myapi.com/{hola}/next/{hola2}',
        '/rest:'
      ].join('\\n');
      editor.setValue(definition);
      editor.isEnableMockingService().then(function(text){
        expect(text).toEqual('unchecked');
      });
    });

    it('mocking servise button is displayed', function(){
      browser.wait(function(){
        return editor.isMockingServiceHidden().then(function(text){
          return (text)==='not hidden';
        });
      }).then(function(){
        editor.isMockingServiceHidden().then(function(text){
          expect(text).toEqual('not hidden');
        });
      });
    });

    it('enable mocking-service', function(){
      editor.enableDisableMockingService().then(function(){
        editor.isEnableMockingService().then(function(text){
          expect(text).toEqual('checked');
        });
      });
    });

    it('check that original baseUri was commentout', function(){
      expect(editor.getLine(3)).toEqual('#baseUri: http://myapi.com/{hola}/next/{hola2}');
    });

    it('check that new baseUri was added', function(){
//      browser.sleep(5000);
      expect(editor.getLine(4)).toMatch(/baseUri: http:\/\/mocksvc.mulesoft.com\/mocks\/.*\/\{hola\}\/next\/\{hola2\}/);
    });

    it('turn mocking-service off', function(){
      editor.enableDisableMockingService().then(function(){
        editor.isEnableMockingService().then(function(text){
          expect(text).toEqual('unchecked');
        });
      });
    });

    it('original baseUri should be uncomment', function(){
      expect(editor.getLine(3)).toEqual('baseUri: http://myapi.com/{hola}/next/{hola2}');
    });

    it('mocked baseUri should be removed', function(){
      expect(editor.getLine(4)).toEqual('/rest:');
    });

  });

  describe('with baseUri', function(){
//    it('seeting the environment', function(){
//      browser.get('');
//      browser.sleep(2000);
//      var alertDialog = browser.driver.switchTo().alert();
//      alertDialog.sendKeys('example.raml');
//      alertDialog.accept();
//      browser.executeScript(function () {
//        localStorage['config.updateResponsivenessInterval'] = 0;
//        window.onbeforeunload = null;
//      });
//    });

    it('mocking service is disable by default',function(){
      var definition = [
				'#%RAML 0.8',
				'title: mocking with base Uri',
				'baseUri: http://myapi.com',
				'/resres:',
        '  get:'
			].join('\\n');
			editor.setValue(definition);
      editor.isEnableMockingService().then(function(text){
        expect(text).toEqual('unchecked');
      });
    });

    it('mocking servise button is displayed', function(){
      editor.isMockingServiceHidden().then(function(text){
        expect(text).toEqual('not hidden');
      });
    });

    it('enable mocking-service', function(){
      editor.enableDisableMockingService().then(function(){
        editor.isEnableMockingService().then(function(text){
          expect(text).toEqual('checked');
        });
      });
    });

    it('check that original baseUri was commentout', function(){
      expect(editor.getLine(3)).toEqual('#baseUri: http://myapi.com');
    });

    it('check that new baseUri was added', function(){
      expect(editor.getLine(4)).toMatch(/baseUri: http:\/\/mocksvc.mulesoft.com\/mocks\/.*/);
    });

    it('turn mocking-service off', function(){
      editor.enableDisableMockingService().then(function(){
        editor.isEnableMockingService().then(function(text){
          expect(text).toEqual('unchecked');
        });
      });
    });

    it('original baseUri should be uncomment', function(){
      expect(editor.getLine(3)).toEqual('baseUri: http://myapi.com');
    });

    it('mocked baseUri should be removed', function(){
      expect(editor.getLine(4)).toEqual('/resres:');
    });
  });//with baseUri

  describe('tryIt section', function(){
//      pending for new console style to add automated test to check new base uri on try it section
  });

}); //Mocking service