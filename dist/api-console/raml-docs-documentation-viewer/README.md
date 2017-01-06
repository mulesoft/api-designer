[![Build Status](https://travis-ci.org/advanced-rest-client/raml-docs-documentation-viewer.svg?branch=master)](https://travis-ci.org/advanced-rest-client/raml-docs-documentation-viewer)  

# raml-docs-documentation-viewer

`<raml-docs-documentation-viewer>` A viewer of the documentation node of the RAML definition

### Example
```
<raml-docs-documentation-viewer documentation="[[doc]]"></raml-docs-documentation-viewer>
```

### Styling
`<raml-docs-documentation-viewer>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--raml-docs-documentation-viewer` | Mixin applied to the element | `{}`
`--raml-docs-documentation-viewer-code` | Mixin applied to the parsed and highlighted code container for markup. Note that this container has `markdown-styles` applied. | `{}`

A `markdown-styles` element is responsible for styling parsing content.

