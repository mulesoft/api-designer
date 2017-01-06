// Karma configuration
// Generated on Wed Aug 28 2013 22:34:19 GMT-0300 (ART)

'use strict';

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
      'bower_components/es5-shim/es5-shim.js',

      'bower_components/raml-1-parser/raml-xml-validation.js',
      'bower_components/raml-1-parser/raml-json-validation.js',
      'bower_components/raml-1-parser/raml-1-parser.js',
      'bower_components/jszip/jszip.js',
      'bower_components/jszip/jszip-load.js',
      'bower_components/jszip/jszip-deflate.js',
      'bower_components/jszip/jszip-inflate.js',

      'bower_components/jquery/dist/jquery.js',
      'app/vendor/scripts/codemirror.js',
      'app/vendor/scripts/foldcode.js',
      'app/vendor/scripts/foldgutter.js',
      'app/vendor/scripts/gfm.js',
      'app/vendor/scripts/javascript.js',
      'app/vendor/scripts/markdown.js',
      'app/vendor/scripts/overlay.js',
      'app/vendor/scripts/show-hint.js',
      'app/vendor/scripts/xml.js',
      'app/vendor/scripts/meta.js',
      'bower_components/file-saver.js/FileSaver.js',
      'bower_components/json-schema-ref-parser/dist/ref-parser.js',
      'bower_components/angular-mocks/angular-mocks.js',

      'app/scripts/app.js',
      'app/scripts/services/code-mirror.js',
      'app/scripts/services/raml-repository.js',
      'app/scripts/services/raml-parser.js',
      'app/**/*.js',
      '.tmp/**/*.js',

      'test/mock/**/*.js',
      'test/spec/**/*.js'
    ],

    // list of files to exclude
    exclude: [

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
      type: "lcov",
      dir: "coverage/"
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
    browsers: ['PhantomJS'],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 120000,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
