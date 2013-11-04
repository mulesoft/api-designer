'use strict';
var expect = require('expect.js');
var ramlUrl = require('../config').url;

describe('editor-console',function(){

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

  describe('console',function(){

    it('should succeed: h1 should be APIdesigner', function(){
      browser.$('h1').getText().then(function(text){
        expect(text).eql('API Designer');
      });
    });

    it('should succeed: title displayed on console', function(){
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: mi api',
        '/res:'
      ].join('\\n');
      editorSetValue(definition);
      browser.wait(function(){
        return browser.$(consoleGetTitleElement()).getText().then(function(text){
          return text === 'mi api';
        });
      }).then(function(){
        browser.$(consoleGetTitleElement()).getText().then(function(text){
          expect(text).to.eql('mi api');
        });
      });
    });

    describe('resources', function(){

      it('should succeed: resource 1', function(){
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: mi api',
          '/res:'
        ].join('\\n');
        editorSetValue(definition);
        browser.wait(function(){
          return browser.$(consoleGetTitleElement()).getText().then(function(text){
            return text === 'mi api';
          });
        }).then(function(){
          browser.findElements(by.css(consoleGetListResourcesNameElement())).then(function(list){
            expect(list.length).to.eql(1);
            list[0].getText().then(function(text){
              expect(text).to.eql('/res');
            });
          });
        });
      });

      it('should succeed: 2 resources', function(){
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: mi api',
          '/res1:',
          '/res2:'
        ].join('\\n');
        editorSetValue(definition);
        browser.wait(function(){
          return browser.$(consoleGetTitleElement()).getText().then(function(text){
            return text === 'mi api';
          });
        }).then(function(){
          browser.findElements(by.css(consoleGetListResourcesNameElement())).then(function(list){
            expect(list.length).to.eql(2);
            list[0].getText().then(function(text){
              expect(text).to.eql('/res1');
            });
            list[1].getText().then(function(text){
              expect(text).to.eql('/res2');
            });
          });
        });
      });

      it('should succeed: resource 1 - displayName', function(){
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: mi api',
          '/res:',
          '  displayName: resour 1'
        ].join('\\n');
        editorSetValue(definition);
        browser.wait(function(){
          return browser.$(consoleGetTitleElement()).getText().then(function(text){
            return text === 'mi api';
          });
        }).then(function(){
          browser.$('[role=\'resourceSummary\'] li[ng-show=\'resource.name\']').getText().then(function(text){
            expect(text).to.eql('"resour 1"');
          });
        });
      });

      describe('is', function(){

        it('should succeed: resource - 1 trait by name', function(){
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: mi api',
            'traits:',
            '  - secured:',
            '      description: this is a trait',
            '/res:',
            ' is: [secured]'
          ].join('\\n');
          editorSetValue(definition);
          browser.wait(function(){
            return browser.$(consoleGetTitleElement()).getText().then(function(text){
              return text === 'mi api';
            });
          }).then(function(){
            browser.$('[role=\'resourceSummary\'] [role=\'traits\'] li').getText().then(function(text){
              expect(text).to.eql('secured');
            });
          });
        });

        it('Failed - resource: 1 trait with parameters', function(){
          var definition = [
            '#%RAML 0.8',
            '---',
            'title: mi api',
            'traits:',
            '  - secured:',
            '      description: this is a trait',
            '/res:',
            ' is: [secured]'
          ].join('\\n');
          editorSetValue(definition);
          browser.wait(function(){
            return browser.$(consoleGetTitleElement()).getText().then(function(text){
              return text === 'mi api';
            });
          }).then(function(){
            browser.$('[role=\'resourceSummary\'] [role=\'traits\'] li').getText().then(function(text){
              expect(text).to.eql('secured');
            });
          });
        });

        xit('Not implemented - resource: 1 trait by displayName', function(){

        });

      }); // is

      describe('methods', function(){

        describe('get', function(){

          describe('uriParameters',function(){

            it('should succed: uriParameter - Named',function(){
              var definition = [
                '#%RAML 0.8',
                '---',
                'title: mi api',
                'traits:',
                '  - secured:',
                '      description: this is a trait',
                '/res:',
                ' is: [secured]'
              ].join('\\n');
              editorSetValue(definition);
              browser.wait(function(){
                return browser.$(consoleGetTitleElement()).getText().then(function(text){
                  return text === 'mi api';
                });
              }).then(function(){
                browser.$('[role=\'resourceSummary\'] [role=\'traits\'] li').getText().then(function(text){
                  expect(text).to.eql('secured');
                });
              });
            });

          }); //uriParameters

        }); //get
      }); // methods

    }); // resources

  }); //console
  
  
});//RAMLeditor - Console verification