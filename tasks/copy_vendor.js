'use strict';

exports.name = 'copy';

exports.createConfig = function(context, block) {
  context.outDir = context.inDir;
  context.outFiles = context.inFiles;

  if (block.type === 'js' && /vendor/.exec(block.dest)) {

    var cfg = {
      files: [{
        expand: true,
        dot: true,
        dest: 'dist/scripts/vendor',
        flatten: true,
        src: []
      }]
    };

    block.src.forEach(function(file) {
      cfg.files[0].src.push(/^vendor/.exec(file) ? 'app/' + file : file);
    });

    return cfg;
  } else {
    return {};
  }
};
