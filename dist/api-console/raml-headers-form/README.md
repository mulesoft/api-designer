[![Build Status](https://travis-ci.org/advanced-rest-client/raml-headers-form.svg?branch=master)](https://travis-ci.org/advanced-rest-client/raml-headers-form)  

# raml-headers-form

A headers form to be used to rended a form of pre-defined headers with documentation comming
from the RAML definition.

### Example
```
<raml-headers-form></raml-headers-form>
```
```
var form = document.querySelector('raml-headers-form');
form.ramlHeaders = []; // Put headers property from the RAML JS parser.
form.addEventListener('value-changed', function(e) {
  var value = e.detail.value;
});
```
Note: this element mean to use `raml-js-parser` elements. This element transforms parser output
to the one recognizable by this element.

### Styling
`<raml-headers-form>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--raml-headers-form` | Mixin applied to the element | `{}`
`--raml-headers-form-input-label-color` | Color of the lable of the `paper-input` element. | `rgba(0, 0, 0, 0.38)`
`--raml-headers-form-prodefined-name-color` | Color of the prodefined header name | `rgba(0, 0, 0, 0.87)`
`--raml-headers-form-docs-color` | Color of the description below the input field | `rgba(0, 0, 0, 0.87)`
`--primary-color` | Color of the button to add new header | `--primary-color`

## TODO
- Remove arc-definitions and place only request headers definitions or instruct to use definitions as an external element



### Events
| Name | Description | Params |
| --- | --- | --- |
| headers-value-changed | Fired when the headers value changed. | value **String** - The headers value. |
