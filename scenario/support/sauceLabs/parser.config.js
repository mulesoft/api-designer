'use strict';
exports.config = {

  sauceUser: process.env.SAUCE_USER,
  sauceKey: process.env.SAUCE_KEY,

  capabilities: {
    'browserName': process.env.BROWSER,
    'name': 'API-Portal-parser'
  },

  specs: [
    '../../test/e2e/editor-parser/*.js',
    '../../test/e2e/editor-parser/resource/*.js',
    '../../test/e2e/editor-parser/resourceTypes/*.js',
    '../../test/lib/*.js'
  ],

  baseUrl: process.env.BASE_URL,

  onPrepare: function() {
    browser.get('');
    browser.executeScript(function () {
      localStorage['config.updateResponsivenessInterval'] = 1;
      window.onbeforeunload = null;
    });

    browser.wait(function(){
      return browser.executeScript('return (editor.getLine(1) === \'title:\');');
    });
  },

  jasmineNodeOpts: {
    onComplete: null,
    isVerbose: false,
    showColors: false,
    includeStackTrace: false,
    defaultTimeoutInterval: 80000
  }
};