(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .factory('ramlEditorContext', function ramlEditorContext(ramlParser, ramlParserFileReader) {
      var self = this;

      function getIndentation(str) {
        return str.match(/^\s*/)[0].length;
      }

      function readRamlHeader(lines) {
        var template  = new RegExp('^\/.*:$');
        var temp      = [];

        for (var i = 0; i < lines.length; i++) {
          var line = lines[i];

          if(!template.test(line)) {
            temp.push(line);
          } else {
            break;
          }
        }

        return temp.join('\n');
      }

      self.context = {};

      self.read = function read(lines) {
        var template    = new RegExp('^\/.*:$');
        var path        = [lines[0]];
        var indentation = getIndentation(lines[0]);

        var resource, root;
        var linesScope   = new Array(lines.length);
        var resourceMeta = {};
        var resources    = {};

        lines.forEach(function (line, index) {
          resource = line.trim();

          if (line.startsWith('/')) {
            if (root !== resource && resourceMeta[root]) {
              resourceMeta[root].endAt = index;
            }
            root = resource;
            resourceMeta[root] = {
              raml: {
                raw: ''
              },
              startAt: index
            };
            path = [line];
          }

          if (resourceMeta[root]) {
            resourceMeta[root].raml.raw+=line+'\n';
          }

          if (template.test(resource)) {
            if (indentation === getIndentation(line)) {
              path.pop();
            }

            if (getIndentation(line) < indentation) {
              path = path.slice(0, path.length - 2);
            }

            if (path.filter(function (el) { return el.trim() === resource; }).length === 0) {
              path.push(resource);
            }

            indentation = getIndentation(line);

            linesScope[index] = path.join('');
            resources[path.join('')] = null;
          }

          linesScope[index] = path.join('');
        });

        self.context = {
          scopes:     linesScope,
          metadata:   resourceMeta,
          resources:  Object.keys(resources),
          content:    lines,
          ramlHeader: {
            raw: readRamlHeader(lines)
          }
        };

        var options = {
          validate : true,
          transform: true,
          compose:   true,
          reader:    ramlParserFileReader
        };

        ramlParser.load(self.context.ramlHeader.raw, null, options)
          .then(function (data) {
            self.context.ramlHeader.compiled = data;
          });

        Object.keys(resourceMeta).map(function (resource) {
          var raml = [self.context.ramlHeader.raw];

          ramlParser.load(raml.concat(resourceMeta[resource].raml.raw).join('\n'), null, options)
            .then(function (data) {
              resourceMeta[resource].raml.compiled = data;
            });
        });
      };

      return self;
    })
  ;
})();
