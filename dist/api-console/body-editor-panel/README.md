[![Build Status](https://travis-ci.org/advanced-rest-client/body-editor-panel.svg?branch=master)](https://travis-ci.org/advanced-rest-client/body-editor-panel)  

# body-editor-panel

`<body-editor-panel>` A body editor panel containin JSON and XML editors

### Example
```
<body-editor-panel></body-editor-panel>
```

### Styling
`<body-editor-panel>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--body-editor-panel` | Mixin applied to the element | `{}`

Use `paper-tabs` and `code-mirror` variables to style this elements.



### Events
| Name | Description | Params |
| --- | --- | --- |
| body-value-changed | Fires when the value change. | value **String** - Current editor value |
