'use strict';
var EditorHelper = require('../../lib/editor-helper.js').EditorHelper;
var AssertsHelper = require('../../lib/asserts-helper.js').AssertsHelper;
//var ShelfHelper = require('../../lib/shelf-helper.js').ShelfHelper;
var ConsoleHelper = require('../../lib/console-helper.js').ConsoleHelper;

describe('Embedded-console Methods',function(){
	var editor = new EditorHelper();
	var designerAsserts= new AssertsHelper();
	// var shelf = new ShelfHelper();
	var apiConsole = new ConsoleHelper();

	describe('common view', function(){

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

		}); // description


		xit('when the method popup is opened - change the resource name', function(){
				// currently the console is not displayed anymore. 

		});

		xit('open a method change to a different one and edit it', function(){

			// console  should displayed method and displayed the updates
				// currently when the method is edited the console turn and displayed the first opened method. 
		});

		xit('open a method  and then delete it', function(){
			// currently  afther the method is deleted the console displayed the list of resource 
			// same behaviour with one or more methods

		});

		xit('open a method change to another and then delete it', function (){
		// currently  afther the 2nd opened method is deleted, the console displayed the 1st opened method.
		//  I think this should have the same behavior as the other  -  
		});

	});  // common view

	describe('request tab', function(){

		describe('headers', function(){

		}); // headers


		describe('queryParameters', function(){

		}); // queryParameters

	}); //request tab


	describe('respnse tab', function(){

		describe('responses', function(){

		}); // responses

	}); //response tab


	describe('try it tab', function(){

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
