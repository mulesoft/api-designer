exports.config = {

  capabilities: {
    'browserName': 'phantomjs'
  },

  baseUrl: 'http://localhost:9013/',
  
  specs: [
//    '../test/e2e/raml-example/muse-e2e.js',
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
    defaultTimeoutInterval: 50000,
    isVerbose: false,
    includeStackTrace: true
  }
};
