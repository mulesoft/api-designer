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
        'resourceTypes:',
        '  - general:',
        '      description: general resource type',
        '      uriParameters:',
        '        hola:',
        '          required: true',
        '          type: integer',
        '          displayName: Hola',
        '          example: uno',
        '          default: DOS',
        '          maximum: 10',
        '          minimum: 4',
        '        chau:',
        '          description: this is the description CHau',
        '          required: false',
        '          type: string',
        '          example: Chau',
        '          default: chau',
        '          maxLength: 6',
        '          minLength: 2',
        '          pattern: "a*a"',
        '          enum: [hola, chau, adios]',
        'traits:',
        '  - methods:',
        '      description: this is <<method>> description',
        '      headers:',
        '        header1:',
        '          description: ',
        '          required: true',
        '          type: integer',
        '          displayName: HEADER 1',
        '          example: uno',
        '          default: DOS',
        '          maximum: 10',
        '          minimum: 4',
        '        header2:',
        '          description: this is the description header2 from <<method>>.',
        '          required: false',
        '          type: string',
        '          example: hola',
        '          default: chau',
        '          maxLength: 6',
        '          minLength: 2',
        '          pattern: "a*a"',
        '          enum: [hola, chau, adios]',
        '      queryParameters:',
        '        quePar1:',
        '          description: this is quePar 1 description <<method>>',
        '          required: true',
        '          type: boolean',
        '          displayName: QUEPAR 1',
        '          example: YES',
        '          default: NO',
        '        quePar2:',
        '          description: this is quePar2 from <<method>>',
        '          required: false',
        '          type: date',
        '          example: 20-10-2010',
        '          default: 05-10-2005',
        '      body:',
        '        multipart/form-data:',
        '          formParameters:  ',
        '            formdata1:',
        '              description: this is formdata1 description <<method>>',
        '              required: true',
        '              type: boolean',
        '              displayName: formdata11',
        '              example: YES',
        '              default: NO',
        '            formdata2:',
        '              description: this is formdata2 description <<method>>',
        '              required: true',
        '              type: string',
        '              displayName: formdata22',
        '              example: name',
        '              default: name',
        '  - responses:',
        '      usage: responses trait',
        '/resProduct/{hola}/{chau}:',
        '  is: [responses]',
        '  type: general',
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
      it(method+' select method by Name', function(){
        apiConsole.toggleBetweenMethodByName(method);
        designerAsserts.consoleValidateCurrentMethodName(method.toUpperCase());
      });

      describe('general information', function(){
        it('validate traits', function(){
          var expList = {
            'r0':['responses']
          };
          designerAsserts.consoleResourceTraits(expList);
        });

        it('validate resource types', function(){
          designerAsserts.consoleResourceResourceType(['general']);
        });

      });//general information

      describe(method+'request tab', function(){

        it(method+' method description is displayed properly - toggle between methods', function(){
          designerAsserts.consoleValidateMethodDescription('this is '+method+' description');
        });

        it(method+' validate traits at method level', function(){
          designerAsserts.consoleValidateMethodTraits(['methods']);
        });

        describe('named Parameters', function(){

          describe('headers', function(){

            it('validate active tab', function(){
              designerAsserts.consoleValidateActiveTab('Request');
            });

            it('validate Section header', function(){
              designerAsserts.consoleValidateHeadersH2('headers');
            });

            it(method+' headers with and without display name',function(){
              designerAsserts.consoleValidateHeadersDisplayNameList('headers',['HEADER 1','header2']);
            });

            it(method+' headers with and without description', function(){
              designerAsserts.consoleValidateHeadersDescription('headers',['','this is the description header2 from '+method+'.']);
            });

            it(method+' headers constrains - type, default, min, max etc', function(){
              designerAsserts.consoleValidateHeadersConstraints('headers',['required, integer between 4-10, default: DOS','one of (hola, chau, adios) matching a*a, 2-6 characters, default: chau']);
            });

          }); // headers

          describe('queryParameters', function(){

            it('validate active tab', function(){
              designerAsserts.consoleValidateActiveTab('Request');
            });

            it('validate Section header', function(){
              designerAsserts.consoleValidateHeadersH2('queryParameters');
            });

            it(method+' headers with and without display name',function(){
              designerAsserts.consoleValidateHeadersDisplayNameList('queryParameters',['QUEPAR 1','quePar2']);
            });

            it(method+' headers with and without description', function(){
              designerAsserts.consoleValidateHeadersDescription('queryParameters',['this is quePar 1 description '+method,'this is quePar2 from '+method]);
            });

            it(method+' headers constrains - type, default, min, max etc', function(){
              designerAsserts.consoleValidateHeadersConstraints('queryParameters',['required, boolean, default: NO','date, default: 05-10-2005']);
            });

          }); // queryParameters

          describe('uriParameters', function(){
            it('validate active tab', function(){
              designerAsserts.consoleValidateActiveTab('Request');
            });

            it('validate Section header', function(){
              designerAsserts.consoleValidateHeadersH2('uriParameters');
            });

            it(method+' headers with and without display name',function(){
              designerAsserts.consoleValidateHeadersDisplayNameList('uriParameters',['chau','Hola']);
            });

            it(method+' headers with and without description', function(){
              designerAsserts.consoleValidateHeadersDescription('uriParameters',['this is the description CHau','']);
            });

            it(method+' headers constrains - type, default, min, max etc', function(){
              designerAsserts.consoleValidateHeadersConstraints('uriParameters',['one of (hola, chau, adios) matching a*a, 2-6 characters, default: chau','required, integer between 4-10, default: DOS']);
            });

          });//uriParameters

        }); //namedParameters

        describe('body', function(){

          it('validate active tab', function(){
            designerAsserts.consoleValidateActiveTab('Request');
          });

          it('validate Section header', function(){
            designerAsserts.consoleValidateHeadersH2('Body');
          });

//            namedParameters

          it(method+' headers with and without display name',function(){
            designerAsserts.consoleValidateHeadersDisplayNameList('Body',['formdata11','formdata22']);
          });

          it(method+' headers with and without description', function(){
            designerAsserts.consoleValidateHeadersDescription('Body',['this is formdata1 description '+method,'this is formdata2 description '+method]);
          });

          it(method+' headers constrains - type, default, min, max etc', function(){
            designerAsserts.consoleValidateHeadersConstraints('Body',['required, boolean, default: NO','required, string, default: name']);
          });

        });

      }); //request tab


    });

  }); //toggle between method
}); //Embedded-console
