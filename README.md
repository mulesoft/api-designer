# API Designer

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/mulesoft/api-designer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![npm version](https://badge.fury.io/js/api-designer.svg)](https://badge.fury.io/js/api-designer) [![Bower version](https://badge.fury.io/bo/api-designer.svg)](https://badge.fury.io/bo/api-designer)

**API Designer** is a standalone/embeddable editor for [RAML](http://raml.org) (RESTful API Modeling Language) written in JavaScript using Angular.JS. By default, the editor uses an in-browser filesystem stored in HTML5 Localstorage.

## Examples of designing RAML with API Designer in the Wild

* [Remote Medicine API](http://static-anypoint-mulesoft-com.s3.amazonaws.com/API_examples_notebooks/raml-design4.html)
* [Notes API](http://static-anypoint-mulesoft-com.s3.amazonaws.com/API_examples_notebooks/raml-design3.html)
* [Congo API for Drone Delivery](http://static-anypoint-mulesoft-com.s3.amazonaws.com/API_examples_notebooks/raml-design2.html)

## API Designer online

There is an online preview version of the API Designer, check it out a [different branch](http://mulesoft.github.io/api-designer/).

## Running Locally

```
npm install -g api-designer

api-designer
```

This will start a local designer instance using the in-browser filesystem.

## Embedding

The following example details how to embed the API Designer:

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>My App</title>
  <link rel="stylesheet" href="styles/api-designer-vendor.css">
  <link rel="stylesheet" href="styles/api-designer.css">
</head>
<body ng-app="ramlEditorApp">
<raml-editor></raml-editor>
<script src="scripts/api-designer-parser.js"></script>
<script>
  if (window.Worker) {
    // enable optional web worker for raml parsing 
    window.RAML.worker = new Worker('scripts/api-designer-worker.js#parser=./api-designer-parser.js&proxy=/proxy/');
  }
</script>
<script src="scripts/api-designer-vendor.js"></script>
<script src="scripts/api-designer.js"></script>
<script>
  // This part is needed only if you want to provide your own Persistance Implementation
  // Angular Module must match "ramlEditorApp"

  function myFileSystem($q, config, $rootScope) {
    var service = {};

    service.directory = function (path) {
      var deferred = $q.defer();

      // Your magic goes here:
      // Do deferred.resolve(data); to fulfull the promise or
      // deferred.reject(error); to reject it.

      // In case you want to send notifications to the user
      // (for instance, that he must login to save).
      // The expires flags means whether
      // it should be hidden after a period of time or the
      // user should dismiss it manually.
      $rootScope.$broadcast('event:notification', {message: 'Loading directory' + path, expires: true});

      return deferred.promise;
    };

    service.load = function (path, name) {
      var deferred = $q.defer();

      // Your magic goes here:
      // Do deferred.resolve(data); to fulfull the promise or
      // deferred.reject(error); to reject it.

      return deferred.promise;
    };

    service.remove = function (path, name) {
      var deferred = $q.defer();

      // Your magic goes here:
      // Do deferred.resolve(data); to fulfull the promise or
      // deferred.reject(error); to reject it.

      return deferred.promise;
    };

    service.save = function (path, name, contents) {
      var deferred = $q.defer();

      // Your magic goes here:
      // Do deferred.resolve(data); to fulfull the promise or
      // deferred.reject(error); to reject it.

      return deferred.promise;
    };

    return service;
  }

  angular.module('ramlEditorApp')
    .config(function (fileSystemProvider) {
      // Set myFileSystem as the filesystem to use
      fileSystemProvider.setFileSystemFactory(myFileSystem);
    });
</script>
<style>
  html,
  body {
    height: 100%;
  }
</style>
</body>
</html>
```

## Contribution

If you want to contribute to this project, please read our [contribution guide](https://github.com/mulesoft/api-designer/blob/master/CONTRIBUTING.md) first.

## License

Copyright 2013 MuleSoft, Inc. Licensed under the Common Public Attribution License (CPAL), Version 1.0
