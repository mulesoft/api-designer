exports.config = {

  capabilities: {
    'browserName': 'chrome'
  },
  
  baseUrl: 'https://ramltooling:ram10ve@j0hnqa.mulesoft.org/',

  seleniumServerJar: './selenium/selenium-server-standalone-2.35.0.jar',
  chromeDriver: './selenium/chromedriver',

  specs: [
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
  },

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 15000,
    isVerbose: true,
    includeStackTrace: true
  }
};
