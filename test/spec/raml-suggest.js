'use strict';

describe('ramlEditorApp', function () {
  var rootScope;
  var codeMirror;
  var applySuggestion;
  var ramlRepository;

  angular.module('editorShelfTest', ['ramlEditorApp', 'testFs']);
  beforeEach(module('editorShelfTest'));
  beforeEach(inject(function ($injector, $rootScope) {
    rootScope = $rootScope;
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
            .then(function(hint) { return hint.word; });
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
            result.to.ch.should.equal(3);

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

      it('should suggest "include"', function (done) {
        var contentLines = [
          '#%RAML 1.0',
          'title: hello',
          'types: !i'
        ];
        var cursor = {line: 2, ch: 9};

        getAutocompleteHelper(ramlSuggest, contentLines, cursor)
          .then(function(suggestion) {
            var suggestionTexts = suggestion.list.map(function (suggestion) {
              return suggestion.displayText || suggestion.text;
            });

            suggestionTexts.should.include('include');
            suggestion.list.should.have.length.be(1);
            suggestion.word.should.be.equal('i');

            done();
          });
      });
    });

    describe('FSResolver', function () {
      var firstFileContent = 'title: First File';
      function createFSResolver() {
        var cursor = {line: 0, ch: 0};

        var firstEditor = getEditor(codeMirror, [firstFileContent], cursor);

        var firstFile = createMockFile('first.raml', {
          root: true,
          loaded: true,
          doc: firstEditor,
          contents: firstFileContent
        });
        var secondFile = createMockFile('second.raml', {root: false});
        var thirdFile = createMockFile('third.raml', {root: false});
        var directory = createMockDirectory('libraries');
        ramlRepository.children = [firstFile, secondFile, thirdFile, directory];
        ramlRepository.loadDirectory();

        return new ramlSuggest.FSResolver(ramlRepository.rootDirectory, ramlRepository);
      }

      it('should return the correct content for each file', function (done) {
        var fsResolver = createFSResolver();

        fsResolver.contentAsync('/first.raml')
          .then(function (firstResult) {
            firstResult.should.be.equals(firstFileContent);

            fsResolver.contentAsync('/second.raml')
              .then(function (secondResult) {
              secondResult.should.be.equal('second.raml content');
              done();
            });
            rootScope.$apply();
          });

      });

      it('should return the list with all children', function (done) {
        var fsResolver = createFSResolver();

        fsResolver.listAsync('/')
          .then(function (result) {
            result.should.contain('first.raml');
            result.should.contain('second.raml');
            result.should.contain('third.raml');
            done();
          });
      });

      it('should return true for /first.raml and false for fourth.raml', function (done) {
        var fsResolver = createFSResolver();

        fsResolver.existsAsync('/first.raml')
          .then(function (result) {
            result.should.be.true();
            fsResolver.existsAsync('/fourth.raml')
              .then(function (result) {
                result.should.be.false();
                done();
              });
          });
      });

      it('should return dirname "/"', function () {
        var fsResolver = createFSResolver();

        fsResolver.dirname('/first.raml').should.be.equal('/');
        fsResolver.dirname('/libraries').should.be.equal('/libraries');
        fsResolver.dirname('/nodir').should.be.equal('');
      });

      it('should the diferent paths', function () {
        var fsResolver = createFSResolver();

        fsResolver.resolve('/first', '/second').should.be.equal('/second');
        fsResolver.resolve('/first', 'second').should.be.equal('/first/second');
        fsResolver.resolve('/first', 'second/').should.be.equal('/first/second/');
        fsResolver.resolve('first', '/second').should.be.equal('/second');
        fsResolver.resolve('first', 'second').should.be.equal('first/second');
      });

      it('should return the rigth extension for directories and files', function () {
        var fsResolver = createFSResolver();

        fsResolver.extname('/first.raml').should.be.equal('raml');
        fsResolver.extname('/libraries').should.be.equal('');
        fsResolver.extname('/nodir').should.be.equal('');
      });

      it('should return the right if is a directory or not', function (done) {
        var fsResolver = createFSResolver();

        fsResolver.isDirectoryAsync('/first.raml')
          .then(function (result) {
            result.should.be.false();
            fsResolver.isDirectoryAsync('/libraries')
              .then(function(result) {
                result.should.be.true();
                fsResolver.isDirectoryAsync('/nodir')
                  .then(function(result) {
                    result.should.be.false();
                    done();
                  });
              });
          });
      });
    });

    describe('EditorStateProvider', function () {
      it('should create a state provider', function () {
        var firstFileLines = ['#RAML 1.0', 'title: First File'];
        var cursor = {line: 1, ch: 3};

        var firstEditor = getEditor(codeMirror, firstFileLines, cursor);

        var firstFile = createMockFile('first.raml', {
          root: true,
          loaded: true,
          doc: firstEditor,
          contents: firstFileLines.join('\n')
        });
        ramlRepository.children = [firstFile];
        ramlRepository.loadDirectory();

        var fsResolver = new ramlSuggest.FSResolver(ramlRepository.rootDirectory, ramlRepository);
        var editorStateProvider = new ramlSuggest.EditorStateProvider(fsResolver, '/first.raml', firstEditor);

        editorStateProvider.getText().should.be.equal(firstFileLines.join('\n'));
        editorStateProvider.getPath().should.be.equal('/first.raml');
        editorStateProvider.getBaseName().should.be.equal('first.raml');
        editorStateProvider.getOffset().should.be.equal(13);
      });
    });
  });

  //--------- Utility functions

  function createMockDirectory(name) {
    return {
      name: name,
      path: '/' + name,
      isDirectory: true
    };
  }

  function createMockFile(name, options) {
    options = options || {};

    return {
      name: name,
      path: '/' + name,
      isDirectory: false,
      loaded: options.loaded !== undefined ? options.loaded : options.contents,
      contents: options.contents,
      doc: options.doc
    };
  }
});
