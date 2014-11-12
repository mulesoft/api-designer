var service = require('../services/service');
var config = require('../../config.json');

service.baseDir(config.baseDir);

module.exports = function(FileSystem) {

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
		service.load(path).then(function(content) {
			cb(null, content);
		}).catch(function(err) {
			cb(err);
		});
	};

	FileSystem.remoteMethod(
		'load', {
			accepts: {arg: 'path', type: 'string'},
			returns: {arg: 'content', type: 'string'},
			http: {verb: 'get'}
		}
	);

	
};
