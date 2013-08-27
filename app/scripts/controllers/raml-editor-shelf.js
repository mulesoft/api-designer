'use strict';

angular.module('ramlConsoleApp')
  .controller('ramlEditorShelf', function ($scope, $rootScope, ramlHint) {
    var hinter = ramlHint;
    var editor;

    $rootScope.$on('event:raml-editor-has-changes', function (e, args) {
      editor = args;
      var suggestions = hinter.getSuggestions(editor);
      var sections = {};
      var model = { sections: [] };

      suggestions.forEach(function (item) {
        sections[item.category] = sections[item.category] || { name: item.category, items: [] };
        sections[item.category].items.push(item);
      });

      for (var prop in sections) {
        model.sections.push(sections[prop]);
      }

      $scope.model = model;
      $scope.$apply();
    });

    $scope.itemClick = function (item) {
      var cur = editor.getCursor();
      var code = $scope.getSnippet(item.name);
      var line = editor.getLine(cur.line);
      var count = line.split('  ').length - 1;
      var padding = ramlHint.createIndentation(count);

      if (code) {
        code = code.replace(/\{\{padding\}\}/g, padding);
        editor.replaceRange(code, {line: cur.line, ch: 0}, {line: cur.line, ch: 0});
      }
    };

    $scope.getSnippet = function (snippetName) {
      var ind = '{{padding}}';

      if (snippetName.toLowerCase() === 'get') {
        return '' +
          ind + 'get:\n' +
          ind + '  summary: <<insert text or markdown here>>\n';
      }

      if (snippetName.toLowerCase() === 'post') {
        return '' +
          ind + 'post:\n' +
          ind + '  summary: <<insert text or markdown here>>\n';
      }

      if (snippetName.toLowerCase() === 'put') {
        return '' +
          ind + 'put:\n' +
          ind + '  summary: <<insert text or markdown here>>\n';
      }

      if (snippetName.toLowerCase() === 'delete') {
        return '' +
          ind + 'delete:\n' +
          ind + '  summary: <<insert text or markdown here>>\n';
      }

      if (snippetName.toLowerCase() === 'new resource') {
        return '' +
          ind + '/newResource:\n' +
          ind + '  name: resourceName\n';
      }

      if (snippetName.toLowerCase() === 'title') {
        return '' +
          ind + 'title: My API\n';
      }

      if (snippetName.toLowerCase() === 'version') {
        return '' +
          ind + 'version: v0.1\n';
      }

      if (snippetName.toLowerCase() === 'baseuri') {
        return '' +
          ind + 'baseUri: http://server/api/{version}\n';
      }

      return null;
    };

  });
