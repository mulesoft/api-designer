[![Build Status](https://travis-ci.org/advanced-rest-client/raml-request-url-editor.svg?branch=master)](https://travis-ci.org/advanced-rest-client/raml-request-url-editor)  

# raml-request-url-editor

`<raml-request-url-editor>` An URL editor for the RAML request panel

This element is mocking an input element to provide URI variables highlight.
It will mark every occurence of the `{STRING}`. Additionally, if the `uriParameters` array is
set, and the user click on the variable name then the documentation fot this variable will be
displayed. This behavior can be turned off by setting `skip-docs` attribute (`skipDocs` property).

The element also mimic the input's validation behavior. If the value contains s string that matches
the following regexp `{\s+}` then it will display a validation error.

### Example
```html
<raml-request-url-editor auto-validate required></raml-request-url-editor>
```
```javascript
var input = document.querySelector('raml-request-url-editor');
input.addEventListener('value-changed', function(e) {
  if (input.validate())
    var url = e.detail.value;
});
```

When the `value` if this control change then the `url-value-changed` event will be fired.

### Styling
`<raml-request-url-editor>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--raml-request-url-editor` | Mixin applied to the element | `{}`
`--raml-request-url-editor-documentation` | Mixin applied to the documentation field. Not that this node has the `--paper-font-body1` mixin and also `markdown-styles` applies. | `{}`
`--url-input-marker` | Background color of the URI variable marker | `yellow`

Additionally use styles defined for the `paper-input` element.



### Events
| Name | Description | Params |
| --- | --- | --- |
| url-value-changed | Fired when the URL value change. Note that this event is fifed before validation occur and therefore the URL may be invalid. | value **String** - The URL. |
# url-input

An URL input.
This element preteds to be an `<input>` element in order to add custom behavior to the
input element.

