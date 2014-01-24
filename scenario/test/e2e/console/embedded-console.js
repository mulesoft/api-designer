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
    expect(editor.IsParserErrorDisplayed()).toBe(false);
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
    expect(embeddedConsole.getAttribute('class')).not.toContain('ng-hide');
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
      apiConsole.expandCollapseResourcebyPos(0);
      var expDescriptions = ['this is res1 description','this is res1 description'];
      designerAsserts.consoleResourceDescription(expDescriptions);
    });
  }); // verify parser response on the console


  describe('documentation section', function(){

    it('toggle between views (documentation and api reference', function(){
//      this test verify that by default the documentation section is hidden
      var definition = [
        '#%RAML 0.8',
        'title: My api',
        'documentation:',
        '  - title: My docs1',
        '    content: | ',
        '      content of my doc1',
        '/presentation: ',
        '  description: presentation resource description'
      ].join('\\n');
      editor.setValue(definition);
      apiConsole.toggleDocumentationApiReference('documentation');
      apiConsole.getListMainResources().then(function(list){
        expect(list.length).toEqual(0);
      });
      apiConsole.toggleDocumentationApiReference('api');
      apiConsole.getListMainResources().then(function(list){
        expect(list.length).toEqual(1);
      });
    });

    it('check documentation view', function(){
      var definition = [
        '#%RAML 0.8',
        'title: My api',
        'documentation:',
        '  - title: My docs1',
        '    content: | ',
        '      content of my doc1',
        '  - title: My docs2',
        '    content: content of my doc2',
        '/presentation: ',
        '  description: presentation resource description'
      ].join('\\n');
      editor.setValue(definition);
      var expTitle = ['My docs1', 'My docs2'];
      var expContent = ['content of my doc1','content of my doc2' ];
      apiConsole.toggleDocumentationApiReference('documentation');
      apiConsole.getListMainResources().then(function(list){
        expect(list.length).toEqual(0);
      });
      designerAsserts.consoleValidateDocumentationSectionPlainText(expTitle, expContent);
    });

    xdescribe('Markdown', function(){

      it('validate titles',function(){

      });

      it('validate lists', function(){

      });


    });//Markdown
  });//documentation section

});// Embedded-console