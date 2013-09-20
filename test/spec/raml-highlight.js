'use strict';

var codeMirrorHighLight;
var mode;

describe('RAML Highlight Service', function (){
  beforeEach(function (){
    var $injector = angular.injector(['codeMirror']);
    codeMirrorHighLight = $injector.get('codeMirrorHighLight');
    codeMirrorHighLight.should.be.ok;

    mode = codeMirrorHighLight.highlight({});
    mode.should.be.ok;
  });

  it('should call yaml token by default', function (){
    var stream = new CodeMirror.StringStream(
      "title: Test",
      2);

    sinon.spy(codeMirrorHighLight.yaml, "token");
    var state = mode.startState();
    mode.token(stream, state);

    codeMirrorHighLight.yaml.token.should.have.been.calledOnce;
    codeMirrorHighLight.yaml.token.restore();

    state.token.should.equal(codeMirrorHighLight._yaml);
  });

  it('should call xml if there are no exceptions when on xml mode', function (){
    var stream = new CodeMirror.StringStream(
      "              <xs:complexType>",
      2);

    var state = mode.startState();
    state.token = codeMirrorHighLight._xml;
    state.localState = codeMirrorHighLight.xml.startState();

    sinon.spy(codeMirrorHighLight.xml, "token");
    mode.token(stream, state);

    codeMirrorHighLight.xml.token.should.have.been.calledOnce;
    codeMirrorHighLight.xml.token.restore();

    state.token.should.equal(codeMirrorHighLight._xml);
  });

  it('should call json if there are no exceptions when on json mode', function (){
    var stream = new CodeMirror.StringStream(
      "              \"description\": \"job description\"",
      2);

    var state = mode.startState();
    state.token = codeMirrorHighLight._json;
    state.localState = codeMirrorHighLight.json.startState();

    sinon.spy(codeMirrorHighLight.json, "token");
    mode.token(stream, state);

    codeMirrorHighLight.json.token.should.have.been.calledOnce;
    codeMirrorHighLight.json.token.restore();

    state.token.should.equal(codeMirrorHighLight._json);
  });

  it('should call markdown if there are no exceptions when on markdown mode', function (){
    var stream = new CodeMirror.StringStream(
      "  - [ ] Incomplete task list item",
      2);

    var state = mode.startState();
    state.token = codeMirrorHighLight._markdown;
    state.localState = codeMirrorHighLight.markdown.startState();

    sinon.spy(codeMirrorHighLight.markdown, "token");
    mode.token(stream, state);

    codeMirrorHighLight.markdown.token.should.have.been.calledOnce;
    codeMirrorHighLight.markdown.token.restore();

    state.token.should.equal(codeMirrorHighLight._markdown);
  });

  it('should call yaml token on documentation key, and set markdown as next token', function (){
    var stream = new CodeMirror.StringStream(
      "content: |",
      2);

    sinon.spy(codeMirrorHighLight.yaml, "token");
    var state = mode.startState();
    mode.token(stream, state);

    codeMirrorHighLight.yaml.token.should.have.been.calledOnce;
    codeMirrorHighLight.yaml.token.restore();

    state.token.should.equal(codeMirrorHighLight._markdown);
  });

  it('should call yaml token on \'text/xml\' key, and set xml as next token', function (){
    var stream = new CodeMirror.StringStream(
      "      text/xml:",
      2);

    sinon.spy(codeMirrorHighLight.yaml, "token");
    var state = mode.startState();
    mode.token(stream, state);

    codeMirrorHighLight.yaml.token.should.have.been.calledOnce;
    codeMirrorHighLight.yaml.token.restore();

    state.token.should.equal(codeMirrorHighLight._xml);
  });

  it('should call yaml token on \'application/json\' key, and set json as next token', function (){
    var stream = new CodeMirror.StringStream(
      "      application/json:",
      2);

    sinon.spy(codeMirrorHighLight.yaml, "token");
    var state = mode.startState();
    mode.token(stream, state);

    codeMirrorHighLight.yaml.token.should.have.been.calledOnce;
    codeMirrorHighLight.yaml.token.restore();

    state.token.should.equal(codeMirrorHighLight._json);
  });

  it('should call yaml on \'schema\' key when on xml mode without changing the mode', function (){
    var stream = new CodeMirror.StringStream(
      "        schema: |",
      2);

    var state = mode.startState();
    state.token = codeMirrorHighLight._xml;
    state.localState = codeMirrorHighLight.xml.startState();

    sinon.spy(codeMirrorHighLight.yaml, "token");
    mode.token(stream, state);

    codeMirrorHighLight.yaml.token.should.have.been.calledOnce;
    codeMirrorHighLight.yaml.token.restore();

    state.token.should.equal(codeMirrorHighLight._xml);
  });

  it('should call yaml on \'example\' key when on xml mode without changing the mode', function (){
    var stream = new CodeMirror.StringStream(
      "        example: |",
      2);

    var state = mode.startState();
    state.token = codeMirrorHighLight._xml;
    state.localState = codeMirrorHighLight.xml.startState();

    sinon.spy(codeMirrorHighLight.yaml, "token");
    mode.token(stream, state);

    codeMirrorHighLight.yaml.token.should.have.been.calledOnce;
    codeMirrorHighLight.yaml.token.restore();

    state.token.should.equal(codeMirrorHighLight._xml);
  });

  it('should call yaml on \'schema\' key when on json mode without changing the mode', function (){
    var stream = new CodeMirror.StringStream(
      "        schema: |",
      2);

    var state = mode.startState();
    state.token = codeMirrorHighLight._json;
    state.localState = codeMirrorHighLight.json.startState();

    sinon.spy(codeMirrorHighLight.yaml, "token");
    mode.token(stream, state);

    codeMirrorHighLight.yaml.token.should.have.been.calledOnce;
    codeMirrorHighLight.yaml.token.restore();

    state.token.should.equal(codeMirrorHighLight._json);
  });

  it('should call yaml on \'example\' key when on json mode without changing the mode', function (){
    var stream = new CodeMirror.StringStream(
      "        example: |",
      2);

    var state = mode.startState();
    state.token = codeMirrorHighLight._json;
    state.localState = codeMirrorHighLight.json.startState();

    sinon.spy(codeMirrorHighLight.yaml, "token");
    mode.token(stream, state);

    codeMirrorHighLight.yaml.token.should.have.been.calledOnce;
    codeMirrorHighLight.yaml.token.restore();

    state.token.should.equal(codeMirrorHighLight._json);
  });

  it('should restore yaml mode when indentation changes when on xml mode', function (){
    var stream = new CodeMirror.StringStream(
      "/tags:",
      2);

    var state = mode.startState();
    state.token = codeMirrorHighLight._xml;
    state.localState = codeMirrorHighLight.xml.startState();
    state.localState.parentIndentation = 2;

    sinon.spy(codeMirrorHighLight.yaml, "token");
    mode.token(stream, state);

    codeMirrorHighLight.yaml.token.should.have.been.calledOnce;
    codeMirrorHighLight.yaml.token.restore();

    state.token.should.equal(codeMirrorHighLight._yaml);
  });

  it('should restore yaml mode when indentation changes when on json mode', function (){
    var stream = new CodeMirror.StringStream(
      "/tags:",
      2);

    var state = mode.startState();
    state.token = codeMirrorHighLight._json;
    state.localState = codeMirrorHighLight.json.startState();
    state.localState.parentIndentation = 2;

    sinon.spy(codeMirrorHighLight.yaml, "token");
    mode.token(stream, state);

    codeMirrorHighLight.yaml.token.should.have.been.calledOnce;
    codeMirrorHighLight.yaml.token.restore();

    state.token.should.equal(codeMirrorHighLight._yaml);
  });

  it('should restore yaml mode when indentation changes when on markdown mode', function (){
    var stream = new CodeMirror.StringStream(
      "/tags:",
      2);

    var state = mode.startState();
    state.token = codeMirrorHighLight._markdown;
    state.localState = codeMirrorHighLight.markdown.startState();
    state.localState.parentIndentation = 2;

    sinon.spy(codeMirrorHighLight.yaml, "token");
    mode.token(stream, state);

    codeMirrorHighLight.yaml.token.should.have.been.calledOnce;
    codeMirrorHighLight.yaml.token.restore();

    state.token.should.equal(codeMirrorHighLight._yaml);
  });
});