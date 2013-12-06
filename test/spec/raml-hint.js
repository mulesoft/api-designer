'use strict';

describe('ramlEditorApp', function () {
  var codeMirror;

  beforeEach(module('ramlEditorApp'));
  beforeEach(inject(function ($injector) {
    codeMirror = $injector.get('codeMirror');
  }));

  describe('ramlHint', function () {
    var ramlHint;

    beforeEach(inject(function ($injector) {
      ramlHint = $injector.get('ramlHint');
    }));

    describe('computePath', function () {
      it('should stop travelling when root level has been reached', function () {
        var editor = getEditor(codeMirror,
          [
            'traits:',
            '  - trait:',
            '      displayName: trait',
            '/:',
            '  options:',
            '    description:'
          ],
          {
            line: 5,
            ch:   0
          }
        );

        var path = ramlHint.computePath(editor);
        [].concat(path).should.be.deep.equal(['/', 'options', 'description']);
        path.listsTraveled.should.be.equal(0);
      });

      it('should return NULL for the first line', function () {
        var path = ramlHint.computePath(getEditor(codeMirror, ''));
        should.equal(path, null);
      });

      it('should handle root level paths', function () {
        var editor = getEditor(codeMirror,
          [
            'title: hello',
            'version: v1.0',
            'baseUri: http://example.com/api'
          ],
          {line: 1, ch: 4}
        );

        [].concat(ramlHint.computePath(editor)).should.be.deep.equal(['version']);
      });

      it('should handle second level paths', function () {
        var editor = getEditor(codeMirror,
          [
            'title: hello',
            'version: v1.0',
            'baseUri: http://example.com/api',
            '/hello:',
            '  /bye:',
            '    get:',
          ],
          {line: 5, ch: 4}
        );

        [].concat(ramlHint.computePath(editor)).should.be.deep.equal(['/hello', '/bye', 'get']);
      });

      it('should inform when tab levels are invalid', function () {
        var editor = getEditor(codeMirror,
          [
            'title: hello',
            'version: v1.0',
            'baseUri: http://example.com/api',
            '/hello:',
            '  /bye:',
            '    /foo:',
            '              '
          ],
          {line: 6, ch: 14}
        );

        should.not.exist(ramlHint.computePath(editor));
      });

      it('should offer computePath to lists at the same level', function () {
        var editor = getEditor(codeMirror,
          [
            'title: hello',
            'version: v1.0',
            'baseUri: http://example.com/api',
            'traits:',
            '  - hello:',
            '      displayName: hello',
            '  - hello2:',
            '      displayName: hello2',
            '  '
          ],
          {line: 8, ch: 2}
        );

        [].concat(ramlHint.computePath(editor)).should.be.deep.equal(['traits', '']);
      });

      it('should offer options to valid elements inside lists', function () {
        var editor = getEditor(codeMirror,
          [
            'title: hello',
            'version: v1.0',
            'baseUri: http://example.com/api',
            'traits:',
            '  - hello:',
            '      displayName: hello',
            '  - hello2:',
            '      displayName: hello',
            '      '
          ],
          {line: 8, ch: 6}
        );

        [].concat(ramlHint.computePath(editor)).should.be.deep.equal(['traits', 'hello2', '']);
      });

      it('should return null for first line first char', function () {
        var editor = getEditor(codeMirror,
          [
            'title: hello',
            'version: v1.0',
            'baseUri: http://example.com/api'
          ],
          {line: 0, ch: 0}
        );

        should.not.exist(ramlHint.computePath(editor));
      });

      it('should return null for first line non first char', function () {
        var editor = getEditor(codeMirror,
          [
            'title: hello',
            'version: v1.0',
            'baseUri: http://example.com/api',
          ],
          {line: 0, ch: 4}
        );

        should.not.exist(ramlHint.computePath(editor));
      });

      it('should detect valid number of traveled lists #1', function () {
        ramlHint.computePath(getEditor(codeMirror,
          [
            'traits',
            '  - trait1:',
            '      displayName:' // <--
          ].join('\n'),
          {
            line: 2,
            ch:   6
          }
        )).listsTraveled.should.be.equal(1);
      });

      it('should detect valid number of traveled lists #2', function () {
        ramlHint.computePath(getEditor(codeMirror,
          [
            'traits',
            '  - trait1:',
            '      displayName:',
            '  - trait2:',
            '      displayName:' // <--
          ].join('\n'),
          {
            line: 4,
            ch:   6
          }
        )).listsTraveled.should.be.equal(1);
      });

      it('should detect valid number of traveled lists #3', function () {
        ramlHint.computePath(getEditor(codeMirror,
          [
            '- list1:',
            '    - list2:',
            '        key1:' // <--
          ].join('\n'),
          {
            line: 2,
            ch:   8
          }
        )).listsTraveled.should.be.equal(2);
      });

      it('should detect valid number of traveled lists #4', function () {
        ramlHint.computePath(getEditor(codeMirror,
          [
            'documentation:',
            '  - title:'
          ].join('\n'),
          {
            line: 1,
            ch:   4
          }
        )).listsTraveled.should.be.equal(1);
      });
    });

    describe('getEditorState', function () {
      it('should be consistent with editor state', function () {
        var editor = getEditor(codeMirror,
          [
            'title: hello',
            'version: v1.0',
            'baseUri: http://example.com/api',
            '/hello:',
            '  /bye:',
            '    get: {}',
            '  /ciao:',
            '    get:'
          ],
          {line: 4, ch: 4}
        );

        var editorState = ramlHint.getEditorState(editor);
        (editorState).should.be.ok;
        (editorState.curWord).should.be.equal('/bye:');
        (editorState.start.line).should.be.equal(4);
        (editorState.start.ch).should.be.equal(2);
        (editorState.end.line).should.be.equal(4);
        (editorState.end.ch).should.be.equal(7);
        (editorState.curLine).should.be.equal('  /bye:');
        (editorState.currLineTabCount).should.be.equal(1);
      });

      it('curr line tab count should count only the leading spaces', function () {
        var editor = getEditor(codeMirror,
          [
            'title: hello',
            'version: v1.0',
            'baseUri: http://example.com/api',
            '/hello:',
            '  /bye:',
            '    get: {}',
            '      description: this is a text     with spaces',
            '  /ciao:',
            '    get:',
          ],
          {line: 6, ch: 6}
        );

        var editorState = ramlHint.getEditorState(editor);
        (editorState).should.be.ok;
        (editorState.curWord).should.be.equal('description:');
        (editorState.start.line).should.be.equal(6);
        (editorState.start.ch).should.be.equal(6);
        (editorState.end.line).should.be.equal(6);
        (editorState.end.ch).should.be.equal(18);
        (editorState.curLine).should.be.equal('      description: this is a text     with spaces');
        (editorState.currLineTabCount).should.be.equal(3);
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

        var newAlternatives = ramlHint.selectiveCloneAlternatives(alternatives, []);

        alternatives.should.not.equal(newAlternatives);
        alternatives.suggestions.should.not.equal(newAlternatives.suggestions);

        newAlternatives.should.contain.keys(Object.keys(alternatives));
        newAlternatives.isOpenSuggestion.should.be.equal(alternatives.constructor.name === 'OpenSuggestion');

        alternatives.suggestions.should.be.deep.equal(newAlternatives.suggestions);
      });

      it('should exclude the keys found in keysToErase', function () {
        var suggestions = {x: 1, y: 2};
        var alternatives = {a: 1, b: 2, c: 3, suggestions: suggestions};

        var newAlternatives = ramlHint.selectiveCloneAlternatives(alternatives, ['x']);

        alternatives.should.not.equal(newAlternatives);
        alternatives.suggestions.should.not.equal(newAlternatives.suggestions);

        newAlternatives.should.contain.keys(Object.keys(alternatives));
        newAlternatives.isOpenSuggestion.should.be.equal(alternatives.constructor.name === 'OpenSuggestion');

        newAlternatives.suggestions.y.should.be.equal(alternatives.suggestions.y);
        alternatives.suggestions.x.should.not.equal(newAlternatives.suggestions.x);
        should.not.exist(newAlternatives.suggestions.x);
      });

      it('should exclude optional keys', function () {
        var suggestions     = {a: 1, b: {value:2, metadata:{canBeOptional:true}}, c: 3};
        var alternatives    = {suggestions: suggestions};
        var newAlternatives = ramlHint.selectiveCloneAlternatives(alternatives, ['b?']);

        Object.keys(newAlternatives.suggestions).should.be.deep.equal(['a', 'c']);
      });
    });

    describe('getAlternatives', function () {
      it('should provide suggestRAML alternatives', function () {
        var alternatives = {suggestions: {a: {}, b: {}, c: {}}, category: 'x'};
        ramlHint.suggestRAML = function() {
          return alternatives;
        };
        var editor = getEditor(codeMirror,
          [
            'title: hello'
          ],
          {line: 1, ch: 0}
        );

        var newAlternatives = ramlHint.getAlternatives(editor);
        alternatives.suggestions.should.be.deep.equal(newAlternatives.values.suggestions);

        newAlternatives.keys.length.should.be.equal(3);
      });

      it('should not provide existing keys', function () {
        var alternatives = {suggestions: {title: {}, a: {}, b: {}, c: {}}, category: 'x'};
        ramlHint.suggestRAML = function() {
          return alternatives;
        };
        var editor = getEditor(codeMirror,
          [
            'title: hello'
          ],
          {line: 1, ch: 0}
        );

        var newAlternatives = ramlHint.getAlternatives(editor);

        should.not.exist(newAlternatives.values.title);
        newAlternatives.keys.should.not.include('title');
        newAlternatives.keys.length.should.be.equal(3);
      });

      it('should provide options on spaces only line depending where the cursor is', function () {
        var alternatives = {suggestions: {title: {}, a: {}, b: {}, c: {}}, category: 'x'};
        var suggestRAMLStub = sinon.stub(ramlHint, 'suggestRAML');
        suggestRAMLStub.withArgs([]).returns(alternatives);
        suggestRAMLStub.withArgs(['/hello']).returns({suggestions: {x: {}, y: {}, z:{}}, category: 'y'});

        var editor = getEditor(codeMirror,
          [
            'title: hello',
            '/hello:',
            '         '
          ],
          {line: 2, ch: 0}
        );

        var newAlternatives = ramlHint.getAlternatives(editor);

        should.not.exist(newAlternatives.values.title);
        newAlternatives.keys.should.be.deep.equal(['a', 'b', 'c']);

        suggestRAMLStub.firstCall.calledWith([]).should.be.equal(true);

        editor.setCursor(2, 2);

        newAlternatives = ramlHint.getAlternatives(editor);
        newAlternatives.keys.should.be.deep.equal(['x', 'y', 'z']);

        suggestRAMLStub.secondCall.calledWith(['/hello']).should.be.equal(true);

        editor.setCursor(2, 4);

        newAlternatives = ramlHint.getAlternatives(editor);
        newAlternatives.keys.should.be.deep.equal([]);

        ramlHint.suggestRAML.restore();
      });

      it('should return empty list when using empty alternatives', function () {
        var alternatives = {suggestions: {title: {}, a: {}, b: {}, c: {}}, category: 'x'};
        ramlHint.suggestRAML = function() {
          return alternatives;
        };
        sinon.stub(ramlHint, 'computePath').returns(undefined);

        var editor = getEditor(codeMirror,
          [
            'title: hello',
            '      ',
          ],
          {line: 1, ch: 6}
        );

        var newAlternatives = ramlHint.getAlternatives(editor);
        newAlternatives.keys.should.be.deep.equal([]);
        newAlternatives.values.should.be.deep.equal({});
        newAlternatives.path.should.be.deep.equal([]);

        ramlHint.computePath.restore();
      });

      it('should provide suggestRAML alternatives when path is null', function () {
        var alternatives = {suggestions: {'#%RAML 0.8': {a:1}}, category: 'x'};
        var editor       = getEditor(codeMirror,
          [
            'title: hello'
          ],
          {line: 0, ch: 0}
        );

        ramlHint.suggestRAML = function() {
          return alternatives;
        };

        ramlHint.computePath = function() {
          return null;
        };

        var newAlternatives = ramlHint.getAlternatives(editor);
        alternatives.suggestions.should.be.deep.equal(newAlternatives.values.suggestions);

        newAlternatives.keys.length.should.be.equal(1);
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

        ramlHint.suggestRAML = function() {
          return alternatives;
        };

        var editor = getEditor(codeMirror,
          [
            'title: hello',
            ''
          ],
          {line: 1, ch: 0}
        );

        var shelfSuggestions    = ramlHint.getSuggestions(editor);
        var titleFound          = false;
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

      it('should return suggestions for root level without title and version keys', function () {
        var editor = getEditor(codeMirror,
          [
            'title: Title',
            'version: Version'
          ],
          {
            line: 0,
            ch: 0
          }
        );

        var suggestions = {};
        ramlHint.getSuggestions(editor).map(function (suggestion) {
          suggestions[suggestion.name] = true;
        });

        ['title', 'version'].forEach(function (key) {
          suggestions.should.not.have.key(key);
        });
      });

      it('should return suggestions for resource level without get and post keys', function () {
        var editor = getEditor(codeMirror,
          [
            'title: Title',
            '/:',
            '  get:',
            '  post:'
          ],
          {
            line: 2,
            ch: 2
          }
        );

        var suggestions = {};
        ramlHint.getSuggestions(editor).map(function (suggestion) {
          suggestions[suggestion.name] = true;
        });

        ['get', 'post'].forEach(function (key) {
          suggestions.should.not.have.key(key);
        });
      });
    });

    describe('autocompleteHelper 1', function () {
      var getAlternativesStub;

      beforeEach(function () {
        getAlternativesStub = sinon.stub(ramlHint, 'getAlternatives').returns({keys: []});
      });

      afterEach(function () {
        getAlternativesStub.restore();
      });

      function getWord(line, cursor) {
        return ramlHint.autocompleteHelper(getEditor(codeMirror, line, cursor)).word;
      }

      it('should detect an empty word for an empty line', function () {
        getWord('').should.be.empty;
      });

      it('should detect an empty word for a line with whitespaces only', function () {
        getWord(' ').should.be.empty;
      });

      it('should detect a word that is RAML tag for a first line with comments', function () {
        getWord(' #RAML ').should.be.equal('#RAML');
      });

      it('should detect a word for a simple line', function () {
        getWord(' word ').should.be.equal('word');
      });

      it('should detect a word for a simple line with comments', function () {
        getWord(' word # and').should.be.equal('word');
      });

      it('should detect a word for array element', function () {
        getWord('- word').should.be.equal('word');
      });

      it('should detect a word for array element with whitespaces', function () {
        getWord('  - word').should.be.equal('word');
      });

      it('should detect a word for array element with whitespaces and comments', function () {
        getWord('  - word # and').should.be.equal('word');
      });

      it('should detect a word for map key', function () {
        getWord('word: value').should.be.equal('word');
      });

      it('should detect a word for map key with whitespaces', function () {
        getWord('  word: value').should.be.equal('word');
      });

      it('should detect a word for map key with whitespaces and comments', function () {
        getWord('  word: value # and').should.be.equal('word');
      });

      it('should detect a word for map key being array element', function () {
        getWord('- word: value').should.be.equal('word');
      });
    });

    describe('autocompleteHelper 2', function () {
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

        ramlHint.suggestRAML = function() {
          return alternatives;
        };

        var editor = getEditor(codeMirror,
          [
            'title: hello',
            ''
          ],
          {line: 1, ch: 0}
        );
        var autocompleteSuggestions = ramlHint.autocompleteHelper(editor);

        autocompleteSuggestions.should.be.ok;

        var autocompleteSuggestionKeys = {};

        autocompleteSuggestions.list.forEach(function (autocompleteSuggestion) {
          var cleanedUpText = autocompleteSuggestion.text.replace(/:(\w|\n|\s)*/g, '');
          autocompleteSuggestionKeys[cleanedUpText] = autocompleteSuggestion;
        });

        alternatives.suggestions.should.include.keys(Object.keys(autocompleteSuggestionKeys));

        Object.keys(autocompleteSuggestionKeys).should.not.include.keys('title');
      });

      it('should use text in current line to get hints', function () {
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
            version: {
              metadata: {
                category: 'simple'
              },
              open: function () {
                return {constructor: {name: 'ConstantString'}};
              }
            },
            randomHint: {
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

        ramlHint.suggestRAML = function() {
          return alternatives;
        };

        var editor = getEditor(codeMirror,
          [
            'title: hello',
            'v'
          ],
          {line: 1, ch: 1});
        var autocompleteSuggestions = ramlHint.autocompleteHelper(editor);

        autocompleteSuggestions.should.be.ok;

        var autocompleteSuggestionKeys = {};

        autocompleteSuggestions.list.forEach(function (autocompleteSuggestion) {
          var cleanedUpText = autocompleteSuggestion.text.replace(/:(\w|\n|\s)*/g, '');
          autocompleteSuggestionKeys[cleanedUpText] = autocompleteSuggestion;
        });

        alternatives.suggestions.should.include.keys(Object.keys(autocompleteSuggestionKeys));

        Object.keys(autocompleteSuggestionKeys).should.not.include.keys(['title', 'randomHint']);
      });

      it('should use text in current line to get hints (fix for regression #61036226)', function () {
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
            version: {
              metadata: {
                category: 'simple'
              },
              open: function () {
                return {constructor: {name: 'ConstantString'}};
              }
            },
            randomHint: {
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

        ramlHint.suggestRAML = function() {
          return alternatives;
        };

        var editor = getEditor(codeMirror,
          [
            'title: hello',
            'some text v'
          ],
          {line: 1, ch: 11});
        var autocompleteSuggestions = ramlHint.autocompleteHelper(editor);

        autocompleteSuggestions.should.be.ok;

        var autocompleteSuggestionKeys = {};

        autocompleteSuggestions.list.forEach(function (autocompleteSuggestion) {
          var cleanedUpText = autocompleteSuggestion.text.replace(/:(\w|\n|\s)*/g, '');
          autocompleteSuggestionKeys[cleanedUpText] = autocompleteSuggestion;
        });

        Object.keys(autocompleteSuggestionKeys).should.not.include.keys(['title', 'randomHint', 'version']);
      });
    });
  });

  describe('getKeysToErase', function () {
    var getKeysToErase;

    beforeEach(inject(function ($injector) {
      getKeysToErase = $injector.get('getKeysToErase');
    }));

    it('should list the keys at the same level with the same parent', function () {
      var editor = getEditor(codeMirror,
        [
          'title: hello',
          'version: v1.0',
          'baseUri: http://example.com/api',
          '/hello:',
          '  /bye:',
          '    get: {}',
          '  /ciao:',
          '    get:'
        ],
        {line: 2, ch: 5}
      );

      var keysToErase = getKeysToErase(editor);
      (keysToErase.length).should.be.equal(4);
      var ed = ['title', 'version', 'baseUri', '/hello'];
      var i;
      for (i = 0; i < ed.length; i++) {
        (keysToErase[i]).should.be.equal(ed[i]);
      }
    });

    it('should list third level keys ok', function () {
      var editor = getEditor(codeMirror,
        [
          'title: hello',
          'version: v1.0',
          'baseUri: http://example.com/api',
          '/hello:',
          '  /bye:',
          '    get: {}',
          '    post: {}',
          '    put: {}',
          '    delete: {}',
          '  /ciao:',
          '    get:'
        ],
        {line: 5, ch: 6}
      );

      var keysToErase = getKeysToErase(editor);
      ['get', 'post', 'put', 'delete'].should.be.eql(keysToErase);
    });
  });

  describe('getNeighborLines', function () {
    var getNeighborLines;

    beforeEach(inject(function ($injector) {
      getNeighborLines = $injector.get('getNeighborLines');
    }));

    it('should return expected neighbor lines #1', function () {
      var editor = getEditor(codeMirror,
        [
          'line 1:', //
          'line 2:', // <---
          'line 3:'  //
        ],
        {
          line: 1,
          ch: 0
        }
      );

      getNeighborLines(editor).should.be.deep.equal([
        'line 1:',
        'line 2:',
        'line 3:'
      ]);
    });

    it('should return expected neighbor lines #2', function () {
      var editor = getEditor(codeMirror,
        [
          'line 1:',  //
          'line 2:',  // <---
          '  line 3:' //
        ],
        {
          line: 1,
          ch: 0
        }
      );

      getNeighborLines(editor).should.be.deep.equal([
        'line 1:',
        'line 2:'
      ]);
    });

    it('should return expected neighbor lines #3', function () {
      var editor = getEditor(codeMirror,
        [
          '  line 1:', //
          'line 2:',   // <---
          'line 3:'    //
        ],
        {
          line: 1,
          ch: 0
        }
      );

      getNeighborLines(editor).should.be.deep.equal([
        'line 2:',
        'line 3:'
      ]);
    });

    it('should return expected neighbor lines #4', function () {
      var editor = getEditor(codeMirror,
        [
          'line 1:',   // <---
          '  line 2:', //
          'line 3:'    //
        ],
        {
          line: 0,
          ch: 0
        }
      );

      getNeighborLines(editor).should.be.deep.equal([
        'line 1:',
        'line 3:'
      ]);
    });

    it('should return expected neighbor lines #5', function () {
      var editor = getEditor(codeMirror,
        [
          'line 1:',   //
          '  line 2:', // <---
          'line 3:'    //
        ],
        {
          line: 1,
          ch: 2
        }
      );

      getNeighborLines(editor).should.be.deep.equal([
        '  line 2:'
      ]);
    });

    it('should return expected neighbor lines #6', function () {
      var editor = getEditor(codeMirror,
        [
          'line 1:',   //
          '  line 2:', //
          'line 3:'    // <---
        ],
        {
          line: 2,
          ch: 0
        }
      );

      getNeighborLines(editor).should.be.deep.equal([
        'line 1:',
        'line 3:'
      ]);
    });

    it('should return expected neighbor lines #7', function () {
      var editor = getEditor(codeMirror,
        [
          'line 1:',     //
          '  line 2:',   //
          '    line 3:', //
          '  line 4:',   // <---
          '    line 5:', //
          '  line 6:',   //
          'line 7:'      //
        ],
        {
          line: 3,
          ch: 2
        }
      );

      getNeighborLines(editor).should.be.deep.equal([
        '  line 2:',
        '  line 4:',
        '  line 6:'
      ]);
    });
  });
});
