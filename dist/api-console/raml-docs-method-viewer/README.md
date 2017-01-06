[![Build Status](https://travis-ci.org/advanced-rest-client/raml-docs-method-viewer.svg?branch=master)](https://travis-ci.org/advanced-rest-client/raml-docs-method-viewer)  

# raml-docs-method-viewer

`<raml-docs-method-viewer>` Documentation view for the method defined in RAML file

This element is meant to work with data structure returned by the
`<raml-js-parser>` and `<raml-path-to-object>`. Regular JSON output from the
RAML JS parser will not work with this element.

### Example
```
<raml-docs-method-viewer
  raml="[[methodDefinition]]"
  parent-endpoint="[[selectedParent]]"></raml-docs-method-viewer>
```
To properly compute values displayed in the view it needs to know its
`parentEndpoint`. Though, it will work properly if the parent is not passed.
Parent is used to display title of the method.

### Styling
`<raml-docs-method-viewer>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--raml-docs-method-viewer` | Mixin applied to the element | `{}`
`--raml-docs-h1` | Mixin applied to H1 | `{}` |
`--raml-docs-h2` | Mixin applied to H2 | `{}` |
`--raml-docs-h3` | Mixin applied to H3 | `{}` |
`--raml-docs-method-viewer-title-method-font-weight` | Font weight of the name if the method | `500` |
`--raml-docs-method-viewer-http-method-font-weight` | Font weight of the HTTP method | `500` |
`--raml-docs-item-description` | Mixin applied to the description field. | `{}` |
`--raml-docs-method-viewer-url-color` | Color of the URL field | `--accent-color` |
`--raml-docs-method-viewer-url-font-style` | font-style of the URL value | `italic` |
`--raml-docs-method-viewer-url` | Mixin applied to the URL field | `{}` |
`--action-button` | Mixin applied to the main action button (Try it) | `{}`



### Events
| Name | Description | Params |
| --- | --- | --- |
| tryit-requested | Fired when the user pressed the `try it` button. | __none__ |
