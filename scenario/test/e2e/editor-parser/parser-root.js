'use strict';
describe('parser ',function(){
//  browser.get('');
//  browser.executeScript(function () {
//    localStorage['config.updateResponsivenessInterval'] = 1;
//    window.onbeforeunload = null;
//  });
//  browser.wait(function(){
//    return editorGetLine(2).then(function(text) {
//      return text === 'title:';
//    });
//  });

  describe('root', function(){

    describe('include', function () {

      xit('should fail: file circular reference', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: !include example.ramln'
        ].join('\\n');
        editorSetValue(definition);
        editorParserErrorAssertions('3', 'detected circular !include of example.raml');
      });

      it('should fail: test ', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: !include http://some.broken.link.com\\n'
        ].join('\\n');
        editorSetValue(definition);
        editorParserErrorAssertions('3','error: cannot fetch http://some.broken.link.com');
      });

      it('should fail: file name/URL cannot be null', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: Mi Api',
          'trait: !include'
        ].join('\\n');
        editorSetValue(definition);
        editorParserErrorAssertions('4', 'file name/URL cannot be null');
      });

    }); //include

    it('should fail: The first line must be: #%RAML 0.8', function(){
      var definition = '';
      editorSetValue(definition);
      editorParserErrorAssertions('1','The first line must be: \'#%RAML 0.8\'');
    });

    it('should fail: unsupported raml version #%RAML 0.1', function () {
      var definition = [
        '#%RAML 0.1'
      ].join('\\n');
      editorSetValue(definition);
      editorParserErrorAssertions('1','Unsupported RAML version: \'#%RAML 0.1\'');
    });

    it('should fail: document must be a map---', function () {
      var definition = [
        '#%RAML 0.8',
        '---'
      ].join('\\n');
      editorSetValue(definition);
      editorParserErrorAssertions('2','document must be a map');
    });

    it('should fail: document must be a map(titl)', function () {
      var definition = [
        '#%RAML 0.8',
        '---',
        'titl'
      ].join('\\n');
      editorSetValue(definition);
      editorParserErrorAssertions('3','document must be a map');
    });

    it('should fail: empty document (only comments)', function () {
      var definition = [
        '#%RAML 0.8',
        '#---'
      ].join('\\n');
      editorSetValue(definition);
      editorParserErrorAssertions('1','empty document');
    });

    it('should fail: block map end ...', function () {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: Example Api',
        '...',
        'version: 1.0'
      ].join('\\n');
      editorSetValue(definition);
      editorParserErrorAssertions('5','expected \'<document start>\', but found <block mapping end>');
    });

    it('should fail: missing title', function () {
      var definition = [
        '#%RAML 0.8',
        '---',
        'version: v1'
      ].join('\\n');
      editorSetValue(definition);
      editorParserErrorAssertions('3','missing title');
    });

    it('should fail: missing version', function () {
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: hola',
        'baseUri: http://server/api/{version}'
      ].join('\\n');
      editorSetValue(definition);
      editorParserErrorAssertions('3','missing version');
    });

    describe('baseUri', function () {

      it('should fail: baseUri must have a value', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'baseUri:'
        ].join('\\n');
        editorSetValue(definition);
        editorParserErrorAssertions('4','baseUri must have a value');
      });

    }); //baseUri

    describe('baseUriParameters', function () {

      it('should fail: invalid map - baseUriParameters/Uri1/{require}', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: Test',
          'baseUri: http://server/api/{version}/{uri1}',
          'version: v1',
          'baseUriParameters: ',
          '  uri1: ',
          '    require'
        ].join('\\n');
        editorSetValue(definition);
        editorParserErrorAssertions('7','URI parameter must be a map');
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
        editorSetValue(definition);
        editorParserErrorAssertions('7','version parameter not allowed here');
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
        editorSetValue(definition);
        editorParserErrorAssertions('5','uri parameters defined when there is no baseUri');
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
        editorSetValue(definition);
        editorParserErrorAssertions('6','hola uri parameter unused');
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
        editorSetValue(definition);
        editorParserErrorAssertions('4','unknown property Documentation');
      });

      it('should fail: documentation must be an array', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'documentation:'
        ].join('\\n');
        editorSetValue(definition);
        editorParserErrorAssertions('4','documentation must be an array');
      });

      it('should fail: each documentation section must be a map', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'documentation:',
          '  -'
        ].join('\\n');
        editorSetValue(definition);
        editorParserErrorAssertions('5','each documentation section must be a map');
      });

      it('should fail: title must be a string', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'documentation:',
          '  - title:'
        ].join('\\n');
        editorSetValue(definition);
        editorParserErrorAssertions('5','title must be a string');
      });

      it('should fail: content must be a string', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'documentation:',
          '  - content:'
        ].join('\\n');
        editorSetValue(definition);
        editorParserErrorAssertions('5','content must be a string');
      });

      it('should fail: a documentation entry must have a content property', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'documentation:',
          '  - title: hola'
        ].join('\\n');
        editorSetValue(definition);
        editorParserErrorAssertions('5','a documentation entry must have content property');
      });

      it('should fail: a documentation entry must have title property', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'documentation:',
          '  - content: hola'
        ].join('\\n');
        editorSetValue(definition);
        editorParserErrorAssertions('5','a documentation entry must have title property');
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
        editorSetValue(definition);
        editorParserErrorAssertions('7','root property already used: \'documentation\'');
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
        editorSetValue(definition);
        editorParserErrorAssertions('6','property already used: \'title\'');
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
        editorSetValue(definition);
        editorParserErrorAssertions('7','property already used: \'content\'');
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
        editorSetValue(definition);
        editorParserErrorAssertions('5','root property already used: \'protocols\'');
      });


      it('should fail: protocol property must be an array', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'protocols:'
        ].join('\\n');
        editorSetValue(definition);
        editorParserErrorAssertions('4','property must be an array');
      });


      it('should fail: protocol value must be a string', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'protocols:',
          '  - '
        ].join('\\n');
        editorSetValue(definition);
        editorParserErrorAssertions('5','value must be a string');
      });

      it('should fail: only HTTP and HTTPS values are allowed', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'protocols:',
          '  - htt'
        ].join('\\n');
        editorSetValue(definition);
        editorParserErrorAssertions('5','only HTTP and HTTPS values are allowed');
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
        editorSetValue(definition);
        editorParserErrorAssertions('4','schemas property must be an array');
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
        editorSetValue(definition);
        editorParserErrorAssertions('4','root property already used: \'title\'');
      });
      it('should fail: root property already used version', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'version: v1',
          'version:'
        ].join('\\n');
        editorSetValue(definition);
        editorParserErrorAssertions('5','root property already used: \'version\'');
      });
      it('should fail: root property already used baseUri', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'baseUri: http://www.myapi.com',
          'baseUri:'
        ].join('\\n');
        editorSetValue(definition);
        editorParserErrorAssertions('5','root property already used: \'baseUri\'');
      });
      it('should fail: root property already used baseUriParameters', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'baseUriParameters:',
          'baseUriParameters:'
        ].join('\\n');
        editorSetValue(definition);
        editorParserErrorAssertions('5','root property already used: \'baseUriParameters\'');
      });
      it('should fail: root property already used mediaType', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'mediaType: hola',
          'mediaType:'
        ].join('\\n');
        editorSetValue(definition);
        editorParserErrorAssertions('5','root property already used: \'mediaType\'');
      });
      it('should fail: root property already used traits', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'traits: []',
          'traits:'
        ].join('\\n');
        editorSetValue(definition);
        editorParserErrorAssertions('5','root property already used: \'traits\'');
      });

      it('should fail: root property already used resourceTypes', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'resourceTypes: []',
          'resourceTypes:'
        ].join('\\n');
        editorSetValue(definition);
        editorParserErrorAssertions('5','root property already used: \'resourceTypes\'');
      });

      it('should fail: root property already used schemas', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'schemas: []',
          'schemas:'
        ].join('\\n');
        editorSetValue(definition);
        editorParserErrorAssertions('5','root property already used: \'schemas\'');
      });

      it('should fail: root property already used securitySchemes', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: My API',
          'securitySchemes: []',
          'securitySchemes:'
        ].join('\\n');
        editorSetValue(definition);
        editorParserErrorAssertions('5','root property already used: \'securitySchemes\'');
      });

    }); // Keys Duplicated

  }); // Root

}); // parser
