/**
 * Created by noam.benami on 12/16/13.
 *
 * The lazydom module provides a DOM-like API over raml documents. For
 * performance reasons, this DOM is lazy; navigation from one node to
 * another involves parsing RAML rather than walking an actual DOM.
 *
 * The parsing code is derived from existing editor raml-parsing code and
 * is thus designed for editor purposes. This is no intended to be a full
 * scale, compliant YAML or RAML codebase, but an MVP implementation
 * designed to make things like reliably showing the right shelf items a
 * matter NOT of RAML parsing but of DOM inspection.
 */
'use strict';

angular.module('lazydom', [])
.factory('getCurrentNode', function(getLineIndent, isArrayStarter, extractKey) {
    /**
     * @param editor The codemirror editor containing the RAML document
     * @returns {Object} the lazydom element for the current cursor position.
     */
  return function(editor) {

    //region LazyNode Class Definition
    /**
     * Builds a new lazy node from the given content
     * @param editor The CodeMirror raml editor
     * @constructor
     */
    function LazyNode(editor, lineNum) {
      this.editor = editor;
      this.lineNum = lineNum || editor.getCursor().line;
      this.line = editor.getLine(this.lineNum);
      if (!this.line) {
        return null; //No content in editor at this line
      }
      this.key = extractKey(this.line);
      this.isArrayNode = isArrayStarter();
      this.tabCount = getLineIndent()
      return this;
    }

    /**
     * @returns {Object} The next sibling node. Null if no sibling node exists.
     */
    LazyNode.prototype.getNext = function() {
      //Calculate the correct tab indent for the next sibling:
      //For non-array nodes, the indent is identical
      //For array node, the indent is one greater
      var nextLine = this.line;
      while(true) {
        var nextNode = new LazyNode(editor, nextLine++);
        //nextNode will be null if there is no next line
        if (nextNode) {

        }
      }
      return null;
    };

    /**
     *
     */
    LazyNode.prototype.getPrevious = function() {};
    LazyNode.prototype.getParent = function() {};
    LazyNode.prototype.getChildren = function() {};
    //endregion

    return new LazyNode(editor);
  };
});
