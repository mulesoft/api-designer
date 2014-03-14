'use strict';
var EditorHelper = require('../../../lib/editor-helper.js').EditorHelper;
var AssertsHelper = require('../../../lib/asserts-helper.js').AssertsHelper;
//var ShelfHelper = require('../../../lib/shelf-helper.js').ShelfHelper;
var ConsoleHelper = require('../../../lib/console-helper.js').ConsoleHelper;

describe('console Methods',function(){
  var editor = new EditorHelper();
  var designerAsserts= new AssertsHelper();
  var apiConsole = new ConsoleHelper();
//  var shelf = new ShelfHelper();
//  var methods = shelf.elemResourceLevelMethods;
//  var options = ['headers', 'queryParameters'];

  describe('response tab', function(){

    it('set the raml and open the method popup', function(){
      var definition = [
        '#%RAML 0.8',
        'title: to test response tab',
        '/responseTab: ',
        '  get:',
        '    responses:',
        '      200:',
        '        description: This is the description',
        '        body:',
        '          application/json:',
        '            schema: |',
        '              {',
        '                "title": "Example Schema",',
        '                "type": "object",',
        '                "properties": {',
        '                  "firstName": {',
        '                    "type": "string"',
        '                  },',
        '                  "lastName": {',
        '                    "type": "string"',
        '                  },',
        '                  "age": {',
        '                    "description": "Age in years",',
        '                    "type": "integer",',
        '                    "minimum": 0',
        '                  }',
        '                },',
        '                "required": ["firstName", "lastName"]',
        '              }              ',
        '            example: |',
        '              {',
        '                "firstName": "Ana",',
        '                "lastName": "Last Name",',
        '                "age": 8',
        '              }  ',
        '      300:',
        '        description: this is 300 description',
        '        headers:  ',
        '          name:',
        '            example: this is header example',
        '        body:',
        '          application/xml:',
        '            schema: |',
        '              <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">',
        '              <xs:element name="note">',
        '                <xs:complexType>',
        '                  <xs:sequence>',
        '                    <xs:element name="to" type="xs:string"/>',
        '                    <xs:element name="from" type="xs:string"/>',
        '                    <xs:element name="heading" type="xs:string"/>',
        '                     <xs:element name="body" type="xs:string"/>',
        '                  </xs:sequence>',
        '                </xs:complexType>',
        '              </xs:element>',
        '              </xs:schema>',
        '            example: |',
        '              <name>'
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.consoleApiTitle('to test response tab');
      apiConsole.expandCollpaseMethodsbyPos(1);
    });


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


  }); //response tab

}); // Embebed-console Methods
