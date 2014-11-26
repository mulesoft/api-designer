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
      'app/vendor/scripts/**/*.js',

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

      'bower_components/api-console/dist/scripts/vendor/marked.js',
      'bower_components/api-console/dist/scripts/vendor/client-oauth2.js',
      'bower_components/api-console/dist/scripts/vendor/highlightjs/highlight.pack.js',
      'bower_components/api-console/dist/scripts/vendor/jquery/jquery.js',
      'bower_components/api-console/dist/scripts/vendor/jquery/velocity.js',
      'bower_components/api-console/dist/scripts/vendor/raml/raml-sanitize.js',
      'bower_components/api-console/dist/scripts/vendor/raml/raml-validate.js',
      'bower_components/api-console/dist/scripts/vendor/crypto-js/hmac-sha1.js',
      'bower_components/api-console/dist/scripts/vendor/crypto-js/enc-base64.js',
      'bower_components/api-console/dist/scripts/vendor/codemirror/mode/javascript.js',
      'bower_components/api-console/dist/scripts/vendor/codemirror/mode/xml.js',
      'bower_components/api-console/dist/scripts/vendor/codemirror/mode/yaml.js',
      'bower_components/api-console/dist/scripts/vendor/codemirror/addon/dialog.js',
      'bower_components/api-console/dist/scripts/vendor/codemirror/addon/search.js',
      'bower_components/api-console/dist/scripts/vendor/codemirror/addon/searchcursor.js',
      'bower_components/api-console/dist/scripts/vendor/codemirror/addon/lint.js',
      'bower_components/api-console/dist/scripts/vendor/angular/ui-codemirror.js',
      'bower_components/api-console/dist/scripts/vendor/angular/angular-marked.js',
      'bower_components/api-console/dist/scripts/vendor/angular/angular-highlightjs.js',
      'bower_components/api-console/dist/scripts/api-console.js',


      'bower_components/api-console/dist/scripts/api-console.js',
      'bower_components/raml-grammar/dist/suggest.js',
      'bower_components/raml-object-to-raml/dist/raml-object-to-raml.js',
      'bower_components/swagger-to-raml-object/dist/swagger-to-raml-object.js',
      'bower_components/jszip/jszip.js',
      'bower_components/jszip/jszip-load.js',
      'bower_components/jszip/jszip-deflate.js',
      'bower_components/jszip/jszip-inflate.js',

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
      'app/scripts/services/new-file-service.js',
      'app/scripts/services/new-folder-service.js',
      'app/scripts/services/local-storage-file-system.js',
      'app/scripts/services/mocking-service-client.js',
      'app/scripts/services/mocking-service.js',
      'app/scripts/services/import-modal.js',
      'app/scripts/services/new-name-modal.js',
      'app/scripts/services/swagger-to-raml.js',
      'app/scripts/services/import-service.js',
      'app/scripts/services/import-service-conflict-modal.js',
      'app/scripts/filters/string-filters.js',
      'app/scripts/controllers/raml-editor-main.js',
      'app/scripts/controllers/raml-editor-shelf.js',
      'app/scripts/controllers/notifications.js',
      'app/scripts/controllers/mocking-service-controller.js',
      'app/scripts/directives/splitter.js',
      'app/scripts/directives/validate.js',
      'app/scripts/directives/auto-focus.js',
      'app/scripts/directives/right-click.js',
      'app/scripts/directives/drag-and-drop.js',
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
