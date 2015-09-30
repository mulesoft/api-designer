(function () {
  'use strict';

  angular.module('codeMirror', ['raml', 'ramlEditorApp', 'codeFolding'])
    .factory('codeMirror', function (
      ramlHint, codeMirrorHighLight, generateSpaces, generateTabs,
      getFoldRange, isArrayStarter, getSpaceCount, getTabCount, config, extractKeyValue,
      eventEmitter, getNode, ramlEditorContext
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
        var spaceCount      = line.length - line.replace(/\s+$/, '').length;
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
        'Shift-Ctrl-T': 'toggleTheme',
        'Cmd-P': 'showOmniSearch',
        'Ctrl-Space': 'autocomplete'
      };

      var ramlKeys = {
        'Ctrl-Space': 'autocomplete',
        'Cmd-S': 'save',
        'Ctrl-S': 'save',
        'Shift-Tab': 'indentLess',
        'Shift-Ctrl-T': 'toggleTheme',
        'Cmd-P': 'showOmniSearch'
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

            if (line.replace(/\s+$/, '').slice(-1) === '|') {
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

        service.cm = cm;

        var charWidth   = cm.defaultCharWidth();
        var basePadding = 4;

        cm.on('renderLine', function (cm, line, el) {
          var offset = CodeMirror.countColumn(line.text, null, cm.getOption('tabSize')) * charWidth;

          el.style.textIndent  = '-' + offset + 'px';
          el.style.paddingLeft = (basePadding + offset) + 'px';
        });

        // function readRamlFrament() {
        //   var template  = new RegExp('^\/.*:$');
        //   var node      = getNode(cm);
        //   var raml      = [];
        //   var nodes;

        //   function read(tree, fragments) {
        //     var temp = tree.getChildren();
        //     fragments.push(tree.line);
        //     if (Array.isArray(temp)) {
        //       temp.forEach(function (el) {
        //         read(el, fragments);
        //       });
        //     }
        //   }

        //   function readRamlHeader(cm) {
        //     var temp  = [];
        //     var count = cm.lineCount(), i;

        //     for (i = 0; i < count; i++) {
        //       var line = cm.getLine(i);

        //       if(!template.test(line)) {
        //         temp.push(line);
        //       } else {
        //         break;
        //       }
        //     }

        //     return temp.join('\n');
        //   }

        //   for(;;) {
        //     if (node === null) {
        //       break;
        //     }

        //     if (template.test(node.lineIndent.content)) {
        //       if(node.lineIndent.spaceCount === 0 && node.lineIndent.tabCount === 0) {
        //         nodes = node.getChildren();
        //         break;
        //       }
        //     }

        //     node = node.getParent();
        //   }

        //   if (node) {
        //     raml.push(readRamlHeader(cm));
        //     raml.push(node.line);

        //     nodes.map(function (node) {
        //       read(node, raml);
        //     });

        //     eventEmitter.publish('event:editor:context:raml', raml.join('\n'));
        //   }
        // }

        // function cursorChanged() {
        //   var template  = new RegExp('^\/.*:$');
        //   var node      = getNode(cm);
        //   var resources = [];

        //   for(;;) {
        //     if (node === null) {
        //       break;
        //     }

        //     if (template.test(node.lineIndent.content)) {
        //       resources.push(node.lineIndent.content);

        //       if(node.lineIndent.spaceCount === 0 && node.lineIndent.tabCount === 0) {
        //         break;
        //       }
        //     }

        //     node = node.getParent();
        //   }

        //   // eventEmitter.publish('event:editor:current:tree', resources.reverse());
        // }

        cm.on('cursorActivity', function () {
          eventEmitter.publish('event:editor:context', {
            context: ramlEditorContext.context,
            cursor:  cm.getCursor()
          });
        });

        cm.on('change', function (cm) {
          ramlEditorContext.read(cm.getValue().split('\n'));
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

        function parseLine(line) {
          return isNaN(line) ? 0 : line-1;
        }

        function scrollTo(position) {
          var cm     = window.editor;
          var height = cm.getScrollInfo().clientHeight;
          var coords = cm.charCoords(position, 'local');
          cm.setCursor(position);
          cm.scrollTo(null, (coords.top + coords.bottom - height) / 2);
        }

        eventEmitter.subscribe('event:goToLine', function (search) {
          var position = {line: parseLine(search.line), ch: 0};

          if (search.focus) {
            window.editor.focus();
          }

          scrollTo(position);
        });

        eventEmitter.subscribe('event:goToResource', function (search) {
          var context = ramlEditorContext.context;
          var root    = '/'+search.scope.split('/')[1];
          var startAt = context.metadata[root].startAt;
          var endAt   = context.metadata[root].endAt;
          var line    = 0;
          var cm      = window.editor;

          for(var i = startAt; i <= endAt; i++) {
            var temp = null;

            if (search.text !== search.resource) {
              temp = '';
              var fragments = search.scope.split('/');

              fragments = fragments.slice(1, fragments.length);

              for(var j = 0; j <fragments.length; j++) {
                var resource = search.text+':';
                var el       = fragments[j];

                if(el !== resource) {
                  temp+='/'+el;
                }

                if(el === resource) {
                  temp+='/'+el;
                  break;
                }
              }
            }

            if (context.scopes[i].indexOf(search.text) !== -1) {
              if (temp && context.scopes[i] === temp) {
                line = i;
                break;
              }

              if(temp === null && context.scopes[i] === search.scope) {
                line = i;
                break;
              }
            }
          }

          if (search.focus) {
            cm.focus();
          }

          scrollTo({line: line, ch: 0});
        });

        CodeMirror.commands.save = function () {
          eventEmitter.publish('event:save');
        };

        CodeMirror.commands.autocomplete = function (cm) {
          CodeMirror.showHint(cm, CodeMirror.hint.raml, {
            ghosting: true
          });
        };

        CodeMirror.commands.toggleTheme = function () {
          eventEmitter.publish('event:toggle-theme');
        };

        CodeMirror.commands.showOmniSearch = function () {
          eventEmitter.publish('event:open:omnisearch');
        };

        CodeMirror.defineMode('raml', codeMirrorHighLight.highlight);
        CodeMirror.defineMIME('text/x-raml', 'raml');

        CodeMirror.registerHelper('hint', 'raml', ramlHint.autocompleteHelper);
        CodeMirror.registerHelper('fold', 'indent', getFoldRange);

        // active-line addon
        var WRAP_CLASS = 'CodeMirror-activeline';
        var BACK_CLASS = 'CodeMirror-activeline-background';

        CodeMirror.defineOption('styleActiveLine', false, function(cm, val, old) {
          var prev = old && old !== CodeMirror.Init;
          if (val && !prev) {
            updateActiveLine(cm);
            cm.on('cursorActivity', updateActiveLine);
          } else if (!val && prev) {
            cm.off('cursorActivity', updateActiveLine);
            clearActiveLine(cm);
            delete cm.state.activeLine;
          }
        });

        function clearActiveLine(cm) {
          if ('activeLine' in cm.state) {
            cm.removeLineClass(cm.state.activeLine, 'wrap', WRAP_CLASS);
            cm.removeLineClass(cm.state.activeLine, 'background', BACK_CLASS);
          }
        }

        function updateActiveLine(cm) {
          var line = cm.getLineHandleVisualStart(cm.getCursor().line);
          if (cm.state.activeLine === line) {
            return;
          }
          clearActiveLine(cm);
          cm.addLineClass(line, 'wrap', WRAP_CLASS);
          cm.addLineClass(line, 'background', BACK_CLASS);
          cm.state.activeLine = line;
        }
      })();

      return service;
    })
  ;
})();
