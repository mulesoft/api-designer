'use strict';
var EditorHelper = require('../../lib/editor-helper.js').EditorHelper;
var AssertsHelper = require('../../lib/asserts-helper.js').AssertsHelper;
var ShelfHelper = require('../../lib/shelf-helper.js').ShelfHelper;
var ConsoleHelper = require('../../lib/console-helper.js').ConsoleHelper;

describe('Embedded-console Methods',function(){
	var editor = new EditorHelper();
	var designerAsserts= new AssertsHelper();
	var apiConsole = new ConsoleHelper();
  var shelf = new ShelfHelper();
  var methods = shelf.elemResourceLevelMethods;
  var options = ['headers', 'queryParameters'];


  describe('common view', function(){

    it('console is displayed for a different raml if the method popup remind opened', function(){
      var definition = [
        '#%RAML 0.8',
        'title: raml with traits at method level',
        'traits:',
        '  - trait1:',
        '      description: this is trait1',
        '  - trait2: ',
        '      description: this is trait2 description',
        '/product:',
        '  get:',
        '    is: ',
        '      - trait1',
        '             '
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.consoleApiTitle('raml with traits at method level');
      apiConsole.expandCollpaseMethodsbyPos(1).then(function(){
        definition = [
          '#%RAML 0.8',
          'title: another api'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.consoleApiTitle('another api');
      });
    });

    methods.forEach(function(method){
      it('Method: '+method+' no tabs enabled', function(){
        var definition = [
          '#%RAML 0.8',
          'title: methods with empty tabs',
          '/meNoTan:',
          '  '+method+':',
          '      description:  '
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.consoleApiTitle('methods with empty tabs');
        apiConsole.expandCollpaseMethodsbyPos(1);
        designerAsserts.consoleMethodValidateAllTabDisable([method.toUpperCase(),'Request','Responses', 'Try It']);
        apiConsole.closeMethodPopUp();

      });
    });

		describe('traits', function(){

			it('trait information applied at method level is displayed on expanded method - single trait', function(){
				var definition = [
					'#%RAML 0.8',
					'title: raml with traits at method level',
					'traits:',
					'  - trait1:',
					'      description: this is trait1',
					'  - trait2: ',
					'      description: this is trait2 description',
					'/pos1:',
					'  get:',
					'    is: ',
					'      - trait1',
					'             '
				].join('\\n');
				editor.setValue(definition);
				designerAsserts.consoleApiTitle('raml with traits at method level');
				apiConsole.expandCollpaseMethodsbyPos(1);
				designerAsserts.consoleValidateCurrentMethodName('GET');
				designerAsserts.consoleValidateMethodTraits(['trait1']);
				apiConsole.closeMethodPopUp();
			});

			it('trait information applied at method level is displayed on expanded method 2 traits', function(){
				var definition = [
					'#%RAML 0.8',
					'title: raml with traits at method level',
					'traits:',
					'  - trait1:',
					'      description: this is trait1',
					'  - trait2: ',
					'      description: this is trait2 description',
					'/posi1:',
					'  post:',
					'    is: [trait1,trait2]'
				].join('\\n');
				editor.setValue(definition);
				designerAsserts.consoleApiTitle('raml with traits at method level');
				apiConsole.expandCollpaseMethodsbyPos(1);
				designerAsserts.consoleValidateCurrentMethodName('POST');
				designerAsserts.consoleValidateMethodTraits(['trait1','trait2']);
				apiConsole.closeMethodPopUp();
			});

		}); // traits

		it('when the method popup is opened - change the resource name', function(){
      var definition = [
        '#%RAML 0.8',
        'title: change resource Name',
        '/cont:',
        '  get:',
        '    description: this is get method description',
        '        '
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.consoleApiTitle('change resource Name');
      designerAsserts.consoleResourceName(['/cont']);
      apiConsole.expandCollpaseMethodsbyPos(1);
      designerAsserts.consoleValidateCurrentMethodName('GET');
//      designerAsserts.consoleValidateMethodDescription('this is get method description');
      editor.setLine(3,'/create: ');
      designerAsserts.consoleResourceName(['/create']);
    });

		it('open a method change to a different one and edit it', function(){
      var definition = [
        '#%RAML 0.8',
        'title: toggle and edit',
        '/contacts:',
        '  get:',
        '    description: this is get method description',
        '  post:',
        '        '
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.consoleApiTitle('toggle and edit');
      apiConsole.expandCollpaseMethodsbyPos(1);
      designerAsserts.consoleValidateCurrentMethodName('GET');
//      designerAsserts.consoleValidateMethodDescription('this is get method description');
      apiConsole.toggleBetweenMethodByName('post');
      editor.setLine(7,'    description: post method description');
      designerAsserts.consoleValidateCurrentMethodName('POST');
//      designerAsserts.consoleValidateMethodDescription('post method description');
		});

		it('open a method  and then delete it', function(){
      var definition = [
        '#%RAML 0.8',
        'title: delete current method',
        '/credentials:',
        '  get:',
        '    description: this is get method description',
        '        '
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.consoleApiTitle('delete current method');
      apiConsole.expandCollpaseMethodsbyPos(1);
      designerAsserts.consoleValidateCurrentMethodName('GET');
      editor.removeLine(4);
      editor.removeLine(4);
      apiConsole.getListMethods().then(function(methods){
        expect(methods.length).toEqual(0);
      });
		});

		it('open a method change to another and then delete it', function (){
      var definition = [
        '#%RAML 0.8',
        'title: delete current method',
        '/protocols:',
        '  get:',
        '    description: this is get method description',
        '  patch:',
        '    description: this is patch method',
        '        '
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.consoleApiTitle('delete current method');
      apiConsole.expandCollpaseMethodsbyPos(1);
      designerAsserts.consoleValidateCurrentMethodName('GET');
      apiConsole.toggleBetweenMethodByName('patch');
      editor.removeLine(6);
      editor.removeLine(6);
      var expList ={
        'r0':['GET']
      };
      designerAsserts.consoleResourceMethods(expList);
      apiConsole.expandCollpaseMethodsbyPos(1);
      designerAsserts.consoleValidateCurrentMethodName('GET');
		});

	});  // common view

	describe('request tab', function(){

    describe('description', function(){
      methods.forEach(function(method){

        it(method+' description added at method level but not other request infromation', function(){
          var definition = [
            '#%RAML 0.8',
            'title: only description on the method',
            '/resour2:',
            '  '+method+':',
            '    description: this is '+method+' description at method level'
          ].join('\\n');
          editor.setValue(definition);
          apiConsole.expandCollpaseMethodsbyPos(1);
          designerAsserts.consoleValidateCurrentMethodName(method.toUpperCase());
          designerAsserts.consoleValidateMethodDescription('this is '+method+' description at method level');
          apiConsole.closeMethodPopUp();
        });
      });
    });

    options.forEach(function(option){
      describe(option+' namedParameter', function(){
        methods.forEach(function(method){
          it(method+' add the raml', function(){
            var definition = [
              '#%RAML 0.8',
              'title: methods with description',
              '/res:',
              '  '+method+': ',
              '    description: this is '+method+' description',
              '    '+option+':',
              '      header1:',
           //'        description: this is header 1 description',
              '        required: true',
              '        type: integer',
              '        displayName: HEADER 1',
              '        example: uno',
              '        default: DOS',
              '        maximum: 10',
              '        minimum: 4',
              '      header2:',
              '        description: this is the description header1',
              '        required: false',
              '        type: string',
              '        example: hola',
              '        default: chau',
              '        maxLength: 6',
              '        minLength: 2',
              '        pattern: "a*a"',
              '        enum: [hola, chau, adios]'
            ].join('\\n');
            editor.setValue(definition);
            apiConsole.expandCollpaseMethodsbyPos(1);
          });

          it('Validate current method name', function(){
            designerAsserts.consoleValidateCurrentMethodName(method.toUpperCase());
          });

          it('validate active tab', function(){
            designerAsserts.consoleValidateActiveTab('Request');
          });

          it('validate method description', function(){
            designerAsserts.consoleValidateMethodDescription('this is '+method+' description');
          });

          it('validate Section header', function(){
            designerAsserts.consoleValidateHeadersH2(option);
          });

          it(method+' '+option+'headers with and without display name',function(){
            designerAsserts.consoleValidateHeadersDisplayNameList(option,['HEADER 1','header2']);
          });
          it(method+' headers with and without description', function(){
            designerAsserts.consoleValidateHeadersDescription(option,['','this is the description header1']);
          });

          it(method+' headers constrains - type, default, min, max etc', function(){
            designerAsserts.consoleValidateHeadersConstraints(option,['required, integer between 4-10, default: DOS','one of (hola, chau, adios) matching a*a, 2-6 characters, default: chau']);
            apiConsole.closeMethodPopUp();

          });
        });

      }); // headers
    });

    xdescribe('uriParamters', function(){
      methods.forEach(function(method){
        var option = 'uriParameters';
        it(method+' add the raml', function(){
          var definition = [
            '#%RAML 0.8',
            'title: methods with description',
            '/res/{header1}/{header2}:',
            '  uriParameters:',
            '      header1:',
            '        required: true',
            '        type: integer',
            '        displayName: HEADER 1',
            '        example: uno',
            '        default: DOS',
            '        maximum: 10',
            '        minimum: 4',
            '      header2:',
            '        description: this is the description header1',
            '        required: false',
            '        type: string',
            '        example: hola',
            '        default: chau',
            '        maxLength: 6',
            '        minLength: 2',
            '        pattern: "a*a"',
            '        enum: [hola, chau, adios]',
            '  '+method+': ',
            '    description: this is '+method+' description',
            '  '
          ].join('\\n');
          editor.setValue(definition);
          apiConsole.expandCollpaseMethodsbyPos(1);
        });

        it('Validate current method name', function(){
          designerAsserts.consoleValidateCurrentMethodName(method.toUpperCase());
        });

        it('validate active tab', function(){
          designerAsserts.consoleValidateActiveTab('Request');
        });

        it('validate method description', function(){
          designerAsserts.consoleValidateMethodDescription('this is '+method+' description');
        });

        it('validate Section header', function(){
          designerAsserts.consoleValidateHeadersH2(option);
        });

        it(method+' '+option+'headers with and without display name',function(){
          designerAsserts.consoleValidateHeadersDisplayNameList(option,['HEADER 1','header2']);
        });
        it(method+' headers with and without description', function(){
          designerAsserts.consoleValidateHeadersDescription(option,['','this is the description header1']);
        });

        it(method+' headers constrains - type, default, min, max etc', function(){
          designerAsserts.consoleValidateHeadersConstraints(option,['required, integer between 4-10, default: DOS','one of (hola, chau, adios) matching a*a, 2-6 characters, default: chau']);
          apiConsole.closeMethodPopUp();

        });
      });

    }); // UriParameters

    xdescribe('body', function(){
      var options = ['multipart/form-data', 'application/x-www-form-urlencoded'];
      options.forEach(function(option){
        describe(option+' for body with formParameters', function(){
          methods.forEach(function(method){
            it(method+' add the raml', function(){
              var definition = [
                '#%RAML 0.8',
                'title: methods with description',
                '/res:',
                '  '+method+': ',
                '    description: this is '+method+' description',
                '    body:',
                '      '+option+':',
                '        header1:',
                '          required: true',
                '          type: integer',
                '          displayName: HEADER 1',
                '          example: uno',
                '          default: DOS',
                '          maximum: 10',
                '          minimum: 4',
                '        header2:',
                '          description: this is the description header1',
                '          required: false',
                '          type: string',
                '          example: hola',
                '          default: chau',
                '          maxLength: 6',
                '          minLength: 2',
                '          pattern: "a*a"',
                '          enum: [hola, chau, adios]'
              ].join('\\n');
              editor.setValue(definition);
              apiConsole.expandCollpaseMethodsbyPos(1);
            });

            it('Validate current method name', function(){
              designerAsserts.consoleValidateCurrentMethodName(method.toUpperCase());
            });

            it('validate active tab', function(){
              designerAsserts.consoleValidateActiveTab('Request');
            });

            it('validate method description', function(){
              designerAsserts.consoleValidateMethodDescription('this is '+method+' description');
            });

            it('validate Section header', function(){
              designerAsserts.consoleValidateHeadersH2('Body');
            });

            it('validate media tyoes', function(){
              designerAsserts.consoleValidateBodyMediaTypes([option]);
            });

            it(method+' '+option+'headers with and without display name',function(){
              designerAsserts.consoleValidateHeadersDisplayNameList('Body',['HEADER 1','header2']);
            });
            it(method+' headers with and without description', function(){
              designerAsserts.consoleValidateHeadersDescription('Body',['','this is the description header1']);
            });

            it(method+' headers constrains - type, default, min, max etc', function(){
              designerAsserts.consoleValidateHeadersConstraints('Body',['required, integer between 4-10, default: DOS','one of (hola, chau, adios) matching a*a, 2-6 characters, default: chau']);
              apiConsole.closeMethodPopUp();
            });
          });
        });


      }); //body with formParameters


      var options = ['application/json', 'application/xml'];
      options.forEach(function(option){
        describe('body: '+option+' with schema and example', function(){

          methods.forEach(function(method){
            it(method+' add the raml', function(){
              var definition = [
                '#%RAML 0.8',
                'title: methods with description',
                '/res:',
                '  '+method+': ',
                '    description: this is '+method+' description',
                '    body:',
                '      '+option+':',
                '        example: |      ',
                '            ',
                '        schema: | ',
                ''
              ].join('\\n');
              editor.setValue(definition);
              apiConsole.expandCollpaseMethodsbyPos(1);
            });

            it('Validate current method name', function(){
              designerAsserts.consoleValidateCurrentMethodName(method.toUpperCase());
            });

            it('validate active tab', function(){
              designerAsserts.consoleValidateActiveTab('Request');
            });

            it('validate method description', function(){
              designerAsserts.consoleValidateMethodDescription('this is '+method+' description');
            });

            it('validate Section header', function(){
              designerAsserts.consoleValidateHeadersH2('Body');
            });

            it('validate media tyoes', function(){
              designerAsserts.consoleValidateBodyMediaTypes([option]);
            });

            it('validate example', function(){
              //to do
            });

            it('validate schema link', function(){
              //to do
            });

            it('validate schema content', function(){
              //to do
            });
          });
        });

      }); //body with schema and example

    }); // body

	}); //request tab


	xdescribe('response tab', function(){
    it('description should not be displayed', function(){
//      on response tab description should not be displayed
    });

    describe('responses', function(){

//if schema is multipart/form-data: or  application/x-www-form-urlencoded: on the console is only to be displayed formParameters if those are defined  -

    }); // responses

	}); //response tab


	xdescribe('try it tab', function(){

		// WHAT ABOUT REMEMBER TRYIT DATA?

    // validate required  information
    //headers
    //uriParameters
    //baseUriParameters
    //queryParameters
    //formParameters

    it('description should not be displayed', function(){
//      on try it tab description should not be displayed
    });

		describe('base Uri', function(){

		}); // base Uri

		describe('authentication', function(){

		});

		describe('headers', function(){

		}); // headers


		describe('queryParameters', function(){

		}); // queryParameters

	}); // try it tab








}); // Embebed-console Methods 
