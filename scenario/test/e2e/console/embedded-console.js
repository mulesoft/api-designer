'use strict';
var EditorHelper = require('../../lib/editor-helper.js').EditorHelper;
var AssertsHelper = require('../../lib/asserts-helper.js').AssertsHelper;
var ShelfHelper = require('../../lib/shelf-helper.js').ShelfHelper;
var ConsoleHelper = require('../../lib/console-helper.js').ConsoleHelper;

describe('Embedded-console',function(){
  var editor = new EditorHelper();
  var designerAsserts= new AssertsHelper();
  var shelf = new ShelfHelper();
  var apiConsole = new ConsoleHelper();

  beforeEach(function(){
    editor.setValue('');
    expect(editor.getLine(1)).toEqual('');
    designerAsserts.shelfElements(shelf.elemRamlVersion);
    expect(editor.noErrorIsDisplayed()).toBe(false);
  });

  it('it is not displayed if are parser errors', function(){
    var definition = [
      '#%RAML 0.8',
      'title: My API',
      '/res: ',
      '  get: ',
      '  /res2:'
    ].join('\\n');
    editor.setValue(definition);
    var embeddedConsole = browser.findElement(by.css('[role="console"]'));
    expect(embeddedConsole.getAttribute('class')).toEqual('');
    editor.setLine(5,'  res2:');
    expect(embeddedConsole.getAttribute('class')).toEqual('ng-hide');
  });

  describe('verify parser response on the console', function(){
    it('using alias', function(){
      var definition = [
        '#%RAML 0.8 ',
        'title: My api',
        '/res1: &res1',
        '  description: this is res1 description',
        '  /res2: *res1'
      ].join('\\n');
      editor.setValue(definition);
      var expList = ['/res1','/res1 /res2'];
      designerAsserts.consoleResourceName(expList);
      apiConsole.expandResourcebyPos(0);
      var expDescriptions = ['this is res1 description','this is res1 description'];
      designerAsserts.consoleResourceDescription(expDescriptions);
    });
  }); // verify parser response on the console

});// Embedded-console