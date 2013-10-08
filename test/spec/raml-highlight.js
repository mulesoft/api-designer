'use strict';

describe('RAML Syntax Highlight', function (){

  beforeEach(module('codeMirror'));

  describe('getNumberOfIndentTabs', function () {
    var getNumberOfIndentTabs;

    /* jshint camelcase: false */
    beforeEach(inject(function (_getNumberOfIndentTabs_) {
      getNumberOfIndentTabs = _getNumberOfIndentTabs_;
    }));
    /* jshint camelcase: true */

    it('should support spaces/tabs after text and not count them ' +
      'as indent (RT-319)', function() {

      getNumberOfIndentTabs('    hello:  ').should.be.equal(1);

    });
  });
});
