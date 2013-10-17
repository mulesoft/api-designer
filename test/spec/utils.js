'use strict';

describe('Utils module', function () {
  beforeEach(module('utils'));

  describe('getLineIndent', function () {
    var getLineIndent;

    /* jshint camelcase: false */
    beforeEach(inject(function (_getLineIndent_) {
      getLineIndent = _getLineIndent_;
    }));
    /* jshint camelcase: true */

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

    it('should support spaces/tabs after text and not count them ' +
      'as indent (RT-319)', function() {

      var indentInfo = getLineIndent('    hello:  ');
      indentInfo.tabCount.should.be.equal(2);
      indentInfo.content.should.be.equal('hello:  ');
      indentInfo.spaceCount.should.be.equal(4);

    });
  });
  describe('generateSpaces', function () {
    var generateSpaces;

    beforeEach(inject(function (_generateSpaces_) {
      generateSpaces = _generateSpaces_;
    }));

    it('should not generate spaces when using 0 as input', function () {
      generateSpaces(0).should.be.equal('');
    });
    
    it('should generate the required spaces', function () {
      generateSpaces(3).should.be.equal('   ');
    });

    it('should assume undefined and null as 0', function () {
      generateSpaces(undefined).should.be.equal('');
      generateSpaces(null).should.be.equal('');
    });
    
  });
  describe('generateTabs', function () {
    var generateTabs;

    beforeEach(inject(function(_generateTabs_) {
      generateTabs = _generateTabs_;
    }));

    it('should generate no tabs when input is 0, undefined or null', function () {
      generateTabs(undefined).should.be.equal('');
      generateTabs(null).should.be.equal('');
      generateTabs(0).should.be.equal('');
    });
    
    it('should generate the right amount of tabs', function () {
      generateTabs(3).should.be.equal('      ');
    });
  });
  describe('extractKey', function () {
    var extractKey;

    beforeEach(inject(function(_extractKey_) {
      extractKey = _extractKey_;
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
  });
});
