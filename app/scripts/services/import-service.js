(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .service('importService', function importServiceFactory (
      $q,
      $window,
      ramlRepository,
      importServiceConflictModal
    ) {
      var self = this;

      /**
       * Merge a file with the specified directory.
       *
       * @param  {Object}  directory
       * @param  {File}    file
       * @return {Promise}
       */
      self.mergeFile = function (directory, file) {
        // Import every other file as normal.
        if (!isZip(file)) {
          return self.importFile(directory, file);
        }

        return readFileAsText(file)
          .then(function (contents) {
            return self.mergeZip(directory, contents);
          });
      };

      /**
       * Merge files into the specified directory.
       *
       * @param  {Object}   directory
       * @param  {FileList} files
       * @return {Promise}
       */
      self.mergeFileList = function (directory, files) {
        var imports = Array.prototype.map.call(files, function (file) {
          return function () {
            return self.mergeFile(directory, file);
          };
        });

        return promiseChain(imports);
      };

      /**
       * Import a single entry into the file system.
       *
       * @param  {Object}                     directory
       * @param  {(DirectoryEntry|FileEntry)} entry
       * @return {Promise}
       */
      self.importEntry = function (directory, entry) {
        var deferred = $q.defer();

        if (entry.isFile) {
          entry.file(function (file) {
            var path = ramlRepository.join(directory.path, entry.fullPath);

            return importFileToPath(directory, path, file)
              .then(deferred.resolve, deferred.reject);
          }, deferred.reject);
        } else {
          var reader = entry.createReader();

          reader.readEntries(function (entries) {
            var imports = entries.filter(function (entry) {
              return canImport(entry.name);
            }).map(function (entry) {
              return function () {
                return self.importEntry(directory, entry);
              };
            });

            return promiseChain(imports)
              .then(deferred.resolve, deferred.reject);
          });
        }

        return deferred.promise;
      };

      /**
       * Import a single item into the file system.
       *
       * @param  {Object}           directory
       * @param  {DataTransferItem} item
       * @return {Promise}
       */
      self.importItem = function (directory, item) {
        if (item.webkitGetAsEntry) {
          return self.importEntry(directory, item.webkitGetAsEntry());
        }

        return self.importFile(directory, item.getAsFile());
      };

      /**
       * Import a single file into the file system.
       *
       * @param  {Object}  directory
       * @param  {File}    file
       * @return {Promise}
       */
      self.importFile = function (directory, file) {
        return importFileToPath(directory, file.name, file);
      };

      /**
       * Import using an event object.
       *
       * @param  {Object}  directory
       * @param  {Object}  e
       * @return {Promise}
       */
      self.importFromEvent = function (directory, e) {
        // Handle items differently since Chrome has support for folders.
        if (e.dataTransfer.items) {
          return self.importItemList(directory, e.dataTransfer.items);
        }

        return self.importFileList(directory, e.dataTransfer.files);
      };

      /**
       * Import an array of items into the file system.
       *
       * @param  {Object}               directory
       * @param  {DataTransferItemList} items
       * @return {Promise}
       */
      self.importItemList = function (directory, items) {
        var imports = Array.prototype.map.call(items, function (item) {
          return function () {
            return self.importItem(directory, item);
          };
        });

        return promiseChain(imports);
      };

      /**
       * Import an array of files into the file system.
       *
       * @param  {Object}   directory
       * @param  {FileList} files
       * @return {Promise}
       */
      self.importFileList = function (directory, files) {
        var imports = Array.prototype.map.call(files, function (file) {
          return function () {
            return self.importFile(directory, file);
          };
        });

        return promiseChain(imports);
      };

      /**
       * Create a file in the filesystem.
       *
       * @param  {Object}  directory
       * @param  {String}  name
       * @param  {String}  contents
       * @return {Promise}
       */
      self.createFile = function (directory, name, contents) {
        return self.checkExistence(directory, name)
          .then(function (option) {
            if (option === importServiceConflictModal.SKIP_FILE) {
              return;
            }

            if (option === importServiceConflictModal.KEEP_FILE) {
              var altname = altFilename(directory, name);

              return createFileFromContents(directory, altname, contents);
            }

            if (option === importServiceConflictModal.REPLACE_FILE) {
              var path = ramlRepository.join(directory.path, name);
              var file = ramlRepository.getByPath(path);

              file.contents = contents;

              return;
            }

            return createFileFromContents(directory, name, contents);
          });
      };

      /**
       * Create a directory in the filesystem.
       *
       * @param  {Object}  directory
       * @param  {String}  name
       * @return {Promise}
       */
      self.createDirectory = function (directory, name) {
        return ramlRepository.createDirectory(directory, name);
      };

      /**
       * Merge a zip with a directory in the file system.
       *
       * @param  {Object}  directory
       * @param  {String}  contents
       * @return {Promise}
       */
      self.mergeZip = function (directory, contents) {
        var zip   = new $window.JSZip(contents);
        var files = removeCommonFilePrefixes(sanitizeZipFiles(zip.files));

        return importZipFiles(directory, files);
      };

      /**
       * Import a zip file into the current directory.
       *
       * @param  {Object}  directory
       * @param  {String}  contents
       * @return {Promise}
       */
      self.importZip = function (directory, contents) {
        var zip   = new $window.JSZip(contents);
        var files = sanitizeZipFiles(zip.files);

        return importZipFiles(directory, files);
      };

      /**
       * Check whether a file exists and make a decision based on that.
       *
       * @param  {Object}  directory
       * @param  {String}  name
       * @return {Promise}
       */
      self.checkExistence = function (directory, name) {
        var path = ramlRepository.join(directory.path, name);

        if (!pathExists(path)) {
          return $q.when(null);
        }

        return importServiceConflictModal.open(path);
      };

      /**
       * Import a single file at specific path.
       *
       * @param  {Object}  directory
       * @param  {String}  path
       * @param  {File}    file
       * @return {Promise}
       */
      function importFileToPath (directory, path, file) {
        return readFileAsText(file)
          .then(function (contents) {
            if (isZip(file)) {
              var dirname = path.replace(/[\\\/][^\\\/]*$/, '');

              return self.createDirectory(directory, dirname)
                .then(function (directory) {
                  return self.importZip(directory, contents);
                });
            }

            return self.createFile(directory, path, contents);
          });
      }

      /**
       * Check whether a file is a zip.
       *
       * @param  {File}    file
       * @return {Boolean}
       */
      function isZip (file) {
        // Can't check `file.type` as it's empty when read from a `FileEntry`.
        return (/\.zip$/i).test(file.name);
      }

      /**
       * Import files from the zip object.
       *
       * @param  {Object}  directory
       * @param  {Object}  files
       * @return {Promise}
       */
      function importZipFiles (directory, files) {
        var imports = Object.keys(files)
          .filter(canImport)
          .map(function (name) {
            return function () {
              // Directories are stored under the files object.
              if (/\/$/.test(name)) {
                return self.createDirectory(directory, name);
              }

              return self.createFile(directory, name, files[name].asText());
            };
          });

        return promiseChain(imports);
      }

      /**
       * Sanitize a zip file object and remove unwanted metadata.
       *
       * @param  {Object} originalFiles
       * @return {Object}
       */
      function sanitizeZipFiles (originalFiles) {
        var files = {};

        Object.keys(originalFiles).forEach(function (name) {
          if (/^__MACOSX\//.test(name)) {
            return;
          }

          files[name] = originalFiles[name];
        });

        return files;
      }

      /**
       * Remove the common file prefix from a files object.
       *
       * @param  {Object} prefixedFiles
       * @return {String}
       */
      function removeCommonFilePrefixes (prefixedFiles) {
        // Sort the file names in order of length to get the common prefix.
        var prefix = Object.keys(prefixedFiles)
          .map(function (name) {
            if (!/[\\\/]/.test(name)) {
              return [];
            }

            return name.replace(/[\\\/][^\\\/]*$/, '').split(/[\\\/]/);
          })
          .reduce(function (prefix, name) {
            // Iterate over each part and check the prefix matches. If a part
            // does not match, return everything before it as the new prefix.
            for (var i = 0; i < prefix.length; i++) {
              if (name[i] !== prefix[i]) {
                return name.slice(0, i);
              }
            }

            return prefix;
          })
          .join('/');

        // Return the file object with the same file names.
        if (!prefix) {
          return angular.extend({}, prefixedFiles);
        }

        var files = {};

        // Iterate over the original files and create a new object.
        Object.keys(prefixedFiles).forEach(function (name) {
          var newName = name.substr(prefix.length + 1);

          // If no text is left, it must have been the root directory.
          if (newName) {
            files[newName] = prefixedFiles[name];
          }
        });

        return files;
      }

      /**
       * Check whether a certain file should be imported.
       *
       * @param  {String}  name
       * @return {Boolean}
       */
      function canImport (name) {
        return !/(?:^|[\/\\])\./.test(name);
      }

      /**
       * Check whether the path already exists.
       *
       * @param  {String}  path
       * @return {Boolean}
       */
      function pathExists (path) {
        return !!ramlRepository.getByPath(path);
      }

      /**
       * Create a file in the filesystem without checking prior existence.
       *
       * @param  {Object}  directory
       * @param  {String}  name
       * @param  {String}  contents
       * @return {Promise}
       */
      function createFileFromContents (directory, name, contents) {
        return ramlRepository.createFile(directory, name)
          .then(function (file) {
            file.contents = contents;

            return file;
          });
      }

      /**
       * Generate an alternative file name for storage.
       *
       * @param  {Object} directory
       * @param  {String} name
       * @return {String}
       */
      function altFilename (directory, name) {
        var path;
        var index     = 0;
        var extIndex  = name.lastIndexOf('.');
        var basename  = extIndex > -1 ? name.substr(0, extIndex) : name;
        var extension = extIndex > -1 ? name.substr(extIndex) : '';

        do {
          var filename = basename + '-' + (++index) + extension;

          path = ramlRepository.join(directory.path, filename);
        } while (pathExists(path));

        return path;
      }

      /**
       * Read a file object as a text file.
       *
       * @param  {File}    file
       * @return {Promise}
       */
      function readFileAsText (file) {
        var deferred = $q.defer();
        var reader   = new $window.FileReader();

        reader.onload = function () {
          return deferred.resolve(reader.result);
        };

        reader.onerror = function () {
          return deferred.reject(reader.error);
        };

        reader.readAsBinaryString(file);

        return deferred.promise;
      }

      /**
       * Chain promises one after another.
       *
       * @param  {Array}   promises
       * @return {Promise}
       */
      function promiseChain (promises) {
        return promises.reduce(function (promise, chain) {
          return promise.then(chain);
        }, $q.when());
      }
    });
})();
