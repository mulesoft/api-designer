'use strict';
var EditorHelper = require ('../lib/editor-helper.js').EditorHelper;
var ConsoleHelper = require ('../lib/console-helper.js').ConsoleHelper;
describe('editor-console',function(){
  var editor= new EditorHelper();
  var consoleDesigner= new ConsoleHelper();

  describe('console',function(){

    it('should succeed: h1 should be APIdesigner', function(){
      browser.$('h1').getText().then(function(text){
        expect(text).toEqual('API Designer');
      });
    });

    it('should succeed: title displayed on console', function(){
      var definition = [
        '#%RAML 0.8',
        '---',
        'title: mi api',
        '/res:'
      ].join('\\n');
      editor.setValue(definition);
      browser.wait(function(){
        return browser.$(consoleDesigner.titleCss).getText().then(function(text){
          return text === 'mi api';
        });
      }).then(function(){
        browser.$(consoleDesigner.titleCss).getText().then(function(text){
          expect(text).toEqual('mi api');
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
        editor.setValue(definition);
        browser.wait(function(){
          return browser.$(consoleDesigner.titleCss).getText().then(function(text){
            return text === 'mi api';
          });
        }).then(function(){
          browser.findElements(by.css(consoleDesigner.listResourcesNameCss)).then(function(list){
            expect(list.length).toEqual(1);
            list[0].getText().then(function(text){
              expect(text).toEqual('/res');
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
        editor.setValue(definition);
        browser.wait(function(){
          return browser.$(consoleDesigner.titleCss).getText().then(function(text){
            return text === 'mi api';
          });
        }).then(function(){
          browser.findElements(by.css(consoleDesigner.listResourcesNameCss)).then(function(list){
            expect(list.length).toEqual(2);
            list[0].getText().then(function(text){
              expect(text).toEqual('/res1');
            });
            list[1].getText().then(function(text){
              expect(text).toEqual('/res2');
            });
          });
        });
      });

      xit('should succeed: resource 1 - displayName', function(){
        var definition = [
          '#%RAML 0.8',
          '---',
          'title: mi api',
          '/res:',
          '  displayName: resour 1'
        ].join('\\n');
        editor.setValue(definition);
        browser.wait(function(){
          return browser.$(consoleDesigner.titleCss).getText().then(function(text){
            return text === 'mi api';
          });
        }).then(function(){
          browser.$('[role=\'resourceSummary\'] li[ng-show=\'resource.name\']').getText().then(function(text){
            expect(text).toEqual('"resour 1"');
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
          editor.setValue(definition);
          browser.wait(function(){
            return browser.$(consoleDesigner.titleCss).getText().then(function(text){
              return text === 'mi api';
            });
          }).then(function(){
            browser.$('[role=\'resourceSummary\'] [role=\'traits\'] li').getText().then(function(text){
              expect(text).toEqual('secured');
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
          editor.setValue(definition);
          browser.wait(function(){
            return browser.$(consoleDesigner.titleCss).getText().then(function(text){
              return text === 'mi api';
            });
          }).then(function(){
            browser.$('[role=\'resourceSummary\'] [role=\'traits\'] li').getText().then(function(text){
              expect(text).toEqual('secured');
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
              editor.setValue(definition);
              browser.wait(function(){
                return browser.$(consoleDesigner.titleCss).getText().then(function(text){
                  return text === 'mi api';
                });
              }).then(function(){
                browser.$('[role=\'resourceSummary\'] [role=\'traits\'] li').getText().then(function(text){
                  expect(text).toEqual('secured');
                });
              });
            });

          }); //uriParameters

        }); //get
      }); // methods

    }); // resources

  }); //console


});//RAMLeditor - Console verification
