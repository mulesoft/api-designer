'use strict';

describe('RAML Syntax Highlight', function () {
  var state;

  beforeEach(module('codeMirror'));

  describe('codeMirror', function () {
    describe('token', function () {
      /* globals CodeMirror */
      var token;

      beforeEach(inject(function ($injector) {
        token = $injector.get('token');
        state = $injector.get('startState');
      }));

      it('should mark string, almost identical to a RAML tag, as a comment (RT-346)', function () {
        var stream = new CodeMirror.StringStream('#%Raml 0.8');
        token(stream, {}).should.be.equal('comment');
      });

      it('should mark RAML 0.8 string with raml-tag', function () {
        var stream = new CodeMirror.StringStream('#%RAML 0.8');
        token(stream, {}).should.be.equal('raml-tag');
      });

      it('should mark RAML 1.0 string with raml-tag', function () {
        var stream = new CodeMirror.StringStream('#%RAML 1.0');
        token(stream, {}).should.be.equal('raml-tag');
      });

      it('should mark RAML 1.0 fragment string with raml-tag', function () {
        var stream = new CodeMirror.StringStream('#%RAML 1.0 Overlay');
        token(stream, {}).should.be.equal('raml-tag');
      });

      it('should properly mark supported HTTP methods', function () {
        ['options', 'get', 'head', 'post', 'put', 'delete', 'trace', 'connect', 'patch'].forEach(function (httpMethod) {
          token(new CodeMirror.StringStream(httpMethod + ':'), {}).should.be.equal('method-title');
        });
      });

      it('should mark RAML tag with whitespaces around', function () {
        var stream = new CodeMirror.StringStream('#%RAML 0.8  ');
        token(stream, {}).should.be.equal('raml-tag');
      });

      it('should handle arrays', function() {
        var stream = new CodeMirror.StringStream('- title: My Title');
        token(stream, state).should.be.equal('meta');

        stream.start = stream.pos;
        token(stream, state).should.be.equal('key');

        stream.start = stream.pos;
        token(stream, state).should.be.equal('meta');

        stream.start = stream.pos;
        should.not.exist(token(stream, state));

        stream = new CodeMirror.StringStream('  content: My content');
        token(stream, state).should.be.equal('key');

        stream.start = stream.pos;
        token(stream, state).should.be.equal('meta');

        stream.start = stream.pos;
        should.not.exist(token(stream, state));
      });

      it('should handle arrays with pipes', function() {
        var stream = new CodeMirror.StringStream('- title: |');
        token(stream, state).should.be.equal('meta');

        stream.start = stream.pos;
        token(stream, state).should.be.equal('key');

        stream.start = stream.pos;
        token(stream, state).should.be.equal('meta');

        stream.start = stream.pos;
        token(stream, state).should.be.equal('meta');

        stream = new CodeMirror.StringStream('    My title');
        token(stream, state).should.be.equal('none');

        stream = new CodeMirror.StringStream('  content: Awesome content');
        token(stream, state).should.be.equal('key');

        stream.start = stream.pos;
        token(stream, state).should.be.equal('meta');

        stream.start = stream.pos;
        should.not.exist(token(stream, state));
      });

    });
  });
});
