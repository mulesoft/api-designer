[![Build Status](https://travis-ci.org/advanced-rest-client/body-json-editor.svg?branch=master)](https://travis-ci.org/advanced-rest-client/body-json-editor)  

# body-json-editor

`<body-json-editor>` A JSON editor for HTTP body

It provides a visual editor for the JSON body.

### Example
```
<body-json-editor value='["apple", 1234]'></body-json-editor>
```

To set / get value on / from the element use the `value` property. Each time
something change in the editor the string `value` will be regenerated.
It is also possible to set a JavaScript objkect on this element using
`json` property but it is immutable and changes will not be reflected to it.

### Styling
`<body-json-editor>` provides the following custom properties and mixins for
styling:

Custom property | Description | Default
----------------|-------------|----------
`--body-json-editor` | Mixin applied to the element | `{}`
`--body-json-object-editor` | Mixin applied to the `object-editor` element. Note that because of the recurcy this element contains the same element. So setting padding / margin on this element is basically bad idea. | `{}`,
`--paper-dropdown-menu-input` | Mixin applied to the dropdown menu input. | `{color: #673AB7;}`
`--paper-dropdown-menu-button` | Mixin applied to the dropdown menu button. | `{color: #673AB7;}`
`--primary-color` | Color of the action button | ``
`--simple-type-editor` | Mixin applied to the `simple-type-editor` element. Note that because of the recurcy this element contains the same element. So setting padding / margin on this element is basically bad idea. | `{}`,
`--inline-documentation-color` | Color of the documentartion font. Inline documentation appears below text fields as a hint for input. | `rgba(0, 0, 0, 0.64)`
`--inline-documentation-text-size` | Size of the documentation font. Inline documentation appears below text fields as a hint for input. | `12px`
`--code-type-text-value-color` | Text color of the code highligted string value | `#080`
`--code-type-number-value-color` | Text color of the code highligted numeric value | `#303F9F`
`--code-type-boolean-value-color` | Text color of the code highligted boolean value | `#4A148C`
`--code-type-null-value-color` | Text color of the code highligted nullable value | `#4A148C`
`--code-punctuation-value-color` | Text color of the code highligted: the punctuation | `rgba(0, 0, 0, 0.54)`

# object-editor

`<object-editor>` Is a part of the `body-json-editor`. This element is used to recursively
display a JSON object editor.

### Styling
`<object-editor>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--body-json-object-editor` | Mixin applied to the element. Note that because of the recurcy this element contains the same element. So setting padding / margin on this element is basically bad idea. | `{}`,
`--paper-dropdown-menu-input` | Mixin applied to the dropdown menu input. | `{color: #673AB7;}`
`--paper-dropdown-menu-button` | Mixin applied to the dropdown menu button. | `{color: #673AB7;}`
`--primary-color` | Color of the action button | ``

# simple-type-editor

The `simple-type-editor` is the most atomic type editor. It only support basic types like
strings, numbers, booleans or nulls.
It shows the name and value editor and on demand type change / select dropdown.

### Styling
`<simple-type-editor>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--simple-type-editor` | Mixin applied to the element. Note that because of the recurcy this element contains the same element. So setting padding / margin on this element is basically bad idea. | `{}`,
`--inline-documentation-color` | Color of the documentartion font. Inline documentation appears below text fields as a hint for input. | `rgba(0, 0, 0, 0.64)`
`--inline-documentation-text-size` | Size of the documentation font. Inline documentation appears below text fields as a hint for input. | `12px`
`--code-type-text-value-color` | Text color of the code highligted string value | `#080`
`--code-type-number-value-color` | Text color of the code highligted numeric value | `#303F9F`
`--code-type-boolean-value-color` | Text color of the code highligted boolean value | `#4A148C`
`--code-type-null-value-color` | Text color of the code highligted nullable value | `#4A148C`
`--code-punctuation-value-color` | Text color of the code highligted: the punctuation | `rgba(0, 0, 0, 0.54)`

