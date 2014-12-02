# RAML Editor

[![Build Status](https://travis-ci.org/mulesoft/api-designer.png)](https://travis-ci.org/mulesoft/api-designer)
[![Dependency Status](https://david-dm.org/mulesoft/api-designer.png)](https://david-dm.org/mulesoft/api-designer#info=dependencies)
[![DevDependency Status](https://david-dm.org/mulesoft/api-designer/dev-status.png)](https://david-dm.org/mulesoft/api-designer#info=devDependencies)

This is a standalone/embeddable editor for [RAML](http://raml.org) (Restful Api Modeling language) written in JavaScript.
It's a fork with a file system persistence.

## Build and Run

Install global tools
```
npm install -g strongloop #Only for filesystem persistence
npm install -g grunt-cli
npm install -g bower
npm install -g karma # Optional for running the test suite
```

Install node modules in the main project and in raml-rest/ subproject
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

Run the rest server for filesystem persistence
```
slc run raml-rest/ #you can use --detach for detached mode
```

Changing angular service for filesystem persistence.
```
#open '/app/scripts/services/rest-file-system.js' and change configuration.
#original for default storage (browser local storage)
angular.module('fs')
    .factory('restFileSystem', function ($injector, config, $http) {
      return new FileSystem($http);
    }).run(function(config) {
      // config.set('fsFactory', 'restFileSystem');
      config.remove('fsFactory');
    });
#for filesystem persitence by rest service
angular.module('fs')
    .factory('restFileSystem', function ($injector, config, $http) {
      return new FileSystem($http);
    }).run(function(config) {
      config.set('fsFactory', 'restFileSystem');
      // config.remove('fsFactory');
    });

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

## Embedding

The following example details how to embed the API Designer:

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>My App</title>
    <link rel="stylesheet" href="styles/20dea081.main.css">
    <link href="//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css" rel="stylesheet">
  </head>
  <body ng-app="ramlEditorApp">
    <div class="container" ng-include="" src="'views/raml-editor-main.tmpl.html'"></div>

    <script src="scripts/d78281b9.vendor.js"></script>
    <script src="scripts/8a9fbe21.scripts.js"></script>
    <script>
      // This part is needed only if you want to provide your own Persistance Implementation
      // Angular Module must match "ramlEditorApp"
      angular.module('ramlEditorApp')
      .factory('MyFileSystem', function ($q, config, eventService) {
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
      .run(function (MyFileSystem, config, eventService) {
        // Set MyFileSystem as the filesystem to use
        config.set('fsFactory', 'MyFileSystem');
        
        // In case you want to send notifications to the user
        // (for instance, that he must login to save).
        // The expires flags means whether
        // it should be hidden after a period of time or the
        // user should dismiss it manually.
        eventService.broadcast('event:notification',
          {message: 'File saved.', expires: true});

      });

    </script>
  </body>
</html>
```
## Contributor's Agreement
To contribute source code to this repository, please read our [contributor's agreement](http://www.mulesoft.org/legal/contributor-agreement.html), and then execute it by running this notebook and following the instructions: https://api-notebook.anypoint.mulesoft.com/notebooks/#380297ed0e474010ff43 

## License

Copyright 2013 MuleSoft, Inc. Licensed under the Common Public Attribution License (CPAL), Version 1.0
