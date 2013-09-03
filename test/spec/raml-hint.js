'use strict';

var hinter, editor;

var describe = window.describe, beforeEach = window.beforeEach,
  it = window.it, getEditor = window.getEditor, should = window.should;


describe('RAML Hint Service', function () {
  beforeEach(function () {
    var $injector = angular.injector(['raml']);
    hinter = $injector.get('ramlHint');
    hinter.should.be.ok;
  });

  describe('computePath', function () {
    it('should handle root level paths', function () {
      editor = getEditor(
        'title: hello\n'+
        'version: v1.0\n' +
        'baseUri: http://example.com/api\n',
        {line: 1, ch: 4});
      var res = hinter.computePath(editor);
      res.should.be.ok;
      res.length.should.be.equal(1);
      res[0].should.be.equal('version');
    });

    it('should handle second level paths', function () {
      editor = getEditor(
        'title: hello\n'+
        'version: v1.0\n' +
        'baseUri: http://example.com/api\n' +
        '/hello:\n' +
        '  /bye:\n' +
        '    get:\n',
        {line: 5, ch: 4});

      var res = hinter.computePath(editor);
      res.should.be.ok;
      res.length.should.be.equal(3);
      res[0].should.be.equal('/hello');
      res[1].should.be.equal('/bye');
      res[2].should.be.equal('get');
    });

    it('should handle variable indentUnits', function () {
      //TODO Add test when decoupling indentUnit
    });
  });

  describe('getScopes', function () {
    it('should handle simple structures', function () {
      editor = getEditor(
        'title: hello\n'+
        'version: v1.0\n' +
        'baseUri: http://example.com/api\n' +
        '/hello:\n' +
        '  /bye:\n' +
        '    get: {}\n' +
        '  /ciao:\n' +
        '    get:');


      var scopesByLine = hinter.getScopes(editor).scopesByLine;
      scopesByLine[0].should.be.ok;
      (scopesByLine[0].length).should.be.equal(4);
      (scopesByLine[3].length).should.be.equal(2);
      (scopesByLine[4].length).should.be.equal(1);

      var scopeLevels = hinter.getScopes(editor).scopeLevels;
      (scopeLevels[0].length).should.be.equal(4);
      (scopeLevels[1].length).should.be.equal(2);
      (scopeLevels[2].length).should.be.equal(2);
      // TODO Why scope levels isn't an array?
      Object.keys(scopeLevels).length.should.be.equal(3);
    });
  });

  describe('getEditorState', function () {
    it('should be consistent with editor state', function () {
      editor = getEditor(
        'title: hello\n'+
        'version: v1.0\n' +
        'baseUri: http://example.com/api\n' +
        '/hello:\n' +
        '  /bye:\n' +
        '    get: {}\n' +
        '  /ciao:\n' +
        '    get:\n',
        {line: 4, ch: 4});

      var editorState = hinter.getEditorState(editor);
      (editorState).should.be.ok;
      (editorState.curWord).should.be.equal('bye');
      (editorState.start.line).should.be.equal(4);
      (editorState.start.ch).should.be.equal(3);
      (editorState.end.line).should.be.equal(4);
      (editorState.end.ch).should.be.equal(6);
      (editorState.curLine).should.be.equal('  /bye:');
      (editorState.currLineTabCount).should.be.equal(1);
    });
  });

  describe('getKeysToErase', function () {
    it('should list the keys at the same level with the same parent', function () {
      editor = getEditor(
        'title: hello\n'+
        'version: v1.0\n' +
        'baseUri: http://example.com/api\n' +
        '/hello:\n' +
        '  /bye:\n' +
        '    get: {}\n' +
        '  /ciao:\n' +
        '    get:', {line: 2, ch: 5});

      var keysToErase = hinter.getKeysToErase(editor);
      (keysToErase.length).should.be.equal(4);
      var ed = ['title', 'version', 'baseUri', '/hello'];
      var i;
      for (i = 0; i < ed.length; i++) {
        (keysToErase[i]).should.be.equal(ed[i]);
      }

    });
    it('should list third level keys ok', function () {
      editor = getEditor(
        'title: hello\n'+
        'version: v1.0\n' +
        'baseUri: http://example.com/api\n' +
        '/hello:\n' +
        '  /bye:\n' +
        '    get: {}\n' +
        '    post: {}\n' +
        '    put: {}\n' +
        '    delete: {}\n' +
        '  /ciao:\n' +
        '    get:', {line: 5, ch: 6});

      var keysToErase = hinter.getKeysToErase(editor);
      ['get', 'post', 'put', 'delete'].should.be.eql(keysToErase);

    });
  });

  describe('selectiveCloneAlternatives', function () {
    it('should clone all the keys in suggestions when keysToErase is empty', function () {

      function MyCustomClass(obj) {
        var that = this;
        if (obj) {
          Object.keys(obj).forEach(function (key) {
            var value = obj[key];
            that[key] = value;
          });
        }
      }

      var suggestions = new MyCustomClass({x: 1, y: 2});
      var alternatives = new MyCustomClass({a: 1, b: 2, c: 3, suggestions: suggestions});

      var newAlternatives = hinter.selectiveCloneAlternatives(alternatives, []);

      alternatives.should.not.equal(newAlternatives);
      alternatives.suggestions.should.not.equal(newAlternatives.suggestions);

      newAlternatives.should.contain.keys(Object.keys(alternatives));
      newAlternatives.isOpenSuggestion.should.be.equal(alternatives.constructor.name === 'OpenSuggestion');

      alternatives.suggestions.should.be.deep.equal(newAlternatives.suggestions);

    });

    it('should exclude the keys found in keysToErase', function () {

      var suggestions = {x: 1, y: 2};
      var alternatives = {a: 1, b: 2, c: 3, suggestions: suggestions};

      var newAlternatives = hinter.selectiveCloneAlternatives(alternatives, ['x']);

      alternatives.should.not.equal(newAlternatives);
      alternatives.suggestions.should.not.equal(newAlternatives.suggestions);

      newAlternatives.should.contain.keys(Object.keys(alternatives));
      newAlternatives.isOpenSuggestion.should.be.equal(alternatives.constructor.name === 'OpenSuggestion');

      newAlternatives.suggestions.y.should.be.equal(alternatives.suggestions.y);
      alternatives.suggestions.x.should.not.equal(newAlternatives.suggestions.x);
      should.not.exist(newAlternatives.suggestions.x);

    });
  });

  describe('getAlternatives', function () {
    it('should provide suggestRAML alternatives', function () {

      var alternatives = {suggestions: {a: {}, b: {}, c: {}}, category: 'x'};
      hinter.suggestRAML = function() {
        return alternatives;
      };
      editor = getEditor(
        'title: hello\n',
        {line: 1, ch: 0});
      var newAlternatives = hinter.getAlternatives(editor);

      alternatives.suggestions.should.be.deep.equal(newAlternatives.values.suggestions);

      newAlternatives.keys.length.should.be.equal(3);

    });

    it('should not provide existing keys', function () {
      var alternatives = {suggestions: {title: {}, a: {}, b: {}, c: {}}, category: 'x'};
      hinter.suggestRAML = function() {
        return alternatives;
      };
      editor = getEditor(
        'title: hello\n',
        {line: 1, ch: 0});
      var newAlternatives = hinter.getAlternatives(editor);

      should.not.exist(newAlternatives.values.title);
      newAlternatives.keys.should.not.include('title');
      newAlternatives.keys.length.should.be.equal(3);


    });

    describe('getSuggestions', function () {
      it('should render the text correctly', function () {
        var alternatives = {
          suggestions: {
            title: {},
            a: {
              metadata: {
                category: 'simple'
              }
            },
            b: {
              metadata: {
                category: 'complex'
              }
            },
            c: {
              metadata: {
                category: 'simple'
              }
            }
          },
          constructor: { name: 'OpenSuggestion' },
          metadata: {
            category: 'snippets',
            id: 'resource'
          }
        };
        hinter.suggestRAML = function() {
          return alternatives;
        };
        editor = getEditor(
          'title: hello\n',
          {line: 1, ch: 0});
        var shelfSuggestions = hinter.getSuggestions(editor);

        var titleFound = false;

        var shelfSuggestionKeys = {};

        shelfSuggestions.forEach(function (shelfSuggestion) {
          shelfSuggestionKeys[shelfSuggestion.name] = shelfSuggestion;
        });


        /* Check that all the alternatives are rendered correctly */
        Object.keys(alternatives.suggestions).forEach(function (suggestion) {
          /* Ignore if the key is title */
          if (suggestion === 'title') {
            titleFound = true;
            return;
          }

          shelfSuggestionKeys[suggestion].should.be.ok;
        });

        shelfSuggestionKeys['New resource'].should.be.ok;

        titleFound.should.be.true;

      });
    });

    describe('autocompleteHelper', function () {
      it('should render the text correctly', function () {
        var alternatives = {
          suggestions: {
            title: {
              metadata: {
                category: 'simple'
              },
              open: function () {
                return {constructor: {name: 'ConstantString'}};
              }
            },
            a: {
              metadata: {
                category: 'simple'
              },
              open: function () {
                return {constructor: {name: 'ConstantString'}};
              }
            },
            b: {
              metadata: {
                category: 'complex'
              },
              open: function () {
                return {constructor: {name: 'StringWildcard'}};
              }
            },
            c: {
              metadata: {
                category: 'simple'
              },
              open: function () {
                return {constructor: {name: 'ConstantString'}};
              }
            }
          },
          metadata: {
            category: 'snippets',
            id: 'resource'
          }
          };
        hinter.suggestRAML = function() {
          return alternatives;
        };
        editor = getEditor(
          'title: hello\n',
          {line: 1, ch: 0});
        var autocompleteSuggestions = hinter.autocompleteHelper(editor);

        autocompleteSuggestions.should.be.ok;

        var autocompleteSuggestionKeys = {};

        autocompleteSuggestions.list.forEach(function (autocompleteSuggestion) {
          var cleanedUpText = autocompleteSuggestion.text.replace(/:(.|\n)*/g, '');
          autocompleteSuggestionKeys[cleanedUpText] = autocompleteSuggestion;
        });

        alternatives.suggestions.should.include.keys(Object.keys(autocompleteSuggestionKeys));

        Object.keys(autocompleteSuggestionKeys).should.not.include.keys('title');

      });

    });


  });



});
