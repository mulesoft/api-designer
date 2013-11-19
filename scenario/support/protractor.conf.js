//var jasRep = require('jasmine-reporters');
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',


  capabilities: {
    'browserName': 'chrome'
  },

  specs: [
    '../test/lib/*.js',
    '../test/e2e/editor-shelf/resource/resource-methods.js',
    '../test/e2e/editor-shelf/resource/resource-root.js',
    '../test/e2e/editor-shelf/resource-types/rt-methods.js',
    '../test/e2e/editor-shelf/resource-types/rt-root.js',
    '../test/e2e/editor-shelf/root.js',
    '../test/e2e/editor-shelf/traits.js',
    '../test/e2e/editor-parser/*.js',
    '../test/e2e/editor-parser/resource/*.js',
    '../test/e2e/editor-parser/resourceTypes/*.js',
    '../test/lib/*.js'
  ],
  onPrepare: function() {
    browser.get('');
    browser.executeScript(function () {
      localStorage['config.updateResponsivenessInterval'] = 1;
      window.onbeforeunload = null;
    });

    browser.wait(function(){
      return browser.executeScript('return (editor.getLine(1) === \'title:\');');
    });
//    jasmine.getEnv().addReporter(
      ////new jasmine.HtmlReporter());
//      new jasmine.ConsoleReporter());
//      new jasmine.JUnitXmlReporter('xmloutput', true, true));
  },

  baseUrl: 'http://localhost:9013/',

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 800000,
    onComplete: null,
    isVerbose: true,
    includeStackTrace: true
  }
};
