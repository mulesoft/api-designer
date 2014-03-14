'use strict';
exports.config = {

  seleniumPort: 4444,

  allScriptsTimeout: 90000,

  capabilities: {
    'browserName': 'firefox'
  },

  specs: [
    '../test/e2e/raml-example/muse-e2e.js',
    '../test/lib/*.js'
  ],

  baseUrl: 'http://localhost:9013/',

  onPrepare: function() {
    browser.get('');
    browser.driver.switchTo().alert().accept();
    browser.executeScript(function () {
      localStorage['config.updateResponsivenessInterval'] = 1;
      window.onbeforeunload = null;
    });

    browser.wait(function(){
      return browser.executeScript('return (editor.getLine(1) === \'title:\');');
    });
  },

  framework: 'jasmine',

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 90000,
    isVerbose: false,
    includeStackTrace: true
  }
};
