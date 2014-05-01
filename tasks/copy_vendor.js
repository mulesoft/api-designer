'use strict';

exports.name = 'copy';

exports.createConfig = function(context, block) {
  context.outDir   = context.inDir;
  context.outFiles = context.inFiles;

  if (['js', 'css'].indexOf(block.type) !== -1 && /vendor/.exec(block.dest)) {
    var cfg = {
      files: [{
        expand:  true,
        dot:     true,
        dest:    block.type === 'js' ? 'dist/scripts/vendor' : 'dist/styles/vendor',
        flatten: true,
        src:     []
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
