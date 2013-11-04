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

  describe('Verify Shelf elements',function(){

    describe('RAML version', function(){

      it('should offer RAML version on line 1', function(){
        var definition = '';
        editorSetValue(definition);
        shelfGetElementsFromShelf().then(function(list){
          expect(list.length).to.eql(1);
          list[0].getText().then(function(text){
            expect(text).to.eql('#%RAML 0.8');
          });
        });
      });

      xit('should not be offer RAML version - line 1 - fail RT-363', function(){
        var definition = '#%RAML 0.8';
        editorSetValue(definition);
        shelfGetElementsFromShelf().then(function(list){
          expect(list.length).to.eql(0);
        });
      });

    }); //RAML version

    describe('root section', function(){
      it('options offer root level empty document - including raml version', function(){
        var definition = [
          '#%RAML 0.8',
          ''
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(2,1);
        shelfGetElementsFromShelf().then(function(list){
          shelfElementsAssertion(list, shelfGetElementsRootLevel());
        });
      });

      describe('by groups', function(){

        it('ROOT group elements', function (){
          var definition = [
            '#%RAML 0.8',
            ''
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(2,1);
          shelfGetElementsFromShelfByGroup('root').then(function(list){
            shelfElementsAssertion(list, shelfGetElementsRootLevelRoot());
          });
        });

        xit('Root label and number of items validation - In progress', function(){
          var definition = [
            '#%RAML 0.8',
            ''
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(2,1);
        });

        it('DOCS group elements', function(){
          var definition = [
            '#%RAML 0.8',
            ''
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(2,1);
          shelfGetElementsFromShelfByGroup('docs').then(function(list){
            shelfElementsAssertion(list, shelfGetElementsRootLevelDocs());
          });
        });

        it('PARAMETERS group elements', function(){
          var definition = [
            '#%RAML 0.8',
            ''
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(2,1);
          shelfGetElementsFromShelfByGroup('parameters').then(function(list){
            shelfElementsAssertion(list, shelfGetElementsRootLevelParameters());
          });
        });

        it('SECURITY group elements', function (){
          var definition = [
            '#%RAML 0.8',
            ''
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(2,1);
          shelfGetElementsFromShelfByGroup('security').then(function(list){
            shelfElementsAssertion(list, shelfGetElementsRootLevelSecurity());
          });
        });

        it('RESOURCES group elements', function (){
          var definition = [
            '#%RAML 0.8',
            ''
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(2,1);
          shelfGetElementsFromShelfByGroup('resources').then(function(list){
            shelfElementsAssertion(list, shelfGetElementsRootLevelResources());
          });
        });

        it('TRAITS AND TYPES group elements', function (){
          var definition = [
            '#%RAML 0.8',
            ''
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(2,1);
          shelfGetElementsFromShelfByGroup('traits-and-types').then(function(list){
            shelfElementsAssertion(list, shelfGetElementsRootLevelTraitsAndTypes());
          });
        });

      });//by groups

    }); // root section

    describe('resource level', function(){

      it('resource level - offer valid options on the shelf', function(){
        var definition = [
          '#%RAML 0.8',
          'title: My api',
          '/res:',
          '   '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(4,3);
        shelfGetElementsFromShelf().then(function(list){
          shelfElementsAssertion(list, shelfGetElementsResourceLevel());
        });
      });
    });

    describe('by groups', function(){



    });

    describe('methods', function(){

    });



  }); //verify shelf elements

});//RAMLeditor - Parser errors validation