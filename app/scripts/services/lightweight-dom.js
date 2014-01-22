/**
 * The lightweight-dom module provides a DOM-like API over raml documents. For
 * performance reasons, this DOM is lazy; navigation from one node to
 * another involves parsing RAML rather than walking an actual DOM.
 *
 * The parsing code is built on lightweight-parse, for which this module is
 * intended to be a facade.
 * It is designed for editor purposes and not intended to be a compliant
 * RAML parser, but an MVP implementation designed to make things like reliably
 * showing the right shelf items a matter not of string parsing but of RAML DOM
 * inspection/traversal.
 *
 * Since this is a designer DOM, it attempts to return as much data as possible
 * even if a document is correctly formed. To this end, parents/children are
 * defined as having a less than/greater than tab count. For example:
 * Foo:
 *     Bar:
 *           Baz:
 * The child of Foo is Bar and the child of Bar is Baz. The reverse traversal
 * is Baz to Bar to Foo. So, it is thus up to client code to detect proper
 * nesting by inspecting nodes' tabCount. For example, code could autocorrect
 * users' code, show an error, or ignore the issue and let the user fix the
 * errors themselves.
 */
'use strict';

(function () {
  angular.module('lightweightDOM', ['lightweightParse'])
  .factory('getNode', function getNodeFactory(getSpaceCount, getTabCount, getLineIndent, isArrayStarter, isCommentStarter, extractKeyValue) {
    var cache = {};

    //region LazyNode Class Definition
    /**
     * Builds a new lazy node from the given content.
     * @param editor The CodeMirror raml editor containing the RAML document
     * @param lineNumber The line to read the node from.
     * @constructor
     * @throws If lineNumber is out of range of the editor's contents
     */
    function LazyNode(editor, lineNumber, line) {
      this.editor         = editor;
      this.lineNumber     = lineNumber;
      this.line           = line;
      this.lineIndent     = getLineIndent(this.line, editor.getOption('indentUnit'));
      this.isEmpty        = this.lineIndent.spaceCount === this.line.length;
      this.isComment      = !this.isEmpty   && isCommentStarter(this.line);
      this.isArrayStarter = !this.isComment && isArrayStarter(this.line);
      this.isStructural   = !this.isEmpty   && !this.isComment;
    }

    LazyNode.prototype.getKeyValue = function getKeyValue() {
      if (!this.keyValue) {
        this.keyValue = extractKeyValue(this.line);
      }

      return this.keyValue;
    };

    LazyNode.prototype.getKey = function getKey() {
      return this.getKeyValue().key;
    };

    LazyNode.prototype.getValue = function getValue() {
      return this.getKeyValue().value;
    };

    /**
     * @returns {LazyNode} The next structural sibling node, or null.
     */
    LazyNode.prototype.getNextSibling = function getNextSibling() {
      // Calculate the correct tab indent for the next sibling:
      // For non-array nodes, the indent is identical
      // For array node, the indent is one greater
      var nextLineNumber = this.lineNumber;

      while (true) {
        var nextNode = getNode(this.editor, ++nextLineNumber);
        if (nextNode === null) {
          return null;
        }

        // Skip empty elements and comments
        if (!nextNode.isStructural) {
          continue;
        }

        // If the next node is at our tab level it is always a sibling
        if (nextNode.lineIndent.tabCount === this.lineIndent.tabCount) {
          return nextNode;
        }

        // Array case:
        // Previous element is non-starter in previous array:
        if (this.isArrayStarter && !nextNode.isArrayStarter && nextNode.lineIndent.tabCount === this.lineIndent.tabCount + 1) {
          return nextNode;
        }

        // Previous element is starter in previous array:
        if (!this.isArrayStarter && nextNode.isArrayStarter && nextNode.lineIndent.tabCount === this.lineIndent.tabCount - 1) {
          return nextNode;
        }

        // If we end up at a lower tab count, then there are no more siblings possible
        if (nextNode.lineIndent.tabCount < this.lineIndent.tabCount)  {
          return null;
        }
      }
    };

    /**
     * @returns {LazyNode} The previous structural sibling node, or null.
     */
    LazyNode.prototype.getPreviousSibling = function getPreviousSibling() {
      // Calculate the correct tab indent for the previous sibling:
      // For non-array nodes, the indent is identical
      // For array node, the indent is one less OR an element that is an array starter
      var prevLineNumber = this.lineNumber;

      while (true) {
        prevLineNumber -= 1;

        var prevNode = getNode(this.editor, prevLineNumber);
        if (prevNode === null) {
          return null;
        }

        // Ignore comments and empty lines
        if (!prevNode.isStructural) {
          continue;
        }

        // If the previous node is at our tab level it is always a sibling
        if (prevNode.lineIndent.tabCount === this.lineIndent.tabCount) {
          return prevNode;
        }

        // Array cases:
        // Previous element is non-starter in previous array:
        if (this.isArrayStarter && !prevNode.isArrayStarter && prevNode.lineIndent.tabCount === this.lineIndent.tabCount + 1) {
          return prevNode;
        }

        // Previous element is starter in previous array:
        if (!this.isArrayStarter && prevNode.isArrayStarter && prevNode.lineIndent.tabCount === this.lineIndent.tabCount - 1) {
          return prevNode;
        }

        //If we end up at a lower tab count, then there are no more siblings possible
        if (prevNode.lineIndent.tabCount < this.lineIndent.tabCount)  {
          return null;
        }
      }
    };

    /**
     * @returns {LazyNode} The first structural child node, or null.
     */
    LazyNode.prototype.getFirstChild = function getFirstChild() {
      var nextNodeTabCount = this.lineIndent.tabCount + (this.isArrayStarter ? 2 : 1);
      var nextLineNumber   = this.lineNumber;

      while (true) {
        var nextNode = getNode(this.editor, ++nextLineNumber);
        if (nextNode === null) {
          return null;
        }

        // If we end up at the same or lower tab count, then there are no children possible
        if (nextNode.lineIndent.tabCount < nextNodeTabCount) {
          return null;
        }

        // look at any node at or beyond the tabCount since the document could be malformed,
        // but we still want to return children.
        if (nextNode.lineIndent.tabCount >= nextNodeTabCount && nextNode.isStructural) {
          return nextNode;
        }
      }
    };

    /**
     * @returns {LazyNode} The parent node, or null if this is a root node
     */
    LazyNode.prototype.getParent = function getParent() {
      // For members of arrays that aren't the first array element, the parent is
      // two tabs over, e.g
      // documentation:
      //   - title: foo
      //     content: bar <- 2 tabs over from parent
      var parentNodeTabCount = this.lineIndent.tabCount - ((!this.isArrayStarter && this.getIsInArray()) ? 2 : 1);
      var prevLineNumber     = this.lineNumber;

      while (true) {
        var prevNode = getNode(this.editor, --prevLineNumber);
        if (prevNode === null) {
          return null;
        }

        // look at any node at or beyond the tabCount since the document could be malformed,
        // but we still want to return a parent if we can find one.
        if (prevNode.lineIndent.tabCount <= parentNodeTabCount && prevNode.isStructural) {
          return prevNode;
        }
      }
    };

    /**
     * @returns {[LazyNode]} All direct descendants of this node
     */
    LazyNode.prototype.getChildren = function getChildren() {
      var children = [];
      var child = this.getFirstChild();
      while (child !== null) {
        children.push(child);
        child = child.getNextSibling();
      }
      return children;
    };

    /**
     * @returns {[LazyNode]} The current node plus any nodes at the same tab
     * level with the same parent. For arrays, returns all members of the
     * node's array. Array consists first of current node, then previous neighbors
     * then next neighbors.
     */
    LazyNode.prototype.getSelfAndNeighbors = function getSelfAndNeighbors() {
      var nodes   = [];
      var inArray = this.getIsInArray();
      var node    = this;

      while (node && node.getIsInArray() === inArray) {
        nodes.push(node);
        if (node.isArrayStarter) {
          break;
        }

        node = node.getPreviousSibling();
      }

      node = this.getNextSibling();
      while (node && !node.isArrayStarter && node.getIsInArray() === inArray) {
        nodes.push(node);
        node = node.getNextSibling();
      }

      return nodes;
    };

    /**
     * @returns {Boolean} Whether or not the node is in an array
     */
    LazyNode.prototype.getIsInArray = function getIsInArray() {
      // Walk previous siblings until we find one that starts an array, or we run
      // out of siblings.
      // Note: We don't use recursion here since JS has a low recursion limit of 1000
      if (this.isArrayStarter) {
        return true;
      }

      // Move up until we find a node one tab count less: If it is
      // an array starter, we are in an array
      var node = this.getPreviousSibling();
      while (node && node.lineIndent.tabCount >= this.lineIndent.tabCount) {
        node = node.getPreviousSibling();
      }

      return !!(node && node.isArrayStarter && (node.lineIndent.tabCount === this.lineIndent.tabCount - 1));
    };

    /**
     * @returns {Array} Returns array containing all parent nodes of
     * this node, with the direct parent being the last element in the
     * array.
     */
    LazyNode.prototype.getPath = function getPath() {
      var path = [];
      var node = this;

      while ((node = node.getParent())) {
        path.unshift(node);
      }

      return path;
    };

    /**
     * Executes the testFunc against this node and its parents, moving up the
     * tree until no more nodes are found.  Will halt if the test function
     * returns true.
     * @param testFunc Function to execute against current node and parents
     * @returns {LazyNode} The first node where testFunc returns true, or null.
     */
    LazyNode.prototype.selfOrParent = function selfOrParent(testFunc) {
      return this.first(this.getParent, testFunc);
    };

    /**
     * Executes the testFunc against this node and its prior siblings. Will
     * halt if the test function returns true.
     * @param testFunc Function to execute against current node and parents
     * @returns {LazyNode} The first node where testFunc returns true, or null.
     */
    LazyNode.prototype.selfOrPrevious = function selfOrPrevious(testFunc) {
      return this.first(this.getPreviousSibling, testFunc);
    };

    /**
     * Executes the test function against all nodes, including the current one,
     * returned by nextNodeFunc. Halts when no more nodes are found or testFunc
     * returns a truthy value.
     * @param nextNodeFunc Function that returns the next node to search.
     * @param testFunc Function that returns a node that matches a filter.
     * @returns {LazyNode} The first node where testFunc returns true, or null.
     */
    LazyNode.prototype.first = function first(nextNodeFunc, testFunc) {
      var node = this;

      while (node) {
        if (testFunc(node)) {
          return node;
        }

        node = nextNodeFunc.apply(node);
      }

      return null;
    };

    //endregion

    /**
     * @param editor The CodeMirror raml editor containing the RAML document
     * @param lineNumber The line to read the node from, or the current cursor
     *                line if not specified.
     * @returns {LazyNode} Instance of LazyNode at given line, or null if the
     * line is not a number or out of editor bounds.
     */
    function getNode(editor, lineNumber) {
      // If the line number is a number but out of bounds then we return null.
      // If the line number is not a number, we use the current editor line.
      var cursor      = editor.getCursor();
      var codeLineNum = arguments.length > 1 ? lineNumber : cursor.line;
      var line        = editor.getLine(codeLineNum);
      var cachedNode  = cache[codeLineNum];

      if (line === undefined) {
        return null;
      }

      // Special case: If a node is non-structural, e.g. an empty line or a comment, then by
      // contract with upper layers, we use the cursor position if it is at the line.
      // This matches the behavior of the shelf and autocomplete features.
      // It is, admittedly, a little bit obscure but based on all editor use cases we've looked at, it works.
      if (cursor.line === codeLineNum) {
        var spaceCount = getSpaceCount(line);
        if (spaceCount === line.length || line[spaceCount] === '#') {
          line = line.slice(0, cursor.ch);
        }
      }

      if (!cachedNode || cachedNode.line !== line) {
        cachedNode = cache[codeLineNum] = new LazyNode(editor, codeLineNum, line);
      }

      return cachedNode;
    }

    return getNode;
  });
})();
