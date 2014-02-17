'use strict';
var EditorHelper = require('../../lib/editor-helper.js').EditorHelper;
var AssertsHelper = require('../../lib/asserts-helper.js').AssertsHelper;
var ShelfHelper = require('../../lib/shelf-helper.js').ShelfHelper;
var ConsoleHelper = require('../../lib/console-helper.js').ConsoleHelper;

describe('Embedded-console',function(){
  var editor = new EditorHelper();
  var designerAsserts= new AssertsHelper();
  var apiConsole = new ConsoleHelper();
  var shelf = new ShelfHelper();
  var methods = shelf.elemResourceLevelMethods;

  describe('toggle between method',function(){
    it('set raml', function(){

      var definition = [
        '#%RAML 0.8',
        'title: methods with description',
        'traits:',
        '  - methods:',
        '      description: this is <<method>> description',
        '/resProduct:',
        '  connect:',
        '    is: [methods: {method: connect}]',
        '  delete: ',
        '    is: [methods: {method: delete}]',
        '  get: ',
        '    is: [methods: {method: get}]',
        '  head:',
        '    is: [methods: {method: head}]',
        '  options:',
        '    is: [methods: {method: options}]',
        '  patch:',
        '    is: [methods: {method: patch}]',
        '  post:',
        '    is: [methods: {method: post}]',
        '  put:',
        '    is: [methods: {method: put}]',
        '  trace:',
        '    is: [methods: {method: trace}]',
        '        '
      ].join('\\n');

      editor.setValue(definition);
      designerAsserts.consoleApiTitle('methods with description');
    });

    methods.forEach(function(method){
      it(method+' method description is displayed properly - toggle between methods', function(){
        apiConsole.toggleBetweenMethodByPos(method);
        designerAsserts.consoleValidateCurrentMethodName(method.toUpperCase());
        designerAsserts.consoleValidateMethodDescription('this is '+method+' description');
      });
    });

  }); //toggle between method
}); //Embedded-console
