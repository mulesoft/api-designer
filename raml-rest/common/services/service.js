
var Q = require('q');
var fs = require('fs');

var BASE_DIR = '/';

exports.baseDir = function(path) {
	BASE_DIR = path;
};

function loadFiles(path) {
	console.log('Load files from', BASE_DIR + path);
	var deferred = Q.defer();

	//normalize path
	if ( !startsWith(path,'/') ) path = '/' + path;
	var normalizedPath = path;
	if ( !endsWith(path,'/') ) path = path + '/';

	fs.readdir(BASE_DIR + path, function(err, files) {
		if ( !err ) {
			var fileObjects = [];
			var promises = [];
			for ( var i=0; i<files.length; i++ ) {

				var isDirectory = fs.lstatSync(BASE_DIR+path+'/'+files[i]).isDirectory();
				if ( excludeEntry(files[i], isDirectory) ) {
					continue;
				}
				var entry = {
					name: files[i],
					path: path + files[i],
					type: isDirectory ? 'folder':'file'
				};
				if ( isDirectory ) {
					entry.children = [];
					//Create promise for loading children
					var sub = path + files[i];
					promises.push(loadChildren(sub, entry));
				}
				fileObjects.push(entry);
			}
			Q.all(promises).then(function(directories) {
				deferred.resolve(fileObjects);	
			}).catch(function(err) {
				deferred.reject(err);	
			});
		} else {
			deferred.reject(err);
		}
	});
	return deferred.promise;
}

function loadChildren(path, entry) {
	var deferred = Q.defer();
	loadFiles(path).then(function(files) {
		entry.children = files;
		deferred.resolve();
	}).catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function excludeEntry(name, isDirectory) {
	if ( !isDirectory && excludeByExtension(name) ) {
		return true;
	} else if ( startsWith(name,'.') ) {
		return true;
	}
	return false;
}

function excludeByExtension(name) {
	name = name.toLowerCase();
	var ext = name.substr(name.lastIndexOf('.')+1);
	var valid = ['raml','json','xml'];
	return valid.indexOf(ext) == -1;
}

/**
* Read all directory hiterachy
*/
exports.directory = function(path) {
	if ( !startsWith(path,'/') ) path = '/' + path;
	var normalizedPath = path;

	return loadFiles(path).then(function(entries) {
		return {
				name: normalizedPath.substr(normalizedPath.lastIndexOf('/')+1),
     			path: normalizedPath,
     			type: "folder",    
				children: entries
			};
	});
};

exports.remove = function(path) {
	var deferred = Q.defer();

	fs.unlink(BASE_DIR + '/' + path, function(err) {
		if ( err) {
			return deferred.reject(err);
		} else {
			return deferred.resolve();
		}
	})

	return deferred.promise;
}

exports.rename = function(oldName, newName) {
	var deferred = Q.defer();

	fs.rename(BASE_DIR + '/' + oldName, BASE_DIR + '/' + newName, function(err) {
		if ( err) {
			return deferred.reject(err);
		} else {
			return deferred.resolve();
		}
	})

	return deferred.promise;
}

exports.createFolder = function(path) {
	var deferred = Q.defer();

	fs.mkdir(BASE_DIR + '/' + path, function(err) {
		if ( err) {
			return deferred.reject(err);
		} else {
			return deferred.resolve();
		}
	})

	return deferred.promise;
}

exports.save = function(path, content) {
	var deferred = Q.defer();

	fs.writeFile(BASE_DIR + '/' + path, content,'utf-8', function(err) {
		if ( !err ) {
			deferred.resolve();	
		} else {
			deferred.reject(err);
		}
	});
	return deferred.promise;
};

exports.load = function(path) {
	var deferred = Q.defer();

	fs.readFile(BASE_DIR + '/' + path,'utf-8', function(err, data) {
		if ( !err ) {
			deferred.resolve(data);	
		} else {
			deferred.reject(err);
		}
	});
	return deferred.promise;
}

exports.loadMeta = function(path) {
	var deferred = Q.defer();

	fs.lstat(BASE_DIR + '/' + path, function(err, stats) {
		if ( !err ) {
			deferred.resolve(stats);	
		} else {
			deferred.reject(err);
		}
	});
	return deferred.promise;
}


function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function startsWith(str, prefix) {
	return str.indexOf(prefix) == 0;
}