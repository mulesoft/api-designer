# RAML Editor

This is a standalone/embeddable editor for RAML (Restful Api Modeling language) written in JavaScript.

## Installation

TBD

## Build and Run

Install global tools
```
npm install -g grunt-cli
npm install -g bower
npm install -g karma    <=== Optional for running the test suite
npm install -g yeoman   <=== Optional for scaffolding
```

Install node modules
```
npm install .
```

Install bower components
```
bower install
```

Update vendor libs (required after updating bower components)
```
grunt updatelibs
```

Run the application
```
grunt server
```

Build the application
```
grunt build
```
