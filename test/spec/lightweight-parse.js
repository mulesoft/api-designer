'use strict';

describe('Lightweight Parse Module', function () {
  beforeEach(module('lightweightParse'));

  describe('getSpaceCount', function () {
    var getSpaceCount;

    beforeEach(inject(function ($injector) {
      getSpaceCount = $injector.get('getSpaceCount');
    }));

    it('should count spaces for empty string', function () {
      getSpaceCount('').should.be.equal(0);
    });

    it('should count spaces for string made of whitespace characters only', function () {
      getSpaceCount('  ').should.be.equal(2);
    });

    it('should count spaces for string without whitespace characters', function () {
      getSpaceCount('abc').should.be.equal(0);
    });

    it('should count spaces for string with whitespaces at the beginning only', function () {
      getSpaceCount('  abc').should.be.equal(2);
    });

    it('should count spaces for string with whitespaces at the beginning and the end', function () {
      getSpaceCount('  abc  ').should.be.equal(2);
    });

    it('should count spaces for string with whitespaces everywhere', function () {
      getSpaceCount('  a  b  c  ').should.be.equal(2);
    });
  });

  describe('getLineIndent', function () {
    var getLineIndent;

    beforeEach(inject(function ($injector) {
      getLineIndent = $injector.get('getLineIndent');
    }));

    it('should provide tabCount, spaceCount and content (the rest of the string)', function () {
      var indentInfo = getLineIndent('    foo:');

      indentInfo.content.should.be.equal('foo:');
      indentInfo.spaceCount.should.be.equal(4);
      indentInfo.tabCount.should.be.equal(2);
    });

    it('should work on root level', function () {
      var indentInfo = getLineIndent('foo:');

      indentInfo.content.should.be.equal('foo:');
      indentInfo.spaceCount.should.be.equal(0);
      indentInfo.tabCount.should.be.equal(0);
    });

    it('should with lines of only spaces', function () {
      var indentInfo = getLineIndent('      ');

      indentInfo.content.should.be.equal('');
      indentInfo.spaceCount.should.be.equal(6);
      indentInfo.tabCount.should.be.equal(3);
    });

    it('should work with odd number of spaces', function () {
      var indentInfo = getLineIndent('   hello:');

      indentInfo.content.should.be.equal('hello:');
      indentInfo.spaceCount.should.be.equal(3);
      indentInfo.tabCount.should.be.equal(1);
    });

    it('should support spaces/tabs after text and not count them as indent (RT-319)', function () {
      var indentInfo = getLineIndent('    hello:  ');

      indentInfo.content.should.be.equal('hello:  ');
      indentInfo.spaceCount.should.be.equal(4);
      indentInfo.tabCount.should.be.equal(2);
    });

    it('should work with dashes correctly', function() {
      var indentInfo = getLineIndent('  - hello:');

      indentInfo.content.should.be.equal('- hello:');
      indentInfo.spaceCount.should.be.equal(2);
      indentInfo.tabCount.should.be.equal(1);

      indentInfo = getLineIndent('   - hello:');
      indentInfo.content.should.be.equal('- hello:');
      indentInfo.spaceCount.should.be.equal(3);
      indentInfo.tabCount.should.be.equal(1);

      indentInfo = getLineIndent('-hello:');
      indentInfo.content.should.be.equal('-hello:');
      indentInfo.spaceCount.should.be.equal(0);
      indentInfo.tabCount.should.be.equal(0);
    });
  });

  describe('extractKey', function () {
    var extractKey;

    beforeEach(inject(function($injector) {
      extractKey = $injector.get('extractKey');
    }));

    it('should extract a key correctly from a pair', function () {
      extractKey('title: bye').should.be.equal('title');
    });

    it('should extract a key correctly without a pair', function () {
      extractKey('title:').should.be.equal('title');
      extractKey('title: ').should.be.equal('title');
    });

    it('should handle the empty string and return empty string', function () {
      extractKey('').should.be.equal('');
    });

    it('should handle falsy values (undefined, null(', function () {
      extractKey(undefined).should.be.equal('');
      extractKey(null).should.be.equal('');
    });

    it('should handle keys with : in their name', function () {
      extractKey('a: b:c').should.be.equal('a');
      extractKey('a:b: c').should.be.equal('a:b');
      extractKey('a:b: c:d').should.be.equal('a:b');
    });

    it('should handle keys with : in their value', function () {
      extractKey('  title:longerKey: "Muse: Mule Sales Enablement API"').should.be.equal('title:longerKey');
      extractKey('  title: "Muse: Mule Sales Enablement API"').should.be.equal('title');
      extractKey('  - title: "Muse: Mule Sales Enablement API"').should.be.equal('title');
      extractKey('- title: "Muse: --- Mule Sales Enablement API"').should.be.equal('title');
    });

    it('should handle keys which start in an array', function () {
      extractKey('  - title: "Muse: Mule Sales Enablement API"').should.be.equal('title');
      extractKey('- title: "Muse: Mule Sales Enablement API"').should.be.equal('title');
      extractKey('  - title: "Muse: --- Mule Sales Enablement API"').should.be.equal('title');
      extractKey('- title: "Muse: --- Mule Sales Enablement API"').should.be.equal('title');
      extractKey('--- title: "Muse: --- Mule Sales Enablement API"').should.be.equal('--- title');
    });

  });

  describe('getScopes', function () {
    var getScopes;

    beforeEach(inject(function($injector) {
      getScopes = $injector.get('getScopes');
    }));

    it('should handle simple structures', function () {
      var text = [
        'title: hello',
        'version: v1.0',
        'baseUri: http://example.com/api',
        '/hello:',
        '  /bye:',
        '    get: {}',
        '  /ciao:',
        '    get:'
      ];

      var scopesByLine = getScopes(text).scopesByLine;
      var expected = {
        0: [
          {lineNumber: 0, content: 'title: hello', tabCount: 0},
          {lineNumber: 1, content: 'version: v1.0', tabCount: 0},
          {lineNumber: 2, content: 'baseUri: http://example.com/api', tabCount: 0},
          {lineNumber: 3, content: '/hello:', tabCount: 0}
        ],

        3: [
          {lineNumber: 4, content: '/bye:', tabCount: 1},
          {lineNumber: 6, content: '/ciao:', tabCount: 1}
        ],

        4: [
          {lineNumber: 5, content: 'get: {}', tabCount: 2}
        ],

        6: [
          {lineNumber: 7, content: 'get:', tabCount: 2}
        ]
      };

      scopesByLine.should.be.deep.equal(expected);

      var scopeLevels = getScopes(text).scopeLevels;
      (scopeLevels[0].length).should.be.equal(4);
      (scopeLevels[1].length).should.be.equal(2);
      (scopeLevels[2].length).should.be.equal(2);
      // TODO Why scope levels isn't an array?
      Object.keys(scopeLevels).length.should.be.equal(3);
    });

    it('should handle structures with lists', function () {
      var text = [
        'title: hello',
        'version: v1.0',
        'baseUri: http://example.com/api',
        'traits:',
        '  - my_trait:',
        '      displayName: My Trait',
        '  - my_trait2:',
        '      displayName: My Trait 2',
        '/hello:',
        '  /bye:',
        '    get: {}',
        '  /ciao:',
        '    get:'
      ];

      var scopesByLine = getScopes(text).scopesByLine;
      var scopeLevels = getScopes(text).scopeLevels;
      var expected = {
        0: [
          {lineNumber: 0, content: 'title: hello', tabCount: 0},
          {lineNumber: 1, content: 'version: v1.0', tabCount: 0},
          {lineNumber: 2, content: 'baseUri: http://example.com/api', tabCount: 0},
          {lineNumber: 3, content: 'traits:', tabCount: 0},
          {lineNumber: 8, content: '/hello:', tabCount: 0}
        ],

        3: [
          {lineNumber: 4, content: '- my_trait:', tabCount: 1},
          {lineNumber: 6, content: '- my_trait2:', tabCount: 1}
        ],

        4: [
          {lineNumber: 5, content: 'displayName: My Trait', tabCount: 3}
        ],

        5: [
          {lineNumber: 7, content: 'displayName: My Trait 2', tabCount: 3}
        ],

        8: [
          {lineNumber: 9, content: '/bye:', tabCount: 1},
          {lineNumber: 11, content: '/ciao:', tabCount: 1}
        ],

        9: [
          {lineNumber: 10, content: 'get: {}', tabCount: 2}
        ],

        11: [
          {lineNumber: 12, content: 'get:', tabCount: 2}
        ]
      };
      scopesByLine.should.be.deep.equal(expected);

      scopeLevels.should.be.deep.equal({
        0: [0,1,2,3,8],
        1: [4,6,9,11],
        2: [5,10,12],
        3: [7]
      });
    });

    it('should not fail when there are invalid indent levels', function () {
      var text = [
        'title: hello',
        'version: v1.0',
        'baseUri: http://example.com/api',
        'traits:',
        '  - my_trait:',
        '      displayName: My Trait',
        '  - my_trait2:',
        '      displayName: My Trait 2',
        '/hello:',
        '  /bye:',
        '    get: {}',
        '  /ciao:',
        '                       '
      ];

      var scopesByLine = getScopes(text).scopesByLine;
      var scopeLevels = getScopes(text).scopeLevels;

      scopesByLine.should.be.deep.equal({
        0: [
          {lineNumber: 0, tabCount: 0, content: 'title: hello'},
          {lineNumber: 1, tabCount: 0, content: 'version: v1.0'},
          {lineNumber: 2, tabCount: 0, content: 'baseUri: http://example.com/api'},
          {lineNumber: 3, tabCount: 0, content: 'traits:'},
          {lineNumber: 8, tabCount: 0, content: '/hello:'}
        ],

        3: [
          {lineNumber: 4, tabCount: 1, content: '- my_trait:'},
          {lineNumber: 6, tabCount: 1, content: '- my_trait2:'}
        ],

        4: [
          {lineNumber: 5, tabCount: 3, content: 'displayName: My Trait'}
        ],

        5: [
          {lineNumber: 7, tabCount: 3, content: 'displayName: My Trait 2'}
        ],

        8: [
          {lineNumber: 9, tabCount: 1, content: '/bye:'},
          {lineNumber: 11, tabCount: 1, content: '/ciao:'}
        ],

        9: [
          {lineNumber: 10, tabCount: 2, content: 'get: {}'}
        ]
      });

      scopeLevels.should.be.deep.equal({
        0: [0,1,2,3,8],
        1: [4,6,9,11],
        2: [5,10],
        3: [7]
      });
    });
  });
});

