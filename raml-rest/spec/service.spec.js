
var Q = require('q');
var fs = require('fs');
var rmdir = require('rimraf');


describe('service.js', function() {
	var service = require('../common/services/service');

	describe('service.directory operation', function() {

		it('Should can configure the base path', function(done) {
			service.baseDir(process.cwd() + '/spec/resources');
			
			service.directory('')
			.then(function(directory) {
				var files = directory.children;
				expect(files.length).toBe(1);
				expect(files[0].name).toBe('base');
				expect(files[0].type).toBe('folder');
			})
			.then(function() {
				service.baseDir(process.cwd() + '/spec/resources/base');
				return service.directory('');
			})
			.then(function(directory) {
				var files = directory.children;
				expect(files.length).toBe(2);
				done();
			})
			.catch(function(e) {
				console.log(e);
				done();
			});
		});

		it('Should load files and folders inside a given path', function(done) {
			service.baseDir(process.cwd() + '/spec/resources/base/');
			service.directory('').then(function(directory) {
				expect(directory.name).toBe('');
				expect(directory.path).toBe('/');
				expect(directory.type).toBe('folder');

				var files = directory.children;
				expect(files.length).toBe(2);
				expect(files[0].name).toBe('folder1');
				expect(files[0].path).toBe('/folder1');
				expect(files[0].type).toBe('folder');
				expect(files[1].name).toBe('test1.raml');
				expect(files[1].path).toBe('/test1.raml');
				expect(files[1].type).toBe('file');
				done();
			}).catch(function(e) {
				console.log(e);
				done();
			});
		});

		it('Should get full path from base', function(done) {
			service.baseDir(process.cwd() + '/spec/resources/base/');
			service.directory('folder1').then(function(directory) {
				expect(directory.name).toBe('folder1');
				expect(directory.path).toBe('/folder1');
				expect(directory.type).toBe('folder');

				var files = directory.children;
				expect(files.length).toBe(2);
				expect(files[0].name).toBe('test2.raml');
				expect(files[0].path).toBe('/folder1/test2.raml');
				expect(files[0].type).toBe('file');
				expect(files[1].name).toBe('test3.raml');
				expect(files[1].path).toBe('/folder1/test3.raml');
				expect(files[1].type).toBe('file');
				done();
			}).catch(function(e) {
				console.log(e);
				done();
			});
		});

		// it('Should excluide not RAML files', function(done) {
		// 	service.baseDir(process.cwd() + '/spec/resources/base/folder1');
		// 	service.directory('').then(function(directory) {
		// 		var files = directory.children;
		// 		expect(files.length).toBe(2);
		// 		done();
		// 	}).catch(function(e) {
		// 		console.log(e);
		// 		done();
		// 	});
		// });

		it('Should excluide hidden folders', function(done) {
			service.baseDir(process.cwd() + '/spec/resources/base/folder1');
			service.directory('').then(function(directory) {
				var files = directory.children;
				expect(files.length).toBe(2);
				done();
			}).catch(function(e) {
				console.log(e);
				done();
			});
		});

		it('Should load children folders', function(done) {
			service.baseDir(process.cwd() + '/spec/resources/base/');
			service.directory('').then(function(directory) {
				var files = directory.children;
				expect(files.length).toBe(2);
				expect(files[0].name).toBe('folder1');
				expect(files[0].children).toBeDefined();
				expect(files[0].children.length).toBe(2);
				done();
			}).catch(function(e) {
				console.log(e);
				done();
			});
		});

	});

	describe('service.load operations', function() {
		it('Should load content of a file', function(done) {
			service.baseDir(process.cwd() + '/spec/resources/base');
			
			service.load('test1.raml').then(function(content) {
				expect(content).toBe('#%RAML 0.8');
				done();
			}).catch(function(err) {
				console.log(err);
				done();
			});
		});

		it('Should fail when file not exist or is not a raml file', function(done) {
			service.baseDir(process.cwd() + '/spec/resources/base');
			
			service.load('test').then(function(content) {
			
			}).catch(function(err) {
				expect(err.code).toBe('ENOENT');
				done();
			});
		});
	});

	describe('service.save and service.createFolder operations', function() {
		it('Should persist content of a file', function(done) {
			service.baseDir(process.cwd() + '/spec/resources/tmp');

			spyOn(fs,'writeFile').andCallFake(function(path, content, opts, cb) {
				cb(null);
			});

			var content = '{test:"hola"}'
			service.save('test1.raml', content).then(function() {
				expect(fs.writeFile).toHaveBeenCalledWith(process.cwd() + '/spec/resources/tmp/test1.raml', content, 'utf-8', jasmine.any(Function));
				done();
			});


		});

		it('Should create a folder', function(done) {
			service.baseDir(process.cwd() + '/spec/resources/tmp');

			spyOn(fs,'mkdir').andCallFake(function(path, cb) {
				cb(null);
			});

			service.createFolder('toRemove').then(function() {
				expect(fs.mkdir).toHaveBeenCalledWith(process.cwd() + '/spec/resources/tmp/toRemove',jasmine.any(Function));
				done();
			});
		});
	});
	

});