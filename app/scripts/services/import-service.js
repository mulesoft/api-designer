(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .service('importService', function importServiceFactory (
      $q,
      ramlRepository
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
        return readFileAsText(file)
          .then(function (contents) {
            if (isZip(file.name)) {
              return mergeZip(directory, contents);
            }

            return createFile(directory, file.name, contents);
          });
      };

      /**
       * Merge files into the specified directory.
       *
       * @param  {Object}   directory
       * @param  {FileList} files
       * @return {Promise}
       */
      self.mergeFiles = function (directory, files) {
        var imports = Array.prototype.map.call(files, function (file) {
          return self.mergeFile(directory, file);
        });

        return $q.all(imports);
      };

      /**
       * Import a single file into the file system.
       *
       * @param  {Object}  directory
       * @param  {File}    file
       * @return {Promise}
       */
      self.importFile = function (directory, file) {
        return readFileAsText(file)
          .then(function (contents) {
            if (isZip(file.name)) {
              return importZip(directory, contents);
            }

            return createFile(directory, file.name, contents);
          });
      };

      /**
       * Import an array of files into the file system.
       *
       * @param  {Object}   directory
       * @param  {FileList} files
       * @return {Promise}
       */
      self.importFiles = function (directory, files) {
        var imports = Array.prototype.map.call(files, function (file) {
          return self.importFile(directory, file);
        });

        return $q.all(imports);
      };

      /**
       * Check whether a file is a zip.
       *
       * @param  {String}  name
       * @return {Boolean}
       */
      function isZip (name) {
        return (/\.zip$/i).test(name);
      }

      /**
       * Merge a zip with a directory in the file system.
       *
       * @param  {Object}  directory
       * @param  {String}  contents
       * @return {Promise}
       */
      function mergeZip (directory, contents) {
        var zip   = new JSZip(contents);
        var files = removeCommonFilePrefixes(sanitizeZipFiles(zip.files));

        return importZipFiles(directory, files);
      }

      /**
       * Import a zip file into the current directory.
       *
       * @param  {Object}  directory
       * @param  {String}  contents
       * @return {Promise}
       */
      function importZip (directory, contents) {
        var zip   = new JSZip(contents);
        var files = sanitizeZipFiles(zip.files);

        return importZipFiles(directory, files);
      }

      /**
       * Import files from the zip object.
       *
       * @param  {Object}  directory
       * @param  {Object}  files
       * @return {Promise}
       */
      function importZipFiles (directory, files) {
        var promise = $q.when(true);

        Object.keys(files).filter(canImport).forEach(function (name) {
          promise = promise.then(function () {
            // Directories seem to be stored under the files object.
            if (/\/$/.test(name)) {
              return createDirectory(directory, name);
            }

            return createFile(directory, name, files[name].asText());
          });
        });

        return promise;
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
            return name.replace(/[\\\/][^\\\/]*$/, '').split(/[\\\/]/);
          })
          .reduce(function (prefix, name) {
            var len = prefix.length > name.length ? name.length : prefix.length;

            // Iterate over each part and find the common prefix.
            for (var i = 1; i < len; i++) {
              if (name.slice(0, i).join('/') !== prefix.slice(0, i).join('/')) {
                return name.slice(0, i - 1);
              }
            }

            return prefix;
          })
          .join('/');

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
        return !/[\/\\]\./.test(name);
      }

      /**
       * Create a file in the filesystem.
       *
       * @param  {String}  name
       * @param  {String}  contents
       * @return {Promise}
       */
      function createFile (directory, name, contents) {
        return ramlRepository.createFile(directory, name)
          .then(function (file) {
            file.contents = contents;

            return file;
          });
      }

      /**
       * Create a directory in the file system.
       *
       * @param  {String}  name
       * @return {Promise}
       */
      function createDirectory (directory, name) {
        return ramlRepository.createDirectory(directory, name);
      }

      /**
       * Read a file object as a text file.
       *
       * @param  {File}    file
       * @return {Promise}
       */
      function readFileAsText (file) {
        var deferred = $q.defer();
        var reader   = new FileReader();

        reader.onload = function () {
          return deferred.resolve(reader.result);
        };

        reader.onerror = function () {
          return deferred.reject(reader.error);
        };

        if (isZip(file.name)) {
          reader.readAsBinaryString(file);
        } else {
          reader.readAsText(file);
        }

        return deferred.promise;
      }
    });
})();
