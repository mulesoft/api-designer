
`<raml-aware>` Element that is aware of the RAML content.

The element contains the same RAML data as other elements whenever their
location in the document. The RAML data are encapsulated in `scope` attribute.
By default the `scope` is `default`. If you create two `<raml-aware>`s with
different scopes then changing one raml will not affect the other.

Setting a RAML data on a `<raml-aware>` will notify other awares with the same
scopes about the change and update their RAML data so it can be transfered
between different parts of application on even different web components.

### Example
```html
<raml-aware raml="{{raml}}" scope="request"></raml-aware>
<raml-aware raml="{{importRaml}}" scope="import"></raml-aware>
```
```javascript
var r1 = document.querySelector('raml-aware[scope="request"]');
var r2 = document.querySelector('raml-aware[scope="import"]');
r1.raml = {};
r2.raml = null;
assert(r1.raml !== r2.raml);
```

