'use strict';
var EditorHelper = require('../../lib/editor-helper.js').EditorHelper;
// var AssertsHelper = require('../../lib/asserts-helper.js').AssertsHelper;
// var ShelfHelper = require('../../lib/shelf-helper.js').ShelfHelper;
// var ConsoleHelper = require('../../lib/console-helper.js').ConsoleHelper;

describe('Mocking service',function(){
	var editor = new EditorHelper();

	xdescribe('should not displayed mocking service button',function(){


		xdescribe('non parsable files', function(){
			xit('raml file without raml version', function (){

			});

		}); // non parsable files

	}); // should not displayed mocking service button

  describe('with baseUri', function(){

    it('mocking service is disable by default',function(){
      var definition = [
				'#%RAML 0.8',
				'title: mocking with base Uri',
				'baseUri: http://myapi.com',
				'/res:'
			].join('\\n');
			editor.setValue(definition);
      expect(editor.isEnableMockingService()).toEqual('unchecked');
    });

    it('mocking servise button is displayed', function(){
      expect(editor.isMockingServiceHidden()).toEqual('not hidden');
    });

    it('enable mocking-service', function(){
      editor.enableDisableMockingService().then(function(){
        expect(editor.isEnableMockingService()).toEqual('checked');
      });
    });

    it('check that original baseUri was commentout', function(){
      expect(editor.getLine(3)).toEqual('#baseUri: http://myapi.com');

    });

    it('check that new baseUri was added', function(){
      expect(editor.getLine(4)).toMatch(/baseUri: http:\/\/ec2-54-235-9-197.compute-1.amazonaws.com:8080\/mocks\/.*/);

    });

    it('turn mocking-service off', function(){
      editor.enableDisableMockingService().then(function(){
        expect(editor.isEnableMockingService()).toEqual('unchecked');
      });
    });

    it('original baseUri should be uncomment', function(){
      expect(editor.getLine(3)).toEqual('baseUri: http://myapi.com');
    });

    it('mocked baseUri should be removed', function(){
      expect(editor.getLine(4)).toEqual('/res:');
    });
  });//with baseUri


//      pending for new console style to add automated test to check new base uri on try it section



  xit('baseUriParameters defined - mocked uri should add them', function(){
// currently mocked base uri is ignoring the baseUriParameters - the idea is that those can be added to the new url.

  });

  describe('tryIt section', function(){

  });

  xdescribe('non raml files', function(){
    xit('yaml',function(){

    });
    xit('json',function(){

    });
    xit('xml', function(){

    });
    xit('xsd', function(){

    });
    xit('md', function(){

    });
  }); // non raml files


}); //Mocking service