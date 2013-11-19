'use strict';

describe('Utils module', function () {
  beforeEach(module('utils'));

  describe('generateSpaces', function () {
    var generateSpaces;

    beforeEach(inject(function ($injector) {
      generateSpaces = $injector.get('generateSpaces');
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

    beforeEach(inject(function($injector) {
      generateTabs = $injector.get('generateTabs');
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

  describe('safeApplyWrapper', function () {
    var safeApplyWrapper;
    beforeEach(inject(function ($injector) {
      safeApplyWrapper = $injector.get('safeApplyWrapper');
    }));

    it('should call wrapped function', function () {
      var wrapped = sinon.stub();
      safeApplyWrapper(null, wrapped)();

      wrapped.called.should.be.true;
    });

    it('should pass arguments to wrapped function', function () {
      var wrapped = sinon.stub();
      safeApplyWrapper(null, wrapped)(1, '2', true);

      wrapped.calledWith(1, '2', true).should.be.true;
    });
  });
});
