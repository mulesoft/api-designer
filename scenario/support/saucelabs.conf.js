'use strict';
require('jasmine-reporters');
jasmine.getEnv().addReporter(
  new jasmine.JUnitXmlReporter('scenario/reports/', true, true));
exports.config = {

  sauceUser: process.env.SAUCE_USER,
  sauceKey: process.env.SAUCE_KEY,

  capabilities: {
    'browserName': process.env.BROWSER
  },

  specs: [
//    '../test/e2e/editor-shelf/resource/resource-methods.js',
//    '../test/e2e/editor-shelf/resource/resource-root.js',
//    '../test/e2e/editor-shelf/resource-types/rt-methods.js',
//    '../test/e2e/editor-shelf/resource-types/rt-root.js',
//    '../test/e2e/editor-shelf/root.js',
//    '../test/e2e/editor-shelf/traits.js',
//    '../test/e2e/editor-shelf/shelf-regressions.js',
//    '../test/e2e/editor-parser/*.js',
//    '../test/e2e/editor-parser/resource/*.js',
//    '../test/e2e/editor-parser/resourceTypes/*.js',
//    '../test/e2e/raml-example/muse-e2e.js',
    '../test/e2e/published-examples/examples-parser.js',
    '../test/e2e/console/embedded-console.js',

    '../test/lib/*.js'
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
