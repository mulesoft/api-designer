'use strict';

var LIVERELOAD_PORT = 35730;
var lrSnippet       = require('connect-livereload')({port: LIVERELOAD_PORT});

function proxy() {
  var request = require('request');

  return function proxyMiddleware(req, res, next) {
    if (req.method.toUpperCase() === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin',  '*');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With');
      return next();
    }

    var proxy = request({
      uri: req.url.substr(1),
      rejectUnauthorized: false
    });

    // Proxy the error message back to the client.
    proxy.on('error', function (error) {
      res.writeHead(500);
      return res.end(error.message);
    });

    // Workaround for some remote services that do not handle
    // multi-valued Accept header properly by omitting precedence
    if (req.headers.accept) {
      req.headers.accept = req.headers.accept.split(',')[0].trim();
    }

    // Pipe the request data directly into the proxy request and back to the
    // response object. This avoids having to buffer the request body in cases
    // where they could be unexepectedly large and/or slow.
    return req.pipe(proxy).pipe(res);
  };
}

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // configurable paths
  var yeomanConfig = {
    app:  'app',
    dist: 'dist'
  };

  try {
    yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
  } catch (e) {
  }

  grunt.initConfig({
    yeoman: yeomanConfig,

    watch: {
      dist: {
        options: {
          livereload: LIVERELOAD_PORT
        },

        files: '<%= yeoman.dist %>/**/*'
      },

      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },

        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '<%= yeoman.app %>/scripts/{,*/}*.js',
          '<%= yeoman.app %>/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.app %>/vendor/scripts/{,*/}*.js',
          '<%= yeoman.app %>/vendor/styles/{,*/}*.css',
          '<%= yeoman.app %>/vendor/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      },

      less: {
        files: '<%= yeoman.app %>/styles/{,*/}*.less',
        tasks: 'less-and-autoprefixer'
      }
    },

    connect: {
      options: {
        hostname: 'localhost',
        port:      grunt.option('port') || 9013
      },

      dist: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,

              connect().use('/',       connect.static(yeomanConfig.dist)),
              connect().use('/proxy/', proxy())
            ];
          }
        }
      },

      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,

              connect().use('/',                 connect.static(yeomanConfig.app)),
              connect().use('/.tmp',             connect.static('./.tmp')),
              connect().use('/bower_components', connect.static('./bower_components')),
              connect().use('/authentication',   connect.static('./bower_components/api-console/dist/authentication')),
              connect().use('/proxy/',           proxy())
            ];
          }
        }
      }
    },

    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>'
      }
    },

    clean: {
      build: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>'
          ]
        }]
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        ignores:  [
          'test/spec/support/templates.js'
        ]
      },

      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js',
        'test/mock/{,*/}*.js',
        'test/spec/{,*/}*.js',
        'scenario/test/e2e/{,*/}*.js',
        'scenario/test/lib/{,*/}*.js',
        'scenario/support/{,*/}*.js'
      ]
    },

    useminPrepare: {
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          post:  {},
          steps: {
            js:  ['concat'],
            css: ['concat']
          }
        }
      },

      html: '<%= yeoman.app %>/index.html'
    },

    usemin: {
      options: {
        dirs: ['<%= yeoman.dist %>']
      },

      html: '<%= yeoman.dist %>/index.html'
    },

    concat: {
      dist: {
        dest: '<%= yeoman.dist %>/scripts/api-designer.js',
        src:  [
          '<%= yeoman.dist %>/scripts/api-designer.js',
          '.tmp/templates.js'
        ]
      }
    },

    copy: {
      dist: {
        files: [
          {
            expand: true,
            cwd:    '<%= yeoman.app %>',
            src:    '*.html',
            dest:   '<%= yeoman.dist %>'
          },

          {
            expand: true,
            cwd:    '<%= yeoman.app %>/vendor/fonts',
            src:    '*',
            dest:   '<%= yeoman.dist %>/fonts'
          },

          {
            expand: true,
            cwd:    'bower_components/font-awesome/fonts',
            src:    '*',
            dest:   '<%= yeoman.dist %>/fonts'
          },

          {
            expand: true,
            cwd:    'bower_components/api-console/dist/authentication',
            src:    '*',
            dest:   '<%= yeoman.dist %>/authentication'
          },

          {
            expand: true,
            cwd:    'bower_components/api-console/dist/fonts',
            src:    '*',
            dest:   '<%= yeoman.dist %>/fonts'
          },

          {
            expand: true,
            cwd:    'bower_components/api-console/dist/img',
            src:    '*',
            dest:   '<%= yeoman.dist %>/img'
          },

          {
            expand: true,
            cwd:    '<%= yeoman.app %>/scripts/',
            src:    'api-designer-worker.js',
            dest:   '<%= yeoman.dist %>/scripts/'
          }
        ]
      }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun:  true
      }
    },

    ngmin: {
      dist: {
        files: {
          '<%= yeoman.dist %>/scripts/api-designer.js': '<%= yeoman.dist %>/scripts/api-designer.js'
        }
      }
    },

    uglify: {
      dist: {
        files: {
          '<%= yeoman.dist %>/scripts/api-designer-parser.min.js': '<%= yeoman.dist %>/scripts/api-designer-parser.js',
          '<%= yeoman.dist %>/scripts/api-designer-worker.min.js': '<%= yeoman.dist %>/scripts/api-designer-worker.js',
          '<%= yeoman.dist %>/scripts/api-designer.min.js':        '<%= yeoman.dist %>/scripts/api-designer.js',
          '<%= yeoman.dist %>/scripts/api-designer-vendor.min.js': '<%= yeoman.dist %>/scripts/api-designer-vendor.js'
        }
      }
    },

    cssmin: {
      dist: {
        files: {
          '<%= yeoman.dist %>/styles/api-designer.min.css':        '<%= yeoman.dist %>/styles/api-designer.css',
          '<%= yeoman.dist %>/styles/api-designer-vendor.min.css': '<%= yeoman.dist %>/styles/api-designer-vendor.css'
        }
      }
    },

    ngtemplates: {
      options: {
        module: 'ramlEditorApp',
        base:   'app'
      },

      files: {
        cwd:  'app',
        src:  'views/**/*.html',
        dest: '.tmp/templates.js'
      }
    },

    less: {
      files: {
        expand:  true,
        flatten: true,
        src:     'app/styles/less/*.less',
        dest:    'app/styles',
        ext:     '.css'
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 versions']
      },

      app: {
        src: 'app/styles/*.css'
      }
    },

    protractor: {
      local: {
        configFile: 'scenario/support/local.conf.js'
      },

      scenario: {
        configFile: 'scenario/support/protractor.conf.js'
      },

      debug: {
        configFile: 'scenario/support/protractor.conf.js',
        debug:      true
      },

      saucelabs: {
        configFile: 'scenario/support/saucelabs.conf.js'
      }
    },

    browserify: {
      oasRamlConverter: {
        options: {
          transform: ['browserify-global-shim', 'babelify'],
          browserifyOptions: {
            standalone: 'oasRamlConverter'
          }
        },
        files: {
          '.tmp/oas-raml-converter/oas-raml-converter.js': 'node_modules/oas-raml-converter/lib/index.js'
        }
      },
      jsTraverse: {
        options: {
          browserifyOptions: {
            standalone: 'jsTraverse.traverse'
          }
        },
        files: {
          '.tmp/js-traverse/js-traverse.js': 'node_modules/traverse/index.js'
        }
      },
      ramlSuggestions: {
        files: {
           '.tmp/raml-suggestions/raml-suggestions.js': 'node_modules/raml-suggestions/dist/browser-main.js'
        }
      }
    }
  });

  grunt.registerTask('jshint-once', (function jshintOnceFactory() {
    var jshinted = false;
    return function jshintOnce() {
      if (!jshinted) {
        jshinted = true;
        grunt.task.run('jshint');
      }
    };
  })());

  grunt.registerTask('less-and-autoprefixer', [
    'less',
    'autoprefixer'
  ]);

  grunt.registerTask('server:dist', [
    'connect:dist',
    'open',
    'watch:dist'
  ]);

  grunt.registerTask('server', [
    'jshint-once',
    'browserify:jsTraverse',
    'browserify:oasRamlConverter',
    'less-and-autoprefixer',
    'connect:livereload',
    'open',
    'watch'
  ]);

  grunt.registerTask('build', [
    'jshint-once',
    'clean:build',
    'browserify:jsTraverse',
    'browserify:ramlSuggestions',
    'browserify:oasRamlConverter',
    'useminPrepare',
    'less-and-autoprefixer',
    'ngtemplates',
    'concat:generated',
    'concat:dist',
    'copy:dist',
    'ngmin',
    'uglify:dist',
    'cssmin:dist',
    'usemin'
  ]);

  grunt.registerTask('test', [
    'jshint-once',
    'ngtemplates',
    'karma'
  ]);

  grunt.registerTask('localScenario', [
    'jshint-once',
    'connect:livereload',
    'protractor:local'
  ]);

  grunt.registerTask('scenario', [
    'jshint-once',
    'protractor:scenario'
  ]);

  grunt.registerTask('saucelabs', [
    'jshint-once',
    'protractor:saucelabs'
  ]);

  grunt.registerTask('default', [
    'jshint-once',
    'test',
    'build'
  ]);
};
