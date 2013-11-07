'use strict';
var expect = require('expect.js');
var ramlUrl = require('../config').url;

describe('editor-shelf',function(){

  beforeEach(function () {
    browser.get(ramlUrl);
    browser.executeScript(function () {
      localStorage['config.updateResponsivenessInterval'] = 1;
    });
    browser.wait(function(){
      return editorGetLine(2).then(function(text) {
        return text === 'title:';
      });
    });
  });

//  describe('Verify Shelf elements',function(){

//    describe('RAML version', function(){
//
//      it('should offer RAML version on line 1', function(){
//        var definition = '';
//        editorSetValue(definition);
//        shelfGetElementsFromShelf().then(function(list){
//          expect(list.length).to.eql(1);
//          list[0].getText().then(function(text){
//            expect(text).to.eql('#%RAML 0.8');
//          });
//        });
//      });
//
//      xit('should not be offer RAML version - line 1 - fail RT-363', function(){
//        var definition = '#%RAML 0.8';
//        editorSetValue(definition);
//        shelfGetElementsFromShelf().then(function(list){
//          expect(list.length).to.eql(0);
//        });
//      });
//
//    }); //RAML version
//
//    describe('root section', function(){
//      it('root section by group', function(){
//        var definition = [
//          '#%RAML 0.8',
//          '      '
//        ].join('\\n');
//        editorSetValue(definition);
//        editorSetCursor(2,1);
//        shelfElementsRootByGroupAssertion();
//      });
//
//      describe('Not displayed after select', function(){
//
//        it('title is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: ',
//            ' '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(3,1);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['title'];
//            return noShelfElementsAssertion(list,shelfGetElementsRootLevel(),list2);
//          });
//        });
//
//        it('varsion is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'version: ',
//            ' '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(3,1);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['version'];
//            return noShelfElementsAssertion(list,shelfGetElementsRootLevel(),list2);
//          });
//        });
//
//        it('schemas is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'schemas: ',
//            ' '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(3,1);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['schemas'];
//            return noShelfElementsAssertion(list,shelfGetElementsRootLevel(),list2);
//          });
//        });
//
//        it('baseUri is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'baseUri: ',
//            ' '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(3,1);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['baseUri'];
//            return noShelfElementsAssertion(list,shelfGetElementsRootLevel(),list2);
//          });
//        });
//
//        it('mediaType: is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'mediaType: ',
//            ' '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(3,1);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['mediaType'];
//            return noShelfElementsAssertion(list,shelfGetElementsRootLevel(),list2);
//          });
//        });
//
//        it('protocols: is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'protocols: ',
//            ' '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(3,1);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['protocols'];
//            return noShelfElementsAssertion(list,shelfGetElementsRootLevel(),list2);
//          });
//        });
//
//        it('documentation: is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'documentation: ',
//            ' '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(3,1);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['documentation'];
//            return noShelfElementsAssertion(list,shelfGetElementsRootLevel(),list2);
//          });
//        });
//
//        it('baseUriParameters: is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'baseUriParameters: ',
//            ' '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(3,1);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['baseUriParameters'];
//            return noShelfElementsAssertion(list,shelfGetElementsRootLevel(),list2);
//          });
//        });
//
//        it('securitySchemes: is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'securitySchemes: ',
//            ' '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(3,1);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['securitySchemes'];
//            return noShelfElementsAssertion(list,shelfGetElementsRootLevel(),list2);
//          });
//        });
//
//        it('securedBy: is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'securedBy: ',
//            ' '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(3,1);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['securedBy'];
//            return noShelfElementsAssertion(list,shelfGetElementsRootLevel(),list2);
//          });
//        });
//
//        it('traits: is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'traits: ',
//            ' '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(3,1);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['traits'];
//            return noShelfElementsAssertion(list,shelfGetElementsRootLevel(),list2);
//          });
//        });
//
//        it('resourceTypes: is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'resourceTypes: ',
//            ' '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(3,1);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['resourceTypes'];
//            return noShelfElementsAssertion(list,shelfGetElementsRootLevel(),list2);
//          });
//        });
//        //no test is added for New Resource
//        // need to be automated added from the shelf and then verify the shelf status
//
//      }); // Not displayed after select
//
//    }); // root section

//    describe('resource level', function(){
//
//      it('resource shelf elements by group', function(){
//        var definition = [
//          '#%RAML 0.8',
//          'title: My api',
//          '/res:',
//          '   '
//        ].join('\\n');
//        editorSetValue(definition);
//        editorSetCursor(4,3);
//        shelfElementsResourceByGroupAssertion();
//
//      });
//
//      describe('not displayed after being selected', function(){
//
//        it('displayName is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  displayName: ',
//            '   '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,3);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['displayName'];
//            return noShelfElementsAssertion(list,shelfGetElementsResourceLevel(),list2);
//          });
//        });
//
//        it('get is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  get: ',
//            '   '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,3);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['get'];
//            return noShelfElementsAssertion(list,shelfGetElementsResourceLevel(),list2);
//          });
//        });
//
//        it('post is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  post: ',
//            '   '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,3);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['post'];
//            return noShelfElementsAssertion(list,shelfGetElementsResourceLevel(),list2);
//          });
//        });
//
//        it('put is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  put: ',
//            '   '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,3);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['put'];
//            return noShelfElementsAssertion(list,shelfGetElementsResourceLevel(),list2);
//          });
//        });
//
//        it('delete is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  delete: ',
//            '   '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,3);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['delete'];
//            return noShelfElementsAssertion(list,shelfGetElementsResourceLevel(),list2);
//          });
//        });
//
//        it('head is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  head: ',
//            '   '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,3);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['head'];
//            return noShelfElementsAssertion(list,shelfGetElementsResourceLevel(),list2);
//          });
//        });
//
//        it('patch is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  patch: ',
//            '   '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,3);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['patch'];
//            return noShelfElementsAssertion(list,shelfGetElementsResourceLevel(),list2);
//          });
//        });
//
//        it('options is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  options: ',
//            '   '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,3);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['options'];
//            return noShelfElementsAssertion(list,shelfGetElementsResourceLevel(),list2);
//          });
//        });
//
//        it('uriParameters is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  uriParameters: ',
//            '   '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,3);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['uriParameters'];
//            return noShelfElementsAssertion(list,shelfGetElementsResourceLevel(),list2);
//          });
//        });
//
//        it('baseUriParameters is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  baseUriParameters: ',
//            '   '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,3);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['baseUriParameters'];
//            return noShelfElementsAssertion(list,shelfGetElementsResourceLevel(),list2);
//          });
//        });
//
//        it('securedBy is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  securedBy: ',
//            '   '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,3);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['securedBy'];
//            return noShelfElementsAssertion(list,shelfGetElementsResourceLevel(),list2);
//          });
//        });
//
//        it('IS is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  is: ',
//            '   '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,3);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['is'];
//            return noShelfElementsAssertion(list,shelfGetElementsResourceLevel(),list2);
//          });
//        });
//
//        it('type is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  type: ',
//            '   '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,3);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['type'];
//            return noShelfElementsAssertion(list,shelfGetElementsResourceLevel(),list2);
//          });
//        });
//
//      }); //not displayed after being selected
//
//    });// resource level

//    describe('methods', function(){

//      it('get - check section', function(){
//        var definition = [
//          '#%RAML 0.8',
//          'title: My api',
//          '/res:',
//          '  get:',
//          '     '
//        ].join('\\n');
//        editorSetValue(definition);
//        editorSetCursor(5,5);
//        shelfElementsMethodsByGroupAssertion();
//      });
//
//      describe('get Method level - not displayed after being selected', function(){
//
//        it('protocols is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  get: ',
//            '    protocols: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['protocols'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('description is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  get: ',
//            '    description: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['description'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('baseUriParameters is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  get: ',
//            '    baseUriParameters: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['baseUriParameters'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('headers is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  get: ',
//            '    headers: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['headers'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('queryParameters is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  get: ',
//            '    queryParameters: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['queryParameters'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('responses is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  get: ',
//            '    responses: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['responses'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('securedBy is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  get: ',
//            '    securedBy: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['securedBy'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('IS is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  get: ',
//            '    is: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['is'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('body is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  get: ',
//            '    body: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['body'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//      }); // not displayed after being selected

//      it('post - check section', function(){
//        var definition = [
//          '#%RAML 0.8',
//          'title: My api',
//          '/res:',
//          '  post:',
//          '      '
//        ].join('\\n');
//        editorSetValue(definition);
//        editorSetCursor(5,5);
//        shelfElementsMethodsByGroupAssertion();
//      });
//      describe('post Method level - not displayed after being selected', function(){
//
//        it('protocols is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  post: ',
//            '    protocols: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['protocols'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('description is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  post: ',
//            '    description: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['description'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('baseUriParameters is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  post: ',
//            '    baseUriParameters: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['baseUriParameters'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('headers is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  post: ',
//            '    headers: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['headers'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('queryParameters is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  post: ',
//            '    queryParameters: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['queryParameters'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('responses is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  post: ',
//            '    responses: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['responses'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('securedBy is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  post: ',
//            '    securedBy: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['securedBy'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('IS is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  post: ',
//            '    is: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['is'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('body is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  post: ',
//            '    body: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['body'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//      }); // not displayed after being selected

//      it('put - check section', function(){
//        var definition = [
//          '#%RAML 0.8',
//          'title: My api',
//          '/res:',
//          '  put:',
//          '     '
//        ].join('\\n');
//        editorSetValue(definition);
//        editorSetCursor(5,5);
//        shelfElementsMethodsByGroupAssertion();
//      });
//
//      describe('put Method level - not displayed after being selected', function(){
//
//        it('protocols is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  put: ',
//            '    protocols: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['protocols'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('description is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  put: ',
//            '    description: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['description'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('baseUriParameters is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  put: ',
//            '    baseUriParameters: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['baseUriParameters'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('headers is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  put: ',
//            '    headers: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['headers'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('queryParameters is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  put: ',
//            '    queryParameters: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['queryParameters'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('responses is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  put: ',
//            '    responses: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['responses'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('securedBy is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  put: ',
//            '    securedBy: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['securedBy'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('IS is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  put: ',
//            '    is: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['is'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('body is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  put: ',
//            '    body: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['body'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//      }); // not displayed after being selected


//      it('delete - check section', function(){
//        var definition = [
//          '#%RAML 0.8',
//          'title: My api',
//          '/res:',
//          '  delete:',
//          '     '
//        ].join('\\n');
//        editorSetValue(definition);
//        editorSetCursor(5,5);
//        shelfElementsMethodsByGroupAssertion();
//      });
//
//      describe('delete Method level - not displayed after being selected', function(){
//
//        it('protocols is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  delete: ',
//            '    protocols: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['protocols'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('description is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  delete: ',
//            '    description: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['description'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('baseUriParameters is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  delete: ',
//            '    baseUriParameters: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['baseUriParameters'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('headers is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  delete: ',
//            '    headers: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['headers'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('queryParameters is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  delete: ',
//            '    queryParameters: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['queryParameters'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('responses is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  delete: ',
//            '    responses: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['responses'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('securedBy is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  delete: ',
//            '    securedBy: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['securedBy'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('IS is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  delete: ',
//            '    is: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['is'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('body is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  delete: ',
//            '    body: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['body'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//      }); // not displayed after being selected

//      it('head - check section', function(){
//        var definition = [
//          '#%RAML 0.8',
//          'title: My api',
//          '/res:',
//          '  head:',
//          '     '
//        ].join('\\n');
//        editorSetValue(definition);
//        editorSetCursor(5,5);
//        shelfElementsMethodsByGroupAssertion();
//      });
//
//      describe('head Method level - not displayed after being selected', function(){
//
//        it('protocols is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  head: ',
//            '    protocols: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['protocols'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('description is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  head: ',
//            '    description: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['description'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('baseUriParameters is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  head: ',
//            '    baseUriParameters: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['baseUriParameters'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('headers is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  head: ',
//            '    headers: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['headers'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('queryParameters is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  head: ',
//            '    queryParameters: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['queryParameters'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('responses is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  head: ',
//            '    responses: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['responses'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('securedBy is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  head: ',
//            '    securedBy: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['securedBy'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('IS is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  head: ',
//            '    is: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['is'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('body is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  head: ',
//            '    body: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['body'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//      }); // not displayed after being selected


//      it('patch - check section', function(){
//        var definition = [
//          '#%RAML 0.8',
//          'title: My api',
//          '/res:',
//          '  patch:',
//          '     '
//        ].join('\\n');
//        editorSetValue(definition);
//        editorSetCursor(5,5);
//        shelfElementsMethodsByGroupAssertion();
//      });
//
//      describe('patch Method level - not displayed after being selected', function(){
//
//        it('protocols is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  patch: ',
//            '    protocols: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['protocols'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('description is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  patch: ',
//            '    description: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['description'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('baseUriParameters is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  patch: ',
//            '    baseUriParameters: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['baseUriParameters'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('headers is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  patch: ',
//            '    headers: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['headers'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('queryParameters is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  patch: ',
//            '    queryParameters: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['queryParameters'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('responses is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  patch: ',
//            '    responses: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['responses'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('securedBy is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  patch: ',
//            '    securedBy: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['securedBy'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('IS is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  patch: ',
//            '    is: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['is'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('body is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  patch: ',
//            '    body: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['body'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//      }); // not displayed after being selected


//      it('options - check section', function(){
//        var definition = [
//          '#%RAML 0.8',
//          'title: My api',
//          '/res:',
//          '  options:',
//          '     '
//        ].join('\\n');
//        editorSetValue(definition);
//        editorSetCursor(5,5);
//        shelfElementsMethodsByGroupAssertion();
//      });
//
//      describe('options Method level - not displayed after being selected', function(){
//
//        it('protocols is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  options: ',
//            '    protocols: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['protocols'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('description is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  options: ',
//            '    description: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['description'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('baseUriParameters is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  options: ',
//            '    baseUriParameters: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['baseUriParameters'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('headers is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  options: ',
//            '    headers: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['headers'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('queryParameters is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  options: ',
//            '    queryParameters: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['queryParameters'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('responses is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  options: ',
//            '    responses: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['responses'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('securedBy is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  options: ',
//            '    securedBy: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['securedBy'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('IS is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  options: ',
//            '    is: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['is'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//        it('body is no longer displayed on the shelf', function(){
//          var definition = [
//            '#%RAML 0.8',
//            'title: My api',
//            '/res:',
//            '  options: ',
//            '    body: ',
//            '       '
//          ].join('\\n');
//          editorSetValue(definition);
//          editorSetCursor(5,5);
//          shelfGetElementsFromShelf().then(function(list){
//            var list2 =['body'];
//            return noShelfElementsAssertion(list,shelfGetElemMethodLevel(),list2);
//          });
//        });
//
//      }); // not displayed after being selected


//    }); // method

//  });//verify shelf elements

});//RAMLeditor - Parser errors validation