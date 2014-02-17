'use strict';
exports.config = {

  capabilities: {
    'browserName': 'chrome',
    // firefox, safari
    name: 'API-portal- Regression'
  },

  allScriptsTimeout: 50000,

  specs: [
    '../test/e2e/file-browser.js',
    '../test/e2e/editor-shelf/resource/resource-methods.js',
    '../test/e2e/editor-shelf/resource/resource-root.js',
    '../test/e2e/editor-shelf/resource-types/rt-methods.js',
    '../test/e2e/editor-shelf/resource-types/rt-root.js',
    '../test/e2e/editor-shelf/protocols.js',
    '../test/e2e/editor-shelf/root.js',
    '../test/e2e/editor-shelf/traits.js',
    '../test/e2e/editor-shelf/shelf-regressions.js',
    '../test/e2e/RT-method-optionals.js',
    '../test/e2e/RT-root-optionals.js',
    '../test/e2e/traits-optionals.js',
    '../test/e2e/editor-parser/parser-regressions.js',
    '../test/e2e/editor-parser/parser-root.js',
    '../test/e2e/editor-parser/parser-traits.js',
    '../test/e2e/editor-parser/resourceTypes/*.js',
    '../test/e2e/raml-example/muse-e2e.js',
    '../test/e2e/published-examples/examples-parser.js',
    '../test/e2e/console/console-defaultview.js',
    '../test/e2e/console/embedded-console.js',
    '../test/lib/*.js'
  ],

  baseUrl: process.env.BASE_URL,

  onPrepare: function() {
    browser.get('');
    browser.sleep(2000);
    var alertDialog = browser.driver.switchTo().alert();
    alertDialog.sendKeys('example.raml');
    alertDialog.accept();
    browser.executeScript(function () {
      localStorage['config.updateResponsivenessInterval'] = 0;
      window.onbeforeunload = null;
    });
  },

  jasmineNodeOpts: {
    onComplete: null,
    isVerbose: false,
    showColors: true,
    includeStackTrace: false,
    defaultTimeoutInterval: 15000
  }
};
