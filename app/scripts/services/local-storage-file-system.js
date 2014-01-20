'use strict';

angular.module('fs')
  .constant('LOCAL_PERSISTENCE_KEY','localStorageFilePersistence')
  .constant('FOLDER', 'folder')
  .factory('localStorageHelper', function (LOCAL_PERSISTENCE_KEY) {
    return {
      forEach: function(fn) {
        var i, key;

        for (i = 0; i < localStorage.length; i++) {
          key = localStorage.key(i);
          // A key is a local storage file system entry if it starts 
          //with LOCAL_PERSISTENCE_KEY + '.'
          if (key.indexOf(LOCAL_PERSISTENCE_KEY + '.') === 0) {
            fn(JSON.parse(localStorage.getItem(key)));
          }
        }
      },
      has: function(path) {
        var has = false;
        path = path || '/';
        this.forEach(function(entry) {
          if(entry.path.toLowerCase() === path.toLowerCase()){
            has = true;
          }
        });
        return has;
      },
      set: function(path, content) {
        localStorage.setItem(
          LOCAL_PERSISTENCE_KEY + '.' + path,
          JSON.stringify(content)
        );
      },
      get: function(path) {
        return JSON.parse(localStorage.getItem(LOCAL_PERSISTENCE_KEY + '.' + path));
      },
      remove: function(path) {
        localStorage.removeItem(LOCAL_PERSISTENCE_KEY + '.' + path);
      }
    };
  })
  .factory('localStorageFileSystem', function ($q, $timeout, localStorageHelper, FOLDER) {
    function fileNotFoundMessage(path) {
      return 'file with path="' + path + '" does not exist';
    }

    function addChildren(entry, fn) {
      if(entry.type === FOLDER) {
        entry.children = fn(entry.path);
      }
    }
    function findFolder(path) {
      var entries = [];
      localStorageHelper.forEach(function (entry) {
        if (entry.path.toLowerCase() === path.toLowerCase()) {
          addChildren(entry, findFiles);
          entries.push(entry);
        }
      });
      return entries.length > 0 ? entries[0] : null;
    }
    function findFiles(path) {
      if(path.lastIndexOf('/') !== path.length - 1) {
        path += '/';
      }

      var entries = [];
      localStorageHelper.forEach(function (entry) {
        if (entry.path.toLowerCase() !== path.toLowerCase() &&
            entry.path.indexOf(path + entry.name) === 0) {
          addChildren(entry, findFiles);
          entries.push(entry);
        }
      });
      return entries;
    }

    /**
     *
     * Save in localStorage entries.
     *
     * File structure are objects that contain the following attributes:
     * * path: The full path (including the filename).
     * * content: The content of the file (only valid for files).
     * * isFolder: A flag that indicates whether is a folder or file.
     */
    var service = {};
    var delay   = 500;

    function validatePath(path) {
      if (path.indexOf('/') !== 0) {
        return {valid: false, reason: 'Path should start with "/"'};
      }
      return {valid: true};
    }

    function isValidParent(path) {
      var parent = path.slice(0, path.lastIndexOf('/'));
      if(!localStorageHelper.has(parent) && parent !== '') {
        return false;
      }
      return true;
    }

    function hasChildrens(path) {
      var has = false;
      localStorageHelper.forEach(function (entry) {
        if (entry.path.toLowerCase() !== path.toLowerCase() &&
            entry.path.indexOf(path) === 0) {
          has = true;
        }
      });
      return has;
    }

    function extractNameFromPath(path) {
      var pathInfo = validatePath(path);

      if (!pathInfo.valid) {
        throw 'Invalid Path!';
      }

      // When the path is ended in '/'
      if (path.lastIndexOf('/') === path.length - 1) {
        path = path.slice(0, path.length - 1);
      }

      return path.slice(path.lastIndexOf('/') + 1);
    }

    /**
     * List files found in a given path.
     */
    service.directory = function (path) {
      var deferred = $q.defer();

      $timeout(function () {
        var isValidPath = validatePath(path);

        if (!isValidPath.valid) {
          deferred.reject(isValidPath.reason);
          return deferred.promise;
        }

        if(!localStorageHelper.has('/')) {
          localStorageHelper.set(path, {
              path: '/',
              name: '/',
              type: 'folder',
              meta: {
                'created': Math.round(new Date().getTime()/1000.0)
              }
            });
        }

        deferred.resolve(findFolder(path));
      }, delay);

      return deferred.promise;
    };

    /**
     * Persist a file to an existing folder.
     */
    service.save = function (path, content) {
      var deferred = $q.defer();

      $timeout(function () {
        var name = extractNameFromPath(path);
        var entry = localStorageHelper.get(path);

        if(!isValidParent(path)){
          deferred.reject('Parent folder does not exists');
          return deferred.promise;
        }

        var file = {};
        if (entry) {
          if (entry.type === FOLDER) {
            deferred.reject('file has the same name as a folder');
            return deferred.promise;
          }
          entry.content = content;
          entry.meta.lastUpdated = Math.round(new Date().getTime()/1000.0);
          file = entry;
        } else {
          file = {
            path: path,
            name: name,
            content: content,
            type: 'file',
            meta: {
              'created': Math.round(new Date().getTime()/1000.0)
            }
          };
        }

        localStorageHelper.set(path, file);
        deferred.resolve();

      }, delay);

      return deferred.promise;
    };

    /**
     * Create the folders contained in a path.
     */
    service.createFolder = function (path) {
      var deferred = $q.defer();
      var isValidPath = validatePath(path);

      if (!isValidPath.valid) {
        deferred.reject(isValidPath.reason);
        return deferred.promise;
      }

      if(localStorageHelper.has(path)) {
        deferred.reject('Folder already exists');
        return deferred.promise;
      }

      var parent = path.slice(0, path.lastIndexOf('/'));
      if(!localStorageHelper.has(parent)) {
        deferred.reject('Parent folder does not exists');
        return deferred.promise;
      }

      $timeout(function () {

        localStorageHelper.set(path, {
            path: path,
            name: extractNameFromPath(path),
            type: 'folder',
            meta: {
              'created': Math.round(new Date().getTime()/1000.0)
            }
          });

        deferred.resolve();
      }, delay);


      return deferred.promise;
    };

    /**
     * Loads the content of a file.
     */
    service.load = function (path) {
      var deferred = $q.defer();

      $timeout(function () {

        var entry = localStorageHelper.get(path);
        if(entry && entry.type === 'file') {
          deferred.resolve(localStorageHelper.get(path).content);
        } else {
          deferred.reject(fileNotFoundMessage(path));
        }

      }, delay);

      return deferred.promise;
    };

    /**
     * Removes a file or directory.
     */
    service.remove = function (path) {
      var deferred = $q.defer();

      $timeout(function () {
        var entry = localStorageHelper.get(path);

        if(entry &&
           entry.type === FOLDER &&
           hasChildrens(path)) {
          deferred.reject('folder not empty');
          return deferred.promise;
        }

        localStorageHelper.remove(path);
        deferred.resolve();
      }, delay);

      return deferred.promise;
    };

    /**
     * Ranames a file or directory
     */
    service.rename = function (source, destination) {
      var deferred = $q.defer();

      $timeout(function(){
        var sourceEntry = localStorageHelper.get(source);

        if(!sourceEntry) {
          deferred.reject('Source file or folder does not exists.');
          return deferred.promise;
        }

        var destinationEntry = localStorageHelper.get(destination);
        if(destinationEntry) {
          deferred.reject('File or folder already exists.');
          return deferred.promise;
        }

        if(!isValidParent(destination)) {
          deferred.reject('Destination folder does not exist.');
          return deferred.promise;
        }

        sourceEntry.path = destination;
        sourceEntry.name = extractNameFromPath(destination);

        localStorageHelper.remove(destination);
        localStorageHelper.remove(source);
        localStorageHelper.set(destination, sourceEntry);

        if(sourceEntry.type === FOLDER) {
          // if(!isValidPath(destination)) {
          //   deferred.reject('Destination is not a valid folder');
          //   return deferred.promise;
          // }
          //move all child items
          localStorageHelper.forEach(function (entry) {
            if (entry.path.toLowerCase() !== source.toLowerCase() &&
                entry.path.indexOf(source) === 0) {
              
              var newPath = destination + entry.path.substring(source.length);
              localStorageHelper.remove(entry.path);
              entry.path = newPath;
              localStorageHelper.set(newPath, entry);
            }
          });
        }

        deferred.resolve();
      }, delay);

      return deferred.promise;
    };

    return service;
  });
