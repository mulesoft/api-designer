'use strict';
var AssertsHelper = require ('../../lib/asserts-helper.js').AssertsHelper;
var EditorHelper = require ('../../lib/editor-helper.js').EditorHelper;
describe('parser ',function(){
  var designerAsserts= new AssertsHelper();
  var editor= new EditorHelper();

  describe('alias', function(){

    it('found undefined alias', function(){
      var definition = [
        '#%RAML 0.8 ',
        'title: My api',
        '/res1: &res1',
        '  description: this is res1 description',
        '  /res2: *res'
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.parserError('5','found undefined alias res');
    });

    xit('responses null', function(){ //https://www.pivotaltracker.com/story/show/62857424
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: GitHub API',
        'version: v3',
        'mediaType:  application/json',
        '/res:',
        '  get:',
        '    responses: '
      ].join('\\n');
      editor.setValue(definition);
      expect(editor.IsParserErrorDisplayed()).toBe(false);
    });

  });//alias
});// parser