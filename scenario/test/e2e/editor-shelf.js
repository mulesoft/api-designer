'use strict';
var expect = require('expect.js');
var ramlUrl = require('../config').url;

describe('editor-shelf',function(){

  beforeEach(function () {
    browser.get(ramlUrl);
    browser.executeScript(function () {
      localStorage['config.updateResponsivenessInterval'] = 1;
      window.onbeforeunload = null;
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
      it('root section by group', function(){
        var definition = [
          '#%RAML 0.8',
          ''
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(2,1);
        shelfElementsRootByGroupAssertion();
      });

      describe('Not displayed after select', function(){

        it('title is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'title: ',
            ' '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(3,1);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['title'];
            return noShelfElementsAssertion(list,shelfGetElementsRootLevel(),list2);
          });
        });


        it('varsion is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'version: ',
            ' '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(3,1);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['version'];
            return noShelfElementsAssertion(list,shelfGetElementsRootLevel(),list2);
          });
        });

        it('varsion is no longer displayed on the shelf', function(){
          var definition = [
            '#%RAML 0.8',
            'schemas: ',
            ' '
          ].join('\\n');
          editorSetValue(definition);
          editorSetCursor(3,1);
          shelfGetElementsFromShelf().then(function(list){
            var list2 =['schemas'];
            return noShelfElementsAssertion(list,shelfGetElementsRootLevel(),list2);
          });
        });

      }); // Not displayed after select

    }); // root section

    describe('resource level', function(){

      it('resource shelf elements by group', function(){
        var definition = [
          '#%RAML 0.8',
          'title: My api',
          '/res:',
          '   '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(4,3);
        shelfElementsResourceByGroupAssertion();

      });

    });// resource level

    describe('methods', function(){

      it('get - check section', function(){
        var definition = [
          '#%RAML 0.8',
          'title: My api',
          '/res:',
          '  get:',
          '     '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(5,7);
        shelfElementsMethodsByGroupAssertion();
      });

      it('post - check section', function(){
        var definition = [
          '#%RAML 0.8',
          'title: My api',
          '/res:',
          '  post:',
          '     '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(5,7);
        shelfElementsMethodsByGroupAssertion();
      });

      it('put - check section', function(){
        var definition = [
          '#%RAML 0.8',
          'title: My api',
          '/res:',
          '  put:',
          '     '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(5,7);
        shelfElementsMethodsByGroupAssertion();
      });

      it('delete - check section', function(){
        var definition = [
          '#%RAML 0.8',
          'title: My api',
          '/res:',
          '  delete:',
          '     '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(5,7);
        shelfElementsMethodsByGroupAssertion();
      });

      it('head - check section', function(){
        var definition = [
          '#%RAML 0.8',
          'title: My api',
          '/res:',
          '  head:',
          '     '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(5,7);
        shelfElementsMethodsByGroupAssertion();
      });

      it('patch - check section', function(){
        var definition = [
          '#%RAML 0.8',
          'title: My api',
          '/res:',
          '  patch:',
          '     '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(5,7);
        shelfElementsMethodsByGroupAssertion();
      });

      it('options - check section', function(){
        var definition = [
          '#%RAML 0.8',
          'title: My api',
          '/res:',
          '  options:',
          '     '
        ].join('\\n');
        editorSetValue(definition);
        editorSetCursor(5,7);
        shelfElementsMethodsByGroupAssertion();
      });

    }); // method

  });//verify shelf elements

});//RAMLeditor - Parser errors validation
