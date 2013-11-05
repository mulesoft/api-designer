exports.config = {

  seleniumAddress: 'http://localhost:4444/wd/hub',


  capabilities: {
    'browserName': 'chrome'
  },


  specs: [
    '../test/e2e/editor-shelf.js',
//    '../test/e2e/editor-parser.js' ,
//    '../test/e2e/editor-console.js',
//    '../test/e2e/raml-example/quizlet-e2e.js',
    '../test/lib/*.js'
  ],

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 80000,
    onComplete: null,
    isVerbose: true,
    includeStackTrace: true

  }
};
