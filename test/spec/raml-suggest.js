'use strict';

describe('ramlEditorApp', function () {
  var codeMirror;
  var applySuggestion;
  var ramlRepository;

  angular.module('editorShelfTest', ['ramlEditorApp', 'testFs']);
  beforeEach(module('editorShelfTest'));
  beforeEach(inject(function ($injector) {
    codeMirror      = $injector.get('codeMirror');
    ramlRepository  = $injector.get('ramlRepository');
    applySuggestion = $injector.get('applySuggestion');
  }));

  function getAutocompleteHelper(ramlSuggest, lines, cursor){
      var editor = getEditor(codeMirror, lines, cursor);

      var file = createMockFile('api.raml', {root: true, doc: editor, contents: lines.join('')});
      ramlRepository.children = [file];
      ramlRepository.loadDirectory();

  return ramlSuggest.autocompleteHelper(editor, ramlRepository.rootDirectory, file);
      }

  function getWord(ramlSuggest, lines, cursor) {
    return getAutocompleteHelper(ramlSuggest, lines, cursor).word;
  }

  function getSuggestions(ramlSuggest, contentLines, cursor){
      var editor = getEditor(codeMirror, contentLines, cursor);

      var file = createMockFile('api.raml', {root: true, doc: editor, contents: contentLines.join('')});
      ramlRepository.children = [file];
      ramlRepository.loadDirectory();

    return ramlSuggest.suggest(ramlRepository.rootDirectory, file, editor);
  }

  describe('ramlSuggest', function () {
    var ramlSuggest;

    beforeEach(inject(function ($injector) {
      ramlSuggest = $injector.get('ramlSuggest');
    }));

    describe('suggest', function () {
      it('should exclude "title" and "content" keys at documentation', function () {
        var contentLines = [
          '#%RAML 1.0',
          'documentation:',
          ' - title: Title',
          ' content: Content' +
          ' '
        ];
        var cursor = {line: 4, ch: 1};

        var suggestions = {};
        getSuggestions(ramlSuggest, contentLines, cursor)
          .map(function (suggestion) {
            suggestions[suggestion.displayText] = true;
          });

        ['title', 'content'].forEach(function (key) {
          suggestions.should.not.have.key(key);
        });
      });

      it('should not exclude keys from another array for documentation suggestions', function () {
        var contentLines = [
          '#%RAML 1.0',
          'documentation:',
          ' - title: Title',
          '   content: Content',
          ' - title: Other title',
          ' '
        ];
        var cursor = {line: 5, ch: 1};

        getSuggestions(ramlSuggest, contentLines, cursor)
          .map(function (suggestion) { return suggestion.displayText; })
          .should.include('content');
      });

      it('should include values from array for protocol suggestions', function () {
        var contentLines = [
          '#%RAML 1.0',
          'title: Title',
          'protocols: '
        ];
        var cursor = {line: 2, ch: 11};

        var suggestions = getSuggestions(ramlSuggest, contentLines, cursor)
          .map(function (suggestion) { return suggestion.displayText || suggestion.text; });

        suggestions.should.include('HTTPS');
        suggestions.should.include('HTTP');
      });

      it('should include values from array for resource method protocol suggestions', function () {
        var contentLines = [
          '#%RAML 1.0',
          'title: Title',
          '/newResource:',
          '  displayName: resourceName',
          '  get:',
          '    protocols: '
        ];
        var cursor = {line: 5, ch: 15};

        var suggestions = getSuggestions(ramlSuggest, contentLines, cursor)
          .map(function (suggestion) { return suggestion.displayText || suggestion.text; });

        suggestions.should.include('HTTP');
        suggestions.should.include('HTTPS');
      });

      it('should exclude "title" and "version" keys at root level', function () {
        var contentLines = [
          '#%RAML 1.0',
          'title: Title',
          'version: Version',
          ''
        ];

        var cursor = {line: 3, ch: 0};

        var suggestions = getSuggestions(ramlSuggest, contentLines, cursor)
          .map(function (suggestion) { return suggestion.displayText || suggestion.text; });

        suggestions.should.not.include('title');
        suggestions.should.not.include('version');
      });

      it('should include "get", "post", "put" and "delete" keys at resource level', function () {
        var contentLines = [
          '#%RAML 0.8',
          'title: Title',
          '/:',
          ' get:',
          ' '
        ];
        var cursor = {line: 4, ch: 1};


        var suggestions = getSuggestions(ramlSuggest, contentLines, cursor)
          .map(function (suggestion) { return suggestion.displayText || suggestion.text; });

        suggestions.should.include('get');
        suggestions.should.include('post');
        suggestions.should.include('put');
        suggestions.should.include('delete');
      });
    });

    describe('autocompleteHelper', function () {
      var ramlSuggest;

      beforeEach(inject(function ($injector) {
        ramlSuggest = $injector.get('ramlSuggest');
      }));

      it('should detect an empty word for an empty line', function () {
        getWord(ramlSuggest, ['#RAML1.0',''], {line: 1, ch: 0}).should.be.empty();
      });

      it('should detect an empty word for a line with whitespaces only', function () {
        getWord(ramlSuggest, [' '], {line: 0, ch: 1}).should.be.empty();
      });

      it('should detect a word that is RAML tag for a first line with comments', function () {
        getWord(ramlSuggest, [' #RAML'], {line: 0, ch: 6}).should.be.equal('#RAML');
      });

      it('should detect a word for a simple line', function () {
        getWord(ramlSuggest, [' word']).should.be.equal('word');
      });

      it('should detect an empty word for array element', function () {
        getWord(ramlSuggest, ['- ']).should.be.equal('');
      });

      it('should detect a word for array element', function () {
        getWord(ramlSuggest, ['- word']).should.be.equal('word');
      });

      it('should detect a word for array element with whitespaces', function () {
        getWord(ramlSuggest, ['  - word'], {line: 0, ch: 4}).should.be.equal('word');
      });

      it('should start autocompletion at current cursor position if there is no word', function () {
        var result = getAutocompleteHelper(ramlSuggest, ['#RAML1.0', 'description:',' - '], {line: 2, ch: 2});
        result.from.should.be.deep.equal({line: 2, ch: 2});
        result.to.should.be.deep.equal({line: 2, ch: 2});
      });
    });

    describe('autocompleteHelper 2', function () {
      it('should use text in current line to get hints', function () {
        var contentLines = [
            'title: hello',
            'v'
          ];
        var cursor = {line: 1, ch: 1};

        var suggestions = getSuggestions(ramlSuggest, contentLines, cursor)
          .map(function (suggestion) { return suggestion.displayText || suggestion.text; });

        suggestions.should.include('version');
        suggestions.should.not.include('title');
        suggestions.should.not.include('description');
      });
    });
  });

  //--------- Utility functions


  function createMockFile(name, options) {
    options = options || {};

    return {
      name:         name,
      path:         '/' + name,
      isDirectory:  false,
      loaded:       options.contents,
      contents:     options.contents,
      doc:          options.doc
    };
  }
});
