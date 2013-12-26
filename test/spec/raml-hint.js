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
        var path = ramlHint.computePath(getEditor(codeMirror,
          [
            'key1:',
            '  - key11:',
            '      key111:',
            'key2:',
            '  key21:',
            '    key211:'
          ],
          {
            line: 5,
            ch:   0
          }
        ));

        [].concat(path).should.be.deep.equal(['key2', 'key21']);
        path.arraysTraveled.should.be.equal(0);
      });

      it('should handle root level paths', function () {
        var path = ramlHint.computePath(getEditor(codeMirror,
          [
            ''
          ],
          {
            line: 0,
            ch:   0
          }
        ));

        [].concat(path).should.be.empty;
        path.arraysTraveled.should.be.equal(0);
      });

      it('should handle second level paths', function () {
        var path = ramlHint.computePath(getEditor(codeMirror,
          [
            'key1:',
            '  key11:',
            '    key111:'
          ],
          {
            line: 2,
            ch:   0
          }
        ));

        [].concat(path).should.be.deep.equal(['key1', 'key11']);
        path.arraysTraveled.should.be.equal(0);
      });

      it('should handle and skip array at the same indentation level', function () {
        var path = ramlHint.computePath(getEditor(codeMirror,
          [
            'key1:',
            '  - key11:',
            '      key111:',
            '  - key12:',
            '      key121:',
            '  '
          ],
          {
            line: 5,
            ch:   666
          }
        ));

        [].concat(path).should.be.deep.equal(['key1']);
        path.arraysTraveled.should.be.equal(0);
      });

      it('should offer options to valid elements inside lists', function () {
        var path = ramlHint.computePath(getEditor(codeMirror,
          [
            'key1:',
            '  - key11:',
            '      key111:',
            '  - key12:',
            '      key121:',
            '      '
          ],
          {
            line: 4,
            ch:   666
          }
        ));

        [].concat(path).should.be.deep.equal(['key1', 'key12']);
        path.arraysTraveled.should.be.equal(1);
      });

      it('should detect valid number of traveled arrays #1', function () {
        var path = ramlHint.computePath(getEditor(codeMirror,
          [
            'key1:',
            '  - key11:',
            '      key111:' // <--
          ],
          {
            line: 2,
            ch:   666
          }
        ));

        [].concat(path).should.be.deep.equal(['key1', 'key11']);
        path.arraysTraveled.should.be.equal(1);
      });

      it('should detect valid number of traveled arrays #2', function () {
        var path = ramlHint.computePath(getEditor(codeMirror,
          [
            'key1:',
            '  - key11:',
            '      key111:',
            '  - key12:',
            '      key121:' // <--
          ],
          {
            line: 4,
            ch:   666
          }
        ));

        [].concat(path).should.be.deep.equal(['key1', 'key12']);
        path.arraysTraveled.should.be.equal(1);
      });

      it('should detect valid number of traveled arrays #3', function () {
        var path = ramlHint.computePath(getEditor(codeMirror,
          [
            '- key1:',
            '    - key11:',
            '        key111:' // <--
          ],
          {
            line: 2,
            ch:   666
          }
        ));

        [].concat(path).should.be.deep.equal(['key1', 'key11']);
        path.arraysTraveled.should.be.equal(2);
      });

      it('should detect valid number of traveled arrays #4', function () {
        var path = ramlHint.computePath(getEditor(codeMirror,
          [
            'key1:',
            '  - key11:'
          ],
          {
            line: 1,
            ch:   666
          }
        ));

        [].concat(path).should.be.deep.equal(['key1']);
        path.arraysTraveled.should.be.equal(0);
      });

      it('should detect valid number of traveled arrays #5', function () {
        var path = ramlHint.computePath(getEditor(codeMirror,
          [
            '- key1:',
            '  key2:',
            '    key21:'
          ],
          {
            line: 2,
            ch:   666
          }
        ));

        [].concat(path).should.be.deep.equal(['key2']);
        path.arraysTraveled.should.be.equal(1);
      });

      it('should detect valid number of traveled arrays #6', function () {
        var path = ramlHint.computePath(getEditor(codeMirror,
          [
            'key1:',
            '  - key11:',
            '    key12:',
            '      key121:'
          ],
          {
            line: 3,
            ch:   666
          }
        ));

        [].concat(path).should.be.deep.equal(['key1', 'key12']);
        path.arraysTraveled.should.be.equal(1);
      });

      it('should return path that has comment lines along', function () {
        var path = ramlHint.computePath(getEditor(codeMirror,
          [
            'key1:',
            '# key 1',
            '  - key11:',
            '  # key 11',
            '      - key111:',
            '      # key111',
            '          key1111:',
            '          # key1111'
          ],
          {
            line: 7,
            ch:   666
          }
        ));

        [].concat(path).should.be.deep.equal(['key1', 'key11', 'key111']);
        path.arraysTraveled.should.be.equal(2);
      });

      it('should return falsy for line with odd number of whitespaces', function () {
        var path = ramlHint.computePath(getEditor(codeMirror,
          [
            ' '
          ],
          {
            line: 0,
            ch:   666
          }
        ));

        should.not.exist(path);
      });

      it('should return falsy for line with odd number of whitespaces and parent', function () {
        var path = ramlHint.computePath(getEditor(codeMirror,
          [
            'key1:',
            '   key2:'
          ],
          {
            line: 1,
            ch:   666
          }
        ));

        should.not.exist(path);
      });

      it('should return falsy for line which parent has odd number of whitespaces', function () {
        var path = ramlHint.computePath(getEditor(codeMirror,
          [
            ' key1:',
            '  key2:'
          ],
          {
            line: 1,
            ch:   666
          }
        ));

        should.not.exist(path);
      });

      it('should return falsy for line with too many whitespaces', function () {
        var path = ramlHint.computePath(getEditor(codeMirror,
          [
            'key1:',
            '    key2:'
          ],
          {
            line: 1,
            ch:   666
          }
        ));

        should.not.exist(path);
      });

      it('should return falsy for line with too many whitespaces that is part of an array', function () {
        var path = ramlHint.computePath(getEditor(codeMirror,
          [
            '- key1:',
            '      key2:'
          ],
          {
            line: 1,
            ch:   666
          }
        ));

        should.not.exist(path);
      });

      it('should return falsy for line with cursor at position that sums to odd number of whitespaces', function () {
        var path = ramlHint.computePath(getEditor(codeMirror,
          [
            'key1:',
            '  '
          ],
          {
            line: 1,
            ch:   1
          }
        ));

        should.not.exist(path);
      });

      it('should return path for line without parent and odd whitespaces before a comment sign', function () {
        var path = ramlHint.computePath(getEditor(codeMirror,
          [
            ' #%RAML 0.8'
          ],
          {
            line: 0,
            ch:   0
          }
        ));

        [].concat(path).should.be.empty;
        path.arraysTraveled.should.be.equal(0);
      });

      it('should return falsy for line with parent and odd whitespaces before a comment sign', function () {
        var path = ramlHint.computePath(getEditor(codeMirror,
          [
            'key1:',
            ' # key1'
          ],
          {
            line: 1,
            ch:   666
          }
        ));

        should.not.exist(path);
      });

      it('should return path for line with parent, odd whitespaces before a comment sign and cursor at non-odd position', function () {
        var path = ramlHint.computePath(getEditor(codeMirror,
          [
            'key1:',
            '   #'
          ],
          {
            line: 1,
            ch:   2
          }
        ));

        [].concat(path).should.be.deep.equal(['key1']);
        path.arraysTraveled.should.be.equal(0);
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
