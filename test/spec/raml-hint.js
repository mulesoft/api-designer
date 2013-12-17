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
          ],
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
          ],
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
          ],
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
          ],
          {
            line: 1,
            ch:   4
          }
        )).listsTraveled.should.be.equal(1);
      });
    });

    describe('getSuggestions', function () {
      it('should exclude optional keys', function () {
        var suggestions = ramlHint.getSuggestions(getEditor(codeMirror,
          [
            'resourceTypes:',
            '  - resourceType1:',
            '      get?:'
          ],
          {
            line: 2,
            ch:   6
          }
        ));

        suggestions
          .map(function (s) { return s.key; })
        .should.not.include('get');
      });

      it('should exclude "title" and "content" keys at documentation level at different cursor positions', function () {
        var editor = getEditor(codeMirror,
          [
            'documentation:',
            '  - title: Title',
            '    content: Content'
          ],
          {
            line: 1,
            ch:   4
          }
        );

        var suggestions = {};
        ramlHint.getSuggestions(editor).map(function (suggestion) {
          suggestions[suggestion.key] = true;
        });

        ['title', 'content'].forEach(function (key) {
          suggestions.should.not.have.key(key);
        });

        editor.setCursor(2, 4);
        suggestions = {};
        ramlHint.getSuggestions(editor).map(function (suggestion) {
          suggestions[suggestion.key] = true;
        });

        ['title', 'content'].forEach(function (key) {
          suggestions.should.not.have.key(key);
        });
      });

      it('should not exclude keys from another array', function () {
        var editor = getEditor(codeMirror,
          [
            'documentation:',
            '  - title: Title',
            '    content: Content',
            '  - '
          ],
          {
            line: 3,
            ch:   4
          }
        );

        var suggestions = {};
        ramlHint.getSuggestions(editor).map(function (suggestion) {
          suggestions[suggestion.key] = true;
        });

        suggestions.should.include.key('title');
        suggestions.should.include.key('content');
      });

      it('should exclude "title" and "version" keys at root level', function () {
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
          suggestions[suggestion.key] = true;
        });

        ['title', 'version'].forEach(function (key) {
          suggestions.should.not.have.key(key);
        });
      });

      it('should exclude "get" and "post" keys at resource level', function () {
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
          suggestions[suggestion.key] = true;
        });

        ['get', 'post'].forEach(function (key) {
          suggestions.should.not.have.key(key);
        });
      });

      it('should return suggestions for trait in alphabetical order', function () {
        var editor = getEditor(codeMirror,
          [
            'traits:',
            '  - trait:',
            '    '
          ],
          {
            line: 2,
            ch:   4
          }
        );

        var names       = ramlHint.getSuggestions(editor).map(function (suggestion) { return suggestion.key; });
        var sortedNames = names.slice().sort();

        names.should.be.deep.equal(sortedNames);
      });
    });

    describe('canAutocomplete', function () {
      it('should allow autocomplete for the first line with comments (RAML tag)', function () {
        ramlHint.canAutocomplete(getEditor(codeMirror,
          [
            '#RAML'
          ]
        )).should.be.true;
      });

      it('should not allow autocomplete for cursor after comment', function () {
        ramlHint.canAutocomplete(getEditor(codeMirror,
          [
            'text',
            'position1 # position2'
          ],
          {line: 1, ch: 12}
        )).should.be.false;
      });

      it('should allow autocomplete for cursor before comment', function () {
        ramlHint.canAutocomplete(getEditor(codeMirror,
          [
            'text',
            'position1 # position2'
          ],
          {line: 1, ch: 0}
        )).should.be.true;
      });

      it('should not allow autocomplete for cursor before array', function () {
        ramlHint.canAutocomplete(getEditor(codeMirror,
          [
            'array:',
            '  - element'
          ],
          {line: 1, ch: 0}
        )).should.be.false;
      });

      it('should allow autocomplete for cursor after array', function () {
        ramlHint.canAutocomplete(getEditor(codeMirror,
          [
            'array:',
            '  - element'
          ],
          {line: 1, ch: 4}
        )).should.be.true;
      });

      it('should not allow autocomplete for map value', function () {
        ramlHint.canAutocomplete(getEditor(codeMirror,
          [
            'map:',
            '  key: value'
          ], {line: 1, ch: 7})).should.be.false;
      });

      it('should allow autocomplete for map key', function () {
        ramlHint.canAutocomplete(getEditor(codeMirror,
          [
            'map:',
            '  key: value'
          ],
          {line: 1, ch: 2}
        )).should.be.true;
      });

      it('should allow autocomplete for map key being part of array element', function () {
        ramlHint.canAutocomplete(getEditor(codeMirror,
          [
            'map:',
            '  - key: value'
          ],
          {line: 1, ch: 4}
        )).should.be.true;
      });

      it('should not allow autocomplete for resource', function () {
        ramlHint.canAutocomplete(getEditor(codeMirror,
          [
            '/resource:',
          ],
          {line: 0, ch: 0}
        )).should.be.false;
      });
    });

    describe('autocompleteHelper 1', function () {
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

      it('should detect an empty word for array element', function () {
        getWord('- ').should.be.equal('');
      });

      it('should detect a word for array element', function () {
        getWord('- word').should.be.equal('word');
      });

      it('should detect a word for array element with whitespaces', function () {
        getWord('  - word', {line: 0, ch: 4}).should.be.equal('word');
      });

      it('should detect a word for array element with whitespaces and comments', function () {
        getWord('  - word # and', {line: 0, ch: 4}).should.be.equal('word');
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

      it('should start autocompletion at current cursor position if there is no word', function () {
        var result = ramlHint.autocompleteHelper(getEditor(codeMirror, '- ', {line: 0, ch: 2}));
        result.from.should.be.deep.equal({line: 0, ch: 2});
        result.to.should.be.deep.equal({line: 0, ch: 2});
      });
    });

    describe('autocompleteHelper 2', function () {
      it('should not include <resource>', function () {
        var result = ramlHint.autocompleteHelper(getEditor(codeMirror,
          [
            '#%RAML 0.8',
            ''
          ],
          {line: 1, ch: 0}
        ));

        result.list.map(function (e) { return e.text; }).should.not.include('<resource>:');
      });

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

  describe('getNeighborKeys', function () {
    var getNeighborKeys;

    beforeEach(inject(function ($injector) {
      getNeighborKeys = $injector.get('getNeighborKeys');
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

      var keysToErase = getNeighborKeys(editor);
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

      var keysToErase = getNeighborKeys(editor);
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
