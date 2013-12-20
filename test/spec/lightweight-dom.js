'use strict';

describe('Lightweight DOM Module', function () {
  var codeMirror;
  var getNode;

  beforeEach(module('lightweightDOM'));
  beforeEach(module('ramlEditorApp'));
  beforeEach(inject(function ($injector) {
    codeMirror = $injector.get('codeMirror');
    getNode = $injector.get('getNode');
  }));

  //region Tests

  describe('getNode', function () {

    it('should be able to traverse all siblings at root level', function () {
      var node = createNode([
        'title: Twilio API',
        '#Comment1',
        'version: 2010-04-01',
        '  #Comment2',
        'documentation:',
        '  - title: Hello',
        '  - content: World',
        'baseUri: https://api.twilio.com/{version}',
        '  /Accounts:'
      ]);
      node.key.should.be.equal('title');
      //Should skip the comment node on line 2
      node = node.getNextSibling();
      //Verify all the properties as a sanity check
      node.key.should.be.equal('version');
      node.line.should.be.equal('version: 2010-04-01');
      node.lineNum.should.be.equal(2);
      node.isComment.should.be.equal(false);
      node.getIsInArray().should.be.equal(false);
      node.tabCount.should.be.equal(0);
      //Ensure that we properly skip the indented comment
      node = node.getNextSibling();
      node.key.should.be.equal('documentation');
      //Ensure that we properly skip the child arrays
      node = node.getNextSibling();
      node.key.should.be.equal('baseUri');
      //Done, no more siblings
      expect(node.getNextSibling()).to.not.exist;
    });

    it('should be able to traverse forward and backwards through two multi-item arrays', function() {
      var node = createNode([
        'documentation:',
        '  - title: Hello',
        '    content: World',
        '  - title: Foo',
        '    content: Bar'
      ]);
      //Forward:
      node = node.getFirstChild();
      node.isArrayStarter.should.be.equal(true);
      node.getIsInArray().should.be.equal(true);
      node.key.should.be.equal('title');
      node.value.text.should.be.equal('Hello');
      node = node.getNextSibling();
      node.isArrayStarter.should.be.equal(false);
      node.getIsInArray().should.be.equal(true);
      node.key.should.be.equal('content');
      node.value.text.should.be.equal('World');
      //Iterator should skip to the next array:
      node = node.getNextSibling();
      node.isArrayStarter.should.be.equal(true);
      node.getIsInArray().should.be.equal(true);
      node.key.should.be.equal('title');
      node.value.text.should.be.equal('Foo');
      //final node
      node = node.getNextSibling();
      node.isArrayStarter.should.be.equal(false);
      node.getIsInArray().should.be.equal(true);
      node.key.should.be.equal('content');
      node.value.text.should.be.equal('Bar');
      node.getParent().key.should.be.equal('documentation');
      //final node
      should.not.exist(node.getNextSibling());
      //Backward:
      node = node.getPreviousSibling();
      node.line.should.be.equal('  - title: Foo');
      node = node.getPreviousSibling();
      node.line.should.be.equal('    content: World');
      node = node.getPreviousSibling();
      node.line.should.be.equal('  - title: Hello');
      should.not.exist(node.getPreviousSibling());
    });

    it('should be able to traverse to a parent from a child', function() {
      var node = createNode([
        'documentation:',
        '',
        '#Comment1',
        '  - title: Hello',
        '#Comment2',
        '    content: World',
        '  #Comment3',
        '  - title: Foo',
        '    content: Bar'
      ], 8);
      //We traverse from the last content element to the documentation element
      //which is its parent:
      node.line.should.be.equal('    content: Bar');
      node = node.getParent();
      node.lineNum.should.be.equal(0);
      node.line.should.be.equal('documentation:');
    });

    it('should be able to traverse to/from a parent/child when extra tabs are present', function() {
      var node = createNode([
        'documentation:',
        '        - content: Bar'
      ], 1);
      //We traverse from the last content element to the documentation element
      //which is its parent:
      node = node.getParent();
      node.line.should.be.equal('documentation:');
      node = node.getFirstChild();
      node.line.should.be.equal('        - content: Bar');
    });
  });

  it('should report tabCount at cursor position for empty and comment lines', function() {
    var editor = getEditor(codeMirror,[
      'documentation:',
      '    ',
      '  #Hello  '
    ]);
    editor.setCursor({line: 1, ch: 2});
    var node = getNode(editor);
    //Sanity check:
    node.lineNum.should.be.equal(1);
    //The line tab count is 2, but the cursor position is 1 tab over:
    node.tabCount.should.be.equal(1);

    //Move cursor away from node
    editor.setCursor({line: 0, ch: 0});
    node = getNode(editor, 1);
    node.tabCount.should.be.equal(2);

    //Move cursor to comment line
    editor.setCursor({line: 2, ch: 0});
    node = getNode(editor);
    node.tabCount.should.be.equal(0);
    //Move cursor to beyond where the comment starts
    editor.setCursor({line: 2, ch: 6});
    node = getNode(editor);
    node.tabCount.should.be.equal(3);
  });

  it('should be able to traverse to a parent on an empty line in an array using cursor position', function() {
    var editor = getEditor(codeMirror, [
      'documentation:',
      '  - title:',
      '  '
    ]);
    editor.setCursor({line:2, ch: 2});
    var node = getNode(editor);
    node.getParent().line.should.be.equal('documentation:');
  });
  //endregion

  //region Utility functions

  /**
   * @param ramlLines Array containing raml code lines
   * @param lineNum line from which to get the node, 0 if not specified
   * @returns {Object} LazyNode instance pointing to first line in raml
   */
  function createNode(ramlLines, lineNum) {
    lineNum = lineNum || 0;
    var editor = getEditor(codeMirror, ramlLines);
    return getNode(editor, lineNum);
  }

  /**
    Sample RAML:
      'title: Twilio API',
      '#Taken from the RAML spec',
      'version: 2010-04-01',
      'documentation:',
      '  - title: Hello',
      '  - content: World',
      'baseUri: https://api.twilio.com/{version}',
      '  /Accounts:',
      '    /{AccountSid}:',
      '      uriParameters:',
      '        AccountSid:',
      '          description: |',
      '            An Account instance resource represents a single Twilio account.',
      '          type: string',
      '      /Calls:',
      '        post:',
      '          description: |',
      '            Using the Twilio REST API, you can make outgoing calls to phones,',
      '            SIP-enabled endpoints and Twilio Client connections.',
      '',
      '            Note that calls initiated via the REST API are rate-limited to one per',
      '            second. You can queue up as many calls as you like as fast as you like,',
      '            but each call is popped off the queue at a rate of one per second.',
      '          body:',
      '            application/x-www-form-urlencoded:',
      '              formParameters:',
      '                From:',
      '                  description: |',
      '                    The phone number or client identifier to use as the caller id. If',
      '                    using a phone number, it must be a Twilio number or a Verified',
      '                    outgoing caller id for your account.',
      '                  type: string',
      '                  required: true',
      '                  pattern: (\\+1|1)?([2-9]\\d\\d[2-9]\\d{6}) # E.164 standard',
      '                  example: +14158675309'
   */

  //endregion
});
