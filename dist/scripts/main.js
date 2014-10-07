(function () {
  'use strict';
  angular.module('ramlEditorApp', [
    'ngResource',
    'ngSanitize',
    'ui.bootstrap.modal',
    'ui.bootstrap.tpls',
    'ui.tree',
    'ramlConsoleApp',
    'codeMirror',
    'fs',
    'helpers',
    'raml',
    'stringFilters',
    'utils',
    'lightweightDOM',
    'splitter'
  ]).run([
    '$window',
    function ($window) {
      // Adding proxy settings for api console
      $window.RAML.Settings.proxy = '/proxy/';
    }
  ]);
  ;
}());
(function () {
  'use strict';
  angular.module('utils', []).value('indentUnit', 2).factory('safeApply', [
    '$rootScope',
    '$exceptionHandler',
    function safeApplyFactory($rootScope, $exceptionHandler) {
      return function safeApply(scope, expr) {
        scope = scope || $rootScope;
        if ([
            '$apply',
            '$digest'
          ].indexOf(scope.$root.$$phase) !== -1) {
          try {
            return scope.$eval(expr);
          } catch (e) {
            $exceptionHandler(e);
          }
        } else {
          return scope.$apply(expr);
        }
      };
    }
  ]).factory('safeApplyWrapper', [
    'safeApply',
    function safeApplyWrapperFactory(safeApply) {
      return function safeApplyWrapper(scope, expr) {
        return function safeApplyWrapperInner1() {
          var args = Array.prototype.slice.call(arguments, 0);
          return safeApply(scope, function safeApplyWrapperInner2() {
            return expr.apply(this, args);
          });
        };
      };
    }
  ]).factory('getTime', function () {
    return Date.now || function () {
      return new Date().getTime();
    };
  }).factory('debounce', [
    '$timeout',
    function debounceFactory($timeout) {
      var timeout;
      return function debounce(fn, delay, invokeApply) {
        if (timeout) {
          $timeout.cancel(timeout);
        }
        timeout = $timeout(fn, delay, invokeApply);
      };
    }
  ]).factory('throttle', [
    'getTime',
    '$timeout',
    function (getTime, $timeout) {
      function throttle(func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        options || (options = {});
        var later = function () {
          previous = options.leading === false ? 0 : getTime();
          timeout = null;
          result = func.apply(context, args);
        };
        return function () {
          var now = getTime();
          if (!previous && options.leading === false) {
            previous = now;
          }
          var remaining = wait - (now - previous);
          context = this;
          args = arguments;
          if (remaining <= 0) {
            $timeout.cancel(timeout);
            timeout = null;
            previous = now;
            result = func.apply(context, args);
          } else if (!timeout && options.trailing !== false) {
            timeout = $timeout(later, remaining);
          }
          return result;
        };
      }
      return throttle;
    }
  ]).value('generateSpaces', function (spaceCount) {
    spaceCount = spaceCount || 0;
    return new Array(spaceCount + 1).join(' ');
  }).factory('generateTabs', [
    'generateSpaces',
    'indentUnit',
    function (generateSpaces, indentUnit) {
      return function (tabs, customIndentUnit) {
        customIndentUnit = customIndentUnit || indentUnit;
        tabs = tabs || 0;
        return new Array(tabs + 1).join(generateSpaces(indentUnit));
      };
    }
  ]).value('$prompt', function (message, value) {
    return window.prompt(message, value);
  }).value('$confirm', function (message) {
    return window.confirm(message);
  }).factory('generateName', function () {
    // generateName(names, defaultName, extension)
    // Takes a list of names under the current directory, uses defaultName as a pattern,
    // and add enumeration to the end of the defaultName.
    //
    // For example:
    // name        = ["Untitled-1.raml", "Untitled-2.raml", "test.raml"]
    // defaultName = 'Untitled-'
    // extension   = 'raml'
    //
    // will return 'Untitled-3.raml'
    return function generateName(names, defaultName, extension) {
      extension = extension ? '.' + extension : '';
      var currentMax = Math.max.apply(undefined, names.map(function (name) {
          var re = new RegExp(defaultName + '(\\d+)');
          var match = name.match(re);
          return match ? match[1] : 0;
        }).concat(0));
      return defaultName + (currentMax + 1) + extension;
    };
  }).factory('scroll', function () {
    var keys = {
        37: true,
        38: true,
        39: true,
        40: true
      };
    function preventDefault(e) {
      e = e || window.event;
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
    }
    function keyDown(e) {
      if (keys[e.keyCode]) {
        preventDefault(e);
        return;
      }
    }
    function wheel(e) {
      preventDefault(e);
    }
    return {
      enable: function () {
        if (window.removeEventListener) {
          window.removeEventListener('DOMMouseScroll', wheel, false);
        }
        window.onmousewheel = document.onmousewheel = document.onkeydown = null;
      },
      disable: function () {
        if (window.addEventListener) {
          window.addEventListener('DOMMouseScroll', wheel, false);
        }
        window.onmousewheel = document.onmousewheel = wheel;
        document.onkeydown = keyDown;
      }
    };
  });
  ;
}());
(function () {
  'use strict';
  angular.module('raml').value('config', {
    set: function (key, value) {
      localStorage['config.' + key] = value;
    },
    get: function (key, defaultValue) {
      key = 'config.' + key;
      if (key in localStorage) {
        return localStorage[key];
      }
      return defaultValue;
    },
    remove: function (key) {
      delete localStorage['config.' + key];
    },
    clear: function () {
      localStorage.clear();
    }
  });
  ;
}());
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
(function () {
  'use strict';
  angular.module('lightweightDOM', ['lightweightParse']).factory('getNode', [
    'getSpaceCount',
    'getTabCount',
    'getLineIndent',
    'isArrayStarter',
    'isCommentStarter',
    'extractKeyValue',
    function getNodeFactory(getSpaceCount, getTabCount, getLineIndent, isArrayStarter, isCommentStarter, extractKeyValue) {
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
        this.editor = editor;
        this.lineNumber = lineNumber;
        this.line = line;
        this.lineIndent = getLineIndent(this.line, editor.getOption('indentUnit'));
        this.isEmpty = this.lineIndent.spaceCount === this.line.length;
        this.isComment = !this.isEmpty && isCommentStarter(this.line);
        this.isArrayStarter = !this.isComment && isArrayStarter(this.line);
        this.isStructural = !this.isEmpty && !this.isComment;
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
          if (nextNode.lineIndent.tabCount < this.lineIndent.tabCount) {
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
          if (prevNode.lineIndent.tabCount < this.lineIndent.tabCount) {
            return null;
          }
        }
      };
      /**
       * @returns {LazyNode} The first structural child node, or null.
       */
      LazyNode.prototype.getFirstChild = function getFirstChild() {
        var nextNodeTabCount = this.lineIndent.tabCount + (this.isArrayStarter ? 2 : 1);
        var nextLineNumber = this.lineNumber;
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
        var parentNodeTabCount = this.lineIndent.tabCount - (!this.isArrayStarter && this.getIsInArray() ? 2 : 1);
        var prevLineNumber = this.lineNumber;
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
        var nodes = [];
        var inArray = this.getIsInArray();
        var node = this;
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
        return !!(node && node.isArrayStarter && node.lineIndent.tabCount === this.lineIndent.tabCount - 1);
      };
      /**
       * @returns {Array} Returns array containing all parent nodes of
       * this node, with the direct parent being the last element in the
       * array.
       */
      LazyNode.prototype.getPath = function getPath() {
        var path = [];
        var node = this;
        while (node = node.getParent()) {
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
        var cursor = editor.getCursor();
        var codeLineNum = arguments.length > 1 ? lineNumber : cursor.line;
        var line = editor.getLine(codeLineNum);
        var cachedNode = cache[codeLineNum];
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
    }
  ]);
  ;
}());
(function () {
  'use strict';
  angular.module('lightweightParse', ['utils']).factory('getEditorTextAsArrayOfLines', function getEditorTextAsArrayOfLinesFactory() {
    var cachedValue = '';
    var cachedLines = [];
    return function getEditorTextAsArrayOfLines(editor) {
      if (cachedValue === editor.getValue()) {
        return cachedLines;
      }
      cachedValue = editor.getValue();
      cachedLines = [];
      for (var i = 0, lineCount = editor.lineCount(); i < lineCount; i++) {
        cachedLines.push(editor.getLine(i));
      }
      return cachedLines;
    };
  }).factory('getSpaceCount', function getSpaceCountFactory() {
    return function getSpaceCount(line) {
      for (var i = 0, length = line.length; i < length; i++) {
        if (line[i] !== ' ') {
          break;
        }
      }
      return i;
    };
  }).factory('getTabCount', [
    'indentUnit',
    function getTabCountFactory(indentUnit) {
      return function getTabCount(spaceCount, indentSize) {
        indentSize = indentSize || indentUnit;
        return Math.floor(spaceCount / indentSize);
      };
    }
  ]).factory('getLineIndent', [
    'getSpaceCount',
    'getTabCount',
    function getLineIndentFactory(getSpaceCount, getTabCount) {
      return function getLineIndent(line, indentSize) {
        var spaceCount = getSpaceCount(line);
        return {
          spaceCount: spaceCount,
          tabCount: getTabCount(spaceCount, indentSize),
          content: spaceCount ? line.slice(spaceCount) : line
        };
      };
    }
  ]).factory('isArrayStarter', [
    'getSpaceCount',
    function isArrayStarterFactory(getSpaceCount) {
      return function isArrayStarter(line) {
        var spaceCount = getSpaceCount(line);
        return line[spaceCount] === '-' && line[spaceCount + 1] === ' ';
      };
    }
  ]).factory('isCommentStarter', [
    'getSpaceCount',
    function isCommentStarterFactory(getSpaceCount) {
      return function isCommentStarter(line) {
        var spaceCount = getSpaceCount(line);
        return line[spaceCount] === '#';
      };
    }
  ]).factory('extractKeyValue', function extractKeyValueFactory() {
    /**
       * Removes the whitespaces from the line between start and end indices.
       *
       * @param line The line that needs to be trimmed.
       * @param start The index of left border of the line where trimming should begin.
       * If value is negative, it'll be computed based on length of the line as [length + start].
       * @param end The index of the right border of the line where trimming should end.
       * If value is negative, it'll be computed based on length of the line as [length + end].
       *
       * @returns The trimmed line without whitespaces between start and end.
       */
    function trim(line, start, end) {
      start = start || 0;
      end = end || line.length;
      if (start < 0) {
        start = line.length + start;
      }
      if (end < 0) {
        end = line.length + end;
      }
      while (start < end && line[start] === ' ') {
        start += 1;
      }
      while (start < end && line[end - 1] === ' ') {
        end -= 1;
      }
      if (start === 0 && end === line.length) {
        return line;
      }
      return line.slice(start, end);
    }
    /**
       * Transforms a value which is a string into an object that provides additional
       * information such as whether value is an alias or a reference.
       *
       * @param value The value that needs to be transformed.
       *
       * @returns {{text, isAlias, isReference}}
       */
    function transformValue(value) {
      if (!value) {
        return null;
      }
      return {
        text: value,
        isAlias: value[0] === '&',
        isReference: value[0] === '*'
      };
    }
    return function extractKeyValue(line) {
      var start = 0;
      var end = line.length;
      var indexOf = line.indexOf('#');
      if (indexOf !== -1) {
        end = indexOf;
      }
      indexOf = line.indexOf('- ');
      if (indexOf !== -1 && indexOf < end) {
        start = indexOf + 2;
      }
      indexOf = line.indexOf(': ', start);
      if (indexOf !== -1 && indexOf < end) {
        return {
          key: trim(line, start, indexOf),
          value: transformValue(trim(line, indexOf + 2, end))
        };
      }
      indexOf = line.lastIndexOf(':', end);
      if (indexOf === end - 1) {
        return {
          key: trim(line, start, end - 1),
          value: null
        };
      }
      return {
        key: null,
        value: transformValue(trim(line, start, end))
      };
    };
  }).factory('getScopes', [
    'getLineIndent',
    function getScopesFactory(getLineIndent) {
      var lastArrayCache;
      function areArraysEqual(a, b) {
        if (a === undefined || b === undefined) {
          return false;
        }
        if (a.length !== b.length) {
          return false;
        }
        for (var i = 0; i < a.length; i++) {
          if (a[i] !== b[i]) {
            return false;
          }
        }
        return true;
      }
      return function getScopes(arrayOfLines) {
        if (lastArrayCache && areArraysEqual(lastArrayCache.key, arrayOfLines)) {
          return lastArrayCache.value;
        }
        var currentIndexes = {};
        var zipValues = arrayOfLines.map(function (line, index) {
            var lineIndentInfo = getLineIndent(line);
            return {
              tabCount: lineIndentInfo.tabCount,
              content: lineIndentInfo.content,
              lineNumber: index
            };
          });
        var levelTable = zipValues.reduce(function (result, currentLine) {
            var currentArray = currentIndexes[currentLine.tabCount - 1], lastArrayIndex, currentIndex;
            if (currentArray) {
              lastArrayIndex = currentArray.length - 1;
              currentIndex = currentIndexes[currentLine.tabCount - 1][lastArrayIndex];
            } else if (currentLine.tabCount > 1) {
              // Case for lists, we fetch a level lower
              currentArray = currentIndexes[currentLine.tabCount - 2];
              // Ignore this line if the tab level is invalid
              if (currentArray) {
                lastArrayIndex = currentArray.length - 1;
                currentIndex = currentIndexes[currentLine.tabCount - 2][lastArrayIndex];
                result[currentIndex] = result[currentIndex] || [];
                result[currentIndex].push({
                  lineNumber: currentLine.lineNumber,
                  content: currentLine.content,
                  tabCount: currentLine.tabCount
                });
                currentIndexes[currentLine.tabCount - 1] = currentIndexes[currentLine.tabCount - 1] || [];
                currentIndexes[currentLine.tabCount - 1].push(currentLine.lineNumber);
              }
              return result;
            } else {
              // Case of the first element of the first level
              currentIndex = 0;
            }
            result[currentIndex] = result[currentIndex] || [];
            result[currentIndex].push({
              lineNumber: currentLine.lineNumber,
              content: currentLine.content,
              tabCount: currentLine.tabCount
            });
            currentIndexes[currentLine.tabCount] = currentIndexes[currentLine.tabCount] || [];
            currentIndexes[currentLine.tabCount].push(currentLine.lineNumber);
            return result;
          }, {});
        lastArrayCache = {
          result: {
            scopeLevels: currentIndexes,
            scopesByLine: levelTable
          },
          lines: arrayOfLines
        };
        return {
          scopeLevels: currentIndexes,
          scopesByLine: levelTable
        };
      };
    }
  ]);
  ;
}());
(function () {
  'use strict';
  angular.module('codeFolding', [
    'raml',
    'lightweightParse'
  ]).factory('getFoldRange', [
    'getLineIndent',
    function getFoldRangeFactory(getLineIndent) {
      return function getFoldRange(cm, start) {
        var line = cm.getLine(start.line);
        var lineIndentInfo = getLineIndent(line);
        var nextLineIndentInfo;
        if (!lineIndentInfo.content) {
          return;
        }
        var nextLine = cm.getLine(start.line + 1);
        if (!nextLine) {
          return;
        }
        var tabCount = lineIndentInfo.tabCount;
        var nextTabCount = getLineIndent(nextLine).tabCount;
        if (nextTabCount > tabCount) {
          for (var i = start.line + 2, end = cm.lineCount(); i < end; i++) {
            nextLine = cm.getLine(i);
            nextLineIndentInfo = getLineIndent(nextLine);
            nextTabCount = nextLineIndentInfo.tabCount;
            if (nextTabCount <= tabCount && nextLineIndentInfo.content) {
              nextLine = cm.getLine(i - 1);
              return {
                from: CodeMirror.Pos(start.line, line.length),
                to: CodeMirror.Pos(i - 1, nextLine.length)
              };
            }
            if (i === end - 1) {
              nextLine = cm.getLine(end - 1);
              return {
                from: CodeMirror.Pos(start.line, line.length),
                to: CodeMirror.Pos(end - 1, nextLine.length)
              };
            }
          }
        }
      };
    }
  ]);
  ;
}());
(function () {
  'use strict';
  angular.module('codeMirror', [
    'raml',
    'ramlEditorApp',
    'codeFolding'
  ]).factory('codeMirror', [
    'ramlHint',
    'codeMirrorHighLight',
    'eventService',
    'generateSpaces',
    'generateTabs',
    'getFoldRange',
    'isArrayStarter',
    'getSpaceCount',
    'getTabCount',
    'config',
    'extractKeyValue',
    function (ramlHint, codeMirrorHighLight, eventService, generateSpaces, generateTabs, getFoldRange, isArrayStarter, getSpaceCount, getTabCount, config, extractKeyValue) {
      var editor = null;
      var service = { CodeMirror: CodeMirror };
      service.removeTabs = function (line, indentUnit) {
        var spaceCount = getTabCount(getSpaceCount(line), indentUnit) * indentUnit;
        return spaceCount ? line.slice(spaceCount) : line;
      };
      service.tabKey = function (cm) {
        var cursor = cm.getCursor();
        var line = cm.getLine(cursor.line);
        var indentUnit = cm.getOption('indentUnit');
        var spaces;
        var result;
        var unitsToIndent;
        if (cm.somethingSelected()) {
          cm.indentSelection('add');
          return;
        }
        result = service.removeTabs(line, indentUnit);
        result = result.length ? result : '';
        // if in half/part of a tab, add the necessary spaces to complete the tab
        if (result !== '' && result.replace(/ /g, '') === '') {
          unitsToIndent = indentUnit - result.length;  // if not ident normally
        } else {
          unitsToIndent = indentUnit;
        }
        spaces = generateSpaces(unitsToIndent);
        cm.replaceSelection(spaces, 'end', '+input');
      };
      service.backspaceKey = function (cm) {
        var cursor = cm.getCursor();
        var line = cm.getLine(cursor.line).slice(0, cursor.ch);
        var indentUnit = cm.getOption('indentUnit');
        var spaceCount = line.length - line.trimRight().length;
        var lineEndsWithTab = spaceCount >= indentUnit;
        // delete indentation if there is at least one right before
        // the cursor and number of whitespaces is a multiple of indentUnit
        //
        // we do it for better user experience as if you had 3 whitespaces
        // before cursor and pressed Backspace, you'd expect cursor to stop
        // at second whitespace to continue typing RAML content, otherwise
        // you'd end up at first whitespace and be forced to hit Spacebar
        if (lineEndsWithTab && spaceCount % indentUnit === 0) {
          for (var i = 0; i < indentUnit; i++) {
            cm.deleteH(-1, 'char');
          }
          return;
        }
        cm.deleteH(-1, 'char');
      };
      var MODES = {
          xml: { name: 'xml' },
          xsd: {
            name: 'xml',
            alignCDATA: true
          },
          json: {
            name: 'javascript',
            json: true
          },
          md: { name: 'gfm' },
          raml: { name: 'raml' }
        };
      var defaultKeys = {
          'Cmd-S': 'save',
          'Ctrl-S': 'save',
          'Shift-Tab': 'indentLess',
          'Shift-Ctrl-T': 'toggleTheme'
        };
      var ramlKeys = {
          'Ctrl-Space': 'autocomplete',
          'Cmd-S': 'save',
          'Ctrl-S': 'save',
          'Shift-Tab': 'indentLess',
          'Shift-Ctrl-T': 'toggleTheme'
        };
      var autocomplete = function onChange(cm) {
        if (cm.getLine(cm.getCursor().line).trim()) {
          cm.execCommand('autocomplete');
        }
      };
      service.configureEditor = function (editor, extension) {
        var mode = MODES[extension] || MODES.raml;
        editor.setOption('mode', mode);
        if (mode.name === 'raml') {
          editor.setOption('extraKeys', ramlKeys);
          editor.on('change', autocomplete);
        } else {
          editor.setOption('extraKeys', defaultKeys);
          editor.off('change', autocomplete);
        }
      };
      service.enterKey = function (cm) {
        function getParent(lineNumber, spaceCount) {
          for (var i = lineNumber - 1; i >= 0; i--) {
            if (getSpaceCount(cm.getLine(i)) < spaceCount) {
              return extractKeyValue(cm.getLine(i)).key;
            }
          }
        }
        var cursor = cm.getCursor();
        var endOfLine = cursor.ch >= cm.getLine(cursor.line).length - 1;
        var line = cm.getLine(cursor.line).slice(0, cursor.ch);
        var lineStartsArray = isArrayStarter(line);
        var spaceCount = getSpaceCount(line);
        var spaces = generateSpaces(spaceCount);
        var parent = getParent(cursor.line, spaceCount);
        var traitOrType = [
            'traits',
            'resourceTypes'
          ].indexOf(parent) !== -1;
        if (endOfLine) {
          (function () {
            if (traitOrType) {
              spaces += generateTabs(2);
              return;
            } else if (lineStartsArray) {
              spaces += generateTabs(1);
            }
            if (line.trimRight().slice(-1) === '|') {
              spaces += generateTabs(1);
              return;
            }
            var nextLine = cm.getLine(cursor.line + 1);
            if (nextLine && getSpaceCount(nextLine) > spaceCount) {
              spaces += generateTabs(1);
            }
          }());
        } else {
          if (lineStartsArray) {
            spaces += generateTabs(1);
          }
        }
        cm.replaceSelection('\n' + spaces, 'end', '+input');
      };
      service.createEditor = function (el, extraOptions) {
        var shouldEnableFoldGutter = JSON.parse(config.get('folding', 'true'));
        var foldGutterConfig = false;
        var cm;
        var options;
        if (shouldEnableFoldGutter) {
          foldGutterConfig = {
            rangeFinder: CodeMirror.fold.indent,
            foldOnChangeTimeSpan: 300,
            updateViewportTimeSpan: 200
          };
        }
        options = {
          mode: 'raml',
          theme: 'solarized dark',
          lineNumbers: true,
          lineWrapping: true,
          autofocus: true,
          indentWithTabs: false,
          indentUnit: 2,
          tabSize: 2,
          keyMap: 'tabSpace',
          foldGutter: foldGutterConfig,
          gutters: [
            'CodeMirror-lint-markers',
            'CodeMirror-linenumbers',
            'CodeMirror-foldgutter'
          ]
        };
        if (extraOptions) {
          Object.keys(extraOptions).forEach(function (key) {
            options[key] = extraOptions[key];
          });
        }
        cm = new CodeMirror(el, options);
        cm.setSize('100%', '100%');
        cm.foldCode(0, { rangeFinder: CodeMirror.fold.indent });
        var charWidth = cm.defaultCharWidth();
        var basePadding = 4;
        cm.on('renderLine', function (cm, line, el) {
          var offset = CodeMirror.countColumn(line.text, null, cm.getOption('tabSize')) * charWidth;
          el.style.textIndent = '-' + offset + 'px';
          el.style.paddingLeft = basePadding + offset + 'px';
        });
        return cm;
      };
      service.initEditor = function () {
        var el = document.getElementById('code');
        var cm = service.createEditor(el);
        // for testing automation purposes
        editor = window.editor = cm;
        return cm;
      };
      service.getEditor = function () {
        return editor;
      };
      (function bootstrap() {
        CodeMirror.keyMap.tabSpace = {
          Tab: service.tabKey,
          Backspace: service.backspaceKey,
          Enter: service.enterKey,
          fallthrough: ['default']
        };
        CodeMirror.commands.save = function () {
          eventService.broadcast('event:save');
        };
        CodeMirror.commands.autocomplete = function (cm) {
          CodeMirror.showHint(cm, CodeMirror.hint.raml, { ghosting: true });
        };
        CodeMirror.commands.toggleTheme = function () {
          eventService.broadcast('event:toggle-theme');
        };
        CodeMirror.defineMode('raml', codeMirrorHighLight.highlight);
        CodeMirror.defineMIME('text/x-raml', 'raml');
        CodeMirror.registerHelper('hint', 'raml', ramlHint.autocompleteHelper);
        CodeMirror.registerHelper('fold', 'indent', getFoldRange);
      }());
      return service;
    }
  ]);
  ;
}());
(function () {
  'use strict';
  angular.module('codeMirror').factory('codeMirrorErrors', [
    'codeMirror',
    '$timeout',
    function (codeMirror, $timeout) {
      var CodeMirror = codeMirror.CodeMirror;
      var GUTTER_ID = 'CodeMirror-lint-markers';
      var SEVERITIES = /^(?:error|warning)$/;
      var service = {};
      function showTooltip(e, content) {
        var tt = document.createElement('div');
        tt.className = 'CodeMirror-lint-tooltip';
        tt.appendChild(content.cloneNode(true));
        document.body.appendChild(tt);
        function position(e) {
          if (!tt.parentNode) {
            return CodeMirror.off(document, 'mousemove', position);
          }
          tt.style.top = Math.max(0, e.clientY - tt.offsetHeight - 5) + 'px';
          tt.style.left = e.clientX + 5 + 'px';
        }
        CodeMirror.on(document, 'mousemove', position);
        position(e);
        if (tt.style.opacity !== null) {
          tt.style.opacity = 1;
        }
        return tt;
      }
      function rm(elt) {
        if (elt.parentNode) {
          elt.parentNode.removeChild(elt);
        }
      }
      function hideTooltip(tt) {
        if (!tt.parentNode) {
          return;
        }
        if (tt.style.opacity === null) {
          rm(tt);
        }
        tt.style.opacity = 0;
        $timeout(function () {
          rm(tt);
        }, 200);
      }
      function showTooltipFor(e, content, node) {
        var tooltip = showTooltip(e, content);
        function hide() {
          CodeMirror.off(node, 'mouseout', hide);
          if (tooltip) {
            hideTooltip(tooltip);
            tooltip = null;
          }
        }
        var poll = setInterval(function () {
            if (tooltip) {
              for (var n = node;; n = n.parentNode) {
                if (n === document.body) {
                  return;
                }
                if (!n) {
                  hide();
                  break;
                }
              }
            } else {
              return clearInterval(poll);
            }
          }, 400);
        CodeMirror.on(node, 'mouseout', hide);
      }
      function clearMarks(cm) {
        cm.clearGutter(GUTTER_ID);
      }
      function getMaxSeverity(a, b) {
        return a === 'error' ? a : b;
      }
      function groupByLine(annotations) {
        var lines = [];
        for (var i = 0; i < annotations.length; ++i) {
          var ann = annotations[i], line = ann.line;
          (lines[line] || (lines[line] = [])).push(ann);
        }
        return lines;
      }
      function annotationTooltip(ann) {
        var severity = ann.severity;
        if (!SEVERITIES.test(severity)) {
          severity = 'error';
        }
        var tip = document.createElement('div');
        tip.className = 'CodeMirror-lint-message-' + severity;
        tip.appendChild(document.createTextNode(ann.message));
        return tip;
      }
      function makeMarker(labels, severity, multiple, tooltips, annotations) {
        var marker = document.createElement('div');
        var inner = marker;
        marker.className = 'CodeMirror-lint-marker-' + severity;
        if (multiple) {
          inner = marker.appendChild(document.createElement('div'));
          inner.className = 'CodeMirror-lint-marker-multiple';
        }
        if (tooltips !== false) {
          CodeMirror.on(inner, 'mouseover', function (e) {
            showTooltipFor(e, labels, inner);
          });
        }
        //For testing automation purposes
        marker.setAttribute('data-marker-line', annotations[0].line);
        marker.setAttribute('data-marker-message', annotations[0].message);
        return marker;
      }
      service.displayAnnotations = function (annotationsNotSorted) {
        var editor = codeMirror.getEditor();
        var annotations = groupByLine(annotationsNotSorted);
        this.clearAnnotations();
        for (var line = 0; line < annotations.length; ++line) {
          var anns = annotations[line];
          if (!anns) {
            continue;
          }
          var maxSeverity = null;
          var tipLabel = document.createDocumentFragment();
          for (var i = 0; i < anns.length; ++i) {
            var ann = anns[i];
            var severity = ann.severity;
            if (!SEVERITIES.test(severity)) {
              severity = 'error';
            }
            maxSeverity = getMaxSeverity(maxSeverity, severity);
            tipLabel.appendChild(annotationTooltip(ann));
          }
          editor.setGutterMarker(line - 1, GUTTER_ID, makeMarker(tipLabel, maxSeverity, anns.length > 1, true, anns));
        }
      };
      service.clearAnnotations = function () {
        var editor = codeMirror.getEditor();
        clearMarks(editor);
      };
      return service;
    }
  ]);
  ;
}());
(function () {
  'use strict';
  var module;
  try {
    module = angular.module('helpers');
  } catch (e) {
    module = angular.module('helpers', []);
  }
  module.factory('eventService', [
    '$rootScope',
    '$timeout',
    function ($rootScope, $timeout) {
      var service = {};
      var lastEvents = {};
      service.broadcast = function broadcast(eventName, data) {
        $rootScope.$broadcast(eventName, data);
        lastEvents[eventName] = { data: data };
      };
      service.on = function on(eventName, handler) {
        $rootScope.$on(eventName, handler);
        if (lastEvents[eventName] && handler) {
          $timeout(function () {
            handler({}, lastEvents[eventName].data);
          });
        }
      };
      return service;
    }
  ]);
  ;
}());
(function () {
  'use strict';
  angular.module('ramlEditorApp').factory('getNeighborLines', [
    'getLineIndent',
    'isArrayStarter',
    function (getLineIndent, isArrayStarter) {
      return function (editor, lineNumber) {
        if (typeof lineNumber !== 'number') {
          lineNumber = editor.getCursor().line;
        }
        var lineNumbers = [lineNumber];
        var line = editor.getLine(lineNumber).slice(0, editor.getCursor().ch + 1);
        var lineIndent = getLineIndent(line);
        var lineIsArray = isArrayStarter(line);
        var linesCount = editor.lineCount();
        var i;
        var nextLine;
        var nextLineIndent;
        // lines above specified
        for (i = lineNumber - 1; i >= 0; i--) {
          nextLine = editor.getLine(i);
          nextLineIndent = getLineIndent(nextLine);
          if (nextLineIndent.tabCount !== lineIndent.tabCount) {
            // level is decreasing, no way we can get back
            if (nextLineIndent.tabCount < lineIndent.tabCount) {
              if (!lineIsArray && isArrayStarter(nextLine) && nextLineIndent.tabCount + 1 === lineIndent.tabCount) {
                lineNumbers.push(i);
              }
              break;
            }
            // level is increasing, but we still can get back
            continue;
          } else if (isArrayStarter(nextLine)) {
            break;
          }
          lineNumbers.push(i);
        }
        // lines below specified
        for (i = lineNumber + 1; i < linesCount; i++) {
          nextLine = editor.getLine(i);
          nextLineIndent = getLineIndent(nextLine);
          if (nextLineIndent.tabCount !== lineIndent.tabCount) {
            // level is decreasing, no way we can get back
            if (nextLineIndent.tabCount < lineIndent.tabCount) {
              break;
            }
            if (!lineIsArray || nextLineIndent.tabCount !== lineIndent.tabCount + 1) {
              // level is increasing, but we still can get back
              continue;
            }
          } else if (isArrayStarter(nextLine)) {
            break;
          }
          lineNumbers.push(i);
        }
        return lineNumbers.sort().map(function (lineNumber) {
          return editor.getLine(lineNumber);
        });
      };
    }
  ]).factory('getNeighborKeys', [
    'getNeighborLines',
    'extractKeyValue',
    function (getNeighborLines, extractKeyValue) {
      return function (editor) {
        return getNeighborLines(editor).map(function (line) {
          return extractKeyValue(line).key;
        });
      };
    }
  ]).factory('ramlHint', [
    'generateTabs',
    'getNeighborKeys',
    'getTabCount',
    'getScopes',
    'getEditorTextAsArrayOfLines',
    'getNode',
    function ramlHintFactory(generateTabs, getNeighborKeys, getTabCount, getScopes, getEditorTextAsArrayOfLines, getNode) {
      var hinter = {};
      var RAML_VERSION = '#%RAML 0.8';
      var RAML_VERSION_PATTERN = new RegExp('^\\s*' + RAML_VERSION + '\\s*$', 'i');
      hinter.suggestRAML = RAML.Grammar.suggestRAML;
      hinter.getScopes = function (editor) {
        return getScopes(getEditorTextAsArrayOfLines(editor));
      };
      hinter.shouldSuggestVersion = function (editor) {
        var lineNumber = editor.getCursor().line;
        var line = editor.getLine(lineNumber);
        var lineIsVersion = RAML_VERSION_PATTERN.test(line);
        return lineNumber === 0 && !lineIsVersion;
        ;
      };
      /**
       * @param suggestionKey The key to consider suggestion to the user
       * @param suggestion The suggestion metadata for the key
       * @param nodes The nodes to check for the suggestion
       * @returns {boolean} Whether the suggestion is in use
       */
      hinter.isSuggestionInUse = function (suggestionKey, suggestion, nodes) {
        var values = suggestion.metadata.isText ? nodes.map(function (node) {
            return node.getValue() ? node.getValue().text : null;
          }) : nodes.map(function (node) {
            return node.getKey();
          });
        return values.indexOf(suggestionKey) !== -1 || !suggestion.metadata.isText && suggestion.metadata.canBeOptional && values.indexOf(suggestionKey + '?') !== -1;
      };
      /**
       * @param editor The RAML editor
       * @returns {{key, metadata {category, isText}}} Where keys are the RAML node names, and metadata
       *          contains extra information about the node, such as its category
       */
      hinter.getSuggestions = function getSuggestions(editor) {
        if (hinter.shouldSuggestVersion(editor)) {
          return [{
              key: '#%RAML 0.8',
              metadata: {
                category: 'main',
                isText: true
              }
            }];
        }
        //Pivotal 61664576: We use the DOM API to check to see if the current node or any
        //of its parents contains a YAML reference. If it does, then we provide no suggestions.
        var node = getNode(editor);
        var refNode = node.selfOrParent(function (node) {
            return node.getValue() && node.getValue().isReference;
          });
        if (refNode) {
          return [];
        }
        //Designer policy: If the cursor is at an empty line, then we
        //provide shelf contents based on the node only. If the cursor is
        //on a non-structural line, such as an empty line, then we provide
        //shelf contents based on the tab level of the node.
        if (node.isEmpty) {
          var ch = editor.getCursor().ch;
          var cursorTabCount = getTabCount(ch);
          if (cursorTabCount <= node.lineIndent.tabCount) {
            var atTabBoundary = ch % editor.getOption('indentUnit') === 0;
            if (!atTabBoundary) {
              return [];
            }
          }
          cursorTabCount = Math.min(cursorTabCount, node.lineIndent.tabCount);
          node = node.selfOrParent(function (node) {
            return node.lineIndent.tabCount === cursorTabCount;
          });
        }
        var raml = null;
        var suggestions = [];
        var peerNodes = [];
        if (node) {
          var path = node.getPath().map(function (node) {
              return node.getKey();
            });
          raml = hinter.suggestRAML(path);
          suggestions = raml.suggestions;
          var isText = Object.keys(suggestions).some(function (suggestion) {
              return suggestions[suggestion].metadata.isText;
            });
          //Get all structural nodes' keys/values so we can filter them out. This bit is tricky; if
          //we are in an array, and the elements of that array are text, then the peer group is
          //every array in the parent. Otherwise, the peer group is every key in the current array.
          var isTextNodeList = raml.metadata && raml.metadata.isList && isText;
          peerNodes = isTextNodeList ? node.getParent().getChildren() : node.getSelfAndNeighbors();
          peerNodes = peerNodes.filter(function (node) {
            return node.isStructural;
          });
        }
        //Next, filter out the keys from the returned suggestions
        suggestions = Object.keys(suggestions).filter(function (key) {
          return !hinter.isSuggestionInUse(key, suggestions[key], peerNodes);
        }).sort().map(function (key) {
          return {
            key: key,
            metadata: suggestions[key].metadata
          };
        });
        //Pull out display-relevant metadata
        suggestions.isList = raml && raml.metadata ? raml.metadata.isList : false;
        return suggestions;
      };
      hinter.canAutocomplete = function (cm) {
        var cursor = cm.getCursor();
        var curLine = cm.getLine(cursor.line);
        var curLineTrimmed = curLine.trim();
        var offset = curLine.indexOf(curLineTrimmed);
        var lineNumber = cursor.line;
        // nothing to autocomplete within comments
        // -> "#..."
        if (function () {
            var indexOf = curLineTrimmed.indexOf('#');
            return lineNumber > 0 && indexOf !== -1 && cursor.ch > indexOf + offset;
            ;
          }()) {
          return false;
        }
        // nothing to autocomplete within resources
        // -> "/..."
        if (function () {
            var indexOf = curLineTrimmed.indexOf('/');
            return indexOf === 0 && cursor.ch >= indexOf + offset;
            ;
          }()) {
          return false;
        }
        // nothing to autocomplete for key value
        // -> "key: ..."
        if (function () {
            var indexOf = curLineTrimmed.indexOf(': ');
            return indexOf !== -1 && cursor.ch >= indexOf + offset + 2;
            ;
          }()) {
          return false;
        }
        // nothing to autocomplete prior array
        // -> "...- "
        if (function () {
            var indexOf = curLineTrimmed.indexOf('- ');
            return indexOf === 0 && cursor.ch < indexOf + offset;
            ;
          }()) {
          return false;
        }
        return true;
      };
      hinter.autocompleteHelper = function (cm) {
        var cursor = cm.getCursor();
        var line = cm.getLine(cursor.line);
        var word = line.trimLeft();
        var wordIsKey;
        var suggestions;
        var list;
        var fromCh;
        var toCh;
        var render = function (element, self, data) {
          element.innerHTML = [
            '<div>',
            data.displayText,
            '</div>',
            '<div class="category">',
            data.category,
            '</div>'
          ].join('');
        };
        if (hinter.canAutocomplete(cm)) {
          suggestions = hinter.getSuggestions(cm);
        } else {
          return;
        }
        // handle comment (except RAML tag)
        (function () {
          var indexOf = word.indexOf('#');
          if (indexOf !== -1) {
            if (cursor.line !== 0 || indexOf !== 0) {
              word = word.slice(0, indexOf);
            }
          }
        }());
        // handle array
        if (word.indexOf('- ') === 0) {
          word = word.slice(2);
        }
        // handle map and extract key
        (function () {
          var match = word.match(/:(?:\s|$)/);
          if (match) {
            word = word.slice(0, match.index);
            wordIsKey = true;
          }
        }());
        function notDynamic(suggestion) {
          return !suggestion.metadata.dynamic;
        }
        word = word.trim();
        list = suggestions.filter(notDynamic).map(function (suggestion) {
          var text = suggestion.key;
          if (!suggestion.metadata.isText && !wordIsKey) {
            text = text + ':';
          }
          return {
            displayText: text,
            text: text,
            category: suggestion.metadata.category,
            render: render
          };
        });
        if (word) {
          list = list.filter(function (e) {
            return e.text.indexOf(word) === 0 && e.text.length !== word.length;
            ;
          });
        }
        if (word) {
          fromCh = line.indexOf(word);
          toCh = fromCh + word.length;
        } else {
          fromCh = cursor.ch;
          toCh = fromCh;
        }
        return {
          word: word,
          list: list,
          from: CodeMirror.Pos(cursor.line, fromCh),
          to: CodeMirror.Pos(cursor.line, toCh)
        };
      };
      return hinter;
    }
  ]);
  ;
}());
(function () {
  'use strict';
  angular.module('raml').value('snippets', {
    options: [
      'options:',
      '  description: <<insert text or markdown here>>'
    ],
    head: [
      'head:',
      '  description: <<insert text or markdown here>>'
    ],
    get: [
      'get:',
      '  description: <<insert text or markdown here>>'
    ],
    post: [
      'post:',
      '  description: <<insert text or markdown here>>'
    ],
    put: [
      'put:',
      '  description: <<insert text or markdown here>>'
    ],
    delete: [
      'delete:',
      '  description: <<insert text or markdown here>>'
    ],
    trace: [
      'trace:',
      '  description: <<insert text or markdown here>>'
    ],
    connect: [
      'connect:',
      '  description: <<insert text or markdown here>>'
    ],
    patch: [
      'patch:',
      '  description: <<insert text or markdown here>>'
    ],
    '<resource>': [
      '/newResource:',
      '  displayName: resourceName'
    ],
    title: ['title: My API'],
    version: ['version: v0.1'],
    baseuri: ['baseUri: http://server/api/{version}']
  }).factory('ramlSnippets', [
    'snippets',
    function (snippets) {
      var service = {};
      service.getEmptyRaml = function () {
        return [
          '#%RAML 0.8',
          'title:'
        ].join('\n');
      };
      service.getSnippet = function getSnippet(suggestion) {
        var key = suggestion.key;
        var metadata = suggestion.metadata || {};
        var snippet = snippets[key.toLowerCase()];
        if (snippet) {
          return snippet;
        }
        if (metadata.isText) {
          //For text elements that are part of an array
          //we do not add an empty line break:
          return suggestion.isList ? [key] : [
            key,
            ''
          ];
        }
        return [key + ':'];
      };
      return service;
    }
  ]);
  ;
}());
(function () {
  'use strict';
  angular.module('codeMirror').value('highlightRootElement', function (name, titleClass, contentClass, state, level, key) {
    // Using one level of nesting nest (ie. [name + '.level']) instead of
    // [name].level to use default copy state function.
    if (level <= state[name + '.level']) {
      state[name + '.level'] = 0;
      state[name + '.inside'] = false;
    }
    if (name.indexOf(key) >= 0) {
      state[name + '.level'] = level;
      state[name + '.inside'] = true;
      return titleClass;
    }
    if (state[name + '.inside']) {
      return contentClass;
    }
    return false;
  }).value('booleanValues', [
    'true',
    'false'
  ]).factory('keywordRegex', [
    'booleanValues',
    function (booleanValues) {
      return new RegExp('\\b((' + booleanValues.join(')|(') + '))$', 'i');
    }
  ]).factory('token', [
    'keywordRegex',
    'highlightRootElement',
    'getLineIndent',
    'indentUnit',
    function (keywordRegex, highlightRootElement, getLineIndent, indentUnit) {
      return function (stream, state) {
        var ch = stream.peek();
        var esc = state.escaped;
        state.escaped = false;
        /* RAML tag */
        if (ch === '#' && stream.string.trim() === '#%RAML 0.8') {
          stream.skipToEnd();
          return 'raml-tag';
        }
        /* comments */
        if (ch === '#' && (stream.pos === 0 || /\s/.test(stream.string.charAt(stream.pos - 1)))) {
          stream.skipToEnd();
          return 'comment';
        }
        if (state.literal && stream.indentation() > state.keyCol) {
          stream.skipToEnd();
          return 'none';
        } else if (state.literal) {
          state.literal = false;
        }
        if (stream.sol()) {
          state.keyCol = 0;
          state.pair = false;
          state.pairStart = false;
          /* document start */
          if (stream.match(/---/)) {
            return 'def';
          }
          /* document end */
          if (stream.match(/\.\.\./)) {
            return 'def';
          }
          /* array list item */
          if (stream.match(/\s*-\s+/)) {
            return 'meta';
          }
        }
        /* pairs (associative arrays) -> key */
        if (!state.pair && stream.match(/^\s*([a-z0-9\?\/\{\}\._\-])+(?=\s*:)/i)) {
          var key = stream.string.replace(/^\s+|\s+$/g, '').split(':')[0];
          var sanitizedKey = key.slice(-1) === '?' ? key.slice(0, -1) : key;
          var level = getLineIndent(stream.string).tabCount;
          state.pair = true;
          state.keyCol = stream.indentation();
          if (stream.string.match(/^\s*\- /i)) {
            state.keyCol += indentUnit;
          }
          /* methods */
          if (level <= state.methodLevel || key.indexOf('/') === 0) {
            state.methodLevel = 0;
            state.insideMethod = false;
          }
          if ([
              'options',
              'get',
              'head',
              'post',
              'put',
              'delete',
              'trace',
              'connect',
              'patch'
            ].indexOf(sanitizedKey) !== -1) {
            state.methodLevel = level;
            state.insideMethod = true;
            return 'method-title';
          }
          if (state.insideMethod) {
            return 'method-content';
          }
          var rootElements = highlightRootElement('traits', 'trait-title', 'trait-content', state, level, key) || highlightRootElement('resourceTypes', 'resource-type-title', 'resource-type-content', state, level, key) || highlightRootElement('schemas', 'schema-title', 'schema-content', state, level, key) || highlightRootElement('securitySchemes', 'security-scheme-title', 'security-scheme-content', state, level, key);
          if (rootElements) {
            return rootElements;
          }
          /* resources */
          if (key.indexOf('/') === 0) {
            return 'resource';
          }
          return 'key';
        }
        if (state.pair && stream.match(/^:\s*/)) {
          state.pairStart = true;
          return 'meta';
        }
        /* inline pairs/lists */
        if (stream.match(/^(\{|\}|\[|\])/)) {
          if (ch === '{') {
            state.inlinePairs++;
          } else if (ch === '}') {
            state.inlinePairs--;
          } else if (ch === '[') {
            state.inlineList++;
          } else {
            state.inlineList--;
          }
          return 'meta';
        }
        /* list seperator */
        if (state.inlineList > 0 && !esc && ch === ',') {
          stream.next();
          return 'meta';
        }
        /* pairs seperator */
        if (state.inlinePairs > 0 && !esc && ch === ',') {
          state.keyCol = 0;
          state.pair = false;
          state.pairStart = false;
          stream.next();
          return 'meta';
        }
        /* start of value of a pair */
        if (state.pairStart) {
          /* block literals */
          if (stream.match(/^\s*(\||\>)\s*/)) {
            state.literal = true;
            return 'meta';
          }
          /* references */
          if (stream.match(/^\s*(\&|\*)[a-z0-9\._\-]+\b/i)) {
            return 'variable-2';
          }
          /* numbers */
          if (state.inlinePairs === 0 && stream.match(/^\s*-?[0-9\.\,]+\s?$/)) {
            return 'number';
          }
          if (state.inlinePairs > 0 && stream.match(/^\s*-?[0-9\.\,]+\s?(?=(,|\}))/)) {
            return 'number';
          }
          /* keywords */
          if (stream.match(keywordRegex)) {
            return 'keyword';
          }
        }
        /* nothing found, continue */
        state.pairStart = false;
        state.escaped = ch === '\\';
        stream.next();
        return null;
      };
    }
  ]).value('startState', function () {
    return {
      pair: false,
      pairStart: false,
      keyCol: 0,
      inlinePairs: 0,
      inlineList: 0,
      literal: false,
      escaped: false
    };
  }).factory('yamlMode', [
    'token',
    'startState',
    function (token, startState) {
      return function () {
        return {
          token: token,
          startState: startState
        };
      };
    }
  ]).run([
    'codeMirror',
    'yamlMode',
    function (codeMirror, yamlMode) {
      var CodeMirror = codeMirror.CodeMirror;
      CodeMirror.defineMode('yaml', yamlMode);
      CodeMirror.defineMIME('text/x-yaml', 'yaml');
    }
  ]);
  ;
}());
(function () {
  'use strict';
  angular.module('codeMirror').factory('codeMirrorHighLight', [
    'indentUnit',
    function (indentUnit) {
      var mode = {};
      mode.highlight = function highlight(config) {
        mode.indentationOverlay = {
          token: function token(stream, state) {
            if (state.cutoff === undefined || stream.column() <= state.cutoff) {
              if (stream.match('  ')) {
                return 'indent indent-col-' + stream.column();
              } else if (stream.match(' ')) {
                return 'indent-incomplete';
              }
            }
            stream.skipToEnd();
          },
          startState: function startState() {
            return {};
          }
        };
        mode.yaml = CodeMirror.overlayMode(CodeMirror.getMode(config, 'yaml'), mode.indentationOverlay);
        mode.xml = CodeMirror.overlayMode(CodeMirror.getMode(config, 'xml'), mode.indentationOverlay);
        mode.json = CodeMirror.overlayMode(CodeMirror.getMode(config, {
          name: 'javascript',
          json: true
        }), mode.indentationOverlay);
        mode.markdown = CodeMirror.overlayMode(CodeMirror.getMode(config, 'gfm'), mode.indentationOverlay);
        return {
          startState: function startState() {
            return {
              token: mode._yaml,
              localMode: null,
              localState: null,
              yamlState: mode.yaml.startState()
            };
          },
          copyState: function copyState(state) {
            var local;
            if (state.localState) {
              local = CodeMirror.copyState(state.localMode, state.localState);
              if (!local.parentIndentation) {
                local.parentIndentation = state.localState.parentIndentation;
              }
            }
            return {
              token: state.token,
              localMode: state.localMode,
              localState: local,
              yamlState: CodeMirror.copyState(mode.yaml, state.yamlState)
            };
          },
          innerMode: function innerMode(state) {
            return {
              state: state.localState || state.yamlState,
              mode: state.localMode || mode.yaml
            };
          },
          token: function token(stream, state) {
            return state.token(stream, state);
          }
        };
      };
      mode._yaml = function (stream, state) {
        if (/(content|description):(\s?)\|/.test(stream.string)) {
          mode._setMode('markdown', stream, state);
        }
        if (/application\/json:/.test(stream.string)) {
          mode._setMode('json', stream, state, 2);
        }
        if (/text\/xml:/.test(stream.string)) {
          mode._setMode('xml', stream, state, 2);
        }
        return mode.yaml.token(stream, state.yamlState);
      };
      mode._xml = function (stream, state) {
        return mode._applyMode('xml', stream, state);
      };
      mode._json = function (stream, state) {
        return mode._applyMode('json', stream, state);
      };
      mode._markdown = function (stream, state) {
        return mode._applyMode('markdown', stream, state);
      };
      mode._setMode = function (modeName, stream, state, indent) {
        state.token = mode['_' + modeName];
        state.localMode = mode[modeName];
        state.localState = mode[modeName].startState();
        state.localState.parentIndentation = stream.indentation() + (indent || 0);
        if (stream.string.match(/^\s*\- /i)) {
          state.localState.parentIndentation += indentUnit;
        }
        if (modeName === 'markdown') {
          state.localState.base.parentIndentation = state.localState.parentIndentation;
        }
      };
      mode._applyMode = function (modeName, stream, state) {
        if (/(schema|example):(\s?)\|/.test(stream.string)) {
          return mode._yaml(stream, state);
        }
        if (stream.string.trim().length > 0 && stream.indentation() <= state.localState.parentIndentation) {
          state.token = mode._yaml;
          state.localState = state.localMode = null;
          return mode._yaml(stream, state);
        }
        state.localState.overlay.cutoff = state.localState.parentIndentation;
        return mode[modeName].token(stream, state.localState);
      };
      return mode;
    }
  ]);
  ;
}());
(function () {
  'use strict';
  function RamlFile(path, contents, options) {
    options = options || {};
    // remove the trailing slash to path if it exists
    if (path.slice(-1) === '/' && path.length > 1) {
      path = path.slice(0, -1);
    }
    this.type = 'file';
    this.path = path;
    this.name = path.slice(path.lastIndexOf('/') + 1);
    this.isDirectory = false;
    // extract extension
    if (this.name.lastIndexOf('.') > 0) {
      this.extension = this.name.slice(this.name.lastIndexOf('.') + 1);
    }
    this.contents = contents || '';
    this.persisted = options.persisted || false;
    this.dirty = options.dirty || !this.persisted;
    this.root = options.root;
  }
  angular.module('fs', [
    'ngCookies',
    'raml',
    'utils'
  ]).factory('ramlRepository', [
    '$q',
    '$rootScope',
    'ramlSnippets',
    'fileSystem',
    function ($q, $rootScope, ramlSnippets, fileSystem) {
      var service = {};
      var defaultPath = '/';
      var pathToRamlObject = {};
      service.supportsFolders = fileSystem.supportsFolders || false;
      function notMetaFile(file) {
        return file.path.slice(-5) !== '.meta';
      }
      function handleErrorFor(file) {
        return function markFileWithError(error) {
          file.error = error;
          throw error;
        };
      }
      /**
        * Function used to compare two ramlFile/ramlDirectory.
        * Sorting policy:
        * - Directories comes before files
        * - Sort file/directories alphabetically
        *
        * @returns {Integer} If the returned value is less than 0, sort a to a lower index than b, vice versa
        */
      function sortingFunction(a, b) {
        if (a.isDirectory === b.isDirectory) {
          return a.name.localeCompare(b.name);
        } else {
          return a.isDirectory ? -1 : 1;
        }
      }
      // Find the index to insert a object into a sorted array.
      function findInsertIndex(source, dest) {
        var low = 0, high = dest.children.length - 1, mid;
        while (high >= low) {
          mid = Math.floor((low + high) / 2);
          if (sortingFunction(dest.children[mid], source) > 0) {
            high = mid - 1;
          } else {
            low = mid + 1;
          }
        }
        return low;
      }
      // this function takes a parent(ramlDirectory) and a name(String) as input
      // and returns the full path(String)
      function generatePath(parent, name) {
        if (parent.path === '/') {
          return '/' + name;
        } else {
          return parent.path + '/' + name;
        }
      }
      // this function takes a target(ramlFile/ramlDirectory) and a name(String) as input
      // and returns the new path(String) after renaming the target
      function generateNewName(target, newName) {
        var parentPath = target.path.slice(0, target.path.lastIndexOf('/'));
        return parentPath + '/' + newName;
      }
      function RamlDirectory(path, meta, contents) {
        // remove the trailing slash to path if it exists
        if (path.slice(-1) === '/' && path.length > 1) {
          path = path.slice(0, -1);
        }
        contents = contents || [];
        this.type = 'directory';
        this.path = path;
        this.name = path.slice(path.lastIndexOf('/') + 1);
        this.meta = meta;
        this.collapsed = true;
        this.isDirectory = true;
        var separated = {
            folder: [],
            file: []
          };
        contents.forEach(function (entry) {
          separated[entry.type || 'file'].push(entry);
        });
        var files = separated.file.filter(notMetaFile).map(function (file) {
            return new RamlFile(file.path, file.contents, {
              dirty: false,
              persisted: true,
              root: file.root
            });
          });
        var directories = separated.folder.map(function (directory) {
            return new RamlDirectory(directory.path, directory.meta, directory.children);
          });
        this.children = directories.concat(files).sort(sortingFunction);
      }
      RamlDirectory.prototype.getDirectories = function getDirectories() {
        return this.children.filter(function (t) {
          return t.isDirectory;
        });
      };
      RamlDirectory.prototype.getFiles = function getFiles() {
        return this.children.filter(function (t) {
          return !t.isDirectory;
        });
      };
      RamlDirectory.prototype.forEachChildDo = function forEachChildDo(action) {
        // BFS
        var queue = this.children.slice();
        var current;
        while (queue.length > 0) {
          current = queue.shift();
          if (current.isDirectory) {
            queue = queue.concat(current.children);
          }
          action.apply(current, [current]);
        }
      };
      RamlDirectory.prototype.hasChildren = function hasChildren(child) {
        var childParentPath = child.path.slice(0, child.path.lastIndexOf('/'));
        if (childParentPath.length === 0) {
          childParentPath = '/';
        }
        return childParentPath.length >= this.path.length && this.path === childParentPath.slice(0, this.path.length);
      };
      RamlDirectory.prototype.sortChildren = function sortChildren() {
        this.children.sort(sortingFunction);
      };
      // Expose the sorting function, read-only
      service.sortingFunction = function () {
        return sortingFunction;
      }();
      // Returns the parent directory object of a file or a directory
      service.getParent = function getParent(target) {
        var path = target.path.slice(0, target.path.lastIndexOf('/'));
        if (path.length === 0) {
          path = '/';
        }
        return service.getByPath(path);
      };
      service.canExport = function canExport() {
        return fileSystem.hasOwnProperty('exportFiles');
      };
      service.exportFiles = function exportFiles() {
        return fileSystem.exportFiles();
      };
      service.createDirectory = function createDirectory(parent, name) {
        var path = generatePath(parent, name);
        var directory = new RamlDirectory(path);
        var index = findInsertIndex(directory, parent);
        // insert into the right position
        parent.children.splice(index, 0, directory);
        return fileSystem.createFolder(directory.path).then(function () {
          $rootScope.$broadcast('event:raml-editor-directory-created', directory);
          return directory;
        });
      };
      // Loads the directory from the fileSystem into memory
      service.loadDirectory = function loadDirectory(path) {
        path = path || defaultPath;
        // clean up the pathToRamlObject mapping
        pathToRamlObject = {};
        return fileSystem.directory(path).then(function (directory) {
          pathToRamlObject[path] = new RamlDirectory(directory.path, directory.meta, directory.children);
          return pathToRamlObject[path];
        });
      };
      service.removeDirectory = function removeDirectory(directory) {
        // recursively remove all the child directory and files
        // and collect all promises into an array
        var promises = [];
        directory.getDirectories().forEach(function (dir) {
          promises.push(service.removeDirectory(dir));
        });
        directory.getFiles().forEach(function (file) {
          promises.push(service.removeFile(file));
        });
        // remove this directory object from parent's children list
        var parent = service.getParent(directory);
        var index = parent.children.indexOf(directory);
        if (index !== -1) {
          parent.children.splice(index, 1);
        }
        // make sure all children is removed from FS before we remove ourselves
        return $q.all(promises).then(function () {
          return fileSystem.remove(directory.path);
        }).then(function (directory) {
          $rootScope.$broadcast('event:raml-editor-directory-removed', directory);
        });
      };
      service.renameDirectory = function renameDirectory(directory, newName) {
        var newPath = generateNewName(directory, newName);
        var promise = fileSystem.rename(directory.path, newPath);
        // renames the path of each child under the current directory
        directory.forEachChildDo(function (c) {
          c.path = c.path.replace(directory.path, newPath);
        });
        return promise.then(function () {
          directory.name = newName;
          directory.path = newPath;
          $rootScope.$broadcast('event:raml-editor-filetree-modified', directory);
          return directory;
        }, handleErrorFor(directory));
      };
      service.saveFile = function saveFile(file) {
        function modifyFile() {
          file.dirty = false;
          file.persisted = true;
          return file;
        }
        return fileSystem.save(file.path, file.contents).then(modifyFile, handleErrorFor(file));
      };
      service.renameFile = function renameFile(file, newName) {
        var newPath = generateNewName(file, newName);
        var promise = file.persisted ? fileSystem.rename(file.path, newPath) : $q.when(file);
        function modifyFile() {
          file.name = newName;
          file.path = newPath;
          $rootScope.$broadcast('event:raml-editor-filetree-modified', file);
          return file;
        }
        return promise.then(modifyFile, handleErrorFor(file));
      };
      service.loadFile = function loadFile(file) {
        function modifyFile(data) {
          file.dirty = false;
          file.persisted = true;
          file.loaded = true;
          file.contents = data;
          return file;
        }
        return fileSystem.load(file.path).then(modifyFile, handleErrorFor(file));
        ;
      };
      service.removeFile = function removeFile(file) {
        var promise;
        var parent = service.getParent(file);
        function modifyFile() {
          file.dirty = false;
          file.persisted = false;
          return Object.freeze(file);
        }
        // call to file system only when file is persisted
        // otherwise it's unknown because it's never been saved
        if (file.persisted) {
          promise = fileSystem.remove(file.path);
        } else {
          promise = $q.when(file);
        }
        return promise.then(modifyFile, handleErrorFor(file)).then(function () {
          // remove the file object from the parent's children list
          var index = parent.children.indexOf(file);
          if (index !== -1) {
            parent.children.splice(index, 1);
          }
          $rootScope.$broadcast('event:raml-editor-file-removed', file);
        });
      };
      service.createFile = function createFile(parent, name) {
        var path = generatePath(parent, name);
        var file = new RamlFile(path);
        var index = findInsertIndex(file, parent);
        // insert into the right position
        parent.children.splice(index, 0, file);
        if (file.extension === 'raml') {
          file.contents = ramlSnippets.getEmptyRaml();
        }
        $rootScope.$broadcast('event:raml-editor-file-created', file);
        return file;
      };
      // Gets the ramlDirectory/ramlFile object by path from the memory
      service.getByPath = function getByPath(path) {
        // remove the trailing '/' in path
        if (path.slice(-1) === '/' && path !== '/') {
          path = path.slice(0, -1);
        }
        // If the entry is already in the cache, return it directly
        if (pathToRamlObject.hasOwnProperty(path)) {
          return pathToRamlObject[path];
        }
        // If the path we're looking for is not in 'pathToRamlObject'
        // we search for it in the tree using BFS
        var queue = pathToRamlObject['/'].children.slice();
        var current;
        while (queue.length) {
          current = queue.shift();
          if (current.path === path) {
            pathToRamlObject[path] = current;
            return current;
          } else if (current.isDirectory) {
            queue = queue.concat(current.children);
          }
        }
        return void 0;
      };
      service.rename = function rename(target, newName) {
        return target.isDirectory ? service.renameDirectory(target, newName) : service.renameFile(target, newName);
      };
      service.remove = function remove(target) {
        return target.isDirectory ? service.removeDirectory(target) : service.removeFile(target);
      };
      // move a file or directory to a specific destination
      // destination must be a ramlDirectory
      service.move = function move(target, destination) {
        if (!destination.isDirectory) {
          return;
        }
        var newPath = generatePath(destination, target.name);
        var promise;
        if (target.isDirectory) {
          promise = fileSystem.rename(target.path, newPath);
          // renames the path of each child under the current directory
          target.forEachChildDo(function (c) {
            c.path = c.path.replace(target.path, newPath);
          });
        } else {
          promise = target.persisted ? fileSystem.rename(target.path, newPath) : $q.when(target);
        }
        return promise.then(function () {
          target.path = newPath;
          return target;
        }, handleErrorFor(target));
      };
      service.saveMeta = function saveMeta(file, meta) {
        var metaFile = new RamlFile(file.path + '.meta', JSON.stringify(meta));
        return service.saveFile(metaFile).then(function () {
          return meta;
        });
        ;
      };
      service.loadMeta = function loadMeta(file) {
        var metaFile = new RamlFile(file.path + '.meta');
        return service.loadFile(metaFile).then(function success(file) {
          return JSON.parse(file.contents);
        }, function failure() {
          return {};
        });
      };
      return service;
    }
  ]);
  ;
}());
(function () {
  'use strict';
  function FileSystem() {
  }
  FileSystem.prototype = {
    directory: function (fullpath) {
      throw 'Not implemented: FileSystem list invoked with [fullpath=' + fullpath + ']';
    },
    save: function (fullpath, content) {
      throw 'Not implemented: FileSystem save invoked with [fullpath=' + fullpath + '] and [content=' + content + ']';
    },
    createFolder: function (fullpath) {
      throw 'Not implemented: FileSystem createFolder invoked with [fullpath=' + fullpath + ']';
    },
    load: function (fullpath) {
      throw 'Not implemented: FileSystem load invoked with [fullpath=' + fullpath + ']';
    },
    remove: function (fullpath) {
      throw 'Not implemented: FileSystem remove invoked with [fullpath=' + fullpath + ']';
    },
    rename: function (source, destination) {
      throw 'Not implemented: FileSystem rename invoked with [source=' + source + '] and [destination=' + destination + ']';
    }
  };
  angular.module('fs').factory('fileSystem', [
    '$injector',
    'config',
    function ($injector, config) {
      var fsFactory = config.get('fsFactory');
      var hasFsFactory = fsFactory && $injector.has(fsFactory);
      if (!hasFsFactory) {
        config.set('fsFactory', fsFactory = 'localStorageFileSystem');
      }
      return $injector.get(fsFactory);
    }
  ]);
  ;
}());
(function () {
  'use strict';
  angular.module('fs').constant('LOCAL_PERSISTENCE_KEY', 'localStorageFilePersistence').constant('FOLDER', 'folder').factory('localStorageHelper', [
    'LOCAL_PERSISTENCE_KEY',
    function (LOCAL_PERSISTENCE_KEY) {
      return {
        forEach: function (fn) {
          for (var key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
              // A key is a local storage file system entry if it starts
              //with LOCAL_PERSISTENCE_KEY + '.'
              if (key.indexOf(LOCAL_PERSISTENCE_KEY + '.') === 0) {
                fn(JSON.parse(localStorage.getItem(key)));
              }
            }
          }
        },
        has: function (path) {
          var has = false;
          path = path || '/';
          this.forEach(function (entry) {
            if (entry.path.toLowerCase() === path.toLowerCase()) {
              has = true;
            }
          });
          return has;
        },
        set: function (path, content) {
          localStorage.setItem(LOCAL_PERSISTENCE_KEY + '.' + path, JSON.stringify(content));
        },
        get: function (path) {
          return JSON.parse(localStorage.getItem(LOCAL_PERSISTENCE_KEY + '.' + path));
        },
        remove: function (path) {
          localStorage.removeItem(LOCAL_PERSISTENCE_KEY + '.' + path);
        }
      };
    }
  ]).factory('localStorageFileSystem', [
    '$q',
    '$timeout',
    'localStorageHelper',
    'FOLDER',
    function ($q, $timeout, localStorageHelper, FOLDER) {
      function fileNotFoundMessage(path) {
        return 'file with path="' + path + '" does not exist';
      }
      function addChildren(entry, fn) {
        if (entry.type === FOLDER) {
          entry.children = fn(entry.path);
        }
      }
      function findFolder(path) {
        var entries = [];
        localStorageHelper.forEach(function (entry) {
          if (entry.path.toLowerCase() === path.toLowerCase()) {
            addChildren(entry, findFiles);
            entries.push(entry);
          }
        });
        return entries.length > 0 ? entries[0] : null;
      }
      function findFiles(path) {
        if (path.lastIndexOf('/') !== path.length - 1) {
          path += '/';
        }
        var entries = [];
        localStorageHelper.forEach(function (entry) {
          if (entry.path.toLowerCase() !== path.toLowerCase() && extractParentPath(entry.path) + '/' === path) {
            addChildren(entry, findFiles);
            entries.push(entry);
          }
        });
        return entries;
      }
      /**
       *
       * Save in localStorage entries.
       *
       * File structure are objects that contain the following attributes:
       * * path: The full path (including the filename).
       * * content: The content of the file (only valid for files).
       * * isFolder: A flag that indicates whether is a folder or file.
       */
      var service = {};
      var delay = 500;
      service.supportsFolders = true;
      function validatePath(path) {
        if (path.indexOf('/') !== 0) {
          return {
            valid: false,
            reason: 'Path should start with "/"'
          };
        }
        return { valid: true };
      }
      function isValidParent(path) {
        var parent = extractParentPath(path);
        if (!localStorageHelper.has(parent) && parent !== '') {
          return false;
        }
        return true;
      }
      function hasChildrens(path) {
        var has = false;
        localStorageHelper.forEach(function (entry) {
          if (entry.path.toLowerCase() !== path.toLowerCase() && entry.path.indexOf(path) === 0) {
            has = true;
          }
        });
        return has;
      }
      function extractNameFromPath(path) {
        var pathInfo = validatePath(path);
        if (!pathInfo.valid) {
          throw 'Invalid Path!';
        }
        // When the path is ended in '/'
        if (path.lastIndexOf('/') === path.length - 1) {
          path = path.slice(0, -1);
        }
        return path.slice(path.lastIndexOf('/') + 1);
      }
      function extractParentPath(path) {
        var pathInfo = validatePath(path);
        if (!pathInfo.valid) {
          throw 'Invalid Path!';
        }
        // When the path is ended in '/'
        if (path.lastIndexOf('/') === path.length - 1) {
          path = path.slice(0, -1);
        }
        return path.slice(0, path.lastIndexOf('/'));
      }
      /**
       * List files found in a given path.
       */
      service.directory = function (path) {
        var deferred = $q.defer();
        $timeout(function () {
          var isValidPath = validatePath(path);
          if (!isValidPath.valid) {
            deferred.reject(isValidPath.reason);
            return deferred.promise;
          }
          if (!localStorageHelper.has('/')) {
            localStorageHelper.set(path, {
              path: '/',
              name: '',
              type: 'folder',
              meta: { 'created': Math.round(new Date().getTime() / 1000) }
            });
          }
          deferred.resolve(findFolder(path));
        }, delay);
        return deferred.promise;
      };
      /**
       * Persist a file to an existing folder.
       */
      service.save = function (path, content) {
        var deferred = $q.defer();
        $timeout(function () {
          var name = extractNameFromPath(path);
          var entry = localStorageHelper.get(path);
          if (!isValidParent(path)) {
            deferred.reject('Parent folder does not exists');
            return deferred.promise;
          }
          var file = {};
          if (entry) {
            if (entry.type === FOLDER) {
              deferred.reject('file has the same name as a folder');
              return deferred.promise;
            }
            entry.content = content;
            entry.meta.lastUpdated = Math.round(new Date().getTime() / 1000);
            file = entry;
          } else {
            file = {
              path: path,
              name: name,
              content: content,
              type: 'file',
              meta: { 'created': Math.round(new Date().getTime() / 1000) }
            };
          }
          localStorageHelper.set(path, file);
          deferred.resolve();
        }, delay);
        return deferred.promise;
      };
      /**
       * Create the folders contained in a path.
       */
      service.createFolder = function (path) {
        var deferred = $q.defer();
        var isValidPath = validatePath(path);
        if (!isValidPath.valid) {
          deferred.reject(isValidPath.reason);
          return deferred.promise;
        }
        if (localStorageHelper.has(path)) {
          deferred.reject('Folder already exists');
          return deferred.promise;
        }
        var parent = extractParentPath(path);
        if (!localStorageHelper.has(parent)) {
          deferred.reject('Parent folder does not exists');
          return deferred.promise;
        }
        $timeout(function () {
          localStorageHelper.set(path, {
            path: path,
            name: extractNameFromPath(path),
            type: 'folder',
            meta: { 'created': Math.round(new Date().getTime() / 1000) }
          });
          deferred.resolve();
        }, delay);
        return deferred.promise;
      };
      /**
       * Loads the content of a file.
       */
      service.load = function (path) {
        var deferred = $q.defer();
        $timeout(function () {
          var entry = localStorageHelper.get(path);
          if (entry && entry.type === 'file') {
            deferred.resolve(localStorageHelper.get(path).content);
          } else {
            deferred.reject(fileNotFoundMessage(path));
          }
        }, delay);
        return deferred.promise;
      };
      /**
       * Removes a file or directory.
       */
      service.remove = function (path) {
        var deferred = $q.defer();
        $timeout(function () {
          var entry = localStorageHelper.get(path);
          if (entry && entry.type === FOLDER && hasChildrens(path)) {
            deferred.reject('folder not empty');
            return deferred.promise;
          }
          localStorageHelper.remove(path);
          deferred.resolve();
        }, delay);
        return deferred.promise;
      };
      /**
       * Renames a file or directory
       */
      service.rename = function (source, destination) {
        var deferred = $q.defer();
        $timeout(function () {
          var sourceEntry = localStorageHelper.get(source);
          if (!sourceEntry) {
            deferred.reject('Source file or folder does not exists.');
            return deferred.promise;
          }
          var destinationEntry = localStorageHelper.get(destination);
          if (destinationEntry) {
            deferred.reject('File or folder already exists.');
            return deferred.promise;
          }
          if (!isValidParent(destination)) {
            deferred.reject('Destination folder does not exist.');
            return deferred.promise;
          }
          sourceEntry.path = destination;
          sourceEntry.name = extractNameFromPath(destination);
          localStorageHelper.remove(destination);
          localStorageHelper.remove(source);
          localStorageHelper.set(destination, sourceEntry);
          if (sourceEntry.type === FOLDER) {
            // if (!isValidPath(destination)) {
            //   deferred.reject('Destination is not a valid folder');
            //   return deferred.promise;
            // }
            //move all child items
            localStorageHelper.forEach(function (entry) {
              if (entry.path.toLowerCase() !== source.toLowerCase() && entry.path.indexOf(source) === 0) {
                var newPath = destination + entry.path.substring(source.length);
                localStorageHelper.remove(entry.path);
                entry.path = newPath;
                localStorageHelper.set(newPath, entry);
              }
            });
          }
          deferred.resolve();
        }, delay);
        return deferred.promise;
      };
      return service;
    }
  ]);
  ;
}());
(function () {
  'use strict';
  angular.module('ramlEditorApp').service('mockingServiceClient', [
    '$http',
    '$q',
    '$window',
    function mockingServiceClientFactory($http, $q, $window) {
      var self = this;
      self.proxy = null;
      self.host = 'http://mocksvc.mulesoft.com';
      self.base = '/mocks';
      self.buildURL = function buildURL() {
        var url = self.host + self.base + [''].concat(Array.prototype.slice.call(arguments, 0)).join('/');
        var proxy = self.proxy || $window.RAML.Settings.proxy;
        if (proxy) {
          url = proxy + url;
        }
        return url;
      };
      self.simplifyMock = function simplifyMock(mock) {
        return {
          id: mock.id,
          baseUri: mock.baseUri,
          manageKey: mock.manageKey
        };
      };
      self.getMock = function getMock(mock) {
        return $http.get(self.buildURL(mock.id, mock.manageKey)).then(function success(response) {
          return self.simplifyMock(response.data);
        }, function failure(response) {
          if (response.status === 404) {
            return;
          }
          return $q.reject(response);
        });
      };
      self.createMock = function createMock(mock) {
        return $http.post(self.buildURL(), mock).then(function success(response) {
          return self.simplifyMock(response.data);
        });
      };
      self.updateMock = function updateMock(mock) {
        return $http({
          method: 'PATCH',
          url: self.buildURL(mock.id, mock.manageKey),
          data: {
            raml: mock.raml,
            json: mock.json
          }
        }).then(function success(response) {
          return self.simplifyMock(angular.extend(mock, response.data));
        });
      };
      self.deleteMock = function deleteMock(mock) {
        return $http.delete(self.buildURL(mock.id, mock.manageKey));
      };
    }
  ]);
  ;
}());
(function () {
  'use strict';
  angular.module('ramlEditorApp').service('mockingService', [
    'mockingServiceClient',
    'ramlRepository',
    function mockingServiceFactory(mockingServiceClient, ramlRepository) {
      var self = this;
      function getMockMeta(file) {
        return ramlRepository.loadMeta(file).then(function success(meta) {
          return meta.mock;
        });
        ;
      }
      function setMockMeta(file, mock) {
        return ramlRepository.loadMeta(file).then(function success(meta) {
          meta.mock = mock;
          return ramlRepository.saveMeta(file, meta);
        }).then(function success() {
          return mock;
        });
        ;
      }
      self.getMock = function getMock(file) {
        return getMockMeta(file);
      };
      self.createMock = function createMock(file, raml) {
        return mockingServiceClient.createMock({
          raml: file.contents,
          json: raml
        }).then(function success(mock) {
          return setMockMeta(file, mock);
        });
        ;
      };
      self.updateMock = function updateMock(file, raml) {
        return getMockMeta(file).then(function success(mock) {
          return mock && mockingServiceClient.updateMock(angular.extend(mock, {
            raml: file.contents,
            json: raml
          }));
        }).then(function success(mock) {
          return setMockMeta(file, mock);
        });
        ;
      };
      self.deleteMock = function deleteMock(file) {
        return getMockMeta(file).then(function (mock) {
          return mock && mockingServiceClient.deleteMock(mock);
        }).then(function success() {
          return setMockMeta(file, null);
        });
        ;
      };
    }
  ]);
  ;
}());
(function () {
  'use strict';
  angular.module('ramlEditorApp').service('confirmModal', [
    '$modal',
    function confirmModal($modal) {
      var self = this;
      self.open = function open(message, title) {
        return $modal.open({
          templateUrl: 'views/confirm-modal.html',
          controller: 'ConfirmController',
          resolve: {
            message: function messageResolver() {
              return message;
            },
            title: function titleResolver() {
              return title;
            }
          }
        }).result;
        ;
      };
      return self;
    }
  ]).controller('ConfirmController', [
    '$modalInstance',
    '$scope',
    'message',
    'title',
    function ConfirmController($modalInstance, $scope, message, title) {
      $scope.data = {
        message: message,
        title: title
      };
    }
  ]);
  ;
}());
(function () {
  'use strict';
  angular.module('ramlEditorApp').service('newNameModal', [
    '$modal',
    function newNameModal($modal) {
      var self = this;
      self.open = function open(message, defaultName, validations, title) {
        return $modal.open({
          templateUrl: 'views/new-name-modal.html',
          controller: 'NewNameController',
          resolve: {
            message: function messageResolver() {
              return message;
            },
            title: function titleResolver() {
              return title;
            },
            defaultName: function defaultNameResolver() {
              return defaultName;
            },
            validations: function validationsResolver() {
              return validations;
            }
          }
        }).result;
        ;
      };
      return self;
    }
  ]).controller('NewNameController', [
    '$modalInstance',
    '$scope',
    'message',
    'defaultName',
    'validations',
    'title',
    function NewNameController($modalInstance, $scope, message, defaultName, validations, title) {
      $scope.input = {
        newName: defaultName,
        message: message,
        title: title
      };
      $scope.validationErrorMessage = '';
      $scope.isValid = function isValid(value) {
        // only start custom validators when the input is not null
        if (value && value.length > 0) {
          for (var i = 0; i < validations.length; i++) {
            if (!validations[i].validate(value)) {
              $scope.validationErrorMessage = validations[i].message;
              return false;
            }
          }
        }
        return true;
      };
      $scope.submit = function submit(form) {
        if (form.$invalid) {
          form.$submitted = true;
          return;
        }
        $modalInstance.close($scope.input.newName);
      };
    }
  ]);
  ;
}());
(function () {
  'use strict';
  angular.module('stringFilters', []).filter('dasherize', function () {
    return function (input) {
      return input ? input.toLowerCase().trim().replace(/\s/g, '-') : '';
    };
  });
  ;
}());
(function () {
  'use strict';
  angular.module('ramlEditorApp').constant('UPDATE_RESPONSIVENESS_INTERVAL', 800).service('ramlParserFileReader', [
    '$http',
    '$q',
    'ramlParser',
    'ramlRepository',
    'safeApplyWrapper',
    function ($http, $q, ramlParser, ramlRepository, safeApplyWrapper) {
      function readLocFile(path) {
        return ramlRepository.loadFile({ path: path }).then(function success(file) {
          return file.contents;
        });
      }
      function readExtFile(path) {
        return $http.get(path, { transformResponse: null }).then(function success(response) {
          return response.data;
        }, function failure(response) {
          var error = 'cannot fetch ' + path + ', check that the server is up and that CORS is enabled';
          if (response.status) {
            error += '(HTTP ' + response.status + ')';
          }
          throw error;
        });
      }
      this.readFileAsync = safeApplyWrapper(null, function readFileAsync(file) {
        var deferredSrc = /^https?:\/\//.test(file) ? readExtFile(file) : readLocFile(file);
        var deferredDst = new $q.defer();
        deferredSrc.then(deferredDst.resolve.bind(deferredDst), deferredDst.reject.bind(deferredDst));
        return deferredDst.promise;
      });
    }
  ]).controller('ramlEditorMain', [
    'UPDATE_RESPONSIVENESS_INTERVAL',
    '$scope',
    '$rootScope',
    '$timeout',
    '$window',
    'safeApply',
    'safeApplyWrapper',
    'debounce',
    'throttle',
    'ramlHint',
    'ramlParser',
    'ramlParserFileReader',
    'ramlRepository',
    'eventService',
    'codeMirror',
    'codeMirrorErrors',
    'config',
    '$prompt',
    '$confirm',
    '$modal',
    function (UPDATE_RESPONSIVENESS_INTERVAL, $scope, $rootScope, $timeout, $window, safeApply, safeApplyWrapper, debounce, throttle, ramlHint, ramlParser, ramlParserFileReader, ramlRepository, eventService, codeMirror, codeMirrorErrors, config, $prompt, $confirm, $modal) {
      var editor, lineOfCurrentError, currentFile;
      function extractCurrentFileLabel(file) {
        var label = '';
        if (file) {
          label = file.path;
          if (file.dirty) {
            label = '* ' + label;
          }
        }
        return label;
      }
      function calculatePositionOfErrorMark(currentLine) {
        function onlyFolds(textMark) {
          return textMark.__isFold;
        }
        function toStartingLine(textMark) {
          return textMark.find().from.line;
        }
        function toMinimum(currentMin, val) {
          return Math.min(currentMin, val);
        }
        var position = { line: currentLine };
        return editor.findMarksAt(position).filter(onlyFolds).map(toStartingLine).reduce(toMinimum, lineOfCurrentError);
      }
      function formatErrorMessage(message, actualLine, displayLine) {
        if (displayLine === actualLine) {
          return message;
        }
        return 'Error on line ' + (actualLine + 1) + ': ' + message;
      }
      $window.setTheme = function setTheme(theme) {
        config.set('theme', theme);
        $scope.theme = $rootScope.theme = theme;
        safeApply($scope);
      };
      $scope.$on('event:raml-editor-file-selected', function onFileSelected(event, file) {
        codeMirror.configureEditor(editor, file.extension);
        currentFile = file;
        // Empty console so that we remove content from previous open RAML file
        eventService.broadcast('event:raml-parsed', {});
        editor.setValue(file.contents);
        $scope.fileParsable = $scope.getIsFileParsable(file);
      });
      $scope.$on('event:raml-editor-file-removed', function onFileSelected(event, file) {
        if (currentFile === file) {
          currentFile = undefined;
          editor.setValue('');
        }
      });
      $scope.canExportFiles = function canExportFiles() {
        return ramlRepository.canExport();
      };
      $scope.supportsFolders = ramlRepository.supportsFolders;
      $scope.sourceUpdated = function sourceUpdated() {
        var source = editor.getValue();
        var selectedFile = $scope.fileBrowser.selectedFile;
        $scope.clearErrorMarks();
        selectedFile.contents = source;
        $scope.fileParsable = $scope.getIsFileParsable(selectedFile);
        debounce(function emitSourceUpdated() {
          eventService.broadcast('event:raml-source-updated', source);
        }, config.get('updateResponsivenessInterval', UPDATE_RESPONSIVENESS_INTERVAL));
      };
      $scope.loadRaml = function loadRaml(definition, location) {
        return ramlParser.load(definition, location, {
          validate: true,
          transform: true,
          compose: true,
          reader: ramlParserFileReader
        });
      };
      $scope.clearErrorMarks = function clearErrorMarks() {
        codeMirrorErrors.clearAnnotations();
        $scope.hasErrors = false;
      };
      eventService.on('event:raml-source-updated', function onRamlSourceUpdated(event, source) {
        $scope.clearErrorMarks();
        if (!$scope.fileParsable || source.trim() === '') {
          $scope.currentError = undefined;
          lineOfCurrentError = undefined;
          return;
        }
        $scope.loadRaml(source, (($scope.fileBrowser || {}).selectedFile || {}).path).then(safeApplyWrapper($scope, function success(value) {
          // hack: we have to make a full copy of an object because console modifies
          // it later and makes it unusable for mocking service
          $scope.fileBrowser.selectedFile.raml = angular.copy(value);
          eventService.broadcast('event:raml-parsed', value);
        }), safeApplyWrapper($scope, function failure(error) {
          eventService.broadcast('event:raml-parser-error', error);
        }));
      });
      eventService.on('event:raml-parsed', safeApplyWrapper($scope, function onRamlParser(event, raml) {
        $scope.title = raml.title;
        $scope.version = raml.version;
        $scope.currentError = undefined;
        lineOfCurrentError = undefined;
      }));
      eventService.on('event:raml-parser-error', safeApplyWrapper($scope, function onRamlParserError(event, error) {
        /*jshint sub: true */
        var problemMark = error['problem_mark'], displayLine = 0, displayColumn = 0, message = error.message;
        lineOfCurrentError = displayLine;
        $scope.currentError = error;
        if (problemMark) {
          lineOfCurrentError = problemMark.line;
          displayLine = calculatePositionOfErrorMark(lineOfCurrentError);
          displayColumn = problemMark.column;
        }
        codeMirrorErrors.displayAnnotations([{
            line: displayLine + 1,
            column: displayColumn + 1,
            message: formatErrorMessage(message, lineOfCurrentError, displayLine)
          }]);
      }));
      $scope.openHelp = function openHelp() {
        $modal.open({ templateUrl: 'views/help.html' });
      };
      $scope.getIsFileParsable = function getIsFileParsable(file, contents) {
        // check for file extension
        if (file.extension !== 'raml') {
          return false;
        }
        // check for raml version tag as a very first line of the file
        contents = arguments.length > 1 ? contents : file.contents;
        if (contents.search(/^\s*#%RAML( \d*\.\d*)?\s*(\n|$)/) !== 0) {
          return false;
        }
        // if there is root file only that file is marked as parsable
        if ((($scope.fileBrowser || {}).rootFile || file) !== file) {
          return false;
        }
        return true;
      };
      $scope.getIsMockingServiceVisible = function getIsMockingServiceVisible() {
        if (!$scope.fileParsable) {
          return false;
        }
        return true;
      };
      $scope.getIsShelfVisible = function getIsShelfVisible() {
        if (!$scope.fileParsable) {
          return false;
        }
        return true;
      };
      $scope.getIsConsoleVisible = function getIsConsoleVisible() {
        if (!$scope.fileParsable) {
          return false;
        }
        return true;
      };
      $scope.toggleShelf = function toggleShelf() {
        $scope.shelf.collapsed = !$scope.shelf.collapsed;
        config.set('shelf.collapsed', $scope.shelf.collapsed);
      };
      $scope.getSelectedFileAbsolutePath = function getSelectedFileAbsolutePath() {
        return extractCurrentFileLabel(currentFile);
      };
      eventService.on('event:toggle-theme', function onToggleTheme() {
        $window.setTheme($scope.theme === 'dark' ? 'light' : 'dark');
      });
      (function bootstrap() {
        $scope.currentError = undefined;
        $scope.theme = $rootScope.theme = config.get('theme', 'dark');
        $scope.shelf = {};
        $scope.shelf.collapsed = JSON.parse(config.get('shelf.collapsed', 'false'));
        $scope.editor = editor = codeMirror.initEditor();
        editor.on('fold', function (cm, start, end) {
          if (start.line <= lineOfCurrentError && lineOfCurrentError <= end.line) {
            codeMirrorErrors.displayAnnotations([{
                line: start.line + 1,
                message: formatErrorMessage($scope.currentError.message, lineOfCurrentError, start.line)
              }]);
          }
        });
        editor.on('unfold', function () {
          var displayLine = calculatePositionOfErrorMark(lineOfCurrentError);
          var message = formatErrorMessage($scope.currentError.message, lineOfCurrentError, displayLine);
          codeMirrorErrors.displayAnnotations([{
              line: displayLine + 1,
              message: message
            }]);
        });
        editor.on('change', function onChange() {
          $scope.sourceUpdated();
        });
        // Warn before leaving the page
        $window.onbeforeunload = function () {
          var anyUnsavedChanges = false;
          $scope.homeDirectory.forEachChildDo(function (t) {
            anyUnsavedChanges = anyUnsavedChanges || t.dirty;
          });
          if (anyUnsavedChanges) {
            return 'WARNING: You have unsaved changes. Those will be lost if you leave this page.';
          }
        };
      }());
    }
  ]);
  ;
}());
(function () {
  'use strict';
  angular.module('ramlEditorApp').factory('applySuggestion', [
    'ramlSnippets',
    'generateTabs',
    'getNode',
    function applySuggestionFactory(ramlSnippets, generateTabs, getNode) {
      return function applySuggestion(editor, suggestion) {
        var snippet = ramlSnippets.getSnippet(suggestion);
        var node = getNode(editor);
        var lineIsArray = node.line.trim() === '-';
        var tabCount = node.lineIndent.tabCount;
        // Need to compute a prefix, such as '- ' or ' ' for the snippet
        // as well as a padding for every line in the snippet. The padding
        // is simply the current node tabbing, or the cursor position if
        // there is no current node, which exactly what node.lineIndent.tabCount does:
        var prefix = lineIsArray ? ' ' : '';
        var padding = lineIsArray ? '' : generateTabs(tabCount);
        // For list element suggestions, we need to know whether or not to add the '- ' list
        // indicator: If a previous element at our tab depth already added the list indicator
        // then we should not do so.
        if (suggestion.isList && !lineIsArray) {
          var arrayStarterNode = node.selfOrPrevious(function (node) {
              return node.isArrayStarter;
            });
          //1. If we don't find an array starter node, we start a new array.
          //2. If we have an array starter node, BUT the cursor is at same tab as it, we start a new array.
          //3. If the suggestion a text node, we start a new array.
          if (!arrayStarterNode || node.lineIndent.tabCount === arrayStarterNode.lineIndent.tabCount && node.lineNumber !== arrayStarterNode.lineNumber || suggestion.metadata && suggestion.metadata.isText) {
            prefix = '- ';
          } else if (node.isArrayStarter) {
            // Add extra tab for children of root array node, e.g. those not prefixed with a '- '
            padding = generateTabs(tabCount + 1);
          }
        }
        // Add prefix and padding to snippet lines:
        var codeToInsert = snippet.map(function (line, index) {
            return padding + (index === 0 ? prefix : '') + line;
          }).join('\n');
        // Search for a line that is empty or has the same indentation as current line
        while (true) {
          if (node.isEmpty) {
            break;  // Empty node, place code there
          }
          var nextNode = getNode(editor, node.lineNumber + 1);
          if (!nextNode || nextNode.lineIndent.tabCount <= tabCount) {
            break;  // At end of raml, place node here
          }
          node = nextNode;
        }
        // Calculate the place to insert the code:
        // + Make sure to start at end of node content so we don't erase anything!
        var from = {
            line: node.lineNumber,
            ch: node.line.trimRight().length
          };
        var to = {
            line: from.line,
            ch: node.line.length
          };
        var nodeHasContent = !node.isEmpty && !lineIsArray;
        // If cursor is on a non-empty/array starter line, add a newline:
        if (nodeHasContent) {
          codeToInsert = '\n' + codeToInsert;
        }
        editor.replaceRange(codeToInsert, from, to);
        // in case of inserting into current line we're
        // moving cursor one line less further as we're
        // re-using current line
        editor.setCursor({ line: from.line + snippet.length - (nodeHasContent ? 0 : 1) });
        editor.focus();
      };
    }
  ]).value('suggestionKeyToTitleMapping', { '<resource>': 'New Resource' }).factory('updateSuggestions', [
    'ramlHint',
    'suggestionKeyToTitleMapping',
    function (ramlHint, suggestionKeyToTitleMapping) {
      return function (editor) {
        var suggestions = ramlHint.getSuggestions(editor);
        var sections = {};
        var model = { sections: [] };
        suggestions.forEach(function (item) {
          item.title = suggestionKeyToTitleMapping[item.key] || item.key;
          sections[item.metadata.category] = sections[item.metadata.category] || {
            name: item.metadata.category,
            items: []
          };
          sections[item.metadata.category].items.push(item);
          //61553714: Because item is the model passed into the designer, we need to copy the
          //isList property into it so that the designer can format things properly.
          item.isList = suggestions.isList;
        });
        Object.keys(sections).forEach(function (key) {
          model.sections.push(sections[key]);
        });
        model.path = suggestions.path;
        return model;
      };
    }
  ]).controller('ramlEditorShelf', [
    '$scope',
    'safeApplyWrapper',
    'applySuggestion',
    'updateSuggestions',
    function ($scope, safeApplyWrapper, applySuggestion, updateSuggestions) {
      var editor = $scope.editor;
      $scope.cursorMoved = safeApplyWrapper(null, function cursorMoved() {
        $scope.model = updateSuggestions(editor);
      });
      $scope.orderSections = function orderSections(section) {
        var index = [
            'root',
            'docs',
            'methods',
            'parameters',
            'responses',
            'security',
            'resources',
            'traits and types'
          ].indexOf(section.name.toLowerCase());
        return index === -1 ? index.length : index;
      };
      $scope.itemClick = function itemClick(suggestion) {
        applySuggestion(editor, suggestion);
      };
      editor.on('cursorActivity', $scope.cursorMoved);
    }
  ]);
  ;
}());
(function () {
  'use strict';
  angular.module('ramlEditorApp').constant('NOTIFICATION_TIMEOUT', 3000).controller('notifications', [
    'NOTIFICATION_TIMEOUT',
    'eventService',
    '$scope',
    '$timeout',
    function (NOTIFICATION_TIMEOUT, eventService, $scope, $timeout) {
      var notifications = [];
      $scope.shouldDisplayNotifications = false;
      function processNotifications() {
        var args;
        if (notifications.length) {
          args = notifications.splice(0, 1)[0];
          $scope.message = args.message;
          $scope.expires = args.expires;
          $scope.level = args.level || 'info';
          // info, error
          $scope.shouldDisplayNotifications = true;
          if (args.expires) {
            $timeout(function () {
              $scope.shouldDisplayNotifications = false;
              processNotifications();
            }, NOTIFICATION_TIMEOUT);
          }
        }
      }
      eventService.on('event:notification', function (e, args) {
        notifications.push(JSON.parse(JSON.stringify(args)));
        processNotifications();
      });
      $scope.hideNotifications = function () {
        $scope.shouldDisplayNotifications = false;
        processNotifications();
      };
    }
  ]);
  ;
}());
(function () {
  'use strict';
  angular.module('ramlEditorApp').controller('mockingServiceController', [
    '$scope',
    'mockingService',
    'getNode',
    function mockingServiceControllerFactory($scope, mockingService, getNode) {
      function addBaseUri() {
        function setLine(lineNumber, line, prefix) {
          $scope.editor.setLine(lineNumber, (prefix || '') + $scope.editor.getLine(lineNumber) + '\n' + line);
        }
        var baseUri = 'baseUri: ' + $scope.mock.baseUri;
        var node = getNode($scope.editor, 0);
        // try to find `baseUri` line
        while (node) {
          if (node.getKey() === 'baseUri') {
            setLine(node.lineNumber, baseUri, '#');
            return;
          }
          node = node.getNextSibling();
        }
        // try to find `---` line
        for (var i = 0; $scope.editor.getLine(i); i++) {
          if ($scope.editor.getLine(i).trim() === '---') {
            setLine(i, baseUri);
            return;
          }
        }
        // place it right after RAML version tag
        setLine(0, baseUri);
      }
      function removeBaseUri() {
        var baseUriLine = 'baseUri: ' + $scope.mock.baseUri;
        var lineNumber = void 0;
        var line = void 0;
        // trying to find mocked baseUri
        // and remove it
        for (lineNumber = 0; lineNumber < $scope.editor.lineCount(); lineNumber++) {
          line = $scope.editor.getLine(lineNumber).trim();
          if (line === baseUriLine) {
            $scope.editor.removeLine(lineNumber);
            break;
          }
        }
        // trying to find previous commented out baseUri
        // and uncomment it
        for (lineNumber = Math.min(lineNumber, $scope.editor.lineCount() - 1); lineNumber >= 0; lineNumber--) {
          line = $scope.editor.getLine(lineNumber).trim();
          if (line.indexOf('#') === 0 && line.slice(1).trim().indexOf('baseUri: ') === 0) {
            $scope.editor.setLine(lineNumber, line.slice(1).trim());
            break;
          }
        }
      }
      function loading(promise) {
        $scope.loading = true;
        return promise.finally(function onFinally() {
          $scope.loading = false;
        });
      }
      function setMock(mock) {
        $scope.mock = mock;
        $scope.enabled = !!mock;
      }
      function getMock() {
        loading(mockingService.getMock($scope.fileBrowser.selectedFile).then(setMock));
      }
      function createMock() {
        loading(mockingService.createMock($scope.fileBrowser.selectedFile, $scope.fileBrowser.selectedFile.raml).then(setMock).then(addBaseUri));
      }
      function updateMock() {
        mockingService.updateMock($scope.fileBrowser.selectedFile, $scope.fileBrowser.selectedFile.raml).then(setMock);
        ;
      }
      function deleteMock() {
        loading(mockingService.deleteMock($scope.fileBrowser.selectedFile).then(function () {
          removeBaseUri();
        }).then(setMock));
      }
      $scope.toggleMockingService = function toggleMockingService() {
        if (!$scope.fileBrowser.selectedFile) {
          return;
        }
        if ($scope.enabled) {
          deleteMock();
          return;
        }
        createMock();
      };
      $scope.$watch('fileBrowser.selectedFile', function watch(newValue) {
        if (newValue) {
          getMock();
        } else {
          setMock();
        }
      });
      $scope.$watch('fileBrowser.selectedFile.raml', function watch() {
        if ($scope.enabled) {
          updateMock();
        }
      });
    }
  ]);
  ;
}());
(function () {
  'use strict';
  /**
   * Flex layout splitter
   */
  angular.module('splitter', []).directive('ngSplitter', [
    '$window',
    'config',
    function ($window, config) {
      // Extend angular jqlite with .prev as an opposite to .next
      if (!angular.element.prototype.prev) {
        /**
           * Get the immediately preceding sibling of each element in the set of matched elements.
           */
        angular.element.prototype.prev = function prev() {
          var value;
          if (this.length) {
            value = this[0].previousSibling;
            while (value !== null && value.nodeType !== 1) {
              value = value.previousSibling;
            }
          }
          return angular.isDefined(value) ? angular.element(value) : this;
        };
      }
      function getCollapseTarget(splitter) {
        return splitter.attr('ng-splitter-collapse-target');
      }
      function getCollapseTargetEl(splitter) {
        return splitter[getCollapseTarget(splitter)]();
      }
      function getNonCollapseTargetEl(splitter) {
        return splitter[{
          next: 'prev',
          prev: 'next'
        }[getCollapseTarget(splitter)]]();
      }
      /**
         * Scales the splitter to the requested size, clipping the size based on
         * our constraints and toggling the resize chevron if the size of the
         * next element goes to the minimum value.
         *
         * @param splitter Splitter that was moved
         * @param size Pixels to resize to
         */
      function resizeCollapseTarget(splitter, size) {
        getCollapseTargetEl(splitter).css('min-width', Math.max(0, size) + 'px');
        return Math.max(0, size);
      }
      /**
         * @param splitter Splitter that was moved
         * @param sizeAttr 'width' or 'height'
         * @param delta Pixels to resize by
         * @returns New collapse target size after it has been resized
         */
      function performResizeCollapseTarget(splitter, sizeAttr, delta) {
        var collapseTargetEl = getCollapseTargetEl(splitter);
        var collapseTargetElSize = getOffsetSize(collapseTargetEl, sizeAttr);
        var nonCollapseTargetEl = getNonCollapseTargetEl(splitter);
        var nonCollapseTargetElSize = getOffsetSize(nonCollapseTargetEl, sizeAttr);
        var sign = {
            next: 1,
            prev: -1
          }[getCollapseTarget(splitter)];
        // Force delta to be as small as possible to make
        // sure collapse target doesn't over grow if there is
        // no space left
        if (nonCollapseTargetElSize + delta * sign < 0) {
          delta = nonCollapseTargetElSize * sign * -1;
        }
        if (delta) {
          collapseTargetElSize = resizeCollapseTarget(splitter, collapseTargetElSize - delta * sign);
        }
        return collapseTargetElSize;
      }
      /**
         * @param element Element whose offset size we want
         * @param sizeAttr 'width' or 'height'
         * @returns {Number} offset size
         */
      function getOffsetSize(element, sizeAttr) {
        var offsetSizeProperty = 'offset' + sizeAttr[0].toUpperCase() + sizeAttr.slice(1);
        return element[0][offsetSizeProperty];
      }
      //region Splitter config
      /**
         * Loads the splitter size and optionally applies it to the next element
         * after the splitter
         * @param splitter The splitter element. Should have a unique id.
         * @param sizeAttr 'width' or 'height'
         * @returns {Number} The splitter size
         */
      function loadSize(splitter, sizeAttr) {
        //If no size was saved, use the current size;
        return config.get('splitterSize_' + splitter.attr('id')) || saveSize(splitter, sizeAttr);
      }
      /**
         * Saves the splitter size
         * @param splitter The splitter element. Should have a unique id.
         * @param sizeAttr 'width' or 'height'
         * @returns {Number} The size of the splitter
         */
      function saveSize(splitter, sizeAttr) {
        var size = getOffsetSize(getCollapseTargetEl(splitter), sizeAttr);
        config.set('splitterSize_' + splitter.attr('id'), size);
        return size;
      }
      /**
         * Loads whether the splitter was collapsed by the user
         * @param splitter The splitter element. Should have a unique id.
         * @returns {boolean} Whether the splitter was collapsed by the user
         */
      function loadIsCollapsed(splitter) {
        return config.get('splitterCollapsed_' + splitter.attr('id')) === 'true';
      }
      /**
         * Saves whether the splitter is collapsed
         * @param splitter The splitter element. Should have a unique id.
         * @param collapsed Whether the splitter is collapsed
         */
      function saveIsCollapsed(splitter, collapsed) {
        config.set('splitterCollapsed_' + splitter.attr('id'), collapsed);
      }
      /**
         * Toggles the collapse target visibility
         * @param splitter The splitter that owns the chevron
         * @param collapse False means expand collapse target, true
         * means collapse target is shown
         */
      function toggleCollapseTarget(splitter, collapse) {
        collapse = arguments.length > 1 ? collapse : !loadIsCollapsed(splitter);
        splitter.toggleClass('collapsed', collapse);
        getCollapseTargetEl(splitter).toggleClass('hide-display', collapse);
        saveIsCollapsed(splitter, collapse);
      }
      //endregion
      return {
        restrict: 'A',
        link: function (scope, splitter, attrs) {
          var isActive = false;
          var userIsDragging = true;
          var vertical = attrs.ngSplitter === 'vertical';
          var sizeAttr = vertical ? 'width' : 'height';
          var posAttr = vertical ? 'clientX' : 'clientY';
          var lastPos;
          var lastSize = loadSize(splitter, sizeAttr);
          var lastCollapsed = loadIsCollapsed(splitter);
          var parent = splitter.parent();
          // Restore collapse target state (size and collapsed)
          // from last session
          resizeCollapseTarget(splitter, lastSize);
          toggleCollapseTarget(splitter, lastCollapsed);
          // Configure UI events
          splitter.on('mousedown', function onMouseDown(event) {
            // Only respond to left mouse button
            if (event.button !== 0) {
              return;
            }
            lastPos = event[posAttr];
            lastSize = loadSize(splitter, sizeAttr);
            lastCollapsed = loadIsCollapsed(splitter);
            isActive = true;
            parent.addClass('noselect');
          });
          ;
          angular.element($window).on('mousemove', function onMouseMove(event) {
            if (isActive) {
              userIsDragging = true;
              // Scale the collapse target
              var collapsed = performResizeCollapseTarget(splitter, sizeAttr, event[posAttr] - lastPos) === 0;
              // Collapse the target if its size has reached zero
              //
              // We don't want to toggle the state every 1px and for
              // that reason we compare current state with last one
              if (collapsed !== lastCollapsed) {
                toggleCollapseTarget(splitter, collapsed);
              }
              lastPos = event[posAttr];
              lastCollapsed = collapsed;
            }
          }).on('mouseup', function onMouseUp() {
            if (isActive) {
              if (lastCollapsed) {
                // Preserve collapse target's size if it
                // has reached collapsed state during drag & drop operation
                //
                // We do it to make sure collapsed target expands to proper size
                // when users try to expand it in current or next session
                toggleCollapseTarget(splitter, true);
                resizeCollapseTarget(splitter, lastSize);
              } else {
                saveSize(splitter, sizeAttr);
              }
              isActive = false;
              parent.removeClass('noselect');
            }
          });
          ;
          // Wire up the tiny button that handles collapse and expand operations
          splitter.children('.split').on('mousedown', function onClick() {
            userIsDragging = false;
          });
          splitter.children('.split').on('mouseup', function onClick() {
            // Need to make sure that the user is clicking, not dragging:
            if (!userIsDragging) {
              toggleCollapseTarget(splitter);
              userIsDragging = true;
              isActive = false;
            }
          });
        }
      };
    }
  ]);
  ;
}());
(function () {
  'use strict';
  angular.module('ramlEditorApp').directive('ramlEditor', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/raml-editor-main.tmpl.html',
      controller: 'ramlEditorMain'
    };
  });
  ;
}());
(function () {
  'use strict';
  angular.module('ramlEditorApp').directive('ramlEditorContextMenu', [
    '$injector',
    '$window',
    'confirmModal',
    'newNameModal',
    'ramlRepository',
    'scroll',
    function ramlEditorContextMenu($injector, $window, confirmModal, newNameModal, ramlRepository, scroll) {
      function createActions(target) {
        var actions = [
            {
              label: 'Save',
              execute: function execute() {
                ramlRepository.saveFile(target);
              }
            },
            {
              label: 'Delete',
              execute: function execute() {
                var message;
                var title;
                if (target.isDirectory) {
                  message = 'Are you sure you want to delete "' + target.name + '" and all its contents?';
                  title = 'Remove folder';
                } else {
                  message = 'Are you sure you want to delete "' + target.name + '"?';
                  title = 'Remove file';
                }
                confirmModal.open(message, title).then(function () {
                  ramlRepository.remove(target);
                });
                ;
              }
            },
            {
              label: 'Rename',
              execute: function execute() {
                var parent = ramlRepository.getParent(target);
                var message = target.isDirectory ? 'Enter a new name for this folder:' : 'Enter a new name for this file:';
                var title = target.isDirectory ? 'Rename a folder' : 'Rename a file';
                var validations = [{
                      message: 'This name is already taken.',
                      validate: function validate(input) {
                        return !parent.children.some(function (t) {
                          return t.name.toLowerCase() === input.toLowerCase();
                        });
                      }
                    }];
                newNameModal.open(message, target.name, validations, title).then(function (name) {
                  ramlRepository.rename(target, name);
                });
                ;
              }
            }
          ];
        // remove the 'Save' action if the target is a directory
        return target.isDirectory ? actions.slice(1) : actions;
      }
      function outOfWindow(el) {
        var rect = el.getBoundingClientRect();
        return !(rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth));
      }
      return {
        restrict: 'E',
        templateUrl: 'views/raml-editor-context-menu.tmpl.html',
        link: function link(scope, element) {
          function positionMenu(element, offsetTarget) {
            var rect = offsetTarget.getBoundingClientRect();
            var top = rect.top + 0.5 * rect.height;
            var left = rect.left + 0.5 * rect.width;
            var menuContainer = angular.element(element[0].children[0]);
            menuContainer.css('top', top + 'px');
            menuContainer.css('left', left + 'px');
            setTimeout(function () {
              if (outOfWindow(menuContainer[0])) {
                menuContainer.css('top', top - menuContainer[0].offsetHeight + 'px');
              }
            }, 0);
          }
          function close() {
            scroll.enable();
            scope.$apply(function () {
              delete contextMenuController.target;
              scope.opened = false;
              $window.removeEventListener('click', close);
              $window.removeEventListener('keydown', closeOnEscape);
            });
          }
          function closeOnEscape(e) {
            if (e.which === 27) {
              e.preventDefault();
              close();
            }
          }
          var contextMenuController = {
              open: function open(event, target) {
                scroll.disable();
                this.target = target;
                scope.actions = createActions(target);
                event.stopPropagation();
                positionMenu(element, event.target);
                $window.addEventListener('click', close);
                $window.addEventListener('keydown', closeOnEscape);
                scope.opened = true;
              }
            };
          scope.registerContextMenu(contextMenuController);
        },
        scope: true
      };
    }
  ]);
  ;
}());
(function () {
  'use strict';
  angular.module('ramlEditorApp').directive('ramlEditorFileBrowser', [
    '$q',
    '$window',
    '$rootScope',
    'config',
    'eventService',
    'ramlRepository',
    'newNameModal',
    function ($q, $window, $rootScope, config, eventService, ramlRepository, newNameModal) {
      function Controller($scope) {
        var fileBrowser = this;
        var unwatchSelectedFile = angular.noop;
        var contextMenu = void 0;
        $scope.toggleFolderCollapse = function (node) {
          node.collapsed = !node.collapsed;
        };
        $scope.fileTreeOptions = function () {
          var duplicateName = false;
          return {
            accept: function (sourceNodeScope, destNodesScope, destIndex) {
              var accept;
              var source = sourceNodeScope.$modelValue;
              var dest = destIndex < 0 ? $scope.homeDirectory : destNodesScope.$modelValue[destIndex];
              // if the destination is a file, select its parent directory as destination
              if (!dest.isDirectory) {
                dest = destNodesScope.$nodeScope ? destNodesScope.$nodeScope.$modelValue : $scope.homeDirectory;
              }
              // Check if the destination is a child of the source
              var destIsChild = ramlRepository.getParent(source).path === dest.path || dest.path.slice(0, source.path.length) === source.path;
              duplicateName = dest.children.filter(function (c) {
                return c.name === source.name;
              }).length > 0;
              accept = !duplicateName && !destIsChild;
              if (accept) {
                fileBrowser.cursorState = 'ok';
              } else {
                fileBrowser.cursorState = 'no';
              }
              return accept;
            },
            dropped: function (event) {
              var source = event.source.nodeScope.$modelValue;
              var dest = event.dest.nodesScope.$nodeScope ? event.dest.nodesScope.$nodeScope.$modelValue : $scope.homeDirectory;
              // do the actual moving
              ramlRepository.move(source, dest).then(function () {
                fileBrowser.select(source);
              });
            },
            dragStop: function (event) {
              // when drag is stopped or canceled, reset the cursor
              fileBrowser.cursorState = '';
              if (!event.canceled && duplicateName) {
                $rootScope.$broadcast('event:notification', {
                  message: 'Failed: duplicate file name found in the destination folder.',
                  expires: true,
                  level: 'error'
                });
              }
            }
          };
        }();
        fileBrowser.select = function select(target) {
          var action = target.isDirectory ? fileBrowser.selectDirectory : fileBrowser.selectFile;
          action(target);
        };
        fileBrowser.selectFile = function selectFile(file) {
          // If we select a file that is already active, just modify 'currentTarget', no load needed
          if (fileBrowser.selectedFile && fileBrowser.selectedFile.$$hashKey === file.$$hashKey) {
            fileBrowser.currentTarget = file;
            return;
          }
          unwatchSelectedFile();
          var isLoaded = file.loaded || !file.persisted;
          var afterLoading = isLoaded ? $q.when(file) : ramlRepository.loadFile(file);
          afterLoading.then(function (file) {
            fileBrowser.selectedFile = fileBrowser.currentTarget = file;
            $scope.$emit('event:raml-editor-file-selected', file);
            unwatchSelectedFile = $scope.$watch('fileBrowser.selectedFile.contents', function (newContents, oldContents) {
              if (newContents !== oldContents) {
                file.dirty = true;
              }
            });
          });
          ;
        };
        fileBrowser.selectDirectory = function selectDirectory(directory) {
          if (fileBrowser.currentTarget === directory) {
            return;
          }
          fileBrowser.currentTarget = directory;
          $scope.$emit('event:raml-editor-directory-selected', directory);
        };
        /**
         * This function is used for expanding all the ancestors of a target
         * node in the file tree.
         *
         * @param target {RamlDirectory/RamlFile}
         */
        function expandAncestors(target) {
          // stop at the top-level directory
          if (target.path.lastIndexOf('/') === 0) {
            return;
          }
          var parent = ramlRepository.getParent(target);
          parent.collapsed = false;
          expandAncestors(parent);
        }
        fileBrowser.saveFile = function saveFile(file) {
          ramlRepository.saveFile(file).then(function () {
            eventService.broadcast('event:notification', {
              message: 'File saved.',
              expires: true
            });
          });
          ;
        };
        fileBrowser.showContextMenu = function showContextMenu(event, target) {
          contextMenu.open(event, target);
        };
        fileBrowser.contextMenuOpenedFor = function contextMenuOpenedFor(target) {
          return contextMenu && contextMenu.target === target;
        };
        function saveListener(e) {
          if (e.which === 83 && (e.metaKey || e.ctrlKey) && !(e.shiftKey || e.altKey)) {
            e.preventDefault();
            $scope.$apply(function () {
              fileBrowser.saveFile(fileBrowser.selectedFile);
            });
          }
        }
        $window.addEventListener('keydown', saveListener);
        $scope.fileBrowser = fileBrowser;
        $scope.registerContextMenu = function registerContextMenu(cm) {
          contextMenu = cm;
        };
        $scope.$on('event:raml-editor-file-created', function (event, file) {
          fileBrowser.selectFile(file);
        });
        $scope.$on('event:raml-editor-directory-created', function (event, dir) {
          fileBrowser.selectDirectory(dir);
        });
        $scope.$on('event:raml-editor-file-selected', function (event, file) {
          expandAncestors(file);
        });
        $scope.$on('event:raml-editor-directory-selected', function (event, dir) {
          expandAncestors(dir);
        });
        $scope.$on('event:raml-editor-filetree-modified', function (event, target) {
          var parent = ramlRepository.getParent(target);
          parent.sortChildren();
        });
        $scope.$on('event:raml-editor-file-removed', function (event, file) {
          var files = [];
          $scope.homeDirectory.forEachChildDo(function (child) {
            if (!child.isDirectory) {
              files.push(child);
            }
          });
          if (file === fileBrowser.selectedFile && files.length > 0) {
            fileBrowser.selectFile(files[0]);
          } else if (files.length === 0) {
            setTimeout(promptWhenFileListIsEmpty, 0);
          }
        });
        $scope.$on('$destroy', function () {
          $window.removeEventListener('keydown', saveListener);
        });
        // watch for selected file path changes, update config if needed
        $scope.$watch('fileBrowser.selectedFile.path', function (newPath, oldPath) {
          if (newPath !== oldPath) {
            config.set('currentFile', JSON.stringify({
              path: newPath,
              name: newPath.slice(newPath.lastIndexOf('/') + 1)
            }));
          }
        });
        function promptWhenFileListIsEmpty() {
          var defaultName = 'Untitled-1.raml';
          var message = 'File system has no files, please input a name for the new file:';
          var validation = [];
          var title = 'Add a new file';
          newNameModal.open(message, defaultName, validation, title).then(function (result) {
            ramlRepository.createFile($scope.homeDirectory, result);
          }, function () {
            ramlRepository.createFile($scope.homeDirectory, defaultName);
          });
        }
        /**
         * Finds a root file which should have `root` property set to `true`
         * starting at root directory and going down through hierarchy using DFS
         * and current position pointer instead of `shift` operation which is
         * expensive. If there are multiple root files, which should not happen,
         * it returns the very first one and stops the search.
         *
         * @param rootDirectory {RamlDirectory} A root directory to start search at
         *
         * @returns {RamlFile} A root file which is a file with `root` property set to `true`
         */
        function findRootFile(rootDirectory) {
          var queue = [rootDirectory];
          var pos = 0;
          while (pos < queue.length) {
            var directory = queue[pos];
            var files = directory.children;
            var entity = void 0;
            for (var i = 0; i < files.length; i++) {
              entity = files[i];
              if (entity.type === 'file' && entity.root) {
                return entity;
              }
              if (entity.type === 'directory') {
                queue.push(entity);
              }
            }
            pos += 1;
          }
        }
        ramlRepository.loadDirectory().then(function (directory) {
          $scope.homeDirectory = directory;
          fileBrowser.rootFile = findRootFile(directory);
          var files = [];
          $scope.homeDirectory.forEachChildDo(function (child) {
            if (!child.isDirectory) {
              files.push(child);
            }
          });
          if (!files.length) {
            promptWhenFileListIsEmpty();
            return;
          }
          // select a file in the following order:
          //   - previously selected file
          //   - root file
          //   - first file
          var currentFile = JSON.parse(config.get('currentFile', '{}'));
          var fileToOpen = ramlRepository.getByPath(currentFile.path) || fileBrowser.rootFile || files[0];
          fileBrowser.selectFile(fileToOpen);
        });
        ;
      }
      return {
        restrict: 'E',
        templateUrl: 'views/raml-editor-file-browser.tmpl.html',
        controller: Controller
      };
    }
  ]);
  ;
}());
(function () {
  'use strict';
  angular.module('ramlEditorApp').directive('ramlEditorSaveFileButton', [
    '$rootScope',
    'ramlRepository',
    function ramlEditorSaveFileButton($rootScope, ramlRepository) {
      return {
        restrict: 'E',
        template: '<span role="save-button" ng-click="saveFile()"><i class="fa fa-save"></i>&nbsp;Save</span>',
        link: function (scope) {
          scope.saveFile = function saveFile() {
            var file = scope.fileBrowser.selectedFile;
            ramlRepository.saveFile(file).then(function success() {
              $rootScope.$broadcast('event:notification', {
                message: 'File saved.',
                expires: true
              });
            });
          };
        }
      };
    }
  ]);
  ;
}());
(function () {
  'use strict';
  angular.module('ramlEditorApp').directive('ramlEditorNewFolderButton', [
    '$injector',
    'ramlRepository',
    'generateName',
    'newNameModal',
    function ramlEditorNewFolderButton($injector, ramlRepository, generateName, newNameModal) {
      return {
        restrict: 'E',
        template: '<span role="new-button" ng-click="newFolder()"><i class="fa fa-folder-open"></i>&nbsp;New Folder</span>',
        link: function (scope) {
          scope.newFolder = function newFolder() {
            var currentTarget = scope.fileBrowser.currentTarget;
            var parent = currentTarget.isDirectory ? currentTarget : ramlRepository.getParent(currentTarget);
            var defaultName = generateName(parent.getDirectories().map(function (d) {
                return d.name;
              }), 'Folder');
            var message = 'Input a name for your new folder:';
            var title = 'Add a new folder';
            var validations = [{
                  message: 'That folder name is already taken.',
                  validate: function (input) {
                    return !parent.children.some(function (directory) {
                      return directory.name.toLowerCase() === input.toLowerCase();
                    });
                  }
                }];
            newNameModal.open(message, defaultName, validations, title).then(function (name) {
              ramlRepository.createDirectory(parent, name);
            });
          };
        }
      };
    }
  ]);
  ;
}());
(function () {
  'use strict';
  angular.module('ramlEditorApp').directive('ramlEditorNewFileButton', [
    '$injector',
    'ramlRepository',
    'generateName',
    'newNameModal',
    function ramlEditorNewFileButton($injector, ramlRepository, generateName, newNameModal) {
      return {
        restrict: 'E',
        template: '<span role="new-button" ng-click="newFile()"><i class="fa fa-plus"></i>&nbsp;New File</span>',
        link: function (scope) {
          scope.newFile = function newFile() {
            var currentTarget = scope.fileBrowser.currentTarget;
            var parent = currentTarget.isDirectory ? currentTarget : ramlRepository.getParent(currentTarget);
            var defaultName = generateName(parent.getFiles().map(function (f) {
                return f.name;
              }), 'Untitled-', 'raml');
            var title = 'Add a new file';
            var message = [
                'For a new RAML spec, be sure to name your file <something>.raml; ',
                'For files to be !included, feel free to use an extension or not.'
              ].join('');
            var validations = [{
                  message: 'That file name is already taken.',
                  validate: function (input) {
                    return !parent.children.some(function (file) {
                      return file.name.toLowerCase() === input.toLowerCase();
                    });
                  }
                }];
            newNameModal.open(message, defaultName, validations, title).then(function (name) {
              ramlRepository.createFile(parent, name);
            });
            ;
          };
        }
      };
    }
  ]);
  ;
}());
(function () {
  'use strict';
  angular.module('ramlEditorApp').directive('ramlEditorExportFilesButton', [
    '$rootScope',
    'ramlRepository',
    function ramlEditorExportFilesButton($rootScope, ramlRepository) {
      return {
        restrict: 'E',
        template: '<span role="export-button" ng-click="exportFiles()"><i class="fa fa-download"></i>&nbsp;Export files</span>',
        link: function (scope) {
          scope.exportFiles = function exportFiles() {
            ramlRepository.exportFiles();
          };
        }
      };
    }
  ]);
  ;
}());
/**
 * This file overwrites the ui-tree-node directive from the angular-ui-tree
 * module to modify the behaviour of tree drag-and-drop to better suit the use case
 * of file trees
 */
