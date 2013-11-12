exports.config = {

  seleniumAddress: 'http://localhost:4444/wd/hub',
  
  capabilities: {
    'browserName': 'chrome'
  },

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
    defaultTimeoutInterval: 80000,
    onComplete: null,
    isVerbose: false,
    includeStackTrace: true

  }
};
