'use strict';
if( !process.env.NODE_ENV ) process.env.NODE_ENV = 'test';

var spawn = require('child_process').spawn,
  args = [__dirname + '/../lib/cli.js'],
  path = require('path'),
  fs = require('fs');

module.exports = function(grunt) {
  var _ = grunt.util._;

  grunt.registerMultiTask('protractor', 'run protractor.', function() {
    var done = this.async();
    var options = this.options();
    var data = this.data;

    //merge options onto data, with data taking precedence
    data = _.merge(options, data);
    data.configFile = path.resolve(data.configFile);

    if (data.configFile) {
      data.configFile = grunt.template.process(data.configFile);
    }

    function runSelenium(callback) {
      var selenium = spawn('java', ['-jar', './selenium/selenium-server-standalone-2.35.0.jar', '-Dwebdriver.chrome.driver=./selenium/chromedriver']);

      grunt.log.write('Waiting for Selenium to start...');

      selenium.stdout.on('data', function (data) {
        // Uncomment for selenium debugging messages
        // grunt.log.write(data);
        if (data.toString().indexOf('Started SocketListener') !== -1) {
          grunt.log.write('\nServer started successfully!');
          grunt.log.writeln('\nStarting tests now...\n');

          process.on('exit', function (code, signal) {
            process.kill(selenium.pid, signal);
          });
          callback();
        }
      });
      selenium.on('exit', function (code, signal) {
        console.log('ERROR: Selenium exited with code: ' + code);
        if (signal) {
          process.kill(process.pid, signal);
        } else {
          process.exit(code);
        }
      });
    }

    function runProtractor() {
      args = [data.configFile];
      if (data.debug)
        args.unshift('debug');

      var proc = spawn('./node_modules/protractor/bin/protractor', args, { stdio: 'inherit' });
      proc.on('exit', function (code, signal) {
        if (signal) {
          process.kill(process.pid, signal);
        } else {
          process.exit(code);
        }
      });
    }

    if (!fs.existsSync('./selenium/selenium-server-standalone-2.35.0.jar')) {

      var installProc = spawn('./node_modules/protractor/bin/install_selenium_standalone', [], { stdio: 'inherit' });

      installProc.on('exit', function (code, signal) {
        runSelenium(runProtractor);
      });
    }
    else {
      runSelenium(runProtractor);
    }
  });
}

