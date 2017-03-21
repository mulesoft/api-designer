'use strict';

describe('Lightweight DOM Module', function () {
  var codeMirror;
  var getNode;

  beforeEach(module('lightweightDOM'));
  beforeEach(module('ramlEditorApp'));
  beforeEach(inject(function ($injector) {
    codeMirror = $injector.get('codeMirror');
    getNode    = $injector.get('getNode');
  }));

  //region Tests

  //Combined scenario tests:
  describe('LazyNode', function () {

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
      node.getKey().should.be.equal('title');
      //Should skip the comment node on line 2
      node = node.getNextSibling();
      //Verify all the properties as a sanity check
      node.getKey().should.be.equal('version');
      node.line.should.be.equal('version: 2010-04-01');
      node.lineNumber.should.be.equal(2);
      node.isComment.should.be.equal(false);
      node.getIsInArray().should.be.equal(false);
      node.lineIndent.tabCount.should.be.equal(0);
      //Ensure that we properly skip the indented comment
      node = node.getNextSibling();
      node.getKey().should.be.equal('documentation');
      //Ensure that we properly skip the child arrays
      node = node.getNextSibling();
      node.getKey().should.be.equal('baseUri');
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
      node.getKey().should.be.equal('title');
      node.getValue().text.should.be.equal('Hello');
      node = node.getNextSibling();
      node.isArrayStarter.should.be.equal(false);
      node.getIsInArray().should.be.equal(true);
      node.getKey().should.be.equal('content');
      node.getValue().text.should.be.equal('World');
      //Iterator should skip to the next array:
      node = node.getNextSibling();
      node.isArrayStarter.should.be.equal(true);
      node.getIsInArray().should.be.equal(true);
      node.getKey().should.be.equal('title');
      node.getValue().text.should.be.equal('Foo');
      //final node
      node = node.getNextSibling();
      node.isArrayStarter.should.be.equal(false);
      node.getIsInArray().should.be.equal(true);
      node.getKey().should.be.equal('content');
      node.getValue().text.should.be.equal('Bar');
      node.getParent().getKey().should.be.equal('documentation');
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
      node.lineNumber.should.be.equal(0);
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

    it('should report tabCount at cursor position for empty node', function() {
      var editor = getEditor(codeMirror,[
        'documentation:',
        '    ',
        '  #Hello  '
      ]);
      editor.setCursor({line: 1, ch: 2});
      var node = getNode(editor);
      //Sanity check:
      node.lineNumber.should.be.equal(1);
      //The line tab count is 2, but the cursor position is 1 tab over:
      node.lineIndent.tabCount.should.be.equal(1);

      //Move cursor away from node
      editor.setCursor({line: 0, ch: 0});
      node = getNode(editor, 1);
      node.lineIndent.tabCount.should.be.equal(2);

      //Move cursor to comment line
      editor.setCursor({line: 2, ch: 0});
      node = getNode(editor);
      node.lineIndent.tabCount.should.be.equal(0);
    });
  });

  //Specific method tests:
  describe('LazyNode.getParent', function () {

    it('should be able to traverse to a parent on an empty line in an array using cursor position', function() {
      var editor = getEditor(codeMirror, [
        'documentation:',
        '  - title:',
        '    '
      ]);
      editor.setCursor({line:2, ch: 0});
      var node = getNode(editor);
      should.not.exist(node.getParent());
      editor.setCursor({line:2, ch: 2});
      node = getNode(editor);
      node.getParent().line.should.be.equal('documentation:');
      editor.setCursor({line:2, ch: 4});
      node = getNode(editor);
      node.getParent().line.should.be.equal('documentation:');
    });
  });

  //Specific method tests:
  describe('LazyNode.getChildren', function () {

    it('should return all direct children of a node', function() {
      var editor = getEditor(codeMirror, [
        'resourceTypes:',
        '  - collection:',
        '      usage: This resourceType should be used for any collection of items',
        '        description: The collection of <<resourcePathName>>',
        '      get:',
        '        description: Get all <<resourcePathName>>, optionally filtered',
        '      post:',
        '        description: Create a new <<resourcePathName | !singularize>>'
      ]);
      editor.setCursor({line:1, ch: 0});
      var node = getNode(editor);
      var children = node.getChildren();

      children[0].getKey().should.be.equal('usage');
      children[1].getKey().should.be.equal('get');
      children[2].getKey().should.be.equal('post');
      should.not.exist(children[3]);
    });
  });

  describe('LazyNode.getSelfAndNeighbors', function () {

    it('should return all members of an array under a documentation node', function() {
      var editor = getEditor(codeMirror, [
        'documentation:',
        '  - title: A',
        '    content: B',
        '  - content: C',
        '    title: D',
        '  - title: E',
        '    '
      ], 2);
      //Start with the second node in the first array:
      var node = getNode(editor);
      node.getValue().text.should.be.equal('B');
      var nodes = node.getSelfAndNeighbors();
      nodes.length.should.be.equal(2);
      nodes[0].getValue().text.should.be.equal('B');
      nodes[1].getValue().text.should.be.equal('A');

      //Now try the first node in the first array:
      nodes = nodes[1].getSelfAndNeighbors();
      nodes.length.should.be.equal(2);
      nodes[0].getValue().text.should.be.equal('A');
      nodes[1].getValue().text.should.be.equal('B');

      //Try the same thing with the empty node in the last array:
      editor.setCursor({ line: 6, ch: 4 });
      nodes = getNode(editor).getSelfAndNeighbors();
      nodes.length.should.be.equal(2);
      nodes[0].isEmpty.should.be.equal(true);
      nodes[1].getValue().text.should.be.equal('E');
    });
  });

  describe('LazyNode.getPath', function () {

    it('should return all parents in a simple hierarchy in the right order', function() {
      var editor = getEditor(codeMirror, [
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
        '          type: string'
      ], 13);
      //Start with the second node in the first array:
      var path = getNode(editor).getPath().map(function(node) { return node.getKey(); });
      path.should.be.deep.equal(['baseUri', '/Accounts', '/{AccountSid}', 'uriParameters', 'AccountSid']);
    });

    it('should return an empty array for root level nodes', function() {
      var editor = getEditor(codeMirror, [
        'title: Twilio API',
      ]);
      //Start with the second node in the first array:
      var path = getNode(editor).getPath();
      path.length.should.be.equal(0);
    });

    it('should return only the parent for an empty array element', function() {
      var editor = getEditor(codeMirror, [
        'documentation:',
        '  - title: Hello',
        '  - '
      ], 2);
      var path = getNode(editor).getPath();
      path.length.should.be.equal(1);
    });
  });

  describe('LazyNode.selfOrParent', function () {

    it('should return self if matched', function() {
      var editor = getEditor(codeMirror, [
        'title: Twilio API',
        '#Taken from the RAML spec',
        'version: 2010-04-01'
      ], 2);
      var node = getNode(editor);
      node = node.selfOrParent(function(node) { return node.getValue().text === '2010-04-01'; });
      node.getValue().text.should.be.equal('2010-04-01');
      node.getKey().should.be.equal('version');
    });

    it('should return parent if self does not match', function() {
      var editor = getEditor(codeMirror, [
        'title: Twilio API',
        'baseUri: https://api.twilio.com/{version}',
        '  /Accounts:',
        '    /{AccountSid}:',
        '      uriParameters:',
        '        AccountSid:',
        '          description: |',
        '            An Account instance resource represents a single Twilio account.',
        '          type: string'
      ], 8);
      var node = getNode(editor).selfOrParent(function(node) { return node.getKey() === '/Accounts'; });
      node.should.be.ok;
    });

    it('should return null if no match found', function() {
      var editor = getEditor(codeMirror, [
        'title: Twilio API',
        'baseUri: https://api.twilio.com/{version}',
        '  /Accounts:',
      ], 2);
      var node = getNode(editor).selfOrParent(function(node) { return node.getKey() === 'xxx'; });
      should.not.exist(node);
    });
  });

  describe('LazyNode.selfOrPrevious', function () {

    it('should return self when matched', function() {
      var editor = getEditor(codeMirror, [
        'title: Twilio API',
        '#Taken from the RAML spec',
        'version: 2010-04-01'
      ], 2);
      var node = getNode(editor);
      node = node.selfOrPrevious(function(node) { return node.getValue().text === '2010-04-01'; });
      node.getValue().text.should.be.equal('2010-04-01');
      node.getKey().should.be.equal('version');
    });

    it('should return a previous sibling when matched', function() {
      var editor = getEditor(codeMirror, [
        'title: Twilio API',
        'documentation:',
        '  - title: Hello',
        '    content: world',
        '    Tricky: Hello'
      ], 3);
      var node = getNode(editor);
      node = node.selfOrPrevious(function(node) { return node.getValue().text === 'Hello'; });
      node.getValue().text.should.be.equal('Hello');
      node.getKey().should.be.equal('title');
    });

    it('should return null when no matches are found', function() {
      var editor = getEditor(codeMirror, [
        'title: Twilio API',
        'documentation:',
        '  - title: Hello',
        '    content: world',
      ], 3);
      var node = getNode(editor);
      node = node.selfOrPrevious(function(node) { return node.getValue().text === 'Foo'; });
      should.not.exist(node);
    });
  });

  describe('LazyNode caching', function () {
    it('should return the same LazyNode reference for the line that has NOT been changed', function () {
      var editor = getEditor(codeMirror, ['key: value']);
      getNode(editor).should.be.equal(getNode(editor));
    });

    it('should return different LazyNode reference for the line that has been changed', function () {
      var editor     = getEditor(codeMirror, ['key1: value1']);
      var cachedNode = getNode(editor);

      codeMirror.setLine(editor, 0, 'key2: value2');
      getNode(editor).should.not.be.equal(cachedNode);
    });
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
