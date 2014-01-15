'use strict';

describe('RAML Highlight Config', function () {
  var codeMirrorHighLight, mode, CodeMirror;

  beforeEach(module('codeMirror'));
  beforeEach(inject(function ($injector, codeMirror) {
    CodeMirror = codeMirror.CodeMirror;
    codeMirrorHighLight = $injector.get('codeMirrorHighLight');

    mode = codeMirrorHighLight.highlight({});
  }));

  it('should call yaml token by default', function () {
    var stream = new CodeMirror.StringStream(
      'title: Test',
      2);

    sinon.spy(codeMirrorHighLight.yaml, 'token');
    var state = mode.startState();
    mode.token(stream, state);

    codeMirrorHighLight.yaml.token.should.have.been.calledOnce;
    codeMirrorHighLight.yaml.token.restore();

    state.token.should.equal(codeMirrorHighLight._yaml);
  });

  it('should call xml if there are no exceptions when on xml mode', function () {
    var stream = new CodeMirror.StringStream(
      '              <xs:complexType>',
      2);

    var state = mode.startState();
    state.token = codeMirrorHighLight._xml;
    state.localState = codeMirrorHighLight.xml.startState();

    sinon.spy(codeMirrorHighLight.xml, 'token');
    mode.token(stream, state);

    codeMirrorHighLight.xml.token.should.have.been.calledOnce;
    codeMirrorHighLight.xml.token.restore();

    state.token.should.equal(codeMirrorHighLight._xml);
  });

  it('should call json if there are no exceptions when on json mode', function () {
    var stream = new CodeMirror.StringStream(
      '              \"description\": \"job description\"',
      2);

    var state = mode.startState();
    state.token = codeMirrorHighLight._json;
    state.localState = codeMirrorHighLight.json.startState();

    sinon.spy(codeMirrorHighLight.json, 'token');
    mode.token(stream, state);

    codeMirrorHighLight.json.token.should.have.been.calledOnce;
    codeMirrorHighLight.json.token.restore();

    state.token.should.equal(codeMirrorHighLight._json);
  });

  it('should call markdown if there are no exceptions when on markdown mode', function () {
    var stream = new CodeMirror.StringStream(
      '  - [ ] Incomplete task list item',
      2);

    var state = mode.startState();
    state.token = codeMirrorHighLight._markdown;
    state.localState = codeMirrorHighLight.markdown.startState();

    sinon.spy(codeMirrorHighLight.markdown, 'token');
    mode.token(stream, state);

    codeMirrorHighLight.markdown.token.should.have.been.calledOnce;
    codeMirrorHighLight.markdown.token.restore();

    state.token.should.equal(codeMirrorHighLight._markdown);
  });

  it('should call yaml token on documentation key, and set markdown as next token', function () {
    var stream = new CodeMirror.StringStream(
      'content: |',
      2);

    sinon.spy(codeMirrorHighLight.yaml, 'token');
    var state = mode.startState();
    mode.token(stream, state);

    codeMirrorHighLight.yaml.token.should.have.been.calledOnce;
    codeMirrorHighLight.yaml.token.restore();

    state.token.should.equal(codeMirrorHighLight._markdown);
  });

  it('should call yaml token on \'text/xml\' key, and set xml as next token', function () {
    var stream = new CodeMirror.StringStream(
      '      text/xml:',
      2);

    sinon.spy(codeMirrorHighLight.yaml, 'token');
    var state = mode.startState();
    mode.token(stream, state);

    codeMirrorHighLight.yaml.token.should.have.been.calledOnce;
    codeMirrorHighLight.yaml.token.restore();

    state.token.should.equal(codeMirrorHighLight._xml);
  });

  it('should call yaml token on \'application/json\' key, and set json as next token', function () {
    var stream = new CodeMirror.StringStream(
      '      application/json:',
      2);

    sinon.spy(codeMirrorHighLight.yaml, 'token');
    var state = mode.startState();
    mode.token(stream, state);

    codeMirrorHighLight.yaml.token.should.have.been.calledOnce;
    codeMirrorHighLight.yaml.token.restore();

    state.token.should.equal(codeMirrorHighLight._json);
  });

  it('should call yaml on \'schema\' key when on xml mode without changing the mode', function () {
    var stream = new CodeMirror.StringStream(
      '        schema: |',
      2);

    var state = mode.startState();
    state.token = codeMirrorHighLight._xml;
    state.localState = codeMirrorHighLight.xml.startState();

    sinon.spy(codeMirrorHighLight.yaml, 'token');
    mode.token(stream, state);

    codeMirrorHighLight.yaml.token.should.have.been.calledOnce;
    codeMirrorHighLight.yaml.token.restore();

    state.token.should.equal(codeMirrorHighLight._xml);
  });

  it('should call yaml on \'example\' key when on xml mode without changing the mode', function () {
    var stream = new CodeMirror.StringStream(
      '        example: |',
      2);

    var state = mode.startState();
    state.token = codeMirrorHighLight._xml;
    state.localState = codeMirrorHighLight.xml.startState();

    sinon.spy(codeMirrorHighLight.yaml, 'token');
    mode.token(stream, state);

    codeMirrorHighLight.yaml.token.should.have.been.calledOnce;
    codeMirrorHighLight.yaml.token.restore();

    state.token.should.equal(codeMirrorHighLight._xml);
  });

  it('should call yaml on \'schema\' key when on json mode without changing the mode', function () {
    var stream = new CodeMirror.StringStream(
      '        schema: |',
      2);

    var state = mode.startState();
    state.token = codeMirrorHighLight._json;
    state.localState = codeMirrorHighLight.json.startState();

    sinon.spy(codeMirrorHighLight.yaml, 'token');
    mode.token(stream, state);

    codeMirrorHighLight.yaml.token.should.have.been.calledOnce;
    codeMirrorHighLight.yaml.token.restore();

    state.token.should.equal(codeMirrorHighLight._json);
  });

  it('should call yaml on \'example\' key when on json mode without changing the mode', function () {
    var stream = new CodeMirror.StringStream(
      '        example: |',
      2);

    var state = mode.startState();
    state.token = codeMirrorHighLight._json;
    state.localState = codeMirrorHighLight.json.startState();

    sinon.spy(codeMirrorHighLight.yaml, 'token');
    mode.token(stream, state);

    codeMirrorHighLight.yaml.token.should.have.been.calledOnce;
    codeMirrorHighLight.yaml.token.restore();

    state.token.should.equal(codeMirrorHighLight._json);
  });

  it('should restore yaml mode when indentation changes when on xml mode', function () {
    var stream = new CodeMirror.StringStream(
      '/tags:',
      2);

    var state = mode.startState();
    state.token = codeMirrorHighLight._xml;
    state.localState = codeMirrorHighLight.xml.startState();
    state.localState.parentIndentation = 2;

    sinon.spy(codeMirrorHighLight.yaml, 'token');
    mode.token(stream, state);

    codeMirrorHighLight.yaml.token.should.have.been.calledOnce;
    codeMirrorHighLight.yaml.token.restore();

    state.token.should.equal(codeMirrorHighLight._yaml);
  });

  it('should restore yaml mode when indentation changes when on json mode', function () {
    var stream = new CodeMirror.StringStream(
      '/tags:',
      2);

    var state = mode.startState();
    state.token = codeMirrorHighLight._json;
    state.localState = codeMirrorHighLight.json.startState();
    state.localState.parentIndentation = 2;

    sinon.spy(codeMirrorHighLight.yaml, 'token');
    mode.token(stream, state);

    codeMirrorHighLight.yaml.token.should.have.been.calledOnce;
    codeMirrorHighLight.yaml.token.restore();

    state.token.should.equal(codeMirrorHighLight._yaml);
  });

  it('should restore yaml mode when indentation changes when on markdown mode', function () {
    var stream = new CodeMirror.StringStream(
      '/tags:',
      2);

    var state = mode.startState();
    state.token = codeMirrorHighLight._markdown;
    state.localState = codeMirrorHighLight.markdown.startState();
    state.localState.parentIndentation = 2;

    sinon.spy(codeMirrorHighLight.yaml, 'token');
    mode.token(stream, state);

    codeMirrorHighLight.yaml.token.should.have.been.calledOnce;
    codeMirrorHighLight.yaml.token.restore();

    state.token.should.equal(codeMirrorHighLight._yaml);
  });

  it('should preserve highlight mode when encountering an empty line or an all spaces line', function () {
    var stream = new CodeMirror.StringStream(
      '',
      2);

    var state = mode.startState();
    state.token = codeMirrorHighLight._markdown;
    state.localState = codeMirrorHighLight.markdown.startState();
    state.localState.parentIndentation = 2;

    mode.token(stream, state);

    state.token.should.equal(codeMirrorHighLight._markdown);
  });

  it('should preserve highlight mode when encountering a line with just spaces', function () {
    var stream = new CodeMirror.StringStream(
      '  ',
      2);

    var state = mode.startState();
    state.token = codeMirrorHighLight._markdown;
    state.localState = codeMirrorHighLight.markdown.startState();
    state.localState.parentIndentation = 4;

    mode.token(stream, state);

    state.token.should.equal(codeMirrorHighLight._markdown);
  });

  it('calculates the correct indentation when entering markdown mode (taking array starter into account)', function() {
    var state = mode.startState();
    var stream = new CodeMirror.StringStream('  - content: |');
    // advance past first two spaces
    state.token(stream, state);
    stream.start = stream.pos;

    state.token(stream, state).should.be.equal('meta');
    state.localState.parentIndentation.should.be.equal(4);
  });

  describe('indentation', function() {
    it('marks beginning indentation', function() {
      var state = mode.startState();
      var stream = new CodeMirror.StringStream('    description: text');
      mode.token(stream, state).should.equal('indent indent-col-0');
      stream.pos.should.equal(2);

      stream.start = stream.pos;
      mode.token(stream, state).should.equal('indent indent-col-2');
      stream.pos.should.equal(4);
    });

    it('marks beginning partial indentation (1 trailing space)', function() {
      var state = mode.startState();
      var stream = new CodeMirror.StringStream('   description: text');
      mode.token(stream, state).should.equal('indent indent-col-0');
      stream.pos.should.equal(2);

      stream.start = stream.pos;
      mode.token(stream, state).should.equal('indent-incomplete');
      stream.pos.should.equal(3);
    });

    it('does not mark indentation after non-whitespace', function() {
      var state = mode.startState();
      var stream = new CodeMirror.StringStream('description: text    ');
      while (stream.pos < 17) {
        mode.token(stream, state);
        stream.start = stream.pos;
      }
      should.not.exist(mode.token(stream, state));
      stream.string.slice(stream.start, stream.pos).should.equal(' ');
    });

    it('does not mark indentation within nested, non-raml modes', function() {
      var state = mode.startState();
      [
        '/resource:',
        '  description: |'
      ].forEach(function(text) {
        var stream = new CodeMirror.StringStream(text, 2);
        while (!stream.eol()) {
          mode.token(stream, state);
          stream.start = stream.pos;
        }
      });

      var stream = new CodeMirror.StringStream('      Some *markdown* text');
      mode.token(stream, state).should.equal('indent indent-col-0');
      stream.pos.should.equal(2);

      stream.start = stream.pos;
      mode.token(stream, state).should.equal('indent indent-col-2');
      stream.pos.should.equal(4);

      stream.start = stream.pos;
      // there should be no vertical line for the third chunk of two spaces
      // since they're nested within the markdown
      should.not.exist(mode.token(stream, state));
    });
  });
});
