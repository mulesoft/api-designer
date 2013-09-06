// Karma configuration
// Generated on Wed Aug 28 2013 22:34:19 GMT-0300 (ART)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',


    // frameworks to use
    frameworks: ['mocha', 'chai'],


    // list of files / patterns to load in the browser
    files: [
    'test/lib/sinon.js',
    'app/vendor/scripts/suggest.js',
    'app/vendor/scripts/angular.js',
    'app/vendor/scripts/angular-resource.js',
    'app/vendor/scripts/angular-sanitize.js',

    'app/vendor/scripts/test/angular-mocks.js',

    'app/vendor/scripts/codemirror.js',
    'app/vendor/scripts/foldcode.js',
    'app/vendor/scripts/foldgutter.js',
    'app/vendor/scripts/yaml.js',
    'app/vendor/scripts/show-hint.js',
    'app/vendor/scripts/raml-parser.js',
    'app/vendor/scripts/showdown.min.js',
    'app/scripts/common/helpers.js',
    'app/scripts/common/showdown.js',
    'app/scripts/common/eventService.js',
    'app/scripts/app.js',
    'app/scripts/services/code-mirror.js',
    'app/scripts/services/code-mirror-errors.js',
    'app/scripts/services/raml-service.js',
    'app/scripts/services/raml-hint.js',
    'app/scripts/services/raml-parser.js',
    'app/scripts/services/raml-snippets.js',
    'app/scripts/directives/prevent-default.js',
    'app/scripts/directives/raml-console.js',
    'app/scripts/directives/raml-definition.js',
    'app/scripts/directives/markdown.js',
    'app/scripts/controllers/raml-operation.js',
    'app/scripts/controllers/raml-operation-list.js',
    'app/scripts/controllers/raml-documentation.js',
    'app/scripts/controllers/raml-console-sidebar.js',
    'app/scripts/controllers/raml-operation-details.js',
    'app/scripts/controllers/raml-operation-details-try-it.js',
    'app/scripts/controllers/raml-operation-details-response.js',
    'app/scripts/controllers/raml-operation-details-request.js',
    'app/scripts/controllers/raml-editor-main.js',
    'app/scripts/controllers/raml-editor-shelf.js',
    'test/mocks/**/*.js',
    'test/spec/**/*.js'
    ],


    // list of files to exclude
    exclude: [

    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['dots'],


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
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
