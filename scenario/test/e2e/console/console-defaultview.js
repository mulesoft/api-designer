'use strict';
var ShelfHelper = require('../../lib/shelf-helper.js').ShelfHelper;
var EditorHelper = require('../../lib/editor-helper.js').EditorHelper;
var ConsoleHelper = require('../../lib/console-helper.js').ConsoleHelper;
var AssertsHelper = require('../../lib/asserts-helper.js').AssertsHelper;
describe('Console',function(){
  var editor = new EditorHelper();
  var shelf = new ShelfHelper();
  var designerAsserts= new AssertsHelper();
  var apiConsole = new ConsoleHelper();

  it('clear editor', function(){
    editor.setValue('');
    expect(editor.getLine(1)).toEqual('');
    designerAsserts.shelfElements(shelf.elemRamlVersion);
    expect(editor.IsParserErrorDisplayed()).toBe(false);
  });

  describe('default view', function(){

    describe('title', function(){

      it('check title', function(){
        var definition = [
          '#%RAML 0.8',
          'title: My API it this ',
          'resourceTypes: ',
          '  - resourceT1: ',
          '      usage: this is resource 1',
          '    resourceT2:',
          '      description: this is resourceT2 description',
          '/res1:',
          '  type: resourceT1',
          '  get:',
          '  options:',
          '  head:',
          '  /res2:',
          '    type: resourceT2',
          '    description: ',
          '    connect:',
          '    patch:',
          '    post:',
          '    trace:    ',
          '/ress1:',
          '  type: resourceT2',
          '  connect:',
          '  delete:',
          '  patch:',
          '  post:',
          '  put:',
          '  get:',
          '  trace:',
          '  head:',
          '  options:',
          '  /ress2:',
          '    type: resourceT1',
          '    post:',
          '    put:',
          '    get:',
          '    trace:',
          '    head:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.consoleApiTitle('My API it this');
      });
    });

    describe('resources', function(){

      it('collapse all resources tree', function (){
        apiConsole.expandCollapseMainResourcebyPos(0);
        apiConsole.areResourceGroupsCollapsed();
        var expList = ['/res1','/ress1'];
        designerAsserts.consoleMainResources(expList);
      });

      it('expand all resources tree', function (){
        apiConsole.expandCollapseMainResourcebyPos(0);
        apiConsole.areResourceGroupsExpanded();
        var expList = ['/res1','/ress1'];
        designerAsserts.consoleMainResources(expList);
      });

      it('resource Name', function (){
        var expList = ['/res1', '/res1 /res2', '/ress1','/ress1 /ress2' ];
        designerAsserts.consoleResourceName(expList);

      });

      it('methods per resource', function(){
        var expList ={
          'r0':['GET','HEAD','OPTIONS'],
          'r1':['POST','PATCH','TRACE','CONNECT'],
          'r2':['GET','POST','PUT','PATCH','DELETE','HEAD','OPTIONS','TRACE','CONNECT'],
          'r3':['GET','POST','PUT','HEAD','TRACE']
        };
        designerAsserts.consoleResourceMethods(expList);

      });

      it('resource types per resource', function(){
        var expList = ['resourceT1','resourceT2','resourceT2','resourceT1'];
        apiConsole.toggleResourceExpansion();
        designerAsserts.consoleResourceResourceType(expList);
        apiConsole.toggleResourceExpansion();
      });

    }); // Resources

  }); // default view
}); // Console
