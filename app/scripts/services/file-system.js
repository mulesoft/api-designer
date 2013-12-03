'use strict';

/*

Paths
-----

A Path Part is expressed by the following regular expression: [A-Za-z][0-9]+. Path Parts are case sensitive: 'hello' and 'Hello' are different Path parts.

A valid path is:
    * The root path '/' that represents the topmost of the hierachy.
    * A path that is derived from the root path and appending Path Parts separated by '/'. Each of the Path Parts that are added are known as children of the previous path. The previous path is called parent path.

If a given nested path exists, after substracting the last part is should be a valid path too. That means that all the ancestors of a given path exists. For instance, if we have path /a/b/c/d then, /a/b/c, /a/b/, /a/ and / must exist.

There are two types of nodes in paths:
  * Folders: Folders are nodes where there can be other folders or files.
  * Files: Are leaf nodes that can store text content encoded in UTF-8.

*/

function FileSystem() { }

FileSystem.prototype = {
    /**
     * Returns a promise that contains the list of all the paths that are contained starting from that path.
     *
     * includeFolders flag determines whether the folders should be included in the listing or not.
     */
    list: function (path, includeFolders) {
      throw 'Not implemented: FileSystem list invoked with [path=' + path + '] and [includeFolders=' + includeFolders + ']';
    },

    /**
     * Saves content to a given file to the given path.
     *
     * The hierarchy of folders where the file is located must exist or it will fail.
     */
    save: function (path, content) {
      throw 'Not implemented: FileSystem save invoked with [path=' + path + '] and [content=' + content + ']';
    },

    /**
     * Creates a folder. If the recursive flag is set to true, creates all the required previous folder levels.
     */
    createFolder: function (path, recursive) {
      throw 'Not implemented: FileSystem createFolder invoked with [path=' + path + '] and [recursive=' + recursive+ ']';
    },

    /**
     * Returns a promise that contains the content of the file found at path
     */
    load: function (path) {
      throw 'Not implemented: FileSystem load invoked with [path=' + path + ']';
    },

    /**
     * Removes a path. If the recursive flag is true it retuns all the nested children of the hierarchy
     */
    remove: function (path, recursive) {
      throw 'Not implemented: FileSystem remove invoked with [path=' + path + '] and [recursive=' + recursive + ']';
    }
};

angular.module('fs')
  .factory('fileSystem', function ($injector, $window, config) {
    var fsFactory = config.get('fsFactory');

    if (!fsFactory) {
      fsFactory = 'localStorageFileSystem';

      // if ($window.location.hostname === 'j0hnqa.mulesoft.org') {
      //   fsFactory = 'remoteFileSystem';
      // }

      config.set('fsFactory', fsFactory);
    }

    return $injector.get(fsFactory);
  })
;
