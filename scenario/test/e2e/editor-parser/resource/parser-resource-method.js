'use strict';
var AssertsHelper = require('../../../lib/asserts-helper.js').AssertsHelper;
var EditorHelper = require('../../../lib/editor-helper.js').EditorHelper;
describe('parser ',function(){
  var designerAsserts= new AssertsHelper();
  var editor= new EditorHelper();

  describe('Methods', function () {

    describe('get', function () {

      it('should fail with displayName property', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: miapi',
          '/r1:',
          '  get:',
          '    displayName:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('6','property: \'displayName\' is invalid in a method');
      });

      it('should fail: method already declared: get', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: miapi',
          '/r1:',
          '  get:',
          '  get:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('6','method already declared: \'get\'');
      });

      describe('protocols', function () {

        it('should fail: Rget-protocols property already used protocol', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            '/reso:',
            '  get:',
            '    protocols: []',
            '    protocols:'
          ].join('\\n');
          editor.setValue(definition);
          designerAsserts.parserError('7','property already used: \'protocols\'');
        });

        it('should fail: Rget-protocol property must be an array', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            '/reso:',
            '  get:',
            '    protocols:'
          ].join('\\n');
          editor.setValue(definition);
          designerAsserts.parserError('6','property must be an array');
        });

        it('should fail: Rget-protocol value must be a string', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            '/reso:',
            '  get:',
            '    protocols:',
            '      - '
          ].join('\\n');
          editor.setValue(definition);
          designerAsserts.parserError('7','value must be a string');
        });

        it('should fail: Rget-protocols only HTTP and HTTPS values are allowed', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            '/reso:',
            '  get:',
            '    protocols:',
            '      - htt'
          ].join('\\n');
          editor.setValue(definition);
          designerAsserts.parserError('7','only HTTP and HTTPS values are allowed');
        });

      }); // protocols


    }); //get

    describe('put', function () {

      it('should fail with displayName property', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: miapi',
          '/r1:',
          '  put:',
          '    displayName:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('6','property: \'displayName\' is invalid in a method');
      });

      it('should fail: method already declared: put', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: miapi',
          '/r1:',
          '  put:',
          '  put:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('6','method already declared: \'put\'');
      });

      describe('protocols', function () {

        it('should fail: Rput-protocols property already used protocol', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            '/reso:',
            '  put:',
            '    protocols: []',
            '    protocols:'
          ].join('\\n');
          editor.setValue(definition);
          designerAsserts.parserError('7','property already used: \'protocols\'');
        });

        it('should fail: Rput-protocol property must be an array', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            '/reso:',
            '  put:',
            '    protocols:'
          ].join('\\n');
          editor.setValue(definition);
          designerAsserts.parserError('6','property must be an array');
        });

        it('should fail: Rput-protocol value must be a string', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            '/reso:',
            '  put:',
            '    protocols:',
            '      - '
          ].join('\\n');
          editor.setValue(definition);
          designerAsserts.parserError('7','value must be a string');
        });

        it('should fail: Rput-protocols only HTTP and HTTPS values are allowed', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            '/reso:',
            '  put:',
            '    protocols:',
            '      - htt'
          ].join('\\n');
          editor.setValue(definition);
          designerAsserts.parserError('7','only HTTP and HTTPS values are allowed');
        });

      }); // protocols

    }); //put

    describe('head', function () {

      it('should fail with displayName property', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: miapi',
          '/r1:',
          '  head:',
          '    displayName:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('6','property: \'displayName\' is invalid in a method');
      });

      it('should fail: method already declared: head', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: miapi',
          '/r1:',
          '  head:',
          '  head:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('6','method already declared: \'head\'');
      });

      describe('protocols', function () {

        it('should fail: Rhead-protocols property already used protocol', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            '/reso:',
            '  head:',
            '    protocols: []',
            '    protocols:'
          ].join('\\n');
          editor.setValue(definition);
          designerAsserts.parserError('7','property already used: \'protocols\'');
        });

        it('should fail: Rhead-protocols property must be an array', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            '/reso:',
            '  head:',
            '    protocols:'
          ].join('\\n');
          editor.setValue(definition);
          designerAsserts.parserError('6','property must be an array');
        });

        it('should fail: Rhead-protocol value must be a string', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            '/reso:',
            '  head:',
            '    protocols:',
            '      - '
          ].join('\\n');
          editor.setValue(definition);
          designerAsserts.parserError('7','value must be a string');
        });

        it('should fail: Rhead-protocols only HTTP and HTTPS values are allowed', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            '/reso:',
            '  head:',
            '    protocols:',
            '      - htt'
          ].join('\\n');
          editor.setValue(definition);
          designerAsserts.parserError('7','only HTTP and HTTPS values are allowed');
        });

      }); // protocols

    }); //head

    describe('options', function () {

      it('should fail with displayName property', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: miapi',
          '/r1:',
          '  options:',
          '    displayName:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('6','property: \'displayName\' is invalid in a method');
      });

      it('should fail: method already declared: options', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: miapi',
          '/r1:',
          '  options:',
          '  options:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('6','method already declared: \'options\'');
      });

      describe('protocols', function () {

        it('should fail: Roptions-protocols property already used protocol', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            '/reso:',
            '  options:',
            '    protocols: []',
            '    protocols:'
          ].join('\\n');
          editor.setValue(definition);
          designerAsserts.parserError('7','property already used: \'protocols\'');
        });

        it('should fail: Roptions-protocol property must be an array', function (){
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            '/reso:',
            '  options:',
            '    protocols:'
          ].join('\\n');
          editor.setValue(definition);
          designerAsserts.parserError('6','property must be an array');
        });

        it('should fail: Roptions-protocol value must be a string', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            '/reso:',
            '  options:',
            '    protocols:',
            '      - '
          ].join('\\n');
          editor.setValue(definition);
          designerAsserts.parserError('7','value must be a string');
        });

        it('should fail: Roptions-protocols only HTTP and HTTPS values are allowed', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            '/reso:',
            '  options:',
            '    protocols:',
            '      - htt'
          ].join('\\n');
          editor.setValue(definition);
          designerAsserts.parserError('7','only HTTP and HTTPS values are allowed');
        });

      }); // protocols

    }); //options

    describe('post', function () {

      it('should fail with displayName property', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: miapi',
          '/r1:',
          '  post:',
          '    displayName:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('6','property: \'displayName\' is invalid in a method');
      });

      it('should fail: method already declared: post', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: miapi',
          '/r1:',
          '  post:',
          '  post:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('6','method already declared: \'post\'');
      });

      describe('protocols', function () {

        it('should fail: Rpost-protocols property already used protocol', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            '/reso:',
            '  post:',
            '    protocols: []',
            '    protocols:'
          ].join('\\n');
          editor.setValue(definition);
          designerAsserts.parserError('7','property already used: \'protocols\'');
        });

        it('should fail: Rpost-protocol property must be an array', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            '/reso:',
            '  post:',
            '    protocols:'
          ].join('\\n');
          editor.setValue(definition);
          designerAsserts.parserError('6','property must be an array');
        });

        it('should fail: Rpost-protocol value must be a string', function (){
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            '/reso:',
            '  post:',
            '    protocols:',
            '      - '
          ].join('\\n');
          editor.setValue(definition);
          designerAsserts.parserError('7','value must be a string');
        });

        it('should fail: Rpost-protocols only HTTP and HTTPS values are allowed', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            '/reso:',
            '  post:',
            '    protocols:',
            '      - htt'
          ].join('\\n');
          editor.setValue(definition);
          designerAsserts.parserError('7','only HTTP and HTTPS values are allowed');
        });

      }); // protocols

    }); //post

    describe('delete', function () {

      it('should fail with displayName property', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: miapi',
          '/r1:',
          '  delete:',
          '    displayName:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('6','property: \'displayName\' is invalid in a method');
      });

      it('should fail: method already declared: delete', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: miapi',
          '/r1:',
          '  delete:',
          '  delete:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('6','method already declared: \'delete\'');
      });

      describe('protocols', function () {

        it('should fail: Rdelete-protocols property already used protocol', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            '/reso:',
            '  delete:',
            '    protocols: []',
            '    protocols:'
          ].join('\\n');
          editor.setValue(definition);
          designerAsserts.parserError('7','property already used: \'protocols\'');
        });

        it('should fail: Rdelete-protocol property must be an array', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            '/reso:',
            '  delete:',
            '    protocols:'
          ].join('\\n');
          editor.setValue(definition);
          designerAsserts.parserError('6','property must be an array');
        });

        it('should fail: Rdelete-protocol value must be a string', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            '/reso:',
            '  delete:',
            '    protocols:',
            '      - '
          ].join('\\n');
          editor.setValue(definition);
          designerAsserts.parserError('7','value must be a string');
        });

        it('should fail: Rdelete-protocols only HTTP and HTTPS values are allowed', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            '/reso:',
            '  delete:',
            '    protocols:',
            '      - htt'
          ].join('\\n');
          editor.setValue(definition);
          designerAsserts.parserError('7','only HTTP and HTTPS values are allowed');
        });

      }); // protocols
    }); //delete

    describe('patch', function () {

      it('should fail with displayName property', function () { //RT-300
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: miapi',
          '/r1:',
          '  patch:',
          '    displayName:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('6','property: \'displayName\' is invalid in a method');
      });

      it('should fail: method already declared: patch', function () {
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: miapi',
          '/r1:',
          '  patch:',
          '  patch:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('6','method already declared: \'patch\'');
      });

      describe('protocols', function () {

        it('should fail: Rpatch-protocols property already used protocol', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            '/reso:',
            '  patch:',
            '    protocols: []',
            '    protocols:'
          ].join('\\n');
          editor.setValue(definition);
          designerAsserts.parserError('7','property already used: \'protocols\'');
        });

        it('should fail: Rpatch-protocol property must be an array', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            '/reso:',
            '  patch:',
            '    protocols:'
          ].join('\\n');
          editor.setValue(definition);
          designerAsserts.parserError('6','property must be an array');
        });

        it('should fail: Rpatch-protocol value must be a string', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            '/reso:',
            '  patch:',
            '    protocols:',
            '      - '
          ].join('\\n');
          editor.setValue(definition);
          designerAsserts.parserError('7','value must be a string');
        });

        it('should fail: Rpatch-protocols only HTTP and HTTPS values are allowed', function () {
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: My API',
            '/reso:',
            '  patch:',
            '    protocols:',
            '      - htt'
          ].join('\\n');
          editor.setValue(definition);
          designerAsserts.parserError('7','only HTTP and HTTPS values are allowed');
        });

      }); // protocols

    }); //patch

  }); // Methods
});