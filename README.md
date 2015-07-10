# API Designer

[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/mulesoft/api-designer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Build Status](https://travis-ci.org/mulesoft/api-designer.png)](https://travis-ci.org/mulesoft/api-designer)
[![Dependency Status](https://david-dm.org/mulesoft/api-designer.png)](https://david-dm.org/mulesoft/api-designer#info=dependencies)
[![DevDependency Status](https://david-dm.org/mulesoft/api-designer/dev-status.png)](https://david-dm.org/mulesoft/api-designer#info=devDependencies)

**API Designer** is a standalone/embeddable editor for [RAML](http://raml.org) (RESTful API Modeling Language) written in JavaScript using Angular.JS. By default, the editor uses an in-browser filesystem stored in HTML5 Localstorage.

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
    <link rel="stylesheet" href="dist/styles/api-designer-vendor.css">
    <link rel="stylesheet" href="dist/styles/api-designer.css">
  </head>
  <body ng-app="ramlEditorApp">
    <raml-editor></raml-editor>
    <script src="dist/scripts/api-designer-vendor.js"></script>
    <script src="dist/scripts/api-designer.js"></script>
    <script>
      // This part is needed only if you want to provide your own Persistance Implementation
      // Angular Module must match "ramlEditorApp"
      angular.module('ramlEditorApp')
      .factory('MyFileSystem', function ($q, config, $rootScope) {
        var service = {};

        service.directory = function (path) {
          var deferred = $q.defer();
        
          // Your magic goes here:
           // Do deferred.resolve(data); to fulfull the promise or
           // deferred.reject(error); to reject it.
        
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
      })
      .run(function (MyFileSystem, config, $rootScope) {
        // Set MyFileSystem as the filesystem to use
        config.set('fsFactory', 'MyFileSystem');
        
        // In case you want to send notifications to the user
        // (for instance, that he must login to save).
        // The expires flags means whether
        // it should be hidden after a period of time or the
        // user should dismiss it manually.
        $rootScope.$broadcast('event:notification',
          {message: 'File saved.', expires: true});

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

## Development

Install global tools

```
npm install -g grunt-cli
npm install -g bower
npm install -g karma # Optional for running the test suite
```

Install node modules

```
npm install 
```

Install bower modules

```
bower install
```

Install webdriver required to run `localScenario` task

```
node_modules/grunt-protractor-runner/node_modules/protractor/bin/webdriver-manager update
```

On some systems you need add `node` in front of the line above

```
node node_modules/grunt-protractor-runner/node_modules/protractor/bin/webdriver-manager update
```

Run the application locally

```
grunt server
```

Run the test suite

```
grunt test
```

Build the application

```
grunt
```

## Contributor's Agreement

To contribute source code to this repository, please read our [contributor's agreement](http://www.mulesoft.org/legal/contributor-agreement.html), and then execute it by running this notebook and following the instructions: https://api-notebook.anypoint.mulesoft.com/notebooks/#380297ed0e474010ff43 

## License

Copyright 2013 MuleSoft, Inc. Licensed under the Common Public Attribution License (CPAL), Version 1.0
