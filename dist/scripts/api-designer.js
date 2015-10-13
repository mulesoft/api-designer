(function () {
  'use strict';
  function doFold(cm, pos, options) {
    var finder = options && (options.call ? options : options.rangeFinder);
    if (!finder)
      finder = cm.getHelper(pos, 'fold');
    if (!finder)
      return;
    if (typeof pos == 'number')
      pos = CodeMirror.Pos(pos, 0);
    var minSize = options && options.minFoldSize || 0;
    function getRange(allowFolded) {
      var range = finder(cm, pos);
      if (!range || range.to.line - range.from.line < minSize)
        return null;
      var marks = cm.findMarksAt(range.from);
      for (var i = 0; i < marks.length; ++i) {
        if (marks[i].__isFold) {
          if (!allowFolded)
            return null;
          range.cleared = true;
          marks[i].clear();
        }
      }
      return range;
    }
    var range = getRange(true);
    if (options && options.scanUp)
      while (!range && pos.line > cm.firstLine()) {
        pos = CodeMirror.Pos(pos.line - 1, 0);
        range = getRange(false);
      }
    if (!range || range.cleared)
      return;
    var myWidget = makeWidget(options);
    CodeMirror.on(myWidget, 'mousedown', function () {
      myRange.clear();
    });
    var myRange = cm.markText(range.from, range.to, {
        replacedWith: myWidget,
        clearOnEnter: true,
        __isFold: true
      });
    myRange.on('clear', function (from, to) {
      CodeMirror.signal(cm, 'unfold', cm, from, to);
    });
    CodeMirror.signal(cm, 'fold', cm, range.from, range.to);
  }
  function makeWidget(options) {
    var widget = options && options.widget || '\u2194';
    if (typeof widget == 'string') {
      var text = document.createTextNode(widget);
      widget = document.createElement('span');
      widget.appendChild(text);
      widget.className = 'CodeMirror-foldmarker';
    }
    return widget;
  }
  // Clumsy backwards-compatible interface
  CodeMirror.newFoldFunction = function (rangeFinder, widget) {
    return function (cm, pos) {
      doFold(cm, pos, {
        rangeFinder: rangeFinder,
        widget: widget
      });
    };
  };
  // New-style interface
  CodeMirror.defineExtension('foldCode', function (pos, options) {
    doFold(this, pos, options);
  });
  CodeMirror.registerHelper('fold', 'combine', function () {
    var funcs = Array.prototype.slice.call(arguments, 0);
    return function (cm, start) {
      for (var i = 0; i < funcs.length; ++i) {
        var found = funcs[i](cm, start);
        if (found)
          return found;
      }
    };
  });
}());
(function () {
  'use strict';
  CodeMirror.defineOption('foldGutter', false, function (cm, val, old) {
    if (old && old != CodeMirror.Init) {
      cm.clearGutter(cm.state.foldGutter.options.gutter);
      cm.state.foldGutter = null;
      cm.off('gutterClick', onGutterClick);
      cm.off('change', onChange);
      cm.off('viewportChange', onViewportChange);
      cm.off('fold', onFold);
      cm.off('unfold', onFold);
      cm.off('swapDoc', updateInViewport);
    }
    if (val) {
      cm.state.foldGutter = new State(parseOptions(val));
      updateInViewport(cm);
      cm.on('gutterClick', onGutterClick);
      cm.on('change', onChange);
      cm.on('viewportChange', onViewportChange);
      cm.on('fold', onFold);
      cm.on('unfold', onFold);
      cm.on('swapDoc', updateInViewport);
    }
  });
  var Pos = CodeMirror.Pos;
  function State(options) {
    this.options = options;
    this.from = this.to = 0;
  }
  function parseOptions(opts) {
    if (opts === true)
      opts = {};
    if (opts.gutter == null)
      opts.gutter = 'CodeMirror-foldgutter';
    if (opts.indicatorOpen == null)
      opts.indicatorOpen = 'CodeMirror-foldgutter-open';
    if (opts.indicatorFolded == null)
      opts.indicatorFolded = 'CodeMirror-foldgutter-folded';
    return opts;
  }
  function isFolded(cm, line) {
    var marks = cm.findMarksAt(Pos(line));
    for (var i = 0; i < marks.length; ++i)
      if (marks[i].__isFold && marks[i].find().from.line == line)
        return true;
  }
  function marker(spec) {
    if (typeof spec == 'string') {
      var elt = document.createElement('div');
      elt.className = spec;
      return elt;
    } else {
      return spec.cloneNode(true);
    }
  }
  function updateFoldInfo(cm, from, to) {
    var opts = cm.state.foldGutter.options, cur = from;
    cm.eachLine(from, to, function (line) {
      var mark = null;
      if (isFolded(cm, cur)) {
        mark = marker(opts.indicatorFolded);
      } else {
        var pos = Pos(cur, 0), func = opts.rangeFinder || cm.getHelper(pos, 'fold');
        var range = func && func(cm, pos);
        if (range && range.from.line + 1 < range.to.line)
          mark = marker(opts.indicatorOpen);
      }
      cm.setGutterMarker(line, opts.gutter, mark);
      ++cur;
    });
  }
  function updateInViewport(cm) {
    var vp = cm.getViewport(), state = cm.state.foldGutter;
    if (!state)
      return;
    cm.operation(function () {
      updateFoldInfo(cm, vp.from, vp.to);
    });
    state.from = vp.from;
    state.to = vp.to;
  }
  function onGutterClick(cm, line, gutter) {
    var opts = cm.state.foldGutter.options;
    if (gutter != opts.gutter)
      return;
    cm.foldCode(Pos(line, 0), opts.rangeFinder);
  }
  function onChange(cm) {
    var state = cm.state.foldGutter, opts = cm.state.foldGutter.options;
    state.from = state.to = 0;
    clearTimeout(state.changeUpdate);
    state.changeUpdate = setTimeout(function () {
      updateInViewport(cm);
    }, opts.foldOnChangeTimeSpan || 600);
  }
  function onViewportChange(cm) {
    var state = cm.state.foldGutter, opts = cm.state.foldGutter.options;
    clearTimeout(state.changeUpdate);
    state.changeUpdate = setTimeout(function () {
      var vp = cm.getViewport();
      if (state.from == state.to || vp.from - state.to > 20 || state.from - vp.to > 20) {
        updateInViewport(cm);
      } else {
        cm.operation(function () {
          if (vp.from < state.from) {
            updateFoldInfo(cm, vp.from, state.from);
            state.from = vp.from;
          }
          if (vp.to > state.to) {
            updateFoldInfo(cm, state.to, vp.to);
            state.to = vp.to;
          }
        });
      }
    }, opts.updateViewportTimeSpan);
  }
  function onFold(cm, from) {
    var state = cm.state.foldGutter, line = from.line;
    if (line >= state.from && line < state.to)
      updateFoldInfo(cm, line, line + 1);
  }
}());
// Utility function that allows modes to be combined. The mode given
// as the base argument takes care of most of the normal mode
// functionality, but a second (typically simple) mode is used, which
// can override the style of text. Both modes get to parse all of the
// text, but when both assign a non-null style to a piece of code, the
// overlay wins, unless the combine argument was true, in which case
// the styles are combined.
// overlayParser is the old, deprecated name
CodeMirror.overlayMode = CodeMirror.overlayParser = function (base, overlay, combine) {
  return {
    startState: function () {
      return {
        base: CodeMirror.startState(base),
        overlay: CodeMirror.startState(overlay),
        basePos: 0,
        baseCur: null,
        overlayPos: 0,
        overlayCur: null
      };
    },
    copyState: function (state) {
      return {
        base: CodeMirror.copyState(base, state.base),
        overlay: CodeMirror.copyState(overlay, state.overlay),
        basePos: state.basePos,
        baseCur: null,
        overlayPos: state.overlayPos,
        overlayCur: null
      };
    },
    token: function (stream, state) {
      if (stream.start == state.basePos) {
        state.baseCur = base.token(stream, state.base);
        state.basePos = stream.pos;
      }
      if (stream.start == state.overlayPos) {
        stream.pos = stream.start;
        state.overlayCur = overlay.token(stream, state.overlay);
        state.overlayPos = stream.pos;
      }
      stream.pos = Math.min(state.basePos, state.overlayPos);
      if (stream.eol())
        state.basePos = state.overlayPos = 0;
      if (state.overlayCur == null)
        return state.baseCur;
      if (state.baseCur != null && combine)
        return state.baseCur + ' ' + state.overlayCur;
      else
        return state.overlayCur;
    },
    indent: base.indent && function (state, textAfter) {
      return base.indent(state.base, textAfter);
    },
    electricChars: base.electricChars,
    innerMode: function (state) {
      return {
        state: state.base,
        mode: base
      };
    },
    blankLine: function (state) {
      if (base.blankLine)
        base.blankLine(state.base);
      if (overlay.blankLine)
        overlay.blankLine(state.overlay);
    }
  };
};
(function () {
  'use strict';
  CodeMirror.showHint = function (cm, getHints, options) {
    // We want a single cursor position.
    if (cm.somethingSelected())
      return;
    if (getHints == null)
      getHints = cm.getHelper(cm.getCursor(), 'hint');
    if (getHints == null)
      return;
    if (cm.state.completionActive)
      cm.state.completionActive.close();
    var completion = cm.state.completionActive = new Completion(cm, getHints, options || {});
    CodeMirror.signal(cm, 'startCompletion', cm);
    if (completion.options.async)
      getHints(cm, function (hints) {
        completion.showHints(hints);
      }, completion.options);
    else
      return completion.showHints(getHints(cm, completion.options));
  };
  function Completion(cm, getHints, options) {
    this.cm = cm;
    this.getHints = getHints;
    this.options = options;
    this.widget = this.onClose = null;
  }
  Completion.prototype = {
    close: function () {
      if (!this.active())
        return;
      if (this.widget)
        this.widget.close();
      if (this.onClose)
        this.onClose();
      this.cm.state.completionActive = null;
      CodeMirror.signal(this.cm, 'endCompletion', this.cm);
    },
    active: function () {
      return this.cm.state.completionActive == this;
    },
    pick: function (data, i) {
      var completion = data.list[i];
      if (completion.hint)
        completion.hint(this.cm, data, completion);
      else
        this.cm.replaceRange(getText(completion), data.from, data.to);
      this.close();
    },
    showHints: function (data) {
      if (!data || !data.list.length || !this.active())
        return this.close();
      if (!this.options.ghosting && this.options.completeSingle != false && data.list.length == 1)
        this.pick(data, 0);
      else
        this.showWidget(data);
    },
    showWidget: function (data) {
      this.widget = new Widget(this, data);
      CodeMirror.signal(data, 'shown');
      var debounce = null, completion = this, finished;
      var closeOn = this.options.closeCharacters || /[\s()\[\]{};:>,]/;
      var startPos = this.cm.getCursor(), startLen = this.cm.getLine(startPos.line).length;
      function done() {
        if (finished)
          return;
        finished = true;
        completion.close();
        completion.cm.off('cursorActivity', activity);
        CodeMirror.signal(data, 'close');
      }
      function isDone() {
        if (finished)
          return true;
        if (!completion.widget) {
          done();
          return true;
        }
      }
      function update() {
        if (isDone())
          return;
        if (completion.options.async)
          completion.getHints(completion.cm, finishUpdate, completion.options);
        else
          finishUpdate(completion.getHints(completion.cm, completion.options));
      }
      function finishUpdate(data) {
        if (isDone())
          return;
        if (!data || !data.list.length)
          return done();
        completion.widget.close();
        completion.widget = new Widget(completion, data);
      }
      function activity() {
        clearTimeout(debounce);
        var pos = completion.cm.getCursor(), line = completion.cm.getLine(pos.line);
        if (pos.line != startPos.line || line.length - pos.ch != startLen - startPos.ch || pos.ch < startPos.ch || completion.cm.somethingSelected() || pos.ch && closeOn.test(line.charAt(pos.ch - 1)))
          completion.close();
        else
          debounce = setTimeout(update, 170);
      }
      this.cm.on('cursorActivity', activity);
      this.onClose = done;
    }
  };
  function getText(completion) {
    if (typeof completion == 'string')
      return completion;
    else
      return completion.text;
  }
  function buildKeyMap(options, handle) {
    var baseMap = {
        Up: function () {
          handle.moveFocus(-1);
        },
        Down: function () {
          handle.moveFocus(1);
        },
        PageUp: function () {
          handle.moveFocus(-handle.menuSize());
        },
        PageDown: function () {
          handle.moveFocus(handle.menuSize());
        },
        Home: function () {
          handle.setFocus(0);
        },
        End: function () {
          handle.setFocus(handle.length);
        },
        Enter: handle.pick,
        Tab: handle.pick,
        Esc: handle.close
      };
    var ourMap = options.customKeys ? {} : baseMap;
    function addBinding(key, val) {
      var bound;
      if (typeof val != 'string')
        bound = function (cm) {
          return val(cm, handle);
        };  // This mechanism is deprecated
      else if (baseMap.hasOwnProperty(val))
        bound = baseMap[val];
      else
        bound = val;
      ourMap[key] = bound;
    }
    if (options.customKeys)
      for (var key in options.customKeys)
        if (options.customKeys.hasOwnProperty(key))
          addBinding(key, options.customKeys[key]);
    if (options.extraKeys)
      for (var key in options.extraKeys)
        if (options.extraKeys.hasOwnProperty(key))
          addBinding(key, options.extraKeys[key]);
    return ourMap;
  }
  function Widget(completion, data) {
    this.completion = completion;
    this.data = data;
    this.options = completion.options || {};
    var widget = this, cm = completion.cm, options = completion.options;
    var hints = this.hints = document.createElement('ul');
    hints.className = 'CodeMirror-hints';
    this.selectedHint = 0;
    var completions = data.list;
    for (var i = 0; i < completions.length; ++i) {
      var elt = hints.appendChild(document.createElement('li')), cur = completions[i];
      var className = 'CodeMirror-hint' + (i ? '' : ' CodeMirror-hint-active');
      if (cur.className != null)
        className = cur.className + ' ' + className;
      elt.className = className;
      if (cur.render)
        cur.render(elt, data, cur);
      else
        elt.appendChild(document.createTextNode(cur.displayText || getText(cur)));
      elt.hintId = i;
    }
    var pos = cm.cursorCoords(options.alignWithWord !== false ? data.from : null);
    var left = pos.left, top = pos.bottom, below = true;
    hints.style.left = left + 'px';
    hints.style.top = top + 'px';
    if (this.options.ghosting) {
      hints.style.display = completions.length > 1 ? 'block' : 'none';
    }
    // If we're at the edge of the screen, then we want the menu to appear on the left of the cursor.
    var winW = window.innerWidth || Math.max(document.body.offsetWidth, document.documentElement.offsetWidth);
    var winH = window.innerHeight || Math.max(document.body.offsetHeight, document.documentElement.offsetHeight);
    var box = hints.getBoundingClientRect();
    var overlapX = box.right - winW, overlapY = box.bottom - winH;
    if (overlapX > 0) {
      if (box.right - box.left > winW) {
        hints.style.width = winW - 5 + 'px';
        overlapX -= box.right - box.left - winW;
      }
      hints.style.left = (left = pos.left - overlapX) + 'px';
    }
    if (overlapY > 0) {
      var height = box.bottom - box.top;
      if (box.top - (pos.bottom - pos.top) - height > 0) {
        overlapY = height + (pos.bottom - pos.top);
        below = false;
      } else if (height > winH) {
        hints.style.height = winH - 5 + 'px';
        overlapY -= height - winH;
      }
      hints.style.top = (top = pos.bottom - overlapY) + 'px';
    }
    (options.container || document.body).appendChild(hints);
    cm.addKeyMap(this.keyMap = buildKeyMap(options, {
      moveFocus: function (n) {
        widget.changeActive(widget.selectedHint + n);
      },
      setFocus: function (n) {
        widget.changeActive(n);
      },
      menuSize: function () {
        return widget.screenAmount();
      },
      length: completions.length,
      close: function () {
        completion.close();
      },
      pick: function () {
        widget.pick();
      }
    }));
    if (options.closeOnUnfocus !== false) {
      var closingOnBlur;
      cm.on('blur', this.onBlur = function () {
        closingOnBlur = setTimeout(function () {
          completion.close();
        }, 100);
      });
      cm.on('focus', this.onFocus = function () {
        clearTimeout(closingOnBlur);
      });
    }
    var startScroll = cm.getScrollInfo();
    cm.on('scroll', this.onScroll = function () {
      var curScroll = cm.getScrollInfo(), editor = cm.getWrapperElement().getBoundingClientRect();
      var newTop = top + startScroll.top - curScroll.top;
      var point = newTop - (window.pageYOffset || (document.documentElement || document.body).scrollTop);
      if (!below)
        point += hints.offsetHeight;
      if (point <= editor.top || point >= editor.bottom)
        return completion.close();
      hints.style.top = newTop + 'px';
      hints.style.left = left + startScroll.left - curScroll.left + 'px';
    });
    CodeMirror.on(hints, 'dblclick', function (e) {
      var t = widget.getHintElement(hints, e.target || e.srcElement);
      if (t && t.hintId != null) {
        widget.changeActive(t.hintId);
        widget.pick();
      }
    });
    CodeMirror.on(hints, 'click', function (e) {
      var t = widget.getHintElement(hints, e.target || e.srcElement);
      if (t && t.hintId != null)
        widget.changeActive(t.hintId);
    });
    CodeMirror.on(hints, 'mousedown', function () {
      setTimeout(function () {
        cm.focus();
      }, 20);
    });
    CodeMirror.signal(data, 'select', completions[0], hints.firstChild);
    if (this.options.ghosting && this.data.list[0]) {
      this.removeGhost();
      this.ghost = new Ghost(this, this.data, this.data.list[0].displayText, this.pick.bind(this));
    }
    return true;
  }
  Widget.prototype = {
    close: function () {
      if (this.completion.widget != this)
        return;
      this.completion.widget = null;
      this.hints.parentNode.removeChild(this.hints);
      this.completion.cm.removeKeyMap(this.keyMap);
      this.removeGhost();
      var cm = this.completion.cm;
      if (this.options.closeOnUnfocus !== false) {
        cm.off('blur', this.onBlur);
        cm.off('focus', this.onFocus);
      }
      cm.off('scroll', this.onScroll);
    },
    pick: function () {
      this.completion.pick(this.data, this.selectedHint);
    },
    changeActive: function (i) {
      i = Math.max(0, Math.min(i, this.data.list.length - 1));
      if (this.selectedHint == i)
        return;
      var node = this.hints.childNodes[this.selectedHint];
      node.className = node.className.replace(' CodeMirror-hint-active', '');
      node = this.hints.childNodes[this.selectedHint = i];
      node.className += ' CodeMirror-hint-active';
      if (this.options.ghosting) {
        this.removeGhost();
        this.ghost = new Ghost(this, this.data, this.data.list[i].displayText, this.pick.bind(this));
      }
      if (node.offsetTop < this.hints.scrollTop)
        this.hints.scrollTop = node.offsetTop - 3;
      else if (node.offsetTop + node.offsetHeight > this.hints.scrollTop + this.hints.clientHeight)
        this.hints.scrollTop = node.offsetTop + node.offsetHeight - this.hints.clientHeight + 3;
      CodeMirror.signal(this.data, 'select', this.data.list[this.selectedHint], node);
    },
    screenAmount: function () {
      return Math.floor(this.hints.clientHeight / this.hints.firstChild.offsetHeight) || 1;
    },
    removeGhost: function () {
      if (!this.ghost) {
        return;
      }
      this.ghost.remove();
      return this;
    },
    getHintElement: function (parent, el) {
      while (el && el !== parent && !this.isHintElement(el)) {
        el = el.parentNode;
      }
      return el === parent ? void 0 : el;
      ;
    },
    isHintElement: function (el) {
      return el.nodeName && el.nodeName.toUpperCase() === 'LI' && el.className.split(/\s/).indexOf('CodeMirror-hint') !== -1;
      ;
    }
  };
  function Ghost(widget, data, text, accept) {
    var that = this;
    this.cm = widget.completion.cm;
    this.data = data;
    this.widget = widget;
    this.completion = widget.completion;
    this.cm.addKeyMap(this.keyMap = {
      'Tab': accept || function () {
        that.accept();
      },
      'Right': accept || function () {
        that.accept();
      }
    });
    if (!text) {
      return this.remove();
    }
    // At the moment, the ghost is going to assume the prefix text is accurate
    var suffix = this.suffix = text.substr(data.word.length);
    if (!suffix.length) {
      return this.remove();
    }
    // Creates the ghost element to be styled.
    var ghostHint = document.createElement('span');
    ghostHint.className = 'CodeMirror-hint-ghost';
    ghostHint.appendChild(document.createTextNode(suffix));
    // Abuse the bookmark feature of CodeMirror to achieve the desired completion
    // effect without modifying source code.
    this._ghost = this.cm.setBookmark(this.data.to, {
      widget: ghostHint,
      insertLeft: true
    });
  }
  Ghost.prototype = {
    accept: function () {
      if (this.suffix && this.data) {
        this.cm.replaceRange(this.suffix, this.data.to, this.data.to);
      }
      return this.remove();
    },
    remove: function () {
      if (this._ghost) {
        this._ghost.clear();
      }
      this.cm.removeKeyMap(this.keyMap);
      delete this.ghost;
      delete this.suffix;
      delete this.widget.ghost;
      return this;
    }
  };
}());
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
// A rough approximation of Sublime Text's keybindings
// Depends on addon/search/searchcursor.js and optionally addon/dialog/dialogs.js
(function (mod) {
  if (typeof exports == 'object' && typeof module == 'object')
    // CommonJS
    mod(require('../lib/codemirror'), require('../addon/search/searchcursor'), require('../addon/edit/matchbrackets'));
  else if (typeof define == 'function' && define.amd)
    // AMD
    define([
      '../lib/codemirror',
      '../addon/search/searchcursor',
      '../addon/edit/matchbrackets'
    ], mod);
  else
    // Plain browser env
    mod(CodeMirror);
}(function (CodeMirror) {
  'use strict';
  var map = CodeMirror.keyMap.sublime = { fallthrough: 'default' };
  var cmds = CodeMirror.commands;
  var Pos = CodeMirror.Pos;
  var mac = CodeMirror.keyMap['default'] == CodeMirror.keyMap.macDefault;
  var ctrl = mac ? 'Cmd-' : 'Ctrl-';
  // This is not exactly Sublime's algorithm. I couldn't make heads or tails of that.
  function findPosSubword(doc, start, dir) {
    if (dir < 0 && start.ch == 0)
      return doc.clipPos(Pos(start.line - 1));
    var line = doc.getLine(start.line);
    if (dir > 0 && start.ch >= line.length)
      return doc.clipPos(Pos(start.line + 1, 0));
    var state = 'start', type;
    for (var pos = start.ch, e = dir < 0 ? 0 : line.length, i = 0; pos != e; pos += dir, i++) {
      var next = line.charAt(dir < 0 ? pos - 1 : pos);
      var cat = next != '_' && CodeMirror.isWordChar(next) ? 'w' : 'o';
      if (cat == 'w' && next.toUpperCase() == next)
        cat = 'W';
      if (state == 'start') {
        if (cat != 'o') {
          state = 'in';
          type = cat;
        }
      } else if (state == 'in') {
        if (type != cat) {
          if (type == 'w' && cat == 'W' && dir < 0)
            pos--;
          if (type == 'W' && cat == 'w' && dir > 0) {
            type = 'w';
            continue;
          }
          break;
        }
      }
    }
    return Pos(start.line, pos);
  }
  function moveSubword(cm, dir) {
    cm.extendSelectionsBy(function (range) {
      if (cm.display.shift || cm.doc.extend || range.empty())
        return findPosSubword(cm.doc, range.head, dir);
      else
        return dir < 0 ? range.from() : range.to();
    });
  }
  cmds[map['Alt-Left'] = 'goSubwordLeft'] = function (cm) {
    moveSubword(cm, -1);
  };
  cmds[map['Alt-Right'] = 'goSubwordRight'] = function (cm) {
    moveSubword(cm, 1);
  };
  var scrollLineCombo = mac ? 'Ctrl-Alt-' : 'Ctrl-';
  cmds[map[scrollLineCombo + 'Up'] = 'scrollLineUp'] = function (cm) {
    var info = cm.getScrollInfo();
    if (!cm.somethingSelected()) {
      var visibleBottomLine = cm.lineAtHeight(info.top + info.clientHeight, 'local');
      if (cm.getCursor().line >= visibleBottomLine)
        cm.execCommand('goLineUp');
    }
    cm.scrollTo(null, info.top - cm.defaultTextHeight());
  };
  cmds[map[scrollLineCombo + 'Down'] = 'scrollLineDown'] = function (cm) {
    var info = cm.getScrollInfo();
    if (!cm.somethingSelected()) {
      var visibleTopLine = cm.lineAtHeight(info.top, 'local') + 1;
      if (cm.getCursor().line <= visibleTopLine)
        cm.execCommand('goLineDown');
    }
    cm.scrollTo(null, info.top + cm.defaultTextHeight());
  };
  cmds[map['Shift-' + ctrl + 'L'] = 'splitSelectionByLine'] = function (cm) {
    var ranges = cm.listSelections(), lineRanges = [];
    for (var i = 0; i < ranges.length; i++) {
      var from = ranges[i].from(), to = ranges[i].to();
      for (var line = from.line; line <= to.line; ++line)
        if (!(to.line > from.line && line == to.line && to.ch == 0))
          lineRanges.push({
            anchor: line == from.line ? from : Pos(line, 0),
            head: line == to.line ? to : Pos(line)
          });
    }
    cm.setSelections(lineRanges, 0);
  };
  map['Shift-Tab'] = 'indentLess';
  cmds[map['Esc'] = 'singleSelectionTop'] = function (cm) {
    var range = cm.listSelections()[0];
    cm.setSelection(range.anchor, range.head, { scroll: false });
  };
  cmds[map[ctrl + 'L'] = 'selectLine'] = function (cm) {
    var ranges = cm.listSelections(), extended = [];
    for (var i = 0; i < ranges.length; i++) {
      var range = ranges[i];
      extended.push({
        anchor: Pos(range.from().line, 0),
        head: Pos(range.to().line + 1, 0)
      });
    }
    cm.setSelections(extended);
  };
  map['Shift-' + ctrl + 'K'] = 'deleteLine';
  function insertLine(cm, above) {
    cm.operation(function () {
      var len = cm.listSelections().length, newSelection = [], last = -1;
      for (var i = 0; i < len; i++) {
        var head = cm.listSelections()[i].head;
        if (head.line <= last)
          continue;
        var at = Pos(head.line + (above ? 0 : 1), 0);
        cm.replaceRange('\n', at, null, '+insertLine');
        cm.indentLine(at.line, null, true);
        newSelection.push({
          head: at,
          anchor: at
        });
        last = head.line + 1;
      }
      cm.setSelections(newSelection);
    });
  }
  cmds[map[ctrl + 'Enter'] = 'insertLineAfter'] = function (cm) {
    insertLine(cm, false);
  };
  cmds[map['Shift-' + ctrl + 'Enter'] = 'insertLineBefore'] = function (cm) {
    insertLine(cm, true);
  };
  function wordAt(cm, pos) {
    var start = pos.ch, end = start, line = cm.getLine(pos.line);
    while (start && CodeMirror.isWordChar(line.charAt(start - 1)))
      --start;
    while (end < line.length && CodeMirror.isWordChar(line.charAt(end)))
      ++end;
    return {
      from: Pos(pos.line, start),
      to: Pos(pos.line, end),
      word: line.slice(start, end)
    };
  }
  cmds[map[ctrl + 'D'] = 'selectNextOccurrence'] = function (cm) {
    var from = cm.getCursor('from'), to = cm.getCursor('to');
    var fullWord = cm.state.sublimeFindFullWord == cm.doc.sel;
    if (CodeMirror.cmpPos(from, to) == 0) {
      var word = wordAt(cm, from);
      if (!word.word)
        return;
      cm.setSelection(word.from, word.to);
      fullWord = true;
    } else {
      var text = cm.getRange(from, to);
      var query = fullWord ? new RegExp('\\b' + text + '\\b') : text;
      var cur = cm.getSearchCursor(query, to);
      if (cur.findNext()) {
        cm.addSelection(cur.from(), cur.to());
      } else {
        cur = cm.getSearchCursor(query, Pos(cm.firstLine(), 0));
        if (cur.findNext())
          cm.addSelection(cur.from(), cur.to());
      }
    }
    if (fullWord)
      cm.state.sublimeFindFullWord = cm.doc.sel;
  };
  var mirror = '(){}[]';
  function selectBetweenBrackets(cm) {
    var pos = cm.getCursor(), opening = cm.scanForBracket(pos, -1);
    if (!opening)
      return;
    for (;;) {
      var closing = cm.scanForBracket(pos, 1);
      if (!closing)
        return;
      if (closing.ch == mirror.charAt(mirror.indexOf(opening.ch) + 1)) {
        cm.setSelection(Pos(opening.pos.line, opening.pos.ch + 1), closing.pos, false);
        return true;
      }
      pos = Pos(closing.pos.line, closing.pos.ch + 1);
    }
  }
  cmds[map['Shift-' + ctrl + 'Space'] = 'selectScope'] = function (cm) {
    selectBetweenBrackets(cm) || cm.execCommand('selectAll');
  };
  cmds[map['Shift-' + ctrl + 'M'] = 'selectBetweenBrackets'] = function (cm) {
    if (!selectBetweenBrackets(cm))
      return CodeMirror.Pass;
  };
  cmds[map[ctrl + 'M'] = 'goToBracket'] = function (cm) {
    cm.extendSelectionsBy(function (range) {
      var next = cm.scanForBracket(range.head, 1);
      if (next && CodeMirror.cmpPos(next.pos, range.head) != 0)
        return next.pos;
      var prev = cm.scanForBracket(range.head, -1);
      return prev && Pos(prev.pos.line, prev.pos.ch + 1) || range.head;
    });
  };
  var swapLineCombo = mac ? 'Cmd-Ctrl-' : 'Shift-Ctrl-';
  cmds[map[swapLineCombo + 'Up'] = 'swapLineUp'] = function (cm) {
    var ranges = cm.listSelections(), linesToMove = [], at = cm.firstLine() - 1, newSels = [];
    for (var i = 0; i < ranges.length; i++) {
      var range = ranges[i], from = range.from().line - 1, to = range.to().line;
      newSels.push({
        anchor: Pos(range.anchor.line - 1, range.anchor.ch),
        head: Pos(range.head.line - 1, range.head.ch)
      });
      if (range.to().ch == 0 && !range.empty())
        --to;
      if (from > at)
        linesToMove.push(from, to);
      else if (linesToMove.length)
        linesToMove[linesToMove.length - 1] = to;
      at = to;
    }
    cm.operation(function () {
      for (var i = 0; i < linesToMove.length; i += 2) {
        var from = linesToMove[i], to = linesToMove[i + 1];
        var line = cm.getLine(from);
        cm.replaceRange('', Pos(from, 0), Pos(from + 1, 0), '+swapLine');
        if (to > cm.lastLine())
          cm.replaceRange('\n' + line, Pos(cm.lastLine()), null, '+swapLine');
        else
          cm.replaceRange(line + '\n', Pos(to, 0), null, '+swapLine');
      }
      cm.setSelections(newSels);
      cm.scrollIntoView();
    });
  };
  cmds[map[swapLineCombo + 'Down'] = 'swapLineDown'] = function (cm) {
    var ranges = cm.listSelections(), linesToMove = [], at = cm.lastLine() + 1;
    for (var i = ranges.length - 1; i >= 0; i--) {
      var range = ranges[i], from = range.to().line + 1, to = range.from().line;
      if (range.to().ch == 0 && !range.empty())
        from--;
      if (from < at)
        linesToMove.push(from, to);
      else if (linesToMove.length)
        linesToMove[linesToMove.length - 1] = to;
      at = to;
    }
    cm.operation(function () {
      for (var i = linesToMove.length - 2; i >= 0; i -= 2) {
        var from = linesToMove[i], to = linesToMove[i + 1];
        var line = cm.getLine(from);
        if (from == cm.lastLine())
          cm.replaceRange('', Pos(from - 1), Pos(from), '+swapLine');
        else
          cm.replaceRange('', Pos(from, 0), Pos(from + 1, 0), '+swapLine');
        cm.replaceRange(line + '\n', Pos(to, 0), null, '+swapLine');
      }
      cm.scrollIntoView();
    });
  };
  map[ctrl + '/'] = 'toggleComment';
  cmds[map[ctrl + 'J'] = 'joinLines'] = function (cm) {
    var ranges = cm.listSelections(), joined = [];
    for (var i = 0; i < ranges.length; i++) {
      var range = ranges[i], from = range.from();
      var start = from.line, end = range.to().line;
      while (i < ranges.length - 1 && ranges[i + 1].from().line == end)
        end = ranges[++i].to().line;
      joined.push({
        start: start,
        end: end,
        anchor: !range.empty() && from
      });
    }
    cm.operation(function () {
      var offset = 0, ranges = [];
      for (var i = 0; i < joined.length; i++) {
        var obj = joined[i];
        var anchor = obj.anchor && Pos(obj.anchor.line - offset, obj.anchor.ch), head;
        for (var line = obj.start; line <= obj.end; line++) {
          var actual = line - offset;
          if (line == obj.end)
            head = Pos(actual, cm.getLine(actual).length + 1);
          if (actual < cm.lastLine()) {
            cm.replaceRange(' ', Pos(actual), Pos(actual + 1, /^\s*/.exec(cm.getLine(actual + 1))[0].length));
            ++offset;
          }
        }
        ranges.push({
          anchor: anchor || head,
          head: head
        });
      }
      cm.setSelections(ranges, 0);
    });
  };
  cmds[map['Shift-' + ctrl + 'D'] = 'duplicateLine'] = function (cm) {
    cm.operation(function () {
      var rangeCount = cm.listSelections().length;
      for (var i = 0; i < rangeCount; i++) {
        var range = cm.listSelections()[i];
        if (range.empty())
          cm.replaceRange(cm.getLine(range.head.line) + '\n', Pos(range.head.line, 0));
        else
          cm.replaceRange(cm.getRange(range.from(), range.to()), range.from());
      }
      cm.scrollIntoView();
    });
  };
  map[ctrl + 'T'] = 'transposeChars';
  function sortLines(cm, caseSensitive) {
    var ranges = cm.listSelections(), toSort = [], selected;
    for (var i = 0; i < ranges.length; i++) {
      var range = ranges[i];
      if (range.empty())
        continue;
      var from = range.from().line, to = range.to().line;
      while (i < ranges.length - 1 && ranges[i + 1].from().line == to)
        to = range[++i].to().line;
      toSort.push(from, to);
    }
    if (toSort.length)
      selected = true;
    else
      toSort.push(cm.firstLine(), cm.lastLine());
    cm.operation(function () {
      var ranges = [];
      for (var i = 0; i < toSort.length; i += 2) {
        var from = toSort[i], to = toSort[i + 1];
        var start = Pos(from, 0), end = Pos(to);
        var lines = cm.getRange(start, end, false);
        if (caseSensitive)
          lines.sort();
        else
          lines.sort(function (a, b) {
            var au = a.toUpperCase(), bu = b.toUpperCase();
            if (au != bu) {
              a = au;
              b = bu;
            }
            return a < b ? -1 : a == b ? 0 : 1;
          });
        cm.replaceRange(lines, start, end);
        if (selected)
          ranges.push({
            anchor: start,
            head: end
          });
      }
      if (selected)
        cm.setSelections(ranges, 0);
    });
  }
  cmds[map['F9'] = 'sortLines'] = function (cm) {
    sortLines(cm, true);
  };
  cmds[map[ctrl + 'F9'] = 'sortLinesInsensitive'] = function (cm) {
    sortLines(cm, false);
  };
  cmds[map['F2'] = 'nextBookmark'] = function (cm) {
    var marks = cm.state.sublimeBookmarks;
    if (marks)
      while (marks.length) {
        var current = marks.shift();
        var found = current.find();
        if (found) {
          marks.push(current);
          return cm.setSelection(found.from, found.to);
        }
      }
  };
  cmds[map['Shift-F2'] = 'prevBookmark'] = function (cm) {
    var marks = cm.state.sublimeBookmarks;
    if (marks)
      while (marks.length) {
        marks.unshift(marks.pop());
        var found = marks[marks.length - 1].find();
        if (!found)
          marks.pop();
        else
          return cm.setSelection(found.from, found.to);
      }
  };
  cmds[map[ctrl + 'F2'] = 'toggleBookmark'] = function (cm) {
    var ranges = cm.listSelections();
    var marks = cm.state.sublimeBookmarks || (cm.state.sublimeBookmarks = []);
    for (var i = 0; i < ranges.length; i++) {
      var from = ranges[i].from(), to = ranges[i].to();
      var found = cm.findMarks(from, to);
      for (var j = 0; j < found.length; j++) {
        if (found[j].sublimeBookmark) {
          found[j].clear();
          for (var k = 0; k < marks.length; k++)
            if (marks[k] == found[j])
              marks.splice(k--, 1);
          break;
        }
      }
      if (j == found.length)
        marks.push(cm.markText(from, to, {
          sublimeBookmark: true,
          clearWhenEmpty: false
        }));
    }
  };
  cmds[map['Shift-' + ctrl + 'F2'] = 'clearBookmarks'] = function (cm) {
    var marks = cm.state.sublimeBookmarks;
    if (marks)
      for (var i = 0; i < marks.length; i++)
        marks[i].clear();
    marks.length = 0;
  };
  cmds[map['Alt-F2'] = 'selectBookmarks'] = function (cm) {
    var marks = cm.state.sublimeBookmarks, ranges = [];
    if (marks)
      for (var i = 0; i < marks.length; i++) {
        var found = marks[i].find();
        if (!found)
          marks.splice(i--, 0);
        else
          ranges.push({
            anchor: found.from,
            head: found.to
          });
      }
    if (ranges.length)
      cm.setSelections(ranges, 0);
  };
  map['Alt-Q'] = 'wrapLines';
  var cK = ctrl + 'K ';
  function modifyWordOrSelection(cm, mod) {
    cm.operation(function () {
      var ranges = cm.listSelections(), indices = [], replacements = [];
      for (var i = 0; i < ranges.length; i++) {
        var range = ranges[i];
        if (range.empty()) {
          indices.push(i);
          replacements.push('');
        } else
          replacements.push(mod(cm.getRange(range.from(), range.to())));
      }
      cm.replaceSelections(replacements, 'around', 'case');
      for (var i = indices.length - 1, at; i >= 0; i--) {
        var range = ranges[indices[i]];
        if (at && CodeMirror.cmpPos(range.head, at) > 0)
          continue;
        var word = wordAt(cm, range.head);
        at = word.from;
        cm.replaceRange(mod(word.word), word.from, word.to);
      }
    });
  }
  map[cK + ctrl + 'Backspace'] = 'delLineLeft';
  cmds[map['Backspace'] = 'smartBackspace'] = function (cm) {
    if (cm.somethingSelected())
      return CodeMirror.Pass;
    var cursor = cm.getCursor();
    var toStartOfLine = cm.getRange({
        line: cursor.line,
        ch: 0
      }, cursor);
    var column = CodeMirror.countColumn(toStartOfLine, null, cm.getOption('tabSize'));
    var indentUnit = cm.getOption('indentUnit');
    if (toStartOfLine && !/\S/.test(toStartOfLine) && column % indentUnit == 0) {
      var prevIndent = new Pos(cursor.line, CodeMirror.findColumn(toStartOfLine, column - indentUnit, indentUnit));
      // If no smart delete is happening (due to tab sizing) just do a regular delete
      if (prevIndent.ch == cursor.ch)
        return CodeMirror.Pass;
      return cm.replaceRange('', prevIndent, cursor, '+delete');
    } else {
      return CodeMirror.Pass;
    }
  };
  cmds[map[cK + ctrl + 'K'] = 'delLineRight'] = function (cm) {
    cm.operation(function () {
      var ranges = cm.listSelections();
      for (var i = ranges.length - 1; i >= 0; i--)
        cm.replaceRange('', ranges[i].anchor, Pos(ranges[i].to().line), '+delete');
      cm.scrollIntoView();
    });
  };
  cmds[map[cK + ctrl + 'U'] = 'upcaseAtCursor'] = function (cm) {
    modifyWordOrSelection(cm, function (str) {
      return str.toUpperCase();
    });
  };
  cmds[map[cK + ctrl + 'L'] = 'downcaseAtCursor'] = function (cm) {
    modifyWordOrSelection(cm, function (str) {
      return str.toLowerCase();
    });
  };
  cmds[map[cK + ctrl + 'Space'] = 'setSublimeMark'] = function (cm) {
    if (cm.state.sublimeMark)
      cm.state.sublimeMark.clear();
    cm.state.sublimeMark = cm.setBookmark(cm.getCursor());
  };
  cmds[map[cK + ctrl + 'A'] = 'selectToSublimeMark'] = function (cm) {
    var found = cm.state.sublimeMark && cm.state.sublimeMark.find();
    if (found)
      cm.setSelection(cm.getCursor(), found);
  };
  cmds[map[cK + ctrl + 'W'] = 'deleteToSublimeMark'] = function (cm) {
    var found = cm.state.sublimeMark && cm.state.sublimeMark.find();
    if (found) {
      var from = cm.getCursor(), to = found;
      if (CodeMirror.cmpPos(from, to) > 0) {
        var tmp = to;
        to = from;
        from = tmp;
      }
      cm.state.sublimeKilled = cm.getRange(from, to);
      cm.replaceRange('', from, to);
    }
  };
  cmds[map[cK + ctrl + 'X'] = 'swapWithSublimeMark'] = function (cm) {
    var found = cm.state.sublimeMark && cm.state.sublimeMark.find();
    if (found) {
      cm.state.sublimeMark.clear();
      cm.state.sublimeMark = cm.setBookmark(cm.getCursor());
      cm.setCursor(found);
    }
  };
  cmds[map[cK + ctrl + 'Y'] = 'sublimeYank'] = function (cm) {
    if (cm.state.sublimeKilled != null)
      cm.replaceSelection(cm.state.sublimeKilled, null, 'paste');
  };
  map[cK + ctrl + 'G'] = 'clearBookmarks';
  cmds[map[cK + ctrl + 'C'] = 'showInCenter'] = function (cm) {
    var pos = cm.cursorCoords(null, 'local');
    cm.scrollTo(null, (pos.top + pos.bottom) / 2 - cm.getScrollInfo().clientHeight / 2);
  };
  cmds[map['Shift-Alt-Up'] = 'selectLinesUpward'] = function (cm) {
    cm.operation(function () {
      var ranges = cm.listSelections();
      for (var i = 0; i < ranges.length; i++) {
        var range = ranges[i];
        if (range.head.line > cm.firstLine())
          cm.addSelection(Pos(range.head.line - 1, range.head.ch));
      }
    });
  };
  cmds[map['Shift-Alt-Down'] = 'selectLinesDownward'] = function (cm) {
    cm.operation(function () {
      var ranges = cm.listSelections();
      for (var i = 0; i < ranges.length; i++) {
        var range = ranges[i];
        if (range.head.line < cm.lastLine())
          cm.addSelection(Pos(range.head.line + 1, range.head.ch));
      }
    });
  };
  function getTarget(cm) {
    var from = cm.getCursor('from'), to = cm.getCursor('to');
    if (CodeMirror.cmpPos(from, to) == 0) {
      var word = wordAt(cm, from);
      if (!word.word)
        return;
      from = word.from;
      to = word.to;
    }
    return {
      from: from,
      to: to,
      query: cm.getRange(from, to),
      word: word
    };
  }
  function findAndGoTo(cm, forward) {
    var target = getTarget(cm);
    if (!target)
      return;
    var query = target.query;
    var cur = cm.getSearchCursor(query, forward ? target.to : target.from);
    if (forward ? cur.findNext() : cur.findPrevious()) {
      cm.setSelection(cur.from(), cur.to());
    } else {
      cur = cm.getSearchCursor(query, forward ? Pos(cm.firstLine(), 0) : cm.clipPos(Pos(cm.lastLine())));
      if (forward ? cur.findNext() : cur.findPrevious())
        cm.setSelection(cur.from(), cur.to());
      else if (target.word)
        cm.setSelection(target.from, target.to);
    }
  }
  ;
  cmds[map[ctrl + 'F3'] = 'findUnder'] = function (cm) {
    findAndGoTo(cm, true);
  };
  cmds[map['Shift-' + ctrl + 'F3'] = 'findUnderPrevious'] = function (cm) {
    findAndGoTo(cm, false);
  };
  cmds[map['Alt-F3'] = 'findAllUnder'] = function (cm) {
    var target = getTarget(cm);
    if (!target)
      return;
    var cur = cm.getSearchCursor(target.query);
    var matches = [];
    var primaryIndex = -1;
    while (cur.findNext()) {
      matches.push({
        anchor: cur.from(),
        head: cur.to()
      });
      if (cur.from().line <= target.from.line && cur.from().ch <= target.from.ch)
        primaryIndex++;
    }
    cm.setSelections(matches, primaryIndex);
  };
  map['Shift-' + ctrl + '['] = 'fold';
  map['Shift-' + ctrl + ']'] = 'unfold';
  map[cK + ctrl + '0'] = map[cK + ctrl + 'j'] = 'unfoldAll';
  map[ctrl + 'I'] = 'findIncremental';
  map['Shift-' + ctrl + 'I'] = 'findIncrementalReverse';
  map[ctrl + 'H'] = 'replace';
  map['F3'] = 'findNext';
  map['Shift-F3'] = 'findPrev';
  CodeMirror.sublimeKeyMap = map;
}));
(function () {
  'use strict';
  (function () {
    angular.module('raml', []).factory('ramlParser', function () {
      return RAML.Parser;
    });
    RAML.Settings = RAML.Settings || {};
  }());
  angular.module('ramlEditorApp', [
    'ui.bootstrap.modal',
    'ui.bootstrap.tpls',
    'ui.tree',
    'codeMirror',
    'fs',
    'raml',
    'stringFilters',
    'utils',
    'lightweightDOM',
    'splitter',
    'validate',
    'autoFocus',
    'rightClick',
    'dragAndDrop',
    'cfp.hotkeys',
    'firebase'
  ]).run([
    '$window',
    'hotkeys',
    function ($window, hotkeys) {
      // Adding proxy settings for api console
      $window.RAML.Settings.proxy = '/proxy/';
      $window.RAML.Settings.firebase = false;
      hotkeys.add({
        combo: 'mod+S',
        description: 'Save current file'
      });
      hotkeys.add({
        combo: 'shift+mod+S',
        description: 'Save All'
      });
      hotkeys.add({
        combo: 'mod+E',
        description: 'Extract to'
      });
      hotkeys.add({
        combo: 'mod + p',
        description: 'Show global search'
      });
      hotkeys.add({
        combo: 'Ctrl+Space',
        description: 'Start autocomplete'
      });
      hotkeys.add({
        combo: 'mod+/',
        description: 'Toggle Comment'
      });
      hotkeys.add({
        combo: 'shift+mod+A',
        description: 'Select Resource'
      });
      hotkeys.add({
        combo: 'mod+Ctrl+down',
        description: 'Swap line down'
      });
      hotkeys.add({
        combo: 'mod+Ctrl+up',
        description: 'Swap line up'
      });
      hotkeys.add({
        combo: 'mod+D',
        description: 'Select next occurrence'
      });
      hotkeys.add({
        combo: 'mod+K mod+K',
        description: 'Delete line right'
      });
      hotkeys.add({
        combo: 'mod+K mod+L',
        description: 'Down case at cursor'
      });
      hotkeys.add({
        combo: 'mod+K mod+U',
        description: 'Up case at cursor'
      });
      hotkeys.add({
        combo: 'mod+L',
        description: 'Select line'
      });
      // hotkeys.add({
      //   combo: 'shift+Alt+down',
      //   description: 'Select lines downward'
      // });
      // hotkeys.add({
      //   combo: 'shift+Alt+up',
      //   description: 'Select lines upward'
      // });
      hotkeys.add({
        combo: 'shift+mod+D',
        description: 'Duplicate line'
      });
      // hotkeys.add({
      //   combo: 'shift + Ctrl + T',
      //   description: 'toggleTheme'
      // });
      hotkeys.add({
        combo: 'shift+Tab',
        description: 'Indent less'
      });
      hotkeys.del('?');
    }
  ]).config([
    'hotkeysProvider',
    function (hotkeysProvider) {
      hotkeysProvider.templateTitle = 'Keyboard Shortcuts';
      var template = [
          '<div class="cfp-container" ng-class="{in: helpVisible}" style="display: none;">',
          '  <h4 class="cfp-hotkeys-title" ng-if="!header">{{ title }}</h4>',
          '  <div ng-bind-html="header" ng-if="header"></div>',
          '  <div>',
          '    <table>',
          '      <tbody>',
          '        <tr ng-repeat="hotkey in hotkeys | filter:{ description: \'!$$undefined$$\' }">',
          '          <td class="cfp-hotkeys-keys">',
          '            <span ng-repeat="key in hotkey.format() track by $index" class="cfp-hotkeys-key">{{ key }}</span>',
          '          </td>',
          '          <td class="cfp-hotkeys-text">{{ hotkey.description }}</td>',
          '        </tr>',
          '      </tbody>',
          '    </table>',
          '  </div>',
          '</div>',
          '<div class="cfp-overlay" ng-class="{in: helpVisible}" style="display: none;"></div>'
        ];
      hotkeysProvider.template = template.join('\n');
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
          ].indexOf(scope.$root && scope.$root.$$phase || scope.$$phase) !== -1) {
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
    '$q',
    function debounceFactory($timeout, $q) {
      /**
      * Ensures that a function will be called just once
      * after a period of time expires.
      *
      * @param {Function} target the function to debounce
      * @param {number} wait the wait delay in miliseconds
      */
      return function (target, wait) {
        var timeout = null;
        var deferred = $q.defer();
        return function () {
          var context = this;
          var args = arguments;
          var invokeTarget = function invokeTarget() {
            // call the target function, resolve the promise and reset local state for following calls
            timeout = null;
            deferred.resolve(target.apply(context, args));
            deferred = $q.defer();
          };
          // if timeout exists means that the function is being called again before the delay has finished
          // so we cancel the delayed execution in order to re-schedule it
          timeout && $timeout.cancel(timeout);
          // schedule (or re-schedule) the delayed execution
          timeout = $timeout(invokeTarget, wait);
          // return a promise that will be resolved when the target function is called
          return deferred.promise;
        };
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
    'generateSpaces',
    'generateTabs',
    'getFoldRange',
    'isArrayStarter',
    'getSpaceCount',
    'getTabCount',
    'config',
    'extractKeyValue',
    'eventEmitter',
    'getNode',
    'ramlEditorContext',
    'hotkeys',
    function (ramlHint, codeMirrorHighLight, generateSpaces, generateTabs, getFoldRange, isArrayStarter, getSpaceCount, getTabCount, config, extractKeyValue, eventEmitter, getNode, ramlEditorContext, hotkeys) {
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
        var spaceCount = line.length - line.replace(/\s+$/, '').length;
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
      var mac = CodeMirror.keyMap['default'] === CodeMirror.keyMap.macDefault;
      var ctrl = mac ? 'Cmd-' : 'Ctrl-';
      var swap = mac ? 'Cmd-Ctrl-' : 'Shift-Ctrl-';
      var defaultKeys = {
          'Shift-Ctrl-T': 'toggleTheme',
          'Shift-Tab': 'indentLess',
          'Ctrl-Space': 'autocomplete',
          'Shift-Alt-Up': CodeMirror.sublimeKeyMap['Shift-Alt-Up'],
          'Shift-Alt-Down': CodeMirror.sublimeKeyMap['Shift-Alt-Down'],
          'Ctrl-H': 'toggleCheatSheet'
        };
      var ramlKeys;
      defaultKeys[ctrl + 'S'] = 'save';
      defaultKeys['Shift-' + ctrl + 'S'] = 'saveAll';
      defaultKeys[ctrl + 'P'] = 'showOmniSearch';
      defaultKeys[ctrl + 'D'] = CodeMirror.sublimeKeyMap[ctrl + 'D'];
      defaultKeys[ctrl + 'L'] = CodeMirror.sublimeKeyMap[ctrl + 'L'];
      defaultKeys[swap + 'Up'] = CodeMirror.sublimeKeyMap[swap + 'Up'];
      defaultKeys[swap + 'Down'] = CodeMirror.sublimeKeyMap[swap + 'Down'];
      defaultKeys[ctrl + 'K ' + ctrl + 'K'] = CodeMirror.sublimeKeyMap[ctrl + 'K ' + ctrl + 'K'];
      defaultKeys[ctrl + 'K ' + ctrl + 'U'] = CodeMirror.sublimeKeyMap[ctrl + 'K ' + ctrl + 'U'];
      defaultKeys[ctrl + 'K ' + ctrl + 'L'] = CodeMirror.sublimeKeyMap[ctrl + 'K ' + ctrl + 'L'];
      defaultKeys['Shift-' + ctrl + 'D'] = CodeMirror.sublimeKeyMap['Shift-' + ctrl + 'D'];
      ramlKeys = angular.extend({}, defaultKeys);
      ramlKeys[ctrl + '/'] = 'toggleComment';
      ramlKeys[ctrl + 'E'] = 'extractTo';
      ramlKeys['Shift-' + ctrl + 'A'] = 'selectResource';
      CodeMirror.normalizeKeyMap(ramlKeys);
      CodeMirror.normalizeKeyMap(defaultKeys);
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
            if (line.replace(/\s+$/, '').slice(-1) === '|') {
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
          styleActiveLine: true,
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
        service.cm = cm;
        var charWidth = cm.defaultCharWidth();
        var basePadding = 4;
        cm.on('renderLine', function (cm, line, el) {
          var offset = CodeMirror.countColumn(line.text, null, cm.getOption('tabSize')) * charWidth;
          el.style.textIndent = '-' + offset + 'px';
          el.style.paddingLeft = basePadding + offset + 'px';
        });
        cm.on('mousedown', function (cm, event) {
          var target = event.target;
          if (target.className === 'cm-link') {
            var path = target.innerText.match(/!include(.*)/).pop().trim();
            eventEmitter.publish('event:editor:include', { path: path });
          }
        });
        cm.on('cursorActivity', function () {
          eventEmitter.publish('event:editor:context', {
            context: ramlEditorContext.context,
            cursor: cm.getCursor()
          });
        });
        cm.on('change', function (cm) {
          cm.operation(function () {
            ramlEditorContext.read(cm.getValue().split('\n'));
          });
        });
        cm.on('mousedown', function () {
          eventEmitter.publish('event:editor:click');
        });
        cm.on('focus', function (cm) {
          cm.operation(function () {
            if (Object.keys(ramlEditorContext.context).length > 0) {
              eventEmitter.publish('event:editor:context', {
                context: ramlEditorContext.context,
                cursor: cm.getCursor()
              });
            }
          });
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
          fallthrough: 'default'
        };
        function parseLine(line) {
          return isNaN(line) ? 0 : line - 1;
        }
        function scrollTo(position) {
          var cm = window.editor;
          var height = cm.getScrollInfo().clientHeight;
          var coords = cm.charCoords(position, 'local');
          cm.setCursor(position);
          cm.scrollTo(null, (coords.top + coords.bottom - height) / 2);
        }
        eventEmitter.subscribe('event:goToLine', function (search) {
          var position = {
              line: parseLine(search.line),
              ch: 0
            };
          if (search.focus) {
            window.editor.focus();
          }
          scrollTo(position);
        });
        eventEmitter.subscribe('event:goToResource', function (search) {
          var context = ramlEditorContext.context;
          var root = '/' + search.scope.split('/')[1];
          var metadata = context.metadata[root] || context.metadata[search.scope];
          var startAt = metadata.startAt;
          var endAt = metadata.endAt || context.content.length;
          var line = 0;
          var cm = window.editor;
          var path = null;
          var resource = search.text;
          if (search.text !== search.resource) {
            path = '';
            var fragments = search.scope.split('/');
            fragments = fragments.slice(1, fragments.length);
            for (var j = 0; j < fragments.length; j++) {
              var el = fragments[j];
              if (el !== resource) {
                path += '/' + el;
              }
              if (el === resource && search.index && search.index === j) {
                path += '/' + el;
                break;
              } else if (el === resource && search.index) {
                path += '/' + el;
              }
              if (!search.index && el === resource) {
                path += '/' + el;
                break;
              }
            }
          }
          path = path ? path : search.scope;
          for (var i = startAt; i <= endAt; i++) {
            if (context.scopes[i].indexOf(path) !== -1) {
              line = i;
              break;
            }
          }
          if (search.focus) {
            cm.focus();
          }
          scrollTo({
            line: line,
            ch: 0
          });
        });
        CodeMirror.commands.save = function save() {
          eventEmitter.publish('event:save');
        };
        CodeMirror.commands.autocomplete = function autocomplete(cm) {
          CodeMirror.showHint(cm, CodeMirror.hint.raml, { ghosting: true });
        };
        CodeMirror.commands.toggleTheme = function toggleTheme() {
          eventEmitter.publish('event:toggle-theme');
        };
        CodeMirror.commands.showOmniSearch = function showOmniSearch() {
          eventEmitter.publish('event:open:omnisearch');
        };
        CodeMirror.commands.extractTo = function extractTo(cm) {
          eventEmitter.publish('event:editor:extract-to', cm);
        };
        CodeMirror.commands.saveAll = function saveAll() {
          eventEmitter.publish('event:notification:save-all', { notify: true });
        };
        CodeMirror.commands.toggleCheatSheet = function toggleCheatSheet() {
          hotkeys.toggleCheatSheet();
        };
        CodeMirror.commands.selectResource = function selectResource(cm) {
          function getIndentation(str) {
            return str.match(/^\s*/)[0].length;
          }
          var context = ramlEditorContext.context;
          var line = cm.getCursor('from').line;
          var indentation = getIndentation(cm.getLine(line));
          var startLine = 0;
          var endLine = 0;
          var value, i, currentIdentation;
          for (i = line; i >= 0; i--) {
            value = cm.getLine(i);
            currentIdentation = getIndentation(value);
            if (currentIdentation < indentation) {
              startLine = i;
              break;
            }
          }
          for (i = line; i <= context.scopes.length - 1; i++) {
            value = cm.getLine(i);
            currentIdentation = getIndentation(value);
            if (currentIdentation < indentation) {
              endLine = i;
              break;
            }
          }
          if (endLine > 0) {
            var last = endLine - 1;
            cm.setSelection({
              line: startLine,
              ch: 0
            }, {
              line: last,
              ch: cm.getLine(last).length
            });
          }
        };
        function toggleComment(content) {
          if (content.replace(/\s/g, '').indexOf('#')) {
            content = '# ' + content;
          } else {
            content = content.replace(/# /g, '');
          }
          return content;
        }
        CodeMirror.commands.toggleComment = function (cm) {
          var selection = cm.getSelection();
          var currentLine = cm.getCursor().line;
          var content = cm.getLine(currentLine);
          if (selection.replace(/\s/g, '')) {
            var lines = selection.split('\n');
            for (var i = 0; i < lines.length; i++) {
              lines[i] = toggleComment(lines[i]);
            }
            cm.replaceSelection(lines.join('\n'));
          } else {
            cm.replaceRange(toggleComment(content), {
              line: currentLine,
              ch: 0
            }, {
              line: currentLine,
              ch: cm.getLine(currentLine).length
            });
          }
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
        marker.innerHtml = '&#x25cf; hola';
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
        var word = line.replace(/^\s+/, '');
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
        if (state.pair && stream.match(/(!include.*)/)) {
          return 'link';
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
    this.root = options.root || contents ? contents.startsWith('#%RAML 0.8') : undefined;
  }
  angular.module('fs', [
    'raml',
    'utils'
  ]).factory('ramlRepository', [
    '$q',
    'ramlSnippets',
    'fileSystem',
    'eventEmitter',
    function ($q, ramlSnippets, fileSystem, eventEmitter) {
      var service = {};
      var BASE_PATH = '/';
      var rootFile;
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
      function insertFileSystem(parent, child) {
        // This assumes the paths are correct.
        var before = parent.path === '/' ? [''] : parent.path.split('/');
        var parts = child.path.split('/').slice(0, -1);
        var promise = $q.when(parent);
        parts.slice(before.length).forEach(function (part) {
          promise = promise.then(function (parent) {
            var path = service.join(parent.path, part);
            var exists = service.getByPath(path);
            // If the current path already exists.
            if (exists) {
              if (!exists.isDirectory) {
                return $q.reject(new Error('Can not create directory, file already exists: ' + path));
              }
              return exists;
            }
            return service.createDirectory(parent, part);
          });
        });
        return promise.then(function (parent) {
          var exists = service.getByPath(child.path);
          if (exists) {
            if (exists.isDirectory && child.isDirectory) {
              return exists;
            }
            return $q.reject(new Error('Path already exists: ' + child.path));
          }
          parent.children.splice(findInsertIndex(child, parent), 0, child);
          return child;
        });
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
            return new RamlFile(file.path, file.content, {
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
          action.call(current, current);
        }
      };
      RamlDirectory.prototype.sortChildren = function sortChildren() {
        this.children.sort(sortingFunction);
      };
      // Expose the sorting function
      service.sortingFunction = sortingFunction;
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
        var path = service.join(parent.path, name);
        var directory = new RamlDirectory(path);
        var exists = service.getByPath(path);
        // If the file already exists, return it.
        if (exists) {
          return $q.when(exists);
        }
        return insertFileSystem(parent, directory).then(function () {
          return fileSystem.createFolder(directory.path);
        }).then(function () {
          return directory;
        });
      };
      service.generateDirectory = function createDirectory(parent, name) {
        return service.createDirectory(parent, name).then(function (directory) {
          eventEmitter.publish('event:raml-editor-directory-created', directory);
          return directory;
        });
      };
      // Loads the directory from the fileSystem into memory
      service.loadDirectory = function loadDirectory() {
        return fileSystem.directory(BASE_PATH).then(function (directory) {
          rootFile = new RamlDirectory(directory.path, directory.meta, directory.children);
          return rootFile;
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
          eventEmitter.publish('event:raml-editor-directory-removed', directory);
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
          eventEmitter.publish('event:raml-editor-filetree-modified', directory);
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
          eventEmitter.publish('event:raml-editor-filetree-modified', file);
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
          eventEmitter.publish('event:raml-editor-file-removed', file);
        });
      };
      service.createFile = function createFile(parent, name) {
        var path = service.join(parent.path, name);
        var file = new RamlFile(path);
        return insertFileSystem(parent, file).then(function () {
          eventEmitter.publish('event:raml-editor-file-created', file);
          return file;
        });
      };
      service.generateFile = function generateFile(parent, name, contents, stopPropagation) {
        return service.createFile(parent, name).then(function (file) {
          if (file.extension === 'raml') {
            file.contents = contents || ramlSnippets.getEmptyRaml();
          }
          if (!stopPropagation) {
            eventEmitter.publish('event:raml-editor-file-generated', file);
          }
          return file;
        });
      };
      // Gets the ramlDirectory/ramlFile object by path from the memory
      service.getByPath = function getByPath(path) {
        // Nothing to do if no path
        if (!path) {
          return;
        }
        if (path === '/') {
          return rootFile;
        }
        path = path.replace(/\/$/, '');
        var queue = rootFile.children.slice();
        var current;
        while (queue.length) {
          current = queue.shift();
          if (current.path === path) {
            return current;
          }
          if (current.isDirectory) {
            queue = queue.concat(current.children);
          }
        }
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
        var newPath = service.join(destination.path, target.name);
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
      // TODO: Check Mocking Service
      service.loadMeta = function loadMeta() {
      };
      service.join = function () {
        return Array.prototype.reduce.call(arguments, function (path, segment) {
          if (segment == null) {
            return path;
          }
          if (segment.charAt(0) === '/') {
            return segment;
          }
          return path.replace(/\/$/, '') + '/' + segment;
        }, '/');
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
  angular.module('ramlEditorApp').service('newFileService', [
    'ramlRepository',
    'newNameModal',
    'eventEmitter',
    function newFolderService(ramlRepository, newNameModal, eventEmitter) {
      var self = this;
      self.prompt = function prompt(target, prompTitle, proptMessage, contents, filename, stopPropagation) {
        var parent = target.isDirectory ? target : ramlRepository.getParent(target);
        var title = prompTitle || 'Add a new file';
        var message = proptMessage || 'Enter the path for the new file';
        var validations = [{
              message: 'That file name is already taken.',
              validate: function (input) {
                var path = ramlRepository.join(parent.path, input);
                return !ramlRepository.getByPath(path);
              }
            }];
        return newNameModal.open(message, filename || '', validations, title).then(function (name) {
          // Need to catch errors from `generateFile`, otherwise
          // `newNameModel.open` will error random modal close strings.
          return ramlRepository.generateFile(parent, name, contents, stopPropagation).then(function (file) {
            eventEmitter.publish('event:editor:new:file', { file: file });
            return file;
          }).catch(function (err) {
            return eventEmitter.publish('event:notification', {
              message: err.message,
              expires: true,
              level: 'error'
            });
          });
        });
      };
      return self;
    }
  ]);
  ;
}());
(function () {
  'use strict';
  angular.module('ramlEditorApp').service('newFolderService', [
    'ramlRepository',
    'newNameModal',
    function newFolderService(ramlRepository, newNameModal) {
      var self = this;
      self.prompt = function prompt(target) {
        var parent = target.isDirectory ? target : ramlRepository.getParent(target);
        var message = 'Enter the path for the new folder';
        var title = 'Add a new folder';
        var validations = [{
              message: 'That folder name is already taken.',
              validate: function (input) {
                var path = ramlRepository.join(parent.path, input);
                return !ramlRepository.getByPath(path);
              }
            }];
        return newNameModal.open(message, '', validations, title).then(function (name) {
          return ramlRepository.generateDirectory(parent, name);
        });
      };
      return self;
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
    '$window',
    '$q',
    '$prompt',
    '$timeout',
    'localStorageHelper',
    'FOLDER',
    function ($window, $q, $prompt, $timeout, localStorageHelper, FOLDER) {
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
          if (entry.path.indexOf(path + '/') === 0) {
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
            deferred.reject(new Error('Parent folder does not exists: ' + path));
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
          deferred.reject(new Error('Folder already exists: ' + path));
          return deferred.promise;
        }
        var parent = extractParentPath(path);
        if (!localStorageHelper.has(parent)) {
          deferred.reject(new Error('Parent folder does not exists: ' + path));
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
      service.exportFiles = function exportFiles() {
        var jszip = new $window.JSZip();
        localStorageHelper.forEach(function (item) {
          // Skip root folder
          if (item.path === '/') {
            return;
          }
          // Skip meta files
          if (item.name.slice(-5) === '.meta') {
            return;
          }
          var path = item.path.slice(1);
          // Remove starting slash
          item.type === 'folder' ? jszip.folder(path) : jszip.file(path, item.content);
        });
        var fileName = $prompt('Please enter a ZIP file name:', 'api.zip');
        fileName && $window.saveAs(jszip.generate({ type: 'blob' }), fileName);
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
  angular.module('ramlEditorApp').service('importModal', [
    '$modal',
    function importModal($modal) {
      var self = this;
      self.open = function open() {
        return $modal.open({
          templateUrl: 'views/import-modal.html',
          controller: 'ImportController'
        }).result;
        ;
      };
      return self;
    }
  ]).controller('ImportController', [
    '$scope',
    '$modalInstance',
    'swaggerToRAML',
    '$q',
    'importService',
    'ramlRepository',
    'eventEmitter',
    function ConfirmController($scope, $modalInstance, swaggerToRAML, $q, importService, ramlRepository, eventEmitter) {
      $scope.importing = false;
      $scope.rootDirectory = ramlRepository.getByPath('/');
      // Handles <input type="file" onchange="angular.element(this).scope().handleFileSelect(this)">
      // this workaroud for binding the input file to a model won't work for 1.3.x since scope isn't available in onchange
      $scope.handleFileSelect = function (element) {
        $scope.mode.value = element.files[0];
      };
      /**
       * Import files from the local filesystem.
       *
       * @param {Object} mode
       */
      function importFile(mode) {
        if (!$scope.fileSupported) {
          return eventEmitter.publish('event:notification', {
            message: 'File upload not supported. Try upgrading your browser.',
            expires: true,
            level: 'error'
          });
        }
        $scope.importing = true;
        return importService.mergeFile($scope.rootDirectory, mode.value).then(function () {
          return $modalInstance.close(true);
        }).catch(function (err) {
          eventEmitter.publish('event:notification', {
            message: err.message,
            expires: true,
            level: 'error'
          });
        }).finally(function () {
          $scope.importing = false;
        });
      }
      /**
       * Import a RAML file from a Swagger specification.
       */
      function importSwagger(mode) {
        $scope.importing = true;
        // Attempt to import from a Swagger definition.
        return swaggerToRAML.convert(mode.value).then(function (contents) {
          var filename = extractFileName(mode.value, 'raml');
          return importService.createFile($scope.rootDirectory, filename, contents);
        }).then(function () {
          return $modalInstance.close(true);
        }).catch(function (err) {
          eventEmitter.publish('event:notification', {
            message: 'Failed to import Swagger: ' + err.message,
            expires: true,
            level: 'error'
          });
        }).finally(function () {
          $scope.importing = false;
        });
      }
      function importSwaggerZip(mode) {
        $scope.importing = true;
        return swaggerToRAML.zip(mode.value).then(function (contents) {
          var filename = extractFileName(mode.value.name, 'raml');
          return importService.createFile($scope.rootDirectory, filename, contents);
        }).then(function () {
          return $modalInstance.close(true);
        }).catch(function (err) {
          eventEmitter.publish('event:notification', {
            message: 'Failed to parse Swagger: ' + err.message,
            expires: true,
            level: 'error'
          });
        }).finally(function () {
          $scope.importing = false;
        });
      }
      $scope.options = [
        {
          name: '.zip file',
          type: 'zip',
          callback: importFile
        },
        {
          name: 'Swagger spec',
          type: 'swagger',
          callback: importSwagger
        },
        {
          name: 'Swagger .zip',
          type: 'zip',
          callback: importSwaggerZip
        }
      ];
      $scope.mode = $scope.options[0];
      // Check whether file import is supported.
      $scope.fileSupported = !!(window.File && window.FileReader && window.FileList && window.Blob);
      /**
       * Import using either import modes.
       *
       * @param {Object} form
       */
      $scope.import = function (form) {
        form.$submitted = true;
        $scope.submittedType = $scope.mode.type;
        if (form.$invalid || $scope.importing) {
          return;
        }
        return $scope.mode.callback($scope.mode);
      };
      /**
       * Extract a useable filename from a path.
       *
       * @param  {String} path
       * @param  {String} [ext]
       * @return {String}
       */
      function extractFileName(path, ext) {
        var name = path.replace(/\/*$/, '');
        var index = name.lastIndexOf('/');
        if (index > -1) {
          name = name.substr(index);
        }
        if (ext) {
          name = name.replace(/\.[^\.]*$/, '') + '.' + ext;
        }
        return name;
      }
    }
  ]);
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
          animation: false,
          windowClass: 'modal in',
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
        if (value) {
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
/* global swaggerToRamlObject, ramlObjectToRaml */
(function () {
  'use strict';
  angular.module('ramlEditorApp').service('swaggerToRAML', [
    '$window',
    '$q',
    '$http',
    'importService',
    function swaggerToRAML($window, $q, $http, importService) {
      var self = this;
      var proxy = $window.RAML.Settings.proxy || '';
      function reader(filename, done) {
        if (!/^https?\:\/\//.test(filename)) {
          return done(new Error('Invalid file location: ' + filename));
        }
        return $http.get(filename, { transformResponse: false }).then(function (response) {
          return done(null, response.data);
        }).catch(function (err) {
          return done(new Error(err.data));
        });
      }
      function parseResult(deferred) {
        return function (err, result) {
          if (err) {
            return deferred.reject(err);
          }
          try {
            return deferred.resolve(ramlObjectToRaml(result));
          } catch (e) {
            return deferred.reject(e);
          }
        };
      }
      self.convert = function convert(url) {
        var deferred = $q.defer();
        swaggerToRamlObject(proxy + url, reader, parseResult(deferred));
        return deferred.promise;
      };
      self.zip = function zip(file) {
        var deferred = $q.defer();
        if (!importService.isZip(file)) {
          deferred.reject(new Error('Invalid zip file'));
        } else {
          importService.readFileAsText(file).then(function (contents) {
            var files = importService.parseZip(contents);
            swaggerToRamlObject.files(Object.keys(files), function (filename, done) {
              if (files.hasOwnProperty(filename)) {
                return done(null, files[filename]);
              }
              return reader(filename, done);
            }, parseResult(deferred));
          });
        }
        return deferred.promise;
      };
      return self;
    }
  ]);
}());
(function () {
  'use strict';
  angular.module('ramlEditorApp').service('importService', [
    '$q',
    '$window',
    'ramlRepository',
    'importServiceConflictModal',
    function importServiceFactory($q, $window, ramlRepository, importServiceConflictModal) {
      var self = this;
      /**
       * Merge a file with the specified directory.
       *
       * @param  {Object}  directory
       * @param  {File}    file
       * @return {Promise}
       */
      self.mergeFile = function (directory, file) {
        // Import every other file as normal.
        if (!self.isZip(file)) {
          return self.importFile(directory, file);
        }
        return self.readFileAsText(file).then(function (contents) {
          return self.mergeZip(directory, contents);
        });
      };
      /**
       * Merge files into the specified directory.
       *
       * @param  {Object}   directory
       * @param  {FileList} files
       * @return {Promise}
       */
      self.mergeFileList = function (directory, files) {
        var imports = Array.prototype.map.call(files, function (file) {
            return function () {
              return self.mergeFile(directory, file);
            };
          });
        return promiseChain(imports);
      };
      /**
       * Import a single entry into the file system.
       *
       * @param  {Object}                     directory
       * @param  {(DirectoryEntry|FileEntry)} entry
       * @return {Promise}
       */
      self.importEntry = function (directory, entry) {
        var deferred = $q.defer();
        if (entry.isFile) {
          entry.file(function (file) {
            var path = ramlRepository.join(directory.path, entry.fullPath);
            return importFileToPath(directory, path, file).then(deferred.resolve, deferred.reject);
          }, deferred.reject);
        } else {
          var reader = entry.createReader();
          reader.readEntries(function (entries) {
            var imports = entries.filter(function (entry) {
                return canImport(entry.name);
              }).map(function (entry) {
                return function () {
                  return self.importEntry(directory, entry);
                };
              });
            return promiseChain(imports).then(deferred.resolve, deferred.reject);
          });
        }
        return deferred.promise;
      };
      /**
       * Import a single item into the file system.
       *
       * @param  {Object}           directory
       * @param  {DataTransferItem} item
       * @return {Promise}
       */
      self.importItem = function (directory, item) {
        if (item.webkitGetAsEntry) {
          return self.importEntry(directory, item.webkitGetAsEntry());
        }
        return self.importFile(directory, item.getAsFile());
      };
      /**
       * Import a single file into the file system.
       *
       * @param  {Object}  directory
       * @param  {File}    file
       * @return {Promise}
       */
      self.importFile = function (directory, file) {
        return importFileToPath(directory, file.name, file);
      };
      /**
       * Import using an event object.
       *
       * @param  {Object}  directory
       * @param  {Object}  e
       * @return {Promise}
       */
      self.importFromEvent = function (directory, e) {
        // Handle items differently since Chrome has support for folders.
        if (e.dataTransfer.items) {
          return self.importItemList(directory, e.dataTransfer.items);
        }
        return self.importFileList(directory, e.dataTransfer.files);
      };
      /**
       * Import an array of items into the file system.
       *
       * @param  {Object}               directory
       * @param  {DataTransferItemList} items
       * @return {Promise}
       */
      self.importItemList = function (directory, items) {
        var imports = Array.prototype.map.call(items, function (item) {
            return function () {
              return self.importItem(directory, item);
            };
          });
        return promiseChain(imports);
      };
      /**
       * Import an array of files into the file system.
       *
       * @param  {Object}   directory
       * @param  {FileList} files
       * @return {Promise}
       */
      self.importFileList = function (directory, files) {
        var imports = Array.prototype.map.call(files, function (file) {
            return function () {
              return self.importFile(directory, file);
            };
          });
        return promiseChain(imports);
      };
      /**
       * Create a file in the filesystem.
       *
       * @param  {Object}  directory
       * @param  {String}  name
       * @param  {String}  contents
       * @return {Promise}
       */
      self.createFile = function (directory, name, contents) {
        return self.checkExistence(directory, name).then(function (option) {
          if (option === importServiceConflictModal.SKIP_FILE) {
            return;
          }
          if (option === importServiceConflictModal.KEEP_FILE) {
            var altname = altFilename(directory, name);
            return createFileFromContents(directory, altname, contents);
          }
          if (option === importServiceConflictModal.REPLACE_FILE) {
            var path = ramlRepository.join(directory.path, name);
            var file = ramlRepository.getByPath(path);
            file.doc.setValue(contents);
            return;
          }
          return createFileFromContents(directory, name, contents);
        });
      };
      /**
       * Create a directory in the filesystem.
       *
       * @param  {Object}  directory
       * @param  {String}  name
       * @return {Promise}
       */
      self.createDirectory = function (directory, name) {
        return ramlRepository.createDirectory(directory, name);
      };
      /**
       * Check whether a file exists and make a decision based on that.
       *
       * @param  {Object}  directory
       * @param  {String}  name
       * @return {Promise}
       */
      self.checkExistence = function (directory, name) {
        var path = ramlRepository.join(directory.path, name);
        if (!pathExists(path)) {
          return $q.when(null);
        }
        return importServiceConflictModal.open(path);
      };
      /**
       * Check whether a file is a zip.
       *
       * @param  {File}    file
       * @return {Boolean}
       */
      self.isZip = function (file) {
        // Can't check `file.type` as it's empty when read from a `FileEntry`.
        return /\.zip$/i.test(file.name);
      };
      /**
       * Read a file object as a text file.
       *
       * @param  {File}    file
       * @return {Promise}
       */
      self.readFileAsText = function (file) {
        var deferred = $q.defer();
        var reader = new $window.FileReader();
        reader.onload = function () {
          return deferred.resolve(reader.result);
        };
        reader.onerror = function () {
          return deferred.reject(reader.error);
        };
        reader.readAsArrayBuffer(file);
        return deferred.promise;
      };
      /**
       * Parse a ZIP file.
       *
       * @param  {String} contents
       * @return {Object}
       */
      self.parseZip = function (contents) {
        var zip = new $window.JSZip(contents);
        return sanitizeZipFiles(zip.files);
      };
      /**
       * Merge a zip with a directory in the file system.
       *
       * @param  {Object}  directory
       * @param  {String}  contents
       * @return {Promise}
       */
      self.mergeZip = function (directory, contents) {
        var files = removeCommonFilePrefixes(self.parseZip(contents));
        return importZipFiles(directory, files);
      };
      /**
       * Import a zip file into the current directory.
       *
       * @param  {Object}  directory
       * @param  {String}  contents
       * @return {Promise}
       */
      self.importZip = function (directory, contents) {
        var files = self.parseZip(contents);
        return importZipFiles(directory, files);
      };
      /**
       * Import a single file at specific path.
       *
       * @param  {Object}  directory
       * @param  {String}  path
       * @param  {File}    file
       * @return {Promise}
       */
      function importFileToPath(directory, path, file) {
        return self.readFileAsText(file).then(function (contents) {
          if (self.isZip(file)) {
            // Remove the zip file name from the end of the path.
            var dirname = path.replace(/[\\\/][^\\\/]*$/, '');
            return self.createDirectory(directory, dirname).then(function (directory) {
              return self.importZip(directory, contents);
            });
          }
          return self.createFile(directory, path, contents);
        });
      }
      /**
       * Import files from the zip object.
       *
       * @param  {Object}  directory
       * @param  {Object}  files
       * @return {Promise}
       */
      function importZipFiles(directory, files) {
        var imports = Object.keys(files).filter(canImport).map(function (name) {
            return function () {
              return self.createFile(directory, name, files[name]);
            };
          });
        return promiseChain(imports);
      }
      /**
       * Sanitize a zip file object and remove unwanted metadata.
       *
       * @param  {Object} originalFiles
       * @return {Object}
       */
      function sanitizeZipFiles(originalFiles) {
        var files = {};
        Object.keys(originalFiles).forEach(function (name) {
          if (/^__MACOSX\//.test(name) || /\/$/.test(name)) {
            return;
          }
          files[name] = originalFiles[name].asText();
        });
        return files;
      }
      /**
       * Remove the common file prefix from a files object.
       *
       * @param  {Object} prefixedFiles
       * @return {String}
       */
      function removeCommonFilePrefixes(prefixedFiles) {
        // Sort the file names in order of length to get the common prefix.
        var prefix = Object.keys(prefixedFiles).map(function (name) {
            if (!/[\\\/]/.test(name)) {
              return [];
            }
            return name.replace(/[\\\/][^\\\/]*$/, '').split(/[\\\/]/);
          }).reduce(function (prefix, name) {
            // Iterate over each part and check the prefix matches. If a part
            // does not match, return everything before it as the new prefix.
            for (var i = 0; i < prefix.length; i++) {
              if (name[i] !== prefix[i]) {
                return name.slice(0, i);
              }
            }
            return prefix;
          }).join('/');
        // Return the file object with the same file names.
        if (!prefix) {
          return angular.extend({}, prefixedFiles);
        }
        var files = {};
        // Iterate over the original files and create a new object.
        Object.keys(prefixedFiles).forEach(function (name) {
          var newName = name.substr(prefix.length + 1);
          // If no text is left, it must have been the root directory.
          if (newName) {
            files[newName] = prefixedFiles[name];
          }
        });
        return files;
      }
      /**
       * Check whether a certain file should be imported.
       *
       * @param  {String}  name
       * @return {Boolean}
       */
      function canImport(name) {
        return !/(?:^|[\/\\])\./.test(name);
      }
      /**
       * Check whether the path already exists.
       *
       * @param  {String}  path
       * @return {Boolean}
       */
      function pathExists(path) {
        return !!ramlRepository.getByPath(path);
      }
      /**
       * Create a file in the filesystem without checking prior existence.
       *
       * @param  {Object}  directory
       * @param  {String}  name
       * @param  {String}  contents
       * @return {Promise}
       */
      function createFileFromContents(directory, name, contents) {
        return ramlRepository.createFile(directory, name).then(function (file) {
          file.contents = contents;
          return file;
        });
      }
      /**
       * Generate an alternative file name for storage.
       *
       * @param  {Object} directory
       * @param  {String} name
       * @return {String}
       */
      function altFilename(directory, name) {
        var path;
        var index = 0;
        var extIndex = name.lastIndexOf('.');
        var basename = extIndex > -1 ? name.substr(0, extIndex) : name;
        var extension = extIndex > -1 ? name.substr(extIndex) : '';
        do {
          var filename = basename + '-' + ++index + extension;
          path = ramlRepository.join(directory.path, filename);
        } while (pathExists(path));
        return path;
      }
      /**
       * Chain promises one after another.
       *
       * @param  {Array}   promises
       * @return {Promise}
       */
      function promiseChain(promises) {
        return promises.reduce(function (promise, chain) {
          return promise.then(chain);
        }, $q.when());
      }
    }
  ]);
}());
(function () {
  'use strict';
  var SKIP_FILE = 0;
  var KEEP_FILE = 1;
  var REPLACE_FILE = 2;
  angular.module('ramlEditorApp').service('importServiceConflictModal', [
    '$modal',
    function newNameModal($modal) {
      var self = this;
      self.open = function open(path) {
        return $modal.open({
          backdrop: 'static',
          templateUrl: 'views/import-service-conflict-modal.html',
          controller: 'ImportServiceConflictModal',
          resolve: {
            path: function pathResolver() {
              return path;
            }
          }
        }).result;
      };
      self.KEEP_FILE = KEEP_FILE;
      self.SKIP_FILE = SKIP_FILE;
      self.REPLACE_FILE = REPLACE_FILE;
      return self;
    }
  ]).controller('ImportServiceConflictModal', [
    '$scope',
    '$modalInstance',
    'path',
    function ImportServiceConflictModal($scope, $modalInstance, path) {
      $scope.path = path;
      $scope.skip = function () {
        $modalInstance.close(SKIP_FILE);
      };
      $scope.keep = function () {
        $modalInstance.close(KEEP_FILE);
      };
      $scope.replace = function () {
        $modalInstance.close(REPLACE_FILE);
      };
    }
  ]);
}());
(function () {
  'use strict';
  angular.module('ramlEditorApp').factory('eventEmitter', function eventEmitter() {
    var self = this;
    var events = {};
    self.publish = function publish(eventName, data) {
      if (!events[eventName] || events[eventName].length < 1) {
        return;
      }
      events[eventName].forEach(function (listener) {
        listener(data || {});
      });
    };
    self.subscribe = function subscribe(eventName, listener) {
      if (!events[eventName]) {
        events[eventName] = [];
      }
      events[eventName].push(listener);
    };
    return self;
  });
  ;
}());
(function () {
  'use strict';
  angular.module('ramlEditorApp').factory('ramlEditorContext', [
    'ramlParser',
    'ramlParserFileReader',
    function ramlEditorContext(ramlParser, ramlParserFileReader) {
      var self = this;
      function getIndentation(str) {
        return str.match(/^\s*/)[0].length;
      }
      function readRamlHeader(lines) {
        var template = new RegExp('^/.*:$');
        var temp = [];
        for (var i = 0; i < lines.length; i++) {
          var line = lines[i];
          if (!template.test(line)) {
            temp.push(line);
          } else {
            break;
          }
        }
        return temp.join('\n');
      }
      self.context = {};
      self.read = function read(lines) {
        var template = new RegExp('^/.*:$');
        var path = [lines[0]];
        var indentation = getIndentation(lines[0]);
        var resource, root;
        var linesScope = new Array(lines.length);
        var resourceMeta = {};
        var resources = {};
        lines.forEach(function (line, index) {
          resource = line.trim();
          if (line.startsWith('/')) {
            if (root !== resource && resourceMeta[root]) {
              resourceMeta[root].endAt = index;
            }
            root = resource;
            resourceMeta[root] = {
              raml: { raw: '' },
              startAt: index
            };
            path = [line];
          }
          if (resourceMeta[root]) {
            resourceMeta[root].raml.raw += line + '\n';
          }
          if (template.test(resource)) {
            if (indentation === getIndentation(line)) {
              path.pop();
            }
            if (getIndentation(line) < indentation) {
              path = path.slice(0, path.length - 2);
            }
            if (path.filter(function (el) {
                return el.trim() === resource;
              }).length === 0) {
              path.push(resource);
            }
            indentation = getIndentation(line);
            linesScope[index] = path.join('');
            resources[path.join('')] = null;
          }
          linesScope[index] = path.join('');
        });
        self.context = {
          scopes: linesScope,
          metadata: resourceMeta,
          resources: Object.keys(resources),
          content: lines,
          ramlHeader: { raw: readRamlHeader(lines) }
        };
        var options = {
            validate: true,
            transform: true,
            compose: true,
            reader: ramlParserFileReader
          };
        ramlParser.load(self.context.ramlHeader.raw, null, options).then(function (data) {
          self.context.ramlHeader.compiled = data;
        });
        Object.keys(resourceMeta).map(function (resource) {
          var raml = [self.context.ramlHeader.raw];
          ramlParser.load(raml.concat(resourceMeta[resource].raml.raw).join('\n'), null, options).then(function (data) {
            resourceMeta[resource].raml.compiled = data;
          });
        });
      };
      return self;
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
      function loadFile(path) {
        return ramlRepository.loadFile({ path: path }).then(function success(file) {
          return file.contents;
        });
      }
      function readLocFile(path) {
        var file = ramlRepository.getByPath(path);
        if (file) {
          return file.loaded ? $q.when(file.contents) : loadFile(path);
        }
        return $q.reject('File with path "' + path + '" does not exist');
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
        return /^https?:\/\//.test(file) ? readExtFile(file) : readLocFile(file);
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
    'codeMirror',
    'codeMirrorErrors',
    'config',
    '$prompt',
    '$confirm',
    '$modal',
    'eventEmitter',
    'ramlEditorContext',
    'newFileService',
    '$firebaseObject',
    'hotkeys',
    function (UPDATE_RESPONSIVENESS_INTERVAL, $scope, $rootScope, $timeout, $window, safeApply, safeApplyWrapper, debounce, throttle, ramlHint, ramlParser, ramlParserFileReader, ramlRepository, codeMirror, codeMirrorErrors, config, $prompt, $confirm, $modal, eventEmitter, ramlEditorContext, newFileService, $firebaseObject, hotkeys) {
      /// Firebase
      if ($window.RAML.Settings.firebase) {
        $scope.cliendId = Math.round(Math.random() * 100000000);
        var url = 'https://vivid-heat-7827.firebaseio.com/';
        var fireRef = new Firebase(url);
        var syncObject = $firebaseObject(fireRef.child('contents'));
        syncObject.$bindTo($scope, 'data');
        $scope.$watch('data', function () {
          if ($scope.fileBrowser && $scope.fileBrowser.selectedFile) {
            var file = $scope.fileBrowser.selectedFile;
            var filename = file.name.split('.')[0][0];
            if ($scope.data && $scope.data.contents && $scope.data.contents[filename] != null && $scope.data.contents[filename] !== editor.getValue() && $scope.cliendId !== $scope.data.id) {
              editor.setValue($scope.data.contents[filename]);
            }
          }
        });
      }
      ///
      $scope.rightBarCollapsed = true;
      $scope.toggleRightBar = function toggleRightBar() {
        $scope.rightBarCollapsed = !$scope.rightBarCollapsed;
      };
      $scope.activeMode = 'source';
      $scope.setMode = function setMode(mode) {
        $scope.activeMode = mode;
      };
      $scope.isActive = function isActive(mode) {
        return $scope.activeMode === mode;
      };
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
      eventEmitter.subscribe('event:raml-editor-file-selected', function onFileSelected(file) {
        currentFile = file;
        // Empty console so that we remove content from previous open RAML file
        eventEmitter.publish('event:raml-parsed', {});
        $scope.originalValue = file.contents;
        var dataContent = file.contents;
        if ($window.RAML.Settings.firebase) {
          var filename = file.name.replace('.')[0][0];
          $scope.data = {};
          $scope.data.contents = { id: $scope.cliendId };
          $scope.data.contents[filename] = file.contents;
          dataContent = $scope.data.contents[filename];
        }
        $scope.currentFile = file;
        // Every file must have a unique document for history and cursors.
        if (!file.doc) {
          file.doc = new CodeMirror.Doc(dataContent);
        }
        ramlEditorContext.read(dataContent.split('\n'));
        editor.swapDoc(file.doc);
        editor.focus();
        // After swapping the doc, configure the editor for the current file
        // extension.
        codeMirror.configureEditor(editor, file.extension);
        $scope.fileParsable = $scope.getIsFileParsable(file);
        // Inform the editor source has changed. This is also called when the
        // editor triggers the change event, swapping the doc does not trigger
        // that event, so we must explicitly call the sourceUpdated function.
        $scope.sourceUpdated();
      });
      $scope.$watch('fileBrowser.selectedFile.contents', function (contents) {
        if (contents != null && contents !== editor.getValue()) {
          var filename = $scope.fileBrowser.selectedFile.name.replace('.')[0][0];
          var dataContent = contents;
          if ($window.RAML.Settings.firebase) {
            dataContent = $scope.data.contents[filename];
          }
          currentFile.doc = new CodeMirror.Doc(dataContent);
          editor.swapDoc(currentFile.doc);
        }
      });
      var updateFile = debounce(function updateFile() {
          eventEmitter.publish('event:file-updated');
        }, config.get('updateResponsivenessInterval', UPDATE_RESPONSIVENESS_INTERVAL));
      eventEmitter.subscribe('event:raml-editor-file-created', updateFile);
      eventEmitter.subscribe('event:raml-editor-file-removed', updateFile);
      eventEmitter.subscribe('event:raml-editor-file-removed', function onFileSelected(file) {
        if (currentFile === file) {
          currentFile = undefined;
          editor.swapDoc(new CodeMirror.Doc(''));
        }
      });
      $scope.canExportFiles = function canExportFiles() {
        return ramlRepository.canExport();
      };
      $scope.supportsFolders = ramlRepository.supportsFolders;
      $scope.sourceUpdated = function sourceUpdated() {
        var source = editor.getValue();
        var selectedFile = $scope.fileBrowser.selectedFile;
        selectedFile.contents = source;
        if ($window.RAML.Settings.firebase) {
          var filename = selectedFile.name.replace('.')[0][0];
          $scope.data.contents = { id: $scope.cliendId };
          $scope.data.contents[filename] = source;
        }
        $scope.clearErrorMarks();
        $scope.fileParsable = $scope.getIsFileParsable(selectedFile);
        eventEmitter.publish('event:editor:include', {});
        updateFile();
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
      eventEmitter.subscribe('event:file-updated', function onFileUpdated() {
        $scope.clearErrorMarks();
        var file = $scope.fileBrowser.selectedFile;
        if (!file || !$scope.fileParsable || file.contents.trim() === '') {
          $scope.currentError = undefined;
          lineOfCurrentError = undefined;
          return;
        }
        $scope.loadRaml(file.contents, file.path).then(safeApplyWrapper($scope, function success(value) {
          // hack: we have to make a full copy of an object because console modifies
          // it later and makes it unusable for mocking service
          $scope.fileBrowser.selectedFile.raml = angular.copy(value);
          eventEmitter.publish('event:raml-parsed', value);
        }), safeApplyWrapper($scope, function failure(error) {
          eventEmitter.publish('event:raml-parser-error', error);
        }));
      });
      eventEmitter.subscribe('event:raml-parsed', safeApplyWrapper($scope, function onRamlParser(raml) {
        $scope.title = raml.title;
        $scope.version = raml.version;
        $scope.currentError = undefined;
        lineOfCurrentError = undefined;
      }));
      eventEmitter.subscribe('event:raml-parser-error', safeApplyWrapper($scope, function onRamlParserError(error) {
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
      eventEmitter.subscribe('event:editor:extract-to', safeApplyWrapper($scope, function extractTo(cm) {
        var message = 'Extract to';
        var contents = cm.getSelection();
        var key = contents.split(':');
        var filename, last;
        if (key.length > 1) {
          key = key[0];
          filename = (key + '.raml').replace(/\s/g, '');
          contents = contents.replace(key + ':', '');
          last = cm.getCursor('to').line;
          if (cm.getCursor('to').xRel === 0) {
            last = cm.getCursor('to').line - 1;
          }
          cm.setSelection(cm.getCursor('from'), {
            line: last,
            ch: cm.getLine(last).length
          });
          return newFileService.prompt($scope.homeDirectory, 'Extract to', message, contents, filename, true).then(function (result) {
            if (filename) {
              cm.replaceSelection(key + ': !include ' + result.path);
            }
            eventEmitter.publish('event:notification:save-all', { notify: false });
          });
        }
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
        if ($scope.mockingServiceDisabled || !$scope.fileParsable) {
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
        if ($scope.tryIt && $scope.tryIt.enabled && $scope.tryIt.selectedMethod) {
          return true;
        }
        return false;
      };
      $scope.toggleShelf = function toggleShelf() {
        $scope.shelf.collapsed = !$scope.shelf.collapsed;
        config.set('shelf.collapsed', $scope.shelf.collapsed);
      };
      $scope.getSelectedFileAbsolutePath = function getSelectedFileAbsolutePath() {
        return extractCurrentFileLabel(currentFile);
      };
      eventEmitter.subscribe('event:toggle-theme', function onToggleTheme() {
        $window.setTheme($scope.theme === 'dark' ? 'light' : 'dark');
      });
      $scope.mainClick = function mainClick($event) {
        if ($event.target.parentElement.className.indexOf('omnisearch') === -1) {
          $scope.omnisearch.close();
        }
      };
      $scope.openOmnisearch = function openOmnisearch(e) {
        e.preventDefault();
        $scope.omnisearch.open();
      };
      $scope.toggleCheatSheet = function toggleCheatSheet() {
        hotkeys.toggleCheatSheet();
      };
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
        editor.on('change', function onChange(cm) {
          safeApplyWrapper($scope, function () {
            var file = $scope.fileBrowser.selectedFile;
            var orig = $scope.originalValue;
            var current = cm.getValue();
            file.dirty = orig !== current;
            $scope.workingFiles[file.name] = file;
            $scope.sourceUpdated();
          })();
        });
        eventEmitter.subscribe('event:editor:new:file', safeApplyWrapper($scope, function (data) {
          var file = data.file;
          $scope.workingFiles[file.name] = file;
        }));
        eventEmitter.subscribe('event:editor:remove:file', safeApplyWrapper($scope, function (data) {
          var file = data.file;
          delete $scope.workingFiles[file.name];
        }));
        $window.alreadyNotifiedExit = false;
        $window.editorFilesystemIsDirty = function editorFilesystemIsDirty() {
          var dirtyFile = false;
          $scope.homeDirectory.forEachChildDo(function (t) {
            dirtyFile = t.dirty || dirtyFile;
          });
          return dirtyFile;
        };
        // Warn before leaving the page
        $window.onbeforeunload = function () {
          if (!$window.alreadyNotifiedExit && $window.editorFilesystemIsDirty()) {
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
            ch: node.line.replace(/\s+$/, '').length
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
    '$scope',
    '$timeout',
    'eventEmitter',
    function (NOTIFICATION_TIMEOUT, $scope, $timeout, eventEmitter) {
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
      eventEmitter.subscribe('event:notification', function (args) {
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
      function getMinWidth(splitter) {
        return splitter.attr('ng-splitter-min-width');
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
        var minWidth = getMinWidth(splitter);
        if (typeof minWidth === 'undefined' || size >= minWidth) {
          getCollapseTargetEl(splitter).css('min-width', Math.max(0, size) + 'px');
        }
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
  angular.module('validate', []).directive('ngValidate', [
    '$parse',
    function ($parse) {
      return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelController) {
          var fn = $parse(attrs.ngValidate);
          scope.$watch(attrs.ngModel, function (value) {
            var validity = fn(scope, { $value: value });
            ngModelController.$setValidity('validate', validity);
          });
        }
      };
    }
  ]);
}());
(function () {
  'use strict';
  angular.module('autoFocus', []).directive('ngAutoFocus', [
    '$timeout',
    function ($timeout) {
      return {
        link: function (scope, element, attrs) {
          scope.$watch(attrs.ngAutoFocus, function (value) {
            if (!value) {
              return;
            }
            $timeout(function () {
              element[0].focus();
            });
          });
        }
      };
    }
  ]);
}());
(function () {
  'use strict';
  angular.module('rightClick', []).directive('ngRightClick', [
    '$parse',
    function ($parse) {
      return function (scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.on('contextmenu', function (e) {
          scope.$apply(function () {
            e.preventDefault();
            fn(scope, { $event: e });
          });
        });
      };
    }
  ]);
}());
(function () {
  'use strict';
  angular.module('ramlEditorApp').directive('ramlEditor', function () {
    return {
      restrict: 'E',
      scope: { mockingServiceDisabled: '=' },
      templateUrl: 'views/raml-editor-main.tmpl.html',
      controller: 'ramlEditorMain'
    };
  });
  ;
}());
(function () {
  'use strict';
  angular.module('dragAndDrop', []).directive('ngDragEnter', [
    '$parse',
    function ($parse) {
      return function (scope, element, attrs) {
        var fn = $parse(attrs.ngDragEnter);
        var entered = 0;
        element.on('dragleave', function () {
          entered--;
        });
        element.on('dragenter', function (e) {
          entered++;
          if (entered !== 1) {
            return;
          }
          scope.$apply(function () {
            e.preventDefault();
            fn(scope, { $event: e });
          });
        });
      };
    }
  ]).directive('ngDragLeave', [
    '$parse',
    function ($parse) {
      return function (scope, element, attrs) {
        var fn = $parse(attrs.ngDragLeave);
        var entered = 0;
        element.on('dragenter', function () {
          entered++;
        });
        element.on('dragleave', function (e) {
          entered--;
          if (entered !== 0) {
            return;
          }
          scope.$apply(function () {
            e.preventDefault();
            fn(scope, { $event: e });
          });
        });
      };
    }
  ]).directive('ngDrop', [
    '$parse',
    function ($parse) {
      return function (scope, element, attrs) {
        var fn = $parse(attrs.ngDrop);
        element.on('dragover', function (e) {
          e.preventDefault();
        });
        element.on('drop', function (e) {
          scope.$apply(function () {
            e.preventDefault();
            e.stopPropagation();
            fn(scope, { $event: e });
          });
        });
      };
    }
  ]);
}());
(function () {
  'use strict';
  angular.module('ramlEditorApp').directive('ramlEditorContextMenu', [
    '$injector',
    '$window',
    'confirmModal',
    'eventEmitter',
    'newNameModal',
    'ramlRepository',
    'newFileService',
    'newFolderService',
    'scroll',
    function ramlEditorContextMenu($injector, $window, confirmModal, eventEmitter, newNameModal, ramlRepository, newFileService, newFolderService, scroll) {
      function createActions(target) {
        var saveAction = {
            label: 'Save',
            execute: function execute() {
              return ramlRepository.saveFile(target);
            }
          };
        var newFileAction = {
            label: 'New File',
            execute: function execute() {
              return newFileService.prompt(target);
            }
          };
        var newFolderAction = {
            label: 'New Folder',
            execute: function execute() {
              return newFolderService.prompt(target);
            }
          };
        var renameAction = {
            label: 'Rename',
            execute: function execute() {
              var parent = ramlRepository.getParent(target);
              var message = target.isDirectory ? 'Enter a new name for this folder:' : 'Enter a new name for this file:';
              var title = target.isDirectory ? 'Rename a folder' : 'Rename a file';
              var validations = [{
                    message: 'This name is already taken.',
                    validate: function validate(input) {
                      var path = ramlRepository.join(parent.path, input);
                      return !ramlRepository.getByPath(path);
                    }
                  }];
              return newNameModal.open(message, target.name, validations, title).then(function (name) {
                ramlRepository.rename(target, name);
              });
              ;
            }
          };
        var deleteAction = {
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
              return confirmModal.open(message, title).then(function () {
                eventEmitter.publish('event:editor:remove:file', { file: target });
                return ramlRepository.remove(target);
              });
              ;
            }
          };
        if (target.isDirectory) {
          return [
            newFileAction,
            newFolderAction,
            renameAction,
            deleteAction
          ];
        }
        return [
          saveAction,
          renameAction,
          deleteAction
        ];
      }
      function outOfWindow(el) {
        var rect = el.getBoundingClientRect();
        return !(rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth));
      }
      return {
        restrict: 'E',
        templateUrl: 'views/raml-editor-context-menu.tmpl.html',
        link: function link(scope, element) {
          function positionMenu(element, event) {
            var top = event.pageY;
            var left = event.pageX;
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
                positionMenu(element, event);
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
    '$timeout',
    'config',
    'ramlRepository',
    'newNameModal',
    'importService',
    'eventEmitter',
    function ($q, $window, $timeout, config, ramlRepository, newNameModal, importService, eventEmitter) {
      function Controller($scope) {
        var fileBrowser = this;
        var contextMenu = void 0;
        eventEmitter.subscribe('event:editor:include', function (data) {
          var path = data.path;
          $scope.homeDirectory.forEachChildDo(function (child) {
            if (!child.isDirectory) {
              if (child.path.indexOf(path) !== -1) {
                fileBrowser.selectFile(child);
                return;
              }
            }
          });
        });
        $scope.projectExplorerExpanded = true;
        $scope.toggleProjectExplorer = function toggleProjectExplorer() {
          $scope.projectExplorerExpanded = !$scope.projectExplorerExpanded;
        };
        $scope.workingFilesExpanded = false;
        $scope.toggleWorkingFiles = function toggleWorkingFiles() {
          $scope.workingFilesExpanded = Object.keys($scope.workingFiles).length === 0 ? false : !$scope.workingFilesExpanded;
        };
        $scope.$watchCollection(function (scope) {
          return scope.workingFiles;
        }, function (newValue) {
          $scope.workingFilesExpanded = true;
          if (Object.keys(newValue).length === 0) {
            $scope.workingFilesExpanded = false;
          }
        });
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
                return fileBrowser.select(source);
              });
            },
            dragStop: function (event) {
              // when drag is stopped or canceled, reset the cursor
              fileBrowser.cursorState = '';
              if (!event.canceled && duplicateName) {
                eventEmitter.publish('event:notification', {
                  message: 'Failed: duplicate file name found in the destination folder.',
                  expires: true,
                  level: 'error'
                });
              }
            }
          };
        }();
        $scope.workingFiles = {};
        fileBrowser.close = function close(target) {
          delete $scope.workingFiles[target.name];
        };
        fileBrowser.isEmpty = function (obj) {
          return Object.keys(obj).length === 0;
        };
        fileBrowser.dblClick = function dblClick(target) {
          if (!target.isDirectory) {
            $scope.workingFiles[target.name] = target;
          }
        };
        fileBrowser.select = function select(target) {
          if (target.isDirectory) {
            return fileBrowser.selectDirectory(target);
          }
          return fileBrowser.selectFile(target);
        };
        fileBrowser.selectFile = function selectFile(file) {
          // If we select a file that is already active, just modify 'currentTarget', no load needed
          if (fileBrowser.selectedFile && fileBrowser.selectedFile.$$hashKey === file.$$hashKey) {
            fileBrowser.currentTarget = file;
            return;
          }
          var isLoaded = file.loaded || !file.persisted;
          var afterLoading = isLoaded ? $q.when(file) : ramlRepository.loadFile(file);
          afterLoading.then(function (file) {
            fileBrowser.selectedFile = fileBrowser.currentTarget = file;
            eventEmitter.publish('event:raml-editor-file-selected', file);
          });
          ;
        };
        fileBrowser.selectDirectory = function selectDirectory(directory) {
          eventEmitter.publish('event:raml-editor-directory-selected', directory);
        };
        /**
         * This function is used for expanding all the ancestors of a target
         * node in the file tree.
         *
         * @param target {RamlDirectory/RamlFile}
         */
        function expandAncestors(target) {
          // stop at the top-level directory
          if (target.path === '/') {
            return;
          }
          var parent = ramlRepository.getParent(target);
          parent.collapsed = false;
          expandAncestors(parent);
        }
        fileBrowser.saveFile = function saveFile(file) {
          ramlRepository.saveFile(file);
          // .then(function () {
          //   // return eventEmitter.publish('event:notification', {
          //   //   message: 'File saved.',
          //   //   expires: true
          //   // });
          // })
          ;
        };
        fileBrowser.dropFile = function dropFile(directory) {
          return importService.importFromEvent(directory, event).then(function () {
            directory.collapsed = false;
          }).catch(function (err) {
            eventEmitter.publish('event:notification', {
              message: err.message,
              expires: true,
              level: 'error'
            });
          });
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
        eventEmitter.subscribe('event:raml-editor-file-generated', function (file) {
          fileBrowser.selectFile(file);
        });
        eventEmitter.subscribe('event:raml-editor-directory-created', function (dir) {
          fileBrowser.selectDirectory(dir);
        });
        eventEmitter.subscribe('event:raml-editor-file-selected', function (file) {
          expandAncestors(file);
        });
        eventEmitter.subscribe('event:raml-editor-directory-selected', function (dir) {
          expandAncestors(dir);
        });
        eventEmitter.subscribe('event:raml-editor-filetree-modified', function (target) {
          var parent = ramlRepository.getParent(target);
          parent.sortChildren();
        });
        eventEmitter.subscribe('event:raml-editor-file-removed', function (file) {
          $timeout(function () {
            var files = $scope.homeDirectory.getFiles();
            if (files.length === 0) {
              promptWhenFileListIsEmpty();
            } else if (file === fileBrowser.selectedFile) {
              fileBrowser.selectFile(files[0]);
            }
          });
        });
        eventEmitter.subscribe('$destroy', function () {
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
            return ramlRepository.generateFile($scope.homeDirectory, result);
          }, function () {
            return ramlRepository.generateFile($scope.homeDirectory, defaultName);
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
    'ramlRepository',
    '$window',
    '$timeout',
    '$q',
    'eventEmitter',
    function ramlEditorSaveFileButton(ramlRepository, $window, $timeout, $q, eventEmitter) {
      return {
        restrict: 'E',
        template: [
          '<span role="save-button" ng-click="saveFile()"><i class="fa fa-save"></i>&nbsp;Save</span>',
          '<span class="menu-item-toggle" ng-click="openContextMenu($event)">',
          '  <i class="fa fa-caret-down"></i>',
          '</span>',
          '<ul role="context-menu" class="menu-item-context" ng-show="contextMenuOpen">',
          '  <li role="context-menu-item" ng-click="saveAllFiles()">Save All</li>',
          '</ul>'
        ].join('\n'),
        link: function (scope) {
          scope.contextMenuOpen = false;
          scope.openContextMenu = function () {
            $timeout(function () {
              $window.addEventListener('click', function self() {
                scope.$apply(function () {
                  scope.contextMenuOpen = false;
                });
                $window.removeEventListener('click', self);
              });
            });
            scope.contextMenuOpen = true;
          };
          scope.saveFile = function saveFile() {
            var file = scope.fileBrowser.selectedFile;
            return ramlRepository.saveFile(file);  // .then(function success() {
                                                   //   // eventEmitter.publish('event:notification', {
                                                   //   //   message: 'File saved.',
                                                   //   //   expires: true
                                                   //   // });
                                                   // });
          };
          function saveAll() {
            var promises = [];
            scope.homeDirectory.forEachChildDo(function (file) {
              if (file.isDirectory) {
                return;
              }
              if (file.dirty) {
                return promises.push(ramlRepository.saveFile(file));
              }
            });
            return promises;
          }
          eventEmitter.subscribe('event:notification:save-all', function (data) {
            if (data.notify) {
              scope.saveAllFiles();
            } else {
              saveAll();
            }
          });
          scope.saveAllFiles = function saveAllFiles() {
            return $q.all(saveAll());  // .then(function success() {
                                       //   // eventEmitter.publish('event:notification', {
                                       //   //   message: 'All files saved.',
                                       //   //   expires: true
                                       //   // });
                                       // });
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
    'newFolderService',
    function ramlEditorNewFolderButton(newFolderService) {
      return {
        restrict: 'E',
        template: '<span role="new-button" ng-click="newFolder()"><i class="fa fa-folder-open"></i>&nbsp;New Folder</span>',
        link: function (scope) {
          scope.newFolder = function newFolder() {
            return newFolderService.prompt(scope.homeDirectory);
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
    'newFileService',
    function ramlEditorNewFileButton(newFileService) {
      return {
        restrict: 'E',
        template: '<span role="new-button" ng-click="newFile()"><i class="fa fa-plus"></i>&nbsp;New File</span>',
        link: function (scope) {
          scope.newFile = function newFile() {
            return newFileService.prompt(scope.homeDirectory);
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
    'ramlRepository',
    function ramlEditorExportFilesButton(ramlRepository) {
      return {
        restrict: 'E',
        template: '<span role="export-button" ng-click="exportFiles()"><i class="fa fa-download"></i>&nbsp;Export files</span>',
        link: function ($scope) {
          $scope.exportFiles = function exportFiles() {
            ramlRepository.exportFiles();
          };
        }
      };
    }
  ]);
  ;
}());
(function () {
  'use strict';
  angular.module('ramlEditorApp').directive('ramlEditorImportButton', [
    '$injector',
    'importModal',
    function ramlEditorImportButton($injector, importModal) {
      return {
        restrict: 'E',
        template: '<span role="new-button" ng-click="importFile()"><i class="fa fa-cloud-download"></i> Import</span>',
        link: function (scope) {
          scope.importFile = function importFile() {
            return importModal.open();
          };
        }
      };
    }
  ]);
  ;
}());
(function () {
  'use strict';
  angular.module('ramlEditorApp').directive('ramlEditorOmnisearch', [
    'eventEmitter',
    'hotkeys',
    'ramlEditorContext',
    function ramlEditorOmniSearch(eventEmitter, hotkeys, ramlEditorContext) {
      return {
        restrict: 'E',
        templateUrl: 'views/raml-editor-omnisearch.tmpl.html',
        controller: [
          '$scope',
          '$element',
          '$timeout',
          '$sce',
          function controller($scope, $element, $timeout, $sce) {
            var omnisearch = this;
            var length = 0;
            var position = 0;
            $scope.showOmnisearch = false;
            omnisearch.open = function open() {
              omnisearch.searchResults = null;
              omnisearch.searchText = null;
              omnisearch.searchLine = null;
              omnisearch.mode = 'file';
              omnisearch.selected = null;
              omnisearch.showHelp = false;
              $scope.showOmnisearch = true;
              position = 0;
              $timeout(function () {
                $element.find('input').focus();
              });
            };
            omnisearch.close = function close() {
              omnisearch.searchResults = null;
              omnisearch.searchText = null;
              omnisearch.searchLine = null;
              omnisearch.mode = 'file';
              omnisearch.selected = null;
              omnisearch.showHelp = false;
              $scope.showOmnisearch = false;
              position = 0;
            };
            eventEmitter.subscribe('event:open:omnisearch', function () {
              omnisearch.open();
            });
            eventEmitter.subscribe('event:editor:click', function () {
              omnisearch.close();
            });
            var Command = function (execute) {
              this.execute = execute;
            };
            function goToResource() {
              omnisearch.mode = 'resource';
              var resources = ramlEditorContext.context.resources;
              var text = omnisearch.searchText.replace('@', '').replace(/:/g, '').split(' ').join('/');
              resources.forEach(function (el) {
                var formatedEl = el.replace(/:/g, '');
                if (formatedEl.indexOf(text) !== -1) {
                  omnisearch.searchResults.push({
                    name: $sce.trustAsHtml(formatedEl.replace(text, '<strong style="color: #0090f1;">' + text + '</strong>')),
                    text: el
                  });
                }
              });
              position = 0;
              length = omnisearch.searchResults.length;
              omnisearch.selected = omnisearch.searchResults[0];
              selectResource(false);
            }
            function goToLine() {
              omnisearch.mode = 'line';
              var line = omnisearch.searchText.match(/(\d+)/g);
              omnisearch.searchLine = parseInt(line, 10);
              eventEmitter.publish('event:goToLine', { line: omnisearch.searchLine });
            }
            function searchFile() {
              omnisearch.mode = 'file';
              $scope.homeDirectory.forEachChildDo(function (child) {
                var text = omnisearch.searchText;
                if (!child.isDirectory) {
                  var filename = child.name.replace(child.extension, '');
                  if (text.length > 0 && filename.indexOf(text) !== -1) {
                    omnisearch.searchResults.push({
                      name: $sce.trustAsHtml(child.name.replace(text, '<strong style="color: #0090f1;">' + text + '</strong>')),
                      text: child
                    });
                  }
                }
              });
              omnisearch.selected = omnisearch.searchResults[0];
              length = omnisearch.searchResults.length;
            }
            function searchText() {
              omnisearch.mode = 'text';
              var content = ramlEditorContext.context.content;
              var text = omnisearch.searchText.replace('#', '');
              content.forEach(function (line, i) {
                if (text && text.length > 0 && line.toLowerCase().indexOf(text.toLowerCase()) !== -1) {
                  omnisearch.searchResults.push({
                    name: $sce.trustAsHtml(line.replace(text, '<strong style="color: #0090f1;">' + text + '</strong>')),
                    text: line,
                    line: i + 1
                  });
                }
              });
              position = -1;
              length = omnisearch.searchResults.length;
              omnisearch.selected = omnisearch.searchResults[0];
              if (omnisearch.selected) {
                eventEmitter.publish('event:goToLine', {
                  line: omnisearch.selected.line,
                  focus: false
                });
              }
            }
            function showCheatSheet() {
              // omnisearch.close();
              // hotkeys.toggleCheatSheet();
              omnisearch.showHelp = true;
            }
            function getCommand(text) {
              if (text.startsWith(':')) {
                return new Command(goToLine);
              }
              if (text.startsWith('@')) {
                return new Command(goToResource);
              }
              if (text.startsWith('#')) {
                return new Command(searchText);
              }
              if (text === '?') {
                return new Command(showCheatSheet);
              }
              return new Command(searchFile);
            }
            omnisearch.search = function search() {
              omnisearch.searchResults = [];
              position = 0;
              omnisearch.showHelp = false;
              getCommand(omnisearch.searchText).execute();
            };
            omnisearch.showContent = function showContent(data, focus, skipFiles) {
              if (omnisearch.mode === 'resource') {
                var resource = data.text.split('/');
                resource = resource.pop().replace(':', '');
                eventEmitter.publish('event:goToResource', {
                  scope: data.text,
                  resource: resource,
                  text: resource,
                  focus: typeof focus === 'undefined' ? true : focus
                });
              }
              if (!skipFiles && omnisearch.mode === 'file') {
                omnisearch.openFile(data.text);
              }
              if (omnisearch.mode === 'text') {
                eventEmitter.publish('event:goToLine', {
                  line: data.line,
                  focus: typeof focus === 'undefined' ? true : focus
                });
              }
            };
            omnisearch.openFile = function openFile(file) {
              file = file || omnisearch.selected.text;
              if (!file) {
                $scope.showOmnisearch = false;
              }
              $scope.fileBrowser.selectFile(file);
              $scope.showOmnisearch = false;
            };
            omnisearch.isSelected = function isSelected(current) {
              if (current.line) {
                return omnisearch.selected ? current.line === omnisearch.selected.line : false;
              }
              return omnisearch.selected ? current.text === omnisearch.selected.text : false;
            };
            function selectResource(focus) {
              if (omnisearch.searchResults[position]) {
                var resource = omnisearch.searchResults[position].text.split('/');
                resource = resource.pop().replace(':', '');
                eventEmitter.publish('event:goToResource', {
                  scope: omnisearch.searchResults[position].text,
                  resource: resource,
                  text: resource,
                  focus: focus
                });
              }
            }
            // var scrollPosition = 0;
            // var scrollSize     = 19;
            omnisearch.keyUp = function move(keyCode) {
              // enter
              if (keyCode === 13) {
                if (omnisearch.mode === 'file') {
                  omnisearch.openFile(null);
                }
                if (omnisearch.mode === 'line') {
                  eventEmitter.publish('event:goToLine', {
                    line: omnisearch.searchLine,
                    focus: true
                  });
                }
                if (omnisearch.mode === 'resource') {
                  selectResource(true);
                }
                if (omnisearch.mode === 'text') {
                  eventEmitter.publish('event:goToLine', {
                    line: omnisearch.selected.line,
                    focus: true
                  });
                }
                omnisearch.close();
              }
              // esc
              if (keyCode === 27) {
                omnisearch.close();
              }  // // Up Arrow
                 // if (keyCode === 38) {
                 //   if (position > 0) {
                 //     position--;
                 //     scrollPosition = scrollPosition-scrollSize;
                 //     $($element.find('ul')).scrollTop(scrollPosition);
                 //   }
                 //   omnisearch.selected = omnisearch.searchResults[position];
                 //   if(omnisearch.mode === 'resource') {
                 //     selectResource(false);
                 //   }
                 //   if(omnisearch.mode === 'text') {
                 //     eventEmitter.publish('event:goToLine', {
                 //       line:  omnisearch.selected.line,
                 //       focus: false
                 //     });
                 //   }
                 // }
                 // // Down Arrow
                 // if (keyCode === 40) {
                 //   $timeout(function() {
                 //     $element.focus();
                 //   });
                 //   if (position < length-1) {
                 //     position++;
                 //     if (position > 15) {
                 //       scrollPosition = scrollPosition+scrollSize;
                 //       $($element.find('ul')).scrollTop(scrollPosition);
                 //     }
                 //   }
                 //   omnisearch.selected = omnisearch.searchResults[position];
                 //   if(omnisearch.mode === 'resource') {
                 //     selectResource(false);
                 //   }
                 //   if(omnisearch.mode === 'text') {
                 //     eventEmitter.publish('event:goToLine', {
                 //       line:  omnisearch.selected.line,
                 //       focus: false
                 //     });
                 //   }
                 // }
            };
            $scope.omnisearch = omnisearch;
          }
        ]
      };
    }
  ]);
  ;
}());
(function () {
  'use strict';
  angular.module('ramlEditorApp').directive('ramlEditorBottomBar', [
    'safeApplyWrapper',
    'eventEmitter',
    function ramlEditorBottomBar(safeApplyWrapper, eventEmitter) {
      return {
        restrict: 'E',
        templateUrl: 'views/raml-editor-bottom-bar.tmpl.html',
        controller: [
          '$scope',
          function controller($scope) {
            var bottomBar = this;
            bottomBar.cursor = {
              line: 1,
              column: 1
            };
            eventEmitter.subscribe('event:editor:include', safeApplyWrapper($scope, function () {
              bottomBar.resources = [];
            }));
            eventEmitter.subscribe('event:editor:context', safeApplyWrapper($scope, function (data) {
              var context = data.context;
              var cursor = data.cursor;
              var scope = context.scopes[cursor.line];
              bottomBar.cursor = {
                line: cursor.line + 1,
                column: cursor.ch + 1
              };
              bottomBar.resources = [];
              if (scope.startsWith('/')) {
                scope.split('/').map(function (el) {
                  bottomBar.resources.push({
                    text: el.replace(/:/g, ''),
                    value: el
                  });
                });
                // bottomBar.resources = scope.replace(/:/g, '').split('/');
                bottomBar.resources = bottomBar.resources.slice(1, bottomBar.resources.length);
                bottomBar.active = {
                  scope: scope,
                  resource: bottomBar.resources[bottomBar.resources.length - 1]
                };
              }
            }));
            bottomBar.isActive = function isActive(current) {
              return current.text === bottomBar.active.resource.text;
            };
            bottomBar.show = function show(current, index) {
              eventEmitter.publish('event:goToResource', {
                scope: bottomBar.active.scope,
                resource: bottomBar.active.resource,
                text: current.value,
                index: index,
                focus: true
              });
            };
            $scope.bottomBar = bottomBar;
          }
        ]
      };
    }
  ]);
}());
(function () {
  'use strict';
  // TODO: Extract to a different file
  String.prototype.titleize = function () {
    var words = this.split(' ');
    var array = [];
    for (var i = 0; i < words.length; ++i) {
      array.push(words[i].charAt(0).toUpperCase() + words[i].toLowerCase().slice(1));
    }
    return array.join(' ');
  };
  angular.module('ramlEditorApp').directive('ramlEditorTryIt', [
    'eventEmitter',
    'safeApplyWrapper',
    function ramlEditorTryIt(eventEmitter, safeApplyWrapper) {
      return {
        restrict: 'E',
        templateUrl: 'views/raml-editor-try-it.tmpl.html',
        controller: [
          '$scope',
          function controller($scope) {
            var tryIt = this;
            function readSecuritySchemes(raml) {
              var schemes = {
                  anonymous: {
                    type: 'Anonymous',
                    name: 'Anonymous'
                  }
                };
              if (raml.securitySchemes) {
                raml.securitySchemes.forEach(function (scheme) {
                  var key = Object.keys(scheme)[0];
                  var type = scheme[key].type;
                  schemes[key] = scheme[key];
                  schemes[key].name = scheme[key].type;
                  if (type.startsWith('x-')) {
                    schemes[key].name = key.replace(/_/g, ' ').titleize();
                  }
                });
              }
              return schemes;
            }
            function readUriParameters(resource, uriParameters) {
              if (resource.uriParameters) {
                var parameters = angular.copy(resource.uriParameters);
                for (var key in parameters) {
                  parameters.key = key;
                }
                uriParameters.push(parameters);
              }
            }
            function readResourceData(raml, path) {
              var relativePath = path.replace(/:/g, '').split('/');
              var resource, uriParameters = [];
              relativePath = relativePath.slice(1, relativePath.length);
              if (raml.resources) {
                var resources = raml.resources;
                for (var i = 0; i < resources.length; i++) {
                  if (resources[i].relativeUri === '/' + relativePath.shift()) {
                    resource = resources[i];
                    break;
                  }
                }
              }
              readUriParameters(resource, uriParameters);
              relativePath.forEach(function (el) {
                var resources = resource.resources;
                if (resource && resource.resources) {
                  for (var i = 0; i < resources.length; i++) {
                    if (resources[i].relativeUri === '/' + el) {
                      resource = resources[i];
                      break;
                    }
                  }
                  readUriParameters(resource, uriParameters);
                }
              });
              resource = angular.copy(resource);
              resource.uriParameters = uriParameters;
              return resource;
            }
            eventEmitter.subscribe('event:editor:context', safeApplyWrapper($scope, function (data) {
              var context = data.context;
              var cursor = data.cursor;
              var scopes = context.scopes;
              var path = scopes[cursor.line];
              var metadata, resource;
              resource = '/' + path.split('/').slice(1, 2);
              metadata = context.metadata[resource];
              if (metadata) {
                var raml = context.metadata[resource].raml.compiled;
                if (raml) {
                  // Initializing values
                  tryIt.securitySchemes = readSecuritySchemes(raml);
                  tryIt.protocols = raml.protocols;
                  tryIt.resource = readResourceData(raml, path);
                  tryIt.enabled = true;
                  tryIt.protocol = tryIt.protocols[0];
                  tryIt.securityScheme = 'Anonymous';
                  tryIt.selectedMethod = tryIt.resource.methods ? tryIt.resource.methods[0] : null;
                }
              } else {
                tryIt.current = null;
                tryIt.raml = null;
                tryIt.enabled = false;
                tryIt.selectedMethod = null;
              }
            }));
            // Init
            tryIt.enabled = false;
            tryIt.selectedMethod = null;
            // Events
            tryIt.selectMethod = function selectMethod(method) {
              tryIt.selectedMethod = method;
            };
            $scope.tryIt = tryIt;
          }
        ]
      };
    }
  ]);
}());
(function () {
  'use strict';
  angular.module('ramlEditorApp').directive('ramlEditorDesign', [
    'ramlEditorContext',
    'eventEmitter',
    'safeApplyWrapper',
    function ramlEditorDesign(ramlEditorContext, eventEmitter, safeApplyWrapper) {
      return {
        restrict: 'E',
        templateUrl: 'views/raml-editor-design.tmpl.html',
        controller: [
          '$scope',
          function controller($scope) {
            var designer = this;
            eventEmitter.subscribe('event:editor:context', safeApplyWrapper($scope, function (data) {
              designer.resources = data.context.resources;
            }));
            $scope.designer = designer;
          }
        ]
      };
    }
  ]);
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
    $templateCache.put('views/confirm-modal.html', '<form name="form" novalidate>\n' + '  <div class="modal-header">\n' + '    <h3>{{data.title}}</h3>\n' + '  </div>\n' + '\n' + '  <div class="modal-body">\n' + '    <p>{{data.message}}</p>\n' + '  </div>\n' + '\n' + '  <div class="modal-footer">\n' + '    <button type="button" class="btn btn-default" ng-click="$dismiss()">Cancel</button>\n' + '    <button type="button" class="btn btn-primary" ng-click="$close()" ng-auto-focus="true">OK</button>\n' + '  </div>\n' + '</form>\n');
    $templateCache.put('views/help.html', '<div class="modal-header">\n' + '    <h3><i class="fa fa-question-circle"></i> Help</h3>\n' + '</div>\n' + '\n' + '<div class="modal-body">\n' + '    <p>\n' + '        The API Designer for RAML is built by MuleSoft, and is a web-based editor designed to help you author RAML specifications for your APIs.\n' + '        <br />\n' + '        <br />\n' + '        RAML is a human-and-machine readable modeling language for REST APIs, backed by a workgroup of industry leaders.\n' + '    </p>\n' + '\n' + '    <p>\n' + '        To learn more about the RAML specification and other tools which support RAML, please visit <a href="http://www.raml.org" target="_blank">http://www.raml.org</a>.\n' + '        <br />\n' + '        <br />\n' + '        For specific questions, or to get help from the community, head to the community forum at <a href="http://forums.raml.org" target="_blank">http://forums.raml.org</a>.\n' + '    </p>\n' + '</div>\n');
    $templateCache.put('views/import-modal.html', '<form name="form" novalidate ng-submit="import(form)">\n' + '  <div class="modal-header">\n' + '    <h3>Import file (beta)</h3>\n' + '  </div>\n' + '\n' + '  <div class="modal-body" ng-class="{\'has-error\': submittedType === mode.type && form.$invalid}">\n' + '    <div style="text-align: center; font-size: 2em; margin-bottom: 1em;" ng-show="importing">\n' + '      <i class="fa fa-spin fa-spinner"></i>\n' + '    </div>\n' + '\n' + '    <div class="form-group" style="margin-bottom: 10px;">\n' + '      <div style="float: left; width: 130px;">\n' + '        <select class="form-control" ng-model="mode" ng-options="option.name for option in options"></select>\n' + '      </div>\n' + '\n' + '      <div style="margin-left: 145px;" ng-switch="mode.type">\n' + '        <input id="swagger" name="swagger" type="text" ng-model="mode.value" class="form-control file-selector" required ng-switch-when="swagger" placeholder="http://example.swagger.wordnik.com/api/api-docs">\n' + '\n' + '        <input id="zip" name="zip" type="file" ng-model="mode.value" class="form-control file-selector" required ng-switch-when="zip" onchange="angular.element(this).scope().handleFileSelect(this)">\n' + '      </div>\n' + '    </div>\n' + '\n' + '    <div ng-if="submittedType === \'swagger\'">\n' + '      <p class="help-block" ng-show="form.swagger.$error.required">Please provide a URL.</p>\n' + '    </div>\n' + '\n' + '    <div ng-if="submittedType === \'zip\'">\n' + '      <p class="help-block" ng-show="form.zip.$error.required">Please select a .zip file to import.</p>\n' + '    </div>\n' + '  </div>\n' + '\n' + '  <div class="modal-footer" style="margin-top: 0;">\n' + '    <button type="button" class="btn btn-default" ng-click="$dismiss()">Close</button>\n' + '    <button type="submit" class="btn btn-primary">Import</button>\n' + '  </div>\n' + '</form>\n');
    $templateCache.put('views/import-service-conflict-modal.html', '<form name="form" novalidate>\n' + '  <div class="modal-header">\n' + '    <h3>Path already exists</h3>\n' + '  </div>\n' + '\n' + '  <div class="modal-body">\n' + '    The path (<strong>{{path}}</strong>) already exists.\n' + '  </div>\n' + '\n' + '  <div class="modal-footer">\n' + '    <button type="button" class="btn btn-default pull-left" ng-click="skip()">Skip</button>\n' + '    <button type="submit" class="btn btn-primary" ng-click="keep()">Keep Both</button>\n' + '    <button type="submit" class="btn btn-primary" ng-click="replace()">Replace</button>\n' + '  </div>\n' + '</form>\n');
    $templateCache.put('views/new-name-modal.html', '<form name="form" novalidate ng-submit="submit(form)">\n' + '<!--   <div class="modal-header">\n' + '    <h3>{{input.title}}</h3>\n' + '  </div> -->\n' + '\n' + '  <div class="modal-body">\n' + '    <!-- name -->\n' + '    <div class="form-group" ng-class="{\'has-error\': form.$submitted && form.name.$invalid}">\n' + '      <!-- <p>{{input.message}}</p> -->\n' + '      <!-- label -->\n' + '      <label for="name" class="control-label">{{input.message}}</label>\n' + '\n' + '      <!-- input -->\n' + '      <input id="name" name="name" type="text"\n' + '             ng-model="input.newName" class="form-control"\n' + '             ng-validate="isValid($value)"\n' + '             ng-maxlength="64" ng-auto-focus="true"\n' + '             required\n' + '             autofocus\n' + '             autocomplete="off">\n' + '\n' + '      <!-- error -->\n' + '      <p class="help-block" ng-show="form.$submitted && form.name.$error.required">Please provide a name.</p>\n' + '      <p class="help-block" ng-show="form.$submitted && form.name.$error.maxlength">Name must be shorter than 64 characters.</p>\n' + '      <p class="help-block" ng-show="form.$submitted && form.name.$error.validate">{{validationErrorMessage}}</p>\n' + '    </div>\n' + '  </div>\n' + '\n' + '<!--   <div class="modal-footer">\n' + '    <button type="button" class="btn btn-default" ng-click="$dismiss()">Cancel</button>\n' + '    <button type="submit" class="btn btn-primary">OK</button>\n' + '  </div> -->\n' + '</form>\n');
    $templateCache.put('views/raml-editor-bottom-bar.tmpl.html', '<div>\n' + '  <div class="cursor">\n' + '    <span>Line</span> {{bottomBar.cursor.line}},\n' + '    <span>Column</span> {{bottomBar.cursor.column}}\n' + '  </div>\n' + '  <div class="breadcrum">\n' + '    <button ng-click="bottomBar.show(resource, $index)" ng-class="{active: bottomBar.isActive(resource)}" ng-repeat="resource in bottomBar.resources track by $index">{{resource.text}}</button>\n' + '  </div>\n' + '</div>\n');
    $templateCache.put('views/raml-editor-context-menu.tmpl.html', '<ul role="context-menu" ng-show="opened">\n' + '  <li role="context-menu-item" ng-repeat="action in actions" ng-click="action.execute()">{{ action.label }}</li>\n' + '</ul>\n');
    $templateCache.put('views/raml-editor-design.tmpl.html', '<div>\n' + '  <div class="container">\n' + '    <div class="title">\n' + '      <span>Endpoint</span>\n' + '    </div>\n' + '    <div class="content">\n' + '      content\n' + '    </div>\n' + '  </div>\n' + '\n' + '  <div class="container">\n' + '    <div class="title">\n' + '      <span>Resources</span>\n' + '    </div>\n' + '    <div class="content">\n' + '      <div class="content">\n' + '        <input class="search" type="text" ng-model="designer.resource" />\n' + '      </div>\n' + '      <ul>\n' + '        <li ng-repeat="resource in designer.resources | filter: designer.resource">\n' + '          <i class="fa icon fa-caret-right caret-icon ng-scope"></i> {{resource}}\n' + '        </li>\n' + '      </ul>\n' + '    </div>\n' + '  </div>\n' + '\n' + '  <div class="container">\n' + '    <div class="title">\n' + '      <span>Examples</span>\n' + '    </div>\n' + '    <div class="content">\n' + '      content\n' + '    </div>\n' + '  </div>\n' + '</div>\n');
    $templateCache.put('views/raml-editor-file-browser.tmpl.html', '<raml-editor-context-menu></raml-editor-context-menu>\n' + '\n' + '<script type="text/ng-template" id="file-item.html">\n' + '  <div ui-tree-handle class="file-item" ng-right-click="fileBrowser.showContextMenu($event, node)" ng-click="fileBrowser.select(node)"\n' + '    ng-dblclick="fileBrowser.dblClick(node)" ng-class="{currentfile: fileBrowser.currentTarget.path === node.path && !isDragging,\n' + '      geared: fileBrowser.contextMenuOpenedFor(node),\n' + '      directory: node.isDirectory,\n' + '      \'no-drop\': fileBrowser.cursorState === \'no\',\n' + '      copy: fileBrowser.cursorState === \'ok\',\n' + '      \'file-item2\': !node.isDirectory,\n' + '      root: node.root\n' + '    }"\n' + '    ng-drop="node.isDirectory && fileBrowser.dropFile($event, node)">\n' + '    <span class="file-name" ng-click="toggleFolderCollapse(node)">\n' + '      <i class="fa icon fa-caret-right fa-fw" ng-if="node.isDirectory" ng-class="{\'fa-rotate-90\': !collapsed}"></i>{{node.name}}\n' + '    </span>\n' + '    <i class="fa fa-cog" ng-click="fileBrowser.showContextMenu($event, node)" ng-class="{hidden: isDragging}" data-nodrag></i>\n' + '    <div class="background">&nbsp</div>\n' + '  </div>\n' + '\n' + '  <ul ui-tree-nodes ng-if="node.isDirectory" ng-class="{hidden: collapsed}" ng-model="node.children">\n' + '    <li ui-tree-node ng-repeat="node in node.children" ng-include="\'file-item.html\'" data-collapsed="node.collapsed">\n' + '    </li>\n' + '  </ul>\n' + '</script>\n' + '\n' + '<div ui-tree="fileTreeOptions" ng-model="homeDirectory" class="file-list" data-drag-delay="300" data-empty-place-holder-enabled="false" ng-drop="fileBrowser.dropFile($event, homeDirectory)" ng-right-click="fileBrowser.showContextMenu($event, homeDirectory)">\n' + '  <div class="section-title">\n' + '    <i class="fa icon fa-caret-right caret-icon"\n' + '      ng-click="toggleWorkingFiles()"\n' + '      ng-class="{\'fa-caret-down\': workingFilesExpanded, \'fa-caret-right\': !workingFilesExpanded}"></i>\n' + '    Working Files\n' + '    <i class="fa icon fa-save save-icon" ng-click="saveAllFiles()"></i>\n' + '  </div>\n' + '  <ul ng-if="!fileBrowser.isEmpty(workingFiles)" class="angular-ui-tree-nodes" ng-show="workingFilesExpanded">\n' + '    <li ng-repeat="(key, node) in workingFiles" class="angular-ui-tree-node angular-ui-working-node">\n' + '      <div class="file-item" ng-click="fileBrowser.select(node)"\n' + '        ng-class="{workingfile: fileBrowser.currentTarget.path === node.path, dirty: node.dirty}">\n' + '        <span class="file-name" >\n' + '          {{key}}\n' + '        </span>\n' + '        <div class="background">&nbsp</div>\n' + '        <i class="fa fa-times close-icon" ng-click="fileBrowser.close(node)"></i>\n' + '      </div>\n' + '    </li>\n' + '  </ul>\n' + '  <div class="section-title">\n' + '    <i class="fa icon caret-icon"\n' + '      ng-click="toggleProjectExplorer()"\n' + '      ng-class="{\'fa-caret-down\': projectExplorerExpanded, \'fa-caret-right\': !projectExplorerExpanded}"></i>\n' + '    Project Explorer\n' + '    <i class="fa icon fa-folder-open folder-icon" ng-click="newFolder()"></i>\n' + '    <i class="fa icon fa-file file-icon" ng-click="newFile()"></i>\n' + '  </div>\n' + '  <ul ui-tree-nodes ng-model="homeDirectory.children" id="tree-root" ng-show="projectExplorerExpanded">\n' + '\n' + '    <li ui-tree-node ng-repeat="node in homeDirectory.children" ng-include="\'file-item.html\'" data-collapsed="node.collapsed"\n' + '     ng-drag-enter="node.collapsed = false"\n' + '     ng-drag-leave="node.collapsed = true"></li>\n' + '    <ui-tree-dummy-node class="bottom" ng-click="fileBrowser.select(homeDirectory)"></ui-tree-dummy-node>\n' + '  </ul>\n' + '</div>\n');
    $templateCache.put('views/raml-editor-main.tmpl.html', '<div role="raml-editor" class="{{theme}}" ng-click="mainClick($event)" hotkey="{\'mod+p\': openOmnisearch, \'ctrl+h\': toggleCheatSheet}">\n' + '  <div role="notifications" ng-controller="notifications" class="hidden" ng-class="{hidden: !shouldDisplayNotifications, error: level === \'error\'}">\n' + '    {{message}}\n' + '    <i class="fa" ng-class="{\'fa-check\': level === \'info\', \'fa-warning\': level === \'error\'}" ng-click="hideNotifications()"></i>\n' + '  </div>\n' + '\n' + '  <header>\n' + '    <h1>\n' + '      <strong>API</strong> Designer\n' + '    </h1>\n' + '\n' + '    <a role="logo" target="_blank" href="http://mulesoft.com"></a>\n' + '  </header>\n' + '\n' + '  <ul class="menubar" style="height: 25px;">\n' + '    <li class="menu-item menu-item-ll">\n' + '      <raml-editor-new-file-button></raml-editor-new-file-button>\n' + '    </li>\n' + '    <li ng-show="supportsFolders" class="menu-item menu-item-ll">\n' + '      <raml-editor-new-folder-button></raml-editor-new-folder-button>\n' + '    </li>\n' + '    <li class="menu-item menu-item-ll">\n' + '      <raml-editor-save-file-button></raml-editor-save-file-button>\n' + '    </li>\n' + '    <li class="menu-item menu-item-ll">\n' + '      <raml-editor-import-button></raml-editor-import-button>\n' + '    </li>\n' + '    <li ng-show="canExportFiles()" class="menu-item menu-item-ll">\n' + '      <raml-editor-export-files-button></raml-editor-export-files-button>\n' + '    </li>\n' + '    <li class="spacer file-absolute-path"></li>\n' + '   <!--  <li class="menu-item menu-item-fr menu-item-mocking-service" ng-show="getIsMockingServiceVisible()" ng-controller="mockingServiceController" ng-click="toggleMockingService()">\n' + '      <div class="title">Mocking Service</div>\n' + '      <div class="field-wrapper" ng-class="{loading: loading}">\n' + '        <i class="fa fa-spin fa-spinner" ng-if="loading"></i>\n' + '        <div class="field" ng-if="!loading">\n' + '          <input type="checkbox" value="None" id="mockingServiceEnabled" ng-checked="enabled" ng-click="$event.preventDefault()" />\n' + '          <label for="mockingServiceEnabled"></label>\n' + '        </div>\n' + '      </div>\n' + '    </li> -->\n' + '    <li class="menu-item menu-item-fr" ng-click="openHelp()">\n' + '      <span><i class="fa fa-question-circle"></i> Help</span>\n' + '    </li>\n' + '  </ul>\n' + '\n' + '  <raml-editor-omnisearch role="omnisearch"></raml-editor-omnisearch>\n' + '\n' + '  <div role="flexColumns">\n' + '    <raml-editor-file-browser role="browser"></raml-editor-file-browser>\n' + '\n' + '    <div id="browserAndEditor" ng-splitter="vertical" ng-splitter-collapse-target="prev" ng-splitter-min-width="200">\n' + '    </div>\n' + '\n' + '\n' + '    <div role="editor">\n' + '      <div class="editor-title">{{getSelectedFileAbsolutePath()}}</div>\n' + '      <div id="code" role="code" ng-show="isActive(\'source\')"></div>\n' + '      <!-- <div role="design" ng-show="isActive(\'design\')"></div> -->\n' + '      <!-- <div class="editor-bottom">\n' + '        <button ng-click="setMode(\'design\')" ng-class="{\'active\': isActive(\'design\')}">Design</button>\n' + '        <button ng-click="setMode(\'source\')" ng-class="{\'active\': isActive(\'source\')}">Source</button>\n' + '      </div> -->\n' + '\n' + '      <!-- <div role="shelf" ng-show="getIsShelfVisible()" ng-class="{expanded: !shelf.collapsed}">\n' + '        <div role="shelf-tab" ng-click="toggleShelf()">\n' + '          <i class="fa fa-inbox fa-lg"></i><i class="fa" ng-class="shelf.collapsed ? \'fa-caret-up\' : \'fa-caret-down\'"></i>\n' + '        </div>\n' + '\n' + '        <div role="shelf-container" ng-show="!shelf.collapsed" ng-include src="\'views/raml-editor-shelf.tmpl.html\'"></div>\n' + '      </div> -->\n' + '    </div>\n' + '\n' + '    <div id="consoleAndEditor" ng-splitter="vertical" ng-splitter-collapse-target="next" ng-splitter-min-width="300" ng-show="isActive(\'source\')">\n' + '    </div>\n' + '\n' + '    <!-- <div role="preview-wrapper" ng-show="isActive(\'source\') && getIsConsoleVisible()"> -->\n' + '    <div role="preview-wrapper" ng-show="isActive(\'source\')" ng-class="{collapsed: rightBarCollapsed}">\n' + '\n' + '      <div class="collapsed-right-bar" ng-show="rightBarCollapsed">\n' + '        <span ng-click="toggleRightBar()">Try-It</span>\n' + '        <!-- <span ng-click="toggleRightBar()">Snippets</span> -->\n' + '      </div>\n' + '\n' + '      <div class="right-bar" ng-hide="rightBarCollapsed">\n' + '        <div class="section">\n' + '          <div class="section-title">\n' + '            <!-- <i class="fa icon fa-caret-right caret-icon"></i> -->Try-It<span class="close" ng-click="toggleRightBar()">&#x2715;</span>\n' + '          </div>\n' + '          <raml-editor-try-it role="try-it"></raml-editor-try-it>\n' + '        </div>\n' + '        <!-- <div class="section">\n' + '          <div class="section-title">\n' + '            <i class="fa icon fa-caret-right caret-icon"></i>Snippets<span class="close" ng-click="toggleRightBar()">&#x2715;</span>\n' + '          </div>\n' + '        </div> -->\n' + '      </div>\n' + '    </div>\n' + '\n' + '    <!-- <div role="preview-wrapper" ng-show="isActive(\'design\')">\n' + '      <raml-editor-design role="editor-design"></raml-editor-design>\n' + '    </div> -->\n' + '  </div>\n' + '  <raml-editor-bottom-bar role="bottom-bar"></raml-editor-bottom-bar>\n' + '</div>\n');
    $templateCache.put('views/raml-editor-omnisearch.tmpl.html', '<div ng-if="showOmnisearch" ng-keyup="omnisearch.keyUp($event.keyCode)" class="omnisearch">\n' + '  <input type="text" placeholder="Type \'?\' to get help" autofocus\n' + '    ng-change="omnisearch.search()"\n' + '    ng-model="omnisearch.searchText"\n' + '    />\n' + '  <ul>\n' + '    <li class="result" ng-repeat="result in omnisearch.searchResults" ng-mouseover="omnisearch.showContent(result, false, true)" ng-click="omnisearch.showContent(result)">\n' + '      <span ng-bind-html="result.name"></span>\n' + '    </li>\n' + '    <li ng-if="omnisearch.showHelp"><span class="command">:</span> Go to line <span class="description">editor commands</span></li>\n' + '    <li ng-if="omnisearch.showHelp"><span class="command">@</span> Go to resource</li>\n' + '    <li ng-if="omnisearch.showHelp"><span class="command">#</span> Search text</li>\n' + '  </ul>\n' + '</div>\n');
    $templateCache.put('views/raml-editor-shelf.tmpl.html', '<ul role="sections" ng-controller="ramlEditorShelf">\n' + '  <li role="section" ng-repeat="section in model.sections | orderBy:orderSections" class="{{section.name | dasherize}}">\n' + '    {{section.name}}&nbsp;({{section.items.length}})\n' + '    <ul role="items">\n' + '      <li ng-repeat="item in section.items" ng-click="itemClick(item)"><i class="fa fa-reply"></i><span>{{item.title}}</span></li>\n' + '    </ul>\n' + '  </li>\n' + '</ul>\n');
    $templateCache.put('views/raml-editor-try-it.tmpl.html', '<div>\n' + '  <div class="no-resource-message" ng-if="!tryIt.enabled">\n' + '    There is no resource in context\n' + '  </div>\n' + '  <div ng-if="tryIt.enabled">\n' + '  <!-- Protocols -->\n' + '    <div class="container" ng-if="tryIt.protocols">\n' + '      <div class="title">\n' + '        <span>Protocols</span>\n' + '      </div>\n' + '      <div class="content">\n' + '        <select class="control full-width" ng-model="tryIt.protocol">\n' + '          <option ng-repeat="protocol in tryIt.protocols" value="{{protocol}}">{{protocol}}</option>\n' + '        </select>\n' + '      </div>\n' + '    </div>\n' + '  <!-- Authorization -->\n' + '    <div class="container">\n' + '      <div class="title">\n' + '        <span>Authentication</span>\n' + '      </div>\n' + '      <div class="content">\n' + '        <label>Security Scheme</label>\n' + '        <select class="control" ng-model="tryIt.securityScheme">\n' + '          <option ng-repeat="(key, value) in tryIt.securitySchemes" value="{{value.type}}">{{value.name}}</option>\n' + '        </select>\n' + '\n' + '        <div ng-switch on="tryIt.securityScheme">\n' + '          <div ng-switch-when="Anonymous"></div>\n' + '          <div ng-switch-when="Basic Authentication">\n' + '            <label>Username</label>\n' + '            <input class="control" type="text" id="username" value="">\n' + '            <label>Password</label>\n' + '            <input class="control" type="text" id="password" value="">\n' + '          </div>\n' + '          <div ng-switch-when="Digest Authentication"></div>\n' + '          <div ng-switch-when="OAuth 1.0"></div>\n' + '          <div ng-switch-when="OAuth 2.0">\n' + '            <label>Authorization Grant</label>\n' + '            <select class="control">\n' + '              <option value="code">Authorization Code</option>\n' + '              <option value="credentials">Client Credentials</option>\n' + '            </select>\n' + '\n' + '            <label>Client ID</label>\n' + '            <input class="control" type="text" id="clientId" value="">\n' + '\n' + '            <label>Client Secret</label>\n' + '            <input class="control" type="text" id="clientSecret" value="">\n' + '          </div>\n' + '          <div ng-switch-default></div>\n' + '        </div>\n' + '      </div>\n' + '    </div>\n' + '  <!-- URI Parameters -->\n' + '    <div class="container" ng-if="tryIt.resource.uriParameters.length">\n' + '      <div class="title">\n' + '        <span>URI Parameters</span>\n' + '      </div>\n' + '      <div class="content">\n' + '        <div ng-repeat="param in tryIt.resource.uriParameters">\n' + '          <label>{{param.key}}</label>\n' + '          <input class="control" type="text" id="{{param.key}}" value="">\n' + '        </div>\n' + '      </div>\n' + '    </div>\n' + '\n' + '    <div class="container" ng-if="tryIt.resource.methods.length">\n' + '      <div class="methods">\n' + '        <button ng-repeat="method in tryIt.resource.methods" class="{{method.method}}" ng-click="tryIt.selectMethod(method)">{{method.method}}</button>\n' + '      </div>\n' + '      <div class="content method-container {{tryIt.selectedMethod.method}}">\n' + '        <!-- Query Parameters -->\n' + '          <div class="container" ng-if="tryIt.selectedMethod.queryParameters">\n' + '            <div class="title">\n' + '              <span>Query Parameters</span>\n' + '            </div>\n' + '            <div class="content">\n' + '              <div ng-repeat="(key, value) in tryIt.selectedMethod.queryParameters">\n' + '                <label>{{value.displayName}}</label>\n' + '                <input class="control" type="text" id="{{key}}" value="">\n' + '              </div>\n' + '            </div>\n' + '          </div>\n' + '        <!-- Headers -->\n' + '          <div class="container" ng-if="tryIt.selectedMethod.headers">\n' + '            <div class="title">\n' + '              <span>Headers</span>\n' + '            </div>\n' + '            <div class="content">\n' + '              <div ng-repeat="(key, value) in tryIt.selectedMethod.headers">\n' + '                <label>{{value.displayName}}</label>\n' + '                <input class="control" type="text" id="{{key}}" value="">\n' + '              </div>\n' + '            </div>\n' + '          </div>\n' + '      </div>\n' + '    </div>\n' + '  </div>\n' + '</div>\n');
  }
]);