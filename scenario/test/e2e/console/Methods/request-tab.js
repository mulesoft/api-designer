'use strict';
var EditorHelper = require('../../../lib/editor-helper.js').EditorHelper;
var AssertsHelper = require('../../../lib/asserts-helper.js').AssertsHelper;
var ShelfHelper = require('../../../lib/shelf-helper.js').ShelfHelper;
var ConsoleHelper = require('../../../lib/console-helper.js').ConsoleHelper;

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
        apiConsole.expandCollpaseMethodsbyPos(1).then(function(){
          designerAsserts.consoleMethodValidateAllTabDisable(['Request','Responses', 'Try It']);
          apiConsole.closeMethodPopUp();
        })
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
				apiConsole.expandCollpaseMethodsbyPos(1).then(function(){
          designerAsserts.consoleValidateCurrentMethodName('GET');
          designerAsserts.consoleValidateMethodTraits(['trait1']);
          apiConsole.closeMethodPopUp();
        });
			});

      describe('resource level trait and resource Types  after a partial refresh', function(){
        var expList = {
          'r0':['responses']
        };

        it('set the raml and check trait is displayed the first time', function(){
          var definition = [
            '#%RAML 0.8',
            'title: after partial refresh',
            'resourceTypes:',
            '  - general:',
            '      description: this is trait description',
            'traits:',
            '  - responses:',
            '      description: this is response trait description',
            '/aftPartRefresh:',
            '  type: general',
            '  is: [responses]',
            '  post:',
            '            '
          ].join('\\n');
          editor.setValue(definition);
          designerAsserts.consoleApiTitle('after partial refresh');
          apiConsole.expandCollpaseMethodsbyPos(1).then(function(){
            designerAsserts.consoleValidateCurrentMethodName('POST');
            designerAsserts.consoleResourceTraits(expList);
            designerAsserts.consoleResourceResourceType(['general']);
          });
        });

        xit('trait is displayed after the partial refresh', function(){
//       uncomment when this is fixed ->  https://www.pivotaltracker.com/story/show/67511204
          editor.setLine(13,'    description: this is another description\\n');
          designerAsserts.consoleResourceTraits(expList);
        });

        it('resourceType is displayed after a partial refresh', function(){
          designerAsserts.consoleResourceResourceType(['general']);
          apiConsole.closeMethodPopUp();
        });

      }); //resource level trait and resource Types  after a partial refresh

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
				apiConsole.expandCollpaseMethodsbyPos(1).then(function(){
          designerAsserts.consoleValidateCurrentMethodName('POST');
          designerAsserts.consoleValidateMethodTraits(['trait1','trait2']);
          apiConsole.closeMethodPopUp();
        });
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
      apiConsole.expandCollpaseMethodsbyPos(1).then(function(){
        designerAsserts.consoleValidateCurrentMethodName('GET');
        designerAsserts.consoleValidateMethodDescription('this is get method description');
      });
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
      apiConsole.expandCollpaseMethodsbyPos(1).then(function(){
        designerAsserts.consoleValidateCurrentMethodName('GET');
        apiConsole.toggleBetweenMethodByName('post');
        editor.setLine(7,'    description: post method description');
        designerAsserts.consoleValidateCurrentMethodName('POST');
        apiConsole.closeMethodPopUp();
      });
		});

		it('open a method and then delete it', function(){
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
      apiConsole.expandCollpaseMethodsbyPos(1).then(function(){
        designerAsserts.consoleValidateCurrentMethodName('GET');
        apiConsole.toggleBetweenMethodByName('patch');
        editor.removeLine(6);
        editor.removeLine(6);
        var expList ={
          'r0':['GET']
        };
        designerAsserts.consoleResourceMethods(expList);
        designerAsserts.consoleValidateCurrentMethodName('GET');
        apiConsole.closeMethodPopUp();
      });
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
          apiConsole.expandCollpaseMethodsbyPos(1).then(function(){
            designerAsserts.consoleValidateCurrentMethodName(method.toUpperCase());
            apiConsole.closeMethodPopUp();
          });
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
            apiConsole.expandCollpaseMethodsbyPos(1).then(function(){
              designerAsserts.consoleValidateCurrentMethodName(method.toUpperCase());
              designerAsserts.consoleValidateActiveTab('Request');
              designerAsserts.consoleValidateMethodDescription('this is '+method+' description');
              designerAsserts.consoleValidateHeadersH2(option);
              designerAsserts.consoleValidateHeadersDisplayNameList(option,['HEADER 1','header2']);
              designerAsserts.consoleValidateHeadersDescription(option,['','this is the description header1']);
              designerAsserts.consoleValidateHeadersConstraints(option,['required, integer between 4-10, default: DOS','one of (hola, chau, adios) matching a*a, 2-6 characters, default: chau']);
              apiConsole.closeMethodPopUp();
            });
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
      options = ['multipart/form-data', 'application/x-www-form-urlencoded'];
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
              apiConsole.expandCollpaseMethodsbyPos(1).then(function(){
                designerAsserts.consoleValidateCurrentMethodName(method.toUpperCase());
                designerAsserts.consoleValidateActiveTab('Request');
                designerAsserts.consoleValidateMethodDescription('this is '+method+' description');
                designerAsserts.consoleValidateHeadersH2('Body');
                designerAsserts.consoleValidateBodyMediaTypes([option]);
                designerAsserts.consoleValidateHeadersDisplayNameList('Body',['HEADER 1','header2']);
                designerAsserts.consoleValidateHeadersDescription('Body',['','this is the description header1']);
                designerAsserts.consoleValidateHeadersConstraints('Body',['required, integer between 4-10, default: DOS','one of (hola, chau, adios) matching a*a, 2-6 characters, default: chau']);
                apiConsole.closeMethodPopUp();
              });
            });
          });
        });


      }); //body with formParameters


      options = ['application/json', 'application/xml'];
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
    xit('description should not be displayed', function(){
//      on response tab description should not be displayed
    });

    describe('responses', function(){

//if schema is multipart/form-data: or  application/x-www-form-urlencoded: on the console is only to be displayed formParameters if those are defined  -
      xit('list of response codes are displayed on the header section',function(){
        // to do
        // each of it is a link that should scroll to that response code information on the console
      });

      xit('response code header', function(){

      });

      xit('response code description', function(){

      });

      xit('body header is displayed', function(){

      });

      xit('list of media types are displayed', function(){

      });

      xit('toggle between media types', function(){

      });

      xit('response code example  displayed by default', function(){

      });

      xit('response code schema show as a link by default', function(){

      });

      xit('after clicnking on schema link the schema should be displayed', function(){

      });

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
