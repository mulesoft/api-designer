[![Build Status](https://travis-ci.org/advanced-rest-client/raml-request-parameters-editor.svg?branch=master)](https://travis-ci.org/advanced-rest-client/raml-request-parameters-editor)  

# raml-request-parameters-editor

`<raml-request-parameters-editor>`

An element responsible for displaying a form of query / uri parameters. It produces a request URL
by altering the one provided in the `url` property. The `url` property has to be a APIs base URL
and the endpoint's relative URL. In short absoluteUrl.

The element is a form element and it will validate if all parameters that are marked as required
are filled. You can call the `validate()` function manually to check form validity.

This element handles logic for URL and params change. For view is responsible the
`raml-request-parameters-form` element.

### Example
```
<raml-request-parameters-editor
  query-parameters="[[method.queryParameters]]"
  uri-parameters="[[method.allUriParameters]]"
  url="[[method.absoluteUrl]]"
  value="{{url}}"></raml-request-parameters-editor>
```

Note: the `allUriParameters` property used in the example is not a standard RAML's JS parser
property. It has to be computed value of all URI parameters from all traits and security schemes.

### Validation
This element implements `Polymer.IronValidatableBehavior`. You can call `validate()` function
to check if the form is valid. An attribute `invalid` will be set if the form is invalid. It can be
used for styling.

URI parameters are always required sice they are part of the main URL.
Query parameters validation criteria are set according to the spec.

### Styling
`<raml-request-parameters-editor>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--raml-request-parameters-editor` | Mixin applied to the element | `{}`
`--raml-request-parameters-editor-input-label-color` | Color of the paper input's labels | `rgba(0, 0, 0, 0.48)`
`--raml-request-parameters-editor-predefined-label-color` | Color of the predefinied parameter name label | `rgba(0, 0, 0, 0.87)`
`--raml-request-parameters-editor-docs-color` | Color of the documentation string below the input field. Note that it will appy also `marked-element` styles to this element | `rgba(0, 0, 0, 0.87)`
`--raml-request-parameters-editor-predefined-row` | Mixin applied to each row of the form | `{}`
`--raml-request-parameters-editor-subheader` | Mixin applied to section's subheader | `--paper-font-subhead`
`--form-label` | Mixin applied to the predefinied parameter name label | `{}`

Also, use variables and misins defined for `paper-input` to style inputs, and
`paper-dropdown-menu`, `paper-listbox`, `paper-item` to style dropdown menus.



### Events
| Name | Description | Params |
| --- | --- | --- |
| url-value-changed | Fired when the editor changed it's `value` which is the URL. | value **String** - The URL. |
# raml-request-parameters-form


The `raml-request-parameters-form` element is responsible for displaying the form od URI / query
parameters. It is meant to work with the `raml-request-parameters-editor`. See its docs to
learn how to use this element.

### Styling
`<raml-request-parameters-form>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--raml-request-parameters-form` | Mixin applied to the element | `{}`
`--raml-request-parameters-editor-input-label-color` | Color of the paper input's labels | `rgba(0, 0, 0, 0.48)`
`--raml-request-parameters-editor-predefined-label-color` | Color of the predefinied parameter name label | `rgba(0, 0, 0, 0.87)`
`--raml-request-parameters-editor-docs-color` | Color of the documentation string below the input field. Note that it will appy also `marked-element` styles to this element | `rgba(0, 0, 0, 0.87)`
`--raml-request-parameters-editor-predefined-row` | Mixin applied to each row of the form | `{}`
`--form-label` | Mixin applied to the predefinied parameter name label | `{}`

