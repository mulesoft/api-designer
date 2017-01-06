[![Build Status](https://travis-ci.org/advanced-rest-client/docs-parameters-table.svg?branch=master)](https://travis-ci.org/advanced-rest-client/docs-parameters-table)  [![Dependency Status](https://dependencyci.com/github/advanced-rest-client/docs-parameters-table/badge)](https://dependencyci.com/github/advanced-rest-client/docs-parameters-table)  

# docs-parameters-table

`<docs-parameters-table>` A parameters list and description table for the RAML documentation view

This element renders a table of paramteres with the doccumentation. It can be used to display
URL parameters.
For headers documentation table pleae, use `<docs-headers-table>` element.
For types documentation table pleae, use `<docs-body-parameters-table>` element.

### Example
```
<docs-parameters-table
  uri-parameters="[[uriParameters]]"
  query-parameters="[[queryParameters]]"></docs-parameters-table>
```

### Object properties
An object in both arrays can contain any property that URI and query parameters can contain.

Currently following properties are supported:

- name (required) - name of the property, in case of UIR parameter it should be the parameter itself
- type - the type of the parameter, any RAML allowed value will be accepted
- description - description of the parameter
- required - mark that the property is a required property
- pattern - validation pattern to be applied to the parameter value
- example - example value of the parameter
- min - minimum value of the parametre when the type is numeric
- max - maximum value of the parametre when the type is numeric
- enum - List of possible values.

### Styling
`<docs-parameters-table>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--docs-parameters-table` | Mixin applied to all parameter table elements | `{}`
`--docs-parameters-url-table` | Mixin applied to this elements | `{}`
`--params-table-header-background-color` | Background color of table header | `#00A1DF`
`--params-table-header-color` | Font color of table header | `rgba(255, 255, 255, 0.87)`
`--params-table-subheader-background-color` | Background color of table subheader | `rgba(0, 161, 223, 0.24)`
`--params-table-subheader-color` | Font color of table subheader | `rgba(0, 0, 0, 0.87)`
`--params-table-row-border-color` | Border color of table's each row | `#00A1DF`
`--params-table-row-background-color` | Background color of table's each row |  `#fff`
`--params-table-row-color` | Font color of table's each row |  `#fff`
`--docs-parameters-table-cell` | Mixin applied to each cell | `{}`
`--docs-parameters-table-meta` | Mixin applied to property's metadata (example, pattern, etc) | `{}`

# docs-headers-table

`<docs-headers-table>` A headers list documentation table for the RAML documentation view.

### Example
```
<docs-headers-table
  headers="[[headers]]"></docs-headers-table>
```

### Object properties
An object in headers object can contain any property that header can contain
according to the RAML spec.

Currently following properties are supported:

- name (required) - name of the property, in case of UIR parameter it should be the parameter itself
- type - the type of the parameter, any RAML allowed value will be accepted
- description - description of the parameter
- required - mark that the property is a required property
- pattern - validation pattern to be applied to the parameter value
- example - example value of the parameter
- min - minimum value of the parametre when the type is numeric
- max - maximum value of the parametre when the type is numeric

### Styling
`<docs-headers-table>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--docs-parameters-table` | Mixin applied to all parameter table elements | `{}`
`--docs-parameters-url-table` | Mixin applied to this elements | `{}`
`--params-table-header-background-color` | Background color of table header | `#00A1DF`
`--params-table-header-color` | Font color of table header | `rgba(255, 255, 255, 0.87)`
`--params-table-subheader-background-color` | Background color of table subheader | `rgba(0, 161, 223, 0.24)`
`--params-table-subheader-color` | Font color of table subheader | `rgba(0, 0, 0, 0.87)`
`--params-table-row-border-color` | Border color of table's each row | `#00A1DF`
`--params-table-row-background-color` | Background color of table's each row |  `#fff`
`--params-table-row-color` | Font color of table's each row |  `#fff`
`--docs-parameters-table-cell` | Mixin applied to each cell | `{}`
`--docs-parameters-table-meta` | Mixin applied to property's metadata (example, pattern, etc) | `{}`

# docs-body-table

The `docs-body-table` is a view for the RAML documentation body.
Body may contain more than one type (RAML's union types) so in this case
this will show a more than one table of the parameters.
