'use strict';

var hinter, editor;

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
      res.should.be.deep.equal(['/hello', '/bye', 'get']);
    });

    it('should inform when tab levels are invalid', function () {
      editor = getEditor(
        'title: hello\n'+
        'version: v1.0\n' +
        'baseUri: http://example.com/api\n' +
        '/hello:\n' +
        '  /bye:\n' +
        '    /foo:\n' +
        '              ',
        {line: 6, ch: 14});
      var res = hinter.computePath(editor);
      should.not.exist(res);
    });

    it('should offer computePath to lists at the same level', function () {
      editor = getEditor(
        'title: hello\n'+
        'version: v1.0\n' +
        'baseUri: http://example.com/api\n' +
        'traits:\n' +
        '  - hello:\n' +
        '      displayName: hello\n' +
        '  - hello2:\n' +
        '      displayName: hello2\n' +
        '  ',
        {line: 8, ch: 2});
      var res = hinter.computePath(editor);
      res.should.be.deep.equal(['traits', '']);
    });

    it('should offer computePath to lists at a more nested level', function () {
      editor = getEditor(
        'title: hello\n'+
        'version: v1.0\n' +
        'baseUri: http://example.com/api\n' +
        'traits:\n' +
        '  - hello:\n' +
        '      displayName: hello\n' +
        '  - hello2:\n' +
        '      displayName: hello2\n' +
        '    ',
        {line: 8, ch: 3});
      var res = hinter.computePath(editor);
      res.should.be.deep.equal(['traits', '']);
    });

    it('should offer options to valid elements inside lists', function () {
      editor = getEditor(
        'title: hello\n'+
        'version: v1.0\n' +
        'baseUri: http://example.com/api\n' +
        'traits:\n' +
        '  - hello:\n' +
        '      displayName: hello\n' +
        '  - hello2:\n' +
        '      displayName: hello\n' +
        '      ',
        {line: 8, ch: 6});
      var res = hinter.computePath(editor);
      res.should.be.deep.equal(['traits', 'hello2', '']);
      res.should.be.ok;
    });

    it('should offer options to valid elements inside dictionary lists', function () {
      editor = getEditor(
        'title: hello\n'+
        'version: v1.0\n' +
        'baseUri: http://example.com/api\n' +
        'traits:\n' +
        '  - hello:\n' +
        '      displayName: hello\n' +
        '    hello:\n' +
        '      displayName: hello\n' +
        '      ',
        {line: 8, ch: 5});
      var res = hinter.computePath(editor);
      res.should.be.ok;
    });

    it.skip('should handle variable indentUnits', function () {
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
      scopesByLine.should.be.deep.equal({
        0: [
            [0, 'title: hello'],
            [1, 'version: v1.0'],
            [2, 'baseUri: http://example.com/api'],
            [3, '/hello:']
          ],
        3: [
            [4, '/bye:'],
            [6, '/ciao:']
          ],
        4: [
            [5, 'get: {}']
          ],
        6: [
          [7, 'get:']
        ]});

      var scopeLevels = hinter.getScopes(editor).scopeLevels;
      (scopeLevels[0].length).should.be.equal(4);
      (scopeLevels[1].length).should.be.equal(2);
      (scopeLevels[2].length).should.be.equal(2);
      // TODO Why scope levels isn't an array?
      Object.keys(scopeLevels).length.should.be.equal(3);
    });

    it('should handle structures with lists', function () {
      editor = getEditor(
        'title: hello\n'+
        'version: v1.0\n' +
        'baseUri: http://example.com/api\n' +
        'traits:\n' +
        '  - my_trait:\n' +
        '      displayName: My Trait\n' +
        '  - my_trait2:\n' +
        '      displayName: My Trait 2\n' +
        '/hello:\n' +
        '  /bye:\n' +
        '    get: {}\n' +
        '  /ciao:\n' +
        '    get:');


      var scopesByLine = hinter.getScopes(editor).scopesByLine;
      var scopeLevels = hinter.getScopes(editor).scopeLevels;
      scopesByLine.should.be.deep.equal({
        0: [
            [0, 'title: hello'],
            [1, 'version: v1.0'],
            [2, 'baseUri: http://example.com/api'],
            [3, 'traits:'],
            [8, '/hello:']
          ],
        3: [
          [4, '- my_trait:'],
          [6, '- my_trait2:']
        ],
        4: [
            [5, 'displayName: My Trait']
          ],
        5: [
            [7, 'displayName: My Trait 2']
          ],
        8: [
          [9, '/bye:'],
          [11, '/ciao:']
        ],
        9: [
          [10, 'get: {}']
        ],
        11: [
          [12, 'get:']
        ]});

      scopeLevels.should.be.deep.equal({
        0: [0,1,2,3,8],
        1: [4,6,9,11],
        2: [5,10,12],
        3: [7]
      });

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

    it('curr line tab count should count only the leading spaces', function () {
      editor = getEditor(
        'title: hello\n'+
        'version: v1.0\n' +
        'baseUri: http://example.com/api\n' +
        '/hello:\n' +
        '  /bye:\n' +
        '    get: {}\n' +
        '      description: this is a text     with spaces\n' +
        '  /ciao:\n' +
        '    get:\n',
        {line: 6, ch: 6});

      var editorState = hinter.getEditorState(editor);
      (editorState).should.be.ok;
      (editorState.curWord).should.be.equal('description');
      (editorState.start.line).should.be.equal(6);
      (editorState.start.ch).should.be.equal(6);
      (editorState.end.line).should.be.equal(6);
      (editorState.end.ch).should.be.equal(17);
      (editorState.curLine).should.be.equal('      description: this is a text     with spaces');
      (editorState.currLineTabCount).should.be.equal(3);
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

    it('should return empty list when using empty alternatives', function () {
      var alternatives = {suggestions: {title: {}, a: {}, b: {}, c: {}}, category: 'x'};
      hinter.suggestRAML = function() {
        return alternatives;
      };
      sinon.stub(hinter, 'computePath').returns(undefined);

      editor = getEditor(
        'title: hello\n' +
        '      ',
        {line: 1, ch: 6});

      var newAlternatives = hinter.getAlternatives(editor);
      newAlternatives.keys.should.be.deep.equal([]);
      newAlternatives.values.should.be.deep.equal({});
      newAlternatives.path.should.be.deep.equal([]);

      hinter.computePath.restore();
    });

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

      titleFound.should.be.equal(true);

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
        var cleanedUpText = autocompleteSuggestion.text.replace(/:(\w|\n|\s)*/g, '');
        autocompleteSuggestionKeys[cleanedUpText] = autocompleteSuggestion;
      });

      alternatives.suggestions.should.include.keys(Object.keys(autocompleteSuggestionKeys));

      Object.keys(autocompleteSuggestionKeys).should.not.include.keys('title');

    });

  });



});
