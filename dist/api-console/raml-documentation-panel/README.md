[![Build Status](https://travis-ci.org/advanced-rest-client/raml-documentation-panel.svg?branch=master)](https://travis-ci.org/advanced-rest-client/raml-documentation-panel)  

# raml-documentation-panel

`<raml-documentation-panel>` A documentation details panel.
Its purpose is to compute documentation from the RAML file and display the
result as a main documentation panel.

### Example
```
<raml-documentation-panel raml="[[raml]]"></raml-documentation-panel>
```
or
```
document.querySelector('raml-documentation-panel').raml = raml;
```

Note: If you are using `raml-js-parser` element, remember that the Api object must be transformed
to JSON and returned object's `specification` property is what this element accepts.

Note: This element (actually `raml-path-to-object`) will chnage the strucure of the `raml` property.
It's due to internal optymisation when computing required definitions.

### Styling
`<raml-documentation-panel>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--raml-documentation-panel` | Mixin applied to the element | `{}`
`--raml-docs-path-selector-width` | Width of the path selector. It is applied to both `width` and `min-width` properties | `256px`
`--raml-docs-main-content` | Mixin applied to the main docs content (where the docs content is displayed). | `{}`
`--raml-docs-main-content-width` | Max width of the documentation panel. Additional space is required for innner panels navigation | `900px`
`--raml-docs-documentation-width` | Width of the documentation panel. It should be used to avoid usability issues for reading long texts. | `700px`

