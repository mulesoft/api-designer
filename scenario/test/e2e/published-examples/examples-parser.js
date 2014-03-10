'use strict';
var AssertsHelper = require ('../../lib/asserts-helper.js').AssertsHelper;
var EditorHelper = require ('../../lib/editor-helper.js').EditorHelper;
var ShelfHelper = require('../../lib/shelf-helper.js').ShelfHelper;
var ConsoleHelper = require('../../lib/console-helper.js').ConsoleHelper;
describe('parser ',function(){
  var designerAsserts= new AssertsHelper();
  var editor= new EditorHelper();
  var shelf = new ShelfHelper();
  var consoleDesigner = new ConsoleHelper();

  beforeEach(function(){
    editor.setValue('');
    expect(editor.getLine(1)).toEqual('');
    designerAsserts.shelfElements(shelf.elemRamlVersion);
    expect(editor.IsParserErrorDisplayed()).toBe(false);
  });

  describe('api hub', function(){

    it('stripe-api',function(){
      editor.setLine(1,'#%RAML 0.8\\n        ');
      designerAsserts.parserError('1','empty document');
      editor.setLine(2,'!include http://api-portal.anypoint.mulesoft.com/stripe/api/stripe-api/stripe-api.raml');
      browser.wait(function(){
        return browser.$(consoleDesigner.titleCss).getText().then(function(text){
          return text === 'Stripe REST API';
        });
      }).then(
          designerAsserts.consoleApiTitle('Stripe REST API')
        );
    });

    it('twitter-api',function(){
      editor.setLine(1,'#%RAML 0.8\\n        ');
      designerAsserts.parserError('1','empty document');
      editor.setLine(2,'!include http://api-portal.anypoint.mulesoft.com/twitter/api/twitter-rest-api/twitter-rest-api.raml');
      browser.wait(function(){
        return browser.$(consoleDesigner.titleCss).getText().then(function(text){
          return text === 'Twitter API';
        });
      }).then(
          designerAsserts.consoleApiTitle('Twitter API')
        );
    });

    it('Twilio-api',function(){
      editor.setLine(1,'#%RAML 0.8\\n        ');
      designerAsserts.parserError('1','empty document');
      editor.setLine(2,'!include http://api-portal.anypoint.mulesoft.com/twilio/api/twilio-rest-api/twilio-rest-api.raml');
      browser.wait(function(){
        return browser.$(consoleDesigner.titleCss).getText().then(function(text){
          return text === 'Twilio API';
        });
      }).then(
          designerAsserts.consoleApiTitle('Twilio API')
        );
    });

    it('Box-api',function(){
      editor.setLine(1,'#%RAML 0.8\\n        ');
      designerAsserts.parserError('1','empty document');
      editor.setLine(2,'!include http://api-portal.anypoint.mulesoft.com/box/api/box-api/box-api.raml');
      browser.wait(function(){
        return browser.$(consoleDesigner.titleCss).getText().then(function(text){
          return text === 'Box.com API';
        });
      }).then(
          designerAsserts.consoleApiTitle('Box.com API')
        );
    });

    it('Instagram-api',function(){
      editor.setLine(1,'#%RAML 0.8\\n        ');
      designerAsserts.parserError('1','empty document');
      editor.setLine(2,'!include http://api-portal.anypoint.mulesoft.com/instagram/api/instagram-api/instagram-api.raml');
      browser.wait(function(){
        return browser.$(consoleDesigner.titleCss).getText().then(function(text){
          return text === 'Instagram API';
        });
      }).then(
          designerAsserts.consoleApiTitle('Instagram API')
        );
    });

    xit('bitly-api',function(){
      editor.setLine(1,'#%RAML 0.8\\n        ');
      designerAsserts.parserError('1','empty document');
      editor.setLine(2,'!include http://www.apihub.com/bitly/api/bitly-api/bitly-api.raml');
      browser.wait(function(){
        return browser.$(consoleDesigner.titleCss).getText().then(function(text){
          return text === 'bit.ly API';
        });
      }).then(
          designerAsserts.consoleApiTitle('bit.ly API')
        );
    });

    it('GitHub-api',function(){
      editor.setLine(1,'#%RAML 0.8\\n        ');
      designerAsserts.parserError('1','empty document');
      editor.setLine(2,'!include http://api-portal.anypoint.mulesoft.com/github/api/github-api-v3/github-api-v3.raml');
      browser.wait(function(){
        return browser.$(consoleDesigner.titleCss).getText().then(function(text){
          return text === 'GitHub API';
        });
      }).then(
          designerAsserts.consoleApiTitle('GitHub API')
        );
    });
  }); //api hub
}); //parser
