'use strict';
exports.config = {

  seleniumPort: 4444,

  allScriptsTimeout: 120000,

  capabilities: {
    'browserName': 'chrome'
  },

  specs: [
    '../test/e2e/raml-example/muse-e2e.js',
    '../test/lib/*.js'
  ],

  baseUrl: 'http://localhost:9013/',

  onPrepare: function() {
    browser.get('');
    element(by.css('button.btn.btn-primary')).click();
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
    defaultTimeoutInterval: 120000,
    isVerbose: false,
    includeStackTrace: true
  }
};
