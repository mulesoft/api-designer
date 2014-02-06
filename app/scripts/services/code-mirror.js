'use strict';

angular.module('codeMirror', ['raml', 'ramlEditorApp', 'codeFolding'])
  .factory('codeMirror', function (
    ramlHint, codeMirrorHighLight, eventService, generateSpaces, generateTabs,
    getFoldRange, isArrayStarter, getSpaceCount, getTabCount, config, extractKeyValue
  ) {
    var editor  = null;
    var service = {
      CodeMirror: CodeMirror
    };

    service.removeTabs = function (line, indentUnit) {
      var spaceCount = getTabCount(getSpaceCount(line), indentUnit) * indentUnit;
      return spaceCount ? line.slice(spaceCount) : line;
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
      var cursor          = cm.getCursor();
      var line            = cm.getLine(cursor.line).slice(0, cursor.ch);
      var indentUnit      = cm.getOption('indentUnit');
      var spaceCount      = line.length - line.trimRight().length;
      var lineEndsWithTab = spaceCount >= indentUnit;

      // delete indentation if there is at least one right before
      // the cursor and number of whitespaces is a multiple of indentUnit
      //
      // we do it for better user experience as if you had 3 whitespaces
      // before cursor and pressed Backspace, you'd expect cursor to stop
      // at second whitespace to continue typing RAML content, otherwise
      // you'd end up at first whitespace and be forced to hit Spacebar
      if (lineEndsWithTab && (spaceCount % indentUnit) === 0) {
        for (var i = 0; i < indentUnit; i++) {
          cm.deleteH(-1, 'char');
        }
        return;
      }

      cm.deleteH(-1, 'char');
    };

    var MODES = {
      xml: { name: 'xml' },
      xsd: { name: 'xml', alignCDATA: true },
      json: { name: 'javascript', json: true },
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

    service.configureEditor = function(editor, extension) {
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

      var cursor          = cm.getCursor();
      var endOfLine       = cursor.ch >= cm.getLine(cursor.line).length - 1;
      var line            = cm.getLine(cursor.line).slice(0, cursor.ch);
      var lineStartsArray = isArrayStarter(line);
      var spaceCount      = getSpaceCount(line);
      var spaces          = generateSpaces(spaceCount);
      var parent          = getParent(cursor.line, spaceCount);
      var traitOrType     = ['traits', 'resourceTypes'].indexOf(parent) !== -1;

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
        })();
      } else {
        if (lineStartsArray) {
          spaces += generateTabs(1);
        }
      }

      cm.replaceSelection('\n' + spaces, 'end', '+input');
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
      cm.setSize('100%', '100%');
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
        CodeMirror.showHint(cm, CodeMirror.hint.raml, {
          ghosting: true
        });
      };

      CodeMirror.commands.toggleTheme = function () {
        eventService.broadcast('event:toggle-theme');
      };

      CodeMirror.defineMode('raml', codeMirrorHighLight.highlight);
      CodeMirror.defineMIME('text/x-raml', 'raml');

      CodeMirror.registerHelper('hint', 'raml', ramlHint.autocompleteHelper);
      CodeMirror.registerHelper('fold', 'indent', getFoldRange);
    })();

    return service;
  });
