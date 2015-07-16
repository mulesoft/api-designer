'use strict';
var AssertsHelper = require('../../lib/asserts-helper.js').AssertsHelper;
var EditorHelper = require('../../lib/editor-helper.js').EditorHelper;
var ShelfHelper = require('../../lib/shelf-helper.js').ShelfHelper;
var ConsoleHelper = require('../../lib/console-helper.js').ConsoleHelper;
var definition = require('../../example-files/muse-raml.js').definition;

describe('Muse: Mule Sales Enablement API', function () {
  var designerAsserts= new AssertsHelper();
  var editor= new EditorHelper();
  var shelf= new ShelfHelper();
  var consoleApi = new ConsoleHelper();

  describe('e2e validation', function(){
    it('clear editor', function(){
      editor.setValue('');
      expect(editor.getLine(1)).toEqual('');
      designerAsserts.shelfElements(shelf.elemRamlVersion);
      expect(editor.IsParserErrorDisplayed()).toBe(false);
    });

    var i = 1;
    definition.forEach(function(line){
      var t = i++;
      it('Line '+t+'- content: '+line, function(){
        shelf = new ShelfHelper();
        var list2;
        editor.setLine(t, line.replace(/"/g, '\\"'));
        var d = {
          1: function () {
            expect(editor.getLine(t)).toEqual('#%RAML 0.8');
            editor.setCursor(2,0);
            designerAsserts.shelfElements(shelf.elemRootLevel);
          },
          2: function(){
            expect(editor.getLine(t)).toEqual('title: "Muse: Mule Sales Enablement API"');
            // TODO: rewrite asserts to accomodate to console changes
            //designerAsserts.consoleApiTitle('Muse: Mule Sales Enablement API');
            editor.setCursor(3,0);
            list2 = ['title'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRootLevel);
          },
          3: function(){
            expect(editor.getLine(t)).toEqual('version: v1');
            editor.setCursor(4,0);
            list2 =['title','version'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRootLevel);
          },
          4: function(){
            expect(editor.getLine(t)).toEqual('baseUri: http://examples.ramlicio.us/muse');
            editor.setCursor(5,0);
            list2 = ['title', 'baseUri','version'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRootLevel);
          },
          5: function(){
            expect(editor.getLine(t)).toEqual('schemas:');
            editor.setCursor(6,0);
            list2 =['title', 'baseUri','version', 'schemas'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRootLevel);
            designerAsserts.parserError('5', 'schemas property must be an array');
          },
          6 : function(){
            expect(editor.getLine(t)).toEqual('  - presentation: |');
          },
          7: function(){
            expect(editor.getLine(t)).toEqual('      {  "$schema": "http://json-schema.org/draft-03/schema",');
          },
          8 : function(){
            expect(editor.getLine(t)).toEqual('         "type": "object",');
          },
          9 : function(){
            expect(editor.getLine(t)).toEqual('         "description": "A product presentation",');
          },
          10 : function(){
            expect(editor.getLine(t)).toEqual('         "properties": {');
          },
          11 : function(){
            expect(editor.getLine(t)).toEqual('           "id":  { "type": "string" },');
          },
          12 : function(){
            expect(editor.getLine(t)).toEqual('           "title":  { "type": "string" },');
          },
          13 : function(){
            expect(editor.getLine(t)).toEqual('           "description":  { "type": "string" },');
          },
          14 : function(){
            expect(editor.getLine(t)).toEqual('           "fileUrl":  { "type": "string" },');
          },
          15 : function(){
            expect(editor.getLine(t)).toEqual('           "productId":  { "type": "string" }');
          },
          16 : function(){
            expect(editor.getLine(t)).toEqual('         },');
          },
          17 : function(){
            expect(editor.getLine(t)).toEqual('         "required": [ "id", "title", "fileUrl", "productId" ]');
          },
          18 : function(){
            expect(editor.getLine(t)).toEqual('      }');
          },
          19 : function(){
            expect(editor.getLine(t)).toEqual('  - presentations: |');
          },
          20 : function(){
            expect(editor.getLine(t)).toEqual('      {  "$schema": "http://json-schema.org/draft-03/schema",');
          },
          21 : function(){
            expect(editor.getLine(t)).toEqual('         "type": "array",');
          },
          22 : function(){
            expect(editor.getLine(t)).toEqual('         "description": "Multiple product presentations",');
          },
          23 : function(){
            expect(editor.getLine(t)).toEqual('         "items": {');
          },
          24 : function(){
            expect(editor.getLine(t)).toEqual('           "type": "object",');
          },
          25 : function(){
            expect(editor.getLine(t)).toEqual('           "properties": {');
          },
          26 : function(){
            expect(editor.getLine(t)).toEqual('             "id":  { "type": "string" },');
          },
          27 : function(){
            expect(editor.getLine(t)).toEqual('             "title":  { "type": "string" },');
          },
          28 : function(){
            expect(editor.getLine(t)).toEqual('             "description":  { "type": "string" },');
          },
          29 : function(){
            expect(editor.getLine(t)).toEqual('             "fileUrl":  { "type": "string" },');
          },
          30 : function(){
            expect(editor.getLine(t)).toEqual('             "productId":  { "type": "string" }');
          },
          31 : function(){
            expect(editor.getLine(t)).toEqual('           },');
          },
          32 : function(){
            expect(editor.getLine(t)).toEqual('           "required": [ "id", "title", "fileUrl", "productId" ]');
          },
          33 : function(){
            expect(editor.getLine(t)).toEqual('         }');
          },
          34 : function(){
            expect(editor.getLine(t)).toEqual('      }');
          },
          35 : function(){
            expect(editor.getLine(t)).toEqual('  - product: |');
          },
          36 : function(){
            expect(editor.getLine(t)).toEqual('      {  "$schema": "http://json-schema.org/draft-03/schema",');
          },
          37 : function(){
            expect(editor.getLine(t)).toEqual('         "type": "object",');
          },
          38 : function(){
            expect(editor.getLine(t)).toEqual('         "description": "A product",');
          },
          39 : function(){
            expect(editor.getLine(t)).toEqual('         "properties": {');
          },
          40 : function(){
            expect(editor.getLine(t)).toEqual('           "id":  { "type": "string" },');
          },
          41 : function(){
            expect(editor.getLine(t)).toEqual('           "name":  { "type": "string" },');
          },
          42 : function(){
            expect(editor.getLine(t)).toEqual('           "description":  { "type": "string" },');
          },
          43 : function(){
            expect(editor.getLine(t)).toEqual('           "imageUrl":  { "type": "string" },');
          },
          44 : function(){
            expect(editor.getLine(t)).toEqual('           "region": { "type": "string" }');
          },
          45 : function(){
            expect(editor.getLine(t)).toEqual('         },');
          },
          46 : function(){
            expect(editor.getLine(t)).toEqual('         "required": [ "id", "name", "region" ]');
          },
          47 : function(){
            expect(editor.getLine(t)).toEqual('      }');
          },
          48:  function(){
            expect(editor.getLine(t)).toEqual('  - products: |');
          },
          49 : function(){
            expect(editor.getLine(t)).toEqual('      {  "$schema": "http://json-schema.org/draft-03/schema",');
          },
          50 : function(){
            expect(editor.getLine(t)).toEqual('         "type": "array",');
          },
          51 : function(){
            expect(editor.getLine(t)).toEqual('         "description": "Multiple products",');
          },
          52 : function(){
            expect(editor.getLine(t)).toEqual('         "items": {');
          },
          53 : function(){
            expect(editor.getLine(t)).toEqual('           "type": "object",');
          },
          54 : function(){
            expect(editor.getLine(t)).toEqual('           "properties": {');
          },
          55 : function(){
            expect(editor.getLine(t)).toEqual('             "id":  { "type": "string" },');
          },
          56 : function(){
            expect(editor.getLine(t)).toEqual('             "name":  { "type": "string" },');
          },
          57 : function(){
            expect(editor.getLine(t)).toEqual('             "description":  { "type": "string" },');
          },
          58  : function(){
            expect(editor.getLine(t)).toEqual('             "imageUrl":  { "type": "string" },');
          },
          59 : function(){
            expect(editor.getLine(t)).toEqual('             "region":  { "type": "string" }');
          },
          60 : function(){
            expect(editor.getLine(t)).toEqual('           },');
          },
          61 : function(){
            expect(editor.getLine(t)).toEqual('           "required": [ "id", "name", "region" ]');
          },
          62 : function(){
            expect(editor.getLine(t)).toEqual('         }');
          },
          63 : function(){
            expect(editor.getLine(t)).toEqual('      }');
          },
          64 : function(){
            expect(editor.getLine(t)).toEqual('resourceTypes:');
            editor.setCursor(65,0);
            list2 =['title', 'baseUri','version', 'schemas','resourceTypes'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRootLevel);
            designerAsserts.parserError('64', 'invalid resourceTypes definition, it must be an array');
          },
          65 : function(){
            expect(editor.getLine(t)).toEqual('  - base:');
            editor.setCursor(66,6);
            designerAsserts.shelfElements(shelf.elemResourceTypeLevel);
            designerAsserts.parserError('65', 'invalid resourceType definition, it must be a map');
          },
          66: function(){
            expect(editor.getLine(t)).toEqual('      get?:');
            editor.setCursor(67,6);
            list2 =['get'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResourceTypeLevel);
            editor.setCursor(67,8);
            designerAsserts.shelfElements(shelf.elemRtMethodLevel);
          },
          67 : function(){
            expect(editor.getLine(t)).toEqual('        responses: &standardResponses');
            editor.setCursor(68,8);
            list2 =['responses'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRtMethodLevel);
          },
          68 : function(){
            expect(editor.getLine(t)).toEqual('          200:');
            editor.setCursor(69,12);
            designerAsserts.shelfElements(shelf.elemResponsesLevel);
          },
          69 : function(){
            expect(editor.getLine(t)).toEqual('            description: OK');
          },
          70 : function(){
            expect(editor.getLine(t)).toEqual('      put?:');
            editor.setCursor(71,6);
            list2 =['get','put'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResourceTypeLevel);
            editor.setCursor(71,8);
            designerAsserts.shelfElements(shelf.elemRtMethodLevel);
          },
          71 : function(){
            expect(editor.getLine(t)).toEqual('        responses: *standardResponses');
          },
          72  : function(){
            expect(editor.getLine(t)).toEqual('      patch?:');
            editor.setCursor(73,6);
            list2 =['get','put', 'patch'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResourceTypeLevel);
            editor.setCursor(73,8);
            designerAsserts.shelfElements(shelf.elemRtMethodLevel);
          },
          73 : function(){
            expect(editor.getLine(t)).toEqual('        responses: *standardResponses');
          },
          74 : function(){
            expect(editor.getLine(t)).toEqual('      post?:');
            editor.setCursor(75,6);
            list2 =['get','put', 'patch','post'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResourceTypeLevel);
            editor.setCursor(75,8);
            designerAsserts.shelfElements(shelf.elemRtMethodLevel);
          },
          75 : function(){
            expect(editor.getLine(t)).toEqual('        responses:');
            editor.setCursor(76,8);
            list2 =['responses'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRtMethodLevel);
          },
          76 : function(){
            expect(editor.getLine(t)).toEqual('          201:');
            editor.setCursor(77,12);
            designerAsserts.shelfElements(shelf.elemResponsesLevel);
          },
          77 : function(){
            expect(editor.getLine(t)).toEqual('            description: Created');
          },
          78 : function(){
            expect(editor.getLine(t)).toEqual('      delete?:');
            editor.setCursor(79,6);
            list2 =['get','put', 'patch','post','delete'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResourceTypeLevel);
            editor.setCursor(79,8);
            designerAsserts.shelfElements(shelf.elemRtMethodLevel);
          },
          79 : function(){
            expect(editor.getLine(t)).toEqual('        responses: *standardResponses');
          },
          80 : function(){
            expect(editor.getLine(t)).toEqual('  - collection:');
            designerAsserts.parserError('80', 'invalid resourceType definition, it must be a map');
            editor.setCursor(81,6);
            designerAsserts.shelfElements(shelf.elemResourceTypeLevel);
          },
          81 : function(){
            expect(editor.getLine(t)).toEqual('      type: base');
            editor.setCursor(82,6);
            list2 =['type'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResourceTypeLevel);
          },
          82 : function(){
            expect(editor.getLine(t)).toEqual('      get:');
            editor.setCursor(83,6);
            list2 =['get','type'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResourceTypeLevel);
            editor.setCursor(83,8);
            designerAsserts.shelfElements(shelf.elemRtMethodLevel);
          },
          83 : function(){
            expect(editor.getLine(t)).toEqual('        is: [ paged ]');
            designerAsserts.parserError('83', 'there is no trait named paged');
            editor.setCursor(84,8);
            list2 =['is'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRtMethodLevel);
          },
          84 : function(){
            expect(editor.getLine(t)).toEqual('        responses:');
            editor.setCursor(85,8);
            list2 =['is','responses'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRtMethodLevel);
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          85 : function(){
            expect(editor.getLine(t)).toEqual('          200:');
            editor.setCursor(86,12);
            designerAsserts.shelfElements(shelf.elemResponsesLevel);
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          86 : function(){
            expect(editor.getLine(t)).toEqual('            body:');
            editor.setCursor(87,12);
            list2 =['body'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResponsesLevel);
            editor.setCursor(87,14);
            designerAsserts.shelfElements(shelf.elemBodyLevel);
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          87 : function(){
            expect(editor.getLine(t)).toEqual('              application/json:');
            editor.setCursor(88,14);
            list2 =['application/json'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemBodyLevel);
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          88 : function(){
            expect(editor.getLine(t)).toEqual('                schema: <<schema | !pluralize>>');
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          89  : function(){
            expect(editor.getLine(t)).toEqual('      post:');
            editor.setCursor(90,6);
            list2 =['get','type','post'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResourceTypeLevel);
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          90 : function(){
            expect(editor.getLine(t)).toEqual('        body:');
            editor.setCursor(91,8);
            list2 =['body'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRtMethodLevel);
            editor.setCursor(91,10);
            designerAsserts.shelfElements(shelf.elemBodyLevel);
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          91 : function(){
            expect(editor.getLine(t)).toEqual('          application/json:');
            editor.setCursor(92,10);
            list2 =['application/json'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemBodyLevel);
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          92 : function(){
            expect(editor.getLine(t)).toEqual('            schema: <<schema>>');
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          93 : function(){
            expect(editor.getLine(t)).toEqual('        responses:');
            editor.setCursor(94,8);
            list2 =['body','responses'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRtMethodLevel);
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          94 : function(){
            expect(editor.getLine(t)).toEqual('          201:');
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          95 : function(){
            expect(editor.getLine(t)).toEqual('            body:');
            editor.setCursor(96,12);
            list2 =['body'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResponsesLevel);
            editor.setCursor(96,14);
            designerAsserts.shelfElements(shelf.elemBodyLevel);
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          96 : function(){
            expect(editor.getLine(t)).toEqual('              application/json:');
            editor.setCursor(97,14);
            list2 =['application/json'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemBodyLevel);
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          97 : function(){
            expect(editor.getLine(t)).toEqual('                schema: <<schema>>');
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          98 : function(){
            expect(editor.getLine(t)).toEqual('  - member:');
            designerAsserts.parserError('83', 'there is no trait named paged');
            editor.setCursor(99,6);
            designerAsserts.shelfElements(shelf.elemResourceTypeLevel);
          },
          99 : function(){
            expect(editor.getLine(t)).toEqual('      type: base');
            designerAsserts.parserError('83', 'there is no trait named paged');
            editor.setCursor(100,6);
            list2 =['type'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResourceTypeLevel);
          },
          100 : function(){
            expect(editor.getLine(t)).toEqual('      get:');
            editor.setCursor(101,6);
            list2 =['type','get'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResourceTypeLevel);
            editor.setCursor(101,8);
            designerAsserts.shelfElements(shelf.elemRtMethodLevel);
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          101 : function(){
            expect(editor.getLine(t)).toEqual('        responses:');
            editor.setCursor(102,8);
            list2 =['responses'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRtMethodLevel);
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          102 : function(){
            expect(editor.getLine(t)).toEqual('          200:');
            editor.setCursor(103,12);
            designerAsserts.shelfElements(shelf.elemResponsesLevel);
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          103 : function(){
            expect(editor.getLine(t)).toEqual('            body:');
            editor.setCursor(104,12);
            list2 =['body'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResponsesLevel);
            editor.setCursor(104,14);
            designerAsserts.shelfElements(shelf.elemBodyLevel);
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          104 : function(){
            expect(editor.getLine(t)).toEqual('              application/json:');
            editor.setCursor(104,14);
            list2 =['application/json'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemBodyLevel);
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          105 : function(){
            expect(editor.getLine(t)).toEqual('                schema: <<schema>>');
          },
          106 : function(){
            expect(editor.getLine(t)).toEqual('      put:');
            editor.setCursor(107,6);
            list2 =['type','get','put'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResourceTypeLevel);
            editor.setCursor(107,8);
            designerAsserts.shelfElements(shelf.elemRtMethodLevel);
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          107 : function(){
            expect(editor.getLine(t)).toEqual('        body:');
            editor.setCursor(108,8);
            list2 =['body'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRtMethodLevel);
            editor.setCursor(108,10);
            designerAsserts.shelfElements(shelf.elemBodyLevel);
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          108 : function(){
            expect(editor.getLine(t)).toEqual('          application/json:');
            editor.setCursor(109,10);
            list2 =['application/json'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemBodyLevel);
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          109  : function(){
            expect(editor.getLine(t)).toEqual('            schema: <<schema>>');
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          110 : function(){
            expect(editor.getLine(t)).toEqual('        responses:');
            editor.setCursor(111,8);
            list2 =['body','responses'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRtMethodLevel);
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          111 : function(){
            expect(editor.getLine(t)).toEqual('          200:');
            editor.setCursor(112,12);
            designerAsserts.shelfElements(shelf.elemResponsesLevel);
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          112 : function(){
            expect(editor.getLine(t)).toEqual('            body:');
            editor.setCursor(113,12);
            list2 =['body'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResponsesLevel);
            editor.setCursor(113,14);
            designerAsserts.shelfElements(shelf.elemBodyLevel);
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          113 : function(){
            expect(editor.getLine(t)).toEqual('              application/json:');
            editor.setCursor(114,14);
            list2 =['application/json'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemBodyLevel);
//            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          114 : function(){
            expect(editor.getLine(t)).toEqual('                schema: <<schema>>');
//            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          115 : function(){
            expect(editor.getLine(t)).toEqual('      patch:');
            editor.setCursor(116,6);
            list2 =['type','get','put','patch'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResourceTypeLevel);
            editor.setCursor(116,8);
            designerAsserts.shelfElements(shelf.elemRtMethodLevel);
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          116 : function(){
            expect(editor.getLine(t)).toEqual('        body:');
            editor.setCursor(117,8);
            list2 =['body'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRtMethodLevel);
            editor.setCursor(117,10);
            designerAsserts.shelfElements(shelf.elemBodyLevel);
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          117 : function(){
            expect(editor.getLine(t)).toEqual('          application/json:');
            editor.setCursor(118,10);
            list2 =['application/json'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemBodyLevel);
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          118 : function(){
            expect(editor.getLine(t)).toEqual('            schema: <<schema>>');
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          119 : function(){
            expect(editor.getLine(t)).toEqual('        responses:');
            editor.setCursor(120,8);
            list2 =['body','responses'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRtMethodLevel);
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          120 : function(){
            expect(editor.getLine(t)).toEqual('          200:');
            editor.setCursor(121,12);
            designerAsserts.shelfElements(shelf.elemResponsesLevel);
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          121 : function(){
            expect(editor.getLine(t)).toEqual('            body:');
            editor.setCursor(122,12);
            list2 =['body'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResponsesLevel);
            editor.setCursor(122,14);
            designerAsserts.shelfElements(shelf.elemBodyLevel);
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          122 : function(){
            expect(editor.getLine(t)).toEqual('              application/json:');
            editor.setCursor(123,14);
            list2 =['application/json'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemBodyLevel);
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          123 : function(){
            expect(editor.getLine(t)).toEqual('                schema: <<schema>>');
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          124 : function(){
            expect(editor.getLine(t)).toEqual('      delete:');
            editor.setCursor(125,6);
            list2 =['type','get','put','patch','delete'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResourceTypeLevel);
            editor.setCursor(125,8);
            designerAsserts.shelfElements(shelf.elemRtMethodLevel);
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          125 : function(){
            expect(editor.getLine(t)).toEqual('traits:');
            editor.setCursor(126,0);
            list2 =['title', 'baseUri','version', 'schemas','resourceTypes','traits'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemRootLevel);
            designerAsserts.parserError('83', 'there is no trait named paged');
          },
          126 : function(){
            expect(editor.getLine(t)).toEqual('  - paged:');
            designerAsserts.parserError('126', 'invalid trait definition, it must be a map');
            editor.setCursor(127,6);
            designerAsserts.shelfElements(shelf.elemTraitsLevel);
          },
          127 : function(){
            expect(editor.getLine(t)).toEqual('      displayName: paged');
            editor.setCursor(128,6);
            list2 =['displayName'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemTraitsLevel);

          },
          128 : function(){
            expect(editor.getLine(t)).toEqual('      queryParameters:');
            editor.setCursor(129,6);
            list2 =['displayName','queryParameters'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemTraitsLevel);
            editor.setCursor(129,8);
            designerAsserts.shelfWithNoElements();
          },
          129 : function(){
            expect(editor.getLine(t)).toEqual('        start:');
            editor.setCursor(130,10);
            designerAsserts.shelfElements(shelf.elemNamedParametersLevel);
          },
          130 : function(){
            expect(editor.getLine(t)).toEqual('          description: The first page to return');
            editor.setCursor(131,10);
            list2 =['description'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemNamedParametersLevel);
          },
          131 : function(){
            expect(editor.getLine(t)).toEqual('          type: number');
            editor.setCursor(132,10);
            list2 =['description','type'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemNamedParametersLevel);
          },
          132 : function(){
            expect(editor.getLine(t)).toEqual('        pages:');
            editor.setCursor(133,10);
            designerAsserts.shelfElements(shelf.elemNamedParametersLevel);
          },
          133 : function(){
            expect(editor.getLine(t)).toEqual('          description: The number of pages to return');
            editor.setCursor(134,10);
            list2 =['description'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemNamedParametersLevel);
          },
          134 : function(){
            expect(editor.getLine(t)).toEqual('          type: number');
            editor.setCursor(135,10);
            list2 =['description','type'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemNamedParametersLevel);
          },
          135: function(){
            expect(editor.getLine(t)).toEqual('  - secured:');
            designerAsserts.parserError('135', 'invalid trait definition, it must be a map');
            editor.setCursor(136,6);
            designerAsserts.shelfElements(shelf.elemTraitsLevel);
          },
          136: function(){
            expect(editor.getLine(t)).toEqual('      displayName: secured');
            editor.setCursor(137,6);
            list2 =['displayName'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemTraitsLevel);
          },
          137: function(){
            expect(editor.getLine(t)).toEqual('      headers:');
            editor.setCursor(137,6);
            list2 =['displayName','headers'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemTraitsLevel);
          },
          138: function(){
            expect(editor.getLine(t)).toEqual('        Authorization:');
            editor.setCursor(139,10);
            designerAsserts.shelfElements(shelf.elemNamedParametersLevel);
          },
          139: function(){
            expect(editor.getLine(t)).toEqual('          description: The auth token for this request');
            editor.setCursor(140,10);
            list2 =['description'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemNamedParametersLevel);
          },
          140: function(){
            expect(editor.getLine(t)).toEqual('      responses:');
            editor.setCursor(141,6);
            list2 =['displayName','headers','responses'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemTraitsLevel);
          },
          141: function(){
            expect(editor.getLine(t)).toEqual('        401:');
            editor.setCursor(142,10);
            designerAsserts.shelfElements(shelf.elemResponsesLevel);
          },
          142: function(){
            expect(editor.getLine(t)).toEqual('          description: Unauthorized');
            editor.setCursor(143,10);
            list2 =['description'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResponsesLevel);
          },
          143: function(){
            expect(editor.getLine(t)).toEqual('/presentations: &presentations');
            editor.setCursor(144,2);
            designerAsserts.shelfElements(shelf.elemResourceLevel);
            // TODO: rewrite asserts to accomodate to console changes
            //designerAsserts.consoleMainResources(['/presentations']);
            //designerAsserts.consoleResources(['/presentations']);
          },
          144: function(){
            expect(editor.getLine(t)).toEqual('  type: { collection: { schema: presentation } }');
            editor.setCursor(145,2);
            list2 =['type'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResourceLevel);
            consoleApi.toggleResourceExpansion();
            // TODO: rewrite asserts to accomodate to console changes
            //designerAsserts.consoleResourceResourceType(['collection']);
            consoleApi.toggleResourceExpansion();
          },
          145: function(){
            expect(editor.getLine(t)).toEqual('  is: [ secured ]');
            editor.setCursor(146,2);
            list2 =['type','is'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResourceLevel);
          },
          146: function(){
            expect(editor.getLine(t)).toEqual('  get:');
            editor.setCursor(147,2);
            list2 =['type','is','get'];
            designerAsserts.shelfElementsNotDisplayed(list2, shelf.elemResourceLevel);
            // TODO: rewrite asserts to accomodate to console changes
            //designerAsserts.consoleResourcesMethods(['GET','POST']);
          },
          147: function(){
            expect(editor.getLine(t)).toEqual('    queryParameters:');
          },
          148: function(){
            expect(editor.getLine(t)).toEqual('      title:');
          },
          149: function(){
            expect(editor.getLine(t)).toEqual('        description: Filter by title');
          },
          150: function(){
            expect(editor.getLine(t)).toEqual('  /{presentationId}:');
            // TODO: rewrite asserts to accomodate to console changes
            //designerAsserts.consoleResources(['/presentations','/presentations /{presentationId}']);
          },
          151: function(){
            expect(editor.getLine(t)).toEqual('    type: { member: { schema: presentation } }');
            consoleApi.toggleResourceExpansion();
            // TODO: rewrite asserts to accomodate to console changes
            //designerAsserts.consoleResourceResourceType(['collection','member']);
            consoleApi.toggleResourceExpansion();
            // TODO: rewrite asserts to accomodate to console changes
            //designerAsserts.consoleResourcesMethods(['GET','POST','GET','PUT','PATCH','DELETE']);
          },
          152: function(){
            expect(editor.getLine(t)).toEqual('    is: [ secured ]');
          },
          153: function(){
            expect(editor.getLine(t)).toEqual('/products:');
            // TODO: rewrite asserts to accomodate to console changes
            //designerAsserts.consoleMainResources(['/presentations','/products']);
            // TODO: rewrite asserts to accomodate to console changes
            //designerAsserts.consoleResources(['/presentations','/presentations /{presentationId}','/products']);
          },
          154: function(){
            expect(editor.getLine(t)).toEqual('  type: { collection: { schema: product } }');
            consoleApi.toggleResourceExpansion();
            // TODO: rewrite asserts to accomodate to console changes
            //designerAsserts.consoleResourceResourceType(['collection','member','collection']);
            consoleApi.toggleResourceExpansion();
            // TODO: rewrite asserts to accomodate to console changes
            //designerAsserts.consoleResourcesMethods(['GET','POST','GET','PUT','PATCH','DELETE','GET','POST']);
          },
          155: function(){
            expect(editor.getLine(t)).toEqual('  is: [ secured ]');
          },
          156: function(){
            expect(editor.getLine(t)).toEqual('  get:');
          },
          157: function(){
            expect(editor.getLine(t)).toEqual('    queryParameters:');
          },
          158: function(){
            expect(editor.getLine(t)).toEqual('      region:');
          },
          159: function(){
            expect(editor.getLine(t)).toEqual('        description: Filter by region');
          },
          160: function(){
            expect(editor.getLine(t)).toEqual('  /{productId}:');
            // TODO: rewrite asserts to accomodate to console changes
            //designerAsserts.consoleResources(['/presentations','/presentations /{presentationId}','/products','/products /{productId}']);
          },
          161: function(){
            expect(editor.getLine(t)).toEqual('    type: { member: { schema: product } }');
            consoleApi.toggleResourceExpansion();
            // TODO: rewrite asserts to accomodate to console changes
            //designerAsserts.consoleResourceResourceType(['collection','member','collection','member']);
            consoleApi.toggleResourceExpansion();
            // TODO: rewrite asserts to accomodate to console changes
            //designerAsserts.consoleResourcesMethods(['GET','POST','GET','PUT','PATCH','DELETE','GET','POST','GET','PUT','PATCH','DELETE']);
          },
          162: function(){
            expect(editor.getLine(t)).toEqual('    is: [ secured ]');
          },
          163: function(){
            expect(editor.getLine(t)).toEqual('    /presentations: *presentations');
            // TODO: rewrite asserts to accomodate to console changes
            //designerAsserts.consoleResources(['/presentations','/presentations /{presentationId}','/products',
            //  '/products /{productId}', '/products /{productId} /presentations','/products /{productId} /presentations /{presentationId}']);
            // TODO: rewrite asserts to accomodate to console changes
            //designerAsserts.consoleResourcesMethods(['GET','POST','GET','PUT','PATCH','DELETE','GET','POST','GET','PUT','PATCH','DELETE','GET','POST','GET','PUT','PATCH','DELETE']);
          }
        };
        d[t]();
      });
    });
  }); // e2e validation
  describe('console validation - expanded', function(){

    describe('collapsed Console', function(){

      it('verify resources name', function(){
        // TODO: rewrite asserts to accomodate to console changes
        //var expList = ['/presentations','/presentations /{presentationId}','/products','/products /{productId}',
        //  '/products /{productId} /presentations','/products /{productId} /presentations /{presentationId}'];
        //designerAsserts.consoleResourceName(expList);
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
        // TODO: rewrite asserts to accomodate to console changes
        //var expList = ['collection','member','collection','member','collection','member'];
        consoleApi.toggleResourceExpansion();
        //designerAsserts.consoleResourceResourceType(expList);
        consoleApi.toggleResourceExpansion();
      });

    }); // collapsed Console

  });// console validation - expanded

  describe('editor with multiple files', function () {
    describe('undo', function () {
      it('should not mix file content when undoing a change', function () {
        editor.addNewFile('example.json')
          .then(function () {
            return editor.setValue('example1');
          })
          .then(function () {
            return editor.setValue('example1\\nexample2');
          })
          .then(function () {
            return editor.saveFileButton();
          })
          .then(function () {
            return editor.addNewFile('schema.json');
          })
          .then(function () {
            return editor.setValue('schema1');
          })
          .then(function () {
            return editor.setValue('schema1\\nschema2');
          })
          .then(function () {
            return editor.saveFileButton();
          })
          .then(function () {
            return editor.selectAFileByPos(1);
          })
          .then(function () {
            var modifierKey = process.platform === 'darwin' ?
              protractor.Key.COMMAND: protractor.Key.CONTROL;
            var undoCommand = protractor.Key.chord(modifierKey, 'z');

            return browser.actions().sendKeys(undoCommand).perform()
              .then(function () {
                return editor.saveFileButton();
              });
          })
          .then(function () {
            expect(editor.getLine(1)).toEqual('example1');
            expect(editor.getLine(2)).toEqual(null);
          });
      });
    });
  });
}); // MAIN
