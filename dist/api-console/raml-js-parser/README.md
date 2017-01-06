[![Build Status](https://travis-ci.org/advanced-rest-client/raml-js-parser.svg?branch=master)](https://travis-ci.org/advanced-rest-client/raml-js-parser)  [![Dependency Status](https://dependencyci.com/github/advanced-rest-client/raml-js-parser/badge)](https://dependencyci.com/github/advanced-rest-client/raml-js-parser)  

# raml-js-parser

# `<raml-js-parser>`
The RAML parser (JS version) as a web component.

The `<raml-js-parser>` can accept an URL from where the API definition can be
downloaded or a RAML file from web filesystem. If the file contains references
to other files they can be passed as well to the `files` attribute and the pareser
will search files/directories structure for referenced file.

Files in web environment can be obtained if the user selects a file using
input file element or drop directory / files to a droppable element.

See demo for example of both.

### Events based approach

Parser can be included only once in the DOM and other element do not need to have
direct access to this element. It uses browser's events system to pass data.
The `<raml-js-parser>` will listen for `parse-raml-url`, `parse-raml-content`
and `parse-raml-file` events and in a result the event details will contain the
`raml` property which is a Promise that will resolve itself when parser
finish work.

#### `parse-raml-url` event
This event will be handled only if it contains the `url` property in the
event detail object. It should be an URL to the RAML resource that will be
downloaded.
Note, that the web app has to have an CORS access to the resource in order to
download it.

#### `parse-raml-content` event
This event if useful when the app already have content of the RAML file as string
and it's ready to parse it.
Additionally it may contain a list of files or directory structure where the
parser will search for delepndencies (referenced libraries).

This event will be handled only if it contains the `content` property in
the event detail object. Additional files or directory structure can be
passed in the `files` property.

#### `parse-raml-file` event
To be used when the app want to parse a RAML file which is a FileEntry or
a File (Blob) object. It similar to the `parse-raml-content` event but before
invoking the same method it will read file content firest.

This event will be handled only if it contains the `file` property in
the event detail object. Additional files or directory structure can be
passed in the `files` property.


### Example
``` html
<raml-js-parser></raml-js-parser>
```

``` javascript
// Handler for drop event
processFile = (e) => {
  var items = Array.from(e.dataTransfer.items);
  var main = this.findMainRamlFileSomehow(items);

  let detail = {
    'file': main,
    'files': items // this is optional.
  };
  let event = this.fire('parse-raml-file', detail);

  if (!event.detail.raml) {
    // uuups, raml parser is not attached to the DOM.
    return;
  }

  event.detail.raml.then((api) => {
    // api is the parser output.
  });
};
```

The element contains a set of Polyfills so it will work in the IE11+ browsers.



### Events
| Name | Description | Params |
| --- | --- | --- |
| api-parse-ready | Fired when the RAML file has been parsed and the result is ready. | result **Object** - The parsing result. |
json **Object** - (optional) Set when `normalizeRaml` property is set. JSON output. |
| error | Fired when error occurred while parsing the file. | error **Error** - The error object. |
| raml-js-parser-ready | Fired when the element has been attached to the DOM and is ready to parse data. | __none__ |
