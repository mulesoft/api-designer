'use strict';
var AssertsHelper = require('../../lib/asserts-helper.js').AssertsHelper;
var EditorHelper = require('../../lib/editor-helper.js').EditorHelper;
var ShelfHelper = require('../../lib/shelf-helper.js').ShelfHelper;
//var ConsoleHelper = require('../../lib/console-helper.js').ConsoleHelper;
var definition = require('../../example-files/muse-raml.js').definition;
describe('Muse: Mule Sales Enablement API', function () {
  var designerAsserts= new AssertsHelper();
  var editor= new EditorHelper();
  var shelf= new ShelfHelper();
//  var consoleApi = new ConsoleHelper();

  describe('e2e validation', function(){

    it('clear editor', function(){
      editor.setValue('');
      expect(editor.getLine(1)).toEqual('');
      designerAsserts.shelfElements(shelf.elemRamlVersion);
      designerAsserts.parserError('1', 'The first line must be: \'#%RAML 0.8\'');
    });

    var i = 1;
    definition.forEach(function(line){
      var t = i++;
      it('Line '+t+'- content: '+line, function(){
        shelf = new ShelfHelper();
        var list2;
        editor.setLine(t, line.replace(/"/g, '\\"'));
        switch(t)
        {
        case 1:
          expect(editor.getLine(t)).toEqual('#%RAML 0.8');
          editor.setCursor(2,0);
          // need to open a pivotal to track the error that in (2,1) options inside a methods are displayed
          designerAsserts.shelfElements(shelf.elemRootLevel);
          break;
        case 2:
          expect(editor.getLine(t)).toEqual('title: "Muse: Mule Sales Enablement API"');
          designerAsserts.consoleApiTitle('Muse: Mule Sales Enablement API');
          editor.setCursor(3,0);
          list2 = ['title'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRootLevel);
          break;
        case 3:
          expect(editor.getLine(t)).toEqual('version: v1');
          editor.setCursor(4,0);
          list2 =['title','version'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRootLevel);
          break;
        case 4:
          expect(editor.getLine(t)).toEqual('baseUri: http://examples.ramlicio.us/muse');
          editor.setCursor(5,0);
          list2 = ['title', 'baseUri','version'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRootLevel);
          break;
        case 5:
          expect(editor.getLine(t)).toEqual('schemas:');
          editor.setCursor(6,0);
          list2 =['title', 'baseUri','version', 'schemas'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRootLevel);
          designerAsserts.parserError('5', 'schemas property must be an array');
          break;
        case 6:
          expect(editor.getLine(t)).toEqual('  - presentation: |');
          break;
        case 7:
          expect(editor.getLine(t)).toEqual('      {  "$schema": "http://json-schema.org/draft-03/schema",');
          break;
        case 8:
          expect(editor.getLine(t)).toEqual('         "type": "object",');
          break;
        case 9:
          expect(editor.getLine(t)).toEqual('         "description": "A product presentation",');
          break;
        case 10:
          expect(editor.getLine(t)).toEqual('         "properties": {');
          break;
        case 11:
          expect(editor.getLine(t)).toEqual('           "id":  { "type": "string" },');
          break;
        case 12:
          expect(editor.getLine(t)).toEqual('           "title":  { "type": "string" },');
          break;
        case 13:
          expect(editor.getLine(t)).toEqual('           "description":  { "type": "string" },');
          break;
        case 14:
          expect(editor.getLine(t)).toEqual('           "fileUrl":  { "type": "string" },');
          break;
        case 15:
          expect(editor.getLine(t)).toEqual('           "productId":  { "type": "string" }');
          break;
        case 16:
          expect(editor.getLine(t)).toEqual('         },');
          break;
        case 17:
          expect(editor.getLine(t)).toEqual('         "required": [ "id", "title", "fileUrl", "productId" ]');
          break;
        case 18:
          expect(editor.getLine(t)).toEqual('      }');
          break;
        case 19:
          expect(editor.getLine(t)).toEqual('  - presentations: |');
          break;
        case 20:
          expect(editor.getLine(t)).toEqual('      {  "$schema": "http://json-schema.org/draft-03/schema",');
          break;
        case 21:
          expect(editor.getLine(t)).toEqual('         "type": "array",');
          break;
        case 22:
          expect(editor.getLine(t)).toEqual('         "description": "Multiple product presentations",');
          break;
        case 23:
          expect(editor.getLine(t)).toEqual('         "items": {');
          break;
        case 24:
          expect(editor.getLine(t)).toEqual('           "type": "object",');
          break;
        case 25:
          expect(editor.getLine(t)).toEqual('           "properties": {');
          break;
        case 26:
          expect(editor.getLine(t)).toEqual('             "id":  { "type": "string" },');
          break;
        case 27:
          expect(editor.getLine(t)).toEqual('             "title":  { "type": "string" },');
          break;
        case 28:
          expect(editor.getLine(t)).toEqual('             "description":  { "type": "string" },');
          break;
        case 29:
          expect(editor.getLine(t)).toEqual('             "fileUrl":  { "type": "string" },');
          break;
        case 30:
          expect(editor.getLine(t)).toEqual('             "productId":  { "type": "string" }');
          break;
        case 31:
          expect(editor.getLine(t)).toEqual('           },');
          break;
        case 32:
          expect(editor.getLine(t)).toEqual('           "required": [ "id", "title", "fileUrl", "productId" ]');
          break;
        case 33:
          expect(editor.getLine(t)).toEqual('         }');
          break;
        case 34:
          expect(editor.getLine(t)).toEqual('      }');
          break;
        case 35:
          expect(editor.getLine(t)).toEqual('  - product: |');
          break;
        case 36:
          expect(editor.getLine(t)).toEqual('      {  "$schema": "http://json-schema.org/draft-03/schema",');
          break;
        case 37:
          expect(editor.getLine(t)).toEqual('         "type": "object",');
          break;
        case 38:
          expect(editor.getLine(t)).toEqual('         "description": "A product",');
          break;
        case 39:
          expect(editor.getLine(t)).toEqual('         "properties": {');
          break;
        case 40:
          expect(editor.getLine(t)).toEqual('           "id":  { "type": "string" },');
          break;
        case 41:
          expect(editor.getLine(t)).toEqual('           "name":  { "type": "string" },');
          break;
        case 42:
          expect(editor.getLine(t)).toEqual('           "description":  { "type": "string" },');
          break;
        case 43:
          expect(editor.getLine(t)).toEqual('           "imageUrl":  { "type": "string" },');
          break;
        case 44:
          expect(editor.getLine(t)).toEqual('           "region": { "type": "string" }');
          break;
        case 45:
          expect(editor.getLine(t)).toEqual('         },');
          break;
        case 46:
          expect(editor.getLine(t)).toEqual('         "required": [ "id", "name", "region" ]');
          break;
        case 47:
          expect(editor.getLine(t)).toEqual('      }');
          break;
        case 48:
          expect(editor.getLine(t)).toEqual('  - products: |');
          break;
        case 49:
          expect(editor.getLine(t)).toEqual('      {  "$schema": "http://json-schema.org/draft-03/schema",');
          break;
        case 50:
          expect(editor.getLine(t)).toEqual('         "type": "array",');
          break;
        case 51:
          expect(editor.getLine(t)).toEqual('         "description": "Multiple products",');
          break;
        case 52:
          expect(editor.getLine(t)).toEqual('         "items": {');
          break;
        case 53:
          expect(editor.getLine(t)).toEqual('           "type": "object",');
          break;
        case 54:
          expect(editor.getLine(t)).toEqual('           "properties": {');
          break;
        case 55:
          expect(editor.getLine(t)).toEqual('             "id":  { "type": "string" },');
          break;
        case 56:
          expect(editor.getLine(t)).toEqual('             "name":  { "type": "string" },');
          break;
        case 57:
          expect(editor.getLine(t)).toEqual('             "description":  { "type": "string" },');
          break;
        case 58:
          expect(editor.getLine(t)).toEqual('             "imageUrl":  { "type": "string" },');
          break;
        case 59:
          expect(editor.getLine(t)).toEqual('             "region":  { "type": "string" }');
          break;
        case 60:
          expect(editor.getLine(t)).toEqual('           },');
          break;
        case 61:
          expect(editor.getLine(t)).toEqual('           "required": [ "id", "name", "region" ]');
          break;
        case 62:
          expect(editor.getLine(t)).toEqual('         }');
          break;
        case 63:
          expect(editor.getLine(t)).toEqual('      }');
          break;
        case 64:
          expect(editor.getLine(t)).toEqual('resourceTypes:');
          editor.setCursor(65,0);
          list2 =['title', 'baseUri','version', 'schemas','resourceTypes'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRootLevel);
          designerAsserts.parserError('64', 'invalid resourceTypes definition, it must be an array');
          break;
        case 65:
          expect(editor.getLine(t)).toEqual('  - base:');
          editor.setCursor(66,6);
          designerAsserts.shelfElements(shelf.elemResourceTypeLevel);
          designerAsserts.parserError('65', 'invalid resourceType definition, it must be a map');
          break;
        case 66:
          expect(editor.getLine(t)).toEqual('      get?:');
          editor.setCursor(67,6);
          list2 =['get'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResourceTypeLevel);
          editor.setCursor(67,8);
          designerAsserts.shelfElements(shelf.elemRtMethodLevel);
          break;
        case 67:
          expect(editor.getLine(t)).toEqual('        responses: &standardResponses');
          editor.setCursor(68,8);
          list2 =['responses'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRtMethodLevel);
          break;
        case 68:
          expect(editor.getLine(t)).toEqual('          200:');
          editor.setCursor(69,12);
          designerAsserts.shelfElements(shelf.elemResponsesLevel);
          break;
        case 69:
          expect(editor.getLine(t)).toEqual('            description: OK');
          break;
        case 70:
          expect(editor.getLine(t)).toEqual('      put?:');
          editor.setCursor(71,6);
          list2 =['get','put'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResourceTypeLevel);
          editor.setCursor(71,8);
          designerAsserts.shelfElements(shelf.elemRtMethodLevel);
          break;
        case 71:
          expect(editor.getLine(t)).toEqual('        responses: *standardResponses');
          break;
        case 72:
          expect(editor.getLine(t)).toEqual('      patch?:');
          editor.setCursor(73,6);
          list2 =['get','put', 'patch'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResourceTypeLevel);
          editor.setCursor(73,8);
          designerAsserts.shelfElements(shelf.elemRtMethodLevel);
          break;
        case 73:
          expect(editor.getLine(t)).toEqual('        responses: *standardResponses');
          break;
        case 74:
          expect(editor.getLine(t)).toEqual('      post?:');
          editor.setCursor(75,6);
          list2 =['get','put', 'patch','post'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResourceTypeLevel);
          editor.setCursor(75,8);
          designerAsserts.shelfElements(shelf.elemRtMethodLevel);
          break;
        case 75:
          expect(editor.getLine(t)).toEqual('        responses:');
          editor.setCursor(76,8);
          list2 =['responses'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRtMethodLevel);
          break;
        case 76:
          expect(editor.getLine(t)).toEqual('          201:');
          editor.setCursor(77,12);
          designerAsserts.shelfElements(shelf.elemResponsesLevel);
          break;
        case 77:
          expect(editor.getLine(t)).toEqual('            description: Created');
          break;
        case 78:
          expect(editor.getLine(t)).toEqual('      delete?:');
          editor.setCursor(79,6);
          list2 =['get','put', 'patch','post','delete'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResourceTypeLevel);
          editor.setCursor(79,8);
          designerAsserts.shelfElements(shelf.elemRtMethodLevel);
          break;
        case 79:
          expect(editor.getLine(t)).toEqual('        responses: *standardResponses');
          break;
        case 80:
          expect(editor.getLine(t)).toEqual('  - collection:');
          designerAsserts.parserError('80', 'invalid resourceType definition, it must be a map');
          editor.setCursor(81,6);
          designerAsserts.shelfElements(shelf.elemResourceTypeLevel);
          break;
        case 81:
          expect(editor.getLine(t)).toEqual('      type: base');
          editor.setCursor(82,6);
          list2 =['type'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResourceTypeLevel);
          break;
        case 82:
          expect(editor.getLine(t)).toEqual('      get:');
          editor.setCursor(83,6);
          list2 =['get','type'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResourceTypeLevel);
          editor.setCursor(83,8);
          designerAsserts.shelfElements(shelf.elemRtMethodLevel);
          break;
        case 83:
          expect(editor.getLine(t)).toEqual('        is: [ paged ]');
          designerAsserts.parserError('83', 'there is no trait named paged');
          editor.setCursor(84,8);
          list2 =['is'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRtMethodLevel);
          break;
        case 84:
          expect(editor.getLine(t)).toEqual('        responses:');
          editor.setCursor(85,8);
          list2 =['is','responses'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRtMethodLevel);
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 85:
          expect(editor.getLine(t)).toEqual('          200:');
          editor.setCursor(86,12);
          designerAsserts.shelfElements(shelf.elemResponsesLevel);
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 86:
          expect(editor.getLine(t)).toEqual('            body:');
          editor.setCursor(87,12);
          list2 =['body'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResponsesLevel);
          editor.setCursor(87,14);
          designerAsserts.shelfElements(shelf.elemBodyLevel);
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 87:
          expect(editor.getLine(t)).toEqual('              application/json:');
          editor.setCursor(88,14);
          list2 =['application/json'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemBodyLevel);
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 88:
          expect(editor.getLine(t)).toEqual('                schema: <<schema | !pluralize>>');
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 89:
          expect(editor.getLine(t)).toEqual('      post:');
          editor.setCursor(90,6);
          list2 =['get','type','post'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResourceTypeLevel);
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 90:
          expect(editor.getLine(t)).toEqual('        body:');
          editor.setCursor(91,8);
          list2 =['body'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRtMethodLevel);
          editor.setCursor(91,10);
          designerAsserts.shelfElements(shelf.elemBodyLevel);
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 91:
          expect(editor.getLine(t)).toEqual('          application/json:');
          editor.setCursor(92,10);
          list2 =['application/json'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemBodyLevel);
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 92:
          expect(editor.getLine(t)).toEqual('            schema: <<schema>>');
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 93:
          expect(editor.getLine(t)).toEqual('        responses:');
          editor.setCursor(94,8);
          list2 =['body','responses'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRtMethodLevel);
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 94:
          expect(editor.getLine(t)).toEqual('          201:');
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 95:
          expect(editor.getLine(t)).toEqual('            body:');
          editor.setCursor(96,12);
          list2 =['body'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResponsesLevel);
          editor.setCursor(96,14);
          designerAsserts.shelfElements(shelf.elemBodyLevel);
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 96:
          expect(editor.getLine(t)).toEqual('              application/json:');
          editor.setCursor(97,14);
          list2 =['application/json'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemBodyLevel);
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 97:
          expect(editor.getLine(t)).toEqual('                schema: <<schema>>');
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 98:
          expect(editor.getLine(t)).toEqual('  - member:');
          designerAsserts.parserError('83', 'there is no trait named paged');
          editor.setCursor(99,6);
          designerAsserts.shelfElements(shelf.elemResourceTypeLevel);
          break;
        case 99:
          expect(editor.getLine(t)).toEqual('      type: base');
          designerAsserts.parserError('83', 'there is no trait named paged');
          editor.setCursor(100,6);
          list2 =['type'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResourceTypeLevel);
          break;
        case 100:
          expect(editor.getLine(t)).toEqual('      get:');
          editor.setCursor(101,6);
          list2 =['type','get'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResourceTypeLevel);
          editor.setCursor(101,8);
          designerAsserts.shelfElements(shelf.elemRtMethodLevel);
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 101:
          expect(editor.getLine(t)).toEqual('        responses:');
          editor.setCursor(102,8);
          list2 =['responses'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRtMethodLevel);
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 102:
          expect(editor.getLine(t)).toEqual('          200:');
          editor.setCursor(103,12);
          designerAsserts.shelfElements(shelf.elemResponsesLevel);
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 103:
          expect(editor.getLine(t)).toEqual('            body:');
          editor.setCursor(104,12);
          list2 =['body'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResponsesLevel);
          editor.setCursor(104,14);
          designerAsserts.shelfElements(shelf.elemBodyLevel);
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 104:
          expect(editor.getLine(t)).toEqual('              application/json:');
          editor.setCursor(104,14);
          list2 =['application/json'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemBodyLevel);
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 105:
          expect(editor.getLine(t)).toEqual('                schema: <<schema>>');
          break;
        case 106:
          expect(editor.getLine(t)).toEqual('      put:');
          editor.setCursor(107,6);
          list2 =['type','get','put'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResourceTypeLevel);
          editor.setCursor(107,8);
          designerAsserts.shelfElements(shelf.elemRtMethodLevel);
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 107:
          expect(editor.getLine(t)).toEqual('        body:');
          editor.setCursor(108,8);
          list2 =['body'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRtMethodLevel);
          editor.setCursor(108,10);
          designerAsserts.shelfElements(shelf.elemBodyLevel);
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 108:
          expect(editor.getLine(t)).toEqual('          application/json:');
          editor.setCursor(109,10);
          list2 =['application/json'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemBodyLevel);
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 109:
          expect(editor.getLine(t)).toEqual('            schema: <<schema>>');
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 110:
          expect(editor.getLine(t)).toEqual('        responses:');
          editor.setCursor(111,8);
          list2 =['body','responses'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRtMethodLevel);
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 111:
          expect(editor.getLine(t)).toEqual('          200:');
          editor.setCursor(112,12);
          designerAsserts.shelfElements(shelf.elemResponsesLevel);
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 112:
          expect(editor.getLine(t)).toEqual('            body:');
          editor.setCursor(113,12);
          list2 =['body'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResponsesLevel);
          editor.setCursor(113,14);
          designerAsserts.shelfElements(shelf.elemBodyLevel);
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 113:
          expect(editor.getLine(t)).toEqual('              application/json:');
          editor.setCursor(114,14);
          list2 =['application/json'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemBodyLevel);
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 114:
          expect(editor.getLine(t)).toEqual('                schema: <<schema>>');
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 115:
          expect(editor.getLine(t)).toEqual('      patch:');
          editor.setCursor(116,6);
          list2 =['type','get','put','patch'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResourceTypeLevel);
          editor.setCursor(116,8);
          designerAsserts.shelfElements(shelf.elemRtMethodLevel);
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 116:
          expect(editor.getLine(t)).toEqual('        body:');
          editor.setCursor(117,8);
          list2 =['body'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRtMethodLevel);
          editor.setCursor(117,10);
          designerAsserts.shelfElements(shelf.elemBodyLevel);
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 117:
          expect(editor.getLine(t)).toEqual('          application/json:');
          editor.setCursor(118,10);
          list2 =['application/json'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemBodyLevel);
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 118:
          expect(editor.getLine(t)).toEqual('            schema: <<schema>>');
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 119:
          expect(editor.getLine(t)).toEqual('        responses:');
          editor.setCursor(120,8);
          list2 =['body','responses'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRtMethodLevel);
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 120:
          expect(editor.getLine(t)).toEqual('          200:');
          editor.setCursor(121,12);
          designerAsserts.shelfElements(shelf.elemResponsesLevel);
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 121:
          expect(editor.getLine(t)).toEqual('            body:');
          editor.setCursor(122,12);
          list2 =['body'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResponsesLevel);
          editor.setCursor(122,14);
          designerAsserts.shelfElements(shelf.elemBodyLevel);
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 122:
          expect(editor.getLine(t)).toEqual('              application/json:');
          editor.setCursor(123,14);
          list2 =['application/json'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemBodyLevel);
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 123:
          expect(editor.getLine(t)).toEqual('                schema: <<schema>>');
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 124:
          expect(editor.getLine(t)).toEqual('      delete:');
          editor.setCursor(125,6);
          list2 =['type','get','put','patch','delete'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResourceTypeLevel);
          editor.setCursor(125,8);
          designerAsserts.shelfElements(shelf.elemRtMethodLevel);
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 125:
          expect(editor.getLine(t)).toEqual('traits:');
          editor.setCursor(126,0);
          list2 =['title', 'baseUri','version', 'schemas','resourceTypes','traits'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRootLevel);
          designerAsserts.parserError('83', 'there is no trait named paged');
          break;
        case 126:
          expect(editor.getLine(t)).toEqual('  - paged:');
          designerAsserts.parserError('126', 'invalid trait definition, it must be a map');
          editor.setCursor(127,6);
          designerAsserts.shelfElements(shelf.elemTraitsLevel);
          break;
        case 127:
          expect(editor.getLine(t)).toEqual('      displayName: paged');
          editor.setCursor(128,6);
          list2 =['displayName'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemTraitsLevel);
          break;
        case 128:
          expect(editor.getLine(t)).toEqual('      queryParameters:');
          editor.setCursor(129,6);
          list2 =['displayName','queryParameters'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemTraitsLevel);
          editor.setCursor(129,8);
          designerAsserts.shelfWithNoElements();
          break;
        case 129:
          expect(editor.getLine(t)).toEqual('        start:');
          editor.setCursor(130,10);
          designerAsserts.shelfElements(shelf.elemNamedParametersLevel);
          break;
        case 130:
          expect(editor.getLine(t)).toEqual('          description: The first page to return');
          editor.setCursor(131,10);
          list2 =['description'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemNamedParametersLevel);
          break;
        case 131:
          expect(editor.getLine(t)).toEqual('          type: number');
          editor.setCursor(132,10);
          list2 =['description','type'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemNamedParametersLevel);
          break;
        case 132:
          expect(editor.getLine(t)).toEqual('        pages:');
          editor.setCursor(133,10);
          designerAsserts.shelfElements(shelf.elemNamedParametersLevel);
          break;
        case 133:
          expect(editor.getLine(t)).toEqual('          description: The number of pages to return');
          editor.setCursor(134,10);
          list2 =['description'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemNamedParametersLevel);
          break;
        case 134:
          expect(editor.getLine(t)).toEqual('          type: number');
          editor.setCursor(135,10);
          list2 =['description','type'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemNamedParametersLevel);
          break;
        case 135:
          expect(editor.getLine(t)).toEqual('  - secured:');
          designerAsserts.parserError('135', 'invalid trait definition, it must be a map');
          editor.setCursor(136,6);
          designerAsserts.shelfElements(shelf.elemTraitsLevel);
          break;
        case 136:
          expect(editor.getLine(t)).toEqual('      displayName: secured');
          editor.setCursor(137,6);
          list2 =['displayName'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemTraitsLevel);
          break;
        case 137:
          expect(editor.getLine(t)).toEqual('      headers:');
          editor.setCursor(137,6);
          list2 =['displayName','headers'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemTraitsLevel);
          break;
        case 138:
          expect(editor.getLine(t)).toEqual('        Authorization:');
          editor.setCursor(139,10);
          designerAsserts.shelfElements(shelf.elemNamedParametersLevel);
          break;
        case 139:
          expect(editor.getLine(t)).toEqual('          description: The auth token for this request');
          editor.setCursor(140,10);
          list2 =['description'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemNamedParametersLevel);
          break;
        case 140:
          expect(editor.getLine(t)).toEqual('      responses:');
          editor.setCursor(141,6);
          list2 =['displayName','headers','responses'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemTraitsLevel);
          break;
        case 141:
          expect(editor.getLine(t)).toEqual('        401:');
          editor.setCursor(142,10);
          designerAsserts.shelfElements(shelf.elemResponsesLevel);
          break;
        case 142:
          expect(editor.getLine(t)).toEqual('          description: Unauthorized');
          editor.setCursor(143,10);
          list2 =['description'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResponsesLevel);
          break;
        case 143:
          expect(editor.getLine(t)).toEqual('/presentations: &presentations');
          editor.setCursor(144,2);
          designerAsserts.shelfElements(shelf.elemResourceLevel);
          designerAsserts.consoleMainResources(['/presentations']);
          designerAsserts.consoleResources(['/presentations']);
          break;
        case 144:
          expect(editor.getLine(t)).toEqual('  type: { collection: { schema: presentation } }');
          editor.setCursor(145,2);
          list2 =['type'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResourceLevel);
          designerAsserts.consoleResourceResourceType(['collection']);
          break;
        case 145:
          expect(editor.getLine(t)).toEqual('  is: [ secured ]');
          editor.setCursor(146,2);
          list2 =['type','is'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResourceLevel);
          designerAsserts.consoleResourcesTraits(['secured']);
          break;
        case 146:
          expect(editor.getLine(t)).toEqual('  get:');
          editor.setCursor(147,2);
          list2 =['type','is','get'];
          designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResourceLevel);
          designerAsserts.consoleResourcesMethods(['GET','POST']);
          break;
        case 147:
          expect(editor.getLine(t)).toEqual('    queryParameters:');
          break;
        case 148:
          expect(editor.getLine(t)).toEqual('      title:');
          break;
        case 149:
          expect(editor.getLine(t)).toEqual('        description: Filter by title');
          break;
        case 150:
          expect(editor.getLine(t)).toEqual('  /{presentationId}:');
          designerAsserts.consoleResources(['/presentations','/presentations /{presentationId}']);
          break;
        case 151:
          expect(editor.getLine(t)).toEqual('    type: { member: { schema: presentation } }');
          designerAsserts.consoleResourceResourceType(['collection','member']);
          designerAsserts.consoleResourcesMethods(['GET','POST','GET','PUT','PATCH','DELETE']);
          break;
        case 152:
          expect(editor.getLine(t)).toEqual('    is: [ secured ]');
          designerAsserts.consoleResourcesTraits(['secured','secured']);
          break;
        case 153:
          expect(editor.getLine(t)).toEqual('/products:');
          designerAsserts.consoleMainResources(['/presentations','/products']);
          designerAsserts.consoleResources(['/presentations','/presentations /{presentationId}','/products']);
          break;
        case 154:
          expect(editor.getLine(t)).toEqual('  type: { collection: { schema: product } }');
          designerAsserts.consoleResourceResourceType(['collection','member','collection']);
          designerAsserts.consoleResourcesMethods(['GET','POST','GET','PUT','PATCH','DELETE','GET','POST']);
          break;
        case 155:
          expect(editor.getLine(t)).toEqual('  is: [ secured ]');
          designerAsserts.consoleResourcesTraits(['secured','secured','secured']);
          break;
        case 156:
          expect(editor.getLine(t)).toEqual('  get:');
          break;
        case 157:
          expect(editor.getLine(t)).toEqual('    queryParameters:');
          break;
        case 158:
          expect(editor.getLine(t)).toEqual('      region:');
          break;
        case 159:
          expect(editor.getLine(t)).toEqual('        description: Filter by region');
          break;
        case 160:
          expect(editor.getLine(t)).toEqual('  /{productId}:');
          designerAsserts.consoleResources(['/presentations','/presentations /{presentationId}','/products','/products /{productId}']);
          break;
        case 161:
          expect(editor.getLine(t)).toEqual('    type: { member: { schema: product } }');
          designerAsserts.consoleResourceResourceType(['collection','member','collection','member']);
          designerAsserts.consoleResourcesMethods(['GET','POST','GET','PUT','PATCH','DELETE','GET','POST','GET','PUT','PATCH','DELETE']);
          break;
        case 162:
          expect(editor.getLine(t)).toEqual('    is: [ secured ]');
          designerAsserts.consoleResourcesTraits(['secured','secured','secured','secured']);
          break;
        case 163:
          expect(editor.getLine(t)).toEqual('    /presentations: *presentations');
          designerAsserts.consoleResources(['/presentations','/presentations /{presentationId}','/products',
          '/products /{productId}', '/products /{productId} /presentations','/products /{productId} /presentations /{presentationId}']);
          designerAsserts.consoleResourcesMethods(['GET','POST','GET','PUT','PATCH','DELETE','GET','POST','GET','PUT','PATCH','DELETE','GET','POST','GET','PUT','PATCH','DELETE']);
          break;
        default:
//          console.log('line '+t+' missing validation');
        }
      });
    });
  }); // e2e validation
  describe('console validation - expanded', function(){

    xdescribe('collapsed Console', function(){

      it('verify resources name', function(){
        var expList = ['/presentations','/presentations /{presentationId}','/products','/products /{productId}',
          '/products /{productId} /presentations','/products /{productId} /presentations /{presentationId}'];
        designerAsserts.consoleResourceName(expList);
      });

      it('verify resources methods', function(){
        var expList ={
          'r0':['GET','POST'],
          'r1':['GET','PUT','PATCH','DELETE'],
          'r2':['GET','POST'],
          'r3':['GET','PUT','PATCH','DELETE'],
          'r4':['GET','POST'],
          'r5':['GET','PUT','PATCH','DELETE']
        };
        designerAsserts.consoleResourceMethods(expList);
      });

      it('verify resources Resource-types', function(){
        var expList = ['collection','member','collection','member','collection','member'];
        designerAsserts.consoleResourceResourceType(expList);
      });

      it('verify resources Traits', function(){
        var expList = {'r0':['secured'],'r1':['secured'],
          'r2':['secured'],'r3':['secured'],'r4':['secured'],
          'r5':['secured'] };
        designerAsserts.consoleResourceTraits(expList);
      });

    }); // collapsed Console


    xit('/presentation', function(){

      browser.findElements(by.css('[role="resource"]')).then(function(resources){
        expect(resources.length).toEqual(6);

//      Expanded
        resources[0].click();
        resources[0].findElements(by.css('.accordion [role="method"]')).then(function(methods){
          methods[0].click();
          methods[0].findElements(by.css('[role="documentation"] .tabbable li a')).then(function(tab){
            expect(tab[0].getText()).toEqual('Request');
            expect(tab[1].getText()).toEqual('Responses');
            expect(tab[2].getText()).toEqual('Try It');
            tab[0].click().then(function(){
//              resources[0].findElements(by.css('.tabbable .tab-content section[heading="Headers"]')).then(function(headers){
              resources[0].findElements(by.css('.tabbable .tab-content [heading="Request"] section[heading="Headers"]')).then(function(headers){
                console.log('headers length', headers.length);
                headers[0].findElements(by.css('h2')).then(function(h2){
                  expect(h2.length).toEqual(1);
                  expect(h2[0].getText()).toEqual('Headers');
                });
                headers[1].findElements(by.css('h2')).then(function(h2){
                  expect(h2.length).toEqual(1);
                  expect(h2[0].getText()).toEqual('Headers');
                });

                headers[0].findElements(by.css('h4')).then(function(h4){
                  h4.findElements(by.css('span[role="display-name"]')).then(function(displayName){
                    expect(displayName.lenght).toEqual(1);
                    expect(displayName.getText()).toEqual('Autorizationmm');
                  });
                });
              });
            });
          });
        });

      });

    });

  });// console validation - expanded
}); // MAIN