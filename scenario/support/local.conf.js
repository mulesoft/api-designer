exports.config = {


  capabilities: {
    'browserName': 'phantomjs'
  },

  baseUrl: 'http://localhost:9013/',
  
  seleniumServerJar: './selenium/selenium-server-standalone-2.35.0.jar',

  specs: [
    '../test/e2e/editor-shelf/resource/resource-methods.js',
    '../test/e2e/editor-shelf/resource-types/rt-methods.js',
    '../test/e2e/editor-shelf/resource/resource-root.js',
    '../test/e2e/editor-shelf/resource-types/rt-root.js',
    '../test/e2e/editor-shelf/root.js',
    '../test/e2e/editor-shelf/traits.js',
    '../test/e2e/editor-parser.js' ,
    '../test/lib/*.js'
  ],

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 15000,
    isVerbose: true,
    includeStackTrace: true
  }
};
