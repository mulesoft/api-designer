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

    it('expected alphabetic or numeric character but found ', function(){
      var definition = [
        '#%RAML 0.8 ',
        'title: My api',
        'version: v1',
        '/res1: ',
        '  description: this is res1 description',
        '  displayName: resource 1     ',
        '  get: &'
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.parserError('7','expected alphabetic or numeric character but found \'\'');
    });

    xit('error using alias is displayed on the correct lien ', function(){
    //https://www.pivotaltracker.com/story/show/63038252
      var definition = [
        '#%RAML 0.8',
        'title: My api',
        'version: v1',
        '/res1: &res1',
        '  description: this is res1 description',
        '  displayName: resource 1',
        '/res3: ',
        '  get: *res1'
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.parserError('8','property: \'displayName\' is invalid in a method');
    });
  });//alias

  it('responses null', function(){ //https://www.pivotaltracker.com/story/show/62857424
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


  it('nested resource name /type', function(){
    var ramlexam = [
      '#%RAML 0.8',
      'title: my api',
      'resourceTypes:',
      '  - hola:',
      '      description: this is hola description',
      '/type:',
      '  /type:'
    ].join('\\n');
    editor.setValue(ramlexam);
    expect(editor.IsParserErrorDisplayed()).toBe(false);
  });

  describe('error mark is displayed', function(){

    it('when the code is  folded', function(){
      var definition = [
        '#%RAML 0.8',
        'title: errorCollapsed',
        '/collapsed1:',
        '  /collapsed2:',
        '    description: this is res2 description',
        '    /collapsed3:',
        '      /collapsed4:',
        '        post:',
        '          headers:',
        '            hola2:',
        '              type integer'
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.parserError('11','each header must be a map');
      editor.foldCodebyPos(6).then(function(){
        designerAsserts.parserError('9','Error on line 11: each header must be a map');
      });
      editor.foldCodebyPos(5).then(function(){
        designerAsserts.parserError('8','Error on line 11: each header must be a map');
      });
      editor.foldCodebyPos(4).then(function(){
        designerAsserts.parserError('7','Error on line 11: each header must be a map');
      });
      editor.foldCodebyPos(3).then(function(){
        designerAsserts.parserError('6','Error on line 11: each header must be a map');
      });
      editor.foldCodebyPos(2).then(function(){
        designerAsserts.parserError('4','Error on line 11: each header must be a map');
      });
      editor.foldCodebyPos(1).then(function(){
        designerAsserts.parserError('3','Error on line 11: each header must be a map');
      });
    });

    it('error message - code folded - edit raml', function(){
      var definition= [
        '#%RAML 0.8',
        'title: error when code is folded.',
        '/res:',
        '  post:',
        '    baseUriParameters:',
        '       ',
        '  patch:',
        '    '
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.parserError('5','base uri parameters defined when there is no baseUri');
      editor.foldCodebyPos(2);
      designerAsserts.parserError('4','Error on line 5: base uri parameters defined when there is no baseUri');
      editor.setLine(8, '    description: this is a description');
      designerAsserts.parserError('4','Error on line 5: base uri parameters defined when there is no baseUri');
    });
  });


});// parser