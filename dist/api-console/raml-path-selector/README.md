[![Build Status](https://travis-ci.org/advanced-rest-client/raml-path-selector.svg?branch=master)](https://travis-ci.org/advanced-rest-client/raml-path-selector)  [![Dependency Status](https://dependencyci.com/github/advanced-rest-client/raml-path-selector/badge)](https://dependencyci.com/github/advanced-rest-client/raml-path-selector)  

# raml-path-selector

`<raml-path-selector>`
Element to select a path in the RAML resources structure. It displays RAML
API's structure in the tree view and allow to select a node and signal path
selected by the user.

The `selectedPath` can be then used to get a definition for a particular node
of the RAML documentation.
Example path values:
- documentation.0 - First document in the documentation array
- resources.0.methods.0 - First method in the first resource
- resources.0.resources.0 - First sub resource in the first resource array.

See demo for working example.

## Usage
```
<raml-path-selector raml="[[raml]]" selected-path="{{path}}"></raml-path-selector>
```

Inside a Polymer powered web component you can use `get` function to access
the data:
```
var def = this.get('raml.' + selectedPath);
```
This assumes that you keep the RAML's JSON structure in the `raml` property.

In other cases you can use libraries like
<a href="https://lodash.com/" target="_blank">lodash</a> to use it methods to
access structured data using path notation.

## Responsive view
This is a navigational element. Therefore in narrow view it hides itself from the view.
When media queries are lower than `narrowWidth` or the `narrow` attribute is set then the path
selector render itself as a dropdown list.
Views that are using this element should keep that in mind and set the layout accordingly.
For example it may require to switch from `column` to `row` layout.

## Styling
`<raml-path-selector>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--raml-path-selector` | Mixin applied to the element | `{}`
`--raml-path-selector-headers` | Mixin applied to the headers in the tree view | `{}`
`--raml-path-selector-no-structure` | Mixin applied to the paragraph when the structure wasn't recognized in the RAML source | `{}`
`--raml-docs-tree-outline` | An outline of focused item | `none`
`--raml-path-selector-narrow-selected-label` | Mixin applied in narrow layout to the control's label | `{}`

See also `raml-documentation-tree-item` and `raml-resource-tree-item` for
more styling options.

# raml-resource-tree-item

The `<raml-resource-tree-item>` is an element that displays a resource
part of the API structure tree. It contains the resource, it's methods and
sub-resources.

This element is intended to work with `<raml-path-selector>`.

Custom property | Description | Default
----------------|-------------|----------
`--raml-docs-tree-item-element` | Mixin applied to the element | `{}`
`--raml-docs-tree-item-element-background` | Background color of the element | `transparent`
`--raml-docs-tree-children-margin` | Resource's children left margin.  | `24px`
`--raml-docs-tree-item` | Mixin applied to each tree item  | `{}`
`--raml-docs-tree-item-background` | Background color of the tree item.  | `transparent`
`--raml-docs-tree-item-hover-background` | Background color of hovered tree item  | `#F5F5F5`
`--raml-docs-tree-item-selected-background` | Background color of the selected item | `rgba(3, 169, 244, 0.24)`
`--raml-docs-tree-item-selected-color` | Color of the selected item | `#000`
`--raml-docs-tree-outline` | An outline of focused item | `none`

