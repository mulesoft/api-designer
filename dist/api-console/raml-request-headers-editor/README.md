[![Build Status](https://travis-ci.org/advanced-rest-client/raml-request-headers-editor.svg?branch=master)](https://travis-ci.org/advanced-rest-client/raml-request-headers-editor)  

# raml-request-headers-editor

`<raml-request-headers-editor>` A headers editor to be used with the RAML defined requests

### Example
```
<raml-request-headers-editor></raml-request-headers-editor>
```

### Styling
`<raml-request-headers-editor>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--raml-request-headers-editor` | Mixin applied to the element | `{}`



### Events
| Name | Description | Params |
| --- | --- | --- |
| content-type-changed | Fired when the content type header has been set / updated. | value **String** - New Content type. |
