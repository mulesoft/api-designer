[![Build Status](https://travis-ci.org/advanced-rest-client/raml-docs-resource-viewer.svg?branch=master)](https://travis-ci.org/advanced-rest-client/raml-docs-resource-viewer)  [![Dependency Status](https://dependencyci.com/github/advanced-rest-client/raml-docs-resource-viewer/badge)](https://dependencyci.com/github/advanced-rest-client/raml-docs-resource-viewer)  

# raml-docs-resource-viewer

`<raml-docs-resource-viewer>` An element that displays a documentation for a RAML's resource object

*Note: This element requires `currentPath` property to be set** in order to compute methods and
sub-resources list. It is required for navigation.

### Example
```
<raml-docs-resource-viewer current-path="{{path}}" raml="{{resource}}"></raml-docs-resource-viewer>
```

## Requesting navigation to method / sub-property
When the user click on the name of a method or a sub-resource then two things will hapen:
1) `currentPath` will be set to the path corresponded to requested resource
2) `raml-path-changed` event will be fired with the `path` property in event detail object.

Parent element(s) should use one of this method to handle the change and navigate to sub-resource.

Method 1) assumes that Polymer's data binding model is used and parent element listens to change
in `currentPath`:
```
<raml-docs-resource-viewer current-path="{{path}}"></raml-docs-resource-viewer>
```
Note use of `{{}}` instead of `[[]]` ([more about that](https://www.polymer-project.org/1.0/docs/devguide/data-binding)).
Observers can observe change to the `path` property and change current object.

Second method uses event handling to handle path change:
```
<raml-docs-resource-viewer id="resourceViewer" current-path="[[path]]"></raml-docs-resource-viewer>
```
```
init: function() {
  document.querySelector('#resourceViewer').addEventListener('raml-path-changed', this._navigate.bind(this));
},

_navigate: function(e) {
  var path = e.detail.path;
  // Do somethind with path, like use `<raml-path-to-object>` element.
}
```


### Styling
`<raml-docs-resource-viewer>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--raml-docs-resource-viewer` | Mixin applied to the element | `{}` |
`--raml-docs-h1` | Mixin applied to H1 | `{}` |
`--raml-docs-h2` | Mixin applied to H2 | `{}` |
`--raml-docs-h3` | Mixin applied to H3 | `{}` |
`--raml-docs-item-description` | Mixin applied to the description field. | `{}` |
`--raml-docs-table-max-width` | Max width applied to the tables. Suggested to not exceed 800px, otherwise it may cause usability issues. | `800px` |
`--raml-docs-link` | Mixin applied to the links elements. | `{}` |
`--raml-docs-link-color` | Color of the link elements | `#00A1DF` |
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
`--raml-docs-resource-viewer-narrow-container-width` | width of the main container in the narrow view | `calc(100vw - 32px)`
`--raml-docs-resource-viewer-navigation` | Mixin applied to the links section | `{}`
`--raml-docs-resource-viewer-navigation-wide-layout` | Mixin applied to the links section in wide layout | `{}`
`--raml-docs-resource-viewer-content` | Mixin applied to the main content section. | `{}`
`--raml-docs-resource-viewer-container` | Mixin applied to the container that is holding main content and navigation containers | `{}`



### Events
| Name | Description | Params |
| --- | --- | --- |
| raml-path-changed | An event fired when the user cliecked on a method/sub-resource link. Before the event is fired the `currentPath` propery is set. If parent element is listening for change on this property then it's redundand to listen for this event. | __none__ |
