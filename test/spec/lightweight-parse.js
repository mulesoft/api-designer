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

  describe('extractKeyValue', function () {
    var extractKeyValue;

    beforeEach(inject(function($injector) {
      extractKeyValue = $injector.get('extractKeyValue');
    }));

    function getKeyAndValue(data) {
      return {
        key:   data.key,
        value: data.value ? data.value.text : null
      };
    }

    it('should extract key and value correctly from a pair', function () {
      getKeyAndValue(extractKeyValue('key: value')).should.be.deep.equal({key: 'key', value: 'value'});
    });

    it('should extract key and value with comments at the end', function () {
      getKeyAndValue(extractKeyValue('key: value#value')).should.be.deep.equal({key: 'key', value: 'value'});
    });

    it('should extract key and value with comments in between', function () {
      getKeyAndValue(extractKeyValue('key:#value')).should.be.deep.equal({key: 'key', value: null});
    });

    it('should extract key and value correctly without a pair', function () {
      getKeyAndValue(extractKeyValue('key')).should.be.deep.equal({key: null, value: 'key'});
      getKeyAndValue(extractKeyValue('key:')).should.be.deep.equal({key: 'key', value: null});
      getKeyAndValue(extractKeyValue('key: ')).should.be.deep.equal({key: 'key', value: null});
    });

    it('should handle empty strings', function () {
      getKeyAndValue(extractKeyValue('')).should.be.deep.equal({key: '', value: null});
      getKeyAndValue(extractKeyValue(' ')).should.be.deep.equal({key: null, value: null});
      getKeyAndValue(extractKeyValue(' # ')).should.be.deep.equal({key: null, value: null});
    });

    it('should handle keys with : in their names', function () {
      getKeyAndValue(extractKeyValue('a: b:c')).should.be.deep.equal({key: 'a', value: 'b:c'});
      getKeyAndValue(extractKeyValue('a:b: c')).should.be.deep.equal({key: 'a:b', value: 'c'});
      getKeyAndValue(extractKeyValue('a:b: c:d')).should.be.deep.equal({key: 'a:b', value: 'c:d'});
    });

    it('should handle keys with : in their values', function () {
      getKeyAndValue(extractKeyValue('key: value1:value2')).should.be.deep.equal({key: 'key', value: 'value1:value2'});
      getKeyAndValue(extractKeyValue('key: value1: value2')).should.be.deep.equal({key: 'key', value: 'value1: value2'});
    });

    it('should handle lines with an array', function () {
      getKeyAndValue(extractKeyValue('- key: value')).should.be.deep.equal({key: 'key', value: 'value'});
      getKeyAndValue(extractKeyValue('-  key: value')).should.be.deep.equal({key: 'key', value: 'value'});
      getKeyAndValue(extractKeyValue('-  key : value')).should.be.deep.equal({key: 'key', value: 'value'});
      getKeyAndValue(extractKeyValue('-  key :  value')).should.be.deep.equal({key: 'key', value: 'value'});
      getKeyAndValue(extractKeyValue('-  key :  value ')).should.be.deep.equal({key: 'key', value: 'value'});
      getKeyAndValue(extractKeyValue('-  value')).should.be.deep.equal({key: null, value: 'value'});
    });

    it('should handle lines which a dash', function () {
      getKeyAndValue(extractKeyValue('-value')).should.be.deep.equal({key: null, value: '-value'});
      getKeyAndValue(extractKeyValue('-key:')).should.be.deep.equal({key: '-key', value: null});
      getKeyAndValue(extractKeyValue('-key: value')).should.be.deep.equal({key: '-key', value: 'value'});
      getKeyAndValue(extractKeyValue('-key: value#comment')).should.be.deep.equal({key: '-key', value: 'value'});
      getKeyAndValue(extractKeyValue(' -key : value # comment ')).should.be.deep.equal({key: '-key', value: 'value'});
      getKeyAndValue(extractKeyValue(' -ke:y : value # comment ')).should.be.deep.equal({key: '-ke:y', value: 'value'});
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

