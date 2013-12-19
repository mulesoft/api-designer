'use strict';
exports.config = {
//  sauceUser: process.env.SAUCE_USER,
  sauceUser: 'muleion',
//  sauceKey: process.env.SAUCE_KEY,
  sauceKey: '27696dec-0aa5-429c-ae5e-d9c11022fc5a',

  capabilities: {
    'browserName': 'chrome'
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

  baseUrl:  'https://ramltooling:ram10ve@j0hnqa.mulesoft.org/',

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
