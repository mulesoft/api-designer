
var service = require('../services/service');
var config = require('../../config.json');

service.baseDir(config.baseDir);

module.exports = function(FileSystem) {

	FileSystem.createFolder = function(path, cb) {
		service.createFolder(path).then(function() {
			cb(null, {});
		}).catch(function(err) {
			cb(err);
		});
	};

	FileSystem.remoteMethod(
		'createFolder', {
			accepts: {arg: 'path', type: 'string'},
			returns: {root: true},
			http: {verb: 'post'}
		}
	);	

	FileSystem.save = function(path, content, cb) {
		service.save(path, content).then(function() {
			cb(null, {});
		}).catch(function(err) {
			cb(err);
		});
	};

	FileSystem.remoteMethod(
		'save', {
			accepts: [{arg: 'path', type: 'string'}, {arg: 'content', type: 'string'}],
			returns: {root: true},
			http: {verb: 'post'}
		}
	);

	FileSystem.directory = function(path, cb) {
		service.directory(path).then(function(files) {
			cb(null, files);
		}).catch(function(err) {
			cb(err);
		});
		
	};

	FileSystem.remoteMethod(
		'directory', {
			accepts: {arg: 'path', type: 'string'},
			returns: {root: true},
			http: {verb: 'get'}
		}
	);

	FileSystem.load = function(path, cb) {
		if ( endsWith(path, '.meta') ) {
			service.loadMeta(path.substr(0,path.length-5)).then(function(meta) {
				cb(null, '{"meta": {"created": '+ (new Date(meta.mtime)).getTime() +'}}');
			}).catch(function(err) {
				cb(err);
			});
		} else {
			service.load(path).then(function(content) {
				cb(null, content);
			}).catch(function(err) {
				cb(err);
			});
		}
		
	};

	FileSystem.remoteMethod(
		'load', {
			accepts: {arg: 'path', type: 'string'},
			returns: {arg: 'content', type: 'string'},
			http: {verb: 'get'}
		}
	);

	function endsWith(str, suffix) {
	    return str.indexOf(suffix, str.length - suffix.length) !== -1;
	}
	
};
