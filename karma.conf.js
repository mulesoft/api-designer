// Karma configuration

// base path, that will be used to resolve files and exclude
basePath = '';

// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,
  'app/vendor/scripts/angular.js',
  'app/vendor/scripts/angular-resource.js',
  'app/vendor/scripts/*.js',
  'app/vendor/scripts/**/*.js',
  'app/scripts/services/ramlService.js',
  'app/scripts/app.js',
  'app/scripts/services/code-mirror.js',
  'app/scripts/services/raml-service.js',
  'app/scripts/services/raml-hint.js',
  'app/scripts/services/raml-parser.js',
  'app/scripts/codemirror/raml-indent-fold.js',
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
  'test/mock/**/*.js',
  'test/spec/**/*.js'
];

// list of files to exclude
exclude = [];

// test results reporter to use
// possible values: dots || progress || growl
reporters = ['progress'];

// web server port
port = 8080;

// cli runner port
runnerPort = 9100;

// enable / disable colors in the output (reporters and logs)
colors = true;

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;

// enable / disable watching file and executing tests whenever any file changes
autoWatch = false;

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['PhantomJS'];

// If browser does not capture in given timeout [ms], kill it
captureTimeout = 5000;

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
