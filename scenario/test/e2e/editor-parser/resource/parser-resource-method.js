'use strict';
var AssertsHelper = require('../../../lib/asserts-helper.js').AssertsHelper;
var EditorHelper = require('../../../lib/editor-helper.js').EditorHelper;
var ShelfHelper = require('../../../lib/shelf-helper.js').ShelfHelper;

describe('parser ',function(){
  var designerAsserts= new AssertsHelper();
  var editor= new EditorHelper();
  var shelf = new ShelfHelper();
  var methods = shelf.elemResourceLevelMethods;

  describe('Methods', function () {

    methods.forEach(function(method){
      it(method+' - should fail with displayName property', function () {
        var definition = [
          '#%RAML 0.8',
          'title: miapi',
          '/r1:',
          '  '+method+':',
          '    displayName:'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('5','property: \'displayName\' is invalid in a method');
      });
    });

    methods.forEach(function(method){
      it(method+' should fail: method already declared: '+method, function () {
        var definition = [
          '#%RAML 0.8',
          'title: miapi',
          '/r1:',
          '  '+method+':',
          '  '+method+':'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.parserError('5','method already declared: \''+method+'\'');
      });
    });

    describe('protocols', function () {
      methods.forEach(function(method){
        it(method+' should fail: protocols property already used protocol', function () {
          var definition = [
            '#%RAML 0.8',
            'title: My API',
            '/reso:',
            '  '+method+':',
            '    protocols: []',
            '    protocols:'
          ].join('\\n');
          editor.setValue(definition);
          designerAsserts.parserError('6','property already used: \'protocols\'');
        });
      });

      methods.forEach(function(method){
        it(method+' should fail: protocol property must be an array', function () {
          var definition = [
            '#%RAML 0.8',
            'title: My API',
            '/reso:',
            '  '+method+':',
            '    protocols:'
          ].join('\\n');
          editor.setValue(definition);
          designerAsserts.parserError('5','property must be an array');
        });
      });

      methods.forEach(function(method){
        it(method+' should fail: protocol value must be a string', function () {
          var definition = [
            '#%RAML 0.8',
            'title: My API',
            '/reso:',
            '  '+method+':',
            '    protocols:',
            '      - '
          ].join('\\n');
          editor.setValue(definition);
          designerAsserts.parserError('6','value must be a string');
        });
      });

      methods.forEach(function(method){
        it(method+' should fail: protocols only HTTP and HTTPS values are allowed', function () {
          var definition = [
            '#%RAML 0.8',
            'title: My API',
            '/reso:',
            '  '+method+':',
            '    protocols:',
            '      - htt'
          ].join('\\n');
          editor.setValue(definition);
          designerAsserts.parserError('6','only HTTP and HTTPS values are allowed');
        });
      });

    }); // protocols

  }); // Methods
});