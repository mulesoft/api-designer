'use strict';

describe('RAML Syntax Highlight', function () {
  beforeEach(module('codeMirror'));

  describe('codeMirror', function () {
    describe('token', function () {
      /* globals CodeMirror */
      var token;

      /* jshint camelcase: false */
      beforeEach(inject(function (_token_) {
        token = _token_;
      }));
      /* jshint camelcase: true */

      it('should mark string, almost identical to a RAML tag, as a comment (RT-346)', function () {
        var stream = new CodeMirror.StringStream('#%Raml 0.8');
        token(stream, {}).should.be.equal('comment');
      });

      it('should mark proper string as a RAML tag (RT-346)', function () {
        var stream = new CodeMirror.StringStream('#%RAML 0.8');
        token(stream, {}).should.be.equal('raml-tag');
      });
    });
  });
});
