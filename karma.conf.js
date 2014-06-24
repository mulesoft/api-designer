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
      'app/vendor/scripts/codemirror.js',
      'app/vendor/scripts/foldcode.js',
      'app/vendor/scripts/foldgutter.js',
      'app/vendor/scripts/gfm.js',
      'app/vendor/scripts/javascript.js',
      'app/vendor/scripts/markdown.js',
      'app/vendor/scripts/overlay.js',
      'app/vendor/scripts/show-hint.js',
      'app/vendor/scripts/xml.js',

      'bower_components/angular/angular.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/angular-ui-tree/dist/angular-ui-tree.js',
      'bower_components/es5-shim/es5-shim.js',
      'bower_components/showdown/src/showdown.js',

      'bower_components/raml-js-parser/dist/raml-parser.js',
      'bower_components/api-console/dist/scripts/app.js',
      'bower_components/raml-grammar/dist/suggest.js',

      'app/scripts/app.js',
      'app/scripts/services/utils.js',
      'app/scripts/services/config.js',
      'app/scripts/services/lightweight-dom.js',
      'app/scripts/services/lightweight-parse.js',
      'app/scripts/services/code-folding.js',
      'app/scripts/services/code-mirror.js',
      'app/scripts/services/code-mirror-errors.js',
      'app/scripts/services/confirm-modal.js',
      'app/scripts/services/event.js',
      'app/scripts/services/raml-hint.js',
      'app/scripts/services/raml-snippets.js',
      'app/scripts/services/raml-highlight.js',
      'app/scripts/services/raml-highlight-config.js',
      'app/scripts/services/raml-repository.js',
      'app/scripts/services/file-system.js',
      'app/scripts/services/local-storage-file-system.js',
      'app/scripts/services/mocking-service-client.js',
      'app/scripts/services/mocking-service.js',
      'app/scripts/services/new-name-modal.js',
      'app/scripts/filters/string-filters.js',
      'app/scripts/controllers/raml-editor-main.js',
      'app/scripts/controllers/raml-editor-shelf.js',
      'app/scripts/controllers/notifications.js',
      'app/scripts/controllers/mocking-service-controller.js',
      'app/scripts/directives/splitter.js',
      'app/scripts/directives/raml-editor-file-browser.js',
      'app/scripts/directives/raml-editor-new-file-button.js',
      'app/scripts/directives/raml-editor-save-file-button.js',
      'app/scripts/directives/raml-editor-context-menu.js',

      '.tmp/templates.js',

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
      'app/scripts/**/*.js': ['coverage']
    },

    coverageReporter: {
      type: 'html',
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
    browsers: ['PhantomJS'],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 120000,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
