'use strict';
exports.config = {

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
//    '../test/e2e/editor-parser/*.js',
//    '../test/e2e/editor-parser/resource/*.js',
//    '../test/e2e/editor-parser/resourceTypes/*.js',
    '../test/e2e/raml-example/muse-e2e.js',
//    '../test/e2e/editor-console.js',
//    '../test/e2e/console/console-resource.js',
//    '../test/e2e/published-examples/examples-parser.js',
//    '../test/e2e/editor-shelf/shelf-regressions.js',
    '../test/lib/*.js'
  ],
//  baseUrl:  'https://ramltooling:ram10ve@j0hnqa.mulesoft.org/',
  baseUrl:  'https://ramltooling:ram10ve@j0hnqa.mulesoft.org/tree/bugs/use-path-to-calculate-padding-61409222/',

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
    isVerbose: true,
    showColors: true,
    includeStackTrace: true,
    defaultTimeoutInterval: 20000
  }
};
