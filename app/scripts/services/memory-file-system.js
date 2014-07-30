(function () {
  'use strict';

  /**
   * Get the current created timestamp.
   *
   * @return {Boolean}
   */
  var now = function () {
    return Math.round(Date.now() / 1000);
  };

  angular.module('fs')
    /**
     * Store the in-memory file system as a value in angular.
     *
     * @type {Object}
     */
    .value('FS_MEMORY', {
      name: '',
      type: 'folder',
      meta: {
        created: now()
      },
      children: {}
    })
    /**
     * Create an in-memory file storage system.
     */
    .factory('memoryFileSystem', function ($q, FS_MEMORY) {
      var factory = {};

      /**
       * Assert that the path is valid.
       *
       * @param {String} path
       */
      var wrap = function (fn) {
        return function (path) {
          if (path[0] !== '/') {
            return $q.reject(new Error('Path must start with "/"'));
          }

          return fn.apply(this, arguments);
        };
      };

      /**
       * Sanitize and return all the path parts of a string.
       *
       * @param  {String} path
       * @return {Array}
       */
      var getPathParts = function (path) {
        path = path.toLowerCase().replace(/\/+/g, '/').replace(/^\/|\/$/g, '');

        return path ? path.split('/') : [];
      };

      /**
       * Get the directory by following a path.
       *
       * @param  {String} path
       * @return {Object}
       */
      var getDirectory = function (path) {
        var directory = FS_MEMORY;
        var parts     = Array.isArray(path) ? path : getPathParts(path);

        parts.every(function (part) {
          return directory.type === 'folder' &&
            (directory = directory.children[part]);
        });

        return directory && directory.type === 'folder' ? directory : null;
      };

      /**
       * Retrieve a directory in the expected format.
       *
       * @param  {String} path
       * @return {$q}
       */
      factory.directory = wrap(function (path) {
        var deferred  = $q.defer();
        var parts     = getPathParts(path);
        var directory = getDirectory(parts);

        // TODO: Work out the format it expects here.
        if (directory) {
          var output = (function sanitize (obj, parts) {
            var output = {
              path: ['', parts].join('/'),
              type: obj.type,
              meta: obj.meta,
              name: obj.name,
              children: []
            };

            if (obj.type === 'folder') {
              Object.keys(obj.children).map(function (name) {
                output.children.push(
                  sanitize(obj.children[name], parts.concat(name))
                );
              });
            }

            return output;
          })(directory, parts);

          deferred.resolve(output);
        } else {
          deferred.reject('No directory exists at "' + path + '"');
        }

        return deferred.promise;
      });

      /**
       * Save a file into the file system.
       *
       * @param  {String} path
       * @param  {String} content
       * @return {$q}
       */
      factory.save = wrap(function (path, content) {
        var deferred  = $q.defer();
        var directory = getDirectory(path.replace(/\/[^\/]*$/, ''));
        var filename  = path.replace(/^.*\//, '').toLowerCase();

        if (directory) {
          directory.children[filename] = {
            type:    'file',
            name:    filename,
            content: content,
            meta:    { created: now() }
          };

          deferred.resolve(content);
        } else {
          deferred.reject('Folder does not exist');
        }

        return deferred.promise;
      });

      /**
       * Load a single file from the specified path.
       *
       * @param  {String} path
       * @return {$q}
       */
      factory.load = wrap(function (path) {
        var deferred  = $q.defer();
        var parts     = getPathParts(path);
        var filename  = parts.pop();
        var directory = getDirectory(parts);
        var file      = directory && directory.children[filename];

        if (file && file.type === 'file') {
          deferred.resolve(file.content);
        } else {
          deferred.reject(new Error('File does not exist at "' + path + '"'));
        }

        return deferred.promise;
      });

      // TODO: Implement if ever needed IRL.
      factory.createFolder = function () {};
      factory.remove = function () {};
      factory.rename = function () {};

      return factory;
    });
})();
