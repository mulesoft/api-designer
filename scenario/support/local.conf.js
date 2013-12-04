exports.config = {

  capabilities: {
    'browserName': 'phantomjs'
//    handlesAlerts: false,
//    unexpectedAlertBehaviour: false
  },

  baseUrl: 'http://localhost:9013/',
  
  seleniumServerJar: './selenium/selenium-server-standalone-2.37.0.jar',
//  chromeDriver: './selenium/chromedriver',

  specs: [
    '../test/e2e/raml-example/muse-e2e.js',
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
    isVerbose: true,
    includeStackTrace: true
  }
};
