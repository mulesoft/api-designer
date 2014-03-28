'use strict';
var EditorHelper = require('../../../lib/editor-helper.js').EditorHelper;
var AssertsHelper = require('../../../lib/asserts-helper.js').AssertsHelper;
var ShelfHelper = require('../../../lib/shelf-helper.js').ShelfHelper;
var ConsoleHelper = require('../../../lib/console-helper.js').ConsoleHelper;

describe('console Methods',function(){
  var editor = new EditorHelper();
  var designerAsserts= new AssertsHelper();
  var apiConsole = new ConsoleHelper();
  var shelf = new ShelfHelper();
  var methods = shelf.elemResourceLevelMethods;

  methods.forEach(function(method){
    describe(method+' response tab', function(){

      it('set the raml and open the method popup', function(){
        var definition = [
          '#%RAML 0.8',
          'title: to test response tab',
          '/responseTab'+method+': ',
          '  '+method+':',
          '    responses:',
          '      200:',
          '        description: This is the description '+method+'.',
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
          '        description: this is '+method+' 300 description',
          '        headers:  ',
          '          name:',
          '            example: this is '+method+' header example',
          '            description: this is '+method+' 300 description',
          '        body:',
          '          application/xml:',
          '            schema: |',
          '              <xs:element name="note">',
          '                <xs:complexType>',
          '                  <xs:sequence>',
          '                  </xs:sequence>',
          '                </xs:complexType>',
          '              </xs:element>',
          '            example: |',
          '              <name>',
          '                texto',
          '              </name>'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.consoleApiTitle('to test response tab');
        apiConsole.expandCollpaseMethodsbyPos(1);

      });


  //if schema is multipart/form-data: or  application/x-www-form-urlencoded: on the console is only to be displayed formParameters if those are defined  -

      it('subnav title should be response', function(){
        designerAsserts.checkResponseNavSubmenuTitle('RESPONSES');
      });

      it('list of response codes are displayed on the header section',function(){
        designerAsserts.checkSubNavResponseCodeList(['200','300']);
        // to do
        // each of it is a link that should scroll to that response code information on the console
      });

      it('response code header', function(){
        designerAsserts.checkResponseCodeHeaderList(['200','300']);
      });

      it('response code description', function(){
        designerAsserts.checkResponseCodeDescriptionList(['This is the description '+method+'.','this is '+method+' 300 description']);

      });

      it('response headers h3 is displayed', function(){
        designerAsserts.consoleValidateREsponseTabHeadersH2('headers');
      });

      it('response headers displayName', function(){
        designerAsserts.consoleValidateHeadersDisplayNameList('headers', ['name']);
  //      designerAsserts.consoleValidateResponseTab HeadersDisplayNameList('headers', ['name']);
      });

      it('validate header description', function(){
        designerAsserts.consoleValidateHeadersDescription('headers', ['this is '+method+' 300 description']);
      });

      it('headers constraint', function(){
        designerAsserts.consoleValidateHeadersConstraints('headers',['string']);
      });

      it('body header h2 is displayed', function(){
        designerAsserts.consoleValidateREsponseTabHeadersH2('Body');
      });

      xit('list of media types are displayed', function(){

      });

      xit('toggle between media types', function(){
  // not automated yet since is going to be modified
      });

      it('example section header', function(){
        designerAsserts.consoleValidateREsponseTabHeadersH2('EXAMPLE');
      });

      it('response code example displayed by default', function(){
        designerAsserts.consoleValidateExampleSchemaContent('example',['{    "firstName": "Ana",    "lastName": "Last Name",    "age": 8}','<name>  texto</name>']);
      });

      // if (method === 'connect'){
       // this if was added since is only needed to show the link the first time as part of the partial refresh functionality this remains expanded.
      it('response code schema show as a link by default', function(){
        apiConsole.expandSchemaByPos(0);
      });
      // }

      it('verify that schema links are hidden', function(){
        designerAsserts.consoleCheckSchemaLinksAreHiddenByPos(0);
      });

      it('after clicking on show schema ling schema header is displayed', function(){
        designerAsserts.consoleValidateREsponseTabHeadersH2('SCHEMA');
      });

      it('after clicking on schema link the schema should be displayed', function(){
        designerAsserts.consoleValidateExampleSchemaContent('schema',['{    "title": "Example Schema",    "type": "object",    "properties": {        "firstName": {            "type": "string"        },        "lastName": {            "type": "string"        },        "age": {            "description": "Age in years",            "type": "integer",            "minimum": 0        }    },    "required": [        "firstName",        "lastName"    ]}',
          '<xs:element name="note">  <xs:complexType>    <xs:sequence>    </xs:sequence>  </xs:complexType></xs:element> ']);
        apiConsole.closeMethodPopUp();
      });

    });

  }); //response tab

}); // Embebed-console Methods
