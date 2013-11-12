# RAML Editor

[![Build Status](https://travis-ci.org/mulesoft/api-designer.png)](https://travis-ci.org/mulesoft/api-designer)

This is a standalone/embeddable editor for [RAML](http://raml.org) (Restful Api Modeling language) written in JavaScript.

## Build and Run

Install global tools
```
npm install -g grunt-cli
npm install -g karma # Optional for running the test suite
```

Install node modules
```
npm install .
```

Run the application
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
      // Create an Angular module named 
      angular.module('ramlEditorApp')
      .factory('MyFileSystem', function (config, eventService) {
        var service = {};
    
        service.directory = function (path, callback, errorCallback) {
          // Your magic goes here
        };
    
        service.load = function (path, name, callback, errorCallback) {
          // Your magic goes here
        };
    
        service.remove = function (path, name, callback, errorCallback) {
          // Your magic goes here
        };
    
        service.save = function (path, name, contents, callback, errorCallback) {
          // Your magic goes here
        };
    
        return service;
      })
      .run(function (MyFileSystem, config, eventService) {
        // Set MyFileSystem as the filesystem to use
        config.set('fsFactory', 'APIHubFileSystem');
        
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



## Deployment Process
The Designer dependencies are:
  * RAML Javascript Parser
  * API Console

Those dependencies Javascripts should be placed in the `app/vendor/scripts/` folder and their styles in `app/vendor/styles`. and are currently stored in the git repo. After that, the build should be run by doing:
```
  grunt
```

If the build succeeds then the files to deploy are found in the `dist/scripts` and `dist/styles` folders. The html that embed the Designer should look like this:
```html
<!doctype html>
<html>
  <head>
    <!-- Include the compiled styles -->
    <link rel="stylesheet" href="styles/07edc556.main.css">
  </head>
  <!-- The ng-app scopes Angular in the html. It can be in any tag (not necessary the body) -->
  <body ng-app="ramlEditorApp">
  
    <!-- This is the App entry point -->
    <div class="container" ng-include="" src="'views/raml-editor-main.tmpl.html'"></div>

    <!-- Compiled Javascripts containing the files found in dist -->
    <script src="scripts/d8772085.vendor.js"></script>
    <script src="scripts/736fe450.scripts.js"></script>
  </body>
</html>
```


## License

Copyright 2013 MuleSoft, Inc. Licensed under the Common Public Attribution License (CPAL), Version 1.0
