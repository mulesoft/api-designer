'use strict';

var expect = require('expect.js');
var protractor = require('protractor');
var EditorHelper = require('../lib/editor-helper.js').EditorHelper;
var ramlUrl = require('../config').url;
var ShelfHelper = require ('../lib/shelf-helper.js').ShelfHelper;
var AssertsHelper = require('../lib/asserts-helper.js').AssertsHelper;



describe('RAMLeditor - Autocomplete / Shelf / Highlight',function(){
  this.timeout(80000);
  var driver, ptor, editorHelper, shelfHelper, assertsHelper;

  before(function () {
    ptor = this.ptor;
    driver = ptor.driver;
    ptor.driver.manage().timeouts().setScriptTimeout(80000);
    editorHelper = new EditorHelper(ptor, driver);
    shelfHelper = new ShelfHelper(ptor, driver);
    assertsHelper = new AssertsHelper(ptor,driver);
  });

  beforeEach(function () {
    ptor.get(ramlUrl);
    ptor.executeScript(function () {
      localStorage['config.updateResponsivenessInterval'] = 1;
    });
    ptor.wait(function(){
      return editorHelper.getLine(2).then(function(text) {
        return text === 'title:';
      });
    });
  });


  describe('Verify Shelf elements',function(){

    describe('RAML version', function(){

      it('should offer RAML version on line 1', function(done){
        var definition = '';
        editorHelper.setValue(definition);
        ptor.waitForAngular();
        shelfHelper.getElementsFromShelf().then(function(list){
          expect(list.length).to.eql(1);
          list[0].getText().then(function(text){
            expect(text).to.eql('#%RAML 0.8');
            done();
          });
        });
      });

      it.skip('should not be offer RAML version - line 1 - fail RT-363', function(done){
        var definition = '#%RAML 0.8';
        editorHelper.setValue(definition);
        ptor.waitForAngular();
        shelfHelper.getElementsFromShelf().then(function(list){
          expect(list.length).to.eql(0);
          done();
        });
      });

    }); //RAML version

    describe('root section', function(){
      it('options offer root level empty document - including raml version', function(done){
        var definition = [
          '#%RAML 0.8',
          ''
        ].join('\\n');
        editorHelper.setValue(definition);
        editorHelper.setCursor(2,1);
        shelfHelper.getElementsFromShelf().then(function(list){
          assertsHelper.shelfElementsAssertion(list, shelfHelper.getElementsRootLevel(), done);
        });
      });

      it('ROOT group elements', function (done){
        var definition = [
          '#%RAML 0.8',
          ''
        ].join('\\n');
        editorHelper.setValue(definition);
        editorHelper.setCursor(2,1);
        shelfHelper.getElementsFromShelfByGroup('root').then(function(list){
          assertsHelper.shelfElementsAssertion(list, shelfHelper.getElementsRootLevelRoot(), done);
        });
      });

      it.skip('Root label and number of items validation - In progress', function(done){
        var definition = [
          '#%RAML 0.8',
          ''
        ].join('\\n');
        editorHelper.setValue(definition);
        editorHelper.setCursor(2,1);
        done();

      });

      it('DOCS group elements', function (done){
        var definition = [
          '#%RAML 0.8',
          ''
        ].join('\\n');
        editorHelper.setValue(definition);
        editorHelper.setCursor(2,1);
        shelfHelper.getElementsFromShelfByGroup('docs').then(function(list){
          var expList= [
            'documentation'
          ];
          return assertsHelper.shelfElementsAssertion(list, expList, done);
        });
      });

      it('PARAMETERS group elements', function (done){
        var definition = [
          '#%RAML 0.8',
          ''
        ].join('\\n');
        editorHelper.setValue(definition);
        editorHelper.setCursor(2,1);
        shelfHelper.getElementsFromShelfByGroup('parameters').then(function(list){
          var expList= [
            'baseUriParameters'
          ];
          return assertsHelper.shelfElementsAssertion(list, expList, done);
        });
      });

      it('SECURITY group elements', function (done){
        var definition = [
          '#%RAML 0.8',
          ''
        ].join('\\n');
        editorHelper.setValue(definition);
        editorHelper.setCursor(2,1);
        shelfHelper.getElementsFromShelfByGroup('security').then(function(list){
          var expList= [
            'securitySchemes',
            'securedBy'
          ];
          return assertsHelper.shelfElementsAssertion(list, expList, done);
        });
      });

      it('RESOURCES group elements', function (done){
        var definition = [
          '#%RAML 0.8',
          ''
        ].join('\\n');
        editorHelper.setValue(definition);
        editorHelper.setCursor(2,1);
        shelfHelper.getElementsFromShelfByGroup('resources').then(function(list){
          var expList= [
            'New resource'
          ];
          return assertsHelper.shelfElementsAssertion(list, expList, done);
        });
      });

      it('TRAITS AND TYPES group elements', function (done){
        var definition = [
          '#%RAML 0.8',
          ''
        ].join('\\n');
        editorHelper.setValue(definition);
        editorHelper.setCursor(2,1);
        shelfHelper.getElementsFromShelfByGroup('traits-and-types').then(function(list){
          var expList= [
            'traits',
            'resourceTypes'
          ];
          return assertsHelper.shelfElementsAssertion(list, expList, done);
        });
      });

    }); // root section

    describe('resource level', function(){

      it('resource level - offer valid options on the shelf', function(done){
        var definition = [
          '#%RAML 0.8',
          'title: My api',
          '/res:',
          '   '
        ].join('\\n');
        editorHelper.setValue(definition);
        editorHelper.setCursor(4,3);
        shelfHelper.getElementsFromShelf().then(function(list){
          return assertsHelper.shelfElementsAssertion(list, shelfHelper.getElementsResourceLevel(), done);
        });
      });
    });


  }); //verify shelf elements

});//RAMLeditor - Parser errors validation