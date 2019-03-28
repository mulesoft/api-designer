// Karma configuration
// Generated on Wed Aug 28 2013 22:34:19 GMT-0300 (ART)

'use strict';

process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // frameworks to use
    frameworks: [
      'mocha',
      'chai-sinon'
    ],

    // list of files / patterns to load in the browser
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/angular-ui-tree/dist/angular-ui-tree.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/es5-shim/es5-shim.js',

      'bower_components/raml-1-parser/raml-1-parser.js',
      'bower_components/jszip/jszip.js',
      'bower_components/jszip/jszip-load.js',
      'bower_components/jszip/jszip-deflate.js',
      'bower_components/jszip/jszip-inflate.js',

      'bower_components/marked/lib/marked.js',
      'bower_components/highlightjs/highlight.pack.js',
      'bower_components/vkbeautify/vkbeautify.js',
      'bower_components/jquery/dist/jquery.js',
      'bower_components/velocity/velocity.js',
      'bower_components/crypto-js/rollups/hmac-sha1.js',
      'bower_components/crypto-js/components/enc-base64.js',
      'bower_components/codemirror/lib/codemirror.js',
      'bower_components/codemirror/mode/javascript/javascript.js',
      'bower_components/codemirror/mode/xml/xml.js',
      'bower_components/codemirror/mode/yaml/yaml.js',
      'bower_components/codemirror/addon/dialog/dialog.js',
      'bower_components/codemirror/addon/search/search.js',
      'bower_components/codemirror/addon/search/searchcursor.js',
      'bower_components/codemirror/addon/lint/lint.js',
      'bower_components/angular-ui-codemirror/ui-codemirror.js',
      'bower_components/angular-marked/angular-marked.js',
      'bower_components/angular-highlightjs/angular-highlightjs.js',
      'bower_components/api-console/dist/scripts/api-console.js',
      'bower_components/file-saver.js/FileSaver.js',
      'bower_components/json-schema-ref-parser/dist/ref-parser.js',

      'bower_components/angular-mocks/angular-mocks.js',

      'app/scripts/app.js',
      'app/scripts/services/code-mirror.js',
      'app/scripts/services/raml-repository.js',
      'app/**/*.js',
      '.tmp/**/*.js',

      'test/mock/**/*.js',
      'test/spec/**/*.js'
    ],

    // list of files to exclude
    exclude: [
      'app/scripts/api-designer-worker.js'
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: [
      'dots',
      'coverage'
    ],

    preprocessors: {
      'app/scripts/**/*.js': 'coverage'
    },

    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/'
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['ChromeHeadlessNoSandbox'],

    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 120000,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
