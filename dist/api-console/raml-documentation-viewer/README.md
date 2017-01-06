[![Build Status](https://travis-ci.org/advanced-rest-client/raml-documentation-viewer.svg?branch=master)](https://travis-ci.org/advanced-rest-client/raml-documentation-viewer)  [![Dependency Status](https://dependencyci.com/github/advanced-rest-client/raml-documentation-viewer/badge)](https://dependencyci.com/github/advanced-rest-client/raml-documentation-viewer)  

# raml-documentation-viewer

# `<raml-documentation-viewer>`
A documentation viewer for RAML file. This is the main element to be used to display the
documentation from a RAML file.

*Note: This element do not parse RAML file. It accepts parsed JSON output from the RAML JS parser**

This element accepts RAML parser's json output. It can be produced using the `<raml-js-parser>`
element from ARC's catalog.

### Example
Passing a RAML data into the element can be done by using the `raml` property. It's a recommended
way of passing the data.

```
<raml-documentation-viewer raml="[[raml]]"></raml-documentation-viewer>
```

This element also uses the `<raml-aware>` element. It helps to set RAML data globally for the
application and once it's set the documenation viewer will apply set data. To use this you have
to set `aware` attribute with the name of `<raml-aware>`'s scope attribute.

```
<raml-documentation-viewer aware="doc-raml"></raml-documentation-viewer>
<raml-aware raml="{{raml}}" scope="doc-raml"></raml-aware>
```

## Roadmap
This element will be updated in near future. The view will support tabs where the user can switch
between the documentation and the types view. Further tabs are possible.

### Styling
`<raml-documentation-viewer>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--raml-documentation-viewer` | Mixin applied to the element | `{}`

