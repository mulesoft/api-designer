(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .factory('ramlEditorContext', function ramlEditorContext(
      ramlParser,
      ramlParserFileReader,
      eventEmitter
    ) {
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

      self.context = {
        metadata:   {}
      };

      self.compile = function compile(resource, callback) {
        var options = {
          validate : true,
          transform: true,
          compose:   true,
          reader:    ramlParserFileReader
        };

        var data;

        if (resource !== null) {
          var resourceInfo = self.context.metadata[resource].raml;
          var raml         = [self.context.ramlHeader.raw];
          var resourceRaml = resourceInfo.raw;

          if (resourceRaml === resourceInfo.old) {
            return callback(resourceInfo.compiled);
          }

          data = raml.concat(resourceRaml).join('\n');
        } else {
          data = self.context.content.join('\n');
        }

        return ramlParser.load(data, null, options)
          .then(function (compiled) {
            if (resource !== null) {
              resourceInfo.compiled = compiled;
              resourceInfo.old      = angular.copy(resourceRaml);
            }
            callback(compiled);
            eventEmitter.publish('event:raml-parser-sucess');
          }, function (error) {
            eventEmitter.publish('event:raml-parser-error', {
              error:      error,
              contextual: true
            });
            resourceInfo.old = angular.copy(resourceRaml);
          });
      };

      self.fullCompile = function fullCompile() {
        var options = {
          validate : true,
          transform: true,
          compose:   true,
          reader:    ramlParserFileReader
        };

        return ramlParser.load(self.context.content.join('\n'), null, options)
          .then(function (){ }, function (error) {
            eventEmitter.publish('event:raml-parser-error', {
              error:      error,
              contextual: false
            });
          });
      };

      self.read = function read(lines) {
        var template    = new RegExp('^\/.*:$');
        var path        = [lines[0]];
        var indentation = getIndentation(lines[0]);

        var resource, root;
        var linesScope   = new Array(lines.length);
        // var resourceMeta = {};
        var resources    = {};

        lines.forEach(function (line, index) {
          resource = line.trim();

          if (line && line.startsWith('/')) {
            if (root !== resource && self.context.metadata[root]) {
              self.context.metadata[root].endAt = index;
            }
            root = resource;

            if (typeof self.context.metadata[root] === 'undefined') {
              self.context.metadata[root] = {};
            }

            if (typeof self.context.metadata[root].raml === 'undefined') {
              self.context.metadata[root].raml = {};
            }

            self.context.metadata[root].raml.raw = '';
            self.context.metadata[root].startAt  = index;

            path = [line];
          }

          if (self.context.metadata[root]) {
            self.context.metadata[root].raml.raw+=line+'\n';
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

        self.context.scopes     =     linesScope;
        self.context.resources  =  Object.keys(resources);
        self.context.content    =    lines;
        self.context.ramlHeader = {
          raw: readRamlHeader(lines)
        };
      };

      return self;
    })
  ;
})();
