'use strict';
if( !process.env.NODE_ENV ) process.env.NODE_ENV = 'test';

var spawn = require('child_process').spawn,
  args = [__dirname + '/../lib/cli.js'],
  path = require('path');

module.exports = function(grunt) {
  var _ = grunt.util._;

  grunt.registerMultiTask('protractor', 'run protractor.', function() {
    var options = this.options();
    var data = this.data;
    var done = this.async();

    //merge options onto data, with data taking precedence
    data = _.merge(options, data);
    data.configFile = path.resolve(data.configFile);

    if (data.configFile) {
      data.configFile = grunt.template.process(data.configFile);
    }

    var installProc = spawn('./node_modules/protractor/bin/webdriver-manager', ['update'], { stdio: 'inherit' });

    installProc.on('exit', function () {
      args = [data.configFile];
      if (data.debug) {
        args.unshift('debug');
      }

      var proc = spawn('./node_modules/protractor/bin/protractor', args, { stdio: 'inherit' });

      proc.on('exit', function (code) {
        // Success running protractor
        if (code === 0) {
          done();
        // Protractor failed
        } else {
          done(false);
        }
      });
    });
  });
};
