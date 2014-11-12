# RAML Editor

[![Build Status](https://travis-ci.org/mulesoft/api-designer.png)](https://travis-ci.org/mulesoft/api-designer)
[![Dependency Status](https://david-dm.org/mulesoft/api-designer.png)](https://david-dm.org/mulesoft/api-designer#info=dependencies)
[![DevDependency Status](https://david-dm.org/mulesoft/api-designer/dev-status.png)](https://david-dm.org/mulesoft/api-designer#info=devDependencies)

This is a standalone/embeddable editor for [RAML](http://raml.org) (Restful Api Modeling language) written in JavaScript.
It's a fork with a file system persistence. 

## Build and Run

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

Run the rest server for filesystem persistence
```
slc run raml-rest/ #you can use --detach for detached mode

Run the application (client) locally
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

Configuration
```
./raml-rest/config.json 

{
    "baseDir": "../raml" #folder that contains RAML files
}

```

```
## Contributor's Agreement
To contribute source code to this repository, please read our [contributor's agreement](http://www.mulesoft.org/legal/contributor-agreement.html), and then execute it by running this notebook and following the instructions: https://api-notebook.anypoint.mulesoft.com/notebooks/#380297ed0e474010ff43 

## License

Copyright 2013 MuleSoft, Inc. Licensed under the Common Public Attribution License (CPAL), Version 1.0
