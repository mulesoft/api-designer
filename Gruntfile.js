// Generated on 2013-07-12 using generator-angular 0.3.0
'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist'
  };

  try {
    yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
  } catch (e) {}

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
          '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test')
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
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>'
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp',
      updatelibs: {
        files: [{
          dot: true,
          src: ['<%= yeoman.app %>/vendor/scripts/angular.js',
            '<%= yeoman.app %>/vendor/scripts/raml-parser.js'
          ]
        }]
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ]
    },
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/styles/fonts/*'
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
        dirs: ['<%= yeoman.dist %>']
      }
    },
    htmlmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: ['*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    // Put files not handled in other tasks here
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'images/{,*/}*.{gif,webp,svg}',
            'styles/fonts/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: [
            'generated/*'
          ]
        }]
      },
      updatelibs: {
        files: [{
          expand: true,
          dot: false,
          cwd: '<%= yeoman.root %>',
          dest: '<%= yeoman.app %>/vendor/scripts',
          flatten: true,
          src: [
            'bower_components/angular/angular.js',
            'bower_components/angular/angular-resource.js',
            'bower_components/angular/angular-sanitize.js',
            // 'bower_components/CodeMirror/lib/*.js',
            // 'bower_components/CodeMirror/mode/yaml/yaml.js',
            'bower_components/raml-parser/dist/raml-parser.js'
          ]
        }, {
          expand: true,
          dot: false,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.app %>/vendor/styles',
          flatten: true,
          src: [
            // 'bower_components/CodeMirror/lib/*.css',
            // 'bower_components/CodeMirror/theme/solarized.css'
          ]
        }, {
          expand: true,
          dot: false,
          cwd: '<%= yeoman.app %>/bower_components/raml-console/angular-app/app/views',
          dest: '<%= yeoman.app %>/views',
          flatten: true,
          src: '*.html'
        }, {
          expand: true,
          dot: false,
          cwd: '<%= yeoman.app %>/bower_components/raml-console/angular-app/app/scripts/controllers',
          dest: '<%= yeoman.app %>/scripts/controllers',
          flatten: true,
          src: '*.js'
        }, {
          expand: true,
          dot: false,
          cwd: '<%= yeoman.app %>/bower_components/raml-console/angular-app/app/scripts/directives',
          dest: '<%= yeoman.app %>/scripts/directives',
          flatten: true,
          src: '*.js'
        }, {
          expand: true,
          dot: false,
          cwd: '<%= yeoman.app %>/bower_components/raml-console/angular-app/app/scripts/common',
          dest: '<%= yeoman.app %>/scripts/common',
          flatten: true,
          src: '*.js'
        }, {
          expand: true,
          dot: false,
          cwd: '<%= yeoman.app %>/bower_components/raml-console/angular-app/app/scripts/services',
          dest: '<%= yeoman.app %>/scripts/services',
          flatten: true,
          src: '*.js'
        }]
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
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>/scripts',
          src: '*.js',
          dest: '<%= yeoman.dist %>/scripts'
        }]
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
      ramlConsoleApp: {
        options: {
          base: 'app',
          concat: 'dist/scripts/scripts.js'
        },
        src: 'app/views/**/*.html',
        dest: 'dist/templates.js'
      }
    }
  });

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'connect:livereload',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('updatelibs', [
    'clean:updatelibs',
    'copy:updatelibs'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'useminPrepare',
    'ngtemplates',
    'concat',
    'htmlmin',
    'copy:dist',
    'ngmin',
    'uglify',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('deploy', [
    'build'
  ]);


  grunt.registerTask('default', [
    'jshint',
    'test',
    'build'
  ]);
};
