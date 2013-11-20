'use strict';

describe('Lightweight Parse Module', function () {
  beforeEach(module('lightweightParse'));

  describe('getLineIndent', function () {
    var getLineIndent;

    beforeEach(inject(function ($injector) {
      getLineIndent = $injector.get('getLineIndent');
    }));

    it('should provide tabCount, spaceCount and content (the rest of the string)', function () {
      var indentInfo = getLineIndent('    foo:');

      indentInfo.tabCount.should.be.equal(2);
      indentInfo.content.should.be.equal('foo:');
      indentInfo.spaceCount.should.be.equal(4);
    });

    it('should work on root level', function () {
      var indentInfo = getLineIndent('foo:');

      indentInfo.tabCount.should.be.equal(0);
      indentInfo.content.should.be.equal('foo:');
      indentInfo.spaceCount.should.be.equal(0);
    });

    it('should not fail on null', function () {
      var indentInfo = getLineIndent(null);

      indentInfo.tabCount.should.be.equal(0);
      indentInfo.content.should.be.equal('');
      indentInfo.spaceCount.should.be.equal(0);
    });

    it('should not fail on undefined', function () {
      var indentInfo = getLineIndent(undefined);

      indentInfo.tabCount.should.be.equal(0);
      indentInfo.content.should.be.equal('');
      indentInfo.spaceCount.should.be.equal(0);
    });

    it('should with lines of only spaces', function () {
      var indentInfo = getLineIndent('      ');

      indentInfo.tabCount.should.be.equal(3);
      indentInfo.content.should.be.equal('');
      indentInfo.spaceCount.should.be.equal(6);
    });

    it('should work with odd number of spaces', function () {
      var indentInfo = getLineIndent('   hello:');

      indentInfo.tabCount.should.be.equal(1);
      indentInfo.content.should.be.equal('hello:');
      indentInfo.spaceCount.should.be.equal(3);
    });

    it('should support spaces/tabs after text and not count them as indent (RT-319)', function () {
      var indentInfo = getLineIndent('    hello:  ');

      indentInfo.tabCount.should.be.equal(2);
      indentInfo.content.should.be.equal('hello:  ');
      indentInfo.spaceCount.should.be.equal(4);
    });

    it('should work with dashes correctly', function() {
      var indentInfo = getLineIndent('  - hello:');

      indentInfo.tabCount.should.be.equal(1);
      indentInfo.content.should.be.equal('- hello:');
      indentInfo.spaceCount.should.be.equal(2);

      indentInfo = getLineIndent('   - hello:');
      indentInfo.tabCount.should.be.equal(1);
      indentInfo.content.should.be.equal('- hello:');
      indentInfo.spaceCount.should.be.equal(3);

      indentInfo = getLineIndent('-hello:');
      indentInfo.tabCount.should.be.equal(0);
      indentInfo.content.should.be.equal('-hello:');
      indentInfo.spaceCount.should.be.equal(0);
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
        ]
      });

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
        ]
      });

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
