'use strict';

describe('ramlEditorApp', function () {
  var codeMirror;
  var applySuggestion;
  var ramlRepository;

  angular.module('editorShelfTest', ['ramlEditorApp', 'testFs']);
  beforeEach(module('editorShelfTest'));
  beforeEach(inject(function ($injector) {
    codeMirror = $injector.get('codeMirror');
    ramlRepository = $injector.get('ramlRepository');
    applySuggestion = $injector.get('applySuggestion');
  }));

  function getAutocompleteHelper(ramlSuggest, lines, cursor) {
    var editor = getEditor(codeMirror, lines, cursor);

    var file = createMockFile('api.raml', {root: true, doc: editor, contents: lines.join('')});
    ramlRepository.children = [file];
    ramlRepository.loadDirectory();

    return new Promise(function(resolve) {
      function callback(result) { resolve(result); }

      ramlSuggest.autocompleteHelper(editor, callback, {async: true}, ramlRepository.rootDirectory, file);
    });
  }

  function getWord(ramlSuggest, lines, cursor) {
    return getAutocompleteHelper(ramlSuggest, lines, cursor)
            .then(function(hint) {
              return hint.word;
            });
  }

  function getSuggestions(ramlSuggest, contentLines, cursor) {
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

        getSuggestions(ramlSuggest, contentLines, cursor)
          .then(function(suggestions) {
            var suggestionTexts = suggestions.map(function (suggestion) {
              suggestions[suggestion.displayText] = true;
            });
            ['title', 'content'].forEach(function (key) {
              suggestionTexts.should.not.have.key(key);
            });
          });
      });

      it('should not exclude keys from another array for documentation suggestions', function (done) {
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
          .then(function(suggestions) {
            var suggestionTexts = suggestions.map(function (suggestion) {
              return suggestion.displayText;
            });

            suggestionTexts.should.include('content');

            done();
          });
      });

      it('should include values from array for protocol suggestions', function (done) {
        var contentLines = [
          '#%RAML 1.0',
          'title: Title',
          'protocols: '
        ];
        var cursor = {line: 2, ch: 11};

        getSuggestions(ramlSuggest, contentLines, cursor)
          .then(function(suggestions) {
            var suggestionTexts = suggestions.map(function (suggestion) {
              return suggestion.displayText || suggestion.text;
            });

            suggestionTexts.should.include('HTTPS');
            suggestionTexts.should.include('HTTP');

            done();
          });
      });

      it('should include values from array for resource method protocol suggestions', function (done) {
        var contentLines = [
          '#%RAML 1.0',
          'title: Title',
          '/newResource:',
          '  displayName: resourceName',
          '  get:',
          '    protocols: '
        ];
        var cursor = {line: 5, ch: 15};

        getSuggestions(ramlSuggest, contentLines, cursor)
          .then(function(suggestions) {
            var suggestionTexts = suggestions.map(function (suggestion) {
                return suggestion.displayText || suggestion.text;
              });

            suggestionTexts.should.include('HTTP');
            suggestionTexts.should.include('HTTPS');

            done();
          });
      });

      it('should exclude "title" and "version" keys at root level', function (done) {
        var contentLines = [
          '#%RAML 1.0',
          'title: Title',
          'version: Version',
          ''
        ];

        var cursor = {line: 3, ch: 0};

        getSuggestions(ramlSuggest, contentLines, cursor)
          .then(function(suggestions){
            var suggestionTexts = suggestions.map(function (suggestion) {
                return suggestion.displayText || suggestion.text;
              });

              suggestionTexts.should.not.include('title');
              suggestionTexts.should.not.include('version');

              done();
          });
      });

      it('should include "get", "post", "put" and "delete" keys at resource level', function (done) {
        var contentLines = [
          '#%RAML 0.8',
          'title: Title',
          '/:',
          ' get:',
          ' '
        ];
        var cursor = {line: 4, ch: 1};


        getSuggestions(ramlSuggest, contentLines, cursor)
          .then(function(suggestions){
            var suggestionTexts = suggestions.map(function (suggestion) {
              return suggestion.displayText || suggestion.text;
            });

            suggestionTexts.should.include('get');
            suggestionTexts.should.include('post');
            suggestionTexts.should.include('put');
            suggestionTexts.should.include('delete');

            done();
          });
      });
    });

    describe('autocompleteHelper', function () {
      var ramlSuggest;

      beforeEach(inject(function ($injector) {
        ramlSuggest = $injector.get('ramlSuggest');
      }));

      it('should detect an empty word for an empty line', function (done) {
        getWord(ramlSuggest, ['#RAML1.0', ''], {line: 1, ch: 0})
          .then(function (word) {
            word.should.be.empty();
            done();
          });
      });

      it('should detect an empty word for a line with whitespaces only', function (done) {
        getWord(ramlSuggest, [' '], {line: 0, ch: 1})
          .then(function (word) {
            word.should.be.empty();
            done();
          });
      });

      it('should detect a word that is RAML tag for a first line with comments', function (done) {
        getWord(ramlSuggest, [' #RAML'], {line: 0, ch: 6})
          .then(function (word) {
            word.should.be.equal('#RAML');
            done();
          });
      });

      it('should detect a word for a simple line', function (done) {
        getWord(ramlSuggest, [' word'], {line: 0, ch: 2})
          .then(function(word) {
            word.should.be.equal('word');
            done();
          });
      });

      it('should detect an empty word for array element', function (done) {
        getWord(ramlSuggest, ['- '], {line: 0, ch: 1})
          .then(function(word) {
            word.should.be.equal('');
            done();
          });
      });

      it('should detect a word for array element', function (done) {
        getWord(ramlSuggest, ['- word'], {line: 0, ch: 5})
          .then(function(word) {
            word.should.be.equal('word');
            done();
          });
      });

      it('should detect a word for array element with whitespaces', function (done) {
        getWord(ramlSuggest, ['  - word'], {line: 0, ch: 4})
          .then(function (word) {
            word.should.be.equal('word');
            done();
          });
      });

      it('should start autocompletion at current cursor position if there is no word', function (done) {
        getAutocompleteHelper(ramlSuggest, ['#RAML1.0', 'description:', ' - '], {line: 2, ch: 2})
          .then(function(result) {
            result.from.line.should.equal(2);
            result.from.ch.should.equal(2);
            result.to.line.should.equal(2);
            result.to.ch.should.equal(2);

            done();
          });
      });
    });

    describe('autocompleteHelper 2', function () {
      it('should use text in current line to get hints', function (done) {
        var contentLines = [
          '#%RAML 1.0',
          'title: hello',
          'v'
        ];
        var cursor = {line: 2, ch: 1};

        getSuggestions(ramlSuggest, contentLines, cursor)
          .then(function(suggestions) {
            var suggestionTexts = suggestions.map(function (suggestion) {
              return suggestion.displayText || suggestion.text;
            });

            suggestionTexts.should.include('version');
            suggestionTexts.should.not.include('title');
            suggestionTexts.should.not.include('description');

            done();
          });
      });
    });
  });

  //--------- Utility functions


  function createMockFile(name, options) {
    options = options || {};

    return {
      name: name,
      path: '/' + name,
      isDirectory: false,
      loaded: options.contents,
      contents: options.contents,
      doc: options.doc
    };
  }
});
