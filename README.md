## Updating

Inside the _branchs folder, add a `<my-branch>.md` file.

To simply point to the branch:
```
---
branch: qa
order: 2
---
```

To point to a tag:
```
---
tag: v0.3.0
---
```

To add a custom url:
```
---
label: Latest develop with OAS export
branch: develop
order: 4
href: http://rawgit.com/mulesoft/api-designer/develop/dist/index.html#/?xDisableProxy=true&xOasExport=true
---
```