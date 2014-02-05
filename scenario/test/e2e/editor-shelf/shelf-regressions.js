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
    expect(editor.IsParserErrorDisplayed()).toBe(false);
  });

  it('groups',function(){
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

  xdescribe('elements',function(){ // enable when https://www.pivotaltracker.com/story/show/64386678 is fixed

    it('added below on an array', function(){
      var definition = [
        '#%RAML 0.8',
        'title: hola',
        'resourceTypes:',
        '  - hola:',
        '      trace: \\n      '
      ].join('\\n');
      editor.setValue(definition);
      editor.setCursor(6,0);
      shelf.getElementsPromise().then(function(list){
        list[0].click();
      });
      expect(editor.getLine(6)).toEqual('baseUri: http://server/api/{version}');
    });

    it('add in a line with blanks at the end', function(){
      var definition = [
        '#%RAML 0.8',
        'title: hola',
        '/res:',
        '  options: \\n        '
      ].join('\\n');
      editor.setValue(definition);
      editor.setCursor(5,2);
      shelf.getElementsPromise().then(function(list){
        list[0].click();
      });
      expect(editor.getLine(5)).toEqual('  description:');
    });

    it('are added below', function(){
      var  shelf = new ShelfHelper();
      editor.setCursor(1,0);
      var lista = ['#%RAML 0.8', 'baseUri: http://server/api/{version}', 'mediaType:',
        'protocols:', 'title: My API', 'version: v0.1', 'documentation:', 'baseUriParameters:',
        'securedBy:', 'securitySchemes:', '/newResource:', '  displayName: resourceName',
        '  description:', '  connect:', '    description: <<insert text or markdown here>>',
        '    protocols:', '    baseUriParameters:', '    headers:', '    queryParameters:',
        '    responses:', '    securedBy:', '    is:', '    body:'];
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

    it('root level - some lines with indent below', function(){
      var definition = [
        '#%RAML 0.8',
        'title: hola',
        'resourceTypes:',
        '  - hola: ',
        '      options:',
        '        description: <<insert text or markdown here>>',
        ' ',
        '  ',
        '  ',
        '  '
      ].join('\\n');
      editor.setValue(definition);
      editor.setCursor(7,0);
      var promise = shelf.selectFirstElem();
      promise.then(function(){
        expect(editor.getLine(7)).toEqual('baseUri: http://server/api/{version}');
      });
    });

  });// adding elements from shelf

  describe('using alias & *', function(){

    it('in a resource', function(){
      var  shelf = new ShelfHelper();
      var definition = [
        '#%RAML 0.8 ',
        'title: My api',
        'version: v1',
        '/res1: &res1',
        '  description: this is res1 description',
        '  displayName: resource 1',
        '  get:',
        '    description: get into resource 1',
        '/res2: *res1',
        '                '
      ].join('\\n');
      editor.setValue(definition);
      editor.setCursor(10,0);
      var list2 = ['title', 'version'];
      designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRootLevel);
      editor.setCursor(10, 2);
      designerAsserts.shelfWithNoElements();
    });

    it('in a method', function(){
      var  shelf = new ShelfHelper();
      var definition = [
        '#%RAML 0.8 ',
        'title: My api',
        'version: v1',
        '/res1: ',
        '  description: this is res1 description',
        '  displayName: resource 1     ',
        '  get: &metho1',
        '    description: this is method description',
        '    body:',
        '      application/json:',
        '    responses:',
        '      200:',
        '        description: 200 ok',
        '        body: ',
        '          application/json:     ',
        '/res3: ',
        '  get: *metho1',
        '            '
      ].join('\\n');
      editor.setValue(definition);
      editor.setCursor(18,0);
      var list2 = ['title', 'version'];
      designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRootLevel);
      var list22 = ['get'];
      editor.setCursor(18, 2);
      designerAsserts.shelfElementsNotDisplayed(list22, shelf.elemResourceLevel);
      editor.setCursor(18, 4);
      designerAsserts.shelfWithNoElements();
    });

    it('in a Named Parameter', function(){
      var  shelf = new ShelfHelper();
      var definition = [
        '#%RAML 0.8 ',
        'title: My api',
        'version: v1',
        '/res1: ',
        '  description: this is res1 description',
        '  displayName: resource 1     ',
        '  get: ',
        '    description: this is method description',
        '    headers: &head1',
        '      head1:',
        '        displayName: head1 DN',
        '        description: head1 description',
        '        type: integer',
        '  ',
        '/res3: ',
        '  post:',
        '    headers: *head1',
        '            '
      ].join('\\n');
      editor.setValue(definition);
      editor.setCursor(18,0);
      var list2 = ['title', 'version'];
      designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRootLevel);
      editor.setCursor(18, 2);
      list2 = ['post'];
      designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResourceLevel);
      editor.setCursor(18, 4);
      list2 = ['headers'];
      designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemMethodLevel);
      editor.setCursor(18, 6);
      designerAsserts.shelfWithNoElements();
    });

  }); // using alias & *

  describe('suggester', function(){
    it('Is not broken if a comments is in between', function(){
      var definition = [
        '#%RAML 0.8',
        'title: Test',
        'baseUri: http://localhost ',
        'version: 1.0',
        'protocols: [HTTPS]',
        '/users:',
        '#comment',
        '  get:  ',
        '      '
      ].join('\\n');
      editor.setValue(definition);
      editor.setCursor(9,4);
      designerAsserts.shelfElements(shelf.elemMethodLevel);
    });

    it('Is not broken if a empty line is in between', function(){
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Test Mock API',
        '/shapes:',
        '',
        '  get:',
        '    responses:',
        '      200:',
        '          '
      ].join('\\n');
      editor.setValue(definition);
      editor.setCursor(9,8);
      designerAsserts.shelfElements(shelf.elemResponsesLevel);
    });
  });

}); // Shelf

