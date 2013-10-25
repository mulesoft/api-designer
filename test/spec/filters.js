'use strict';

describe('Filters', function () {
  beforeEach(module('stringFilters'));

  describe('stringFilters', function () {
    describe('dasherize', function () {
      var dasherizeFilter;

      /* jshint camelcase: false */
      beforeEach(function () {
        inject(function (_dasherizeFilter_) {
          dasherizeFilter = _dasherizeFilter_;
        });
      });
      /* jshint camelcase: true */

      it('should work well with null', function () {
        dasherizeFilter(null).should.be.equal('');
      });

      it('should work well with undefined', function () {
        dasherizeFilter(undefined).should.be.equal('');
      });

      it('should work well with an empty string', function () {
        dasherizeFilter('').should.be.equal('');
      });

      it('should produce expected value', function () {
        dasherizeFilter('a B c D').should.be.equal('a-b-c-d');
      });
    });
  });
});
