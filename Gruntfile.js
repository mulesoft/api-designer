// Generated on 2013-07-12 using generator-angular 0.3.0
'use strict';
var LIVERELOAD_PORT = 35730;
var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;
var lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });
var mountFolder = function (connect, dir, route) {
  var staticMiddleware = connect.static(require('path').resolve(dir));
  return {
    route : route,
    handle: function (req, res, next) {
      if (route) {
        req.url = req.url.replace(route, '');
      }
      staticMiddleware(req, res, next);
    }
  };
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  require('./tasks/protractor.js')(grunt);

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist'
  };

  try {
    yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
  } catch (e) {
  }

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
          '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
          '{.tmp,<%= yeoman.app %>}/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '{.tmp,<%= yeoman.app %>}/vendor/scripts/{,*/}*.js',
          '{.tmp,<%= yeoman.app %>}/vendor/styles/{,*/}*.css',
          '{.tmp,<%= yeoman.app %>}/vendor/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      },
      less: {
        files: '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.less',
        tasks: 'less-and-autoprefixer'
      }
    },
    connect: {
      options: {
        port: grunt.option('port') || 9013,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, yeomanConfig.app),
              mountFolder(connect, 'bower_components', '/bower_components'),
              proxySnippet
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, yeomanConfig.dist)
            ];
          }
        }
      },
      proxies: [
        {
          context: '/',
          host: 'localhost',
          port: 8080,
          changeOrigin: true
        }
      ]
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>'
      }
    },
    clean: {
      dist: {
        files: [
          {
            dot: true,
            src: [
              '.tmp',
              '<%= yeoman.dist %>/*',
              '!<%= yeoman.dist %>/.git*'
            ]
          }
        ]
      },
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        ignores: [
          'test/spec/support/templates.js'
        ]
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js',
        'test/mock/{,*/}*.js',
        'test/spec/{,*/}*.js',
        'scenario/test/e2e/{,*/}*.js',
        'scenario/test/lib/{,*/}*.js'
      ]
    },
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
          ]
        }
      }
    },
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>']
      }
    },
    htmlmin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.app %>',
            src: ['*.html'],
            dest: '<%= yeoman.dist %>'
          }
        ]
      }
    },
    // Put files not handled in other tasks here
    copy: {
      dist: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= yeoman.app %>',
            dest: '<%= yeoman.dist %>',
            src: [
              '*.{ico,png,txt}',
              '.htaccess',
              'images/{,*/}*.{gif,webp,svg,png}',
              'styles/fonts/*'
            ]
          },
          {
            expand: true,
            cwd: '<%= yeoman.app %>/vendor/font/',
            dest: '<%= yeoman.dist %>/font/',
            src: ['*']
          }
        ]
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },
    ngmin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.dist %>/scripts',
            src: '*.js',
            dest: '<%= yeoman.dist %>/scripts'
          }
        ]
      }
    },
    uglify: {
      dist: {
        files: {
          '<%= yeoman.dist %>/scripts/scripts.js': [
            '<%= yeoman.dist %>/scripts/scripts.js'
          ]
        }
      }
    },
    ngtemplates: {
      ramlEditorApp: {
        options: {
          base: 'app',
          concat: 'dist/scripts/scripts.js'
        },
        src: 'app/views/**/*.html',
        dest: 'dist/templates.js'
      },
      test: {
        options: {
          base: 'app',
          module: 'ramlEditorApp'
        },
        src: 'app/views/**/*.html',
        dest: 'test/spec/support/templates.js'
      }
    },
    less: {
      files: {
        expand: true,
        flatten: true,
        src: 'app/styles/less/*.less',
        dest: 'app/styles',
        ext: '.css'
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
        debug: true
      },
      saucelabs: {
        configFile: 'scenario/support/saucelabs.conf.js'
      }
    }
  });

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run([
        'build',
        'connect:dist:keepalive',
        'open'
      ]);
    }

    grunt.task.run([
      'clean:server',
      'jshint',
      'less-and-autoprefixer',
      'configureProxies',
      'connect:livereload',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'jshint',
    'ngtemplates:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'jshint',
    'less-and-autoprefixer',
    'useminPrepare',
    'ngtemplates:ramlEditorApp',
    'concat',
    'htmlmin',
    'copy:dist',
    'ngmin',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('less-and-autoprefixer', [
    'less',
    'autoprefixer'
  ]);

  grunt.registerTask('localScenario', [
    'clean:server',
    'jshint',
    'connect:livereload',
    'protractor:local'
  ]);

  grunt.registerTask('scenario', [
    'clean:server',
    'jshint',
    'protractor:scenario'
  ]);

  grunt.registerTask('saucelabs', [
    'clean:server',
    'jshint',
    'protractor:saucelabs'
  ]);

  grunt.registerTask('default', [
    'test',
    'build'
  ]);
};
