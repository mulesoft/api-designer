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




  });//alias
});// parser