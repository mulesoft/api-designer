[![Build Status](https://travis-ci.org/advanced-rest-client/arc-definitions.svg?branch=master)](https://travis-ci.org/advanced-rest-client/arc-definitions)  [![Dependency Status](https://dependencyci.com/github/advanced-rest-client/arc-definitions/badge)](https://dependencyci.com/github/advanced-rest-client/arc-definitions)  

# arc-definitions

`<arc-definitions>` Internal data definitions used in ARC. Contains definitions for status codes and
request and response headers.

The fileds may be empty when not yet initialized.

The `<arc-definitions>` element listens at its nearest ShadowRoot boundary for query events.
Other elements can send the `query-headers` and `query-status-codes` events that will be
handled by this element. Events will be stopped from propagation. Event returned value will
contain the data.

### Example
```
<arc-definitions
  downloaded="{{definitionsReady}}"
  requests="{{requestsDefinitions}}"
  responses="{{responsesDefinitions}}"
  status-codes="{{statusCodesDefinitions}}"></arc-definitions>
```

### Firing events Example
This is a Polymer way but regular JavaScript event will do.
```
let event = this.fire('query-headers', {
  'type': 'request', // or response, mandatory
  'query': 'Acce' // finds all request headers containing `acce` in their name
});
let headers = event.detail.headers;
```

```
let event = this.fire('query-status-codes', {
  'code': 200
});
let statusCode = event.detail.statusCode;
```