(function () {
  'use strict';
  angular.module('ui.tree').directive('uiTreeNode', [
    'treeConfig',
    '$uiTreeHelper',
    '$window',
    '$document',
    '$timeout',
    'ramlRepository',
    'config',
    function (treeConfig, $uiTreeHelper, $window, $document, $timeout, ramlRepository, config) {
      return {
        require: [
          '^uiTreeNodes',
          '^uiTree',
          '?uiTreeNode'
        ],
        link: function (scope, element, attrs, controllersArr) {
          var currentConfig = {};
          angular.extend(currentConfig, treeConfig);
          if (currentConfig.nodeClass) {
            element.addClass(currentConfig.nodeClass);
          }
          scope.init(controllersArr);
          scope.collapsed = !!$uiTreeHelper.getNodeAttribute(scope, 'collapsed');
          scope.$watch(attrs.collapsed, function (val) {
            if (typeof val === 'boolean') {
              scope.collapsed = val;
            }
          });
          scope.$watch('collapsed', function (val) {
            $uiTreeHelper.setNodeAttribute(scope, 'collapsed', val);
            attrs.$set('collapsed', val);
          });
          var elements;
          // As a parameter for callbacks
          var firstMoving, dragInfo, pos, dropAccpeted;
          var dragElm, hiddenPlaceElm;
          var hasTouch = 'ontouchstart' in window;
          var dragDelaying = true;
          var dragStarted = false;
          var dragTimer = null;
          var dragCanceled = false;
          var expandTimer = null;
          var expandDelay = 1000;
          // ms
          var body = document.body, html = document.documentElement, documentHeight, documentWidth;
          var dragStart = function (e) {
            if (!hasTouch && (e.button === 2 || e.which === 3)) {
              // disable right click
              return;
            }
            if (e.uiTreeDragging || e.originalEvent && e.originalEvent.uiTreeDragging) {
              // event has already fired in other scope.
              return;
            }
            // the element which is clicked
            var eventElm = angular.element(e.target);
            var eventScope = eventElm.scope();
            if (!eventScope || !eventScope.$type) {
              return;
            }
            if (eventScope.$type !== 'uiTreeNode' && eventScope.$type !== 'uiTreeHandle') {
              // Check if it is a node or a handle
              return;
            }
            if (eventScope.$type === 'uiTreeNode' && eventScope.$handleScope) {
              // If the node has a handle, then it should be clicked by the handle
              return;
            }
            var eventElmTagName = eventElm.prop('tagName').toLowerCase();
            if (eventElmTagName === 'input' || eventElmTagName === 'textarea' || eventElmTagName === 'button' || eventElmTagName === 'select') {
              // if it's a input or button, ignore it
              return;
            }
            // check if it or it's parents has a 'data-nodrag' attribute
            while (eventElm && eventElm[0] && eventElm[0] !== element) {
              if ($uiTreeHelper.nodrag(eventElm)) {
                // if the node mark as `nodrag`, DONOT drag it.
                return;
              }
              eventElm = eventElm.parent();
            }
            if (!scope.beforeDrag(scope)) {
              return;
            }
            e.uiTreeDragging = true;
            // stop event bubbling
            if (e.originalEvent) {
              e.originalEvent.uiTreeDragging = true;
            }
            e.preventDefault();
            var eventObj = $uiTreeHelper.eventObj(e);
            firstMoving = true;
            dragInfo = $uiTreeHelper.dragInfo(scope);
            var tagName = scope.$element.prop('tagName');
            hiddenPlaceElm = angular.element($window.document.createElement(tagName));
            if (currentConfig.hiddenClass) {
              hiddenPlaceElm.addClass(currentConfig.hiddenClass);
            }
            pos = $uiTreeHelper.positionStarted(eventObj, scope.$element);
            dragElm = angular.element($window.document.createElement(scope.$parentNodesScope.$element.prop('tagName'))).addClass(scope.$parentNodesScope.$element.attr('class')).addClass(currentConfig.dragClass).addClass(config.get('theme') === 'light' ? 'drag-light' : '');
            dragElm.css('z-index', 9999);
            scope.$element.after(hiddenPlaceElm);
            dragElm.append(scope.$element.clone().html(scope.$element.children()[0].innerHTML));
            $document.find('body').append(dragElm);
            dragElm.css({
              'left': eventObj.pageX - pos.offsetX + 'px',
              'top': eventObj.pageY - pos.offsetY + 'px'
            });
            elements = { dragging: dragElm };
            scope.$element.addClass('drag-elm');
            // get the node that is being dragged collasp it
            var dragNode = angular.element(dragElm[0].lastChild).scope();
            dragNode.collapsed = true;
            angular.element($document).bind('touchend', dragEndEvent);
            angular.element($document).bind('touchcancel', dragEndEvent);
            angular.element($document).bind('touchmove', dragMoveEvent);
            angular.element($document).bind('mouseup', dragEndEvent);
            angular.element($document).bind('mousemove', dragMoveEvent);
            angular.element($document).bind('mouseleave', dragCancelEvent);
            documentHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
            documentWidth = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
            scope.$treeScope.isDragging = true;
          };
          var dragMove = function (e) {
            if (!dragStarted) {
              if (!dragDelaying) {
                dragStarted = true;
                scope.$apply(function () {
                  scope.$callbacks.dragStart(dragInfo.eventArgs(elements, pos));
                });
              }
              return;
            }
            var eventObj = $uiTreeHelper.eventObj(e);
            var leftElmPos, topElmPos, boundingRect;
            if (dragElm) {
              e.preventDefault();
              if ($window.getSelection) {
                $window.getSelection().removeAllRanges();
              } else if ($window.document.selection) {
                $window.document.selection.empty();
              }
              leftElmPos = eventObj.pageX - pos.offsetX;
              topElmPos = eventObj.pageY - pos.offsetY;
              boundingRect = {
                left: leftElmPos,
                right: leftElmPos + dragElm[0].scrollWidth + 5,
                top: topElmPos,
                bottom: topElmPos + dragElm[0].scrollHeight
              };
              // check horizontal boundaries
              if (boundingRect.left < 0) {
                leftElmPos = 0;
              } else if (boundingRect.right > documentWidth) {
                leftElmPos = documentWidth - dragElm[0].scrollWidth - 5;
              }
              // check vertical boundaries
              if (boundingRect.top < 0) {
                topElmPos = 0;
              } else if (boundingRect.bottom > documentHeight) {
                topElmPos = documentHeight - dragElm[0].scrollHeight;
              }
              dragElm.css({
                'left': leftElmPos + 'px',
                'top': topElmPos + 'px'
              });
              var topScroll = window.pageYOffset || $window.document.documentElement.scrollTop;
              var bottomScroll = topScroll + (window.innerHeight || $window.document.clientHeight || $window.document.clientHeight);
              // to scroll down if cursor y-position is greater than the bottom position the vertical scroll
              if (bottomScroll < eventObj.pageY && bottomScroll <= documentHeight) {
                window.scrollBy(0, 10);
              }
              // to scroll top if cursor y-position is less than the top position the vertical scroll
              if (topScroll > eventObj.pageY) {
                window.scrollBy(0, -10);
              }
              $uiTreeHelper.positionMoved(e, pos, firstMoving);
              if (firstMoving) {
                firstMoving = false;
                return;
              }
              // Select the drag target. Because IE does not support CSS 'pointer-events: none', it will always
              // pick the drag element itself as the target. To prevent this, we hide the drag element while
              // selecting the target.
              var displayElm;
              if (angular.isFunction(dragElm.hide)) {
                dragElm.hide();
              } else {
                displayElm = dragElm[0].style.display;
                dragElm[0].style.display = 'none';
              }
              var targetX = eventObj.pageX - $window.document.body.scrollLeft;
              var targetY = eventObj.pageY - (window.pageYOffset || $window.document.documentElement.scrollTop);
              // when using elementFromPoint() inside an iframe, you have to call
              // elementFromPoint() twice to make sure IE8 returns the correct value
              $window.document.elementFromPoint(targetX, targetY);
              var targetElm = angular.element($window.document.elementFromPoint(targetX, targetY));
              if (angular.isFunction(dragElm.show)) {
                dragElm.show();
              } else {
                dragElm[0].style.display = displayElm;
              }
              var targetNode = targetElm.scope();
              if (!pos.dirAx && targetNode !== scope.prevHoverNode) {
                var isEmpty = false;
                scope.prevHoverNode = targetNode;
                if (!targetNode) {
                  return;
                }
                if (targetNode.$type === 'uiTree' && targetNode.dragEnabled) {
                  isEmpty = targetNode.isEmpty();  // Check if it's empty tree
                }
                if (targetNode.$type === 'uiTreeHandle') {
                  targetNode = targetNode.$nodeScope;
                }
                if (targetNode.$type === 'uiTreeDummyNode') {
                  // Check if it is dropped at the tree root
                  dropAccpeted = targetNode.$parentNodesScope.accept(scope, -1);
                  if (dropAccpeted) {
                    dragInfo.moveTo(targetNode.$parentNodesScope, targetNode.$parentNodesScope.childNodes(), findInsertIndex(scope.$modelValue, targetNode.$parentNodesScope.$modelValue));
                  }
                  $('.dragover').removeClass('dragover');
                  targetElm.addClass('dragover');
                  if (expandTimer) {
                    $timeout.cancel(expandTimer);
                    expandTimer = null;
                  }
                  return;
                }
                if (targetNode.$type !== 'uiTreeNode' && !isEmpty) {
                  // Check if it is a uiTreeNode or it's an empty tree
                  return;
                }
                $timeout.cancel(expandTimer);
                $('.dragover').removeClass('dragover');
                if (targetNode.$childNodesScope) {
                  // It's a folder
                  angular.element(targetNode.$element.children()[0]).addClass('dragover');
                  // Expand the folder automatically if it was originally collapsed
                  if (targetNode.collapsed) {
                    expandTimer = $timeout(function () {
                      targetNode.collapsed = false;
                      scope.nodeToExpand = null;
                    }, expandDelay);
                  }
                  scope.nodeToExpand = targetNode;
                } else if (targetNode.$parentNodeScope) {
                  // It's a file, we modify its parent
                  targetElm.addClass('dragover');
                  angular.element(targetNode.$parentNodeScope.$element.children()[0]).addClass('dragover');
                  scope.nodeToExpand = targetNode.$parentNodeScope;
                } else {
                  // file at root
                  targetElm.addClass('dragover');
                }
                if (isEmpty) {
                  // it's an empty tree
                  if (targetNode.$nodesScope.accept(scope, 0)) {
                    dragInfo.moveTo(targetNode.$nodesScope, targetNode.$nodesScope.childNodes(), 0);
                  }
                } else if (targetNode.dragEnabled()) {
                  // drag enabled
                  targetElm = targetNode.$element;
                  // Get the element of ui-tree-node
                  dropAccpeted = targetNode.$parentNodesScope.accept(scope, targetNode.index());
                  if (dropAccpeted) {
                    if (targetNode.$childNodesScope) {
                      dragInfo.moveTo(targetNode.$childNodesScope, targetNode.childNodes(), findInsertIndex(scope.$modelValue, targetNode.$childNodesScope.$modelValue));
                    } else {
                      dragInfo.moveTo(targetNode.$parentNodesScope, targetNode.$parentNodesScope.childNodes(), findInsertIndex(scope.$modelValue, targetNode.$parentNodesScope.$modelValue));
                    }
                  }
                }
              }
              scope.$apply(function () {
                scope.$callbacks.dragMove(dragInfo.eventArgs(elements, pos));
              });
            }
          };
          var dragEnd = function (e) {
            e.preventDefault();
            if (dragElm) {
              scope.$treeScope.$apply(function () {
                scope.$callbacks.beforeDrop(dragInfo.eventArgs(elements, pos));
              });
              // roll back elements changed
              hiddenPlaceElm.replaceWith(scope.$element);
              dragElm.remove();
              dragElm = null;
              if (scope.$$apply) {
                dragInfo.apply();
                scope.$treeScope.$apply(function () {
                  scope.$callbacks.dropped(dragInfo.eventArgs(elements, pos));
                });
              } else {
                bindDrag();
              }
              scope.$treeScope.$apply(function () {
                var eventArgs = dragInfo.eventArgs(elements, pos);
                eventArgs.canceled = dragCanceled;
                scope.$callbacks.dragStop(eventArgs);
              });
              scope.$$apply = false;
              dragInfo = null;
            }
            angular.element($document).unbind('touchend', dragEndEvent);
            // Mobile
            angular.element($document).unbind('touchcancel', dragEndEvent);
            // Mobile
            angular.element($document).unbind('touchmove', dragMoveEvent);
            // Mobile
            angular.element($document).unbind('mouseup', dragEndEvent);
            angular.element($document).unbind('mousemove', dragMoveEvent);
            angular.element($window.document.body).unbind('mouseleave', dragCancelEvent);
            // reset variables
            $('.dragover').removeClass('dragover');
            scope.$element.removeClass('drag-elm');
            scope.$treeScope.isDragging = false;
            scope.prevHoverNode = null;
            dragCanceled = false;
          };
          // find the index to insert a element into a sorted array
          var findInsertIndex = function (source, dest) {
            var low = 0, high = dest.length - 1, mid;
            while (high >= low) {
              mid = Math.floor((low + high) / 2);
              if (ramlRepository.sortingFunction.call(null, dest[mid], source) > 0) {
                high = mid - 1;
              } else {
                low = mid + 1;
              }
            }
            return low;
          };
          var dragStartEvent = function (e) {
            if (scope.dragEnabled()) {
              dragStart(e);
            }
          };
          var dragMoveEvent = function (e) {
            dragMove(e);
          };
          var dragEndEvent = function (e) {
            scope.$$apply = dropAccpeted;
            dragEnd(e);
          };
          var dragCancelEvent = function (e) {
            scope.$$apply = false;
            dragCanceled = true;
            dragEnd(e);
          };
          var bindDrag = function () {
            $timeout(function () {
              element.unbind();
              element.bind('touchstart mousedown', function (e) {
                dragDelaying = true;
                dragStarted = false;
                dragTimer = $timeout(function () {
                  dragDelaying = false;
                  dragStartEvent(e);
                }, scope.dragDelay);
              });
              element.bind('touchend touchcancel mouseup', function () {
                $timeout.cancel(dragTimer);
              });
            });
          };
          bindDrag();
          angular.element($window.document.body).bind('keydown', function (e) {
            if (e.keyCode === 27) {
              dragCancelEvent(e);
            }
          });
        }
      };
    }
  ]).directive('uiTreeDummyNode', [
    'treeConfig',
    function (treeConfig) {
      return {
        require: [
          '^uiTreeNodes',
          '^uiTree'
        ],
        template: '<div class="file-item dummy" ng-class="{\'no-drop\': fileBrowser.cursorState === \'no\', copy: fileBrowser.cursorState === \'ok\'}"></div>',
        restrict: 'E',
        replace: true,
        controller: function ($scope, $element) {
          this.scope = $scope;
          $scope.$element = $element;
          $scope.$parentNodeScope = null;
          // uiTreeNode Scope of parent node;
          $scope.$childNodesScope = null;
          // uiTreeNodes Scope of child nodes.
          $scope.$parentNodesScope = null;
          // uiTreeNodes Scope of parent nodes.
          $scope.$treeScope = null;
          // uiTree scope
          $scope.$$apply = false;
          $scope.$type = 'uiTreeDummyNode';
          $scope.init = function (controllersArr) {
            var treeNodesCtrl = controllersArr[0];
            $scope.$treeScope = controllersArr[1] ? controllersArr[1].scope : null;
            // find the scope of it's parent node
            $scope.$parentNodeScope = treeNodesCtrl.scope.$nodeScope;
            $scope.$parentNodesScope = treeNodesCtrl.scope;
          };
        },
        link: function (scope, element, attr, controllersArr) {
          var config = {};
          angular.extend(config, treeConfig);
          if (config.nodeClass) {
            element.addClass(config.nodeClass);
          }
          scope.init(controllersArr);
        }
      };
    }
  ]);
}());
angular.module('ramlEditorApp').run([
  '$templateCache',
  function ($templateCache) {
    'use strict';
    $templateCache.put('views/confirm-modal.html', '<form name="form" novalidate>\n' + '  <div class="modal-header">\n' + '    <h3>{{data.title}}</h3>\n' + '  </div>\n' + '\n' + '  <div class="modal-body">\n' + '    <p>{{data.message}}</p>\n' + '  </div>\n' + '\n' + '  <div class="modal-footer">\n' + '    <button type="button" class="btn btn-default" ng-click="$dismiss()">Cancel</button>\n' + '    <button type="button" class="btn btn-primary" ng-click="$close()">OK</button>\n' + '  </div>\n' + '</form>\n');
    $templateCache.put('views/help.html', '<div class="modal-header">\n' + '    <h3><i class="fa fa-question-circle"></i> Help</h3>\n' + '</div>\n' + '\n' + '<div class="modal-body">\n' + '    <p>\n' + '        The API Designer for RAML is built by MuleSoft, and is a web-based editor designed to help you author RAML specifications for your APIs.\n' + '        <br />\n' + '        <br />\n' + '        RAML is a human-and-machine readable modeling language for REST APIs, backed by a workgroup of industry leaders.\n' + '    </p>\n' + '\n' + '    <p>\n' + '        To learn more about the RAML specification and other tools which support RAML, please visit <a href="http://www.raml.org" target="_blank">http://www.raml.org</a>.\n' + '        <br />\n' + '        <br />\n' + '        For specific questions, or to get help from the community, head to the community forum at <a href="http://forums.raml.org" target="_blank">http://forums.raml.org</a>.\n' + '    </p>\n' + '</div>\n');
    $templateCache.put('views/new-name-modal.html', '<form name="form" novalidate ng-submit="submit(form)">\n' + '  <div class="modal-header">\n' + '    <h3>{{input.title}}</h3>\n' + '  </div>\n' + '\n' + '  <div class="modal-body">\n' + '    <!-- name -->\n' + '    <div class="form-group" ng-class="{\'has-error\': form.$submitted && form.name.$invalid}">\n' + '      <p>{{input.message}}</p>\n' + '      <!-- label -->\n' + '      <label for="name" class="control-label required-field-label">Name</label>\n' + '\n' + '      <!-- input -->\n' + '      <input id="name" name="name" type="text"\n' + '             ng-model="input.newName" class="form-control"\n' + '             ui-validate="\'isValid($value)\'"\n' + '             ng-maxlength="64" ap-focus="true" required>\n' + '\n' + '      <!-- error -->\n' + '      <p class="help-block" ng-show="form.$submitted && form.name.$error.required">Please provide a name.</p>\n' + '      <p class="help-block" ng-show="form.$submitted && form.name.$error.maxlength">Name must be shorter than 64 characters.</p>\n' + '      <p class="help-block" ng-show="form.$submitted && form.name.$error.validator">{{validationErrorMessage}}</p>\n' + '    </div>\n' + '  </div>\n' + '\n' + '  <div class="modal-footer">\n' + '    <button type="button" class="btn btn-default" ng-click="$dismiss()">Cancel</button>\n' + '    <button type="submit" class="btn btn-primary">OK</button>\n' + '  </div>\n' + '</form>\n');
    $templateCache.put('views/raml-editor-context-menu.tmpl.html', '<ul role="context-menu" ng-show="opened">\n' + '  <li role="context-menu-item" ng-repeat="action in actions" ng-click="action.execute()">{{ action.label }}</li>\n' + '</ul>\n');
    $templateCache.put('views/raml-editor-file-browser.tmpl.html', '<raml-editor-context-menu></raml-editor-context-menu>\n' + '<script type="text/ng-template" id="file-item.html">\n' + '  <div ui-tree-handle class="file-item" ng-click="fileBrowser.select(node)"\n' + '    ng-class="{currentfile: fileBrowser.currentTarget.path === node.path && !isDragging,\n' + '      dirty: node.dirty,\n' + '      geared: fileBrowser.contextMenuOpenedFor(node),\n' + '      directory: node.isDirectory,\n' + '      \'no-drop\': fileBrowser.cursorState === \'no\',\n' + '      copy: fileBrowser.cursorState === \'ok\'}">\n' + '    <span class="file-name" ng-Dblclick="toggleFolderCollapse(node)">\n' + '      <i class="fa icon fa-caret-right fa-fw" ng-if="node.isDirectory" ng-class="{\'fa-rotate-90\': !collapsed}"></i>\n' + '      <i class="fa icon fa-fw" ng-class="{\'fa-folder-o\': node.isDirectory, \'fa-file-text-o\': !node.isDirectory}"></i>\n' + '      &nbsp;{{node.name}}\n' + '    </span>\n' + '    <i class="fa fa-cog" ng-click="fileBrowser.showContextMenu($event, node)" ng-class="{hidden: isDragging}" data-nodrag></i>\n' + '  </div>\n' + '\n' + '  <ul ui-tree-nodes ng-if="node.isDirectory" ng-class="{hidden: collapsed}" ng-model="node.children">\n' + '    <li ui-tree-node ng-repeat="node in node.children" ng-include="\'file-item.html\'" data-collapsed="node.collapsed">\n' + '    </li>\n' + '  </ul>\n' + '</script>\n' + '\n' + '<div ui-tree="fileTreeOptions" ng-model="homeDirectory" class="file-list" data-drag-delay="300" data-empty-place-holder-enabled="false">\n' + '  <ul ui-tree-nodes ng-model="homeDirectory.children" id="tree-root">\n' + '    <ui-tree-dummy-node class="top"></ui-tree-dummy-node>\n' + '    <li ui-tree-node ng-repeat="node in homeDirectory.children" ng-include="\'file-item.html\'" data-collapsed="node.collapsed"></li>\n' + '    <ui-tree-dummy-node class="bottom" ng-click="fileBrowser.select(homeDirectory)"></ui-tree-dummy-node>\n' + '  </ul>\n' + '</div>\n');
    $templateCache.put('views/raml-editor-main.tmpl.html', '<div role="raml-editor" class="{{theme}}">\n' + '  <div role="notifications" ng-controller="notifications" class="hidden" ng-class="{hidden: !shouldDisplayNotifications, error: level === \'error\'}">\n' + '    {{message}}\n' + '    <i class="fa" ng-class="{\'fa-check\': level === \'info\', \'fa-warning\': level === \'error\'}" ng-click="hideNotifications()"></i>\n' + '  </div>\n' + '\n' + '  <header>\n' + '    <h1>\n' + '      <strong>API</strong> Designer\n' + '    </h1>\n' + '\n' + '    <a role="logo" target="_blank" href="http://mulesoft.com"></a>\n' + '  </header>\n' + '\n' + '  <ul class="menubar">\n' + '    <li class="menu-item menu-item-ll">\n' + '      <raml-editor-new-file-button></raml-editor-new-file-button>\n' + '    </li>\n' + '    <li ng-show="supportsFolders" class="menu-item menu-item-ll">\n' + '      <raml-editor-new-folder-button></raml-editor-new-folder-button>\n' + '    </li>\n' + '    <li class="menu-item menu-item-ll">\n' + '      <raml-editor-save-file-button></raml-editor-save-file-button>\n' + '    </li>\n' + '    <li ng-show="canExportFiles()" class="menu-item menu-item-ll">\n' + '      <raml-editor-export-files-button></raml-editor-export-files-button>\n' + '    </li>\n' + '    <li class="spacer file-absolute-path">{{getSelectedFileAbsolutePath()}}</li>\n' + '    <li class="menu-item menu-item-fr menu-item-mocking-service" ng-show="getIsMockingServiceVisible()" ng-controller="mockingServiceController" ng-click="toggleMockingService()">\n' + '      <div class="title"><span class="beta">BETA</span>Mocking Service</div>\n' + '      <div class="field-wrapper" ng-class="{loading: loading}">\n' + '        <span ng-if="loading"><i class="fa fa-spin fa-spinner"></i></span>\n' + '        <div class="field" ng-if="!loading">\n' + '          <input type="checkbox" value="None" id="mockingServiceEnabled" ng-checked="enabled" ng-click="$event.preventDefault()" />\n' + '          <label for="mockingServiceEnabled"></label>\n' + '        </div>\n' + '      </div>\n' + '    </li>\n' + '    <li class="menu-item menu-item-fr" ng-click="openHelp()">\n' + '      <i class="help fa fa-question-circle"></i>\n' + '      <span>&nbsp;Help</span>\n' + '    </li>\n' + '  </ul>\n' + '\n' + '  <div role="flexColumns">\n' + '    <raml-editor-file-browser role="browser"></raml-editor-file-browser>\n' + '\n' + '    <div id="browserAndEditor" ng-splitter="vertical" ng-splitter-collapse-target="prev"><div class="split split-left">&nbsp;</div></div>\n' + '\n' + '    <div role="editor" ng-class="{error: currentError}">\n' + '      <div id="code" role="code"></div>\n' + '\n' + '      <div role="shelf" ng-show="getIsShelfVisible()" ng-class="{expanded: !shelf.collapsed}">\n' + '        <div role="shelf-tab" ng-click="toggleShelf()">\n' + '          <i class="fa fa-inbox fa-lg"></i><i class="fa" ng-class="shelf.collapsed ? \'fa-caret-up\' : \'fa-caret-down\'"></i>\n' + '        </div>\n' + '\n' + '        <div role="shelf-container" ng-show="!shelf.collapsed" ng-include src="\'views/raml-editor-shelf.tmpl.html\'"></div>\n' + '      </div>\n' + '    </div>\n' + '\n' + '    <div id="consoleAndEditor" ng-show="getIsConsoleVisible()" ng-splitter="vertical" ng-splitter-collapse-target="next"><div class="split split-right">&nbsp;</div></div>\n' + '\n' + '    <div ng-show="getIsConsoleVisible()" role="preview-wrapper">\n' + '      <raml-console with-root-documentation></raml-console>\n' + '    </div>\n' + '  </div>\n' + '</div>\n');
    $templateCache.put('views/raml-editor-shelf.tmpl.html', '<ul role="sections" ng-controller="ramlEditorShelf">\n' + '  <li role="section" ng-repeat="section in model.sections | orderBy:orderSections" class="{{section.name | dasherize}}">\n' + '    {{section.name}}&nbsp;({{section.items.length}})\n' + '    <ul role="items">\n' + '      <li ng-repeat="item in section.items" ng-click="itemClick(item)"><i class="fa fa-reply"></i><span>{{item.title}}</span></li>\n' + '    </ul>\n' + '  </li>\n' + '</ul>\n');
  }
]);