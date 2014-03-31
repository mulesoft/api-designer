'use strict';
exports.config = {

  sauceUser: process.env.SAUCE_USER,
  sauceKey: process.env.SAUCE_KEY,

  capabilities: {
    'browserName': process.env.BROWSER,
    name: 'API-Portal-console-methods'
  },

  allScriptsTimeout: 100000,

  specs: [
    '../../test/e2e/console/Methods/request-tab.js',
    '../../test/e2e/console/Methods/response-tab.js',
    '../../test/lib/*.js'
  ],

  baseUrl: process.env.BASE_URL,

  onPrepare: function() {
    require('jasmine-reporters');
    jasmine.getEnv().addReporter(
      new jasmine.JUnitXmlReporter('scenario/support/', true, true));
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
    showColors: false,
    includeStackTrace: false,
    defaultTimeoutInterval: 80000
  }
};
