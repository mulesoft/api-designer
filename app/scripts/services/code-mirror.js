'use strict';

angular.module('codeMirror', ['raml', 'ramlEditorApp', 'codeFolding'])
  .factory('replaceSelection', function (ramlHint, generateTabs) {
    return function(editor, offset, whitespace){
      var editorState = ramlHint.getEditorState(editor);
      var spaces      = '\n' + generateTabs(editorState.currLineTabCount + offset) + whitespace;

      editor.replaceSelection(spaces, 'end', '+input');
    };
  })
  .factory('codeMirror', function (
    ramlHint, codeMirrorHighLight, eventService, getLineIndent, generateSpaces, generateTabs,
    getParentLine, getParentLineNumber, getFirstChildLine, getFoldRange, isArrayStarter, isArrayElement,
    hasChildren, replaceSelection, config
  ) {
    var editor  = null;
    var service = {
      CodeMirror: CodeMirror
    };

    service.removeTabs = function (line, indentUnit) {
      var tabRegExp = new RegExp('( ){' + indentUnit + '}', 'g');
      return line.replace(tabRegExp, '');
    };

    service.isLineOnlyTabs = function (line, indentUnit) {
      return service.removeTabs(line, indentUnit).length === 0;
    };

    service.tabKey = function (cm) {
      var cursor     = cm.getCursor();
      var line       = cm.getLine(cursor.line);
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
        unitsToIndent = indentUnit - result.length;
      // if not ident normally
      } else {
        unitsToIndent = indentUnit;
      }

      spaces = generateSpaces(unitsToIndent);
      cm.replaceSelection(spaces, 'end', '+input');
    };

    service.backspaceKey = function (cm) {
      var cursor     = cm.getCursor();
      var line       = cm.getLine(cursor.line).substring(0, cursor.ch + 1);
      var indentUnit = cm.getOption('indentUnit');
      var i;

      /* Erase in tab chunks only if all things found in the current line are tabs */
      if (line !== '' && service.isLineOnlyTabs(line, indentUnit)) {
        for (i = 0; i < indentUnit; i++) {
          /*
           * XXX deleteH should be used this way because if doing
           *
           *    cm.deleteH(-indentUnit,'char')
           *
           * it provokes some weird line deletion cases:
           *
           * On an empty line (but with tabs after the cursor) it completely erases the
           * previous line.
           */
          cm.deleteH(-1, 'char');
        }
        return;
      }

      cm.deleteH(-1, 'char');
    };

    service.enterKey = function (cm) {
      var editorState        = ramlHint.getEditorState(cm);
      var indentUnit         = cm.getOption('indentUnit');
      var curLineWithoutTabs = service.removeTabs(editorState.curLine, indentUnit);
      var parentLine         = getParentLine(cm, editorState.start.line);

      // this overrides everything else, because the '|' explicitly declares the line as a scalar
      // with a continuation on other lines. This applies to the current line or the parent of the current line
      if (curLineWithoutTabs.indexOf('|') > curLineWithoutTabs.indexOf(':')) {
        replaceSelection(cm, 1, '');
        return;
      }

      if (parentLine && parentLine.indexOf('|') > parentLine.indexOf(':')) {
        replaceSelection(cm, 0, '');
        return;
      }

      // if current line or parent line begins with: content, example or schema
      // one indentation level should be added or the same level should be kept if
      // the cursor is not on the first line
      if (/^(content|example|schema):/.test(curLineWithoutTabs)) {
        replaceSelection(cm, 1, '');
        return;
      }

      if (/^(\s+)?(content|example|schema):/.test(parentLine)) {
        replaceSelection(cm, 0, '');
        return;
      }

      //if current line is inside a traits or resourceTypes array,
      //some exception applies...
      if (parentLine && /^(traits|resourceTypes):/.test(parentLine)) {
        replaceSelection(cm, isArrayStarter(curLineWithoutTabs) ? 2 : 1, '');
        return;
      }

      if (isArrayElement(cm, editorState.start.line)) {
        replaceSelection(cm, isArrayStarter(curLineWithoutTabs) ? 1 : 0, '');
        return;
      }

      var offset = 0;
      if (curLineWithoutTabs.replace(' ', '').length > 0) {
        if (hasChildren(cm)) {
          offset = 1;
        }
      }

      if (editorState.cur.ch < editorState.curLine.length) {
        offset = /^\s*\w+:/.test(editorState.curLine) ? 1 : 0;
      }

      var extraWhitespace   = '';
      var leadingWhitespace = curLineWithoutTabs.match(/^\s+/);

      if (leadingWhitespace && leadingWhitespace[0] && !offset) {
        extraWhitespace = leadingWhitespace[0];
      }

      replaceSelection (cm, offset, extraWhitespace);
    };

    service.createEditor = function (el, extraOptions) {
      var shouldEnableFoldGutter = JSON.parse(config.get('folding', 'true'));
      var foldGutterConfig       = false;
      var cm;
      var options;

      if (shouldEnableFoldGutter) {
        foldGutterConfig = {
          rangeFinder:            CodeMirror.fold.indent,
          foldOnChangeTimeSpan:   300,
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
        extraKeys: {
          'Ctrl-Space': 'autocomplete',
          'Cmd-S': 'save',
          'Ctrl-S': 'save',
          'Shift-Tab': 'indentLess',
          'Shift-Ctrl-T': 'toggleTheme'
        },
        keyMap: 'tabSpace',
        foldGutter: foldGutterConfig,
        gutters: ['CodeMirror-lint-markers', 'CodeMirror-linenumbers', 'CodeMirror-foldgutter']
      };

      if (extraOptions) {
        Object.keys(extraOptions).forEach(function (key) {
          options[key] = extraOptions[key];
        });
      }

      cm = new CodeMirror(el, options);
      cm.setSize(null, '100%');
      cm.foldCode(0, {
        rangeFinder: CodeMirror.fold.indent
      });

      var charWidth   = cm.defaultCharWidth();
      var basePadding = 4;

      cm.on('renderLine', function (cm, line, el) {
        var offset = CodeMirror.countColumn(line.text, null, cm.getOption('tabSize')) * charWidth;

        el.style.textIndent  = '-' + offset + 'px';
        el.style.paddingLeft = (basePadding + offset) + 'px';
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
        Tab:         service.tabKey,
        Backspace:   service.backspaceKey,
        Enter:       service.enterKey,
        fallthrough: ['default']
      };

      CodeMirror.commands.save = function () {
        eventService.broadcast('event:save');
      };

      CodeMirror.commands.autocomplete = function (cm) {
        CodeMirror.showHint(cm, CodeMirror.hint.javascript, {
          ghosting: true
        });
      };

      CodeMirror.commands.toggleTheme = function (cm) {
        eventService.broadcast('event:toggle-theme');
      };

      CodeMirror.defineMode('raml', codeMirrorHighLight.highlight);
      CodeMirror.defineMIME('text/x-raml', 'raml');

      CodeMirror.registerHelper('hint', 'yaml', ramlHint.autocompleteHelper);
      CodeMirror.registerHelper('fold', 'indent', getFoldRange);
    })();

    return service;
  });
