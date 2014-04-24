'use strict';
var AssertsHelper = require ('../../lib/asserts-helper.js').AssertsHelper;
var EditorHelper = require ('../../lib/editor-helper.js').EditorHelper;
describe('parser',function(){
  var designerAsserts= new AssertsHelper();
  var editor= new EditorHelper();

  describe('root', function(){

    describe('include', function () {

      it('file circular reference', function () {
        editor.addNewFile('theExample.raml');
        var definition = [
          '#%RAML 0.8',
          'title: !include theExample.raml'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('2', 'detected circular !include of theExample.raml');
      });

      it('broken links', function () {
        var definition = [
          '#%RAML 0.8',
          'title: !include https://some.broken.link.com/'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('2','error: cannot fetch https://some.broken.link.com/, check that the server is up and that CORS is enabled');
      });

      it('file name/URL cannot be null', function () {
        var definition = [
          '#%RAML 0.8',
          'title: Mi Api',
          'traits: !include'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('3', 'file name/URL cannot be null');
      });

    }); //include

    it('should fail: The first line must be: #%RAML 0.8', function(){
      var definition = '';
      editor.setValue(definition);
      expect(editor.IsParserErrorDisplayed()).toBe(false);
    });

    it('should fail: unsupported raml version #%RAML 0.1', function () {
      var definition = [
        '#%RAML 0.1'
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.parserError('1','Unsupported RAML version: \'#%RAML 0.1\'');
    });

    it('should fail: unsupported raml version #%RAML', function () {
      var definition = [
        '#%RAML'
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.parserError('1','The first line must be: \'#%RAML 0.8\'');
    });

    it('should fail: document must be a map---', function () {
      var definition = [
        '#%RAML 0.8',
        '---'
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.parserError('2','document must be a map');
    });

    it('should fail: document must be a map(titl)', function () {
      var definition = [
        '#%RAML 0.8',
        'titl'
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.parserError('2','document must be a map');
    });

    it('should fail: empty document (only comments)', function () {
      var definition = [
        '#%RAML 0.8',
        '#---'
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.parserError('1','empty document');
    });

    it('should fail: block map end ...', function () {
      var definition = [
        '#%RAML 0.8',
        'title: Example Api',
        '...',
        'version: 1.0'
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.parserError('4','expected \'<document start>\', but found <block mapping end>');
    });

    it('should fail: missing title', function () {
      var definition = [
        '#%RAML 0.8',
        'version: v1'
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.parserError('2','missing title');
    });

    it('should fail: missing version', function () {
      var definition = [
        '#%RAML 0.8',
        'title: hola',
        'baseUri: http://server/api/{version}'
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.parserError('2','missing version');
    });

    describe('baseUri', function () {

      it('should fail: baseUri must have a value', function () {
        var definition = [
          '#%RAML 0.8',
          'title: My API',
          'baseUri:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('3','baseUri must have a value');
      });

    }); //baseUri

    describe('baseUriParameters', function () {

      it('should fail: invalid map - baseUriParameters/Uri1/{require}', function () {
        var definition = [
          '#%RAML 0.8',
          'title: Test',
          'baseUri: http://server/api/{version}/{uri1}',
          'version: v1',
          'baseUriParameters: ',
          '  uri1: ',
          '    require'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('6','URI parameter must be a map');
      });

      it('should fail: baseUriParameter - version parameter not allowed here', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: hola',
          'version: v0.1',
          'baseUri: http://server/api/{version}',
          'baseUriParameters:',
          '  version:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('7','version parameter not allowed here');
      });

      it('should fail when no baseUri is defined', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: my title',
          'baseUriParameters:',
          '  hols:',
          '    displayName: hola'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('5','uri parameters defined when there is no baseUri');
      });

      it('should fail: uri parameter unused', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: my title',
          'baseUri: http://www.myapi.com/',
          'baseUriParameters:',
          '  hola:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('6','hola uri parameter unused');
      });

    }); //baseUriParameters

    describe('Documentation', function () {

      it('should fail: Documentation - unkown property Documentation', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'Documentation:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('4','unknown property Documentation');
      });

      it('should fail: documentation must be an array', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'documentation:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('4','documentation must be an array');
      });

      it('should fail: each documentation section must be a map', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'documentation:',
          '  -'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('5','each documentation section must be a map');
      });

      it('should fail: title must be a string', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'documentation:',
          '  - title:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('5','title must be a string');
      });

      it('should fail: content must be a string', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'documentation:',
          '  - content:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('5','content must be a string');
      });

      it('should fail: a documentation entry must have a content property', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'documentation:',
          '  - title: hola'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('5','a documentation entry must have content property');
      });

      it('should fail: a documentation entry must have title property', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'documentation:',
          '  - content: hola'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('5','a documentation entry must have title property');
      });

      it('should fail: root property already used documentation', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'documentation:',
          '  - title: hola',
          '    content: my content',
          'documentation:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('7','root property already used: \'documentation\'');
      });

      it('should fail: property already used title', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'documentation:',
          '  - title: hola',
          '    title:',
          '    content: my content'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('6','property already used: \'title\'');
      });

      it('should fail: property already used content', function (){
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'documentation:',
          '  - title: hola',
          '    content: my content',
          '    content:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('7','property already used: \'content\'');
      });

    }); //Documentation

    describe('protocols', function () {

      it('should fail: root property already used protocol', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'protocols: []',
          'protocols:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('5','root property already used: \'protocols\'');
      });


      it('should fail: protocol property must be an array', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'protocols:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('4','property must be an array');
      });


      it('should fail: protocol value must be a string', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'protocols:',
          '  - '
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('5','value must be a string');
      });

      it('should fail: only HTTP and HTTPS values are allowed', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'protocols:',
          '  - htt'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('5','only HTTP and HTTPS values are allowed');
      });

    }); //protocols
    describe('schemas', function () {

      it('should fail: schemas property must be an array', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: Test',
          'schemas:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('4','schemas property must be an array');
      });



    }); //schemas

    describe('keys duplicated', function(){

      it('should fail: root property already used title', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'title:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('4','root property already used: \'title\'');
      });
      it('should fail: root property already used version', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'version: v1',
          'version:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('5','root property already used: \'version\'');
      });
      it('should fail: root property already used baseUri', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'baseUri: http://www.myapi.com',
          'baseUri:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('5','root property already used: \'baseUri\'');
      });
      it('should fail: root property already used baseUriParameters', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'baseUriParameters:',
          'baseUriParameters:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('5','root property already used: \'baseUriParameters\'');
      });
      it('should fail: root property already used mediaType', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'mediaType: hola',
          'mediaType:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('5','root property already used: \'mediaType\'');
      });
      it('should fail: root property already used traits', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'traits: []',
          'traits:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('5','root property already used: \'traits\'');
      });

      it('should fail: root property already used resourceTypes', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'resourceTypes: []',
          'resourceTypes:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('5','root property already used: \'resourceTypes\'');
      });

      it('should fail: root property already used schemas', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'schemas: []',
          'schemas:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('5','root property already used: \'schemas\'');
      });

      it('should fail: root property already used securitySchemes', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'securitySchemes: []',
          'securitySchemes:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('5','root property already used: \'securitySchemes\'');
      });

    }); // Keys Duplicated

  }); // Root

}); // parser
