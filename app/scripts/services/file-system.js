'use strict';

function FileSystem() { }

FileSystem.prototype = {
    /**
     *
     * Path
     * ----
     *
     * A path is an string that represents a location in a File System. A path is composed of path parts:
     *  * A Path Part is expressed by the following regular expression: [A-Za-z\-\._0-9]+.
     *  * Path Parts are case sensitive: 'hello' and 'Hello' are different Path parts.
     *
     * A valid path is:
     *  * The root path '/' that represents the topmost of the hierachy.
     *  * A path that is derived from the root path and appending Path Parts separated by '/'. Each of the Path Parts that
     *    are added are known as children of the previous path. The previous path is called parent path.
     *
     *
     * If a given nested path exists, after substracting the last part is should be a valid path too. That means that all
     * the ancestors of a given path exists. For instance, if we have path /a/b/c/d then, /a/b/c, /a/b/, /a/ and / must exist.
     * If a path does not have a trailing '/', a '/' is prepended to it.
     *
     * Entry
     * -----
     *
     * An Entry is a data structure with the following keys:
     *
     *  name: An string containing the last path part of the full path.
     *  fullpath: The path of the entry that represents it unequivocally.
     *  type: Flag that can be set to 'file' or 'folder' that represents what kind of entry is.
     *  children: If the type of the entry is 'folder' it may contain the children attribute. This attribute is an array of
     *    Entries that represents the content of that folder.
     *
     *  Examples:
     *
     *  [{
     *    name:       "my.raml",
     *    fullpath:   "/payments-api/my.raml",
     *    type:       "file"
     *  }]
     *
     *  [{
     *    name:       "examples",
     *    fullpath:   "/payments-api/examples",
     *    type:       "folder",
     *    children: [{
     *      name:       "json",
     *      fullpath:   "/payments-api/examples/json",
     *      type:       "folder"
     *      children:   [{
     *        name:       "user.json",
     *        fullpath:   "/payments-api/examples/json/user.json",
     *        type:       "file"
     *      }]
     *    }]
     *   },
     *   {
     *      name:       "xml",
     *      fullpath:   "/payments-api/examples/xml",
     *      type:       "folder"
     *    }]
     *  }]
     *
     * Files
     * -----
     *
     * Content of files is encoded in UTF-8.
     */

    /**
     * Returns a promise that contains the list the Entries that are contained starting from that fullpath.
     *
     * If the method is applied to a fullpath of type file an Entry with that data is fulfilled in the promise.
     */
    list: function (fullpath) {
      throw 'Not implemented: FileSystem list invoked with [fullpath=' + fullpath + ']';
    },

    /**
     * Saves content to a given file to the given fullpath. It creates the necessary folders if needed.
     *
     * Returns a promise that fulfills on success or rejects on fail.
     */
    save: function (fullpath, content) {
      throw 'Not implemented: FileSystem save invoked with [fullpath=' + fullpath + '] and [content=' + content + ']';
    },

    /**
     * Creates a folder. Creates all the required previous folder levels if needed.
     *
     * Returns a promise that fulfills on success or rejects on fail.
     */
    createFolder: function (fullpath) {
      throw 'Not implemented: FileSystem createFolder invoked with [fullpath=' + fullpath + ']';
    },

    /**
     * Returns a promise that contains the content of the file found at fullpath. Fails if the fullpath does not exist or is a folder.
     */
    load: function (fullpath) {
      throw 'Not implemented: FileSystem load invoked with [fullpath=' + fullpath + ']';
    },

    /**
     * Removes a fullpath and all the nested children of the hierarchy.
     *
     * Returns a promise that fulfills on success or rejects on fail.
     */
    remove: function (fullpath) {
      throw 'Not implemented: FileSystem remove invoked with [fullpath=' + fullpath + ']';
    }
};

angular.module('fs')
  .factory('fileSystem', function ($injector, $window, config) {
    var fsFactory = config.get('fsFactory');

    if (!fsFactory) {
      fsFactory = 'localStorageFileSystem';

      config.set('fsFactory', fsFactory);
    }

    return $injector.get(fsFactory);
  })
;
