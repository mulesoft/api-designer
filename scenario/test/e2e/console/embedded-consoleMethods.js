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

		describe('description', function(){
      methods.forEach(function(method){
        it(method+' description is displayed on the method popup', function(){
          var definition = [
            '#%RAML 0.8',
            'title: methods with description',
            '/res:',
            '  '+method+': ',
            '    description: this is '+method+' description'
          ].join('\\n');
          editor.setValue(definition);
          apiConsole.expandCollpaseMethodsbyPos(1);
          designerAsserts.consoleValidateCurrentMethodName(method.toUpperCase());
          designerAsserts.consoleValidateMethodDescription('this is '+method+' description');
          apiConsole.closeMethodPopUp();
        });
      });
		}); // description


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
      designerAsserts.consoleValidateMethodDescription('this is get method description');
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
      designerAsserts.consoleValidateMethodDescription('this is get method description');
      apiConsole.toggleBetweenMethodByPos('post');
      editor.setLine(7,'    description: post method description');
      designerAsserts.consoleValidateCurrentMethodName('POST');
      designerAsserts.consoleValidateMethodDescription('post method description');
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
      apiConsole.toggleBetweenMethodByPos('patch');
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

	xdescribe('request tab', function(){

		describe('headers', function(){

		}); // headers


		describe('queryParameters', function(){

		}); // queryParameters

	}); //request tab


	xdescribe('respnse tab', function(){

		describe('responses', function(){

		}); // responses

	}); //response tab


	xdescribe('try it tab', function(){

		// WHAT ABOUT REMEMBER TRYIT DATA?

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
